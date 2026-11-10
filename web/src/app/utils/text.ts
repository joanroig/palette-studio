export const toTitleCase = (value: string) =>
  value
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((chunk) => chunk[0]?.toUpperCase() + chunk.slice(1))
    .join(" ");

export const sanitizeFileName = (name: string) => name.replace(/[^a-z0-9-_]+/gi, "-").replace(/^-+|-+$/g, "") || "palette";

/*
 * Palette and color names are typed by the user, and the picture exports paste them straight into
 * SVG and into the print window's markup. An ampersand in a name is enough to make an SVG that no
 * renderer will open, so nothing goes into a document unescaped.
 */
export const escapeMarkup = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Names are drawn into fixed-width cells that cannot reflow, so an over-long one is cut, not wrapped. */
export const truncateLabel = (value: string, maxChars: number) =>
  value.length > maxChars ? `${value.slice(0, Math.max(1, maxChars - 1)).trimEnd()}…` : value;

export const toCssVarName = (name: string, index: number) => {
  // Names with no Latin letters or digits at all (Chinese, Japanese, …) sanitize to nothing; they get
  // the positional fallback rather than sanitizeFileName's generic "palette".
  const ascii = /[a-z0-9]/i.test(name) ? sanitizeFileName(name).toLowerCase() : "";
  const base = ascii || `color-${index + 1}`;
  const trimmed = base.replace(/^-+/, "");
  return /^[a-z]/i.test(trimmed) ? trimmed : `color-${trimmed}`;
};

/**
 * One variable name per color, all distinct. Two colors can share a name ("Sky Blue" twice, or two
 * names that sanitize alike), and a repeated key in CSS or a Tailwind config silently keeps only the
 * last value, so later repeats get a numeric suffix instead.
 */
export const toUniqueCssVarNames = (names: string[]) => {
  const used = new Set<string>();
  return names.map((name, index) => {
    const base = toCssVarName(name, index);
    let candidate = base;
    let suffix = 2;
    while (used.has(candidate)) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
    }
    used.add(candidate);
    return candidate;
  });
};
