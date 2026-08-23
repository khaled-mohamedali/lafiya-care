import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Pharmacy } from '../types/pharmacy';

// Hardcoded to Niamey, Niger for this milestone — device GPS comes later.
const NIAMEY_LAT = 13.5137;
const NIAMEY_LNG = 2.1098;
const DEFAULT_RADIUS_M = 5000;

type Status = 'loading' | 'success' | 'error' | 'empty';

interface State {
  status: Status;
  pharmacies: Pharmacy[];
  error: string | null;
}

export function usePharmaciesNearby() {
  const [state, setState] = useState<State>({
    status: 'loading',
    pharmacies: [],
    error: null,
  });

  const fetchPharmacies = useCallback(async () => {
    setState({ status: 'loading', pharmacies: [], error: null });

    const { data, error } = await supabase.rpc('pharmacies_nearby', {
      user_lat: NIAMEY_LAT,
      user_lng: NIAMEY_LNG,
      radius_m: DEFAULT_RADIUS_M,
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
  }, []);

  useEffect(() => {
    fetchPharmacies();
  }, [fetchPharmacies]);

  return { ...state, refetch: fetchPharmacies };
}
