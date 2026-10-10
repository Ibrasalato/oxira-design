// Chinese copy for the ready-made plan pages (same shape as `en` in ../plans.ts).
import type { PlansText } from '../plans';

export const text: PlansText = {
  nav: '现成户型图',
  hubTitle: '按地块尺寸查找住宅与别墅平面图 | Oxira Design',
  hubDesc: '适用于各种地块尺寸的免费别墅、平层住宅、双拼住宅和公寓楼平面图：15×25、20×30、25×30 m 等。打开任意户型图，在线编辑并下载 DXF 或 IFC 文件。',
  hubKicker: '现成户型图',
  hubH1: '按地块尺寸查找平面图',
  hubLead: '选择您的地块尺寸和卧室数量，即可查看每一层的完整平面图及各房间面积。您可以在编辑器中打开任意户型图，移动墙体、调整房间，下载 DXF、IFC 或 PDF 文件，也可以请工程师将其深化为施工图。',
  kinds: {
    villa: { name: '别墅', plural: '两层别墅', intro: '带屋顶附属层的两层别墅' },
    house: { name: '平层住宅', plural: '平层住宅', intro: '单层平层住宅' },
    duplex: { name: '双拼住宅', plural: '双拼住宅', intro: '双拼住宅（两户相连）' },
    building: { name: '公寓楼', plural: '公寓楼', intro: '公寓楼' },
  },
  title: '{kind}平面图 {w}×{d} m，{beds}间卧室',
  titleBld: '公寓楼平面图 {w}×{d} m，每户{beds}间卧室',
  h1: '{w}×{d} m 地块{beds}卧室{kind}平面图',
  h1Bld: '{w}×{d} m 地块公寓楼平面图（每户{beds}间卧室）',
  meta: '{w}×{d} m 地块（{area} m²）{kind}平面图：{beds}间卧室，共{floors}，建筑面积{built} m²。免费且可编辑，可下载 DXF 或 IFC 文件。面向沙特及海湾地区的住宅设计方案。',
  metaBld: '{w}×{d} m 地块（{area} m²）公寓楼平面图：{units}套公寓，每套{beds}间卧室，建筑面积{built} m²。免费且可编辑，可下载 DXF 或 IFC 文件。',
  intro: '这是在{w}×{d}米地块（{area} m²）上为{kindIntro}设计的概念方案，地块临一条街道，前退界{front} m，侧退界{side} m。方案共有{beds}间卧室，共{floors}，总建筑面积约{built} m²，首层覆盖率为{cov}%。',
  introBld: '这是在{w}×{d}米地块（{area} m²）上设计的公寓楼概念方案：{units}套公寓，每套{beds}间卧室，围绕中央楼梯和电梯布置。共{floors}，总建筑面积约{built} m²。',
  facts: { plot: '地块', built: '建筑面积', floors: '层数', coverage: '覆盖率', beds: '卧室', units: '公寓', rooms: '房间' },
  floors1: '一层', floors2: '两层', floorsN: '{n}层',
  schedule: '房间面积表', room: '房间', area: '面积',
  open: '打开并编辑此户型图', openSub: '移动墙体、调整房间和尺寸，然后下载 DXF、IFC 或 PDF 文件。免费。', order: '请工程师深化设计', view3d: '查看3D效果',
  sameSize: '同一地块，其他卧室数量', similar: '相似户型图', all: '全部现成户型图', plotSize: '地块尺寸', bedsN: '{n}间卧室',
  note: '本图为根据海湾地区常见建筑规范自动生成的概念方案，用于展示设计思路和面积。最终图纸须由持证工程师按照当地建筑法规审核批准。',
  home: '首页',
};
