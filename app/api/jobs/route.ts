import { runtime } from "@/lib/runtime";
import { JobPubSub } from "@/service/JobPubSub";
import { JobQueue } from "@/service/JobQueue";
import { Job, Type } from "@/types";

import { Effect } from "effect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const program = Effect.gen(function* () {
    const jobPubSub = yield* JobPubSub;
    const jobQueue = yield* JobQueue;
    const job = new Job({
      id: crypto.randomUUID(),
      type: body.type as Type,
      status: "queued",
      createdAt: new Date(),
    });
    yield* jobPubSub.publish(job);
    yield* jobQueue.offer(job);
    return job;
  });
  const job = await runtime.runPromise(program);
  return NextResponse.json(job);
}
