import { router, useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, LayoutAnimation, Modal, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AcilirSecici } from '@/components/acilir-secici';
import { AkordiyonKarti } from '@/components/akordiyon-karti';
import { AppButton } from '@/components/button';
import { EskiSirketSecici } from '@/components/eski-sirket-secici';
import { EtiketSecici } from '@/components/etiket-secici';
import { Alan } from '@/components/field';
import { Icon } from '@/components/icon';
import { IlgiAlaniSecici } from '@/components/ilgi-alani-secici';
import { MuzikZevkiAlanlari } from '@/components/muzik-zevki-alanlari';
import { SehirSecici } from '@/components/sehir-secici';
import { Avatar, Cip, Metin as Text } from '@/components/temel';
import { UniversiteSecici } from '@/components/universite-secici';
import { Colors, FontSize, icerikOrtala, Radius, Spacing } from '@/constants/theme';
import { adHatasi, linkedinHatasi, metinHatasi, sadelestir } from '@/data/dogrulama';
import { EN_COK_ETIKET, eklenenEtiketler, etiketGecerliMi } from '@/data/etiketler';
import { fotoSec as galeridenSec } from '@/data/foto';
import { ILGI_KATALOGU, POPULER_ILGILER } from '@/data/ilgi-alanlari';
import { SEHIR_LISTESI } from '@/data/kataloglar';
import { MUZIK_KATALOGU, type MuzikZevki } from '@/data/muzik';
import { KISILER, KULUPLER, SEMTLER } from '@/data/ornek';
import { useOturum } from '@/data/oturum';

const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
/** Ayin gun sayisi (Subat 29: yil sorulmuyor) */
const GUN_SAYISI = [31, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** Mezuniyet yili: bos olabilir; doluysa makul bir yil olmali */
function yilHatasi(yil: string) {
  const temiz = yil.trim();
  if (temiz === '') return null;
  const sayi = Number(temiz);
  const enGec = new Date().getFullYear() + 8;
  if (!/^\d{4}$/.test(temiz) || sayi < 1940 || sayi > enGec) return `1940 ile ${enGec} arasında bir yıl yaz.`;
  return null;
}

/*
  PROFILI DUZENLE (ExCom'dan aynen; 26 Kasim 2026)
  6 acilir kart, ayni anda tek kart acik; dolu kart yesil tikli. Tek
  "Degisiklikleri kaydet". Kaydetmeden cikarken sorar.
  Plus farklari: e-posta, eski departman, calisma donemi, unvan yok;
  sehrin altinda semt var; mezuniyet yillari profilde gorunmez.
*/
type Bolum = 'kisisel' | 'is' | 'egitim' | 'uzmanlik' | 'ilgi' | 'muzik';

const ALAN_BOLUMU: Record<string, Bolum> = {
  ad: 'kisisel',
  sehir: 'kisisel',
  hakkinda: 'kisisel',
  sirket: 'is',
  pozisyon: 'is',
  linkedin: 'is',
  lise: 'egitim',
  liseYil: 'egitim',
  bolum: 'egitim',
  universiteYil: 'egitim',
  ilgi: 'ilgi',
};
const BOLUM_SIRASI: Bolum[] = ['kisisel', 'is', 'egitim', 'uzmanlik', 'ilgi', 'muzik'];

export default function ProfilDuzenle() {
  const { uye, profiliGuncelle, fotoDegistir, kuluplerim, kulubeKatil } = useOturum();
  const navigation = useNavigation();
  const [acikBolum, setAcikBolum] = useState<Bolum | null>(null);
  const bolumuDegistir = (b: Bolum) =>
    odagiBirakipYap(() => {
      yumusakGecis();
      setAcikBolum((eski) => (eski === b ? null : b));
    });

  const [ad, setAd] = useState(uye?.ad ?? '');
  const [sehir, setSehir] = useState(uye?.sehir ?? '');
  const [semt, setSemt] = useState(uye?.semt ?? '');
  const [hakkinda, setHakkinda] = useState(uye?.hakkinda ?? '');
  const [dogumAy, setDogumAy] = useState((uye?.dogumGunu ?? '').split('-')[0] ?? '');
  const [dogumGun, setDogumGun] = useState((uye?.dogumGunu ?? '').split('-')[1] ?? '');
  const [sirket, setSirket] = useState(uye?.sirket ?? '');
  const [pozisyon, setPozisyon] = useState(uye?.pozisyon ?? '');
  const [eskiSirketler, setEskiSirketler] = useState<string[]>(uye?.eskiSirketler ?? []);
  const [linkedin, setLinkedin] = useState(uye?.linkedin ?? '');
  const [lise, setLise] = useState(uye?.lise ?? '');
  const [liseYil, setLiseYil] = useState(uye?.liseYil ?? '');
  const [universite, setUniversite] = useState(uye?.universite ?? '');
  const [bolum, setBolum] = useState(uye?.bolum ?? '');
  const [universiteYil, setUniversiteYil] = useState(uye?.mezuniyet ? String(uye.mezuniyet) : '');
  const [etiketler, setEtiketler] = useState<string[]>(uye?.uzmanliklar ?? []);
  const [ilgiler, setIlgiler] = useState<string[]>(uye?.ilgiler ?? []);
  const [ilgiSeciciAcik, setIlgiSeciciAcik] = useState(false);
  const [muzik, setMuzik] = useState<MuzikZevki>({
    tarzlar: uye?.muzik ?? [],
    sanatcilar: uye?.sanatcilar ?? [],
    sarki: uye?.sarki ? { spotifyId: uye.sarki.spotifyId, baslik: uye.sarki.baslik ?? '', kapak: uye.sarki.kapak ?? '' } : null,
  });
  /* Baskalarinin ekledigi uzmanliklar da onerilsin */
  const [digerEtiketler] = useState(() => eklenenEtiketler(KISILER.map((k) => ({ etiketler: k.uzmanliklar }))));

  const [alanHatalari, setAlanHatalari] = useState<Record<string, string>>({});
  const [kayitHatasi, setKayitHatasi] = useState('');
  const [kaydedildi, setKaydedildi] = useState(false);

  /* KAYDEDILMEMIS DEGISIKLIK: acilistaki degerlerle karsilastirilir */
  const formDegeri = JSON.stringify([ad, sehir, semt, hakkinda, dogumAy, dogumGun, sirket, pozisyon, eskiSirketler, linkedin, lise, liseYil, universite, bolum, universiteYil, etiketler, ilgiler, muzik]);
  const [ilkDeger] = useState(formDegeri);
  const degisti = formDegeri !== ilkDeger;
  const degistiRef = useRef(degisti);
  const cikisSerbest = useRef(false);
  const [cikisSor, setCikisSor] = useState<null | (() => void)>(null);
  useEffect(() => {
    degistiRef.current = degisti;
  }, [degisti]);
  useEffect(() => {
    const kaldir = navigation.addListener('beforeRemove', (olay) => {
      if (cikisSerbest.current || !degistiRef.current) return;
      olay.preventDefault();
      setCikisSor(() => () => {
        cikisSerbest.current = true;
        navigation.dispatch(olay.data.action);
      });
    });
    return kaldir;
  }, [navigation]);

  if (!uye) return null;

  const kaydet = () => {
    if (kaydedildi) return;
    const hatalar: Record<string, string> = {};
    const ekle = (alan: string, sonuc: string | null) => {
      if (sonuc) hatalar[alan] = sonuc;
    };
    ekle('ad', adHatasi(ad));
    ekle('sirket', metinHatasi(sirket, { enCok: 60, ad: 'Şirket adı' }));
    ekle('pozisyon', metinHatasi(pozisyon, { enCok: 60, ad: 'Pozisyon' }));
    ekle('hakkinda', metinHatasi(hakkinda, { enCok: 500, ad: 'Hakkımda' }));
    ekle('linkedin', linkedinHatasi(linkedin));
    ekle('lise', metinHatasi(lise, { enCok: 80, ad: 'Lise adı' }));
    ekle('bolum', metinHatasi(bolum, { enCok: 80, ad: 'Bölüm' }));
    ekle('liseYil', yilHatasi(liseYil));
    ekle('universiteYil', yilHatasi(universiteYil));
    if (!hatalar.liseYil && !hatalar.universiteYil && liseYil && universiteYil && Number(universiteYil) < Number(liseYil)) {
      hatalar.universiteYil = 'Üniversite mezuniyetin lise mezuniyetinden önce olamaz.';
    }
    if (!sehir) hatalar.sehir = 'Şehrini seç.';
    // Plus: en az 3 ilgi alani (eslestirmenin temeli)
    if (ilgiler.length < 3) hatalar.ilgi = 'En az 3 ilgi alanı seç.';

    setAlanHatalari(hatalar);
    if (Object.keys(hatalar).length > 0) {
      const ilk = BOLUM_SIRASI.find((b) => Object.keys(hatalar).some((a) => ALAN_BOLUMU[a] === b));
      if (ilk) odagiBirakipYap(() => { yumusakGecis(); setAcikBolum(ilk); });
      setKayitHatasi('Bazı alanları düzeltmen gerekiyor; işaretli bölüme bak.');
      return;
    }

    setKayitHatasi('');
    profiliGuncelle({
      ad: sadelestir(ad),
      sehir,
      semt,
      hakkinda: hakkinda.trim() || undefined,
      dogumGunu: dogumAy && dogumGun ? `${dogumAy}-${dogumGun}` : undefined,
      sirket: sadelestir(sirket) || undefined,
      pozisyon: sadelestir(pozisyon) || undefined,
      eskiSirketler,
      linkedin: linkedin.trim() || undefined,
      lise: sadelestir(lise) || undefined,
      liseYil: liseYil.trim() || undefined,
      universite: universite.trim() || undefined,
      bolum: sadelestir(bolum) || undefined,
      mezuniyet: Number(universiteYil) || undefined,
      uzmanliklar: etiketler.filter(etiketGecerliMi).slice(0, EN_COK_ETIKET),
      ilgiler,
      muzik: muzik.tarzlar,
      sanatcilar: muzik.sanatcilar,
      sarki: muzik.sarki ?? undefined,
    });
    // Yeni secilen ilgi = o kulubun bekleme listesi
    KULUPLER.filter((k) => ilgiler.includes(k.ilgi) && !uye.ilgiler.includes(k.ilgi) && !kuluplerim.includes(k.id)).forEach((k) => kulubeKatil(k.id));
    setKaydedildi(true);
    cikisSerbest.current = true;
    setTimeout(() => (router.canGoBack() ? router.back() : router.replace('/profil')), 700);
  };

  const hataliBolumler = new Set(Object.keys(alanHatalari).map((a) => ALAN_BOLUMU[a]));
  const dolu = (yazi?: string) => (yazi ?? '').trim() !== '';
  const kartTamam: Record<Bolum, boolean> = {
    kisisel: dolu(ad) && dolu(sehir),
    is: dolu(sirket) && dolu(pozisyon),
    egitim: dolu(lise) || dolu(universite),
    uzmanlik: etiketler.length > 0,
    ilgi: ilgiler.length >= 3,
    muzik: !!muzik.sarki || muzik.tarzlar.length > 0,
  };
  const kart = (b: Bolum) => ({ acik: acikBolum === b, degistir: () => bolumuDegistir(b), hataVar: hataliBolumler.has(b), tamam: kartTamam[b] });

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Baslik: solda geri oku, altinda buyuk baslik (ExCom duzeni) */}
      <View style={[icerikOrtala, { paddingHorizontal: Spacing.xl, paddingTop: Spacing.sm, gap: Spacing.sm }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Geri" hitSlop={10} onPress={() => (router.canGoBack() ? router.back() : router.replace('/profil'))} style={{ width: 44, height: 36, justifyContent: 'center' }}>
          <Icon name="arrow-left" size={24} color={Colors.text} />
        </Pressable>
        <Text style={{ fontSize: 32, lineHeight: 38, fontWeight: '700', letterSpacing: -0.6, marginBottom: Spacing.md }}>Profili düzenle</Text>
      </View>

      <KeyboardAvoidingView style={styles.esnek} behavior={Platform.OS === 'web' ? undefined : 'padding'}>
        <ScrollView contentContainerStyle={styles.icerik} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.ust}>
            <Pressable accessibilityRole="button" accessibilityLabel="Profil fotoğrafı seç" onPress={async () => { const f = await galeridenSec(); if (f) fotoDegistir(f); }} style={({ pressed }) => [styles.fotoAlani, pressed && styles.basili]}>
              <Avatar ad={ad || uye.ad} id="ben" foto={uye.foto} boyut={104} />
              <View style={styles.kameraRozeti}>
                <Icon name="plus" size={18} color={Colors.white} strokeWidth={2.6} />
              </View>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={async () => { const f = await galeridenSec(); if (f) fotoDegistir(f); }}>
              <Text style={styles.fotoButonu}>{uye.foto ? 'Fotoğrafı değiştir' : 'Profil fotoğrafı ekle'}</Text>
            </Pressable>
            <Text style={styles.ipucu}>Plus’ta profil fotoğrafı zorunlu; istediğin zaman değiştirebilirsin.</Text>
          </View>

          {/* ---------------- 1. Kisisel bilgiler ---------------- */}
          <AkordiyonKarti baslik="Kişisel bilgiler" aciklama="Adın, doğum günün, şehrin ve kendini anlattığın birkaç cümle" ikon="user" {...kart('kisisel')}>
            <Alan etiket="Ad soyad" zorunlu deger={ad} degistir={setAd} ikon="user" enCok={60} hata={alanHatalari.ad} />

            <View>
              <Text style={styles.altEtiket}>Doğum günü</Text>
              <Text style={styles.bolumAciklama}>İsteğe bağlı. Yalnızca gün ve ay; yılını sormuyoruz, yaşın görünmez.</Text>
              <View style={styles.dogumSatiri}>
                <AcilirSecici
                  deger={dogumGun}
                  sec={setDogumGun}
                  ikon="gift"
                  secenekler={[{ deger: '', ad: 'Gün' }, ...Array.from({ length: GUN_SAYISI[Number(dogumAy) || 1] }, (_, i) => ({ deger: String(i + 1).padStart(2, '0'), ad: String(i + 1) }))]}
                />
                <AcilirSecici
                  deger={dogumAy}
                  sec={(a) => {
                    setDogumAy(a);
                    if (Number(dogumGun) > GUN_SAYISI[Number(a) || 1]) setDogumGun('');
                  }}
                  secenekler={[{ deger: '', ad: 'Ay' }, ...AYLAR.map((ad, i) => ({ deger: String(i + 1).padStart(2, '0'), ad }))]}
                />
                {(dogumAy !== '' || dogumGun !== '') && (
                  <Pressable accessibilityRole="button" accessibilityLabel="Doğum gününü temizle" hitSlop={10} onPress={() => { setDogumAy(''); setDogumGun(''); }} style={({ pressed }) => [styles.dogumTemizle, pressed && styles.oneriBasili]}>
                    <Icon name="x" size={16} color={Colors.textMuted} strokeWidth={2.2} />
                  </Pressable>
                )}
              </View>
            </View>

            <SehirSecici
              etiket="Yaşadığım şehir"
              deger={sehir}
              sec={(s) => { setSehir(s); if (s !== sehir) setSemt(''); }}
              sehirler={SEHIR_LISTESI}
              yardim="Aynı şehirdekiler birbirini bulabilsin diye soruyoruz."
              hata={alanHatalari.sehir}
            />
            {/* Plus: semt (yakinimdakiler niyeti) */}
            {(SEMTLER[sehir] ?? []).length > 0 ? (
              <View style={{ gap: 6 }}>
                <Text style={styles.altEtiket}>Semt</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
                  {SEMTLER[sehir].map((s) => (
                    <Cip key={s} metin={s} secili={semt === s} onPress={() => setSemt(s)} />
                  ))}
                </View>
              </View>
            ) : (
              <Alan etiket="Semt" deger={semt} degistir={setSemt} ikon="map-pin" enCok={40} yardim="Yakınındaki kişileri ve planları göstermek için." />
            )}

            <Alan etiket="Hakkımda" deger={hakkinda} degistir={setHakkinda} cokSatir enCok={500} yardim={`${hakkinda.trim().length}/500`} hata={alanHatalari.hakkinda} />
          </AkordiyonKarti>

          {/* ---------------- 2. Is & Kariyer ---------------- */}
          <AkordiyonKarti baslik="İş & Kariyer" aciklama="Bugünkü işin ve önceki işyerlerin" ikon="briefcase" {...kart('is')}>
            <Alan etiket="Mevcut şirket" deger={sirket} degistir={setSirket} ikon="building" enCok={60} hata={alanHatalari.sirket} />
            <Alan etiket="Mevcut pozisyon" deger={pozisyon} degistir={setPozisyon} ikon="id-card" enCok={60} hata={alanHatalari.pozisyon} />
            <EskiSirketSecici secilenler={eskiSirketler} degistir={setEskiSirketler} />
            <Alan etiket="LinkedIn" deger={linkedin} degistir={setLinkedin} ipucu="linkedin.com/in/denizkaya" ikon="briefcase" enCok={200} yardim="İsteğe bağlı. Yazarsan profilinde bağlantı olarak görünür." hata={alanHatalari.linkedin} />
          </AkordiyonKarti>

          {/* ---------------- 3. Egitim ---------------- */}
          <AkordiyonKarti baslik="Eğitim" aciklama="İsteğe bağlı. Aynı okuldan olanlar birbirini bulabilsin." ikon="mezuniyet" {...kart('egitim')}>
            <Alan etiket="Lise" deger={lise} degistir={setLise} ipucu="Kadıköy Anadolu Lisesi" ikon="mezuniyet" enCok={80} hata={alanHatalari.lise} />
            <Alan etiket="Lise mezuniyet yılı" deger={liseYil} degistir={(y) => setLiseYil(y.replace(/\D/g, '').slice(0, 4))} ipucu="2005" ikon="calendar-check" klavyeTipi="number-pad" enCok={4} hata={alanHatalari.liseYil} />
            <UniversiteSecici deger={universite} sec={setUniversite} />
            <Alan etiket="Bölüm" deger={bolum} degistir={setBolum} ipucu="İşletme" ikon="id-card" enCok={80} hata={alanHatalari.bolum} />
            <Alan etiket="Üniversite mezuniyet yılı" deger={universiteYil} degistir={(y) => setUniversiteYil(y.replace(/\D/g, '').slice(0, 4))} ipucu="2009" ikon="calendar-check" klavyeTipi="number-pad" enCok={4} hata={alanHatalari.universiteYil} />
            <Text style={styles.bolumAciklama}>Mezuniyet yılların profilinde görünmez; yalnızca yakın kuşaktan kişileri önermek için.</Text>
          </AkordiyonKarti>

          {/* ---------------- 4. Uzmanlik alanlarim ---------------- */}
          <AkordiyonKarti baslik="Uzmanlık alanlarım" aciklama="Profesyonel olarak hangi konularda deneyimlisin? Aynı alandakilerle tanışabil." ikon="bulb" rozet={`${etiketler.length} / ${EN_COK_ETIKET}`} {...kart('uzmanlik')}>
            <EtiketSecici basliksiz secilenler={etiketler} degistir={setEtiketler} digerleri={digerEtiketler} />
          </AkordiyonKarti>

          {/* ---------------- 5. Hobiler & ilgi alanlarim ---------------- */}
          <AkordiyonKarti baslik="Hobiler & ilgi alanlarım" aciklama="Neler yapmaktan hoşlanırsın? Sana uygun etkinlikler ve kulüpler oluşturalım." ikon="heart" rozet={`${ilgiler.length} seçili`} {...kart('ilgi')}>
            {ilgiler.length === 0 ? (
              <Text style={styles.bolumAciklama}>Henüz seçmedin. Seninle aynı şeyleri sevenleri bulalım.</Text>
            ) : (
              <View style={styles.oneriSatiri}>
                {ilgiler.map((id) => {
                  const isim = ILGI_KATALOGU.bul.get(id)?.ad ?? id;
                  return (
                    <Pressable key={id} accessibilityRole="button" accessibilityLabel={`${isim} ilgi alanını kaldır`} onPress={() => setIlgiler(ilgiler.filter((x) => x !== id))} style={({ pressed }) => [styles.ilgiHapi, pressed && styles.oneriBasili]}>
                      <Text style={styles.ilgiYazisi}>{isim}</Text>
                      <Icon name="x" size={14} color={Colors.textMuted} strokeWidth={2.2} />
                    </Pressable>
                  );
                })}
              </View>
            )}
            {alanHatalari.ilgi && <Text style={{ fontSize: FontSize.small, color: Colors.heart }}>{alanHatalari.ilgi}</Text>}
            <Pressable accessibilityRole="button" onPress={() => setIlgiSeciciAcik(true)} style={({ pressed }) => [styles.ilgiEkle, pressed && styles.oneriBasili]}>
              <Icon name="plus" size={16} color={Colors.accent} strokeWidth={2.4} />
              <Text style={styles.ilgiEkleYazi}>{ilgiler.length === 0 ? 'İlgi alanı ekle' : 'İlgi alanı ekle / değiştir'}</Text>
            </Pressable>
          </AkordiyonKarti>

          {/* ---------------- 6. Muzik zevkim ---------------- */}
          <AkordiyonKarti baslik="Müzik zevkim" aciklama="Profil şarkın, sevdiğin tarzlar ve sanatçılar. Aynı müziği sevenlerle konsere gidebilin." ikon="muzik" rozet={muzik.sarki ? 'Şarkı seçili' : undefined} {...kart('muzik')}>
            <MuzikZevkiAlanlari tarzKatalogu={MUZIK_KATALOGU} zevk={muzik} degistir={setMuzik} />
          </AkordiyonKarti>
        </ScrollView>

        <View style={styles.altCubuk}>
          {kayitHatasi !== '' && <Text style={styles.kayitHatasi}>{kayitHatasi}</Text>}
          <AppButton label={kaydedildi ? 'Kaydedildi ✓' : 'Değişiklikleri kaydet'} onPress={kaydet} disabled={kaydedildi} />
        </View>
      </KeyboardAvoidingView>

      <IlgiAlaniSecici
        gorunur={ilgiSeciciAcik}
        katalog={ILGI_KATALOGU}
        populer={POPULER_ILGILER}
        secilenler={ilgiler}
        tamam={(yeni) => { setIlgiler(yeni); setIlgiSeciciAcik(false); }}
        vazgec={() => setIlgiSeciciAcik(false)}
      />

      {/* Kaydedilmemis degisiklik onayi */}
      <Modal visible={!!cikisSor} transparent animationType="fade" onRequestClose={() => setCikisSor(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(7,24,45,0.4)', justifyContent: 'center', padding: Spacing.xl }}>
          <View style={[icerikOrtala, { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.xl, gap: Spacing.md }]}>
            <Text style={{ fontSize: 18, fontWeight: '700' }}>Kaydedilmemiş değişiklikler</Text>
            <Text style={{ color: Colors.textMuted }}>Profilinde kaydetmediğin değişiklikler var. Çıkarsan kaybolacak.</Text>
            <AppButton label="Kaydetmeden çık" tur="ikincil" onPress={() => { const f = cikisSor; setCikisSor(null); f?.(); }} />
            <AppButton label="Vazgeç" onPress={() => setCikisSor(null)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  oneriSatiri: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: -Spacing.sm },
  oneriBasili: { opacity: 0.7 },
  altEtiket: { fontSize: FontSize.small, fontWeight: '700', color: Colors.text },
  ilgiHapi: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 36, paddingHorizontal: Spacing.md, borderRadius: Radius.pill, backgroundColor: Colors.heartSoft },
  ilgiYazisi: { fontSize: FontSize.small, fontWeight: '600', color: Colors.text },
  ilgiEkle: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, minHeight: 44, alignSelf: 'flex-start' },
  ilgiEkleYazi: { fontSize: FontSize.small, fontWeight: '700', color: Colors.accent },
  dogumSatiri: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.sm },
  dogumTemizle: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  bolumAciklama: { fontSize: FontSize.caption, lineHeight: 18, color: Colors.textMuted, marginTop: 2 },
  safe: { flex: 1, backgroundColor: Colors.background },
  esnek: { flex: 1 },
  icerik: { ...icerikOrtala, paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl, gap: Spacing.md },
  altCubuk: { ...icerikOrtala, paddingHorizontal: Spacing.xl, paddingTop: Spacing.md, paddingBottom: Spacing.lg, gap: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.background },
  ust: { alignItems: 'center', gap: Spacing.md, paddingBottom: Spacing.sm },
  ipucu: { fontSize: FontSize.small, color: Colors.textMuted, textAlign: 'center' },
  fotoAlani: { position: 'relative' },
  basili: { opacity: 0.85 },
  kameraRozeti: { position: 'absolute', right: 0, bottom: 0, width: 34, height: 34, borderRadius: Radius.pill, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: Colors.background },
  fotoButonu: { fontSize: FontSize.body, fontWeight: '700', color: Colors.primary },
  kayitHatasi: { fontSize: FontSize.small, lineHeight: 20, color: Colors.heart, backgroundColor: Colors.heartSoft, borderRadius: Radius.md, padding: Spacing.md },
});

/* Kart acilip kapanirken yumusak gecis; yalnizca iPhone (Android'de donma, ExCom notu) */
function yumusakGecis() {
  if (Platform.OS !== 'ios') return;
  LayoutAnimation.configureNext(LayoutAnimation.create(220, 'easeInEaseOut', 'opacity'));
}

/* Android: kart kapanirken odaktaki kutu cokme yapiyordu; once klavye kapanir (ExCom notu) */
function odagiBirakipYap(is: () => void) {
  if (Platform.OS !== 'android' || !Keyboard.isVisible()) return is();
  Keyboard.dismiss();
  setTimeout(is, 120);
}
