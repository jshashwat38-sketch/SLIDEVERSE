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

