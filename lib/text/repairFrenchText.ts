const COMMON_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bdepistage\b/gi, "dépistage"],
  [/\bpsychometrique\b/gi, "psychométrique"],
  [/\bevaluation\b/gi, "évaluation"],
  [/\bsante\b/gi, "santé"],
  [/\bdetresse\b/gi, "détresse"],
  [/\bidees\b/gi, "idées"],
  [/\bgene\b/gi, "gêne"],
  [/\bdifficultes\b/gi, "difficultés"],
  [/\bdifficulte\b/gi, "difficulté"],
  [/\baccompagne\b/gi, "accompagné"],
  [/\bfacon\b/gi, "façon"],
  [/\betat\b/gi, "état"],
  [/\bseverite\b/gi, "sévérité"],
  [/\betait\b/gi, "était"],
  [/\btres\b/gi, "très"],
  [/\bleger\b/gi, "léger"],
  [/\bdifferents\b/gi, "différents"],
  [/\bobserves\b/gi, "observés"],
  [/\bmarque\b/gi, "marqué"],
  [/\bmodere\b/gi, "modéré"],
  [/\bsyndrome de gilles de la tourette\b/gi, "syndrome de Gilles de la Tourette"],
];

function fixMojibake(input: string): string {
  if (!/[ÃÂâ]/.test(input)) return input;
  try {
    const bytes = Uint8Array.from(input, (char) => char.charCodeAt(0) & 0xff);
    const decoded = new TextDecoder("utf-8").decode(bytes);
    const sourceArtifacts = (input.match(/[ÃÂâ]/g) ?? []).length;
    const decodedArtifacts = (decoded.match(/[ÃÂâ]/g) ?? []).length;
    return decodedArtifacts < sourceArtifacts ? decoded : input;
  } catch {
    return input;
  }
}

export function repairFrenchText(input: string): string {
  let text = fixMojibake(input);
  for (const [pattern, replacement] of COMMON_REPLACEMENTS) {
    text = text.replace(pattern, replacement);
  }
  return text;
}
