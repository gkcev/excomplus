import { KISILER } from '@/data/ornek';
import { katalogKur } from '@/data/ilgi-alanlari';
import { MUZIK_KATEGORI_LISTESI, MUZIK_LISTESI } from '@/data/kataloglar';

/**
 * MUZIK ZEVKI (ExCom'dan): profil sarkisi, tarzlar (katalogdan) ve sanatcilar.
 * Plus'ta eslestirmede ortak ilgi sayilir (ayni sanatciyi sevenler: konser).
 */
export const EN_COK_TARZ = 6;
export const EN_COK_SANATCI = 5;

export type ProfilSarkisi = { spotifyId: string; baslik: string; kapak: string };
export type MuzikZevki = { tarzlar: string[]; sanatcilar: string[]; sarki: ProfilSarkisi | null };

/** Tarz katalogu; secim penceresi ilgi alanlariyla ayni (ExCom gibi) */
export const MUZIK_KATALOGU = katalogKur(
  MUZIK_KATEGORI_LISTESI,
  MUZIK_LISTESI.map(([id, ad, kategori]) => [id, kategori, ad]),
  ['turkce-pop', 'yabanci-pop', 'turkce-rock', 'alternatif-rock-indie', 'jazz', 'house', 'turkce-rap', 'klasik-muzik', 'r-b-soul', 'anadolu-rock', 'techno', 'dunya-muzigi-etnik']
);

export const tarzAdi = (id: string) => MUZIK_KATALOGU.bul.get(id)?.ad ?? id;

/** Plus'in ilk 6 tarzindan katalog kimligine gecis */
export const ESKI_TARZ: Record<string, string> = {
  caz: 'jazz',
  rock: 'turkce-rock',
  pop: 'turkce-pop',
  indie: 'alternatif-rock-indie',
  klasik: 'klasik-muzik',
  elektronik: 'house',
};
export const tarzCevir = (liste: string[]) => [...new Set(liste.map((t) => ESKI_TARZ[t] ?? t))];

export async function muzikTarziOner(ad: string, _kategoriId: string | null): Promise<string | null> {
  if (ad.trim().length < 2) return 'Biraz daha uzun yaz.';
  return null;
}

/** Sanatci onerileri: uyelerin yazdiklari, en cok yazilan once (prototipte ornek kisilerden) */
const SANATCI_ONERILERI = (() => {
  const sayac = new Map<string, number>();
  for (const k of KISILER) for (const s of k.sanatcilar ?? []) sayac.set(s, (sayac.get(s) ?? 0) + 1);
  return [...sayac.entries()].map(([ad, kisi]) => ({ ad, kisi })).sort((a, b) => b.kisi - a.kisi);
})();
export const useSanatciOnerileri = () => SANATCI_ONERILERI;

/* ---------------- Spotify baglantisi ---------------- */

/** https://open.spotify.com/track/ID?si=..., .../intl-tr/track/ID, spotify:track:ID */
export function spotifySarkiKimligi(metin: string): string | null {
  const bulunan =
    metin.match(/open\.spotify\.com\/(?:intl-[a-z-]+\/)?track\/([A-Za-z0-9]{22})/) ??
    metin.match(/spotify:track:([A-Za-z0-9]{22})/);
  return bulunan ? bulunan[1] : null;
}

/** Sarki adi ve kapak: Spotify'in herkese acik oEmbed adresi (anahtar gerekmez) */
export async function spotifySarkiBilgisi(spotifyId: string): Promise<ProfilSarkisi | null> {
  try {
    const yanit = await fetch(
      `https://open.spotify.com/oembed?url=${encodeURIComponent(`https://open.spotify.com/track/${spotifyId}`)}`
    );
    if (!yanit.ok) return null;
    const veri = (await yanit.json()) as { title?: string; thumbnail_url?: string };
    return { spotifyId, baslik: veri.title ?? '', kapak: veri.thumbnail_url ?? '' };
  } catch {
    return null;
  }
}
