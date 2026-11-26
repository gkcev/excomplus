import { Redirect, router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { Alan } from '@/components/alan';
import { EskiSirketSecici } from '@/components/eski-sirket-secici';
import { Icon } from '@/components/icon';
import { Avatar, Cip, Dugme, Ekran, IlerlemeCubugu, Metin } from '@/components/temel';
import { Bosluk, Colors, Durum, Kose, Marka, Yazi } from '@/constants/theme';
import type { OrtakNoktaTuru } from '@/data/eslestirme';
import { IlgiAlaniSecici } from '@/components/ilgi-alani-secici';
import { ORTAK_NOKTA } from '@/components/ortak-nokta';
import { UniversiteSecici } from '@/components/universite-secici';
import { fotoSec } from '@/data/foto';
import { ILGI_KATALOGU, POPULER_ILGILER } from '@/data/ilgi-alanlari';
import { MUZIK_KATALOGU } from '@/data/muzik';
import { ilgiAdi, kisiBul, SEHIRLER, SEMTLER } from '@/data/ornek';
import { useOturum } from '@/data/oturum';

/** Kayitta gorunen muzik tarzlari: katalogun populer ilk 6'si */
const KAYIT_TARZLARI = MUZIK_KATALOGU.alanlar.filter((a) => a.populer).slice(0, 6);

/**
 * PROFIL DOLDURMA (uyenin yolculugu 3) - ZORUNLU, en fazla 3 ekran.
 *  1. Fotograf + ad soyad (zorunlu)
 *  2. ORTAK NOKTALARINI EKLE (26 Kasim 2026): arkadaslik ortak bir noktadan baslar.
 *     Hobilerin acik ve zorunlu (en az 3); Okulun, Isin, Muzigin istege bagli,
 *     tek dokunusla acilir. Ne eklerse oradan arkadas onerilir.
 *  3. Sehir + semt (zorunlu): yakinindakiler de bir ortak nokta
 * Medeni durum sorulmaz, dogum yili sorulmaz.
 */
export default function ProfilDoldur() {
  const { davetEden, uye, profiliKaydet } = useOturum();
  const [adim, setAdim] = useState(1);
  const [ad, setAd] = useState('');
  const [foto, setFoto] = useState<string>();
  const [sirket, setSirket] = useState('');
  const [pozisyon, setPozisyon] = useState('');
  const [eskiSirketler, setEskiSirketler] = useState<string[]>([]);
  const [universite, setUniversite] = useState('');
  const [lise, setLise] = useState('');
  const [sanatci, setSanatci] = useState('');
  const [acikBolum, setAcikBolum] = useState<'okul' | 'is' | 'muzik' | null>(null);
  const [ilgiler, setIlgiler] = useState<string[]>([]);
  const [muzik, setMuzik] = useState<string[]>([]);
  const [sehir, setSehir] = useState('İstanbul');
  const [semt, setSemt] = useState('');
  const [mezuniyet, setMezuniyet] = useState('');
  const [ilgiSeciciAcik, setIlgiSeciciAcik] = useState(false);

  if (uye) return <Redirect href="/ana-sayfa" />;
  if (!davetEden) return <Redirect href="/" />;
  const davetci = kisiBul(davetEden);

  const eklenen = [ilgiler.length >= 3, !!(universite || lise), !!(sirket || pozisyon || eskiSirketler.length), muzik.length > 0 || sanatci.trim() !== ''].filter(Boolean).length;
  const degistir = (liste: string[], id: string) => (liste.includes(id) ? liste.filter((x) => x !== id) : [...liste, id]);
  const gecerli = adim === 1 ? !!foto && ad.trim().length > 2 : adim === 2 ? ilgiler.length >= 3 : !!sehir && !!semt;

  const ileri = () => {
    if (adim < 3) return setAdim(adim + 1);
    profiliKaydet({
      ad: ad.trim(),
      foto,
      sehir,
      semt,
      ilgiler,
      muzik,
      tanidiklar: [],
      pozisyon: pozisyon.trim() || undefined,
      sirket: sirket.trim() || undefined,
      eskiSirketler,
      universite: universite.trim() || undefined,
      lise: lise.trim() || undefined,
      mezuniyet: Number(mezuniyet) || undefined,
      sanatcilar: sanatci.split(',').map((x) => x.trim()).filter(Boolean).slice(0, 5),
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
              {ilgiler.length < 3 ? `Hobilerinden ${3 - ilgiler.length} tane daha seç` : `${eklenen} ortak nokta eklendi`}
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
                <Icon name="kamera" size={26} color={Colors.accent} />
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
        </>
      )}

      {adim === 2 && (
        <>
          <View style={{ gap: Bosluk.sm }}>
            <Metin style={Yazi.ekranBasligi}>Ortak noktalarını ekle</Metin>
            <Metin style={{ color: Colors.textMuted }}>
              Arkadaşlık ortak bir noktadan başlar. Ne kadar çok eklersen seni o kadar çok kişiyle buluştururuz.
            </Metin>
          </View>

          {/* Hobilerin: acik ve zorunlu */}
          <OrtakBolum tur="hobi" baslik="Hobilerin" alt="En az 3 tane seç." tamam={ilgiler.length >= 3} acik>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {[...POPULER_ILGILER, ...ilgiler.filter((i) => !POPULER_ILGILER.includes(i))].map((id) => (
                <Cip key={id} metin={ilgiAdi(id)} secili={ilgiler.includes(id)} onPress={() => setIlgiler(degistir(ilgiler, id))} />
              ))}
            </View>
            <Pressable onPress={() => setIlgiSeciciAcik(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingVertical: 4 }}>
              <Icon name="plus" size={16} color={Colors.accent} />
              <Metin style={{ ...Yazi.etiket, color: Colors.accent }}>Daha fazla (173 seçenek)</Metin>
            </Pressable>
          </OrtakBolum>
          <IlgiAlaniSecici gorunur={ilgiSeciciAcik} katalog={ILGI_KATALOGU} populer={POPULER_ILGILER} secilenler={ilgiler} tamam={(y) => { setIlgiler(y); setIlgiSeciciAcik(false); }} vazgec={() => setIlgiSeciciAcik(false)} />

          {/* Okulun, Isin, Muzigin: istege bagli, dokununca acilir */}
          <OrtakBolum tur="okul" baslik="Okulun" alt="Aynı okuldan olanlarla buluş." tamam={!!(universite || lise)} acik={acikBolum === 'okul'} ac={() => setAcikBolum(acikBolum === 'okul' ? null : 'okul')}>
            <UniversiteSecici deger={universite} sec={setUniversite} />
            <Alan etiket="Lise (isteğe bağlı)" deger={lise} degis={setLise} ipucu="Örn. Kadıköy Anadolu Lisesi" />
            <Alan etiket="Üniversite mezuniyet yılı" deger={mezuniyet} degis={(t) => setMezuniyet(t.replace(/\D/g, '').slice(0, 4))} klavye="number-pad" ipucu="Örn. 2012" />
            <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted, marginTop: -Bosluk.sm }}>Mezuniyet yılın görünmez; yalnızca yakın kuşaktan kişileri önermek için.</Metin>
          </OrtakBolum>

          <OrtakBolum tur="is" baslik="İşin" alt="Aynı şirketten, aynı alandan olanlarla buluş." tamam={!!(sirket || pozisyon || eskiSirketler.length)} acik={acikBolum === 'is'} ac={() => setAcikBolum(acikBolum === 'is' ? null : 'is')}>
            <Alan etiket="Mevcut şirket" deger={sirket} degis={setSirket} ipucu="Örn. Garanti BBVA" />
            <Alan etiket="Mevcut pozisyon" deger={pozisyon} degis={setPozisyon} ipucu="Örn. Ürün yöneticisi" />
            <EskiSirketSecici secilenler={eskiSirketler} degistir={setEskiSirketler} />
          </OrtakBolum>

          <OrtakBolum tur="muzik" baslik="Müziğin" alt="Aynı müziği sevenlerle konsere git." tamam={muzik.length > 0 || sanatci.trim() !== ''} acik={acikBolum === 'muzik'} ac={() => setAcikBolum(acikBolum === 'muzik' ? null : 'muzik')}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {KAYIT_TARZLARI.map((m) => (
                <Cip key={m.id} metin={m.ad} secili={muzik.includes(m.id)} onPress={() => setMuzik(degistir(muzik, m.id))} />
              ))}
            </View>
            <Alan etiket="Sevdiğin sanatçılar (virgülle ayır)" deger={sanatci} degis={setSanatci} ipucu="Örn. Duman, Norah Jones" />
          </OrtakBolum>
          <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted, textAlign: 'center' }}>Hepsini sonra profilinden de ekleyebilirsin.</Metin>
        </>
      )}

      {adim === 3 && (
        <>
          <View style={{ gap: Bosluk.sm }}>
            <Metin style={Yazi.ekranBasligi}>Nerede yaşıyorsun?</Metin>
            <Metin style={{ color: Colors.textMuted }}>Semtin de bir ortak nokta: yakınında yaşayanlarla ve yakınındaki planlarla buluşturalım.</Metin>
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
        </>
      )}
    </Ekran>
  );
}


/** Ortak nokta bolumu: basliga dokununca acilir; eklendiyse yesil tik */
function OrtakBolum({
  tur,
  baslik,
  alt,
  tamam,
  acik,
  ac,
  children,
}: {
  tur: OrtakNoktaTuru;
  baslik: string;
  alt: string;
  tamam: boolean;
  acik: boolean;
  ac?: () => void;
  children: ReactNode;
}) {
  return (
    <View style={{ borderRadius: Kose.lg, borderWidth: 1, borderColor: acik ? Marka.turuncu : Colors.border, backgroundColor: Colors.white, overflow: 'hidden' }}>
      <Pressable
        disabled={!ac}
        onPress={ac}
        accessibilityRole="button"
        accessibilityState={{ expanded: acik }}
        style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.md, padding: Bosluk.lg }}>
        <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: tamam ? Durum.onaylandi.zemin : Marka.seftali }}>
          <Icon name={tamam ? 'check' : ORTAK_NOKTA[tur].ikon} size={18} color={tamam ? Durum.onaylandi.yazi : Colors.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Metin style={Yazi.kartBasligi}>{baslik}</Metin>
          <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>{alt}</Metin>
        </View>
        {ac && <Icon name={acik ? 'chevron-down' : 'plus'} size={18} color={Colors.textMuted} />}
      </Pressable>
      {acik && <View style={{ paddingHorizontal: Bosluk.lg, paddingBottom: Bosluk.lg, gap: Bosluk.md }}>{children}</View>}
    </View>
  );
}
