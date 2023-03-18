import type {
  RawReadHandle,
  RawWriteHandle,
  RawBinaryReadHandle,
  RawBinaryWriteHandle,
  ReadHandle,
  WriteHandle,
  BinaryReadHandle,
  BinaryWriteHandle,
  FileAttributes,
} from "../types/fs.js";
import { Global } from "../global.js";
import { wrapHandle } from "../utils/fs.js";

export class FS extends Global {
  override readonly name = "fs";

  async isDriveRoot(path: string): Promise<boolean> {
    const out = (await this.computer.run(`fs.isDriveRoot`, path)) as [boolean];
    return out[0];
  }

  async complete(
    path: string,
    location: string,
    include_files?: boolean,
    include_dirs?: boolean
  ): Promise<string[]> {
    const out = (await this.computer.run(
      `fs.complete`,
      path,
      location,
      include_files,
      include_dirs
    )) as [string[] | Record<string, never>];
    return Array.isArray(out[0]) ? out[0] : [];
  }

  async list(path: string): Promise<string[]> {
    const out = (await this.computer.run(`fs.list`, path)) as [
      string[] | Record<string, never>
    ];
    return Array.isArray(out[0]) ? out[0] : [];
  }

  async combine(path: string, ...paths: string[]): Promise<string> {
    const out = (await this.computer.run(`fs.combine`, path, ...paths)) as [
      string
    ];
    return out[0];
  }

  async getName(path: string): Promise<string> {
    const out = (await this.computer.run(`fs.getName`, path)) as [string];
    return out[0];
  }

  async getDir(path: string): Promise<string> {
    const out = (await this.computer.run(`fs.getDir`, path)) as [string];
    return out[0];
  }

  async getSize(path: string): Promise<number> {
    const out = (await this.computer.run(`fs.getSize`, path)) as [number];
    return out[0];
  }

  async exists(path: string): Promise<boolean> {
    const out = (await this.computer.run(`fs.exists`, path)) as [boolean];
    return out[0];
  }

  async isDir(path: string): Promise<boolean> {
    const out = (await this.computer.run(`fs.isDir`, path)) as [boolean];
    return out[0];
  }

  async isReadOnly(path: string): Promise<boolean> {
    const out = (await this.computer.run(`fs.isReadOnly`, path)) as [boolean];
    return out[0];
  }

  async makeDir(path: string): Promise<void> {
    await this.computer.run(`fs.makeDir`, path);
    return;
  }

  async move(path: string, dest: string): Promise<void> {
    await this.computer.run(`fs.move`, path, dest);
    return;
  }

  async copy(path: string, dest: string): Promise<void> {
    await this.computer.run(`fs.copy`, path, dest);
    return;
  }

  async delete(path: string): Promise<void> {
    await this.computer.run(`fs.delete`, path);
    return;
  }

  open(path: string, mode: "r"): Promise<ReadHandle>;
  open(path: string, mode: "rb"): Promise<BinaryReadHandle>;
  open(path: string, mode: "w" | "a"): Promise<WriteHandle>;
  open(path: string, mode: "wb" | "ab"): Promise<BinaryWriteHandle>;
  async open(
    path: string,
    mode: "r" | "rb" | "w" | "wb" | "a" | "ab"
  ): Promise<ReadHandle | WriteHandle | BinaryReadHandle | BinaryWriteHandle> {
    const out = (await this.computer.run(`fs.open`, path, mode)) as [
      | RawReadHandle
      | RawWriteHandle
      | RawBinaryReadHandle
      | RawBinaryWriteHandle
    ];

    return wrapHandle<
      ReadHandle | WriteHandle | BinaryReadHandle | BinaryWriteHandle
    >(out[0]);
  }

  async getDrive(path: string): Promise<string> {
    const out = (await this.computer.run(`fs.getDrive`, path)) as [string];
    return out[0];
  }

  async getFreeSpace(path: string): Promise<number | "unlimited"> {
    const out = (await this.computer.run(`fs.getFreeSpace`, path)) as [
      number | "unlimited"
    ];
    return out[0];
  }

  async find(path: string): Promise<string[]> {
    const out = (await this.computer.run(`fs.find`, path)) as [
      string[] | Record<string, never>
    ];
    return Array.isArray(out[0]) ? out[0] : [];
  }

  async getCapacity(path: string): Promise<number | null> {
    const out = (await this.computer.run(`fs.getCapacity`, path)) as [
      number | null
    ];
    return out[0];
  }

  async attributes(path: string): Promise<FileAttributes> {
    const out = (await this.computer.run(`fs.attributes`, path)) as [
      FileAttributes
    ];
    return out[0];
  }
}
