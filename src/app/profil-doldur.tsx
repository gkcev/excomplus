import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Alan } from '@/components/alan';
import { Cip, Dugme, Ekran, IlerlemeCubugu, Metin } from '@/components/temel';
import { Bosluk, Colors, Kose, Marka, Yazi } from '@/constants/theme';
import { ILGI_ALANLARI, kisiBul, SEHIRLER, SEMTLER } from '@/data/ornek';
import { useOturum } from '@/data/oturum';

const MUZIK = ['caz', 'rock', 'pop', 'klasik', 'indie', 'elektronik'];

/**
 * PROFIL DOLDURMA (uyenin yolculugu 3) - ZORUNLU, en fazla 3 ekran.
 *  1. Ad soyad (zorunlu), is (istege bagli)
 *  2. Ilgi alanlari: en az 3 (eslestirmede en guclu isaret), muzik istege bagli
 *  3. Sehir + semt (zorunlu), mezuniyet yili (istege bagli, gosterilmez)
 * Medeni durum sorulmaz, dogum yili sorulmaz.
 */
export default function ProfilDoldur() {
  const { davetEden, uye, profiliKaydet } = useOturum();
  const [adim, setAdim] = useState(1);
  const [ad, setAd] = useState('');
  const [is, setIs] = useState('');
  const [ilgiler, setIlgiler] = useState<string[]>([]);
  const [muzik, setMuzik] = useState<string[]>([]);
  const [sehir, setSehir] = useState('İstanbul');
  const [semt, setSemt] = useState('');
  const [mezuniyet, setMezuniyet] = useState('');

  if (uye) return <Redirect href="/ana-sayfa" />;
  if (!davetEden) return <Redirect href="/" />;
  const davetci = kisiBul(davetEden);

  const degistir = (liste: string[], id: string) => (liste.includes(id) ? liste.filter((x) => x !== id) : [...liste, id]);
  const gecerli = adim === 1 ? ad.trim().length > 2 : adim === 2 ? ilgiler.length >= 3 : !!sehir && !!semt;

  const ileri = () => {
    if (adim < 3) return setAdim(adim + 1);
    const [pozisyon, ...sirketParca] = is.split(',').map((x) => x.trim());
    profiliKaydet({
      ad: ad.trim(),
      sehir,
      semt,
      ilgiler,
      muzik,
      tanidiklar: [],
      pozisyon: pozisyon || undefined,
      sirket: sirketParca.join(', ') || undefined,
      mezuniyet: Number(mezuniyet) || undefined,
    });
    router.replace('/ana-sayfa');
  };

  return (
    <Ekran
      ust={
        <View style={{ paddingHorizontal: Bosluk.lg, paddingTop: Bosluk.lg, gap: Bosluk.sm }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Metin style={{ ...Yazi.etiket, color: Colors.textMuted }}>{adim} / 3 · zorunlu</Metin>
            {adim > 1 && (
              <Pressable onPress={() => setAdim(adim - 1)} hitSlop={8}>
                <Metin style={{ ...Yazi.etiket, color: Colors.accent }}>Geri</Metin>
              </Pressable>
            )}
          </View>
          <IlerlemeCubugu oran={adim / 3} />
        </View>
      }
      alt={
        <View style={{ padding: Bosluk.lg, gap: Bosluk.sm }}>
          {adim === 2 && (
            <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted, textAlign: 'center' }}>
              {ilgiler.length < 3 ? `${3 - ilgiler.length} tane daha seç` : `${ilgiler.length} ilgi alanı seçtin`}
            </Metin>
          )}
          <Dugme baslik={adim === 3 ? 'Tamamla' : 'Devam'} pasif={!gecerli} onPress={ileri} />
        </View>
      }>
      {adim === 1 && (
        <>
          <View style={{ gap: Bosluk.sm }}>
            <Metin style={Yazi.ekranBasligi}>Hoş geldin!</Metin>
            {davetci && (
              <Metin style={{ color: Colors.textMuted }}>
                {davetci.ad} {davetci.soyadHarf}.’nin daveti ile geldin. Profilinde “{davetci.ad} davet etti” yazacak.
              </Metin>
            )}
          </View>
          <Alan etiket="Ad soyad" deger={ad} degis={setAd} ipucu="Adın ve soyadın" />
          <Alan etiket="Pozisyon, şirket (isteğe bağlı)" deger={is} degis={setIs} ipucu="Örn. Ürün yöneticisi, bir banka" />
          <View style={{ padding: Bosluk.lg, borderRadius: Kose.lg, backgroundColor: Marka.seftali, gap: 4 }}>
            <Metin style={Yazi.isim}>📷 Fotoğraf önerilir</Metin>
            <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>
              Fotoğraflı profiller daha çok tanışma isteği alıyor. Sonra profilinden ekleyebilirsin.
            </Metin>
          </View>
        </>
      )}

      {adim === 2 && (
        <>
          <View style={{ gap: Bosluk.sm }}>
            <Metin style={Yazi.ekranBasligi}>Nelerden hoşlanırsın?</Metin>
            <Metin style={{ color: Colors.textMuted }}>En az 3 tane seç. Sana kişi, plan ve kulüp önerirken en çok buna bakıyoruz.</Metin>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {ILGI_ALANLARI.map((i) => (
              <Cip key={i.id} metin={i.ad} simge={i.simge} secili={ilgiler.includes(i.id)} onPress={() => setIlgiler(degistir(ilgiler, i.id))} />
            ))}
          </View>
          <View style={{ gap: Bosluk.sm }}>
            <Metin style={Yazi.isim}>Müzik zevkin (isteğe bağlı)</Metin>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {MUZIK.map((m) => (
                <Cip key={m} metin={m} secili={muzik.includes(m)} onPress={() => setMuzik(degistir(muzik, m))} />
              ))}
            </View>
          </View>
        </>
      )}

      {adim === 3 && (
        <>
          <View style={{ gap: Bosluk.sm }}>
            <Metin style={Yazi.ekranBasligi}>Nerede yaşıyorsun?</Metin>
            <Metin style={{ color: Colors.textMuted }}>Yakınındaki planları ve kişileri göstermek için.</Metin>
          </View>
          <View style={{ gap: Bosluk.sm }}>
            <Metin style={{ ...Yazi.etiket, color: Colors.textMuted }}>ŞEHİR</Metin>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {SEHIRLER.map((s) => (
                <Cip key={s} metin={s} secili={sehir === s} onPress={() => { setSehir(s); setSemt(''); }} />
              ))}
            </View>
          </View>
          <View style={{ gap: Bosluk.sm }}>
            <Metin style={{ ...Yazi.etiket, color: Colors.textMuted }}>SEMT</Metin>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {(SEMTLER[sehir] ?? []).map((s) => (
                <Cip key={s} metin={s} secili={semt === s} onPress={() => setSemt(s)} />
              ))}
            </View>
          </View>
          <Alan etiket="Mezuniyet yılı (isteğe bağlı)" deger={mezuniyet} degis={(t) => setMezuniyet(t.replace(/\D/g, '').slice(0, 4))} klavye="number-pad" ipucu="Örn. 2012" />
          <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted, marginTop: -Bosluk.md }}>
            Profilinde görünmez; yalnızca yakın kuşaktan kişileri önermek için.
          </Metin>
        </>
      )}
    </Ekran>
  );
}
