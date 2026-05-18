import { Schema } from "effect";

export class Job extends Schema.Class<Job>("Job")({
  id: Schema.String,
  type: Schema.Literals(["resize-image", "send-email", "generate-report"]),
  status: Schema.Literals(["queued", "processing", "completed", "failed"]),
  createdAt: Schema.Date,
}) {}
