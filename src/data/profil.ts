import type { Uye } from '@/data/oturum';

/**
 * PROFIL DOLULUGU (ExCom'daki "Profilini tamamla · %60" mantigi)
 * Her alan esit agirlikta. Eksik olanlar adiyla yazilir ki kisi
 * neyin bos sayildigini bilsin.
 */
const ALANLAR: { ad: string; dolu: (u: Uye) => boolean }[] = [
  { ad: 'profil fotoğrafı', dolu: (u) => !!u.foto },
  { ad: 'iş', dolu: (u) => !!(u.pozisyon || u.sirket) },
  { ad: 'hakkımda', dolu: (u) => (u.hakkinda ?? '').trim().length > 0 },
  { ad: 'üniversite', dolu: (u) => !!u.universite },
  { ad: 'uzmanlık alanları', dolu: (u) => (u.uzmanliklar ?? []).length > 0 },
  { ad: 'ilgi alanları', dolu: (u) => u.ilgiler.length >= 3 },
  { ad: 'müzik zevki', dolu: (u) => u.muzik.length > 0 || (u.sanatcilar ?? []).length > 0 || !!u.sarki },
  { ad: 'fotoğraflar', dolu: (u) => (u.fotolar ?? []).length > 0 },
  { ad: 'semt', dolu: (u) => !!u.semt },
];

export function profilDolulugu(u: Uye) {
  const eksikler = ALANLAR.filter((a) => !a.dolu(u)).map((a) => a.ad);
  const yuzde = Math.round(((ALANLAR.length - eksikler.length) / ALANLAR.length) * 100);
  return { yuzde, eksikler };
}

/** "linkedin.com/in/ad" -> "in/ad"; gecerli degilse bos */
export function linkedinKisa(adres: string) {
  const m = adres.trim().match(/linkedin\.com\/(in\/[^/?#\s]+)/i);
  return m ? m[1] : '';
}
