import { test } from "node:test";
import assert from "node:assert/strict";

process.env.ADMIN_SESSION_SECRET = "test-dummy-secret";

const { createAdminToken, verifyAdminToken } = await import("../lib/utils/adminSession.ts");
const { isBlocked, recordFailure } = await import("../lib/utils/rateLimit.ts");

const HOUR = 60 * 60 * 1000;

test("admin token: valid token verifies", () => {
  const now = Date.now();
  assert.equal(verifyAdminToken(createAdminToken(now), now), true);
});

test("admin token: legacy value, tampered signature and expired token are rejected", () => {
  const now = Date.now();
  const token = createAdminToken(now);
  const tampered = token.slice(0, -1) + (token.endsWith("0") ? "1" : "0");

  assert.equal(verifyAdminToken("1", now), false);
  assert.equal(verifyAdminToken(tampered, now), false);
  assert.equal(verifyAdminToken(createAdminToken(now - 13 * HOUR), now), false);
});

test("admin token: verification fails without a secret", () => {
  const saved = {
    ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
    GOOGLE_SCRIPT_SECRET: process.env.GOOGLE_SCRIPT_SECRET,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
  };
  const now = Date.now();
  const token = createAdminToken(now);

  try {
    delete process.env.ADMIN_SESSION_SECRET;
    delete process.env.GOOGLE_SCRIPT_SECRET;
    delete process.env.ADMIN_PASSWORD;
    assert.equal(verifyAdminToken(token, now), false);
  } finally {
    for (const [key, value] of Object.entries(saved)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test("rate limit: blocks after 10 failures and unblocks after the window", () => {
  const key = "203.0.113.7";
  const t0 = Date.now();

  for (let i = 0; i < 9; i++) recordFailure(key, t0);
  assert.equal(isBlocked(key, t0), false);

  recordFailure(key, t0);
  assert.equal(isBlocked(key, t0), true);
  assert.equal(isBlocked(key, t0 + 10 * 60 * 1000), false);
});
