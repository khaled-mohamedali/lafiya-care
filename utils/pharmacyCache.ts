import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pharmacy } from '../types/pharmacy';

// Versioned so a future shape change can't crash on old cached data after
// an app update — bump this if the cached fields ever change meaningfully.
const CACHE_KEY_PREFIX = 'lafiya_care/pharmacies_cache_v1';

export interface PharmacyCache {
  pharmacies: Pharmacy[];
  fetchedAt: string;
}

interface Coords {
  latitude: number;
  longitude: number;
}

// Rounded to ~1km precision so GPS jitter between app launches keeps
// hitting the same cache entry, while an actual change of city/area (e.g.
// the dev override flipping, or genuinely moving) gets its own entry
// instead of showing stale results from a different location.
function cacheKeyFor({ latitude, longitude }: Coords): string {
  return `${CACHE_KEY_PREFIX}:${latitude.toFixed(2)}:${longitude.toFixed(2)}`;
}

export async function saveCachedPharmacies(coords: Coords, pharmacies: Pharmacy[]): Promise<void> {
  const cache: PharmacyCache = { pharmacies, fetchedAt: new Date().toISOString() };
  await AsyncStorage.setItem(cacheKeyFor(coords), JSON.stringify(cache));
}

export async function loadCachedPharmacies(coords: Coords): Promise<PharmacyCache | null> {
  try {
    const raw = await AsyncStorage.getItem(cacheKeyFor(coords));
    return raw ? (JSON.parse(raw) as PharmacyCache) : null;
  } catch {
    return null;
  }
}
