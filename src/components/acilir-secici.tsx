import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Metin as Text } from '@/components/temel';

import { Icon, type IconName } from '@/components/icon';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';

export type Secenek = { deger: string; ad: string; ikon?: IconName };

/**
 * ACILIR SECICI (combobox)
 * ------------------------------------------------------------
 * Suzgecler once yatay bir serit halindeydi; kategori sayisi
 * artinca serit ekranin disina tasiyor ve sondakiler hic
 * gorulmuyordu. Acilir liste hepsini ayni anda gosteriyor ve
 * secili olan buton uzerinde yaziyor.
 */
export function AcilirSecici({
  deger,
  sec,
  secenekler,
  ikon,
  genislik,
  simge,
  buyuk,
}: {
  /** Diger 38 px'lik filtre dugmeleriyle ayni boy (Ex Ara arac satiri) */
  buyuk?: boolean;
  /**
   * Verilirse buton yazisiz, kare bir ikon butonu olur (ornek:
   * Bilen Var mi?'daki suzgec). Ilk secenek disinda bir sey
   * seciliyse buton lacivert dolar.
   */
  simge?: { ikon: IconName; etiket: string };
  deger: string;
  sec: (yeni: string) => void;
  secenekler: Secenek[];
  /** Butonun solundaki ikon; secenegin kendi ikonu varsa o kazanir */
  ikon?: IconName;
  genislik?: number;
}) {
  const [acik, setAcik] = useState(false);
  const secili = secenekler.find((s) => s.deger === deger) ?? secenekler[0];

  const aktif = deger !== (secenekler[0]?.deger ?? '');

  return (
    <>
      {simge ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${simge.etiket}: ${secili?.ad ?? ''}`}
          onPress={() => setAcik(true)}
          style={({ pressed }) => [
            styles.simgeButon,
            aktif && styles.simgeButonAktif,
            pressed && styles.basili,
          ]}>
          <Icon
            name={simge.ikon}
            size={19}
            color={aktif ? Colors.white : Colors.text}
            strokeWidth={1.9}
          />
        </Pressable>
      ) : (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${secili?.ad ?? ''} · değiştirmek için dokun`}
        onPress={() => setAcik(true)}
        style={({ pressed }) => [
          styles.buton,
          genislik !== undefined && { width: genislik },
          buyuk && styles.butonBuyuk,
          pressed && styles.basili,
        ]}>
        {(secili?.ikon ?? ikon) !== undefined && (
          <Icon
            name={(secili?.ikon ?? ikon) as IconName}
            size={14}
            color={Colors.text}
            strokeWidth={2}
          />
        )}
        <Text style={[styles.butonYazisi, buyuk && styles.butonYazisiBuyuk]} numberOfLines={1}>
          {secili?.ad ?? ''}
        </Text>
        <Icon name="chevron-down" size={15} color={Colors.text} strokeWidth={2} />
      </Pressable>
      )}

      <Modal visible={acik} transparent animationType="fade" onRequestClose={() => setAcik(false)}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kapat"
          onPress={() => setAcik(false)}
          style={styles.perde}>
          <View style={styles.pencere}>
            <ScrollView>
              {secenekler.map((s) => {
                const bu = s.deger === deger;
                return (
                  <Pressable
                    key={s.deger}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: bu }}
                    onPress={() => {
                      sec(s.deger);
                      setAcik(false);
                    }}
                    style={({ pressed }) => [styles.satir, pressed && styles.basiliSatir]}>
                    {s.ikon !== undefined && (
                      <Icon
                        name={s.ikon}
                        size={18}
                        color={bu ? Colors.primary : Colors.textMuted}
                        strokeWidth={1.9}
                      />
                    )}
                    <Text style={[styles.satirYazisi, bu && styles.satirSecili]}>{s.ad}</Text>
                    {bu && <Icon name="check" size={17} color={Colors.primary} strokeWidth={2.4} />}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  simgeButon: {
    width: 46,
    height: 46,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  simgeButonAktif: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  buton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  basili: { opacity: 0.8 },
  butonBuyuk: { height: 38, paddingVertical: 0 },
  butonYazisiBuyuk: { fontSize: FontSize.small },
  butonYazisi: {
    fontSize: FontSize.caption,
    fontWeight: '700',
    color: Colors.text,
  },
  perde: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    backgroundColor: 'rgba(7, 24, 45, 0.35)',
  },
  pencere: {
    width: '100%',
    maxWidth: 360,
    maxHeight: '70%',
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
    backgroundColor: Colors.background,
  },
  satir: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  basiliSatir: { backgroundColor: Colors.subtle },
  satirYazisi: {
    flex: 1,
    fontSize: FontSize.body,
    color: Colors.text,
  },
  satirSecili: { fontWeight: '700', color: Colors.primary },
});
