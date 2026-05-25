import { Context, Effect, Layer } from "effect";
import { JobQueue } from "./JobQueue";
import { JobPubSub } from "./JobPubSub";
import { Job } from "@/types";

export class JobWorker extends Context.Service<JobWorker, null>()(
  "JobWorker",
) {}

export const layer = Layer.effect(
  JobWorker,
  Effect.gen(function* () {
    const queue = yield* JobQueue;
    const pubsub = yield* JobPubSub;
    const worker = Effect.gen(function* () {
      const job = yield* queue.take();
      yield* pubsub.publish(new Job({ ...job, status: "processing" }));
      const delay = (Math.floor(Math.random() * 5) + 1) * 1000;
      yield* Effect.sleep(delay);
      const status = Math.random() > 0.2 ? "completed" : "failed";
      yield* pubsub.publish(new Job({ ...job, status }));
    });

    yield* Effect.forkScoped(Effect.forever(worker));
    return JobWorker.of(null);
  }),
);
