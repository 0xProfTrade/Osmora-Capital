import { describe, expect, it } from "vitest";
import { createSupabaseProposal, deleteSupabaseProposal } from "./supabase";

describe("Supabase proposal persistence", () => {
  it("writes a proposal to Supabase and removes the temporary verification record", async () => {
    const proposal = await createSupabaseProposal({
      name: "Integration Verification",
      company: "Osmora Capital Test Record",
      sector: "Other",
      stage: "Verification",
      pitch: "Temporary automated verification record. This row is removed immediately after Supabase confirms persistence.",
      email: "integration-verification@osmora.invalid",
      phone: "+0000000000",
    });

    try {
      expect(proposal.id).toEqual(expect.any(Number));
      expect(proposal.status).toBe("new");
      expect(proposal.company).toBe("Osmora Capital Test Record");
    } finally {
      await deleteSupabaseProposal(proposal.id);
    }
  });
});
