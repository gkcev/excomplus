/** Tekrar kullanilan kartlar: plan, kisi, kulup */

import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Avatar, AvatarYigini, Dugme, IlerlemeCubugu, Kart, KulupGorseli, Metin, Neden } from '@/components/temel';
import { Bosluk, Colors, Durum, Marka, Yazi } from '@/constants/theme';
import type { Oneri } from '@/data/eslestirme';
import { KISI_FOTOLARI } from '@/data/fotolar';
import { ilgiAdi, kisiBul, type Kulup, type Plan } from '@/data/ornek';
import { useOturum } from '@/data/oturum';

/**
 * Plan karti.
 *  vitrin (varsayilan): baslik fotografin ustunde; ana sayfada tek kart icin.
 *  yan: solda %40 fotograf, sagda bilgi; uzun listeler icin (daha cok kart sigar).
 */
export function PlanKarti({ plan, neden, tur = 'vitrin' }: { plan: Plan; neden?: string | null; tur?: 'vitrin' | 'yan' }) {
  const { katildigimPlanlar, planaKatil } = useOturum();
  const katildim = katildigimPlanlar.includes(plan.id);
  const adlar = plan.katilan.map((k) => kisiBul(k)?.ad ?? '');
  const toplam = plan.katilan.length + (katildim ? 1 : 0);
  const katilDugmesi = (
    <Dugme kucuk baslik={katildim ? 'Katılıyorsun' : 'Katıl'} tur={katildim ? 'hafif' : 'turuncu'} ikon={katildim ? 'check' : undefined} onPress={() => planaKatil(plan.id)} />
  );

  if (tur === 'yan') {
    return (
      <Kart onPress={() => router.push(`/etkinlik/${plan.id}`)} style={{ flexDirection: 'row', overflow: 'hidden', minHeight: 150 }}>
        <View style={{ width: '40%' }}>
          <Image source={plan.gorsel} style={StyleSheet.absoluteFill} contentFit="cover" />
          <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
            <Metin style={{ ...Yazi.etiket, fontSize: 11, color: Colors.accent }}>{plan.tur}</Metin>
          </View>
        </View>
        <View style={{ flex: 1, padding: Bosluk.md, gap: 4 }}>
          <Metin style={Yazi.isim} numberOfLines={2}>{plan.baslik}</Metin>
          <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }} numberOfLines={1}>{plan.gun} · {plan.saat}</Metin>
          <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }} numberOfLines={1}>{plan.semt}</Metin>
          {neden && (
            <Metin style={{ ...Yazi.etiket, color: Colors.accent }} numberOfLines={1}>{neden}</Metin>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 6 }}>
            <AvatarYigini adlar={adlar} idler={plan.katilan} toplam={toplam} />
            {katilDugmesi}
          </View>
        </View>
      </Kart>
    );
  }

  return (
    <Kart onPress={() => router.push(`/etkinlik/${plan.id}`)} style={{ overflow: 'hidden' }}>
      {/* Fotograf: baslik ve tarih ustunde, alttan koyulasan gecisle okunur */}
      <View style={{ height: 150 }}>
        <Image source={plan.gorsel} style={StyleSheet.absoluteFill} contentFit="cover" />
        <LinearGradient colors={['rgba(11,25,44,0)', 'rgba(11,25,44,0.85)']} locations={[0.35, 1]} style={StyleSheet.absoluteFill} />
        <View style={{ position: 'absolute', top: Bosluk.md, left: Bosluk.md, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
          <Metin style={{ ...Yazi.etiket, color: Colors.accent }}>{plan.tur}</Metin>
        </View>
        <View style={{ position: 'absolute', left: Bosluk.md, right: Bosluk.md, bottom: Bosluk.md, gap: 2 }}>
          <Metin style={{ ...Yazi.kartBasligi, color: Colors.white }} numberOfLines={1}>{plan.baslik}</Metin>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Icon name="calendar" size={13} color="#E8EBF0" />
            <Metin style={{ ...Yazi.ikincil, color: '#E8EBF0' }} numberOfLines={1}>{plan.gun} · {plan.saat} · {plan.semt}</Metin>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.md, paddingHorizontal: Bosluk.md, paddingVertical: 10 }}>
        <View style={{ flex: 1, gap: 4 }}>
          {neden && <Neden metin={neden} />}
          <AvatarYigini adlar={adlar} idler={plan.katilan} toplam={toplam} />
        </View>
        {katilDugmesi}
      </View>
    </Kart>
  );
}

/** Dikey kucuk kisi karti (yatay kaydirilan liste) */
export function KisiKarti({ oneri }: { oneri: Oneri }) {
  const { baglantilar, baglan } = useOturum();
  const k = oneri.kisi;
  const bagli = baglantilar.includes(k.id);
  return (
    <Kart onPress={() => router.push(`/kisi/${k.id}`)} style={{ width: 170, overflow: 'hidden' }}>
      <View>
        {KISI_FOTOLARI[k.id] ? (
          <Image source={KISI_FOTOLARI[k.id]} style={{ width: '100%', height: 190 }} contentFit="cover" />
        ) : (
          <View style={{ height: 190, alignItems: 'center', justifyContent: 'center', backgroundColor: Marka.seftali }}>
            <Avatar ad={`${k.ad} ${k.soyadHarf}`} id={k.id} boyut={88} />
          </View>
        )}
        <Pressable
          accessibilityLabel={bagli ? 'İstek gönderildi' : `${k.ad} ile tanış`}
          onPress={() => baglan(k.id)}
          style={{ position: 'absolute', right: 10, bottom: 10, width: 36, height: 36, borderRadius: 18, backgroundColor: bagli ? Durum.onaylandi.zemin : Marka.turuncu, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.white }}>
          <Icon name={bagli ? 'check' : 'plus'} size={16} color={bagli ? Durum.onaylandi.yazi : Colors.white} strokeWidth={3} />
        </Pressable>
      </View>
      <View style={{ padding: Bosluk.md, gap: 8 }}>
      <View>
        <Metin style={Yazi.isim}>{k.ad} {k.soyadHarf}.</Metin>
        <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }} numberOfLines={1}>
          {k.ilgiler.slice(0, 2).map(ilgiAdi).join(' · ')}
        </Metin>
      </View>
      {oneri.nedenler[0] && <Neden metin={oneri.nedenler[0]} />}
      </View>
    </Kart>
  );
}

/** Kulup karti: esige ulasmadiysa ilerleme cubugu, ulastiysa uye sayisi */
export function KulupKarti({ kulup, genis }: { kulup: Kulup; genis?: boolean }) {
  const { kuluplerim } = useOturum();
  const uyeyim = kuluplerim.includes(kulup.id);
  const sayi = kulup.uyeler.length + (uyeyim ? 1 : 0);
  const acik = sayi >= kulup.esik;
  return (
    <Kart
      onPress={() => router.push(`/kulup/${kulup.id}`)}
      style={[genis ? { padding: Bosluk.md, flexDirection: 'row', alignItems: 'center', gap: Bosluk.md } : { width: 170, overflow: 'hidden' }]}>
      {genis ? (
        <KulupGorseli ilgi={kulup.ilgi} genislik={64} yukseklik={64} />
      ) : (
        <KulupGorseli ilgi={kulup.ilgi} genislik="100%" yukseklik={110} kose={0} />
      )}
      <View style={{ flex: genis ? 1 : undefined, gap: 4, padding: genis ? 0 : Bosluk.md }}>
        <Metin style={Yazi.isim} numberOfLines={1}>{kulup.ad}</Metin>
        {acik ? (
          <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>{sayi} üye · sohbet açık</Metin>
        ) : (
          <>
            <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>{sayi} / {kulup.esik} kişi</Metin>
            <IlerlemeCubugu oran={sayi / kulup.esik} />
          </>
        )}
      </View>
      {genis && uyeyim && <Icon name="check-circle" size={20} color={Marka.turuncu} />}
    </Kart>
  );
}
