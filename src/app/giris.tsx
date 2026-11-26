import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { GirisYontemleri } from '@/components/giris-yontemleri';
import { Icon } from '@/components/icon';
import { Dugme, Ekran, Kart, Metin, UstBar } from '@/components/temel';
import { Bosluk, Colors, Marka, Yazi } from '@/constants/theme';
import { DENEME_HESABI, useOturum } from '@/data/oturum';

const UYE_DEGIL =
  'Bu hesapla bir Plus üyeliği bulunamadı. Plus’a yalnızca davetle katılınır: davet kodun varsa onunla başla, yoksa başvuru bırak.';

/**
 * ZATEN UYEYIM: mevcut uye Google / Apple / e-posta koduyla girer.
 * Daha once uye olmayan biri buradan GIREMEZ (hesap acilmaz); ona
 * davet kodu ya da basvuru yolu gosterilir.
 */
export default function Giris() {
  const { uye, uyeMi, girisYap } = useOturum();
  const [uyeDegil, setUyeDegil] = useState(false);
  if (uye) return <Redirect href="/ana-sayfa" />;

  return (
    <Ekran ust={<UstBar />}>
      <View style={{ alignItems: 'center', gap: Bosluk.sm, marginTop: -Bosluk.md }}>
        <View style={{ width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: Marka.seftali }}>
          <Icon name="lock" size={30} color={Colors.accent} />
        </View>
        <Metin style={{ ...Yazi.ekranBasligi, textAlign: 'center' }}>Kaldığımız yerden.</Metin>
        <Metin style={{ color: Colors.textMuted, textAlign: 'center' }}>Tekrar hoş geldin. Üye olurken kullandığın hesapla gir.</Metin>
      </View>

      <GirisYontemleri
        kontrol={(adres) => {
          const uyeMu = uyeMi(adres);
          setUyeDegil(!uyeMu);
          return uyeMu ? null : UYE_DEGIL;
        }}
        sec={(h) => {
          const tamam = girisYap(h.eposta);
          setUyeDegil(!tamam);
          if (!tamam) return UYE_DEGIL;
          router.replace('/ana-sayfa');
          return null;
        }}
      />

      {uyeDegil && (
        <Kart style={{ padding: Bosluk.lg, gap: Bosluk.sm, backgroundColor: Marka.seftali }}>
          <Metin style={Yazi.kartBasligi}>Henüz üye değil misin?</Metin>
          <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>
            Plus’ta her üye, tanıdığı birinin davetiyle gelir. Google ya da Apple ile yeni hesap ancak davet kodundan sonra açılır.
          </Metin>
          <Dugme baslik="Davet kodum var" onPress={() => router.replace('/davet-kodu')} />
          <Dugme baslik="Kodum yok, başvur" tur="cizgili" onPress={() => router.replace('/basvuru')} />
        </Kart>
      )}

      <Metin style={{ ...Yazi.ikincil, color: Colors.textFaint, textAlign: 'center' }}>
        Prototip: hazır bir üyeyle denemek için {DENEME_HESABI} yaz.
      </Metin>
    </Ekran>
  );
}
