import { router } from 'expo-router';
import { useState } from 'react';
import { Animated, PanResponder, Platform, Pressable, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Avatar, Dugme, Ekran, Kart, KulupGorseli, Metin } from '@/components/temel';
import { Bosluk, Colors, Kose, Marka, Yazi } from '@/constants/theme';
import { kisiBul, kulupBul, okunmamisSayisi, tamAd, type Sohbet } from '@/data/ornek';
import { useOturum } from '@/data/oturum';

/** Sola kaydirinca acilan silme alaninin genisligi */
const SIL_GENISLIGI = 88;

/**
 * MESAJLAR (ExCom'dan uyarlandi)
 * Tum yazismalar tek beyaz kartta satir satir: foto, ad, son mesaj
 * (okunmamissa kalin), saat ve okunmamis sayisi. Kalem: yeni mesaj.
 * Silme: sola kaydir ya da uzun bas; once onay sorar ve yalnizca
 * kendi listeni temizler. Kulup sohbetleri de ayni listede.
 */
export default function Mesajlar() {
  const { sohbetler, sohbetSil } = useOturum();
  const [silinecek, setSilinecek] = useState<Sohbet | null>(null);

  return (
    <Ekran>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ gap: 2 }}>
          <Metin style={Yazi.ekranBasligi}>Mesajlar</Metin>
          <Metin style={{ color: Colors.textMuted }}>Slm, nbr?</Metin>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Yeni mesaj"
          hitSlop={8}
          onPress={() => router.push('/yeni-mesaj')}
          style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border }}>
          <Icon name="pencil" size={20} color={Colors.text} />
        </Pressable>
      </View>

      {silinecek && (
        <Kart style={{ padding: Bosluk.lg, gap: Bosluk.sm, backgroundColor: Colors.heartSoft }}>
          <Metin style={Yazi.isim}>Sohbeti sil</Metin>
          <Metin style={Yazi.ikincil}>
            {sohbetAdi(silinecek)} ile yazışma senin listenden kalkacak. Karşı tarafta durmaya devam eder; yeni mesaj gelirse listene geri döner.
          </Metin>
          <View style={{ flexDirection: 'row', gap: Bosluk.sm }}>
            <Dugme style={{ flex: 1 }} kucuk baslik="Vazgeç" tur="cizgili" onPress={() => setSilinecek(null)} />
            <Dugme style={{ flex: 1 }} kucuk baslik="Sil" onPress={() => { sohbetSil(silinecek.id); setSilinecek(null); }} />
          </View>
        </Kart>
      )}

      {sohbetler.length > 0 ? (
        <>
          <View style={{ borderRadius: Kose.xl, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white, overflow: 'hidden' }}>
            {sohbetler.map((s, i) => (
              <SohbetSatiri key={s.id} sohbet={s} ilk={i === 0} sil={() => setSilinecek(s)} />
            ))}
          </View>
          <Metin style={{ ...Yazi.ikincil, color: Colors.textFaint, textAlign: 'center' }}>
            {Platform.OS === 'web' ? 'Silmek için satıra uzun bas.' : 'Silmek için sola kaydır ya da uzun bas.'}
          </Metin>
        </>
      ) : (
        <Kart style={{ alignItems: 'center', gap: Bosluk.sm, paddingVertical: Bosluk.xl, paddingHorizontal: Bosluk.lg }}>
          <Metin style={{ fontSize: 18, fontWeight: '700' }}>Henüz mesajın yok.</Metin>
          <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted, textAlign: 'center' }}>
            Ortak ilgisi olan biriyle tanış, ona yaz. Kulübe katıldığında kulüp sohbeti de burada görünür.
          </Metin>
          <Pressable
            onPress={() => router.push('/yeni-mesaj')}
            style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.sm, marginTop: Bosluk.sm, paddingVertical: Bosluk.md, paddingHorizontal: Bosluk.lg, borderRadius: 999, backgroundColor: Marka.seftali }}>
            <Icon name="search" size={18} color={Colors.accent} />
            <Metin style={{ ...Yazi.etiket, color: Colors.accent }}>Aramızdan birini bul</Metin>
          </Pressable>
        </Kart>
      )}
    </Ekran>
  );
}

function sohbetAdi(s: Sohbet) {
  if (s.tur === 'kulup') return kulupBul(s.hedef)?.ad ?? 'Kulüp';
  const k = kisiBul(s.hedef);
  return k ? tamAd(k) : 'Sohbet';
}

/**
 * KONUSMA SATIRI: satirda cop kutusu yok; silme sola kaydirarak.
 * Uzun basmak da ayni silme onayini acar (fareyle gezen icin).
 */
function SohbetSatiri({ sohbet, ilk, sil }: { sohbet: Sohbet; ilk: boolean; sil: () => void }) {
  // Kaydirma durumu bir kez kurulur; acik bayragi yalnizca hareket isleyicilerinde degisir
  const [{ kayma, surukle, kapat, acikMi }] = useState(() => {
    let acik = false;
    const kayma = new Animated.Value(0);
    const git = (hedef: number) => Animated.spring(kayma, { toValue: hedef, useNativeDriver: false }).start();
    const kapat = () => {
      acik = false;
      git(0);
    };
    const surukle = PanResponder.create({
      // Yalnizca belirgin yatay hareket; dikey kaydirma listeye kalsin
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 12 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
      onPanResponderMove: (_, g) => {
        const taban = acik ? -SIL_GENISLIGI : 0;
        kayma.setValue(Math.min(0, Math.max(-SIL_GENISLIGI * 1.3, taban + g.dx)));
      },
      onPanResponderRelease: (_, g) => {
        const taban = acik ? -SIL_GENISLIGI : 0;
        acik = taban + g.dx < -SIL_GENISLIGI / 2;
        git(acik ? -SIL_GENISLIGI : 0);
      },
      onPanResponderTerminate: kapat,
    });
    return { kayma, surukle, kapat, acikMi: () => acik };
  });

  const kisi = sohbet.tur === 'kisi' ? kisiBul(sohbet.hedef) : undefined;
  const kulup = sohbet.tur === 'kulup' ? kulupBul(sohbet.hedef) : undefined;
  const son = sohbet.mesajlar[sohbet.mesajlar.length - 1];
  const okunmamis = okunmamisSayisi(sohbet);
  const yazan = !son ? '' : son.kimden === 'ben' ? 'Sen: ' : kulup ? `${kisiBul(son.kimden)?.ad ?? ''}: ` : '';
  const sonYazi = !son ? 'Henüz mesaj yok' : son.ek && !son.metin ? 'Fotoğraf' : son.metin;

  return (
    <View style={{ borderTopWidth: ilk ? 0 : 1, borderTopColor: Colors.divider }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${sohbetAdi(sohbet)} sohbetini sil`}
        onPress={() => { kapat(); sil(); }}
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: SIL_GENISLIGI, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.heart }}>
        <Metin style={{ fontSize: 14, fontWeight: '600', color: Colors.white }}>Sil</Metin>
      </Pressable>

      <Animated.View style={{ backgroundColor: Colors.white, transform: [{ translateX: kayma }] }} {...surukle.panHandlers}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${sohbetAdi(sohbet)} ile yazışma`}
          accessibilityHint="Silmek için uzun bas"
          onPress={() => {
            if (acikMi()) return kapat();
            router.push(`/mesaj/${sohbet.id}`);
          }}
          onLongPress={sil}
          style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.md, paddingHorizontal: Bosluk.lg, paddingVertical: Bosluk.md }, pressed && { opacity: 0.75 }]}>
          {kulup ? <KulupGorseli ilgi={kulup.ilgi} genislik={48} yukseklik={48} kose={24} /> : <Avatar ad={sohbetAdi(sohbet)} id={kisi?.id} boyut={48} />}
          <View style={{ flex: 1 }}>
            <Metin style={{ fontSize: 16, fontWeight: '600' }} numberOfLines={1}>{sohbetAdi(sohbet)}</Metin>
            <Metin style={{ fontSize: 13, marginTop: 2, color: okunmamis ? Colors.text : Colors.textMuted, fontWeight: okunmamis ? '600' : '400' }} numberOfLines={1}>
              {yazan}
              {sonYazi}
            </Metin>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 6, minWidth: 40 }}>
            <Metin style={{ fontSize: 12, color: Colors.textFaint }}>{son?.saat}</Metin>
            {okunmamis > 0 && (
              <View style={{ minWidth: 22, height: 22, paddingHorizontal: 6, borderRadius: 11, backgroundColor: Marka.turuncu, alignItems: 'center', justifyContent: 'center' }}>
                <Metin style={{ fontSize: 12, lineHeight: 15, fontWeight: '800', color: Colors.white }}>{okunmamis > 99 ? '99+' : okunmamis}</Metin>
              </View>
            )}
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}
