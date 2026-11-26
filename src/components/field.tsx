import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Metin as Text } from '@/components/temel';

import { Icon, type IconName } from '@/components/icon';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';

/** Formlardaki yazi kutusu */
/**
 * OTOMATIK DOLDURMA
 * ------------------------------------------------------------
 * iOS'un "guclu sifre oner" ozelligi, alanlarin ne oldugunu
 * bilmeden dogru calismiyor. Ozellikle sunu bilmesi gerekiyor:
 *  - hangisi kullanici adi (e-posta)
 *  - hangisi YENI sifre, hangisi MEVCUT sifre
 *
 * Bunlar soylenmediginde iOS uretttigi sifreyi anahtar zincirine
 * kaydederken formla dogru eslestiremiyor; kisi kayit oluyor ama
 * giriste "sifre hatali" aliyor.
 */
type OtomatikTur = 'eposta' | 'yeni-sifre' | 'sifre' | 'telefon' | 'ad';

const IOS_TURU: Record<OtomatikTur, 'emailAddress' | 'newPassword' | 'password' | 'telephoneNumber' | 'name'> = {
  eposta: 'emailAddress',
  'yeni-sifre': 'newPassword',
  sifre: 'password',
  telefon: 'telephoneNumber',
  ad: 'name',
};

const ANDROID_TURU: Record<OtomatikTur, 'email' | 'new-password' | 'current-password' | 'tel' | 'name'> = {
  eposta: 'email',
  'yeni-sifre': 'new-password',
  sifre: 'current-password',
  telefon: 'tel',
  ad: 'name',
};

export function Alan({
  etiket,
  deger,
  degistir,
  ipucu,
  ikon,
  gizli,
  klavye,
  cokSatir,
  zorunlu,
  yardim,
  hata,
  klavyeTipi,
  enCok,
  otomatik,
  kilitli,
}: {
  etiket: string;
  deger: string;
  degistir: (yeni: string) => void;
  ipucu?: string;
  ikon?: IconName;
  gizli?: boolean;
  klavye?: 'email-address' | 'default';
  cokSatir?: boolean;
  /** Doldurulmasi zorunlu alanlarda etiketin yanina yildiz koyar */
  zorunlu?: boolean;
  /** Kutunun altinda gorunen kucuk aciklama */
  yardim?: string;
  /** Doluysa kutu kirmizi cerceveli olur ve altinda sebebi yazar */
  hata?: string | null;
  /** Telefon ve sayi alanlarinda dogru klavye acilsin diye */
  klavyeTipi?: 'phone-pad' | 'number-pad';
  /** Yazilabilecek en fazla karakter */
  enCok?: number;
  /**
   * Alanin ne oldugunu isletim sistemine soyler; sifre
   * yoneticileri buna gore davranir. Bos birakilirsa iOS
   * tahmin etmeye calisir ve yanlis tahmin edebilir.
   */
  otomatik?: OtomatikTur;
  /** Yalnizca gosterilir, degistirilemez (ornek: giris e-postasi) */
  kilitli?: boolean;
}) {
  // Sifre alanlarinda goz ikonuyla acip kapatabilmek icin
  const [gorunur, setGorunur] = useState(false);

  return (
    <View style={styles.grup}>
      <Text style={styles.etiket}>
        {etiket}
        {zorunlu && <Text style={styles.yildiz}> *</Text>}
      </Text>
      <View
        style={[styles.kutu, cokSatir && styles.kutuUzun, hata ? styles.kutuHatali : null]}>
        {ikon && <Icon name={ikon} size={20} color={Colors.textFaint} />}
        <TextInput
          value={deger}
          onChangeText={degistir}
          placeholder={ipucu}
          placeholderTextColor={Colors.textFaint}
          secureTextEntry={gizli && !gorunur}
          keyboardType={klavyeTipi ?? klavye ?? 'default'}
          maxLength={enCok}
          autoCapitalize={klavye === 'email-address' || gizli ? 'none' : 'sentences'}
          autoCorrect={!gizli}
          textContentType={otomatik ? IOS_TURU[otomatik] : undefined}
          autoComplete={otomatik ? ANDROID_TURU[otomatik] : undefined}
          multiline={cokSatir}
          editable={!kilitli}
          style={[styles.girdi, cokSatir && styles.girdiUzun, kilitli && styles.girdiKilitli]}
        />

        {/* Sifreyi goster/gizle */}
        {gizli && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={gorunur ? 'Şifreyi gizle' : 'Şifreyi göster'}
            onPress={() => setGorunur((a) => !a)}
            hitSlop={8}
            style={({ pressed }) => pressed && styles.basili}>
            <Icon
              name={gorunur ? 'eye-off' : 'eye'}
              size={20}
              color={Colors.textMuted}
              strokeWidth={1.8}
            />
          </Pressable>
        )}
      </View>

      {hata ? (
        <Text style={styles.hataYazisi}>{hata}</Text>
      ) : yardim !== undefined ? (
        <Text style={styles.yardim}>{yardim}</Text>
      ) : null}
    </View>
  );
}

/** Formlardaki acilir liste (sehir secimi gibi) */
export function SecimAlani({
  etiket,
  deger,
  secenekler,
  sec,
  ikon,
}: {
  etiket: string;
  deger: string;
  secenekler: string[];
  sec: (yeni: string) => void;
  ikon?: IconName;
}) {
  const [acik, setAcik] = useState(false);

  return (
    <View style={styles.grup}>
      <Text style={styles.etiket}>{etiket}</Text>

      <Pressable
        accessibilityRole="button"
        onPress={() => setAcik((a) => !a)}
        style={styles.kutu}>
        {ikon && <Icon name={ikon} size={20} color={Colors.textFaint} />}
        <Text style={[styles.girdi, styles.secilen]}>{deger}</Text>
        <View style={acik && styles.donmus}>
          <Icon name="chevron-down" size={20} color={Colors.textMuted} />
        </View>
      </Pressable>

      {acik && (
        <View style={styles.liste}>
          {secenekler.length === 0 && (
            <Text style={styles.bosListe}>Seçenek yok.</Text>
          )}
          {secenekler.map((secenek) => {
            const secili = secenek === deger;
            return (
              <Pressable
                key={secenek}
                accessibilityRole="button"
                onPress={() => {
                  sec(secenek);
                  setAcik(false);
                }}
                style={[styles.listeSatiri, secili && styles.listeSatiriSecili]}>
                <Text style={[styles.listeYazisi, secili && styles.listeYazisiSecili]}>
                  {secenek}
                </Text>
                {secili && (
                  <Icon name="check" size={16} color={Colors.primary} strokeWidth={2.6} />
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  girdiKilitli: { color: Colors.textMuted },
  grup: {
    gap: Spacing.sm,
  },
  basili: { opacity: 0.6 },
  yildiz: {
    color: Colors.heart,
    fontWeight: '700',
  },
  etiket: {
    fontSize: FontSize.small,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  kutu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: 52,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderInput, // giris kutusu: >= 3:1 (WCAG 1.4.11)
    borderRadius: Radius.md,
  },
  kutuHatali: {
    borderColor: Colors.heart,
    backgroundColor: Colors.heartSoft,
  },
  hataYazisi: {
    fontSize: FontSize.caption,
    lineHeight: 18,
    color: Colors.heart,
  },
  kutuUzun: {
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
  },
  girdi: {
    flex: 1,
    fontSize: FontSize.body,
    color: Colors.text,
    paddingVertical: Spacing.md,
  },
  girdiUzun: {
    minHeight: 72,
    textAlignVertical: 'top',
    paddingVertical: 0,
  },
  secilen: {
    fontWeight: '600',
  },
  yardim: {
    fontSize: FontSize.caption,
    lineHeight: 18,
    color: Colors.textFaint,
  },
  donmus: {
    transform: [{ rotate: '180deg' }],
  },
  liste: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  bosListe: {
    fontSize: FontSize.small,
    color: Colors.textMuted,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  listeSatiri: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
  },
  listeSatiriSecili: {
    backgroundColor: Colors.primarySoft,
  },
  listeYazisi: {
    fontSize: FontSize.body,
    color: Colors.text,
  },
  listeYazisiSecili: {
    fontWeight: '700',
    color: Colors.primary,
  },
});
