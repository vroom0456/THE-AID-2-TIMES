// ─────────────────────────────────────────────
// THE AID 2 TIMES — CGPA / SGPA calculation utils
// Pure functions — no side effects, easy to test
// ─────────────────────────────────────────────
import { SEM_CREDITS, TOTAL_CREDITS, GRADE_BOUNDS } from "../data/curriculum";

/**
 * Calculate SGPA from an array of { credits, gradePoint }
 */
export function calcSGPA(entries) {
  const totalCredits = entries.reduce((s, e) => s + e.credits, 0);
  const totalPoints  = entries.reduce((s, e) => s + e.credits * e.gradePoint, 0);
  return totalCredits > 0 ? totalPoints / totalCredits : 0;
}

/**
 * Calculate running CGPA from array of sgpas (index 0 = sem 1)
 * Only counts sems where sgpa > 0
 */
export function calcCGPA(sgpas = []) {
  let cr = 0, pts = 0;
  sgpas.forEach((v, i) => {
    if (v > 0) { cr += SEM_CREDITS[i + 1] || 0; pts += v * (SEM_CREDITS[i + 1] || 0); }
  });
  return cr > 0 ? pts / cr : 0;
}

/**
 * CGPA forecaster
 * Returns:
 *  { feasible, reqAvg, currentCGPA, completedCredits, remainingCredits,
 *    maxAchievable, semBreakdown[], asapSem, asapReqAvg }
 */
export function forecastCGPA(sgpas = [], target) {
  let completedCredits = 0, completedPoints = 0, lastSem = 0;

  sgpas.forEach((v, i) => {
    const n = i + 1;
    if (v > 0) {
      completedCredits += SEM_CREDITS[n] || 0;
      completedPoints  += v * (SEM_CREDITS[n] || 0);
      lastSem = n;
    }
  });

  const currentCGPA       = completedCredits > 0 ? completedPoints / completedCredits : 0;
  const remainingCredits  = TOTAL_CREDITS - completedCredits;
  const reqPoints         = target * TOTAL_CREDITS - completedPoints;
  const reqAvg            = remainingCredits > 0 ? reqPoints / remainingCredits : Infinity;
  const maxAchievable     = (completedPoints + 10 * remainingCredits) / TOTAL_CREDITS;

  // Per-semester breakdown (assuming uniform reqAvg each sem)
  const semBreakdown = [];
  let remCr = remainingCredits, remPts = reqPoints;
  for (let n = lastSem + 1; n <= 8; n++) {
    const cr = SEM_CREDITS[n] || 0;
    const needed = remCr > 0 ? Math.min(10, Math.max(0, remPts / remCr)) : 0;
    semBreakdown.push({ sem: n, credits: cr, needed });
    remCr -= cr; remPts -= cr * needed;
  }

  // ASAP — earliest sem at which target is achievable (scoring 10 every sem)
  let asapSem = null, asapReqAvg = null;
  let runCr = completedCredits, runPts = completedPoints;
  for (let n = lastSem + 1; n <= 8; n++) {
    runCr += SEM_CREDITS[n] || 0;
    runPts += 10 * (SEM_CREDITS[n] || 0);
    if (runPts / TOTAL_CREDITS >= target) {
      let needPts = target * TOTAL_CREDITS - completedPoints;
      let needCr  = 0;
      for (let x = lastSem + 1; x <= n; x++) needCr += SEM_CREDITS[x] || 0;
      asapSem     = n;
      asapReqAvg  = Math.min(10, needPts / needCr);
      break;
    }
  }

  return {
    feasible: reqAvg <= 10,
    alreadySecured: reqAvg <= 0,
    reqAvg,
    currentCGPA,
    completedCredits,
    remainingCredits,
    lastSem,
    maxAchievable,
    semBreakdown,
    asapSem,
    asapReqAvg,
  };
}

/**
 * Grade predictor — how much needed in external (out of 60)
 * given current CIE and target grade point
 */
export function predictExternal(cieTot, targetGradePoint) {
  const minTotal = GRADE_BOUNDS[targetGradePoint] ?? 50;
  const needed   = Math.ceil(Math.max(0, minTotal - cieTot));
  return { needed, feasible: needed <= 60, cieTot, minTotal };
}

/** Attendance → marks (5-scale) */
export function attMarks(pct) {
  if (pct >= 85) return 5;
  if (pct >= 80) return 4;
  if (pct >= 75) return 3;
  if (pct >= 70) return 2;
  if (pct >= 65) return 1;
  return 0;
}
