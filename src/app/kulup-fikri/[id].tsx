import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { Icon } from '@/components/icon';
import { Avatar, Dugme, Ekran, IlerlemeCubugu, Kart, KulupGorseli, Metin, UstBar } from '@/components/temel';
import { Bosluk, Colors, Kose, Marka, Yazi } from '@/constants/theme';
import { FIKIR_ESIGI, fikirSayisi, ilgiAdi, kisiBul, KULUP_FIKIRLERI } from '@/data/ornek';
import { useOturum } from '@/data/oturum';

/**
 * KULUP ONERISI DETAYI
 * Surec 4 adim: oneri -> destek toplama -> ekip onayi -> kulup acilir.
 */
export default function KulupFikri() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { uye, fikirlerim, destekledigimFikirler, fikriDestekle } = useOturum();
  const f = [...fikirlerim, ...KULUP_FIKIRLERI].find((x) => x.id === id);
  if (!f) return <Ekran ust={<UstBar />}><Metin>Öneri bulunamadı.</Metin></Ekran>;

  const benim = f.oneren === 'ben';
  const destekledim = destekledigimFikirler.includes(f.id);
  const sayi = fikirSayisi(f) + (destekledim ? 1 : 0);
  const doldu = sayi >= FIKIR_ESIGI;
  const oneren = benim ? undefined : kisiBul(f.oneren);
  const onerenAd = benim ? 'Sen' : oneren ? `${oneren.ad} ${oneren.soyadHarf}.` : 'Bir üye';
  const destekciler = [...(destekledim ? ['ben'] : []), ...f.destekciler];

  const adimlar = [
    { baslik: 'Önerildi', alt: benim ? 'Sen önerdin' : `${onerenAd} önerdi`, tamam: true },
    { baslik: `${FIKIR_ESIGI} kişi “Ben de varım” der`, alt: `${sayi} / ${FIKIR_ESIGI} kişi`, tamam: doldu },
    { baslik: 'Ekip kontrol eder', alt: 'Genelde 1-2 gün', tamam: false },
    { baslik: 'Kulüp ve sohbeti açılır', alt: f.evSahibi ? `Ev sahibi: ${onerenAd}` : 'Ev sahibi aranıyor', tamam: false },
  ];
  const aktif = doldu ? 2 : 1;

  return (
    <Ekran
      ust={<UstBar baslik="Kulüp önerisi" />}
      alt={
        !benim ? (
          <View style={{ padding: Bosluk.lg, borderTopWidth: 1, borderTopColor: Colors.divider, backgroundColor: Colors.background }}>
            <Dugme
              baslik={destekledim ? 'Varım dedin · vazgeç' : 'Ben de varım'}
              tur={destekledim ? 'cizgili' : 'turuncu'}
              onPress={() => fikriDestekle(f.id)}
            />
          </View>
        ) : undefined
      }>
      <View style={{ alignItems: 'center', gap: Bosluk.sm, marginTop: -Bosluk.md }}>
        <KulupGorseli ilgi={f.ilgi} genislik="100%" yukseklik={230} kose={Kose.xl} />
        <Metin style={{ ...Yazi.etiket, color: Colors.accent }}>ÖNERİ · {ilgiAdi(f.ilgi).toLocaleUpperCase('tr')}</Metin>
        <Metin style={{ ...Yazi.ekranBasligi, textAlign: 'center' }}>{f.ad}</Metin>
        <Metin style={{ color: Colors.textMuted, textAlign: 'center' }}>{f.aciklama}</Metin>
      </View>

      <Kart style={{ padding: Bosluk.lg, gap: Bosluk.md }}>
        <Metin style={Yazi.kartBasligi}>{doldu ? 'Destek tamam, ekip onayında' : `${FIKIR_ESIGI - sayi} kişi daha gerekli`}</Metin>
        <IlerlemeCubugu oran={Math.min(1, sayi / FIKIR_ESIGI)} />
        {benim && !doldu && (
          <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>
            {ilgiAdi(f.ilgi)} seven üyelere önerini gösteriyoruz. Tanıdığın birini davet edersen daha hızlı dolar.
          </Metin>
        )}
      </Kart>

      <View style={{ gap: Bosluk.md }}>
        <Metin style={Yazi.bolumBasligi}>Nasıl açılır?</Metin>
        {adimlar.map((a, i) => (
          <View key={a.baslik} style={{ flexDirection: 'row', gap: Bosluk.md, alignItems: 'center' }}>
            <View
              style={{
                width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
                backgroundColor: a.tamam ? Marka.turuncu : i === aktif ? Marka.seftali : Colors.white,
                borderWidth: a.tamam ? 0 : 1.5, borderColor: i === aktif ? Marka.turuncu : Colors.borderInput,
              }}>
              {a.tamam ? <Icon name="check" size={14} color={Colors.white} strokeWidth={3} /> : <Metin style={Yazi.etiket}>{i + 1}</Metin>}
            </View>
            <View style={{ flex: 1 }}>
              <Metin style={Yazi.isim}>{a.baslik}</Metin>
              <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>{a.alt}</Metin>
            </View>
          </View>
        ))}
      </View>

      <View style={{ gap: Bosluk.md }}>
        <Metin style={Yazi.bolumBasligi}>Varım diyenler</Metin>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Bosluk.md }}>
          {[benim ? 'ben' : f.oneren, ...destekciler].map((kid) => {
            const k = kid === 'ben' ? undefined : kisiBul(kid);
            const ad = kid === 'ben' ? uye!.ad : k ? `${k.ad} ${k.soyadHarf}` : '?';
            return (
              <View key={kid} style={{ alignItems: 'center', gap: 4, width: 64 }}>
                <Avatar ad={ad} id={kid} foto={kid === 'ben' ? uye!.foto : undefined} boyut={48} />
                <Metin style={{ ...Yazi.ikincil, textAlign: 'center' }} numberOfLines={1}>{kid === 'ben' ? 'Sen' : k?.ad}</Metin>
              </View>
            );
          })}
        </View>
      </View>
    </Ekran>
  );
}
