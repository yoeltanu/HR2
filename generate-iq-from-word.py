import re
import json
from pathlib import Path

try:
    from docx import Document
except ImportError:
    raise SystemExit("Install dulu: python -m pip install python-docx")

DOCX_PATH = Path("Soal.docx")
OUT_PATH = Path("lib/iq/iqQuestions.ts")

CATEGORY_MAP = {
    "Logical Reasoning": "logical",
    "Numerical Reasoning": "numerical",
    "Verbal Reasoning": "verbal",
    "Pattern Reasoning": "pattern",
    "Working Accuracy": "workingAccuracy",
}

EXPECTED_COUNTS = {1: 25, 2: 35, 3: 45}


def clean(text: str) -> str:
    return (
        text.replace("·", "")
        .replace("\u00a0", " ")
        .replace("✅", " ✅")
        .strip()
    )


def difficulty(level: int, qno: int) -> str:
    if level == 1:
        return "easy" if qno <= 18 else "medium"
    if level == 2:
        return "medium" if qno <= 28 else "hard"
    return "medium" if qno <= 24 else "hard"


def option_key(line: str):
    m = re.match(r"^[•\-\s]*([ABCD])\.\s*(.+)$", line)
    if not m:
        return None
    return m.group(1), m.group(2).replace("✅", "").strip(), "✅" in line


def paragraph_texts(path: Path):
    doc = Document(str(path))
    return [clean(p.text) for p in doc.paragraphs if clean(p.text)]


def parse_questions(lines):
    questions = []
    level = None
    category = None
    i = 0

    while i < len(lines):
        line = lines[i]

        level_match = re.search(r"LEVEL\s+([123])", line, re.I)
        if level_match:
            level = int(level_match.group(1))
            i += 1
            continue

        for title, cat in CATEGORY_MAP.items():
            if title.lower() in line.lower():
                category = cat
                break

        if re.fullmatch(r"\d+\.", line) or re.fullmatch(r"\d+", line):
            if not level or not category:
                i += 1
                continue

            qno = int(line.replace(".", ""))
            i += 1

            q_lines = []
            while i < len(lines) and not option_key(lines[i]):
                if (
                    re.fullmatch(r"\d+\.", lines[i])
                    or re.fullmatch(r"\d+", lines[i])
                    or re.search(r"LEVEL\s+[123]", lines[i], re.I)
                ):
                    break
                q_lines.append(lines[i])
                i += 1

            options = {}
            correct = None

            while i < len(lines):
                opt = option_key(lines[i])
                if not opt:
                    break

                key, value, is_correct = opt
                options[key] = value
                if is_correct:
                    correct = key
                i += 1

                if len(options) == 4:
                    break

            if len(options) == 4 and correct:
                questions.append(
                    {
                        "id": f"L{level}-{qno:03d}",
                        "level": level,
                        "category": category,
                        "difficulty": difficulty(level, qno),
                        "question": " ".join(q_lines).strip(),
                        "options": options,
                        "correctAnswer": correct,
                        "explanation": f"Jawaban benar adalah {correct}."
                    }
                )

            continue

        i += 1

    return questions


def ts_string(value):
    return json.dumps(value, ensure_ascii=False)


def write_ts(questions):
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    body = []
    for q in questions:
        body.append(
f'''  {{
    id: {ts_string(q["id"])},
    level: {q["level"]},
    category: {ts_string(q["category"])},
    difficulty: {ts_string(q["difficulty"])},
    question: {ts_string(q["question"])},
    options: {{
      A: {ts_string(q["options"]["A"])},
      B: {ts_string(q["options"]["B"])},
      C: {ts_string(q["options"]["C"])},
      D: {ts_string(q["options"]["D"])}
    }},
    correctAnswer: {ts_string(q["correctAnswer"])},
    explanation: {ts_string(q["explanation"])}
  }}'''
        )

    content = '''import type { IQQuestion } from "@/types/iq";

export const iqQuestions: IQQuestion[] = [
''' + ",\n".join(body) + '''
];

export function getIQQuestionsByLevel(level: 1 | 2 | 3): IQQuestion[] {
  return iqQuestions.filter((question) => question.level === level);
}

export function getIQDurationSeconds(level: 1 | 2 | 3): number {
  if (level === 1) return 20 * 60;
  if (level === 2) return 30 * 60;
  return 40 * 60;
}

export function getIQQuestionCountByLevel(level: 1 | 2 | 3): number {
  return getIQQuestionsByLevel(level).length;
}
'''

    OUT_PATH.write_text(content, encoding="utf-8")


if not DOCX_PATH.exists():
    raise SystemExit("File Soal.docx tidak ditemukan di folder project.")

lines = paragraph_texts(DOCX_PATH)
questions = parse_questions(lines)

counts = {1: 0, 2: 0, 3: 0}
for q in questions:
    counts[q["level"]] += 1

print("Jumlah soal terbaca:", counts)

for level, expected in EXPECTED_COUNTS.items():
    if counts[level] != expected:
        raise SystemExit(
            f"Jumlah soal Level {level} salah. Terbaca {counts[level]}, harus {expected}."
        )

write_ts(questions)

print("✅ Berhasil generate:", OUT_PATH)
print("✅ Total soal:", len(questions))