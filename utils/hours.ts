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

const FRENCH_MONTHS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];

// Parses "YYYY-MM-DD" by hand rather than via `Date`, so the result can't
// shift by a day when rendered under a different timezone than the date
// was issued in (see the Niamey-vs-device-timezone note above).
export function formatGardeUntil(dateStr: string): string {
  const [, monthStr, dayStr] = dateStr.split('-');
  const day = parseInt(dayStr, 10);
  const month = FRENCH_MONTHS[parseInt(monthStr, 10) - 1];
  return `${day} ${month}`;
}

function todayDateStringInNiamey(): string {
  // en-CA formats as YYYY-MM-DD, matching the RPC's date columns so the
  // two can be compared as plain strings.
  return new Date().toLocaleDateString('en-CA', { timeZone: NIAMEY_TZ });
}

// Groundwork for offline caching: whether a cached garde_until is still
// within its period ("fresh") or the period has already ended ("stale").
// Not wired into any UI yet.
export function isGardeInfoFresh(gardeUntil: string | null): boolean {
  if (!gardeUntil) return false;
  return todayDateStringInNiamey() <= gardeUntil;
}
