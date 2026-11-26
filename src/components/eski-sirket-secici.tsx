import { SerbestListeSecici } from '@/components/serbest-liste-secici';
import { EN_COK_SIRKET, useSirketOnerileri } from '@/data/eski-sirketler';

/** Profili Duzenle -> Is & Kariyer -> "Önceki şirketlerim" */
export function EskiSirketSecici({
  secilenler,
  degistir,
}: {
  secilenler: string[];
  degistir: (yeni: string[]) => void;
}) {
  const oneriler = useSirketOnerileri();
  return (
    <SerbestListeSecici
      secilenler={secilenler}
      degistir={degistir}
      oneriler={oneriler}
      etiket="Önceki şirketlerim"
      yardim="İsteğe bağlı. Daha önce çalıştığın diğer şirketler; aynı yerden geçenler birbirini bulsun."
      ipucu="Vodafone, Garanti BBVA…"
      ikon="building"
      enCok={EN_COK_SIRKET}
      ogeAdi="şirket"
    />
  );
}
