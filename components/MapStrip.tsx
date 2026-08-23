import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts, fontSizes, radii, spacing } from '../theme/tokens';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export function MapStrip({
  onPress,
  label = 'aperçu carte',
  icon = 'map-outline',
}: {
  onPress?: () => void;
  label?: string;
  icon?: IoniconName;
}) {
  return (
    <Pressable style={styles.strip} onPress={onPress}>
      <Ionicons name={icon} size={15} color={colors.textMuted50} />
      <Text style={styles.text}>{label}</Text>
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
