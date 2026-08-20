type SupabaseProposalInput = {
  name: string;
  company: string;
  sector: string;
  stage: string;
  pitch: string;
  email: string;
  phone: string;
};

type SupabaseProposal = SupabaseProposalInput & {
  id: number;
  status: "new" | "under review" | "responded";
  submitted_at: string;
};

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_KEY;
  if (!url || !key) throw new Error("Supabase is not configured.");
  return { url, key };
}

export async function createSupabaseProposal(input: SupabaseProposalInput): Promise<SupabaseProposal> {
  const { url, key } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/proposals`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({ ...input, status: "new" }),
  });

  if (!response.ok) {
    throw new Error("Supabase could not record the proposal.");
  }

  const records = await response.json() as SupabaseProposal[];
  if (!records[0]) throw new Error("Supabase did not return the saved proposal.");
  return records[0];
}

export async function deleteSupabaseProposal(id: number) {
  const { url, key } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/proposals?id=eq.${encodeURIComponent(String(id))}`, {
    method: "DELETE",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });
  if (!response.ok) throw new Error("Supabase could not remove the temporary verification record.");
}
