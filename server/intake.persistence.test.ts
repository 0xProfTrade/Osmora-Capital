import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

vi.mock("./db", () => ({
  createContactInquiry: vi.fn().mockResolvedValue({ success: true }),
  listContactInquiries: vi.fn(),
  listProposals: vi.fn(),
}));

vi.mock("./supabase", () => ({
  createSupabaseProposal: vi.fn().mockResolvedValue({ id: 1 }),
}));

import { createContactInquiry } from "./db";
import { appRouter } from "./routers";
import { createSupabaseProposal } from "./supabase";

const publicContext: TrpcContext = {
  user: null,
  req: {} as TrpcContext["req"],
  res: {} as TrpcContext["res"],
};

describe("intake persistence", () => {
  beforeEach(() => vi.clearAllMocks());

  it("stores a validated proposal through the private proposal writer", async () => {
    const caller = appRouter.createCaller(publicContext);
    await expect(caller.intake.submitProposal({
      name: "Ari Rahman",
      firm: "Meridian Systems",
      sector: "Artificial Intelligence",
      stage: "Seed",
      description: "A sufficiently detailed summary of the company, its traction, and its frontier-market opportunity.",
      email: "ari@meridian.example",
      phone: "+62 812 0000 0000",
      consent: true,
    })).resolves.toEqual({ success: true });
    expect(createSupabaseProposal).toHaveBeenCalledWith(expect.objectContaining({
      name: "Ari Rahman",
      company: "Meridian Systems",
      sector: "Artificial Intelligence",
      stage: "Seed",
      email: "ari@meridian.example",
      phone: "+62 812 0000 0000",
    }));
  });

  it("stores a validated inquiry through the private inquiry writer", async () => {
    const caller = appRouter.createCaller(publicContext);
    await expect(caller.intake.submitContact({
      name: "Maya Putri",
      companyProject: "Kinetic Storage",
      sector: "Renewable Energy",
      email: "maya@kinetic.example",
      message: "We would like to discuss a potential relationship around long-duration energy storage.",
      consent: true,
    })).resolves.toEqual({ success: true });
    expect(createContactInquiry).toHaveBeenCalledWith(expect.objectContaining({
      name: "Maya Putri",
      companyProject: "Kinetic Storage",
      sector: "Renewable Energy",
      email: "maya@kinetic.example",
    }));
  });

  it("refuses intake without explicit consent", async () => {
    const caller = appRouter.createCaller(publicContext);
    await expect(caller.intake.submitContact({
      name: "Maya Putri",
      email: "maya@kinetic.example",
      message: "This message is long enough to satisfy the required contact form validation.",
      consent: false as never,
    })).rejects.toBeDefined();
    expect(createContactInquiry).not.toHaveBeenCalled();
  });

  it("rejects invalid email addresses and messages that are too short", async () => {
    const caller = appRouter.createCaller(publicContext);
    await expect(caller.intake.submitContact({
      name: "Maya Putri",
      email: "not-an-email",
      message: "A long enough inquiry to isolate email validation from message validation.",
      consent: true,
    })).rejects.toBeDefined();
    await expect(caller.intake.submitContact({
      name: "Maya Putri",
      email: "maya@kinetic.example",
      message: "Too short",
      consent: true,
    })).rejects.toBeDefined();
    expect(createContactInquiry).not.toHaveBeenCalled();
  });

  it("rejects proposals missing required fields or an adequate deal description", async () => {
    const caller = appRouter.createCaller(publicContext);
    await expect(caller.intake.submitProposal({
      name: "Ari Rahman",
      firm: "",
      sector: "Artificial Intelligence",
      stage: "Seed",
      description: "A sufficiently detailed description which isolates the missing firm validation.",
      email: "ari@meridian.example",
      phone: "+62 812 0000 0000",
      consent: true,
    })).rejects.toBeDefined();
    await expect(caller.intake.submitProposal({
      name: "Ari Rahman",
      firm: "Meridian Systems",
      sector: "Artificial Intelligence",
      stage: "Seed",
      description: "Too short",
      email: "ari@meridian.example",
      phone: "+62 812 0000 0000",
      consent: true,
    })).rejects.toBeDefined();
    expect(createSupabaseProposal).not.toHaveBeenCalled();
  });
});
