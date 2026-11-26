import { View } from 'react-native';

import { Icon, type IconName } from '@/components/icon';
import { Metin } from '@/components/temel';
import { Colors, Marka, Yazi } from '@/constants/theme';
import type { OrtakNokta, OrtakNoktaTuru } from '@/data/eslestirme';
import type { Uye } from '@/data/oturum';

/**
 * ORTAK NOKTALAR (26 Kasim 2026)
 * Arkadaslik ortak bir noktadan baslar: okul, is, hobi, muzik, semt.
 * Ayni simgeler kayitta, profilde ve onerilerde kullanilir.
 */
export const ORTAK_NOKTA: Record<OrtakNoktaTuru, { ikon: IconName; ad: string }> = {
  okul: { ikon: 'mezuniyet', ad: 'Okulun' },
  is: { ikon: 'briefcase', ad: 'İşin' },
  hobi: { ikon: 'heart', ad: 'Hobilerin' },
  muzik: { ikon: 'muzik', ad: 'Müziğin' },
  yakin: { ikon: 'map-pin', ad: 'Semtin' },
  tanidik: { ikon: 'users', ad: 'Tanıdıkların' },
};

/** Profilde sayilan 5 ortak nokta ve dolu olup olmadiklari */
export function profilOrtakNoktalari(u: Uye): { tur: OrtakNoktaTuru; dolu: boolean }[] {
  return [
    { tur: 'hobi', dolu: u.ilgiler.length >= 3 },
    { tur: 'okul', dolu: !!(u.universite || u.lise) },
    { tur: 'is', dolu: !!(u.sirket || u.pozisyon || (u.eskiSirketler ?? []).length) },
    { tur: 'muzik', dolu: u.muzik.length > 0 || (u.sanatcilar ?? []).length > 0 || !!u.sarki },
    { tur: 'yakin', dolu: !!u.semt },
  ];
}

/** Tek ortak nokta satiri: turune gore simge + metin */
export function OrtakNoktaSatiri({ nokta, kucuk }: { nokta: OrtakNokta; kucuk?: boolean }) {
  const boy = kucuk ? 22 : 28;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: kucuk ? 6 : 10 }}>
      <View style={{ width: boy, height: boy, borderRadius: boy / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: kucuk ? 'transparent' : Colors.white }}>
        <Icon name={ORTAK_NOKTA[nokta.tur].ikon} size={kucuk ? 13 : 15} color={Colors.accent} />
      </View>
      <Metin style={kucuk ? { ...Yazi.etiket, color: Colors.accent, flexShrink: 1 } : { ...Yazi.isim, flexShrink: 1 }} numberOfLines={kucuk ? 2 : undefined}>
        {nokta.metin}
      </Metin>
    </View>
  );
}

/** Profil sayaci: 5 kucuk simge, dolu olanlar turuncu */
export function OrtakNoktaSayaci({ u }: { u: Uye }) {
  const liste = profilOrtakNoktalari(u);
  const dolu = liste.filter((x) => x.dolu).length;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <View style={{ flexDirection: 'row', gap: 4 }}>
        {liste.map((x) => (
          <View
            key={x.tur}
            accessibilityLabel={`${ORTAK_NOKTA[x.tur].ad} ${x.dolu ? 'eklendi' : 'eksik'}`}
            style={{ width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: x.dolu ? Marka.turuncu : Colors.white, borderWidth: x.dolu ? 0 : 1, borderColor: Marka.bej }}>
            <Icon name={ORTAK_NOKTA[x.tur].ikon} size={14} color={x.dolu ? Colors.white : Colors.textFaint} />
          </View>
        ))}
      </View>
      <Metin style={{ ...Yazi.etiket, color: Colors.text }}>
        {dolu === liste.length ? 'Bütün ortak noktaların ekli' : `Ortak noktaların: ${dolu} / ${liste.length}`}
      </Metin>
    </View>
  );
}
