import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { Alan } from '@/components/alan';
import { Icon } from '@/components/icon';
import { Cip, Dugme, Ekran, Kart, Metin, UstBar } from '@/components/temel';
import { Bosluk, Colors, Kose, Marka, Yazi } from '@/constants/theme';
import { aramaIcinSade } from '@/components/search-box';
import { ILGI_KATALOGU, POPULER_ILGILER } from '@/data/ilgi-alanlari';
import { FIKIR_ESIGI, ilgiAdi, KULUP_FIKIRLERI, KULUPLER } from '@/data/ornek';
import { useOturum } from '@/data/oturum';

/**
 * KULUP ONER
 * Uye kulubun adini, ilgisini ve bir cumlelik aciklamasini yazar.
 * Ayni ilgide kulup ya da oneri varsa once onu gosteririz (tekrar kulup acilmasin).
 */
export default function KulupOner() {
  const { fikirlerim, kulupOner } = useOturum();
  const [ad, setAd] = useState('');
  const [ilgi, setIlgi] = useState('');
  const [ilgiAra, setIlgiAra] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [evSahibi, setEvSahibi] = useState(true);

  const varOlanKulup = KULUPLER.find((k) => k.ilgi === ilgi);
  const varOlanFikir = [...fikirlerim, ...KULUP_FIKIRLERI].find((f) => f.ilgi === ilgi);
  const gecerli = ad.trim().length >= 3 && !!ilgi && aciklama.trim().length >= 10;

  const gonder = () => {
    const id = kulupOner({ ad: ad.trim(), ilgi, aciklama: aciklama.trim(), evSahibi });
    router.replace(`/kulup-fikri/${id}`);
  };

  return (
    <Ekran
      ust={<UstBar baslik="Kulüp öner" />}
      alt={
        <View style={{ padding: Bosluk.lg, borderTopWidth: 1, borderTopColor: Colors.divider, backgroundColor: Colors.background }}>
          <Dugme baslik="Öneriyi paylaş" tur="turuncu" pasif={!gecerli} onPress={gonder} />
        </View>
      }>
      <View style={{ gap: Bosluk.sm, marginTop: -Bosluk.md }}>
        <Metin style={Yazi.ekranBasligi}>Aklında bir kulüp mü var?</Metin>
        <Metin style={{ color: Colors.textMuted }}>
          Önerini paylaş. {FIKIR_ESIGI} kişi “Ben de varım” deyince ekip kısa bir kontrol yapar ve kulüp açılır.
        </Metin>
      </View>

      <Alan etiket="Kulübün adı" deger={ad} degis={setAd} ipucu="Örn. Pazar Bisikletçileri" />

      <View style={{ gap: Bosluk.sm }}>
        <Metin style={{ ...Yazi.etiket, color: Colors.textMuted }}>Hangi ilgi alanı?</Metin>
        <TextInput
          value={ilgiAra}
          onChangeText={setIlgiAra}
          placeholder="Ara: bisiklet, satranç, yapay zekâ…"
          placeholderTextColor={Colors.textFaint}
          style={{ borderWidth: 1, borderColor: Colors.borderInput, borderRadius: Kose.md, backgroundColor: Colors.white, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, fontFamily: 'Outfit_400Regular', color: Colors.text }}
        />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {/* Aramaya gore katalogdan ilk 12; arama bossa populerler */}
          {(ilgiAra.trim()
            ? ILGI_KATALOGU.alanlar.filter((a) => a.anahtar.includes(aramaIcinSade(ilgiAra))).slice(0, 12).map((a) => a.id)
            : [...(ilgi && !POPULER_ILGILER.includes(ilgi) ? [ilgi] : []), ...POPULER_ILGILER]
          ).map((id) => (
            <Cip key={id} metin={ilgiAdi(id)} secili={ilgi === id} onPress={() => setIlgi(id)} />
          ))}
        </View>
      </View>

      {(varOlanKulup || varOlanFikir) && (
        <Kart
          onPress={() => router.push(varOlanKulup ? `/kulup/${varOlanKulup.id}` : `/kulup-fikri/${varOlanFikir!.id}`)}
          style={{ padding: Bosluk.lg, gap: 4, backgroundColor: Marka.seftali }}>
          <Metin style={Yazi.isim}>Bu ilgide zaten bir {varOlanKulup ? 'kulüp' : 'öneri'} var</Metin>
          <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>
            “{varOlanKulup?.ad ?? varOlanFikir!.ad}”. Ona katılmak daha hızlı olabilir. Farklıysa önerini yine de paylaşabilirsin.
          </Metin>
        </Kart>
      )}

      <Alan etiket="Bir cümleyle anlat" deger={aciklama} degis={setAciklama} ipucu="Ne yapacaksınız, ne sıklıkla?" cokSatir />

      <Pressable
        onPress={() => setEvSahibi(!evSahibi)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: evSahibi }}
        style={{ flexDirection: 'row', gap: Bosluk.md, alignItems: 'center', padding: Bosluk.lg, borderRadius: Kose.lg, borderWidth: 1, borderColor: Colors.borderInput, backgroundColor: Colors.white }}>
        <View style={{ width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: Marka.turuncu, backgroundColor: evSahibi ? Marka.turuncu : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
          {evSahibi && <Icon name="check" size={14} color={Colors.white} strokeWidth={3} />}
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Metin style={Yazi.isim}>Ev sahibi olmak istiyorum</Metin>
          <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>İlk buluşmayı sen planlarsın, ekip yardımcı olur.</Metin>
        </View>
      </Pressable>
    </Ekran>
  );
}
