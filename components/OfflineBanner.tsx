import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fontSizes, spacing } from '../theme/tokens';

export function OfflineBanner({ message }: { message: string }) {
  return (
    <View style={styles.banner}>
      <MaterialCommunityIcons
        name="wifi-off"
        size={14}
        color={colors.accent800}
        style={styles.icon}
      />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.s2,
    backgroundColor: colors.accent100,
    paddingVertical: spacing.s2 + 2,
    paddingHorizontal: spacing.s4 + 2,
  },
  icon: {
    marginTop: 1,
  },
  text: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.accent800,
  },
});
