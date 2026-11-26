/**
 * PROTOTIP OTURUMU
 * Uyenin bilgileri, katildigi planlar, kulupler, baglantilar ve mesajlar.
 * Cihazda saklanir (AsyncStorage); gercek veritabani gelince bunun yerine gececek.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { ilgiCevir } from '@/data/ilgi-alanlari';
import { tarzCevir, type ProfilSarkisi } from '@/data/muzik';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { Ben } from '@/data/eslestirme';
import { kisiBul, KULUPLER, PLANLAR, SOHBETLER, type KulupFikri, type Plan, type Sohbet } from '@/data/ornek';

export type Uye = Ben & {
  pozisyon?: string;
  sirket?: string;
  hakkinda?: string;
  linkedin?: string;
  universite?: string;
  bolum?: string;
  uzmanliklar?: string[];
  sanatcilar?: string[];
  /** Profil galerisi: en fazla 6 fotograf (prototipte cihazda, data URI) */
  fotolar?: string[];
  /** Profil sarkisi (Spotify; ad ve kapak oEmbed'den) */
  sarki?: ProfilSarkisi;
  /** Dogum gunu: yalnizca gun ve ay ("03-14"); yil sorulmaz, yas gosterilmez */
  dogumGunu?: string;
  lise?: string;
  /** Mezuniyet yillari: yalnizca arka planda (+-8 yil yakinlik), profilde gorunmez */
  liseYil?: string;
  /** Onceki isyerleri (kariyer niyeti) */
  eskiSirketler?: string[];
  /** Profil fotografi (zorunlu). Prototipte cihazda data URI olarak saklanir. */
  foto?: string;
};

type Durum = {
  /** Davet kodu dogrulandi mi (davet eden kisi id) */
  davetEden?: string;
  /** Profil doldurma bitti mi */
  uye?: Uye;
  katildigimPlanlar: string[];
  kuluplerim: string[];
  /** Baglanti istegi gonderilen / kabul edilen kisiler */
  baglantilar: string[];
  sohbetler: Sohbet[];
  /** Kalan davet hakki (baslangicta 1) */
  davetHakki: number;
  /** Uretilen davet kodum */
  davetKodum: string;
  /** Benim onerdigim kulupler */
  fikirlerim: KulupFikri[];
  /** "Ben de varim" dedigim kulup onerileri */
  destekledigimFikirler: string[];
  /** Engelledigim kisiler: mesaj ve baglanti kapali, onerilerde cikmaz */
  engellediklerim: string[];
  /** Ev sahibi oldugum kulupler */
  evSahibiKuluplerim: string[];
  /** Ev sahibi olarak koydugum kulup bulusmalari */
  kulupPlanlari: Plan[];
};

const BASLANGIC: Durum = {
  katildigimPlanlar: [],
  kuluplerim: [],
  baglantilar: [],
  sohbetler: SOHBETLER,
  davetHakki: 1,
  fikirlerim: [],
  destekledigimFikirler: [],
  evSahibiKuluplerim: [],
  engellediklerim: [],
  kulupPlanlari: [],
  davetKodum: '',
};

const ANAHTAR = 'excomplus-prototip-v1';

type Baglam = Durum & {
  hazir: boolean;
  davetKoduKabul: (davetEden: string) => void;
  profiliKaydet: (u: Uye) => void;
  fotoDegistir: (foto: string) => void;
  /** Profili duzenle: verilen alanlar guncellenir */
  profiliGuncelle: (degisiklik: Partial<Uye>) => void;
  engelle: (kisiId: string) => void;
  planaKatil: (id: string) => void;
  kulubeKatil: (id: string) => void;
  baglan: (kisiId: string) => void;
  mesajGonder: (sohbetId: string, metin: string, hedef?: { tur: 'kisi' | 'kulup'; id: string }, ek?: string) => void;
  /** Sohbeti actim: tum mesajlar okundu */
  okunduIsaretle: (sohbetId: string) => void;
  /** Mesaja tepki; ayni emoji tekrar secilirse kalkar */
  mesajTepki: (sohbetId: string, sira: number, emoji: string) => void;
  /** Yalnizca kendi mesajim silinir */
  mesajSil: (sohbetId: string, sira: number) => void;
  /** Sohbet yalnizca benim listemden kalkar */
  sohbetSil: (sohbetId: string) => void;
  davetiKullan: () => void;
  /** Kulup oner; yeni fikrin id'sini dondurur */
  kulupOner: (f: Omit<KulupFikri, 'id' | 'oneren' | 'destekciler'>) => string;
  fikriDestekle: (id: string) => void;
  /** Ekip planlari + kulup bulusmalari */
  planlar: Plan[];
  planiBul: (id: string) => Plan | undefined;
  evSahibiOl: (kulupId: string) => void;
  /** Kulup bulusmasi koy; yeni planin id'sini dondurur. Kulup sohbetine de duser. */
  bulusmaKoy: (p: Omit<Plan, 'id' | 'katilan' | 'evSahibi'>) => string;
  cikis: () => void;
};

const OturumBaglami = createContext<Baglam | null>(null);

function rastgeleKod() {
  const h = 'ABCDEFGHJKLMNPRSTUVYZ23456789';
  return Array.from({ length: 6 }, () => h[Math.floor(Math.random() * h.length)]).join('');
}

function saatSimdi() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function OturumSaglayici({ children }: { children: ReactNode }) {
  const [durum, setDurum] = useState<Durum>(BASLANGIC);
  const [hazir, setHazir] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(ANAHTAR)
      .then((v) => {
        if (!v) return;
        const kayit = { ...BASLANGIC, ...JSON.parse(v) } as Durum;
        // Eski ilgi / tarz kimlikleri ExCom kataloguna cevrilir (26 Kasim 2026)
        if (kayit.uye) kayit.uye = { ...kayit.uye, ilgiler: ilgiCevir(kayit.uye.ilgiler), muzik: tarzCevir(kayit.uye.muzik) };
        setDurum(kayit);
      })
      .catch(() => {})
      .finally(() => setHazir(true));
  }, []);

  useEffect(() => {
    if (hazir) AsyncStorage.setItem(ANAHTAR, JSON.stringify(durum)).catch(() => {});
  }, [durum, hazir]);

  const deger = useMemo<Baglam>(() => {
    const guncelle = (f: (d: Durum) => Durum) => setDurum(f);
    const ekleCikar = (liste: string[], id: string) =>
      liste.includes(id) ? liste.filter((x) => x !== id) : [...liste, id];

    return {
      ...durum,
      hazir,
      davetKoduKabul: (davetEden) => guncelle((d) => ({ ...d, davetEden })),
      profiliKaydet: (u) =>
        guncelle((d) => {
          // Davet edenin tanidiklari uyenin de ilk tanidiklari sayilir (ortak tanidik hesabi)
          const davetci = d.davetEden ? kisiBul(d.davetEden) : undefined;
          const tanidiklar = davetci ? [davetci.id, ...davetci.tanidiklar.slice(0, 2)] : [];
          return {
            ...d,
            uye: { ...u, davetEden: d.davetEden, tanidiklar },
            baglantilar: davetci ? [davetci.id] : [],
            // Ilgi secmek = o kulubun bekleme listesine girmek (ayrica bir sey yapmasi gerekmez)
            kuluplerim: KULUPLER.filter((k) => u.ilgiler.includes(k.ilgi)).map((k) => k.id),
            davetKodum: d.davetKodum || rastgeleKod(),
          };
        }),
      profiliGuncelle: (degisiklik) => guncelle((d) => (d.uye ? { ...d, uye: { ...d.uye, ...degisiklik } } : d)),
      engelle: (kisiId) => guncelle((d) => ({ ...d, engellediklerim: ekleCikar(d.engellediklerim, kisiId), baglantilar: d.baglantilar.filter((x) => x !== kisiId) })),
      fotoDegistir: (foto) => guncelle((d) => (d.uye ? { ...d, uye: { ...d.uye, foto } } : d)),
      planaKatil: (id) => guncelle((d) => ({ ...d, katildigimPlanlar: ekleCikar(d.katildigimPlanlar, id) })),
      kulubeKatil: (id) => guncelle((d) => ({ ...d, kuluplerim: ekleCikar(d.kuluplerim, id) })),
      baglan: (kisiId) =>
        guncelle((d) => ({
          ...d,
          baglantilar: d.baglantilar.includes(kisiId) ? d.baglantilar : [...d.baglantilar, kisiId],
        })),
      mesajGonder: (sohbetId, metin, hedef, ek) =>
        guncelle((d) => {
          const yeni = { kimden: 'ben', metin, saat: saatSimdi(), ...(ek ? { ek } : {}) };
          const var_ = d.sohbetler.find((s) => s.id === sohbetId);
          const sohbetler = var_
            ? d.sohbetler.map((s) => (s.id === sohbetId ? { ...s, mesajlar: [...s.mesajlar, yeni] } : s))
            : [{ id: sohbetId, tur: hedef?.tur ?? 'kisi', hedef: hedef?.id ?? sohbetId, mesajlar: [yeni] }, ...d.sohbetler];
          return { ...d, sohbetler };
        }),
      okunduIsaretle: (sohbetId) =>
        guncelle((d) => {
          const s = d.sohbetler.find((x) => x.id === sohbetId);
          if (!s || (s.okunan ?? 0) >= s.mesajlar.length) return d;
          return { ...d, sohbetler: d.sohbetler.map((x) => (x.id === sohbetId ? { ...x, okunan: x.mesajlar.length } : x)) };
        }),
      mesajTepki: (sohbetId, sira, emoji) =>
        guncelle((d) => ({
          ...d,
          sohbetler: d.sohbetler.map((s) =>
            s.id !== sohbetId ? s : { ...s, mesajlar: s.mesajlar.map((m, i) => (i === sira ? { ...m, tepki: m.tepki === emoji ? undefined : emoji } : m)) }
          ),
        })),
      mesajSil: (sohbetId, sira) =>
        guncelle((d) => ({
          ...d,
          sohbetler: d.sohbetler.map((s) => {
            if (s.id !== sohbetId || s.mesajlar[sira]?.kimden !== 'ben') return s;
            const okunan = (s.okunan ?? 0) > sira ? (s.okunan ?? 0) - 1 : s.okunan;
            return { ...s, mesajlar: s.mesajlar.filter((_, i) => i !== sira), okunan };
          }),
        })),
      sohbetSil: (sohbetId) => guncelle((d) => ({ ...d, sohbetler: d.sohbetler.filter((s) => s.id !== sohbetId) })),
      davetiKullan: () => guncelle((d) => ({ ...d, davetHakki: Math.max(0, d.davetHakki - 1) })),
      kulupOner: (f) => {
        const id = `fikir-ben-${Date.now().toString(36)}`;
        guncelle((d) => ({ ...d, fikirlerim: [{ ...f, id, oneren: 'ben', destekciler: [] }, ...d.fikirlerim] }));
        return id;
      },
      planlar: [...durum.kulupPlanlari, ...PLANLAR],
      planiBul: (id) => durum.kulupPlanlari.find((p) => p.id === id) ?? PLANLAR.find((p) => p.id === id),
      evSahibiOl: (kulupId) => guncelle((d) => ({ ...d, evSahibiKuluplerim: ekleCikar(d.evSahibiKuluplerim, kulupId) })),
      bulusmaKoy: (p) => {
        const id = `bulusma-${Date.now().toString(36)}`;
        guncelle((d) => {
          const sohbetId = `kulup-${p.kulup}`;
          const mesaj = { kimden: 'ben', metin: `Yeni buluşma koydum: ${p.baslik}. Gelmek isteyen katılsın!`, saat: saatSimdi(), plan: id };
          const var_ = d.sohbetler.find((s) => s.id === sohbetId);
          const sohbetler = var_
            ? d.sohbetler.map((s) => (s.id === sohbetId ? { ...s, mesajlar: [...s.mesajlar, mesaj] } : s))
            : [{ id: sohbetId, tur: 'kulup' as const, hedef: p.kulup!, mesajlar: [mesaj] }, ...d.sohbetler];
          return {
            ...d,
            kulupPlanlari: [{ ...p, id, katilan: [], evSahibi: 'ben' }, ...d.kulupPlanlari],
            katildigimPlanlar: [...d.katildigimPlanlar, id],
            sohbetler,
          };
        });
        return id;
      },
      fikriDestekle: (id) => guncelle((d) => ({ ...d, destekledigimFikirler: ekleCikar(d.destekledigimFikirler, id) })),
      cikis: () => setDurum(BASLANGIC),
    };
  }, [durum, hazir]);

  return <OturumBaglami.Provider value={deger}>{children}</OturumBaglami.Provider>;
}

export function useOturum() {
  const b = useContext(OturumBaglami);
  if (!b) throw new Error('useOturum, OturumSaglayici icinde kullanilmali');
  return b;
}
