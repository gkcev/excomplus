/**
 * FORM DOGRULAMA
 * ------------------------------------------------------------
 * Butun formlar ayni kurallari kullansin diye kontroller burada
 * toplandi. Her fonksiyon ya null (sorun yok) ya da kisinin
 * okuyacagi Turkce bir hata cumlesi doner.
 *
 * Kural: hata metinleri suclayici degil yol gosterici olsun.
 */

/** Bas ve sondaki bosluklari atar, aradaki cok bosluklari teke indirir */
export function sadelestir(metin: string) {
  return metin.trim().replace(/\s+/g, ' ');
}

export function adHatasi(ad: string): string | null {
  const temiz = sadelestir(ad);
  if (temiz === '') return 'Ad soyad alanını doldur.';
  if (temiz.length < 3) return 'Adın en az 3 harf olmalı.';
  if (temiz.length > 60) return 'Ad soyad en fazla 60 karakter olabilir.';
  // Rakam ve isaretlerden olusan adlar genelde yanlis yazimdir
  if (!/^[\p{L}\s.'-]+$/u.test(temiz)) {
    return 'Ad soyad yalnızca harf içerebilir.';
  }
  if (!temiz.includes(' ')) return 'Soyadını da yaz.';
  return null;
}

/**
 * E-posta kontrolu.
 * Cok siki bir kural yazmiyoruz; amac yazim hatasini yakalamak,
 * gecerli adresleri reddetmek degil.
 */
export function epostaHatasi(eposta: string): string | null {
  const temiz = eposta.trim();
  if (temiz === '') return 'E-posta adresini yaz.';
  if (temiz.includes(' ')) return 'E-posta adresinde boşluk olamaz.';
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(temiz)) {
    return 'E-posta adresi eksik görünüyor. Örnek: ad@ornek.com';
  }
  if (temiz.length > 254) return 'E-posta adresi çok uzun.';
  return null;
}

/**
 * Telefon kontrolu.
 * Uyelerin bir kismi yurt disinda, o yuzden ulke koduna izin
 * veriyoruz. Bos birakmak serbest (istege bagli alan).
 */
export function telefonHatasi(telefon: string, zorunlu = false): string | null {
  const temiz = telefon.trim();
  if (temiz === '') return zorunlu ? 'Telefon numarasını yaz.' : null;

  if (!/^[+0-9\s()-]+$/.test(temiz)) {
    return 'Telefon yalnızca rakam ve + işareti içerebilir.';
  }

  const rakamlar = temiz.replace(/\D/g, '');
  if (rakamlar.length < 10) return 'Telefon numarası eksik görünüyor.';
  if (rakamlar.length > 15) return 'Telefon numarası çok uzun.';
  return null;
}

/** Yazarken izin verilmeyen karakterleri ayiklar */
export function telefonuTemizle(telefon: string) {
  return telefon.replace(/[^+0-9\s()-]/g, '').slice(0, 20);
}

export function sifreHatasi(sifre: string): string | null {
  if (sifre === '') return 'Şifreni yaz.';
  if (sifre.length < 8) return 'Şifre en az 8 karakter olmalı.';
  if (sifre.length > 72) return 'Şifre en fazla 72 karakter olabilir.';
  if (!/[0-9]/.test(sifre)) return 'Şifrede en az bir rakam olsun.';
  if (!/[a-zA-ZğüşıöçĞÜŞİÖÇ]/.test(sifre)) return 'Şifrede en az bir harf olsun.';
  return null;
}

/** Sadece rakamdan olusan alanlar (kontenjan gibi) */
export function sayiHatasi(
  deger: string,
  { enAz = 0, enCok = 100000, zorunlu = false, ad = 'Bu alan' } = {}
): string | null {
  const temiz = deger.trim();
  if (temiz === '') return zorunlu ? `${ad} boş bırakılamaz.` : null;
  if (!/^[0-9]+$/.test(temiz)) return `${ad} yalnızca rakamlardan oluşmalı.`;

  const sayi = Number(temiz);
  if (sayi < enAz) return `${ad} en az ${enAz} olabilir.`;
  if (sayi > enCok) return `${ad} en fazla ${enCok} olabilir.`;
  return null;
}

/** Serbest metin alanlari icin uzunluk kontrolu */
export function metinHatasi(
  metin: string,
  { enAz = 0, enCok = 2000, ad = 'Bu alan' } = {}
): string | null {
  const temiz = metin.trim();
  if (temiz.length < enAz) {
    return enAz <= 1 ? `${ad} boş bırakılamaz.` : `${ad} en az ${enAz} karakter olmalı.`;
  }
  if (temiz.length > enCok) {
    return `${ad} en fazla ${enCok} karakter olabilir (şu an ${temiz.length}).`;
  }
  return null;
}

/** Ilk dolu hatayi doner; hepsi temizse null */
export function ilkHata(...hatalar: (string | null)[]): string | null {
  return hatalar.find((h) => h !== null) ?? null;
}

/**
 * Calisma donemi: "2008-2014" gibi iki yil.
 * Hala calisanlar bitisi bos birakabilir ya da "halen" yazabilir
 * (19 Kasim 2026): "2015-", "2015-halen", "2015 - hala" hepsi
 * "2015-Halen" olarak kaydedilir (donemDuzelt).
 * Bos birakilabilir; yazilmissa anlamli olsun istiyoruz cunku
 * Ex Ara'da doneme gore arama yapiliyor.
 */
const ACIK_DONEM =
  /^(\d{4})\s*[-–]\s*(halen|hala|hâlâ|hâla|halâ|devam|devam ediyor|bugün|bugun|günümüz|gunumuz)?$/;

/** "2015-", "2015 - hala" gibi yazilari "2015-Halen" yapar; digerleri oldugu gibi */
export function donemDuzelt(donem: string): string {
  const temiz = donem.trim();
  const acik = temiz.toLocaleLowerCase('tr-TR').match(ACIK_DONEM);
  if (acik) return `${acik[1]}-Halen`;
  // Uzun tire ile yazilan iki yil da duz tireye doner
  return temiz.replace(/^(\d{4})\s*–\s*(\d{4})$/, '$1-$2');
}

export function donemHatasi(donem: string): string | null {
  const temiz = donemDuzelt(donem);
  if (temiz === '') return null;

  const buYil = new Date().getFullYear();
  const halen = temiz.match(/^(\d{4})-Halen$/);
  if (halen) {
    const bas = Number(halen[1]);
    if (bas < 1970) return 'Başlangıç yılı 1970’ten eski olamaz.';
    if (bas > buYil) return `Başlangıç yılı ${buYil} değerinden büyük olamaz.`;
    return null;
  }

  const esles = temiz.match(/^(\d{4})\s*-\s*(\d{4})$/);
  if (!esles) return 'Dönemi şöyle yaz: 2008-2014 (hâlâ çalışıyorsan 2015-Halen)';

  const bas = Number(esles[1]);
  const son = Number(esles[2]);

  if (bas < 1970) return 'Başlangıç yılı 1970’ten eski olamaz.';
  if (son > buYil) return `Bitiş yılı ${buYil} değerinden büyük olamaz.`;
  if (bas > son) return 'Başlangıç yılı bitiş yılından sonra olamaz.';
  return null;
}

/** Ekranda gosterim: "2015-Halen" -> "2015 – Halen", "2008-2014" -> "2008 – 2014" */
export function donemGoster(donem: string): string {
  return donem.replace(/\s*[-–]\s*/, ' – ');
}

/**
 * LinkedIn adresi.
 * Tam adres de yazilabilir, yalnizca kullanici adi da:
 *   https://www.linkedin.com/in/denizkaya
 *   linkedin.com/in/denizkaya
 *   denizkaya
 * Hepsi ayni yere cikiyor; asagidaki fonksiyon tek bicime cevirir.
 */
/** linkedin.com/in/... ya da /company/... (alt alan: www, tr ...) */
/*
  Kullanici adinda Turkce (ve diger dillerde) harf olabilir (3 Kasim 2026,
  uye bildirimi): "linkedin.com/in/murat-çağlayan-aa582981" reddediliyordu.
  \p{L} her dilin harfi, \p{M} harf isaretleri.
*/
const LINKEDIN_ADRESI =
  /^(?:https?:\/\/)?(?:[a-z]{2,3}\.)?linkedin\.com\/(in|company)\/([\p{L}\p{M}0-9\-_.%]+)\/?$/iu;
const LINKEDIN_KULLANICI = /^[\p{L}\p{M}0-9\-_.]{3,100}$/u;

/** Adresteki kullanici adi her zaman yuzde kodlu (telefonda adres acilabilsin) */
function kodlu(ad: string) {
  try {
    return encodeURIComponent(decodeURIComponent(ad));
  } catch {
    return encodeURIComponent(ad);
  }
}

export function linkedinHatasi(deger: string): string | null {
  // Kopyalanan adresin sonundaki "?trk=..." gibi ekler kayitta zaten atiliyor
  const temiz = deger.trim().split('?')[0].split('#')[0].replace(/\/+$/, '');
  if (temiz === '') return null;
  if (temiz.length > 200) return 'Adres çok uzun.';

  if (LINKEDIN_KULLANICI.test(temiz)) return null;

  // Yalnizca linkedin.com adresi (baska sitenin icinde gecmesi yetmez)
  if (LINKEDIN_ADRESI.test(temiz)) return null;

  return 'LinkedIn adresini ya da kullanıcı adını yaz. Örnek: linkedin.com/in/denizkaya';
}

/**
 * Girilen degeri tam adrese cevirir; bos ise bos doner.
 * Kopyalanan LinkedIn adreslerinin sonunda genelde takip
 * parametreleri oluyor (?isSelfProfile=true, ?trk=... gibi).
 * Bunlar adresi calistirmiyor, sadece uzatiyor; temizleniyor.
 */
export function linkedinAdresi(deger: string) {
  const temiz = deger.trim().split('?')[0].split('#')[0].replace(/\/+$/, '');
  if (temiz === '') return '';

  /*
    Guvenlik denetimi (8 Ekim 2026): "https://kotu-site.com/linkedin.com/in/x"
    gibi bir adres LinkedIn dugmesinin arkasinda baska siteye goturuyordu.
    Artik yalnizca linkedin.com adresi ya da kullanici adi kabul ediliyor.
  */
  const eslesme = temiz.match(LINKEDIN_ADRESI);
  if (eslesme) return `https://linkedin.com/${eslesme[1].toLowerCase()}/${kodlu(eslesme[2])}`;
  if (LINKEDIN_KULLANICI.test(temiz)) return `https://linkedin.com/in/${kodlu(temiz)}`;
  return '';
}

/**
 * Ekranda gosterilecek kullanici adi.
 * "https://www.linkedin.com/in/yusuf-ozer-71158388/?isSelfProfile=true"
 * -> "yusuf-ozer-71158388"
 */
export function linkedinKisa(deger: string) {
  const adres = linkedinAdresi(deger);
  const ad = adres.replace(/^https?:\/\/(www\.)?linkedin\.com\/(in|company)\//i, '');
  // Yuzde kodlu adi okunur haliyle goster ("murat-%C3%A7a..." -> "murat-ça...")
  try {
    return decodeURIComponent(ad);
  } catch {
    return ad;
  }
}

/**
 * IBAN kontrolu (dogrulama turu, 8 Ekim 2026).
 * TR ile basliyorsa TR + 24 rakam olmali; diger ulkelerde
 * genel bicim: iki harf, iki rakam, toplam 15-34 karakter.
 * Bosluk serbest, kayitta ayiklaniyor.
 */
export function ibanHatasi(iban: string, zorunlu = false): string | null {
  const temiz = iban.replace(/\s/g, '').toUpperCase();
  if (temiz === '') return zorunlu ? 'IBAN’ı yaz.' : null;
  if (temiz.startsWith('TR')) {
    if (!/^TR[0-9]{24}$/.test(temiz)) {
      return 'IBAN “TR” ve ardından 24 rakamdan oluşmalı.';
    }
  } else if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/.test(temiz)) {
    return 'IBAN geçersiz görünüyor. Örnek: TR12 0006 4000 0011 2345 6789 01';
  }
  /*
    Kontrol hanesi (mod 97). "TR00 0000 ..." gibi yer tutucu ya da tek
    rakami yanlis yazilmis IBAN bicim kontrolunden geciyordu; Ex Party
    kayit sayfasinda yer tutucu IBAN gorundu (Burak'in testi K-52,
    22 Ekim 2026).
  */
  if (!ibanKontrolHanesiDogru(temiz)) {
    return 'IBAN hatalı görünüyor. Rakamları kontrol et.';
  }
  return null;
}

function ibanKontrolHanesiDogru(temiz: string) {
  const dizi = temiz.slice(4) + temiz.slice(0, 4);
  let kalan = 0;
  for (const harf of dizi) {
    const sayi = /[A-Z]/.test(harf) ? String(harf.charCodeAt(0) - 55) : harf;
    for (const rakam of sayi) kalan = (kalan * 10 + Number(rakam)) % 97;
  }
  return kalan === 1;
}

/** IBAN'i dort haneli gruplara boler: "TR12 0006 ..." */
export function ibaniBicimle(iban: string) {
  const temiz = iban.replace(/\s/g, '').toUpperCase();
  return temiz.replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Internet adresi: http(s) ile ya da yalin alan adi
 * ("ornek.com/sayfa"). Bosluk olamaz. Bos birakmak serbest.
 */
export function webAdresiHatasi(adres: string, zorunlu = false): string | null {
  const temiz = adres.trim();
  if (temiz === '') return zorunlu ? 'Bağlantı adresini yaz.' : null;
  if (temiz.length > 500) return 'Adres çok uzun.';
  if (!/^(https?:\/\/)?[^\s/.]+(\.[^\s/.]+)+(\/\S*)?$/i.test(temiz)) {
    return 'Bağlantı adresi geçersiz. Örnek: www.ornek.com';
  }
  return null;
}

/** Adrese http(s) yoksa basina https:// ekler */
export function webAdresiTam(adres: string) {
  const temiz = adres.trim();
  if (temiz === '') return '';
  return /^https?:\/\//i.test(temiz) ? temiz : `https://${temiz}`;
}

/**
 * Para tutari: "500", "1.250", "99,90" gibi. Eksi olamaz,
 * ust sinir 10.000.000. Bos birakmak serbest (ucretsiz).
 */
export const EN_YUKSEK_TUTAR = 10000000;

export function tutarHatasi(
  tutar: string,
  { zorunlu = false, ad = 'Tutar', enCok = EN_YUKSEK_TUTAR } = {}
): string | null {
  const temiz = tutar.trim();
  if (temiz === '') return zorunlu ? `${ad} boş bırakılamaz.` : null;
  if (!/^[0-9][0-9.\s]*(,[0-9]{1,2})?$/.test(temiz)) {
    return `${ad} yalnızca rakamla yazılmalı. Örnek: 1.500`;
  }
  const sayi = Number(temiz.replace(/[\s.]/g, '').replace(',', '.'));
  if (!Number.isFinite(sayi) || sayi < 0) return `${ad} geçersiz.`;
  if (sayi > enCok) return `${ad} en fazla ${enCok.toLocaleString('tr-TR')} olabilir.`;
  return null;
}
