import { Readable } from "stream";
import type { ReadableStream as WebReadableStream } from "stream/web";

export function webStreamToNodeStream(webStream: WebReadableStream<Uint8Array>): Readable {
    return Readable.from(webStream as any);
  }