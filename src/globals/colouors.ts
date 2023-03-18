import type { RGB } from "../types/computercraft.js";
import { Global } from "../global.js";

export class Colouors extends Global {
  readonly white = 0x1;
  readonly orange = 0x2;
  readonly magenta = 0x4;
  readonly lightBlue = 0x8;
  readonly yellow = 0x10;
  readonly lime = 0x20;
  readonly pink = 0x40;

  //-------------------------------------------------------------------
  //---- GRAY/GREY NOT DEFINED HERE, PLEASE SEE COLOR/COLOUR GLOBALS ----
  //-------------------------------------------------------------------

  readonly cyan = 0x200;
  readonly purple = 0x400;
  readonly blue = 0x800;
  readonly brown = 0x1000;
  readonly green = 0x2000;
  readonly red = 0x4000;
  readonly black = 0x8000;

  async combine(...arg: number[]): Promise<number> {
    const out = (await this.computer.run(`colors.combine`, ...arg)) as [number];
    return out[0];
  }

  async subtract(colors: number, ...arg: number[]): Promise<number> {
    const out = (await this.computer.run(
      `colors.subtract`,
      colors,
      ...arg
    )) as [number];
    return out[0];
  }

  async test(colors: number, color: number): Promise<boolean> {
    const out = (await this.computer.run(`colors.test`, colors, color)) as [
      boolean
    ];
    return out[0];
  }

  async packRGB(r: number, g: number, b: number): Promise<number> {
    const out = (await this.computer.run(`colors.packRGB`, r, g, b)) as [
      number
    ];
    return out[0];
  }

  async unpackRGB(rgb: number): Promise<RGB> {
    const out = (await this.computer.run(`colors.unpackRGB`, rgb)) as RGB;
    return out;
  }

  async toBlit(color: number): Promise<string> {
    const out = (await this.computer.run(`colors.toBlit`, color)) as [string];
    return out[0];
  }
}
