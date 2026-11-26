import { ILGI_KATALOGU } from '@/data/ilgi-alanlari';

/**
 * PROTOTIP ORNEK VERISI
 * Gercek veritabani (ayri Supabase projesi) baglanana kadar her sey buradan.
 * Kisiler ve planlar uydurmadir.
 */

export type IlgiAlani = { id: string; ad: string; simge: string };

/**
 * Ilgi alanlari: ExCom katalogu (7 kategori, 173 secenek; data/ilgi-alanlari.ts).
 * Emoji yok (simge bos); kayitta populer 12 + "Daha fazla".
 */
export const ILGI_ALANLARI: IlgiAlani[] = ILGI_KATALOGU.alanlar.map((a) => ({ id: a.id, ad: a.ad, simge: '' }));

export const ilgiAdi = (id: string) => ILGI_KATALOGU.bul.get(id)?.ad ?? id;
/** Emoji kaldirildi (kullanici istegi); eski cagrilar bozulmasin diye bos doner */
export const ilgiSimge = (_id: string) => '';

export const SEHIRLER = ['İstanbul', 'Ankara', 'İzmir'];
export const SEMTLER: Record<string, string[]> = {
  İstanbul: ['Kadıköy', 'Ataşehir', 'Beşiktaş', 'Şişli', 'Sarıyer', 'Üsküdar', 'Beyoğlu', 'Maslak'],
  Ankara: ['Çankaya', 'Yenimahalle', 'Etimesgut'],
  İzmir: ['Karşıyaka', 'Bornova', 'Alsancak', 'Urla'],
};

export type Kisi = {
  id: string;
  ad: string;
  soyadHarf: string;
  sehir: string;
  semt: string;
  ilgiler: string[];
  muzik: string[];
  sirket?: string;
  pozisyon?: string;
  hakkinda?: string;
  /** Kimin daveti ile geldi (kisi id) */
  davetEden?: string;
  /** Tanidiklari (baglantilari) - ortak tanidik hesabi icin */
  tanidiklar: string[];
  /** Yalnizca arka planda (+-8 yil yakinlik); profilde gosterilmez */
  mezuniyet?: number;
  universite?: string;
  bolum?: string;
  /** Ne is yaptigini anlatan etiketler (pozisyon yazisindan daha aciklayici) */
  uzmanliklar?: string[];
  /** Sevdigi sanatcilar (muzik zevki karti) */
  sanatcilar?: string[];
  linkedin?: string;
  lise?: string;
  eskiSirketler?: string[];
  /** "03-14": yalnizca gun ve ay */
  dogumGunu?: string;
};

/** Muzik tarzlari (profil doldurma ve duzenleme) */
export const MUZIK_TARZLARI = ['caz', 'rock', 'pop', 'klasik', 'indie', 'elektronik', 'Türkçe pop', 'alternatif', 'blues', 'hip hop'];

/** Plus'taki diger uyeler */
export const KISILER: Kisi[] = [
  {
    id: 'ayse', ad: 'Ayşe', soyadHarf: 'K', sehir: 'İstanbul', semt: 'Kadıköy',
    ilgiler: ['muze-ve-sergi', 'kitap', 'yoga', 'kahve'], muzik: ['jazz'],
    sirket: 'Bir yazılım şirketi', pozisyon: 'Ürün yöneticisi',
    hakkinda: 'Hafta sonları galeri gezip kahve içmeyi seviyorum.',
    tanidiklar: ['selin', 'mert', 'burcu', 'baris', 'deniz'], mezuniyet: 2012,
    universite: 'Boğaziçi Üniversitesi', bolum: 'İşletme', uzmanliklar: ['Ürün yönetimi', 'Kullanıcı araştırması'], sanatcilar: ['Norah Jones', 'Kalben'], linkedin: 'linkedin.com/in/ornek-ayse',
    lise: 'Kadıköy Anadolu Lisesi', eskiSirketler: ['Turkcell', 'Hepsiburada'], dogumGunu: '03-14',
  },
  {
    id: 'selin', ad: 'Selin', soyadHarf: 'D', sehir: 'İstanbul', semt: 'Kadıköy',
    ilgiler: ['tenis', 'muze-ve-sergi', 'fotograf', 'kahve'], muzik: ['jazz', 'alternatif-rock-indie'],
    sirket: 'Bir danışmanlık şirketi', pozisyon: 'Kıdemli danışman',
    hakkinda: 'Sabah teniscisi, akşam sergi gezgini.',
    davetEden: 'ayse', tanidiklar: ['ayse', 'burcu', 'deniz', 'can'], mezuniyet: 2014,
    universite: 'ODTÜ', bolum: 'Endüstri Mühendisliği', uzmanliklar: ['Strateji', 'Süreç tasarımı'], sanatcilar: ['Gregory Porter', 'Bon Iver'],
    eskiSirketler: ['Deloitte'], dogumGunu: '11-28',
  },
  {
    id: 'mert', ad: 'Mert', soyadHarf: 'K', sehir: 'İstanbul', semt: 'Beşiktaş',
    ilgiler: ['teknoloji-urunleri', 'kosu', 'girisimcilik', 'kahve'], muzik: ['turkce-rock'],
    sirket: 'Bir fintek girişimi', pozisyon: 'Kurucu ortak',
    hakkinda: 'Pazar sabahları Caddebostan sahilinde koşuyorum.',
    davetEden: 'ayse', tanidiklar: ['ayse', 'baris', 'can', 'emre'], mezuniyet: 2011,
    universite: 'İTÜ', bolum: 'Bilgisayar Mühendisliği', uzmanliklar: ['Ödeme sistemleri', 'Girişimcilik'], sanatcilar: ['Duman', 'Arctic Monkeys'], linkedin: 'linkedin.com/in/ornek-mert',
    lise: 'Robert Kolej', eskiSirketler: ['Garanti BBVA', 'Getir'],
  },
  {
    id: 'burcu', ad: 'Burcu', soyadHarf: 'A', sehir: 'İstanbul', semt: 'Ataşehir',
    ilgiler: ['muze-ve-sergi', 'fotograf', 'seyahat', 'sinema'], muzik: ['jazz'],
    sirket: 'Bir banka', pozisyon: 'Pazarlama müdürü',
    tanidiklar: ['ayse', 'selin', 'elif'], mezuniyet: 2010,
    universite: 'Bilkent Üniversitesi', bolum: 'İletişim', uzmanliklar: ['Marka yönetimi', 'Dijital pazarlama'], sanatcilar: ['Chet Baker', 'Sezen Aksu'],
    lise: 'Kadıköy Anadolu Lisesi', eskiSirketler: ['Unilever'],
  },
  {
    id: 'baris', ad: 'Barış', soyadHarf: 'T', sehir: 'İstanbul', semt: 'Ataşehir',
    ilgiler: ['tenis', 'seyahat', 'padel', 'sarap'], muzik: ['turkce-pop'],
    sirket: 'Bir lojistik şirketi', pozisyon: 'Operasyon direktörü',
    davetEden: 'mert', tanidiklar: ['mert', 'ayse', 'can'], mezuniyet: 2009,
    universite: 'Yıldız Teknik Üniversitesi', bolum: 'Lojistik', uzmanliklar: ['Tedarik zinciri', 'Operasyon'], sanatcilar: ['Tarkan', 'Dua Lipa'],
  },
  {
    id: 'elif', ad: 'Elif', soyadHarf: 'S', sehir: 'İstanbul', semt: 'Üsküdar',
    ilgiler: ['kitap', 'seyahat', 'gastronomi', 'muze-ve-sergi'], muzik: ['klasik-muzik'],
    sirket: 'Bir yayınevi', pozisyon: 'Editör',
    hakkinda: 'Ayda bir kitap, yılda bir uzun yol.',
    davetEden: 'burcu', tanidiklar: ['burcu', 'deniz'], mezuniyet: 2015,
    universite: 'Galatasaray Üniversitesi', bolum: 'Felsefe', uzmanliklar: ['Editörlük', 'Yayıncılık'], sanatcilar: ['Fazıl Say', 'Ludovico Einaudi'],
  },
  {
    id: 'can', ad: 'Can', soyadHarf: 'Y', sehir: 'İstanbul', semt: 'Sarıyer',
    ilgiler: ['doga-yuruyusu', 'yelken', 'fotograf', 'kosu'], muzik: ['alternatif-rock-indie'],
    sirket: 'Bir enerji şirketi', pozisyon: 'Proje mühendisi',
    tanidiklar: ['selin', 'mert', 'baris'], mezuniyet: 2013,
    universite: 'İTÜ', bolum: 'Makine Mühendisliği', uzmanliklar: ['Yenilenebilir enerji', 'Proje yönetimi'], sanatcilar: ['Bon Iver', 'Gaye Su Akyol'],
  },
  {
    id: 'deniz', ad: 'Deniz', soyadHarf: 'Ö', sehir: 'İstanbul', semt: 'Kadıköy',
    ilgiler: ['yoga', 'kitap', 'kahve', 'cocuklu'], muzik: ['jazz'],
    sirket: 'Bir ilaç şirketi', pozisyon: 'İK iş ortağı',
    tanidiklar: ['ayse', 'selin', 'elif'], mezuniyet: 2008,
    universite: 'Marmara Üniversitesi', bolum: 'Psikoloji', uzmanliklar: ['Yetenek yönetimi', 'Koçluk'], sanatcilar: ['Norah Jones', 'Kalben'],
  },
  {
    id: 'emre', ad: 'Emre', soyadHarf: 'B', sehir: 'İstanbul', semt: 'Maslak',
    ilgiler: ['teknoloji-urunleri', 'padel', 'sarap', 'gastronomi'], muzik: ['house'],
    sirket: 'Bir e-ticaret şirketi', pozisyon: 'Mühendislik müdürü',
    tanidiklar: ['mert'], mezuniyet: 2012,
    universite: 'Sabancı Üniversitesi', bolum: 'Bilgisayar Bilimi', uzmanliklar: ['Yazılım mimarisi', 'Ekip liderliği'], sanatcilar: ['Bonobo', 'Mabel Matiz'], linkedin: 'linkedin.com/in/ornek-emre',
    eskiSirketler: ['Trendyol', 'Microsoft'], dogumGunu: '07-02',
  },
  {
    id: 'zeynep', ad: 'Zeynep', soyadHarf: 'E', sehir: 'İzmir', semt: 'Alsancak',
    ilgiler: ['yelken', 'gastronomi', 'sarap', 'seyahat'], muzik: ['jazz'],
    sirket: 'Bir turizm şirketi', pozisyon: 'Genel müdür yardımcısı',
    tanidiklar: ['can'], mezuniyet: 2007,
    universite: 'Ege Üniversitesi', bolum: 'Turizm İşletmeciliği', uzmanliklar: ['Otel yönetimi', 'Müşteri deneyimi'], sanatcilar: ['Gregory Porter', 'Sezen Aksu'],
  },
];

export const kisiBul = (id: string) => KISILER.find((k) => k.id === id);
export const tamAd = (k: Kisi) => `${k.ad} ${k.soyadHarf}.`;

/**
 * Gecerli davet kodlari (prototip). Kod -> davet eden kisi.
 * Gercekte her uyenin kendi kodu olur; baslangicta herkese 1 davet hakki.
 */
export const DAVET_KODLARI: Record<string, string> = {
  EX4K7P: 'ayse',
  MERT01: 'mert',
  BURCU2: 'burcu',
};

export type Plan = {
  id: string;
  baslik: string;
  tur: 'Küçük plan' | 'Büyük etkinlik' | 'Kulüp buluşması';
  gun: string;
  saat: string;
  semt: string;
  mekan: string;
  kontenjan: number;
  katilan: string[];
  ilgiler: string[];
  /** Yerel fotograf (require) ya da uyenin sectigi fotograf (data URI) */
  gorsel: number | string;
  aciklama: string;
  ayinEtkinligi?: boolean;
  /** Kulup bulusmasiysa kulubun id'si (kulubun ev sahibi koyar) */
  kulup?: string;
  /** Bulusmayi koyan ev sahibi (kisi id ya da 'ben') */
  evSahibi?: string;
};

/** Ekibin koydugu hazir planlar (strateji: "plani biz koyuyoruz") */
export const PLANLAR: Plan[] = [
  {
    id: 'sergi-turu', baslik: 'Rehberli sergi turu', tur: 'Küçük plan',
    gun: 'Cumartesi', saat: '11.00', semt: 'Tophane', mekan: 'İstanbul Modern',
    kontenjan: 12, katilan: ['selin', 'burcu', 'ayse'], ilgiler: ['muze-ve-sergi', 'fotograf'],
    gorsel: require('@/assets/images/etkinlik/sergi-turu.jpg'),
    aciklama: 'Bir küratör eşliğinde yeni sergiyi geziyoruz, sonra kahveye oturuyoruz.',
  },
  {
    id: 'pazar-kosusu', baslik: 'Pazar sabahı koşusu', tur: 'Küçük plan',
    gun: 'Pazar', saat: '08.30', semt: 'Caddebostan', mekan: 'Sahil yolu',
    kontenjan: 15, katilan: ['mert', 'can'], ilgiler: ['kosu', 'doga-yuruyusu'],
    gorsel: require('@/assets/images/etkinlik/pazar-kosusu.jpg'),
    aciklama: '5 km rahat tempo. Her seviyeye uygun; bitişte kahvaltı.',
  },
  {
    id: 'sarap-tadimi', baslik: 'Butik şarap tadımı', tur: 'Küçük plan',
    gun: 'Cuma', saat: '19.30', semt: 'Karaköy', mekan: 'Bir butik şaraphane',
    kontenjan: 10, katilan: ['baris', 'emre', 'zeynep'], ilgiler: ['sarap', 'gastronomi'],
    gorsel: require('@/assets/images/etkinlik/sarap-tadimi.jpg'),
    aciklama: 'Ege üreticilerinden altı şarap, eşleşen küçük tabaklar.',
  },
  {
    id: 'kitap-kulubu', baslik: 'Kitap kulübü: ayın kitabı', tur: 'Kulüp buluşması',
    gun: 'Salı', saat: '19.30', semt: 'Moda', mekan: 'Bir sahaf kafe',
    kontenjan: 8, katilan: ['elif', 'deniz', 'ayse'], ilgiler: ['kitap'], kulup: 'kitap', evSahibi: 'elif',
    gorsel: require('@/assets/images/etkinlik/kitap-kulubu.jpg'),
    aciklama: 'Bu ay bir roman konuşuyoruz. Okumadıysan da gel, dinle.',
  },
  {
    id: 'soylesi', baslik: 'Söyleşi: İkinci kariyer', tur: 'Küçük plan',
    gun: 'Perşembe', saat: '19.00', semt: 'Levent', mekan: 'Bir ortak çalışma alanı',
    kontenjan: 40, katilan: ['mert', 'emre', 'burcu', 'deniz'], ilgiler: ['girisimcilik', 'teknoloji-urunleri'],
    gorsel: require('@/assets/images/etkinlik/soylesi.jpg'),
    aciklama: 'Kurumsal hayattan girişime geçen üç konukla sohbet.',
  },
  {
    id: 'yelken', baslik: 'Gün batımında yelken', tur: 'Küçük plan',
    gun: 'Cumartesi', saat: '17.00', semt: 'Kuruçeşme', mekan: 'Marina',
    kontenjan: 8, katilan: ['can', 'zeynep'], ilgiler: ['yelken', 'doga-yuruyusu'],
    gorsel: require('@/assets/images/etkinlik/yelken.jpg'),
    aciklama: 'Boğaz’da iki saatlik tekne turu. Deneyim gerekmez.',
  },
  {
    id: 'caz-gecesi', baslik: 'Caz gecesi', tur: 'Küçük plan',
    gun: 'Perşembe', saat: '21.00', semt: 'Beyoğlu', mekan: 'Bir caz kulübü',
    kontenjan: 20, katilan: ['ayse', 'selin', 'deniz'], ilgiler: ['caz', 'sinema'],
    gorsel: require('@/assets/images/etkinlik/caz-gecesi.jpg'),
    aciklama: 'Canlı kuartet, ayrılmış masalar.',
  },
  {
    id: 'acilis-bulusmasi', baslik: 'ExCom Plus açılış buluşması', tur: 'Büyük etkinlik',
    gun: '20 Mart', saat: '20.00', semt: 'Bebek', mekan: 'Sürpriz mekân',
    kontenjan: 200, katilan: ['ayse', 'mert', 'selin', 'burcu', 'baris', 'elif', 'can', 'emre'],
    ilgiler: [], gorsel: require('@/assets/images/etkinlik/acilis-bulusmasi.jpg'),
    aciklama: 'İlk davetlilerle tanışma gecesi. Ayın etkinliği.',
    ayinEtkinligi: true,
  },
];

export const planBul = (id: string) => PLANLAR.find((p) => p.id === id);

export type Kulup = {
  id: string;
  ad: string;
  ilgi: string;
  /** Kulubu secenler; esige ulasinca sohbet acilir */
  uyeler: string[];
  esik: number;
  aciklama: string;
  /** Kulubun ev sahibi (kisi id). Yoksa bir uye gonullu olabilir. */
  evSahibi?: string;
};

/**
 * Kulup esigi: bu kadar kisi olunca kulup ve sohbeti acilir.
 * Baslangicta dusuk (5); uye sayisi artinca yukseltilir, sehre gore bolunur.
 */
export const KULUP_ESIGI = 5;

/** Bir ilgiyi profilinde secen uyeler. Ilgi secmek = o kulubun bekleme listesine girmek. */
const ilgiyiSecenler = (ilgi: string) => KISILER.filter((k) => k.ilgiler.includes(ilgi)).map((k) => k.id);

/**
 * Tohum kulupler: acilista ekip acar, hepsi "Toplaniyor" durumunda baslar.
 * Uyeleri elle yazilmaz; o ilgiyi secenlerden hesaplanir.
 */
const TOHUM_KULUPLER: Omit<Kulup, 'uyeler' | 'esik'>[] = [
  { id: 'tenis', ad: 'Tenis Kulübü', ilgi: 'tenis', aciklama: 'Hafta içi iş çıkışı ve hafta sonu sabah maçları.' },
  { id: 'sergi', ad: 'Sergi Gezenler', ilgi: 'muze-ve-sergi', aciklama: 'Ayda iki sergi, sonrasında sohbet.' },
  { id: 'kitap', ad: 'Kitap Kulübü', ilgi: 'kitap', evSahibi: 'elif', aciklama: 'Ayın kitabı, ayda bir buluşma.' },
  { id: 'kosu', ad: 'Koşu Grubu', ilgi: 'kosu', aciklama: 'Pazar sabahları sahilde.' },
  { id: 'padel', ad: 'Padel Ekibi', ilgi: 'padel', aciklama: 'Dörtlü maçlar, seviye fark etmez.' },
  { id: 'yemek', ad: 'Şefin Masası', ilgi: 'gastronomi', evSahibi: 'emre', aciklama: 'Ayda bir şefin masasında akşam yemeği.' },
  { id: 'fotograf', ad: 'Foto Yürüyüşü', ilgi: 'fotograf', aciklama: 'Şehirde fotoğraf yürüyüşleri.' },
  { id: 'teknoloji', ad: 'Teknoloji Sohbetleri', ilgi: 'teknoloji-urunleri', evSahibi: 'mert', aciklama: 'Ayda bir konu, bir konuşmacı.' },
];

export const KULUPLER: Kulup[] = TOHUM_KULUPLER.map((k) => ({ ...k, uyeler: ilgiyiSecenler(k.ilgi), esik: KULUP_ESIGI }));

export const kulupBul = (id: string) => KULUPLER.find((k) => k.id === id);

/**
 * KULUP ONERISI (fikir) - uyelerin onerdigi, henuz acilmamis kulupler.
 * Surec: 1) uye onerir  2) FIKIR_ESIGI kadar kisi "Ben de varim" der
 *        3) ekip kisa bir kontrol yapar (tekrar / uygunsuz mu)  4) kulup acilir,
 *        oneren isterse ev sahibi olur.
 */
export const FIKIR_ESIGI = 5;

export type KulupFikri = {
  id: string;
  ad: string;
  ilgi: string;
  aciklama: string;
  /** Oneren kisi id ('ben' = bu cihazdaki uye) */
  oneren: string;
  /** Oneren ev sahibi olmak istiyor mu */
  evSahibi: boolean;
  /** "Ben de varim" diyenler (oneren haric) */
  destekciler: string[];
};

export const KULUP_FIKIRLERI: KulupFikri[] = [
  {
    id: 'fikir-yelken', ad: 'Hafta Sonu Yelkencileri', ilgi: 'yelken', oneren: 'mert', evSahibi: true,
    aciklama: 'Ayda bir Moda açıklarında günübirlik tekne. Deneyim şart değil.',
    destekciler: ['baris', 'can', 'selin'],
  },
  {
    id: 'fikir-sarap', ad: 'Şarap ve Peynir Akşamları', ilgi: 'sarap', oneren: 'zeynep', evSahibi: false,
    aciklama: 'Her ay bir bölge, küçük bir tadım ve sohbet.',
    destekciler: ['elif'],
  },
];

/** Bir fikri destekleyen toplam kisi (oneren dahil) */
export const fikirSayisi = (f: KulupFikri) => f.destekciler.length + 1;

export type Mesaj = {
  kimden: 'ben' | string;
  metin: string;
  saat: string;
  /** Kulup sohbetine dusen yeni bulusma */
  plan?: string;
  /** Ekli fotograf (prototipte data URI) */
  ek?: string;
  /** Benim tepkim ve karsi tarafin tepkisi (emoji) */
  tepki?: string;
  karsiTepki?: string;
};
export type Sohbet = {
  id: string;
  tur: 'kisi' | 'kulup';
  hedef: string;
  mesajlar: Mesaj[];
  /** Okudugum mesaj sayisi; sonrasindaki baskasinin mesajlari okunmamis */
  okunan?: number;
};

/** Ekrandaki tepki secenekleri (ExCom ile ayni) */
export const TEPKILER = ['❤️', '😂', '😮', '😢', '👏', '🔥'];

/** Sohbetteki okunmamis (baskasinin yazdigi) mesaj sayisi */
export const okunmamisSayisi = (s: Sohbet) => s.mesajlar.slice(s.okunan ?? 0).filter((m) => m.kimden !== 'ben').length;

/** Baslangic sohbetleri */
export const SOHBETLER: Sohbet[] = [
  {
    id: 'ayse', tur: 'kisi', hedef: 'ayse',
    mesajlar: [
      { kimden: 'ayse', metin: 'Hoş geldin! Davetimi kabul ettiğine çok sevindim 🎉', saat: '10:12' },
      { kimden: 'ayse', metin: 'Cumartesi sergi turuna gelsene, Selin de geliyor.', saat: '10:13' },
    ],
  },
  {
    id: 'kulup-sergi', tur: 'kulup', hedef: 'sergi',
    mesajlar: [
      { kimden: 'burcu', metin: 'Bu hafta İstanbul Modern’e kim geliyor?', saat: 'Dün' },
      { kimden: 'selin', metin: 'Ben varım! 11’de girişte buluşalım.', saat: 'Dün', karsiTepki: '👏' },
    ],
    okunan: 1,
  },
];
