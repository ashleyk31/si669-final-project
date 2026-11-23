import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { expiryLabel, Listing, useListings } from '../listings';
import { colors } from '../theme';
import { ActionButton, Eyebrow, Page } from '../ui';

const categories = ['All', 'My picks', 'Groceries', 'Baking', 'Home-cooked'];
const sampleEmoji: Record<string, string> = { Groceries: '🍅', Baking: '🥖', 'Home-cooked': '🍲' };
const sampleColor: Record<string, string> = { Groceries: '#F9E3D3', Baking: '#F5E9C9', 'Home-cooked': '#E2EEDB' };

export default function Leftovers() {
  const { posted } = useLocalSearchParams<{ posted?: string }>();
  const { listings, pickedIds, ready, pickBusy, error, togglePick } = useListings();
  const [category, setCategory] = useState('All');
  const [selectionMessage, setSelectionMessage] = useState('');
  const visible = listings.filter(item => category === 'All' || (category === 'My picks' ? pickedIds.includes(item.id) : item.category === category));

  async function pick(item: Listing) {
    const wasPicked = pickedIds.includes(item.id);
    const saved = await togglePick(item.id);
    if (saved) setSelectionMessage(wasPicked ? `${item.name} removed from My picks.` : `${item.name} added to My picks. You can find it here when you return.`);
  }

  return <Page>
    <View style={styles.headingRow}>
      <View style={styles.headingCopy}><Eyebrow>FRESH FROM THE COMMUNITY</Eyebrow><Text style={styles.title}>The leftovers table</Text><Text style={styles.subtitle}>Good food, ready for a second home.</Text></View>
      <View style={styles.headingIcon}><Text style={{ fontSize: 30 }}>🧺</Text></View>
    </View>

    {posted === '1' ? <View style={styles.success}><Ionicons name="checkmark-circle" size={24} color={colors.green} /><View style={{ flex: 1 }}><Text style={styles.successTitle}>Your food is on the table!</Text><Text style={styles.successCopy}>Neighbors can now see your listing.</Text></View></View> : null}
    {selectionMessage ? <View accessibilityRole="alert" style={styles.success}><Ionicons name="checkmark-circle" size={24} color={colors.green} /><Text style={styles.selectionMessage}>{selectionMessage}</Text></View> : null}
    {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}

    <View style={styles.toolbar}><Text style={styles.count}>{ready ? `${visible.length} ${visible.length === 1 ? 'listing' : 'listings'}` : 'Loading listings…'}</Text><Pressable accessibilityRole="button" onPress={() => router.push('/share')} style={styles.addButton}><Ionicons name="add" size={18} color="#fff" /><Text style={styles.addButtonText}>Share food</Text></Pressable></View>
    <View style={styles.chips}>{categories.map(item => <Pressable key={item} accessibilityRole="button" accessibilityState={{ selected: category === item }} onPress={() => { setCategory(item); setSelectionMessage(''); }} style={[styles.chip, category === item && styles.chipSelected]}><Text style={[styles.chipText, category === item && styles.chipTextSelected]}>{item === 'My picks' ? `My picks (${pickedIds.length})` : item}</Text></Pressable>)}</View>

    <View style={styles.cards}>{visible.map(item => <ListingCard key={item.id} item={item} picked={pickedIds.includes(item.id)} disabled={!ready || pickBusy} onPick={() => pick(item)} />)}</View>
    {ready && visible.length === 0 ? <View style={styles.empty}><Text style={styles.emptyEmoji}>🌱</Text><Text style={styles.emptyTitle}>{category === 'My picks' ? 'No food picked yet' : 'Nothing in this category yet'}</Text><Text style={styles.emptyCopy}>{category === 'My picks' ? 'Browse the table and pick something you would like.' : 'Be the first to add something good.'}</Text><ActionButton label={category === 'My picks' ? 'Browse all food' : 'Share food'} icon="arrow-forward" onPress={() => category === 'My picks' ? setCategory('All') : router.push('/share')} /></View> : null}
    <View style={styles.bottomNote}><Ionicons name="information-circle-outline" size={18} color={colors.muted} /><Text style={styles.bottomText}>Picking food saves it on this device for your demo. It does not reserve the item for other people. Confirm availability, ingredients, and pickup directly with your neighbor.</Text></View>
  </Page>;
}

function ListingCard({ item, picked, disabled, onPick }: { item: Listing; picked: boolean; disabled: boolean; onPick: () => void }) {
  const expiry = expiryLabel(item.expiresOn);
  const unavailable = expiry === 'Expired' && !picked;
  return <View style={styles.card}>
    <View style={[styles.visual, { backgroundColor: sampleColor[item.category] || colors.greenSoft }]}>
      {item.imageUri ? <Image source={{ uri: item.imageUri }} style={styles.photo} accessibilityLabel={`Photo of ${item.name}`} /> : <Text style={styles.emoji}>{sampleEmoji[item.category] || '🥘'}</Text>}
      <View style={styles.badge}><Text style={styles.badgeText}>{item.category}</Text></View>
    </View>
    <View style={styles.cardBody}>
      <View style={styles.nameRow}><Text style={styles.name}>{item.name}</Text><View style={[styles.expiry, expiry === 'Expired' && styles.expired]}><Text style={[styles.expiryText, expiry === 'Expired' && styles.expiredText]}>{expiry}</Text></View></View>
      <Text style={styles.quantity}>{item.quantity}</Text>
      <View style={styles.meta}><Ionicons name="location-outline" size={16} color={colors.muted} /><Text style={styles.metaText}>{item.location}</Text><Text style={styles.dot}>•</Text><Ionicons name="calendar-outline" size={16} color={colors.muted} /><Text style={styles.metaText}>Use by {item.expiresOn}</Text></View>
      {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
      <Pressable accessibilityRole="button" accessibilityLabel={picked ? `Remove ${item.name} from My picks` : `Pick ${item.name} for pickup`} accessibilityState={{ selected: picked, disabled: disabled || unavailable }} disabled={disabled || unavailable} onPress={onPick} style={[styles.pickButton, picked && styles.pickedButton, (disabled || unavailable) && styles.disabledButton]}><Ionicons name={picked ? 'checkmark-circle' : 'basket-outline'} size={19} color={picked ? colors.green : '#fff'} /><Text style={[styles.pickButtonText, picked && styles.pickedButtonText]}>{picked ? 'Picked · Remove from My picks' : unavailable ? 'Past use-by date' : 'Pick for pickup'}</Text></Pressable>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  headingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 29, marginBottom: 26, gap: 10 },
  headingCopy: { flex: 1 },
  title: { color: colors.green, fontSize: 36, lineHeight: 39, letterSpacing: -1.6, fontWeight: '900', marginTop: 9 },
  subtitle: { color: colors.muted, fontSize: 15, marginTop: 10 },
  headingIcon: { width: 66, height: 66, borderRadius: 21, backgroundColor: colors.orangeSoft, justifyContent: 'center', alignItems: 'center' },
  success: { backgroundColor: colors.greenSoft, borderRadius: 17, padding: 16, flexDirection: 'row', gap: 11, marginBottom: 20 },
  successTitle: { fontSize: 15, fontWeight: '800', color: colors.green },
  successCopy: { color: '#536955', fontSize: 13, marginTop: 3 },
  selectionMessage: { flex: 1, color: colors.green, fontSize: 13, fontWeight: '700', lineHeight: 19 },
  error: { color: colors.danger, marginBottom: 14, fontSize: 13 },
  toolbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 17 },
  count: { color: colors.ink, fontWeight: '800', fontSize: 17 },
  addButton: { backgroundColor: colors.green, borderRadius: 12, paddingHorizontal: 13, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 5 },
  addButtonText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: { borderRadius: 19, borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff', paddingHorizontal: 13, paddingVertical: 9 },
  chipSelected: { backgroundColor: colors.green, borderColor: colors.green },
  chipText: { color: colors.green, fontSize: 12, fontWeight: '700' },
  chipTextSelected: { color: '#fff' },
  cards: { gap: 18 },
  card: { backgroundColor: '#fff', borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  visual: { height: 170, alignItems: 'center', justifyContent: 'center' },
  photo: { width: '100%', height: '100%' },
  emoji: { fontSize: 92 },
  badge: { position: 'absolute', left: 15, top: 15, backgroundColor: '#fff', paddingHorizontal: 11, paddingVertical: 7, borderRadius: 12 },
  badgeText: { color: colors.green, fontSize: 11, fontWeight: '800' },
  cardBody: { padding: 18 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 9 },
  name: { flex: 1, color: colors.ink, fontWeight: '900', fontSize: 20, letterSpacing: -0.4 },
  expiry: { backgroundColor: colors.orangeSoft, borderRadius: 9, paddingHorizontal: 9, paddingVertical: 6 },
  expiryText: { color: '#925A2C', fontWeight: '800', fontSize: 11 },
  expired: { backgroundColor: '#F8E5E0' },
  expiredText: { color: colors.danger },
  quantity: { color: '#49634D', fontSize: 14, fontWeight: '700', marginTop: 5 },
  meta: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 5, marginTop: 15 },
  metaText: { color: colors.muted, fontSize: 12 },
  dot: { color: colors.muted, marginHorizontal: 3 },
  notes: { color: colors.muted, lineHeight: 19, fontSize: 13, borderTopWidth: 1, borderColor: colors.border, marginTop: 15, paddingTop: 13 },
  pickButton: { backgroundColor: colors.green, borderRadius: 13, minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 17, paddingHorizontal: 13 },
  pickedButton: { backgroundColor: colors.greenSoft },
  disabledButton: { opacity: 0.55 },
  pickButtonText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  pickedButtonText: { color: colors.green },
  empty: { backgroundColor: '#fff', borderRadius: 22, alignItems: 'center', padding: 24, gap: 9 },
  emptyEmoji: { fontSize: 40 },
  emptyTitle: { color: colors.green, fontSize: 19, fontWeight: '800' },
  emptyCopy: { color: colors.muted, marginBottom: 8 },
  bottomNote: { flexDirection: 'row', gap: 8, padding: 16, marginTop: 14 },
  bottomText: { flex: 1, color: colors.muted, lineHeight: 18, fontSize: 12 },
});
