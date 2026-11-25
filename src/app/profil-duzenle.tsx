import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { View } from 'react-native';

import { Alan } from '@/components/alan';
import { Cip, Dugme, Ekran, Kart, Metin, UstBar } from '@/components/temel';
import { Bosluk, Colors, Yazi } from '@/constants/theme';
import { ILGI_ALANLARI, KULUPLER, MUZIK_TARZLARI, SEHIRLER, SEMTLER } from '@/data/ornek';
import { useOturum } from '@/data/oturum';

/** "a, b , c" -> ["a","b","c"] */
const listeyeCevir = (t: string) => t.split(',').map((x) => x.trim()).filter(Boolean);

/**
 * PROFILI DUZENLE (ExCom'daki bolumlerden uyarlandi)
 * Kisisel, Is & kariyer, Egitim, Uzmanlik, Ilgi alanlari, Muzik.
 * Medeni durum ve dogum yili yok; mezuniyet yili profilde gorunmez.
 */
export default function ProfilDuzenle() {
  const { uye, profiliGuncelle, kuluplerim, kulubeKatil } = useOturum();
  const [ad, setAd] = useState(uye?.ad ?? '');
  const [sehir, setSehir] = useState(uye?.sehir ?? 'İstanbul');
  const [semt, setSemt] = useState(uye?.semt ?? '');
  const [hakkinda, setHakkinda] = useState(uye?.hakkinda ?? '');
  const [pozisyon, setPozisyon] = useState(uye?.pozisyon ?? '');
  const [sirket, setSirket] = useState(uye?.sirket ?? '');
  const [linkedin, setLinkedin] = useState(uye?.linkedin ?? '');
  const [universite, setUniversite] = useState(uye?.universite ?? '');
  const [bolum, setBolum] = useState(uye?.bolum ?? '');
  const [mezuniyet, setMezuniyet] = useState(uye?.mezuniyet ? String(uye.mezuniyet) : '');
  const [uzmanlik, setUzmanlik] = useState((uye?.uzmanliklar ?? []).join(', '));
  const [ilgiler, setIlgiler] = useState<string[]>(uye?.ilgiler ?? []);
  const [muzik, setMuzik] = useState<string[]>(uye?.muzik ?? []);
  const [sanatcilar, setSanatcilar] = useState((uye?.sanatcilar ?? []).join(', '));

  if (!uye) return <Ekran ust={<UstBar />}><Metin>Önce profilini oluştur.</Metin></Ekran>;

  const degistir = (liste: string[], id: string) => (liste.includes(id) ? liste.filter((x) => x !== id) : [...liste, id]);
  const gecerli = ad.trim().length > 2 && ilgiler.length >= 3 && !!semt;

  const kaydet = () => {
    profiliGuncelle({
      ad: ad.trim(),
      sehir,
      semt,
      hakkinda: hakkinda.trim() || undefined,
      pozisyon: pozisyon.trim() || undefined,
      sirket: sirket.trim() || undefined,
      linkedin: linkedin.trim() || undefined,
      universite: universite.trim() || undefined,
      bolum: bolum.trim() || undefined,
      mezuniyet: Number(mezuniyet) || undefined,
      uzmanliklar: listeyeCevir(uzmanlik),
      ilgiler,
      muzik,
      sanatcilar: listeyeCevir(sanatcilar),
    });
    // Yeni secilen ilgi alani = o kulubun bekleme listesi
    KULUPLER.filter((k) => ilgiler.includes(k.ilgi) && !uye.ilgiler.includes(k.ilgi) && !kuluplerim.includes(k.id)).forEach((k) => kulubeKatil(k.id));
    router.back();
  };

  return (
    <Ekran
      ust={<UstBar baslik="Profili düzenle" />}
      alt={
        <View style={{ padding: Bosluk.lg, borderTopWidth: 1, borderTopColor: Colors.divider, backgroundColor: Colors.background, gap: 6 }}>
          {!gecerli && (
            <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted, textAlign: 'center' }}>Ad, semt ve en az 3 ilgi alanı gerekli.</Metin>
          )}
          <Dugme baslik="Kaydet" tur="turuncu" pasif={!gecerli} onPress={kaydet} />
        </View>
      }>
      <Bolum baslik="Kişisel bilgiler">
        <Alan etiket="Ad soyad" deger={ad} degis={setAd} />
        <Secim etiket="Şehir" secenekler={SEHIRLER} secili={[sehir]} sec={(s) => { setSehir(s); setSemt(''); }} />
        <Secim etiket="Semt" secenekler={SEMTLER[sehir] ?? []} secili={[semt]} sec={setSemt} />
        <Alan etiket="Hakkımda" deger={hakkinda} degis={setHakkinda} ipucu="Kendini birkaç cümleyle anlat" cokSatir />
      </Bolum>

      <Bolum baslik="İş & kariyer">
        <Alan etiket="Pozisyon" deger={pozisyon} degis={setPozisyon} ipucu="Örn. Ürün yöneticisi" />
        <Alan etiket="Şirket" deger={sirket} degis={setSirket} ipucu="Örn. Bir banka" />
        <Alan etiket="LinkedIn (isteğe bağlı)" deger={linkedin} degis={setLinkedin} ipucu="linkedin.com/in/adin" klavye="email-address" />
      </Bolum>

      <Bolum baslik="Eğitim">
        <Alan etiket="Üniversite" deger={universite} degis={setUniversite} ipucu="Örn. Boğaziçi Üniversitesi" />
        <Alan etiket="Bölüm" deger={bolum} degis={setBolum} ipucu="Örn. İşletme" />
        <Alan etiket="Mezuniyet yılı" deger={mezuniyet} degis={(t) => setMezuniyet(t.replace(/\D/g, '').slice(0, 4))} klavye="number-pad" ipucu="Örn. 2012" />
        <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted, marginTop: -Bosluk.sm }}>
          Mezuniyet yılı profilinde görünmez; yalnızca yakın kuşaktan kişileri önermek için.
        </Metin>
      </Bolum>

      <Bolum baslik="Uzmanlık alanlarım" alt="Pozisyon yazısından daha iyi anlatır: ne iş yapıyorsun?">
        <Alan etiket="Virgülle ayır" deger={uzmanlik} degis={setUzmanlik} ipucu="Örn. Ürün yönetimi, Veri analizi" />
      </Bolum>

      <Bolum baslik="İlgi alanlarım" alt={`${ilgiler.length} seçili · en az 3. Seçtiğin ilginin kulübüne otomatik katılırsın.`}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {ILGI_ALANLARI.map((i) => (
            <Cip key={i.id} metin={i.ad} simge={i.simge} secili={ilgiler.includes(i.id)} onPress={() => setIlgiler(degistir(ilgiler, i.id))} />
          ))}
        </View>
      </Bolum>

      <Bolum baslik="Müzik zevkim" alt="Ortak zevkler başkalarının profilinde işaretlenir.">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {MUZIK_TARZLARI.map((m) => (
            <Cip key={m} metin={m} secili={muzik.includes(m)} onPress={() => setMuzik(degistir(muzik, m))} />
          ))}
        </View>
        <Alan etiket="Sevdiğin sanatçılar (virgülle ayır)" deger={sanatcilar} degis={setSanatcilar} ipucu="Örn. Sezen Aksu, Norah Jones" />
      </Bolum>
    </Ekran>
  );
}

function Bolum({ baslik, alt, children }: { baslik: string; alt?: string; children: ReactNode }) {
  return (
    <Kart style={{ padding: Bosluk.lg, gap: Bosluk.md }}>
      <View style={{ gap: 2 }}>
        <Metin style={Yazi.kartBasligi}>{baslik}</Metin>
        {alt && <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>{alt}</Metin>}
      </View>
      {children}
    </Kart>
  );
}

function Secim({ etiket, secenekler, secili, sec }: { etiket: string; secenekler: string[]; secili: string[]; sec: (s: string) => void }) {
  return (
    <View style={{ gap: 6 }}>
      <Metin style={{ ...Yazi.etiket, color: Colors.textMuted }}>{etiket}</Metin>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {secenekler.map((s) => (
          <Cip key={s} metin={s} secili={secili.includes(s)} onPress={() => sec(s)} />
        ))}
      </View>
    </View>
  );
}
