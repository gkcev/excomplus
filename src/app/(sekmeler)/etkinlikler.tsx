import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { PlanKarti } from '@/components/kartlar';
import { Ekran, Kart, Metin } from '@/components/temel';
import { Bosluk, Colors, Marka, Yazi } from '@/constants/theme';
import { planNedeni, planPuani } from '@/data/eslestirme';
import { kulupBul } from '@/data/ornek';
import { useOturum } from '@/data/oturum';
import { Icon } from '@/components/icon';
import { ayAdi, ayIzgarasi, ayniGun, etkinlikTarihi, HAFTA_BASLIK, uzunTarih } from '@/data/takvim';

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
  const hepsi = planlar.filter((p) => gorur(p.kulup)).sort((a, b) => planPuani(uye!, b) - planPuani(uye!, a));

  // Aylik takvim: bir gune dokununca o gunun etkinlikleri listelenir
  const bugun = new Date();
  const [secili, setSecili] = useState<Date | null>(null);
  const [ay, setAy] = useState({ yil: bugun.getFullYear(), ay: bugun.getMonth() });
  const izgara = ayIzgarasi(ay.yil, ay.ay);
  const ayDegistir = (fark: number) => {
    const d = new Date(ay.yil, ay.ay + fark, 1);
    setAy({ yil: d.getFullYear(), ay: d.getMonth() });
  };
  const gecmis = (d: Date) => d < new Date(bugun.getFullYear(), bugun.getMonth(), bugun.getDate());
  const gununPlanlari = (d: Date) => hepsi.filter((p) => {
    const t = etkinlikTarihi(p.gun);
    return !!t && ayniGun(t, d);
  });
  const liste = secili ? gununPlanlari(secili) : hepsi;

  return (
    <Ekran>
      <View style={{ gap: 4 }}>
        <Metin style={Yazi.ekranBasligi}>Etkinlikler</Metin>
        <Metin style={{ color: Colors.textMuted }}>Ekibin planları ve kulüplerin buluşmaları; sen sadece “Katıl” de.</Metin>
      </View>
      {/* Aylik takvim */}
      <Kart style={{ padding: Bosluk.md, gap: Bosluk.sm, marginTop: -Bosluk.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable onPress={() => ayDegistir(-1)} hitSlop={10} accessibilityLabel="Önceki ay" style={{ padding: 4, transform: [{ scaleX: -1 }] }}>
            <Icon name="chevron-right" size={20} color={Colors.text} />
          </Pressable>
          <Metin style={Yazi.kartBasligi}>{ayAdi(new Date(ay.yil, ay.ay, 1))} {ay.yil}</Metin>
          <Pressable onPress={() => ayDegistir(1)} hitSlop={10} accessibilityLabel="Sonraki ay" style={{ padding: 4 }}>
            <Icon name="chevron-right" size={20} color={Colors.text} />
          </Pressable>
        </View>
        <View style={{ flexDirection: 'row' }}>
          {HAFTA_BASLIK.map((h, i) => (
            <Metin key={h} style={{ ...Yazi.etiket, width: `${100 / 7}%`, textAlign: 'center', color: i >= 5 ? Colors.accent : Colors.textMuted }}>{h}</Metin>
          ))}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {izgara.map((d, i) => {
            if (!d) return <View key={i} style={{ width: `${100 / 7}%`, height: 46 }} />;
            const sec = !!secili && ayniGun(d, secili);
            const bugunMu = ayniGun(d, bugun);
            const eski = gecmis(d);
            const sayi = eski ? 0 : gununPlanlari(d).length;
            return (
              <View key={i} style={{ width: `${100 / 7}%`, height: 46, alignItems: 'center', justifyContent: 'center' }}>
                <Pressable
                  onPress={() => setSecili(sec ? null : d)}
                  disabled={eski}
                  accessibilityRole="button"
                  accessibilityLabel={`${uzunTarih(d)}, ${sayi} etkinlik`}
                  accessibilityState={{ selected: sec, disabled: eski }}
                  style={{
                    width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
                    backgroundColor: sec ? Marka.turuncu : 'transparent',
                    borderWidth: bugunMu && !sec ? 1.5 : 0, borderColor: Marka.turuncu,
                  }}>
                  <Metin style={{ fontSize: 15, fontWeight: sayi ? '700' : '400', color: sec ? Colors.white : eski ? Colors.textFaint : Colors.text }}>
                    {d.getDate()}
                  </Metin>
                  {sayi > 0 && (
                    <View style={{ position: 'absolute', bottom: 4, width: 5, height: 5, borderRadius: 3, backgroundColor: sec ? Colors.white : Marka.turuncu }} />
                  )}
                </Pressable>
              </View>
            );
          })}
        </View>
      </Kart>

      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: -Bosluk.sm }}>
        <Metin style={Yazi.bolumBasligi}>
          {secili ? uzunTarih(secili) : 'Yaklaşanlar'}
        </Metin>
        {secili ? (
          <Pressable onPress={() => setSecili(null)} hitSlop={8}>
            <Metin style={{ ...Yazi.etiket, color: Colors.accent }}>Tümünü gör</Metin>
          </Pressable>
        ) : null}
      </View>

      <View style={{ gap: Bosluk.md }}>
        {liste.map((p) => (
          <PlanKarti key={p.id} plan={p} neden={planNedeni(uye!, p)} tur="yan" />
        ))}
        {liste.length === 0 && (
          <Metin style={{ color: Colors.textMuted, textAlign: 'center', paddingVertical: Bosluk.xl }}>
            {secili ? 'Bu gün için henüz plan yok. Başka bir güne bak ya da kulübünde bir buluşma öner.' : 'Burada henüz plan yok. Yeni planlar her ay başında ekleniyor.'}
          </Metin>
        )}
      </View>
    </Ekran>
  );
}
