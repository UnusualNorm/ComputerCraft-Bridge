import type { ComputerEvents, RawComputerEventsOverride } from "./events.js";

export type SerializedValue =
  | string
  | number
  | boolean
  | null
  | { [x: string]: SerializedValue }
  | SerializedValue[];

export type SerializedCast =
  | boolean
  | { [x: string]: SerializedCast }
  | SerializedCast[];

export type Callback = (...args: any[]) => any[] | Promise<any[]>;
export type CallbackRegister = (cb: Callback) => number;
export type CallbackGetter = (id: number) => Callback | undefined;

type RawComputerEvents = ComputerEvents & RawComputerEventsOverride;
export type NetworkRequest =
  | ["eval", number, boolean, SerializedValue[], SerializedCast[]]
  | ["callback", "req", number, SerializedValue[], SerializedCast[]]
  | ["callback", "res", number, boolean, SerializedValue[], SerializedCast[]]
  | [
      "event",
      ...NetworkedComputerEvents<keyof RawComputerEvents>,
      SerializedCast[]
    ];

type NetworkedComputerEvents<U extends keyof RawComputerEvents> = [
  U,
  Parameters<RawComputerEvents[U]>
];

export type NetworkResponse =
  | ["eval", number, string, SerializedValue[], SerializedCast[]]
  | ["callback", "req", number, number, SerializedValue[], SerializedCast[]]
  | ["callback", "res", SerializedValue[], SerializedCast[]];

export type EvalCallback = (success: boolean, output: any[]) => void;
