import { Schema } from "effect";

export const Type = Schema.Literals([
  "resize-image",
  "send-email",
  "generate-report",
]);

export type Type = typeof Type.Type;

export class Job extends Schema.Class<Job>("Job")({
  id: Schema.String,
  type: Type,
  status: Schema.Literals(["queued", "processing", "completed", "failed"]),
  createdAt: Schema.Date,
}) {}
