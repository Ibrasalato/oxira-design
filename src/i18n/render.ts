// Texts for the path-traced render in the studio (all site languages).
import type { Lang } from './content';

export type RenderText = {
  btn: string; title: string; prep: string; tracing: (n: number, t: number) => string; stop: string;
  quality: string; fast: string; high: string; ultra: string;
  done: string; ai: string; aiNote: string; again: string; traced: string; aiTab: string; unsupported: string;
  up4k: string; upscaling: (pct: number) => string; up4kDone: string; up4kFail: string;
  credits: (n: number) => string; needCredits: string; buyTitle: string; buyNote: string; payTab: string; bought: string;
  upsellT: string; upsellBtn: string;
};

const ar: RenderText = {
  btn: 'رندر واقعي (تتبّع إضاءة)', title: 'رندر واقعي',
  prep: 'نجهّز المشهد والإضاءة…', tracing: (n, t) => `يتحسّن الرندر… ${n} من ${t} عيّنة`, stop: 'إيقاف وحفظ',
  quality: 'الجودة', fast: 'سريع', high: 'عالي', ultra: 'فائق',
  done: 'الرندر جاهز. الإضاءة والظلال محسوبة فيزيائياً من الشمس والسماء.',
  ai: 'لمسة نهائية بالذكاء الاصطناعي', aiNote: 'يضيف خامات وإكسسوارات واقعية على نفس الإضاءة والزاوية، ويُحسب من رصيدك اليومي.',
  again: 'رندر جديد', traced: 'الرندر', aiTab: 'اللمسة النهائية',
  unsupported: 'متصفحك لا يدعم تتبّع الإضاءة، فسنستخدم الذكاء الاصطناعي مباشرة.',
  up4k: 'تنزيل 4K', upscaling: (p) => `نكبّر الصورة لدقة 4K داخل متصفحك… ${p}٪`, up4kDone: 'صورة 4K جاهزة للتنزيل.', up4kFail: 'تعذّر التكبير على هذا الجهاز. نزّل الصورة العادية أو جرّب من كمبيوتر.',
  credits: (n) => `رصيدك: ${n} صورة`, needCredits: 'خلصت الصور المجانية لليوم. اشترِ باقة وكمّل بنفس الجودة.', buyTitle: 'باقات صور الذكاء الاصطناعي', buyNote: 'الرصيد مشترك مع صفحة «صمّم غرفتك» ويُخصم صورة واحدة لكل لمسة نهائية. لو فشلت الصورة يرجع رصيدها تلقائياً.', payTab: 'فتحنا الدفع في تبويب جديد. بعد الدفع ارجع هنا، ورصيدك يتحدث تلقائياً.', bought: 'وصل رصيدك. كمّل الرندر.',
  upsellT: 'عايزها بالمقاسات الدقيقة والمنتجات الحقيقية؟', upsellBtn: 'اطلب رندر مهندس خلال 48 ساعة',
};

const en: RenderText = {
  btn: 'Photoreal render (path traced)', title: 'Photoreal render',
  prep: 'Preparing the scene and lighting…', tracing: (n, t) => `Refining… ${n} of ${t} samples`, stop: 'Stop and keep',
  quality: 'Quality', fast: 'Fast', high: 'High', ultra: 'Ultra',
  done: 'Render ready. Light and shadows are computed physically from the sun and sky.',
  ai: 'AI finishing touch', aiNote: 'Adds realistic materials and decor on the same light and camera. Uses one of today’s renders.',
  again: 'New render', traced: 'Render', aiTab: 'Finishing touch',
  unsupported: 'Your browser cannot path trace, so we will use the AI render directly.',
  up4k: 'Download 4K', upscaling: (p) => `Upscaling to 4K in your browser… ${p}%`, up4kDone: 'Your 4K image is ready.', up4kFail: 'Upscaling did not work on this device. Download the normal image or try on a computer.',
  credits: (n) => `Balance: ${n} images`, needCredits: 'You used today’s free images. Buy a pack to keep going at the same quality.', buyTitle: 'AI image packs', buyNote: 'Shared with Redesign a room. Each finishing touch uses one image, and a failed image is refunded automatically.', payTab: 'Payment opened in a new tab. Come back here afterwards and your balance updates by itself.', bought: 'Your credits arrived. Carry on rendering.',
  upsellT: 'Want it with exact dimensions and real products?', upsellBtn: 'Order an engineer’s render in 48 hours',
};

const de: RenderText = { ...en,
  btn: 'Fotorealistisches Rendering (Path Tracing)', title: 'Fotorealistisches Rendering', prep: 'Szene und Licht werden vorbereitet…',
  tracing: (n, t) => `Wird verfeinert… ${n} von ${t} Samples`, stop: 'Stoppen und behalten', quality: 'Qualität', fast: 'Schnell', high: 'Hoch', ultra: 'Ultra',
  done: 'Rendering fertig. Licht und Schatten sind physikalisch aus Sonne und Himmel berechnet.', ai: 'KI-Feinschliff',
  aiNote: 'Fügt realistische Materialien und Deko bei gleichem Licht und gleicher Kamera hinzu. Zählt als ein Rendering von heute.',
  again: 'Neues Rendering', traced: 'Rendering', aiTab: 'Feinschliff', unsupported: 'Ihr Browser unterstützt kein Path Tracing, daher nutzen wir direkt das KI-Rendering.',
  up4k: '4K herunterladen', upscaling: (p) => `Hochskalieren auf 4K im Browser… ${p} %`, up4kDone: 'Ihr 4K-Bild ist fertig.', up4kFail: 'Hochskalieren hat auf diesem Gerät nicht funktioniert. Laden Sie das normale Bild oder versuchen Sie es am Computer.',
  credits: (n) => `Guthaben: ${n} Bilder`, needCredits: 'Die kostenlosen Bilder für heute sind aufgebraucht. Kaufen Sie ein Paket, um in gleicher Qualität weiterzumachen.', buyTitle: 'KI-Bildpakete', buyNote: 'Gemeinsam mit „Raum neu gestalten“. Jeder Feinschliff kostet ein Bild, fehlgeschlagene Bilder werden automatisch erstattet.', payTab: 'Die Zahlung wurde in einem neuen Tab geöffnet. Kommen Sie danach zurück, Ihr Guthaben aktualisiert sich automatisch.', bought: 'Ihr Guthaben ist da. Rendern Sie weiter.',
  upsellT: 'Mit exakten Maßen und echten Produkten?', upsellBtn: 'Rendering vom Ingenieur in 48 Stunden',
};

const fr: RenderText = { ...en,
  btn: 'Rendu photoréaliste (path tracing)', title: 'Rendu photoréaliste', prep: 'Préparation de la scène et de la lumière…',
  tracing: (n, t) => `Affinage… ${n} sur ${t} échantillons`, stop: 'Arrêter et garder', quality: 'Qualité', fast: 'Rapide', high: 'Haute', ultra: 'Ultra',
  done: 'Rendu prêt. La lumière et les ombres sont calculées physiquement à partir du soleil et du ciel.', ai: 'Finition IA',
  aiNote: 'Ajoute des matériaux et une décoration réalistes avec la même lumière et la même caméra. Compte comme un rendu du jour.',
  again: 'Nouveau rendu', traced: 'Rendu', aiTab: 'Finition', unsupported: 'Votre navigateur ne gère pas le path tracing, nous utilisons donc directement le rendu IA.',
  up4k: 'Télécharger en 4K', upscaling: (p) => `Agrandissement en 4K dans votre navigateur… ${p} %`, up4kDone: 'Votre image 4K est prête.', up4kFail: 'L’agrandissement n’a pas fonctionné sur cet appareil. Téléchargez l’image normale ou essayez sur un ordinateur.',
  credits: (n) => `Solde : ${n} images`, needCredits: 'Vous avez utilisé les images gratuites du jour. Achetez un pack pour continuer avec la même qualité.', buyTitle: 'Packs d’images IA', buyNote: 'Partagé avec « Relooker une pièce ». Chaque finition utilise une image, une image échouée est remboursée automatiquement.', payTab: 'Le paiement s’est ouvert dans un nouvel onglet. Revenez ici ensuite, votre solde se met à jour tout seul.', bought: 'Vos crédits sont arrivés. Continuez.',
  upsellT: 'Avec les dimensions exactes et de vrais produits ?', upsellBtn: 'Commander un rendu d’ingénieur en 48 h',
};

const ru: RenderText = { ...en,
  btn: 'Фотореалистичный рендер (трассировка)', title: 'Фотореалистичный рендер', prep: 'Готовим сцену и освещение…',
  tracing: (n, t) => `Уточняем… ${n} из ${t} сэмплов`, stop: 'Остановить и сохранить', quality: 'Качество', fast: 'Быстро', high: 'Высокое', ultra: 'Ультра',
  done: 'Рендер готов. Свет и тени рассчитаны физически от солнца и неба.', ai: 'Доводка ИИ',
  aiNote: 'Добавляет реалистичные материалы и декор при том же свете и ракурсе. Расходует один рендер за сегодня.',
  again: 'Новый рендер', traced: 'Рендер', aiTab: 'Доводка', unsupported: 'Ваш браузер не поддерживает трассировку, поэтому сразу используем ИИ-рендер.',
  up4k: 'Скачать 4K', upscaling: (p) => `Увеличиваем до 4K в браузере… ${p}%`, up4kDone: 'Изображение 4K готово.', up4kFail: 'На этом устройстве увеличить не удалось. Скачайте обычное изображение или попробуйте на компьютере.',
  credits: (n) => `Баланс: ${n} изображений`, needCredits: 'Бесплатные изображения на сегодня закончились. Купите пакет, чтобы продолжить в том же качестве.', buyTitle: 'Пакеты ИИ-изображений', buyNote: 'Общий баланс с «Дизайном комнаты». Каждая доводка списывает одно изображение, неудачное возвращается автоматически.', payTab: 'Оплата открыта в новой вкладке. Вернитесь сюда после оплаты — баланс обновится сам.', bought: 'Баланс пополнен. Продолжайте.',
  upsellT: 'Нужны точные размеры и реальные товары?', upsellBtn: 'Заказать рендер инженера за 48 часов',
};

const es: RenderText = { ...en,
  btn: 'Render fotorrealista (path tracing)', title: 'Render fotorrealista', prep: 'Preparando la escena y la luz…',
  tracing: (n, t) => `Refinando… ${n} de ${t} muestras`, stop: 'Detener y guardar', quality: 'Calidad', fast: 'Rápida', high: 'Alta', ultra: 'Ultra',
  done: 'Render listo. La luz y las sombras se calculan físicamente a partir del sol y el cielo.', ai: 'Acabado con IA',
  aiNote: 'Añade materiales y decoración realistas con la misma luz y cámara. Cuenta como un render de hoy.',
  again: 'Nuevo render', traced: 'Render', aiTab: 'Acabado', unsupported: 'Tu navegador no admite path tracing, así que usaremos directamente el render con IA.',
  up4k: 'Descargar 4K', upscaling: (p) => `Ampliando a 4K en tu navegador… ${p} %`, up4kDone: 'Tu imagen 4K está lista.', up4kFail: 'No se pudo ampliar en este dispositivo. Descarga la imagen normal o prueba en un ordenador.',
  credits: (n) => `Saldo: ${n} imágenes`, needCredits: 'Usaste las imágenes gratis de hoy. Compra un paquete para seguir con la misma calidad.', buyTitle: 'Paquetes de imágenes IA', buyNote: 'Compartido con «Rediseña una habitación». Cada acabado usa una imagen y las fallidas se reembolsan automáticamente.', payTab: 'El pago se abrió en otra pestaña. Vuelve aquí después y tu saldo se actualizará solo.', bought: 'Tu saldo ya llegó. Sigue renderizando.',
  upsellT: '¿Lo quieres con medidas exactas y productos reales?', upsellBtn: 'Pide un render de ingeniero en 48 horas',
};

const tr: RenderText = { ...en,
  btn: 'Fotogerçekçi render (ışın izleme)', title: 'Fotogerçekçi render', prep: 'Sahne ve ışık hazırlanıyor…',
  tracing: (n, t) => `İyileştiriliyor… ${n} / ${t} örnek`, stop: 'Durdur ve sakla', quality: 'Kalite', fast: 'Hızlı', high: 'Yüksek', ultra: 'Ultra',
  done: 'Render hazır. Işık ve gölgeler güneş ve gökyüzünden fiziksel olarak hesaplandı.', ai: 'Yapay zekâ ile son dokunuş',
  aiNote: 'Aynı ışık ve kamerayla gerçekçi malzeme ve dekor ekler. Bugünkü render hakkınızdan biri kullanılır.',
  again: 'Yeni render', traced: 'Render', aiTab: 'Son dokunuş', unsupported: 'Tarayıcınız ışın izlemeyi desteklemiyor; doğrudan yapay zekâ render kullanılacak.',
  up4k: '4K indir', upscaling: (p) => `Tarayıcınızda 4K'ya büyütülüyor… %${p}`, up4kDone: '4K görseliniz hazır.', up4kFail: 'Bu cihazda büyütme yapılamadı. Normal görseli indirin veya bilgisayardan deneyin.',
  credits: (n) => `Bakiye: ${n} görsel`, needCredits: 'Bugünkü ücretsiz görselleri kullandınız. Aynı kalitede devam etmek için paket alın.', buyTitle: 'Yapay zekâ görsel paketleri', buyNote: '“Odanı yeniden tasarla” ile ortak. Her son dokunuş bir görsel kullanır, başarısız görseller otomatik iade edilir.', payTab: 'Ödeme yeni sekmede açıldı. Sonra buraya dönün, bakiyeniz kendiliğinden güncellenir.', bought: 'Bakiyeniz yüklendi. Devam edin.',
  upsellT: 'Tam ölçüler ve gerçek ürünlerle mi istiyorsunuz?', upsellBtn: '48 saatte mühendis render’ı sipariş et',
};

const zh: RenderText = { ...en,
  btn: '真实感渲染（路径追踪）', title: '真实感渲染', prep: '正在准备场景和光照…',
  tracing: (n, t) => `正在细化… ${n} / ${t} 采样`, stop: '停止并保留', quality: '质量', fast: '快速', high: '高', ultra: '超高',
  done: '渲染完成。光照和阴影根据太阳和天空进行物理计算。', ai: 'AI 精修',
  aiNote: '在相同光照和视角下添加真实材质和软装。消耗今天的一次渲染额度。',
  again: '重新渲染', traced: '渲染', aiTab: '精修', unsupported: '您的浏览器不支持路径追踪，将直接使用 AI 渲染。',
  up4k: '下载 4K', upscaling: (p) => `正在浏览器中放大到 4K… ${p}%`, up4kDone: '4K 图片已就绪。', up4kFail: '此设备无法放大。请下载普通图片或在电脑上重试。',
  credits: (n) => `余额：${n} 张`, needCredits: '今天的免费图片已用完。购买套餐即可继续以相同质量出图。', buyTitle: 'AI 图片套餐', buyNote: '与“房间改造”共用余额。每次精修使用一张，失败会自动退回。', payTab: '已在新标签页打开付款。付款后回到这里，余额会自动更新。', bought: '余额已到账，继续出图吧。',
  upsellT: '想要精确尺寸和真实产品？', upsellBtn: '48 小时内获取工程师渲染',
};

const hi: RenderText = { ...en,
  btn: 'फ़ोटोरियल रेंडर (पाथ ट्रेसिंग)', title: 'फ़ोटोरियल रेंडर', prep: 'दृश्य और रोशनी तैयार हो रही है…',
  tracing: (n, t) => `बेहतर हो रहा है… ${t} में से ${n} सैंपल`, stop: 'रोकें और रखें', quality: 'गुणवत्ता', fast: 'तेज़', high: 'उच्च', ultra: 'अल्ट्रा',
  done: 'रेंडर तैयार है। रोशनी और छाया सूरज और आसमान से भौतिक रूप से गणना की गई है।', ai: 'AI फ़िनिशिंग टच',
  aiNote: 'उसी रोशनी और कैमरे पर असली जैसी सामग्री और सजावट जोड़ता है। आज के रेंडर में से एक गिना जाता है।',
  again: 'नया रेंडर', traced: 'रेंडर', aiTab: 'फ़िनिशिंग टच', unsupported: 'आपका ब्राउज़र पाथ ट्रेसिंग नहीं कर सकता, इसलिए सीधे AI रेंडर इस्तेमाल होगा।',
  up4k: '4K डाउनलोड करें', upscaling: (p) => `आपके ब्राउज़र में 4K तक बड़ा किया जा रहा है… ${p}%`, up4kDone: 'आपकी 4K इमेज तैयार है।', up4kFail: 'इस डिवाइस पर बड़ा नहीं हो सका। सामान्य इमेज डाउनलोड करें या कंप्यूटर पर आज़माएँ।',
  credits: (n) => `बैलेंस: ${n} इमेज`, needCredits: 'आज की मुफ़्त इमेज खत्म हो गईं। इसी क्वालिटी में आगे बढ़ने के लिए पैक खरीदें।', buyTitle: 'AI इमेज पैक', buyNote: '“कमरा रीडिज़ाइन” के साथ साझा। हर फ़िनिशिंग टच में एक इमेज लगती है, फेल होने पर अपने आप वापस।', payTab: 'भुगतान नए टैब में खुला है। भुगतान के बाद यहाँ लौटें, बैलेंस अपने आप अपडेट होगा।', bought: 'आपका बैलेंस आ गया। रेंडर जारी रखें।',
  upsellT: 'सटीक माप और असली प्रोडक्ट के साथ चाहिए?', upsellBtn: '48 घंटे में इंजीनियर रेंडर ऑर्डर करें',
};

const ur: RenderText = { ...en,
  btn: 'حقیقت نما رینڈر (پاتھ ٹریسنگ)', title: 'حقیقت نما رینڈر', prep: 'منظر اور روشنی تیار ہو رہی ہے…',
  tracing: (n, t) => `بہتر ہو رہا ہے… ${t} میں سے ${n} نمونے`, stop: 'روکیں اور رکھیں', quality: 'معیار', fast: 'تیز', high: 'اعلیٰ', ultra: 'الٹرا',
  done: 'رینڈر تیار ہے۔ روشنی اور سائے سورج اور آسمان سے طبیعیاتی طور پر حساب کیے گئے ہیں۔', ai: 'AI فنشنگ ٹچ',
  aiNote: 'اسی روشنی اور کیمرے پر حقیقی مواد اور سجاوٹ شامل کرتا ہے۔ آج کے رینڈرز میں سے ایک شمار ہوتا ہے۔',
  again: 'نیا رینڈر', traced: 'رینڈر', aiTab: 'فنشنگ ٹچ', unsupported: 'آپ کا براؤزر پاتھ ٹریسنگ نہیں کر سکتا، اس لیے براہ راست AI رینڈر استعمال ہوگا۔',
  up4k: '4K ڈاؤن لوڈ کریں', upscaling: (p) => `آپ کے براؤزر میں 4K تک بڑا کیا جا رہا ہے… ${p}٪`, up4kDone: 'آپ کی 4K تصویر تیار ہے۔', up4kFail: 'اس ڈیوائس پر بڑا نہیں ہو سکا۔ عام تصویر ڈاؤن لوڈ کریں یا کمپیوٹر پر آزمائیں۔',
  credits: (n) => `بیلنس: ${n} تصاویر`, needCredits: 'آج کی مفت تصاویر ختم ہو گئیں۔ اسی معیار پر جاری رکھنے کے لیے پیکج خریدیں۔', buyTitle: 'AI تصویری پیکجز', buyNote: '«کمرہ دوبارہ ڈیزائن کریں» کے ساتھ مشترکہ۔ ہر فنشنگ ٹچ پر ایک تصویر کٹتی ہے، ناکام تصویر خود واپس ہو جاتی ہے۔', payTab: 'ادائیگی نئے ٹیب میں کھلی ہے۔ ادائیگی کے بعد یہاں واپس آئیں، بیلنس خود اپ ڈیٹ ہو جائے گا۔', bought: 'آپ کا بیلنس آ گیا۔ رینڈر جاری رکھیں۔',
  upsellT: 'درست پیمائش اور حقیقی مصنوعات کے ساتھ چاہیے؟', upsellBtn: '48 گھنٹوں میں انجینئر رینڈر آرڈر کریں',
};

export const renderText: Record<Lang, RenderText> = { ar, en, de, fr, ru, es, tr, zh, hi, ur };
