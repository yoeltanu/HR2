// shortcut: per-instance memory; use a WAF rule or shared store if deployed on multiple instances
const WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILURES = 10;
const MAX_KEYS = 5000;

const failures = new Map<string, { count: number; resetAt: number }>();

function prune(now: number) {
  if (failures.size <= MAX_KEYS) return;
  for (const [key, entry] of failures) {
    if (entry.resetAt <= now) failures.delete(key);
  }
}

export function isBlocked(key: string, now: number = Date.now()): boolean {
  const entry = failures.get(key);
  if (!entry) return false;
  if (entry.resetAt <= now) {
    failures.delete(key);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

export function recordFailure(key: string, now: number = Date.now()): void {
  prune(now);
  const entry = failures.get(key);
  if (!entry || entry.resetAt <= now) {
    failures.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
