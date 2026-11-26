# ExCom Plus

ExCom'un kardes uygulamasi. **Uye kitlesi ExCom'dan ayri**: ayri
Supabase projesi, ayri hesaplar, ayri magaza kaydi. ExCom'dan
(../excommunity) ozellik kopyalanir ama iki uygulama birbirine
baglanmaz; ExCom'un veritabanina ya da anahtarlarina asla dokunulmaz.

# Expo HAS CHANGED

Expo surumu 57. Kod yazmadan once https://docs.expo.dev/versions/v57.0.0/
belgelerine bak. Ayrintili Expo kurallari: EXPO-NOTLARI.md

# Calisma kurallari

## Her commit'ten sonra push
`git commit` ve `git push` tek adimdir. Proje iki bilgisayarda
yuruyor (Windows + Mac); push edilmeyen commit digeri icin yoktur.
Uzak depo: `origin` -> github.com/gkcev/excomplus (ozel), dal `main`.

Yeni bir makinede ise baslamadan once `git pull`.

## Yayin (arkadaslara link)
Web surumu EAS Hosting'de: https://excomplus.expo.app
Yeniden yayinlamak: `npm run yayinla` (Expo hesabi: gkcevi). Link herkese
acik; prototipte veriler her kisinin kendi tarayicisinda tutulur.
Yayindan sonra kontrol: `curl -s https://excomplus.expo.app/ | grep -o 'entry-[a-f0-9]*'`
dist/index.html ile ayni olmali. Degilse (26 Kasim 2026'da oldu) son yuklemeyi
elle one al: `npx eas-cli deploy:alias --prod --id <Deployment URL'deki kimlik>`.

## Bekleyen isler
Acik basliklar ve ExCom'dan kopyalanacak ozellikler YAPILACAKLAR.md
icinde. Ise baslamadan once ona bak.

## Dil
Kullaniciya ANLATIM Turkce ve sade (kod bilmiyor). Arayuz metinleri
Turkce. Kod icindeki yorumlar ve degisken adlari Turkce ama ASCII
(Turkce karakter yok): "sehir", "aciklama", "yonetici".

## Asama: prototip
Su an prototip asamasindayiz: once ekranlar ve akis, ornek (sahte)
veriyle. Gercek veritabani (yeni Supabase projesi) akis onaylaninca
baglanir.

## Plus nedir (strateji: "Yeni ExCom Ekip Plani", Kasim 2026)
- Tum beyaz yakalilar icin; uyeler ExCom uyelerinin davetiyle gelir.
- Giris davet kodu ile; kodu olmayan basvuru birakir.
- Mevcut uye "Zaten uyeyim" (Google / Apple / e-posta) ile girer; uye olmayan
  Google ile hesap ACAMAZ, hesap yalnizca davet kodundan sonra acilir.
- Davet hakki yalnizca "Elci" rozetiyle: 3 ay uyelik + etkinlik + kulup +
  baglanti (esikler data/rozet.ts).
- Arkadaslik "ortak noktalar"dan: okul, is, hobi, muzik, semt.
- Profil doldurma zorunlu, en fazla 3 ekran; en az 3 ilgi alani + sehir.
- Medeni durum SORULMAZ. Yas gosterilmez; mezuniyet yili yalnizca arka
  planda +-8 yil yakinlik icin.
- Eslestirme: ortak ilgi, semt, ortak tanidik, davet zinciri, muzik.
  Her onerinin nedeni ekranda yazar. Haftada 3 kisi onerisi.
- Kulupler: ayni ilgiyi secenler esige ulasinca kulup ve sohbeti acilir.
- Hazir planlar: ekip koyar (haftada 1 kucuk plan, 6-8 kisi).

## Yapi
- src/app: ekranlar (expo-router). (sekmeler) alt menulu bolum.
- src/components/temel.tsx: Metin (Outfit), Dugme, Cip, Avatar, Logo, Ekran...
- src/constants/renkler.ts: ExCom'dan aynen kopya; renkler buradan.
- src/data/ornek.ts: prototip verisi; eslestirme.ts: puanlama;
  oturum.tsx: cihazda saklanan prototip oturumu.
- Onizleme: `npx expo start --web --port 8091`
