import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Metin as Text } from '@/components/temel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { aramaIcinSade, eslesiyorMu } from '@/components/search-box';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';

/**
 * ULKE VE SEHIR SECICI
 * ------------------------------------------------------------
 * Iki bagimli acilir kutu: once ULKE, sonra o ulkenin SEHRI.
 *
 * Once tek kutu vardi ve acilinca butun ulkelerin butun
 * sehirleri (dort yuzden fazla) tek listede geliyordu; aranan
 * sehri bulmak icin metrelerce kaydirmak gerekiyordu.
 *
 * DISARIYA VERILEN ARAYUZ DEGISMEDI: "deger" yine yalnizca
 * SEHIR, "sec" yine sehir dondurur. Ulke veritabaninda ayri
 * saklanmiyor; secili sehrin ulkesinden bulunuyor. Boylece bu
 * bileseni kullanan dort ekranin hicbiri degismedi.
 */

/**
 * Ulke adindan bayrak emojisi.
 * Bayraklar iki harfli ulke kodundan uretiliyor: her harf
 * "bolgesel gosterge" karakterine cevriliyor. Boylece seksen
 * sekiz emojiyi tek tek yazmak gerekmiyor.
 */
const ULKE_KODLARI: Record<string, string> = {
  Türkiye: 'TR',
  Almanya: 'DE',
  Hollanda: 'NL',
  İngiltere: 'GB',
  Fransa: 'FR',
  İtalya: 'IT',
  İspanya: 'ES',
  İsviçre: 'CH',
  Avusturya: 'AT',
  Belçika: 'BE',
  İsveç: 'SE',
  Norveç: 'NO',
  Danimarka: 'DK',
  Finlandiya: 'FI',
  İrlanda: 'IE',
  Polonya: 'PL',
  Çekya: 'CZ',
  Portekiz: 'PT',
  Yunanistan: 'GR',
  Macaristan: 'HU',
  Romanya: 'RO',
  Bulgaristan: 'BG',
  Hırvatistan: 'HR',
  Sırbistan: 'RS',
  Slovakya: 'SK',
  Slovenya: 'SI',
  Estonya: 'EE',
  Letonya: 'LV',
  Litvanya: 'LT',
  Ukrayna: 'UA',
  Rusya: 'RU',
  Belarus: 'BY',
  Moldova: 'MD',
  Lüksemburg: 'LU',
  Malta: 'MT',
  İzlanda: 'IS',
  Arnavutluk: 'AL',
  'Kuzey Makedonya': 'MK',
  'Bosna-Hersek': 'BA',
  Karadağ: 'ME',
  Kıbrıs: 'CY',
  'Amerika Birleşik Devletleri': 'US',
  Kanada: 'CA',
  Meksika: 'MX',
  Brezilya: 'BR',
  Arjantin: 'AR',
  Şili: 'CL',
  Kolombiya: 'CO',
  'Birleşik Arap Emirlikleri': 'AE',
  Katar: 'QA',
  'Suudi Arabistan': 'SA',
  Kuveyt: 'KW',
  Bahreyn: 'BH',
  Umman: 'OM',
  Ürdün: 'JO',
  Lübnan: 'LB',
  İsrail: 'IL',
  İran: 'IR',
  Irak: 'IQ',
  Mısır: 'EG',
  Fas: 'MA',
  Tunus: 'TN',
  Cezayir: 'DZ',
  Libya: 'LY',
  'Güney Afrika': 'ZA',
  Nijerya: 'NG',
  Kenya: 'KE',
  Etiyopya: 'ET',
  Azerbaycan: 'AZ',
  Gürcistan: 'GE',
  Kazakistan: 'KZ',
  Özbekistan: 'UZ',
  Kırgızistan: 'KG',
  Türkmenistan: 'TM',
  Hindistan: 'IN',
  Çin: 'CN',
  Japonya: 'JP',
  'Güney Kore': 'KR',
  Singapur: 'SG',
  Malezya: 'MY',
  Endonezya: 'ID',
  Tayland: 'TH',
  Vietnam: 'VN',
  Filipinler: 'PH',
  Pakistan: 'PK',
  Bangladeş: 'BD',
  Avustralya: 'AU',
  'Yeni Zelanda': 'NZ',
};

function bayrak(ulke: string) {
  const kod = ULKE_KODLARI[ulke];
  if (!kod) return '';
  return String.fromCodePoint(
    ...kod.split('').map((harf) => 0x1f1e6 + harf.charCodeAt(0) - 65)
  );
}

type Sehir = { ulke: string; ad: string };

export function SehirSecici({
  etiket,
  deger,
  sec,
  sehirler,
  yardim,
  hata,
}: {
  /** Ustte gorunecek etiket. Formun kendi etiketi varsa bos birakilir */
  etiket?: string;
  /** Secili sehrin adi; bos ise henuz secilmedi */
  deger: string;
  sec: (sehir: string) => void;
  sehirler: Sehir[];
  yardim?: string;
  /** Alanin altinda kirmizi uyari (orn. "ulke degisti, sehrini sec") */
  hata?: string;
}) {
  /*
    Ulke secili sehirden bulunuyor. Kisi ulkeyi degistirip sehri
    henuz secmemis olabilir; o yuzden ayri bir durum da tutuluyor
    ve varsa o one geciyor.
  */
  const sehrinUlkesi = sehirler.find((s) => s.ad === deger)?.ulke ?? '';
  const [secilenUlke, setSecilenUlke] = useState('');
  const ulke = secilenUlke || sehrinUlkesi;

  const [ulkeAcik, setUlkeAcik] = useState(false);
  const [sehirAcik, setSehirAcik] = useState(false);

  /** Listedeki ulkeler; sira store'dan geliyor (Turkiye once) */
  const ulkeler: string[] = [];
  for (const s of sehirler) {
    if (!ulkeler.includes(s.ulke)) ulkeler.push(s.ulke);
  }

  const ulkeSehirleri = sehirler.filter((s) => s.ulke === ulke).map((s) => s.ad);

  return (
    <View style={styles.grup}>
      {etiket !== undefined && <Text style={styles.etiket}>{etiket}</Text>}

      {/* ---------------- Ülke ---------------- */}
      <Text style={styles.altEtiket}>Ülke</Text>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: ulkeAcik }}
        accessibilityLabel="Ülke seç"
        onPress={() => setUlkeAcik(true)}
        style={styles.kutu}>
        {ulke !== '' && bayrak(ulke) !== '' && (
          <Text style={styles.bayrak}>{bayrak(ulke)}</Text>
        )}
        <Text style={[styles.secilen, ulke === '' && styles.bos]}>
          {ulke === '' ? 'Ülke seç' : ulke}
        </Text>
        <Icon name="chevron-down" size={20} color={Colors.textMuted} />
      </Pressable>

      {/* ---------------- Şehir ---------------- */}
      <Text style={styles.altEtiket}>Şehir</Text>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: sehirAcik, disabled: ulke === '' }}
        accessibilityLabel="Şehir seç"
        disabled={ulke === ''}
        onPress={() => setSehirAcik(true)}
        style={[styles.kutu, ulke === '' && styles.kutuKapali, hata !== undefined && styles.kutuHatali]}>
        <Icon name="map-pin" size={20} color={Colors.textFaint} />
        <Text style={[styles.secilen, deger === '' && styles.bos]}>
          {ulke === '' ? 'Önce ülke seçin' : deger === '' ? 'Şehir seç' : deger}
        </Text>
        <Icon name="chevron-down" size={20} color={Colors.textMuted} />
      </Pressable>

      {hata !== undefined ? (
        <Text style={styles.hata}>{hata}</Text>
      ) : (
        yardim !== undefined && <Text style={styles.yardim}>{yardim}</Text>
      )}

      {/* ---------------- Ülke seçme sayfası ---------------- */}
      <SecimSayfasi
        acik={ulkeAcik}
        baslik="Ülke seç"
        aramaIpucu="Ülke ara…"
        secenekler={ulkeler}
        deger={ulke}
        bayrakli
        kapat={() => setUlkeAcik(false)}
        sec={(yeniUlke) => {
          setSecilenUlke(yeniUlke);
          setUlkeAcik(false);
          /* Secili sehir baska ulkeye aitse bosaltiliyor */
          const kaliyor = sehirler.some((s) => s.ulke === yeniUlke && s.ad === deger);
          if (!kaliyor) sec('');
        }}
      />

      {/* ---------------- Şehir seçme sayfası ---------------- */}
      <SecimSayfasi
        acik={sehirAcik}
        baslik="Şehir seç"
        aramaIpucu="Şehir ara…"
        secenekler={ulkeSehirleri}
        deger={deger}
        /* Listede yoksa uye ekler (Burak'in testi P2, 15 Ekim 2026) */
        ekle={async (ad) => {
          const sonuc = await sehirEkle(ulke, ad);
          if ('hata' in sonuc) return sonuc.hata;
          sec(sonuc.ad);
          setSehirAcik(false);
          return null;
        }}
        kapat={() => setSehirAcik(false)}
        sec={(yeniSehir) => {
          sec(yeniSehir);
          setSehirAcik(false);
        }}
      />
    </View>
  );
}

/**
 * Tek secimli, aramali secim sayfasi.
 * Ulke ve sehir ayni gorunumu kullaniyor.
 */
function SecimSayfasi({
  acik,
  baslik,
  aramaIpucu,
  secenekler,
  deger,
  bayrakli = false,
  sec,
  kapat,
  ekle,
}: {
  acik: boolean;
  baslik: string;
  aramaIpucu: string;
  secenekler: string[];
  deger: string;
  bayrakli?: boolean;
  sec: (secilen: string) => void;
  kapat: () => void;
  /** Verilirse aranan bulunamayinca "… ekle" cikar; hata metni ya da null doner */
  ekle?: (ad: string) => Promise<string | null>;
}) {
  // Android alt tus cubugu: alttan acilan pencerenin son satiri altinda kalmasin (3 Kasim 2026)
  const altKenar = useSafeAreaInsets().bottom;
  const [arama, setArama] = useState('');
  const [ekleniyor, setEkleniyor] = useState(false);
  const [ekleHatasi, setEkleHatasi] = useState('');

  const gorunen = secenekler.filter(
    (s) => arama.trim() === '' || eslesiyorMu(s, arama)
  );
  const aranan = arama.trim();
  /* Birebir ayni ad listede yoksa eklenebilir ("Lagos" varken "Lago" da eklenebilir) */
  const eklenebilir =
    ekle !== undefined &&
    aranan.length >= 2 &&
    !secenekler.some((s) => aramaIcinSade(s) === aramaIcinSade(aranan));

  const ekleyeBas = async () => {
    if (!ekle || ekleniyor) return;
    setEkleHatasi('');
    setEkleniyor(true);
    const hata = await ekle(aranan);
    setEkleniyor(false);
    if (hata) setEkleHatasi(hata);
    else setArama('');
  };

  return (
    <Modal visible={acik} animationType="slide" transparent onRequestClose={kapat}>
      <View style={styles.perde}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kapat"
          onPress={kapat}
          style={styles.perdeBosluk}
        />

        <View style={[styles.sayfa, { paddingBottom: altKenar }]}>
          <View style={styles.tutamak} />

          <View style={styles.sayfaBasligi}>
            <Text style={styles.sayfaAd}>{baslik}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Kapat"
              onPress={kapat}
              hitSlop={8}
              style={({ pressed }) => pressed && styles.basili}>
              <Icon name="x" size={22} color={Colors.textMuted} strokeWidth={2.2} />
            </Pressable>
          </View>

          <View style={styles.aramaAlani}>
            <View style={styles.aramaKutusu}>
              <Icon name="search" size={18} color={Colors.textFaint} />
              <TextInput
                value={arama}
                onChangeText={setArama}
                placeholder={aramaIpucu}
                placeholderTextColor={Colors.textFaint}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.aramaGirdisi}
              />
              {arama !== '' && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Aramayı temizle"
                  onPress={() => setArama('')}
                  hitSlop={8}>
                  <Icon name="x" size={17} color={Colors.textFaint} strokeWidth={2} />
                </Pressable>
              )}
            </View>
          </View>

          <ScrollView
            style={styles.liste}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {eklenebilir && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${aranan} şehrini listeye ekle`}
                disabled={ekleniyor}
                onPress={() => void ekleyeBas()}
                style={({ pressed }) => [styles.ekleSatiri, pressed && styles.basili]}>
                <Icon name="plus" size={18} color={Colors.primary} strokeWidth={2.4} />
                <Text style={styles.ekleYazisi}>
                  {ekleniyor ? 'Ekleniyor…' : `“${aranan}” listede yok, ekle`}
                </Text>
              </Pressable>
            )}
            {ekleHatasi !== '' && <Text style={styles.ekleHata}>{ekleHatasi}</Text>}
            {gorunen.length === 0 ? (
              eklenebilir ? null : (
                <Text style={styles.bosSonuc}>“{arama.trim()}” bulunamadı.</Text>
              )
            ) : (
              gorunen.map((secenek) => {
                const secili = secenek === deger;
                return (
                  <Pressable
                    key={secenek}
                    accessibilityRole="button"
                    accessibilityState={{ selected: secili }}
                    onPress={() => {
                      setArama('');
                      sec(secenek);
                    }}
                    style={({ pressed }) => [
                      styles.satir,
                      secili && styles.satirSecili,
                      pressed && styles.basili,
                    ]}>
                    {bayrakli && bayrak(secenek) !== '' && (
                      <Text style={styles.bayrak}>{bayrak(secenek)}</Text>
                    )}
                    <Text style={[styles.satirYazisi, secili && styles.seciliYazi]}>
                      {secenek}
                    </Text>
                    {secili && (
                      <Icon name="check" size={18} color={Colors.primary} strokeWidth={2.6} />
                    )}
                  </Pressable>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  grup: { gap: Spacing.sm },
  basili: { opacity: 0.8 },
  etiket: {
    fontSize: FontSize.small,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  altEtiket: {
    fontSize: FontSize.small,
    fontWeight: '600',
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },

  /* Olculer standart form kutusuyla (components/field.tsx) ayni */
  kutu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: 52,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderInput, // giris kutusu: >= 3:1 (WCAG 1.4.11)
    backgroundColor: Colors.surface,
  },
  kutuKapali: { backgroundColor: Colors.background },
  secilen: {
    flex: 1,
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Colors.text,
  },
  bos: { fontWeight: '400', color: Colors.textFaint },
  bayrak: { fontSize: 20 },
  yardim: {
    fontSize: FontSize.caption,
    lineHeight: 18,
    color: Colors.textFaint,
  },
  hata: {
    fontSize: FontSize.caption,
    lineHeight: 18,
    color: Colors.heart,
  },
  kutuHatali: { borderColor: Colors.heart },

  /* Seçim sayfası */
  perde: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(7, 24, 45, 0.45)',
  },
  perdeBosluk: { flex: 1 },
  sayfa: {
    height: '78%',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    backgroundColor: Colors.background,
  },
  tutamak: {
    width: 44,
    height: 5,
    borderRadius: Radius.pill,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginTop: Spacing.md,
  },
  sayfaBasligi: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  sayfaAd: {
    fontSize: FontSize.title,
    fontWeight: '800',
    color: Colors.text,
  },
  aramaAlani: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  aramaKutusu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    height: 48,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderInput, // giris kutusu: >= 3:1 (WCAG 1.4.11)
    backgroundColor: Colors.surface,
  },
  aramaGirdisi: {
    flex: 1,
    fontSize: FontSize.body,
    color: Colors.text,
  },
  liste: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  satir: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
  },
  satirSecili: { backgroundColor: Colors.primarySoft },
  satirYazisi: {
    flex: 1,
    fontSize: FontSize.body,
    color: Colors.text,
  },
  seciliYazi: { fontWeight: '700', color: Colors.primary },
  bosSonuc: {
    fontSize: FontSize.small,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: Spacing.xxl,
  },
  ekleSatiri: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
  },
  ekleYazisi: { fontSize: FontSize.body, fontWeight: '600', color: Colors.primary },
  ekleHata: {
    fontSize: FontSize.small,
    color: Colors.heart,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
});

/**
 * Listede olmayan sehri uye ekler. ExCom'da veritabanina yazilir;
 * prototipte yazilan ad oldugu gibi kabul edilir.
 */
async function sehirEkle(_ulke: string, ad: string): Promise<{ ad: string } | { hata: string }> {
  const temiz = ad.replace(/\s+/g, ' ').trim();
  if (temiz.length < 2) return { hata: 'Şehir adını yaz.' };
  return { ad: temiz };
}
