import type { Side } from "./computercraft.js";
import type { BinaryReadHandle, RawBinaryReadHandle } from "./fs.js";

interface RawTransferredFile extends RawBinaryReadHandle {
  getName(): Promise<[string]>;
}

interface TransferredFile extends BinaryReadHandle {
  getName(): Promise<string>;
}

interface RawTransferredFiles {
  getFiles(): Promise<[RawTransferredFile[] | Record<string, never>]>;
}

interface TransferredFiles {
  getFiles(): Promise<TransferredFile[]>;
}

export interface RawComputerEventsOverride {
  file_transfer: (files: RawTransferredFiles) => void;
}

export interface ComputerEvents {
  alarm: (id: number) => void;
  char: (character: string) => void;
  computer_command: (...arg: string[]) => void;
  disk: (side: Side | string) => void;
  disk_eject: (side: Side | string) => void;
  file_transfer: (files: TransferredFiles) => void;
  key: (key: number, held: boolean) => void;
  redstone: () => void;
}
