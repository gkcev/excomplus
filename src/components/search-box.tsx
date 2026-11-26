import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';

/** Listelerin ustundeki arama kutusu */
export function AramaKutusu({
  deger,
  degistir,
  ipucu = 'Ara',
  odakla = false,
}: {
  deger: string;
  degistir: (yeni: string) => void;
  ipucu?: string;
  /** Ekran acilinca imlec kutuda, klavye acik (13 Kasim 2026) */
  odakla?: boolean;
}) {
  return (
    <View style={styles.kutu}>
      <Icon name="search" size={19} color={Colors.textFaint} />
      <TextInput
        value={deger}
        onChangeText={degistir}
        placeholder={ipucu}
        placeholderTextColor={Colors.textFaint}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        autoFocus={odakla}
        style={styles.girdi}
      />
      {deger !== '' && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Aramayı temizle"
          onPress={() => degistir('')}
          hitSlop={8}>
          <Icon name="x" size={18} color={Colors.textFaint} strokeWidth={2} />
        </Pressable>
      )}
    </View>
  );
}

/** Turkce harfleri de dogru karsilastiran basit arama yardimcisi */
export function eslesiyorMu(metin: string, arama: string) {
  // Bos aramada her sey uyar; binlerce satirda bosuna donusturme yapilmasin
  if (arama.trim() === '') return true;
  return aramaIcinSade(metin).includes(aramaIcinSade(arama));
}

/**
 * Aramada Turkce harfler fark etmesin: "ozer" Özer'i, "gokce"
 * Gökçe'yi bulsun (12 Ekim 2026 test turu). Telefon klavyesinde
 * Turkce harf yazmayan cok; Ex Ara zaten boyle arıyordu, diger
 * listeler bulamiyordu.
 */
export function aramaIcinSade(metin: string) {
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
 * Turkce alfabe sirasi (Ç, Ğ, İ, Ö, Ş, Ü dogru yerde).
 * localeCompare her cagrida sira kurallarini yeniden kuruyordu;
 * bu bir kez kuruluyor (performans, 9 Ekim 2026).
 */
export const TR_SIRALAYICI = new Intl.Collator('tr', { sensitivity: 'base' });

const styles = StyleSheet.create({
  kutu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    height: 48,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderInput, // giris kutusu: >= 3:1 (WCAG 1.4.11)
    // 14-16 px yuvarlak (Ex Ara revizyonu, 16 Ekim 2026)
    borderRadius: Radius.lg,
  },
  girdi: {
    flex: 1,
    height: '100%',
    fontSize: FontSize.body,
    color: Colors.text,
  },
});
