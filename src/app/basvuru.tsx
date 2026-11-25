import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Alan } from '@/components/alan';
import { Dugme, Ekran, Metin, UstBar } from '@/components/temel';
import { Bosluk, Colors, Yazi } from '@/constants/theme';

/** Kodu olmayanlar icin uyelik basvurusu (prototip: hicbir yere gonderilmez) */
export default function Basvuru() {
  const [ad, setAd] = useState('');
  const [eposta, setEposta] = useState('');
  const [is, setIs] = useState('');
  const [gonderildi, setGonderildi] = useState(false);

  if (gonderildi)
    return (
      <Ekran ust={<UstBar />}>
        <Metin style={{ fontSize: 56 }}>📬</Metin>
        <Metin style={Yazi.ekranBasligi}>Başvurun bize ulaştı</Metin>
        <Metin style={{ color: Colors.textMuted }}>
          Plus yalnızca davetle büyüyor. Başvuruları elle inceliyoruz; uygun olursa sana e-posta ile bir davet kodu
          göndereceğiz. Bu arada çevrende Plus üyesi biri varsa ondan kod isteyebilirsin.
        </Metin>
        <Dugme baslik="Başa dön" tur="cizgili" onPress={() => router.replace('/')} />
      </Ekran>
    );

  const tamam = ad.trim().length > 1 && eposta.includes('@') && is.trim().length > 1;
  return (
    <Ekran ust={<UstBar />}>
      <View style={{ gap: Bosluk.sm }}>
        <Metin style={Yazi.ekranBasligi}>Üyelik başvurusu</Metin>
        <Metin style={{ color: Colors.textMuted }}>Davet kodun yoksa kendini kısaca tanıt.</Metin>
      </View>
      <Alan etiket="Ad soyad" deger={ad} degis={setAd} />
      <Alan etiket="E-posta" deger={eposta} degis={setEposta} klavye="email-address" />
      <Alan etiket="Şirket ve pozisyon" deger={is} degis={setIs} ipucu="Örn. Bir banka, ürün yöneticisi" />
      <Dugme baslik="Başvuruyu gönder" pasif={!tamam} onPress={() => setGonderildi(true)} />
    </Ekran>
  );
}
