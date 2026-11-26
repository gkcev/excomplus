import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { Icon } from '@/components/icon';
import { KisiKarti, KulupKarti, PlanKarti } from '@/components/kartlar';
import { Avatar, BolumBasligi, Dugme, Ekran, IlerlemeCubugu, Kart, KulupGorseli, Logo, Metin } from '@/components/temel';
import { Bosluk, Colors, Kose, Marka, Yazi } from '@/constants/theme';
import { davetPaylas } from '@/data/davet';
import { kisiOnerileri, planNedeni, planPuani } from '@/data/eslestirme';
import { ilgiAdi, KULUPLER } from '@/data/ornek';
import { useOturum } from '@/data/oturum';

/**
 * KISIYE OZEL ANA SAYFA (uyenin yolculugu 4)
 * Sira: selam + asistan kutusu, ilgi cipleri, senin icin bugun (plan),
 * tanisabilecegin kisiler (haftada 3, nedeni yazili), kulupler, ayin etkinligi.
 */
export default function AnaSayfa() {
  const oturum = useOturum();
  const uye = oturum.uye!;

  const planlar = oturum.planlar.filter((p) => !p.ayinEtkinligi && (!p.kulup || oturum.kuluplerim.includes(p.kulup)))
    .map((p) => ({ p, puan: planPuani(uye, p) }))
    .sort((a, b) => b.puan - a.puan);
  const oneCikan = planlar[0]?.p;
  const oneriler = kisiOnerileri(uye, 3, [...(uye.davetEden ? [uye.davetEden] : []), ...oturum.engellediklerim]);
  const kulupler = KULUPLER.filter((k) => uye.ilgiler.includes(k.ilgi));
  // Bekleme listesinde oldugum, esige en yakin, henuz acilmamis kulup: "Tenis kulubunun acilmasina 2 kisi kaldi"
  const sayiOf = (k: (typeof kulupler)[number]) => k.uyeler.length + (oturum.kuluplerim.includes(k.id) ? 1 : 0);
  const olusan = kulupler
    .filter((k) => oturum.kuluplerim.includes(k.id) && sayiOf(k) < k.esik)
    .sort((a, b) => sayiOf(b) - sayiOf(a))[0];
  const olusanSayi = olusan ? sayiOf(olusan) : 0;
  const [davetKopyalandi, setDavetKopyalandi] = useState(false);
  const ayinEtkinligi = oturum.planlar.find((p) => p.ayinEtkinligi);

  return (
    <Ekran>
      {/* Ust cubuk */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.md }}>
          <Pressable accessibilityLabel="Bildirimler" hitSlop={8}>
            <Icon name="bell" size={24} />
            <View style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderRadius: 4, backgroundColor: Marka.turuncu }} />
          </Pressable>
          <Pressable onPress={() => router.navigate('/profil')} accessibilityLabel="Profilim">
            <Avatar ad={uye.ad} boyut={40} id="ben" foto={uye.foto} />
          </Pressable>
        </View>
      </View>

      {/* Selam + asistan */}
      <View style={{ gap: Bosluk.md }}>
        <Metin style={Yazi.ekranBasligi}>Merhaba {uye.ad.split(' ')[0]}! 👋</Metin>
        <Pressable onPress={() => router.push('/asistan')} style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.md, padding: Bosluk.lg, borderRadius: Kose.xl, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: '#F7B79A' }}>
          <Icon name="yildiz" size={22} color={Marka.turuncu} />
          <Metin style={{ flex: 1, color: Colors.textMuted }}>ExCom AI ile plan yap, insan bul, öneri al…</Metin>
          <Icon name="mikrofon" size={20} color={Colors.textMuted} />
        </Pressable>
      </View>

      {/* Senin icin bugun */}
      {oneCikan && (
        <View>
          <BolumBasligi baslik="Senin için seçtiklerimiz" sag="Tümünü gör" onSag={() => router.navigate('/etkinlikler')} />
          <PlanKarti plan={oneCikan} neden={planNedeni(uye, oneCikan)} />
        </View>
      )}

      {/* Kisiler */}
      {oneriler.length > 0 && (
        <View>
          <BolumBasligi baslik="Tanışabileceğin kişiler" sag="Keşfet" onSag={() => router.navigate('/kesfet')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Bosluk.md, paddingBottom: 12, paddingHorizontal: 2 }} style={{ marginHorizontal: -2 }}>
            {oneriler.map((o) => (
              <KisiKarti key={o.kisi.id} oneri={o} />
            ))}
          </ScrollView>
          <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>Haftada 3 öneri: az ama iyi.</Metin>
        </View>
      )}

      {/* Olusan kulup: davet ederek hizlandir */}
      {olusan && (
        <Kart onPress={() => router.push(`/kulup/${olusan.id}`)} style={{ padding: Bosluk.lg, gap: Bosluk.sm, backgroundColor: Marka.seftali }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.md }}>
            <KulupGorseli ilgi={olusan.ilgi} genislik={64} yukseklik={64} />
            <View style={{ flex: 1 }}>
              <Metin style={Yazi.kartBasligi}>{olusan.ad} için {olusan.esik - olusanSayi} kişi kaldı</Metin>
              <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>
                Bekleme listesindesin. {olusan.esik} kişi olunca kulüp ve sohbeti açılır.{' '}
                {oturum.davetHakki > 0
                  ? `${ilgiAdi(olusan.ilgi)} seven bir tanıdığını davet et, daha hızlı açılsın.`
                  : `${ilgiAdi(olusan.ilgi)} seven yeni üyeler geldikçe dolacak; açılınca haber vereceğiz.`}
              </Metin>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.md }}>
            <View style={{ flex: 1 }}>
              <IlerlemeCubugu oran={olusanSayi / olusan.esik} />
            </View>
            <Metin style={Yazi.etiket}>{olusanSayi} / {olusan.esik}</Metin>
          </View>
          {/* Davet yalnizca Elci rozetiyle (data/rozet.ts) */}
          {(oturum.davetHakki > 0 || davetKopyalandi) && (
          <Dugme
            kucuk
            baslik={davetKopyalandi ? 'Davet metni kopyalandı' : 'Tanıdığını davet et'}
            ikon={davetKopyalandi ? 'check' : 'gift'}
            tur={davetKopyalandi ? 'hafif' : 'turuncu'}
            style={{ alignSelf: 'flex-start' }}
            pasif={oturum.davetHakki === 0 && !davetKopyalandi}
            onPress={async () => {
              if (await davetPaylas(oturum.davetKodum, `${olusan.ad} açılmak üzere, sen de gel!`)) {
                setDavetKopyalandi(true);
                oturum.davetiKullan();
              }
            }}
          />
          )}
        </Kart>
      )}

      {/* Kulupler */}
      {kulupler.length > 0 && (
        <View>
          <BolumBasligi baslik="Senin için kulüpler" sag="Tümü" onSag={() => router.navigate('/kesfet')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Bosluk.md, paddingBottom: 12, paddingHorizontal: 2 }} style={{ marginHorizontal: -2 }}>
            {kulupler.map((k) => (
              <KulupKarti key={k.id} kulup={k} />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Ayin etkinligi */}
      {ayinEtkinligi && (
        <View>
          <BolumBasligi baslik="Ayın etkinliği" />
          <PlanKarti plan={ayinEtkinligi} />
        </View>
      )}

      {/* Davet hatirlatma */}
      {oturum.davetHakki > 0 && (
        <Kart onPress={() => router.navigate('/profil')} style={{ padding: Bosluk.lg, flexDirection: 'row', alignItems: 'center', gap: Bosluk.md, backgroundColor: Marka.lacivert }}>
          <Icon name="gift" size={28} color={Marka.sari} />
          <View style={{ flex: 1 }}>
            <Metin style={{ ...Yazi.isim, color: Colors.white }}>{oturum.davetHakki} davet hakkın var</Metin>
            <Metin style={{ ...Yazi.ikincil, color: '#D5D9E0' }}>Güvendiğin birini Plus’a çağır; adın onun profilinde görünür.</Metin>
          </View>
          <Icon name="chevron-right" size={18} color={Colors.white} />
        </Kart>
      )}
    </Ekran>
  );
}
