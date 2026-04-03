/** Normalize tutorial `content` jsonb (stringified JSON or object) for section components */
export function asTutorialContentRecord(content: unknown): Record<string, unknown> {
  if (content != null && typeof content === 'object' && !Array.isArray(content)) {
    return content as Record<string, unknown>;
  }
  if (typeof content === 'string') {
    try {
      const parsed: unknown = JSON.parse(content);
      if (parsed != null && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      /* treat as non-JSON string */
    }
  }
  return {};
}
