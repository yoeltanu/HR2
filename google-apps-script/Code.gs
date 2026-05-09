const SHEETS = {
  Candidates: [
    "candidate_id",
    "created_at",
    "full_name",
    "whatsapp",
    "email",
    "position_applied",
    "domicile",
    "age",
    "education",
    "last_experience",
    "source",
    "assessment_level",
    "disc_type",
    "disc_fit_score",
    "iq_score",
    "iq_fit_score",
    "combined_score",
    "combined_category",
    "final_recommendation",
    "red_flags",
    "summary"
  ],
  DiscResults: [
    "candidate_id",
    "raw_D",
    "raw_I",
    "raw_S",
    "raw_C",
    "pct_D",
    "pct_I",
    "pct_S",
    "pct_C",
    "disc_type",
    "disc_fit_score",
    "disc_fit_category",
    "disc_red_flags",
    "disc_summary",
    "disc_recommendation"
  ],
  DiscAnswers: [
    "answer_id",
    "candidate_id",
    "question_id",
    "most_answer",
    "least_answer",
    "most_code",
    "least_code",
    "created_at"
  ],
  IQResults: [
    "candidate_id",
    "level",
    "duration_seconds",
    "total_questions",
    "answered_count",
    "blank_count",
    "correct_count",
    "wrong_count",
    "raw_score",
    "weighted_score",
    "max_weighted_score",
    "percentage_score",
    "logical_score",
    "numerical_score",
    "verbal_score",
    "pattern_score",
    "working_accuracy_score",
    "iq_fit_score",
    "iq_fit_category",
    "iq_red_flags",
    "iq_summary",
    "iq_recommendation"
  ],
  IQAnswers: [
    "answer_id",
    "candidate_id",
    "question_id",
    "selected_answer",
    "correct_answer",
    "is_correct",
    "difficulty",
    "category",
    "score",
    "created_at"
  ],
  Settings: [
    "key",
    "value"
  ],
  PositionProfiles: [
    "position",
    "disc_ideal_types",
    "iq_thresholds",
    "combined_weights",
    "description"
  ]
};

function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  Object.keys(SHEETS).forEach(function(sheetName) {
    let sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    const headers = SHEETS[sheetName];

    sheet.clear();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);

    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#06111f");
    headerRange.setFontColor("#ffffff");
  });

  seedPositionProfiles_();
  seedSettings_();

  return jsonResponse({
    success: true,
    message: "Sheets created successfully.",
    sheets: Object.keys(SHEETS)
  });
}

function seedSettings_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Settings");

  const rows = [
    ["app_name", "HR Assessment Platform"],
    ["assessment_note", "Cognitive Ability Screening bukan tes IQ klinis resmi."],
    ["ethical_disclaimer", "Hasil assessment adalah alat bantu HR dan bukan satu-satunya dasar keputusan rekrutmen."]
  ];

  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
}

function seedPositionProfiles_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("PositionProfiles");

  const rows = [
    [
      "Accounting",
      "CS,CD,SC,C/S,C/D",
      "total:75,numerical:80,workingAccuracy:80,logical:70",
      "DISC:30,IQ:70",
      "Accounting detail dan akurasi tinggi."
    ],
    [
      "Admin Retur",
      "SC,CS,S/C",
      "total:65,workingAccuracy:75,verbal:65,logical:60",
      "DISC:40,IQ:60",
      "Retur dan administrasi teliti."
    ],
    [
      "Admin Inbound",
      "SC,DS,S/C,D/S",
      "total:65,workingAccuracy:75,numerical:65",
      "DISC:45,IQ:55",
      "Administrasi barang masuk dan koordinasi operasional."
    ],
    [
      "Customer Service",
      "IS,SI,I/S,S/I",
      "total:65,verbal:75,logical:60,workingAccuracy:65",
      "DISC:60,IQ:40",
      "Komunikasi, empati, dan stabilitas menghadapi customer."
    ],
    [
      "E-commerce Specialist",
      "DI,DC,D/I,D/C",
      "total:75,numerical:75,logical:75,pattern:70",
      "DISC:45,IQ:55",
      "Marketplace, campaign, target, dan analisa performa."
    ],
    [
      "Head of Sales",
      "DI,DC,D/I,D/C",
      "total:80,logical:80,numerical:75,verbal:75",
      "DISC:45,IQ:55",
      "Sales leadership, target tinggi, dan komunikasi."
    ],
    [
      "Procurement",
      "CD,DC,C/D,D/C",
      "total:80,numerical:80,logical:80,workingAccuracy:75",
      "DISC:30,IQ:70",
      "Analisa supplier, negosiasi, dan kontrol angka."
    ],
    [
      "Warehouse Leader",
      "DS,SD,D/S,S/D",
      "total:70,logical:70,workingAccuracy:70,verbal:65",
      "DISC:45,IQ:55",
      "Koordinasi lapangan, stabilitas, dan ketegasan."
    ],
    [
      "Packing Staff",
      "SC,CS,S/C,C/S",
      "total:60,workingAccuracy:75,pattern:60",
      "DISC:45,IQ:55",
      "Konsistensi, ketelitian, dan kepatuhan prosedur."
    ],
    [
      "HRGA",
      "SC,IS,S/C,I/S",
      "total:70,verbal:75,logical:70,workingAccuracy:70",
      "DISC:45,IQ:55",
      "Administrasi, komunikasi internal, dan stabilitas."
    ],
    [
      "Personal Assistant",
      "CD,SC,C/D,S/C",
      "total:80,logical:80,verbal:75,workingAccuracy:80,numerical:70",
      "DISC:35,IQ:65",
      "Follow-up, detail, prioritas, dan kepercayaan."
    ]
  ];

  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
}

function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents ? e.postData.contents : "{}";
    const body = JSON.parse(raw);

    validateSecret_(body.secret);

    if (body.action !== "submitAssessment") {
      throw new Error("Invalid action.");
    }

    if (!body.record || !body.record.candidate_id) {
      throw new Error("Invalid record payload.");
    }

    const record = body.record;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    ensureAllSheetsExist_();

    saveCandidate_(ss, record);
    saveDiscResult_(ss, record);
    saveDiscAnswers_(ss, record);
    saveIQResult_(ss, record);
    saveIQAnswers_(ss, record);

    return jsonResponse({
      success: true,
      candidate_id: record.candidate_id,
      message: "Assessment saved successfully."
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      message: error.message || "Unknown doPost error."
    });
  }
}

function doGet(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};

    validateSecret_(params.secret);
    ensureAllSheetsExist_();

    if (params.action === "healthCheck") {
      return jsonResponse({
        success: true,
        message: "OK",
        timestamp: new Date().toISOString()
      });
    }

    if (params.action === "getCandidates") {
      const rows = getRows_("Candidates").reverse();

      return jsonResponse({
        success: true,
        candidates: rows
      });
    }

    if (params.action === "getCandidateDetail") {
      const candidateId = params.candidate_id;

      if (!candidateId) {
        throw new Error("candidate_id required.");
      }

      return jsonResponse({
        success: true,
        candidate: buildCandidateDetail_(candidateId)
      });
    }

    throw new Error("Invalid action.");
  } catch (error) {
    return jsonResponse({
      success: false,
      message: error.message || "Unknown doGet error."
    });
  }
}

function saveCandidate_(ss, record) {
  appendObject_(ss, "Candidates", {
    candidate_id: record.candidate_id,
    created_at: record.created_at,
    full_name: safe_(record.candidate.fullName),
    whatsapp: safe_(record.candidate.whatsapp),
    email: safe_(record.candidate.email),
    position_applied: safe_(record.candidate.positionApplied),
    domicile: safe_(record.candidate.domicile),
    age: safe_(record.candidate.age),
    education: safe_(record.candidate.education),
    last_experience: safe_(record.candidate.lastExperience),
    source: safe_(record.candidate.source),
    assessment_level: record.candidate.assessmentLevel,
    disc_type: record.disc.type,
    disc_fit_score: record.disc.fitScore,
    iq_score: record.iq.percentageScore,
    iq_fit_score: record.iq.fitScore,
    combined_score: record.combined.score,
    combined_category: record.combined.category,
    final_recommendation: record.combined.recommendation,
    red_flags: joinFlags_(record.redFlags),
    summary: safe_(record.summary)
  });
}

function saveDiscResult_(ss, record) {
  appendObject_(ss, "DiscResults", {
    candidate_id: record.candidate_id,
    raw_D: record.disc.raw.D,
    raw_I: record.disc.raw.I,
    raw_S: record.disc.raw.S,
    raw_C: record.disc.raw.C,
    pct_D: record.disc.percentages.D,
    pct_I: record.disc.percentages.I,
    pct_S: record.disc.percentages.S,
    pct_C: record.disc.percentages.C,
    disc_type: record.disc.type,
    disc_fit_score: record.disc.fitScore,
    disc_fit_category: record.disc.fitCategory,
    disc_red_flags: joinFlags_(record.disc.redFlags),
    disc_summary: safe_(record.disc.interpretation.summary),
    disc_recommendation: safe_(record.disc.recommendation)
  });
}

function saveDiscAnswers_(ss, record) {
  const answers = Array.isArray(record.discAnswers) ? record.discAnswers : [];

  answers.forEach(function(answer, index) {
    appendObject_(ss, "DiscAnswers", {
      answer_id: "DA-" + record.candidate_id + "-" + String(index + 1).padStart(2, "0"),
      candidate_id: record.candidate_id,
      question_id: answer.questionId,
      most_answer: answer.mostOptionId,
      least_answer: answer.leastOptionId,
      most_code: answer.mostCode || "",
      least_code: answer.leastCode || "",
      created_at: record.created_at
    });
  });
}

function saveIQResult_(ss, record) {
  appendObject_(ss, "IQResults", {
    candidate_id: record.candidate_id,
    level: record.iq.level,
    duration_seconds: record.iq.durationSeconds,
    total_questions: record.iq.totalQuestions,
    answered_count: record.iq.answeredCount,
    blank_count: record.iq.blankCount,
    correct_count: record.iq.correctCount,
    wrong_count: record.iq.wrongCount,
    raw_score: record.iq.rawScore,
    weighted_score: record.iq.weightedScore,
    max_weighted_score: record.iq.maxWeightedScore,
    percentage_score: record.iq.percentageScore,
    logical_score: record.iq.subtests.logical,
    numerical_score: record.iq.subtests.numerical,
    verbal_score: record.iq.subtests.verbal,
    pattern_score: record.iq.subtests.pattern,
    working_accuracy_score: record.iq.subtests.workingAccuracy,
    iq_fit_score: record.iq.fitScore,
    iq_fit_category: record.iq.fitCategory,
    iq_red_flags: joinFlags_(record.iq.redFlags),
    iq_summary: safe_(record.iq.summary),
    iq_recommendation: safe_(record.iq.recommendation)
  });
}

function saveIQAnswers_(ss, record) {
  const answers = Array.isArray(record.iqAnswers) ? record.iqAnswers : [];

  answers.forEach(function(answer, index) {
    appendObject_(ss, "IQAnswers", {
      answer_id: "IA-" + record.candidate_id + "-" + String(index + 1).padStart(2, "0"),
      candidate_id: record.candidate_id,
      question_id: answer.questionId,
      selected_answer: answer.selectedAnswer || "",
      correct_answer: answer.correctAnswer || "",
      is_correct: answer.isCorrect ? "TRUE" : "FALSE",
      difficulty: answer.difficulty || "",
      category: answer.category || "",
      score: answer.score || 0,
      created_at: record.created_at
    });
  });
}

function buildCandidateDetail_(candidateId) {
  const candidateRow = getRows_("Candidates").find(function(row) {
    return String(row.candidate_id) === String(candidateId);
  });

  if (!candidateRow) {
    throw new Error("Candidate not found.");
  }

  const discRow = getRows_("DiscResults").find(function(row) {
    return String(row.candidate_id) === String(candidateId);
  }) || {};

  const iqRow = getRows_("IQResults").find(function(row) {
    return String(row.candidate_id) === String(candidateId);
  }) || {};

  const discAnswers = getRows_("DiscAnswers").filter(function(row) {
    return String(row.candidate_id) === String(candidateId);
  });

  const iqAnswers = getRows_("IQAnswers").filter(function(row) {
    return String(row.candidate_id) === String(candidateId);
  });

  const discType = discRow.disc_type || candidateRow.disc_type || "C";
  const primary = String(discType).charAt(0) || "C";
  const secondary = String(discType).length > 1 ? String(discType).charAt(1) : undefined;

  return {
    candidate_id: candidateId,
    created_at: candidateRow.created_at,
    candidate: {
      fullName: candidateRow.full_name,
      whatsapp: candidateRow.whatsapp,
      email: candidateRow.email,
      positionApplied: candidateRow.position_applied,
      domicile: candidateRow.domicile,
      age: candidateRow.age,
      education: candidateRow.education,
      lastExperience: candidateRow.last_experience,
      source: candidateRow.source,
      assessmentLevel: Number(candidateRow.assessment_level || 1),
      consent: true
    },
    disc: {
      raw: {
        D: Number(discRow.raw_D || 0),
        I: Number(discRow.raw_I || 0),
        S: Number(discRow.raw_S || 0),
        C: Number(discRow.raw_C || 0)
      },
      adjusted: {
        D: 0,
        I: 0,
        S: 0,
        C: 0
      },
      percentages: {
        D: Number(discRow.pct_D || 0),
        I: Number(discRow.pct_I || 0),
        S: Number(discRow.pct_S || 0),
        C: Number(discRow.pct_C || 0)
      },
      type: discType,
      primary: primary,
      secondary: secondary,
      fitScore: Number(discRow.disc_fit_score || candidateRow.disc_fit_score || 0),
      fitCategory: discRow.disc_fit_category || "",
      recommendation: discRow.disc_recommendation || "",
      redFlags: splitFlags_(discRow.disc_red_flags),
      interpretation: buildDiscInterpretationFallback_(discType, discRow.disc_summary),
      durationSeconds: 0,
      changeCount: 0
    },
    iq: {
      level: Number(iqRow.level || candidateRow.assessment_level || 1),
      durationSeconds: Number(iqRow.duration_seconds || 0),
      totalQuestions: Number(iqRow.total_questions || 0),
      answeredCount: Number(iqRow.answered_count || 0),
      blankCount: Number(iqRow.blank_count || 0),
      correctCount: Number(iqRow.correct_count || 0),
      wrongCount: Number(iqRow.wrong_count || 0),
      rawScore: Number(iqRow.raw_score || 0),
      weightedScore: Number(iqRow.weighted_score || 0),
      maxWeightedScore: Number(iqRow.max_weighted_score || 0),
      percentageScore: Number(iqRow.percentage_score || candidateRow.iq_score || 0),
      subtests: {
        logical: Number(iqRow.logical_score || 0),
        numerical: Number(iqRow.numerical_score || 0),
        verbal: Number(iqRow.verbal_score || 0),
        pattern: Number(iqRow.pattern_score || 0),
        workingAccuracy: Number(iqRow.working_accuracy_score || 0)
      },
      fitScore: Number(iqRow.iq_fit_score || candidateRow.iq_fit_score || 0),
      fitCategory: iqRow.iq_fit_category || "",
      recommendation: iqRow.iq_recommendation || "",
      redFlags: splitFlags_(iqRow.iq_red_flags),
      summary: iqRow.iq_summary || "",
      changeCount: 0,
      timedOut: false
    },
    combined: {
      score: Number(candidateRow.combined_score || 0),
      category: candidateRow.combined_category || "",
      recommendation: candidateRow.final_recommendation || "",
      weights: inferCombinedWeights_(candidateRow.position_applied)
    },
    discAnswers: discAnswers.map(function(row) {
      return {
        questionId: row.question_id,
        mostOptionId: row.most_answer,
        leastOptionId: row.least_answer,
        mostCode: row.most_code,
        leastCode: row.least_code
      };
    }),
    iqAnswers: iqAnswers.map(function(row) {
      return {
        questionId: row.question_id,
        selectedAnswer: row.selected_answer || undefined,
        correctAnswer: row.correct_answer || undefined,
        isCorrect: row.is_correct === "TRUE" || row.is_correct === true,
        difficulty: row.difficulty || undefined,
        category: row.category || undefined,
        score: Number(row.score || 0)
      };
    }),
    redFlags: splitFlags_(candidateRow.red_flags),
    summary: candidateRow.summary
  };
}

function inferCombinedWeights_(position) {
  const normalized = String(position || "").toLowerCase();

  if (
    normalized.indexOf("sales") !== -1 ||
    normalized.indexOf("customer service") !== -1 ||
    normalized.indexOf("cs") !== -1
  ) {
    return {
      disc: 0.6,
      iq: 0.4
    };
  }

  if (
    normalized.indexOf("accounting") !== -1 ||
    normalized.indexOf("procurement") !== -1
  ) {
    return {
      disc: 0.3,
      iq: 0.7
    };
  }

  if (
    normalized.indexOf("leader") !== -1 ||
    normalized.indexOf("supervisor") !== -1 ||
    normalized.indexOf("head") !== -1
  ) {
    return {
      disc: 0.45,
      iq: 0.55
    };
  }

  if (normalized.indexOf("personal assistant") !== -1) {
    return {
      disc: 0.35,
      iq: 0.65
    };
  }

  if (
    normalized.indexOf("admin") !== -1 ||
    normalized.indexOf("checker") !== -1 ||
    normalized.indexOf("inventory") !== -1
  ) {
    return {
      disc: 0.4,
      iq: 0.6
    };
  }

  return {
    disc: 0.45,
    iq: 0.55
  };
}

function buildDiscInterpretationFallback_(type, summary) {
  const primary = String(type || "C").charAt(0);

  const map = {
    D: {
      title: "Dominance",
      summary: "Tegas, cepat mengambil keputusan, berorientasi target, dan menyukai tantangan.",
      strengths: ["Tegas", "Cepat mengambil keputusan", "Target oriented"],
      risks: ["Kurang sabar", "Bisa terlalu keras", "Dapat mengabaikan detail"],
      suitableRoles: ["Sales leader", "Supervisor operasional", "Project PIC"],
      managementTips: ["Berikan target jelas", "Imbangi dengan kontrol kualitas"]
    },
    I: {
      title: "Influence",
      summary: "Komunikatif, ekspresif, mudah membangun relasi, dan persuasif.",
      strengths: ["Komunikatif", "Ekspresif", "Persuasif"],
      risks: ["Kurang detail", "Mudah terdistraksi", "Terlalu optimis"],
      suitableRoles: ["Sales", "Customer service", "Relationship role"],
      managementTips: ["Gunakan checklist", "Tetapkan target harian"]
    },
    S: {
      title: "Steadiness",
      summary: "Stabil, sabar, konsisten, suportif, dan loyal.",
      strengths: ["Stabil", "Sabar", "Konsisten"],
      risks: ["Lambat mengambil keputusan", "Menghindari konflik"],
      suitableRoles: ["Admin operasional", "Admin retur", "Packing"],
      managementTips: ["Berikan alur kerja stabil", "Komunikasikan perubahan lebih awal"]
    },
    C: {
      title: "Conscientiousness",
      summary: "Teliti, sistematis, analitis, patuh SOP, dan fokus pada kualitas.",
      strengths: ["Teliti", "Sistematis", "Analitis", "Patuh SOP"],
      risks: ["Terlalu lama menganalisis", "Perfeksionis"],
      suitableRoles: ["Accounting", "Admin checker", "QC", "Inventory control"],
      managementTips: ["Berikan SOP jelas", "Tentukan batas waktu analisis"]
    }
  };

  const base = map[primary] || map.C;
  base.title = String(type || primary) + " — " + base.title;
  base.summary = summary || base.summary;

  return base;
}

function appendObject_(ss, sheetName, object) {
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error("Sheet not found: " + sheetName);
  }

  const headers = SHEETS[sheetName];

  const row = headers.map(function(header) {
    return object[header] !== undefined ? object[header] : "";
  });

  sheet.appendRow(row);
}

function getRows_(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

  if (!sheet) {
    throw new Error("Sheet not found: " + sheetName);
  }

  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) {
    return [];
  }

  const headers = values[0];

  return values
    .slice(1)
    .filter(function(row) {
      return row.some(function(cell) {
        return cell !== "";
      });
    })
    .map(function(row) {
      const object = {};

      headers.forEach(function(header, index) {
        object[header] = row[index];
      });

      return object;
    });
}

function ensureAllSheetsExist_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  Object.keys(SHEETS).forEach(function(sheetName) {
    let sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.getRange(1, 1, 1, SHEETS[sheetName].length).setValues([SHEETS[sheetName]]);
      sheet.setFrozenRows(1);
    }
  });
}

function validateSecret_(secret) {
  const expected = PropertiesService.getScriptProperties().getProperty("SECRET_KEY");

  if (!expected) {
    throw new Error("SECRET_KEY belum diset di Script Properties.");
  }

  if (!secret || String(secret) !== String(expected)) {
    throw new Error("Unauthorized secret key.");
  }
}

function splitFlags_(value) {
  if (!value) return [];

  return String(value)
    .split("|")
    .map(function(item) {
      return item.trim();
    })
    .filter(Boolean);
}

function joinFlags_(flags) {
  if (!flags) return "";

  if (Array.isArray(flags)) {
    return flags.join(" | ");
  }

  return String(flags);
}

function safe_(value) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
