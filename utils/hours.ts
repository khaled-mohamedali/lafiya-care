import { PharmacyHours } from '../types/pharmacy';

// Pharmacies are all in Niamey — compute "today" in that timezone, not the
// device's, since testing happens from Charlotte, NC (see kickoff brief).
const NIAMEY_TZ = 'Africa/Niamey';

// Indexed to match JS Date#getDay() (Sunday = 0).
const WEEKDAY_INDEX_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

// Display order for the weekly hours expander (Monday first).
const DISPLAY_ORDER_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const DAY_LABELS: Record<string, string> = {
  mon: 'Lundi',
  tue: 'Mardi',
  wed: 'Mercredi',
  thu: 'Jeudi',
  fri: 'Vendredi',
  sat: 'Samedi',
  sun: 'Dimanche',
};

function todayKeyInNiamey(): string {
  const weekdayIndex = new Date(
    new Date().toLocaleString('en-US', { timeZone: NIAMEY_TZ })
  ).getDay();
  return WEEKDAY_INDEX_KEYS[weekdayIndex];
}

function rangeFor(hours: PharmacyHours | null, dayKey: string): string | null {
  const value = hours?.[dayKey];
  return typeof value === 'string' ? value : null;
}

export function getTodayHoursText(hours: PharmacyHours | null): string {
  const range = rangeFor(hours, todayKeyInNiamey());
  return range ? `Aujourd'hui · ${range}` : 'Horaires non disponibles';
}

export function getWeeklyHours(hours: PharmacyHours | null): { label: string; value: string }[] {
  return DISPLAY_ORDER_KEYS.map((key) => ({
    label: DAY_LABELS[key],
    value: rangeFor(hours, key) ?? 'Fermé',
  }));
}
