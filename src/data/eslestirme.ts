/**
 * ESLESTIRME: ORTAK NOKTALAR (strateji sunumu s.8 + 26 Kasim 2026 karari)
 * Arkadaslik ortak bir noktadan baslar. Kisi hangi ortak noktasini
 * eklediyse (okul, is, hobi, muzik, semt) oradan arkadas bulur.
 *  Okul      ayni universite 4, ayni lise 3     "Ikiniz de Bogazici Universitesi mezunusunuz"
 *  Is        ayni sirket (bugun ya da once) 4   "Ikiniz de Turkcell'de calistiniz"
 *            ortak uzmanlik her biri 2          "Ikiniz de urun yonetimi alanindasiniz"
 *  Hobi      ortak ilgi her biri 3              "Ikiniz de tenis ve kahve seviyorsunuz"
 *  Muzik     sanatci 2, tarz 1                  "Ikiniz de Duman dinliyorsunuz"
 *  Yakin     sehir 2, semt +2                   "Ikiniz de Kadikoy'de"
 *  Tanidik   ortak tanidik 1 (en fazla 5), davet zinciri 2
 *  Yas yakinligi +-8 yil 1                      GOSTERILMEZ
 * Kural: haftada 3 oneri, her onerinin ortak noktalari ekranda yazar.
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
  universite?: string;
  lise?: string;
  sirket?: string;
  eskiSirketler?: string[];
  uzmanliklar?: string[];
};

/** Ortak noktanin turu: ekranda simgesi buna gore */
export type OrtakNoktaTuru = 'okul' | 'is' | 'hobi' | 'muzik' | 'yakin' | 'tanidik';
export type OrtakNokta = { tur: OrtakNoktaTuru; metin: string; agirlik: number };

export type Oneri = {
  kisi: Kisi;
  puan: number;
  /** Ortak noktalar, en guclu once */
  ortakNoktalar: OrtakNokta[];
  /** Eski kullanim: yalnizca metinler (ortakNoktalar ile ayni sira) */
  nedenler: string[];
  ortakTanidik: string[];
};

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
  const noktalar: OrtakNokta[] = [];
  const ekle = (tur: OrtakNoktaTuru, metin: string, agirlik: number) => {
    puan += agirlik;
    noktalar.push({ tur, metin, agirlik });
  };
  const ayni = (a?: string, b?: string) => !!a && !!b && a.toLocaleLowerCase('tr') === b.toLocaleLowerCase('tr');

  // Okul
  if (ayni(ben.universite, k.universite)) ekle('okul', `İkiniz de ${k.universite} mezunusunuz`, 4);
  if (ayni(ben.lise, k.lise)) ekle('okul', `İkiniz de ${k.lise} mezunusunuz`, 3);

  // Is: bugunku ya da onceki sirketlerden biri ortak
  const sirketlerim = [ben.sirket, ...(ben.eskiSirketler ?? [])].filter((x): x is string => !!x && !x.startsWith('Bir '));
  const sirketleri = [k.sirket, ...(k.eskiSirketler ?? [])].filter((x): x is string => !!x && !x.startsWith('Bir '));
  const ortakSirket = sirketleri.find((x) => sirketlerim.some((y) => ayni(x, y)));
  if (ortakSirket) ekle('is', `İkiniz de ${bulunma(ortakSirket)} çalıştınız`, 4);
  const ortakUzmanlik = (k.uzmanliklar ?? []).filter((u) => (ben.uzmanliklar ?? []).some((x) => ayni(x, u)));
  if (ortakUzmanlik.length) {
    puan += (ortakUzmanlik.length - 1) * 2;
    ekle('is', `İkiniz de ${ortakUzmanlik[0].toLocaleLowerCase('tr')} alanındasınız`, 2);
  }

  // Hobi
  const ortakIlgi = k.ilgiler.filter((i) => ben.ilgiler.includes(i));
  if (ortakIlgi.length) {
    puan += (ortakIlgi.length - 1) * 3;
    ekle('hobi', `İkiniz de ${listeYaz(ortakIlgi.slice(0, 2).map((i) => ilgiAdi(i).toLocaleLowerCase('tr')))} seviyorsunuz`, 3);
  }

  // Muzik: ayni sanatci tarzdan guclu bir isaret (konser arkadasi)
  const ortakSanatci = (k.sanatcilar ?? []).filter((s) => (ben.sanatcilar ?? []).includes(s));
  const ortakMuzik = k.muzik.filter((m) => ben.muzik.includes(m));
  if (ortakSanatci.length) {
    puan += (ortakSanatci.length - 1) * 2 + ortakMuzik.length;
    ekle('muzik', `İkiniz de ${ortakSanatci[0]} dinliyorsunuz`, 2);
  } else if (ortakMuzik.length) {
    puan += ortakMuzik.length - 1;
    ekle('muzik', `İkiniz de ${tarzAdi(ortakMuzik[0])} dinliyorsunuz`, 1);
  }

  // Yakin
  if (k.sehir === ben.sehir) {
    puan += 2;
    if (k.semt === ben.semt) ekle('yakin', `İkiniz de ${bulunma(k.semt)}`, 2);
  }

  // Tanidik
  const ortakTanidik = k.tanidiklar.filter((t) => ben.tanidiklar.includes(t));
  puan += Math.min(ortakTanidik.length, 5);
  if (ortakTanidik.length >= 2) noktalar.push({ tur: 'tanidik', metin: `${ortakTanidik.length} ortak tanıdığınız var`, agirlik: Math.min(ortakTanidik.length, 5) });
  if (ben.davetEden && (k.tanidiklar.includes(ben.davetEden) || k.davetEden === ben.davetEden)) {
    const d = kisiBul(ben.davetEden);
    if (d) ekle('tanidik', `İkiniz de ${belirtme(d.ad)} tanıyorsunuz`, 2);
    else puan += 2;
  }

  // Yas yakinligi: puana eklenir, ekranda asla gosterilmez
  if (ben.mezuniyet && k.mezuniyet && Math.abs(ben.mezuniyet - k.mezuniyet) <= 8) puan += 1;

  const ortakNoktalar = [...noktalar].sort((a, b) => b.agirlik - a.agirlik);
  return { kisi: k, puan, ortakNoktalar, nedenler: ortakNoktalar.map((n) => n.metin), ortakTanidik };
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
