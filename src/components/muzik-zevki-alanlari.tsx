import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Metin as Text } from '@/components/temel';

import { Icon } from '@/components/icon';
import { IlgiAlaniSecici, type SeciciAyari } from '@/components/ilgi-alani-secici';
import { SerbestListeSecici } from '@/components/serbest-liste-secici';
import { SpotifyOynatici } from '@/components/spotify';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import {
  EN_COK_SANATCI,
  EN_COK_TARZ,
  spotifySarkiBilgisi,
  spotifySarkiKimligi,
  muzikTarziOner,
  useSanatciOnerileri,
  type MuzikZevki,
} from '@/data/muzik';
import type { IlgiKatalogu } from '@/data/ilgi-alanlari';

const MUZIK_AYARI: SeciciAyari = {
  baslik: 'Müzik tarzlarım',
  aciklama: `En fazla ${EN_COK_TARZ} tane seç. Ortak tarzlar profillerde işaretli görünür.`,
  ogeAdi: 'müzik tarzı',
  enCok: EN_COK_TARZ,
  aramaIpucu: 'Ara: jazz, house, arabesk…',
  oneriIpucu: 'Shoegaze',
  oneriDugmesi: 'Diğer / Müzik tarzı öner',
  oner: muzikTarziOner,
};

/**
 * PROFILI DUZENLE -> MUZIK ZEVKIM karti icerigi
 * Profil sarkisi (Spotify baglantisi yapistirilir), muzik tarzlari
 * (katalogdan) ve sevdigi sanatcilar. Degerler profil formunda
 * tutulur; "Degisiklikleri kaydet" ile birlikte yazilir.
 */
export function MuzikZevkiAlanlari({
  tarzKatalogu,
  zevk,
  degistir,
}: {
  tarzKatalogu: IlgiKatalogu;
  zevk: MuzikZevki;
  degistir: (yeni: MuzikZevki) => void;
}) {
  const sanatciOnerileri = useSanatciOnerileri();
  const [seciciAcik, setSeciciAcik] = useState(false);

  return (
    <>
      <ProfilSarkisiAlani zevk={zevk} degistir={degistir} />

      {/*
        Muzik tarzlari (24 Ekim 2026): 7 kategorili liste; ilgi alanlariyla
        ayni pencere (arama, kategori suzgeci, "Diger / Muzik tarzi oner").
      */}
      <View style={styles.bolum}>
        <View style={styles.ust}>
          <Text style={styles.etiket}>Müzik tarzlarım</Text>
          <Text style={styles.sayac}>
            {zevk.tarzlar.length} / {EN_COK_TARZ}
          </Text>
        </View>
        {zevk.tarzlar.length > 0 && (
          <View style={styles.hapler}>
            {zevk.tarzlar
              .filter((id) => tarzKatalogu.bul.has(id))
              .map((id) => {
                const ad = tarzKatalogu.bul.get(id)?.ad ?? id;
                return (
                  <Pressable
                    key={id}
                    accessibilityRole="button"
                    accessibilityLabel={`${ad} tarzını kaldır`}
                    onPress={() =>
                      degistir({ ...zevk, tarzlar: zevk.tarzlar.filter((x) => x !== id) })
                    }
                    style={({ pressed }) => [styles.secili, pressed && styles.basili]}>
                    <Text style={styles.seciliYazi}>{ad}</Text>
                    <Icon name="x" size={14} color={Colors.textMuted} strokeWidth={2.2} />
                  </Pressable>
                );
              })}
          </View>
        )}
        <Pressable
          accessibilityRole="button"
          onPress={() => setSeciciAcik(true)}
          style={({ pressed }) => [styles.ekle, pressed && styles.basili]}>
          <Icon name="plus" size={16} color={Colors.accent} strokeWidth={2.4} />
          <Text style={styles.ekleYazi}>
            {zevk.tarzlar.length === 0 ? 'Müzik tarzı ekle' : 'Müzik tarzı ekle / değiştir'}
          </Text>
        </Pressable>
      </View>

      <IlgiAlaniSecici
        gorunur={seciciAcik}
        katalog={tarzKatalogu}
        // Gizlenen eski tarzlar (Akustik gibi) pencerede gorunmez ama kayitta korunur
        secilenler={zevk.tarzlar.filter((id) => tarzKatalogu.bul.has(id))}
        tamam={(yeni) => {
          const gizliler = zevk.tarzlar.filter((id) => !tarzKatalogu.bul.has(id));
          degistir({ ...zevk, tarzlar: [...yeni, ...gizliler] });
          setSeciciAcik(false);
        }}
        vazgec={() => setSeciciAcik(false)}
        ayar={MUZIK_AYARI}
      />

      <SerbestListeSecici
        secilenler={zevk.sanatcilar}
        degistir={(sanatcilar) => degistir({ ...zevk, sanatcilar })}
        oneriler={sanatciOnerileri}
        etiket="En sevdiğim sanatçılar"
        yardim="Grup ya da sanatçı; yazarken diğer üyelerin sevdikleri önerilir. Aynı sanatçıyı sevenlerle konsere gidebilirsin."
        ipucu="Sezen Aksu, Duman, Coldplay…"
        ikon="muzik"
        enCok={EN_COK_SANATCI}
        ogeAdi="sanatçı"
      />
    </>
  );
}

/** Spotify baglantisini yapistir; ad ve kapak Spotify'dan gelir */
function ProfilSarkisiAlani({
  zevk,
  degistir,
}: {
  zevk: MuzikZevki;
  degistir: (yeni: MuzikZevki) => void;
}) {
  const [baglanti, setBaglanti] = useState('');
  const [bakiliyor, setBakiliyor] = useState(false);
  const [hata, setHata] = useState('');

  const yapistirildi = async (metin: string) => {
    setBaglanti(metin);
    setHata('');
    if (metin.trim() === '') return;
    const kimlik = spotifySarkiKimligi(metin);
    if (!kimlik) {
      setHata(
        metin.includes('spotify')
          ? 'Bu bir şarkı bağlantısı değil (albüm ya da çalma listesi olabilir). Şarkının kendisini paylaş.'
          : 'Bu bir Spotify şarkı bağlantısı değil.'
      );
      return;
    }
    setBakiliyor(true);
    const bilgi = await spotifySarkiBilgisi(kimlik);
    setBakiliyor(false);
    // Bilgi alinamasa da sarki kaydedilir; oynatici yine calisir
    degistir({ ...zevk, sarki: bilgi ?? { spotifyId: kimlik, baslik: '', kapak: '' } });
    setBaglanti('');
  };

  return (
    <View style={styles.bolum}>
      <Text style={styles.etiket}>Profil şarkım</Text>
      {zevk.sarki ? (
        <>
          <View style={styles.sarkiSatiri}>
            {zevk.sarki.kapak !== '' ? (
              <Image source={{ uri: zevk.sarki.kapak }} style={styles.kapak} contentFit="cover" />
            ) : (
              <View style={[styles.kapak, styles.kapakBos]}>
                <Icon name="muzik" size={20} color={Colors.white} strokeWidth={2} />
              </View>
            )}
            <Text style={styles.sarkiAdi} numberOfLines={2}>
              {zevk.sarki.baslik || 'Spotify şarkısı'}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Profil şarkısını kaldır"
              onPress={() => degistir({ ...zevk, sarki: null })}
              hitSlop={8}
              style={({ pressed }) => [styles.kaldir, pressed && styles.basili]}>
              <Text style={styles.kaldirYazi}>Değiştir</Text>
            </Pressable>
          </View>
          <SpotifyOynatici spotifyId={zevk.sarki.spotifyId} baslik={zevk.sarki.baslik} />
        </>
      ) : (
        <>
          <Text style={styles.yardim}>
            Spotify’da şarkıyı aç, ••• → Paylaş → Bağlantıyı kopyala de ve buraya yapıştır.
          </Text>
          <View style={[styles.girdiKutusu, hata !== '' && styles.girdiHatali]}>
            <Icon name="muzik" size={18} color={Colors.textMuted} strokeWidth={1.9} />
            <TextInput
              value={baglanti}
              onChangeText={(m) => void yapistirildi(m)}
              placeholder="https://open.spotify.com/track/…"
              placeholderTextColor={Colors.textFaint}
              accessibilityLabel="Spotify şarkı bağlantısı"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.girdi}
            />
          </View>
          {bakiliyor && <Text style={styles.yardim}>Şarkı bulunuyor…</Text>}
          {hata !== '' && <Text style={styles.hata}>{hata}</Text>}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bolum: { gap: Spacing.sm },
  ust: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  etiket: { fontSize: FontSize.small, fontWeight: '700', color: Colors.text },
  sayac: { fontSize: FontSize.caption, fontWeight: '600', color: Colors.textMuted },
  yardim: { fontSize: FontSize.caption, lineHeight: 18, color: Colors.textMuted },
  hata: { fontSize: FontSize.caption, lineHeight: 18, color: Colors.heart },
  basili: { opacity: 0.7 },
  hapler: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  secili: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 36,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.pill,
    backgroundColor: Colors.bejZemin,
  },
  seciliYazi: { fontSize: FontSize.small, fontWeight: '600', color: Colors.text },
  ekle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 44,
    alignSelf: 'flex-start',
  },
  ekleYazi: { fontSize: FontSize.small, fontWeight: '700', color: Colors.accent },
  sarkiSatiri: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  kapak: { width: 48, height: 48, borderRadius: Radius.sm },
  kapakBos: { backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  sarkiAdi: {
    flex: 1,
    minWidth: 0,
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Colors.text,
  },
  kaldir: { minHeight: 44, justifyContent: 'center' },
  kaldirYazi: { fontSize: FontSize.small, fontWeight: '700', color: Colors.accent },
  girdiKutusu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 48,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderInput,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
  },
  girdiHatali: { borderColor: Colors.heart },
  girdi: { flex: 1, minWidth: 0, fontSize: FontSize.body, color: Colors.text, paddingVertical: 0 },
});
