import { Pharmacy } from '../types/pharmacy';

const DIACRITICS_PATTERN = /[\u0300-\u036f]/g;

// Strips accents so "ecoles" matches "Écoles" — French place names are full
// of diacritics that users won't reliably type.
function normalize(text: string): string {
  return text.normalize('NFD').replace(DIACRITICS_PATTERN, '').toLowerCase();
}

export function matchesQuery(pharmacy: Pharmacy, query: string): boolean {
  const needle = normalize(query.trim());
  if (!needle) return true;

  return (
    normalize(pharmacy.name).includes(needle) ||
    normalize(pharmacy.address).includes(needle)
  );
}
