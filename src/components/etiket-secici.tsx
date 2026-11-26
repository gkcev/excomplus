import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Metin as Text } from '@/components/temel';

import { Icon } from '@/components/icon';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import {
  EN_COK_ETIKET,
  ETIKET_GRUPLARI,
  ETIKET_UZUNLUK,
  etiketDuzelt,
  etiketGecerliMi,
} from '@/data/etiketler';

/**
 * UZMANLIK ETIKETI SECICI
 * ------------------------------------------------------------
 * Aranabilir, coklu secimli acilir liste.
 *
 * Once butun etiketler hap hap ekrana diziliyordu; liste
 * uzadikca kalabalik oluyor ve aranan alan bulunmuyordu. Simdi
 * liste kapali duruyor: yazinca ya da oka basinca aciliyor,
 * secenekler alt alta satir olarak geliyor.
 *
 * Listede olmayan alan elle eklenebiliyor ("B2B SaaS" gibi).
 * Baska uyelerin ekledikleri de listede cikiyor; ayni seyi
 * herkes bastan yazmasin, yazilislar dagilmasin.
 *
 * Secilenler ustte duruyor. Sinira gelince secilmemisler soluyor
 * ve sebebi yaziyor - dokunup "neden olmadi" diye dusundurmemek
 * icin.
 */
export function EtiketSecici({
  secilenler,
  degistir,
  digerleri = [],
  basliksiz = false,
}: {
  secilenler: string[];
  degistir: (yeni: string[]) => void;
  /** Uyelerin ekledigi, hazir listede olmayan etiketler */
  digerleri?: string[];
  /** Baslik ve aciklamayi disaridaki kart veriyorsa (Profili Duzenle) */
  basliksiz?: boolean;
}) {
  const [arama, setArama] = useState('');
  const [acik, setAcik] = useState(false);
  const kutuRef = useRef<View>(null);
  /* Listenin icine basiliyorsa yazi kutusundan cikmak listeyi kapatmasin */
  const iceriBasiliyor = useRef(false);

  /*
    DISARI BASINCA KAPANIR
    Liste acik kaliyor, is bitince kapatmak icin oka basmak
    gerekiyordu; kimse oku aramiyor. Web'de sayfanin herhangi
    bir yerine basmak yetiyor. Telefonda yazi kutusundan
    cikinca (klavye kapaninca) kapaniyor.
  */
  useEffect(() => {
    if (!acik || Platform.OS !== 'web' || typeof document === 'undefined') return;
    const bas = (olay: Event) => {
      const dugum = kutuRef.current as unknown as HTMLElement | null;
      if (dugum && !dugum.contains(olay.target as Node)) setAcik(false);
    };
    // Yakalama asamasinda: dokunma sistemi olayi yukari tasimayabiliyor
    document.addEventListener('pointerdown', bas, true);
    return () => document.removeEventListener('pointerdown', bas, true);
  }, [acik]);

  const yaziKutusundanCikti = () => {
    if (Platform.OS === 'web') return;
    setTimeout(() => {
      if (!iceriBasiliyor.current) setAcik(false);
      iceriBasiliyor.current = false;
    }, 150);
  };
  const doldu = secilenler.length >= EN_COK_ETIKET;
  const kelime = arama.trim().toLocaleLowerCase('tr-TR');

  const gruplar = useMemo(() => {
    const hepsi = [
      ...ETIKET_GRUPLARI,
      ...(digerleri.length > 0 ? [{ ad: 'Üyelerin eklediği', etiketler: digerleri }] : []),
    ];
    if (kelime === '') return hepsi;

    return hepsi
      .map((g) => ({
        ...g,
        etiketler: g.etiketler.filter((e) => e.toLocaleLowerCase('tr-TR').includes(kelime)),
      }))
      .filter((g) => g.etiketler.length > 0);
  }, [kelime, digerleri]);

  /*
    Yazilan sey listede birebir yoksa "ekle" satiri cikiyor.
    Buyuk-kucuk harf farki eslesme sayiliyor: "finans" yazan
    "Finans"i bulsun, yeni bir etiket acmasin.
  */
  const yeniEtiket = etiketDuzelt(arama, digerleri);
  const zatenVar =
    yeniEtiket === '' ||
    secilenler.some((e) => e.toLocaleLowerCase('tr-TR') === kelime) ||
    gruplar.some((g) =>
      g.etiketler.some((e) => e.toLocaleLowerCase('tr-TR') === kelime)
    );
  const eklenebilir = !zatenVar && etiketGecerliMi(yeniEtiket);

  const degistirEtiket = (etiket: string) => {
    if (secilenler.includes(etiket)) {
      degistir(secilenler.filter((e) => e !== etiket));
      return;
    }
    if (doldu) return;
    degistir([...secilenler, etiket]);
  };

  const ekle = () => {
    if (!eklenebilir || doldu) return;
    degistir([...secilenler, yeniEtiket]);
    setArama('');
  };

  return (
    <View ref={kutuRef} style={styles.kutu}>
      {!basliksiz && (
        <>
          <Text style={styles.etiketYazisi}>Uzmanlık alanların</Text>
          <Text style={styles.yardim}>
            En fazla {EN_COK_ETIKET} tane seç. Aynı işi bilen ex’ler birbirini
            bulabilsin diye soruyoruz.
          </Text>
        </>
      )}

      {secilenler.length > 0 && (
        <View style={styles.secilenler}>
          {secilenler.map((e) => (
            <Pressable
              key={e}
              accessibilityRole="button"
              accessibilityLabel={`${e} etiketini kaldır`}
              onPress={() => degistirEtiket(e)}
              style={({ pressed }) => [styles.secilenHap, pressed && styles.basili]}>
              <Text style={styles.secilenYazi}>{e}</Text>
              <Icon name="x" size={13} color={Colors.white} strokeWidth={2.4} />
            </Pressable>
          ))}
        </View>
      )}

      <View style={[styles.aramaKutusu, acik && styles.aramaKutusuAcik]}>
        <Icon name="search" size={16} color={Colors.textFaint} strokeWidth={2} />
        <TextInput
          value={arama}
          onChangeText={(t) => {
            setArama(t);
            if (t !== '') setAcik(true);
          }}
          onFocus={() => setAcik(true)}
          onBlur={yaziKutusundanCikti}
          onSubmitEditing={ekle}
          placeholder="Alan ara ya da kendin yaz"
          placeholderTextColor={Colors.textFaint}
          maxLength={ETIKET_UZUNLUK}
          returnKeyType="done"
          style={styles.aramaGirdisi}
        />
        {arama !== '' && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Aramayı temizle"
            hitSlop={10}
            onPress={() => setArama('')}>
            <Icon name="x" size={15} color={Colors.textMuted} strokeWidth={2} />
          </Pressable>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={acik ? 'Listeyi kapat' : 'Listeyi aç'}
          hitSlop={10}
          onPress={() => setAcik((a) => !a)}
          style={acik && styles.okAcik}>
          <Icon name="chevron-down" size={18} color={Colors.textMuted} strokeWidth={2} />
        </Pressable>
      </View>

      {doldu && (
        <Text style={styles.doluYazi}>
          {EN_COK_ETIKET} etiket seçtin. Yenisini eklemek için birini çıkar.
        </Text>
      )}

      {acik && (
        <ScrollView
          style={styles.liste}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          onTouchStart={() => {
            iceriBasiliyor.current = true;
          }}>
          {eklenebilir && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${yeniEtiket} alanını ekle`}
              disabled={doldu}
              onPress={ekle}
              style={({ pressed }) => [
                styles.satir,
                styles.ekleSatiri,
                doldu && styles.kapali,
                pressed && styles.basili,
              ]}>
              <Icon name="plus" size={16} color={Colors.primary} strokeWidth={2.4} />
              <Text style={styles.ekleYazisi} numberOfLines={1}>
                “{yeniEtiket}” alanını ekle
              </Text>
            </Pressable>
          )}

          {gruplar.length === 0 && !eklenebilir ? (
            <Text style={styles.bos}>Eşleşen alan yok.</Text>
          ) : (
            gruplar.map((g) => (
              <View key={g.ad} style={styles.grup}>
                <Text style={styles.grupAdi}>{g.ad.toLocaleUpperCase('tr-TR')}</Text>
                {g.etiketler.map((e) => {
                  const secili = secilenler.includes(e);
                  const kapali = doldu && !secili;
                  return (
                    <Pressable
                      key={e}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: secili, disabled: kapali }}
                      disabled={kapali}
                      onPress={() => degistirEtiket(e)}
                      style={({ pressed }) => [
                        styles.satir,
                        kapali && styles.kapali,
                        pressed && styles.basili,
                      ]}>
                      <View style={[styles.kutucuk, secili && styles.kutucukSecili]}>
                        {secili && (
                          <Icon name="check" size={13} color={Colors.white} strokeWidth={3} />
                        )}
                      </View>
                      <Text
                        style={[styles.satirYazisi, secili && styles.satirYazisiSecili]}
                        numberOfLines={1}>
                        {e}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  kutu: { marginBottom: Spacing.lg },
  basili: { opacity: 0.75 },
  etiketYazisi: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Colors.text,
  },
  yardim: {
    fontSize: FontSize.caption,
    lineHeight: 18,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  secilenler: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  secilenHap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.pill,
    backgroundColor: Colors.primary,
  },
  secilenYazi: {
    fontSize: FontSize.caption,
    fontWeight: '700',
    color: Colors.white,
  },
  aramaKutusu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    height: 48,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderInput, // giris kutusu: >= 3:1 (WCAG 1.4.11)
    backgroundColor: Colors.surface,
  },
  aramaKutusuAcik: { borderColor: Colors.primary },
  aramaGirdisi: {
    flex: 1,
    fontSize: FontSize.body,
    color: Colors.text,
  },
  okAcik: { transform: [{ rotate: '180deg' }] },
  doluYazi: {
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  liste: {
    maxHeight: 300,
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  grup: { paddingTop: Spacing.md },
  grupAdi: {
    fontSize: FontSize.caption,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  satir: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: 40,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
  },
  kapali: { opacity: 0.45 },
  kutucuk: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.borderInput, // giris kutusu: >= 3:1 (WCAG 1.4.11)
    backgroundColor: Colors.surface,
  },
  kutucukSecili: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  satirYazisi: {
    flex: 1,
    fontSize: FontSize.small,
    color: Colors.text,
  },
  satirYazisiSecili: { fontWeight: '700' },
  ekleSatiri: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.primarySoft,
  },
  ekleYazisi: {
    flex: 1,
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Colors.primary,
  },
  bos: {
    fontSize: FontSize.small,
    color: Colors.textMuted,
    padding: Spacing.lg,
  },
});
