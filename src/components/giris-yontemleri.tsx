import { useState, type ReactNode } from 'react';
import { Modal, Pressable, TextInput, View } from 'react-native';

import { AppleLogo } from '@/components/apple-logo';
import { AppButton } from '@/components/button';
import { GoogleLogo } from '@/components/google-logo';
import { Icon } from '@/components/icon';
import { Metin } from '@/components/temel';
import { Bosluk, Colors, icerikOrtala, Kose, Yazi } from '@/constants/theme';
import type { Hesap } from '@/data/oturum';

const epostaGecerli = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());
/** Prototipte e-posta kodu sabit; gercekte e-postayla gelir */
export const DENEME_KODU = '123456';

/**
 * GIRIS YONTEMLERI: Google, Apple, e-posta kodu.
 * Hem "Zaten uyeyim" hem davetten sonraki "Hesabini olustur" kullanir;
 * hangi hesabin kabul edilecegine ust ekran karar verir:
 *   kontrol(adres) -> kod gondermeden once (uye olmayana kod gitmez), hata ya da null
 *   sec(hesap)     -> girisi / hesabi tamamlar, hata ya da null
 * Prototipte Google / Apple penceresi yok: hesabin e-postasi sorulur.
 */
export function GirisYontemleri({ kontrol, sec }: { kontrol: (adres: string) => string | null; sec: (h: Hesap) => string | null }) {
  const [pencere, setPencere] = useState<null | 'google' | 'apple'>(null);
  const [adres, setAdres] = useState('');
  const [epostaAdimi, setEpostaAdimi] = useState<'yok' | 'adres' | 'kod'>('yok');
  const [kod, setKod] = useState('');
  const [hata, setHata] = useState('');

  const dene = (h: Hesap) => {
    const sonuc = sec(h);
    setHata(sonuc ?? '');
    return !sonuc;
  };

  return (
    <View style={{ gap: Bosluk.md }}>
      <SaglayiciDugmesi ad="Google ile devam et" logo={<GoogleLogo size={20} />} onPress={() => { setHata(''); setAdres(''); setPencere('google'); }} />
      <SaglayiciDugmesi ad="Apple ile devam et" koyu logo={<AppleLogo boyut={18} renk={Colors.white} />} onPress={() => { setHata(''); setAdres(''); setPencere('apple'); }} />

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.md, marginVertical: 4 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: Colors.border }} />
        <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>ya da</Metin>
        <View style={{ flex: 1, height: 1, backgroundColor: Colors.border }} />
      </View>

      {/* E-posta: adres -> 6 haneli kod */}
      {epostaAdimi === 'yok' && (
        <SaglayiciDugmesi ad="E-posta ile devam et" logo={<Icon name="mail" size={20} color={Colors.text} />} onPress={() => { setHata(''); setEpostaAdimi('adres'); }} />
      )}
      {epostaAdimi === 'adres' && (
        <View style={{ gap: Bosluk.sm }}>
          <Girdi deger={adres} degis={setAdres} ipucu="isim@ornek.com" eposta />
          <AppButton
            label="Kod gönder"
            disabled={!epostaGecerli(adres)}
            onPress={() => {
              const sonuc = kontrol(adres);
              setHata(sonuc ?? '');
              if (!sonuc) setEpostaAdimi('kod');
            }}
          />
        </View>
      )}
      {epostaAdimi === 'kod' && (
        <View style={{ gap: Bosluk.sm }}>
          <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>
            {adres.trim()} adresine 6 haneli bir kod gönderdik. (Prototip: kod {DENEME_KODU})
          </Metin>
          <Girdi deger={kod} degis={(t) => setKod(t.replace(/\D/g, '').slice(0, 6))} ipucu="6 haneli kod" sayi />
          <AppButton
            label="Devam"
            disabled={kod.length !== 6}
            onPress={() => {
              if (kod !== DENEME_KODU) return setHata('Kod yanlış. E-postandaki 6 haneli kodu yaz.');
              dene({ yontem: 'eposta', eposta: adres });
            }}
          />
          <Pressable onPress={() => { setEpostaAdimi('adres'); setKod(''); }} hitSlop={8}>
            <Metin style={{ ...Yazi.etiket, color: Colors.accent }}>E-postayı değiştir</Metin>
          </Pressable>
        </View>
      )}

      {hata !== '' && (
        <View style={{ flexDirection: 'row', gap: Bosluk.sm, padding: Bosluk.md, borderRadius: Kose.md, backgroundColor: Colors.heartSoft }}>
          <Icon name="info" size={18} color={Colors.heart} />
          <Metin style={{ ...Yazi.ikincil, flex: 1, color: Colors.text }}>{hata}</Metin>
        </View>
      )}

      {/* Google / Apple hesap penceresi (prototipte hesabin e-postasi sorulur) */}
      <Modal visible={!!pencere} transparent animationType="fade" onRequestClose={() => setPencere(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(7,24,45,0.4)', justifyContent: 'center', padding: Bosluk.xl }}>
          <View style={[icerikOrtala, { backgroundColor: Colors.white, borderRadius: 20, padding: Bosluk.xl, gap: Bosluk.md }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Bosluk.sm }}>
              {pencere === 'google' ? <GoogleLogo size={22} /> : <AppleLogo boyut={20} />}
              <Metin style={Yazi.kartBasligi}>{pencere === 'google' ? 'Google hesabını seç' : 'Apple ile giriş'}</Metin>
            </View>
            <Metin style={{ ...Yazi.ikincil, color: Colors.textMuted }}>
              Prototip: gerçekte {pencere === 'google' ? 'Google' : 'Apple'} penceresi açılır. Burada hesabın e-postasını yaz.
            </Metin>
            <Girdi deger={adres} degis={setAdres} ipucu="isim@gmail.com" eposta />
            {hata !== '' && <Metin style={{ ...Yazi.ikincil, color: Colors.heart }}>{hata}</Metin>}
            <AppButton
              label="Devam"
              disabled={!epostaGecerli(adres)}
              onPress={() => {
                if (dene({ yontem: pencere!, eposta: adres })) setPencere(null);
              }}
            />
            <Pressable onPress={() => setPencere(null)} style={{ alignSelf: 'center' }} hitSlop={8}>
              <Metin style={{ ...Yazi.etiket, color: Colors.textMuted }}>Vazgeç</Metin>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function SaglayiciDugmesi({ ad, logo, koyu, onPress }: { ad: string; logo: ReactNode; koyu?: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Bosluk.md, minHeight: 52, borderRadius: 999, borderWidth: 1.5, borderColor: koyu ? '#000' : Colors.border, backgroundColor: koyu ? '#000' : Colors.white },
        pressed && { opacity: 0.8 },
      ]}>
      {logo}
      <Metin style={{ fontSize: 16, fontWeight: '600', color: koyu ? Colors.white : Colors.text }}>{ad}</Metin>
    </Pressable>
  );
}

function Girdi({ deger, degis, ipucu, eposta, sayi }: { deger: string; degis: (t: string) => void; ipucu: string; eposta?: boolean; sayi?: boolean }) {
  return (
    <TextInput
      value={deger}
      onChangeText={degis}
      placeholder={ipucu}
      placeholderTextColor={Colors.textFaint}
      keyboardType={eposta ? 'email-address' : sayi ? 'number-pad' : 'default'}
      autoCapitalize="none"
      autoCorrect={false}
      style={{ borderWidth: 1, borderColor: Colors.borderInput, borderRadius: Kose.md, backgroundColor: Colors.white, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, fontFamily: 'Outfit_400Regular', color: Colors.text, letterSpacing: sayi ? 4 : 0 }}
    />
  );
}
