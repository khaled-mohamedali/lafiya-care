import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { usePharmaciesNearby } from '../hooks/usePharmaciesNearby';
import { PharmacyRow } from './PharmacyRow';

export function HomeScreen() {
  const { status, pharmacies, error, refetch } = usePharmaciesNearby();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.headerBar}>
        <Text style={styles.title}>Rechercher une pharmacie</Text>
      </View>

      {status === 'loading' && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {status === 'error' && (
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            Une erreur est survenue lors du chargement des pharmacies.
          </Text>
          {error && <Text style={styles.errorDetail}>{error}</Text>}
          <Pressable style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryText}>Réessayer</Text>
          </Pressable>
        </View>
      )}

      {status === 'empty' && (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Aucune pharmacie à proximité</Text>
        </View>
      )}

      {status === 'success' && (
        <FlatList
          data={pharmacies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PharmacyRow pharmacy={item} />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F8',
  },
  headerBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 24,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  errorDetail: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3730A3',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
  },
});
