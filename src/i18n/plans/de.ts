// German copy for the ready-made plan pages (same shape as `en` in ../plans.ts).
import type { PlansText } from '../plans';

export const text: PlansText = {
  nav: 'Fertige Grundrisse',
  hubTitle: 'Grundrisse für Haus & Villa nach Grundstücksgröße | Oxira Design',
  hubDesc: 'Kostenlose Grundrisse für Villa, Bungalow, Doppelhaus und Mehrfamilienhaus für jede Grundstücksgröße: 15×25, 20×30, 25×30 m und mehr. Öffnen, bearbeiten, als DXF oder IFC laden.',
  hubKicker: 'Fertige Grundrisse',
  hubH1: 'Grundrisse nach Grundstücksgröße',
  hubLead: 'Wählen Sie Ihre Grundstücksgröße und die Anzahl der Schlafzimmer und sehen Sie einen vollständigen Grundriss für jedes Geschoss mit Raumflächen. Öffnen Sie jeden Grundriss im Editor, um Wände zu verschieben und Räume zu ändern, laden Sie ihn als DXF, IFC oder PDF herunter oder lassen Sie ihn von einem Ingenieur zu Bauplänen ausarbeiten.',
  kinds: {
    villa: { name: 'Villa', plural: 'Zweigeschossige Villen', intro: 'eine zweigeschossige Villa mit Dachaufbau' },
    house: { name: 'Bungalow', plural: 'Bungalows (eingeschossig)', intro: 'einen eingeschossigen Bungalow' },
    duplex: { name: 'Doppelhaus', plural: 'Doppelhäuser', intro: 'ein Doppelhaus (zwei aneinandergebaute Wohnhäuser)' },
    building: { name: 'Mehrfamilienhaus', plural: 'Mehrfamilienhäuser', intro: 'ein Mehrfamilienhaus' },
  },
  title: '{kind}-Grundriss {w}×{d} m, {beds} Schlafzimmer',
  titleBld: 'Grundriss Mehrfamilienhaus {w}×{d} m, je {beds} Schlafzimmer',
  h1: '{kind}-Grundriss für ein Grundstück {w}×{d} m mit {beds} Schlafzimmern',
  h1Bld: 'Grundriss Mehrfamilienhaus für ein Grundstück {w}×{d} m mit Wohnungen à {beds} Schlafzimmer',
  meta: '{kind}-Grundriss für ein Grundstück {w}×{d} m ({area} m²): {beds} Schlafzimmer, {built} m² Wohnfläche über {floors}. Kostenlos und editierbar; Download als DXF oder IFC.',
  metaBld: 'Grundriss Mehrfamilienhaus für ein Grundstück {w}×{d} m ({area} m²): {units} Wohnungen mit {beds} Schlafzimmern, {built} m² Fläche. Kostenlos, editierbar; DXF oder IFC.',
  intro: 'Ein Konzeptgrundriss für {kindIntro} auf einem Grundstück von {w} × {d} Metern ({area} m²) an einer Straße, mit {front} m vorderem und {side} m seitlichem Grenzabstand. Er hat {beds} Schlafzimmer und rund {built} m² Bruttogeschossfläche über {floors}, bei {cov}% Überbauung im Erdgeschoss.',
  introBld: 'Ein Konzeptgrundriss für ein Mehrfamilienhaus auf einem Grundstück von {w} × {d} Metern ({area} m²): {units} Wohnungen mit je {beds} Schlafzimmern rund um ein zentrales Treppenhaus mit Aufzug. Rund {built} m² Bruttogeschossfläche über {floors}.',
  facts: { plot: 'Grundstück', built: 'Bebaute Fläche', floors: 'Geschosse', coverage: 'Überbauung', beds: 'Schlafzimmer', units: 'Wohnungen', rooms: 'Räume' },
  floors1: 'ein Geschoss', floors2: 'zwei Geschosse', floorsN: '{n} Geschosse',
  schedule: 'Raumliste', room: 'Raum', area: 'Fläche',
  open: 'Diesen Grundriss öffnen und bearbeiten', openSub: 'Wände verschieben, Räume und Größen ändern, dann als DXF, IFC oder PDF herunterladen. Kostenlos.', order: 'Von einem Ingenieur ausarbeiten lassen', view3d: 'In 3D ansehen',
  sameSize: 'Gleiches Grundstück, andere Zimmerzahl', similar: 'Ähnliche Grundrisse', all: 'Alle fertigen Grundrisse', plotSize: 'Grundstücksgröße', bedsN: '{n} Schlafzimmer',
  note: 'Dies ist ein automatisch erstellter Konzeptgrundriss, der Idee und Flächen zeigt und auf üblichen Bauvorschriften der Golfstaaten beruht. Die endgültigen Pläne müssen von einem zugelassenen Ingenieur nach den örtlichen Bauvorschriften genehmigt werden.',
  home: 'Startseite',
};
