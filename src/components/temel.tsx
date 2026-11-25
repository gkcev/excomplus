/**
 * Temel yapi taslari: Metin, Dugme, Cip, Avatar, Logo, Ekran, UstBar, Kart.
 * Gorunum ExCom ile ayni dil: krem zemin, beyaz kart, lacivert + turuncu.
 */

import { Image } from 'expo-image';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/icon';
import { KISI_FOTOLARI } from '@/data/fotolar';
import { AVATAR_PASTELLERI, Bosluk, Colors, icerikOrtala, kartGolgesi, Kose, Marka, Yazi } from '@/constants/theme';

/* ---------- Metin: Outfit, kalinliga gore dogru dosya ---------- */

const AILE: Record<string, string> = {
  '300': 'Outfit_300Light',
  '400': 'Outfit_400Regular',
  normal: 'Outfit_400Regular',
  '500': 'Outfit_500Medium',
  '600': 'Outfit_600SemiBold',
  '700': 'Outfit_700Bold',
  bold: 'Outfit_700Bold',
  '800': 'Outfit_800ExtraBold',
};

export function Metin({ style, ...p }: TextProps) {
  const duz = StyleSheet.flatten(style) as TextStyle | undefined;
  const kalinlik = String(duz?.fontWeight ?? '400');
  return (
    <Text
      {...p}
      style={[
        { color: Colors.text, ...Yazi.govde },
        style,
        { fontFamily: AILE[kalinlik] ?? 'Outfit_400Regular', fontWeight: undefined },
      ]}
    />
  );
}

/* ---------- Dugme ---------- */

type DugmeTuru = 'koyu' | 'turuncu' | 'cizgili' | 'hafif';

export function Dugme({
  baslik,
  onPress,
  tur = 'koyu',
  kucuk,
  pasif,
  ikon,
  style,
}: {
  baslik: string;
  onPress?: () => void;
  tur?: DugmeTuru;
  kucuk?: boolean;
  pasif?: boolean;
  ikon?: IconName;
  style?: StyleProp<ViewStyle>;
}) {
  const zemin =
    tur === 'koyu' ? Colors.primary : tur === 'turuncu' ? Colors.accent : tur === 'hafif' ? Marka.seftali : 'transparent';
  const yazi = tur === 'koyu' || tur === 'turuncu' ? Colors.white : tur === 'cizgili' ? Colors.accent : Colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={pasif}
      onPress={onPress}
      style={({ pressed }) => [
        s.dugme,
        kucuk && s.dugmeKucuk,
        { backgroundColor: zemin, opacity: pasif ? 0.4 : pressed ? 0.85 : 1 },
        tur === 'cizgili' && { borderWidth: 1.5, borderColor: Colors.accent },
        style,
      ]}>
      {ikon && <Icon name={ikon} size={kucuk ? 16 : 18} color={yazi} />}
      <Metin style={{ color: yazi, fontSize: kucuk ? 14 : 16, fontWeight: '600' }}>{baslik}</Metin>
    </Pressable>
  );
}

/* ---------- Cip (ilgi alani etiketi) ---------- */

export function Cip({
  metin,
  simge,
  secili,
  onPress,
}: {
  metin: string;
  simge?: string;
  secili?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'checkbox' : undefined}
      accessibilityState={onPress ? { checked: !!secili } : undefined}
      style={[s.cip, secili && { backgroundColor: Marka.turuncu, borderColor: Marka.turuncu }]}>
      {simge && <Metin style={{ fontSize: 14 }}>{simge}</Metin>}
      <Metin style={{ ...Yazi.ikincil, fontWeight: '500', color: secili ? Colors.white : Colors.text }}>{metin}</Metin>
    </Pressable>
  );
}

/* ---------- Avatar: bas harfli pastel daire (prototipte foto yok) ---------- */

export function Avatar({ ad, boyut = 44, id, foto }: { ad: string; boyut?: number; id?: string; foto?: string }) {
  // Fotograf: verilen (uyenin kendi fotosu) ya da ornek kisinin hazir fotosu
  const kaynak = foto ? { uri: foto } : id ? KISI_FOTOLARI[id] : undefined;
  if (kaynak) {
    return <Image source={kaynak} style={{ width: boyut, height: boyut, borderRadius: boyut / 2 }} contentFit="cover" />;
  }
  const anahtar = (id ?? ad).split('').reduce((t, c) => t + c.charCodeAt(0), 0);
  const zemin = AVATAR_PASTELLERI[anahtar % AVATAR_PASTELLERI.length];
  const harfler = ad
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toLocaleUpperCase('tr');
  return (
    <View style={{ width: boyut, height: boyut, borderRadius: boyut / 2, backgroundColor: zemin, alignItems: 'center', justifyContent: 'center' }}>
      <Metin style={{ fontSize: boyut * 0.36, fontWeight: '700' }}>{harfler}</Metin>
    </View>
  );
}

/** Ust uste binmis kucuk avatarlar + "+18" */
export function AvatarYigini({ adlar, toplam, idler }: { adlar: string[]; toplam: number; idler?: string[] }) {
  const goster = adlar.slice(0, 3);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {goster.map((a, i) => (
        <View key={a + i} style={{ marginLeft: i ? -8 : 0, borderWidth: 2, borderColor: Colors.white, borderRadius: 20 }}>
          <Avatar ad={a} id={idler?.[i]} boyut={24} />
        </View>
      ))}
      {toplam > goster.length && (
        <Metin style={{ ...Yazi.etiket, marginLeft: 6, color: Colors.textMuted }}>+{toplam - goster.length}</Metin>
      )}
    </View>
  );
}

/* ---------- Logo: ExCom marka dosyasi aynen + "Plus" rozeti ---------- */

const YATAY_LOGO = require('@/assets/images/marka/excom-logo-renkli.webp');

export function Logo({ genislik = 110 }: { genislik?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} accessibilityLabel="ExCom Plus">
      <Image source={YATAY_LOGO} style={{ width: genislik, height: genislik / (900 / 332) }} contentFit="contain" />
      <View style={s.plusRozet}>
        <Metin style={{ color: Colors.white, fontSize: genislik > 150 ? 15 : 12, fontWeight: '700' }}>PLUS</Metin>
      </View>
    </View>
  );
}

/* ---------- Ekran iskeleti ---------- */

export function Ekran({
  children,
  kaydir = true,
  ust,
  alt,
  icerikStil,
}: {
  children: ReactNode;
  kaydir?: boolean;
  ust?: ReactNode;
  alt?: ReactNode;
  icerikStil?: StyleProp<ViewStyle>;
}) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <View style={[{ flex: 1 }, icerikOrtala]}>
        {ust}
        {kaydir ? (
          <ScrollView
            contentContainerStyle={[{ padding: Bosluk.lg, paddingBottom: 40, gap: Bosluk.xl }, icerikStil]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        ) : (
          <View style={[{ flex: 1 }, icerikStil]}>{children}</View>
        )}
        {alt}
      </View>
    </SafeAreaView>
  );
}

/** Geri oklu ust cubuk */
export function UstBar({ baslik, sag }: { baslik?: string; sag?: ReactNode }) {
  return (
    <View style={s.ustBar}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Geri"
        hitSlop={10}
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        style={s.geri}>
        <Icon name="arrow-left" size={22} />
      </Pressable>
      <Metin style={{ ...Yazi.kartBasligi, flex: 1 }} numberOfLines={1}>
        {baslik}
      </Metin>
      {sag}
    </View>
  );
}

export function Kart({ children, style, onPress }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void }) {
  if (onPress)
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [s.kart, style, pressed && { opacity: 0.9 }]}>
        {children}
      </Pressable>
    );
  return <View style={[s.kart, style]}>{children}</View>;
}

export function BolumBasligi({ baslik, sag, onSag }: { baslik: string; sag?: string; onSag?: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Bosluk.md }}>
      <Metin style={Yazi.bolumBasligi}>{baslik}</Metin>
      {sag && (
        <Pressable onPress={onSag} hitSlop={8} style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          <Metin style={{ ...Yazi.ikincil, color: Colors.accent, fontWeight: '600' }}>{sag}</Metin>
          <Icon name="chevron-right" size={14} color={Colors.accent} />
        </Pressable>
      )}
    </View>
  );
}

/** "Neden oneriliyor" satiri: her onerinin nedeni ekranda yazar */
export function Neden({ metin }: { metin: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Icon name="bulb" size={13} color={Colors.accent} />
      <Metin style={{ ...Yazi.etiket, color: Colors.accent, flexShrink: 1 }} numberOfLines={2}>
        {metin}
      </Metin>
    </View>
  );
}

export function IlerlemeCubugu({ oran }: { oran: number }) {
  return (
    <View style={{ height: 6, borderRadius: 3, backgroundColor: Colors.ilerlemeBos, overflow: 'hidden' }}>
      <View style={{ width: `${Math.min(100, Math.round(oran * 100))}%`, height: '100%', backgroundColor: Marka.turuncu, borderRadius: 3 }} />
    </View>
  );
}

const s = StyleSheet.create({
  dugme: {
    minHeight: 52,
    borderRadius: Kose.hap,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dugmeKucuk: { minHeight: 36, paddingHorizontal: 16 },
  cip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Kose.hap,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  plusRozet: {
    backgroundColor: Marka.turuncu,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ustBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Bosluk.md,
    paddingHorizontal: Bosluk.lg,
    paddingVertical: Bosluk.md,
  },
  geri: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  kart: {
    backgroundColor: Colors.surface,
    borderRadius: Kose.xl,
    ...kartGolgesi,
  },
});
