/**
 * UZMANLIK ETIKETLERI
 * ------------------------------------------------------------
 * Profilde "Mevcut Pozisyon" serbest metindi: "Kıdemli Uzman",
 * "Manager", "Ortak". Bu yazilar kisinin NE YAPTIGINI
 * anlatmiyordu; "aramizda bunu bilen var mi" sorusu da bu
 * yuzden zor cevaplaniyordu.
 *
 * Etiketler once HAZIR LISTEDEN seciliyor. Listede olmayan alan
 * elle de eklenebiliyor (bkz. etiketDuzelt); ayni seyin farkli
 * yazilislari birbirine baglaniyor.
 *
 * Liste beyaz yakada en sik karsilasilan alanlardan olusuyor ve
 * TAM DEGIL. Cok eklenen bir alan gorursen buraya tasinabilir.
 */

export type EtiketGrubu = {
  ad: string;
  etiketler: string[];
};

/** En cok secilecekleri ustte tutuyoruz */
export const ETIKET_GRUPLARI: EtiketGrubu[] = [
  {
    ad: 'Yönetim ve strateji',
    etiketler: [
      'Genel Yönetim',
      'Strateji',
      'İş Geliştirme',
      'Girişimcilik',
      'Proje Yönetimi',
      'Operasyon Yönetimi',
      'Danışmanlık',
      'İş Analizi',
    ],
  },
  {
    ad: 'Finans',
    etiketler: [
      'Finans',
      'Muhasebe',
      'Denetim',
      'Vergi',
      'Bütçe ve Raporlama',
      'Yatırım',
      'Risk Yönetimi',
      'Hazine',
    ],
  },
  {
    ad: 'Pazarlama ve satış',
    etiketler: [
      'Pazarlama',
      'Dijital Pazarlama',
      'Marka Yönetimi',
      'İçerik',
      'Sosyal Medya',
      'Performans Pazarlama',
      'Satış',
      'Kurumsal Satış',
      'CRM',
      'Halkla İlişkiler',
      'Reklam',
      'E-ticaret',
    ],
  },
  {
    ad: 'Teknoloji',
    etiketler: [
      'Yazılım Geliştirme',
      'Frontend',
      'Backend',
      'Mobil Geliştirme',
      'Veri Mühendisliği',
      'Veri Bilimi',
      'Yapay Zekâ',
      'DevOps',
      'Siber Güvenlik',
      'Sistem ve Ağ',
      'Ürün Yönetimi',
      'UX/UI Tasarım',
      'Test ve Kalite',
      'ERP',
      'Bilgi Teknolojileri Yönetimi',
    ],
  },
  {
    ad: 'İnsan kaynakları',
    etiketler: [
      'İnsan Kaynakları',
      'İşe Alım',
      'Eğitim ve Gelişim',
      'Ücret ve Yan Haklar',
      'Kurum Kültürü',
      'Koçluk ve Mentorluk',
    ],
  },
  {
    ad: 'Hukuk ve uyum',
    etiketler: [
      'Hukuk',
      'Sözleşmeler',
      'KVKK ve Uyum',
      'Fikri Mülkiyet',
      'Kurumsal Yönetişim',
    ],
  },
  {
    ad: 'Tedarik ve üretim',
    etiketler: [
      'Satın Alma',
      'Tedarik Zinciri',
      'Lojistik',
      'Dış Ticaret',
      'Üretim ve Planlama',
      'Kalite Yönetimi',
      'İş Sağlığı ve Güvenliği',
    ],
  },
  {
    ad: 'Tasarım ve iletişim',
    etiketler: [
      'Grafik Tasarım',
      'Endüstriyel Tasarım',
      'Video ve Prodüksiyon',
      'Metin Yazarlığı',
      'Kurumsal İletişim',
      'Çeviri',
    ],
  },
  {
    ad: 'Sektörel',
    etiketler: [
      'Müşteri Deneyimi',
      'Bankacılık',
      'Sigorta',
      'Sağlık',
      'İlaç',
      'Enerji',
      'İnşaat',
      'Mimarlık',
      'Gayrimenkul',
      'Turizm',
      'Perakende',
      'Otomotiv',
      'Tarım ve Gıda',
      'Medya ve Yayıncılık',
      'Eğitim',
      'Kamu ve STK',
    ],
  },
];

/** Butun etiketler tek listede (arama ve dogrulama icin) */
export const TUM_ETIKETLER = ETIKET_GRUPLARI.flatMap((g) => g.etiketler);

/**
 * Bir kisi en fazla bu kadar etiket secebilir.
 * Sinir olmasaydi herkes her seyi isaretlerdi ve etiketin
 * ayirt edici bir anlami kalmazdi.
 */
export const EN_COK_ETIKET = 6;

/** Kendi eklenen bir alanin en uzun hali */
export const ETIKET_UZUNLUK = 40;

const kucuk = (metin: string) => metin.toLocaleLowerCase('tr-TR');

/**
 * Elle yazilan alani duzeltir.
 *
 * Listede olmayan alan eklenebiliyor ("B2B SaaS" listede yoktu).
 * Serbest metnin derdi, ayni seyin farkli yazilip ayri ayri
 * birikmesiydi; onu iki yolla azaltiyoruz:
 *   - Bosluklar toplaniyor, uzunluk sinirli.
 *   - Yazilan sey listede ya da baska bir uyenin ekledikleri
 *     arasinda BUYUK-KUCUK HARF FARKIYLA varsa, o yazilis
 *     kullaniliyor: "b2b saas" yazan "B2B SaaS"e baglaniyor.
 */
export function etiketDuzelt(metin: string, digerleri: string[] = []) {
  const temiz = metin.replace(/\s+/g, ' ').trim().slice(0, ETIKET_UZUNLUK).trim();
  if (temiz === '') return '';
  const var_olan = [...TUM_ETIKETLER, ...digerleri].find((e) => kucuk(e) === kucuk(temiz));
  return var_olan ?? temiz;
}

/** Bos ya da tek harflik bir etiket kaydedilmesin */
export function etiketGecerliMi(etiket: string) {
  const temiz = etiket.trim();
  return temiz.length >= 2 && temiz.length <= ETIKET_UZUNLUK;
}

/** Hazir listede olmayan, uyelerin kendi ekledigi etiketler */
export function eklenenEtiketler(kisiler: { etiketler?: string[] }[]) {
  const gorulen = new Map<string, string>();
  for (const k of kisiler) {
    for (const e of k.etiketler ?? []) {
      if (TUM_ETIKETLER.some((t) => kucuk(t) === kucuk(e))) continue;
      if (!gorulen.has(kucuk(e))) gorulen.set(kucuk(e), e);
    }
  }
  return [...gorulen.values()].sort((a, b) => a.localeCompare(b, 'tr'));
}
