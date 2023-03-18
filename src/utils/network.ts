import type {
  CallbackRegister,
  SerializedValue,
  SerializedCast,
  CallbackGetter,
} from "../types/network.js";

export class NetworkSerializer {
  private registerCallback: CallbackRegister;
  private getCallback: CallbackGetter;
  constructor(registerCallback: CallbackRegister, getCallback: CallbackGetter) {
    this.registerCallback = registerCallback;
    this.getCallback = getCallback;
  }

  serializeValue(value: any) {
    let out: SerializedValue = null;
    let cast: SerializedCast = false;

    if (typeof value == "string" || typeof value == "boolean") {
      out = value;
      cast = false;
    } else if (typeof value == "bigint") {
      out = Number(value);
      cast = false;
    } else if (typeof value == "undefined" || value == null) {
      out = null;
      cast = false;
    } else if (typeof value == "object") {
      const [valueOut, valueCast] = Array.isArray(value)
        ? this.serializeArray(value)
        : this.serializeObject(value);

      out = valueOut;
      cast = valueCast;
    } else if (typeof value == "function") {
      out = this.registerCallback(value);
      cast = true;
    }

    return [out, cast] as const;
  }

  serializeObject(obj: { [x: string]: any }) {
    const out: { [x: string]: SerializedValue } = {};
    const cast: { [x: string]: SerializedCast } = {};

    const keys = Object.keys(obj);
    for (const key of keys) {
      const [valueOut, valueCast] = this.serializeValue(obj[key]);
      out[key] = valueOut;
      cast[key] = valueCast;
    }

    return [out, cast] as const;
  }

  serializeArray(array: any[]) {
    const out: SerializedValue[] = [];
    const cast: SerializedCast[] = [];

    for (let i = 0; i < array.length; i++) {
      const [valueOut, valueCast] = this.serializeValue(array[i]);
      out[i] = valueOut;
      cast[i] = valueCast;
    }

    return [out, cast] as const;
  }

  unserializeValue(value: SerializedValue, cast: SerializedCast) {
    let out;

    if (cast == true && typeof value == "number") out = this.getCallback(value);
    else if (
      value != null &&
      typeof value == "object" &&
      typeof cast == "object"
    )
      out =
        Array.isArray(value) && Array.isArray(cast)
          ? this.unserializeArray(value, cast)
          : !Array.isArray(value) && !Array.isArray(cast)
          ? this.unserializeObject(value, cast)
          : value;
    else out = value;

    return out;
  }

  unserializeObject(
    obj: { [x: string]: SerializedValue },
    cast: { [x: string]: SerializedCast }
  ) {
    const out: { [x: string]: any } = {};
    const keys = Object.keys(obj);
    for (const key in keys)
      out[key] = this.unserializeValue(obj[key]!, cast[key] ?? false);
    return out;
  }

  unserializeArray(array: SerializedValue[], cast: SerializedCast[]): any[] {
    return array.map((value, i) =>
      this.unserializeValue(value, cast[i] ?? false)
    );
  }
}
