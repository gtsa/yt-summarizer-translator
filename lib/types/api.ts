import { z } from "zod";
import { TranscriptResultSchema } from "./transcript";

export const SummarizeRequestSchema = z.object({
  url: z.string().min(1),
});

export type SummarizeRequest = z.infer<typeof SummarizeRequestSchema>;

export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

export const SummarizeResponseSchema = z.object({
  transcript: TranscriptResultSchema.optional(),
  error: ApiErrorSchema.optional(),
  // keep room for next steps:
  // summary, keyPoints, translationEl, metadata...
});

export type SummarizeResponse = z.infer<typeof SummarizeResponseSchema>;
