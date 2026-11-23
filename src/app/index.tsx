import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useListings } from '../listings';
import { colors } from '../theme';
import { ActionButton, Eyebrow, Page } from '../ui';

export default function Home() {
  const { listings } = useListings();
  return <Page>
    <View style={styles.hero}>
      <View style={styles.heroCopy}>
        <Eyebrow>GOOD FOOD. GOOD NEIGHBORS.</Eyebrow>
        <Text style={styles.title}>More to share.{"\n"}<Text style={styles.titleAccent}>Less to waste.</Text></Text>
        <Text style={styles.description}>That extra portion can make someone’s day. Share food from your kitchen with people nearby before it goes to waste.</Text>
        <ActionButton label="I have leftovers" icon="arrow-forward" onPress={() => router.push('/share')} />
        <ActionButton label="Browse leftovers" icon="grid-outline" secondary onPress={() => router.push('/leftovers')} />
      </View>
      <View style={styles.illustration} accessible accessibilityLabel="Illustration of food being shared">
        <View style={styles.blobA} /><View style={styles.blobB} />
        <View style={styles.plate}><Text style={styles.food}>🥗</Text></View>
        <View style={styles.floating}><Text style={styles.floatingText}>Made to share  ♡</Text></View>
      </View>
    </View>
    <View style={styles.sectionHeader}>
      <View><Eyebrow>THE COMMUNITY TABLE</Eyebrow><Text style={styles.sectionTitle}>Something good is nearby</Text></View>
      <Ionicons name="sparkles-outline" size={24} color={colors.green} />
    </View>
    <View style={styles.statsRow}>
      <View style={styles.stat}><Text style={styles.statIcon}>🥕</Text><Text style={styles.statNumber}>{listings.length}</Text><Text style={styles.statLabel}>foods to share</Text></View>
      <View style={styles.stat}><Text style={styles.statIcon}>🤝</Text><Text style={styles.statNumber}>1</Text><Text style={styles.statLabel}>community table</Text></View>
    </View>
    <View style={styles.note}><Ionicons name="heart-outline" size={20} color={colors.green} /><Text style={styles.noteText}>A small share can make a big difference. Start with what you already have.</Text></View>
  </Page>;
}

const styles = StyleSheet.create({
  hero: { backgroundColor: '#E8EFDF', borderRadius: 29, overflow: 'hidden', marginTop: 12 },
  heroCopy: { padding: 27, paddingTop: 38, gap: 15, zIndex: 1 },
  title: { color: colors.green, fontSize: 43, lineHeight: 49, letterSpacing: -2.4, fontWeight: '900' },
  titleAccent: { color: '#B16D3D' },
  description: { color: '#4B6050', fontSize: 16, lineHeight: 25, marginBottom: 6, maxWidth: 510 },
  illustration: { height: 195, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  blobA: { position: 'absolute', width: 300, height: 190, borderRadius: 150, backgroundColor: '#C8DFBA', transform: [{ rotate: '-17deg' }], right: -35, bottom: -85 },
  blobB: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: '#F7D4A1', left: -56, top: 30 },
  plate: { width: 165, height: 165, borderRadius: 90, backgroundColor: '#fff', borderWidth: 8, borderColor: '#F7F3E8', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-10deg' }], elevation: 8, shadowColor: '#38533B', shadowOpacity: 0.15, shadowRadius: 15, shadowOffset: { width: 0, height: 9 } },
  food: { fontSize: 91 },
  floating: { position: 'absolute', right: 20, bottom: 25, backgroundColor: '#fff', borderRadius: 18, paddingHorizontal: 16, paddingVertical: 12, transform: [{ rotate: '6deg' }] },
  floatingText: { color: colors.green, fontWeight: '800', fontSize: 13 },
  sectionHeader: { marginTop: 34, marginBottom: 17, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: colors.ink, fontSize: 23, fontWeight: '800', marginTop: 8, letterSpacing: -0.6 },
  statsRow: { flexDirection: 'row', gap: 12 },
  stat: { flex: 1, backgroundColor: colors.paper, padding: 18, borderRadius: 22, minHeight: 115 },
  statIcon: { fontSize: 22 },
  statNumber: { fontSize: 25, fontWeight: '900', color: colors.green, marginTop: 5 },
  statLabel: { color: colors.muted, fontSize: 12, fontWeight: '600' },
  note: { marginTop: 20, flexDirection: 'row', gap: 11, alignItems: 'center', paddingHorizontal: 6 },
  noteText: { flex: 1, color: colors.muted, fontSize: 13, lineHeight: 19 },
});
