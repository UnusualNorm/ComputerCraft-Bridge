import { Global } from "../global.js";

export class Help extends Global {
  override readonly name = "help";

  async path(): Promise<string> {
    const out = (await this.computer.get(`help.path`)) as [string];
    return out[0];
  }

  async setPath(newPath: string): Promise<void> {
    await this.computer.run(`help.setPath`, newPath);
    return;
  }

  async lookup(topic: string): Promise<string | null> {
    const out = (await this.computer.run(`help.lookup`, topic)) as [
      string | null
    ];
    return out[0];
  }

  async topics(): Promise<string[]> {
    const out = (await this.computer.run(`help.topics`)) as [
      string[] | Record<string, never>
    ];
    return Array.isArray(out[0]) ? out[0] : [];
  }

  async completeTopic(topic: string): Promise<string[]> {
    const out = (await this.computer.run(`help.completeTopic`, topic)) as [
      string[] | Record<string, never>
    ];
    return Array.isArray(out[0]) ? out[0] : [];
  }
}
