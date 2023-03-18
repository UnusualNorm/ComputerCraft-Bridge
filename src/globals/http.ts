import type {
  Response,
  RawResponse,
  RawWebsocket,
  Websocket,
  PostRequest,
  Request,
} from "../types/http.js";
import { Global } from "../global.js";
import type {
  ReadHandle,
  BinaryReadHandle,
  RawReadHandle,
  RawBinaryReadHandle,
} from "../types/fs.js";
import { wrapResponse, wrapWebsocket } from "../utils/http.js";

export class HTTP extends Global {
  override readonly name = "http";

  request(request: PostRequest): Promise<void>;
  request(
    url: string,
    body?: string,
    headers?: Record<string, string>,
    binary?: boolean
  ): Promise<void>;

  async request(
    url: string | PostRequest,
    body?: string,
    headers?: Record<string, string>,
    binary?: boolean
  ): Promise<void> {
    await this.computer.run(`http.request`, url, body, headers, binary);
    return;
  }

  get(
    request: string,
    headers?: Record<string, string>,
    binary?: false
  ): Promise<Response<ReadHandle>>;
  get(
    request: string,
    headers: Record<string, string> | undefined,
    binary: true
  ): Promise<Response<BinaryReadHandle>>;
  get(
    request: Request & {
      binary?: false;
    }
  ): Promise<Response<ReadHandle>>;
  get(
    request: Request & {
      binary: true;
    }
  ): Promise<Response<BinaryReadHandle>>;

  async get(
    request: string | Request,
    headers?: Record<string, string>,
    binary?: boolean
  ): Promise<Response<ReadHandle | BinaryReadHandle>> {
    const out = (await this.computer.run(
      `http.get`,
      request,
      headers,
      binary
    )) as [RawResponse<RawReadHandle | RawBinaryReadHandle>];
    return wrapResponse<Response<ReadHandle | BinaryReadHandle>>(out[0]);
  }

  post(
    request: string,
    body: string,
    headers?: Record<string, string>,
    binary?: false
  ): Promise<Response<ReadHandle>>;
  post(
    request: string,
    body: string,
    headers: Record<string, string> | undefined,
    binary: true
  ): Promise<Response<BinaryReadHandle>>;
  post(
    request: PostRequest & {
      binary?: false;
    }
  ): Promise<Response<ReadHandle>>;
  post(
    request: PostRequest & {
      binary: true;
    }
  ): Promise<Response<BinaryReadHandle>>;

  async post(
    request: string | PostRequest,
    body?: string,
    headers?: Record<string, string>,
    binary?: boolean
  ): Promise<Response<ReadHandle | BinaryReadHandle>> {
    const out = (await this.computer.run(
      `http.post`,
      request,
      body,
      headers,
      binary
    )) as [RawResponse<RawReadHandle | RawBinaryReadHandle>];
    return wrapResponse<Response<ReadHandle | BinaryReadHandle>>(out[0]);
  }

  async checkURLAsync(url: string): Promise<[boolean, string?]> {
    const out = (await this.computer.run(`http.checkURLAsync`, url)) as
      | [true]
      | [false, string];
    return out;
  }

  async checkURL(url: string): Promise<[boolean, string?]> {
    const out = (await this.computer.run(`http.checkURL`, url)) as
      | [true]
      | [false, string];
    return out;
  }

  async websocket(
    url: string,
    headers?: Record<string, string>
  ): Promise<Websocket> {
    const out = (await this.computer.run(`http.websocket`, url, headers)) as [
      RawWebsocket
    ];
    return wrapWebsocket(out[0]);
  }

  async websocketAsync(
    url: string,
    headers?: Record<string, string>
  ): Promise<void> {
    await this.computer.run(`http.websocketAsync`, url, headers);
    return;
  }
}
