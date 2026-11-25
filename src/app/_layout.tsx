import {
  Outfit_300Light,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/outfit';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { OturumSaglayici, useOturum } from '@/data/oturum';

SplashScreen.preventAutoHideAsync().catch(() => {});

const tema = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: Colors.background, primary: Colors.primary },
};

export default function KokYerlesim() {
  const [yaziHazir, yaziHatasi] = useFonts({
    Outfit_300Light,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
  });

  return (
    <SafeAreaProvider>
      <OturumSaglayici>
        <ThemeProvider value={tema}>
          <Icerik yaziHazir={yaziHazir || !!yaziHatasi} />
        </ThemeProvider>
      </OturumSaglayici>
    </SafeAreaProvider>
  );
}

function Icerik({ yaziHazir }: { yaziHazir: boolean }) {
  const { hazir } = useOturum();
  const tamam = yaziHazir && hazir;
  useEffect(() => {
    if (tamam) SplashScreen.hideAsync().catch(() => {});
  }, [tamam]);
  if (!tamam) return <View style={{ flex: 1, backgroundColor: Colors.background }} />;
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }} />;
}
