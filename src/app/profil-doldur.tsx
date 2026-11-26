import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Alan } from '@/components/alan';
import { Icon } from '@/components/icon';
import { Avatar, Cip, Dugme, Ekran, IlerlemeCubugu, Metin } from '@/components/temel';
import { Bosluk, Colors, Kose, Marka, Yazi } from '@/constants/theme';
import { IlgiAlaniSecici } from '@/components/ilgi-alani-secici';
import { fotoSec } from '@/data/foto';
import { ILGI_KATALOGU, POPULER_ILGILER } from '@/data/ilgi-alanlari';
import { MUZIK_KATALOGU } from '@/data/muzik';
import { ilgiAdi, kisiBul, SEHIRLER, SEMTLER } from '@/data/ornek';
import { useOturum } from '@/data/oturum';

/** Kayitta gorunen muzik tarzlari: katalogun populer ilk 6'si */
const KAYIT_TARZLARI = MUZIK_KATALOGU.alanlar.filter((a) => a.populer).slice(0, 6);

/**
 * PROFIL DOLDURMA (uyenin yolculugu 3) - ZORUNLU, en fazla 3 ekran.
 *  1. Fotograf + ad soyad (zorunlu), is (istege bagli)
 *  2. Ilgi alanlari: en az 3 (eslestirmede en guclu isaret), muzik istege bagli
 *  3. Sehir + semt (zorunlu), mezuniyet yili (istege bagli, gosterilmez)
 * Medeni durum sorulmaz, dogum yili sorulmaz.
 */
export default function ProfilDoldur() {
  const { davetEden, uye, profiliKaydet } = useOturum();
  const [adim, setAdim] = useState(1);
  const [ad, setAd] = useState('');
  const [foto, setFoto] = useState<string>();
  const [is, setIs] = useState('');
  const [ilgiler, setIlgiler] = useState<string[]>([]);
  const [muzik, setMuzik] = useState<string[]>([]);
  const [sehir, setSehir] = useState('İstanbul');
  const [semt, setSemt] = useState('');
  const [mezuniyet, setMezuniyet] = useState('');
  const [ilgiSeciciAcik, setIlgiSeciciAcik] = useState(false);

  if (uye) return <Redirect href="/ana-sayfa" />;
  if (!davetEden) return <Redirect href="/" />;
  const davetci = kisiBul(davetEden);

  const degistir = (liste: string[], id: string) => (liste.includes(id) ? liste.filter((x) => x !== id) : [...liste, id]);
  const gecerli = adim === 1 ? !!foto && ad.trim().length > 2 : adim === 2 ? ilgiler.length >= 3 : !!sehir && !!semt;

  const ileri = () => {
    if (adim < 3) return setAdim(adim + 1);
    const [pozisyon, ...sirketParca] = is.split(',').map((x) => x.trim());
    profiliKaydet({
      ad: ad.trim(),
      foto,
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
          <Pressable
            onPress={async () => { const f = await fotoSec(); if (f) setFoto(f); }}
            accessibilityLabel="Profil fotoğrafı seç"
            style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.md, padding: Bosluk.lg, borderRadius: Kose.lg, backgroundColor: Marka.seftali }}>
            {foto ? (
              <Avatar ad={ad || '?'} foto={foto} boyut={64} />
            ) : (
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center' }}>
                <Metin style={{ fontSize: 26 }}>📷</Metin>
              </View>
            )}
            <View style={{ flex: 1, gap: 2 }}>
              <Metin style={Yazi.isim}>{foto ? 'Fotoğrafın hazır' : 'Profil fotoğrafı ekle'}</Metin>
              <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>
                {foto ? 'Değiştirmek için dokun. Sonra profilinden de değiştirebilirsin.' : 'Zorunlu. Yüzünün göründüğü bir fotoğraf seç; istediğin zaman değiştirebilirsin.'}
              </Metin>
            </View>
          </Pressable>
          <Alan etiket="Ad soyad" deger={ad} degis={setAd} ipucu="Adın ve soyadın" />
          <Alan etiket="Pozisyon, şirket (isteğe bağlı)" deger={is} degis={setIs} ipucu="Örn. Ürün yöneticisi, bir banka" />
        </>
      )}

      {adim === 2 && (
        <>
          <View style={{ gap: Bosluk.sm }}>
            <Metin style={Yazi.ekranBasligi}>Nelerden hoşlanırsın?</Metin>
            <Metin style={{ color: Colors.textMuted }}>En az 3 tane seç. Sana kişi, plan ve kulüp önerirken en çok buna bakıyoruz.</Metin>
          </View>
          {/* Populer 12 + listede olmayan secilmisler; tamami "Daha fazla" penceresinde (ExCom) */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {[...POPULER_ILGILER, ...ilgiler.filter((i) => !POPULER_ILGILER.includes(i))].map((id) => (
              <Cip key={id} metin={ilgiAdi(id)} secili={ilgiler.includes(id)} onPress={() => setIlgiler(degistir(ilgiler, id))} />
            ))}
          </View>
          <Pressable onPress={() => setIlgiSeciciAcik(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingVertical: 4 }}>
            <Icon name="plus" size={16} color={Colors.accent} />
            <Metin style={{ ...Yazi.etiket, color: Colors.accent }}>Daha fazla ilgi alanı (173 seçenek)</Metin>
          </Pressable>
          <IlgiAlaniSecici gorunur={ilgiSeciciAcik} katalog={ILGI_KATALOGU} populer={POPULER_ILGILER} secilenler={ilgiler} tamam={(y) => { setIlgiler(y); setIlgiSeciciAcik(false); }} vazgec={() => setIlgiSeciciAcik(false)} />
          <View style={{ gap: Bosluk.sm }}>
            <Metin style={Yazi.isim}>Müzik zevkin (isteğe bağlı)</Metin>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {KAYIT_TARZLARI.map((m) => (
                <Cip key={m.id} metin={m.ad} secili={muzik.includes(m.id)} onPress={() => setMuzik(degistir(muzik, m.id))} />
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
