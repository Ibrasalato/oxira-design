// "Our top services" section on the home page (all languages).
import type { Lang } from './content';

type Card = { t: string; d: string; cta: string };
export type ServicesText = {
  label: string; title: string; lead: string;
  isNew: string; free: string; firstFree: string; from: string; perM2: string;
  before: string; after: string; interior: string;
  render: Card; plan: Card; plans: Card; redesign: Card; engineer: Card; interiorDesign: Card; listing: Card; quotes: Card; designers: Card; cost: Card;
};

const ar: ServicesText = {
  label: 'خدماتنا', title: 'أبرز خدماتنا',
  lead: 'من مقاس الأرض لحد صورة واقعية لبيتك: أدوات مجانية تشتغل في متصفحك، وفريق مهندسين يكمّل لما تحتاج دقة التنفيذ.',
  isNew: 'جديد', free: 'مجاني', firstFree: 'أول تصميم مجاني', from: 'من', perM2: 'للمتر',
  before: 'نموذج الاستوديو', after: 'الرندر النهائي', interior: 'لقطة داخلية بنفس الستايل',
  render: { t: 'رندر واقعي لبيتك', d: 'ارفع مخطط DXF، ونحسب الإضاءة والظلال فيزيائياً من الشمس والسماء داخل متصفحك، ثم لمسة نهائية بالذكاء الاصطناعي بنفس الستايل في كل اللقطات، وتنزيل بدقة 4K.', cta: 'جرّب الرندر' },
  plan: { t: 'صمّم مخطط أرضك', d: 'اكتب مقاس الأرض وعدد الغرف، ويطلع لك مخطط قابل للتعديل مع 3D وملفات DXF وIFC.', cta: 'صمّم مخططك' },
  plans: { t: 'مخططات جاهزة', d: 'مخططات فلل وبيوت وعمائر حسب مقاس الأرض، تفتحها وتعدّلها مباشرة.', cta: 'تصفّح المخططات' },
  redesign: { t: 'صمّم غرفتك من صورة', d: 'صوّر أي غرفة بالجوال واختر الستايل، وتشوفها مصممة خلال دقيقة.', cta: 'صمّم غرفتك' },
  engineer: { t: 'رندر مهندس وملف 3ds Max', d: 'مهندس يراجع مخططك ويسلّمك 8 رندرات عالية الدقة وملف 3ds Max خلال 48 ساعة.', cta: 'اطلب الآن' },
  interiorDesign: { t: 'تصميم داخلي كامل', d: 'مصمم يشتغل معك على كل غرفة: الخامات والألوان والإضاءة، مع رندرات V-Ray وجولة 360°.', cta: 'اطلب عرض سعر' },
  listing: { t: 'جولة 3D لإعلانك العقاري', d: 'حوّل المخطط لصفحة جولة ثلاثية الأبعاد مع رمز QR ونص إعلان جاهز بالعربي والإنجليزي.', cta: 'أنشئ جولة' },
  quotes: { t: 'عروض أسعار التشطيب', d: 'نحسب كميات الأرضيات والدهان والسيراميك من مخططك ونرسلها لمقاولين معتمدين.', cta: 'اطلب عروض أسعار' },
  designers: { t: 'مصممون معتمدون', d: 'تصفح مصممين ومهندسين راجعنا أعمالهم، واطلب من تختاره ينفذ مشروعك.', cta: 'تصفّح المصممين' },
  cost: { t: 'كم تكلفة بناء فيلتك؟', d: 'حاسبة مجانية للعظم والتشطيب والأساسات بثلاثة مستويات، بأسعار هذا العام في السعودية ومصر.', cta: 'احسب التكلفة' },
};

const en: ServicesText = {
  label: 'Services', title: 'Our top services',
  lead: 'From a plot size to a photoreal image of your home: free tools that run in your browser, and a team of engineers when you need build-ready precision.',
  isNew: 'New', free: 'Free', firstFree: 'First design free', from: 'From', perM2: 'per m²',
  before: 'Studio model', after: 'Final render', interior: 'Interior shot, same style',
  render: { t: 'Photoreal render of your home', d: 'Upload a DXF plan. Light and shadows are computed physically from sun and sky in your browser, then an AI finishing touch keeps one style across every shot, with 4K download.', cta: 'Try the render' },
  plan: { t: 'Design a plan for your plot', d: 'Enter the plot size and rooms and get an editable floor plan with 3D, DXF and IFC files.', cta: 'Design your plan' },
  plans: { t: 'Ready-made plans', d: 'Villa, house and apartment-building plans by plot size, ready to open and edit.', cta: 'Browse plans' },
  redesign: { t: 'Redesign a room from a photo', d: 'Snap any room with your phone, pick a style and see it designed in under a minute.', cta: 'Redesign a room' },
  engineer: { t: 'Engineer render and 3ds Max file', d: 'An engineer checks your plan and delivers 8 high-resolution renders and a 3ds Max file within 48 hours.', cta: 'Order now' },
  interiorDesign: { t: 'Full interior design', d: 'A designer works with you on every room: materials, colours and lighting, with V-Ray renders and a 360° tour.', cta: 'Get a quote' },
  listing: { t: '3D tour for your property listing', d: 'Turn the plan into a shareable 3D tour page with a QR code and ready ad copy in Arabic and English.', cta: 'Create a tour' },
  quotes: { t: 'Finishing quotes', d: 'We calculate flooring, paint and tile quantities from your plan and send them to vetted contractors.', cta: 'Get quotes' },
  designers: { t: 'Vetted designers', d: 'Browse designers and engineers whose work we reviewed, and hire the one you like for your project.', cta: 'Browse designers' },
  cost: { t: 'What will your villa cost to build?', d: 'A free calculator for shell, finishing and foundations at three levels, with this year’s prices for Saudi Arabia and Egypt.', cta: 'Estimate the cost' },
};

const de: ServicesText = {
  label: 'Leistungen', title: 'Unsere wichtigsten Leistungen',
  lead: 'Vom Grundstücksmaß bis zum fotorealistischen Bild Ihres Hauses: kostenlose Werkzeuge im Browser und ein Ingenieurteam, wenn es auf Präzision ankommt.',
  isNew: 'Neu', free: 'Kostenlos', firstFree: 'Erstes Design gratis', from: 'Ab', perM2: 'pro m²',
  before: 'Studio-Modell', after: 'Fertiges Rendering', interior: 'Innenansicht, gleicher Stil',
  render: { t: 'Fotorealistisches Rendering Ihres Hauses', d: 'DXF-Plan hochladen. Licht und Schatten werden im Browser physikalisch aus Sonne und Himmel berechnet, danach ein KI-Feinschliff mit einheitlichem Stil in allen Ansichten und 4K-Download.', cta: 'Rendering testen' },
  plan: { t: 'Grundriss für Ihr Grundstück', d: 'Grundstücksmaß und Räume eingeben und einen bearbeitbaren Grundriss mit 3D-, DXF- und IFC-Dateien erhalten.', cta: 'Grundriss planen' },
  plans: { t: 'Fertige Grundrisse', d: 'Villen, Häuser und Mehrfamilienhäuser nach Grundstücksgröße, direkt zum Öffnen und Bearbeiten.', cta: 'Grundrisse ansehen' },
  redesign: { t: 'Raum per Foto neu gestalten', d: 'Raum mit dem Handy fotografieren, Stil wählen und in unter einer Minute gestaltet sehen.', cta: 'Raum gestalten' },
  engineer: { t: 'Ingenieur-Rendering und 3ds-Max-Datei', d: 'Ein Ingenieur prüft Ihren Plan und liefert 8 hochauflösende Renderings und eine 3ds-Max-Datei in 48 Stunden.', cta: 'Jetzt bestellen' },
  interiorDesign: { t: 'Komplettes Innendesign', d: 'Ein Designer plant jeden Raum mit Ihnen: Materialien, Farben und Licht, mit V-Ray-Renderings und 360°-Tour.', cta: 'Angebot anfordern' },
  listing: { t: '3D-Tour für Ihr Immobilieninserat', d: 'Aus dem Plan wird eine teilbare 3D-Tour mit QR-Code und fertigem Anzeigentext auf Arabisch und Englisch.', cta: 'Tour erstellen' },
  quotes: { t: 'Angebote für den Ausbau', d: 'Wir berechnen Mengen für Böden, Farbe und Fliesen aus Ihrem Plan und senden sie an geprüfte Handwerker.', cta: 'Angebote anfordern' },
  designers: { t: 'Geprüfte Designer', d: 'Designer und Ingenieure mit geprüften Arbeiten ansehen und den passenden für Ihr Projekt beauftragen.', cta: 'Designer ansehen' },
  cost: { t: 'Was kostet der Bau Ihrer Villa?', d: 'Kostenloser Rechner für Rohbau, Ausbau und Fundamente in drei Stufen mit aktuellen Preisen für Saudi-Arabien und Ägypten.', cta: 'Kosten schätzen' },
};

const fr: ServicesText = {
  label: 'Services', title: 'Nos principaux services',
  lead: 'De la taille du terrain à une image photoréaliste de votre maison : des outils gratuits dans votre navigateur, et une équipe d’ingénieurs quand la précision compte.',
  isNew: 'Nouveau', free: 'Gratuit', firstFree: 'Premier design offert', from: 'Dès', perM2: 'le m²',
  before: 'Modèle du studio', after: 'Rendu final', interior: 'Vue intérieure, même style',
  render: { t: 'Rendu photoréaliste de votre maison', d: 'Importez un plan DXF. La lumière et les ombres sont calculées physiquement depuis le soleil et le ciel dans votre navigateur, puis une finition IA garde le même style sur chaque vue, avec export 4K.', cta: 'Essayer le rendu' },
  plan: { t: 'Concevez le plan de votre terrain', d: 'Indiquez la taille du terrain et les pièces et obtenez un plan modifiable avec fichiers 3D, DXF et IFC.', cta: 'Concevoir mon plan' },
  plans: { t: 'Plans prêts à l’emploi', d: 'Plans de villas, maisons et immeubles selon la taille du terrain, à ouvrir et modifier directement.', cta: 'Voir les plans' },
  redesign: { t: 'Relookez une pièce à partir d’une photo', d: 'Photographiez une pièce, choisissez un style et voyez-la aménagée en moins d’une minute.', cta: 'Relooker une pièce' },
  engineer: { t: 'Rendu d’ingénieur et fichier 3ds Max', d: 'Un ingénieur vérifie votre plan et livre 8 rendus haute résolution et un fichier 3ds Max en 48 heures.', cta: 'Commander' },
  interiorDesign: { t: 'Design intérieur complet', d: 'Un designer travaille chaque pièce avec vous : matériaux, couleurs et lumière, avec rendus V-Ray et visite 360°.', cta: 'Demander un devis' },
  listing: { t: 'Visite 3D pour votre annonce', d: 'Transformez le plan en page de visite 3D partageable avec QR code et texte d’annonce prêt en arabe et en anglais.', cta: 'Créer une visite' },
  quotes: { t: 'Devis de finition', d: 'Nous calculons sols, peinture et carrelage depuis votre plan et les envoyons à des artisans vérifiés.', cta: 'Obtenir des devis' },
  designers: { t: 'Designers vérifiés', d: 'Parcourez des designers et ingénieurs dont nous avons vérifié les travaux et confiez-leur votre projet.', cta: 'Voir les designers' },
  cost: { t: 'Combien coûtera votre villa ?', d: 'Calculateur gratuit du gros œuvre, des finitions et des fondations sur trois niveaux, aux prix de cette année en Arabie saoudite et en Égypte.', cta: 'Estimer le coût' },
};

const ru: ServicesText = {
  label: 'Услуги', title: 'Наши главные услуги',
  lead: 'От размеров участка до фотореалистичного изображения дома: бесплатные инструменты в браузере и команда инженеров, когда нужна точность.',
  isNew: 'Новое', free: 'Бесплатно', firstFree: 'Первый дизайн бесплатно', from: 'От', perM2: 'за м²',
  before: 'Модель в студии', after: 'Финальный рендер', interior: 'Интерьер в том же стиле',
  render: { t: 'Фотореалистичный рендер дома', d: 'Загрузите план DXF. Свет и тени рассчитываются физически от солнца и неба прямо в браузере, затем доводка ИИ в едином стиле для всех ракурсов и скачивание в 4K.', cta: 'Попробовать рендер' },
  plan: { t: 'План для вашего участка', d: 'Введите размеры участка и комнаты и получите редактируемый план с 3D, DXF и IFC.', cta: 'Создать план' },
  plans: { t: 'Готовые планы', d: 'Планы вилл, домов и жилых зданий по размеру участка — открывайте и редактируйте сразу.', cta: 'Смотреть планы' },
  redesign: { t: 'Дизайн комнаты по фото', d: 'Сфотографируйте комнату, выберите стиль и увидьте результат меньше чем за минуту.', cta: 'Дизайн комнаты' },
  engineer: { t: 'Рендер инженера и файл 3ds Max', d: 'Инженер проверит план и передаст 8 рендеров высокого разрешения и файл 3ds Max за 48 часов.', cta: 'Заказать' },
  interiorDesign: { t: 'Полный дизайн интерьера', d: 'Дизайнер прорабатывает с вами каждую комнату: материалы, цвета и свет, рендеры V-Ray и тур 360°.', cta: 'Запросить цену' },
  listing: { t: '3D-тур для объявления', d: 'Превратите план в страницу 3D-тура с QR-кодом и готовым текстом объявления на арабском и английском.', cta: 'Создать тур' },
  quotes: { t: 'Сметы на отделку', d: 'Считаем объёмы полов, покраски и плитки по вашему плану и отправляем проверенным подрядчикам.', cta: 'Получить сметы' },
  designers: { t: 'Проверенные дизайнеры', d: 'Смотрите дизайнеров и инженеров с проверенными работами и выбирайте исполнителя для проекта.', cta: 'Смотреть дизайнеров' },
  cost: { t: 'Сколько стоит построить виллу?', d: 'Бесплатный расчёт каркаса, отделки и фундамента в трёх уровнях по ценам этого года для Саудовской Аравии и Египта.', cta: 'Рассчитать' },
};

const es: ServicesText = {
  label: 'Servicios', title: 'Nuestros servicios principales',
  lead: 'Del tamaño del terreno a una imagen fotorrealista de tu casa: herramientas gratis en tu navegador y un equipo de ingenieros cuando necesitas precisión.',
  isNew: 'Nuevo', free: 'Gratis', firstFree: 'Primer diseño gratis', from: 'Desde', perM2: 'por m²',
  before: 'Modelo del estudio', after: 'Render final', interior: 'Interior, mismo estilo',
  render: { t: 'Render fotorrealista de tu casa', d: 'Sube un plano DXF. La luz y las sombras se calculan físicamente desde el sol y el cielo en tu navegador, y luego un acabado con IA mantiene el mismo estilo en cada vista, con descarga en 4K.', cta: 'Probar el render' },
  plan: { t: 'Diseña el plano de tu terreno', d: 'Indica el tamaño del terreno y las habitaciones y obtén un plano editable con archivos 3D, DXF e IFC.', cta: 'Diseñar mi plano' },
  plans: { t: 'Planos listos', d: 'Planos de villas, casas y edificios según el tamaño del terreno, listos para abrir y editar.', cta: 'Ver planos' },
  redesign: { t: 'Rediseña una habitación desde una foto', d: 'Fotografía cualquier habitación, elige un estilo y mírala diseñada en menos de un minuto.', cta: 'Rediseñar' },
  engineer: { t: 'Render de ingeniero y archivo 3ds Max', d: 'Un ingeniero revisa tu plano y entrega 8 renders de alta resolución y un archivo 3ds Max en 48 horas.', cta: 'Pedir ahora' },
  interiorDesign: { t: 'Diseño interior completo', d: 'Un diseñador trabaja contigo cada estancia: materiales, colores e iluminación, con renders V-Ray y recorrido 360°.', cta: 'Pedir presupuesto' },
  listing: { t: 'Recorrido 3D para tu anuncio', d: 'Convierte el plano en una página de recorrido 3D con código QR y texto de anuncio listo en árabe e inglés.', cta: 'Crear recorrido' },
  quotes: { t: 'Presupuestos de acabados', d: 'Calculamos suelos, pintura y azulejos desde tu plano y los enviamos a contratistas verificados.', cta: 'Pedir presupuestos' },
  designers: { t: 'Diseñadores verificados', d: 'Explora diseñadores e ingenieros con trabajos revisados y contrata al que prefieras para tu proyecto.', cta: 'Ver diseñadores' },
  cost: { t: '¿Cuánto costará construir tu villa?', d: 'Calculadora gratuita de estructura, acabados y cimentación en tres niveles, con precios de este año en Arabia Saudí y Egipto.', cta: 'Calcular el coste' },
};

const tr: ServicesText = {
  label: 'Hizmetler', title: 'Öne çıkan hizmetlerimiz',
  lead: 'Arsa ölçüsünden evinizin fotogerçekçi görüntüsüne: tarayıcıda çalışan ücretsiz araçlar ve hassasiyet gerektiğinde mühendis ekibimiz.',
  isNew: 'Yeni', free: 'Ücretsiz', firstFree: 'İlk tasarım ücretsiz', from: 'Başlangıç', perM2: 'm² başına',
  before: 'Stüdyo modeli', after: 'Son render', interior: 'İç mekân, aynı stil',
  render: { t: 'Eviniz için fotogerçekçi render', d: 'DXF plan yükleyin. Işık ve gölgeler tarayıcınızda güneş ve gökyüzünden fiziksel olarak hesaplanır, ardından yapay zekâ son dokunuşu tüm açılarda aynı stili korur; 4K indirme dahil.', cta: 'Render’ı dene' },
  plan: { t: 'Arsanız için plan tasarlayın', d: 'Arsa ölçüsünü ve odaları girin, 3D, DXF ve IFC dosyalarıyla düzenlenebilir plan alın.', cta: 'Planımı tasarla' },
  plans: { t: 'Hazır planlar', d: 'Arsa ölçüsüne göre villa, ev ve apartman planları; hemen açıp düzenleyin.', cta: 'Planlara göz at' },
  redesign: { t: 'Fotoğraftan oda tasarımı', d: 'Herhangi bir odanın fotoğrafını çekin, stil seçin ve bir dakikadan kısa sürede tasarlanmış halini görün.', cta: 'Odayı tasarla' },
  engineer: { t: 'Mühendis render’ı ve 3ds Max dosyası', d: 'Bir mühendis planınızı inceler; 48 saatte 8 yüksek çözünürlüklü render ve 3ds Max dosyası teslim eder.', cta: 'Sipariş ver' },
  interiorDesign: { t: 'Komple iç mimari', d: 'Tasarımcı her odada sizinle çalışır: malzeme, renk ve aydınlatma; V-Ray render’lar ve 360° tur.', cta: 'Teklif al' },
  listing: { t: 'İlanınız için 3D tur', d: 'Planı QR kodlu, Arapça ve İngilizce hazır ilan metinli paylaşılabilir bir 3D tur sayfasına dönüştürün.', cta: 'Tur oluştur' },
  quotes: { t: 'İnce işçilik teklifleri', d: 'Planınızdan zemin, boya ve seramik miktarlarını hesaplayıp onaylı ustalara göndeririz.', cta: 'Teklif iste' },
  designers: { t: 'Onaylı tasarımcılar', d: 'İşlerini incelediğimiz tasarımcı ve mühendislere göz atın, projeniz için dilediğinizle çalışın.', cta: 'Tasarımcılara göz at' },
  cost: { t: 'Villanızın inşaatı ne kadar tutar?', d: 'Suudi Arabistan ve Mısır için bu yılın fiyatlarıyla kaba inşaat, ince işçilik ve temelde üç seviyeli ücretsiz hesaplayıcı.', cta: 'Maliyeti hesapla' },
};

const zh: ServicesText = {
  label: '服务', title: '我们的主要服务',
  lead: '从地块尺寸到住宅的真实感效果图：在浏览器中运行的免费工具，以及在需要施工精度时为您服务的工程师团队。',
  isNew: '新', free: '免费', firstFree: '首次设计免费', from: '起', perM2: '每平方米',
  before: '工作室模型', after: '最终渲染', interior: '室内视角，同一风格',
  render: { t: '住宅真实感渲染', d: '上传 DXF 平面图，浏览器根据太阳和天空物理计算光影，再由 AI 精修，在所有视角保持同一风格，并可下载 4K。', cta: '试试渲染' },
  plan: { t: '为您的地块设计平面图', d: '输入地块尺寸和房间数量，获得可编辑的平面图以及 3D、DXF 和 IFC 文件。', cta: '设计平面图' },
  plans: { t: '现成平面图', d: '按地块尺寸分类的别墅、住宅和公寓楼平面图，可直接打开编辑。', cta: '浏览平面图' },
  redesign: { t: '用照片重新设计房间', d: '用手机拍下任意房间，选择风格，一分钟内看到设计效果。', cta: '设计房间' },
  engineer: { t: '工程师渲染与 3ds Max 文件', d: '工程师审核您的平面图，48 小时内交付 8 张高清渲染图和 3ds Max 文件。', cta: '立即下单' },
  interiorDesign: { t: '全套室内设计', d: '设计师与您逐个房间确定材料、色彩和灯光，提供 V-Ray 渲染和 360° 全景。', cta: '获取报价' },
  listing: { t: '房产广告 3D 看房', d: '将平面图变成可分享的 3D 看房页面，附二维码及阿拉伯语和英语广告文案。', cta: '创建看房' },
  quotes: { t: '装修报价', d: '根据平面图计算地板、涂料和瓷砖用量，并发送给认证承包商。', cta: '获取报价' },
  designers: { t: '认证设计师', d: '浏览我们审核过作品的设计师和工程师，选择您喜欢的人来完成项目。', cta: '浏览设计师' },
  cost: { t: '建造别墅要花多少钱？', d: '免费计算主体、装修和地基三个档次的成本，采用沙特和埃及今年的价格。', cta: '估算成本' },
};

const hi: ServicesText = {
  label: 'सेवाएँ', title: 'हमारी प्रमुख सेवाएँ',
  lead: 'प्लॉट के माप से आपके घर की फ़ोटोरियल इमेज तक: ब्राउज़र में चलने वाले मुफ़्त टूल, और सटीकता चाहिए तो इंजीनियरों की टीम।',
  isNew: 'नया', free: 'मुफ़्त', firstFree: 'पहला डिज़ाइन मुफ़्त', from: 'से शुरू', perM2: 'प्रति m²',
  before: 'स्टूडियो मॉडल', after: 'अंतिम रेंडर', interior: 'अंदर का दृश्य, वही स्टाइल',
  render: { t: 'आपके घर का फ़ोटोरियल रेंडर', d: 'DXF प्लान अपलोड करें। ब्राउज़र में सूरज और आसमान से रोशनी और छाया भौतिक रूप से गणना होती है, फिर AI फ़िनिशिंग हर व्यू में एक ही स्टाइल रखती है, और 4K डाउनलोड।', cta: 'रेंडर आज़माएँ' },
  plan: { t: 'अपने प्लॉट का प्लान बनाएँ', d: 'प्लॉट का माप और कमरे लिखें और 3D, DXF व IFC फ़ाइलों के साथ एडिट होने वाला प्लान पाएँ।', cta: 'प्लान बनाएँ' },
  plans: { t: 'तैयार प्लान', d: 'प्लॉट के माप के हिसाब से विला, घर और अपार्टमेंट बिल्डिंग के प्लान, सीधे खोलें और बदलें।', cta: 'प्लान देखें' },
  redesign: { t: 'फ़ोटो से कमरा रीडिज़ाइन', d: 'किसी भी कमरे की फ़ोटो लें, स्टाइल चुनें और एक मिनट से कम में डिज़ाइन देखें।', cta: 'कमरा डिज़ाइन करें' },
  engineer: { t: 'इंजीनियर रेंडर और 3ds Max फ़ाइल', d: 'इंजीनियर आपका प्लान जाँचकर 48 घंटे में 8 हाई-रेज़ोल्यूशन रेंडर और 3ds Max फ़ाइल देता है।', cta: 'अभी ऑर्डर करें' },
  interiorDesign: { t: 'पूरा इंटीरियर डिज़ाइन', d: 'डिज़ाइनर हर कमरे पर आपके साथ काम करता है: मटीरियल, रंग और लाइटिंग, V-Ray रेंडर और 360° टूर के साथ।', cta: 'कोटेशन लें' },
  listing: { t: 'प्रॉपर्टी विज्ञापन के लिए 3D टूर', d: 'प्लान को QR कोड और अरबी-अंग्रेज़ी में तैयार विज्ञापन टेक्स्ट वाले शेयर करने योग्य 3D टूर पेज में बदलें।', cta: 'टूर बनाएँ' },
  quotes: { t: 'फ़िनिशिंग कोटेशन', d: 'आपके प्लान से फ़्लोरिंग, पेंट और टाइल की मात्रा निकालकर भरोसेमंद ठेकेदारों को भेजते हैं।', cta: 'कोटेशन लें' },
  designers: { t: 'जाँचे-परखे डिज़ाइनर', d: 'ऐसे डिज़ाइनर और इंजीनियर देखें जिनका काम हमने जाँचा है, और अपने प्रोजेक्ट के लिए चुनें।', cta: 'डिज़ाइनर देखें' },
  cost: { t: 'आपका विला बनाने में कितना लगेगा?', d: 'सऊदी अरब और मिस्र की इस साल की कीमतों के साथ ढाँचा, फ़िनिशिंग और नींव का तीन स्तरों में मुफ़्त कैलकुलेटर।', cta: 'लागत निकालें' },
};

const ur: ServicesText = {
  label: 'خدمات', title: 'ہماری نمایاں خدمات',
  lead: 'پلاٹ کی پیمائش سے آپ کے گھر کی حقیقت نما تصویر تک: براؤزر میں چلنے والے مفت ٹولز، اور جب درستگی چاہیے تو انجینئروں کی ٹیم۔',
  isNew: 'نیا', free: 'مفت', firstFree: 'پہلا ڈیزائن مفت', from: 'سے شروع', perM2: 'فی m²',
  before: 'اسٹوڈیو ماڈل', after: 'حتمی رینڈر', interior: 'اندرونی منظر، وہی اسٹائل',
  render: { t: 'آپ کے گھر کا حقیقت نما رینڈر', d: 'DXF نقشہ اپ لوڈ کریں۔ براؤزر میں سورج اور آسمان سے روشنی اور سائے طبیعیاتی طور پر حساب ہوتے ہیں، پھر AI فنشنگ ہر منظر میں ایک ہی اسٹائل رکھتی ہے، اور 4K ڈاؤن لوڈ۔', cta: 'رینڈر آزمائیں' },
  plan: { t: 'اپنے پلاٹ کا نقشہ بنائیں', d: 'پلاٹ کی پیمائش اور کمرے لکھیں اور 3D، DXF اور IFC فائلوں کے ساتھ قابلِ ترمیم نقشہ حاصل کریں۔', cta: 'نقشہ بنائیں' },
  plans: { t: 'تیار نقشے', d: 'پلاٹ کی پیمائش کے مطابق ولا، گھر اور اپارٹمنٹ عمارتوں کے نقشے، فوراً کھولیں اور بدلیں۔', cta: 'نقشے دیکھیں' },
  redesign: { t: 'تصویر سے کمرہ دوبارہ ڈیزائن کریں', d: 'کسی بھی کمرے کی تصویر لیں، اسٹائل چنیں اور ایک منٹ سے کم میں ڈیزائن دیکھیں۔', cta: 'کمرہ ڈیزائن کریں' },
  engineer: { t: 'انجینئر رینڈر اور 3ds Max فائل', d: 'انجینئر آپ کا نقشہ جانچ کر 48 گھنٹوں میں 8 ہائی ریزولوشن رینڈر اور 3ds Max فائل دیتا ہے۔', cta: 'ابھی آرڈر کریں' },
  interiorDesign: { t: 'مکمل انٹیریئر ڈیزائن', d: 'ڈیزائنر ہر کمرے پر آپ کے ساتھ کام کرتا ہے: میٹیریل، رنگ اور روشنی، V-Ray رینڈر اور 360° ٹور کے ساتھ۔', cta: 'قیمت معلوم کریں' },
  listing: { t: 'پراپرٹی اشتہار کے لیے 3D ٹور', d: 'نقشے کو QR کوڈ اور عربی و انگریزی میں تیار اشتہاری متن والے قابلِ اشتراک 3D ٹور صفحے میں بدلیں۔', cta: 'ٹور بنائیں' },
  quotes: { t: 'فنشنگ کی قیمتیں', d: 'آپ کے نقشے سے فرش، پینٹ اور ٹائل کی مقدار نکال کر معتبر ٹھیکیداروں کو بھیجتے ہیں۔', cta: 'قیمتیں منگوائیں' },
  designers: { t: 'تصدیق شدہ ڈیزائنرز', d: 'ایسے ڈیزائنرز اور انجینئرز دیکھیں جن کا کام ہم نے جانچا ہے، اور اپنے منصوبے کے لیے منتخب کریں۔', cta: 'ڈیزائنرز دیکھیں' },
  cost: { t: 'آپ کا ولا بنانے میں کتنا لگے گا؟', d: 'سعودی عرب اور مصر کی اس سال کی قیمتوں کے ساتھ ڈھانچہ، فنشنگ اور بنیاد کا تین درجوں میں مفت کیلکولیٹر۔', cta: 'لاگت معلوم کریں' },
};

export const servicesText: Record<Lang, ServicesText> = { ar, en, de, fr, ru, es, tr, zh, hi, ur };
