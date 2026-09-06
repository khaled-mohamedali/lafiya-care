import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Pharmacy } from '../types/pharmacy';

const DEFAULT_RADIUS_M = 5000;

type Status = 'loading' | 'success' | 'error' | 'empty';

interface State {
  status: Status;
  pharmacies: Pharmacy[];
  error: string | null;
}

interface Args {
  latitude: number;
  longitude: number;
  radiusM?: number;
}

export function usePharmaciesNearby({ latitude, longitude, radiusM = DEFAULT_RADIUS_M }: Args) {
  const [state, setState] = useState<State>({
    status: 'loading',
    pharmacies: [],
    error: null,
  });

  const fetchPharmacies = useCallback(async () => {
    setState({ status: 'loading', pharmacies: [], error: null });

    const { data, error } = await supabase.rpc('pharmacies_nearby', {
      user_lat: latitude,
      user_lng: longitude,
      radius_m: radiusM,
    });

    if (error) {
      setState({ status: 'error', pharmacies: [], error: error.message });
      return;
    }

    const pharmacies = (data ?? []) as Pharmacy[];
    setState({
      status: pharmacies.length === 0 ? 'empty' : 'success',
      pharmacies,
      error: null,
    });
  }, [latitude, longitude, radiusM]);

  useEffect(() => {
    fetchPharmacies();
  }, [fetchPharmacies]);

  return { ...state, refetch: fetchPharmacies };
}
