import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fontSizes, radii, spacing } from '../theme/tokens';

export function MapStrip({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable style={styles.strip} onPress={onPress}>
      <Ionicons name="map-outline" size={15} color={colors.textMuted50} />
      <Text style={styles.text}>aperçu carte</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  strip: {
    height: 56,
    marginHorizontal: spacing.s4 + 2,
    marginTop: spacing.s3,
    backgroundColor: colors.surface,
    borderRadius: radii.map,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  text: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.textMuted50,
  },
});
