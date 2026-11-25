/**
 * Takvim yardimcilari: etkinliklerin "gun" alanini gercek tarihe cevirir.
 * Prototipte "Cumartesi" gibi gun adlari bugunden itibaren o gunun ilk tarihi sayilir;
 * "20 Mart" gibi tarihler oldugu gibi okunur.
 */

export const GUN_ADLARI = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

const gunBasi = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());


/** Etkinligin "gun" alanindan tarih; anlasilmazsa undefined */
export function etkinlikTarihi(gun: string, bugun = new Date()): Date | undefined {
  const bas = gunBasi(bugun);
  const hafta = GUN_ADLARI.indexOf(gun);
  if (hafta >= 0) {
    const fark = (hafta - bas.getDay() + 7) % 7;
    return new Date(bas.getFullYear(), bas.getMonth(), bas.getDate() + fark);
  }
  const m = gun.match(/^(\d{1,2})\s+(\S+)$/);
  if (m) {
    const ay = AYLAR.indexOf(m[2]);
    if (ay < 0) return undefined;
    const t = new Date(bas.getFullYear(), ay, Number(m[1]));
    return t < bas ? new Date(bas.getFullYear() + 1, ay, Number(m[1])) : t;
  }
  return undefined;
}

export const ayniGun = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** "Cumartesi, 28 Kasım" */
export const uzunTarih = (d: Date) => `${GUN_ADLARI[d.getDay()]}, ${d.getDate()} ${AYLAR[d.getMonth()]}`;

export const ayAdi = (d: Date) => AYLAR[d.getMonth()];

/** Pazartesi ile baslayan haftalara bolunmus ay izgarasi; ay disindaki hucreler null */
export function ayIzgarasi(yil: number, ay: number): (Date | null)[] {
  const ilk = new Date(yil, ay, 1);
  const bosluk = (ilk.getDay() + 6) % 7; // Pazartesi = 0
  const gunSayisi = new Date(yil, ay + 1, 0).getDate();
  const hucreler: (Date | null)[] = Array.from({ length: bosluk }, () => null);
  for (let g = 1; g <= gunSayisi; g++) hucreler.push(new Date(yil, ay, g));
  while (hucreler.length % 7) hucreler.push(null);
  return hucreler;
}

export const HAFTA_BASLIK = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
