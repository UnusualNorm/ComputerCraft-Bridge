import type { Handle, RawHandle, Whence } from "../types/fs.js";

export function wrapHandle<U extends Handle>(rawHandle: RawHandle): U {
  return {
    close: async () => {
      await rawHandle.close();
    },
    flush:
      "flush" in rawHandle
        ? async () => {
            await rawHandle.flush();
          }
        : undefined,
    read:
      "read" in rawHandle
        ? async (count?: number) => (await rawHandle.read(count))[0]
        : undefined,
    readAll:
      "readAll" in rawHandle
        ? async () => (await rawHandle.readAll())[0]
        : undefined,
    readLine:
      "readLine" in rawHandle
        ? async (withTrailing?: boolean) =>
            (await rawHandle.readLine(withTrailing))[0]
        : undefined,
    seek:
      "seek" in rawHandle
        ? async (whence?: Whence, offset?: number) =>
            (await rawHandle.seek(whence, offset))[0]
        : undefined,
    write:
      "write" in rawHandle
        ? async (value: string) => {
            await rawHandle.write(value);
          }
        : undefined,
    writeLine:
      "writeLine" in rawHandle
        ? async (value: string) => {
            await rawHandle.writeLine(value);
          }
        : undefined,
  } as unknown as U;
}
