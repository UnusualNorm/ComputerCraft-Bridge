import type { Side } from "../types/computercraft.js";
import { Global } from "../global.js";

export class Disk extends Global {
  override readonly name = "disk";

  async isPresent(name: Side): Promise<boolean> {
    const out = (await this.computer.run(`disk.isPresent`, name)) as [boolean];
    return out[0];
  }

  async getLabel(name: Side): Promise<string | null> {
    const out = (await this.computer.run(`disk.getLabel`, name)) as [
      string | null
    ];
    return out[0];
  }

  async setLabel(name: Side, label: string | null): Promise<void> {
    await this.computer.run(`disk.setLabel`, name, label);
    return;
  }

  async hasData(name: Side): Promise<boolean> {
    const out = (await this.computer.run(`disk.hasData`, name)) as [boolean];
    return out[0];
  }

  async getMountPath(name: Side): Promise<string | null> {
    const out = (await this.computer.run(`disk.getMountPath`, name)) as [
      string | null
    ];
    return out[0];
  }

  async hasAudio(name: Side): Promise<boolean> {
    const out = (await this.computer.run(`disk.hasAudio`, name)) as [boolean];
    return out[0];
  }

  async getAudioTitle(name: Side): Promise<string | boolean | null> {
    const out = (await this.computer.run(`disk.getAudioTitle`, name)) as [
      string | boolean | null
    ];
    return out[0];
  }

  async playAudio(name: Side): Promise<void> {
    await this.computer.run(`disk.playAudio`, name);
    return;
  }

  async stopAudio(name: Side): Promise<void> {
    await this.computer.run(`disk.stopAudio`, name);
    return;
  }

  async eject(name: Side): Promise<void> {
    await this.computer.run(`disk.eject`, name);
    return;
  }

  async getID(name: Side): Promise<string | null> {
    const out = (await this.computer.run(`disk.getID`, name)) as [
      string | null
    ];
    return out[0];
  }
}
