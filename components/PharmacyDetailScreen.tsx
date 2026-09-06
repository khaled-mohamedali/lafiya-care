import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDeviceLocation } from '../hooks/useDeviceLocation';
import { useIsOffline } from '../hooks/useIsOffline';
import { colors, fonts, fontSizes, radii, spacing } from '../theme/tokens';
import { RootStackParamList } from '../types/navigation';
import {
  callPharmacy,
  isValidCoordinate,
  isValidPhoneNumber,
  openDirections,
} from '../utils/actions';
import { formatGardeUntil, getOpenStatus, getTodayHoursText, getWeeklyHours } from '../utils/hours';
import { MapStrip } from './MapStrip';
import { OfflineBanner } from './OfflineBanner';
import { PharmacyRouteMap } from './PharmacyRouteMap';

function formatDistance(distanceM: number): string {
  const km = distanceM / 1000;
  return `${km.toFixed(1).replace('.', ',')} km`;
}

type Props = NativeStackScreenProps<RootStackParamList, 'PharmacyDetail'>;

export function PharmacyDetailScreen({ route, navigation }: Props) {
  const { pharmacy } = route.params;
  const isOffline = useIsOffline();
  const { coords: userLocation } = useDeviceLocation();
  const [isSaved, setIsSaved] = useState(false);
  const [showWeeklyHours, setShowWeeklyHours] = useState(false);

  const weeklyHours = getWeeklyHours(pharmacy.hours);
  const canCall = !!pharmacy.phone && isValidPhoneNumber(pharmacy.phone);
  const callLabel = canCall ? 'Appeler' : pharmacy.phone ? 'Numéro invalide' : 'Numéro non disponible';
  const canNavigate = isValidCoordinate(pharmacy.latitude, pharmacy.longitude);
  const isClosed = getOpenStatus(pharmacy.hours) === 'closed';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView>
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <Ionicons name="arrow-back" size={17} color={colors.textMuted60} />
          </Pressable>
          <Pressable onPress={() => setIsSaved((v) => !v)} hitSlop={8}>
            <Ionicons
              name={isSaved ? 'star' : 'star-outline'}
              size={17}
              color={isSaved ? colors.garde : colors.textMuted60}
            />
          </Pressable>
        </View>

        <View style={styles.header}>
          <Text style={styles.name}>{pharmacy.name}</Text>
          <View style={styles.badgeRow}>
            {pharmacy.on_garde && (
              <View style={styles.gardeBadge}>
                <Ionicons name="moon" size={12} color={colors.white} />
                <Text style={styles.gardeBadgeText}>garde</Text>
              </View>
            )}
            {isClosed && (
              <View style={styles.closedTag}>
                <Text style={styles.closedTagText}>Fermé</Text>
              </View>
            )}
            <View style={styles.verifiedBadge}>
              <Ionicons name="shield-checkmark-outline" size={12} color={colors.textMuted55} />
              <Text style={styles.verifiedBadgeText}>vérifiée</Text>
            </View>
            <Text style={styles.distance}>{formatDistance(pharmacy.distance_m)}</Text>
          </View>
        </View>

        {isOffline && (
          <OfflineBanner message="Données du 15:00 · appelez pour confirmer" />
        )}

        <View style={styles.section}>
          <View style={styles.hoursRow}>
            <Ionicons name="time-outline" size={15} color={colors.text} />
            <Text style={styles.hoursText}>{getTodayHoursText(pharmacy.hours)}</Text>
          </View>
          {pharmacy.on_garde && pharmacy.garde_until && (
            <Text style={styles.gardeUntilText}>
              De garde jusqu'au {formatGardeUntil(pharmacy.garde_until)}
            </Text>
          )}
          <Pressable
            style={styles.weeklyToggle}
            onPress={() => setShowWeeklyHours((v) => !v)}
          >
            <Text style={styles.weeklyToggleText}>Horaires de la semaine</Text>
            <Ionicons
              name={showWeeklyHours ? 'chevron-up' : 'chevron-down'}
              size={12}
              color={colors.textMuted55}
            />
          </Pressable>
          {showWeeklyHours && (
            <View style={styles.weeklyList}>
              {weeklyHours.map((day) => (
                <View key={day.label} style={styles.weeklyRow}>
                  <Text style={styles.weeklyDay}>{day.label}</Text>
                  <Text style={styles.weeklyValue}>{day.value}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={14} color={colors.textMuted60} />
            <Text style={styles.addressText}>
              {pharmacy.address || 'Adresse non disponible'}
            </Text>
          </View>
          {canNavigate ? (
            <PharmacyRouteMap
              pharmacy={{ latitude: pharmacy.latitude, longitude: pharmacy.longitude }}
              pharmacyName={pharmacy.name}
              onGarde={pharmacy.on_garde}
              userLocation={userLocation}
            />
          ) : (
            <MapStrip />
          )}
        </View>

        <View style={styles.actionsSection}>
          <Pressable
            style={[styles.outlineButton, !canNavigate && styles.disabledButton]}
            onPress={() => canNavigate && openDirections(pharmacy)}
            disabled={!canNavigate}
          >
            <Ionicons name="navigate-outline" size={14} color={colors.text} />
            <Text style={styles.outlineButtonText}>
              {canNavigate ? 'Itinéraire' : 'Position non disponible'}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.filledButton, !canCall && styles.disabledButton]}
            onPress={() => canCall && callPharmacy(pharmacy.phone!)}
            disabled={!canCall}
          >
            <Ionicons name="call" size={14} color={colors.white} />
            <Text style={styles.filledButtonText}>{callLabel}</Text>
          </Pressable>
        </View>

        <View style={styles.dormantSection}>
          <View style={styles.dormantRow}>
            <MaterialCommunityIcons name="pill" size={14} color={colors.text} />
            <Text style={styles.dormantTitle}>Médicaments en stock</Text>
          </View>
          <Text style={styles.dormantSubtitle}>Phase 2 — emplacement inactif</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.s4 + 2,
    paddingTop: spacing.s2,
    paddingBottom: spacing.s3 + 2,
  },
  header: {
    paddingHorizontal: spacing.s4 + 2,
    paddingBottom: spacing.s3 + 2,
  },
  name: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: colors.text,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.s2,
    marginTop: spacing.s2 + 2,
  },
  gardeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.garde,
    borderRadius: radii.pill,
    paddingVertical: 3,
    paddingLeft: 7,
    paddingRight: 9,
  },
  gardeBadgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.xs,
    color: colors.white,
  },
  closedTag: {
    backgroundColor: colors.closed,
    borderRadius: radii.pill,
    paddingVertical: 3,
    paddingHorizontal: 9,
  },
  closedTagText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.xs,
    color: colors.white,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radii.pill,
    paddingVertical: 3,
    paddingHorizontal: 9,
  },
  verifiedBadgeText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colors.textMuted55,
  },
  distance: {
    marginLeft: 'auto',
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.textMuted55,
  },
  section: {
    paddingHorizontal: spacing.s4 + 2,
    paddingVertical: spacing.s4,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s2,
  },
  hoursText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.smd,
    color: colors.text,
  },
  gardeUntilText: {
    marginTop: 4,
    marginLeft: 23,
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.sm,
    color: colors.garde,
  },
  weeklyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.s2,
    marginLeft: 23,
  },
  weeklyToggleText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colors.textMuted55,
  },
  weeklyList: {
    marginTop: spacing.s3,
    marginLeft: 23,
    gap: 6,
  },
  weeklyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weeklyDay: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.textMuted60,
  },
  weeklyValue: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.sm,
    color: colors.text,
  },
  addressRow: {
    flexDirection: 'row',
    gap: spacing.s2,
  },
  addressText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.textMuted60,
  },
  actionsSection: {
    flexDirection: 'row',
    gap: spacing.s3 - 2,
    paddingHorizontal: spacing.s4 + 2,
    paddingVertical: spacing.s4,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  outlineButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.text,
    borderRadius: radii.pill,
    paddingVertical: spacing.s3,
  },
  outlineButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.smd,
    color: colors.text,
  },
  filledButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    paddingVertical: spacing.s3,
  },
  disabledButton: {
    opacity: 0.45,
  },
  filledButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.smd,
    color: colors.white,
  },
  dormantSection: {
    paddingHorizontal: spacing.s4 + 2,
    paddingVertical: spacing.s4,
    opacity: 0.45,
  },
  dormantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s2,
  },
  dormantTitle: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.text,
  },
  dormantSubtitle: {
    marginTop: 5,
    marginLeft: 22,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colors.textMuted55,
  },
});
