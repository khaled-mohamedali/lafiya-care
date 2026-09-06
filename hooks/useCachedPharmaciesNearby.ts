import { useEffect, useState } from 'react';
import { Pharmacy } from '../types/pharmacy';
import { loadCachedPharmacies, saveCachedPharmacies, PharmacyCache } from '../utils/pharmacyCache';
import { usePharmaciesNearby } from './usePharmaciesNearby';

type Status = 'loading' | 'success' | 'error' | 'empty';

interface Args {
  latitude: number;
  longitude: number;
  radiusM?: number;
}

interface Result {
  status: Status;
  pharmacies: Pharmacy[];
  error: string | null;
  refetch: () => void;
  // True when what's being shown right now came from AsyncStorage rather
  // than the network — e.g. offline with a previous session's data.
  isShowingCachedData: boolean;
  // When the currently-shown data was fetched, whether that's "just now"
  // (fresh) or an older session (stale). Null only when there's nothing
  // cached yet at all.
  cachedAt: string | null;
}

export function useCachedPharmaciesNearby({ latitude, longitude, radiusM }: Args): Result {
  const network = usePharmaciesNearby({ latitude, longitude, radiusM });
  const [cache, setCache] = useState<PharmacyCache | null>(null);

  // Load whatever a previous session left behind for this location, once
  // per location, on mount and whenever the search location changes.
  useEffect(() => {
    let cancelled = false;
    loadCachedPharmacies({ latitude, longitude }).then((result) => {
      if (!cancelled) setCache(result);
    });
    return () => {
      cancelled = true;
    };
  }, [latitude, longitude]);

  // Every time the network fetch produces a real answer (including a
  // legitimate empty result — that's data, not a failure), persist it and
  // treat it as the new cache immediately.
  useEffect(() => {
    if (network.status !== 'success' && network.status !== 'empty') return;
    const fetchedAt = new Date().toISOString();
    saveCachedPharmacies({ latitude, longitude }, network.pharmacies);
    setCache({ pharmacies: network.pharmacies, fetchedAt });
  }, [network.status, network.pharmacies, latitude, longitude]);

  // Fresh data always wins once the network has a real answer, cached or not.
  if (network.status === 'success' || network.status === 'empty') {
    return {
      status: network.status,
      pharmacies: network.pharmacies,
      error: null,
      refetch: network.refetch,
      isShowingCachedData: false,
      cachedAt: cache?.fetchedAt ?? null,
    };
  }

  // Network is still loading, or it just failed — but we have something
  // from a previous session (for this same location) to show instead of a
  // spinner or error screen.
  if (cache) {
    return {
      status: 'success',
      pharmacies: cache.pharmacies,
      error: null,
      refetch: network.refetch,
      isShowingCachedData: true,
      cachedAt: cache.fetchedAt,
    };
  }

  // No cache for this location (first launch, or it was never written) —
  // behave exactly like the uncached hook.
  return {
    status: network.status,
    pharmacies: network.pharmacies,
    error: network.error,
    refetch: network.refetch,
    isShowingCachedData: false,
    cachedAt: null,
  };
}
