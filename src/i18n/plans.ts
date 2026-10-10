// Copy for the ready-made plan pages (/plans/). Placeholders in {braces} are filled per plan.
// Room and floor names come from src/i18n/planner.ts.
import type { Lang } from './content';
import type { PlanKind } from '../lib/plans';
import { extraPlans } from './plans/index';

export type PlansText = {
  nav: string;
  hubTitle: string; hubDesc: string; hubKicker: string; hubH1: string; hubLead: string;
  kinds: Record<PlanKind, { name: string; plural: string; intro: string }>;
  /** <title>, ≤ 60 chars */
  title: string; titleBld: string;
  h1: string; h1Bld: string;
  meta: string; metaBld: string;
  intro: string; introBld: string;
  facts: { plot: string; built: string; floors: string; coverage: string; beds: string; units: string; rooms: string };
  /** "one floor", "two floors", "{n} floors" */
  floors1: string; floors2: string; floorsN: string;
  schedule: string; room: string; area: string;
  open: string; openSub: string; order: string; view3d: string;
  sameSize: string; similar: string; all: string; plotSize: string; bedsN: string;
  note: string;
  home: string;
};

const ar: PlansText = {
  nav: 'مخططات جاهزة',
  hubTitle: 'مخططات فلل وعمائر جاهزة حسب مساحة الأرض | Oxira',
  hubDesc: 'مخططات فلل ودوبلكس وعمائر سكنية جاهزة لكل مقاس أرض: 15×25، 20×30، 25×30 وغيرها. افتح أي مخطط وعدّل عليه مجاناً، ونزّله أوتوكاد أو IFC.',
  hubKicker: 'مخططات جاهزة',
  hubH1: 'مخططات جاهزة حسب مقاس أرضك',
  hubLead: 'اختر مقاس الأرض وعدد الغرف وشوف مخطط كامل لكل دور بمساحات الغرف. كل مخطط تقدر تفتحه في المحرر وتعدّل الجدران والغرف، وتنزّله DXF أو IFC أو PDF، أو تطلب من مهندس يطوّره لمخططات تنفيذية.',
  kinds: {
    villa: { name: 'فيلا', plural: 'فلل دورين', intro: 'فيلا دورين مع ملحق علوي' },
    house: { name: 'بيت دور واحد', plural: 'بيوت دور واحد', intro: 'بيت دور واحد' },
    duplex: { name: 'دوبلكس', plural: 'دوبلكسات', intro: 'دوبلكس (وحدتين متلاصقتين)' },
    building: { name: 'عمارة سكنية', plural: 'عمائر سكنية', intro: 'عمارة سكنية' },
  },
  title: 'مخطط {kind} {w}×{d} م، {beds} غرف نوم',
  titleBld: 'مخطط عمارة سكنية {w}×{d} م، شقق {beds} غرف',
  h1: 'مخطط {kind} على أرض {w}×{d} متر بـ {beds} غرف نوم',
  h1Bld: 'مخطط عمارة سكنية على أرض {w}×{d} متر بشقق {beds} غرف نوم',
  meta: 'مخطط {kind} لأرض {w}×{d} م ({area} م²): {beds} غرف نوم ومسطحات {built} م² على {floors}. مجاني وقابل للتعديل، نزّله أوتوكاد أو IFC.',
  metaBld: 'مخطط عمارة سكنية لأرض {w}×{d} م ({area} م²): {units} شقة بـ {beds} غرف نوم ومسطحات {built} م². مجاني وقابل للتعديل، نزّله أوتوكاد أو IFC.',
  intro: 'هذا مخطط مبدئي لـ{kindIntro} على أرض {w} في {d} متر (مساحتها {area} م²) على شارع واحد، مع ارتداد أمامي {front} م وجانبي {side} م. فيه {beds} غرف نوم ومجموع مسطحات البناء تقريباً {built} م² على {floors}، ونسبة تغطية الدور الأرضي {cov}%.',
  introBld: 'هذا مخطط مبدئي لعمارة سكنية على أرض {w} في {d} متر (مساحتها {area} م²): {units} شقة، كل شقة {beds} غرف نوم، مع درج ومصعد في القلب. مجموع مسطحات البناء تقريباً {built} م² على {floors}.',
  facts: { plot: 'الأرض', built: 'مسطحات البناء', floors: 'الأدوار', coverage: 'نسبة التغطية', beds: 'غرف النوم', units: 'الشقق', rooms: 'الغرف' },
  floors1: 'دور واحد', floors2: 'دورين', floorsN: '{n} أدوار',
  schedule: 'جدول الغرف والمساحات', room: 'الغرفة', area: 'المساحة',
  open: 'افتح المخطط وعدّل عليه', openSub: 'حرّك الجدران وغيّر الغرف والمقاسات، ثم نزّله DXF أو IFC أو PDF. مجاناً.', order: 'اطلب من مهندس يطوّره', view3d: 'شوفه 3D',
  sameSize: 'نفس الأرض بعدد غرف مختلف', similar: 'مخططات قريبة', all: 'كل المخططات الجاهزة', plotSize: 'مقاس الأرض', bedsN: '{n} غرف',
  note: 'المخطط مبدئي تلقائي لتوضيح الفكرة والمساحات حسب اشتراطات شائعة في السعودية والخليج. المخططات النهائية يعتمدها مهندس مرخص حسب اشتراطات البلدية في منطقتك.',
  home: 'الرئيسية',
};

const en: PlansText = {
  nav: 'Ready-made plans',
  hubTitle: 'House & Villa Floor Plans by Plot Size | Oxira Design',
  hubDesc: 'Free villa, house, duplex and apartment building floor plans for every plot size: 15×25, 20×30, 25×30 m and more. Open any plan, edit it and download DXF or IFC.',
  hubKicker: 'Ready-made plans',
  hubH1: 'Floor plans by plot size',
  hubLead: 'Pick your plot size and number of bedrooms and see a full plan for every floor with room areas. Open any plan in the editor to move walls and change rooms, download it as DXF, IFC or PDF, or ask an engineer to develop it into construction drawings.',
  kinds: {
    villa: { name: 'Villa', plural: 'Two-storey villas', intro: 'two-storey villa with a roof annex' },
    house: { name: 'Single-storey house', plural: 'Single-storey houses', intro: 'single-storey house' },
    duplex: { name: 'Duplex', plural: 'Duplexes', intro: 'duplex (two attached homes)' },
    building: { name: 'Apartment building', plural: 'Apartment buildings', intro: 'apartment building' },
  },
  title: '{kind} Plan {w}×{d} m, {beds} Bedrooms',
  titleBld: 'Apartment Building Plan {w}×{d} m, {beds}-Bed Units',
  h1: '{kind} floor plan for a {w}×{d} m plot with {beds} bedrooms',
  h1Bld: 'Apartment building plan for a {w}×{d} m plot with {beds}-bedroom units',
  meta: '{kind} floor plan for a {w}×{d} m plot ({area} m²): {beds} bedrooms, {built} m² built over {floors}. Free and editable; download DXF or IFC.',
  metaBld: 'Apartment building plan for a {w}×{d} m plot ({area} m²): {units} units with {beds} bedrooms, {built} m² built. Free and editable; download DXF or IFC.',
  intro: 'A concept plan for a {kindIntro} on a {w} by {d} metre plot ({area} m²) facing one street, with a {front} m front setback and {side} m side setbacks. It has {beds} bedrooms and about {built} m² of built area over {floors}, with {cov}% ground-floor coverage.',
  introBld: 'A concept plan for an apartment building on a {w} by {d} metre plot ({area} m²): {units} apartments with {beds} bedrooms each, around a central stair and lift. About {built} m² of built area over {floors}.',
  facts: { plot: 'Plot', built: 'Built area', floors: 'Floors', coverage: 'Coverage', beds: 'Bedrooms', units: 'Apartments', rooms: 'Rooms' },
  floors1: 'one floor', floors2: 'two floors', floorsN: '{n} floors',
  schedule: 'Room schedule', room: 'Room', area: 'Area',
  open: 'Open and edit this plan', openSub: 'Move walls, change rooms and sizes, then download DXF, IFC or PDF. Free.', order: 'Ask an engineer to develop it', view3d: 'See it in 3D',
  sameSize: 'Same plot, other bedroom counts', similar: 'Similar plans', all: 'All ready-made plans', plotSize: 'Plot size', bedsN: '{n} bedrooms',
  note: 'This is an automatic concept plan to show the idea and the areas, based on common Gulf building rules. Final drawings must be approved by a licensed engineer under your local building regulations.',
  home: 'Home',
};

export const plans: Record<Lang, PlansText> = { ar, en, ...extraPlans };
export const plansEn = en;

/** Fill {placeholders}. */
export const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => (k in v ? String(v[k]) : `{${k}}`));
