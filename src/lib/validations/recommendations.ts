import { z } from "zod";
import { UserRoleSchema } from "./auth";

export const PrioritySchema = z.enum(["critical", "high", "medium", "low"]);
export const RiskTypeSchema = z.enum([
  "flood",
  "drought",
  "disease",
  "agriculture",
  "storm",
  "food",
]);

export const RecommendationsQuerySchema = z.object({
  region: z.string().optional(),
  role: UserRoleSchema.optional(),
  priority: PrioritySchema.optional(),
  risk_type: RiskTypeSchema.optional(),
});

export const TaskToggleSchema = z.object({
  task_text: z.string().min(1, "Task text is required"),
  completed: z.boolean(),
});

export const BriefingGenerateSchema = z.object({
  region: z.string().min(1, "Region is required"),
  role: UserRoleSchema,
  timeframe: z.enum(["24h", "72h", "7d"]).default("24h"),
});

export const ImpactSimulationSchema = z.object({
  delay_hours: z.number().min(0).max(72),
  region: z.string().min(1, "Region is required"),
  hazard_type: RiskTypeSchema.default("flood"),
});

export type RecommendationsQueryInput = z.infer<typeof RecommendationsQuerySchema>;
export type TaskToggleInput = z.infer<typeof TaskToggleSchema>;
export type BriefingGenerateInput = z.infer<typeof BriefingGenerateSchema>;
export type ImpactSimulationInput = z.infer<typeof ImpactSimulationSchema>;
