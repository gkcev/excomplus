import { createElement } from 'react';
import { Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { Colors, Kose } from '@/constants/theme';

/**
 * PROFIL SARKISI OYNATICISI (ExCom'dan)
 * Spotify'in kendi kucuk gomulu oynaticisi (80 piksel). Spotify'a girmis
 * olan tam sarkiyi, girmemis olan 30 saniyelik parcasini dinler.
 * Anahtar ya da gelistirici hesabi gerekmez.
 */
export function SpotifyOynatici({ spotifyId, baslik }: { spotifyId: string; baslik?: string }) {
  const kaynak = `https://open.spotify.com/embed/track/${spotifyId}?utm_source=excomplus`;
  return (
    <View style={{ width: '100%', height: 80, borderRadius: Kose.md, overflow: 'hidden', backgroundColor: Colors.primary }}>
      {Platform.OS === 'web' ? (
        createElement('iframe', {
          src: kaynak,
          title: `Spotify: ${baslik || 'profil şarkısı'}`,
          allow: 'autoplay; clipboard-write; encrypted-media; picture-in-picture',
          loading: 'lazy',
          style: { border: 0, width: '100%', height: '100%' },
        })
      ) : (
        <WebView source={{ uri: kaynak }} style={{ flex: 1 }} allowsInlineMediaPlayback scrollEnabled={false} javaScriptEnabled />
      )}
    </View>
  );
}

/**
 * Spotify sarki baglantisindan id cikarir.
 * "https://open.spotify.com/intl-tr/track/4uLU6hMCjMI75M1A2tKUQC?si=..." -> "4uLU6hMCjMI75M1A2tKUQC"
 */
export function spotifyIdBul(baglanti: string): string | undefined {
  const m = baglanti.trim().match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?track\/([A-Za-z0-9]{22})/) ?? baglanti.trim().match(/^spotify:track:([A-Za-z0-9]{22})$/);
  return m?.[1];
}
