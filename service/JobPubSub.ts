import { Job } from "@/types";
import { Context, Effect, Layer, PubSub, Queue, Scope } from "effect";

interface JobPubSubInterface {
  publish: (job: Job) => Effect.Effect<boolean>;
  subscribe: () => Effect.Effect<PubSub.Subscription<Job>, never, Scope.Scope>;
}

export class JobPubSub extends Context.Service<JobPubSub, JobPubSubInterface>()(
  "JobPubSub",
) {}

export const layer = Layer.effect(
  JobPubSub,
  Effect.gen(function* () {
    const pubsub = yield* PubSub.unbounded<Job>();

    const publish = (job: Job) => PubSub.publish(pubsub, job);
    const subscribe = () =>
      Effect.gen(function* () {
        return yield* PubSub.subscribe(pubsub);
      });

    return JobPubSub.of({ publish, subscribe });
  }),
);
