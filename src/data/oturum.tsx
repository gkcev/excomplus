/**
 * PROTOTIP OTURUMU
 * Uyenin bilgileri, katildigi planlar, kulupler, baglantilar ve mesajlar.
 * Cihazda saklanir (AsyncStorage); gercek veritabani gelince bunun yerine gececek.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { Ben } from '@/data/eslestirme';
import { kisiBul, SOHBETLER, type Sohbet } from '@/data/ornek';

export type Uye = Ben & {
  pozisyon?: string;
  sirket?: string;
  hakkinda?: string;
  linkedin?: string;
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
};

const BASLANGIC: Durum = {
  katildigimPlanlar: [],
  kuluplerim: [],
  baglantilar: [],
  sohbetler: SOHBETLER,
  davetHakki: 1,
  davetKodum: '',
};

const ANAHTAR = 'excomplus-prototip-v1';

type Baglam = Durum & {
  hazir: boolean;
  davetKoduKabul: (davetEden: string) => void;
  profiliKaydet: (u: Uye) => void;
  planaKatil: (id: string) => void;
  kulubeKatil: (id: string) => void;
  baglan: (kisiId: string) => void;
  mesajGonder: (sohbetId: string, metin: string, hedef?: { tur: 'kisi' | 'kulup'; id: string }) => void;
  davetiKullan: () => void;
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
        if (v) setDurum({ ...BASLANGIC, ...JSON.parse(v) });
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
            davetKodum: d.davetKodum || rastgeleKod(),
          };
        }),
      planaKatil: (id) => guncelle((d) => ({ ...d, katildigimPlanlar: ekleCikar(d.katildigimPlanlar, id) })),
      kulubeKatil: (id) => guncelle((d) => ({ ...d, kuluplerim: ekleCikar(d.kuluplerim, id) })),
      baglan: (kisiId) =>
        guncelle((d) => ({
          ...d,
          baglantilar: d.baglantilar.includes(kisiId) ? d.baglantilar : [...d.baglantilar, kisiId],
        })),
      mesajGonder: (sohbetId, metin, hedef) =>
        guncelle((d) => {
          const yeni = { kimden: 'ben', metin, saat: saatSimdi() };
          const var_ = d.sohbetler.find((s) => s.id === sohbetId);
          const sohbetler = var_
            ? d.sohbetler.map((s) => (s.id === sohbetId ? { ...s, mesajlar: [...s.mesajlar, yeni] } : s))
            : [{ id: sohbetId, tur: hedef?.tur ?? 'kisi', hedef: hedef?.id ?? sohbetId, mesajlar: [yeni] }, ...d.sohbetler];
          return { ...d, sohbetler };
        }),
      davetiKullan: () => guncelle((d) => ({ ...d, davetHakki: Math.max(0, d.davetHakki - 1) })),
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
