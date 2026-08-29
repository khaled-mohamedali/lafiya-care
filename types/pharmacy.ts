export type PharmacyHours = Record<string, unknown>;

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  hours: PharmacyHours | null;
  distance_m: number;
  on_garde: boolean;
  garde_until: string | null;
  latitude: number;
  longitude: number;
}
