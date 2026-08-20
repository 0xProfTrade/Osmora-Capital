import { z } from "zod";
import {
  createContactInquiry,
} from "./db";
import { createSupabaseProposal } from "./supabase";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

const sectorSchema = z.enum([
  "Artificial Intelligence",
  "Biotech",
  "Space Exploration",
  "Renewable Energy",
  "Blockchain & Crypto",
  "Other",
]);

export const appRouter = router({
  system: systemRouter,
  intake: router({
    submitProposal: publicProcedure
      .input(z.object({
        name: z.string().trim().min(2).max(160),
        firm: z.string().trim().min(2).max(180),
        sector: sectorSchema,
        stage: z.string().trim().min(2).max(80),
        description: z.string().trim().min(30).max(10000),
        email: z.string().trim().email().max(320),
        phone: z.string().trim().min(7).max(40),
        consent: z.literal(true),
      }))
      .mutation(async ({ input }) => createSupabaseProposal({
        name: input.name,
        company: input.firm,
        sector: input.sector,
        stage: input.stage,
        pitch: input.description,
        email: input.email,
        phone: input.phone,
      }).then(() => ({ success: true } as const))),
    submitContact: publicProcedure
      .input(z.object({
        name: z.string().trim().min(2).max(160),
        companyProject: z.string().trim().max(180).optional(),
        sector: sectorSchema.optional(),
        email: z.string().trim().email().max(320),
        message: z.string().trim().min(20).max(10000),
        consent: z.literal(true),
      }))
      .mutation(async ({ input }) => createContactInquiry({
        name: input.name,
        companyProject: input.companyProject || null,
        sector: input.sector ?? null,
        email: input.email,
        message: input.message,
      })),
  }),
});

export type AppRouter = typeof appRouter;
