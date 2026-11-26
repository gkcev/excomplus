import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { Metin as Text } from '@/components/temel';

import { Icon, type IconName } from '@/components/icon';
import { Colors, FontSize, Marka, Radius, Spacing } from '@/constants/theme';

/**
 * EXCOM BUTONU
 * ------------------------------------------------------------
 * Uygulamada elli kadar elle yazilmis buton stili birikmisti;
 * on iki ayri yukseklik vardi. Sebebi tutarsizlik degil, bu
 * bilesenin yetersizligiydi: ikon alamiyordu, boyut secilemiyordu.
 * Ikonlu ya da kucuk bir buton gereken her yerde sifirdan
 * yazilmis. Artik hepsi buradan cikiyor.
 *
 * TUR
 *   birincil  Lacivert dolu. Sayfanin ana eylemi; sayfada bir tane.
 *   ikincil   Beyaz zemin, ince cerceve. Yan eylemler.
 *   sessiz    Yalnizca yazi. Vazgec, temizle.
 *   tehlike   Mercan. Sil, cikar, engelle.
 *   vurgu     Turuncu dolu, tam yuvarlak. YALNIZCA seftali
 *             zeminli tanitim kartinin icindeki ana eylem icin.
 *             Seftali uzerinde lacivert buton sonuyor; onaylanan
 *             Ex'e Sor tasariminda da bu buton turuncu. Sayfanin
 *             normal butonlari icin kullanilmaz.
 *
 * BOYUT
 *   buyuk 52   Sayfa dibindeki ana buton
 *   orta  44   Form ici, kart alti
 *   kucuk 36   Kart ici islemler
 *
 * Marka kurali: mercan ve kehribar VURGU renkleridir. Ana
 * butonlar her zaman lacivert; mercan yalnizca "tehlike" turunde.
 */
export type ButonTuru = 'birincil' | 'ikincil' | 'sessiz' | 'tehlike' | 'vurgu';
export type ButonBoyutu = 'buyuk' | 'orta' | 'kucuk';

type Props = {
  label: string;
  onPress?: () => void;
  tur?: ButonTuru;
  boyut?: ButonBoyutu;
  /** Yazinin solunda gorunur */
  ikon?: IconName;
  /** Ikonu yazinin sagina alir (ornek: ileri oku) */
  ikonSagda?: boolean;
  /**
   * Sagdaki ikonla BIRLIKTE solda duran ikon. "ikon" tek basina
   * bir yana geciyor; canli yayin tusunda ise solda yayin
   * simgesi, sagda ileri oku birlikte gerekiyor.
   */
  solIkon?: IconName;
  /** false ise buton icerigi kadar yer kaplar */
  genis?: boolean;
  /**
   * Islem surerken kapatilir. Kapali degilken kisi ust uste
   * basabiliyor ve ayni istek birden cok kez gidiyordu.
   */
  disabled?: boolean;
  style?: ViewStyle;
  /** ESKI KULLANIM - yeni ekranlarda "tur" kullan */
  variant?: 'dolu' | 'cerceveli';
};

const YUKSEKLIK: Record<ButonBoyutu, number> = {
  buyuk: 52,
  orta: 44,
  kucuk: 36,
};

const YAZI_BOYU: Record<ButonBoyutu, number> = {
  buyuk: FontSize.body + 1,
  orta: FontSize.small + 1,
  kucuk: FontSize.caption,
};

const IKON_BOYU: Record<ButonBoyutu, number> = {
  buyuk: 19,
  orta: 17,
  kucuk: 15,
};

export function AppButton({
  label,
  onPress,
  tur,
  boyut = 'buyuk',
  ikon,
  ikonSagda = false,
  solIkon,
  genis = true,
  disabled = false,
  style,
  variant,
}: Props) {
  /* Eski "variant" hala yirmi kadar ekranda kullaniliyor */
  const gercekTur: ButonTuru =
    tur ?? (variant === 'cerceveli' ? 'ikincil' : 'birincil');

  const yaziRengi =
    gercekTur === 'birincil' || gercekTur === 'vurgu'
      ? Colors.white
      : gercekTur === 'tehlike'
        ? Colors.heart
        : Colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.taban,
        { height: YUKSEKLIK[boyut] },
        boyut === 'kucuk' ? styles.darPay : styles.genisPay,
        genis ? styles.tamGenislik : styles.icerikKadar,
        styles[gercekTur],
        pressed && styles.basili,
        disabled && styles.pasif,
        style,
      ]}>
      {solIkon !== undefined && (
        <Icon name={solIkon} size={IKON_BOYU[boyut]} color={yaziRengi} strokeWidth={2} />
      )}
      {ikon !== undefined && !ikonSagda && (
        <Icon name={ikon} size={IKON_BOYU[boyut]} color={yaziRengi} strokeWidth={2} />
      )}

      <Text style={[styles.yazi, { fontSize: YAZI_BOYU[boyut], color: yaziRengi }]}>
        {label}
      </Text>

      {ikon !== undefined && ikonSagda && (
        <Icon name={ikon} size={IKON_BOYU[boyut]} color={yaziRengi} strokeWidth={2} />
      )}
    </Pressable>
  );
}

/**
 * Yan yana duran butonlar. Aralarindaki bosluk hep ayni olsun ve
 * her ekranda ayri bir satir stili yazilmasin diye.
 */
export function ButonSatiri({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.satir, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  taban: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    /* Rehber (Ekim 2026): buton tam yuvarlak */
    borderRadius: Radius.pill,
  },
  genisPay: { paddingHorizontal: Spacing.xl },
  darPay: { paddingHorizontal: Spacing.md },
  tamGenislik: { alignSelf: 'stretch' },
  icerikKadar: { alignSelf: 'flex-start' },

  birincil: { backgroundColor: Colors.primary },
  /* Rehber: ikincil buton beyaz, ince cerceve */
  ikincil: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sessiz: { backgroundColor: 'transparent' },
  vurgu: {
    backgroundColor: Marka.kesisim,
    borderRadius: Radius.pill,
  },
  tehlike: {
    backgroundColor: Colors.surface,
    borderWidth: 1.4,
    borderColor: Colors.heart,
  },

  basili: { opacity: 0.82 },
  pasif: { opacity: 0.55 },
  yazi: { fontWeight: '700' },

  satir: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});
