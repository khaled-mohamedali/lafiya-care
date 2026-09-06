import { useEffect, useState } from 'react';
import { DEV_LOCATION } from '../utils/devLocation';
import { loadLastKnownLocation, saveLastKnownLocation } from '../utils/lastKnownLocation';

interface Coords {
  latitude: number;
  longitude: number;
}

// Reused as the final fallback for search, not just the dev override — the
// pharmacies live in Niamey, so it's the only sane default when we have
// neither a live fix nor a remembered one yet.
const NIAMEY_DEFAULT = DEV_LOCATION;

// Resolves where the pharmacy search should run from, in priority order:
// live device coords (real GPS or the dev override, from useDeviceLocation)
// -> last-known location from a previous session -> the Niamey default.
// Never calls expo-location itself — deviceCoords must come from the one
// useDeviceLocation call the caller already made.
export function useSearchLocation(deviceCoords: Coords | null): Coords {
  const [lastKnown, setLastKnown] = useState<Coords | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadLastKnownLocation().then((saved) => {
      if (!cancelled) setLastKnown(saved);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (deviceCoords) saveLastKnownLocation(deviceCoords);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceCoords?.latitude, deviceCoords?.longitude]);

  return deviceCoords ?? lastKnown ?? NIAMEY_DEFAULT;
}
