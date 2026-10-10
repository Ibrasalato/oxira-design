// Turkish copy for the ready-made plan pages (same shape as `en` in ../plans.ts).
import type { PlansText } from '../plans';

export const text: PlansText = {
  nav: 'Hazır planlar',
  hubTitle: 'Arsa Ölçüsüne Göre Ev ve Villa Planları | Oxira Design',
  hubDesc: 'Her arsa ölçüsü için ücretsiz villa, tek katlı ev, dubleks ve apartman planları: 15×25, 20×30, 25×30 m ve daha fazlası. Planı açın, düzenleyin, DXF veya IFC olarak indirin.',
  hubKicker: 'Hazır planlar',
  hubH1: 'Arsa ölçüsüne göre ev planları',
  hubLead: 'Arsa ölçünüzü ve yatak odası sayısını seçin, her katın oda alanlarıyla birlikte tam planını görün. Duvarları taşımak ve odaları değiştirmek için herhangi bir planı editörde açın, DXF, IFC veya PDF olarak indirin ya da bir mühendisten uygulama projesine dönüştürmesini isteyin.',
  kinds: {
    villa: { name: 'Villa', plural: 'İki katlı villalar', intro: 'çatı katı ekli iki katlı villa' },
    house: { name: 'Tek katlı ev', plural: 'Tek katlı evler', intro: 'tek katlı ev' },
    duplex: { name: 'Dubleks', plural: 'Dubleksler', intro: 'dubleks (bitişik iki konut)' },
    building: { name: 'Apartman', plural: 'Apartmanlar', intro: 'apartman' },
  },
  title: '{kind} Planı {w}×{d} m, {beds} Yatak Odalı',
  titleBld: 'Apartman Planı {w}×{d} m, {beds} Yatak Odalı Daireler',
  h1: '{w}×{d} m arsa için {beds} yatak odalı {kind} planı',
  h1Bld: '{w}×{d} m arsa için {beds} yatak odalı dairelerden oluşan apartman planı',
  meta: '{w}×{d} m arsa ({area} m²) için {kind} planı: {beds} yatak odası, {floors} üzerinde {built} m² inşaat alanı. Ücretsiz ve düzenlenebilir; DXF veya IFC indirin.',
  metaBld: '{w}×{d} m arsa ({area} m²) için apartman planı: {beds} yatak odalı {units} daire, {built} m² inşaat alanı. Ücretsiz ve düzenlenebilir; DXF veya IFC indirin.',
  intro: 'Tek sokağa cepheli {w} × {d} metrelik arsa ({area} m²) üzerinde {kindIntro} için konsept plan; ön bahçe mesafesi {front} m, yan bahçe mesafeleri {side} m. {beds} yatak odası ve {floors} üzerinde yaklaşık {built} m² inşaat alanı vardır; zemin kat oturumu %{cov}.',
  introBld: '{w} × {d} metrelik arsa ({area} m²) üzerinde apartman için konsept plan: merkezi merdiven ve asansör çevresinde her biri {beds} yatak odalı {units} daire. {floors} üzerinde yaklaşık {built} m² inşaat alanı.',
  facts: { plot: 'Arsa', built: 'İnşaat alanı', floors: 'Kat sayısı', coverage: 'Taban oturumu', beds: 'Yatak odası', units: 'Daire', rooms: 'Oda' },
  floors1: 'tek kat', floors2: 'iki kat', floorsN: '{n} kat',
  schedule: 'Oda listesi', room: 'Oda', area: 'Alan',
  open: 'Bu planı açın ve düzenleyin', openSub: 'Duvarları taşıyın, odaları ve ölçüleri değiştirin, ardından DXF, IFC veya PDF indirin. Ücretsiz.', order: 'Bir mühendise geliştirtin', view3d: '3D olarak görün',
  sameSize: 'Aynı arsa, farklı oda sayısı', similar: 'Benzer planlar', all: 'Tüm hazır planlar', plotSize: 'Arsa ölçüsü', bedsN: '{n} yatak odası',
  note: 'Bu, fikri ve alanları göstermek için Körfez ülkelerindeki yaygın yapı kurallarına göre otomatik oluşturulmuş bir konsept plandır. Nihai çizimler, yerel imar yönetmeliğine göre lisanslı bir mühendis tarafından onaylanmalıdır.',
  home: 'Ana sayfa',
};
