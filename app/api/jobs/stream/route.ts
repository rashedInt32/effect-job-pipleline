import { runtime } from "@/lib/runtime";
import { JobPubSub } from "@/service/JobPubSub";
import { Effect, Stream } from "effect";

const sseStream = Stream.unwrap(
  Effect.gen(function* () {
    const pubsub = yield* JobPubSub;
    const sub = yield* pubsub.subscribe();
    return Stream.fromSubscription(sub);
  }),
).pipe(
  Stream.map((job) => `data: ${JSON.stringify(job)}\n\n`),
  Stream.map((s) => new TextEncoder().encode(s)),
);

export async function GET() {
  const ctx = await runtime.context();
  const readable = Stream.toReadableStreamWith(sseStream, ctx);

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
