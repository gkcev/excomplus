import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { PlanKarti } from '@/components/kartlar';
import { Cip, Ekran, Metin } from '@/components/temel';
import { Bosluk, Colors, Yazi } from '@/constants/theme';
import { planNedeni, planPuani } from '@/data/eslestirme';
import { ilgiAdi, ilgiSimge, kulupBul } from '@/data/ornek';
import { useOturum } from '@/data/oturum';

/**
 * ETKINLIKLER: ekibin koydugu hazir planlar + kulup bulusmalari.
 * Ekip: her hafta 1 kucuk plan (6-8 kisi), alti ayda bir buyuk etkinlik.
 * Kulup bulusmasini kulubun ev sahibi koyar; uyeler ve ayni ilgiyi secenler gorur.
 */
export default function Etkinlikler() {
  const { uye, katildigimPlanlar, kuluplerim, planlar } = useOturum();
  const { ilgi } = useLocalSearchParams<{ ilgi?: string }>();
  const [suzgec, setSuzgec] = useState<string>(ilgi ?? 'senin');

  // Kulup bulusmasi: kulubun uyesi ya da ayni ilgiyi secmis olan gorur
  const gorur = (kulupId?: string) => {
    if (!kulupId) return true;
    const k = kulupBul(kulupId);
    return kuluplerim.includes(kulupId) || (!!k && uye!.ilgiler.includes(k.ilgi));
  };
  let liste = planlar.filter((p) => gorur(p.kulup)).sort((a, b) => planPuani(uye!, b) - planPuani(uye!, a));
  if (suzgec === 'kuluplerim') liste = liste.filter((p) => p.kulup && kuluplerim.includes(p.kulup));
  else if (suzgec === 'katildiklarim') liste = liste.filter((p) => katildigimPlanlar.includes(p.id));
  else if (suzgec !== 'senin' && suzgec !== 'tumu') liste = liste.filter((p) => p.ilgiler.includes(suzgec));

  return (
    <Ekran>
      <View style={{ gap: 4 }}>
        <Metin style={Yazi.ekranBasligi}>Etkinlikler</Metin>
        <Metin style={{ color: Colors.textMuted }}>Ekibin planları ve kulüplerin buluşmaları; sen sadece “Katıl” de.</Metin>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} style={{ marginTop: -Bosluk.sm }}>
        <Cip metin="Senin için" secili={suzgec === 'senin'} onPress={() => setSuzgec('senin')} />
        <Cip metin="Kulüplerim" secili={suzgec === 'kuluplerim'} onPress={() => setSuzgec('kuluplerim')} />
        <Cip metin={`Katıldıklarım (${katildigimPlanlar.length})`} secili={suzgec === 'katildiklarim'} onPress={() => setSuzgec('katildiklarim')} />
        {uye!.ilgiler.map((i) => (
          <Cip key={i} metin={ilgiAdi(i)} simge={ilgiSimge(i)} secili={suzgec === i} onPress={() => setSuzgec(i)} />
        ))}
      </ScrollView>
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
