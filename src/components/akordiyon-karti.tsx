import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Metin as Text } from '@/components/temel';

import { Icon, type IconName } from '@/components/icon';
import { Colors, FontSize, Radius, Spacing, Durum } from '@/constants/theme';

/**
 * ACILIR KAPANIR KART (Profili Duzenle, 24 Ekim 2026)
 * ------------------------------------------------------------
 * Baslik satirina dokununca icerik acilir. Hangi kartin acik
 * oldugunu ust ekran tutar (ayni anda tek kart). Kart kapaninca
 * icerik ekrandan kalkar ama degerler ust ekranda durdugu icin
 * yazilanlar kaybolmaz.
 *
 * Sagda kucuk bir rozet: "3 seçili" ya da duzeltilecek alan varsa
 * kirmizi "Kontrol et" (kapali kartta hata gozden kacmasin).
 */
export function AkordiyonKarti({
  baslik,
  aciklama,
  ikon,
  acik,
  degistir,
  rozet,
  hataVar = false,
  tamam = false,
  children,
}: {
  baslik: string;
  aciklama: string;
  ikon: IconName;
  acik: boolean;
  degistir: () => void;
  rozet?: string;
  hataVar?: boolean;
  /** Bolum dolu: ikon yerine yesil tik (25 Ekim 2026) */
  tamam?: boolean;
  children: ReactNode;
}) {
  return (
    <View style={[styles.kart, acik && styles.kartAcik, hataVar && styles.kartHatali]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: acik }}
        accessibilityLabel={tamam ? `${baslik}, tamamlandı` : baslik}
        accessibilityHint={acik ? 'Bölümü kapatır' : 'Bölümü açar'}
        onPress={degistir}
        style={({ pressed }) => [styles.baslikSatiri, pressed && styles.basili]}>
        <View style={[styles.ikonKutusu, tamam && styles.ikonKutusuTamam]}>
          {tamam ? (
            <Icon name="check" size={20} color={Durum.onaylandi.yazi} strokeWidth={2.8} />
          ) : (
            <Icon name={ikon} size={18} color={Colors.text} strokeWidth={1.9} />
          )}
        </View>
        <View style={styles.yazilar}>
          <Text style={styles.baslik}>{baslik}</Text>
          <Text style={styles.aciklama} numberOfLines={acik ? undefined : 1}>
            {aciklama}
          </Text>
        </View>
        {hataVar ? (
          <Text style={styles.hataRozeti}>Kontrol et</Text>
        ) : rozet ? (
          <Text style={styles.rozet}>{rozet}</Text>
        ) : null}
        <View style={acik ? styles.okYukari : undefined}>
          <Icon name="chevron-down" size={18} color={Colors.textMuted} strokeWidth={2} />
        </View>
      </Pressable>
      {acik && <View style={styles.icerik}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  kart: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.xl,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
  },
  kartAcik: {
    backgroundColor: Colors.background,
    borderColor: Colors.borderInput,
  },
  kartHatali: { borderColor: Colors.heart },
  baslikSatiri: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: 64,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  basili: { opacity: 0.7 },
  ikonKutusu: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.heartSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ikonKutusuTamam: { backgroundColor: Durum.onaylandi.zemin },
  yazilar: { flex: 1, minWidth: 0 },
  baslik: { fontSize: FontSize.body, fontWeight: '700', color: Colors.text },
  aciklama: {
    fontSize: FontSize.caption,
    lineHeight: 17,
    color: Colors.textMuted,
    marginTop: 2,
  },
  rozet: {
    fontSize: FontSize.caption,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  hataRozeti: {
    fontSize: FontSize.caption,
    fontWeight: '700',
    color: Colors.heart,
  },
  okYukari: { transform: [{ rotate: '180deg' }] },
  icerik: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.lg,
  },
});
