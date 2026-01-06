import { z } from "zod";

export const TranscriptResultSchema = z.object({
  text: z.string().min(1),
  language: z.string().optional(), // best-effort
  durationSeconds: z.number().positive().optional(), // best-effort
});

export type TranscriptResult = z.infer<typeof TranscriptResultSchema>;
