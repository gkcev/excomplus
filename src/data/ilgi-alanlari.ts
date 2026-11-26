import { aramaIcinSade } from '@/components/search-box';
import { ILGI_KATEGORI_LISTESI, ILGI_LISTESI } from '@/data/kataloglar';

/**
 * HOBILER VE ILGI ALANLARI (ExCom'dan)
 * Uzmanlik etiketlerinden AYRI: "ne is biliyorsun" degil, "neyi seviyorsun".
 * Katalog 7 kategori, 173 secenek (ExCom'un 172'si + Plus'a ozel "Cocuklu aile").
 * Prototipte koda gomulu (data/kataloglar.ts).
 */

/** Plus: kayitta en az 3 ilgi zorunlu; ExCom'da 5 "onerilen"di */
export const ONERILEN_ILGI = 3;

export type IlgiKategori = { id: string; ad: string };
export type IlgiAlani = {
  id: string;
  kategoriId: string;
  ad: string;
  populer: boolean;
  /** Arama icin Turkce harfsiz kucuk yazilis */
  anahtar: string;
};
export type IlgiKatalogu = {
  kategoriler: IlgiKategori[];
  alanlar: IlgiAlani[];
  /** id -> alan */
  bul: Map<string, IlgiAlani>;
};

/**
 * Populer: ExCom'da secim sayisindan hesaplaniyor. Prototipte elle;
 * tohum kulupler de bunlardan aciliyor.
 */
export const POPULER_ILGILER = [
  'tenis', 'padel', 'kosu', 'yoga', 'doga-yuruyusu', 'kitap',
  'sinema', 'muze-ve-sergi', 'konser', 'gastronomi', 'kahve', 'seyahat',
];

export function katalogKur(
  kategoriler: [string, string][],
  liste: [string, string, string][],
  populer: string[]
): IlgiKatalogu {
  const alanlar = liste.map(([id, kategoriId, ad]) => ({ id, kategoriId, ad, populer: populer.includes(id), anahtar: aramaIcinSade(ad) }));
  return {
    kategoriler: kategoriler.map(([id, ad]) => ({ id, ad })),
    alanlar,
    bul: new Map(alanlar.map((a) => [a.id, a])),
  };
}

export const ILGI_KATALOGU = katalogKur(ILGI_KATEGORI_LISTESI, ILGI_LISTESI, POPULER_ILGILER);

/**
 * Plus'in ilk 18 ilgisinden ExCom kataloguna gecis: eski kayitlar
 * (cihazda saklanan profil) bu eslemeyle cevrilir. Ayni kalanlar yazilmadi.
 */
export const ESKI_ILGI: Record<string, string> = {
  doga: 'doga-yuruyusu',
  sergi: 'muze-ve-sergi',
  yemek: 'gastronomi',
  teknoloji: 'teknoloji-urunleri',
  girisim: 'girisimcilik',
};
export const ilgiCevir = (liste: string[]) => [...new Set(liste.map((i) => ESKI_ILGI[i] ?? i))];

/**
 * "Aradigini bulamadin mi? Oner": ExCom'da ekip onayina gider.
 * Prototipte yalnizca alindi bilgisi.
 */
export async function ilgiAlaniOner(ad: string, _kategoriId: string | null): Promise<string | null> {
  if (ad.trim().length < 2) return 'Biraz daha uzun yaz.';
  return null;
}
