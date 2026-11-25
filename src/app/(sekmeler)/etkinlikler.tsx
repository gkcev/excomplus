import { View } from 'react-native';

import { PlanKarti } from '@/components/kartlar';
import { Ekran, Metin } from '@/components/temel';
import { Bosluk, Colors, Yazi } from '@/constants/theme';
import { planNedeni, planPuani } from '@/data/eslestirme';
import { kulupBul } from '@/data/ornek';
import { useOturum } from '@/data/oturum';

/**
 * ETKINLIKLER: ekibin koydugu hazir planlar + kulup bulusmalari.
 * Ekip: her hafta 1 kucuk plan (6-8 kisi), alti ayda bir buyuk etkinlik.
 * Kulup bulusmasini kulubun ev sahibi koyar; uyeler ve ayni ilgiyi secenler gorur.
 */
export default function Etkinlikler() {
  const { uye, kuluplerim, planlar } = useOturum();

  // Kulup bulusmasi: kulubun uyesi ya da ayni ilgiyi secmis olan gorur
  const gorur = (kulupId?: string) => {
    if (!kulupId) return true;
    const k = kulupBul(kulupId);
    return kuluplerim.includes(kulupId) || (!!k && uye!.ilgiler.includes(k.ilgi));
  };
  const liste = planlar.filter((p) => gorur(p.kulup)).sort((a, b) => planPuani(uye!, b) - planPuani(uye!, a));

  return (
    <Ekran>
      <View style={{ gap: 4 }}>
        <Metin style={Yazi.ekranBasligi}>Etkinlikler</Metin>
        <Metin style={{ color: Colors.textMuted }}>Ekibin planları ve kulüplerin buluşmaları; sen sadece “Katıl” de.</Metin>
      </View>
      <View style={{ gap: Bosluk.md }}>
        {liste.map((p) => (
          <PlanKarti key={p.id} plan={p} neden={planNedeni(uye!, p)} tur="yan" />
        ))}
        {liste.length === 0 && (
          <Metin style={{ color: Colors.textMuted, textAlign: 'center', paddingVertical: Bosluk.xl }}>
            Burada henüz plan yok. Yeni planlar her ay başında ekleniyor.
          </Metin>
        )}
      </View>
    </Ekran>
  );
}
