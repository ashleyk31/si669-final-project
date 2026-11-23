import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ListingsProvider } from '../listings';
import { colors } from '../theme';

export default function RootLayout() {
  return <ListingsProvider>
    <StatusBar style="dark" />
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
  </ListingsProvider>;
}
