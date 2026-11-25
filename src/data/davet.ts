import { Platform, Share } from 'react-native';

/**
 * Davet kodunu paylasir: telefonda paylasim penceresi, web'de panoya kopyalar.
 * Basariliysa true doner (cagiran davet hakkini dusurur).
 */
export async function davetPaylas(kod: string, neden?: string): Promise<boolean> {
  const metin = `${neden ? neden + ' ' : ''}Seni ExCom Plus'a davet ediyorum. Davet kodun: ${kod}`;
  try {
    if (Platform.OS === 'web') {
      await navigator.clipboard?.writeText(metin);
    } else {
      await Share.share({ message: metin });
    }
    return true;
  } catch {
    return false;
  }
}
