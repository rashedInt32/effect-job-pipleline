import { layer as workerLayer } from "@/service/JobWorker";
import { layer as pubsubLayer } from "@/service/JobPubSub";
import { layer as queueLayer } from "@/service/JobQueue";

import { Layer, ManagedRuntime } from "effect";
const AppLayer = workerLayer.pipe(
  Layer.provideMerge(Layer.mergeAll(pubsubLayer, queueLayer)),
);

const g = globalThis as unknown as {
  __jobRuntime?: ManagedRuntime.ManagedRuntime<any, any>;
};
export const runtime = (g.__jobRuntime ??= ManagedRuntime.make(AppLayer));
