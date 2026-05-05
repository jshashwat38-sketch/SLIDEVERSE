/**
 * Safely extracts a string from a potentially multi-language object
 * @param data The data which could be a string or an object { en: string, hi: string, ... }
 * @param language The preferred language code
 * @returns A string
 */
export function getLangString(data: unknown, language: string = 'en'): string {
  if (!data) return "";
  if (typeof data === 'string') return data;
  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, any>;
    return obj[language] || obj.en || Object.values(obj)[0] || "";
  }
  return String(data);
}

/**
 * Splits a title and wraps the second half in a primary color span
 * @param title The title string
 * @returns HTML string with dual-tone formatting
 */
export function renderDualToneTitle(title: string): string {
  if (!title) return "";
  const words = title.trim().split(/\s+/);
  if (words.length <= 1) return title;
  const halfGold = Math.ceil(words.length / 2);
  const firstHalf = words.slice(0, words.length - halfGold).join(" ");
  const secondHalf = words.slice(words.length - halfGold).join(" ");
  return `${firstHalf} <span class="text-primary neon-text">${secondHalf}</span>`;
}
