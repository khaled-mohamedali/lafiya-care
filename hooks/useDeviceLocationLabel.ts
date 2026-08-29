import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

// Null means "not available yet" (loading, denied, or an error) — callers
// should fall back to a sensible default rather than show nothing.
export function useDeviceLocationLabel(): string | null {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      try {
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const [place] = await Location.reverseGeocodeAsync({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        if (cancelled || !place) return;

        const city = place.city ?? place.subregion ?? place.region;
        const district = place.district ?? place.street;
        if (city) {
          setLabel(district ? `${city} · ${district}` : city);
        }
      } catch {
        // Leave label null — caller falls back to its default.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return label;
}
