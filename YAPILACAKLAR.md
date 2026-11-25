# Yapilacaklar

## Prototip (ornek veriyle, 25 Kasim 2026)
Calisan akis: karsilama -> davet kodu (deneme: EX4K7P) -> profil doldurma
(3 ekran, zorunlu) -> kisiye ozel ana sayfa. Sekmeler: Ana Sayfa, Kesfet,
Etkinlikler, Mesajlar, Profil. Ayrica kisi, plan, kulup, sohbet ve
"ExCom AI" (sahte) ekranlari. Veriler: src/data/ornek.ts, eslestirme
kurallari: src/data/eslestirme.ts (strateji sunumu sayfa 8).

- [ ] Gokce prototipi gezip yorum versin (ekran ekran)
- [ ] Ilgi alani listesi (Yusuf cikaracak) -> ornek.ts'ye islenecek
- [x] Kulup oner sureci: oneri -> 5 kisi "Ben de varim" -> ekip kontrolu -> kulup acilir (prototipte)
- [x] Sifir uyeyle baslangic: kulup uyeleri ilgiden hesaplanir, esik 5, ilgi secen bekleme listesine girer, ana sayfada "x kisi kaldi, davet et" karti
- [ ] Ilk kulupler ve esik sayisi: prototipte 5 secildi, ekip onaylamali
- [x] Fotograf: profilde zorunlu (1. adim), profilden degistirilebilir. Gercek yukleme (Supabase storage) veritabaniyla gelecek
- [ ] Bildirimler ekrani (zil simdilik bos)
- [ ] Plus'a ozel yeni ozellikler: liste bekleniyor

## Gercek uygulamaya gecis
- [ ] Yeni Supabase projesi ac (ExCom'unkinden AYRI)
- [ ] Davet kodlari tablosu: kod, davet eden, kullanildi mi, hak sayisi
- [ ] ExCom'dan kopyala: giris (e-posta kodu / Apple / Google), profil,
      mesajlasma, etkinlikler -> Plus veritabanina uyarlanarak
- [ ] KVKK metni (yeni alanlar: ilgi, mezuniyet yili, davet eden)
- [ ] Marka: ad, simge, renkler (simdilik ExCom logosu + PLUS rozeti)
- [ ] EAS projesi ve magaza kayitlari (paket kimligi: app.excomplus)
- [x] Kulup bulusmalari: ev sahibi koyar, Etkinlikler'de 'Kulup bulusmasi' + Kuluplerim filtresi, sohbete duser (prototipte)
- [ ] Ekip paneli: uygunsuz kulup bulusmasini kaldirma
- [x] Profil (ExCom'dan uyarlandi): tanitim karti + doluluk, 'Profili gor', ayrintili kisi profili (bilgi karti, uzmanlik, muzik, ortaklar, engelle/sikayet), Profili duzenle
- [ ] Profil fotograf galerisi (ExCom'da en fazla 6 foto) ve Spotify profil sarkisi
