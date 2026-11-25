/**
 * PROTOTIP ORNEK VERISI
 * Gercek veritabani (ayri Supabase projesi) baglanana kadar her sey buradan.
 * Kisiler ve planlar uydurmadir.
 */

export type IlgiAlani = { id: string; ad: string; simge: string };

/** Ilgi alanlari (strateji: hobiler; en az 3 secilir) */
export const ILGI_ALANLARI: IlgiAlani[] = [
  { id: 'tenis', ad: 'Tenis', simge: '🎾' },
  { id: 'padel', ad: 'Padel', simge: '🏓' },
  { id: 'kosu', ad: 'Koşu', simge: '🏃' },
  { id: 'yoga', ad: 'Yoga', simge: '🧘' },
  { id: 'doga', ad: 'Doğa yürüyüşü', simge: '🥾' },
  { id: 'yelken', ad: 'Yelken', simge: '⛵' },
  { id: 'sergi', ad: 'Sergi', simge: '🖼️' },
  { id: 'kitap', ad: 'Kitap', simge: '📚' },
  { id: 'caz', ad: 'Caz', simge: '🎷' },
  { id: 'sinema', ad: 'Sinema', simge: '🎬' },
  { id: 'fotograf', ad: 'Fotoğraf', simge: '📷' },
  { id: 'yemek', ad: 'Yemek', simge: '🍽️' },
  { id: 'sarap', ad: 'Şarap', simge: '🍷' },
  { id: 'kahve', ad: 'Kahve', simge: '☕' },
  { id: 'seyahat', ad: 'Seyahat', simge: '✈️' },
  { id: 'teknoloji', ad: 'Teknoloji', simge: '💻' },
  { id: 'girisim', ad: 'Girişim', simge: '🚀' },
  { id: 'cocuklu', ad: 'Çocuklu aile etkinlikleri', simge: '🧸' },
];

export const ilgiAdi = (id: string) => ILGI_ALANLARI.find((i) => i.id === id)?.ad ?? id;
export const ilgiSimge = (id: string) => ILGI_ALANLARI.find((i) => i.id === id)?.simge ?? '•';

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
  mezuniyet?: number;
};

/** Plus'taki diger uyeler */
export const KISILER: Kisi[] = [
  {
    id: 'ayse', ad: 'Ayşe', soyadHarf: 'K', sehir: 'İstanbul', semt: 'Kadıköy',
    ilgiler: ['sergi', 'kitap', 'yoga', 'kahve'], muzik: ['caz'],
    sirket: 'Bir yazılım şirketi', pozisyon: 'Ürün yöneticisi',
    hakkinda: 'Hafta sonları galeri gezip kahve içmeyi seviyorum.',
    tanidiklar: ['selin', 'mert', 'burcu', 'baris', 'deniz'], mezuniyet: 2012,
  },
  {
    id: 'selin', ad: 'Selin', soyadHarf: 'D', sehir: 'İstanbul', semt: 'Kadıköy',
    ilgiler: ['tenis', 'sergi', 'fotograf', 'kahve'], muzik: ['caz', 'indie'],
    sirket: 'Bir danışmanlık şirketi', pozisyon: 'Kıdemli danışman',
    hakkinda: 'Sabah teniscisi, akşam sergi gezgini.',
    davetEden: 'ayse', tanidiklar: ['ayse', 'burcu', 'deniz', 'can'], mezuniyet: 2014,
  },
  {
    id: 'mert', ad: 'Mert', soyadHarf: 'K', sehir: 'İstanbul', semt: 'Beşiktaş',
    ilgiler: ['teknoloji', 'kosu', 'girisim', 'kahve'], muzik: ['rock'],
    sirket: 'Bir fintek girişimi', pozisyon: 'Kurucu ortak',
    hakkinda: 'Pazar sabahları Caddebostan sahilinde koşuyorum.',
    davetEden: 'ayse', tanidiklar: ['ayse', 'baris', 'can', 'emre'], mezuniyet: 2011,
  },
  {
    id: 'burcu', ad: 'Burcu', soyadHarf: 'A', sehir: 'İstanbul', semt: 'Ataşehir',
    ilgiler: ['sergi', 'fotograf', 'seyahat', 'sinema'], muzik: ['caz'],
    sirket: 'Bir banka', pozisyon: 'Pazarlama müdürü',
    tanidiklar: ['ayse', 'selin', 'elif'], mezuniyet: 2010,
  },
  {
    id: 'baris', ad: 'Barış', soyadHarf: 'T', sehir: 'İstanbul', semt: 'Ataşehir',
    ilgiler: ['tenis', 'seyahat', 'padel', 'sarap'], muzik: ['pop'],
    sirket: 'Bir lojistik şirketi', pozisyon: 'Operasyon direktörü',
    davetEden: 'mert', tanidiklar: ['mert', 'ayse', 'can'], mezuniyet: 2009,
  },
  {
    id: 'elif', ad: 'Elif', soyadHarf: 'S', sehir: 'İstanbul', semt: 'Üsküdar',
    ilgiler: ['kitap', 'seyahat', 'yemek', 'sergi'], muzik: ['klasik'],
    sirket: 'Bir yayınevi', pozisyon: 'Editör',
    hakkinda: 'Ayda bir kitap, yılda bir uzun yol.',
    davetEden: 'burcu', tanidiklar: ['burcu', 'deniz'], mezuniyet: 2015,
  },
  {
    id: 'can', ad: 'Can', soyadHarf: 'Y', sehir: 'İstanbul', semt: 'Sarıyer',
    ilgiler: ['doga', 'yelken', 'fotograf', 'kosu'], muzik: ['indie'],
    sirket: 'Bir enerji şirketi', pozisyon: 'Proje mühendisi',
    tanidiklar: ['selin', 'mert', 'baris'], mezuniyet: 2013,
  },
  {
    id: 'deniz', ad: 'Deniz', soyadHarf: 'Ö', sehir: 'İstanbul', semt: 'Kadıköy',
    ilgiler: ['yoga', 'kitap', 'kahve', 'cocuklu'], muzik: ['caz'],
    sirket: 'Bir ilaç şirketi', pozisyon: 'İK iş ortağı',
    tanidiklar: ['ayse', 'selin', 'elif'], mezuniyet: 2008,
  },
  {
    id: 'emre', ad: 'Emre', soyadHarf: 'B', sehir: 'İstanbul', semt: 'Maslak',
    ilgiler: ['teknoloji', 'padel', 'sarap', 'yemek'], muzik: ['elektronik'],
    sirket: 'Bir e-ticaret şirketi', pozisyon: 'Mühendislik müdürü',
    tanidiklar: ['mert'], mezuniyet: 2012,
  },
  {
    id: 'zeynep', ad: 'Zeynep', soyadHarf: 'E', sehir: 'İzmir', semt: 'Alsancak',
    ilgiler: ['yelken', 'yemek', 'sarap', 'seyahat'], muzik: ['caz'],
    sirket: 'Bir turizm şirketi', pozisyon: 'Genel müdür yardımcısı',
    tanidiklar: ['can'], mezuniyet: 2007,
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
  gorsel: number;
  aciklama: string;
  ayinEtkinligi?: boolean;
};

/** Ekibin koydugu hazir planlar (strateji: "plani biz koyuyoruz") */
export const PLANLAR: Plan[] = [
  {
    id: 'sergi-turu', baslik: 'Rehberli sergi turu', tur: 'Küçük plan',
    gun: 'Cumartesi', saat: '11.00', semt: 'Tophane', mekan: 'İstanbul Modern',
    kontenjan: 12, katilan: ['selin', 'burcu', 'ayse'], ilgiler: ['sergi', 'fotograf'],
    gorsel: require('@/assets/images/etkinlik/beyoglu-yeniden.webp'),
    aciklama: 'Bir küratör eşliğinde yeni sergiyi geziyoruz, sonra kahveye oturuyoruz.',
  },
  {
    id: 'pazar-kosusu', baslik: 'Pazar sabahı koşusu', tur: 'Küçük plan',
    gun: 'Pazar', saat: '08.30', semt: 'Caddebostan', mekan: 'Sahil yolu',
    kontenjan: 15, katilan: ['mert', 'can'], ilgiler: ['kosu', 'doga'],
    gorsel: require('@/assets/images/etkinlik/balik-halinde-sabah.webp'),
    aciklama: '5 km rahat tempo. Her seviyeye uygun; bitişte kahvaltı.',
  },
  {
    id: 'sarap-tadimi', baslik: 'Butik şarap tadımı', tur: 'Küçük plan',
    gun: 'Cuma', saat: '19.30', semt: 'Karaköy', mekan: 'Bir butik şaraphane',
    kontenjan: 10, katilan: ['baris', 'emre', 'zeynep'], ilgiler: ['sarap', 'yemek'],
    gorsel: require('@/assets/images/etkinlik/cem-sakarya-ile-viski.webp'),
    aciklama: 'Ege üreticilerinden altı şarap, eşleşen küçük tabaklar.',
  },
  {
    id: 'kitap-kulubu', baslik: 'Kitap kulübü: ayın kitabı', tur: 'Kulüp buluşması',
    gun: 'Salı', saat: '19.30', semt: 'Moda', mekan: 'Bir sahaf kafe',
    kontenjan: 8, katilan: ['elif', 'deniz', 'ayse'], ilgiler: ['kitap'],
    gorsel: require('@/assets/images/etkinlik/sinop-hafta-sonu.webp'),
    aciklama: 'Bu ay bir roman konuşuyoruz. Okumadıysan da gel, dinle.',
  },
  {
    id: 'soylesi', baslik: 'Söyleşi: İkinci kariyer', tur: 'Küçük plan',
    gun: 'Perşembe', saat: '19.00', semt: 'Levent', mekan: 'Bir ortak çalışma alanı',
    kontenjan: 40, katilan: ['mert', 'emre', 'burcu', 'deniz'], ilgiler: ['girisim', 'teknoloji'],
    gorsel: require('@/assets/images/etkinlik/veliefendi-strateji-dersi.webp'),
    aciklama: 'Kurumsal hayattan girişime geçen üç konukla sohbet.',
  },
  {
    id: 'yelken', baslik: 'Gün batımında yelken', tur: 'Küçük plan',
    gun: 'Cumartesi', saat: '17.00', semt: 'Kuruçeşme', mekan: 'Marina',
    kontenjan: 8, katilan: ['can', 'zeynep'], ilgiler: ['yelken', 'doga'],
    gorsel: require('@/assets/images/etkinlik/puglia-event.webp'),
    aciklama: 'Boğaz’da iki saatlik tekne turu. Deneyim gerekmez.',
  },
  {
    id: 'caz-gecesi', baslik: 'Caz gecesi', tur: 'Küçük plan',
    gun: 'Perşembe', saat: '21.00', semt: 'Beyoğlu', mekan: 'Bir caz kulübü',
    kontenjan: 20, katilan: ['ayse', 'selin', 'deniz'], ilgiler: ['caz', 'sinema'],
    gorsel: require('@/assets/images/etkinlik/pub-walk.webp'),
    aciklama: 'Canlı kuartet, ayrılmış masalar.',
  },
  {
    id: 'acilis-bulusmasi', baslik: 'ExCom Plus açılış buluşması', tur: 'Büyük etkinlik',
    gun: '20 Mart', saat: '20.00', semt: 'Bebek', mekan: 'Sürpriz mekân',
    kontenjan: 200, katilan: ['ayse', 'mert', 'selin', 'burcu', 'baris', 'elif', 'can', 'emre'],
    ilgiler: [], gorsel: require('@/assets/images/etkinlik/whisky-event.webp'),
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
};

/** Kulupler: ayni ilgiyi secenler esige ulasinca kulup ve sohbeti acilir */
export const KULUPLER: Kulup[] = [
  { id: 'tenis', ad: 'Tenis Kulübü', ilgi: 'tenis', uyeler: ['selin', 'baris'], esik: 10, aciklama: 'Hafta içi iş çıkışı ve hafta sonu sabah maçları.' },
  { id: 'sergi', ad: 'Sergi Gezenler', ilgi: 'sergi', uyeler: ['ayse', 'selin', 'burcu', 'elif', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10'], esik: 10, aciklama: 'Ayda iki sergi, sonrasında sohbet.' },
  { id: 'kitap', ad: 'Kitap Kulübü', ilgi: 'kitap', uyeler: ['elif', 'deniz', 'ayse', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9'], esik: 10, aciklama: 'Ayın kitabı, ayda bir buluşma.' },
  { id: 'kosu', ad: 'Koşu Grubu', ilgi: 'kosu', uyeler: ['mert', 'can', 'c1', 'c2', 'c3', 'c4'], esik: 10, aciklama: 'Pazar sabahları sahilde.' },
  { id: 'padel', ad: 'Padel Ekibi', ilgi: 'padel', uyeler: ['baris', 'emre', 'd1'], esik: 8, aciklama: 'Dörtlü maçlar, seviye fark etmez.' },
  { id: 'yemek', ad: 'Şefin Masası', ilgi: 'yemek', uyeler: ['elif', 'emre', 'zeynep', 'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8'], esik: 10, aciklama: 'Ayda bir şefin masasında akşam yemeği.' },
  { id: 'fotograf', ad: 'Foto Yürüyüşü', ilgi: 'fotograf', uyeler: ['selin', 'burcu', 'can', 'f1', 'f2'], esik: 10, aciklama: 'Şehirde fotoğraf yürüyüşleri.' },
  { id: 'teknoloji', ad: 'Teknoloji Sohbetleri', ilgi: 'teknoloji', uyeler: ['mert', 'emre', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g11'], esik: 10, aciklama: 'Ayda bir konu, bir konuşmacı.' },
];

export const kulupBul = (id: string) => KULUPLER.find((k) => k.id === id);

export type Mesaj = { kimden: 'ben' | string; metin: string; saat: string };
export type Sohbet = { id: string; tur: 'kisi' | 'kulup'; hedef: string; mesajlar: Mesaj[] };

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
      { kimden: 'selin', metin: 'Ben varım! 11’de girişte buluşalım.', saat: 'Dün' },
    ],
  },
];
