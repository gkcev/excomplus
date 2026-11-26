import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Metin as Text } from '@/components/temel';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { AramaKutusu, aramaIcinSade } from '@/components/search-box';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import {
  ONERILEN_ILGI,
  ilgiAlaniOner,
  type IlgiAlani,
  type IlgiKatalogu,
} from '@/data/ilgi-alanlari';

/**
 * ILGI ALANI SECIM PENCERESI (24 Ekim 2026; 25 Ekim final revizyonu)
 * ------------------------------------------------------------
 * Profili Duzenle -> Hobiler & Ilgi Alanlarim -> "+ Ilgi alani ekle".
 * Sirasiyla: baslik ve aciklama, arama, Populer (ilk 12, secim
 * sayisindan), yatay kategori sekmeleri, YALNIZCA secili kategorinin
 * secenekleri ("Tumu": kategorilere gore gruplu), "Aradigini bulamadin
 * mi? Oner", altta secim sayaci ve Kaydet.
 *
 * Secim bir kimlik listesi: ayni secenek Populer'de de kategorisinde de
 * ayni kimlik, iki kez sayilmaz; kategori degisince secimler korunur.
 *
 * Secimler burada KAYDEDILMEZ: "Kaydet" profil formuna geri verir,
 * "Degisiklikleri kaydet" profille birlikte yazar. "Vazgec" bu
 * penceredeki degisiklikleri atar. Oneri ayri bir istek olarak hemen
 * gider; yonetici onaylayana kadar kimse gormez.
 *
 * Ayni pencere muzik tarzlari icin de kullaniliyor; metinler, sinir,
 * populer ve oneri fonksiyonu SeciciAyari'ndan gelir.
 */
export type SeciciAyari = {
  baslik: string;
  /** Basligin altindaki kisa aciklama */
  aciklama: string;
  /** "ilgi alanı", "müzik tarzı" */
  ogeAdi: string;
  /** Ust sinir; yoksa sinirsiz */
  enCok?: number;
  /** Onerilen baslangic sayisi (zorunlu degil) */
  onerilen?: number;
  aramaIpucu: string;
  oneriIpucu: string;
  /** Listenin altindaki oneri dugmesinin yazisi */
  oneriDugmesi: string;
  oner: (ad: string, kategoriId: string | null) => Promise<string | null>;
};

export const ILGI_AYARI: SeciciAyari = {
  baslik: 'Nelerden hoşlanırsın?',
  aciklama: `Ortak zevkler, yeni muhabbetler. ${ONERILEN_ILGI} ilgi alanıyla başla!`,
  ogeAdi: 'ilgi alanı',
  onerilen: ONERILEN_ILGI,
  aramaIpucu: 'Ara: tenis, yapay zekâ, fotoğraf…',
  oneriIpucu: 'Su topu',
  oneriDugmesi: 'Aradığını bulamadın mı? Öner',
  oner: ilgiAlaniOner,
};

const POPULER_ADET = 12;
const TUMU = 'tumu';

export function IlgiAlaniSecici({
  gorunur,
  katalog,
  secilenler,
  tamam,
  vazgec,
  ayar = ILGI_AYARI,
  populer,
}: {
  gorunur: boolean;
  katalog: IlgiKatalogu;
  secilenler: string[];
  tamam: (yeni: string[]) => void;
  vazgec: () => void;
  ayar?: SeciciAyari;
  /** Populer secenek kimlikleri (secim sayisina gore); yoksa bolum gorunmez */
  populer?: string[];
}) {
  return (
    <Modal
      visible={gorunur}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={vazgec}>
      {/* Her acilista taslak yeniden kurulsun diye ic bilesen ayri */}
      {gorunur && (
        <SeciciIcerigi
          katalog={katalog}
          ilk={secilenler}
          tamam={tamam}
          vazgec={vazgec}
          ayar={ayar}
          populer={populer ?? []}
        />
      )}
    </Modal>
  );
}

function SeciciIcerigi({
  katalog,
  ilk,
  tamam,
  vazgec,
  ayar,
  populer,
}: {
  katalog: IlgiKatalogu;
  ilk: string[];
  tamam: (yeni: string[]) => void;
  vazgec: () => void;
  ayar: SeciciAyari;
  populer: string[];
}) {
  // Yalnizca listede acik olanlar; tekrar varsa bir kez
  const [taslak, setTaslak] = useState<string[]>(() => [
    ...new Set(ilk.filter((id) => katalog.bul.has(id))),
  ]);
  const [arama, setArama] = useState('');
  // Varsayilan sekme ilk kategori: butun liste alt alta gelmesin
  const [kategori, setKategori] = useState<string>(katalog.kategoriler[0]?.id ?? TUMU);
  const enCok = ayar.enCok ?? Infinity;
  const dolu = taslak.length >= enCok;

  const degistir = (id: string) => {
    setTaslak((eski) => {
      if (eski.includes(id)) return eski.filter((x) => x !== id);
      if (eski.length >= enCok) return eski;
      return [...eski, id];
    });
  };

  const aranan = aramaIcinSade(arama);
  const populerAlanlar = useMemo(
    () =>
      populer
        .map((id) => katalog.bul.get(id))
        .filter((a): a is IlgiAlani => a !== undefined && katalog.alanlar.includes(a))
        .slice(0, POPULER_ADET),
    [populer, katalog]
  );

  /*
    Gosterilen gruplar: aramada butun kategorilerde eslesenler (gruplu),
    "Tumu"nde butun kategoriler, yoksa yalnizca secili kategori.
  */
  const gruplar = useMemo(() => {
    const kategoriler =
      aranan !== '' || kategori === TUMU
        ? katalog.kategoriler
        : katalog.kategoriler.filter((k) => k.id === kategori);
    return kategoriler
      .map((k) => ({
        id: k.id,
        ad: k.ad,
        alanlar: katalog.alanlar.filter(
          (a) => a.kategoriId === k.id && (aranan === '' || a.anahtar.includes(aranan))
        ),
      }))
      .filter((g) => g.alanlar.length > 0);
  }, [katalog, aranan, kategori]);
  const bulunanSayisi = gruplar.reduce((t, g) => t + g.alanlar.length, 0);
  const basliklariGoster = aranan !== '' || kategori === TUMU;

  const hap = (a: IlgiAlani) => (
    <IlgiHapi
      key={a.id}
      alan={a}
      secili={taslak.includes(a.id)}
      soluk={dolu && !taslak.includes(a.id)}
      bas={() => degistir(a.id)}
    />
  );

  const onerilen = ayar.onerilen ?? 0;
  const sayacYazisi =
    ayar.enCok !== undefined
      ? `${taslak.length} / ${ayar.enCok} seçildi`
      : `${taslak.length} seçildi`;
  const ipucu =
    onerilen > 0 && taslak.length < onerilen
      ? `${onerilen - taslak.length} tane daha seçebilirsin`
      : dolu
        ? 'Sınıra geldin; yenisi için birini kaldır'
        : '';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.esnek}
        behavior={Platform.OS === 'web' ? undefined : 'padding'}>
        <View style={styles.ustSatir}>
          <Pressable
            accessibilityRole="button"
            onPress={vazgec}
            hitSlop={8}
            style={({ pressed }) => [styles.ustDugme, pressed && styles.basili]}>
            <Text style={styles.vazgec}>Vazgeç</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.icerik}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.basliklar}>
            <Text style={styles.baslik} accessibilityRole="header">
              {ayar.baslik}
            </Text>
            <Text style={styles.yardim}>{ayar.aciklama}</Text>
          </View>

          <AramaKutusu deger={arama} degistir={setArama} ipucu={ayar.aramaIpucu} />

          {/* 1) Populer: yalnizca aramada degilken */}
          {aranan === '' && populerAlanlar.length > 0 && (
            <View style={styles.grup}>
              <Text style={styles.altBaslik}>Popüler</Text>
              <View style={styles.hapler}>
                {populerAlanlar.map(hap)}
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setKategori(TUMU)}
                  style={({ pressed }) => [styles.hap, styles.tumunuGor, pressed && styles.basili]}>
                  <Text style={styles.tumunuGorYazi}>Tümünü gör</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* 2) Kategori sekmeleri (aramada da sonuc kategoriye gore gruplanir) */}
          {aranan === '' && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suzgecler}>
              {[...katalog.kategoriler, { id: TUMU, ad: 'Tümü' }].map((k) => {
                const secili = kategori === k.id;
                return (
                  <Pressable
                    key={k.id}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: secili }}
                    onPress={() => setKategori(k.id)}
                    style={({ pressed }) => [
                      styles.suzgec,
                      secili && styles.suzgecSecili,
                      pressed && styles.basili,
                    ]}>
                    <Text style={[styles.suzgecYazi, secili && styles.suzgecYaziSecili]}>
                      {k.ad}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          {/* 3) Secili kategorinin (ya da aramanin) secenekleri */}
          {aranan !== '' && (
            <Text style={styles.altBaslik}>
              {bulunanSayisi === 0 ? 'Sonuç yok' : `${bulunanSayisi} sonuç`}
            </Text>
          )}
          {gruplar.map((g) => (
            <View key={g.id} style={styles.grup}>
              {basliklariGoster && <Text style={styles.grupBasligi}>{g.ad}</Text>}
              <View style={styles.hapler}>{g.alanlar.map(hap)}</View>
            </View>
          ))}

          {/* 4) Oneri */}
          <OneriKutusu
            ilkMetin={arama}
            kategoriId={kategori === TUMU ? null : kategori}
            kategoriAdi={katalog.kategoriler.find((k) => k.id === kategori)?.ad}
            ayar={ayar}
          />
        </ScrollView>

        {/* 5) Sayac ve Kaydet */}
        <View style={styles.altCubuk}>
          <View style={styles.sayacKutusu}>
            <Text style={styles.sayac}>{sayacYazisi}</Text>
            {ipucu !== '' && <Text style={styles.sayacIpucu}>{ipucu}</Text>}
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Kaydet, ${taslak.length} ${ayar.ogeAdi} seçili`}
            onPress={() => tamam(taslak)}
            style={({ pressed }) => [styles.kaydet, pressed && styles.basili]}>
            <Text style={styles.kaydetYazi}>Kaydet</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function IlgiHapi({
  alan,
  secili,
  soluk,
  bas,
}: {
  alan: IlgiAlani;
  secili: boolean;
  soluk: boolean;
  bas: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: secili, disabled: soluk }}
      accessibilityLabel={alan.ad}
      onPress={bas}
      hitSlop={4}
      style={({ pressed }) => [
        styles.hap,
        secili && styles.hapSecili,
        soluk && styles.hapSoluk,
        pressed && styles.basili,
      ]}>
      {/* Secili durum yalnizca renkle anlatilmasin: tik isareti de var */}
      {secili && <Icon name="check" size={14} color={Colors.white} strokeWidth={2.6} />}
      <Text style={secili ? styles.hapYaziSecili : styles.hapYazi}>{alan.ad}</Text>
    </Pressable>
  );
}

/** "Aradigini bulamadin mi?" - onaya giden oneri */
function OneriKutusu({
  ilkMetin,
  kategoriId,
  kategoriAdi,
  ayar,
}: {
  ilkMetin: string;
  kategoriId: string | null;
  kategoriAdi?: string;
  ayar: SeciciAyari;
}) {
  const [acik, setAcik] = useState(false);
  const [metin, setMetin] = useState('');
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [sonuc, setSonuc] = useState<{ tamam: boolean; yazi: string } | null>(null);

  const gonder = async () => {
    if (gonderiliyor) return;
    if (metin.trim().length < 2) {
      setSonuc({ tamam: false, yazi: 'En az 2 harf yaz.' });
      return;
    }
    setGonderiliyor(true);
    const hata = await ayar.oner(metin, kategoriId);
    setGonderiliyor(false);
    if (hata) {
      setSonuc({ tamam: false, yazi: hata });
      return;
    }
    setSonuc({
      tamam: true,
      yazi: 'Teşekkürler! Yönetici onaylayınca listeye eklenecek.',
    });
    setMetin('');
  };

  if (!acik) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          setMetin(ilkMetin.trim());
          setSonuc(null);
          setAcik(true);
        }}
        style={({ pressed }) => [styles.oneriAc, pressed && styles.basili]}>
        <Icon name="plus" size={16} color={Colors.accent} strokeWidth={2.4} />
        <Text style={styles.oneriAcYazi}>{ayar.oneriDugmesi}</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.oneriKutusu}>
      <Text style={styles.altBaslik}>Yeni {ayar.ogeAdi} öner</Text>
      <Text style={styles.yardim}>
        {kategoriAdi ? `“${kategoriAdi}” kategorisine önerilecek. ` : ''}
        Yönetici onaylayınca herkesin listesine eklenir.
      </Text>
      <TextInput
        value={metin}
        onChangeText={(y) => {
          setMetin(y);
          setSonuc(null);
        }}
        placeholder={ayar.oneriIpucu}
        placeholderTextColor={Colors.textFaint}
        maxLength={40}
        accessibilityLabel={`Önerdiğin ${ayar.ogeAdi}`}
        returnKeyType="send"
        onSubmitEditing={gonder}
        style={styles.oneriGirdi}
      />
      {sonuc && (
        <Text style={sonuc.tamam ? styles.oneriTamam : styles.oneriHata}>{sonuc.yazi}</Text>
      )}
      <View style={styles.oneriDugmeler}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setAcik(false)}
          style={({ pressed }) => [styles.oneriDugme, pressed && styles.basili]}>
          <Text style={styles.vazgec}>Kapat</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={gonder}
          disabled={gonderiliyor}
          style={({ pressed }) => [
            styles.oneriDugme,
            styles.oneriGonder,
            pressed && styles.basili,
          ]}>
          <Text style={styles.oneriGonderYazi}>{gonderiliyor ? 'Gönderiliyor…' : 'Öner'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  esnek: { flex: 1 },
  basili: { opacity: 0.7 },
  ustSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    minHeight: 48,
  },
  ustDugme: { minWidth: 72, minHeight: 44, justifyContent: 'center' },
  vazgec: { fontSize: FontSize.body, color: Colors.textMuted, fontWeight: '600' },
  icerik: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.lg,
  },
  basliklar: { gap: 4 },
  baslik: { fontSize: 26, lineHeight: 32, fontWeight: '700', color: Colors.text },
  yardim: { fontSize: FontSize.small, lineHeight: 19, color: Colors.textMuted },
  altBaslik: { fontSize: FontSize.small, fontWeight: '700', color: Colors.text },
  grupBasligi: { fontSize: FontSize.caption, fontWeight: '700', color: Colors.textMuted },
  grup: { gap: Spacing.sm },
  hapler: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  hap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 40,
    maxWidth: '100%',
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.borderInput,
    backgroundColor: Colors.surface,
  },
  hapSecili: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  hapSoluk: { opacity: 0.45 },
  hapYazi: { flexShrink: 1, fontSize: FontSize.small, color: Colors.text },
  hapYaziSecili: {
    flexShrink: 1,
    fontSize: FontSize.small,
    color: Colors.white,
    fontWeight: '600',
  },
  tumunuGor: { borderStyle: 'dashed', backgroundColor: 'transparent' },
  tumunuGorYazi: { fontSize: FontSize.small, fontWeight: '700', color: Colors.accent },
  suzgecler: { gap: Spacing.sm, paddingRight: Spacing.lg },
  suzgec: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  suzgecSecili: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  suzgecYazi: { fontSize: FontSize.small, fontWeight: '600', color: Colors.text },
  suzgecYaziSecili: { color: Colors.white },
  altCubuk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  sayacKutusu: { flex: 1, minWidth: 0 },
  sayac: { fontSize: FontSize.body, fontWeight: '700', color: Colors.text },
  sayacIpucu: { fontSize: FontSize.caption, color: Colors.textMuted },
  kaydet: {
    minHeight: 48,
    paddingHorizontal: Spacing.xxl,
    justifyContent: 'center',
    borderRadius: Radius.pill,
    backgroundColor: Colors.primary,
  },
  kaydetYazi: { fontSize: FontSize.body, fontWeight: '700', color: Colors.white },
  oneriAc: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 44,
  },
  oneriAcYazi: { fontSize: FontSize.small, fontWeight: '700', color: Colors.accent },
  oneriKutusu: {
    backgroundColor: Colors.heartSoft,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  oneriGirdi: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: Colors.borderInput,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.body,
    color: Colors.text,
  },
  oneriTamam: { fontSize: FontSize.small, color: Colors.text, fontWeight: '600' },
  oneriHata: { fontSize: FontSize.small, color: Colors.heart },
  oneriDugmeler: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.sm },
  oneriDugme: {
    minHeight: 44,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
    borderRadius: Radius.pill,
  },
  oneriGonder: { backgroundColor: Colors.primary },
  oneriGonderYazi: { fontSize: FontSize.small, fontWeight: '700', color: Colors.white },
});
