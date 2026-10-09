// Copy for /account/ (client accounts, saved plans, order threads, designer portal)
// and for the "save / share" bar of the plan designer.
import type { Lang } from './content';
import { extra } from './locales';

export const STATUS_KEYS = { 'جديد': 'new', 'بانتظار الدفع': 'unpaid', 'مدفوع': 'paid', 'قيد التنفيذ': 'progress', 'تم التسليم': 'delivered', 'ملغي': 'cancelled' } as const;
type StatusKey = (typeof STATUS_KEYS)[keyof typeof STATUS_KEYS];

type Copy = {
  nav: string; title: string; meta: string; lead: string;
  signIn: { title: string; sub: string; email: string; btn: string; sent: string; bad: string; expired: string };
  out: string; hello: string;
  tabs: { projects: string; orders: string; designer: string };
  projects: { empty: string; newPlan: string; open: string; share: string; copied: string; del: string; confirmDel: string; updated: string };
  orders: { empty: string; order: string; status: Record<StatusKey, string>; files: string; thread: string; write: string; send: string; you: string; designer: string; client: string; team: string; rate: string; rateSend: string; review: string; thanks: string; noDesigner: string; plan: string };
  des: {
    intro: string; apply: string; name: string; skills: string; countries: string; note: string; send: string; pending: string; applied: string;
    open: string; mine: string; none: string; claim: string; claimed: string; notes: string; deliver: string; deliverNote: string; deliverBtn: string; delivered: string; deliverHint: string;
  };
  save: { title: string; sub: string; name: string; btn: string; saved: string; share: string; copy: string; copied: string; signIn: string; mine: string; shared: string; sharedFrom: string };
  err: string;
};

export type AccountText = Copy;
export const acc: Record<Lang, Copy> = {
  ar: {
    nav: 'حسابي', title: 'حسابي', meta: 'حسابك في Oxira Design: مخططاتك المحفوظة، طلباتك وحالتها، ورسائلك مع المصمم.',
    lead: 'مخططاتك المحفوظة، وطلباتك وحالتها، والرسائل مع المصمم في مكان واحد.',
    signIn: { title: 'ادخل بإيميلك', sub: 'نرسل لك رابط دخول على الإيميل، بدون كلمة مرور.', email: 'الإيميل', btn: 'أرسل رابط الدخول', sent: 'أرسلنا رابط الدخول إلى إيميلك. افتحه من نفس الجهاز (تفقد مجلد الرسائل غير المرغوبة).', bad: 'اكتب إيميل صحيح.', expired: 'انتهت صلاحية رابط الدخول. اطلب رابط جديد.' },
    out: 'تسجيل الخروج', hello: 'مرحباً',
    tabs: { projects: 'مخططاتي', orders: 'طلباتي', designer: 'بوابة المصممين' },
    projects: { empty: 'ما عندك مخططات محفوظة. صمم مخططك واضغط «احفظ في حسابي».', newPlan: 'صمم مخطط جديد', open: 'افتح وعدّل', share: 'نسخ رابط المشاركة', copied: 'تم نسخ الرابط', del: 'حذف', confirmDel: 'حذف هذا المخطط نهائياً؟', updated: 'آخر تعديل' },
    orders: {
      empty: 'ما عندك طلبات بهذا الإيميل. الطلبات تظهر هنا إذا استخدمت نفس الإيميل في نموذج الطلب.', order: 'طلب',
      status: { new: 'جديد', unpaid: 'بانتظار الدفع', paid: 'مدفوع', progress: 'قيد التنفيذ', delivered: 'تم التسليم', cancelled: 'ملغي' },
      files: 'الملفات المرسلة', thread: 'الرسائل', write: 'اكتب رسالتك للمصمم…', send: 'إرسال', you: 'أنت', designer: 'المصمم', client: 'العميل', team: 'فريق أوكسيرا',
      rate: 'قيّم التصميم', rateSend: 'إرسال التقييم', review: 'رأيك (اختياري)', thanks: 'شكراً على تقييمك', noDesigner: 'بانتظار تعيين مصمم، رسالتك تصل لفريق أوكسيرا.', plan: 'المخطط المرفق',
    },
    des: {
      intro: 'مصمم أو مهندس معماري؟ انضم لشبكة مصممي أوكسيرا واستلم طلبات من عملاء في عدة دول.', apply: 'طلب الانضمام', name: 'الاسم الكامل', skills: 'تخصصك وبرامجك', countries: 'الدول التي تعمل بكوداتها', note: 'رابط أعمالك أو نبذة', send: 'أرسل الطلب',
      pending: 'طلبك قيد المراجعة. نراسلك على الإيميل بعد الموافقة.', applied: 'وصل طلبك، شكراً.',
      open: 'طلبات متاحة', mine: 'طلباتي كمصمم', none: 'لا توجد طلبات الآن.', claim: 'استلم الطلب', claimed: 'استلمت الطلب. ملفات العميل تصلك من الفريق على الإيميل.', notes: 'تفاصيل الطلب',
      deliver: 'تسليم الملفات للعميل', deliverNote: 'رسالة للعميل (اختياري)', deliverBtn: 'سلّم الملفات', delivered: 'تم إرسال الملفات للعميل.', deliverHint: 'PDF أو DWG أو صور أو ZIP، حتى 20 ميجا.',
    },
    save: { title: 'احفظ مخططك', sub: 'احفظه في حسابك وارجع له من أي جهاز، أو شارك رابطه مع أهلك أو المقاول.', name: 'اسم المخطط', btn: 'احفظ في حسابي', saved: 'تم الحفظ في حسابك.', share: 'رابط المشاركة', copy: 'نسخ', copied: 'تم النسخ', signIn: 'سجّل الدخول لحفظ مخططاتك', mine: 'مخططاتي', shared: 'هذا مخطط تمت مشاركته معك. أي تعديل تسويه يبقى عندك فقط.', sharedFrom: 'مخطط مشارك' },
    err: 'صار خطأ في الاتصال، حاول مرة ثانية.',
  },
  en: {
    nav: 'My account', title: 'My account', meta: 'Your Oxira Design account: saved plans, your orders and their status, and messages with your designer.',
    lead: 'Your saved plans, your orders and their status, and your messages with the designer in one place.',
    signIn: { title: 'Sign in with your email', sub: 'We email you a sign-in link. No password needed.', email: 'Email', btn: 'Email me a sign-in link', sent: 'We sent a sign-in link to your email. Open it on this device (check your spam folder too).', bad: 'Enter a valid email address.', expired: 'Your sign-in link has expired. Ask for a new one.' },
    out: 'Sign out', hello: 'Hello',
    tabs: { projects: 'My plans', orders: 'My orders', designer: 'Designer portal' },
    projects: { empty: 'No saved plans yet. Design a plan and press "Save to my account".', newPlan: 'Design a new plan', open: 'Open and edit', share: 'Copy share link', copied: 'Link copied', del: 'Delete', confirmDel: 'Delete this plan for good?', updated: 'Last edited' },
    orders: {
      empty: 'No orders with this email yet. Orders show up here when you use the same email in the order form.', order: 'Order',
      status: { new: 'New', unpaid: 'Awaiting payment', paid: 'Paid', progress: 'In progress', delivered: 'Delivered', cancelled: 'Cancelled' },
      files: 'Files you sent', thread: 'Messages', write: 'Write to your designer…', send: 'Send', you: 'You', designer: 'Designer', client: 'Client', team: 'Oxira team',
      rate: 'Rate the work', rateSend: 'Send rating', review: 'Your comments (optional)', thanks: 'Thank you for your rating', noDesigner: 'A designer has not been assigned yet; your message goes to the Oxira team.', plan: 'Attached plan',
    },
    des: {
      intro: 'Designer or architect? Join the Oxira designer network and take orders from clients in several countries.', apply: 'Apply to join', name: 'Full name', skills: 'Your specialty and software', countries: 'Countries whose codes you work with', note: 'Portfolio link or a short bio', send: 'Send application',
      pending: 'Your application is being reviewed. We will email you once it is approved.', applied: 'Application received, thank you.',
      open: 'Open orders', mine: 'My orders as designer', none: 'No orders right now.', claim: 'Take this order', claimed: 'The order is yours. The team will email you the client files.', notes: 'Order details',
      deliver: 'Deliver files to the client', deliverNote: 'Message to the client (optional)', deliverBtn: 'Deliver files', delivered: 'The files were sent to the client.', deliverHint: 'PDF, DWG, images or ZIP, up to 20 MB.',
    },
    save: { title: 'Save your plan', sub: 'Keep it in your account and open it on any device, or share the link with family or your contractor.', name: 'Plan name', btn: 'Save to my account', saved: 'Saved to your account.', share: 'Share link', copy: 'Copy', copied: 'Copied', signIn: 'Sign in to save your plans', mine: 'My plans', shared: 'This plan was shared with you. Any changes you make stay on your device.', sharedFrom: 'Shared plan' },
    err: 'Connection problem, please try again.',
  },
  de: {
    nav: 'Mein Konto', title: 'Mein Konto', meta: 'Ihr Oxira-Design-Konto: gespeicherte Grundrisse, Ihre Aufträge mit Status und Nachrichten mit Ihrem Designer.',
    lead: 'Gespeicherte Grundrisse, Ihre Aufträge mit Status und die Nachrichten mit dem Designer an einem Ort.',
    signIn: { title: 'Mit E-Mail anmelden', sub: 'Wir senden Ihnen einen Anmeldelink, ohne Passwort.', email: 'E-Mail', btn: 'Anmeldelink senden', sent: 'Der Anmeldelink ist unterwegs. Öffnen Sie ihn auf diesem Gerät (auch im Spam-Ordner nachsehen).', bad: 'Bitte eine gültige E-Mail-Adresse eingeben.', expired: 'Der Anmeldelink ist abgelaufen. Fordern Sie einen neuen an.' },
    out: 'Abmelden', hello: 'Hallo',
    tabs: { projects: 'Meine Grundrisse', orders: 'Meine Aufträge', designer: 'Designer-Portal' },
    projects: { empty: 'Noch keine gespeicherten Grundrisse. Entwerfen Sie einen Grundriss und klicken Sie auf „Im Konto speichern“.', newPlan: 'Neuen Grundriss entwerfen', open: 'Öffnen und bearbeiten', share: 'Teilen-Link kopieren', copied: 'Link kopiert', del: 'Löschen', confirmDel: 'Diesen Grundriss endgültig löschen?', updated: 'Zuletzt bearbeitet' },
    orders: {
      empty: 'Keine Aufträge mit dieser E-Mail. Aufträge erscheinen hier, wenn Sie im Auftragsformular dieselbe E-Mail verwenden.', order: 'Auftrag',
      status: { new: 'Neu', unpaid: 'Zahlung ausstehend', paid: 'Bezahlt', progress: 'In Arbeit', delivered: 'Geliefert', cancelled: 'Storniert' },
      files: 'Gesendete Dateien', thread: 'Nachrichten', write: 'Nachricht an Ihren Designer…', send: 'Senden', you: 'Sie', designer: 'Designer', client: 'Kunde', team: 'Oxira-Team',
      rate: 'Arbeit bewerten', rateSend: 'Bewertung senden', review: 'Ihr Kommentar (optional)', thanks: 'Danke für Ihre Bewertung', noDesigner: 'Noch kein Designer zugewiesen; Ihre Nachricht geht an das Oxira-Team.', plan: 'Angehängter Grundriss',
    },
    des: {
      intro: 'Designer oder Architekt? Treten Sie dem Oxira-Designernetzwerk bei und übernehmen Sie Aufträge aus mehreren Ländern.', apply: 'Bewerben', name: 'Vollständiger Name', skills: 'Fachgebiet und Software', countries: 'Länder, deren Bauvorschriften Sie kennen', note: 'Portfolio-Link oder kurze Vorstellung', send: 'Bewerbung senden',
      pending: 'Ihre Bewerbung wird geprüft. Wir melden uns per E-Mail.', applied: 'Bewerbung erhalten, danke.',
      open: 'Offene Aufträge', mine: 'Meine Aufträge als Designer', none: 'Derzeit keine Aufträge.', claim: 'Auftrag übernehmen', claimed: 'Der Auftrag gehört Ihnen. Das Team sendet Ihnen die Kundendateien per E-Mail.', notes: 'Auftragsdetails',
      deliver: 'Dateien an den Kunden liefern', deliverNote: 'Nachricht an den Kunden (optional)', deliverBtn: 'Dateien liefern', delivered: 'Die Dateien wurden an den Kunden gesendet.', deliverHint: 'PDF, DWG, Bilder oder ZIP, bis 20 MB.',
    },
    save: { title: 'Grundriss speichern', sub: 'Im Konto speichern und auf jedem Gerät öffnen, oder den Link mit Familie oder Bauunternehmer teilen.', name: 'Name des Grundrisses', btn: 'Im Konto speichern', saved: 'Im Konto gespeichert.', share: 'Teilen-Link', copy: 'Kopieren', copied: 'Kopiert', signIn: 'Anmelden, um Grundrisse zu speichern', mine: 'Meine Grundrisse', shared: 'Dieser Grundriss wurde mit Ihnen geteilt. Ihre Änderungen bleiben auf Ihrem Gerät.', sharedFrom: 'Geteilter Grundriss' },
    err: 'Verbindungsproblem, bitte erneut versuchen.',
  },
  fr: {
    nav: 'Mon compte', title: 'Mon compte', meta: 'Votre compte Oxira Design : plans enregistrés, vos commandes et leur état, et vos messages avec le designer.',
    lead: 'Vos plans enregistrés, vos commandes et leur état, et vos échanges avec le designer au même endroit.',
    signIn: { title: 'Connexion par e-mail', sub: 'Nous vous envoyons un lien de connexion, sans mot de passe.', email: 'E-mail', btn: 'Recevoir un lien de connexion', sent: 'Le lien de connexion vous a été envoyé. Ouvrez-le sur cet appareil (vérifiez aussi les spams).', bad: 'Saisissez une adresse e-mail valide.', expired: 'Le lien de connexion a expiré. Demandez-en un nouveau.' },
    out: 'Se déconnecter', hello: 'Bonjour',
    tabs: { projects: 'Mes plans', orders: 'Mes commandes', designer: 'Espace designers' },
    projects: { empty: 'Aucun plan enregistré. Dessinez un plan puis cliquez sur « Enregistrer dans mon compte ».', newPlan: 'Dessiner un nouveau plan', open: 'Ouvrir et modifier', share: 'Copier le lien de partage', copied: 'Lien copié', del: 'Supprimer', confirmDel: 'Supprimer définitivement ce plan ?', updated: 'Modifié le' },
    orders: {
      empty: 'Aucune commande avec cet e-mail. Elles apparaissent ici si vous utilisez le même e-mail dans le formulaire.', order: 'Commande',
      status: { new: 'Nouvelle', unpaid: 'En attente de paiement', paid: 'Payée', progress: 'En cours', delivered: 'Livrée', cancelled: 'Annulée' },
      files: 'Fichiers envoyés', thread: 'Messages', write: 'Écrivez à votre designer…', send: 'Envoyer', you: 'Vous', designer: 'Designer', client: 'Client', team: 'Équipe Oxira',
      rate: 'Noter le travail', rateSend: 'Envoyer la note', review: 'Votre avis (facultatif)', thanks: 'Merci pour votre note', noDesigner: 'Aucun designer assigné pour l’instant ; votre message va à l’équipe Oxira.', plan: 'Plan joint',
    },
    des: {
      intro: 'Designer ou architecte ? Rejoignez le réseau Oxira et recevez des commandes de clients de plusieurs pays.', apply: 'Postuler', name: 'Nom complet', skills: 'Spécialité et logiciels', countries: 'Pays dont vous connaissez les réglementations', note: 'Lien vers vos travaux ou courte présentation', send: 'Envoyer la candidature',
      pending: 'Votre candidature est en cours d’examen. Nous vous écrirons après validation.', applied: 'Candidature reçue, merci.',
      open: 'Commandes disponibles', mine: 'Mes commandes de designer', none: 'Aucune commande pour le moment.', claim: 'Prendre la commande', claimed: 'La commande est à vous. L’équipe vous envoie les fichiers du client par e-mail.', notes: 'Détails de la commande',
      deliver: 'Livrer les fichiers au client', deliverNote: 'Message au client (facultatif)', deliverBtn: 'Livrer les fichiers', delivered: 'Les fichiers ont été envoyés au client.', deliverHint: 'PDF, DWG, images ou ZIP, jusqu’à 20 Mo.',
    },
    save: { title: 'Enregistrer votre plan', sub: 'Gardez-le dans votre compte et ouvrez-le sur tout appareil, ou partagez le lien avec vos proches ou votre entrepreneur.', name: 'Nom du plan', btn: 'Enregistrer dans mon compte', saved: 'Enregistré dans votre compte.', share: 'Lien de partage', copy: 'Copier', copied: 'Copié', signIn: 'Connectez-vous pour enregistrer vos plans', mine: 'Mes plans', shared: 'Ce plan a été partagé avec vous. Vos modifications restent sur votre appareil.', sharedFrom: 'Plan partagé' },
    err: 'Problème de connexion, réessayez.',
  },
  ru: {
    nav: 'Мой кабинет', title: 'Мой кабинет', meta: 'Ваш кабинет Oxira Design: сохранённые планировки, заказы и их статус, переписка с дизайнером.',
    lead: 'Сохранённые планировки, заказы и их статус и переписка с дизайнером в одном месте.',
    signIn: { title: 'Вход по e-mail', sub: 'Мы пришлём ссылку для входа, пароль не нужен.', email: 'E-mail', btn: 'Прислать ссылку для входа', sent: 'Ссылка для входа отправлена. Откройте её на этом устройстве (проверьте и папку «Спам»).', bad: 'Введите корректный e-mail.', expired: 'Срок действия ссылки истёк. Запросите новую.' },
    out: 'Выйти', hello: 'Здравствуйте',
    tabs: { projects: 'Мои планировки', orders: 'Мои заказы', designer: 'Портал дизайнеров' },
    projects: { empty: 'Сохранённых планировок пока нет. Создайте планировку и нажмите «Сохранить в кабинете».', newPlan: 'Новая планировка', open: 'Открыть и изменить', share: 'Скопировать ссылку', copied: 'Ссылка скопирована', del: 'Удалить', confirmDel: 'Удалить эту планировку навсегда?', updated: 'Изменено' },
    orders: {
      empty: 'Заказов с этим e-mail нет. Заказы появятся здесь, если указать тот же e-mail в форме заказа.', order: 'Заказ',
      status: { new: 'Новый', unpaid: 'Ожидает оплаты', paid: 'Оплачен', progress: 'В работе', delivered: 'Сдан', cancelled: 'Отменён' },
      files: 'Отправленные файлы', thread: 'Сообщения', write: 'Напишите дизайнеру…', send: 'Отправить', you: 'Вы', designer: 'Дизайнер', client: 'Клиент', team: 'Команда Oxira',
      rate: 'Оценить работу', rateSend: 'Отправить оценку', review: 'Ваш отзыв (необязательно)', thanks: 'Спасибо за оценку', noDesigner: 'Дизайнер ещё не назначен; сообщение получит команда Oxira.', plan: 'Приложенная планировка',
    },
    des: {
      intro: 'Дизайнер или архитектор? Присоединяйтесь к сети Oxira и получайте заказы от клиентов из разных стран.', apply: 'Подать заявку', name: 'Полное имя', skills: 'Специализация и программы', countries: 'Страны, нормы которых вы знаете', note: 'Ссылка на портфолио или пара слов о себе', send: 'Отправить заявку',
      pending: 'Заявка на рассмотрении. Мы напишем вам после одобрения.', applied: 'Заявка получена, спасибо.',
      open: 'Доступные заказы', mine: 'Мои заказы как дизайнера', none: 'Сейчас заказов нет.', claim: 'Взять заказ', claimed: 'Заказ ваш. Команда пришлёт файлы клиента по e-mail.', notes: 'Детали заказа',
      deliver: 'Сдать файлы клиенту', deliverNote: 'Сообщение клиенту (необязательно)', deliverBtn: 'Сдать файлы', delivered: 'Файлы отправлены клиенту.', deliverHint: 'PDF, DWG, изображения или ZIP, до 20 МБ.',
    },
    save: { title: 'Сохраните планировку', sub: 'Храните её в кабинете и открывайте на любом устройстве или поделитесь ссылкой с семьёй или подрядчиком.', name: 'Название', btn: 'Сохранить в кабинете', saved: 'Сохранено в кабинете.', share: 'Ссылка', copy: 'Копировать', copied: 'Скопировано', signIn: 'Войдите, чтобы сохранять планировки', mine: 'Мои планировки', shared: 'Этой планировкой с вами поделились. Ваши изменения останутся на вашем устройстве.', sharedFrom: 'Общая планировка' },
    err: 'Ошибка соединения, попробуйте ещё раз.',
  },
  es: extra.es.account,
  tr: extra.tr.account,
  zh: extra.zh.account,
  hi: extra.hi.account,
  ur: extra.ur.account,
};
