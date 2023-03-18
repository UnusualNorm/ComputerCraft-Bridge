import EventEmitter from "events";
import type { WebSocket } from "ws";
import type { ComputerEvents } from "./types/events.js";
import type {
  Callback,
  EvalCallback,
  NetworkRequest,
  NetworkResponse,
  SerializedValue,
} from "./types/network.js";
import { NetworkSerializer } from "./utils/network.js";

export interface Computer {
  on<U extends keyof ComputerEvents>(
    event: U,
    listener: ComputerEvents[U]
  ): this;

  emit<U extends keyof ComputerEvents>(
    event: U,
    ...args: Parameters<ComputerEvents[U]>
  ): boolean;
}

export class Computer extends EventEmitter {
  readonly _HOST: Promise<string>;
  readonly _CC_DEFAULT_SETTINGS: Promise<string>;

  private socket: WebSocket;
  private serializer: NetworkSerializer;
  constructor(socket: WebSocket) {
    super();
    this.socket = socket;
    this.serializer = new NetworkSerializer(
      (cb) => this.registerCallback(cb),
      (index) =>
        (...args) =>
          new Promise<any[]>((res, rej) => {
            const requestIndex = this.registerCallbackRequest(
              (success, ...args) => {
                if (success) res(args);
                else rej(args[0]);
                this.callbackRequests[requestIndex] = undefined;
              }
            );

            const [out, outCast] = this.serializer.serializeArray(args);
            this.socket.send(
              JSON.stringify([
                "callback",
                "req",
                requestIndex,
                index,
                out,
                outCast,
              ] as NetworkResponse)
            );
          })
    );
    this.callbacks = [];
    this.evals = [];
    this.callbackRequests = [];

    this.socket.on("message", async (rawMessage) => {
      let message: NetworkRequest;
      try {
        message = JSON.parse(rawMessage.toString());
      } catch (e) {
        return;
      }

      switch (message[0]) {
        case "eval": {
          const [, index, success, output, outputCast] = message;
          const args = this.serializer.unserializeArray(output, outputCast);
          const callback = this.evals[index];

          if (callback) {
            callback(success, args);
            this.evals[index] = undefined;
          }
          break;
        }

        case "callback": {
          if (message[1] == "req") {
            const [, , index, arg, argCast] = message;
            const callback = this.callbacks[index];
            if (callback) {
              const args = this.serializer.unserializeArray(arg, argCast);
              const result = await callback(...args);
              const [output, outputMask] =
                this.serializer.serializeArray(result);

              this.socket.send(
                JSON.stringify([
                  "callback",
                  "res",
                  output,
                  outputMask,
                ] as NetworkResponse)
              );
            } else
              this.socket.send(
                JSON.stringify(["callback", "res", [], []] as NetworkResponse)
              );
          } else if (message[1] == "res") {
            const [, , index, success, output, outputCast] = message;
            const callback = this.callbackRequests[index];
            if (callback) {
              const args = this.serializer.unserializeArray(output, outputCast);
              callback(success, ...args);
              this.callbackRequests[index] = undefined;
            }
          }
          break;
        }

        case "event": {
          const event = this.serializer.unserializeArray(
            message[2] as SerializedValue[],
            message[3]
          );

          this.emit(message[1], ...event);
          break;
        }
      }
    });

    this._HOST = this.get("_G._HOST");
    this._CC_DEFAULT_SETTINGS = this.get("_G._CC_DEFAULT_SETTINGS");
  }

  private callbackRequests: (
    | ((success: boolean, ...args: any[]) => void)
    | undefined
  )[];
  private registerCallbackRequest(
    cb: (success: boolean, ...args: any[]) => void
  ) {
    const undefinedI = this.callbackRequests.indexOf(undefined);
    const i = undefinedI < 0 ? this.callbackRequests.length : undefinedI;
    this.callbackRequests[i] = cb;
    return i;
  }

  private callbacks: (Callback | undefined)[];
  private registerCallback(cb: Callback) {
    const undefinedI = this.callbacks.indexOf(undefined);
    const i = undefinedI < 0 ? this.callbacks.length : undefinedI;
    this.callbacks[i] = cb;
    return i;
  }

  private evals: (EvalCallback | undefined)[];
  private registerEval(cb: EvalCallback) {
    const undefinedI = this.evals.indexOf(undefined);
    const i = undefinedI < 0 ? this.evals.length : undefinedI;
    this.evals[i] = cb;
    return i;
  }

  unregisterCallback(cb: Callback) {
    const index = this.callbacks.indexOf(cb);
    if (index < 0) return false;
    this.callbacks[index] = undefined;
    return true;
  }

  eval(code: string, ...arg: any[]) {
    return new Promise<any[]>((resolve, reject) => {
      const [value, cast] = this.serializer.serializeArray(arg);

      const index = this.registerEval((success, output) => {
        if (success) resolve(output);
        else reject(output[0]);
      });

      this.socket.send(
        JSON.stringify(["eval", index, code, value, cast] as NetworkResponse)
      );
    });
  }

  async get(val: string, ...arg: any[]) {
    const out = await this.eval(`return ${val}`, ...arg);
    return out[0];
  }

  async run(func: string, ...arg: any[]) {
    // Maybe I could make this more reliable, but who cares 😎
    return this.eval(`return ${func}(table.unpack(arg))`, ...arg);
  }

  sleep(time: number) {
    return this.run("sleep", time);
  }

  async write(text: string) {
    const out = await this.run("write", text);
    return out[0];
  }

  async print(...arg: any[]) {
    const out = await this.run("print", ...arg);
    return out[0];
  }

  printError(...arg: any[]) {
    return this.run("printError", ...arg);
  }

  async read(
    replaceChar?: string,
    history?: string[],
    completeFn?: (partial: string) => string[] | Promise<string[]>,
    defaultValue?: string
  ) {
    const out = await this.run(
      "read",
      replaceChar,
      history,
      completeFn
        ? async (partial: string) => [await completeFn(partial)]
        : undefined,
      defaultValue
    );
    return out[0];
  }
}
