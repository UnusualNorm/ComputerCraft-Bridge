import type { Computer } from "./computer.js";

export async function isLoaded(
  computer: Computer,
  name: string
): Promise<boolean> {
  const out = await computer.eval(
    `if ${name} then return true else return false end`
  );
  return out[1];
}

export class Global {
  readonly computer: Computer;
  readonly name!: string;

  constructor(computer: Computer) {
    this.computer = computer;
    this.loaded = isLoaded(this.computer, this.name);
  }

  loaded: Promise<boolean>;
  isLoaded(): Promise<boolean> {
    this.loaded = isLoaded(this.computer, this.name);
    return this.loaded;
  }
}
