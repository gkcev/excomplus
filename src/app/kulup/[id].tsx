import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { PlanKarti } from '@/components/kartlar';
import { Dugme, Ekran, IlerlemeCubugu, Kart, Metin, UstBar } from '@/components/temel';
import { Bosluk, Colors, Kose, Marka, Yazi } from '@/constants/theme';
import { ilgiAdi, ilgiSimge, kulupBul, PLANLAR } from '@/data/ornek';
import { useOturum } from '@/data/oturum';

/**
 * KULUP: ayni ilgiyi secenler esige ulasinca kulup ve sohbeti acilir.
 * Esik dolmadan "Ben de varim" denir; dolunca sohbet acilir.
 */
export default function KulupDetay() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { kuluplerim, kulubeKatil } = useOturum();
  const k = kulupBul(id);
  if (!k) return <Ekran ust={<UstBar />}><Metin>Kulüp bulunamadı.</Metin></Ekran>;

  const uyeyim = kuluplerim.includes(k.id);
  const sayi = k.uyeler.length + (uyeyim ? 1 : 0);
  const acik = sayi >= k.esik;
  const planlar = PLANLAR.filter((p) => p.ilgiler.includes(k.ilgi));

  return (
    <Ekran ust={<UstBar />}>
      <View style={{ alignItems: 'center', gap: Bosluk.sm, marginTop: -Bosluk.md }}>
        <View style={{ width: 88, height: 88, borderRadius: Kose.xl, backgroundColor: Marka.seftali, alignItems: 'center', justifyContent: 'center' }}>
          <Metin style={{ fontSize: 44 }}>{ilgiSimge(k.ilgi)}</Metin>
        </View>
        <Metin style={Yazi.ekranBasligi}>{k.ad}</Metin>
        <Metin style={{ color: Colors.textMuted, textAlign: 'center' }}>{k.aciklama}</Metin>
      </View>

      <Kart style={{ padding: Bosluk.lg, gap: Bosluk.md }}>
        {acik ? (
          <>
            <Metin style={Yazi.kartBasligi}>Kulüp açık · {sayi} üye</Metin>
            <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>
              {uyeyim ? 'Kulüp sohbetine yazabilirsin.' : 'Katıl, kulüp sohbetine ve buluşmalarına sen de dahil ol.'}
            </Metin>
          </>
        ) : (
          <>
            <Metin style={Yazi.kartBasligi}>Kulüp oluşuyor · {sayi} / {k.esik}</Metin>
            <IlerlemeCubugu oran={sayi / k.esik} />
            <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>
              {ilgiAdi(k.ilgi)} seven {k.esik - sayi} kişi daha katılınca kulüp ve sohbeti açılır. Açıldığında haber vereceğiz.
            </Metin>
          </>
        )}
        {uyeyim && acik ? (
          <View style={{ flexDirection: 'row', gap: Bosluk.md }}>
            <Dugme style={{ flex: 1 }} baslik="Sohbete git" ikon="comment" tur="turuncu" onPress={() => router.push(`/mesaj/kulup-${k.id}`)} />
            <Dugme baslik="Ayrıl" tur="cizgili" onPress={() => kulubeKatil(k.id)} />
          </View>
        ) : (
          <Dugme
            baslik={uyeyim ? 'Bekleme listesindesin · vazgeç' : acik ? 'Kulübe katıl' : 'Ben de varım'}
            tur={uyeyim ? 'cizgili' : 'turuncu'}
            onPress={() => kulubeKatil(k.id)}
          />
        )}
      </Kart>

      {planlar.length > 0 && (
        <View style={{ gap: Bosluk.md }}>
          <Metin style={Yazi.bolumBasligi}>Yaklaşan buluşmalar</Metin>
          {planlar.map((p) => (
            <PlanKarti key={p.id} plan={p} />
          ))}
        </View>
      )}
    </Ekran>
  );
}
