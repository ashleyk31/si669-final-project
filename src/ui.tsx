import { Ionicons } from '@expo/vector-icons';
import { Link, router, usePathname } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from './theme';

export function Page({ children, scroll = true }: { children: React.ReactNode; scroll?: boolean }) {
  const pathname = usePathname();
  const body = <View style={styles.inner}>{children}</View>;
  return <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
    <View style={styles.header}>
      <Link href="/" style={styles.brand}>✳  pantryshare</Link>
      <Pressable accessibilityRole="button" accessibilityLabel="Open leftovers dashboard" onPress={() => router.push('/leftovers')} style={[styles.headerLink, pathname === '/leftovers' && styles.headerLinkActive]}>
        <Ionicons name="grid-outline" size={17} color={colors.green} />
        <Text style={styles.headerText}>Leftovers</Text>
      </Pressable>
    </View>
    {scroll ? <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>{body}</ScrollView> : body}
  </SafeAreaView>;
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <Text style={styles.eyebrow}>{children}</Text>;
}

export function ActionButton({ label, onPress, icon, secondary = false, disabled = false }: { label: string; onPress: () => void; icon?: keyof typeof Ionicons.glyphMap; secondary?: boolean; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, secondary ? styles.secondary : styles.primary, pressed && { opacity: 0.82 }, disabled && { opacity: 0.5 }]}>
    <Text style={[styles.buttonText, secondary && styles.secondaryText]}>{label}</Text>
    {icon ? <Ionicons name={icon} size={18} color={secondary ? colors.green : '#fff'} /> : null}
  </Pressable>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { width: '100%', maxWidth: 720, alignSelf: 'center', paddingHorizontal: 22, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { color: colors.green, fontWeight: '900', fontSize: 23, letterSpacing: -1.1 },
  headerLink: { borderRadius: 24, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 13, paddingVertical: 9, flexDirection: 'row', alignItems: 'center', gap: 7 },
  headerLinkActive: { backgroundColor: colors.greenSoft },
  headerText: { color: colors.green, fontWeight: '700', fontSize: 13 },
  scroll: { paddingBottom: 38 },
  inner: { width: '100%', maxWidth: 720, alignSelf: 'center', paddingHorizontal: 22 },
  eyebrow: { color: '#947144', fontSize: 11, fontWeight: '800', letterSpacing: 2.2, textTransform: 'uppercase' },
  button: { borderRadius: 17, minHeight: 56, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 13 },
  primary: { backgroundColor: colors.green },
  secondary: { backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.green },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  secondaryText: { color: colors.green },
});
