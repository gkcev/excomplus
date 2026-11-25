import { useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { Metin, UstBar } from '@/components/temel';
import { Bosluk, Colors, icerikOrtala, Kose, Marka, Yazi } from '@/constants/theme';
import { kisiBul, kulupBul } from '@/data/ornek';
import { useOturum } from '@/data/oturum';

/** SOHBET: kisi id'si ya da "kulup-<id>" */
export default function Sohbet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sohbetler, mesajGonder } = useOturum();
  const [metin, setMetin] = useState('');
  const kaydir = useRef<ScrollView>(null);

  const kulupMu = id.startsWith('kulup-');
  const hedefId = kulupMu ? id.slice(6) : id;
  const s = sohbetler.find((x) => x.id === id);
  const kulup = kulupMu ? kulupBul(hedefId) : undefined;
  const kisi = !kulupMu ? kisiBul(hedefId) : undefined;
  const baslik = kulup?.ad ?? (kisi ? `${kisi.ad} ${kisi.soyadHarf}.` : 'Sohbet');

  const gonder = () => {
    const t = metin.trim();
    if (!t) return;
    mesajGonder(id, t, { tur: kulupMu ? 'kulup' : 'kisi', id: hedefId });
    setMetin('');
    setTimeout(() => kaydir.current?.scrollToEnd({ animated: true }), 50);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={[{ flex: 1 }, icerikOrtala]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <UstBar baslik={baslik} />
        <ScrollView ref={kaydir} contentContainerStyle={{ padding: Bosluk.lg, gap: Bosluk.sm }} onContentSizeChange={() => kaydir.current?.scrollToEnd({ animated: false })}>
          {(s?.mesajlar ?? []).map((m, i) => {
            const ben = m.kimden === 'ben';
            const yazan = !ben && kulupMu ? kisiBul(m.kimden)?.ad : undefined;
            return (
              <View key={i} style={{ alignSelf: ben ? 'flex-end' : 'flex-start', maxWidth: '80%', gap: 2 }}>
                {yazan && <Metin style={{ ...Yazi.etiket, color: Colors.accent, marginLeft: 4 }}>{yazan}</Metin>}
                <View style={{ backgroundColor: ben ? Marka.lacivert : Colors.white, borderRadius: Kose.lg, borderBottomRightRadius: ben ? 4 : Kose.lg, borderBottomLeftRadius: ben ? Kose.lg : 4, paddingHorizontal: 14, paddingVertical: 10 }}>
                  <Metin style={{ color: ben ? Colors.white : Colors.text }}>{m.metin}</Metin>
                </View>
                <Metin style={{ ...Yazi.etiket, fontWeight: '400', color: Colors.textMuted, alignSelf: ben ? 'flex-end' : 'flex-start', marginHorizontal: 4 }}>{m.saat}</Metin>
              </View>
            );
          })}
          {!s && (
            <Metin style={{ color: Colors.textMuted, textAlign: 'center', paddingVertical: Bosluk.xl }}>
              {kulupMu ? 'Kulüp sohbetine ilk mesajı sen yaz.' : `${kisi?.ad ?? ''} ile ilk mesajı sen yaz. Ortak ilgi alanlarınızla başlayabilirsin.`}
            </Metin>
          )}
        </ScrollView>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: Bosluk.sm, padding: Bosluk.md, borderTopWidth: 1, borderTopColor: Colors.divider }}>
          <TextInput
            value={metin}
            onChangeText={setMetin}
            placeholder="Mesaj yaz…"
            placeholderTextColor={Colors.textFaint}
            multiline
            onSubmitEditing={gonder}
            style={{ flex: 1, maxHeight: 120, backgroundColor: Colors.white, borderRadius: 22, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 16, paddingVertical: 10, fontSize: 16, fontFamily: 'Outfit_400Regular', color: Colors.text }}
          />
          <Pressable accessibilityLabel="Gönder" onPress={gonder} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: metin.trim() ? Marka.turuncu : Colors.border, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="send" size={20} color={Colors.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
