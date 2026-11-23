import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useListings } from '../listings';
import { colors } from '../theme';
import { ActionButton, Eyebrow, Page } from '../ui';

const categories = ['Groceries', 'Baking', 'Home-cooked'];

function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day && date >= today;
}

export default function Share() {
  const { addListing, error: storageError, ready } = useListings();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [expiresOn, setExpiresOn] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function choosePhoto() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.45, base64: true });
      if (result.canceled) return;
      const asset = result.assets[0];
      if (asset?.base64) {
        setImageUri(`data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`);
        setMessage('');
      } else {
        setMessage('This photo could not be prepared for saving. Please choose another.');
      }
    } catch {
      setMessage('The photo library could not be opened. You can still post without a photo.');
    }
  }

  async function submit() {
    if (!name.trim() || !quantity.trim() || !location.trim() || !expiresOn.trim()) {
      setMessage('Add a food name, amount, pickup area, and expiration date.');
      return;
    }
    if (!validDate(expiresOn.trim())) {
      setMessage('Enter a real expiration date today or later in YYYY-MM-DD format.');
      return;
    }
    setBusy(true);
    setMessage('');
    const saved = await addListing({ name: name.trim(), quantity: quantity.trim(), category, expiresOn: expiresOn.trim(), location: location.trim(), notes: notes.trim(), imageUri });
    setBusy(false);
    if (saved) router.replace('/leftovers?posted=1');
  }

  return <Page>
    <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.back}><Ionicons name="arrow-back" size={18} color={colors.green} /><Text style={styles.backText}>Back</Text></Pressable>
    <Eyebrow>FROM YOUR KITCHEN TO THE COMMUNITY</Eyebrow>
    <Text style={styles.title}>Share something good.</Text>
    <Text style={styles.subtitle}>Tell neighbors what you have and when it’s best enjoyed.</Text>

    <Text style={styles.label}>Food photo <Text style={styles.optional}>optional</Text></Text>
    <Pressable accessibilityRole="button" accessibilityLabel={imageUri ? 'Change food photo' : 'Add food photo'} onPress={choosePhoto} style={styles.photoBox}>
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.photo} /> : <><View style={styles.photoIcon}><Ionicons name="camera-outline" size={29} color={colors.green} /></View><Text style={styles.photoTitle}>Add a photo</Text><Text style={styles.photoHint}>A picture helps neighbors recognize your food</Text></>}
    </Pressable>
    {imageUri ? <Pressable onPress={() => setImageUri(undefined)} accessibilityRole="button" style={styles.removePhoto}><Text style={styles.removePhotoText}>Remove photo</Text></Pressable> : null}

    <View style={styles.formCard}>
      <Field label="What are you sharing?" value={name} onChangeText={setName} placeholder="e.g. Homemade vegetable soup" />
      <Field label="How much?" value={quantity} onChangeText={setQuantity} placeholder="e.g. 2 servings" />
      <Text style={styles.label}>Category</Text>
      <View style={styles.chips}>{categories.map(item => <Pressable key={item} accessibilityRole="button" accessibilityState={{ selected: category === item }} onPress={() => setCategory(item)} style={[styles.chip, category === item && styles.chipSelected]}><Text style={[styles.chipText, category === item && styles.chipTextSelected]}>{item}</Text></Pressable>)}</View>
      <Field label="Expires on" value={expiresOn} onChangeText={setExpiresOn} placeholder="YYYY-MM-DD" keyboardType="numbers-and-punctuation" helper="Use the date on the package, or your best safe estimate." />
      <Field label="Pickup area" value={location} onChangeText={setLocation} placeholder="e.g. Kerrytown, Ann Arbor" helper="A neighborhood is enough. Share an exact address privately." />
      <Field label="Anything neighbors should know?" value={notes} onChangeText={setNotes} placeholder="Ingredients, allergens, storage, pickup notes..." multiline optional />
    </View>
    {message || storageError ? <Text accessibilityRole="alert" style={styles.error}>{message || storageError}</Text> : null}
    <View style={styles.submit}><ActionButton label={busy ? 'Posting…' : 'Post to leftovers'} icon="arrow-forward" disabled={busy || !ready} onPress={submit} /></View>
    <Text style={styles.footer}>Please share food that has been stored safely and is still good to eat.</Text>
  </Page>;
}

function Field({ label, value, onChangeText, placeholder, helper, optional, multiline, keyboardType }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; helper?: string; optional?: boolean; multiline?: boolean; keyboardType?: 'numbers-and-punctuation' }) {
  return <View style={styles.field}><Text style={styles.label}>{label} {optional ? <Text style={styles.optional}>optional</Text> : null}</Text><TextInput accessibilityLabel={label} style={[styles.input, multiline && styles.multiline]} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#8A958C" multiline={multiline} keyboardType={keyboardType} autoCapitalize={keyboardType ? 'none' : 'sentences'} />{helper ? <Text style={styles.helper}>{helper}</Text> : null}</View>;
}

const styles = StyleSheet.create({
  back: { marginTop: 6, marginBottom: 28, flexDirection: 'row', alignItems: 'center', gap: 7 },
  backText: { color: colors.green, fontWeight: '700', fontSize: 14 },
  title: { fontSize: 38, fontWeight: '900', color: colors.green, letterSpacing: -1.8, marginTop: 10 },
  subtitle: { fontSize: 16, lineHeight: 23, color: colors.muted, marginTop: 8, marginBottom: 28 },
  label: { color: colors.ink, fontSize: 15, fontWeight: '800', marginBottom: 9 },
  optional: { color: colors.muted, fontWeight: '500', fontSize: 12 },
  photoBox: { backgroundColor: '#F1F6EC', borderColor: '#BDD3B6', borderStyle: 'dashed', borderWidth: 2, borderRadius: 21, height: 165, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  photo: { width: '100%', height: '100%' },
  photoIcon: { width: 54, height: 54, borderRadius: 16, backgroundColor: colors.greenSoft, alignItems: 'center', justifyContent: 'center' },
  photoTitle: { color: colors.green, fontWeight: '800', fontSize: 16, marginTop: 9 },
  photoHint: { color: colors.muted, fontSize: 12, marginTop: 3, textAlign: 'center' },
  removePhoto: { alignSelf: 'flex-end', padding: 8 },
  removePhotoText: { color: colors.danger, fontWeight: '700', fontSize: 13 },
  formCard: { backgroundColor: colors.paper, borderRadius: 24, padding: 20, gap: 20, marginTop: 21 },
  field: {},
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 13, paddingHorizontal: 15, paddingVertical: 13, fontSize: 15, color: colors.ink, backgroundColor: '#FCFDF9', minHeight: 49 },
  multiline: { minHeight: 95, textAlignVertical: 'top' },
  helper: { color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 6 },
  chips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 22, borderWidth: 1, borderColor: colors.border },
  chipSelected: { backgroundColor: colors.green, borderColor: colors.green },
  chipText: { color: colors.green, fontWeight: '700', fontSize: 12 },
  chipTextSelected: { color: '#fff' },
  error: { color: colors.danger, fontSize: 14, lineHeight: 20, marginTop: 18 },
  submit: { marginTop: 25 },
  footer: { textAlign: 'center', color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 17, paddingHorizontal: 12 },
});
