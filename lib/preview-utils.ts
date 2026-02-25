/**
 * Shared utility functions for preview components.
 */

/**
 * Resolve a nested key path like "sprites.front_default" from an object.
 */
export function resolveKey(obj: Record<string, unknown>, path: string): unknown {
  return path
    .split(".")
    .reduce(
      (o, k) =>
        o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined,
      obj as unknown,
    );
}

/**
 * Format a field key for display: snake_case / camelCase -> Title Case.
 */
export function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

/**
 * Format a value for display: capitalize strings, localize numbers, etc.
 */
export function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return value.toLocaleString();
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string") {
    if (value.length > 0 && value.length < 200) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  }
  if (Array.isArray(value)) return `${value.length} items`;
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
