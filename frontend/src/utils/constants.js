export const BRANCH_CODES = [
  "AIDS",
  "CSE",
  "AIML",
  "IT",
  "CIC",
  "ECE",
  "EVL",
  "EEE",
  "MECHANICAL",
  "CIVIL",
  "BIOTECH",
];

export const BRANCH_LABELS = {
  AIDS:       "AI & Data Science",
  CSE:        "Computer Science",
  AIML:       "AI & ML",
  IT:         "Information Technology",
  CIC:        "CS (IoT & Cyber)",
  ECE:        "Electronics & Communication",
  EVL:        "ECE & VLSI",
  EEE:        "Electrical & Electronics",
  MECHANICAL: "Mechanical",
  CIVIL:      "Civil",
  BIOTECH:    "Bio-Technology",
};

// CBIT Osmania University roll number branch codes (digits 7–9)
// Format: 160122733001 → college=1601, year=22, branch=733, seq=001
export const ROLL_BRANCH_MAP = {
  "732": "CIVIL",
  "733": "CSE",
  "734": "EEE",
  "735": "ECE",
  "736": "MECHANICAL",
  "737": "IT",
  "749": "AIML",
  "771": "AIDS",
  "802": null,          // Chemical Engineering — not in portal
  "805": "BIOTECH",
};

/**
 * Parses a 12-digit CBIT roll number and returns extracted info.
 * Returns null if the roll is not a valid 12-digit CBIT number.
 *
 * Example: "160122771001"
 *   college  = "1601"
 *   joinYear = "22"  → 2022
 *   branchCode = "771" → "AIDS"
 *   seq      = "001"
 */
export function parseRollNumber(roll) {
  const clean = String(roll).trim();
  if (!/^\d{12}$/.test(clean)) return null;
  if (!clean.startsWith("1601")) return null;

  const college    = clean.slice(0, 4);   // "1601"
  const yearStr    = clean.slice(4, 6);   // e.g. "22"
  const branchCode = clean.slice(6, 9);   // e.g. "771"
  const seq        = clean.slice(9, 12);  // e.g. "001"

  const branch = ROLL_BRANCH_MAP[branchCode] ?? null;
  const joinYear = 2000 + parseInt(yearStr, 10);

  // Current academic year estimate → derive semester
  // Each academic year = 2 semesters. Round up to odd semester for current year.
  const now = new Date();
  const academicYear = now.getMonth() >= 5 ? now.getFullYear() : now.getFullYear() - 1;
  const yearsElapsed = academicYear - joinYear;
  // semesters completed = yearsElapsed * 2, current = that + 1 (capped 1–8)
  const estimatedSem = Math.min(8, Math.max(1, yearsElapsed * 2 + 1));

  return { college, joinYear, branchCode, branch, seq, estimatedSem };
}

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const SECTIONS = [1, 2, 3, 4, 5, 6];

export const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

export const SGPA_MIN = 0;
export const SGPA_MAX = 10;

export const FILTERS = [
  "All",
  "Notes",
  "PYQ",
  "Books",
  "Lab",
  "Important",
  "Other",
];
