import { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/tokens';

interface Coords {
  latitude: number;
  longitude: number;
}

// A blue dot rather than a pin shape, so it's never mistaken for a
// pharmacy marker at a glance. Shared by every map that shows the user's
// live position, so there's one place to change how it looks.
export function UserLocationMarker({ coordinate }: { coordinate: Coords }) {
  return (
    <Marker coordinate={coordinate} title="Vous êtes ici" anchor={{ x: 0.5, y: 0.5 }}>
      <View style={styles.ring}>
        <View style={styles.dot} />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  ring: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(66, 133, 244, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4285f4',
    borderWidth: 2,
    borderColor: colors.white,
  },
});
