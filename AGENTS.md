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
