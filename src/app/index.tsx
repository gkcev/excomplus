import { Redirect, router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Dugme, Ekran, Logo, Metin } from '@/components/temel';
import { Bosluk, Colors, Kose, Marka, Yazi } from '@/constants/theme';
import { useOturum } from '@/data/oturum';

/**
 * KARSILAMA (uyenin yolculugu 1)
 * Iki kapi: yeni uye "Davet kodum var", mevcut uye "Zaten uyeyim"
 * (Google / Apple / e-posta). Kodu olmayan basvuru birakir; uye olmayan
 * Google ile giremez.
 */
export default function Karsilama() {
  const { uye, davetEden } = useOturum();
  if (uye) return <Redirect href="/ana-sayfa" />;
  if (davetEden) return <Redirect href="/hesap-olustur" />;

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
          <Metin style={{ fontSize: 15, color: Colors.text, fontWeight: '600' }}>Yalnızca davetle</Metin>
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
        <Dugme baslik="Zaten üyeyim" tur="cizgili" onPress={() => router.push('/giris')} />
        <Pressable onPress={() => router.push('/basvuru')} hitSlop={8} style={{ alignSelf: 'center', paddingVertical: 4 }}>
          <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>
            Davet kodun yok mu? <Metin style={{ ...Yazi.ikincil, color: Colors.accent, fontWeight: '700' }}>Başvuru bırak</Metin>
          </Metin>
        </Pressable>
      </View>
    </Ekran>
  );
}
