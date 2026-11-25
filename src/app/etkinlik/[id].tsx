import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Avatar, Dugme, Ekran, KulupGorseli, Metin, Neden, UstBar } from '@/components/temel';
import { Bosluk, Colors, Kose, Marka, Yazi } from '@/constants/theme';
import { planNedeni } from '@/data/eslestirme';
import { kisiBul, kulupBul, tamAd } from '@/data/ornek';
import { useOturum } from '@/data/oturum';

/** PLAN / ETKINLIK DETAYI: kimler katiliyor (tanidiklar once), katil */
export default function EtkinlikDetay() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { uye, katildigimPlanlar, planaKatil, planiBul, kuluplerim, kulubeKatil } = useOturum();
  const p = planiBul(id);
  if (!p || !uye) return <Ekran ust={<UstBar />}><Metin>Plan bulunamadı.</Metin></Ekran>;

  const katildim = katildigimPlanlar.includes(p.id);
  const sayi = p.katilan.length + (katildim ? 1 : 0);
  const katilanlar = [...p.katilan].sort((a, b) => Number(uye.tanidiklar.includes(b)) - Number(uye.tanidiklar.includes(a)));
  const neden = planNedeni(uye, p);
  const kulup = p.kulup ? kulupBul(p.kulup) : undefined;
  const kulupteyim = !!kulup && kuluplerim.includes(kulup.id);
  const evSahibi = p.evSahibi === 'ben' ? 'Sen' : p.evSahibi ? (kisiBul(p.evSahibi) ? tamAd(kisiBul(p.evSahibi)!) : undefined) : undefined;
  const katil = () => {
    // Kulup bulusmasina katilan, kulupte degilse kulube de katilir
    if (!katildim && kulup && !kulupteyim) kulubeKatil(kulup.id);
    planaKatil(p.id);
  };

  return (
    <Ekran
      ust={<UstBar baslik={p.tur} />}
      alt={
        <View style={{ padding: Bosluk.lg, borderTopWidth: 1, borderTopColor: Colors.divider, backgroundColor: Colors.background }}>
          <Dugme
            baslik={katildim ? 'Katılıyorsun · vazgeç' : sayi >= p.kontenjan ? 'Kontenjan doldu' : 'Katıl'}
            tur={katildim ? 'cizgili' : 'turuncu'}
            pasif={!katildim && sayi >= p.kontenjan}
            onPress={katil}
          />
        </View>
      }>
      <Image source={p.gorsel} style={{ width: '100%', height: 220, borderRadius: Kose.xl, marginTop: -Bosluk.md }} contentFit="cover" />
      <View style={{ gap: Bosluk.sm }}>
        <Metin style={Yazi.ekranBasligi}>{p.baslik}</Metin>
        {neden && <Neden metin={neden} />}
      </View>
      <View style={{ gap: Bosluk.sm }}>
        <Bilgi ikon="calendar" metin={`${p.gun} · ${p.saat}`} />
        <Bilgi ikon="map-pin" metin={`${p.mekan} · ${p.semt}`} />
        <Bilgi ikon="users" metin={`${sayi} / ${p.kontenjan} kişi`} />
      </View>
      {kulup && (
        <Pressable onPress={() => router.push(`/kulup/${kulup.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.md, padding: Bosluk.md, borderRadius: Kose.lg, backgroundColor: Marka.seftali }}>
          <KulupGorseli ilgi={kulup.ilgi} genislik={48} yukseklik={48} />
          <View style={{ flex: 1 }}>
            <Metin style={Yazi.isim}>{kulup.ad} buluşması</Metin>
            <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>
              {kulupteyim ? `Ev sahibi: ${evSahibi ?? 'ekip'}` : 'Katılırsan kulübe de katılırsın.'}
            </Metin>
          </View>
          <Icon name="chevron-right" size={18} color={Colors.textMuted} />
        </Pressable>
      )}
      <Metin>{p.aciklama}</Metin>

      <View style={{ gap: Bosluk.md }}>
        <Metin style={Yazi.bolumBasligi}>Kimler geliyor</Metin>
        {katilanlar.map((kid) => {
          const k = kisiBul(kid);
          if (!k) return null;
          const tanidik = uye.tanidiklar.includes(k.id);
          return (
            <Pressable key={kid} onPress={() => router.push(`/kisi/${kid}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.md }}>
              <Avatar ad={`${k.ad} ${k.soyadHarf}`} id={k.id} boyut={40} />
              <View style={{ flex: 1 }}>
                <Metin style={Yazi.isim}>{k.ad} {k.soyadHarf}.</Metin>
                <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>{k.pozisyon}</Metin>
              </View>
              {tanidik && (
                <View style={{ backgroundColor: Marka.seftali, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 }}>
                  <Metin style={{ ...Yazi.etiket, color: Colors.accent }}>Tanıdık</Metin>
                </View>
              )}
            </Pressable>
          );
        })}
        {katildim && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.md }}>
            <Avatar ad={uye.ad} id="ben" boyut={40} foto={uye.foto} />
            <Metin style={Yazi.isim}>Sen</Metin>
          </View>
        )}
      </View>
    </Ekran>
  );
}

function Bilgi({ ikon, metin }: { ikon: 'calendar' | 'map-pin' | 'users'; metin: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Icon name={ikon} size={18} color={Colors.accent} />
      <Metin>{metin}</Metin>
    </View>
  );
}
