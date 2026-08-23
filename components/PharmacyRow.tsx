import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Pharmacy } from '../types/pharmacy';

function formatDistance(distanceM: number): string {
  const km = distanceM / 1000;
  return `${km.toFixed(1).replace('.', ',')} km`;
}

export function PharmacyRow({ pharmacy }: { pharmacy: Pharmacy }) {
  const statusText = pharmacy.on_garde
    ? `Ouvert · ${formatDistance(pharmacy.distance_m)}`
    : formatDistance(pharmacy.distance_m);

  return (
    <View style={styles.row}>
      <View style={styles.header}>
        <Text style={styles.name}>{pharmacy.name}</Text>
        {pharmacy.on_garde && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🌙 De garde</Text>
          </View>
        )}
      </View>

      <Text style={styles.address}>{pharmacy.address}</Text>
      <Text style={styles.status}>{statusText}</Text>

      <View style={styles.actions}>
        <Pressable style={styles.actionButton} onPress={() => {}}>
          <Text style={styles.actionText}>Itinéraire</Text>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={() => {}}>
          <Text style={styles.actionText}>Appeler</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    flexShrink: 1,
  },
  badge: {
    backgroundColor: '#EEF2FF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3730A3',
  },
  address: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
  status: {
    fontSize: 13,
    color: '#333',
    marginTop: 4,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#222',
  },
});
