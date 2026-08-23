import { Ionicons } from '@expo/vector-icons';
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
import { useIsOffline } from '../hooks/useIsOffline';
import { usePharmaciesNearby } from '../hooks/usePharmaciesNearby';
import { colors, fonts, fontSizes, radii, spacing } from '../theme/tokens';
import { MapStrip } from './MapStrip';
import { OfflineBanner } from './OfflineBanner';
import { PharmacyRow } from './PharmacyRow';

export function HomeScreen() {
  const { status, pharmacies, error, refetch } = usePharmaciesNearby();
  const isOffline = useIsOffline();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={15} color={colors.textMuted60} />
        <Text style={styles.locationText}>Niamey · Plateau</Text>
        <Ionicons
          name="chevron-down"
          size={14}
          color={colors.textMuted60}
          style={styles.locationChevron}
        />
      </View>

      <View style={styles.searchField}>
        <Ionicons name="search" size={15} color={colors.textMuted55} />
        <Text style={styles.searchPlaceholder}>Rechercher une pharmacie</Text>
      </View>

      {isOffline && (
        <OfflineBanner message="Données du 15:00 · garde peut-être obsolète" />
      )}

      <MapStrip />

      <View style={styles.filterRow}>
        <Pressable style={styles.gardeChip}>
          <Ionicons name="moon" size={13} color={colors.white} />
          <Text style={styles.gardeChipText}>De garde</Text>
        </Pressable>
        <Pressable style={styles.allChip}>
          <Text style={styles.allChipText}>Toutes</Text>
        </Pressable>
        <View style={styles.viewToggle}>
          <Ionicons name="list" size={15} color={colors.textMuted50} />
          <Text style={styles.viewToggleSlash}>/</Text>
          <Ionicons name="map-outline" size={15} color={colors.textMuted50} />
        </View>
      </View>

      <View style={styles.majorDivider} />

      {status === 'loading' && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent} />
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
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.s4 + 2,
    paddingTop: spacing.s3,
  },
  locationText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.smd,
    color: colors.textMuted60,
  },
  locationChevron: {
    marginLeft: 'auto',
  },
  searchField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s2,
    marginHorizontal: spacing.s4 + 2,
    marginTop: spacing.s3,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingVertical: 11,
    paddingHorizontal: spacing.s4,
  },
  searchPlaceholder: {
    fontFamily: fonts.body,
    fontSize: fontSizes.smd,
    color: colors.textMuted55,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s2,
    paddingHorizontal: spacing.s4 + 2,
    paddingVertical: spacing.s3 + 2,
  },
  gardeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.garde,
    borderRadius: radii.pill,
    paddingVertical: spacing.s2,
    paddingHorizontal: spacing.s4,
  },
  gardeChipText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.sm,
    color: colors.white,
  },
  allChip: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radii.pill,
    paddingVertical: spacing.s2,
    paddingHorizontal: spacing.s4,
  },
  allChipText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.textMuted60,
  },
  viewToggle: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  viewToggleSlash: {
    fontFamily: fonts.body,
    fontSize: fontSizes.smd,
    color: colors.textMuted50,
  },
  majorDivider: {
    borderTopWidth: 2,
    borderTopColor: colors.divider,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.s6,
  },
  errorText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.smd,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  errorDetail: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.textMuted55,
    textAlign: 'center',
    marginBottom: spacing.s4,
  },
  retryButton: {
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.s6,
    paddingVertical: spacing.s3,
  },
  retryText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.sm,
    color: colors.white,
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.smd,
    color: colors.textMuted60,
    textAlign: 'center',
  },
});
