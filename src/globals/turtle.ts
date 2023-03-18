import type {
  BlockInfo,
  DetailedItemInfo,
  ItemInfo,
  ToolSide,
} from "../types/computercraft.js";
import { Global } from "../global.js";

export class Turtle extends Global {
  override readonly name = "turtle";

  async forward(): Promise<[boolean, string | null]> {
    const out = (await this.computer.run("turtle.forward")) as [
      boolean,
      string | null
    ];
    return out;
  }

  async back(): Promise<[boolean, string | null]> {
    const out = (await this.computer.run("turtle.back")) as [
      boolean,
      string | null
    ];
    return out;
  }

  async up(): Promise<[boolean, string | null]> {
    const out = (await this.computer.run("turtle.up")) as [
      boolean,
      string | null
    ];
    return out;
  }

  async down(): Promise<[boolean, string | null]> {
    const out = (await this.computer.run("turtle.down")) as [
      boolean,
      string | null
    ];
    return out;
  }

  async turnLeft(): Promise<[boolean, string | null]> {
    const out = (await this.computer.run("turtle.turnLeft")) as [
      boolean,
      string | null
    ];
    return out;
  }

  async turnRight(): Promise<[boolean, string | null]> {
    const out = (await this.computer.run("turtle.turnRight")) as [
      boolean,
      string | null
    ];
    return out;
  }

  async dig(side?: ToolSide): Promise<[boolean, string | null]> {
    const out = (await this.computer.run("turtle.dig", side)) as [
      boolean,
      string | null
    ];
    return out;
  }

  async digUp(side?: ToolSide): Promise<[boolean, string | null]> {
    const out = (await this.computer.run("turtle.digUp", side)) as [
      boolean,
      string | null
    ];
    return out;
  }

  async digDown(side?: ToolSide): Promise<[boolean, string | null]> {
    const out = (await this.computer.run("turtle.digDown", side)) as [
      boolean,
      string | null
    ];
    return out;
  }

  async place(text?: string): Promise<[boolean, string | null]> {
    const out = (await this.computer.run("turtle.place", text)) as [
      boolean,
      string | null
    ];
    return out;
  }

  async placeUp(text?: string): Promise<[boolean, string | null]> {
    const out = (await this.computer.run("turtle.placeUp", text)) as [
      boolean,
      string | null
    ];
    return out;
  }

  async placeDown(text?: string): Promise<[boolean, string | null]> {
    const out = (await this.computer.run("turtle.placeDown", text)) as [
      boolean,
      string | null
    ];
    return out;
  }

  async drop(count?: number): Promise<[boolean, string | null]> {
    const out = (await this.computer.run("turtle.drop", count)) as [
      boolean,
      string | null
    ];
    return out;
  }

  async dropUp(count?: number): Promise<[boolean, string | null]> {
    const out = (await this.computer.run("turtle.dropUp", count)) as [
      boolean,
      string | null
    ];
    return out;
  }

  async dropDown(count?: number): Promise<[boolean, string | null]> {
    const out = (await this.computer.run("turtle.dropDown", count)) as [
      boolean,
      string | null
    ];
    return out;
  }

  async select(slot: number): Promise<true> {
    const out = (await this.computer.run("turtle.select", slot)) as [true];
    return out[0];
  }

  async getItemCount(slot?: number): Promise<number> {
    const out = (await this.computer.run("turtle.getItemCount", slot)) as [
      number
    ];
    return out[0];
  }

  async getItemSpace(slot?: number): Promise<number> {
    const out = (await this.computer.run("turtle.getItemSpace", slot)) as [
      number
    ];
    return out[0];
  }

  async detect(): Promise<boolean> {
    const out = (await this.computer.run("turtle.detect")) as [boolean];
    return out[0];
  }

  async detectUp(): Promise<boolean> {
    const out = (await this.computer.run("turtle.detectUp")) as [boolean];
    return out[0];
  }

  async detectDown(): Promise<boolean> {
    const out = (await this.computer.run("turtle.detectDown")) as [boolean];
    return out[0];
  }

  async compare(): Promise<boolean> {
    const out = (await this.computer.run("turtle.compare")) as [boolean];
    return out[0];
  }

  async compareUp(): Promise<boolean> {
    const out = (await this.computer.run("turtle.compareUp")) as [boolean];
    return out[0];
  }

  async compareDown(): Promise<boolean> {
    const out = (await this.computer.run("turtle.compareDown")) as [boolean];
    return out[0];
  }

  async attack(side?: ToolSide): Promise<[boolean, string | null]> {
    const out = (await this.computer.run("turtle.attack", side)) as [
      boolean,
      string | null
    ];
    return out;
  }

  async attackUp(side?: ToolSide): Promise<[boolean, string | null]> {
    const out = (await this.computer.run("turtle.attackUp", side)) as [
      boolean,
      string | null
    ];
    return out;
  }

  async attackDown(side?: ToolSide): Promise<[boolean, string | null]> {
    const out = (await this.computer.run("turtle.attackDown", side)) as [
      boolean,
      string | null
    ];
    return out;
  }

  async suck(count?: number): Promise<[boolean, string | null]> {
    const out = (await this.computer.run("turtle.suck", count)) as [
      boolean,
      string | null
    ];
    return out;
  }

  async suckUp(count?: number): Promise<[boolean, string | null]> {
    const out = (await this.computer.run("turtle.suckUp", count)) as [
      boolean,
      string | null
    ];
    return out;
  }

  async suckDown(count?: number): Promise<[boolean, string | null]> {
    const out = (await this.computer.run("turtle.suckDown", count)) as [
      boolean,
      string | null
    ];
    return out;
  }

  async getFuelLevel(): Promise<number> {
    const out = (await this.computer.run("turtle.getFuelLevel")) as [
      number | "unlimited"
    ];
    return out[0] == "unlimited" ? Infinity : out[0];
  }

  async refuel(count?: number): Promise<[boolean, string | null]> {
    const out = (await this.computer.run("turtle.refuel", count)) as [
      boolean,
      string | null
    ];
    return out;
  }

  async compareTo(slot: number): Promise<boolean> {
    const out = (await this.computer.run("turtle.compareTo", slot)) as [
      boolean
    ];
    return out[0];
  }

  async transferTo(slot: number, count?: number): Promise<boolean> {
    const out = (await this.computer.run("turtle.transferTo", slot, count)) as [
      boolean
    ];
    return out[0];
  }

  async getSelectedSlot(): Promise<number> {
    const out = (await this.computer.run("turtle.getSelectedSlot")) as [number];
    return out[0];
  }

  async getFuelLimit(): Promise<number> {
    const out = (await this.computer.run("turtle.getFuelLimit")) as [number];
    return out[0];
  }

  async equipLeft(): Promise<[boolean, string | null]> {
    const out = (await this.computer.run("turtle.equipLeft")) as [
      boolean,
      string | null
    ];
    return out;
  }

  async equipRight(): Promise<[boolean, string | null]> {
    const out = (await this.computer.run("turtle.equipRight")) as [
      boolean,
      string | null
    ];
    return out;
  }

  async inspect(): Promise<[true, BlockInfo] | [false, string]> {
    const out = (await this.computer.run("turtle.inspect")) as
      | [true, BlockInfo]
      | [false, string];
    return out;
  }

  async inspectUp(): Promise<[true, BlockInfo] | [false, string]> {
    const out = (await this.computer.run("turtle.inspectUp")) as
      | [true, BlockInfo]
      | [false, string];
    return out;
  }

  async inspectDown(): Promise<[true, BlockInfo] | [false, string]> {
    const out = (await this.computer.run("turtle.inspectDown")) as
      | [true, BlockInfo]
      | [false, string];
    return out;
  }

  getItemDetail(slot?: number): Promise<ItemInfo>;
  getItemDetail(slot: number, detailed: true): Promise<DetailedItemInfo>;
  async getItemDetail(
    slot?: number,
    detailed?: boolean
  ): Promise<ItemInfo | DetailedItemInfo> {
    const out = (await this.computer.run(
      "turtle.getItemDetail",
      slot,
      detailed
    )) as [ItemInfo | DetailedItemInfo];
    return out[0];
  }

  async craft(limit = 64): Promise<[boolean, string | null]> {
    const out = (await this.computer.run("turtle.craft", limit)) as [
      boolean,
      string | null
    ];
    return out;
  }
}
