import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../theme';

export default function Button({ title, onPress, variant = 'primary', disabled, loading, style }) {
  const secondary = variant === 'secondary';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        secondary ? styles.secondary : styles.primary,
        (pressed || disabled) && styles.dimmed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={secondary ? colors.accentInk : colors.surface} />
      ) : (
        <Text style={[styles.label, secondary && styles.secondaryLabel]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', borderRadius: 14, justifyContent: 'center', minHeight: 48, paddingHorizontal: 18 },
  primary: { backgroundColor: colors.ink },
  secondary: { backgroundColor: colors.accentSoft },
  dimmed: { opacity: 0.6 },
  label: { color: colors.surface, fontSize: 15, fontWeight: '600' },
  secondaryLabel: { color: colors.accentInk },
});
