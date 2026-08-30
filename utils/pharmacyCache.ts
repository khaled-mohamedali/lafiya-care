import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pharmacy } from '../types/pharmacy';

// Versioned so a future shape change can't crash on old cached data after
// an app update — bump this if the cached fields ever change meaningfully.
const CACHE_KEY = 'lafiya_care/pharmacies_cache_v1';

export interface PharmacyCache {
  pharmacies: Pharmacy[];
  fetchedAt: string;
}

export async function saveCachedPharmacies(pharmacies: Pharmacy[]): Promise<void> {
  const cache: PharmacyCache = { pharmacies, fetchedAt: new Date().toISOString() };
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

export async function loadCachedPharmacies(): Promise<PharmacyCache | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as PharmacyCache) : null;
  } catch {
    return null;
  }
}
