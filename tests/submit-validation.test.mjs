import { test } from "node:test";
import assert from "node:assert/strict";

const { validateAssessmentPayload } = await import("../lib/utils/validation.ts");

const discAnswers = (ids) => ids.map((questionId) => ({ questionId, mostOptionId: "A", leastOptionId: "B" }));
const allDisc = Array.from({ length: 24 }, (_, i) => `DISC-${String(i + 1).padStart(2, "0")}`);

function validPayload(overrides = {}) {
  return {
    candidate: {
      fullName: "Andi Pratama",
      whatsapp: "081234567890",
      email: "",
      positionApplied: "Accounting Staff",
      assessmentLevel: 1,
      consent: true
    },
    discAnswers: discAnswers(allDisc),
    discMeta: { startedAt: "", finishedAt: "", durationSeconds: 600, changeCount: 0 },
    iqAnswers: [{ questionId: "L1-001", selectedAnswer: "B" }],
    iqMeta: { startedAt: "", finishedAt: "", durationSeconds: 900, changeCount: 0, timedOut: false },
    ...overrides
  };
}

test("submit validation: a complete payload has no errors", () => {
  assert.deepEqual(validateAssessmentPayload(validPayload()), []);
});

test("submit validation: malformed payloads return errors instead of throwing", () => {
  const cases = [
    null,
    {},
    validPayload({ candidate: undefined }),
    validPayload({ discAnswers: Array(24).fill(null) }),
    validPayload({ discAnswers: discAnswers(Array(24).fill("DISC-01")) }),
    validPayload({ discAnswers: discAnswers(allDisc.map((id) => "X-" + id)) }),
    validPayload({ iqAnswers: [null] }),
    validPayload({ discMeta: undefined }),
    validPayload({ candidate: { ...validPayload().candidate, assignmentId: "x' OR 1=1 --" } })
  ];

  for (const payload of cases) {
    let errors;
    assert.doesNotThrow(() => {
      errors = validateAssessmentPayload(payload);
    });
    assert.ok(errors.length > 0, `expected errors for ${JSON.stringify(payload)?.slice(0, 80)}`);
  }

  assert.doesNotThrow(() => validateAssessmentPayload(validPayload({ candidate: { ...validPayload().candidate, fullName: 12 } })));
});
