export const CONTEXT_DELIMITER = '__ctx__';

export function applyContextToId(id: string, contextId?: string | null): string {
  return contextId ? `${id}${CONTEXT_DELIMITER}${contextId}` : id;
}

export function splitContextFromId(id: string): { baseId: string; contextId: string | null } {
  const parts = id.split(CONTEXT_DELIMITER);
  if (parts.length > 1) {
    return { baseId: parts.shift()!, contextId: parts.join(CONTEXT_DELIMITER) };
  }
  return { baseId: id, contextId: null };
}
