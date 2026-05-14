const fs = require("fs");

fs.writeFileSync(
  "lib/utils/whatsapp.ts",
`export const DEFAULT_WHATSAPP_TEMPLATE =
  "Halo {nama}, terima kasih sudah mengikuti assessment Gadgetnio HR Suite untuk posisi {posisi}. Tim HR kami akan meninjau hasil Anda dan menghubungi kembali jika sesuai dengan kebutuhan posisi. Terima kasih.";

export function normalizeWhatsAppNumber(phone: unknown): string {
  if (phone === undefined || phone === null) return "";

  let cleaned = String(phone).replace(/[^\\d]/g, "");

  if (!cleaned) return "";

  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  } else if (cleaned.startsWith("8")) {
    cleaned = "62" + cleaned;
  }

  return cleaned;
}

export function buildWhatsAppMessage(template: string, candidate: any): string {
  const safe = (value: any) =>
    value === undefined || value === null || value === "" ? "-" : String(value);

  return String(template || DEFAULT_WHATSAPP_TEMPLATE)
    .replace(/\\{nama\\}/g, safe(candidate.full_name || candidate.fullName || candidate.name))
    .replace(/\\{posisi\\}/g, safe(candidate.position_applied || candidate.positionApplied || candidate.position))
    .replace(/\\{disc_type\\}/g, safe(candidate.disc_type || candidate.discType))
    .replace(/\\{iq_score\\}/g, safe(candidate.iq_score || candidate.iqScore))
    .replace(/\\{combined_score\\}/g, safe(candidate.combined_score || candidate.combinedScore))
    .replace(/\\{tanggal_tes\\}/g, safe(candidate.created_at || candidate.createdAt));
}

export function buildWhatsAppUrl(candidate: any, template: string): string {
  const phone = normalizeWhatsAppNumber(candidate.whatsapp || candidate.phone || "");
  const message = buildWhatsAppMessage(template, candidate);

  if (!phone) return "";

  return \`https://wa.me/\${phone}?text=\${encodeURIComponent(message)}\`;
}
`,
  "utf8"
);

console.log("✅ Fixed phone.replace error.");