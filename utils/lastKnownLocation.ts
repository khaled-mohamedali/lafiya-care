import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'lafiya_care/last_known_location_v1';

interface Coords {
  latitude: number;
  longitude: number;
}

// Not a location source of its own — just remembers the last real fix
// useDeviceLocation obtained, so search has something better than the
// Niamey default while a fresh fix is still resolving (or unavailable).
export async function saveLastKnownLocation(coords: Coords): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(coords));
}

export async function loadLastKnownLocation(): Promise<Coords | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Coords) : null;
  } catch {
    return null;
  }
}
