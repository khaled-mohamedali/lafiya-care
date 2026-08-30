// Dev-only override for "my location" features (currently: the map view's
// user pin). Our seed data is all in Niamey, but development happens from
// Charlotte, NC (see kickoff brief) — with this on, the device's real GPS
// is never touched and the fixed Niamey point is used instead, so there's
// something visible near the pharmacies while testing.
//
// Flip to false before shipping to real users.
export const USE_DEV_LOCATION = true;

export const DEV_LOCATION = {
  latitude: 13.5137,
  longitude: 2.1098,
};
