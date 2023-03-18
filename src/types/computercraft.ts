export type RGB = [number, number, number];
export type Coordinates = [number, number, number];
export type BlockInfo = {
  name: string;
  state: Record<string, string>;
  tags: Record<string, boolean>;
};
export type Side = "top" | "bottom" | "left" | "right" | "front" | "back";
export type ToolSide = "left" | "right";
export type ItemInfo = {
  name: string;
  count: number;
  nbt: string | null;
};
export type DetailedItemInfo = ItemInfo & {
  displayName: string;
  itemGroups: string[];
  damage: number;
  maxDamage: number;
  durability: number;
};
