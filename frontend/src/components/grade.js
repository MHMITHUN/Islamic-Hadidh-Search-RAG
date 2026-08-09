export function gradeBadgeClass(grade) {
  const g = (grade || "").toLowerCase();
  if (g.startsWith("sahih")) return "grade-badge grade-sahih";
  if (g.startsWith("hasan")) return "grade-badge grade-hasan";
  if (g.startsWith("da")) return "grade-badge grade-daiif";
  if (g.startsWith("mawdu")) return "grade-badge grade-mawdu";
  return "grade-badge grade-other";
}

export const GRADE_LABEL = {
  Sahih: "Sahih",
  Hasan: "Hasan",
  "Da'if": "Da'if",
  Mawdu: "Mawdu",
  Other: "Unverified",
};
