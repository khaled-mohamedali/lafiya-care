import MapView, { Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import { colors } from '../theme/tokens';
import { Pharmacy } from '../types/pharmacy';

const NIAMEY_LAT = 13.5137;
const NIAMEY_LNG = 2.1098;

interface Props {
  pharmacies: Pharmacy[];
  onMarkerPress: (pharmacy: Pharmacy) => void;
}

export function PharmacyMap({ pharmacies, onMarkerPress }: Props) {
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
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
