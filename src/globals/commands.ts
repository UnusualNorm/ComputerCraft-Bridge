import type { BlockInfo, Coordinates } from "../types/computercraft.js";
import { Global } from "../global.js";

// TODO: Find a way to wrap the generated wrappers...
export class Commands extends Global {
  override readonly name = "commands";

  async exec(command: string): Promise<[boolean, string[], number | null]> {
    const out = (await this.computer.run(`commands.exec`, command)) as [
      boolean,
      string[],
      number | null
    ];
    return out;
  }

  async execAsync(command: string): Promise<number> {
    const out = (await this.computer.run(`commands.execAsync`, command)) as [
      number
    ];
    return out[0];
  }

  async list(...arg: string[]): Promise<string[]> {
    const out = (await this.computer.eval(`commands.list`, ...arg)) as [
      string[] | Record<string, never>
    ];
    return Array.isArray(out[0]) ? out[0] : [];
  }

  async getBlockPosition(): Promise<Coordinates> {
    const out = (await this.computer.run(
      "commands.getBlockPosition"
    )) as Coordinates;
    return out;
  }

  async getBlockInfos(
    minX: number,
    minY: number,
    minZ: number,
    maxX: number,
    maxY: number,
    maxZ: number,
    dimension?: string
  ): Promise<BlockInfo[]> {
    const out = (await this.computer.run(
      `commands.getBlockInfos`,
      minX,
      minY,
      minZ,
      maxX,
      maxY,
      maxZ,
      dimension
    )) as [BlockInfo[] | Record<string, never>];
    return Array.isArray(out[0]) ? out[0] : [];
  }

  async getBlockInfo(
    x: number,
    y: number,
    z: number,
    dimension?: string
  ): Promise<BlockInfo> {
    const out = (await this.computer.run(
      `commands.getBlockInfo`,
      x,
      y,
      z,
      dimension
    )) as [BlockInfo];
    return out[0];
  }
}
