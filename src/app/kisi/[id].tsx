import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { Icon } from '@/components/icon';
import { Avatar, Cip, Dugme, Ekran, Kart, Metin, Neden, UstBar } from '@/components/temel';
import { Bosluk, Colors, Kose, Marka, Yazi } from '@/constants/theme';
import { kisiPuani } from '@/data/eslestirme';
import { ilgiAdi, ilgiSimge, kisiBul, tamAd } from '@/data/ornek';
import { useOturum } from '@/data/oturum';

/** KISI PROFILI: neden onerildi, ortak tanidiklar, davet eden, tanis / mesaj */
export default function KisiProfili() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { uye, baglantilar, baglan } = useOturum();
  const k = kisiBul(id);
  if (!k || !uye) return <Ekran ust={<UstBar />}><Metin>Kişi bulunamadı.</Metin></Ekran>;

  const o = kisiPuani(uye, k);
  const davetci = k.davetEden ? kisiBul(k.davetEden) : undefined;
  const bagli = baglantilar.includes(k.id);
  const ortakIlgi = k.ilgiler.filter((i) => uye.ilgiler.includes(i));

  return (
    <Ekran ust={<UstBar />}>
      <View style={{ alignItems: 'center', gap: Bosluk.sm, marginTop: -Bosluk.md }}>
        <Avatar ad={`${k.ad} ${k.soyadHarf}`} id={k.id} boyut={150} />
        <Metin style={Yazi.ekranBasligi}>{tamAd(k)}</Metin>
        <Metin style={{ color: Colors.textMuted }}>{k.pozisyon} · {k.sirket}</Metin>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Icon name="map-pin" size={14} color={Colors.textMuted} />
          <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>{k.semt}, {k.sehir}</Metin>
        </View>
        {davetci && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Marka.seftali, borderRadius: Kose.hap, paddingHorizontal: 12, paddingVertical: 6 }}>
            <Icon name="gift" size={14} color={Colors.accent} />
            <Metin style={{ ...Yazi.etiket, color: Colors.accent }}>{tamAd(davetci)} davet etti</Metin>
          </View>
        )}
      </View>

      <View style={{ flexDirection: 'row', gap: Bosluk.md }}>
        <Dugme
          style={{ flex: 1 }}
          baslik={bagli ? 'İstek gönderildi' : 'Tanış'}
          ikon={bagli ? 'check' : 'user-plus'}
          tur={bagli ? 'hafif' : 'turuncu'}
          onPress={() => baglan(k.id)}
        />
        <Dugme style={{ flex: 1 }} baslik="Mesaj" ikon="comment" tur="cizgili" onPress={() => router.push(`/mesaj/${k.id}`)} />
      </View>

      {o.nedenler.length > 0 && (
        <Kart style={{ padding: Bosluk.lg, gap: Bosluk.sm }}>
          <Metin style={Yazi.kartBasligi}>Neden öneriyoruz?</Metin>
          {o.nedenler.map((n) => (
            <Neden key={n} metin={n} />
          ))}
        </Kart>
      )}

      {o.ortakTanidik.length > 0 && (
        <View style={{ gap: Bosluk.md }}>
          <Metin style={Yazi.bolumBasligi}>İkinizin de tanıdığı {o.ortakTanidik.length} kişi</Metin>
          <View style={{ flexDirection: 'row', gap: Bosluk.md, flexWrap: 'wrap' }}>
            {o.ortakTanidik.map((t) => {
              const tk = kisiBul(t);
              if (!tk) return null;
              return (
                <View key={t} style={{ alignItems: 'center', gap: 4, width: 64 }}>
                  <Avatar ad={`${tk.ad} ${tk.soyadHarf}`} id={tk.id} boyut={48} />
                  <Metin style={Yazi.etiket} numberOfLines={1}>{tk.ad}</Metin>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {k.hakkinda && (
        <View style={{ gap: Bosluk.sm }}>
          <Metin style={Yazi.bolumBasligi}>Hakkında</Metin>
          <Metin>{k.hakkinda}</Metin>
        </View>
      )}

      <View style={{ gap: Bosluk.md }}>
        <Metin style={Yazi.bolumBasligi}>İlgi alanları</Metin>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {k.ilgiler.map((i) => (
            <Cip key={i} metin={ilgiAdi(i)} simge={ilgiSimge(i)} secili={ortakIlgi.includes(i)} />
          ))}
        </View>
        {ortakIlgi.length > 0 && <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>Turuncu olanlar ortak ilgi alanlarınız.</Metin>}
      </View>
    </Ekran>
  );
}
