import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Avatar, Ekran, Kart, Metin, UstBar } from '@/components/temel';
import { Bosluk, Colors, Kose, Yazi } from '@/constants/theme';
import { KISILER, tamAd, type Kisi } from '@/data/ornek';
import { useOturum } from '@/data/oturum';

/** "Şükrü" -> "sukru": aramada Turkce harf ve buyuk/kucuk farki olmasin */
const sade = (t: string) =>
  t.toLocaleLowerCase('tr').replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u');

/**
 * YENI MESAJ (ExCom'dan): kisi secip yazismayi baslat.
 * Once baglantilarim, sonra diger uyeler; engellediklerim gorunmez.
 */
export default function YeniMesaj() {
  const { baglantilar, engellediklerim } = useOturum();
  const [arama, setArama] = useState('');
  const uygun = (k: Kisi) => !engellediklerim.includes(k.id) && sade(`${k.ad} ${k.pozisyon ?? ''} ${k.semt}`).includes(sade(arama.trim()));
  const bagli = KISILER.filter((k) => baglantilar.includes(k.id) && uygun(k));
  const diger = KISILER.filter((k) => !baglantilar.includes(k.id) && uygun(k));

  return (
    <Ekran ust={<UstBar baslik="Yeni mesaj" />}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.sm, paddingHorizontal: Bosluk.md, borderRadius: Kose.hap, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white, marginTop: -Bosluk.md }}>
        <Icon name="search" size={18} color={Colors.textMuted} />
        <TextInput
          value={arama}
          onChangeText={setArama}
          placeholder="İsim, iş ya da semt ara"
          placeholderTextColor={Colors.textFaint}
          autoFocus
          style={{ flex: 1, paddingVertical: 12, fontSize: 16, fontFamily: 'Outfit_400Regular', color: Colors.text }}
        />
      </View>

      {bagli.length > 0 && <Liste baslik="Bağlantıların" kisiler={bagli} />}
      {diger.length > 0 && <Liste baslik="Diğer üyeler" kisiler={diger} />}
      {bagli.length + diger.length === 0 && (
        <Metin style={{ color: Colors.textMuted, textAlign: 'center', paddingVertical: Bosluk.xl }}>Bu aramaya uyan kimse yok.</Metin>
      )}
    </Ekran>
  );
}

function Liste({ baslik, kisiler }: { baslik: string; kisiler: Kisi[] }) {
  return (
    <View style={{ gap: Bosluk.sm }}>
      <Metin style={{ ...Yazi.etiket, color: Colors.textMuted }}>{baslik.toLocaleUpperCase('tr')}</Metin>
      <Kart style={{ paddingVertical: 4 }}>
        {kisiler.map((k, i) => (
          <Pressable
            key={k.id}
            onPress={() => router.replace(`/mesaj/${k.id}`)}
            style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.md, paddingVertical: Bosluk.md, paddingHorizontal: Bosluk.lg, borderTopWidth: i ? 1 : 0, borderTopColor: Colors.divider }, pressed && { opacity: 0.75 }]}>
            <Avatar ad={tamAd(k)} id={k.id} boyut={44} />
            <View style={{ flex: 1 }}>
              <Metin style={Yazi.isim}>{tamAd(k)}</Metin>
              <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }} numberOfLines={1}>{[k.pozisyon, k.semt].filter(Boolean).join(' · ')}</Metin>
            </View>
            <Icon name="comment" size={18} color={Colors.accent} />
          </Pressable>
        ))}
      </Kart>
    </View>
  );
}
