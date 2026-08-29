import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fontSizes, radii, spacing } from '../theme/tokens';
import { RootStackParamList } from '../types/navigation';
import { Pharmacy } from '../types/pharmacy';
import {
  callPharmacy,
  isValidCoordinate,
  isValidPhoneNumber,
  openDirections,
} from '../utils/actions';

function formatDistance(distanceM: number): string {
  const km = distanceM / 1000;
  return `${km.toFixed(1).replace('.', ',')} km`;
}

export function PharmacyRow({ pharmacy }: { pharmacy: Pharmacy }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const statusText = pharmacy.on_garde
    ? `Ouvert · ${formatDistance(pharmacy.distance_m)}`
    : formatDistance(pharmacy.distance_m);
  const canCall = !!pharmacy.phone && isValidPhoneNumber(pharmacy.phone);
  const callLabel = canCall ? 'Appeler' : pharmacy.phone ? 'Numéro invalide' : 'Numéro non disponible';
  const canNavigate = isValidCoordinate(pharmacy.latitude, pharmacy.longitude);

  return (
    <Pressable
      style={styles.row}
      onPress={() => navigation.navigate('PharmacyDetail', { pharmacy })}
    >
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {pharmacy.name}
        </Text>
        {pharmacy.on_garde && (
          <View style={styles.badge}>
            <Ionicons name="moon" size={11} color={colors.white} />
            <Text style={styles.badgeText}>garde</Text>
          </View>
        )}
      </View>

      <Text style={styles.status}>{statusText}</Text>

      <View style={styles.actions}>
        <Pressable
          style={[styles.outlineButton, !canNavigate && styles.disabledButton]}
          onPress={() => canNavigate && openDirections(pharmacy)}
          disabled={!canNavigate}
        >
          <Ionicons name="navigate-outline" size={13} color={colors.text} />
          <Text style={styles.outlineButtonText}>
            {canNavigate ? 'Itinéraire' : 'Position non disponible'}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filledButton, !canCall && styles.disabledButton]}
          onPress={() => canCall && callPharmacy(pharmacy.phone!)}
          disabled={!canCall}
        >
          <Ionicons name="call" size={13} color={colors.white} />
          <Text style={styles.filledButtonText}>{callLabel}</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: spacing.s4,
    paddingHorizontal: spacing.s4 + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s2,
  },
  name: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: colors.text,
    flexShrink: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    gap: 4,
    backgroundColor: colors.garde,
    borderRadius: radii.pill,
    paddingVertical: 3,
    paddingLeft: 7,
    paddingRight: 9,
  },
  badgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.xs,
    color: colors.white,
  },
  status: {
    marginTop: 5,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.textMuted55,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.s3 - 2,
    marginTop: spacing.s3,
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
    fontSize: fontSizes.sm,
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
    fontSize: fontSizes.sm,
    color: colors.white,
  },
});
