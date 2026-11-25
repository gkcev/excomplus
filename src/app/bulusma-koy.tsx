import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Alan } from '@/components/alan';
import { Icon } from '@/components/icon';
import { Cip, Dugme, Ekran, KulupGorseli, Metin, UstBar } from '@/components/temel';
import { Bosluk, Colors, Kose, Marka, Yazi } from '@/constants/theme';
import { fotoSec } from '@/data/foto';
import { ILGI_GORSELLERI } from '@/data/fotolar';
import { kulupBul, SEMTLER } from '@/data/ornek';
import { useOturum } from '@/data/oturum';

const GUNLER = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const KONTENJANLAR = [4, 6, 8, 10];

/**
 * BULUSMA KOY (kulubun ev sahibi)
 * Onay beklemeden yayina girer; ekip uygunsuz olani kaldirabilir.
 * Kural: mekan herkese acik bir yer olur, ev adresi olmaz.
 */
export default function BulusmaKoy() {
  const { kulup: kulupId } = useLocalSearchParams<{ kulup: string }>();
  const { uye, bulusmaKoy } = useOturum();
  const k = kulupBul(kulupId);
  const [baslik, setBaslik] = useState('');
  const [gun, setGun] = useState('Cumartesi');
  const [saat, setSaat] = useState('');
  const [mekan, setMekan] = useState('');
  const [semt, setSemt] = useState(uye?.semt ?? '');
  const [kontenjan, setKontenjan] = useState(6);
  const [aciklama, setAciklama] = useState('');
  const [foto, setFoto] = useState<string>();

  if (!k || !uye) return <Ekran ust={<UstBar />}><Metin>Kulüp bulunamadı.</Metin></Ekran>;

  const gecerli = baslik.trim().length >= 3 && /^\d{1,2}[.:]\d{2}$/.test(saat.trim()) && mekan.trim().length >= 3 && !!semt;

  const koy = () => {
    const id = bulusmaKoy({
      baslik: baslik.trim(),
      tur: 'Kulüp buluşması',
      gun,
      saat: saat.trim().replace(':', '.'),
      semt,
      mekan: mekan.trim(),
      kontenjan,
      ilgiler: [k.ilgi],
      gorsel: foto ?? ILGI_GORSELLERI[k.ilgi],
      aciklama: aciklama.trim() || `${k.ad} buluşması.`,
      kulup: k.id,
    });
    router.replace(`/etkinlik/${id}`);
  };

  return (
    <Ekran
      ust={<UstBar baslik="Buluşma koy" />}
      alt={
        <View style={{ padding: Bosluk.lg, borderTopWidth: 1, borderTopColor: Colors.divider, backgroundColor: Colors.background }}>
          <Dugme baslik="Buluşmayı yayınla" tur="turuncu" pasif={!gecerli} onPress={koy} />
        </View>
      }>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.md, marginTop: -Bosluk.md }}>
        <KulupGorseli ilgi={k.ilgi} genislik={48} yukseklik={48} />
        <View style={{ flex: 1 }}>
          <Metin style={Yazi.isim}>{k.ad}</Metin>
          <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>Üyeler ve {k.ad.split(' ')[0].toLocaleLowerCase('tr')} sevenler görecek</Metin>
        </View>
      </View>

      <Alan etiket="Ne yapıyoruz?" deger={baslik} degis={setBaslik} ipucu="Örn. Pazar öğleden sonra galeri turu" />

      <View style={{ gap: Bosluk.sm }}>
        <Metin style={{ ...Yazi.etiket, color: Colors.textMuted }}>Gün</Metin>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {GUNLER.map((g) => (
            <Cip key={g} metin={g} secili={gun === g} onPress={() => setGun(g)} />
          ))}
        </View>
      </View>

      <Alan etiket="Saat" deger={saat} degis={(t) => setSaat(t.replace(/[^\d.:]/g, '').slice(0, 5))} ipucu="Örn. 10.30" />

      <View style={{ gap: Bosluk.sm }}>
        <Alan etiket="Mekan" deger={mekan} degis={setMekan} ipucu="Örn. Moda’da bir kafe, Maçka Parkı" />
        <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>Herkese açık bir yer seç: kafe, kort, park. Ev adresi yazma.</Metin>
      </View>

      <View style={{ gap: Bosluk.sm }}>
        <Metin style={{ ...Yazi.etiket, color: Colors.textMuted }}>Semt</Metin>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {(SEMTLER[uye.sehir] ?? []).map((s) => (
            <Cip key={s} metin={s} secili={semt === s} onPress={() => setSemt(s)} />
          ))}
        </View>
      </View>

      <View style={{ gap: Bosluk.sm }}>
        <Metin style={{ ...Yazi.etiket, color: Colors.textMuted }}>Kaç kişilik? (sen dahil)</Metin>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {KONTENJANLAR.map((n) => (
            <Cip key={n} metin={`${n} kişi`} secili={kontenjan === n} onPress={() => setKontenjan(n)} />
          ))}
        </View>
        <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>Küçük gruplar daha iyi tanıştırır; 6-8 öneriyoruz.</Metin>
      </View>

      <Alan etiket="Kısa bir not (isteğe bağlı)" deger={aciklama} degis={setAciklama} ipucu="Seviye, ne getirmeli, sonrası…" cokSatir />

      <View style={{ gap: Bosluk.sm }}>
        <Metin style={{ ...Yazi.etiket, color: Colors.textMuted }}>Fotoğraf (isteğe bağlı)</Metin>
        <Pressable
          onPress={async () => { const f = await fotoSec(); if (f) setFoto(f); }}
          accessibilityLabel="Buluşma fotoğrafı seç"
          style={{ borderRadius: Kose.lg, overflow: 'hidden', backgroundColor: Marka.seftali }}>
          <Image source={foto ?? ILGI_GORSELLERI[k.ilgi]} style={{ width: '100%', height: 140 }} contentFit="cover" />
          <View style={{ position: 'absolute', right: 10, bottom: 10, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 }}>
            <Icon name="plus" size={14} color={Colors.accent} />
            <Metin style={{ ...Yazi.etiket, color: Colors.accent }}>{foto ? 'Değiştir' : 'Kendi fotoğrafın'}</Metin>
          </View>
        </Pressable>
        {!foto && <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>Seçmezsen kulübün fotoğrafı kullanılır.</Metin>}
      </View>
    </Ekran>
  );
}
