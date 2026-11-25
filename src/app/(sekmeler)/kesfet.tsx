import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { KulupKarti } from '@/components/kartlar';
import { Avatar, BolumBasligi, Cip, Ekran, Kart, Metin, Neden } from '@/components/temel';
import { Bosluk, Colors, Yazi } from '@/constants/theme';
import { kisiOnerileri } from '@/data/eslestirme';
import { ilgiAdi, KULUPLER } from '@/data/ornek';
import { useOturum } from '@/data/oturum';

/** KESFET: kisiler (nedeniyle) ve tum kulupler */
export default function Kesfet() {
  const { uye, baglantilar } = useOturum();
  const [sekme, setSekme] = useState<'kisiler' | 'kulupler'>('kisiler');
  const oneriler = kisiOnerileri(uye!, 20, uye!.davetEden ? [uye!.davetEden] : []);
  const benimkiler = KULUPLER.filter((k) => uye!.ilgiler.includes(k.ilgi));
  const digerleri = KULUPLER.filter((k) => !uye!.ilgiler.includes(k.ilgi));

  return (
    <Ekran>
      <Metin style={Yazi.ekranBasligi}>Keşfet</Metin>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: -Bosluk.md }}>
        <Cip metin="Kişiler" secili={sekme === 'kisiler'} onPress={() => setSekme('kisiler')} />
        <Cip metin="Kulüpler" secili={sekme === 'kulupler'} onPress={() => setSekme('kulupler')} />
      </View>

      {sekme === 'kisiler' ? (
        <View style={{ gap: Bosluk.md }}>
          <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>
            Ortak ilgi alanı ve ortak tanıdığa göre sıralı. Her önerinin nedeni yazıyor.
          </Metin>
          {oneriler.map((o) => (
            <Kart key={o.kisi.id} onPress={() => router.push(`/kisi/${o.kisi.id}`)} style={{ padding: Bosluk.lg, flexDirection: 'row', gap: Bosluk.md }}>
              <Avatar ad={`${o.kisi.ad} ${o.kisi.soyadHarf}`} id={o.kisi.id} boyut={52} />
              <View style={{ flex: 1, gap: 4 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Metin style={Yazi.isim}>{o.kisi.ad} {o.kisi.soyadHarf}.</Metin>
                  {baglantilar.includes(o.kisi.id) && <Metin style={{ ...Yazi.etiket, color: Colors.textMuted }}>İstek gönderildi</Metin>}
                </View>
                <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>
                  {o.kisi.pozisyon} · {o.kisi.semt}
                </Metin>
                {o.nedenler.slice(0, 2).map((n) => (
                  <Neden key={n} metin={n} />
                ))}
              </View>
            </Kart>
          ))}
        </View>
      ) : (
        <View style={{ gap: Bosluk.xl }}>
          <View style={{ gap: Bosluk.md }}>
            <BolumBasligi baslik="İlgi alanlarına göre" />
            {benimkiler.map((k) => (
              <KulupKarti key={k.id} kulup={k} genis />
            ))}
          </View>
          <View style={{ gap: Bosluk.md }}>
            <BolumBasligi baslik="Diğer kulüpler" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Bosluk.md, paddingBottom: 12, paddingHorizontal: 2 }}>
              {digerleri.map((k) => (
                <KulupKarti key={k.id} kulup={k} />
              ))}
            </ScrollView>
            <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>
              Aynı ilgiyi seçenler yeterli sayıya ulaşınca kulüp ve sohbeti açılır. {ilgiAdi(digerleri[0]?.ilgi ?? '')} gibi kulüplere katılmak için ilgi alanı eklemen yeter.
            </Metin>
          </View>
        </View>
      )}
    </Ekran>
  );
}
