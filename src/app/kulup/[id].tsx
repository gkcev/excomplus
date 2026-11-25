import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { PlanKarti } from '@/components/kartlar';
import { Avatar, Dugme, Ekran, IlerlemeCubugu, Kart, KulupGorseli, Metin, UstBar } from '@/components/temel';
import { Bosluk, Colors, Kose, Yazi } from '@/constants/theme';
import { ilgiAdi, kisiBul, kulupBul, tamAd } from '@/data/ornek';
import { useOturum } from '@/data/oturum';

/**
 * KULUP: ayni ilgiyi secenler esige ulasinca kulup ve sohbeti acilir.
 * Esik dolmadan "Ben de varim" denir; dolunca sohbet acilir.
 */
export default function KulupDetay() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { uye, kuluplerim, kulubeKatil, planlar: tumPlanlar, evSahibiKuluplerim, evSahibiOl } = useOturum();
  const k = kulupBul(id);
  if (!k) return <Ekran ust={<UstBar />}><Metin>Kulüp bulunamadı.</Metin></Ekran>;

  const uyeyim = kuluplerim.includes(k.id);
  const sayi = k.uyeler.length + (uyeyim ? 1 : 0);
  const acik = sayi >= k.esik;
  const planlar = tumPlanlar.filter((p) => p.kulup === k.id || (!p.kulup && p.ilgiler.includes(k.ilgi)));
  const benEvSahibiyim = evSahibiKuluplerim.includes(k.id);
  const evSahibi = benEvSahibiyim ? undefined : k.evSahibi ? kisiBul(k.evSahibi) : undefined;

  return (
    <Ekran ust={<UstBar />}>
      <View style={{ alignItems: 'center', gap: Bosluk.sm, marginTop: -Bosluk.md }}>
        <KulupGorseli ilgi={k.ilgi} genislik="100%" yukseklik={230} kose={Kose.xl} />
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
            {uyeyim && uye?.ilgiler.includes(k.ilgi) && (
              <Metin style={{ ...Yazi.ikincil, color: Colors.accent }}>
                İlgi alanlarında {ilgiAdi(k.ilgi).toLocaleLowerCase('tr')} olduğu için seni bekleme listesine ekledik.
              </Metin>
            )}
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

      {/* Ev sahibi: kulup bulusmasini o koyar */}
      {acik && uyeyim && (
        <Kart style={{ padding: Bosluk.lg, gap: Bosluk.sm }}>
          {benEvSahibiyim ? (
            <>
              <Metin style={Yazi.kartBasligi}>Ev sahibisin</Metin>
              <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>
                Sohbette konuşulan buluşmayı buradan koy; Etkinlikler’de “Kulüp buluşması” olarak görünür ve sohbete düşer.
              </Metin>
              <Dugme baslik="Buluşma koy" ikon="plus" tur="turuncu" onPress={() => router.push({ pathname: '/bulusma-koy', params: { kulup: k.id } })} />
            </>
          ) : evSahibi ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.md }}>
              <Avatar ad={tamAd(evSahibi)} id={evSahibi.id} boyut={44} />
              <View style={{ flex: 1 }}>
                <Metin style={Yazi.isim}>Ev sahibi: {tamAd(evSahibi)}</Metin>
                <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>Buluşmaları o koyar. Fikrin varsa sohbete yaz.</Metin>
              </View>
            </View>
          ) : (
            <>
              <Metin style={Yazi.kartBasligi}>Bu kulübün henüz ev sahibi yok</Metin>
              <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>
                Ev sahibi kulübün buluşmalarını koyar. İlk buluşmayı ekip seninle birlikte planlar.
              </Metin>
              <Dugme baslik="Ev sahibi ol" tur="cizgili" onPress={() => evSahibiOl(k.id)} />
            </>
          )}
        </Kart>
      )}

      {planlar.length > 0 && (
        <View style={{ gap: Bosluk.md }}>
          <Metin style={Yazi.bolumBasligi}>Yaklaşan buluşmalar</Metin>
          {planlar.map((p) => (
            <PlanKarti key={p.id} plan={p} tur="yan" />
          ))}
        </View>
      )}
    </Ekran>
  );
}
