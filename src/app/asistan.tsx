import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Alan } from '@/components/alan';
import { Icon } from '@/components/icon';
import { Cip, Dugme, Ekran, Kart, Metin, Neden, UstBar } from '@/components/temel';
import { Bosluk, Colors, Kose, Marka, Yazi } from '@/constants/theme';
import { kisiOnerileri, planNedeni, planPuani } from '@/data/eslestirme';
import { KULUPLER, PLANLAR } from '@/data/ornek';
import { useOturum } from '@/data/oturum';

type Yanit = { metin: string; ogeler: { baslik: string; alt: string; neden?: string | null; git: string }[] };

const HAZIR_SORULAR = ['Bu hafta sonu ne yapsam?', 'Kiminle tanışayım?', 'Hangi kulübe katılayım?'];

/**
 * EXCOM AI (prototip): gercek yapay zeka yok; soruyu anahtar kelimeyle
 * anlayip eslestirme sonuclarini gosterir. Gercegi sonra baglanir.
 */
export default function Asistan() {
  const { uye } = useOturum();
  const [soru, setSoru] = useState('');
  const [yanit, setYanit] = useState<Yanit | null>(null);

  const sor = (s: string) => {
    setSoru(s);
    const k = s.toLocaleLowerCase('tr');
    if (/kim|tanış|insan|kişi/.test(k)) {
      const o = kisiOnerileri(uye!, 3, uye!.davetEden ? [uye!.davetEden] : []);
      setYanit({
        metin: 'Bu hafta seninle en çok ortak noktası olan üç kişi:',
        ogeler: o.map((x) => ({ baslik: `${x.kisi.ad} ${x.kisi.soyadHarf}.`, alt: `${x.kisi.pozisyon} · ${x.kisi.semt}`, neden: x.nedenler[0], git: `/kisi/${x.kisi.id}` })),
      });
    } else if (/kulüp|kulup|grup|topluluk/.test(k)) {
      const kl = KULUPLER.filter((x) => uye!.ilgiler.includes(x.ilgi));
      setYanit({
        metin: kl.length ? 'İlgi alanlarına uyan kulüpler:' : 'İlgi alanlarına uyan kulüp henüz yok; ilk sen başlatabilirsin.',
        ogeler: kl.map((x) => ({ baslik: x.ad, alt: `${x.uyeler.length} / ${x.esik} kişi`, git: `/kulup/${x.id}` })),
      });
    } else {
      const p = [...PLANLAR].sort((a, b) => planPuani(uye!, b) - planPuani(uye!, a)).slice(0, 3);
      setYanit({
        metin: 'Sana en uygun üç plan:',
        ogeler: p.map((x) => ({ baslik: x.baslik, alt: `${x.gun} · ${x.saat} · ${x.semt}`, neden: planNedeni(uye!, x), git: `/etkinlik/${x.id}` })),
      });
    }
  };

  return (
    <Ekran ust={<UstBar baslik="ExCom AI" />}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.md, padding: Bosluk.lg, borderRadius: Kose.xl, backgroundColor: Marka.seftali }}>
        <Icon name="yildiz" size={28} color={Marka.turuncu} />
        <Metin style={{ flex: 1 }}>Plan yapmana, insan bulmana ve kulüp seçmene yardım ederim. Bir şey sor.</Metin>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {HAZIR_SORULAR.map((s) => (
          <Cip key={s} metin={s} secili={soru === s} onPress={() => sor(s)} />
        ))}
      </View>
      <Alan etiket="Ya da kendin yaz" deger={soru} degis={setSoru} ipucu="Örn. Cumartesi Kadıköy'de ne var?" />
      <Dugme baslik="Sor" pasif={!soru.trim()} onPress={() => sor(soru)} />

      {yanit && (
        <View style={{ gap: Bosluk.md }}>
          <Metin style={Yazi.isim}>{yanit.metin}</Metin>
          {yanit.ogeler.map((o) => (
            <Kart key={o.git} onPress={() => router.push(o.git as never)} style={{ padding: Bosluk.lg, gap: 4 }}>
              <Metin style={Yazi.kartBasligi}>{o.baslik}</Metin>
              <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>{o.alt}</Metin>
              {o.neden && <Neden metin={o.neden} />}
            </Kart>
          ))}
        </View>
      )}
      <Pressable disabled>
        <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted, textAlign: 'center' }}>
          Prototip: yanıtlar eşleştirme kurallarından geliyor, gerçek yapay zekâ sonra bağlanacak.
        </Metin>
      </Pressable>
    </Ekran>
  );
}
