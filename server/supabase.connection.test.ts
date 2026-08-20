import { describe, expect, it } from "vitest";

describe("Supabase server connection", () => {
  it("accepts the configured project URL and API key", async () => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_KEY;
    expect(url).toBeTruthy();
    expect(key).toBeTruthy();

    const response = await fetch(`${url!.replace(/\/$/, "")}/rest/v1/`, {
      headers: {
        apikey: key!,
        Authorization: `Bearer ${key!}`,
        Accept: "application/openapi+json",
      },
    });

    expect(response.status).not.toBe(401);
    expect(response.status).not.toBe(403);
    expect(response.ok).toBe(true);
  });
});
