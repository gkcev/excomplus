import { StyleSheet, TextInput, View } from 'react-native';

import { Metin } from '@/components/temel';
import { Colors, Kose, Yazi } from '@/constants/theme';

/** Etiketli metin kutusu */
export function Alan({
  etiket,
  deger,
  degis,
  ipucu,
  klavye,
  cokSatir,
}: {
  etiket: string;
  deger: string;
  degis: (t: string) => void;
  ipucu?: string;
  klavye?: 'email-address' | 'default' | 'number-pad';
  cokSatir?: boolean;
}) {
  return (
    <View style={{ gap: 6 }}>
      <Metin style={{ ...Yazi.etiket, color: Colors.textMuted }}>{etiket}</Metin>
      <TextInput
        value={deger}
        onChangeText={degis}
        placeholder={ipucu}
        placeholderTextColor={Colors.textFaint}
        keyboardType={klavye}
        autoCapitalize={klavye === 'email-address' ? 'none' : 'sentences'}
        multiline={cokSatir}
        style={[st.girdi, cokSatir && { minHeight: 90, textAlignVertical: 'top' }]}
      />
    </View>
  );
}

const st = StyleSheet.create({
  girdi: {
    borderWidth: 1,
    borderColor: Colors.borderInput,
    borderRadius: Kose.md,
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: Colors.text,
  },
});
