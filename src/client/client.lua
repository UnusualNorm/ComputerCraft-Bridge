local function isArray(value)
    return type(value) == "table" and next(value) ~= nil
end

local function objectKeys(obj)
    local result = {}
    local len = 0
    for key in pairs(obj) do
        len = len + 1
        result[len] = key
    end
    return result
end

local function arrayMap(array, callbackfn)
    local result = {}
    for i = 1, #array do
        result[i] = callbackfn(array[i], i - 1, array)
    end
    return result
end

local socket
local callbacks = {}
local events = {}
local collectEvents = true
local runningCallback = false

local function safePullEvent(eventName, ...)
    while true do
        local arg = { table.unpack(arg) }
        local event = { os.pullEventRaw() }
        local newEventName = table.remove(event, 1)
        if newEventName == eventName then
            local incorrect = false
            for i, value in ipairs(arg) do
                if not event[i] == value then
                    incorrect = true
                end
            end

            if not incorrect then
                return { newEventName, table.unpack(event) }
            else
                table.insert(events, event)
            end
        else
            table.insert(events, event)
        end
    end
end

local function createRemoteCallback(index)
    return function(...)
        collectEvents = false
        if runningCallback then
            os.pullEvent("remotecallback_resume")
        end
        runningCallback = true

        local arg = { table.unpack(arg) }
        local requestArg, requestCast = SerializeArray(arg)
        socket.send(
            textutils.serialiseJSON({
                'callback',
                'req',
                index,
                requestArg,
                requestCast,
            })
        )

        local responded = false
        local response = {}
        repeat
            local event = safePullEvent("websocket_message", ConnectionUrl)
            local eventType, subcommand, data, dataCast =
                table.unpack(textutils.unserializeJSON(event[3]))

            if eventType == 'callback' and subcommand == 'res' then
                response = UnserializeArray(data, dataCast)
                responded = true
            else
                table.insert(events, event)
            end
        until responded

        runningCallback = false;
        collectEvents = true
        os.queueEvent("remotecallback_resume")
        os.queueEvent('eventcollector_resume')
        return table.unpack(response)
    end
end

local function eval(code, arg, cast)
    local globalNames = {}
    setmetatable(globalNames, { __index = _G })
    local pcallArg = UnserializeArray(arg, cast)
    globalNames.arg = pcallArg
    local fn, fnErr = load(code, nil, 't', globalNames)

    if fn then
        local rawOutput = { pcall(fn) }
        local success = table.remove(rawOutput, 1)
        local output, outputCast = SerializeArray(rawOutput)

        if success then
            return true, output, outputCast
        else
            local pcallErr = rawOutput[1]
            return false, { pcallErr }, { false }
        end
    else
        return false, { fnErr }, { false }
    end
end

local function eventCollector()
    while true do
        if collectEvents then
            local event = { os.pullEventRaw() }
            if not collectEvents then
                os.queueEvent(table.unpack(event))
            else
                table.insert(events, event)
            end
        else
            os.pullEvent('eventcollector_resume')
        end
    end
end

function RegisterCallback(cb)
    local i = #callbacks
    callbacks[i + 1] = cb
    return i + 1
end

function SerializeValue(value)
    local out = nil
    local cast = false
    if type(value) == "string"
        or type(value) == "boolean"
        or type(value) == "number"
        or type(value) == 'nil' then
        out = value
        cast = false
    elseif type(value) == "table" then
        if isArray(value) then
            out, cast = SerializeArray(value)
        else
            out, cast = SerializeObject(value)
        end
    elseif type(value) == "function" then
        out = RegisterCallback(value)
        cast = true
    end
    return out, cast
end

function SerializeObject(obj)
    local out = {}
    local cast = {}
    local keys = objectKeys(obj)
    for _, key in ipairs(keys) do
        local valueOut, valueCast = SerializeValue(obj[key])
        out[key] = valueOut
        cast[key] = valueCast
    end
    return out, cast
end

function SerializeArray(array)
    local out = {}
    local cast = {}
    do
        local i = 0
        while i < #array do
            local valueOut, valueCast = SerializeValue(array[i + 1])
            out[i + 1] = valueOut
            cast[i + 1] = valueCast
            i = i + 1
        end
    end

    if next(out) == nil then
        out = textutils.empty_json_array
        cast = textutils.empty_json_array
    end

    return out, cast
end

function UnserializeValue(value, cast)
    local out
    if cast == true and type(value) == "number" then
        out = createRemoteCallback(value)
    elseif value ~= nil and type(value) == "table" and type(cast) == "table" then
        local temp1
        if isArray(value) and isArray(cast) then
            temp1 = UnserializeArray(value, cast)
        else
            local temp0
            if not isArray(value) and not isArray(cast) then
                temp0 = UnserializeObject(value, cast)
            else
                temp0 = value
            end
            temp1 = temp0
        end
        out = temp1
    else
        out = value
    end
    return out
end

function UnserializeObject(obj, cast)
    local out = {}
    local keys = objectKeys(obj)
    for key in pairs(keys) do
        local objValue = obj[key]
        local castValue = cast[key]
        if castValue == nil then
            castValue = false
        end
        out[key] = UnserializeValue(objValue, castValue)
    end
    return out
end

function UnserializeArray(array, cast)
    return arrayMap(
        array,
        function(value, i)
            local castIndex = cast[i + 1]
            if castIndex == nil then
                castIndex = false
            end
            return UnserializeValue(value, castIndex)
        end
    )
end

write('Connecting to ' .. ConnectionUrl .. '... ')
socket = http.websocket(ConnectionUrl)
if not socket then
    print('Failed.')
    shell.exit()
else
    print('Success.')
end

while true do
    local event
    if events[1] then
        event = table.remove(events, 1)
    else
        event = { os.pullEventRaw() }
    end

    local eventName = table.remove(event, 1)
    if eventName == 'websocket_message' and event[1] == ConnectionUrl then
        local message = textutils.unserializeJSON(event[2])
        local requestType = table.remove(message, 1)

        if requestType == 'eval' then
            parallel.waitForAny(function()
                local index, code, arg, mask = table.unpack(message)
                local success, output, outputCast = eval(code, arg, mask)

                socket.send(
                    textutils.serialiseJSON({
                        'eval',
                        index,
                        success,
                        output,
                        outputCast,
                    })
                )
            end, eventCollector)
        elseif requestType == 'callback' then
            local subcommand = table.remove(message, 1)
            if subcommand == 'req' then
                local index, id, rawArgs, cast = table.unpack(message)
                local callback = callbacks[id]
                local callbackArg = UnserializeArray(rawArgs, cast)
                parallel.waitForAny(function()
                    local rawOutput = { pcall(callback, table.unpack(callbackArg)) }
                    local success = table.remove(rawOutput, 1)
                    local output, outputCast = SerializeArray(rawOutput)

                    if not success then
                        local pcallErr = rawOutput[1]
                        output = { pcallErr }
                        outputCast = { false }
                    end

                    socket.send(
                        textutils.serialiseJSON({
                            'callback',
                            'res',
                            index,
                            success,
                            output,
                            outputCast
                        })
                    )
                end, eventCollector)
            end
        elseif requestType == 'close' then
            socket.close()
            break
        end
    else
        local output, outputMask = SerializeArray(event)
        socket.send(
            textutils.serialiseJSON({ 'event', eventName, output, outputMask })
        )
    end
end
