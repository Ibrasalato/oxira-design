// French copy for the ready-made plan pages (same shape as `en` in ../plans.ts).
import type { PlansText } from '../plans';

export const text: PlansText = {
  nav: 'Plans prêts',
  hubTitle: 'Plans de maison et de villa par taille de terrain | Oxira Design',
  hubDesc: 'Plans gratuits de villa, maison de plain-pied, duplex et immeuble pour chaque taille de terrain : 15×25, 20×30, 25×30 m et plus. Ouvrez, modifiez et téléchargez en DXF ou IFC.',
  hubKicker: 'Plans prêts',
  hubH1: 'Plans de maison par taille de terrain',
  hubLead: 'Choisissez la taille de votre terrain et le nombre de chambres, et découvrez un plan complet de chaque niveau avec les surfaces des pièces. Ouvrez n’importe quel plan dans l’éditeur pour déplacer les murs et modifier les pièces, téléchargez-le en DXF, IFC ou PDF, ou demandez à un ingénieur de le transformer en plans d’exécution.',
  kinds: {
    villa: { name: 'Villa', plural: 'Villas à étage', intro: 'une villa à étage avec annexe sur le toit' },
    house: { name: 'Maison de plain-pied', plural: 'Maisons de plain-pied', intro: 'une maison de plain-pied' },
    duplex: { name: 'Duplex', plural: 'Duplex', intro: 'un duplex (deux logements mitoyens)' },
    building: { name: 'Immeuble', plural: 'Immeubles d’appartements', intro: 'un immeuble d’appartements' },
  },
  title: 'Plan {kind} {w}×{d} m, {beds} chambres',
  titleBld: 'Plan d’immeuble {w}×{d} m, appartements {beds} chambres',
  h1: 'Plan {kind} pour un terrain de {w}×{d} m avec {beds} chambres',
  h1Bld: 'Plan d’immeuble pour un terrain de {w}×{d} m avec appartements de {beds} chambres',
  meta: 'Plan {kind} pour un terrain de {w}×{d} m ({area} m²) : {beds} chambres, {built} m² construits sur {floors}. Gratuit et modifiable ; téléchargement DXF ou IFC.',
  metaBld: 'Plan d’immeuble pour un terrain de {w}×{d} m ({area} m²) : {units} appartements de {beds} chambres, {built} m² construits. Gratuit, modifiable ; DXF ou IFC.',
  intro: 'Un plan de principe pour {kindIntro} sur un terrain de {w} × {d} mètres ({area} m²) donnant sur une rue, avec un recul de {front} m en façade et de {side} m sur les côtés. Il compte {beds} chambres et environ {built} m² de surface construite sur {floors}, avec une emprise au sol de {cov}% au rez-de-chaussée.',
  introBld: 'Un plan de principe pour un immeuble d’appartements sur un terrain de {w} × {d} mètres ({area} m²) : {units} appartements de {beds} chambres chacun, autour d’un escalier et d’un ascenseur centraux. Environ {built} m² de surface construite sur {floors}.',
  facts: { plot: 'Terrain', built: 'Surface construite', floors: 'Niveaux', coverage: 'Emprise au sol', beds: 'Chambres', units: 'Appartements', rooms: 'Pièces' },
  floors1: 'un niveau', floors2: 'deux niveaux', floorsN: '{n} niveaux',
  schedule: 'Tableau des surfaces', room: 'Pièce', area: 'Surface',
  open: 'Ouvrir et modifier ce plan', openSub: 'Déplacez les murs, changez les pièces et les dimensions, puis téléchargez en DXF, IFC ou PDF. Gratuit.', order: 'Le faire développer par un ingénieur', view3d: 'Voir en 3D',
  sameSize: 'Même terrain, autre nombre de chambres', similar: 'Plans similaires', all: 'Tous les plans prêts', plotSize: 'Taille du terrain', bedsN: '{n} chambres',
  note: 'Ceci est un plan de principe généré automatiquement pour illustrer l’idée et les surfaces, selon les règles de construction courantes dans les pays du Golfe. Les plans définitifs doivent être validés par un ingénieur agréé conformément à la réglementation locale.',
  home: 'Accueil',
};
