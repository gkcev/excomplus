/**
 * Ornek kisilerin profil fotograflari (prototip).
 * AI ile uretildi; gercek kisiler degil. Gercek veritabani gelince kaldirilacak.
 */
export const KISI_FOTOLARI: Record<string, number> = {
  ayse: require('@/assets/images/kisiler/ayse.jpg'),
  selin: require('@/assets/images/kisiler/selin.jpg'),
  mert: require('@/assets/images/kisiler/mert.jpg'),
  burcu: require('@/assets/images/kisiler/burcu.jpg'),
  baris: require('@/assets/images/kisiler/baris.jpg'),
  elif: require('@/assets/images/kisiler/elif.jpg'),
  can: require('@/assets/images/kisiler/can.jpg'),
  deniz: require('@/assets/images/kisiler/deniz.jpg'),
  emre: require('@/assets/images/kisiler/emre.jpg'),
  zeynep: require('@/assets/images/kisiler/zeynep.jpg'),
};

/**
 * Ornek kisilerin profil galerisi (prototip): ilk uc ilgi alaninin fotografi.
 * Gercekte her uye kendi fotograflarini ekler (en fazla 6).
 */
export const kisiGalerisi = (ilgiler: string[]) => ilgiler.slice(0, 3).map((i) => ILGI_GORSELLERI[i]).filter(Boolean);

/**
 * Ilgi alani fotograflari: kulup ve kulup onerisi gorseli buradan gelir (emoji yerine).
 * Bazilari ayni konudaki etkinlik fotografini kullanir.
 */
export const ILGI_GORSELLERI: Record<string, number> = {
  tenis: require('@/assets/images/kulupler/tenis.jpg'),
  padel: require('@/assets/images/kulupler/padel.jpg'),
  kosu: require('@/assets/images/etkinlik/pazar-kosusu.jpg'),
  yoga: require('@/assets/images/kulupler/yoga.jpg'),
  doga: require('@/assets/images/kulupler/doga.jpg'),
  yelken: require('@/assets/images/etkinlik/yelken.jpg'),
  sergi: require('@/assets/images/etkinlik/sergi-turu.jpg'),
  kitap: require('@/assets/images/etkinlik/kitap-kulubu.jpg'),
  caz: require('@/assets/images/etkinlik/caz-gecesi.jpg'),
  sinema: require('@/assets/images/kulupler/sinema.jpg'),
  fotograf: require('@/assets/images/kulupler/fotograf.jpg'),
  yemek: require('@/assets/images/kulupler/yemek.jpg'),
  sarap: require('@/assets/images/etkinlik/sarap-tadimi.jpg'),
  kahve: require('@/assets/images/kulupler/kahve.jpg'),
  seyahat: require('@/assets/images/kulupler/seyahat.jpg'),
  teknoloji: require('@/assets/images/kulupler/teknoloji.jpg'),
  girisim: require('@/assets/images/kulupler/girisim.jpg'),
  cocuklu: require('@/assets/images/kulupler/cocuklu.jpg'),
};
