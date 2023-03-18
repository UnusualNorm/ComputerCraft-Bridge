import type {
  ReadHandle,
  BinaryReadHandle,
  RawReadHandle,
  RawBinaryReadHandle,
} from "../types/fs.js";
import type {
  Response,
  RawResponse,
  RawWebsocket,
  Websocket,
} from "../types/http.js";
import { wrapHandle } from "./fs.js";

export function wrapResponse<U extends Response<ReadHandle | BinaryReadHandle>>(
  rawHandle: RawResponse<RawReadHandle | RawBinaryReadHandle>
): U {
  return {
    ...wrapHandle<U>(rawHandle),
    getResponseCode: () => rawHandle.getResponseCode(),
    getResponseHeaders: async () => (await rawHandle.getResponseHeaders())[0],
  } as U;
}

export function wrapWebsocket(rawWebsocket: RawWebsocket): Websocket {
  return {
    receive: (timeout?: number) => rawWebsocket.receive(timeout),
    send: async (message: any, binary?: boolean) => {
      await rawWebsocket.send(message, binary);
    },
    close: async () => {
      await rawWebsocket.close();
    },
  };
}
