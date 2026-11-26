import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Metin as Text } from '@/components/temel';

import { Icon } from '@/components/icon';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { UNIVERSITELER } from '@/data/universiteler';

/** Turkce harfleri sadelestirir: "bogazici" yazan "Boğaziçi"yi bulsun */
function sade(metin: string) {
  return metin
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .trim();
}

/**
 * UNIVERSITE SECICI
 * ------------------------------------------------------------
 * Aranabilir, tek secimli acilir liste. Liste hazir
 * (data/universiteler.ts): elle yazilsa "Boğaziçi" ile "BÜ"
 * eslesmez ve "taniyor olabilirsin" onerisi isini yapamazdi.
 *
 * Listede olmayan okul (yurtdisi gibi) elle yazilabiliyor;
 * buyuk-kucuk harf farki listedeki yazilisa baglaniyor.
 *
 * Disari basinca kapaniyor (etiket seciciyle ayni davranis).
 */
export function UniversiteSecici({
  deger,
  sec,
}: {
  deger: string;
  sec: (yeni: string) => void;
}) {
  const [arama, setArama] = useState('');
  const [acik, setAcik] = useState(false);
  const kutuRef = useRef<View>(null);
  const iceriBasiliyor = useRef(false);

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

  const kelime = sade(arama);
  const sonuclar = useMemo(
    () => (kelime === '' ? UNIVERSITELER : UNIVERSITELER.filter((u) => sade(u).includes(kelime))),
    [kelime]
  );

  const yazilan = arama.replace(/\s+/g, ' ').trim().slice(0, 80);
  const birebir = UNIVERSITELER.find((u) => sade(u) === kelime);
  const elleEklenebilir = yazilan.length >= 2 && !birebir;

  const sec_ = (ad: string) => {
    sec(ad);
    setArama('');
    setAcik(false);
  };

  return (
    <View ref={kutuRef} style={styles.kutu}>
      <Text style={styles.etiket}>Üniversite</Text>

      {deger !== '' && !acik ? (
        <View style={[styles.alan, styles.seciliAlan]}>
          <Icon name="mezuniyet" size={18} color={Colors.textMuted} strokeWidth={1.8} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${deger} · değiştirmek için dokun`}
            onPress={() => setAcik(true)}
            style={styles.esnek}>
            <Text style={styles.seciliYazi} numberOfLines={1}>
              {deger}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Üniversiteyi kaldır"
            hitSlop={10}
            onPress={() => sec('')}>
            <Icon name="x" size={16} color={Colors.textMuted} strokeWidth={2} />
          </Pressable>
        </View>
      ) : (
        <View style={[styles.alan, acik && styles.alanAcik]}>
          <Icon name="search" size={16} color={Colors.textFaint} strokeWidth={2} />
          <TextInput
            value={arama}
            onChangeText={(t) => {
              setArama(t);
              setAcik(true);
            }}
            onFocus={() => setAcik(true)}
            onBlur={yaziKutusundanCikti}
            placeholder="Üniversiteni ara"
            placeholderTextColor={Colors.textFaint}
            maxLength={80}
            style={styles.girdi}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={acik ? 'Listeyi kapat' : 'Listeyi aç'}
            hitSlop={10}
            onPress={() => setAcik((a) => !a)}
            style={acik && styles.okAcik}>
            <Icon name="chevron-down" size={18} color={Colors.textMuted} strokeWidth={2} />
          </Pressable>
        </View>
      )}

      {acik && (
        <ScrollView
          style={styles.liste}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          onTouchStart={() => {
            iceriBasiliyor.current = true;
          }}>
          {sonuclar.length === 0 && !elleEklenebilir ? (
            <Text style={styles.bos}>Eşleşen üniversite yok.</Text>
          ) : (
            sonuclar.map((u) => (
              <Pressable
                key={u}
                accessibilityRole="button"
                onPress={() => sec_(u)}
                style={({ pressed }) => [styles.satir, pressed && styles.basili]}>
                <Text
                  style={[styles.satirYazi, u === deger && styles.satirSecili]}
                  numberOfLines={1}>
                  {u}
                </Text>
                {u === deger && (
                  <Icon name="check" size={16} color={Colors.primary} strokeWidth={2.4} />
                )}
              </Pressable>
            ))
          )}

          {/*
            Elle yazma EN ALTTA: listede eslesme varken ustte durunca
            "bogazici" yazan biri listedekini degil kendi yazdigini
            seciyordu ve eslesme kayboluyordu.
          */}
          {elleEklenebilir && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${yazilan} olarak yaz`}
              onPress={() => sec_(yazilan)}
              style={({ pressed }) => [styles.satir, styles.elleSatiri, pressed && styles.basili]}>
              <Icon name="plus" size={16} color={Colors.primary} strokeWidth={2.4} />
              <Text style={styles.elleYazi} numberOfLines={1}>
                Listede yok: “{yazilan}” olarak yaz
              </Text>
            </Pressable>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  kutu: { marginBottom: Spacing.lg },
  esnek: { flex: 1 },
  basili: { opacity: 0.75 },
  etiket: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  alan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    height: 48,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderInput, // giris kutusu: >= 3:1 (WCAG 1.4.11)
    backgroundColor: Colors.surface,
  },
  alanAcik: { borderColor: Colors.primary },
  seciliAlan: { gap: Spacing.md },
  seciliYazi: {
    fontSize: FontSize.body,
    color: Colors.text,
  },
  girdi: {
    flex: 1,
    fontSize: FontSize.body,
    color: Colors.text,
  },
  okAcik: { transform: [{ rotate: '180deg' }] },
  liste: {
    maxHeight: 280,
    marginTop: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  satir: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: 40,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
  },
  satirYazi: {
    flex: 1,
    fontSize: FontSize.small,
    color: Colors.text,
  },
  satirSecili: { fontWeight: '700' },
  elleSatiri: { backgroundColor: Colors.primarySoft, marginTop: Spacing.xs },
  elleYazi: {
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
