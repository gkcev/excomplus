/**
 * ExCom Plus tasarim sistemi.
 * Renkler ExCom'dan aynen alindi (renkler.ts); olculer ExCom rehberiyle ayni.
 */

export { AVATAR_PASTELLERI, Colors, Durum, Marka, Pastel } from '@/constants/renkler';

/** Kart ici 16, kartlar arasi 12, bolumler arasi 24, ekran kenari 16 */
export const Bosluk = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const Kose = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  hap: 999,
} as const;

/** Tek yazi ailesi Outfit; kalinliga gore dosya secilir (bkz. components/metin.tsx) */
export const Yazi = {
  ekranBasligi: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
  bolumBasligi: { fontSize: 19, fontWeight: '700' as const, lineHeight: 24 },
  kartBasligi: { fontSize: 17, fontWeight: '700' as const, lineHeight: 22 },
  isim: { fontSize: 15, fontWeight: '600' as const, lineHeight: 20 },
  govde: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  ikincil: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  etiket: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16 },
} as const;

/** Tek yumusak golge; kartta ya kenarlik ya golge */
export const kartGolgesi = {
  boxShadow: '0px 8px 22px -14px rgba(7, 24, 45, 0.25)',
} as const;

/** Genis ekranda (web) icerik telefon genisliginde ortalanir */
export const icerikOrtala = {
  width: '100%',
  maxWidth: 560,
  alignSelf: 'center',
} as const;

/*
  ExCom'dan aynen kopyalanan bilesenler (profil duzenleme seciciler) ExCom'un
  olcu adlarini kullaniyor; degerler ExCom'la ayni.
*/
export const Spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 16, xxl: 24, xxxl: 32 } as const;
export const Radius = { sm: 8, md: 12, lg: 16, xl: 20, blok: 28, pill: 999 } as const;
export const FontSize = { caption: 12, small: 13, body: 15, title: 17, heading: 20, display: 28, hero: 34 } as const;
