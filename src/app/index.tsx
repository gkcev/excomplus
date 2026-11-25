import { Redirect, router } from 'expo-router';
import { View } from 'react-native';

import { Dugme, Ekran, Logo, Metin } from '@/components/temel';
import { Bosluk, Colors, Kose, Marka, Yazi } from '@/constants/theme';
import { useOturum } from '@/data/oturum';

/**
 * KARSILAMA (uyenin yolculugu 1)
 * Plus davetle girilen bir yer: ana dugme "Davet kodum var".
 * Kodu olmayan basvuru birakir.
 */
export default function Karsilama() {
  const { uye, davetEden } = useOturum();
  if (uye) return <Redirect href="/ana-sayfa" />;
  if (davetEden) return <Redirect href="/profil-doldur" />;

  return (
    <Ekran kaydir={false} icerikStil={{ padding: Bosluk.lg, justifyContent: 'space-between' }}>
      <View style={{ paddingTop: Bosluk.lg }}>
        <Logo genislik={130} />
      </View>

      <View style={{ gap: Bosluk.lg }}>
        <View style={{ height: 220, borderRadius: 28, backgroundColor: Marka.seftali, overflow: 'hidden', justifyContent: 'flex-end', padding: Bosluk.lg }}>
          <View style={{ position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: Marka.sari, top: -40, right: -30, opacity: 0.8 }} />
          <View style={{ position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: Marka.turuncu, top: 50, right: 70, opacity: 0.85 }} />
          <View style={{ position: 'absolute', width: 90, height: 90, borderRadius: Kose.xl, backgroundColor: Marka.lacivert, top: 20, left: 24, transform: [{ rotate: '-12deg' }] }} />
          <Metin style={{ fontSize: 15, color: Colors.text, fontWeight: '600' }}>Yalnızca davetle ✉️</Metin>
        </View>
        <Metin style={{ ...Yazi.ekranBasligi, fontSize: 34, lineHeight: 40 }}>
          Güvendiğin insanların{'\n'}tanıştırdığı bir çevre.
        </Metin>
        <Metin style={{ color: Colors.textMuted }}>
          Beyaz yakalılar için ortak ilgi alanları, küçük planlar ve kulüpler. Her üye, tanıdığı birinin daveti ile gelir.
        </Metin>
      </View>

      <View style={{ gap: Bosluk.md, paddingBottom: Bosluk.lg }}>
        <Dugme baslik="Davet kodum var" onPress={() => router.push('/davet-kodu')} />
        <Dugme baslik="Kodum yok, başvur" tur="cizgili" onPress={() => router.push('/basvuru')} />
      </View>
    </Ekran>
  );
}
