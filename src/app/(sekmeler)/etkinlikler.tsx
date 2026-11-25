import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { PlanKarti } from '@/components/kartlar';
import { Cip, Ekran, Metin } from '@/components/temel';
import { Bosluk, Colors, Yazi } from '@/constants/theme';
import { planNedeni, planPuani } from '@/data/eslestirme';
import { ilgiAdi, ilgiSimge, PLANLAR } from '@/data/ornek';
import { useOturum } from '@/data/oturum';

/**
 * ETKINLIKLER: ekibin koydugu hazir planlar.
 * Her hafta 1 kucuk plan (6-8 kisi), alti ayda bir buyuk ExCom etkinligi.
 */
export default function Etkinlikler() {
  const { uye, katildigimPlanlar } = useOturum();
  const { ilgi } = useLocalSearchParams<{ ilgi?: string }>();
  const [suzgec, setSuzgec] = useState<string>(ilgi ?? 'senin');

  let liste = [...PLANLAR].sort((a, b) => planPuani(uye!, b) - planPuani(uye!, a));
  if (suzgec === 'katildiklarim') liste = liste.filter((p) => katildigimPlanlar.includes(p.id));
  else if (suzgec !== 'senin' && suzgec !== 'tumu') liste = liste.filter((p) => p.ilgiler.includes(suzgec));

  return (
    <Ekran>
      <View style={{ gap: 4 }}>
        <Metin style={Yazi.ekranBasligi}>Etkinlikler</Metin>
        <Metin style={{ color: Colors.textMuted }}>Planları biz koyuyoruz; sen sadece “Katıl” de.</Metin>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} style={{ marginTop: -Bosluk.sm }}>
        <Cip metin="Senin için" secili={suzgec === 'senin'} onPress={() => setSuzgec('senin')} />
        <Cip metin={`Katıldıklarım (${katildigimPlanlar.length})`} secili={suzgec === 'katildiklarim'} onPress={() => setSuzgec('katildiklarim')} />
        {uye!.ilgiler.map((i) => (
          <Cip key={i} metin={ilgiAdi(i)} simge={ilgiSimge(i)} secili={suzgec === i} onPress={() => setSuzgec(i)} />
        ))}
      </ScrollView>
      <View style={{ gap: Bosluk.md }}>
        {liste.map((p) => (
          <PlanKarti key={p.id} plan={p} neden={planNedeni(uye!, p)} />
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
