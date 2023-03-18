import type { Coordinates } from "../types/computercraft.js";
import { Global } from "../global.js";

export class GPS extends Global {
  override readonly name = "gps";

  #CHANNEL_GPS = 65534;
  get CHANNEL_GPS(): number {
    return this.#CHANNEL_GPS;
  }

  async get_CHANNEL_GPS(): Promise<number> {
    const out = (await this.computer.get(`gps.CHANNEL_GPS`)) as [number];
    this.#CHANNEL_GPS = out[0];
    return out[0];
  }

  async set_CHANNEL_GPS(channel: number): Promise<void> {
    await this.computer.eval(`gps.CHANNEL_GPS = arg[1]`, channel);
    return;
  }

  async locate(timeout = 2, debug = false): Promise<Coordinates | null> {
    const out = (await this.computer.run(`gps.locate`, timeout, debug)) as
      | [number, number, number]
      | [null];
    return out.length == 1 ? out[0] : out;
  }
}
