import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/icon';
import { Metin } from '@/components/temel';
import { Colors, Marka } from '@/constants/theme';
import { okunmamisSayisi } from '@/data/ornek';
import { useOturum } from '@/data/oturum';

const SEKMELER: { ad: string; baslik: string; ikon: IconName }[] = [
  { ad: 'ana-sayfa', baslik: 'Ana Sayfa', ikon: 'home' },
  { ad: 'kesfet', baslik: 'Keşfet', ikon: 'compass' },
  { ad: 'etkinlikler', baslik: 'Etkinlikler', ikon: 'calendar' },
  { ad: 'mesajlar', baslik: 'Mesajlar', ikon: 'comment' },
  { ad: 'profil', baslik: 'Profil', ikon: 'user' },
];

/** Alt menulu bolum: profil doldurulmadan girilmez */
export default function SekmeYerlesimi() {
  const { uye } = useOturum();
  if (!uye) return <Redirect href="/" />;

  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(p) => <AltMenu {...p} />}>
      {SEKMELER.map((s) => (
        <Tabs.Screen key={s.ad} name={s.ad} options={{ title: s.baslik }} />
      ))}
    </Tabs>
  );
}

function AltMenu({ state, navigation }: { state: { index: number; routes: { name: string; key: string }[] }; navigation: { navigate: (n: string) => void } }) {
  const alt = useSafeAreaInsets().bottom;
  const { sohbetler } = useOturum();
  const okunmamis = sohbetler.filter((s) => okunmamisSayisi(s) > 0).length;

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderTopColor: Colors.divider,
        paddingBottom: Math.max(alt, 8),
        paddingTop: 8,
      }}>
      <View style={{ flexDirection: 'row', width: '100%', maxWidth: 560, alignSelf: 'center', marginHorizontal: 'auto' }}>
        {state.routes.map((r, i) => {
          const s = SEKMELER.find((x) => x.ad === r.name);
          if (!s) return null;
          const secili = state.index === i;
          const renk = secili ? Marka.turuncu : Colors.tabInactive;
          return (
            <Pressable
              key={r.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: secili }}
              onPress={() => navigation.navigate(r.name)}
              style={{ flex: 1, alignItems: 'center', gap: 3 }}>
              <View>
                <Icon name={s.ikon} size={24} color={renk} dolu={secili && s.ikon === 'home'} />
                {s.ad === 'mesajlar' && okunmamis > 0 && (
                  <View style={{ position: 'absolute', top: -4, right: -8, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: Marka.turuncu, alignItems: 'center', justifyContent: 'center' }}>
                    <Metin style={{ color: Colors.white, fontSize: 10, fontWeight: '700' }}>{okunmamis}</Metin>
                  </View>
                )}
              </View>
              <Metin style={{ fontSize: 11, fontWeight: secili ? '600' : '400', color: secili ? Colors.accent : Colors.tabInactive }}>{s.baslik}</Metin>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
