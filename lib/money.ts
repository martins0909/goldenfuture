export function readKobo(record: Record<string, unknown>, field: string, optional = false): number {
  const value = record[field];
  if (value === undefined || value === null) {
    if (optional) return 0;
    throw new Error(`Missing required monetary field: ${field}`);
  }
  if (typeof value !== 'number' || !Number.isSafeInteger(value)) {
    throw new Error(`Monetary field ${field} must be a safe integer number of kobo.`);
  }
  return value;
}

export function addKobo(total: number, value: number): number {
  const result = total + value;
  if (!Number.isSafeInteger(result)) {
    throw new Error('A financial total exceeded the safe integer range for kobo.');
  }
  return result;
}

export function subtractKobo(total: number, value: number): number {
  return addKobo(total, -value);
}
