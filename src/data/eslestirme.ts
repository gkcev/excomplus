/**
 * ESLESTIRME (strateji sunumu, sayfa 8)
 *  Ortak ilgi alani   her biri 3   "Ikiniz de tenis ve sergi seviyorsunuz"
 *  Sehir ve semt      sehir 2, semt +2   "Ikiniz de Kadikoy'de"
 *  Ortak tanidik      her biri 1, en fazla 5   "4 ortak tanidiginiz var"
 *  Davet zinciri      ayni kisiyi taniyorsaniz 2   "Ikiniz de Ayse'yi taniyorsunuz"
 *  Muzik tarzi        her ortak 1   "Ikiniz de Jazz dinliyorsunuz"
 *  Sanatci            her ortak 2   "Ikiniz de Duman dinliyorsunuz" (ayni konsere gidebilirler)
 *  Yas yakinligi      +-8 yil ise 1   GOSTERILMEZ
 * Kural: haftada 3 oneri, her onerinin nedeni ekranda yazar.
 * Puanlar baslangic onerisi; ilk aylarin verisiyle ayarlanacak.
 */

import { tarzAdi } from '@/data/muzik';
import { ilgiAdi, KISILER, kisiBul, type Kisi, type Plan } from '@/data/ornek';

export type Ben = {
  ad: string;
  sehir: string;
  semt: string;
  ilgiler: string[];
  muzik: string[];
  sanatcilar?: string[];
  davetEden?: string;
  tanidiklar: string[];
  mezuniyet?: number;
};

export type Oneri = { kisi: Kisi; puan: number; nedenler: string[]; ortakTanidik: string[] };

const UNLULER = 'aıoueiöü';
function sonUnlu(s: string) {
  const k = s.toLocaleLowerCase('tr');
  for (let i = k.length - 1; i >= 0; i--) if (UNLULER.includes(k[i])) return k[i];
  return 'e';
}

/** Bulunma eki: Kadikoy -> Kadikoy'de, Besiktas -> Besiktas'ta */
export function bulunma(s: string) {
  const sert = 'fstkçşhp'.includes(s.toLocaleLowerCase('tr').slice(-1));
  const unlu = 'aıou'.includes(sonUnlu(s)) ? 'a' : 'e';
  return `${s}’${sert ? 't' : 'd'}${unlu}`;
}

/** Belirtme eki: Ayse -> Ayse'yi, Mert -> Mert'i */
export function belirtme(s: string) {
  const u = sonUnlu(s);
  const ek = 'aı'.includes(u) ? 'ı' : 'ei'.includes(u) ? 'i' : 'ou'.includes(u) ? 'u' : 'ü';
  const unluyleBiter = UNLULER.includes(s.toLocaleLowerCase('tr').slice(-1));
  return `${s}’${unluyleBiter ? 'y' : ''}${ek}`;
}

function listeYaz(adlar: string[]) {
  if (adlar.length <= 1) return adlar[0] ?? '';
  return `${adlar.slice(0, -1).join(', ')} ve ${adlar[adlar.length - 1]}`;
}

/** Turkce "-i seviyorsunuz" yerine yalin anlatim: "Ikiniz de tenis ve sergi seviyorsunuz" */
export function kisiPuani(ben: Ben, k: Kisi): Oneri {
  let puan = 0;
  const nedenler: string[] = [];

  const ortakIlgi = k.ilgiler.filter((i) => ben.ilgiler.includes(i));
  puan += ortakIlgi.length * 3;
  if (ortakIlgi.length) {
    nedenler.push(
      `İkiniz de ${listeYaz(ortakIlgi.slice(0, 2).map((i) => ilgiAdi(i).toLocaleLowerCase('tr')))} seviyorsunuz`
    );
  }

  if (k.sehir === ben.sehir) {
    puan += 2;
    if (k.semt === ben.semt) {
      puan += 2;
      nedenler.push(`İkiniz de ${bulunma(k.semt)}`);
    }
  }

  const ortakTanidik = k.tanidiklar.filter((t) => ben.tanidiklar.includes(t));
  puan += Math.min(ortakTanidik.length, 5);
  if (ortakTanidik.length >= 2) nedenler.push(`${ortakTanidik.length} ortak tanıdığınız var`);

  // Davet zinciri: beni davet eden kisiyi o da taniyor mu
  if (ben.davetEden && (k.tanidiklar.includes(ben.davetEden) || k.davetEden === ben.davetEden)) {
    puan += 2;
    const d = kisiBul(ben.davetEden);
    if (d) nedenler.push(`İkiniz de ${belirtme(d.ad)} tanıyorsunuz`);
  }

  // Muzik: ayni sanatci tarzdan guclu bir isaret (konser arkadasi)
  const ortakSanatci = (k.sanatcilar ?? []).filter((s) => (ben.sanatcilar ?? []).includes(s));
  const ortakMuzik = k.muzik.filter((m) => ben.muzik.includes(m));
  puan += ortakSanatci.length * 2 + ortakMuzik.length;
  if (ortakSanatci.length) nedenler.push(`İkiniz de ${ortakSanatci[0]} dinliyorsunuz`);
  else if (ortakMuzik.length) nedenler.push(`İkiniz de ${tarzAdi(ortakMuzik[0])} dinliyorsunuz`);

  // Yas yakinligi: puana eklenir, ekranda asla gosterilmez
  if (ben.mezuniyet && k.mezuniyet && Math.abs(ben.mezuniyet - k.mezuniyet) <= 8) puan += 1;

  return { kisi: k, puan, nedenler, ortakTanidik };
}

/** Haftanin onerileri: az ama iyi (varsayilan 3) */
export function kisiOnerileri(ben: Ben, adet = 3, haric: string[] = []): Oneri[] {
  return KISILER.filter((k) => !haric.includes(k.id))
    .map((k) => kisiPuani(ben, k))
    .filter((o) => o.puan > 0)
    .sort((a, b) => b.puan - a.puan)
    .slice(0, adet);
}

/** Plan icin oneri nedeni: ilgi uyumu + tanidik katilimci */
export function planNedeni(ben: Ben, p: Plan): string | null {
  const ortak = p.ilgiler.filter((i) => ben.ilgiler.includes(i));
  const tanidik = p.katilan.map(kisiBul).filter((k): k is Kisi => !!k && ben.tanidiklar.includes(k.id));
  if (tanidik.length) return `${tanidik[0].ad} de katılıyor`;
  if (ortak.length) return `${ilgiAdi(ortak[0])} sevdiğin için`;
  return null;
}

export function planPuani(ben: Ben, p: Plan) {
  const ortak = p.ilgiler.filter((i) => ben.ilgiler.includes(i)).length * 3;
  const tanidik = p.katilan.filter((k) => ben.tanidiklar.includes(k)).length;
  const semt = p.semt === ben.semt ? 2 : 0;
  return ortak + tanidik + semt;
}
