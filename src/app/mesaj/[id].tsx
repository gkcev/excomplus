import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { Avatar, KulupGorseli, Metin, UstBar } from '@/components/temel';
import { Bosluk, Colors, icerikOrtala, Kose, Marka, Yazi } from '@/constants/theme';
import { fotoSec } from '@/data/foto';
import { kisiBul, kulupBul, tamAd, TEPKILER } from '@/data/ornek';
import { useOturum } from '@/data/oturum';

/**
 * SOHBET (ExCom'dan uyarlandi): kisi id'si ya da "kulup-<id>"
 *  - Ustte kisi satiri (foto + ad + is, dokununca profil); kulupte kulup satiri
 *  - Balonlar: benim lacivert sagda, karsi beyaz solda; saat balonun icinde
 *  - Uzun bas: tepki seridi + Kopyala (+ kendi mesajimda Sil); cift dokun: kalp
 *  - Fotograf eklenebilir; baglanti yoksa altta kisa hatirlatma
 *  - Sag ustte bayrak: sohbeti sikayet et
 */
export default function Sohbet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sohbetler, mesajGonder, planiBul, okunduIsaretle, mesajTepki, mesajSil, baglantilar, baglan, engellediklerim } = useOturum();
  const [taslak, setTaslak] = useState('');
  const [ek, setEk] = useState<string>();
  const [tepkiSira, setTepkiSira] = useState<number | null>(null);
  const [bilgi, setBilgi] = useState('');
  const sonDokunus = useRef<{ sira: number; zaman: number } | null>(null);
  const kaydir = useRef<ScrollView>(null);
  const kenar = useSafeAreaInsets();

  const kulupMu = id.startsWith('kulup-');
  const hedefId = kulupMu ? id.slice(6) : id;
  const s = sohbetler.find((x) => x.id === id);
  const kulup = kulupMu ? kulupBul(hedefId) : undefined;
  const kisi = !kulupMu ? kisiBul(hedefId) : undefined;
  const mesajlar = s?.mesajlar ?? [];
  const bagli = baglantilar.includes(hedefId);
  const engelli = !kulupMu && engellediklerim.includes(hedefId);

  // Ekran acikken gelen her mesaj okundu sayilir
  useEffect(() => {
    okunduIsaretle(id);
  }, [id, mesajlar.length, okunduIsaretle]);

  const gonderilebilir = (taslak.trim() !== '' || !!ek) && !engelli;
  const gonder = () => {
    if (!gonderilebilir) return;
    mesajGonder(id, taslak.trim(), { tur: kulupMu ? 'kulup' : 'kisi', id: hedefId }, ek);
    setTaslak('');
    setEk(undefined);
    setTimeout(() => kaydir.current?.scrollToEnd({ animated: true }), 50);
  };

  // Cift dokunus: kalp
  const balonaDokun = (sira: number, simdi: number) => {
    if (sonDokunus.current && sonDokunus.current.sira === sira && simdi - sonDokunus.current.zaman < 300) {
      mesajTepki(id, sira, '❤️');
      sonDokunus.current = null;
    } else {
      sonDokunus.current = { sira, zaman: simdi };
    }
  };

  const kopyala = async (metin: string) => {
    try {
      await navigator.clipboard?.writeText(metin);
      setBilgi('Mesaj kopyalandı.');
      setTimeout(() => setBilgi(''), 2000);
    } catch {}
  };

  const secili = tepkiSira !== null ? mesajlar[tepkiSira] : undefined;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <View style={icerikOrtala}>
        <UstBar
          sag={
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Bu sohbeti şikayet et"
              hitSlop={8}
              onPress={() => {
                setBilgi('Şikayetin ekibe iletildi; son mesajlar incelemeye eklendi.');
                setTimeout(() => setBilgi(''), 3000);
              }}>
              <Icon name="bayrak" size={20} color={Colors.textMuted} />
            </Pressable>
          }
        />
      </View>

      {/* Kisi / kulup satiri: dokununca profil */}
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push(kulup ? `/kulup/${kulup.id}` : `/kisi/${hedefId}`)}
        style={[icerikOrtala, { flexDirection: 'row', alignItems: 'center', gap: Bosluk.md, paddingHorizontal: Bosluk.lg, paddingBottom: Bosluk.md, borderBottomWidth: 1, borderBottomColor: Colors.border }]}>
        {kulup ? <KulupGorseli ilgi={kulup.ilgi} genislik={44} yukseklik={44} kose={22} /> : <Avatar ad={kisi ? tamAd(kisi) : ''} id={kisi?.id} boyut={44} />}
        <View style={{ flex: 1, gap: 1 }}>
          <Metin style={{ fontSize: 17, fontWeight: '600' }} numberOfLines={1}>{kulup?.ad ?? (kisi ? tamAd(kisi) : 'Sohbet')}</Metin>
          <Metin style={{ ...Yazi.etiket, fontWeight: '400', color: Colors.textMuted }} numberOfLines={1}>
            {kulup ? `${kulup.uyeler.length + 1} üye · kulüp sohbeti` : [kisi?.pozisyon, kisi?.semt].filter(Boolean).join(' · ') || 'Profili gör'}
          </Metin>
        </View>
        <Icon name="chevron-right" size={18} color={Colors.textFaint} />
      </Pressable>

      <KeyboardAvoidingView style={[{ flex: 1 }, icerikOrtala]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={kaydir}
          contentContainerStyle={{ padding: Bosluk.lg, gap: Bosluk.sm }}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => kaydir.current?.scrollToEnd({ animated: false })}>
          {mesajlar.length === 0 && (
            <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted, textAlign: 'center', paddingVertical: Bosluk.xl }}>
              {kulupMu ? 'Kulüp sohbetine ilk mesajı sen yaz.' : `${kisi?.ad ?? ''} ile henüz yazışmadınız. Ortak ilgi alanlarınızla başlayabilirsin.`}
            </Metin>
          )}

          {mesajlar.map((m, i) => {
            const ben = m.kimden === 'ben';
            const yazan = !ben && kulupMu ? kisiBul(m.kimden) : undefined;
            const rozet = [m.karsiTepki, m.tepki].filter(Boolean) as string[];
            const plan = m.plan ? planiBul(m.plan) : undefined;
            return (
              <View key={i} style={{ alignSelf: ben ? 'flex-end' : 'flex-start', maxWidth: '82%', marginBottom: rozet.length ? 12 : 0, flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}>
                {yazan && <Avatar ad={tamAd(yazan)} id={yazan.id} boyut={28} />}
                <View style={{ flexShrink: 1 }}>
                  {yazan && <Metin style={{ ...Yazi.etiket, color: Colors.accent, marginLeft: 4, marginBottom: 2 }}>{yazan.ad}</Metin>}
                  <Pressable
                    accessibilityRole="button"
                    accessibilityHint="Tepki vermek için basılı tut, kalp için iki kez dokun"
                    onPress={(e) => balonaDokun(i, e.nativeEvent.timestamp || e.timeStamp)}
                    onLongPress={() => setTepkiSira(i)}
                    style={({ pressed }) => [
                      {
                        borderRadius: Kose.lg,
                        paddingVertical: m.ek ? 4 : Bosluk.sm,
                        paddingHorizontal: m.ek ? 4 : Bosluk.lg,
                        backgroundColor: ben ? Colors.primary : Colors.white,
                        borderWidth: ben ? 0 : 1,
                        borderColor: Colors.border,
                        borderBottomRightRadius: ben ? 4 : Kose.lg,
                        borderBottomLeftRadius: ben ? Kose.lg : 4,
                      },
                      pressed && { opacity: 0.7 },
                    ]}>
                    {m.ek && <Image source={{ uri: m.ek }} style={{ width: 220, height: 220, borderRadius: Kose.md }} contentFit="cover" />}
                    {m.metin !== '' && (
                      <Metin style={{ fontSize: 16, lineHeight: 22, color: ben ? Colors.white : Colors.text, paddingHorizontal: m.ek ? Bosluk.md : 0, paddingTop: m.ek ? 4 : 0 }}>{m.metin}</Metin>
                    )}
                    {plan && (
                      <Pressable onPress={() => router.push(`/etkinlik/${plan.id}`)} style={{ marginTop: 8, borderRadius: Kose.md, overflow: 'hidden', backgroundColor: Colors.white, flexDirection: 'row', alignItems: 'center', gap: Bosluk.sm }}>
                        <Image source={plan.gorsel} style={{ width: 64, height: 64 }} contentFit="cover" />
                        <View style={{ flex: 1, paddingRight: Bosluk.sm }}>
                          <Metin style={Yazi.etiket} numberOfLines={1}>{plan.baslik}</Metin>
                          <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }} numberOfLines={1}>{plan.gun} · {plan.saat} · {plan.semt}</Metin>
                          <Metin style={{ ...Yazi.etiket, color: Colors.accent }}>Katıl →</Metin>
                        </View>
                      </Pressable>
                    )}
                    <Metin style={{ fontSize: 11, marginTop: 3, color: ben ? 'rgba(255,255,255,0.72)' : Colors.textFaint, alignSelf: 'flex-end', paddingHorizontal: m.ek ? Bosluk.md : 0 }}>{m.saat}</Metin>
                  </Pressable>
                  {rozet.length > 0 && (
                    <Pressable
                      onPress={() => setTepkiSira(i)}
                      accessibilityLabel={`Tepkiler: ${rozet.join(' ')}`}
                      style={{ position: 'absolute', bottom: -14, [ben ? 'left' : 'right']: 8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border }}>
                      <Metin style={{ fontSize: 14 }}>{rozet[0] === rozet[1] ? `${rozet[0]} 2` : rozet.join('')}</Metin>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Baglanti yoksa kisa hatirlatma */}
        {!kulupMu && !bagli && !engelli && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.sm, marginHorizontal: Bosluk.lg, marginBottom: Bosluk.sm, paddingVertical: Bosluk.sm, paddingHorizontal: Bosluk.md, borderRadius: Kose.md, backgroundColor: Marka.seftali }}>
            <Icon name="users" size={16} color={Colors.textMuted} />
            <Metin style={{ ...Yazi.ikincil, flex: 1, color: Colors.textMuted }}>Henüz tanışmadınız.</Metin>
            <Pressable onPress={() => baglan(hedefId)} hitSlop={6}>
              <Metin style={{ ...Yazi.etiket, color: Colors.accent }}>Tanışma isteği gönder</Metin>
            </Pressable>
          </View>
        )}
        {engelli && (
          <Metin style={{ ...Yazi.ikincil, color: Colors.heart, textAlign: 'center', marginBottom: Bosluk.sm }}>Bu kişiyi engelledin; mesaj gönderemezsin.</Metin>
        )}
        {bilgi !== '' && <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted, textAlign: 'center', marginBottom: Bosluk.sm }}>{bilgi}</Metin>}

        {/* Secilen fotograf: gonder'e basinca gider */}
        {ek && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.md, marginHorizontal: Bosluk.lg, marginBottom: Bosluk.sm, padding: Bosluk.sm, borderRadius: Kose.md, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border }}>
            <Image source={{ uri: ek }} style={{ width: 44, height: 44, borderRadius: 8 }} contentFit="cover" />
            <Metin style={{ ...Yazi.ikincil, flex: 1 }}>Fotoğraf eklendi</Metin>
            <Pressable onPress={() => setEk(undefined)} accessibilityLabel="Eki kaldır" hitSlop={10}>
              <Icon name="x" size={18} color={Colors.textMuted} />
            </Pressable>
          </View>
        )}

        {/* Yazma alani */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: Bosluk.sm, paddingHorizontal: Bosluk.md, paddingTop: Bosluk.sm, paddingBottom: Math.max(kenar.bottom, Bosluk.md), borderTopWidth: 1, borderTopColor: Colors.divider }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fotoğraf ekle"
            disabled={engelli}
            onPress={async () => { const f = await fotoSec(); if (f) setEk(f); }}
            style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="resim" size={22} color={Colors.text} />
          </Pressable>
          <TextInput
            value={taslak}
            onChangeText={setTaslak}
            placeholder="Mesajını yaz…"
            placeholderTextColor={Colors.textFaint}
            multiline
            maxLength={2000}
            editable={!engelli}
            style={{ flex: 1, maxHeight: 120, backgroundColor: Colors.white, borderRadius: 22, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 16, paddingVertical: 10, fontSize: 16, fontFamily: 'Outfit_400Regular', color: Colors.text }}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Gönder"
            onPress={gonder}
            disabled={!gonderilebilir}
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: gonderilebilir ? Marka.turuncu : Colors.border, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="send" size={20} color={Colors.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      {/* Tepki seridi: emoji, Kopyala, kendi mesajimda Sil */}
      <Modal visible={tepkiSira !== null} transparent animationType="fade" onRequestClose={() => setTepkiSira(null)}>
        <Pressable accessibilityLabel="Kapat" style={{ flex: 1, backgroundColor: 'rgba(7,24,45,0.35)' }} onPress={() => setTepkiSira(null)} />
        <View style={{ backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: Bosluk.lg, paddingBottom: kenar.bottom + Bosluk.lg, gap: Bosluk.sm }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {TEPKILER.map((e) => (
              <Pressable
                key={e}
                accessibilityLabel={secili?.tepki === e ? `${e} tepkisini kaldır` : `${e} ile tepki ver`}
                onPress={() => { if (tepkiSira !== null) mesajTepki(id, tepkiSira, e); setTepkiSira(null); }}
                style={{ width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: secili?.tepki === e ? Marka.seftali : 'transparent' }}>
                <Metin style={{ fontSize: 26 }}>{e}</Metin>
              </Pressable>
            ))}
          </View>
          {!!secili?.metin && (
            <Pressable onPress={() => { void kopyala(secili.metin); setTepkiSira(null); }} style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.md, paddingVertical: Bosluk.md }}>
              <Icon name="kopyala" size={18} color={Colors.text} />
              <Metin style={Yazi.isim}>Kopyala</Metin>
            </Pressable>
          )}
          {secili?.kimden === 'ben' && (
            <Pressable onPress={() => { if (tepkiSira !== null) mesajSil(id, tepkiSira); setTepkiSira(null); }} style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.md, paddingVertical: Bosluk.md }}>
              <Icon name="trash" size={18} color={Colors.heart} />
              <Metin style={{ ...Yazi.isim, color: Colors.heart }}>Mesajı sil</Metin>
            </Pressable>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
