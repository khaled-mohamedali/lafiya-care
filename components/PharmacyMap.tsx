import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/tokens';
import { Pharmacy } from '../types/pharmacy';

const NIAMEY_LAT = 13.5137;
const NIAMEY_LNG = 2.1098;

interface Props {
  pharmacies: Pharmacy[];
  onMarkerPress: (pharmacy: Pharmacy) => void;
  // Null when location is unavailable (permission denied, no fix yet, or an
  // error) — the map still renders normally, just without this pin.
  userLocation?: { latitude: number; longitude: number } | null;
}

export function PharmacyMap({ pharmacies, onMarkerPress, userLocation }: Props) {
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: NIAMEY_LAT,
        longitude: NIAMEY_LNG,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {pharmacies.map((pharmacy) => (
        <Marker
          key={pharmacy.id}
          coordinate={{ latitude: pharmacy.latitude, longitude: pharmacy.longitude }}
          title={pharmacy.name}
          description={pharmacy.on_garde ? 'De garde' : undefined}
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
  );
}

const styles = StyleSheet.create({
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
});
