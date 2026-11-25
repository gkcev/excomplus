import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Avatar, Cip, Dugme, Ekran, Kart, Metin } from '@/components/temel';
import { Bosluk, Colors, Kose, Marka, Yazi } from '@/constants/theme';
import { davetPaylas } from '@/data/davet';
import { fotoSec } from '@/data/foto';
import { ilgiAdi, ilgiSimge, kisiBul, kulupBul, planBul, tamAd } from '@/data/ornek';
import { useOturum } from '@/data/oturum';

/** PROFIL: bilgiler, davet eden, davet hakki ve kodu, planlarim, kuluplerim */
export default function Profil() {
  const o = useOturum();
  const uye = o.uye!;
  const davetci = uye.davetEden ? kisiBul(uye.davetEden) : undefined;
  const [kopyalandi, setKopyalandi] = useState(false);

  const davetEt = async () => {
    if (await davetPaylas(o.davetKodum)) {
      if (Platform.OS === 'web') setKopyalandi(true);
      o.davetiKullan();
    }
  };

  return (
    <Ekran>
      <View style={{ alignItems: 'center', gap: Bosluk.sm }}>
        <Pressable onPress={async () => { const f = await fotoSec(); if (f) o.fotoDegistir(f); }} accessibilityLabel="Fotoğrafı değiştir" style={{ alignItems: 'center', gap: 6 }}>
          <Avatar ad={uye.ad} id="ben" boyut={96} foto={uye.foto} />
          <Metin style={{ ...Yazi.etiket, color: Colors.accent }}>{uye.foto ? 'Fotoğrafı değiştir' : 'Fotoğraf ekle'}</Metin>
        </Pressable>
        <Metin style={Yazi.ekranBasligi}>{uye.ad}</Metin>
        {(uye.pozisyon || uye.sirket) && (
          <Metin style={{ color: Colors.textMuted }}>{[uye.pozisyon, uye.sirket].filter(Boolean).join(' · ')}</Metin>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Icon name="map-pin" size={14} color={Colors.textMuted} />
          <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>{uye.semt}, {uye.sehir}</Metin>
        </View>
        {davetci && (
          <Pressable onPress={() => router.push(`/kisi/${davetci.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Marka.seftali, borderRadius: Kose.hap, paddingHorizontal: 12, paddingVertical: 6 }}>
            <Icon name="gift" size={14} color={Colors.accent} />
            <Metin style={{ ...Yazi.etiket, color: Colors.accent }}>{tamAd(davetci)} davet etti</Metin>
          </Pressable>
        )}
      </View>

      {/* Davet */}
      <Kart style={{ padding: Bosluk.lg, gap: Bosluk.md, backgroundColor: Marka.lacivert }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Metin style={{ ...Yazi.kartBasligi, color: Colors.white }}>Davet hakkın: {o.davetHakki}</Metin>
          <Icon name="gift" size={22} color={Marka.sari} />
        </View>
        <Metin style={{ ...Yazi.ikincil, color: '#D5D9E0' }}>
          Plus davetle büyüyor. Davet ettiğin kişinin profilinde senin adın görünür; güvendiğin birini seç.
        </Metin>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: Bosluk.md, borderRadius: Kose.md, backgroundColor: 'rgba(255,255,255,0.08)' }}>
          {o.davetKodum.split('').map((h, i) => (
            <View key={i} style={{ width: 34, height: 42, borderRadius: 8, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center' }}>
              <Metin style={{ fontSize: 20, fontWeight: '700' }}>{h}</Metin>
            </View>
          ))}
        </View>
        <Dugme
          baslik={o.davetHakki === 0 ? 'Davet hakkın bitti' : kopyalandi ? 'Kopyalandı ✓' : 'Davet gönder'}
          tur="turuncu"
          ikon="paylas"
          pasif={o.davetHakki === 0}
          onPress={davetEt}
        />
        {o.davetHakki === 0 && (
          <Metin style={{ ...Yazi.ikincil, color: '#D5D9E0', textAlign: 'center' }}>Yeni davet hakları açılıştan sonra tanımlanacak.</Metin>
        )}
      </Kart>

      {/* Ilgi alanlari */}
      <View style={{ gap: Bosluk.md }}>
        <Metin style={Yazi.bolumBasligi}>İlgi alanlarım</Metin>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {uye.ilgiler.map((i) => (
            <Cip key={i} metin={ilgiAdi(i)} simge={ilgiSimge(i)} />
          ))}
          {uye.muzik.map((m) => (
            <Cip key={m} metin={m} simge="🎵" />
          ))}
        </View>
      </View>

      {/* Planlarim ve kuluplerim */}
      <View style={{ gap: Bosluk.md }}>
        <Metin style={Yazi.bolumBasligi}>Katıldığım planlar</Metin>
        {o.katildigimPlanlar.length === 0 ? (
          <Metin style={{ color: Colors.textMuted }}>Henüz bir plana katılmadın.</Metin>
        ) : (
          o.katildigimPlanlar.map((id) => {
            const p = planBul(id);
            if (!p) return null;
            return (
              <Satir key={id} ikon="calendar" baslik={p.baslik} alt={`${p.gun} · ${p.saat} · ${p.semt}`} onPress={() => router.push(`/etkinlik/${id}`)} />
            );
          })
        )}
      </View>
      <View style={{ gap: Bosluk.md }}>
        <Metin style={Yazi.bolumBasligi}>Kulüplerim</Metin>
        {o.kuluplerim.length === 0 ? (
          <Metin style={{ color: Colors.textMuted }}>Henüz bir kulübe katılmadın.</Metin>
        ) : (
          o.kuluplerim.map((id) => {
            const k = kulupBul(id);
            if (!k) return null;
            return <Satir key={id} ikon="users" baslik={k.ad} alt={k.aciklama} onPress={() => router.push(`/kulup/${id}`)} />;
          })
        )}
      </View>

      <View style={{ gap: Bosluk.sm, paddingTop: Bosluk.lg, borderTopWidth: 1, borderTopColor: Colors.divider }}>
        <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted, textAlign: 'center' }}>
          Bu bir prototip: veriler yalnızca bu cihazda tutulur.
        </Metin>
        <Dugme
          baslik="Prototipi baştan başlat"
          tur="cizgili"
          onPress={() => {
            o.cikis();
            router.replace('/');
          }}
        />
      </View>
    </Ekran>
  );
}

function Satir({ ikon, baslik, alt, onPress }: { ikon: 'calendar' | 'users'; baslik: string; alt: string; onPress: () => void }) {
  return (
    <Kart onPress={onPress} style={{ padding: Bosluk.md, flexDirection: 'row', alignItems: 'center', gap: Bosluk.md }}>
      <View style={{ width: 40, height: 40, borderRadius: Kose.md, backgroundColor: Marka.seftali, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={ikon} size={20} color={Colors.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Metin style={Yazi.isim}>{baslik}</Metin>
        <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }} numberOfLines={1}>{alt}</Metin>
      </View>
      <Icon name="chevron-right" size={16} color={Colors.textMuted} />
    </Kart>
  );
}
