import * as ImagePicker from 'expo-image-picker';

/**
 * Galeriden kare bir profil fotografi sectirir.
 * Prototipte foto cihazda saklandigi icin kucuk bir data URI olarak dondurulur.
 * Secim iptal edilirse undefined.
 */
export async function fotoSec(): Promise<string | undefined> {
  const sonuc = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.5,
    base64: true,
  });
  if (sonuc.canceled) return undefined;
  const v = sonuc.assets[0];
  if (v.base64) return `data:${v.mimeType ?? 'image/jpeg'};base64,${v.base64}`;
  return v.uri;
}
