/**
 * ELCI ROZETI: DAVET HAKKI (26 Kasim 2026 karari)
 * Plus davetle buyur; guven zinciri bozulmasin diye davet hakki herkese
 * degil, uygulamada gercekten var olan uyeye acilir. Rozet kazanilinca
 * davet hakki gelir. Esikler ilk aylarin verisiyle ayarlanacak.
 */
export const ELCI_KURALLARI = {
  /** En az bu kadar gundur uye */
  gun: 90,
  /** En az bu kadar etkinlige katildi */
  etkinlik: 2,
  /** En az bu kadar kulupte */
  kulup: 1,
  /** En az bu kadar baglanti (tanisma) */
  baglanti: 3,
};

/** Rozet kazanilinca acilan davet hakki */
export const ELCI_DAVET_HAKKI = 1;

const GUN = 24 * 60 * 60 * 1000;

export type RozetAdimi = { ad: string; deger: number; hedef: number; tamam: boolean; birim: string };

export function elciDurumu(g: {
  uyelikTarihi?: string;
  katildigimPlanlar: string[];
  kuluplerim: string[];
  baglantilar: string[];
  simdi?: number;
}) {
  const simdi = g.simdi ?? Date.now();
  const gecenGun = g.uyelikTarihi ? Math.max(0, Math.floor((simdi - new Date(g.uyelikTarihi).getTime()) / GUN)) : 0;
  const adim = (ad: string, deger: number, hedef: number, birim: string): RozetAdimi => ({ ad, deger: Math.min(deger, hedef), hedef, tamam: deger >= hedef, birim });
  const adimlar = [
    adim('3 aydır Plus’tasın', gecenGun, ELCI_KURALLARI.gun, 'gün'),
    adim('Etkinliklere katıldın', g.katildigimPlanlar.length, ELCI_KURALLARI.etkinlik, 'etkinlik'),
    adim('Bir kulübe katıldın', g.kuluplerim.length, ELCI_KURALLARI.kulup, 'kulüp'),
    adim('İnsanlarla tanıştın', g.baglantilar.length, ELCI_KURALLARI.baglanti, 'bağlantı'),
  ];
  return { kazandi: adimlar.every((a) => a.tamam), adimlar, kalanGun: Math.max(0, ELCI_KURALLARI.gun - gecenGun) };
}
