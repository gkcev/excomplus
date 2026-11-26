import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Metin as Text } from '@/components/temel';

import { Icon, type IconName } from '@/components/icon';
import { aramaIcinSade } from '@/components/search-box';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';

/**
 * SERBEST YAZILAN KISA LISTE (onceki sirketler, sevdigi sanatcilar)
 * ------------------------------------------------------------
 * Yaz, "Ekle"ye bas ya da yazarken cikan oneriye dokun. Oneriler
 * uyelerin yazdiklari (en kalabalik once); boylece ayni sey iki ayri
 * yazilisla dagilmaz. Listede olmayan da eklenebilir.
 */
export function SerbestListeSecici({
  secilenler,
  degistir,
  oneriler,
  etiket,
  yardim,
  ipucu,
  ikon,
  enCok,
  ogeAdi,
}: {
  secilenler: string[];
  degistir: (yeni: string[]) => void;
  /** Uyelerin yazdiklari ve kac kisinin yazdigi */
  oneriler: { ad: string; kisi: number }[];
  etiket: string;
  yardim: string;
  ipucu: string;
  ikon: IconName;
  enCok: number;
  /** Erisilebilirlik metinleri icin: "şirket", "sanatçı" */
  ogeAdi: string;
}) {
  const [yazilan, setYazilan] = useState('');
  const dolu = secilenler.length >= enCok;
  const varMi = (ad: string) => secilenler.some((s) => aramaIcinSade(s) === aramaIcinSade(ad));

  const ekle = (ad: string) => {
    const temiz = ad.trim().replace(/\s+/g, ' ');
    if (temiz.length < 2 || temiz.length > 60 || dolu || varMi(temiz)) return;
    degistir([...secilenler, temiz]);
    setYazilan('');
  };

  const aranan = aramaIcinSade(yazilan);
  const eslesenler =
    aranan.length < 2
      ? []
      : oneriler.filter((o) => aramaIcinSade(o.ad).includes(aranan) && !varMi(o.ad)).slice(0, 5);

  return (
    <View style={styles.kutu}>
      <View style={styles.ust}>
        <Text style={styles.etiket}>{etiket}</Text>
        <Text style={styles.sayac}>
          {secilenler.length} / {enCok}
        </Text>
      </View>
      <Text style={styles.yardim}>{yardim}</Text>

      {secilenler.length > 0 && (
        <View style={styles.hapler}>
          {secilenler.map((s) => (
            <Pressable
              key={s}
              accessibilityRole="button"
              accessibilityLabel={`${s} ${ogeAdi} listesinden kaldır`}
              onPress={() => degistir(secilenler.filter((x) => x !== s))}
              style={({ pressed }) => [styles.hap, pressed && styles.basili]}>
              <Text style={styles.hapYazi}>{s}</Text>
              <Icon name="x" size={14} color={Colors.textMuted} strokeWidth={2.2} />
            </Pressable>
          ))}
        </View>
      )}

      {dolu ? (
        <Text style={styles.yardim}>Sınıra geldin. Yeni eklemek için önce birini kaldır.</Text>
      ) : (
        <View style={styles.girdiSatiri}>
          <View style={styles.girdiKutusu}>
            <Icon name={ikon} size={18} color={Colors.textMuted} strokeWidth={1.9} />
            <TextInput
              value={yazilan}
              onChangeText={setYazilan}
              placeholder={ipucu}
              placeholderTextColor={Colors.textFaint}
              accessibilityLabel={etiket}
              maxLength={60}
              returnKeyType="done"
              onSubmitEditing={() => ekle(yazilan)}
              style={styles.girdi}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${ogeAdi} ekle`}
            onPress={() => ekle(yazilan)}
            style={({ pressed }) => [styles.ekle, pressed && styles.basili]}>
            <Text style={styles.ekleYazi}>Ekle</Text>
          </Pressable>
        </View>
      )}

      {eslesenler.length > 0 && (
        <View style={styles.hapler}>
          {eslesenler.map((o) => (
            <Pressable
              key={o.ad}
              accessibilityRole="button"
              accessibilityLabel={`${o.ad} ekle`}
              onPress={() => ekle(o.ad)}
              style={({ pressed }) => [styles.oneri, pressed && styles.basili]}>
              <Text style={styles.oneriYazi}>{o.ad}</Text>
              <Text style={styles.oneriSayi}>{o.kisi} kişi</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  kutu: { gap: Spacing.sm },
  ust: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  etiket: { fontSize: FontSize.small, fontWeight: '700', color: Colors.text },
  sayac: { fontSize: FontSize.caption, fontWeight: '600', color: Colors.textMuted },
  yardim: { fontSize: FontSize.caption, lineHeight: 18, color: Colors.textMuted },
  hapler: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  hap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 36,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.pill,
    backgroundColor: Colors.primarySoft,
  },
  hapYazi: { fontSize: FontSize.small, fontWeight: '600', color: Colors.text },
  basili: { opacity: 0.7 },
  girdiSatiri: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  girdiKutusu: {
    flex: 1,
    minWidth: 0,
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
  girdi: { flex: 1, minWidth: 0, fontSize: FontSize.body, color: Colors.text, paddingVertical: 0 },
  ekle: {
    minHeight: 48,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
    borderRadius: Radius.pill,
    backgroundColor: Colors.primary,
  },
  ekleYazi: { fontSize: FontSize.small, fontWeight: '700', color: Colors.white },
  oneri: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 36,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  oneriYazi: { fontSize: FontSize.small, fontWeight: '600', color: Colors.text },
  oneriSayi: { fontSize: FontSize.caption, color: Colors.textMuted },
});
