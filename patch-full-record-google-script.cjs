const fs = require("fs");
const path = require("path");

const dir = "google-apps-script";
const file = path.join(dir, "Code.gs");

fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(
  file,
`const CANDIDATES_HEADERS = [
  "candidate_id","created_at","full_name","whatsapp","email","position_applied",
  "domicile","age","education","last_experience","source","assessment_level",
  "disc_type","disc_fit_score","iq_score","iq_fit_score","combined_score",
  "combined_category","final_recommendation","red_flags","summary",
  "is_deleted","deleted_at","deleted_by","full_record_json"
];

const SETTINGS_HEADERS = ["key", "value"];
const ADMIN_USERS_HEADERS = ["username","password","role","active","created_at","updated_at"];

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSecret_() {
  return String(PropertiesService.getScriptProperties().getProperty("SECRET_KEY") || "").trim();
}

function isAuthorized_(secret) {
  return String(secret || "").trim() === getSecret_();
}

function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(name);
  if (!sheet) throw new Error("Sheet tidak ditemukan: " + name);
  return sheet;
}

function ensureSheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    return sheet;
  }

  const existing = sheet.getLastColumn()
    ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    : [];

  headers.forEach(function(header) {
    if (existing.indexOf(header) === -1) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue(header);
    }
  });

  return sheet;
}

function setupSheets() {
  ensureSheet("Candidates", CANDIDATES_HEADERS);
  ensureSheet("Settings", SETTINGS_HEADERS);
  ensureSheet("AdminUsers", ADMIN_USERS_HEADERS);
  seedDefaultAdmin_();

  return jsonResponse({
    success: true,
    message: "Sheets setup completed"
  });
}

function doGet(e) {
  try {
    const action = e && e.parameter ? String(e.parameter.action || "") : "";
    const secret = e && e.parameter
      ? String(e.parameter.secret || e.parameter.GOOGLE_SCRIPT_SECRET || e.parameter.SECRET_KEY || "").trim()
      : "";

    if (!isAuthorized_(secret)) {
      return jsonResponse({ success: false, message: "Unauthorized" });
    }

    if (action === "healthCheck") {
      return jsonResponse({ success: true, message: "OK" });
    }

    if (action === "getCandidates") {
      return jsonResponse(getCandidates());
    }

    if (action === "getCandidateDetail") {
      return jsonResponse(getCandidateDetail(e.parameter.candidate_id));
    }

    if (action === "getSettings") {
      return jsonResponse(getSettings());
    }

    if (action === "getAdminUsers") {
      return jsonResponse(getAdminUsers());
    }

    return jsonResponse({
      success: false,
      message: "Unknown action: " + action
    });
  } catch (err) {
    return jsonResponse({
      success: false,
      message: err.message || String(err)
    });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");
    const action = String(body.action || "");
    const secret = String(body.secret || "").trim();

    if (!isAuthorized_(secret)) {
      return jsonResponse({ success: false, message: "Unauthorized" });
    }

    if (action === "submitAssessment") {
      return jsonResponse(saveAssessment(body.record));
    }

    if (action === "deleteCandidates") {
      return jsonResponse(deleteCandidates(body.candidateIds || [], body.deletedBy || "admin"));
    }

    if (action === "updateSetting") {
      return jsonResponse(updateSetting(body.key, body.value));
    }

    if (action === "loginAdmin") {
      return jsonResponse(loginAdmin(body.username, body.password));
    }

    if (action === "addAdminUser") {
      return jsonResponse(addAdminUser(body.username, body.password, body.role));
    }

    if (action === "updateAdminUser") {
      return jsonResponse(updateAdminUser(body.username, body.password, body.active, body.role));
    }

    return jsonResponse({
      success: false,
      message: "Unknown action: " + action
    });
  } catch (err) {
    return jsonResponse({
      success: false,
      message: err.message || String(err)
    });
  }
}

function saveAssessment(record) {
  if (!record) {
    return { success: false, message: "Record kosong." };
  }

  const sheet = ensureSheet("Candidates", CANDIDATES_HEADERS);
  const candidate = record.candidate || {};
  const disc = record.disc || {};
  const iq = record.iq || {};
  const combined = record.combined || {};

  const candidateId = record.candidate_id || record.candidateId || ("CAND-" + Date.now());

  sheet.appendRow([
    candidateId,
    record.created_at || new Date().toISOString(),
    candidate.fullName || candidate.full_name || "",
    candidate.whatsapp || "",
    candidate.email || "",
    candidate.positionApplied || candidate.position_applied || "",
    candidate.domicile || "",
    candidate.age || "",
    candidate.education || "",
    candidate.lastExperience || candidate.last_experience || "",
    candidate.source || "",
    candidate.assessmentLevel || candidate.assessment_level || "",
    disc.type || "",
    disc.fitScore || "",
    iq.percentageScore || iq.score || "",
    iq.fitScore || "",
    combined.score || "",
    combined.category || "",
    combined.recommendation || "",
    Array.isArray(record.redFlags) ? record.redFlags.join(" | ") : (record.red_flags || ""),
    record.summary || "",
    false,
    "",
    "",
    JSON.stringify(record)
  ]);

  return {
    success: true,
    candidate_id: candidateId
  };
}

function getCandidates() {
  const sheet = ensureSheet("Candidates", CANDIDATES_HEADERS);
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return { success: true, candidates: [] };
  }

  const headers = data[0];
  const deletedCol = headers.indexOf("is_deleted");

  const candidates = data.slice(1)
    .filter(function(row) {
      return String(row[deletedCol] || "").toUpperCase() !== "TRUE";
    })
    .map(function(row) {
      const item = {};
      headers.forEach(function(header, index) {
        if (header !== "full_record_json") {
          item[header] = row[index];
        }
      });
      return item;
    });

  return {
    success: true,
    candidates: candidates
  };
}

function getCandidateDetail(candidateId) {
  const sheet = ensureSheet("Candidates", CANDIDATES_HEADERS);
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return { success: true, candidate: null };
  }

  const headers = data[0];
  const idCol = headers.indexOf("candidate_id");
  const jsonCol = headers.indexOf("full_record_json");
  const deletedCol = headers.indexOf("is_deleted");

  for (let i = 1; i < data.length; i++) {
    const isDeleted = String(data[i][deletedCol] || "").toUpperCase() === "TRUE";

    if (String(data[i][idCol]) === String(candidateId) && !isDeleted) {
      if (jsonCol >= 0 && data[i][jsonCol]) {
        try {
          return {
            success: true,
            candidate: JSON.parse(data[i][jsonCol])
          };
        } catch (err) {}
      }

      const row = {};
      headers.forEach(function(header, index) {
        if (header !== "full_record_json") {
          row[header] = data[i][index];
        }
      });

      return {
        success: true,
        candidate: row
      };
    }
  }

  return {
    success: true,
    candidate: null
  };
}

function deleteCandidates(candidateIds, deletedBy) {
  const ids = Array.isArray(candidateIds) ? candidateIds.map(String) : [];
  const sheet = ensureSheet("Candidates", CANDIDATES_HEADERS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const idCol = headers.indexOf("candidate_id");
  const deletedCol = headers.indexOf("is_deleted");
  const deletedAtCol = headers.indexOf("deleted_at");
  const deletedByCol = headers.indexOf("deleted_by");

  let count = 0;

  for (let i = 1; i < data.length; i++) {
    if (ids.indexOf(String(data[i][idCol])) !== -1) {
      const rowIndex = i + 1;
      sheet.getRange(rowIndex, deletedCol + 1).setValue(true);
      sheet.getRange(rowIndex, deletedAtCol + 1).setValue(new Date().toISOString());
      sheet.getRange(rowIndex, deletedByCol + 1).setValue(deletedBy || "admin");
      count++;
    }
  }

  return {
    success: true,
    deletedCount: count
  };
}

function getSettings() {
  const sheet = ensureSheet("Settings", SETTINGS_HEADERS);
  const data = sheet.getDataRange().getValues();
  const settings = {};

  for (let i = 1; i < data.length; i++) {
    settings[String(data[i][0])] = data[i][1];
  }

  if (!settings.whatsapp_candidate_message_template) {
    settings.whatsapp_candidate_message_template =
      "Halo {nama}, terima kasih sudah mengikuti assessment Gadgetnio HR Suite untuk posisi {posisi}. Tim HR kami akan meninjau hasil Anda dan menghubungi kembali jika sesuai dengan kebutuhan posisi. Terima kasih.";
  }

  return {
    success: true,
    settings: settings
  };
}

function updateSetting(key, value) {
  key = String(key || "").trim();
  if (!key) return { success: false, message: "Key wajib diisi." };

  const sheet = ensureSheet("Settings", SETTINGS_HEADERS);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === key) {
      sheet.getRange(i + 1, 2).setValue(value || "");
      return { success: true };
    }
  }

  sheet.appendRow([key, value || ""]);
  return { success: true };
}

function getAdminUsersSheet_() {
  return ensureSheet("AdminUsers", ADMIN_USERS_HEADERS);
}

function seedDefaultAdmin_() {
  const sheet = getAdminUsersSheet_();
  const data = sheet.getDataRange().getValues();

  if (data.length > 1) return;

  const now = new Date().toISOString();
  sheet.appendRow(["admin", "admin123", "superadmin", true, now, now]);
}

function loginAdmin(username, password) {
  seedDefaultAdmin_();

  username = String(username || "").trim().toLowerCase();
  password = String(password || "");

  const sheet = getAdminUsersSheet_();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const usernameCol = headers.indexOf("username");
  const passwordCol = headers.indexOf("password");
  const roleCol = headers.indexOf("role");
  const activeCol = headers.indexOf("active");

  for (let i = 1; i < data.length; i++) {
    const rowUsername = String(data[i][usernameCol] || "").trim().toLowerCase();
    const rowPassword = String(data[i][passwordCol] || "");
    const active = String(data[i][activeCol]).toUpperCase() !== "FALSE";

    if (rowUsername === username && rowPassword === password && active) {
      return {
        success: true,
        user: {
          username: data[i][usernameCol],
          role: data[i][roleCol] || "admin"
        }
      };
    }
  }

  return {
    success: false,
    message: "Username atau password salah."
  };
}

function getAdminUsers() {
  seedDefaultAdmin_();

  const sheet = getAdminUsersSheet_();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const users = [];

  for (let i = 1; i < data.length; i++) {
    const row = {};
    headers.forEach(function(header, index) {
      if (header !== "password") {
        row[header] = data[i][index];
      }
    });

    row.active = String(row.active).toUpperCase() !== "FALSE";
    users.push(row);
  }

  return {
    success: true,
    users: users
  };
}

function addAdminUser(username, password, role) {
  seedDefaultAdmin_();

  username = String(username || "").trim();
  password = String(password || "");
  role = String(role || "admin");

  if (!username || !password) {
    return { success: false, message: "Username dan password wajib diisi." };
  }

  const sheet = getAdminUsersSheet_();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const usernameCol = headers.indexOf("username");

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][usernameCol]).toLowerCase() === username.toLowerCase()) {
      return { success: false, message: "Username sudah ada." };
    }
  }

  const now = new Date().toISOString();
  sheet.appendRow([username, password, role, true, now, now]);

  return { success: true };
}

function updateAdminUser(username, password, active, role) {
  seedDefaultAdmin_();

  username = String(username || "").trim();

  const sheet = getAdminUsersSheet_();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const usernameCol = headers.indexOf("username");
  const passwordCol = headers.indexOf("password");
  const roleCol = headers.indexOf("role");
  const activeCol = headers.indexOf("active");
  const updatedAtCol = headers.indexOf("updated_at");

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][usernameCol]).toLowerCase() === username.toLowerCase()) {
      const rowIndex = i + 1;

      if (password) sheet.getRange(rowIndex, passwordCol + 1).setValue(password);
      if (typeof active === "boolean") sheet.getRange(rowIndex, activeCol + 1).setValue(active);
      if (role) sheet.getRange(rowIndex, roleCol + 1).setValue(role);

      sheet.getRange(rowIndex, updatedAtCol + 1).setValue(new Date().toISOString());

      return { success: true };
    }
  }

  return {
    success: false,
    message: "Admin tidak ditemukan."
  };
}
`,
  "utf8"
);

console.log("✅ Code.gs package generated at google-apps-script/Code.gs");
console.log("");
console.log("NEXT:");
console.log("1. Copy isi google-apps-script/Code.gs");
console.log("2. Paste ke Apps Script Code.gs");
console.log("3. Save");
console.log("4. Run setupSheets()");
console.log("5. Deploy > Manage deployments > Edit > New version > Deploy");
console.log("6. Test kandidat baru");