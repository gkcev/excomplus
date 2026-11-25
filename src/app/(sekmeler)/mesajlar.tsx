import { router } from 'expo-router';
import { View } from 'react-native';

import { Avatar, Ekran, Kart, Metin } from '@/components/temel';
import { Bosluk, Colors, Kose, Marka, Yazi } from '@/constants/theme';
import { ilgiSimge, kisiBul, kulupBul } from '@/data/ornek';
import { useOturum } from '@/data/oturum';

/** MESAJLAR: kisilerle birebir ve kulup sohbetleri */
export default function Mesajlar() {
  const { sohbetler } = useOturum();

  return (
    <Ekran>
      <Metin style={Yazi.ekranBasligi}>Mesajlar</Metin>
      <View style={{ gap: Bosluk.sm }}>
        {sohbetler.map((s) => {
          const son = s.mesajlar[s.mesajlar.length - 1];
          const kisi = s.tur === 'kisi' ? kisiBul(s.hedef) : undefined;
          const kulup = s.tur === 'kulup' ? kulupBul(s.hedef) : undefined;
          const ad = kisi ? `${kisi.ad} ${kisi.soyadHarf}.` : kulup?.ad ?? '';
          const yeni = son && son.kimden !== 'ben';
          const yazan = son && s.tur === 'kulup' && son.kimden !== 'ben' ? `${kisiBul(son.kimden)?.ad}: ` : son?.kimden === 'ben' ? 'Sen: ' : '';
          return (
            <Kart key={s.id} onPress={() => router.push(`/mesaj/${s.id}`)} style={{ padding: Bosluk.md, flexDirection: 'row', alignItems: 'center', gap: Bosluk.md }}>
              {kulup ? (
                <View style={{ width: 48, height: 48, borderRadius: Kose.md, backgroundColor: Marka.seftali, alignItems: 'center', justifyContent: 'center' }}>
                  <Metin style={{ fontSize: 22 }}>{ilgiSimge(kulup.ilgi)}</Metin>
                </View>
              ) : (
                <Avatar ad={ad} id={kisi?.id} boyut={48} />
              )}
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Metin style={Yazi.isim}>{ad}</Metin>
                  <Metin style={{ ...Yazi.etiket, color: Colors.textMuted, fontWeight: '400' }}>{son?.saat}</Metin>
                </View>
                <Metin numberOfLines={1} style={{ ...Yazi.ikincil, color: yeni ? Colors.text : Colors.textMuted, fontWeight: yeni ? '600' : '400' }}>
                  {yazan}
                  {son?.metin}
                </Metin>
              </View>
              {yeni && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: Marka.turuncu }} />}
            </Kart>
          );
        })}
      </View>
      <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted, textAlign: 'center' }}>
        Bir kulübe katıldığında kulüp sohbeti de burada görünür.
      </Metin>
    </Ekran>
  );
}
