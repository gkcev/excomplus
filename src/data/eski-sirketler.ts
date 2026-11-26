import { KISILER } from '@/data/ornek';

/**
 * ONCEKI SIRKETLER (ExCom'dan): Is & Kariyer kartinda "Onceki sirketlerim".
 * Ayni yerden gecenler birbirini bulsun (kariyer niyeti).
 * Prototipte oneriler sabit liste + ornek kisilerin sirketleri.
 */
export const EN_COK_SIRKET = 8;

const SIK_GECENLER = [
  'Turkcell', 'Vodafone', 'Türk Telekom', 'Garanti BBVA', 'İş Bankası', 'Akbank', 'Yapı Kredi',
  'QNB', 'Koç Holding', 'Sabancı Holding', 'Arçelik', 'Unilever', 'P&G', 'Coca-Cola',
  'Trendyol', 'Hepsiburada', 'Getir', 'Yemeksepeti', 'Microsoft', 'Google', 'Amazon',
  'Deloitte', 'PwC', 'EY', 'KPMG', 'McKinsey', 'Boston Consulting Group', 'Accenture',
  'Turkish Airlines', 'Pegasus', 'Anadolu Efes', 'Ford Otosan', 'Tofaş', 'Eczacıbaşı',
];

const ONERILER = (() => {
  const adlar = new Set<string>(SIK_GECENLER);
  for (const k of KISILER) if (k.sirket && !k.sirket.startsWith('Bir ')) adlar.add(k.sirket);
  return [...adlar].sort((a, b) => a.localeCompare(b, 'tr')).map((ad) => ({ ad, kisi: 0 }));
})();

export const useSirketOnerileri = () => ONERILER;
