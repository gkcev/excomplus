import { Redirect, router } from 'expo-router';
import { View } from 'react-native';

import { GirisYontemleri } from '@/components/giris-yontemleri';
import { Avatar, Ekran, IlerlemeCubugu, Metin, UstBar } from '@/components/temel';
import { Bosluk, Colors, Kose, Marka, Yazi } from '@/constants/theme';
import { kisiBul, tamAd } from '@/data/ornek';
import { useOturum } from '@/data/oturum';

/**
 * HESABINI OLUSTUR (davet kodundan sonra)
 * Yeni uyenin Google / Apple / e-posta hesabi YALNIZCA burada acilir.
 * Bundan sonra "Zaten uyeyim" ile bu hesapla girer.
 * Hesap zaten uyeyse yeni uyelik acilmaz, girise yonlendirilir.
 */
export default function HesapOlustur() {
  const { davetEden, hesap, uye, uyeMi, hesapBagla } = useOturum();
  if (uye) return <Redirect href="/ana-sayfa" />;
  if (!davetEden) return <Redirect href="/" />;
  if (hesap) return <Redirect href="/profil-doldur" />;
  const davetci = kisiBul(davetEden);

  const zatenUye = 'Bu hesap zaten Plus üyesi. Karşılama ekranındaki “Zaten üyeyim” ile giriş yap.';

  return (
    <Ekran ust={<UstBar />}>
      <View style={{ gap: Bosluk.sm, marginTop: -Bosluk.md }}>
        <IlerlemeCubugu oran={0.1} />
        <Metin style={Yazi.ekranBasligi}>Hesabını oluştur</Metin>
        <Metin style={{ color: Colors.textMuted }}>Bundan sonra Plus’a bu hesapla gireceksin.</Metin>
      </View>

      {davetci && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.md, padding: Bosluk.md, borderRadius: Kose.lg, backgroundColor: Marka.seftali }}>
          <Avatar ad={tamAd(davetci)} id={davetci.id} boyut={40} />
          <Metin style={{ ...Yazi.ikincil, flex: 1 }}>
            <Metin style={Yazi.isim}>{tamAd(davetci)}</Metin> seni davet etti. Davetli olduğun için yeni hesap açabilirsin.
          </Metin>
        </View>
      )}

      <GirisYontemleri
        kontrol={(adres) => (uyeMi(adres) ? zatenUye : null)}
        sec={(h) => {
          if (uyeMi(h.eposta)) return zatenUye;
          hesapBagla(h);
          router.replace('/profil-doldur');
          return null;
        }}
      />
    </Ekran>
  );
}
