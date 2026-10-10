// Copy for the public gallery, embeds, publish/embed buttons, the designer directory and the Pro waitlist.
import type { Lang } from './content';

export type GrowthText = {
  gallery: { nav: string; title: string; meta: string; kicker: string; h1: string; lead: string; remix: string; empty: string; loading: string; share: string; cta: string };
  embed: { open: string; madeWith: string; notFound: string };
  publish: { on: string; off: string; live: string; embed: string; copied: string; hint: string };
  designers: { nav: string; title: string; meta: string; kicker: string; h1: string; lead: string; reviews: string; isNew: string; join: string; joinLead: string; empty: string; hire: string; countries: string };
  pro: { label: string; title: string; lead: string; features: string[]; soon: string; email: string; role: string; roles: string[]; join: string; joined: string; bad: string };
};

const en: GrowthText = {
  gallery: {
    nav: 'Gallery', title: 'Floor Plan Gallery: Plans Made by Our Users | Oxira Design', meta: 'Browse floor plans that Oxira Design users published. Open any plan, remix it into your own copy and edit it for your plot, free.',
    kicker: 'Community gallery', h1: 'Plans made with Oxira Design', lead: 'Floor plans our users chose to share. Open any of them and remix it: you get your own editable copy to adapt to your plot and family.',
    remix: 'Remix this plan', empty: 'No plans published yet. Be the first: save a plan to your account and choose “Show in public gallery”.', loading: 'Loading plans…', share: 'Publish your plan', cta: 'Design your own plan',
  },
  embed: { open: 'Open in Oxira Design', madeWith: 'Made with Oxira Design', notFound: 'This plan is no longer shared.' },
  publish: { on: 'Show in public gallery', off: 'Remove from gallery', live: 'In the gallery', embed: 'Copy embed code', copied: 'Embed code copied', hint: 'Paste the code into any website to show this plan.' },
  designers: {
    nav: 'Designers', title: 'Interior Designers & Architects | Oxira Design', meta: 'Meet the vetted designers and architects who deliver Oxira Design orders, with ratings and reviews from real clients.',
    kicker: 'Designer network', h1: 'Designers and architects on Oxira', lead: 'Every team order is delivered by a vetted designer from our network. Ratings and reviews come from clients after delivery.',
    reviews: '{n} reviews', isNew: 'New on Oxira', join: 'Join as a designer', joinLead: 'Designer or architect? Get orders from clients in several countries and get paid for your work.', empty: 'Our first designers are being approved right now.', hire: 'Order a design', countries: 'Works with',
  },
  pro: {
    label: 'For professionals', title: 'Oxira Design Pro', lead: 'For architects, interior designers, developers and contractors who use the platform every week.',
    features: ['Unlimited AI renders and room redesigns', 'IFC and DXF export on every plan, without limits', '3D tours and embeds with your own logo', 'Priority delivery for team orders'],
    soon: 'Opening soon. Join the waitlist for launch pricing.', email: 'Work email', role: 'You are', roles: ['Architect', 'Interior designer', 'Developer', 'Contractor', 'Other'], join: 'Join the waitlist', joined: 'You are on the list. We will email you when Pro opens.', bad: 'Enter a valid email address.',
  },
};

const ar: GrowthText = {
  gallery: {
    nav: 'معرض المخططات', title: 'معرض المخططات: مخططات صممها مستخدمونا | Oxira Design', meta: 'تصفح مخططات نشرها مستخدمو Oxira Design. افتح أي مخطط وخذ نسخة منه وعدّل عليها حسب أرضك، مجاناً.',
    kicker: 'معرض المستخدمين', h1: 'مخططات صُممت على Oxira Design', lead: 'مخططات اختار أصحابها يشاركونها. افتح أي واحد وخذ نسخة منه: تصير عندك نسخة قابلة للتعديل تفصّلها على أرضك وعائلتك.',
    remix: 'خذ نسخة وعدّل عليها', empty: 'ما فيه مخططات منشورة للحين. كن أول واحد: احفظ مخططك في حسابك واختر «اعرضه في المعرض».', loading: 'جاري تحميل المخططات…', share: 'انشر مخططك', cta: 'صمّم مخططك',
  },
  embed: { open: 'افتحه في Oxira Design', madeWith: 'صُمم على Oxira Design', notFound: 'هذا المخطط لم يعد مشاركاً.' },
  publish: { on: 'اعرضه في المعرض', off: 'أزله من المعرض', live: 'معروض في المعرض', embed: 'نسخ كود التضمين', copied: 'تم نسخ كود التضمين', hint: 'الصق الكود في أي موقع ليظهر فيه المخطط.' },
  designers: {
    nav: 'المصممون', title: 'مصممون داخليون ومهندسون معماريون | Oxira Design', meta: 'تعرّف على المصممين والمهندسين المعتمدين الذين ينفذون طلبات Oxira Design، مع تقييمات وآراء عملاء حقيقيين.',
    kicker: 'شبكة المصممين', h1: 'المصممون والمهندسون على أوكسيرا', lead: 'كل طلب للفريق ينفذه مصمم معتمد من شبكتنا. التقييمات والآراء يكتبها العملاء بعد التسليم.',
    reviews: '{n} تقييم', isNew: 'جديد على أوكسيرا', join: 'انضم كمصمم', joinLead: 'مصمم أو مهندس معماري؟ استلم طلبات من عملاء في عدة دول واحصل على مقابل عملك.', empty: 'نعتمد أول المصممين الآن.', hire: 'اطلب تصميم', countries: 'يعمل في',
  },
  pro: {
    label: 'للمحترفين', title: 'Oxira Design Pro', lead: 'للمهندسين ومصممي الديكور والمطورين والمقاولين اللي يستخدمون المنصة كل أسبوع.',
    features: ['رندرات وتصاميم غرف بالذكاء الاصطناعي بلا حدود', 'تصدير IFC وDXF لكل المخططات بلا قيود', 'جولات 3D وتضمين بشعار شركتك', 'أولوية في تسليم طلبات الفريق'],
    soon: 'يفتح قريباً. سجّل في قائمة الانتظار واحصل على سعر الإطلاق.', email: 'إيميل العمل', role: 'أنت', roles: ['مهندس معماري', 'مصمم داخلي', 'مطور عقاري', 'مقاول', 'أخرى'], join: 'سجّلني في قائمة الانتظار', joined: 'تم تسجيلك. نراسلك أول ما يفتح Pro.', bad: 'اكتب إيميل صحيح.',
  },
};

const de: GrowthText = {
  gallery: {
    nav: 'Galerie', title: 'Grundriss-Galerie: Pläne unserer Nutzer | Oxira Design', meta: 'Entdecken Sie Grundrisse, die Nutzer von Oxira Design veröffentlicht haben. Plan öffnen, als Vorlage übernehmen und kostenlos an Ihr Grundstück anpassen.',
    kicker: 'Community-Galerie', h1: 'Mit Oxira Design entworfene Pläne', lead: 'Grundrisse, die unsere Nutzer mit anderen teilen. Öffnen Sie einen davon und übernehmen Sie ihn: Sie erhalten eine eigene Kopie, die Sie an Grundstück und Familie anpassen.',
    remix: 'Als Vorlage nutzen', empty: 'Noch keine Pläne veröffentlicht. Machen Sie den Anfang: Speichern Sie einen Plan in Ihrem Konto und wählen Sie „In öffentlicher Galerie zeigen“.', loading: 'Pläne werden geladen…', share: 'Plan veröffentlichen', cta: 'Eigenen Plan entwerfen',
  },
  embed: { open: 'In Oxira Design öffnen', madeWith: 'Erstellt mit Oxira Design', notFound: 'Dieser Plan wird nicht mehr geteilt.' },
  publish: { on: 'In öffentlicher Galerie zeigen', off: 'Aus Galerie entfernen', live: 'In der Galerie', embed: 'Embed-Code kopieren', copied: 'Embed-Code kopiert', hint: 'Fügen Sie den Code auf einer beliebigen Website ein, um diesen Plan anzuzeigen.' },
  designers: {
    nav: 'Designer', title: 'Innenarchitekten & Architekten | Oxira Design', meta: 'Lernen Sie die geprüften Designer und Architekten kennen, die Aufträge für Oxira Design umsetzen – mit Bewertungen echter Kunden.',
    kicker: 'Designer-Netzwerk', h1: 'Designer und Architekten bei Oxira', lead: 'Jeder Team-Auftrag wird von einem geprüften Designer aus unserem Netzwerk umgesetzt. Bewertungen schreiben Kunden nach der Lieferung.',
    reviews: '{n} Bewertungen', isNew: 'Neu bei Oxira', join: 'Als Designer mitmachen', joinLead: 'Sie sind Designer oder Architekt? Erhalten Sie Aufträge von Kunden aus mehreren Ländern und werden Sie für Ihre Arbeit bezahlt.', empty: 'Unsere ersten Designer werden gerade freigeschaltet.', hire: 'Design beauftragen', countries: 'Tätig in',
  },
  pro: {
    label: 'Für Profis', title: 'Oxira Design Pro', lead: 'Für Architekten, Innenarchitekten, Bauträger und Bauunternehmen, die jede Woche mit der Plattform arbeiten.',
    features: ['Unbegrenzte AI-Renderings und Raum-Redesigns', 'IFC- und DXF-Export für jeden Plan, ohne Limit', '3D-Touren und Embeds mit Ihrem eigenen Logo', 'Bevorzugte Lieferung von Team-Aufträgen'],
    soon: 'Bald verfügbar. Tragen Sie sich in die Warteliste ein und sichern Sie sich den Einführungspreis.', email: 'Geschäftliche E-Mail', role: 'Sie sind', roles: ['Architekt', 'Innenarchitekt', 'Bauträger', 'Bauunternehmen', 'Sonstiges'], join: 'Auf die Warteliste', joined: 'Sie stehen auf der Liste. Wir schreiben Ihnen, sobald Pro startet.', bad: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
  },
};

const fr: GrowthText = {
  gallery: {
    nav: 'Galerie', title: 'Galerie de plans : créés par nos utilisateurs | Oxira Design', meta: 'Parcourez les plans publiés par les utilisateurs d’Oxira Design. Ouvrez un plan, faites-en votre copie et adaptez-la à votre terrain, gratuitement.',
    kicker: 'Galerie de la communauté', h1: 'Des plans créés avec Oxira Design', lead: 'Des plans que nos utilisateurs ont choisi de partager. Ouvrez-en un et reprenez-le : vous obtenez votre propre copie, à adapter à votre terrain et à votre famille.',
    remix: 'Reprendre ce plan', empty: 'Aucun plan publié pour l’instant. Soyez le premier : enregistrez un plan dans votre compte et choisissez « Afficher dans la galerie publique ».', loading: 'Chargement des plans…', share: 'Publier votre plan', cta: 'Créer votre plan',
  },
  embed: { open: 'Ouvrir dans Oxira Design', madeWith: 'Réalisé avec Oxira Design', notFound: 'Ce plan n’est plus partagé.' },
  publish: { on: 'Afficher dans la galerie publique', off: 'Retirer de la galerie', live: 'Dans la galerie', embed: 'Copier le code d’intégration', copied: 'Code d’intégration copié', hint: 'Collez ce code sur n’importe quel site pour y afficher ce plan.' },
  designers: {
    nav: 'Designers', title: 'Architectes d’intérieur et architectes | Oxira Design', meta: 'Découvrez les designers et architectes sélectionnés qui réalisent les commandes Oxira Design, avec les notes et avis de vrais clients.',
    kicker: 'Réseau de designers', h1: 'Designers et architectes sur Oxira', lead: 'Chaque commande d’équipe est réalisée par un designer sélectionné de notre réseau. Les notes et avis sont laissés par les clients après la livraison.',
    reviews: '{n} avis', isNew: 'Nouveau sur Oxira', join: 'Devenir designer partenaire', joinLead: 'Designer ou architecte ? Recevez des commandes de clients dans plusieurs pays et soyez rémunéré pour votre travail.', empty: 'Nos premiers designers sont en cours de validation.', hire: 'Commander un design', countries: 'Intervient en',
  },
  pro: {
    label: 'Pour les professionnels', title: 'Oxira Design Pro', lead: 'Pour les architectes, architectes d’intérieur, promoteurs et entrepreneurs qui utilisent la plateforme chaque semaine.',
    features: ['Rendus AI et réaménagements de pièces illimités', 'Export IFC et DXF sur tous vos plans, sans limite', 'Visites 3D et intégrations à votre logo', 'Livraison prioritaire des commandes d’équipe'],
    soon: 'Ouverture prochaine. Inscrivez-vous sur la liste d’attente pour profiter du tarif de lancement.', email: 'E-mail professionnel', role: 'Vous êtes', roles: ['Architecte', 'Architecte d’intérieur', 'Promoteur', 'Entrepreneur', 'Autre'], join: 'Rejoindre la liste d’attente', joined: 'Vous êtes inscrit. Nous vous écrirons dès l’ouverture de Pro.', bad: 'Saisissez une adresse e-mail valide.',
  },
};

const ru: GrowthText = {
  gallery: {
    nav: 'Галерея', title: 'Галерея планировок от наших пользователей | Oxira Design', meta: 'Смотрите планировки, опубликованные пользователями Oxira Design. Откройте любой план, сделайте свою копию и бесплатно адаптируйте её под свой участок.',
    kicker: 'Галерея сообщества', h1: 'Планировки, созданные в Oxira Design', lead: 'Планировки, которыми поделились наши пользователи. Откройте любую и возьмите за основу: вы получите свою копию, которую можно подогнать под участок и семью.',
    remix: 'Взять за основу', empty: 'Пока нет опубликованных планов. Станьте первым: сохраните план в аккаунте и выберите «Показать в публичной галерее».', loading: 'Загружаем планы…', share: 'Опубликовать план', cta: 'Создать свой план',
  },
  embed: { open: 'Открыть в Oxira Design', madeWith: 'Сделано в Oxira Design', notFound: 'Этот план больше не опубликован.' },
  publish: { on: 'Показать в публичной галерее', off: 'Убрать из галереи', live: 'В галерее', embed: 'Копировать код', copied: 'Код для вставки скопирован', hint: 'Вставьте этот код на любой сайт, чтобы показать на нём план.' },
  designers: {
    nav: 'Дизайнеры', title: 'Дизайнеры интерьера и архитекторы | Oxira Design', meta: 'Познакомьтесь с проверенными дизайнерами и архитекторами, которые выполняют заказы Oxira Design. Рейтинги и отзывы от реальных клиентов.',
    kicker: 'Сеть дизайнеров', h1: 'Дизайнеры и архитекторы Oxira', lead: 'Каждый заказ команде выполняет проверенный дизайнер из нашей сети. Оценки и отзывы клиенты оставляют после сдачи работы.',
    reviews: 'Отзывов: {n}', isNew: 'Новичок на Oxira', join: 'Стать дизайнером Oxira', joinLead: 'Вы дизайнер или архитектор? Получайте заказы от клиентов из разных стран и оплату за свою работу.', empty: 'Прямо сейчас мы утверждаем первых дизайнеров.', hire: 'Заказать дизайн', countries: 'Работает в',
  },
  pro: {
    label: 'Для профессионалов', title: 'Oxira Design Pro', lead: 'Для архитекторов, дизайнеров интерьера, девелоперов и подрядчиков, которые работают на платформе каждую неделю.',
    features: ['Безлимитные AI-рендеры и редизайн комнат', 'Экспорт в IFC и DXF для любого плана без ограничений', '3D-туры и встраивание с вашим логотипом', 'Приоритетное выполнение заказов команде'],
    soon: 'Скоро запуск. Запишитесь в лист ожидания, чтобы получить цену на старте.', email: 'Рабочий e-mail', role: 'Вы', roles: ['Архитектор', 'Дизайнер интерьера', 'Девелопер', 'Подрядчик', 'Другое'], join: 'Записаться', joined: 'Вы в списке. Напишем вам, как только откроется Pro.', bad: 'Введите корректный адрес e-mail.',
  },
};

const es: GrowthText = {
  gallery: {
    nav: 'Galería', title: 'Galería de planos creados por usuarios | Oxira Design', meta: 'Explore los planos que han publicado los usuarios de Oxira Design. Abra cualquiera, haga su propia copia y adáptela a su terreno, gratis.',
    kicker: 'Galería de la comunidad', h1: 'Planos creados con Oxira Design', lead: 'Planos que nuestros usuarios decidieron compartir. Abra cualquiera y úselo de base: obtendrá su propia copia editable para adaptarla a su terreno y su familia.',
    remix: 'Usar como base', empty: 'Aún no hay planos publicados. Sea el primero: guarde un plano en su cuenta y elija «Mostrar en la galería pública».', loading: 'Cargando planos…', share: 'Publicar su plano', cta: 'Diseñe su plano',
  },
  embed: { open: 'Abrir en Oxira Design', madeWith: 'Hecho con Oxira Design', notFound: 'Este plano ya no se comparte.' },
  publish: { on: 'Mostrar en la galería pública', off: 'Quitar de la galería', live: 'En la galería', embed: 'Copiar código', copied: 'Código copiado', hint: 'Pegue el código en cualquier sitio web para mostrar este plano.' },
  designers: {
    nav: 'Diseñadores', title: 'Interioristas y arquitectos | Oxira Design', meta: 'Conozca a los diseñadores y arquitectos verificados que realizan los pedidos de Oxira Design, con valoraciones y reseñas de clientes reales.',
    kicker: 'Red de diseñadores', h1: 'Diseñadores y arquitectos en Oxira', lead: 'Cada pedido al equipo lo realiza un diseñador verificado de nuestra red. Las valoraciones y reseñas las dejan los clientes tras la entrega.',
    reviews: '{n} reseñas', isNew: 'Nuevo en Oxira', join: 'Únase como diseñador', joinLead: '¿Es diseñador o arquitecto? Reciba pedidos de clientes de varios países y cobre por su trabajo.', empty: 'Estamos aprobando ahora mismo a nuestros primeros diseñadores.', hire: 'Encargar un diseño', countries: 'Trabaja en',
  },
  pro: {
    label: 'Para profesionales', title: 'Oxira Design Pro', lead: 'Para arquitectos, interioristas, promotores y contratistas que usan la plataforma cada semana.',
    features: ['Renders con AI y rediseños de estancias ilimitados', 'Exportación IFC y DXF en todos los planos, sin límites', 'Recorridos 3D e inserciones con su propio logo', 'Entrega prioritaria de pedidos al equipo'],
    soon: 'Muy pronto. Únase a la lista de espera y obtenga el precio de lanzamiento.', email: 'Correo de trabajo', role: 'Usted es', roles: ['Arquitecto', 'Interiorista', 'Promotor', 'Contratista', 'Otro'], join: 'Unirme a la lista', joined: 'Ya está en la lista. Le escribiremos cuando abra Pro.', bad: 'Introduzca un correo electrónico válido.',
  },
};

const tr: GrowthText = {
  gallery: {
    nav: 'Galeri', title: 'Kat Planı Galerisi: Kullanıcı Planları | Oxira Design', meta: 'Oxira Design kullanıcılarının yayımladığı kat planlarına göz atın. Bir planı açın, kendi kopyanızı alın ve arsanıza göre ücretsiz düzenleyin.',
    kicker: 'Topluluk galerisi', h1: 'Oxira Design ile çizilen planlar', lead: 'Kullanıcılarımızın paylaşmayı seçtiği kat planları. Herhangi birini açıp temel alın: arsanıza ve ailenize göre uyarlayabileceğiniz size ait bir kopya oluşur.',
    remix: 'Bu planı temel al', empty: 'Henüz yayımlanmış plan yok. İlk siz olun: bir planı hesabınıza kaydedin ve “Herkese açık galeride göster”i seçin.', loading: 'Planlar yükleniyor…', share: 'Planınızı yayımlayın', cta: 'Kendi planınızı çizin',
  },
  embed: { open: 'Oxira Design’da aç', madeWith: 'Oxira Design ile yapıldı', notFound: 'Bu plan artık paylaşılmıyor.' },
  publish: { on: 'Herkese açık galeride göster', off: 'Galeriden kaldır', live: 'Galeride', embed: 'Yerleştirme kodunu kopyala', copied: 'Kod kopyalandı', hint: 'Bu planı göstermek için kodu herhangi bir web sitesine yapıştırın.' },
  designers: {
    nav: 'Tasarımcılar', title: 'İç Mimarlar ve Mimarlar | Oxira Design', meta: 'Oxira Design siparişlerini teslim eden, onaylı tasarımcı ve mimarlarla tanışın. Gerçek müşterilerin puanları ve yorumlarıyla birlikte.',
    kicker: 'Tasarımcı ağı', h1: 'Oxira’daki tasarımcılar ve mimarlar', lead: 'Her ekip siparişini ağımızdaki onaylı bir tasarımcı teslim eder. Puan ve yorumları müşteriler teslimattan sonra verir.',
    reviews: '{n} yorum', isNew: 'Oxira’da yeni', join: 'Tasarımcı olarak katılın', joinLead: 'Tasarımcı ya da mimar mısınız? Farklı ülkelerdeki müşterilerden sipariş alın, emeğinizin karşılığını kazanın.', empty: 'İlk tasarımcılarımızı şu anda onaylıyoruz.', hire: 'Tasarım siparişi ver', countries: 'Çalıştığı yerler',
  },
  pro: {
    label: 'Profesyoneller için', title: 'Oxira Design Pro', lead: 'Platformu her hafta kullanan mimarlar, iç mimarlar, müteahhitler ve geliştiriciler için.',
    features: ['Sınırsız AI render ve oda yeniden tasarımı', 'Her planda sınırsız IFC ve DXF dışa aktarma', 'Kendi logonuzla 3D turlar ve yerleştirmeler', 'Ekip siparişlerinde öncelikli teslimat'],
    soon: 'Çok yakında. Lansman fiyatı için bekleme listesine katılın.', email: 'İş e-postası', role: 'Mesleğiniz', roles: ['Mimar', 'İç mimar', 'Gayrimenkul geliştirici', 'Müteahhit', 'Diğer'], join: 'Bekleme listesine katıl', joined: 'Listedesiniz. Pro açıldığında size e-posta göndereceğiz.', bad: 'Geçerli bir e-posta adresi girin.',
  },
};

const zh: GrowthText = {
  gallery: {
    nav: '户型图库', title: '户型图库：用户分享的户型方案 | Oxira Design', meta: '浏览 Oxira Design 用户公开发布的户型图，涵盖别墅、公寓和自建房等多种类型。打开任意方案，一键复制为您自己的版本，再根据地块尺寸、朝向和家庭成员需求免费修改。从别人的好设计出发，更快完成属于您的户型方案，还能把满意的作品分享到图库。',
    kicker: '社区图库', h1: '用 Oxira Design 设计的户型', lead: '这些户型图由用户自愿分享。打开任意一份即可复制：您会得到一份属于自己的可编辑副本，按您的地块和家庭需求调整。',
    remix: '复制并修改', empty: '暂时还没有公开的户型。来做第一个吧：把户型保存到账户，然后选择“在公开图库展示”。', loading: '正在加载户型…', share: '发布您的户型', cta: '设计我的户型',
  },
  embed: { open: '在 Oxira Design 中打开', madeWith: '由 Oxira Design 设计', notFound: '该户型已不再公开分享。' },
  publish: { on: '在公开图库展示', off: '从图库移除', live: '已在图库展示', embed: '复制嵌入代码', copied: '嵌入代码已复制', hint: '把代码粘贴到任意网站，即可展示此户型。' },
  designers: {
    nav: '设计师', title: '室内设计师与建筑师 | Oxira Design', meta: '认识为 Oxira Design 完成订单的认证设计师和建筑师。每位设计师都经过审核，主页展示真实客户在交付后给出的评分与评价，以及服务的国家和地区。浏览作品与口碑，为您的住宅、公寓、别墅或商业空间项目找到合适的专业人士，放心下单，安心交付。',
    kicker: '设计师网络', h1: 'Oxira 上的设计师与建筑师', lead: '每一笔团队订单都由我们网络中经过审核的设计师完成。评分和评价均由客户在交付后填写。',
    reviews: '{n} 条评价', isNew: 'Oxira 新人', join: '成为合作设计师', joinLead: '您是设计师或建筑师？接收来自多个国家客户的订单，让您的专业获得应有的回报。', empty: '首批设计师正在审核中。', hire: '下单定制设计', countries: '服务地区',
  },
  pro: {
    label: '专业版', title: 'Oxira Design Pro', lead: '专为每周都在使用平台的建筑师、室内设计师、开发商和承包商打造。',
    features: ['不限次数的 AI 渲染与房间改造', '所有户型均可导出 IFC 和 DXF，不设上限', '带有您自己品牌标志的 3D 漫游与嵌入', '团队订单优先交付'],
    soon: '即将推出。加入候补名单，享受首发优惠价。', email: '工作邮箱', role: '您的身份', roles: ['建筑师', '室内设计师', '开发商', '承包商', '其他'], join: '加入候补名单', joined: '您已在名单中。Pro 开放时我们会第一时间邮件通知您。', bad: '请输入有效的邮箱地址。',
  },
};

const hi: GrowthText = {
  gallery: {
    nav: 'गैलरी', title: 'फ़्लोर प्लान गैलरी: यूज़र्स के बनाए नक्शे | Oxira Design', meta: 'Oxira Design यूज़र्स के शेयर किए फ़्लोर प्लान देखें। कोई भी प्लान खोलें, उसकी अपनी कॉपी बनाएं और अपने प्लॉट के हिसाब से मुफ़्त में बदलें।',
    kicker: 'कम्युनिटी गैलरी', h1: 'Oxira Design पर बने प्लान', lead: 'ये वो फ़्लोर प्लान हैं जिन्हें हमारे यूज़र्स ने शेयर किया है। कोई भी खोलें और कॉपी लें: आपको अपनी एक कॉपी मिलेगी जिसे आप अपने प्लॉट और परिवार के हिसाब से बदल सकते हैं।',
    remix: 'कॉपी लेकर बदलें', empty: 'अभी तक कोई प्लान शेयर नहीं हुआ। पहले आप बनिए: अपने अकाउंट में प्लान सेव करें और “गैलरी में दिखाएं” चुनें।', loading: 'प्लान लोड हो रहे हैं…', share: 'अपना प्लान शेयर करें', cta: 'अपना प्लान बनाएं',
  },
  embed: { open: 'Oxira Design में खोलें', madeWith: 'Oxira Design से बना', notFound: 'यह प्लान अब शेयर नहीं किया गया है।' },
  publish: { on: 'गैलरी में दिखाएं', off: 'गैलरी से हटाएं', live: 'गैलरी में है', embed: 'एम्बेड कोड कॉपी करें', copied: 'एम्बेड कोड कॉपी हो गया', hint: 'यह प्लान दिखाने के लिए कोड को किसी भी वेबसाइट में पेस्ट करें।' },
  designers: {
    nav: 'डिज़ाइनर', title: 'इंटीरियर डिज़ाइनर और आर्किटेक्ट | Oxira Design', meta: 'उन भरोसेमंद डिज़ाइनरों और आर्किटेक्ट से मिलें जो Oxira Design के ऑर्डर पूरे करते हैं, असली ग्राहकों की रेटिंग और रिव्यू के साथ।',
    kicker: 'डिज़ाइनर नेटवर्क', h1: 'Oxira के डिज़ाइनर और आर्किटेक्ट', lead: 'हर टीम ऑर्डर हमारे नेटवर्क का एक जांचा-परखा डिज़ाइनर पूरा करता है। रेटिंग और रिव्यू ग्राहक डिलीवरी के बाद देते हैं।',
    reviews: '{n} रिव्यू', isNew: 'Oxira पर नए', join: 'डिज़ाइनर के रूप में जुड़ें', joinLead: 'क्या आप डिज़ाइनर या आर्किटेक्ट हैं? कई देशों के ग्राहकों से ऑर्डर पाएं और अपने काम का पूरा पैसा कमाएं।', empty: 'हमारे पहले डिज़ाइनरों को अभी मंज़ूरी दी जा रही है।', hire: 'डिज़ाइन ऑर्डर करें', countries: 'कहां काम करते हैं',
  },
  pro: {
    label: 'प्रोफ़ेशनल्स के लिए', title: 'Oxira Design Pro', lead: 'उन आर्किटेक्ट, इंटीरियर डिज़ाइनर, डेवलपर और कॉन्ट्रैक्टर के लिए जो हर हफ़्ते प्लेटफ़ॉर्म इस्तेमाल करते हैं।',
    features: ['अनलिमिटेड AI रेंडर और कमरों का नया डिज़ाइन', 'हर प्लान पर IFC और DXF एक्सपोर्ट, बिना किसी लिमिट के', 'आपके अपने लोगो के साथ 3D टूर और एम्बेड', 'टीम ऑर्डर की प्राथमिकता से डिलीवरी'],
    soon: 'जल्द आ रहा है। लॉन्च प्राइस पाने के लिए वेटलिस्ट में नाम लिखवाएं।', email: 'ऑफ़िस ईमेल', role: 'आप हैं', roles: ['आर्किटेक्ट', 'इंटीरियर डिज़ाइनर', 'डेवलपर', 'कॉन्ट्रैक्टर', 'अन्य'], join: 'वेटलिस्ट में जुड़ें', joined: 'आपका नाम लिस्ट में है। Pro शुरू होते ही हम आपको ईमेल करेंगे।', bad: 'सही ईमेल पता डालें।',
  },
};

const ur: GrowthText = {
  gallery: {
    nav: 'گیلری', title: 'فلور پلان گیلری: صارفین کے بنائے نقشے | Oxira Design', meta: 'Oxira Design کے صارفین کے شائع کردہ فلور پلان دیکھیں۔ کوئی بھی پلان کھولیں، اس کی اپنی کاپی بنائیں اور اپنے پلاٹ کے مطابق مفت میں تبدیل کریں۔',
    kicker: 'کمیونٹی گیلری', h1: 'Oxira Design پر بنے پلان', lead: 'یہ وہ فلور پلان ہیں جو ہمارے صارفین نے شیئر کیے ہیں۔ کوئی بھی کھولیں اور کاپی لیں: آپ کو اپنی ایک کاپی ملے گی جسے آپ اپنے پلاٹ اور گھرانے کے مطابق ڈھال سکتے ہیں۔',
    remix: 'کاپی لے کر بدلیں', empty: 'ابھی تک کوئی پلان شائع نہیں ہوا۔ پہل آپ کریں: اپنے اکاؤنٹ میں پلان محفوظ کریں اور «گیلری میں دکھائیں» منتخب کریں۔', loading: 'پلان لوڈ ہو رہے ہیں…', share: 'اپنا پلان شائع کریں', cta: 'اپنا پلان بنائیں',
  },
  embed: { open: 'Oxira Design میں کھولیں', madeWith: 'Oxira Design سے بنا', notFound: 'یہ پلان اب شیئر نہیں کیا جا رہا۔' },
  publish: { on: 'گیلری میں دکھائیں', off: 'گیلری سے ہٹائیں', live: 'گیلری میں موجود', embed: 'ایمبیڈ کوڈ کاپی کریں', copied: 'ایمبیڈ کوڈ کاپی ہو گیا', hint: 'یہ پلان دکھانے کے لیے کوڈ کسی بھی ویب سائٹ میں پیسٹ کریں۔' },
  designers: {
    nav: 'ڈیزائنرز', title: 'انٹیریئر ڈیزائنرز اور آرکیٹیکٹس | Oxira Design', meta: 'ان تصدیق شدہ ڈیزائنرز اور آرکیٹیکٹس سے ملیں جو Oxira Design کے آرڈر مکمل کرتے ہیں، حقیقی گاہکوں کی ریٹنگ اور تبصروں کے ساتھ۔',
    kicker: 'ڈیزائنر نیٹ ورک', h1: 'Oxira کے ڈیزائنرز اور آرکیٹیکٹس', lead: 'ہر ٹیم آرڈر ہمارے نیٹ ورک کا ایک تصدیق شدہ ڈیزائنر مکمل کرتا ہے۔ ریٹنگ اور تبصرے گاہک ڈیلیوری کے بعد دیتے ہیں۔',
    reviews: '{n} تبصرے', isNew: 'Oxira پر نئے', join: 'بطور ڈیزائنر شامل ہوں', joinLead: 'کیا آپ ڈیزائنر یا آرکیٹیکٹ ہیں؟ کئی ممالک کے گاہکوں سے آرڈر حاصل کریں اور اپنے کام کا معاوضہ پائیں۔', empty: 'ہمارے پہلے ڈیزائنرز کی منظوری ابھی جاری ہے۔', hire: 'ڈیزائن آرڈر کریں', countries: 'کام کے ممالک',
  },
  pro: {
    label: 'پیشہ ور افراد کے لیے', title: 'Oxira Design Pro', lead: 'ان آرکیٹیکٹس، انٹیریئر ڈیزائنرز، ڈویلپرز اور ٹھیکیداروں کے لیے جو ہر ہفتے پلیٹ فارم استعمال کرتے ہیں۔',
    features: ['لامحدود AI رینڈرز اور کمروں کی نئی ڈیزائننگ', 'ہر پلان پر IFC اور DXF ایکسپورٹ، بغیر کسی حد کے', 'آپ کے اپنے لوگو کے ساتھ 3D ٹورز اور ایمبیڈز', 'ٹیم آرڈرز کی ترجیحی ڈیلیوری'],
    soon: 'جلد آ رہا ہے۔ لانچ قیمت کے لیے ویٹ لسٹ میں شامل ہوں۔', email: 'دفتری ای میل', role: 'آپ ہیں', roles: ['آرکیٹیکٹ', 'انٹیریئر ڈیزائنر', 'ڈویلپر', 'ٹھیکیدار', 'دیگر'], join: 'ویٹ لسٹ میں شامل ہوں', joined: 'آپ لسٹ میں شامل ہیں۔ Pro شروع ہوتے ہی ہم آپ کو ای میل کریں گے۔', bad: 'درست ای میل ایڈریس درج کریں۔',
  },
};

export const growth: Record<Lang, GrowthText> = { ar, en, de, fr, ru, es, tr, zh, hi, ur };
