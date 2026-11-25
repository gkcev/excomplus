import { Image } from 'expo-image';
import { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { Metin } from '@/components/temel';
import { Bosluk, Colors, Kose, Marka, Yazi } from '@/constants/theme';

export const EN_FAZLA_FOTO = 6;

type Foto = number | string;

/**
 * PROFIL FOTOGRAFLARI IZGARASI (ExCom'dan)
 * Uc sutunlu kare izgara; dokununca tam ekran acilir, oklarla yana gecilir.
 * ekle verilirse sonda kesikli "ekle" kutusu; sil verilirse her fotografta
 * kucuk carpi (once onay sorar).
 */
export function FotoIzgarasi({ fotolar, ekle, sil }: { fotolar: Foto[]; ekle?: () => void; sil?: (sira: number) => void }) {
  const [acik, setAcik] = useState<number | null>(null);
  const [silinecek, setSilinecek] = useState<number | null>(null);
  const ekleKutusu = !!ekle && fotolar.length < EN_FAZLA_FOTO;

  return (
    <View style={{ gap: Bosluk.sm }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -3 }}>
        {fotolar.map((f, i) => (
          <View key={i} style={{ width: '33.333%', aspectRatio: 1, padding: 3 }}>
            <Pressable onPress={() => setAcik(i)} accessibilityLabel={`Fotoğraf ${i + 1}`} style={{ flex: 1, borderRadius: Kose.md, overflow: 'hidden', backgroundColor: Marka.seftali }}>
              <Image source={typeof f === 'string' ? { uri: f } : f} style={{ width: '100%', height: '100%' }} contentFit="cover" />
            </Pressable>
            {sil && (
              <Pressable
                onPress={() => setSilinecek(i)}
                accessibilityLabel={`Fotoğraf ${i + 1} sil`}
                hitSlop={6}
                style={{ position: 'absolute', top: 8, right: 8, width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(7,24,45,0.7)' }}>
                <Icon name="x" size={13} color={Colors.white} strokeWidth={2.6} />
              </Pressable>
            )}
          </View>
        ))}
        {ekleKutusu && (
          <View style={{ width: '33.333%', aspectRatio: 1, padding: 3 }}>
            <Pressable
              onPress={ekle}
              accessibilityLabel="Fotoğraf ekle"
              style={{ flex: 1, borderRadius: Kose.md, borderWidth: 1.5, borderStyle: 'dashed', borderColor: Marka.turuncu, alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: Marka.seftali }}>
              <Icon name="plus" size={22} color={Colors.accent} />
              <Metin style={{ ...Yazi.etiket, color: Colors.accent }}>Ekle</Metin>
            </Pressable>
          </View>
        )}
      </View>

      {silinecek !== null && sil && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.sm, padding: Bosluk.md, borderRadius: Kose.lg, backgroundColor: Colors.heartSoft }}>
          <Metin style={{ ...Yazi.ikincil, flex: 1 }}>Bu fotoğraf profilinden kaldırılsın mı?</Metin>
          <Pressable onPress={() => setSilinecek(null)} hitSlop={6}>
            <Metin style={{ ...Yazi.etiket, color: Colors.textMuted }}>Vazgeç</Metin>
          </Pressable>
          <Pressable onPress={() => { sil(silinecek); setSilinecek(null); }} hitSlop={6}>
            <Metin style={{ ...Yazi.etiket, color: Colors.heart }}>Kaldır</Metin>
          </Pressable>
        </View>
      )}

      {/* Tam ekran gorunum; oklarla yana gecilir */}
      <Modal visible={acik !== null} transparent animationType="fade" onRequestClose={() => setAcik(null)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: Marka.lacivert }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Bosluk.lg }}>
            <Metin style={{ ...Yazi.etiket, color: Colors.white }}>{acik !== null ? `${acik + 1} / ${fotolar.length}` : ''}</Metin>
            <Pressable onPress={() => setAcik(null)} accessibilityLabel="Kapat" hitSlop={10}>
              <Icon name="x" size={26} color={Colors.white} />
            </Pressable>
          </View>
          {acik !== null && fotolar[acik] !== undefined && (
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Image source={typeof fotolar[acik] === 'string' ? { uri: fotolar[acik] as string } : (fotolar[acik] as number)} style={{ width: '100%', height: '80%' }} contentFit="contain" />
              {acik > 0 && <Ok yon="sol" onPress={() => setAcik(acik - 1)} />}
              {acik < fotolar.length - 1 && <Ok yon="sag" onPress={() => setAcik(acik + 1)} />}
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
}

function Ok({ yon, onPress }: { yon: 'sol' | 'sag'; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={yon === 'sol' ? 'Önceki fotoğraf' : 'Sonraki fotoğraf'}
      style={{ position: 'absolute', [yon === 'sol' ? 'left' : 'right']: Bosluk.md, width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.18)', transform: yon === 'sol' ? [{ scaleX: -1 }] : [] }}>
      <Icon name="chevron-right" size={22} color={Colors.white} />
    </Pressable>
  );
}
