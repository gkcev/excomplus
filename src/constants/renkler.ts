/**
 * EXCOM RENKLERI (tek kaynak, 16 Ekim 2026)
 * ------------------------------------------------------------
 * Butun ekranlar renkleri buradan alir; ekranlarda rastgele HEX
 * yazilmaz. Bu dosya hicbir sey ice aktarmaz: kontrast testleri
 * (scripts/kontrast-testi.mjs) onu dogrudan okuyabilsin.
 *
 * MARKA PALETI (kullanici talimati, 16 Ekim 2026)
 *  Ana: lacivert #07182D, turuncu #F05A24, sari #FFB62E, krem #FBF8F2
 *  Yardimci: seftali #FFF0E4, suluboya mavisi #7695AC, bej #F3E1C7
 *
 * KURALLAR
 *  - Kimlik lacivert + turuncu + sari. Mavi, yesil ana rengin onune gecmez.
 *  - Zemin krem, kartlar beyaz, ince bej kenar, yuvarlak kose.
 *  - Turuncu: CTA ve onemli vurgu; her yere yayilmaz.
 *  - Sari: kucuk vurgu ve illustrasyon; kucuk METINDE kullanilmaz.
 *  - Yesil: yalnizca katilim onayi gibi anlamli durumlarda.
 *  - Suluboya mavisi: hero ve illustrasyonlarda; metin rengi degil.
 *  - Logo dosyasi ve logo renkleri degismez (logodaki sari logoya ozgu).
 *
 * ERISILEBILIRLIK (WCAG 2.2 AA)
 *  Turuncu #F05A24 beyaz uzerinde 3.39:1 - buyuk yazi ve ikon icin yeter,
 *  normal metin icin yetmez. Bu yuzden IKI turuncu var:
 *   - Marka.turuncu (canli): dolgu, ikon, harita isareti, dekor.
 *   - Colors.accent (koyu #C44112, beyazda 5.11:1): turuncu METIN ve
 *     beyaz yazili turuncu DUGME. Gorunus ayni ailede, okunabilir.
 *  Her on plan / zemin cifti scripts/kontrast-testi.mjs'de olculur.
 */

export const Marka = {
  /** Lacivert - basliklar, metin, navigasyon, koyu buton */
  lacivert: '#07182D',
  /** Krem - uygulama zemini */
  krem: '#FBF8F2',
  /** Beyaz - kartlar, pencereler */
  beyaz: '#FFFFFF',
  /** Turuncu (canli) - dolgu, ikon, isaret, dekor */
  turuncu: '#F05A24',
  /** Turuncu (koyu, erisilebilir) - turuncu metin ve beyaz yazili turuncu buton */
  turuncuKoyu: '#C44112',
  /** Sari - kucuk vurgu, rozet zemini, illustrasyon */
  sari: '#FFB62E',
  /** Acik seftali - kart ve rozet zemini */
  seftali: '#FFF0E4',
  /** Suluboya mavisi - yalnizca gorsel/dekor */
  suluboyaMavi: '#7695AC',
  /** Acik bej - ince kenar ve ayirici tonu */
  bej: '#F3E1C7',
  /** Ikincil yazi (kremde 6.1:1) */
  gri: '#5A5E6B',

  /* Eski adlar: kodun her yerinde geciyor, yeni paletle ayni renge baglanir */
  /** = turuncu (canli) */
  kesisim: '#F05A24',
  /** = sari */
  kehribar: '#FFB62E',
  /** Sahne blogu zemini = seftali */
  sahne: '#FFF0E4',
  /** Begeni/hata (erisilebilir kirmizi; beyazda 5.44:1) */
  mercan: '#C0392B',
  /** Fotografin arkasindaki sicak daire (illustrasyon) */
  sicakDaire: '#F5C8A7',
} as const;

/**
 * YARDIMCI PASTELLER - ikon zeminleri, etiketler, avatarlar.
 * Pastel zemin uzerinde her zaman koyu (lacivert) metin.
 */
export const Pastel = {
  seftali: Marka.seftali,
  mint: '#D9F0E2',
  lila: '#E7E3F9',
  gok: '#DDEBF9',
  tereyagi: '#F8E7B8',
} as const;

/** Kisilere sirayla verilen avatar pastelleri */
export const AVATAR_PASTELLERI = [
  Pastel.seftali,
  Pastel.mint,
  Pastel.lila,
  Pastel.gok,
  Pastel.tereyagi,
] as const;

/** Kolaj kagitlari: yalnizca illustrasyonda, butona ve yaziya sizmaz */
export const Kagit = {
  seftali: '#F6C9A8',
  lila: '#D9CFF5',
  tereyagi: '#F7D27A',
  mint: '#CDEBDD',
  gok: '#CFE0F5',
} as const;

/** Durum rozetleri: zemin + yazi (her cift >= 4.5:1, testte olculur) */
export const Durum = {
  /** Katilim onayi: yesil yalnizca burada */
  onaylandi: { zemin: Pastel.mint, yazi: '#1A6B44' },
  bekliyor: { zemin: Pastel.seftali, yazi: '#B5461C' },
  odemeBekleniyor: { zemin: Pastel.lila, yazi: '#5B4BB7' },
  kapandi: { zemin: '#F6E1DA', yazi: '#9C3A15' },
} as const;

/** Harita (Ex'ler Nerede?) renkleri: dekoratif, kart dili ile uyumlu */
export const Harita = {
  kara: '#F6EFE3',
  deniz: '#CFE3EE',
  sinir: '#D8C4A4',
} as const;

export const Colors = {
  /** Ana marka rengi - koyu butonlar, basliklar, aktif sekme */
  primary: Marka.lacivert,
  primaryDark: '#020B16',
  /**
   * Turuncu METIN ve beyaz yazili turuncu DUGME (koyu, erisilebilir).
   * Dolgu/ikon/dekor icin canli ton: accentCanli.
   */
  accent: Marka.turuncuKoyu,
  /** Canli turuncu: dolgu, ikon, isaret (uzerinde kucuk metin yok) */
  accentCanli: Marka.turuncu,
  /** Rozet ve ikon zeminleri (acik seftali) */
  primarySoft: Marka.seftali,
  /** Vurgu sarisi (zemin; uzerinde lacivert metin) */
  primaryMuted: Marka.sari,
  /** Profil avatari */
  avatar: Marka.seftali,

  /** Ekran zemini - krem */
  background: Marka.krem,
  /** Kart zemini */
  surface: Marka.beyaz,
  /** Ince kart cercevesi (dekoratif) */
  border: '#E7DED2',
  /** Giris kutusu ve secici cercevesi: >= 3:1 (WCAG 1.4.11) */
  borderInput: '#8C8278',
  /** Ayirici cizgi */
  divider: '#F2ECE2',
  /** Pasif alan zemini (QR kutusu, rozet zemini) */
  subtle: Marka.seftali,

  /** Geri sayim kartinin tonlari */
  partyGradientStart: Marka.seftali,
  partyGradientEnd: '#FFD9B8',

  /** Ana metin (kremde 16.8:1) */
  text: Marka.lacivert,
  /** Ikincil / yardimci metin (kremde 6.1:1) */
  textMuted: Marka.gri,
  /** Ipucu (placeholder) ve soluk metin (kremde ~4.9:1); ikincilden acik */
  textFaint: '#686C78',
  /** Pasif (disabled) metin: kontrast sartindan muaf, bilerek acik */
  textDisabled: '#A3A7B0',
  /** Alt menude secili olmayan sekme */
  tabInactive: '#4E5363',

  /** Begeni, uyari ve hata (erisilebilir kirmizi) */
  heart: Marka.mercan,
  /** Yikici islem metni: Uyeligimi sil, Yayini iptal et */
  tehlike: '#B5461C',
  /** Uyari kutularinin acik zemini */
  heartSoft: Marka.seftali,
  white: Marka.beyaz,
  /** Siyah: hikaye ve video zemini, golge */
  siyah: '#000000',

  /** Fiyat rozeti: cok acik krem-bej, uzerinde lacivert */
  bejZemin: '#F4EDE2',
  /** Sicak kart kenari (parti karti) */
  kenarSicak: '#F5DCC9',
  /** Alt sayfa tutamagi */
  tutamak: '#CFC5B8',
  /** Profil ilerleme cubugu: bos kisim ve hap zemini */
  ilerlemeBos: '#FFDCC4',
  ilerlemeHap: '#FFE2CD',
} as const;

/**
 * YUSUF SORUYOR yarisma ekrani: koyu sahne. Yalnizca yarisma
 * bilesenlerinde; uzerindeki yazilar beyaz (testte olculur).
 */
export const Yarisma = {
  koyuKart: '#1E2944',
  koyuKenar: '#2B3552',
  /** Dogru cevap (koyu zeminde) */
  dogru: '#2FA36B',
  /** Yanlis cevap / canli rozet */
  yanlis: '#E5383B',
  /** Sohbette ad ve vurgu moru (acik zeminde, >= 4.5:1) */
  mor: '#5B3FC4',
} as const;
