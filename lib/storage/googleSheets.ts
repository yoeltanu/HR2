import type { AssessmentRecord } from "@/types/assessment";

function getConfig() {
  return {
    url: process.env.GOOGLE_SCRIPT_URL || "",
    secret: process.env.GOOGLE_SCRIPT_SECRET || ""
  };
}

export function isGoogleSheetsConfigured(): boolean {
  const config = getConfig();
  return Boolean(config.url && config.secret);
}

async function parseJsonResponse(response: Response) {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `Google Apps Script tidak mengembalikan JSON valid. Response: ${text.slice(
        0,
        300
      )}`
    );
  }
}

export async function submitToGoogleSheets(record: AssessmentRecord) {
  const config = getConfig();

  if (!config.url || !config.secret) {
    return {
      success: false,
      demo: true,
      message: "Google Sheets belum dikonfigurasi."
    };
  }

  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify({
      action: "submitAssessment",
      secret: config.secret,
      record
    }),
    cache: "no-store"
  });

  const data = await parseJsonResponse(response);

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Gagal menyimpan ke Google Sheets.");
  }

  return data;
}

export async function fetchCandidatesFromGoogleSheets() {
  const config = getConfig();

  if (!config.url || !config.secret) {
    return {
      success: true,
      demo: true,
      candidates: []
    };
  }

  const url = `${config.url}?action=getCandidates&secret=${encodeURIComponent(
    config.secret
  )}`;

  const response = await fetch(url, {
    cache: "no-store"
  });

  const data = await parseJsonResponse(response);

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Gagal mengambil data kandidat.");
  }

  return data;
}

export async function fetchCandidateDetailFromGoogleSheets(id: string) {
  const config = getConfig();

  if (!config.url || !config.secret) {
    return {
      success: true,
      demo: true,
      candidate: null
    };
  }

  const url = `${config.url}?action=getCandidateDetail&candidate_id=${encodeURIComponent(
    id
  )}&secret=${encodeURIComponent(config.secret)}`;

  const response = await fetch(url, {
    cache: "no-store"
  });

  const data = await parseJsonResponse(response);

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Gagal mengambil detail kandidat.");
  }

  return data;
}

export async function healthCheckGoogleSheets() {
  const config = getConfig();

  if (!config.url || !config.secret) {
    return {
      success: false,
      demo: true,
      message: "Google Sheets belum dikonfigurasi."
    };
  }

  const url = `${config.url}?action=healthCheck&secret=${encodeURIComponent(
    config.secret
  )}`;

  const response = await fetch(url, {
    cache: "no-store"
  });

  const data = await parseJsonResponse(response);

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Health check gagal.");
  }

  return data;
}
