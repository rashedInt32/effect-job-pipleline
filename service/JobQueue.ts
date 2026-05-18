import { Job } from "@/types";
import { Context, Effect, Layer, Queue } from "effect";

interface Interface {
  offer: (job: Job) => Effect.Effect<boolean>;
  take: () => Effect.Effect<Job>;
}

export class JobQueue extends Context.Service<JobQueue, Interface>()(
  "JobQueue",
) {}

export const layer = Layer.effect(JobQueue)(
  Effect.gen(function* () {
    const queue = yield* Queue.unbounded<Job>();
    const offer = (job: Job) => Queue.offer(queue, job);
    const take = () => Queue.take(queue);

    return JobQueue.of({ offer, take });
  }),
);
