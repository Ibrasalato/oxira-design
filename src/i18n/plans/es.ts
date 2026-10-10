// Spanish copy for the ready-made plan pages (same shape as `en` in ../plans.ts).
import type { PlansText } from '../plans';

export const text: PlansText = {
  nav: 'Planos listos',
  hubTitle: 'Planos de casas y villas por tamaño de terreno | Oxira Design',
  hubDesc: 'Planos gratis de villas, casas de una planta, dúplex y edificios de departamentos para cada terreno: 15×25, 20×30, 25×30 m y más. Ábralos, edítelos y descargue DXF o IFC.',
  hubKicker: 'Planos listos',
  hubH1: 'Planos de casa por tamaño de terreno',
  hubLead: 'Elija el tamaño de su terreno y el número de dormitorios y vea un plano completo de cada planta con las superficies de cada ambiente. Abra cualquier plano en el editor para mover muros y cambiar ambientes, descárguelo en DXF, IFC o PDF, o pida a un ingeniero que lo desarrolle como planos de construcción.',
  kinds: {
    villa: { name: 'Villa', plural: 'Villas de dos plantas', intro: 'una villa de dos plantas con anexo en la azotea' },
    house: { name: 'Casa de una planta', plural: 'Casas de una planta', intro: 'una casa de una planta' },
    duplex: { name: 'Dúplex', plural: 'Dúplex', intro: 'un dúplex (dos viviendas adosadas)' },
    building: { name: 'Edificio de departamentos', plural: 'Edificios de departamentos', intro: 'un edificio de departamentos' },
  },
  title: 'Plano de {kind} {w}×{d} m, {beds} dormitorios',
  titleBld: 'Plano de edificio {w}×{d} m, departamentos de {beds} dorm.',
  h1: 'Plano de {kind} para un terreno de {w}×{d} m con {beds} dormitorios',
  h1Bld: 'Plano de edificio de departamentos para un terreno de {w}×{d} m con unidades de {beds} dormitorios',
  meta: 'Plano de {kind} para un terreno de {w}×{d} m ({area} m²): {beds} dormitorios, {built} m² construidos en {floors}. Gratis y editable; descargue DXF o IFC.',
  metaBld: 'Plano de edificio para un terreno de {w}×{d} m ({area} m²): {units} departamentos de {beds} dormitorios, {built} m² construidos. Gratis y editable; DXF o IFC.',
  intro: 'Un plano conceptual para {kindIntro} en un terreno de {w} × {d} metros ({area} m²) con frente a una calle, con un retiro frontal de {front} m y retiros laterales de {side} m. Tiene {beds} dormitorios y unos {built} m² construidos en {floors}, con una ocupación de {cov}% en planta baja.',
  introBld: 'Un plano conceptual para un edificio de departamentos en un terreno de {w} × {d} metros ({area} m²): {units} departamentos de {beds} dormitorios cada uno, alrededor de una escalera y un ascensor centrales. Unos {built} m² construidos en {floors}.',
  facts: { plot: 'Terreno', built: 'Superficie construida', floors: 'Plantas', coverage: 'Ocupación', beds: 'Dormitorios', units: 'Departamentos', rooms: 'Ambientes' },
  floors1: 'una planta', floors2: 'dos plantas', floorsN: '{n} plantas',
  schedule: 'Cuadro de superficies', room: 'Ambiente', area: 'Superficie',
  open: 'Abrir y editar este plano', openSub: 'Mueva muros, cambie ambientes y medidas, y descargue DXF, IFC o PDF. Gratis.', order: 'Pedir a un ingeniero que lo desarrolle', view3d: 'Verlo en 3D',
  sameSize: 'Mismo terreno, otro número de dormitorios', similar: 'Planos similares', all: 'Todos los planos listos', plotSize: 'Tamaño del terreno', bedsN: '{n} dormitorios',
  note: 'Este es un plano conceptual automático para mostrar la idea y las superficies, basado en normas de construcción habituales en los países del Golfo. Los planos definitivos deben ser aprobados por un ingeniero matriculado según la normativa de construcción local.',
  home: 'Inicio',
};
