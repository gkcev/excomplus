import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';

import { FotoIzgarasi, EN_FAZLA_FOTO } from '@/components/fotolar';
import { Icon, type IconName } from '@/components/icon';
import { Avatar, Dugme, Ekran, Kart, KulupGorseli, Metin } from '@/components/temel';
import { Bosluk, Colors, Durum, Kose, Marka, Yazi } from '@/constants/theme';
import { davetPaylas } from '@/data/davet';
import { fotoSec } from '@/data/foto';
import { kisiBul, kulupBul, tamAd } from '@/data/ornek';
import { useOturum } from '@/data/oturum';
import { dogumGunuYazisi, profilDolulugu } from '@/data/profil';

/**
 * PROFIL (kendi profilim) - ExCom'daki duzenden uyarlandi:
 *  1. Tanitim karti: foto (dokununca degisir), ad, is, kunye (semt | davet eden),
 *     profil dolulugu (%, 4 parcali cubuk, eksik alanlar), Duzenle / Profili gor
 *  2. Hakkimda
 *  3. Baglantilarim
 *  4. Davet (Plus'a ozel)
 *  5. Etkinliklerim (durum hapiyla), Kuluplerim
 * Yas, medeni durum, mezuniyet yili gosterilmez.
 */
export default function Profil() {
  const o = useOturum();
  const uye = o.uye!;
  const davetci = uye.davetEden ? kisiBul(uye.davetEden) : undefined;
  const [kopyalandi, setKopyalandi] = useState(false);
  const { yuzde, eksikler } = profilDolulugu(uye);
  const tamam = yuzde >= 100;
  const is = [uye.pozisyon, uye.sirket].filter(Boolean).join(', ');
  const baglantilar = o.baglantilar.map((id) => kisiBul(id)).filter((k) => !!k);

  const kunye: { ikon: IconName; yazi: string }[] = [
    { ikon: 'map-pin', yazi: [uye.semt, uye.sehir].filter(Boolean).join(', ') },
    ...(uye.universite ? [{ ikon: 'mezuniyet' as IconName, yazi: uye.universite }] : []),
    ...(uye.dogumGunu ? [{ ikon: 'gift' as IconName, yazi: dogumGunuYazisi(uye.dogumGunu) }] : []),
  ];

  const fotoEkle = async () => {
    const f = await fotoSec();
    if (f) o.profiliGuncelle({ fotolar: [...(uye.fotolar ?? []), f].slice(0, EN_FAZLA_FOTO) });
  };

  const davetEt = async () => {
    if (await davetPaylas(o.davetKodum)) {
      if (Platform.OS === 'web') setKopyalandi(true);
      o.davetiKullan();
    }
  };

  return (
    <Ekran>
      {/* ---------------- Tanitim karti ---------------- */}
      <View style={{ padding: Bosluk.lg, borderRadius: 24, backgroundColor: Marka.sahne, overflow: 'hidden', gap: Bosluk.md }}>
        {/* Sag ustte logonun seritleri: sari ve turuncu */}
        <View pointerEvents="none" style={{ position: 'absolute', top: -40, right: -50, width: 140, height: 140, transform: [{ rotate: '45deg' }], alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          <View style={{ width: 200, height: 16, borderRadius: 8, backgroundColor: Marka.sari }} />
          <View style={{ width: 200, height: 16, borderRadius: 8, backgroundColor: Marka.turuncu }} />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.lg }}>
          <Pressable
            onPress={async () => { const f = await fotoSec(); if (f) o.fotoDegistir(f); }}
            accessibilityRole="button"
            accessibilityLabel={uye.foto ? 'Profil fotoğrafını değiştir' : 'Profil fotoğrafı ekle'}
            style={{ alignItems: 'center', gap: 4 }}>
            <View>
              <Avatar ad={uye.ad} id="ben" boyut={76} foto={uye.foto} />
              <View style={{ position: 'absolute', right: -2, bottom: -2, width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: Marka.turuncu, borderWidth: 2, borderColor: Colors.white }}>
                <Icon name={uye.foto ? 'kamera' : 'plus'} size={13} color={Colors.white} strokeWidth={2.6} />
              </View>
            </View>
            {!uye.foto && <Metin style={{ fontSize: 12, fontWeight: '700', color: Colors.accent }}>Fotoğraf ekle</Metin>}
          </Pressable>

          <View style={{ flex: 1, gap: 3, paddingRight: Bosluk.lg }}>
            <Metin style={{ fontSize: 22, lineHeight: 27, fontWeight: '700' }} numberOfLines={2}>{uye.ad}</Metin>
            {is !== '' && <Metin style={{ fontSize: 15 }} numberOfLines={2}>{is}</Metin>}
            {kunye.map((k) => (
              <View key={k.ikon} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Icon name={k.ikon} size={14} color={Colors.textMuted} />
                <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted, flexShrink: 1 }} numberOfLines={1}>{k.yazi}</Metin>
              </View>
            ))}
          </View>
        </View>

        {davetci && (
          <Pressable onPress={() => router.push(`/kisi/${davetci.id}`)} style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.white, borderRadius: Kose.hap, paddingHorizontal: 12, paddingVertical: 6 }}>
            <Avatar ad={tamAd(davetci)} id={davetci.id} boyut={20} />
            <Metin style={{ ...Yazi.etiket, color: Colors.accent }}>{tamAd(davetci)} davet etti</Metin>
          </Pressable>
        )}

        {/* Doluluk: tik, yazi ve 4 parcali cubuk */}
        <View
          accessible
          accessibilityLabel={tamam ? 'Profilin tamam, yüzde 100' : `Profilin yüzde ${yuzde} dolu`}
          style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Bosluk.sm, paddingHorizontal: Bosluk.md, paddingVertical: Bosluk.sm, borderRadius: Kose.hap, backgroundColor: tamam ? Durum.onaylandi.zemin : Colors.white }}>
          <View style={{ width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: tamam ? Durum.onaylandi.yazi : Colors.accent }}>
            <Icon name={tamam ? 'check' : 'pencil'} size={12} color={Colors.white} strokeWidth={2.6} />
          </View>
          <Metin style={{ fontSize: 14, fontWeight: '600', color: tamam ? Durum.onaylandi.yazi : Colors.accent }}>
            {tamam ? 'Profilin tamam · %100' : `Profilini tamamla · %${yuzde}`}
          </Metin>
          <View style={{ flex: 1, minWidth: 90, flexDirection: 'row', gap: 4 }}>
            {[0, 1, 2, 3].map((p) => {
              const dolu = Math.min(1, Math.max(0, (yuzde - p * 25) / 25));
              return (
                <View key={p} style={{ flex: 1, height: 7, borderRadius: 4, overflow: 'hidden', backgroundColor: tamam ? 'rgba(26,107,68,0.18)' : Marka.bej }}>
                  <View style={{ height: '100%', width: `${dolu * 100}%`, borderRadius: 4, backgroundColor: tamam ? Durum.onaylandi.yazi : Marka.turuncu }} />
                </View>
              );
            })}
          </View>
        </View>
        {!tamam && (
          <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted, marginTop: -4 }}>
            Eksik: {eksikler.join(', ')}. Dolu profiller daha isabetli öneri alır.
          </Metin>
        )}

        <View style={{ flexDirection: 'row', gap: Bosluk.sm }}>
          <Dugme style={{ flex: 1 }} kucuk baslik="Düzenle" ikon="pencil" tur="cizgili" onPress={() => router.push('/profil-duzenle')} />
          <Dugme style={{ flex: 1 }} kucuk baslik="Profili gör" ikon="eye" onPress={() => router.push('/kisi/ben')} />
        </View>
      </View>

      {!!uye.hakkinda && <Metin style={{ color: Colors.textMuted, paddingHorizontal: 4 }}>{uye.hakkinda}</Metin>}

      {/* ---------------- Fotograflarim (en fazla 6) ---------------- */}
      <BolumBasligi
        baslik={`Fotoğraflarım${(uye.fotolar ?? []).length ? ` (${(uye.fotolar ?? []).length}/${EN_FAZLA_FOTO})` : ''}`}
        sag={(uye.fotolar ?? []).length < EN_FAZLA_FOTO ? 'Fotoğraf ekle' : undefined}
        onSag={fotoEkle}
      />
      {(uye.fotolar ?? []).length === 0 && (
        <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>Hobilerinden, gezilerinden fotoğraflar ekle; profilini görenler seni daha iyi tanısın.</Metin>
      )}
      <FotoIzgarasi
        fotolar={uye.fotolar ?? []}
        ekle={fotoEkle}
        sil={(i) => o.profiliGuncelle({ fotolar: (uye.fotolar ?? []).filter((_, j) => j !== i) })}
      />

      {/* ---------------- Baglantilarim ---------------- */}
      <BolumBasligi baslik="Bağlantılarım" />
      <Kart onPress={() => router.navigate('/kesfet')} style={{ padding: Bosluk.lg, flexDirection: 'row', alignItems: 'center', gap: Bosluk.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {baglantilar.slice(0, 4).map((k, i) => (
            <View key={k!.id} style={{ marginLeft: i ? -14 : 0, borderRadius: 999, borderWidth: 2.5, borderColor: Colors.white }}>
              <Avatar ad={tamAd(k!)} id={k!.id} boyut={44} />
            </View>
          ))}
          <View style={{ marginLeft: baglantilar.length ? -14 : 0, width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderStyle: 'dashed', borderColor: Colors.border, backgroundColor: Colors.white }}>
            <Icon name="plus" size={18} color={Colors.textMuted} />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Metin style={Yazi.isim}>{baglantilar.length > 0 ? `${baglantilar.length} bağlantın var` : 'Henüz bağlantın yok.'}</Metin>
          <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>Keşfet’te ortak ilgisi olanlarla tanış.</Metin>
        </View>
      </Kart>

      {/* ---------------- Davet ---------------- */}
      <Kart style={{ padding: Bosluk.lg, gap: Bosluk.md, backgroundColor: Marka.lacivert }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Metin style={{ ...Yazi.kartBasligi, color: Colors.white }}>Davet hakkın: {o.davetHakki}</Metin>
          <Icon name="gift" size={22} color={Marka.sari} />
        </View>
        <Metin style={{ ...Yazi.ikincil, color: '#D5D9E0' }}>
          Plus davetle büyüyor. Davet ettiğin kişinin profilinde senin adın görünür; güvendiğin birini seç.
        </Metin>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: Bosluk.md, borderRadius: Kose.md, backgroundColor: 'rgba(255,255,255,0.08)' }}>
          {o.davetKodum.split('').map((h, i) => (
            <View key={i} style={{ width: 34, height: 42, borderRadius: 8, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center' }}>
              <Metin style={{ fontSize: 20, fontWeight: '700' }}>{h}</Metin>
            </View>
          ))}
        </View>
        <Dugme
          baslik={o.davetHakki === 0 ? 'Davet hakkın bitti' : kopyalandi ? 'Kopyalandı ✓' : 'Davet gönder'}
          tur="turuncu"
          ikon="paylas"
          pasif={o.davetHakki === 0}
          onPress={davetEt}
        />
      </Kart>

      {/* ---------------- Etkinliklerim ---------------- */}
      <BolumBasligi baslik="Etkinliklerim" sag="Tümü" onSag={() => router.navigate('/etkinlikler')} />
      {o.katildigimPlanlar.length === 0 ? (
        <Kart onPress={() => router.navigate('/etkinlikler')} style={{ padding: Bosluk.xl, alignItems: 'center', gap: Bosluk.sm }}>
          <Metin style={Yazi.isim}>Henüz bir etkinliğe katılmadın.</Metin>
          <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted, textAlign: 'center' }}>Etkinlikler sekmesine göz at, sana uyana “Katıl” de.</Metin>
        </Kart>
      ) : (
        <Kart style={{ paddingVertical: 4 }}>
          {o.katildigimPlanlar.map((id, sira) => {
            const p = o.planiBul(id);
            if (!p) return null;
            const evSahibi = p.evSahibi === 'ben';
            return (
              <Pressable key={id} onPress={() => router.push(`/etkinlik/${id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.md, paddingVertical: Bosluk.md, paddingHorizontal: Bosluk.lg, borderTopWidth: sira ? 1 : 0, borderTopColor: Colors.divider }}>
                <Image source={p.gorsel} style={{ width: 56, height: 56, borderRadius: Kose.md }} contentFit="cover" />
                <View style={{ flex: 1 }}>
                  <Metin style={Yazi.isim} numberOfLines={1}>{p.baslik}</Metin>
                  <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }} numberOfLines={1}>{p.gun} · {p.saat} · {p.semt}</Metin>
                </View>
                <Hap yazi={evSahibi ? 'Ev sahibisin' : 'Katılıyorsun'} sari={evSahibi} />
              </Pressable>
            );
          })}
        </Kart>
      )}

      {/* ---------------- Kuluplerim ---------------- */}
      <BolumBasligi baslik="Kulüplerim" sag="Keşfet" onSag={() => router.navigate('/kesfet')} />
      {o.kuluplerim.length === 0 ? (
        <Metin style={{ color: Colors.textMuted }}>Henüz bir kulübe katılmadın.</Metin>
      ) : (
        <Kart style={{ paddingVertical: 4 }}>
          {o.kuluplerim.map((id, sira) => {
            const k = kulupBul(id);
            if (!k) return null;
            const sayi = k.uyeler.length + 1;
            const acik = sayi >= k.esik;
            return (
              <Pressable key={id} onPress={() => router.push(`/kulup/${id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.md, paddingVertical: Bosluk.md, paddingHorizontal: Bosluk.lg, borderTopWidth: sira ? 1 : 0, borderTopColor: Colors.divider }}>
                <KulupGorseli ilgi={k.ilgi} genislik={56} yukseklik={56} />
                <View style={{ flex: 1 }}>
                  <Metin style={Yazi.isim} numberOfLines={1}>{k.ad}</Metin>
                  <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }} numberOfLines={1}>
                    {acik ? `${sayi} üye` : `${sayi} / ${k.esik} kişi`}
                  </Metin>
                </View>
                <Hap yazi={o.evSahibiKuluplerim.includes(id) ? 'Ev sahibisin' : acik ? 'Açık' : 'Toplanıyor'} sari={o.evSahibiKuluplerim.includes(id)} soluk={!acik} />
              </Pressable>
            );
          })}
        </Kart>
      )}

      <View style={{ gap: Bosluk.sm, paddingTop: Bosluk.lg, borderTopWidth: 1, borderTopColor: Colors.divider }}>
        <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted, textAlign: 'center' }}>
          Bu bir prototip: veriler yalnızca bu cihazda tutulur.
        </Metin>
        <Dugme
          baslik="Prototipi baştan başlat"
          tur="cizgili"
          onPress={() => {
            o.cikis();
            router.replace('/');
          }}
        />
      </View>
    </Ekran>
  );
}

function BolumBasligi({ baslik, sag, onSag }: { baslik: string; sag?: string; onSag?: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Bosluk.sm, marginBottom: -Bosluk.sm }}>
      <Metin style={Yazi.bolumBasligi}>{baslik}</Metin>
      {sag && onSag && (
        <Pressable onPress={onSag} hitSlop={8}>
          <Metin style={{ ...Yazi.etiket, color: Colors.accent }}>{sag}</Metin>
        </Pressable>
      )}
    </View>
  );
}

/** Durum hapi: Katiliyorsun (mint), Ev sahibisin (sari), Toplaniyor (soluk) */
function Hap({ yazi, sari, soluk }: { yazi: string; sari?: boolean; soluk?: boolean }) {
  const zemin = sari ? Marka.sari : soluk ? Colors.background : Durum.onaylandi.zemin;
  const renk = sari ? Colors.text : soluk ? Colors.textMuted : Durum.onaylandi.yazi;
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: zemin }}>
      <Metin style={{ fontSize: 12, fontWeight: '700', color: renk }}>{yazi}</Metin>
    </View>
  );
}
