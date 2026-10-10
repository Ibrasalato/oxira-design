// Turkish copy for the SEO landing pages (translated from guides-en.ts). Prices come from PRICES / REDESIGN_PACKS.
import { PRICES } from '../content';
import { REDESIGN_PACKS } from '../redesign';
import type { GuideCopy, GuideSlug, GuideUi } from '../guides';

const n = (x: number) => x.toLocaleString('tr-TR');
const [p10, p30, p100] = REDESIGN_PACKS;
const quick = `${n(PRICES.quick)} SAR`;
const perM2 = `m² başına ${n(PRICES.designPerM2)} SAR`;
const designMin = `${n(PRICES.designMin)} SAR`;

export const guides: Record<GuideSlug, GuideCopy> = {
  'autocad-to-3d': {
    title: 'AutoCAD Planı 3D’ye Çevirme Online (DWG/DXF) | Oxira',
    description: 'AutoCAD planınızı tarayıcıda saniyeler içinde 3D modele çevirin: duvarlar, kapılar, pencereler, oda alanları, mobilya ve gezinti. DWG ve PDF ekibimizle.',
    nav: 'AutoCAD planı 3D’ye',
    card: 'DXF yükleyin, planınızı alanları ve mobilyasıyla saniyeler içinde 3D görün.',
    kicker: '2D plandan 3D’ye',
    h1: 'AutoCAD planını doğrudan tarayıcınızda 3D’ye çevirin',
    lead: 'AutoCAD’den kaydettiğiniz DXF dosyasını yükleyin; Oxira stüdyosu duvarlar, kapılar, pencereler ve her odanın alanıyla birlikte 3D modeli saniyeler içinde oluştursun. Üyelik yok, kurulum yok.',
    facts: [['DXF', 'doğrudan okunur'], ['DWG · PDF', 'ekibimiz aracılığıyla'], ['Ücretsiz', 'model ve alanlar']],
    sections: [
      {
        h: '2D çizim nasıl 3D modele dönüşür?',
        p: [
          'Bir AutoCAD planı aslında katmanlara dağılmış çizgiler, yaylar ve yazılardan oluşur. Stüdyo bu katmanları okur ve her birinin görevini adından çıkarır: duvarlar, kapılar, pencereler ve ölçülendirme, tarama, çizilmiş mobilya ya da aks çizgileri gibi yok sayılacak öğeler.',
          'Ardından duvarları belirlediğiniz tavan yüksekliğine kadar yükseltir, kapı ve pencere boşluklarını yerlerine açar, kapalı odaları tespit edip her birinin alanını ölçer ve çizimdeki “yatak odası”, “mutfak” ya da “meclis” (Körfez evlerindeki misafir oturma odası) gibi oda adlarını okuyarak her odayı türüne göre döşer.',
          'Bunların hepsi tarayıcınızın içinde gerçekleşir. Stüdyoyu kullanırken dosyanız sunucularımıza yüklenmez; kendi evinizin planıyla gönül rahatlığıyla deneyebilirsiniz.',
        ],
      },
      {
        h: 'Adım adım',
        steps: [
          { t: 'Planı DXF olarak kaydedin', d: 'Çizimi AutoCAD’de açın ve DXF (2013 veya daha yeni) olarak kaydedin. Dosyada birden fazla plan ya da pafta varsa, ihtiyacınız olan kat planını önce ayrı bir dosyaya kopyalayın.' },
          { t: 'Stüdyoya yükleyin', d: 'Dosyayı stüdyo sayfasına sürükleyin veya cihazınızdan seçin; en fazla 40 MB. Hazır örnek planlardan biriyle de başlayabilirsiniz.' },
          { t: 'Katmanları ve birimleri kontrol edin', d: 'Stüdyo tanıdığı katmanları ve görevlerini listeler. Duvarlar eksikse doğru katmanı “Duvarlar” olarak atayıp modeli yeniden oluşturun. Çizim birimini (mm, cm, m veya inç) ve tavan yüksekliğini kontrol edin.' },
          { t: 'İnceleyin ve içinde gezinin', d: '3D görünüm, üstten plan ve yürüme modu arasında geçiş yapın, yerleşimi yukarıdan görmek için duvarları kesin ve mobilyayı değiştirmek için bir stil seçin.' },
          { t: 'Dışa aktarın veya ekibe devredin', d: 'PNG ya da metre biriminde GLB veya OBJ model indirin; dilerseniz ekibimizden fotogerçekçi render ve hazır 3ds Max dosyası isteyin.' },
        ],
      },
      {
        h: 'AutoCAD’den DXF nasıl dışa aktarılır?',
        ul: [
          'Dosya › Farklı Kaydet’i seçin, ardından “Dosya türü” altında AutoCAD 2013 DXF veya daha yeni bir sürümü seçin.',
          'Ya da komut satırına DXFOUT yazıp konumu ve sürümü seçin.',
          'Kaydetmeden önce ölçülendirme, antet ve çerçeve gibi gerekmeyen katmanları silin veya dondurun. Okuma hızlanır, hatalar azalır.',
          'Her odanın adını odanın içine yazı olarak (TEXT veya MTEXT) Türkçe, İngilizce ya da Arapça yazın; stüdyo böylece oda türünü tanıyabilir.',
          'Revit, ArchiCAD veya BricsCAD mi kullanıyorsunuz? Kat planını Dışa Aktar menüsünden DXF olarak çıkarın.',
        ],
      },
      {
        h: 'DWG ve PDF dosyaları ne olacak?',
        p: [
          'DWG, AutoCAD’in kendi formatıdır ve tarayıcılar onu doğrudan okuyamaz. En hızlı çözüm, yukarıda anlatıldığı gibi DXF olarak kaydetmektir; bir dakikadan kısa sürer.',
          `AutoCAD’iniz yoksa veya planınız yalnızca PDF olarak elinizdeyse, Hızlı paket siparişiyle (KDV hariç ${quick}) gönderin; ekibimiz çizimi temizler, dönüştürür ve modeli düzeltir.`,
        ],
      },
      {
        h: 'Neler elde edersiniz?',
        ul: [
          'Duvarları gerçek yükseklikte, kapı ve pencereleri çiziminizdeki ölçülerde olan bir 3D model.',
          'Her odanın alanı ve toplam alan.',
          'Zemin kaplaması, boya, tavan, süpürgelik ile banyo ve mutfak duvar seramiği için tahmini metraj; CSV olarak indirilebilir.',
          'Her oda türü için beş stilde ilk taslak mobilya: modern, klasik, çağdaş Necd, İskandinav ve lüks.',
          'Oda oda sanal gezinti.',
          '3ds Max, Blender ve SketchUp’ta açılan PNG, GLB ve OBJ dışa aktarımı.',
        ],
      },
      {
        h: 'Daha temiz bir sonuç için ipuçları',
        ul: [
          'Duvar çizgilerinin köşelerde birleştiğinden emin olun: kapanmayan bir odanın alanı ölçülemez.',
          'Katmanlara Duvarlar, Kapılar ve Pencereler gibi açık adlar verin.',
          'Kapı ve pencereleri blok olarak çizin; stüdyo her boşluğu bunlarla sınıflandırır.',
          'Her dosyada tek kat planı: her kat ayrı bir DXF’te olsun.',
          'Model yanlış boyutta görünüyorsa katmanlar panelinden çizim birimini elle değiştirip yeniden oluşturun.',
        ],
      },
    ],
    faq: [
      { q: 'Planı 3D’ye çevirmek ücretsiz mi?', a: 'Evet. Model, alanlar, tahmini metraj, mobilya, gezinti ve dışa aktarımların tamamı stüdyoda üyelik olmadan ücretsizdir. Yalnızca fotogerçekçi render ve 3ds Max dosyası gibi ekip işleri için ödeme yaparsınız.' },
      { q: 'Hangi DXF sürümünü kullanmalıyım?', a: 'En iyi sonucu 2013 veya daha yeni sürümler verir. Okuma başarısız olursa DXF 2013 olarak yeniden kaydedip tekrar deneyin.' },
      { q: 'Stüdyo Arapça katman ve oda adlarını anlıyor mu?', a: 'Evet. Duvar, kapı ve pencere için Arapça ve İngilizce katman adlarını; yatak odası, mutfak, banyo, oturma odası ve meclis gibi oda adlarını her iki dilde tanır.' },
      { q: 'Planım birden fazla kattan oluşuyor. Nasıl yüklerim?', a: 'Her katı ayrı bir DXF olarak yükleyin. Tüm katlar tek çizimdeyse kaydetmeden önce her planı yeni bir dosyaya kopyalayın.' },
      { q: 'PDF veya görseli 3D’ye çevirebilir miyim?', a: 'Stüdyonun kendisinde hayır, çünkü gerçek CAD geometrisine ihtiyaç duyar. PDF’i Hızlı paket siparişiyle gönderin, ekibimiz dönüştürsün.' },
      { q: 'Model 3ds Max’te açılıyor mu?', a: 'Evet. GLB ve OBJ dışa aktarımları metre birimindedir ve 3ds Max’in güncel sürümlerinde açılır. Ekip paketlerinde katman ve malzemeleri düzenlenmiş bir .max dosyası da teslim edilir.' },
    ],
    ctaTitle: 'Kendi planınızla deneyin',
    ctaText: 'Stüdyoyu açıp bir DXF yükleyin ya da örnek bir planla başlayın; sonucu saniyeler içinde görün.',
  },

  'apartment-3d-design': {
    title: 'Daire 3D Tasarımı: Planınızdan Online | Oxira',
    description: 'Dairenizi AutoCAD planından online 3D tasarlayın: otomatik mobilya, beş stil, oda alanları ve gezinti; ardından fotogerçekçi render ya da tam tasarım isteyin.',
    nav: 'Daire 3D tasarımı',
    card: 'Dairenizi ince işler ve mobilya alışverişinden önce döşenmiş halde 3D görün.',
    kicker: 'Daireler için',
    h1: 'Online daire 3D tasarımı: yapmadan önce görün',
    lead: 'Daire planınızı yükleyin, mobilyası ve oda alanlarıyla saniyeler içinde 3D görün. İnce işlere başlamadan veya tek bir mobilya almadan önce stili ve yerleşimi netleştirin.',
    facts: [['Saniyeler', 'plandan 3D’ye'], ['5', 'iç mekan stili'], [`${n(PRICES.designPerM2)} SAR`, 'm² başına, tam tasarım']],
    sections: [
      {
        h: 'Daireyi neden önce 3D tasarlamalı?',
        p: [
          'Bir dairede her santimetre önemlidir: kanepenin televizyonun karşısında nerede duracağı, yatak odası kapısının hangi yöne açılacağı, yatakla gardırop arasındaki mesafe, mutfakta hareket alanı. Bunların hiçbiri kağıt planda belli olmaz, ama daireyi 3D olarak gezdiğinizde hemen anlaşılır.',
          'Model, aileniz, iç mimarınız ve ustanızla konuşmayı da kolaylaştırır. Bir fikri tarif etmek yerine bir görünüm ya da dosya gönderirsiniz ve herkes aynı şeyi görür.',
        ],
      },
      {
        h: 'Dairenizi online nasıl tasarlarsınız?',
        steps: [
          { t: 'Daire planını edinin', d: 'AutoCAD dosyasını müteahhitten, proje ofisinden veya önceki sahibinden isteyin. Dosya DWG ise AutoCAD’de DXF olarak kaydedin ya da sizden DXF kopyası isteyin.' },
          { t: 'Stüdyoya yükleyin', d: 'Stüdyo saniyeler içinde duvarları, kapıları ve pencereleri oluşturur; salonu, yatak odalarını, mutfağı, banyoları ve balkonu ölçer.' },
          { t: 'Bir stil seçin', d: 'Modern, klasik, çağdaş Necd, İskandinav ve lüks arasında geçiş yapın; ilk taslak mobilya oda türüne göre yerleştirilir.' },
          { t: 'Gezin ve karar verin', d: 'Yürüme moduyla daireyi göz hizasında dolaşın, tüm yerleşimi yukarıdan görmek için duvarları kesin.' },
          { t: 'Gerekirse ekibe devredin', d: 'Fotogerçekçi render ya da malzeme, renk ve aydınlatmayla tam iç mimari tasarım sipariş edin. Stüdyodaki tasarımınız siparişe otomatik eklenir.' },
        ],
      },
      {
        h: 'Daire modelinizde neler görürsünüz?',
        ul: [
          'Kanepe ve orta sehpalı salon, yatak ve gardıroplu yatak odaları.',
          'Temel donanımlarıyla mutfak ve banyolar, ayrıca balkon veya teras.',
          'Her odanın m² cinsinden alanı ve dairenin toplam alanı.',
          'Tahmini zemin, boya, seramik, tavan ve süpürgelik metrajı; ince işler tekliflerini karşılaştırırken işe yarar.',
          'Paylaşmak için PNG görünümler, başka bir programda devam edecekler için GLB veya OBJ model.',
        ],
      },
      {
        h: 'Ücretsiz modelden tam iç mimari tasarıma',
        p: ['Model ve ilk taslak mobilya stüdyoda ücretsizdir; yerleşimi anlamak ve bir yön seçmek için yeterlidir. Gerçekçi görseller veya uygulama dosyaları gerektiğinde iki ekip paketi var:'],
        ul: [
          `Hızlı (KDV hariç ${quick}): plan temizliği ve model düzeltme, 8 yüksek çözünürlüklü render, 3ds Max ve GLB dosyaları ve PDF metraj tablosu; 48 iş saati içinde.`,
          `İç mimari tasarım (${perM2}, en az ${designMin}, KDV hariç): bir tasarımcı her odada sizinle çalışır; 15 V-Ray render, paylaşılabilir 360° tur ve iki revizyon turu. Örnek: 120 m²’lik bir daire KDV hariç ${n(120 * PRICES.designPerM2)} SAR tutar; büyüklüğe göre 5 ila 10 iş gününde teslim edilir.`,
        ],
      },
      {
        h: 'Pratik daire tasarımı ipuçları',
        ul: [
          'Mobilyalar arasında rahat geçiş alanları bırakın; alanı yalnızca plana bakarak değil, modelde gezerek değerlendirin.',
          'Kapı açılış yönlerini, özellikle gardıroplara yakın yatak odası ve banyo kapılarını kontrol edin.',
          'Küçük dairelerde açık renkler ve alçak mobilyalar odaları daha geniş gösterir; İskandinav ve modern stilleri karşılaştırın.',
          'Televizyon, yatak ve çalışma masası konumlarını ince işlerden önce netleştirin; priz ve aydınlatma yerlerini bunlar belirler.',
          'Her stilden aynı açıdan bir görünüm alın ve karar vermeden önce ailenizle karşılaştırın.',
        ],
      },
    ],
    faq: [
      { q: 'Dairemin AutoCAD dosyası yok. Ne yapabilirim?', a: 'Müteahhitten veya binayı tasarlayan proje ofisinden isteyin. Elinizde yalnızca PDF varsa Hızlı paket siparişiyle gönderin, ekibimiz modele dönüştürsün.' },
      { q: 'Modeldeki mobilyalar gerçek ölçülerde mi?', a: 'Otomatik döşeme, yerleşimi ve alanı anlamanız için oda türüne göre standart ölçülü parçalarla yapılan bir ilk taslaktır. Kesin ölçülü belirli parçaların seçimi iç mimari tasarım paketinde bir tasarımcıyla yapılır.' },
      { q: 'Tam daire tasarımı ne kadar tutar?', a: `Stüdyo modeli ücretsizdir. Tam iç mimari tasarım ${perM2}, en az ${designMin} (%15 KDV hariç); Hızlı paket ise ${quick}.` },
      { q: 'Mısır ve Körfez’deki daireler için de çalışıyor musunuz?', a: 'Evet. Hizmet tamamen online ve her ülkeden plan kabul ediyoruz. Yerel farklar için Mısır ve Körfez sayfalarına bakın.' },
      { q: 'Tasarımı ustamla paylaşabilir miyim?', a: 'Evet. PNG görünümleri ve CSV metraj tablosunu indirin ya da GLB veya OBJ olarak dışa aktarın. Ekip paketleri .max dosyası ve yüksek çözünürlüklü render ekler.' },
    ],
    ctaTitle: 'Dairenizi bugün 3D görün',
    ctaText: 'Daire planını ücretsiz stüdyoya yükleyin ve ince işler başlamadan stilinizi seçin.',
  },

  'villa-3d-design': {
    title: 'Villa 3D Tasarımı: AutoCAD Planından | Oxira Design',
    description: 'AutoCAD planından villa 3D tasarımı: her kat alanları, mobilyası ve meclisiyle ayrı 3D model; ardından fotogerçekçi render, cephe ve tam iç mimari tasarım.',
    nav: 'Villa 3D tasarımı',
    card: 'Meclis, aile yaşam alanı ve servis odalarıyla villanızın her katı 3D.',
    kicker: 'Villa ve müstakil evler için',
    h1: 'AutoCAD planlarınızdan villa 3D tasarımı',
    lead: 'Villa, çok sayıda mekanı olan büyük bir karardır: meclis (misafir oturma odası), yemek odası, aile yaşam alanı, yatak odaları ve ek bina. Her katın planını yükleyin; ince işler başlamadan mobilyası ve alanlarıyla 3D görün.',
    facts: [['Her kat', 'ayrı model'], ['Meclis', 'Arap tarzı oturma'], ['İç + dış', 'Komple paket']],
    sections: [
      {
        h: 'Villa neden 3D tasarım gerektirir?',
        p: [
          'Bir villada misafir, aile ve servis alanları iç içe geçer ve yerleşim hataları ince işlerden sonra zor düzeltilir: aile salonunu gören bir erkek meclisi, yemek odasından uzak bir mutfak, birinci katı bölen bir merdiven. 3D model bu ilişkileri para harcanmadan önce ortaya koyar.',
          'Villada ince işler ve mobilya bütçeleri büyük olduğundan, her katı döşenmiş ve ölçülmüş olarak görmek bütçeyi katlar ve odalar arasında güvenle paylaştırmanıza yardımcı olur.',
        ],
      },
      {
        h: 'Neler otomatik, ekip neler yapar?',
        ul: [
          'Stüdyoda otomatik: her kat için duvarlar ve boşluklar, oda tespiti ve alanlar, çağdaş Necd stilinde yer minderli meclis dahil ilk taslak mobilya, tahmini metraj ve gezinti.',
          'Ekip tarafından: büyük planların ve DWG dosyalarının temizlenmesi, malzeme, renk ve aydınlatmayla zevkinize göre iç mimari tasarım, V-Ray veya Corona render ve düzenli bir 3ds Max dosyası.',
          'Komple pakette: iç ve dış tasarım, cephe ve peyzaj, müteahhit için uygulama çizimleri, animasyonlu gezinti videosu ve size özel proje yöneticisi.',
        ],
      },
      {
        h: 'Villa planları nasıl hazırlanır ve yüklenir?',
        steps: [
          { t: 'Katları ayırın', d: 'Her katı (zemin, birinci, ek bina veya çatı katı, varsa bodrum) ayrı bir DXF olarak kaydedin; stüdyo her seferinde bir kat planı oluşturur.' },
          { t: 'Odaları çizimde adlandırın', d: 'Stüdyonun tanıyıp döşeyebilmesi için her odanın içine meclis, salon, yemek odası, yatak odası, mutfak, şoför odası gibi adlar yazın.' },
          { t: 'Her kat için tavan yüksekliğini ayarlayın', d: 'Katmanlar panelinden her katın tavan yüksekliğini ayarlayın; zemin kat ile ek bina çoğu zaman farklıdır.' },
          { t: 'İnceleyin ve dışa aktarın', d: 'Her katı gezin, metraj tablosunu kat kat indirin; render veya tam tasarım istiyorsanız dosyaları siparişinizle gönderin.' },
        ],
      },
      {
        h: 'Villa tasarımı ne kadar tutar?',
        p: [
          `İç mimari tasarım alana göre fiyatlandırılır: KDV hariç ${perM2}, en az ${designMin}. Örneğin 400 m² iç alana sahip bir villa KDV hariç ${n(400 * PRICES.designPerM2)} SAR tutar; buna tüm odalar, 15 V-Ray render, 360° tur ve iki revizyon turu dahildir.`,
          'Cephe, peyzaj ve uygulama çizimlerini içeren Komple paket, planları inceledikten sonra projeye özel fiyatlandırılır; teklif bir iş günü içinde size ulaşır.',
        ],
      },
      {
        h: 'Villa tasarımı ipuçları',
        ul: [
          'Misafir ve aile sirkülasyonunu ayırın: her şeyden önce meclis girişini ve misafir lavabosunu netleştirin.',
          'Yemek odasını mutfağa veya hazırlık mutfağına yakın tutun; mesafeyi modelde yürüyerek kontrol edin.',
          'Her kattaki merdiven konumunu kontrol edin, yatak odalarına misafir alanlarından geçilerek ulaşılmadığından emin olun.',
          'Servis odalarına, çamaşır odasına ve depoya kullanışlı ölçüler verin; günlük konfora sandığınızdan çok etki ederler.',
          'Misafirlerin en çok gördüğü iki mekan olan salon ve meclis için en az iki stili karşılaştırın.',
        ],
      },
    ],
    faq: [
      { q: 'Villanın tamamını tek dosyada yükleyebilir miyim?', a: 'Stüdyo her seferinde bir kat planı oluşturur; bu yüzden her katı ayrı DXF olarak yükleyin. Tasarım paketlerinde ekibimiz katları tek bir modelde birleştirir.' },
      { q: 'Dış cephe tasarımı yapıyor musunuz?', a: 'Evet, Komple pakette peyzajla birlikte. Ücretsiz stüdyo iç mekan kat planlarına odaklanır.' },
      { q: 'Stüdyo Arap tarzı meclisi destekliyor mu?', a: 'Evet. Meclis adlı oda oturma alanı olarak ele alınır ve çağdaş Necd stilinde duvarlar boyunca yer minderleriyle döşenir.' },
      { q: 'Tam villa tasarımı ne kadar sürer?', a: 'İç mimari tasarım büyüklüğe göre 5 ila 10 iş günü sürer. Komple pakette süre, proje kapsamına göre teklifte belirlenir.' },
      { q: 'Müteahhidim için dosya alır mıyım?', a: 'Ekip paketleri düzenli bir .max dosyası ve yüksek çözünürlüklü render içerir; Komple paket ayrıca müteahhit için uygulama çizimlerini ekler.' },
    ],
    ctaTitle: 'Zemin katla başlayın',
    ctaText: 'İlk kat planını ücretsiz stüdyoya yükleyip 3D görün, ardından tam tasarım için ekibe başvurun.',
  },

  'interior-renders': {
    title: 'Fotogerçekçi İç Mekan Render ve 3ds Max | Oxira',
    description: 'AutoCAD planınızdan V-Ray veya Corona ile fotogerçekçi iç mekan render ve katman ve malzemeleri düzenli 3ds Max dosyası. Hızlı paket 48 saatte teslim.',
    nav: 'Fotogerçekçi render ve 3ds Max',
    card: 'Planınızdan fotogerçekçi V-Ray veya Corona görseller ve düzenli .max dosyası.',
    kicker: 'İç mekan 3D görselleştirme',
    h1: 'Fotogerçekçi iç mekan render ve hazır 3ds Max dosyası',
    lead: 'AutoCAD planından fotogerçekçi iç mekan görsellerine ve iç mimarınızın ya da ustanızın üzerine çalışabileceği düzenli bir 3ds Max dosyasına; net paketler ve açık fiyatlarla.',
    facts: [['V-Ray · Corona', 'render motorları'], ['.max · GLB', 'teslim edilen dosyalar'], ['48 saat', 'Hızlı paket']],
    sections: [
      {
        h: 'Yapay zeka render mı, ekipten fotogerçekçi render mı?',
        p: [
          'Stüdyoda modelin herhangi bir görünümünü yapay zekayla bir dakikadan kısa sürede gerçekçi bir görsele çevirebilirsiniz; günde 3 ücretsiz render hakkınız var. Fikirleri ve stilleri hızla keşfetmek için harikadır, ancak hayal ürünüdür ve gerçek ölçülerle örtüşmeyebilir.',
          'Ekibimizin fotogerçekçi render’ı ise planınızın ölçülerine uygun bir 3D model üzerine kurulur; malzemeler ve aydınlatma 3ds Max’te tanımlanır, V-Ray veya Corona ile render alınır. Ailenize sunum, gayrimenkul pazarlaması ya da ustaya net bir brif vermek için ihtiyacınız olan budur.',
        ],
      },
      {
        h: 'Her paket neleri içerir?',
        ul: [
          `Hızlı (KDV hariç ${quick}): plan temizliği ve model düzeltme, DWG ve PDF kabul edilir, 8 yüksek çözünürlüklü render, 3ds Max (.max) ve GLB dosyası ve PDF metraj tablosu; 48 iş saati içinde.`,
          `İç mimari tasarım (${perM2}, en az ${designMin}, KDV hariç): birimin tam tasarımı, malzeme, renk ve aydınlatma, 15 fotogerçekçi V-Ray render, paylaşılabilir 360° tur ve düzenli .max dosyasıyla iki revizyon turu.`,
          'Komple (projeye özel teklif): iç ve dış tasarım, cephe ve peyzaj, uygulama çizimleri, animasyonlu gezinti videosu ve size özel proje yöneticisi.',
        ],
      },
      {
        h: '3ds Max dosyası neden önemli?',
        p: [
          'Birçok tasarımcı 3ds Max’te duvarları sıfırdan çizerek başlar ve ilk render’dan önce saatler harcar. Katman ve malzemeleri düzenli bir .max dosyası bu aşamayı atlatır: duvarlar ve boşluklar doğru ölçülerde, mobilya ve malzemeler adlandırılmış ve gruplanmış durumdadır; tasarımcı kaldığımız yerden devam eder.',
          'Ekibiniz Blender veya SketchUp kullanıyorsa, GLB ve OBJ dışa aktarımları metre birimindedir ve yeniden ölçeklendirmeden açılır.',
        ],
      },
      {
        h: 'Render nasıl sipariş edilir?',
        steps: [
          { t: 'Planınızı stüdyoda açın', d: 'DXF’i yükleyin ve zevkinize en yakın stili seçin. Bu, tasarımcıya net bir başlangıç noktası verir.' },
          { t: 'Ekipten sipariş verin', d: 'Stüdyodaki “Ekipten sipariş ver” seçeneğini ya da ana sayfadaki sipariş formunu kullanıp bir paket seçin. Stüdyodaki tasarımınız otomatik eklenir.' },
          { t: 'Tercihlerinizi ekleyin', d: 'Beğendiğiniz renkleri ve malzemeleri, sizin için en önemli odaları ve açıları not edin; varsa referans görseller ekleyin.' },
          { t: 'Ödeyin veya teklif alın', d: 'Hızlı paket Moyasar üzerinden online ödenir (mada, Visa, Mastercard, Apple Pay); diğer paketler için bir iş günü içinde teklif gönderilir.' },
        ],
      },
      {
        h: 'Zevkinizi yansıtan render için ipuçları',
        ul: [
          'Uzun bir tarif yerine 3 ila 5 referans görsel paylaşın; görseller çok daha hızlı anlatır.',
          'Gerçekten seçtiğiniz kaplamaları (zemin türü, mermer veya porselen rengi) belirtin ki render’lar bunlarla örtüşsün.',
          'Odaları önem sırasına koyun: salon ve meclis genellikle servis odalarından daha fazla açıyı hak eder.',
          'Render’lar gayrimenkul pazarlaması içinse bunu belirtin; stil ve kamera açıları buna göre seçilsin.',
        ],
      },
    ],
    faq: [
      { q: 'Hangi render motorunu kullanıyorsunuz?', a: 'Projeye göre 3ds Max içinde V-Ray veya Corona.' },
      { q: '.max dosyasını kendim düzenleyebilir miyim?', a: 'Evet. Herhangi bir tasarımcının devam edebilmesi için katman ve malzemeler düzenlenmiştir. Sipariş notlarında 3ds Max sürümünüzü belirtin.' },
      { q: '8 ve 15 render arasındaki fark nedir?', a: 'Hızlı paket, düzeltilmiş modelden 48 iş saati içinde 8 yüksek çözünürlüklü render verir. İç mimari tasarım paketi her odanın tam tasarımını, 15 V-Ray render ve iki revizyon turunu içerir.' },
      { q: 'Fiyatlara KDV dahil mi?', a: 'Yayımlanan fiyatlar Suudi riyali cinsindendir ve %15 KDV hariçtir.' },
      { q: 'Birden fazla daire tipi olan gayrimenkul projeleri için render yapıyor musunuz?', a: 'Evet. Müteahhit aboneliği ayda 10’a kadar daire tipini kapsar. Ayrıntılar ana sayfadaki müteahhitler bölümündedir.' },
    ],
    ctaTitle: 'Planınızdan başlayın',
    ctaText: 'Planı stüdyoya yükleyin, ardından tek tıkla ekipten render sipariş edin.',
  },

  'ai-room-design': {
    title: 'Yapay Zeka ile Oda Tasarımı: Fotoğraftan | Oxira',
    description: 'Telefon fotoğrafından yapay zeka ile oda tasarımı: odayı nasıl çekmeli, stil seçimi, sonucun sınırları ve ne zaman plan gerekir. Her gün ilk tasarım ücretsiz.',
    nav: 'Yapay zeka ile oda tasarımı',
    card: 'Odanızın fotoğrafını çekin, bir dakikadan kısa sürede yeni bir stilde görün.',
    kicker: 'Yapay zeka',
    h1: 'Telefon fotoğrafından yapay zeka ile oda tasarımı',
    lead: 'Hazır bir odanız var ve onu farklı bir stilde görmek mi istiyorsunuz? Fotoğrafını çekin, oda türünü ve stili seçin; yapay zeka aynı duvar ve pencerelerle odayı bir dakikadan kısa sürede yeniden tasarlasın.',
    facts: [['< 1 dk', 'tasarım başına'], ['8', 'oda türü'], ['Ücretsiz', 'her gün ilk tasarım']],
    sections: [
      {
        h: 'Yapay zeka ile oda tasarımı nasıl çalışır?',
        steps: [
          { t: 'Odanın fotoğrafını çekin', d: 'Geniş açıdan net bir fotoğraf çekin; iki veya üç duvarın görünmesi için tercihen bir köşeden.' },
          { t: 'Oda türünü seçin', d: 'Salon, yatak odası, meclis (misafir oturma odası), yemek odası, mutfak, banyo, çalışma odası veya çocuk odası. Tür, mobilya seçimini yönlendirir.' },
          { t: 'Bir stil seçin', d: 'Modern, klasik, çağdaş Necd, İskandinav veya lüks.' },
          { t: 'Karşılaştırın ve indirin', d: 'Önce ve sonrayı karşılaştırmak için sürükleyin, görseli indirin ya da aynı fotoğrafta başka bir stil deneyin.' },
        ],
      },
      {
        h: 'Odanıza hangi stil uyar?',
        ul: [
          'Modern: sade çizgiler, nötr renkler ve yalın mobilya; çoğu salon ve yatak odasına uyar.',
          'Klasik: süslemeler, zengin kumaşlar ve sıcak aydınlatma; meclis veya geniş yemek odası için uygundur.',
          'Çağdaş Necd: Suudi Arabistan’ın Necd bölgesindeki geleneksel evlerden ilham alan toprak tonları ve doğal malzemeler, modern bir dokunuşla; meclis veya salona yakışır.',
          'İskandinav: açık renkler, açık tonlu ahşap ve işlevsel sadelik; küçük odaları daha geniş gösterir.',
          'Lüks: mermer, metalik detaylar ve özenli aydınlatma; misafir ağırladığınız ana mekanlar için.',
        ],
      },
      {
        h: 'İşe yarayan bir fotoğraf için ipuçları',
        ul: [
          'Perdeler açıkken gün ışığında çekin; iyi ışık sonucu her şeyden çok iyileştirir.',
          'Bir köşede durun, telefonu göğüs hizasında tutun ve varsa geniş açı lensi kullanın.',
          'Zemin ve masalardaki küçük eşyaları kaldırın; yapay zeka bunları mobilya sanabilir.',
          'İçinde insan olan fotoğraflar yüklemeyin.',
          'Aynı fotoğrafta birkaç stil deneyin; aradaki fark zevkinizi hızla netleştirir.',
        ],
      },
      {
        h: 'Sonuç neyi yapar, neyi yapmaz?',
        p: [
          'Yapay zeka ile yeniden tasarım odanın biçimini korur: duvarlar, pencereler ve kapılar yerinde kalır; mobilya, renkler, malzemeler ve aydınlatma değişir. Sonuç bir yön seçmek için güçlü bir ilham kaynağıdır, ancak uygulama çizimi değildir; görseldeki mobilya ölçüleri yaklaşıktır.',
          'Ölçüye dayalı kararlar gerekiyorsa (bu kanepe sığar mı? ne kadar zemin kaplaması lazım?), AutoCAD planınızı stüdyoya yükleyin veya ekibimizden iç mimari tasarım isteyin.',
        ],
      },
      {
        h: 'Fiyatlandırma',
        p: [
          `Her gün ilk tasarımınız ücretsiz. Daha fazlası için bir kez kredi alın, dilediğiniz zaman kullanın: ${p10.price} SAR’ye ${p10.renders} tasarım, ${p30.price} SAR’ye ${p30.renders} tasarım veya ${p100.price} SAR’ye ${p100.renders} tasarım; KDV dahil. Ücretli tasarımlar daha yüksek kalitededir ve odanın biçimini daha doğru korur.`,
          'Ödemeden sonra bakiyenize ait bir bağlantı alırsınız; kredilerinizi başka bir cihazda kullanmak için bu bağlantıyı saklayın.',
        ],
      },
      {
        h: 'Hangi araç, ne zaman?',
        ul: [
          'Yapay zeka ile oda tasarımı: oda hazır ve hızlıca dekorasyon veya yenileme fikri istiyorsunuz.',
          'AutoCAD planından stüdyo: ev henüz bitmedi ya da plan üzerinde alan, metraj ve mobilya yerleşimi gerekiyor.',
          'Ekip paketleri: ölçülü fotogerçekçi render, 3ds Max dosyası veya malzeme ve renkleriyle tam tasarım gerekiyor.',
        ],
      },
    ],
    faq: [
      { q: 'Yapay zeka ile oda tasarımı ücretsiz mi?', a: `Her gün ilk tasarımınız ücretsiz. Sonrasında krediler KDV dahil ${p10.price} SAR’ye ${p10.renders} tasarımdan başlar.` },
      { q: 'Duvarlar ve pencereler aynı kalıyor mu?', a: 'Evet. Yapay zeka odayı aynı duvar ve pencerelerle yeniden tasarlar; mobilyayı, renkleri, malzemeleri ve aydınlatmayı değiştirir.' },
      { q: 'Hangi oda türleri destekleniyor?', a: 'Salon, yatak odası, meclis, yemek odası, mutfak, banyo, çalışma odası ve çocuk odası.' },
      { q: 'Fotoğrafım yayımlanır mı?', a: 'Hayır. Fotoğraf yalnızca işlenmek üzere yapay zeka sağlayıcısına gönderilir ve yayımlanmaz.' },
      { q: 'Görseldekini birebir uygulayabilir miyim?', a: 'Görsel ilham ve yön içindir. Ölçülü uygulama için planınızı stüdyoya yükleyin veya ekibimizden iç mimari tasarım isteyin.' },
    ],
    ctaTitle: 'Odanızın fotoğrafını çekip deneyin',
    ctaText: 'Bugünkü ilk tasarımınız ücretsiz. Bir fotoğraf yükleyin, stil seçin ve sonucu bir dakikada görün.',
  },

  'finishing-quantities': {
    title: 'İnce İşler Metraj Hesabı: Plandan Ücretsiz | Oxira',
    description: 'AutoCAD planınızdan ince işler metrajını ücretsiz hesaplayın: oda oda zemin, boya, seramik, tavan ve süpürgelik. CSV indirin veya ince işler teklifi isteyin.',
    nav: 'İnce işler metrajı',
    card: 'Planınızın her odası için zemin, boya, seramik ve tavan metrajı.',
    kicker: 'İnce işlerden önce',
    h1: 'Kat planınızdan ince işler metrajı ve teklifler',
    lead: 'İnce işler ustasıyla pazarlığa oturmadan önce metrajınızı bilin. AutoCAD planınızı yükleyin, stüdyo her oda için zemin, boya, seramik, tavan ve süpürgelik miktarlarını hesaplasın. Ardından indirin veya teklif isteyin.',
    facts: [['5', 'metraj kalemi'], ['CSV', 'indirme'], ['Ücretsiz', 'yükümlülük yok']],
    sections: [
      {
        h: 'Stüdyo hangi metrajları hesaplar?',
        ul: [
          'Zemin kaplaması: her odanın alanı artı kesim ve döşeme için %10 fire.',
          'Duvar boyası: oda çevresi × tavan yüksekliği eksi kapı ve pencereler; yaşam alanları ve koridorlar için.',
          'Duvar seramiği: banyo ve mutfak duvarları tam yükseklikte, boşluklar düşülerek.',
          'Tavan: her iç mekanın alanı; alçıpan veya boya için kullanışlı.',
          'Süpürgelik: metretül olarak, oda çevresi eksi kapı genişlikleri.',
        ],
        tip: 'Balkon ve teraslara yalnızca zemin kaplaması hesaplanır; iç cephe boyası ve tavan hesaplanmaz.',
      },
      {
        h: 'Planınızdan metraj nasıl hesaplanır?',
        steps: [
          { t: 'Planı yükleyin', d: 'Stüdyoyu açın ve DXF kat planını yükleyin. Kapalı odalar otomatik tespit edilip ölçülür.' },
          { t: 'Birimleri ve yüksekliği kontrol edin', d: 'Çizim birimini ve tavan yüksekliğini doğrulayın; boya ve seramik doğrudan yüksekliğe bağlıdır.' },
          { t: 'Metraj tablosunu açın', d: 'Her oda için alan, zemin, boya, seramik, tavan ve süpürgeliği toplamlarıyla birlikte görürsünüz.' },
          { t: 'İndirin veya teklif isteyin', d: 'Tabloyu Excel için CSV olarak indirin ya da “İnce işler teklifi al”a tıklayıp bir kalite seviyesi seçin: ekonomik, standart veya premium.' },
        ],
      },
      {
        h: 'İnce işler teklifi isteme',
        p: [
          'Stüdyonun içinden planınızın metrajını adınız, cep telefonunuz, şehriniz ve istediğiniz kalite seviyesiyle gönderirsiniz. Metrajı ekibimize ve güvenilir müteahhitlere iletir, teklifle WhatsApp üzerinden size dönüş yaparız. Talep ücretsizdir ve bağlayıcı değildir.',
          'Teklifler belirli metrajlara dayandığı için, karşılaştırması zor götürü fiyatlar yerine hepsini aynı temelde karşılaştırabilirsiniz.',
        ],
      },
      {
        h: 'Pazarlıkta metrajı kullanmak',
        ul: [
          'Her ustadan kalem başına birim fiyat (m² veya metretül başına) isteyin, sonra kendi metrajınızla kendiniz çarpın.',
          'Fiyatın malzeme dahil mi yoksa yalnızca işçilik mi olduğunu ve hangi fire oranını varsaydıklarını sorun.',
          'Ustanın metrajını sizinkiyle karşılaştırın; büyük bir fark sorulmayı hak eder.',
          'Rakamları planlama tahmini olarak görün; kesin metraj sahada ölçülerek belirlenir.',
        ],
      },
      {
        h: 'Sık yapılan metraj hataları',
        ul: [
          'Boyayı taban alanından hesaplamak; tipik bir odada duvar alanı taban alanının iki ila üç katıdır.',
          'Fireyi unutmak veya her malzeme için aynı oranı kullanmak; büyük ebatlı seramik ve çapraz döşeme %10’dan fazlasını gerektirir, seçiminize göre ayarlayın.',
          'Son tavan yüksekliğini göz ardı etmek; asma tavan yüksekliği düşürecekse boya ve seramiği bitmiş yüksekliğe göre hesaplayın.',
          'Satış sözleşmesindeki alana güvenmek; brüt alan duvarları ve bazen ortak alan payını içerir, ince işler ise her odanın net alanı üzerinden ölçülür.',
          'Balkon ve terasları iç mekanlarla karıştırmak; malzemeleri ve maliyetleri farklıdır.',
        ],
      },
    ],
    faq: [
      { q: 'Metraj ne kadar doğru?', a: 'Alanlar çiziminizden santimetre hassasiyetinde hesaplanır; metrajlar planlama ve karşılaştırma için tahminidir. Kesin rakamlar ekip paketlerinde veya sahada ölçümle kontrol edilir.' },
      { q: 'Bazı odalarda neden alan görünmüyor?', a: 'Çizimde duvarları kapalı değil. Stüdyoda katman görevlerini kontrol edin veya duvar çizgilerinin köşelerde birleştiğinden emin olun.' },
      { q: 'Teklif talebi bağlayıcı mı?', a: 'Hayır. Ücretsizdir ve yükümlülük getirmez; teklifle WhatsApp üzerinden size ulaşırız.' },
      { q: 'Elektrik ve sıhhi tesisat hesaplanıyor mu?', a: 'Hayır. Stüdyo mimari ince işler kalemlerini kapsar: zemin, boya, seramik, tavan ve süpürgelik.' },
      { q: 'Resmi bir metraj tablosu alabilir miyim?', a: 'Hızlı paket, ekibimiz planı temizleyip modeli düzelttikten sonra PDF metraj tablosu içerir.' },
    ],
    ctaTitle: 'Metrajınızı şimdi hesaplayın',
    ctaText: 'Planı stüdyoya yükleyin ve metraj tablosunu açın; ücretsiz, üyelik gerekmez.',
  },

  'saudi-arabia': {
    title: 'Suudi Arabistan’da 3D İç Mekan Tasarımı | Oxira',
    description: 'Riyad, Cidde ve tüm Suudi Arabistan’da AutoCAD planından daire ve villa 3D iç mekan tasarımı; meclis ve ek binalar dahil. Fiyatlar SAR, mada ile ödeme.',
    nav: 'Suudi Arabistan',
    card: 'Riyad’dan Cidde’ye katları, ek binaları ve meclisiyle Suudi villa ve daireleri.',
    kicker: 'Suudi Arabistan',
    h1: 'Suudi Arabistan’da daire ve villalar için 3D iç mekan tasarımı',
    lead: 'Oxira, Riyad merkezli bir Suudi şirketidir ve stüdyo Suudi evine göre tasarlanmıştır: meclisi (misafir oturma odası), yemek odasını, şoför ve hizmetli odalarını tanır, çağdaş Necd stilinde döşer. Planınızı hangi şehirden olursa olsun yükleyin, saniyeler içinde 3D görün.',
    facts: [['Riyad', 'ekip merkezi'], ['Necd', 'yerel stil'], ['mada · Apple Pay', 'ödeme']],
    sections: [
      {
        h: 'Suudi evine göre tasarlandı',
        p: [
          'Çoğu 3D tasarım aracı tek salonlu ve açık mutfaklı Batı tipi evler için yapılmıştır. Suudi evi farklıdır: kendi girişi olan bir misafir meclisi, ona yakın bir yemek odası (maqlat), ayrı bir aile oturma odası ve şoför, hizmetli ve çamaşır için servis odaları.',
          'Stüdyo çizimdeki Arapça oda adlarını okur: meclis ve salonlar oturma alanı olur, yemek odaları yemek için döşenir; şoför, hizmetli, çamaşır ve depo odaları servis alanı olarak ele alınır. Çağdaş Necd stilinde meclis, duvarlar boyunca yer minderleriyle döşenir.',
        ],
      },
      {
        h: 'Riyad ve diğer şehirlerde villalar: katlar ve ek binalar',
        p: [
          'Tipik bir Suudi villasında meclis, yemek odası, salon ve mutfağın bulunduğu bir zemin kat, yatak odaları ve aile salonu için birinci kat, bir çatı eki ve bazen avluda müstakil bir ek bina ile şoför odası bulunur.',
          'Bunların her birini ayrı bir DXF olarak yükleyin ve her birinin tavan yüksekliğini ayarlayın. Villayı kaba inşaat (“adhm”) olarak aldıysanız ve ince işlere hazırlanıyorsanız, tasarım için en doğru zaman budur: müteahhit başlamadan yerleşimi, stili ve metrajı netleştirirsiniz.',
        ],
      },
      {
        h: 'Riyad ve Cidde’de daireler',
        ul: [
          'Konut binalarındaki mülk daireler genellikle bir salon, küçük bir meclis ve iki ila dört yatak odasından oluşur. Model, meclisin misafirler için yeterince büyük olup olmadığını ya da salonla birleştirilmesinin daha iyi olup olmadığını gösterir.',
          'Avlulu zemin kat daireler: avluya bakan salon ve mutfakta gezinin, ince işlerden önce oturma düzenine ve açıklıklara karar verin.',
          'Çatı daireleri: açık çatı alanını çizimde “teras” olarak etiketleyin; böylece iç cephe boyası ve tavan olmadan yalnızca zemin kaplaması hesaplanır.',
          'Projeden satış: müteahhitten daire planınız varsa teslimden önce döşenmiş halini görün ve değişikliklere erkenden karar verin.',
        ],
      },
      {
        h: 'Krallıktaki mülk sahipleri 3D tasarımı nasıl kullanıyor?',
        ul: [
          'İnce işlerden önce: stil seçmek, zemin, boya ve seramik metrajını hesaplamak ve ince işler teklifi istemek için.',
          'Mobilya almadan önce: kanepe, yatak ve gardıropların mekanlara sığdığından emin olmak için.',
          'Satarken veya kiraya verirken: ilan başına 49 SAR’ye bağlantı ve QR kodlu bir 3D tur yayımlayıp ilan platformlarında ve sosyal medyada paylaşmak için.',
          'Müteahhitler için: aylık abonelikle bir projedeki her daire tipi için render ve sanal tur.',
        ],
      },
      {
        h: 'Krallıkta fiyatlar, ödeme ve iletişim',
        p: [
          `Fiyatlar Suudi riyali cinsinden ve %15 KDV hariçtir: Hızlı paket ${quick}, iç mimari tasarım ${perM2}, en az ${designMin}. Hızlı paket Moyasar üzerinden mada, Visa, Mastercard veya Apple Pay ile online ödenir; diğer paketler için planı inceledikten sonra teklif ve fatura gönderilir.`,
          'WhatsApp veya e-posta üzerinden Arapça ya da İngilizce iletişim kuruyoruz; ekibimiz Riyad’da: 426 Al Sulaymaniyah, Al Urubah Rd.',
        ],
      },
    ],
    faq: [
      { q: 'Cidde, Dammam, Mekke ve diğer şehirlere hizmet veriyor musunuz?', a: 'Evet. Hizmet tamamen online: planı stüdyoya yükleyin veya siparişinizle gönderin; Krallık’ta nerede olursanız olun teslimat elektronik olarak yapılır.' },
      { q: 'Stüdyo Suudi proje ofislerinin Arapça planlarını okuyor mu?', a: 'Evet. Duvar, kapı ve pencere için Arapça katman adlarını; meclis, salon, yatak odası ve mutfak gibi Arapça oda adlarını tanır.' },
      { q: 'mada ile ödeyebilir miyim?', a: 'Evet. Hızlı paket Moyasar üzerinden mada, Visa, Mastercard veya Apple Pay ile ödenir.' },
      { q: 'Fatura alacak mıyım?', a: 'Evet, siparişinizle birlikte fatura alırsınız. Yayımlanan fiyatlar %15 KDV hariçtir.' },
      { q: 'Kaba inşaat halinde bir villam var. Tasarıma ne zaman başlamalıyım?', a: 'İnce işler müteahhidi başlamadan önce; çünkü yerleşim ve stil, aydınlatma ve priz konumlarını, malzemeleri ve metrajı belirler.' },
    ],
    ctaTitle: 'Evinizin planını yükleyin',
    ctaText: 'Riyad, Cidde veya herhangi bir şehirden: stüdyoyu açın ve evinizi saniyeler içinde 3D görün.',
  },

  gulf: {
    title: 'BAE ve Körfez’de 3D İç Mekan Tasarımı | Oxira Design',
    description: 'BAE, Katar, Kuveyt, Bahreyn ve Umman’daki daire ve villalar için AutoCAD planından 3D iç mekan tasarımı: metre veya fit, meclis, ek bina ve bodrum katlar.',
    nav: 'BAE ve Körfez',
    card: 'Dubai’deki sıra evlerden bodrumlu ve ek binalı Kuveyt evlerine.',
    kicker: 'BAE, Katar, Kuveyt, Bahreyn ve Umman',
    h1: 'BAE ve Körfez’de kat planından 3D iç mekan tasarımı',
    lead: 'Hizmet tamamen online: daire veya villa planınızı Dubai, Doha, Kuveyt, Manama ya da Maskat’tan stüdyoya yükleyin, mobilyası ve alanlarıyla saniyeler içinde 3D görün, ardından ihtiyacınız olanı ekibimizden isteyin.',
    facts: [['m² · ft²', 'metre veya fit'], ['Meclis', 'Körfez tarzı döşeme'], ['Online', 'her ülkeden']],
    sections: [
      {
        h: 'Terimler ve yerleşimler ülkeden ülkeye değişir',
        ul: [
          'BAE: müstakil villalar, sıra evler (townhouse) ve rezidans daireleri; emlak ilanlarında alanlar genellikle fitkare olarak verilir.',
          'Kuveyt: parsel (“qasima”) ve çok katlı aile evi; çoğunlukla bodrum kat (“sirdab”) ve ek bina bulunur. Her biri ayrı plan olarak yüklenir.',
          'Katar, Bahreyn ve Umman: müstakil ve site içi villalar; çoğu zaman evden ayrı bir dış meclis bulunur.',
          'Körfez’in her yerinde meclis merkezi bir mekandır; stüdyo meclis adlı odayı tanır ve oturma alanı olarak, çağdaş Necd stilinde yer minderleriyle döşer.',
        ],
      },
      {
        h: 'Metrekare mi, fitkare mi?',
        p: [
          'Stüdyo alanları metrekare olarak gösterir. Dönüşüm için: 1 m² ≈ 10,764 fitkare; yani 1.200 fitkarelik bir daire yaklaşık 111 m²’dir.',
          'Çizim fit cinsindeyse, DXF’i kaydetmeden önce AutoCAD’de ekleme biriminin Feet olarak ayarlandığından emin olun (UNITS komutu, Insertion scale); stüdyo birimi dosyadan okur. Çizim inç cinsindeyse çizim birimi menüsünden “İnç”i seçin.',
        ],
      },
      {
        h: 'İngilizce veya Arapça planlar',
        p: [
          'Körfez’deki pek çok plan, özellikle büyük danışmanlık firmalarında, İngilizce katman ve oda adları kullanır. Stüdyo ikisini de anlar: Walls, Doors ve Windows ya da Arapça karşılıkları, hatta A-WALL, A-DOOR ve A-GLAZ gibi standart adlar.',
          'Odalar için Arapça adların yanı sıra Bedroom, Kitchen, Living, Majlis, Maid’s room (hizmetli odası), Driver’s room (şoför odası) ve Laundry adlarını tanır; böylece her oda uygun şekilde döşenir ve ölçülür.',
        ],
      },
      {
        h: 'Bodrum katlar, ek binalar ve dış meclis',
        p: [
          'Körfez’de bir ev genellikle tek plandan fazlasıdır: bodrum, zemin kat, birinci kat, ek bina ve dış meclis. Her birini ayrı bir DXF olarak yükleyin ve tavan yüksekliğini ayrı ayrı ayarlayın; bodrum ve ek binalar çoğu zaman ana katlardan farklıdır.',
          'Ekip paketlerinde katları tek bir modelde birleştiriyoruz; Komple paket ayrıca cephe ve peyzaj ekler.',
        ],
      },
      {
        h: 'Suudi Arabistan dışından bizimle çalışmak',
        steps: [
          { t: 'Stüdyoyu deneyin', d: 'Bir DXF yükleyin; modeli, alanları ve mobilyayı görün. Üyelik yok ve dosya tarayıcınızda işlenir.' },
          { t: 'Siparişinizi gönderin', d: 'Bir paket seçin, şehrinizi ve ülkenizi girin. 15 MB’a kadar DWG veya PDF dosyası ekleyebilirsiniz.' },
          { t: 'Ödeme', d: 'Fiyatlar Suudi riyali cinsindendir. Hızlı paket Moyasar üzerinden kartla veya Apple Pay ile online ödenir; diğer paketler için bir iş günü içinde teklif gönderilir.' },
          { t: 'Teslimat', d: 'Render ve dosyalar elektronik olarak teslim edilir; WhatsApp veya e-posta üzerinden Arapça ya da İngilizce iletişim kuruyoruz.' },
        ],
      },
    ],
    faq: [
      { q: 'Hizmet BAE, Katar, Kuveyt, Bahreyn ve Umman’da kullanılabilir mi?', a: 'Evet. Hizmet tamamen online, her ülkeden plan kabul ediyoruz ve site Arapça ve İngilizce olarak da kullanılabilir.' },
      { q: 'Planım fit cinsinden çizilmiş. Stüdyo okuyabilir mi?', a: 'Evet, dosyanın ekleme birimi Feet olarak ayarlıysa. Alanlar m² olarak gösterilir; fitkare için 10,764 ile çarpın.' },
      { q: 'Hangi para biriminde ödeme yapıyorum?', a: 'Fiyatlar Suudi riyali cinsindendir. Körfez’deki müşteriler Hızlı paketi kartla veya Apple Pay ile, diğer paketleri teklif ve fatura üzerinden öder.' },
      { q: 'Körfez’deki gayrimenkul geliştiricileriyle çalışıyor musunuz?', a: 'Evet. Müteahhit aboneliği ayda 10’a kadar daire tipi için render ve sanal turu kapsar; Krallık dışından projeleri de memnuniyetle kabul ediyoruz.' },
    ],
    ctaTitle: 'Her ülkeden, kendi planınızla deneyin',
    ctaText: 'Stüdyoyu açın, bir DXF yükleyin ve dairenizi ya da villanızı saniyeler içinde 3D görün.',
  },

  egypt: {
    title: 'Mısır’da 3D Daire Tasarımı, İnce İşler Öncesi | Oxira',
    description: 'Mısır’daki dairenizi, dubleksinizi veya villanızı ince işlerden önce AutoCAD planından 3D tasarlayın; seramik, boya ve alçıpan metrajını ücretsiz alın.',
    nav: 'Mısır',
    card: 'Yarı bitmiş daire mi? Önce 3D görün ve ince işler metrajını hesaplayın.',
    kicker: 'Mısır',
    h1: 'Mısır’da 3D daire tasarımı, ince işler başlamadan',
    lead: 'Bir sitede veya binada yarı bitmiş bir daire mi teslim aldınız? AutoCAD planını yükleyin, mobilyası ve alanlarıyla saniyeler içinde 3D görün; ardından ince işler ustasıyla anlaşmadan önce seramik, boya ve tavan metrajını hesaplayın.',
    facts: [['Yarı bitmiş', 'en doğru an'], ['Ücretsiz', 'model ve metraj'], ['Online', 'Kahire’den her şehre']],
    sections: [
      {
        h: 'Yarı bitmiş daireler: tasarım için doğru zaman',
        p: [
          'Mısır’da pek çok daire yarı bitmiş (“nus tashtib”) ya da sıva aşamasında teslim edilir ve kalite seviyesine ev sahibi karar verir: “lux”, “super lux” veya “ultra super lux”. Tesisatçı ve elektrikçi başlamadan önce her şeyin nereye geleceğini bilmeniz gerekir: yataklar, televizyon, mutfak ve klimalar; çünkü priz, aydınlatma ve boru konumlarını bunlar belirler.',
          '3D model, kararlar kırım ve tekrar işe dönüşmeden önce bunların hepsini gösterir.',
        ],
      },
      {
        h: 'Mısır planlarında yazıldığı haliyle oda adları',
        p: ['Stüdyo bir odanın türünü içine yazılan addan tanır ve ona göre döşer. Mısır’da kullanılan adların çoğu doğrudan anlaşılır:'],
        ul: [
          '“نوم”, “أوضة نوم” veya “Master”: yatak odası.',
          '“سفرة”: yemek odası; “مطبخ” (mutfak) ve “حمام” (banyo) olduğu gibi.',
          '“تراس” ve “بلكونة”: yalnızca zemin kaplaması hesaplanan açık alanlar (teras ve balkon).',
          '“استقبال”, “صالة” veya Reception: yaşam alanı (salon).',
        ],
        tip: 'Arap harfleriyle yazılmış “ريسبشن” kelimesi otomatik tanınmaz; “استقبال” ya da Reception yazın veya yükledikten sonra oda türünü değiştirin.',
      },
      {
        h: 'Dubleks, çatı katı, penthouse ve villa',
        ul: [
          'Dubleks: her katı ayrı bir DXF olarak yükleyin ve iç merdivenin iki kattaki konumunu kontrol edin.',
          'Çatı katı ve penthouse: çatının açık kısmını “teras” (تراس) olarak etiketleyin; zemini boya ve tavan olmadan ayrı listelenir.',
          'Sitelerdeki sıra evler, ikiz evler ve müstakil villalar: her kat ayrı plandır; cephe ve bahçe Komple paketimizin parçasıdır.',
        ],
      },
      {
        h: 'Ustanın diliyle ince işler metrajı',
        p: [
          'Stüdyonun metraj tablosu her odanın zemin alanını %10 fireyle (seramik veya porselen), kapı ve pencereler düşülmüş boya alanını, banyo ve mutfak duvar seramiğini, alçıpan için tavan alanını ve metretül olarak süpürgeliği verir.',
          'Tabloyu CSV olarak indirin, her ustadan her kalem için metrekare fiyatı isteyin ve teklifleri aynı metraj üzerinden karşılaştırın. Bunların tahmin olduğunu unutmayın; kesin ölçüler sahada alınır.',
        ],
      },
      {
        h: 'Mısır’dan fiyatlar ve ödeme',
        p: [
          `Stüdyo, 3D model ve metraj ücretsizdir. Ekip paketleri Suudi riyali cinsinden ve KDV hariç fiyatlandırılır: Hızlı ${quick}, iç mimari tasarım ${perM2}, en az ${designMin}. Online ödeme banka kartıyla yapılır; ödemeyle ilgili sorularınız için bize WhatsApp’tan yazın.`,
        ],
      },
    ],
    faq: [
      { q: 'Hizmet Mısır’da kullanılabilir mi?', a: 'Evet, tamamen online. Planı Mısır’ın herhangi bir şehrinden stüdyoya yükleyin, ekipten sipariş verin ve dosyaları elektronik olarak alın.' },
      { q: 'Mühendisim planı PDF olarak gönderdi. Şimdi ne yapmalıyım?', a: 'AutoCAD DWG dosyasını isteyip DXF olarak kaydedin ya da PDF’i Hızlı paket siparişiyle gönderin, ekip modele dönüştürsün.' },
      { q: 'Stüdyo elektrik ve sıhhi tesisatı hesaplıyor mu?', a: 'Hayır, mimari ince işler kalemlerini kapsar: zemin, boya, seramik, tavan ve süpürgelik. Yine de mobilyayı modele yerleştirmek priz ve aydınlatma konumlarına karar vermenize yardımcı olur.' },
      { q: 'Fiyatlar Mısır lirası mı?', a: 'Yayımlanan fiyatlar Suudi riyali cinsindendir ve stüdyonun kendisi ücretsizdir. Ücretli paketlerde kartla ödediğinizde tutarı bankanız çevirir.' },
      { q: 'Küçük bir daireye hangi stil uyar?', a: 'Modern ve İskandinav stilleri deneyip aynı açıdan karşılaştırın; açık renkler ve sade mobilya mekanları daha geniş gösterir.' },
    ],
    ctaTitle: 'Dairenizi ince işlerden önce görün',
    ctaText: 'Daire planını ücretsiz stüdyoya yükleyin ve aynı adımda ince işler metrajını hesaplayın.',
  },
};

export const ui: GuideUi = {
  home: 'Ana sayfa',
  hub: 'Hizmetler ve rehberler',
  hubTitle: '3D Tasarım Hizmetleri ve Rehberler | Oxira Design',
  hubDescription: 'Tüm Oxira Design hizmetleri bir arada: AutoCAD planı 3D’ye çevirme, daire ve villa 3D tasarımı, fotogerçekçi render, yapay zeka oda tasarımı, metraj.',
  hubKicker: 'Hizmetler ve rehberler',
  hubH1: 'Kat planından fotogerçekçi render’a 3D tasarım hizmetleri',
  hubLead: 'Bulunduğunuz aşamaya uygun olanı seçin: elinizde bir AutoCAD planı var ve 3D görmek istiyorsunuz, bir daireyi veya villayı ince işlere hazırlıyorsunuz ya da bir odanın fotoğrafından hızlı bir tasarım fikri istiyorsunuz. Her sayfa adımları, gereken dosyaları ve neler alacağınızı anlatır.',
  services: 'Hizmetler',
  servicesLead: 'Her hizmet için pratik rehberler: nasıl çalışır, hangi dosyalar kabul edilir, neler otomatik ve ekibimiz neler yapar.',
  regions: 'Ülkeye göre',
  regionsLead: 'Aynı online hizmet ve her ülkede değişenler: terimler, tipik daire ve villalar, birimler ve ödeme.',
  which: {
    h: 'Nereden başlamalıyım?',
    items: [
      'Bir daire veya villanın AutoCAD dosyası (DWG veya DXF) elinizde: ücretsiz stüdyoyla başlayın; model, alanlar ve metraj saniyeler içinde hazır.',
      'Elinizde yalnızca bir odanın fotoğrafı var: yapay zeka ile oda tasarımını deneyin. Her gün ilk tasarımınız ücretsiz.',
      'Pazarlama için gerçekçi görseller ya da iç mimarınız veya ustanız için 3ds Max dosyası gerekiyor: stüdyoyu denedikten sonra ekip paketlerinden birini sipariş edin.',
      'İnce işlere başlamak üzeresiniz ve usta tekliflerini karşılaştırmak istiyorsunuz: stüdyodan metraj tablosunu indirin veya ince işler teklifi isteyin.',
    ],
  },
  open: 'Rehberi okuyun',
  steps: 'Adımlar',
  faq: 'Sıkça sorulan sorular',
  related: 'İlgili sayfalar',
  allServices: 'Tüm hizmetler ve rehberler',
  onThisPage: 'Bu sayfada',
  note: 'Üyelik gerekmez. Dosyanız tarayıcınızda işlenir.',
  breadcrumb: 'Gezinti yolu',
  homeSection: { label: 'Hizmetler ve rehberler', title: 'İhtiyacınız olan her şey için pratik rehberler', more: 'Tüm hizmetler ve rehberler' },
};
