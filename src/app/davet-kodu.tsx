import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Avatar, Dugme, Ekran, Metin, UstBar } from '@/components/temel';
import { Bosluk, Colors, Kose, Marka, Yazi } from '@/constants/theme';
import { DAVET_KODLARI, kisiBul, tamAd } from '@/data/ornek';
import { useOturum } from '@/data/oturum';

const UZUNLUK = 6;

/**
 * DAVET KODU (uyenin yolculugu 2)
 * Kodu yazar, kimin davet ettigini gorur.
 */
export default function DavetKodu() {
  const { davetKoduKabul } = useOturum();
  const [kod, setKod] = useState('');
  const girdi = useRef<TextInput>(null);

  const tam = kod.length === UZUNLUK;
  const davetEdenId = tam ? DAVET_KODLARI[kod] : undefined;
  const davetEden = davetEdenId ? kisiBul(davetEdenId) : undefined;

  return (
    <Ekran ust={<UstBar />} kaydir={false} icerikStil={{ padding: Bosluk.lg, gap: Bosluk.xl }}>
      <View style={{ gap: Bosluk.sm }}>
        <Metin style={{ ...Yazi.etiket, color: Colors.textMuted }}>DAVET KODU</Metin>
        <Metin style={Yazi.ekranBasligi}>Kodunu yaz</Metin>
        <Metin style={{ color: Colors.textMuted }}>Seni davet eden kişinin gönderdiği 6 haneli kod.</Metin>
      </View>

      <Pressable onPress={() => girdi.current?.focus()} style={{ flexDirection: 'row', gap: 8 }} accessibilityLabel="Davet kodu">
        {Array.from({ length: UZUNLUK }).map((_, i) => (
          <View key={i} style={[st.kutu, kod.length === i && st.kutuAktif, tam && !davetEden && st.kutuHata]}>
            <Metin style={{ fontSize: 24, fontWeight: '700' }}>{kod[i] ?? ''}</Metin>
          </View>
        ))}
      </Pressable>
      <TextInput
        ref={girdi}
        value={kod}
        onChangeText={(t) => setKod(t.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, UZUNLUK))}
        autoFocus
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={UZUNLUK}
        style={st.gizliGirdi}
      />

      {davetEden && (
        <View style={st.davetci}>
          <Avatar ad={davetEden.ad + ' ' + davetEden.soyadHarf} id={davetEden.id} />
          <View style={{ flex: 1 }}>
            <Metin style={Yazi.isim}>
              {tamAd(davetEden)} <Metin style={{ fontWeight: '400' }}>seni davet etti</Metin>
            </Metin>
            <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>
              {davetEden.pozisyon} · {davetEden.semt}
            </Metin>
          </View>
        </View>
      )}
      {tam && !davetEden && (
        <Metin style={{ color: Colors.heart }}>Bu kod geçerli değil ya da kullanılmış. Davet edene tekrar sorabilirsin.</Metin>
      )}

      <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>
        Kodun yoksa{' '}
        <Metin style={{ ...Yazi.ikincil, color: Colors.accent, fontWeight: '600' }} onPress={() => router.replace('/basvuru')}>
          üyelik başvurusu
        </Metin>{' '}
        yapabilirsin.{'\n'}Prototipte deneme kodu: EX4K7P
      </Metin>

      <View style={{ flex: 1 }} />
      <Dugme
        baslik="Devam"
        pasif={!davetEden}
        style={{ marginBottom: Bosluk.lg }}
        onPress={() => {
          if (!davetEdenId) return;
          davetKoduKabul(davetEdenId);
          router.replace('/profil-doldur');
        }}
      />
    </Ekran>
  );
}

const st = StyleSheet.create({
  kutu: {
    flex: 1,
    aspectRatio: 0.82,
    maxWidth: 56,
    borderRadius: Kose.md,
    borderWidth: 1.5,
    borderColor: Colors.borderInput,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kutuAktif: { borderColor: Marka.turuncu, borderWidth: 2 },
  kutuHata: { borderColor: Colors.heart },
  gizliGirdi: { position: 'absolute', opacity: 0, height: 1, width: 1 },
  davetci: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Bosluk.md,
    padding: Bosluk.lg,
    borderRadius: Kose.xl,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
