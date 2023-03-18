import type {
  ReadHandle,
  BinaryReadHandle,
  RawReadHandle,
  RawBinaryReadHandle,
} from "./fs.js";

export type Response<U extends ReadHandle | BinaryReadHandle> = U & {
  getResponseCode(): Promise<number>;
  getResponseHeaders(): Promise<Record<string, string>>;
};
export type RawResponse<U extends RawReadHandle | RawBinaryReadHandle> = U & {
  getResponseCode(): Promise<[number, string]>;
  getResponseHeaders(): Promise<[Record<string, string>]>;
};

export interface Websocket {
  receive(timeout?: number): Promise<[string, boolean] | [null]>;
  send(message: any, binary?: boolean): Promise<void>;
  close(): Promise<void>;
}

export interface RawWebsocket {
  receive(timeout?: number): Promise<[string, boolean] | [null]>;
  send(message: any, binary?: boolean): Promise<[]>;
  close(): Promise<[]>;
}

export type Request = {
  url: string;
  headers?: Record<string, string>;
  binary?: boolean;
  method?: string;
  redirect?: boolean;
};

export type PostRequest = Request & {
  body?: string;
};
