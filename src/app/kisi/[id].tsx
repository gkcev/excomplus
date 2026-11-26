import { router, useLocalSearchParams } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Linking, Pressable, View } from 'react-native';

import { FotoIzgarasi } from '@/components/fotolar';
import { Icon, type IconName } from '@/components/icon';
import { SpotifyOynatici } from '@/components/spotify';
import { OrtakNoktaSatiri } from '@/components/ortak-nokta';
import { Avatar, Dugme, Ekran, Kart, Metin, UstBar } from '@/components/temel';
import { Bosluk, Colors, Kose, Marka, Yazi } from '@/constants/theme';
import { kisiPuani } from '@/data/eslestirme';
import { ilgiAdi, kisiBul, tamAd, type Kisi } from '@/data/ornek';
import { kisiGalerisi } from '@/data/fotolar';
import { useOturum } from '@/data/oturum';
import { tarzAdi } from '@/data/muzik';
import { dogumGunuYazisi, linkedinKisa } from '@/data/profil';

/**
 * KISI PROFILI (ExCom'daki ayrintili profilden uyarlandi)
 *  ust: buyuk foto, ad, is, davet eden, Tanis / Mesaj
 *  neden oneriyoruz, bilgi karti (pozisyon, sirket, semt, universite),
 *  ortak tanidiklar, hakkinda, uzmanlik, ilgi alanlari ve muzik (ortaklar isaretli),
 *  LinkedIn, engelle ve sikayet.
 * id = "ben" ise kendi profilimi baskalarinin gordugu gibi gosterir.
 * Yas, medeni durum ve mezuniyet yili gosterilmez.
 */
export default function KisiProfili() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { uye, baglantilar, baglan, engellediklerim, engelle } = useOturum();
  const [engelSor, setEngelSor] = useState(false);
  const [sikayetEdildi, setSikayetEdildi] = useState(false);

  const benMiyim = id === 'ben';
  const k: Kisi | undefined =
    benMiyim && uye
      ? {
          id: 'ben', ad: uye.ad, soyadHarf: '', sehir: uye.sehir, semt: uye.semt, ilgiler: uye.ilgiler, muzik: uye.muzik,
          sirket: uye.sirket, pozisyon: uye.pozisyon, hakkinda: uye.hakkinda, davetEden: uye.davetEden, tanidiklar: uye.tanidiklar,
          universite: uye.universite, bolum: uye.bolum, uzmanliklar: uye.uzmanliklar, sanatcilar: uye.sanatcilar, linkedin: uye.linkedin,
          lise: uye.lise, eskiSirketler: uye.eskiSirketler, dogumGunu: uye.dogumGunu,
        }
      : kisiBul(id);
  if (!k || !uye) return <Ekran ust={<UstBar />}><Metin>Kişi bulunamadı.</Metin></Ekran>;

  const ad = benMiyim ? uye.ad : tamAd(k);
  const o = benMiyim ? undefined : kisiPuani(uye, k);
  const davetci = k.davetEden ? kisiBul(k.davetEden) : undefined;
  const bagli = baglantilar.includes(k.id);
  const engelli = engellediklerim.includes(k.id);
  const ortak = (liste: string[], benim: string[]) => (benMiyim ? [] : liste.filter((x) => benim.includes(x)));
  const ortakIlgi = ortak(k.ilgiler, uye.ilgiler);
  const ortakTarz = ortak(k.muzik, uye.muzik);
  const ortakSanatci = ortak(k.sanatcilar ?? [], uye.sanatcilar ?? []);
  const linkedin = linkedinKisa(k.linkedin ?? '');
  const galeri = benMiyim ? uye.fotolar ?? [] : kisiGalerisi(k.ilgiler);
  const sarki = benMiyim ? uye.sarki : undefined;

  const bilgiler: { ikon: IconName; etiket: string; deger?: string }[] = [
    { ikon: 'id-card', etiket: 'Pozisyon', deger: k.pozisyon },
    { ikon: 'building', etiket: 'Şirket', deger: k.sirket },
    { ikon: 'map-pin', etiket: 'Yaşadığı semt', deger: [k.semt, k.sehir].filter(Boolean).join(', ') },
    { ikon: 'building', etiket: 'Önceki şirketler', deger: (k.eskiSirketler ?? []).join(', ') },
    { ikon: 'mezuniyet', etiket: 'Üniversite', deger: [k.universite, k.bolum].filter(Boolean).join(' · ') },
    { ikon: 'mezuniyet', etiket: 'Lise', deger: k.lise },
    { ikon: 'gift', etiket: 'Doğum günü', deger: dogumGunuYazisi(k.dogumGunu) },
  ];
  const doluBilgiler = bilgiler.filter((b) => (b.deger ?? '').trim() !== '');

  return (
    <Ekran ust={<UstBar baslik={benMiyim ? 'Başkaları böyle görüyor' : 'Profil'} />}>
      {/* ---------------- Ust bolum ---------------- */}
      <View style={{ alignItems: 'center', gap: 6, marginTop: -Bosluk.md }}>
        <Avatar ad={ad} id={k.id} foto={benMiyim ? uye.foto : undefined} boyut={120} />
        <Metin style={{ ...Yazi.ekranBasligi, textAlign: 'center', marginTop: 4 }}>{ad}</Metin>
        {(k.pozisyon || k.sirket) && (
          <Metin style={{ color: Colors.textMuted, textAlign: 'center' }}>{[k.pozisyon, k.sirket].filter(Boolean).join('  ·  ')}</Metin>
        )}
        {davetci && (
          <Pressable onPress={() => router.push(`/kisi/${davetci.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Marka.seftali, borderRadius: Kose.hap, paddingHorizontal: 12, paddingVertical: 6, marginTop: 4 }}>
            <Avatar ad={tamAd(davetci)} id={davetci.id} boyut={20} />
            <Metin style={{ ...Yazi.etiket, color: Colors.accent }}>{tamAd(davetci)} davet etti</Metin>
          </Pressable>
        )}
      </View>

      {!benMiyim && engelli && (
        <View style={{ flexDirection: 'row', gap: Bosluk.sm, padding: Bosluk.md, borderRadius: Kose.lg, backgroundColor: Colors.heartSoft }}>
          <Icon name="x-circle" size={18} color={Colors.heart} />
          <Metin style={{ ...Yazi.ikincil, flex: 1 }}>Bu kişiyi engelledin. Birbirinize mesaj atamaz, tanışma isteği gönderemezsiniz.</Metin>
        </View>
      )}

      {!benMiyim && !engelli && (
        <View style={{ flexDirection: 'row', gap: Bosluk.md }}>
          <Dugme
            style={{ flex: 1 }}
            baslik={bagli ? 'Gönderildi' : 'Tanış'}
            ikon={bagli ? 'check' : 'user-plus'}
            tur={bagli ? 'hafif' : 'turuncu'}
            onPress={() => baglan(k.id)}
          />
          <Dugme style={{ flex: 1 }} baslik="Mesaj at" ikon="comment" tur="cizgili" onPress={() => router.push(`/mesaj/${k.id}`)} />
        </View>
      )}

      {/* ---------------- Ortak noktalariniz (en guclu once) ---------------- */}
      {o && o.ortakNoktalar.length > 0 && (
        <Kart style={{ padding: Bosluk.lg, gap: Bosluk.sm, backgroundColor: Marka.sahne }}>
          <Metin style={Yazi.kartBasligi}>Ortak noktalarınız</Metin>
          {o.ortakNoktalar.map((n) => (
            <OrtakNoktaSatiri key={n.metin} nokta={n} />
          ))}
        </Kart>
      )}

      {/* ---------------- Bilgi karti: bos alan satir olarak cikmaz ---------------- */}
      {doluBilgiler.length > 0 && (
        <Kart style={{ paddingVertical: 4 }}>
          {doluBilgiler.map((b, sira) => (
            <View key={b.etiket} style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.md, paddingVertical: 14, paddingHorizontal: Bosluk.lg, borderTopWidth: sira ? 1 : 0, borderTopColor: Colors.divider }}>
              <Icon name={b.ikon} size={20} color={Colors.accent} />
              <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted, width: 100 }}>{b.etiket}</Metin>
              <Metin style={{ ...Yazi.isim, flex: 1, textAlign: 'right' }} numberOfLines={2}>{b.deger}</Metin>
            </View>
          ))}
        </Kart>
      )}

      {/* ---------------- Ortak tanidiklar ---------------- */}
      {o && o.ortakTanidik.length > 0 && (
        <Bolum baslik={`İkinizin de tanıdığı ${o.ortakTanidik.length} kişi`}>
          <View style={{ flexDirection: 'row', gap: Bosluk.md, flexWrap: 'wrap' }}>
            {o.ortakTanidik.map((t) => {
              const tk = kisiBul(t);
              if (!tk) return null;
              return (
                <Pressable key={t} onPress={() => router.push(`/kisi/${t}`)} style={{ alignItems: 'center', gap: 4, width: 64 }}>
                  <Avatar ad={tamAd(tk)} id={tk.id} boyut={52} />
                  <Metin style={Yazi.etiket} numberOfLines={1}>{tk.ad}</Metin>
                </Pressable>
              );
            })}
          </View>
        </Bolum>
      )}

      {!!k.hakkinda && (
        <Bolum baslik="Hakkında">
          <Metin>{k.hakkinda}</Metin>
        </Bolum>
      )}

      {(k.uzmanliklar ?? []).length > 0 && (
        <Bolum baslik="Uzmanlık alanları">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {k.uzmanliklar!.map((u) => (
              <View key={u} style={{ paddingVertical: 6, paddingHorizontal: Bosluk.md, borderRadius: 999, backgroundColor: Marka.lacivert }}>
                <Metin style={{ ...Yazi.ikincil, fontWeight: '600', color: Colors.white }}>{u}</Metin>
              </View>
            ))}
          </View>
        </Bolum>
      )}

      <Bolum baslik="İlgi alanları" not={ortakIlgi.length > 0 ? `${ortakIlgi.length} ortak` : undefined}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {[...k.ilgiler]
            .sort((a, b) => Number(ortakIlgi.includes(b)) - Number(ortakIlgi.includes(a)))
            .map((i) => (
              <Hap key={i} yazi={ilgiAdi(i)} ortak={ortakIlgi.includes(i)} />
            ))}
        </View>
      </Bolum>

      {(k.muzik.length > 0 || (k.sanatcilar ?? []).length > 0 || !!sarki) && (
        <Bolum baslik="Müzik zevki" not={ortakTarz.length + ortakSanatci.length > 0 ? 'ortaklar işaretli' : undefined}>
          {sarki && <SpotifyOynatici spotifyId={sarki.spotifyId} />}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {k.muzik.map((m) => (
              <Hap key={m} yazi={tarzAdi(m)} ortak={ortakTarz.includes(m)} />
            ))}
          </View>
          {(k.sanatcilar ?? []).length > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.sm }}>
              <Icon name="muzik" size={16} color={Colors.textMuted} />
              <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {k.sanatcilar!.map((s) => (
                  <Hap key={s} yazi={s} ortak={ortakSanatci.includes(s)} />
                ))}
              </View>
            </View>
          )}
        </Bolum>
      )}

      {galeri.length > 0 && (
        <Bolum baslik="Fotoğraflar">
          <FotoIzgarasi fotolar={galeri} />
        </Bolum>
      )}

      {linkedin !== '' && (
        <Pressable
          accessibilityRole="link"
          onPress={() => Linking.openURL(`https://www.linkedin.com/${linkedin}`)}
          style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.md, padding: Bosluk.lg, borderRadius: Kose.lg, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white }}>
          <Icon name="briefcase" size={18} color={Colors.accent} />
          <View style={{ flex: 1 }}>
            <Metin style={Yazi.isim}>LinkedIn profili</Metin>
            <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }} numberOfLines={1}>{linkedin}</Metin>
          </View>
          <Icon name="arrow-right" size={16} color={Colors.accent} />
        </Pressable>
      )}

      <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted, textAlign: 'center' }}>
        İletişim bilgileri gizlidir; buluşmalarda tanışırsınız.
      </Metin>

      {/* ---------------- Engelle ve sikayet (once onay) ---------------- */}
      {!benMiyim && (
        <View style={{ gap: Bosluk.sm, paddingTop: Bosluk.md, borderTopWidth: 1, borderTopColor: Colors.divider }}>
          {engelSor && !engelli ? (
            <Kart style={{ padding: Bosluk.lg, gap: Bosluk.sm, backgroundColor: Colors.heartSoft }}>
              <Metin style={Yazi.isim}>{k.ad} kişisini engelle?</Metin>
              <Metin style={Yazi.ikincil}>
                Birbirinize mesaj atamaz, tanışma isteği gönderemezsiniz; önerilerde birbirinizi görmezsiniz. Engellediğin kişiye bildirim gitmez.
              </Metin>
              <View style={{ flexDirection: 'row', gap: Bosluk.sm }}>
                <Dugme style={{ flex: 1 }} kucuk baslik="Vazgeç" tur="cizgili" onPress={() => setEngelSor(false)} />
                <Dugme style={{ flex: 1 }} kucuk baslik="Engelle" onPress={() => { engelle(k.id); setEngelSor(false); }} />
              </View>
            </Kart>
          ) : (
            <Pressable onPress={() => (engelli ? engelle(k.id) : setEngelSor(true))} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: Bosluk.sm }}>
              <Icon name={engelli ? 'check-circle' : 'x-circle'} size={18} color={engelli ? Colors.textMuted : Colors.heart} />
              <Metin style={{ ...Yazi.etiket, color: engelli ? Colors.textMuted : Colors.heart }}>{engelli ? 'Engeli kaldır' : 'Bu kişiyi engelle'}</Metin>
            </Pressable>
          )}
          <Pressable disabled={sikayetEdildi} onPress={() => setSikayetEdildi(true)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: Bosluk.sm }}>
            <Icon name={sikayetEdildi ? 'check' : 'bayrak'} size={16} color={Colors.textMuted} />
            <Metin style={{ ...Yazi.etiket, color: Colors.textMuted }}>{sikayetEdildi ? 'Şikayetin ekibe iletildi' : 'Bu kişiyi şikayet et'}</Metin>
          </Pressable>
        </View>
      )}

      {benMiyim && <Dugme baslik="Profili düzenle" ikon="pencil" tur="cizgili" onPress={() => router.push('/profil-duzenle')} />}
    </Ekran>
  );
}

function Bolum({ baslik, not, children }: { baslik: string; not?: string; children: ReactNode }) {
  return (
    <View style={{ gap: Bosluk.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: Bosluk.sm }}>
        <Metin style={Yazi.bolumBasligi}>{baslik}</Metin>
        {not && <Metin style={{ ...Yazi.etiket, color: Colors.accent }}>{not}</Metin>}
      </View>
      {children}
    </View>
  );
}

/** ExCom'daki hap: ortaksa turuncu ve tikli */
function Hap({ yazi, ortak }: { yazi: string; ortak: boolean }) {
  return (
    <View
      accessible
      accessibilityLabel={ortak ? `${yazi}, ikiniz de seviyorsunuz` : yazi}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 6, paddingHorizontal: Bosluk.md, borderRadius: 999, backgroundColor: ortak ? Colors.accent : Colors.bejZemin }}>
      {ortak && <Icon name="check" size={13} color={Colors.white} strokeWidth={2.6} />}
      <Metin style={{ ...Yazi.ikincil, fontWeight: ortak ? '700' : '600', color: ortak ? Colors.white : Colors.text }}>{yazi}</Metin>
    </View>
  );
}
