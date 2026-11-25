import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { Colors } from '@/constants/theme';

/**
 * Uygulamadaki tum ikonlar burada SVG olarak cizilir.
 * Boylece ekstra ikon fontu yuklemeye gerek kalmaz ve
 * ikonlar iOS, Android ve web'de ayni gorunur.
 */
export type IconName =
  | 'home'
  | 'users'
  | 'calendar'
  | 'user'
  | 'plus'
  | 'bell'
  | 'chevron-down'
  | 'arrow-left'
  | 'map-pin'
  | 'harita'
  | 'heart'
  | 'comment'
  | 'bank'
  | 'sliders'
  | 'calendar-check'
  | 'building'
  | 'id-card'
  | 'check'
  | 'check-circle'
  | 'x-circle'
  | 'phone'
  | 'mail'
  | 'lock'
  | 'megaphone'
  | 'chevron-right'
  | 'search'
  | 'x'
  | 'send'
  | 'catal'
  | 'yatak'
  | 'canta'
  | 'mezuniyet'
  | 'palet'
  | 'nokta'
  | 'dukkan'
  | 'shield'
  | 'clock'
  | 'arrow-right'
  | 'credit-card'
  | 'pencil'
  | 'trash'
  | 'eye'
  | 'eye-off'
  | 'compass'
  | 'bulb'
  | 'info'
  | 'bayrak'
  | 'briefcase'
  | 'chart'
  | 'gift'
  | 'qr'
  | 'gear'
  | 'mikrofon'
  | 'bookmark'
  | 'etiket'
  | 'yayin'
  | 'user-plus'
  | 'user-minus'
  | 'user-clock'
  | 'user-check'
  | 'gulen'
  | 'alev'
  | 'bravo'
  | 'laptop'
  | 'araba'
  | 'dambil'
  | 'soru'
  | 'cikis'
  | 'oynat'
  | 'duraklat'
  | 'resim'
  | 'kamera'
  | 'pin'
  | 'muzik'
  | 'link'
  | 'yildiz'
  | 'anahtar'
  | 'paylas'
  | 'arti-kare'
  | 'kopyala'
  | 'asagi-daire'
  | 'telefon'
  /** Dort Tas oyunu: tahta ve taslar (13 Kasim 2026) */
  | 'dort-tas';

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  /** Ikonun ici de boyansin mi? (begenilen kalp gibi) */
  dolu?: boolean;
};

export function Icon({
  name,
  size = 22,
  color = Colors.text,
  /* Rehber: 24 piksel izgara, 2 piksel kontur */
  strokeWidth = 2,
  dolu = false,
}: IconProps) {
  const stroke: StrokeProps = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    fill: dolu ? color : 'none',
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {renderPaths(name, stroke, color)}
    </Svg>
  );
}

type StrokeProps = {
  stroke: string;
  strokeWidth: number;
  strokeLinecap: 'round';
  strokeLinejoin: 'round';
  fill: string;
};

function renderPaths(name: IconName, s: StrokeProps, color: string) {
  switch (name) {
    case 'home':
      return <Path {...s} d="M3.5 10.6 12 3.6l8.5 7v9.1a.9.9 0 0 1-.9.9h-4.4v-5.9h-4.4v5.9H4.4a.9.9 0 0 1-.9-.9Z" />;

    case 'users':
      return (
        <>
          <Path {...s} d="M16 20.5v-1.7a3.8 3.8 0 0 0-3.8-3.8H6.3a3.8 3.8 0 0 0-3.8 3.8v1.7" />
          <Circle {...s} cx="9.2" cy="7.7" r="3.8" />
          <Path {...s} d="M21.5 20.5v-1.7a3.8 3.8 0 0 0-2.9-3.7" />
          <Path {...s} d="M15.4 4.1a3.8 3.8 0 0 1 0 7.3" />
        </>
      );

    case 'calendar':
      /* Dolu hali: govde dolu, cizgiler beyaz (alt menude secili sekme) */
      if (s.fill !== 'none') {
        return (
          <>
            <Rect {...s} x="3.2" y="5" width="17.6" height="16" rx="3" />
            <Path {...s} fill="none" stroke="#FFFFFF" d="M3.2 10h17.6" />
            <Path {...s} fill="none" d="M8.2 3v3M15.8 3v3" />
          </>
        );
      }
      return (
        <>
          <Rect {...s} x="3.2" y="5" width="17.6" height="16" rx="3" />
          <Path {...s} d="M8.2 3v4M15.8 3v4M3.2 10h17.6" />
        </>
      );

    case 'calendar-check':
      return (
        <>
          <Rect {...s} x="3.2" y="5" width="17.6" height="16" rx="3" />
          <Path {...s} d="M8.2 3v4M15.8 3v4M3.2 10h17.6" />
          <Path {...s} d="m9.3 15.2 1.9 1.9 3.5-3.6" />
        </>
      );

    case 'user':
      return (
        <>
          <Path {...s} d="M19.5 20.5v-1.8a4 4 0 0 0-4-4h-7a4 4 0 0 0-4 4v1.8" />
          <Circle {...s} cx="12" cy="7.5" r="4" />
        </>
      );

    case 'plus':
      return <Path {...s} d="M12 5.5v13M5.5 12h13" />;

    case 'bell':
      return (
        <>
          <Path {...s} d="M18 8.6a6 6 0 1 0-12 0c0 6.4-2.6 8.2-2.6 8.2h17.2S18 15 18 8.6Z" />
          <Path {...s} d="M13.7 20.4a2 2 0 0 1-3.4 0" />
        </>
      );

    case 'chevron-down':
      return <Path {...s} d="m6.5 9.5 5.5 5.5 5.5-5.5" />;

    case 'arrow-left':
      return <Path {...s} d="M19 12H5.5M12 18.5 5.5 12 12 5.5" />;

    case 'map-pin':
      return (
        <>
          <Path {...s} d="M20.5 10.4c0 6.3-8.5 11.8-8.5 11.8s-8.5-5.5-8.5-11.8a8.5 8.5 0 0 1 17 0Z" />
          <Circle {...s} cx="12" cy="10.2" r="2.9" />
        </>
      );

    /* Katlanmis kagit harita (Ex'ler Nerede?, 15 Ekim 2026) */
    case 'harita':
      return (
        <>
          <Path {...s} d="M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6l-6-2.1Z" fill="none" />
          <Path {...s} d="M9 4.5v13M15 6.6v13" />
        </>
      );

    /* Zincir baglanti ve yildiz (Ex Party calma listesi, 25 Ekim 2026) */
    case 'link':
      return (
        <>
          <Path {...s} d="M10 13.5a4.2 4.2 0 0 0 6 0l3-3a4.2 4.2 0 0 0-6-6l-1.2 1.2" fill="none" />
          <Path {...s} d="M14 10.5a4.2 4.2 0 0 0-6 0l-3 3a4.2 4.2 0 0 0 6 6l1.2-1.2" fill="none" />
        </>
      );

    /* Ekran basi simgeleri (giris, ana ekran rehberi; 28 Ekim 2026) */
    case 'anahtar':
      return (
        <>
          <Circle {...s} cx={7.5} cy={15.5} r={4} />
          <Path {...s} d="m10.4 12.6 9.1-9.1M16.5 6.5l2.5 2.5M14 9l2 2" />
        </>
      );

    /* iPhone'daki Paylas simgesi: kutudan cikan ok */
    case 'paylas':
      return (
        <>
          <Path {...s} d="M12 3.5v11M8 7.5l4-4 4 4" />
          <Path {...s} d="M8.5 10.5H7a1.5 1.5 0 0 0-1.5 1.5v7A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5v-7a1.5 1.5 0 0 0-1.5-1.5h-1.5" />
        </>
      );

    /* Iki ust uste kagit: metni kopyala */
    case 'kopyala':
      return (
        <>
          <Rect {...s} x={9} y={9} width={11} height={11} rx={2.5} />
          <Path {...s} d="M15 9V6.5A2.5 2.5 0 0 0 12.5 4h-6A2.5 2.5 0 0 0 4 6.5v6A2.5 2.5 0 0 0 6.5 15H9" />
        </>
      );

    case 'arti-kare':
      return (
        <>
          <Rect {...s} x={4} y={4} width={16} height={16} rx={4} />
          <Path {...s} d="M12 8.5v7M8.5 12h7" />
        </>
      );

    /* Akilli telefon (App Store yonlendirmesi) */
    case 'dort-tas':
      return (
        <>
          <Rect {...s} x={3} y={4.5} width={18} height={15} rx={3} />
          <Circle cx={8.5} cy={10} r={1.9} fill={color} />
          <Circle cx={15.5} cy={10} r={1.9} {...s} />
          <Circle cx={8.5} cy={15} r={1.9} {...s} />
          <Circle cx={15.5} cy={15} r={1.9} fill={color} />
        </>
      );

    case 'telefon':
      return (
        <>
          <Rect {...s} x={6.5} y={2.5} width={11} height={19} rx={2.5} />
          <Path {...s} d="M10.5 18h3" />
        </>
      );

    case 'asagi-daire':
      return (
        <>
          <Circle {...s} cx={12} cy={12} r={8.5} />
          <Path {...s} d="m8.5 10.5 3.5 3.5 3.5-3.5" />
        </>
      );

    case 'yildiz':
      return (
        <Path
          {...s}
          d="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9L12 3.2z"
          fill="none"
        />
      );

    /* Muzik notasi (Profil -> Muzik Zevkim, 24 Ekim 2026) */
    case 'muzik':
      return (
        <>
          <Path {...s} d="M9 17.6V5.4l11-2v12.2" fill="none" />
          <Circle {...s} cx="6.6" cy="17.6" r="2.4" fill="none" />
          <Circle {...s} cx="17.6" cy="15.6" r="2.4" fill="none" />
        </>
      );

    case 'mikrofon':
      return (
        <>
          <Rect {...s} x="9" y="2.4" width="6" height="11.4" rx="3" fill="none" />
          <Path {...s} d="M5.4 10.8v1.2a6.6 6.6 0 0 0 13.2 0v-1.2" fill="none" />
          <Path {...s} d="M12 18.6V21.6M8.6 21.6h6.8" fill="none" />
        </>
      );

    /* Is ilanini "kaydet" isareti; dolu=true ile icini boyuyor */
    case 'bookmark':
      return (
        <Path
          {...s}
          d="M6.4 3.6h11.2a1.4 1.4 0 0 1 1.4 1.4v15.4L12 16.6l-7 3.8V5a1.4 1.4 0 0 1 1.4-1.4Z"
        />
      );

    /* Ortada nokta, iki yanda dalga: canli yayin */
    case 'yayin':
      return (
        <>
          <Circle {...s} cx="12" cy="12" r="2.2" />
          <Path {...s} d="M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6" />
          <Path {...s} d="M5.4 5.4a9.4 9.4 0 0 0 0 13.2M18.6 5.4a9.4 9.4 0 0 1 0 13.2" />
        </>
      );

    /* Kisi + arti: baglanti istegi gonder */
    case 'user-plus':
      return (
        <>
          <Path {...s} d="M15.5 20.5v-1.8a4 4 0 0 0-4-4H5.6a4 4 0 0 0-4 4v1.8" />
          <Circle {...s} cx="8.5" cy="7.5" r="4" />
          <Path {...s} d="M19 8.2v5.6M21.8 11h-5.6" />
        </>
      );

    /* Kisi + saat: istek gonderildi, cevap bekleniyor */
    case 'user-clock':
      return (
        <>
          <Path {...s} d="M13.5 20.5v-1.8a4 4 0 0 0-4-4H5.6a4 4 0 0 0-4 4v1.8" />
          <Circle {...s} cx="8.5" cy="7.5" r="4" />
          <Circle {...s} cx="18.5" cy="15.5" r="4" />
          <Path {...s} d="M18.5 13.6v2l1.3 1" />
        </>
      );

    /* Kisi + onay: baglanti kuruldu */
    case 'user-check':
      return (
        <>
          <Path {...s} d="M15.5 20.5v-1.8a4 4 0 0 0-4-4H5.6a4 4 0 0 0-4 4v1.8" />
          <Circle {...s} cx="8.5" cy="7.5" r="4" />
          <Path {...s} d="M16.2 11.2l2 2 3.8-3.8" />
        </>
      );

    /* Kisi + eksi: gonderilen istegi geri cek */
    case 'user-minus':
      return (
        <>
          <Path {...s} d="M15.5 20.5v-1.8a4 4 0 0 0-4-4H5.6a4 4 0 0 0-4 4v1.8" />
          <Circle {...s} cx="8.5" cy="7.5" r="4" />
          <Path {...s} d="M21.8 11h-5.6" />
        </>
      );

    case 'etiket':
      return (
        <>
          <Path
            {...s}
            d="M11.3 3.2H4.8a1.6 1.6 0 0 0-1.6 1.6v6.5c0 .4.2.8.5 1.1l7.8 7.8a1.6 1.6 0 0 0 2.3 0l6.5-6.5a1.6 1.6 0 0 0 0-2.3l-7.8-7.8a1.6 1.6 0 0 0-1.2-.4Z"
            fill="none"
          />
          <Circle {...s} cx="7.9" cy="7.9" r="1.3" fill="none" />
        </>
      );

    /* Canli yayin tepkileri (renkli emoji yerine cizgi ikon) */
    case 'gulen':
      return (
        <>
          <Circle {...s} cx="12" cy="12" r="9.2" />
          <Path {...s} fill="none" d="M8 14s1.5 2.2 4 2.2 4-2.2 4-2.2M9 9.3h.01M15 9.3h.01" />
        </>
      );

    case 'alev':
      return (
        <Path
          {...s}
          d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4.1 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5Z"
        />
      );

    case 'bravo':
      return (
        <>
          <Path {...s} fill="none" d="M7 10v12" />
          <Path
            {...s}
            d="M15 5.9 14 10h5.8a2 2 0 0 1 1.9 2.6l-2.3 8a2 2 0 0 1-1.9 1.4H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.8a2 2 0 0 0 1.8-1.1L12 2a3.1 3.1 0 0 1 3 3.9Z"
          />
        </>
      );

    case 'oynat':
      return <Path {...s} d="M7 4.5v15l12.5-7.5Z" />;

    /* Calani durdur (calma listesi) */
    case 'duraklat':
      return (
        <>
          <Path {...s} d="M8 5v14" />
          <Path {...s} d="M16 5v14" />
        </>
      );

    /* Sabitlendi */
    case 'pin':
      return (
        <>
          <Path {...s} d="M9 3.5h6l-1 5.5 3.5 3.5H6.5L10 9Z" />
          <Path {...s} d="M12 12.5V20.5" />
        </>
      );

    /* Hikaye: kamerayla cek */
    case 'kamera':
      return (
        <>
          <Path {...s} d="M3 8.5A2 2 0 0 1 5 6.5h2.2l1.4-2h6.8l1.4 2H19a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
          <Circle {...s} cx="12" cy="13" r="3.6" />
        </>
      );

    /* Mesaja fotograf/video ekle */
    case 'resim':
      return (
        <>
          <Rect {...s} x="3" y="4.5" width="18" height="15" rx="2.5" />
          <Circle {...s} cx="8.5" cy="9.5" r="1.6" />
          <Path {...s} d="m21 15.5-4.8-4.8L6 19.5" />
        </>
      );

    case 'soru':
      return (
        <>
          <Circle {...s} cx="12" cy="12" r="9.5" />
          <Path {...s} fill="none" d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" />
        </>
      );

    case 'cikis':
      return (
        <Path
          {...s}
          fill="none"
          d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
        />
      );

    /* Exici kategorileri */
    case 'laptop':
      return (
        <>
          <Rect {...s} x="4" y="4.5" width="16" height="11" rx="1.8" />
          <Path {...s} fill="none" d="M2 19.5h20" />
        </>
      );

    case 'araba':
      return (
        <>
          <Path
            {...s}
            fill="none"
            d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2M9 17h6"
          />
          <Circle {...s} cx="7" cy="17" r="2" />
          <Circle {...s} cx="17" cy="17" r="2" />
        </>
      );

    case 'dambil':
      return (
        <Path
          {...s}
          fill="none"
          d="m6.5 6.5 11 11M21 21l-1-1M3 3l1 1M18 22l4-4M2 6l4-4M3 10l7-7M14 21l7-7"
        />
      );

    case 'heart':
      return (
        <Path
          {...s}
          d="M20.6 5.3a5.2 5.2 0 0 0-7.4 0L12 6.5l-1.2-1.2a5.2 5.2 0 0 0-7.4 7.4l1.2 1.2L12 21.3l7.4-7.4 1.2-1.2a5.2 5.2 0 0 0 0-7.4Z"
        />
      );

    case 'comment':
      return (
        <Path
          {...s}
          d="M20.5 11.6a8 8 0 0 1-8.6 8 8 8 0 0 1-3.6-.9L3.5 20.5l1.8-4.8a8 8 0 0 1-.9-3.6 8 8 0 0 1 8-8.6h.5a8 8 0 0 1 7.6 7.6Z"
        />
      );

    case 'bank':
      return (
        <>
          <Path {...s} d="m2.8 9.3 9.2-5.8 9.2 5.8" />
          <Path {...s} d="M5.5 11.5v7M10 11.5v7M14 11.5v7M18.5 11.5v7" />
          <Path {...s} d="M3.2 20.8h17.6" />
        </>
      );

    case 'sliders':
      return (
        <>
          <Path {...s} d="M3.5 6.5h16M3.5 12h16M3.5 17.5h16" />
          <Circle cx="15" cy="6.5" r="2.2" fill={color} />
          <Circle cx="8.5" cy="12" r="2.2" fill={color} />
          <Circle cx="16.5" cy="17.5" r="2.2" fill={color} />
        </>
      );

    case 'building':
      return (
        <>
          <Path {...s} d="M4 20.8V8.6l8-5 8 5v12.2" />
          <Path {...s} d="M3 20.8h18" />
          <Path {...s} d="M9.8 20.8v-4.6h4.4v4.6" />
          <Circle {...s} cx="12" cy="11" r="1.6" />
        </>
      );

    case 'gear':
      // Disli: govde + ortadaki delik
      return (
        <>
          <Circle {...s} cx="12" cy="12" r="3.1" />
          <Path
            {...s}
            d="M19.4 14.2a1.5 1.5 0 0 0 .3 1.7l.1.1a1.8 1.8 0 1 1-2.6 2.6l-.1-.1a1.5 1.5 0 0 0-1.7-.3 1.5 1.5 0 0 0-.9 1.4v.2a1.8 1.8 0 1 1-3.6 0v-.1a1.5 1.5 0 0 0-1-1.4 1.5 1.5 0 0 0-1.7.3l-.1.1a1.8 1.8 0 1 1-2.6-2.6l.1-.1a1.5 1.5 0 0 0 .3-1.7 1.5 1.5 0 0 0-1.4-.9h-.2a1.8 1.8 0 1 1 0-3.6h.1a1.5 1.5 0 0 0 1.4-1 1.5 1.5 0 0 0-.3-1.7l-.1-.1a1.8 1.8 0 1 1 2.6-2.6l.1.1a1.5 1.5 0 0 0 1.7.3h.1a1.5 1.5 0 0 0 .9-1.4v-.2a1.8 1.8 0 1 1 3.6 0v.1a1.5 1.5 0 0 0 .9 1.4 1.5 1.5 0 0 0 1.7-.3l.1-.1a1.8 1.8 0 1 1 2.6 2.6l-.1.1a1.5 1.5 0 0 0-.3 1.7v.1a1.5 1.5 0 0 0 1.4.9h.2a1.8 1.8 0 1 1 0 3.6h-.1a1.5 1.5 0 0 0-1.4.9Z"
          />
        </>
      );

    case 'qr':
      // Kare kod: uc koseye konum karesi, ortada birkac nokta
      return (
        <>
          <Rect {...s} x="3" y="3" width="7" height="7" rx="1.6" />
          <Rect {...s} x="14" y="3" width="7" height="7" rx="1.6" />
          <Rect {...s} x="3" y="14" width="7" height="7" rx="1.6" />
          <Path {...s} d="M14 14h3M20 14h1M14 17.5h1M17.5 17.5h3.5M14 21h3M20 21h1" />
        </>
      );

    case 'id-card':
      return (
        <>
          <Rect {...s} x="2.8" y="5" width="18.4" height="14" rx="3" />
          <Circle {...s} cx="8.6" cy="10.7" r="2.2" />
          <Path {...s} d="M5.2 16.2a3.6 3.6 0 0 1 6.8 0" />
          <Path {...s} d="M14.8 9.6h3.8M14.8 13.4h3.8" />
        </>
      );

    case 'check':
      return <Path {...s} d="m5 12.5 4.5 4.5L19 7.5" />;

    case 'check-circle':
      return (
        <>
          <Circle {...s} cx="12" cy="12" r="9" />
          <Path {...s} d="m8.2 12.3 2.6 2.6 5.1-5.3" />
        </>
      );

    case 'x-circle':
      return (
        <>
          <Circle {...s} cx="12" cy="12" r="9" />
          <Path {...s} d="m9.3 9.3 5.4 5.4M14.7 9.3l-5.4 5.4" />
        </>
      );

    case 'phone':
      return (
        <Path
          {...s}
          d="M21 16.9v2.6a1.9 1.9 0 0 1-2.1 1.9 18.8 18.8 0 0 1-8.2-2.9 18.5 18.5 0 0 1-5.7-5.7A18.8 18.8 0 0 1 2.1 4.6 1.9 1.9 0 0 1 4 2.5h2.6a1.9 1.9 0 0 1 1.9 1.6c.1 1 .4 1.9.7 2.7a1.9 1.9 0 0 1-.4 2L7.6 10a15 15 0 0 0 5.7 5.7l1.2-1.2a1.9 1.9 0 0 1 2-.4c.9.3 1.8.6 2.7.7a1.9 1.9 0 0 1 1.6 1.9Z"
        />
      );

    case 'mail':
      return (
        <>
          <Rect {...s} x="3" y="5" width="18" height="14" rx="3" />
          <Path {...s} d="m3.8 7.4 8.2 5.8 8.2-5.8" />
        </>
      );

    case 'lock':
      return (
        <>
          <Rect {...s} x="3.6" y="10.4" width="16.8" height="10.2" rx="3" />
          <Path {...s} d="M7.6 10.4V7.6a4.4 4.4 0 0 1 8.8 0v2.8" />
        </>
      );

    case 'megaphone':
      return (
        <>
          <Path {...s} d="M3.2 10.8v2.4a1 1 0 0 0 1 1h2.2l7.6 4.6V5.2L6.4 9.8H4.2a1 1 0 0 0-1 1Z" />
          <Path {...s} d="M17.4 9.2a4 4 0 0 1 0 5.6" />
          <Path {...s} d="M7.2 14.4 8.4 20" />
        </>
      );

    case 'chevron-right':
      return <Path {...s} d="m9.5 6.5 5.5 5.5-5.5 5.5" />;

    case 'bulb':
      return (
        <>
          <Path
            {...s}
            d="M9.2 16.2a6 6 0 1 1 5.6 0v1.3a1.5 1.5 0 0 1-1.5 1.5h-2.6a1.5 1.5 0 0 1-1.5-1.5z"
            fill="none"
          />
          <Path {...s} d="M10.3 21.2h3.4" fill="none" />
        </>
      );

    case 'bayrak':
      return (
        <>
          <Path {...s} d="M5 21V4.5" fill="none" />
          <Path {...s} d="M5 4.5h11.5l-2.2 4 2.2 4H5" fill="none" />
        </>
      );

    case 'info':
      return (
        <>
          <Circle {...s} cx="12" cy="12" r="9" fill="none" />
          <Path {...s} d="M12 11v5.2" fill="none" />
          <Circle cx="12" cy="7.8" r="1.1" fill={color} />
        </>
      );

    case 'briefcase':
      return (
        <>
          <Rect {...s} x="3" y="7.5" width="18" height="12.5" rx="2.4" fill="none" />
          <Path {...s} d="M9 7.5V6a1.8 1.8 0 0 1 1.8-1.8h2.4A1.8 1.8 0 0 1 15 6v1.5" fill="none" />
          <Path {...s} d="M3 12.6h18" fill="none" />
        </>
      );

    case 'chart':
      return (
        <>
          <Path {...s} d="M5.4 19.5v-5.2" fill="none" strokeWidth={2.6} />
          <Path {...s} d="M12 19.5V8.8" fill="none" strokeWidth={2.6} />
          <Path {...s} d="M18.6 19.5V4.5" fill="none" strokeWidth={2.6} />
        </>
      );

    case 'gift':
      return (
        <>
          <Rect {...s} x="3" y="9.6" width="18" height="3.6" rx="1.2" fill="none" />
          <Path {...s} d="M4.6 13.2v6a1.8 1.8 0 0 0 1.8 1.8h11.2a1.8 1.8 0 0 0 1.8-1.8v-6" fill="none" />
          <Path {...s} d="M12 9.6V21" fill="none" />
          <Path
            {...s}
            d="M12 9.6H8.1a2.3 2.3 0 1 1 0-4.6c2.3 0 3.9 4.6 3.9 4.6m0 0h3.9a2.3 2.3 0 1 0 0-4.6C13.6 5 12 9.6 12 9.6"
            fill="none"
          />
        </>
      );

    case 'compass':
      if (s.fill !== 'none') {
        return (
          <>
            <Circle {...s} cx="12" cy="12" r="9" />
            <Path {...s} stroke="#FFFFFF" fill="#FFFFFF" d="m15.6 8.4-2 5.2-5.2 2 2-5.2z" />
          </>
        );
      }
      return (
        <>
          <Circle {...s} cx="12" cy="12" r="9" fill="none" />
          <Path {...s} d="m15.6 8.4-2 5.2-5.2 2 2-5.2z" fill="none" />
        </>
      );

    case 'search':
      return (
        <>
          <Circle {...s} cx="11" cy="11" r="7.2" fill="none" />
          <Path {...s} d="m16.4 16.4 4.4 4.4" fill="none" />
        </>
      );

    case 'x':
      return <Path {...s} d="m6.5 6.5 11 11M17.5 6.5l-11 11" fill="none" />;

    case 'arrow-right':
      return <Path {...s} d="M4.5 12h15M13 5.4l6.6 6.6-6.6 6.6" fill="none" />;

    case 'eye':
      return (
        <>
          <Path {...s} d="M2.6 12S6.2 5.6 12 5.6 21.4 12 21.4 12 17.8 18.4 12 18.4 2.6 12 2.6 12Z" fill="none" />
          <Circle {...s} cx="12" cy="12" r="3.1" fill="none" />
        </>
      );

    case 'eye-off':
      return (
        <>
          <Path {...s} d="M9.9 5.9a9.6 9.6 0 0 1 2.1-.3c5.8 0 9.4 6.4 9.4 6.4a17 17 0 0 1-2.7 3.6" fill="none" />
          <Path {...s} d="M6.4 6.9A17 17 0 0 0 2.6 12S6.2 18.4 12 18.4a9.3 9.3 0 0 0 3.9-.8" fill="none" />
          <Path {...s} d="M9.9 9.9a3.1 3.1 0 0 0 4.3 4.3" fill="none" />
          <Path {...s} d="m3.6 3.6 16.8 16.8" fill="none" />
        </>
      );

    case 'pencil':
      return (
        <>
          <Path {...s} d="M4 20.2h3.6L18.8 9a2.5 2.5 0 0 0-3.6-3.6L4 16.6Z" fill="none" />
          <Path {...s} d="m14.2 6.4 3.4 3.4" fill="none" />
        </>
      );

    case 'trash':
      return (
        <>
          <Path {...s} d="M4.2 6.6h15.6" fill="none" />
          <Path {...s} d="M9.2 6.6V4.8a1.4 1.4 0 0 1 1.4-1.4h2.8a1.4 1.4 0 0 1 1.4 1.4v1.8" fill="none" />
          <Path {...s} d="M6.6 6.6 7.5 19a1.6 1.6 0 0 0 1.6 1.5h5.8a1.6 1.6 0 0 0 1.6-1.5l.9-12.4" fill="none" />
        </>
      );

    case 'credit-card':
      return (
        <>
          <Rect {...s} x="2.6" y="5.4" width="18.8" height="13.2" rx="3.2" fill="none" />
          <Path {...s} d="M2.6 10h18.8" fill="none" />
        </>
      );

    case 'shield':
      return (
        <>
          <Path {...s} d="M12 2.6 4.8 5.3v5.7c0 4.3 3 8.4 7.2 10.1 4.2-1.7 7.2-5.8 7.2-10.1V5.3Z" />
          <Path {...s} d="m9.1 12.1 2.1 2.1 3.8-4" fill="none" />
        </>
      );

    case 'clock':
      return (
        <>
          <Circle {...s} cx="12" cy="12" r="9" fill="none" />
          <Path {...s} d="M12 7.1V12l3.2 1.9" fill="none" />
        </>
      );

    case 'send':
      return (
        <>
          <Path {...s} d="M21 3 10.5 13.5" fill="none" />
          <Path {...s} d="M21 3 14.3 21l-3.8-7.5L3 9.7Z" />
        </>
      );

    /* "Kendi Isini Kuranlar" kategorileri icin eklendi */
    case 'catal':
      return (
        <>
          <Path {...s} d="M7 3v7a2.5 2.5 0 0 0 5 0V3" fill="none" />
          <Path {...s} d="M9.5 12.5V21" fill="none" />
          <Path {...s} d="M17.5 3c-1.4 1.2-2 3-2 5.2 0 1.6.7 2.6 2 2.9V21" fill="none" />
        </>
      );

    case 'yatak':
      return (
        <>
          <Path {...s} d="M3 18V7" fill="none" />
          <Path {...s} d="M3 11h18v7" fill="none" />
          <Path {...s} d="M3 15h18" fill="none" />
          <Circle {...s} cx="7.5" cy="8.5" r="1.6" fill="none" />
        </>
      );

    case 'canta':
      return (
        <>
          <Path {...s} d="M4.5 8h15l-1.2 12H5.7Z" fill="none" />
          <Path {...s} d="M8.5 10V6.5a3.5 3.5 0 0 1 7 0V10" fill="none" />
        </>
      );

    case 'mezuniyet':
      return (
        <>
          <Path {...s} d="M12 4 2.5 8.6 12 13.2l9.5-4.6Z" fill="none" />
          <Path {...s} d="M6.5 10.9v4.6c0 1.6 2.5 2.8 5.5 2.8s5.5-1.2 5.5-2.8v-4.6" fill="none" />
          <Path {...s} d="M21.5 8.6v5" fill="none" />
        </>
      );

    case 'palet':
      return (
        <>
          <Path
            {...s}
            d="M12 3a9 9 0 0 0 0 18c1 0 1.7-.8 1.7-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.9.8-1.7 1.7-1.7H16a5 5 0 0 0 5-5c0-3.9-4-7.2-9-7.2Z"
            fill="none"
          />
          <Circle {...s} cx="7.8" cy="11.5" r="1.1" fill="none" />
          <Circle {...s} cx="11" cy="7.8" r="1.1" fill="none" />
          <Circle {...s} cx="15.5" cy="9" r="1.1" fill="none" />
        </>
      );

    case 'dukkan':
      return (
        <>
          <Path {...s} d="M3.6 9.3 5 4.5h14l1.4 4.8" fill="none" />
          <Path
            {...s}
            d="M3.6 9.3a2.9 2.9 0 0 0 5.6 0 2.9 2.9 0 0 0 5.6 0 2.9 2.9 0 0 0 5.6 0"
            fill="none"
          />
          <Path {...s} d="M5 11.6V19.5h14v-7.9" fill="none" />
          <Rect {...s} x="9.6" y="14" width="4.8" height="5.5" rx="0.6" fill="none" />
        </>
      );

    case 'nokta':
      return (
        <>
          <Circle {...s} cx="5" cy="12" r="1.7" fill="none" />
          <Circle {...s} cx="12" cy="12" r="1.7" fill="none" />
          <Circle {...s} cx="19" cy="12" r="1.7" fill="none" />
        </>
      );
  }
}
