export type Whence = "set" | "cur" | "end";

export interface ReadHandle {
  readLine(withTrailing?: boolean): Promise<null | string>;
  readAll(): Promise<null | string>;
  read(count?: number): Promise<string | null>;
  close(): Promise<void>;
}

export interface RawReadHandle {
  readLine(withTrailing?: boolean): Promise<[null | string]>;
  readAll(): Promise<[null | string]>;
  read(count?: number): Promise<[string | null]>;
  close(): Promise<[]>;
}

export interface BinaryReadHandle {
  read(count?: number): Promise<null | number | string>;
  readAll(): Promise<string | null>;
  readLine(withTrailing?: boolean): Promise<string | null>;
  close(): Promise<void>;
  seek(whence?: Whence, offset?: number): Promise<number>;
}

export interface RawBinaryReadHandle {
  read(count?: number): Promise<[null | number | string]>;
  readAll(): Promise<[string | null]>;
  readLine(withTrailing?: boolean): Promise<[string | null]>;
  close(): Promise<[]>;
  seek(whence?: Whence, offset?: number): Promise<[number] | [null, string]>;
}

export interface WriteHandle {
  write(value: string): Promise<void>;
  writeLine(value: string): Promise<void>;
  flush(): Promise<void>;
  close(): Promise<void>;
}

export interface RawWriteHandle {
  write(value: string): Promise<[]>;
  writeLine(value: string): Promise<[]>;
  flush(): Promise<[]>;
  close(): Promise<[]>;
}

export interface BinaryWriteHandle {
  write(arg: number | string): Promise<void>;
  flush(): Promise<void>;
  close(): Promise<void>;
  seek(whence?: Whence, offset?: number): Promise<number>;
}

export interface RawBinaryWriteHandle {
  write(arg: number | string): Promise<[]>;
  flush(): Promise<[]>;
  close(): Promise<[]>;
  seek(whence?: Whence, offset?: number): Promise<[number] | [null, string]>;
}

export type FileAttributes = {
  size: number;
  isDir: boolean;
  isReadOnly: boolean;
  created: number;
  modified: number;
};

export type Handle =
  | ReadHandle
  | WriteHandle
  | BinaryReadHandle
  | BinaryWriteHandle;

export type RawHandle =
  | RawReadHandle
  | RawWriteHandle
  | RawBinaryReadHandle
  | RawBinaryWriteHandle;
