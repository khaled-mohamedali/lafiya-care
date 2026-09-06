import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { DEV_LOCATION, USE_DEV_LOCATION } from '../utils/devLocation';

interface Coords {
  latitude: number;
  longitude: number;
}

interface DeviceLocation {
  // Null means "not available yet" (loading, denied, or an error) — callers
  // should fall back to a sensible default rather than show nothing.
  label: string | null;
  // Null in the same cases as `label`, plus while `label` is still being
  // resolved from a successful fix — check this independently.
  coords: Coords | null;
}

export function useDeviceLocation(): DeviceLocation {
  const [label, setLabel] = useState<string | null>(null);
  const [coords, setCoords] = useState<Coords | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      let fix: Coords | null = null;

      if (USE_DEV_LOCATION) {
        fix = DEV_LOCATION;
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        try {
          const position = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          fix = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
        } catch {
          return;
        }
      }

      if (cancelled) return;
      setCoords(fix);

      try {
        const [place] = await Location.reverseGeocodeAsync(fix);
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

  return { label, coords };
}
