import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import MapView, { Marker, Region } from "react-native-maps";
import { Pressable, StyleSheet, View } from "react-native";
import { colors, radii, spacing } from "../theme/tokens";
import { Pharmacy } from "../types/pharmacy";

const NIAMEY_LAT = 13.5137;
const NIAMEY_LNG = 2.1098;

const DEFAULT_REGION: Region = {
  latitude: NIAMEY_LAT,
  longitude: NIAMEY_LNG,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

// Smaller delta = more zoomed in. Clamped so repeated taps can't zoom past
// street level or out past the whole city.
const MIN_DELTA = 0.003;
const MAX_DELTA = 0.3;

interface Props {
  pharmacies: Pharmacy[];
  onMarkerPress: (pharmacy: Pharmacy) => void;
  // Null when location is unavailable (permission denied, no fix yet, or an
  // error) — the map still renders normally, just without this pin.
  userLocation?: { latitude: number; longitude: number } | null;
}

export function PharmacyMap({ pharmacies, onMarkerPress, userLocation }: Props) {
  const mapRef = useRef<MapView>(null);
  // Mirrors the map's live region so zoom taps adjust from wherever the
  // user has panned/zoomed to, not back from the initial region each time.
  const regionRef = useRef<Region>(DEFAULT_REGION);

  const zoomBy = (factor: number) => {
    const current = regionRef.current;
    const next: Region = {
      ...current,
      latitudeDelta: clamp(
        current.latitudeDelta * factor,
        MIN_DELTA,
        MAX_DELTA,
      ),
      longitudeDelta: clamp(
        current.longitudeDelta * factor,
        MIN_DELTA,
        MAX_DELTA,
      ),
    };
    mapRef.current?.animateToRegion(next, 200);
  };

  const recenter = () => {
    mapRef.current?.animateToRegion(DEFAULT_REGION, 300);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        onRegionChangeComplete={(region) => {
          regionRef.current = region;
        }}
      >
        {pharmacies.map((pharmacy) => (
          <Marker
            key={pharmacy.id}
            coordinate={{
              latitude: pharmacy.latitude,
              longitude: pharmacy.longitude,
            }}
            title={pharmacy.name}
            description={pharmacy.on_garde ? "De garde" : undefined}
            pinColor={pharmacy.on_garde ? colors.garde : colors.accent}
            onPress={() => onMarkerPress(pharmacy)}
          />
        ))}

        {userLocation && (
          <Marker coordinate={userLocation} title="Vous êtes ici" anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.userDotRing}>
              <View style={styles.userDot} />
            </View>
          </Marker>
        )}
      </MapView>

      <View style={styles.zoomControls}>
        <Pressable
          style={styles.zoomButton}
          onPress={() => zoomBy(0.5)}
          hitSlop={8}
        >
          <Ionicons name="add" size={20} color={colors.text} />
        </Pressable>
        <View style={styles.zoomDivider} />
        <Pressable
          style={styles.zoomButton}
          onPress={() => zoomBy(2)}
          hitSlop={8}
        >
          <Ionicons name="remove" size={20} color={colors.text} />
        </Pressable>
      </View>

      <Pressable style={styles.recenterButton} onPress={recenter} hitSlop={8}>
        <Ionicons name="locate" size={18} color={colors.text} />
      </Pressable>
    </View>
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  // A blue dot rather than a pin shape, so it's never mistaken for a
  // pharmacy marker at a glance.
  userDotRing: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(66, 133, 244, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4285f4',
    borderWidth: 2,
    borderColor: colors.white,
  },
  zoomControls: {
    position: "absolute",
    top: spacing.s4,
    right: spacing.s4,
    backgroundColor: colors.white,
    borderRadius: radii.map,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  zoomButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  zoomDivider: {
    height: 1,
    backgroundColor: colors.divider,
  },
  recenterButton: {
    position: "absolute",
    bottom: spacing.s4,
    right: spacing.s4,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
