// Terms of service, refund policy and the GDPR / PDPL part of the privacy policy.
// Draft prepared for Oxira; have it reviewed by a lawyer before relying on it.
import type { Lang } from './content';

type Sec = { h: string; p: string };
type Page = { title: string; meta: string; sections: Sec[] };
type Legal = {
  updated: string; terms: Page; refunds: Page; privacyMore: Sec[];
  nav: { terms: string; refunds: string };
  consent: { text: string; accept: string; decline: string; more: string };
};

export const legal: Record<Lang, Legal> = {
  ar: {
    updated: 'آخر تحديث: أكتوبر 2026',
    nav: { terms: 'الشروط والأحكام', refunds: 'سياسة الاسترجاع' },
    consent: { text: 'نستخدم ملفات تحليل مجهولة لتحسين الموقع، فقط إذا وافقت.', accept: 'موافق', decline: 'لا، شكراً', more: 'سياسة الخصوصية' },
    terms: {
      title: 'الشروط والأحكام', meta: 'شروط استخدام Oxira Design: الاستوديو، تصميم المخططات، الحسابات، الطلبات والدفع والتسليم.',
      sections: [
        { h: 'من نحن', p: 'Oxira Design خدمة من أوكسيرا للتحول الرقمي وتقنية المعلومات في المملكة العربية السعودية. باستخدامك الموقع أو طلب أي خدمة فأنت توافق على هذه الشروط.' },
        { h: 'الخدمات', p: 'الاستوديو وأداة تصميم المخطط مجانية وتعمل في متصفحك. المخططات التلقائية والكميات والرندرات بالذكاء الاصطناعي تقديرية لتوضيح الفكرة، وليست مخططات تنفيذية ولا بديلاً عن مهندس مرخص أو عن موافقات البلدية والكود المحلي. خدمات الفريق (الباقة السريعة، التصميم الداخلي، المخططات، وغيرها) تُنفَّذ حسب وصف الباقة أو عرض السعر المرسل لك.' },
        { h: 'الحساب', p: 'تدخل لحسابك برابط يصل لإيميلك. أنت مسؤول عن حماية إيميلك وعدم مشاركة رابط الدخول. رابط المشاركة لأي مخطط يتيح لمن يملكه رؤية نسخة منه، فشاركه بحذر، وتقدر تحذف المخطط في أي وقت.' },
        { h: 'ملفاتك ومحتواك', p: 'تبقى ملكية المخططات والصور التي ترفعها لك. تمنحنا إذناً محدوداً باستخدامها فقط لتنفيذ طلبك. تقر أن لديك الحق في رفعها وأنها لا تخالف حقوق الغير.' },
        { h: 'ملكية التسليمات', p: 'بعد سداد كامل المبلغ يحق لك استخدام التصاميم والملفات المسلّمة لمشروعك بلا قيود. نحتفظ بحق عرض صور مختارة في أعمالنا بدون بياناتك الشخصية أو العنوان، إلا إذا طلبت عدم ذلك كتابياً.' },
        { h: 'الأسعار والدفع', p: 'الأسعار بالريال السعودي قبل ضريبة القيمة المضافة 15% ما لم يُذكر غير ذلك. الأسعار المعروضة بعملات أخرى تقريبية للتوضيح، والمبلغ المستحق هو المذكور في الفاتورة. الباقة السريعة تُدفع مقدماً؛ بقية الخدمات حسب عرض السعر (غالباً دفعة مقدمة والباقي عند التسليم).' },
        { h: 'التسليم والتعديلات', p: 'مدة التسليم وعدد جولات التعديل حسب الباقة أو عرض السعر، وتبدأ المدة بعد استلام الدفع والملفات المطلوبة كاملة. التعديلات الجوهرية خارج النطاق الأصلي تُسعّر بشكل منفصل.' },
        { h: 'المصممون', p: 'قد ينفّذ طلبك مصمم من شبكة مصممي Oxira. نبقى نحن الطرف المسؤول أمامك عن الطلب. يلتزم المصممون بسرية ملفاتك وعدم التواصل معك خارج المنصة لأغراض تجارية.' },
        { h: 'الاستخدام المقبول', p: 'لا تستخدم الموقع لرفع محتوى غير نظامي أو مسيء، أو لمحاولة اختراقه أو إرهاق خوادمه، أو لتجاوز حدود الاستخدام المجاني آلياً.' },
        { h: 'حدود المسؤولية', p: 'نقدّم الخدمة بعناية مهنية، لكن لا نتحمل مسؤولية قرارات البناء أو الشراء المبنية على مخرجات تقديرية دون مراجعة مهندس مرخص. في جميع الأحوال لا تتجاوز مسؤوليتنا المبلغ الذي دفعته عن الطلب المعني.' },
        { h: 'النظام والتواصل', p: 'تخضع هذه الشروط لأنظمة المملكة العربية السعودية، مع عدم الإخلال بحقوق المستهلك الإلزامية في بلدك. قد نحدّث الشروط ونوضح تاريخ التحديث هنا. للتواصل: info@oxira.sa.' },
      ],
    },
    refunds: {
      title: 'سياسة الاسترجاع', meta: 'متى يحق لك استرجاع المبلغ في Oxira Design وكيف تطلبه.',
      sections: [
        { h: 'قبل بدء العمل', p: 'إذا ألغيت الطلب قبل أن نبدأ العمل عليه نعيد لك المبلغ كاملاً.' },
        { h: 'بعد بدء العمل', p: 'إذا ألغيت بعد بدء العمل نعيد المبلغ بعد خصم قيمة ما تم إنجازه فعلاً حسب مراحل الباقة أو عرض السعر.' },
        { h: 'إذا لم يطابق التسليم الوصف', p: 'إذا جاء التسليم مخالفاً لوصف الباقة أو عرض السعر نصححه أولاً ضمن جولات التعديل. إذا تعذّر التصحيح نعيد لك المبلغ كاملاً أو جزءاً منه بما يتناسب مع الخلل.' },
        { h: 'رصيد التصميم بالذكاء الاصطناعي', p: 'رصيد «صمّم غرفتك» لا يُسترجع بعد استخدامه. الرصيد غير المستخدم يُسترجع خلال 14 يوماً من الشراء. إذا فشل توليد تصميم لسبب تقني لا يُخصم من رصيدك.' },
        { h: 'العملاء في الاتحاد الأوروبي والمملكة المتحدة', p: 'لك حق الانسحاب خلال 14 يوماً من الطلب. إذا طلبت منا البدء خلال هذه المدة وأقررت بذلك، تدفع مقابل ما أُنجز حتى الانسحاب، ويسقط الحق عند اكتمال الخدمة.' },
        { h: 'طريقة الطلب', p: 'راسلنا على info@oxira.sa أو من رسائل الطلب في حسابك مع رقم الطلب والسبب. نرد خلال يومي عمل، ويُعاد المبلغ بنفس وسيلة الدفع خلال 14 يوماً من الموافقة.' },
      ],
    },
    privacyMore: [
      { h: 'المسؤول عن البيانات', p: 'أوكسيرا للتحول الرقمي وتقنية المعلومات، المملكة العربية السعودية. للتواصل في أي شأن يخص بياناتك: info@oxira.sa.' },
      { h: 'الحساب والمخططات المحفوظة', p: 'نحفظ إيميلك ورموز الدخول ومخططاتك المحفوظة ورسائلك مع المصمم وتقييمك. تقدر تحذف أي مخطط من حسابك مباشرة، أو تطلب حذف الحساب كاملاً.' },
      { h: 'الذكاء الاصطناعي', p: 'عند استخدام «اكتب وصف بيتك» أو «حوّل صورة المخطط» نرسل النص أو صورة المخطط لمزود نماذج الذكاء الاصطناعي (Anthropic) لمعالجتها فقط. لا تُستخدم لتدريب النماذج حسب شروط المزود.' },
      { h: 'الأساس النظامي', p: 'نعالج بياناتك لتنفيذ العقد معك (الطلبات والحساب)، وبناءً على موافقتك (التحليلات والرسائل التسويقية إن وجدت)، ولمصلحتنا المشروعة في حماية الموقع ومنع إساءة الاستخدام، وللوفاء بالتزاماتنا النظامية (الفواتير والضريبة).' },
      { h: 'حقوقك (نظام حماية البيانات الشخصية واللائحة الأوروبية GDPR)', p: 'لك حق الاطلاع على بياناتك وتصحيحها وحذفها، وتقييد معالجتها والاعتراض عليها، ونقلها، وسحب موافقتك في أي وقت. نرد خلال 30 يوماً. ولك حق تقديم شكوى للجهة المختصة: الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا) أو سلطة حماية البيانات في بلدك.' },
      { h: 'التخزين في المتصفح والتحليلات', p: 'نستخدم تخزين المتصفح لحفظ مخططك واختياراتك (الدولة، الوحدات) ورمز الدخول على جهازك فقط. إذا فُعّلت التحليلات فهي مجهولة الهوية، ولزوار أوروبا لا تعمل إلا بعد موافقتهم.' },
      { h: 'مدة الاحتفاظ', p: 'روابط الدخول تنتهي بعد 30 يوماً. المخططات المحفوظة حتى تحذفها أو تحذف حسابك. الطلبات والفواتير المدة التي يفرضها النظام (حتى 10 سنوات للسجلات الضريبية).' },
    ],
  },
  en: {
    updated: 'Last updated: October 2026',
    nav: { terms: 'Terms of service', refunds: 'Refund policy' },
    consent: { text: 'We use anonymous analytics to improve the site, only if you agree.', accept: 'Accept', decline: 'No thanks', more: 'Privacy policy' },
    terms: {
      title: 'Terms of service', meta: 'Terms for using Oxira Design: the studio, the plan designer, accounts, orders, payment and delivery.',
      sections: [
        { h: 'Who we are', p: 'Oxira Design is a service of Oxira Digital Transformation and IT, Saudi Arabia. By using the site or ordering a service you agree to these terms.' },
        { h: 'Services', p: 'The studio and the plan designer are free and run in your browser. Automatic plans, quantities and AI renders are estimates to illustrate an idea; they are not construction drawings and do not replace a licensed engineer, building permits or local codes. Team services (Quick package, interior design, plans and others) are delivered as described in the package or in the quote we send you.' },
        { h: 'Your account', p: 'You sign in with a link sent to your email. Keep your email secure and do not share sign-in links. Anyone with a plan’s share link can view a copy of it, so share it with care; you can delete a plan at any time.' },
        { h: 'Your files and content', p: 'You keep ownership of the plans and images you upload. You give us a limited licence to use them only to deliver your order, and you confirm you have the right to upload them.' },
        { h: 'Ownership of deliverables', p: 'Once paid in full, you may use the delivered designs and files for your project without restriction. We may show selected images in our portfolio without your personal details or address, unless you ask us in writing not to.' },
        { h: 'Prices and payment', p: 'Prices are in Saudi riyals before 15% VAT unless stated otherwise. Prices shown in other currencies are approximate; the amount due is the one on your invoice. The Quick package is paid upfront; other services follow the quote (usually a deposit and the balance on delivery).' },
        { h: 'Delivery and revisions', p: 'Delivery time and revision rounds follow the package or quote and start once payment and all required files are received. Substantial changes outside the original scope are priced separately.' },
        { h: 'Designers', p: 'Your order may be carried out by a designer from the Oxira network. We remain responsible to you for the order. Designers keep your files confidential and may not contact you off-platform for business.' },
        { h: 'Acceptable use', p: 'Do not upload unlawful or offensive content, try to break into or overload the site, or automate around free usage limits.' },
        { h: 'Liability', p: 'We work with professional care, but we are not responsible for building or buying decisions based on estimates without review by a licensed engineer. Our liability is in any case limited to the amount you paid for the order concerned.' },
        { h: 'Law and contact', p: 'These terms are governed by the laws of Saudi Arabia, without affecting the mandatory consumer rights of your country. We may update them and will show the date here. Contact: info@oxira.sa.' },
      ],
    },
    refunds: {
      title: 'Refund policy', meta: 'When you can get a refund from Oxira Design and how to ask for it.',
      sections: [
        { h: 'Before work starts', p: 'If you cancel before we start work on your order, we refund you in full.' },
        { h: 'After work has started', p: 'If you cancel after work has started, we refund the amount minus the value of the work already done, by the stages of the package or quote.' },
        { h: 'If the delivery does not match', p: 'If the delivery does not match the package or quote, we first fix it within the revision rounds. If it cannot be fixed, we refund all or part of the amount in proportion to the problem.' },
        { h: 'AI design credits', p: '"Redesign my room" credits are not refundable once used. Unused credits can be refunded within 14 days of purchase. A design that fails for a technical reason is not deducted from your balance.' },
        { h: 'Customers in the EU and UK', p: 'You may withdraw within 14 days of ordering. If you asked us to start within that period and acknowledged it, you pay for the work done up to the withdrawal, and the right ends once the service is fully performed.' },
        { h: 'How to ask', p: 'Email info@oxira.sa or write in your order’s messages in your account, with the order number and the reason. We reply within two working days, and refunds go back to the original payment method within 14 days of approval.' },
      ],
    },
    privacyMore: [
      { h: 'Data controller', p: 'Oxira Digital Transformation and IT, Saudi Arabia. For anything about your data: info@oxira.sa.' },
      { h: 'Account and saved plans', p: 'We store your email, sign-in tokens, saved plans, messages with your designer and your rating. You can delete any plan from your account yourself, or ask us to delete the whole account.' },
      { h: 'AI features', p: 'When you use "Describe your house" or "Turn a plan image into a plan", the text or plan image is sent to our AI model provider (Anthropic) only to process it. Under the provider’s terms it is not used to train models.' },
      { h: 'Legal basis', p: 'We process your data to perform our contract with you (orders and account), on your consent (analytics and any marketing), for our legitimate interest in protecting the site and preventing abuse, and to meet legal obligations (invoices and tax).' },
      { h: 'Your rights (GDPR and Saudi PDPL)', p: 'You can access, correct and delete your data, restrict or object to processing, receive it in a portable format and withdraw consent at any time. We reply within 30 days. You may also complain to your data protection authority or, in Saudi Arabia, to SDAIA.' },
      { h: 'Browser storage and analytics', p: 'We use browser storage only on your device, to keep your plan, your settings (country, units) and your sign-in token. If analytics is enabled it is anonymised, and for visitors in Europe it only runs after they agree.' },
      { h: 'Retention', p: 'Sign-in links expire after 30 days. Saved plans are kept until you delete them or your account. Orders and invoices are kept as long as the law requires (up to 10 years for tax records).' },
    ],
  },
  de: {
    updated: 'Stand: Oktober 2026',
    nav: { terms: 'AGB', refunds: 'Erstattungen' },
    consent: { text: 'Wir nutzen anonyme Statistik zur Verbesserung der Website, nur mit Ihrer Zustimmung.', accept: 'Zustimmen', decline: 'Ablehnen', more: 'Datenschutz' },
    terms: {
      title: 'Allgemeine Geschäftsbedingungen', meta: 'Bedingungen für Oxira Design: Studio, Grundriss-Planer, Konten, Aufträge, Zahlung und Lieferung.',
      sections: [
        { h: 'Wer wir sind', p: 'Oxira Design ist ein Dienst von Oxira Digital Transformation and IT, Saudi-Arabien. Mit der Nutzung der Website oder einer Bestellung stimmen Sie diesen Bedingungen zu.' },
        { h: 'Leistungen', p: 'Studio und Grundriss-Planer sind kostenlos und laufen in Ihrem Browser. Automatische Grundrisse, Mengen und KI-Renderings sind Schätzungen zur Veranschaulichung, keine Ausführungspläne und kein Ersatz für zugelassene Planer, Baugenehmigungen oder örtliche Vorschriften. Teamleistungen werden gemäß Paketbeschreibung oder Angebot erbracht.' },
        { h: 'Ihr Konto', p: 'Sie melden sich über einen Link per E-Mail an. Schützen Sie Ihr E-Mail-Konto und geben Sie Anmeldelinks nicht weiter. Wer den Teilen-Link eines Grundrisses hat, sieht eine Kopie; Sie können Grundrisse jederzeit löschen.' },
        { h: 'Ihre Dateien', p: 'Hochgeladene Pläne und Bilder bleiben Ihr Eigentum. Sie gewähren uns ein beschränktes Nutzungsrecht nur zur Auftragsausführung und bestätigen, dass Sie zum Hochladen berechtigt sind.' },
        { h: 'Rechte an Lieferungen', p: 'Nach vollständiger Zahlung dürfen Sie gelieferte Entwürfe und Dateien für Ihr Projekt uneingeschränkt nutzen. Ausgewählte Bilder dürfen wir ohne persönliche Daten oder Adresse im Portfolio zeigen, sofern Sie nicht schriftlich widersprechen.' },
        { h: 'Preise und Zahlung', p: 'Preise in Saudi-Riyal zzgl. 15 % MwSt., sofern nicht anders angegeben. Beträge in anderen Währungen sind Richtwerte; maßgeblich ist die Rechnung. Das Express-Paket wird vorab bezahlt, andere Leistungen gemäß Angebot (meist Anzahlung und Rest bei Lieferung).' },
        { h: 'Lieferung und Änderungen', p: 'Lieferzeit und Korrekturrunden richten sich nach Paket oder Angebot und beginnen nach Zahlungseingang und Erhalt aller Unterlagen. Wesentliche Änderungen außerhalb des Umfangs werden gesondert berechnet.' },
        { h: 'Designer', p: 'Ihr Auftrag kann von einem Designer aus dem Oxira-Netzwerk bearbeitet werden. Wir bleiben Ihr Vertragspartner. Designer behandeln Ihre Dateien vertraulich.' },
        { h: 'Zulässige Nutzung', p: 'Keine rechtswidrigen oder anstößigen Inhalte, keine Angriffe oder Überlastung der Website, keine automatisierte Umgehung von Gratis-Limits.' },
        { h: 'Haftung', p: 'Wir arbeiten mit fachlicher Sorgfalt, haften aber nicht für Bau- oder Kaufentscheidungen auf Grundlage von Schätzungen ohne Prüfung durch zugelassene Fachleute. Die Haftung ist auf den für den Auftrag gezahlten Betrag begrenzt, soweit gesetzlich zulässig.' },
        { h: 'Recht und Kontakt', p: 'Es gilt das Recht Saudi-Arabiens; zwingende Verbraucherrechte Ihres Landes bleiben unberührt. Änderungen werden hier mit Datum angezeigt. Kontakt: info@oxira.sa.' },
      ],
    },
    refunds: {
      title: 'Erstattungsrichtlinie', meta: 'Wann Oxira Design erstattet und wie Sie eine Erstattung beantragen.',
      sections: [
        { h: 'Vor Arbeitsbeginn', p: 'Bei Stornierung vor Arbeitsbeginn erstatten wir den vollen Betrag.' },
        { h: 'Nach Arbeitsbeginn', p: 'Nach Arbeitsbeginn erstatten wir den Betrag abzüglich des Werts der bereits erbrachten Leistungen gemäß den Phasen von Paket oder Angebot.' },
        { h: 'Wenn die Lieferung nicht passt', p: 'Entspricht die Lieferung nicht der Beschreibung, bessern wir zunächst in den Korrekturrunden nach. Ist das nicht möglich, erstatten wir ganz oder anteilig.' },
        { h: 'KI-Design-Guthaben', p: 'Verbrauchtes Guthaben für „Raum neu gestalten“ wird nicht erstattet; ungenutztes Guthaben innerhalb von 14 Tagen nach Kauf. Technisch fehlgeschlagene Entwürfe werden nicht abgezogen.' },
        { h: 'Widerrufsrecht (EU und UK)', p: 'Sie können innerhalb von 14 Tagen widerrufen. Haben Sie ausdrücklich verlangt, dass wir vorher beginnen, zahlen Sie die bis zum Widerruf erbrachte Leistung; das Recht erlischt mit vollständiger Erbringung.' },
        { h: 'So beantragen Sie es', p: 'Schreiben Sie an info@oxira.sa oder in den Nachrichten des Auftrags in Ihrem Konto, mit Auftragsnummer und Grund. Antwort innerhalb von zwei Werktagen, Erstattung über das ursprüngliche Zahlungsmittel innerhalb von 14 Tagen.' },
      ],
    },
    privacyMore: [
      { h: 'Verantwortlicher', p: 'Oxira Digital Transformation and IT, Saudi-Arabien. Kontakt zu Datenschutzfragen: info@oxira.sa.' },
      { h: 'Konto und gespeicherte Grundrisse', p: 'Wir speichern Ihre E-Mail, Anmelde-Token, gespeicherte Grundrisse, Nachrichten mit dem Designer und Ihre Bewertung. Grundrisse können Sie selbst löschen, das ganze Konto auf Anfrage.' },
      { h: 'KI-Funktionen', p: 'Bei „Haus beschreiben“ oder „Grundrissbild umwandeln“ werden Text bzw. Bild nur zur Verarbeitung an unseren KI-Anbieter (Anthropic) gesendet und laut dessen Bedingungen nicht zum Training verwendet.' },
      { h: 'Rechtsgrundlagen', p: 'Vertragserfüllung (Aufträge, Konto), Einwilligung (Statistik, ggf. Marketing), berechtigtes Interesse (Schutz der Website, Missbrauchsabwehr) und rechtliche Pflichten (Rechnungen, Steuern) – Art. 6 Abs. 1 lit. b, a, f und c DSGVO.' },
      { h: 'Ihre Rechte (DSGVO)', p: 'Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch, Datenübertragbarkeit und Widerruf der Einwilligung jederzeit. Antwort innerhalb von 30 Tagen. Beschwerderecht bei Ihrer Datenschutzaufsichtsbehörde.' },
      { h: 'Browser-Speicher und Statistik', p: 'Browser-Speicher nutzen wir nur lokal für Ihren Grundriss, Ihre Einstellungen und Ihr Anmelde-Token. Statistik ist anonymisiert und läuft für Besucher in Europa nur nach Zustimmung.' },
      { h: 'Speicherdauer', p: 'Anmeldelinks verfallen nach 30 Tagen. Grundrisse bis zur Löschung durch Sie. Aufträge und Rechnungen gemäß gesetzlichen Fristen (bis zu 10 Jahre).' },
    ],
  },
  fr: {
    updated: 'Mise à jour : octobre 2026',
    nav: { terms: 'Conditions d’utilisation', refunds: 'Remboursements' },
    consent: { text: 'Nous utilisons des statistiques anonymes pour améliorer le site, uniquement avec votre accord.', accept: 'Accepter', decline: 'Refuser', more: 'Confidentialité' },
    terms: {
      title: 'Conditions d’utilisation', meta: 'Conditions d’utilisation d’Oxira Design : studio, conception de plans, comptes, commandes, paiement et livraison.',
      sections: [
        { h: 'Qui sommes-nous', p: 'Oxira Design est un service d’Oxira Digital Transformation and IT, Arabie saoudite. En utilisant le site ou en commandant, vous acceptez ces conditions.' },
        { h: 'Services', p: 'Le studio et l’outil de plans sont gratuits et fonctionnent dans votre navigateur. Plans automatiques, quantités et rendus IA sont des estimations illustratives : ni plans d’exécution, ni substitut à un professionnel agréé, aux permis ou aux règles locales. Les services de l’équipe sont fournis selon la description du forfait ou le devis.' },
        { h: 'Votre compte', p: 'Vous vous connectez via un lien envoyé par e-mail. Protégez votre messagerie et ne partagez pas ces liens. Toute personne ayant le lien de partage d’un plan voit une copie ; vous pouvez supprimer un plan à tout moment.' },
        { h: 'Vos fichiers', p: 'Vous restez propriétaire des plans et images envoyés. Vous nous accordez une licence limitée à l’exécution de votre commande et confirmez avoir le droit de les envoyer.' },
        { h: 'Propriété des livrables', p: 'Après paiement intégral, vous pouvez utiliser librement les livrables pour votre projet. Nous pouvons montrer quelques images dans notre portfolio sans données personnelles ni adresse, sauf refus écrit de votre part.' },
        { h: 'Prix et paiement', p: 'Prix en riyals saoudiens hors TVA 15 % sauf mention contraire. Les montants en autres devises sont indicatifs ; seul compte le montant facturé. Le forfait Express se paie d’avance ; les autres services selon devis (acompte puis solde à la livraison).' },
        { h: 'Livraison et retouches', p: 'Délais et tours de retouches selon le forfait ou le devis, à compter du paiement et de la réception de tous les fichiers. Les changements importants hors périmètre sont facturés à part.' },
        { h: 'Designers', p: 'Votre commande peut être réalisée par un designer du réseau Oxira. Nous restons responsables envers vous. Les designers gardent vos fichiers confidentiels.' },
        { h: 'Usage acceptable', p: 'Pas de contenu illicite ou offensant, pas d’attaque ni de surcharge du site, pas de contournement automatisé des limites gratuites.' },
        { h: 'Responsabilité', p: 'Nous travaillons avec soin, mais ne sommes pas responsables des décisions de construction ou d’achat prises sur la base d’estimations sans avis d’un professionnel agréé. Notre responsabilité est limitée au montant payé pour la commande, dans la mesure permise par la loi.' },
        { h: 'Droit applicable et contact', p: 'Droit saoudien, sans préjudice des droits impératifs des consommateurs de votre pays. Les mises à jour sont datées ici. Contact : info@oxira.sa.' },
      ],
    },
    refunds: {
      title: 'Politique de remboursement', meta: 'Quand Oxira Design rembourse et comment le demander.',
      sections: [
        { h: 'Avant le début du travail', p: 'Annulation avant le début du travail : remboursement intégral.' },
        { h: 'Après le début du travail', p: 'Remboursement du montant moins la valeur du travail déjà réalisé, selon les étapes du forfait ou du devis.' },
        { h: 'Livraison non conforme', p: 'Nous corrigeons d’abord dans les tours de retouches. Si ce n’est pas possible, remboursement total ou partiel selon le problème.' },
        { h: 'Crédits de design IA', p: 'Les crédits « Relooker ma pièce » utilisés ne sont pas remboursables ; les crédits inutilisés le sont dans les 14 jours suivant l’achat. Un échec technique n’est pas décompté.' },
        { h: 'Droit de rétractation (UE et Royaume-Uni)', p: 'Vous disposez de 14 jours pour vous rétracter. Si vous avez demandé un début d’exécution pendant ce délai, vous payez le travail effectué ; le droit prend fin une fois le service entièrement exécuté.' },
        { h: 'Comment demander', p: 'Écrivez à info@oxira.sa ou dans les messages de la commande dans votre compte, avec le numéro de commande et le motif. Réponse sous deux jours ouvrés ; remboursement sur le moyen de paiement initial sous 14 jours.' },
      ],
    },
    privacyMore: [
      { h: 'Responsable du traitement', p: 'Oxira Digital Transformation and IT, Arabie saoudite. Contact : info@oxira.sa.' },
      { h: 'Compte et plans enregistrés', p: 'Nous conservons votre e-mail, vos jetons de connexion, vos plans, vos messages avec le designer et votre note. Vous pouvez supprimer un plan vous-même ou demander la suppression du compte.' },
      { h: 'Fonctions IA', p: 'Avec « Décrivez votre maison » ou « Convertir une image de plan », le texte ou l’image est envoyé à notre fournisseur d’IA (Anthropic) uniquement pour traitement, sans entraînement des modèles selon ses conditions.' },
      { h: 'Bases légales', p: 'Exécution du contrat (commandes, compte), consentement (statistiques, éventuel marketing), intérêt légitime (sécurité du site, prévention des abus) et obligations légales (factures, fiscalité) – art. 6.1 b, a, f et c du RGPD.' },
      { h: 'Vos droits (RGPD)', p: 'Accès, rectification, effacement, limitation, opposition, portabilité et retrait du consentement à tout moment. Réponse sous 30 jours. Vous pouvez saisir votre autorité de protection des données (en France, la CNIL).' },
      { h: 'Stockage navigateur et statistiques', p: 'Le stockage du navigateur sert uniquement, sur votre appareil, à garder votre plan, vos réglages et votre jeton de connexion. Les statistiques sont anonymisées et, pour les visiteurs européens, ne s’activent qu’après accord.' },
      { h: 'Durées de conservation', p: 'Les liens de connexion expirent après 30 jours. Les plans jusqu’à leur suppression. Commandes et factures selon les délais légaux (jusqu’à 10 ans).' },
    ],
  },
  ru: {
    updated: 'Обновлено: октябрь 2026',
    nav: { terms: 'Условия использования', refunds: 'Возврат средств' },
    consent: { text: 'Мы используем анонимную статистику для улучшения сайта, только с вашего согласия.', accept: 'Согласен', decline: 'Нет, спасибо', more: 'Конфиденциальность' },
    terms: {
      title: 'Условия использования', meta: 'Условия Oxira Design: студия, проектирование планировок, кабинеты, заказы, оплата и сдача работ.',
      sections: [
        { h: 'Кто мы', p: 'Oxira Design — сервис компании Oxira Digital Transformation and IT, Саудовская Аравия. Пользуясь сайтом или заказывая услуги, вы принимаете эти условия.' },
        { h: 'Услуги', p: 'Студия и конструктор планировок бесплатны и работают в браузере. Автоматические планировки, объёмы и ИИ-визуализации — ориентировочные и не являются рабочей документацией, не заменяют лицензированного специалиста, разрешений и местных норм. Услуги команды оказываются по описанию пакета или коммерческому предложению.' },
        { h: 'Кабинет', p: 'Вход — по ссылке на e-mail. Берегите доступ к почте и не пересылайте ссылки для входа. Любой, у кого есть ссылка на планировку, видит её копию; удалить планировку можно в любой момент.' },
        { h: 'Ваши файлы', p: 'Загруженные планы и изображения остаются вашими. Вы даёте нам ограниченное право использовать их только для выполнения заказа и подтверждаете право их загружать.' },
        { h: 'Права на результат', p: 'После полной оплаты вы свободно используете переданные материалы в своём проекте. Мы можем показывать отдельные изображения в портфолио без ваших данных и адреса, если вы письменно не возражаете.' },
        { h: 'Цены и оплата', p: 'Цены в саудовских риалах без НДС 15 %, если не указано иное. Суммы в других валютах ориентировочные; к оплате — сумма в счёте. Пакет «Быстрый» оплачивается заранее, остальные услуги — по предложению (обычно аванс и остаток при сдаче).' },
        { h: 'Сроки и правки', p: 'Сроки и число раундов правок — по пакету или предложению, отсчёт с момента оплаты и получения всех файлов. Существенные изменения вне объёма оплачиваются отдельно.' },
        { h: 'Дизайнеры', p: 'Заказ может выполнять дизайнер из сети Oxira. Ответственность перед вами остаётся за нами. Дизайнеры соблюдают конфиденциальность ваших файлов.' },
        { h: 'Допустимое использование', p: 'Запрещено загружать незаконный или оскорбительный контент, взламывать или перегружать сайт, автоматически обходить бесплатные лимиты.' },
        { h: 'Ответственность', p: 'Мы работаем добросовестно, но не отвечаем за решения о строительстве или покупке, принятые на основе ориентировочных данных без проверки лицензированным специалистом. Ответственность ограничена суммой, оплаченной за заказ, в пределах закона.' },
        { h: 'Право и контакты', p: 'Применяется право Саудовской Аравии без ущерба для обязательных прав потребителей вашей страны. Изменения публикуются здесь с датой. Контакт: info@oxira.sa.' },
      ],
    },
    refunds: {
      title: 'Политика возврата', meta: 'Когда Oxira Design возвращает деньги и как это запросить.',
      sections: [
        { h: 'До начала работы', p: 'При отмене до начала работы возвращаем всю сумму.' },
        { h: 'После начала работы', p: 'Возвращаем сумму за вычетом стоимости уже выполненной работы по этапам пакета или предложения.' },
        { h: 'Если результат не соответствует', p: 'Сначала исправляем в рамках раундов правок. Если исправить нельзя — возвращаем всю сумму или её часть соразмерно проблеме.' },
        { h: 'Кредиты ИИ-дизайна', p: 'Использованные кредиты «Редизайн комнаты» не возвращаются; неиспользованные — в течение 14 дней после покупки. Технически неудачные генерации не списываются.' },
        { h: 'Клиенты из ЕС и Великобритании', p: 'Вы можете отказаться в течение 14 дней. Если вы попросили начать работу раньше, оплачивается выполненное до отказа; право прекращается после полного оказания услуги.' },
        { h: 'Как запросить', p: 'Напишите на info@oxira.sa или в сообщениях заказа в кабинете, указав номер заказа и причину. Ответим за два рабочих дня, возврат — тем же способом оплаты в течение 14 дней после одобрения.' },
      ],
    },
    privacyMore: [
      { h: 'Оператор данных', p: 'Oxira Digital Transformation and IT, Саудовская Аравия. По вопросам данных: info@oxira.sa.' },
      { h: 'Кабинет и сохранённые планировки', p: 'Мы храним ваш e-mail, токены входа, планировки, переписку с дизайнером и оценку. Планировку можно удалить самостоятельно, кабинет — по запросу.' },
      { h: 'Функции ИИ', p: 'При использовании «Опишите дом» или «Преобразовать изображение плана» текст или изображение передаются нашему поставщику ИИ (Anthropic) только для обработки и, согласно его условиям, не используются для обучения.' },
      { h: 'Правовые основания', p: 'Исполнение договора (заказы, кабинет), согласие (статистика, возможный маркетинг), законный интерес (защита сайта) и требования закона (счета, налоги).' },
      { h: 'Ваши права (GDPR, PDPL)', p: 'Доступ, исправление, удаление, ограничение и возражение против обработки, переносимость и отзыв согласия в любой момент. Ответ в течение 30 дней. Вы можете обратиться в надзорный орган по защите данных вашей страны.' },
      { h: 'Хранилище браузера и статистика', p: 'Хранилище браузера используется только на вашем устройстве — для планировки, настроек и токена входа. Статистика анонимна и для посетителей из Европы включается только с согласия.' },
      { h: 'Сроки хранения', p: 'Ссылки для входа действуют 30 дней. Планировки — до удаления. Заказы и счета — в сроки, установленные законом (до 10 лет).' },
    ],
  },
};
