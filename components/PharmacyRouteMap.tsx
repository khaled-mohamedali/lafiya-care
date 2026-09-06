import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import { colors, radii, spacing } from '../theme/tokens';
import { UserLocationMarker } from './UserLocationMarker';

interface Coords {
  latitude: number;
  longitude: number;
}

interface Props {
  pharmacy: Coords;
  pharmacyName: string;
  onGarde: boolean;
  // Null when location is unavailable (permission denied, no fix yet, or an
  // error) — the map still shows the pharmacy, just without the user's pin
  // or the line between them.
  userLocation: Coords | null;
}

// A straight line between the two points, not a real routed path — good
// enough for an at-a-glance "which direction and how far", without needing
// a Directions API key/billing.
export function PharmacyRouteMap({ pharmacy, pharmacyName, onGarde, userLocation }: Props) {
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (!userLocation) return;
    mapRef.current?.fitToCoordinates([pharmacy, userLocation], {
      edgePadding: { top: 32, right: 32, bottom: 32, left: 32 },
      animated: false,
    });
    // Re-fit only when the two points actually move, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pharmacy.latitude, pharmacy.longitude, userLocation?.latitude, userLocation?.longitude]);

  const initialRegion: Region = {
    ...pharmacy,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        <Marker
          coordinate={pharmacy}
          title={pharmacyName}
          pinColor={onGarde ? colors.garde : colors.accent}
        />
        {userLocation && (
          <>
            <UserLocationMarker coordinate={userLocation} />
            <Polyline
              coordinates={[userLocation, pharmacy]}
              strokeColor={colors.accent}
              strokeWidth={3}
              lineDashPattern={[8, 6]}
            />
          </>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 160,
    marginTop: spacing.s3,
    borderRadius: radii.map,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
});
