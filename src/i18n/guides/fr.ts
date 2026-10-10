// French copy for the SEO landing pages (translated from guides-en.ts). Prices come from PRICES / REDESIGN_PACKS.
import { PRICES } from '../content';
import { REDESIGN_PACKS } from '../redesign';
import type { GuideCopy, GuideSlug, GuideUi } from '../guides';

const n = (x: number) => x.toLocaleString('fr-FR');
const [p10, p30, p100] = REDESIGN_PACKS;
const quick = `${n(PRICES.quick)} SAR`;
const perM2 = `${n(PRICES.designPerM2)} SAR le m²`;
const designMin = `${n(PRICES.designMin)} SAR`;

export const guides: Record<GuideSlug, GuideCopy> = {
  'autocad-to-3d': {
    title: 'Plan AutoCAD en 3D en ligne (DWG/DXF) | Oxira',
    description: 'Convertissez un plan AutoCAD en 3D dans votre navigateur en quelques secondes : murs, portes, fenêtres, surfaces, mobilier, visite. DWG et PDF via l’équipe.',
    nav: 'Plan AutoCAD en 3D',
    card: 'Importez un DXF et voyez le plan en 3D avec surfaces et mobilier en quelques secondes.',
    kicker: 'Du 2D à la 3D',
    h1: 'Convertir un plan AutoCAD en 3D, directement dans le navigateur',
    lead: 'Importez un DXF enregistré depuis AutoCAD : le studio Oxira génère en quelques secondes une maquette 3D avec murs, portes, fenêtres et la surface de chaque pièce. Sans inscription ni installation.',
    facts: [['DXF', 'lu directement'], ['DWG · PDF', 'via notre équipe'], ['Gratuit', 'maquette et surfaces']],
    sections: [
      {
        h: 'Comment un plan 2D devient une maquette 3D',
        p: [
          'Un plan AutoCAD n’est au fond qu’un ensemble de lignes, d’arcs et de textes répartis sur des calques. Le studio lit ces calques et déduit le rôle de chacun à partir de son nom : murs, portes, fenêtres, et ce qu’il faut ignorer comme les cotes, les hachures, le mobilier dessiné ou les trames.',
          'Il extrude ensuite les murs jusqu’à la hauteur sous plafond choisie, découpe les baies de portes et de fenêtres au bon endroit, détecte les pièces fermées et calcule leur surface, puis lit les noms de pièces écrits sur le plan, comme « chambre », « cuisine » ou « majlis », pour identifier chaque pièce et la meubler en conséquence.',
          'Tout se passe dans votre navigateur. Le fichier n’est pas envoyé sur nos serveurs pendant que vous utilisez le studio : vous pouvez donc l’essayer sans crainte sur votre propre logement.',
        ],
      },
      {
        h: 'Étape par étape',
        steps: [
          { t: 'Enregistrer le plan en DXF', d: 'Ouvrez le dessin dans AutoCAD et enregistrez-le au format DXF (version 2013 ou ultérieure). Si le fichier contient plusieurs plans ou présentations, copiez d’abord le plan d’étage voulu dans un fichier distinct.' },
          { t: 'L’importer dans le studio', d: 'Glissez le fichier sur la page du studio ou sélectionnez-le sur votre appareil, jusqu’à 40 Mo. Vous pouvez aussi partir de l’un des plans d’exemple.' },
          { t: 'Vérifier calques et unités', d: 'Le studio affiche les calques reconnus et leur rôle. S’il manque des murs, attribuez le rôle « Murs » au bon calque et relancez la génération. Vérifiez les unités du dessin (mm, cm, m ou pouces) et la hauteur sous plafond.' },
          { t: 'Explorer et visiter', d: 'Passez de la vue 3D au plan vu de dessus puis au mode visite, coupez les murs pour voir l’agencement d’en haut et choisissez un style pour changer le mobilier.' },
          { t: 'Exporter ou confier à l’équipe', d: 'Téléchargez un PNG ou une maquette GLB ou OBJ en mètres, ou demandez à notre équipe des rendus photoréalistes et un fichier 3ds Max prêt à l’emploi.' },
        ],
      },
      {
        h: 'Comment exporter un DXF depuis AutoCAD',
        ul: [
          'Fichier › Enregistrer sous, puis dans « Type de fichier » choisissez AutoCAD 2013 DXF ou une version plus récente.',
          'Ou tapez DXFOUT dans la ligne de commande, puis choisissez l’emplacement et la version.',
          'Avant d’enregistrer, supprimez ou gelez les calques inutiles comme les cotes, cartouches et cadres : la lecture est plus rapide et les erreurs plus rares.',
          'Écrivez le nom de chaque pièce sous forme de texte à l’intérieur de celle-ci (TEXT ou MTEXT), en anglais ou en arabe, pour que le studio reconnaisse son type.',
          'Vous travaillez sous Revit, ArchiCAD ou BricsCAD ? Exportez le plan d’étage en DXF depuis le menu Exporter.',
        ],
      },
      {
        h: 'Et les fichiers DWG et PDF ?',
        p: [
          'Le DWG est le format natif d’AutoCAD et les navigateurs ne peuvent pas le lire directement. Le plus simple est de l’enregistrer en DXF comme indiqué ci-dessus, ce qui prend moins d’une minute.',
          `Si vous n’avez pas AutoCAD ou seulement un plan en PDF, envoyez-le avec une commande de l’offre Express (${quick} HT) : notre équipe nettoie le dessin, le convertit et corrige la maquette.`,
        ],
      },
      {
        h: 'Ce que vous obtenez',
        ul: [
          'Une maquette 3D avec des murs à hauteur réelle, et des portes et fenêtres aux dimensions de votre plan.',
          'La surface de chaque pièce et la surface totale.',
          'Un métré estimatif des revêtements de sol, de la peinture, des plafonds, des plinthes et de la faïence des salles de bains et de la cuisine, téléchargeable en CSV.',
          'Un premier aménagement pour chaque type de pièce dans cinq styles : moderne, classique, najdi contemporain, scandinave et luxe.',
          'Une visite virtuelle, pièce par pièce.',
          'Des exports PNG, GLB et OBJ qui s’ouvrent dans 3ds Max, Blender et SketchUp.',
        ],
      },
      {
        h: 'Conseils pour un résultat plus propre',
        ul: [
          'Gardez les lignes de murs jointives aux angles : une pièce non fermée ne peut pas être mesurée.',
          'Donnez aux calques des noms clairs comme Murs, Portes et Fenêtres.',
          'Dessinez portes et fenêtres sous forme de blocs : le studio s’en sert pour classer chaque ouverture.',
          'Un plan d’étage par fichier : chaque niveau dans son propre DXF.',
          'Si la maquette semble à la mauvaise échelle, changez manuellement les unités du dessin dans le panneau des calques et relancez la génération.',
        ],
      },
    ],
    faq: [
      { q: 'La conversion d’un plan en 3D est-elle gratuite ?', a: 'Oui. La maquette, les surfaces, le métré estimatif, le mobilier, la visite et les exports sont gratuits dans le studio, sans inscription. Vous ne payez que le travail de l’équipe, comme les rendus photoréalistes et le fichier 3ds Max.' },
      { q: 'Quelle version de DXF utiliser ?', a: 'La version 2013 ou ultérieure donne les meilleurs résultats. Si la lecture échoue, réenregistrez en DXF 2013 et réessayez.' },
      { q: 'Le studio comprend-il les noms de calques et de pièces en arabe ?', a: 'Oui. Il reconnaît les noms de calques arabes et anglais pour les murs, portes et fenêtres, ainsi que les noms de pièces comme chambre, cuisine, salle de bains, séjour et majlis dans les deux langues.' },
      { q: 'Mon plan comporte plusieurs étages. Comment l’importer ?', a: 'Importez chaque étage dans un DXF distinct. Si tous les niveaux sont dans un même dessin, copiez chaque plan dans un nouveau fichier avant d’enregistrer.' },
      { q: 'Puis-je convertir un PDF ou une image en 3D ?', a: 'Pas dans le studio lui-même, car il a besoin d’une vraie géométrie CAO. Envoyez le PDF avec une commande de l’offre Express et notre équipe le convertit.' },
      { q: 'La maquette s’ouvre-t-elle dans 3ds Max ?', a: 'Oui. Les exports GLB et OBJ sont en mètres et s’ouvrent dans les versions récentes de 3ds Max. Les offres de l’équipe incluent un fichier .max organisé avec calques et matériaux.' },
    ],
    ctaTitle: 'Essayez avec votre propre plan',
    ctaText: 'Ouvrez le studio et importez un DXF, ou partez d’un plan d’exemple et voyez le résultat en quelques secondes.',
  },

  'apartment-3d-design': {
    title: 'Aménagement d’appartement en 3D depuis votre plan | Oxira',
    description: 'Aménagez votre appartement en 3D en ligne à partir d’un plan AutoCAD : mobilier auto, 5 styles, surfaces et visite, puis rendus photoréalistes ou projet complet.',
    nav: 'Appartement en 3D',
    card: 'Voyez votre appartement meublé en 3D avant les finitions et l’achat des meubles.',
    kicker: 'Pour les appartements',
    h1: 'Aménagement d’appartement en 3D : visualisez avant de finir',
    lead: 'Importez le plan de votre appartement et voyez-le en 3D avec mobilier et surfaces en quelques secondes. Fixez ensuite le style et l’agencement avant de lancer les travaux de finition ou d’acheter le moindre meuble.',
    facts: [['Secondes', 'du plan à la 3D'], ['5', 'styles d’intérieur'], [`${n(PRICES.designPerM2)} SAR`, 'le m², projet complet']],
    sections: [
      {
        h: 'Pourquoi concevoir un appartement en 3D d’abord ?',
        p: [
          'Dans un appartement, chaque centimètre compte : la place du canapé face à la télévision, le sens d’ouverture d’une porte de chambre, l’espace entre le lit et l’armoire, la circulation dans la cuisine. Rien de tout cela n’est évident sur un plan papier, mais tout devient clair dès que vous parcourez l’appartement en 3D.',
          'La maquette facilite aussi les échanges avec votre famille, votre architecte d’intérieur et votre entrepreneur. Au lieu de décrire une idée, vous envoyez une vue ou un fichier et tout le monde voit la même chose.',
        ],
      },
      {
        h: 'Comment aménager votre appartement en ligne',
        steps: [
          { t: 'Récupérer le plan', d: 'Demandez le fichier AutoCAD au promoteur, au bureau d’études ou à l’ancien propriétaire. S’il est en DWG, enregistrez-le en DXF dans AutoCAD ou demandez-leur une copie DXF.' },
          { t: 'L’importer dans le studio', d: 'En quelques secondes, le studio construit murs, portes et fenêtres et mesure le séjour, les chambres, la cuisine, les salles de bains et le balcon.' },
          { t: 'Choisir un style', d: 'Passez du moderne au classique, au najdi contemporain, au scandinave ou au luxe ; un premier aménagement est disposé selon le type de chaque pièce.' },
          { t: 'Visiter et décider', d: 'Utilisez le mode visite pour parcourir l’appartement à hauteur d’yeux, et coupez les murs pour voir tout l’agencement d’en haut.' },
          { t: 'Confier à l’équipe si besoin', d: 'Commandez des rendus photoréalistes ou un projet d’architecture intérieure complet avec matériaux, couleurs et éclairage. Votre maquette du studio est jointe automatiquement à la commande.' },
        ],
      },
      {
        h: 'Ce que montre la maquette de votre appartement',
        ul: [
          'Le séjour avec canapés et table basse, les chambres avec lits et armoires.',
          'La cuisine et les salles de bains avec leurs équipements de base, ainsi que le balcon ou la terrasse.',
          'La surface de chaque pièce en m² et la surface totale de l’appartement.',
          'Un métré estimatif des sols, de la peinture, de la faïence, des plafonds et des plinthes, utile pour comparer les devis de finition.',
          'Des vues PNG à partager, et une maquette GLB ou OBJ pour poursuivre dans un autre logiciel.',
        ],
      },
      {
        h: 'De la maquette gratuite au projet d’intérieur complet',
        p: ['La maquette et le premier aménagement sont gratuits dans le studio et suffisent pour comprendre l’agencement et choisir une direction. Si vous avez besoin d’images réalistes ou de fichiers de production, deux offres de l’équipe existent :'],
        ul: [
          `Express (${quick} HT) : nettoyage du plan et correction de la maquette, 8 rendus haute résolution, fichiers 3ds Max et GLB et tableau des quantités en PDF sous 48 heures ouvrées.`,
          `Architecture intérieure (${perM2}, minimum ${designMin}, HT) : un designer travaille avec vous sur chaque pièce, 15 rendus V-Ray, une visite 360° partageable et deux séries de modifications. Exemple : un appartement de 120 m² revient à ${n(120 * PRICES.designPerM2)} SAR HT, livré en 5 à 10 jours ouvrés selon la surface.`,
        ],
      },
      {
        h: 'Conseils pratiques pour aménager un appartement',
        ul: [
          'Laissez des passages confortables entre les meubles, et jugez l’espace en parcourant la maquette plutôt que sur le seul plan.',
          'Vérifiez le débattement des portes, surtout celles des chambres et salles de bains proches des armoires.',
          'Dans un petit appartement, les couleurs claires et les meubles bas agrandissent visuellement les pièces ; comparez les styles scandinave et moderne.',
          'Fixez l’emplacement de la télévision, des lits et des bureaux avant les finitions, car il détermine celui des prises et des points lumineux.',
          'Prenez une vue par style sous le même angle et comparez-les en famille avant de décider.',
        ],
      },
    ],
    faq: [
      { q: 'Je n’ai pas de fichier AutoCAD de mon appartement. Que faire ?', a: 'Demandez-le au promoteur ou au bureau d’études qui a conçu l’immeuble. Si vous n’avez qu’un PDF, envoyez-le avec une commande de l’offre Express et notre équipe le transforme en maquette.' },
      { q: 'Le mobilier de la maquette est-il à l’échelle ?', a: 'L’aménagement automatique est une première proposition avec des meubles de dimensions standard selon le type de pièce, pour comprendre l’agencement et l’espace. Le choix de pièces précises aux dimensions exactes se fait avec un designer dans l’offre Architecture intérieure.' },
      { q: 'Combien coûte un projet complet d’appartement ?', a: `La maquette du studio est gratuite. Un projet d’architecture intérieure complet coûte ${perM2} avec un minimum de ${designMin} hors TVA de 15 %, et l’offre Express ${quick}.` },
      { q: 'Travaillez-vous sur des appartements en Égypte et dans le Golfe ?', a: 'Oui. Le service est entièrement en ligne et nous acceptons des plans de tous pays. Consultez les pages Égypte et Golfe pour les spécificités locales.' },
      { q: 'Puis-je partager le projet avec mon entrepreneur ?', a: 'Oui. Téléchargez des vues PNG et le tableau des quantités en CSV, ou exportez en GLB ou OBJ. Les offres de l’équipe ajoutent un fichier .max et des rendus haute résolution.' },
    ],
    ctaTitle: 'Voyez votre appartement en 3D dès aujourd’hui',
    ctaText: 'Importez le plan de l’appartement dans le studio gratuit et choisissez votre style avant le début des finitions.',
  },

  'villa-3d-design': {
    title: 'Plan de villa en 3D depuis AutoCAD | Oxira Design',
    description: 'Conception de villa en 3D depuis vos plans AutoCAD : chaque étage en maquette avec surfaces, mobilier et majlis, puis rendus réalistes, façades et intérieur.',
    nav: 'Villa en 3D',
    card: 'Chaque étage de la villa en 3D, y compris le majlis, l’espace famille et les pièces de service.',
    kicker: 'Pour les villas et maisons',
    h1: 'Conception de villa en 3D à partir de vos plans AutoCAD',
    lead: 'Une villa est une décision importante avec de nombreux espaces : majlis (salon de réception), salle à manger, séjour familial, chambres et annexe. Importez le plan de chaque étage et voyez-le en 3D avec mobilier et surfaces avant le début des finitions.',
    facts: [['Chaque étage', 'sa propre maquette'], ['Majlis', 'assises à l’arabe'], ['Intérieur + extérieur', 'offre Complète']],
    sections: [
      {
        h: 'Pourquoi une villa a besoin d’une conception 3D',
        p: [
          'Dans une villa, les espaces des invités, de la famille et du service se croisent, et les erreurs d’agencement sont difficiles à corriger après les finitions : un majlis des hommes qui donne sur le salon familial, une cuisine éloignée de la salle à manger, un escalier qui coupe l’étage. Une maquette 3D révèle ces relations avant qu’elles ne coûtent cher.',
          'Comme les budgets de finition et d’ameublement d’une villa sont élevés, voir chaque étage meublé et mesuré vous aide à répartir le budget entre étages et pièces en toute confiance.',
        ],
      },
      {
        h: 'Ce qui est automatique et ce que fait l’équipe',
        ul: [
          'Automatique dans le studio : murs et ouvertures de chaque étage, détection des pièces et surfaces, premier aménagement incluant un majlis avec assises au sol de style najdi, métré estimatif et visite virtuelle.',
          'Par l’équipe : nettoyage des grands plans et des fichiers DWG, architecture intérieure selon vos goûts avec matériaux, couleurs et éclairage, rendus V-Ray ou Corona et fichier 3ds Max organisé.',
          'Dans l’offre Complète : conception intérieure et extérieure, façades et aménagement paysager, plans d’exécution pour l’entrepreneur, vidéo de visite animée et chef de projet dédié.',
        ],
      },
      {
        h: 'Préparer et importer les plans de la villa',
        steps: [
          { t: 'Séparer les étages', d: 'Enregistrez chaque niveau (rez-de-chaussée, étage, annexe ou toit, et sous-sol le cas échéant) dans son propre DXF, car le studio construit un plan d’étage à la fois.' },
          { t: 'Nommer les pièces sur le plan', d: 'Écrivez des noms comme majlis, séjour, salle à manger, chambre, cuisine ou chambre du chauffeur à l’intérieur de chaque pièce pour que le studio la reconnaisse et la meuble.' },
          { t: 'Régler la hauteur sous plafond par étage', d: 'Ajustez la hauteur sous plafond dans le panneau des calques pour chaque étage ; le rez-de-chaussée et l’annexe diffèrent souvent.' },
          { t: 'Vérifier et exporter', d: 'Parcourez chaque étage, téléchargez le tableau des quantités par niveau, puis joignez les fichiers à votre commande si vous voulez des rendus ou un projet complet.' },
        ],
      },
      {
        h: 'Combien coûte la conception d’une villa',
        p: [
          `L’architecture intérieure est facturée à la surface : ${perM2} HT avec un minimum de ${designMin}. Une villa de 400 m² habitables, par exemple, revient à ${n(400 * PRICES.designPerM2)} SAR HT, toutes pièces comprises, avec 15 rendus V-Ray, une visite 360° et deux séries de modifications.`,
          'L’offre Complète avec façades, aménagement paysager et plans d’exécution fait l’objet d’un devis par projet après étude des plans, que vous recevez sous un jour ouvré.',
        ],
      },
      {
        h: 'Conseils pour concevoir une villa',
        ul: [
          'Séparez les circulations des invités et de la famille : fixez l’entrée du majlis et les toilettes invités avant tout le reste.',
          'Placez la salle à manger près de la cuisine ou d’une cuisine de préparation, et vérifiez la distance en parcourant la maquette.',
          'Contrôlez la position de l’escalier à chaque étage et assurez-vous qu’on n’accède pas aux chambres en traversant les espaces invités.',
          'Donnez des dimensions pratiques aux pièces de service, à la buanderie et aux rangements ; elles pèsent plus qu’on ne le pense sur le confort quotidien.',
          'Comparez au moins deux styles pour le séjour et le majlis, les deux espaces que les invités voient le plus.',
        ],
      },
    ],
    faq: [
      { q: 'Puis-je importer toute la villa dans un seul fichier ?', a: 'Le studio construit un plan d’étage à la fois : importez donc chaque étage dans un DXF distinct. Dans les offres de conception, notre équipe réunit les étages en une seule maquette.' },
      { q: 'Concevez-vous les façades extérieures ?', a: 'Oui, dans l’offre Complète, avec l’aménagement paysager. Le studio gratuit se concentre sur les plans d’intérieur.' },
      { q: 'Le studio gère-t-il le majlis arabe ?', a: 'Oui. Une pièce nommée majlis est traitée comme un espace de réception, et dans le style najdi contemporain elle reçoit des assises au sol le long des murs.' },
      { q: 'Combien de temps prend la conception complète d’une villa ?', a: 'L’architecture intérieure prend 5 à 10 jours ouvrés selon la surface. Pour l’offre Complète, le délai est fixé dans le devis selon l’ampleur du projet.' },
      { q: 'Est-ce que je reçois des fichiers pour mon entrepreneur ?', a: 'Les offres de l’équipe incluent un fichier .max organisé et des rendus haute résolution, et l’offre Complète ajoute les plans d’exécution pour l’entrepreneur.' },
    ],
    ctaTitle: 'Commencez par le rez-de-chaussée',
    ctaText: 'Importez le premier plan d’étage dans le studio gratuit pour le voir en 3D, puis demandez le projet complet à l’équipe.',
  },

  'interior-renders': {
    title: 'Rendu 3D intérieur photoréaliste et fichier 3ds Max | Oxira',
    description: 'Rendus 3D intérieurs photoréalistes sous V-Ray ou Corona et fichier 3ds Max organisé avec calques et matériaux, depuis votre plan AutoCAD. Express en 48 h.',
    nav: 'Rendus photoréalistes et 3ds Max',
    card: 'Images photoréalistes V-Ray ou Corona et fichier .max organisé à partir de votre plan.',
    kicker: 'Visualisation intérieure',
    h1: 'Rendus intérieurs photoréalistes et fichier 3ds Max prêt à l’emploi',
    lead: 'D’un plan AutoCAD à des images d’intérieur photoréalistes et un fichier 3ds Max organisé sur lequel votre architecte d’intérieur ou votre entrepreneur peut s’appuyer, avec des offres claires et des prix publiés.',
    facts: [['V-Ray · Corona', 'moteurs de rendu'], ['.max · GLB', 'fichiers livrés'], ['48 heures', 'offre Express']],
    sections: [
      {
        h: 'Rendus IA ou rendus photoréalistes de l’équipe',
        p: [
          'Dans le studio, vous pouvez transformer n’importe quelle vue de la maquette en image réaliste par IA en moins d’une minute, avec 3 rendus gratuits par jour. Parfaits pour explorer rapidement des idées et des styles, ils restent toutefois interprétatifs et peuvent ne pas respecter les dimensions réelles.',
          'Un rendu photoréaliste de notre équipe repose sur une maquette 3D calée sur les cotes de votre plan, avec matériaux et éclairage définis dans 3ds Max, et calculée sous V-Ray ou Corona. C’est ce qu’il vous faut pour présenter le projet à votre famille, commercialiser un bien ou donner un cahier des charges clair à un entrepreneur.',
        ],
      },
      {
        h: 'Ce que comprend chaque offre',
        ul: [
          `Express (${quick} HT) : nettoyage du plan et correction de la maquette, DWG et PDF acceptés, 8 rendus haute résolution, fichiers 3ds Max (.max) et GLB et tableau des quantités en PDF, sous 48 heures ouvrées.`,
          `Architecture intérieure (${perM2}, minimum ${designMin}, HT) : conception complète du logement, matériaux, couleurs et éclairage, 15 rendus photoréalistes V-Ray, une visite 360° partageable et deux séries de modifications, avec un fichier .max organisé.`,
          'Complète (sur devis) : conception intérieure et extérieure, façades et aménagement paysager, plans d’exécution, vidéo de visite animée et chef de projet dédié.',
        ],
      },
      {
        h: 'Pourquoi le fichier 3ds Max compte',
        p: [
          'Beaucoup de designers repartent de zéro en redessinant les murs dans 3ds Max, ce qui prend des heures avant le premier rendu. Un fichier .max organisé avec calques et matériaux évite cette étape : murs et ouvertures aux bonnes dimensions, mobilier et matériaux nommés et regroupés, pour que le designer reprenne là où nous nous sommes arrêtés.',
          'Si votre équipe travaille sous Blender ou SketchUp, les exports GLB et OBJ sont en mètres et s’ouvrent sans remise à l’échelle.',
        ],
      },
      {
        h: 'Comment commander des rendus',
        steps: [
          { t: 'Ouvrir votre plan dans le studio', d: 'Importez le DXF et choisissez le style le plus proche de vos goûts. Cela donne au designer un point de départ clair.' },
          { t: 'Commander auprès de l’équipe', d: 'Utilisez « Commander à l’équipe » dans le studio ou le formulaire de commande de la page d’accueil et choisissez une offre. Votre maquette du studio est jointe automatiquement.' },
          { t: 'Préciser vos préférences', d: 'Indiquez les couleurs et matériaux que vous aimez, les pièces et angles de vue prioritaires, et joignez des images de référence si vous en avez.' },
          { t: 'Payer ou recevoir un devis', d: 'L’offre Express se règle en ligne via Moyasar (mada, Visa, Mastercard, Apple Pay) ; les autres offres font l’objet d’un devis sous un jour ouvré.' },
        ],
      },
      {
        h: 'Conseils pour des rendus fidèles à vos goûts',
        ul: [
          'Partagez 3 à 5 images de référence plutôt qu’une longue description : les images parlent plus vite.',
          'Listez les finitions que vous avez réellement choisies (type de sol, teinte du marbre ou du grès cérame) pour que les rendus y correspondent.',
          'Classez les pièces par importance : le séjour et le majlis méritent généralement plus d’angles que les pièces de service.',
          'Si les rendus servent à la commercialisation immobilière, précisez-le pour adapter le style et les cadrages.',
        ],
      },
    ],
    faq: [
      { q: 'Quel moteur de rendu utilisez-vous ?', a: 'V-Ray ou Corona dans 3ds Max, selon le projet.' },
      { q: 'Puis-je modifier le fichier .max moi-même ?', a: 'Oui. Il est organisé avec calques et matériaux pour que n’importe quel designer puisse poursuivre. Indiquez votre version de 3ds Max dans les notes de commande.' },
      { q: 'Quelle différence entre 8 et 15 rendus ?', a: 'L’offre Express fournit 8 rendus haute résolution de la maquette corrigée sous 48 heures ouvrées. L’offre Architecture intérieure comprend la conception complète de chaque pièce avec 15 rendus V-Ray et deux séries de modifications.' },
      { q: 'Les prix incluent-ils la TVA ?', a: 'Les prix publiés sont en riyals saoudiens hors TVA de 15 %.' },
      { q: 'Réalisez-vous des rendus pour des programmes immobiliers avec plusieurs types de logements ?', a: 'Oui. L’abonnement promoteur couvre jusqu’à 10 types de logements par mois. Les détails figurent dans la section promoteurs de la page d’accueil.' },
    ],
    ctaTitle: 'Partez de votre plan',
    ctaText: 'Importez le plan dans le studio, puis commandez vos rendus à l’équipe en un clic.',
  },

  'ai-room-design': {
    title: 'Décoration intérieure par IA depuis une photo | Oxira',
    description: 'Relookez une pièce par IA à partir d’une photo : comment la prendre, quel style choisir, limites du résultat et quand il faut un plan. 1er rendu gratuit.',
    nav: 'Décoration par IA',
    card: 'Photographiez une pièce et voyez-la relookée dans un nouveau style en moins d’une minute.',
    kicker: 'IA',
    h1: 'Décoration intérieure par IA à partir d’une photo',
    lead: 'Vous avez une pièce terminée et voulez la voir dans un autre style ? Prenez une photo, choisissez le type de pièce et un style : l’IA la réaménage en conservant les mêmes murs et fenêtres, en moins d’une minute.',
    facts: [['< 1 min', 'par rendu'], ['8', 'types de pièces'], ['Gratuit', '1er rendu chaque jour']],
    sections: [
      {
        h: 'Comment fonctionne la décoration par IA',
        steps: [
          { t: 'Photographier la pièce', d: 'Prenez une photo nette en grand angle, idéalement depuis un coin pour voir deux ou trois murs.' },
          { t: 'Choisir le type de pièce', d: 'Séjour, chambre, majlis, salle à manger, cuisine, salle de bains, bureau ou chambre d’enfant. Le type oriente le choix du mobilier.' },
          { t: 'Choisir un style', d: 'Moderne, classique, najdi contemporain, scandinave ou luxe.' },
          { t: 'Comparer et télécharger', d: 'Faites glisser le curseur pour comparer avant et après, téléchargez l’image ou essayez un autre style sur la même photo.' },
        ],
      },
      {
        h: 'Quel style pour votre pièce ?',
        ul: [
          'Moderne : lignes épurées, couleurs neutres et mobilier sobre ; convient à la plupart des séjours et chambres.',
          'Classique : moulures, tissus riches et éclairage chaleureux ; idéal pour un majlis ou une grande salle à manger.',
          'Najdi contemporain : tons terreux et matériaux naturels inspirés de la maison traditionnelle du Najd, avec une touche moderne ; adapté au majlis ou au séjour.',
          'Scandinave : couleurs claires, bois blond et simplicité pratique ; agrandit visuellement les petites pièces.',
          'Luxe : marbre, touches métalliques et éclairage soigné, pour les pièces principales où vous recevez.',
        ],
      },
      {
        h: 'Conseils pour une photo réussie',
        ul: [
          'Photographiez à la lumière du jour, rideaux ouverts : une bonne lumière améliore le résultat plus que tout le reste.',
          'Placez-vous dans un coin, tenez le téléphone à hauteur de poitrine et utilisez l’objectif grand angle si vous en avez un.',
          'Dégagez les petits objets des sols et des tables, l’IA pourrait les interpréter comme des meubles.',
          'N’importez pas de photos où figurent des personnes.',
          'Essayez plusieurs styles sur la même photo ; le contraste vous aide à cerner vos goûts rapidement.',
        ],
      },
      {
        h: 'Ce que le résultat permet, et ce qu’il ne permet pas',
        p: [
          'Le relooking par IA conserve la forme de la pièce : murs, fenêtres et portes restent en place, tandis que mobilier, couleurs, matériaux et éclairage changent. Le résultat est une excellente source d’inspiration pour choisir une direction, mais pas un plan d’exécution ; les dimensions des meubles sur l’image sont approximatives.',
          'Si vous devez décider sur la base de mesures (ce canapé rentre-t-il ? combien de revêtement de sol faut-il ?), importez votre plan AutoCAD dans le studio ou demandez un projet d’architecture intérieure à notre équipe.',
        ],
      },
      {
        h: 'Tarifs',
        p: [
          `Votre premier rendu de la journée est gratuit. Au-delà, achetez des crédits une seule fois et utilisez-les quand vous voulez : ${p10.renders} rendus pour ${p10.price} SAR, ${p30.renders} rendus pour ${p30.price} SAR ou ${p100.renders} rendus pour ${p100.price} SAR, TVA incluse. Les rendus payants sont de meilleure qualité et respectent plus fidèlement la forme de la pièce.`,
          'Après le paiement, vous recevez un lien vers votre solde ; conservez-le pour utiliser vos crédits sur un autre appareil.',
        ],
      },
      {
        h: 'Quel outil pour quel besoin ?',
        ul: [
          'Relooking par IA : la pièce existe et vous voulez rapidement des idées de décoration ou de rénovation.',
          'Studio à partir d’un plan AutoCAD : le logement n’est pas encore terminé, ou vous avez besoin des surfaces, des quantités et d’un aménagement sur plan.',
          'Offres de l’équipe : vous avez besoin de rendus photoréalistes à l’échelle, d’un fichier 3ds Max ou d’un projet complet avec matériaux et couleurs.',
        ],
      },
    ],
    faq: [
      { q: 'La décoration par IA est-elle gratuite ?', a: `Votre premier rendu de la journée est gratuit. Ensuite, les crédits commencent à ${p10.renders} rendus pour ${p10.price} SAR TVA incluse.` },
      { q: 'Les murs et fenêtres restent-ils identiques ?', a: 'Oui. L’IA réaménage la pièce en conservant les mêmes murs et fenêtres, et change le mobilier, les couleurs, les matériaux et l’éclairage.' },
      { q: 'Quels types de pièces sont pris en charge ?', a: 'Séjour, chambre, majlis, salle à manger, cuisine, salle de bains, bureau et chambre d’enfant.' },
      { q: 'Ma photo est-elle publiée ?', a: 'Non. La photo est uniquement transmise au fournisseur d’IA pour traitement et n’est pas publiée.' },
      { q: 'Puis-je réaliser exactement ce que montre l’image ?', a: 'L’image sert d’inspiration et de direction. Pour une réalisation à l’échelle, importez votre plan dans le studio ou demandez un projet d’architecture intérieure à notre équipe.' },
    ],
    ctaTitle: 'Photographiez votre pièce et essayez',
    ctaText: 'Votre premier rendu du jour est gratuit. Importez une photo, choisissez un style et voyez le résultat en une minute.',
  },

  'finishing-quantities': {
    title: 'Métré travaux de finition depuis votre plan | Oxira',
    description: 'Calculez gratuitement le métré des travaux de finition depuis votre plan AutoCAD : sols, peinture, faïence, plafonds et plinthes par pièce. Export CSV ou devis.',
    nav: 'Métré des finitions',
    card: 'Quantités de sols, peinture, faïence et plafonds pour chaque pièce de votre plan.',
    kicker: 'Avant les finitions',
    h1: 'Métré des travaux de finition depuis votre plan, et devis',
    lead: 'Avant de négocier avec une entreprise de finition, connaissez vos quantités. Importez votre plan AutoCAD : le studio calcule sols, peinture, faïence, plafonds et plinthes pour chaque pièce. Téléchargez ensuite le métré ou demandez des devis.',
    facts: [['5', 'postes calculés'], ['CSV', 'téléchargement'], ['Gratuit', 'sans engagement']],
    sections: [
      {
        h: 'Quelles quantités le studio calcule-t-il ?',
        ul: [
          'Revêtement de sol : la surface de chaque pièce plus 10 % de chutes pour la découpe et la pose.',
          'Peinture murale : périmètre de la pièce × hauteur sous plafond, moins portes et fenêtres, pour les pièces de vie et les couloirs.',
          'Faïence murale : murs des salles de bains et de la cuisine sur toute la hauteur, moins les ouvertures.',
          'Plafonds : la surface de chaque pièce intérieure, utile pour le placo ou la peinture.',
          'Plinthes : en mètres linéaires, périmètre de la pièce moins la largeur des portes.',
        ],
        tip: 'Balcons et terrasses ne reçoivent que le revêtement de sol, sans peinture intérieure ni plafond.',
      },
      {
        h: 'Comment calculer les quantités depuis votre plan',
        steps: [
          { t: 'Importer le plan', d: 'Ouvrez le studio et importez le plan d’étage en DXF. Les pièces fermées sont détectées et mesurées automatiquement.' },
          { t: 'Vérifier unités et hauteur', d: 'Confirmez les unités du dessin et la hauteur sous plafond, dont dépendent directement la peinture et la faïence.' },
          { t: 'Ouvrir le tableau des quantités', d: 'Pour chaque pièce, vous voyez la surface, le sol, la peinture, la faïence, le plafond et les plinthes, avec les totaux.' },
          { t: 'Télécharger ou demander des devis', d: 'Téléchargez le tableau en CSV pour Excel, ou cliquez sur « Obtenir des devis de finition » et choisissez un niveau de finition : économique, standard ou haut de gamme.' },
        ],
      },
      {
        h: 'Demander des devis de finition',
        p: [
          'Depuis le studio, vous envoyez les quantités de votre plan avec votre nom, votre numéro de mobile, votre ville et le niveau de finition souhaité. Nous transmettons les quantités à notre équipe et à des entreprises sélectionnées, puis vous recontactons avec un devis sur WhatsApp. La demande est gratuite et sans engagement.',
          'Comme les devis reposent sur des quantités définies, vous pouvez les comparer sur une même base plutôt que des offres forfaitaires difficiles à comparer.',
        ],
      },
      {
        h: 'Utiliser le métré pour négocier',
        ul: [
          'Demandez à chaque entreprise un prix unitaire par poste (au m² ou au mètre linéaire), puis multipliez vous-même par vos quantités.',
          'Demandez si le prix inclut les fournitures ou seulement la main-d’œuvre, et quel taux de chutes est pris en compte.',
          'Comparez les quantités de l’entreprise aux vôtres ; un écart important mérite une question.',
          'Considérez ces chiffres comme des estimations de préparation ; les quantités définitives sont confirmées par un métré sur place.',
        ],
      },
      {
        h: 'Erreurs de métré courantes',
        ul: [
          'Estimer la peinture à partir de la surface au sol : dans une pièce type, la surface des murs représente deux à trois fois celle du sol.',
          'Oublier les chutes, ou appliquer le même taux à tous les matériaux : les grands formats et la pose en diagonale demandent plus de 10 %, ajustez selon votre choix.',
          'Ignorer la hauteur sous plafond finale : si un faux plafond l’abaisse, calculez peinture et faïence à la hauteur finie.',
          'Se fier à la surface du contrat de vente : elle inclut les murs et parfois une quote-part des parties communes, alors que les finitions se mesurent sur la surface nette de chaque pièce.',
          'Mélanger balcons et terrasses avec les pièces intérieures, alors que leurs matériaux et leurs coûts diffèrent.',
        ],
      },
    ],
    faq: [
      { q: 'Quelle est la précision des quantités ?', a: 'Les surfaces sont calculées au centimètre près à partir de votre dessin ; les quantités sont des estimations destinées à la préparation et à la comparaison. Les chiffres définitifs sont vérifiés dans les offres de l’équipe ou par un métré sur place.' },
      { q: 'Pourquoi certaines pièces n’affichent-elles pas de surface ?', a: 'Leurs murs ne sont pas fermés sur le dessin. Vérifiez le rôle des calques dans le studio, ou assurez-vous que les lignes de murs se rejoignent aux angles.' },
      { q: 'Une demande de devis est-elle engageante ?', a: 'Non. Elle est gratuite et sans engagement, et nous vous recontactons avec le devis sur WhatsApp.' },
      { q: 'L’électricité et la plomberie sont-elles calculées ?', a: 'Non. Le studio couvre les postes de finition architecturale : sols, peinture, faïence, plafonds et plinthes.' },
      { q: 'Puis-je obtenir un tableau des quantités officiel ?', a: 'L’offre Express inclut un tableau des quantités en PDF, une fois le plan nettoyé et la maquette corrigée par notre équipe.' },
    ],
    ctaTitle: 'Calculez vos quantités maintenant',
    ctaText: 'Importez le plan dans le studio et ouvrez le tableau des quantités, gratuitement et sans inscription.',
  },

  'saudi-arabia': {
    title: 'Architecture intérieure 3D en Arabie saoudite | Oxira',
    description: 'Architecture intérieure 3D d’appartements et de villas à Riyad, Djeddah et dans toute l’Arabie saoudite depuis vos plans AutoCAD. Prix en SAR, paiement mada.',
    nav: 'Arabie saoudite',
    card: 'Villas et appartements saoudiens avec étages, annexes et majlis, de Riyad à Djeddah.',
    kicker: 'Arabie saoudite',
    h1: 'Architecture intérieure 3D d’appartements et de villas en Arabie saoudite',
    lead: 'Oxira est une société saoudienne basée à Riyad, et le studio est conçu autour du logement saoudien : il comprend le majlis (salon de réception), la salle à manger, les chambres du chauffeur et de l’employée de maison, et meuble dans un style najdi contemporain. Importez votre plan depuis n’importe quelle ville et voyez-le en 3D en quelques secondes.',
    facts: [['Riyad', 'siège de l’équipe'], ['Najdi', 'style local'], ['mada · Apple Pay', 'paiement']],
    sections: [
      {
        h: 'Pensé pour le logement saoudien',
        p: [
          'La plupart des outils de conception 3D sont pensés pour des logements occidentaux avec un seul séjour et une cuisine ouverte. Le logement saoudien est différent : un majlis pour les invités avec sa propre entrée, une salle à manger (maqlat) à proximité, un séjour familial séparé et des pièces de service pour le chauffeur, l’employée de maison et la buanderie.',
          'Le studio lit les noms de pièces en arabe sur le plan : majlis et séjours deviennent des espaces d’assise, les salles à manger sont meublées pour les repas, et les chambres du chauffeur et de l’employée, la buanderie et les rangements sont traités comme des espaces de service. Dans le style najdi contemporain, le majlis reçoit des assises au sol le long des murs.',
        ],
      },
      {
        h: 'Villas à Riyad et ailleurs : étages et annexes',
        p: [
          'Une villa saoudienne typique comprend un rez-de-chaussée avec majlis, salle à manger, séjour et cuisine, un étage pour les chambres et le salon familial, une annexe en toiture, et parfois une annexe extérieure et une chambre de chauffeur dans la cour.',
          'Importez chacun de ces niveaux dans son propre DXF et réglez la hauteur sous plafond de chacun. Si vous avez acheté la villa en gros œuvre (« adhm ») et préparez les finitions, c’est le meilleur moment pour concevoir : vous fixez agencement, style et quantités avant l’arrivée de l’entrepreneur.',
        ],
      },
      {
        h: 'Appartements à Riyad et Djeddah',
        ul: [
          'Les appartements en copropriété comptent souvent un séjour, un petit majlis et deux à quatre chambres. La maquette montre si le majlis est assez grand pour recevoir ou s’il vaut mieux l’ouvrir sur le séjour.',
          'Appartements en rez-de-chaussée avec cour : parcourez le séjour et la cuisine donnant sur la cour et décidez assises et ouvertures avant les finitions.',
          'Appartements en toiture : nommez la partie de toit ouverte « terrasse » sur le plan pour qu’elle ne reçoive que le revêtement de sol, sans peinture intérieure ni plafond.',
          'Achats sur plan : si vous avez le plan du logement fourni par le promoteur, voyez-le meublé avant la livraison et décidez des modifications tôt.',
        ],
      },
      {
        h: 'Comment les propriétaires du Royaume utilisent la 3D',
        ul: [
          'Avant les finitions : choisir un style, calculer les quantités de sol, de peinture et de faïence, et demander des devis de finition.',
          'Avant d’acheter les meubles : vérifier que canapés, lits et armoires tiennent dans les espaces.',
          'Pour vendre ou louer : publier une visite 3D de votre annonce immobilière avec lien et QR code pour 49 SAR par annonce, à partager sur les portails d’annonces et les réseaux sociaux.',
          'Pour les promoteurs : rendus et visites de chaque type de logement d’un programme, sur abonnement mensuel.',
        ],
      },
      {
        h: 'Prix, paiement et contact dans le Royaume',
        p: [
          `Les prix sont en riyals saoudiens hors TVA de 15 % : offre Express ${quick}, architecture intérieure ${perM2} avec un minimum de ${designMin}. L’offre Express se règle en ligne via Moyasar avec mada, Visa, Mastercard ou Apple Pay ; les autres offres font l’objet d’un devis et d’une facture après étude du plan.`,
          'Nous échangeons en arabe ou en anglais par WhatsApp ou e-mail, et l’équipe est à Riyad : 426 Al Sulaymaniyah, Al Urubah Rd.',
        ],
      },
    ],
    faq: [
      { q: 'Intervenez-vous à Djeddah, Dammam, La Mecque et dans d’autres villes ?', a: 'Oui. Le service est entièrement en ligne : importez le plan dans le studio ou joignez-le à votre commande, et la livraison est électronique où que vous soyez dans le Royaume.' },
      { q: 'Le studio lit-il les plans en arabe des bureaux d’études saoudiens ?', a: 'Oui. Il reconnaît les noms de calques arabes pour les murs, portes et fenêtres, ainsi que les noms de pièces arabes comme majlis, séjour, chambre et cuisine.' },
      { q: 'Puis-je payer avec mada ?', a: 'Oui. L’offre Express se règle via Moyasar avec mada, Visa, Mastercard ou Apple Pay.' },
      { q: 'Vais-je recevoir une facture ?', a: 'Oui, vous recevez une facture avec votre commande. Les prix publiés s’entendent hors TVA de 15 %.' },
      { q: 'J’ai une villa en gros œuvre. Quand commencer la conception ?', a: 'Avant l’intervention de l’entreprise de finition, car l’agencement et le style déterminent l’emplacement des points lumineux et des prises, les matériaux et les quantités.' },
    ],
    ctaTitle: 'Importez le plan de votre logement',
    ctaText: 'Depuis Riyad, Djeddah ou toute autre ville : ouvrez le studio et voyez votre logement en 3D en quelques secondes.',
  },

  gulf: {
    title: 'Architecture intérieure 3D aux Émirats et au Golfe | Oxira',
    description: 'Architecture intérieure 3D depuis vos plans AutoCAD pour appartements et villas aux Émirats, au Qatar, au Koweït, à Bahreïn et à Oman : m² ou pieds, majlis.',
    nav: 'Émirats et Golfe',
    card: 'Des townhouses de Dubaï aux maisons koweïtiennes avec sous-sol et annexe.',
    kicker: 'Émirats, Qatar, Koweït, Bahreïn et Oman',
    h1: 'Architecture intérieure 3D depuis vos plans aux Émirats et dans le Golfe',
    lead: 'Le service est entièrement en ligne : importez le plan de votre appartement ou de votre villa dans le studio depuis Dubaï, Doha, Koweït, Manama ou Mascate, voyez-le en 3D avec mobilier et surfaces en quelques secondes, puis demandez à notre équipe ce dont vous avez besoin.',
    facts: [['m² · ft²', 'mètres ou pieds'], ['Majlis', 'ameublement du Golfe'], ['En ligne', 'depuis tout pays']],
    sections: [
      {
        h: 'Termes et typologies varient d’un pays à l’autre',
        ul: [
          'Émirats : villas individuelles, townhouses (maisons de ville) et appartements en tour ; les annonces immobilières indiquent généralement les surfaces en pieds carrés.',
          'Koweït : la parcelle (« qasima ») et la maison familiale sur plusieurs niveaux, souvent avec un sous-sol (« sirdab ») et une annexe. Chacun s’importe comme un plan distinct.',
          'Qatar, Bahreïn et Oman : villas individuelles ou en résidence fermée (compound), souvent avec un majlis extérieur séparé de la maison.',
          'Dans tout le Golfe, le majlis (salon de réception) occupe une place centrale ; le studio reconnaît une pièce nommée majlis et la meuble comme un espace d’assise, avec des assises au sol dans le style najdi contemporain.',
        ],
      },
      {
        h: 'Mètres carrés ou pieds carrés ?',
        p: [
          'Le studio affiche les surfaces en mètres carrés. Pour convertir : 1 m² ≈ 10,764 pi², donc un appartement de 1 200 pi² fait environ 111 m².',
          'Si le dessin est en pieds, vérifiez que les unités d’insertion d’AutoCAD sont réglées sur Pieds (commande UNITS, échelle d’insertion) avant d’enregistrer le DXF, car le studio lit l’unité dans le fichier. S’il est en pouces, choisissez « Pouces » dans le menu des unités du dessin.',
        ],
      },
      {
        h: 'Plans en anglais ou en arabe',
        p: [
          'De nombreux plans du Golfe utilisent des noms de calques et de pièces en anglais, surtout ceux des grands bureaux d’études. Le studio comprend les deux : Walls, Doors et Windows ou leurs équivalents arabes, et même des noms normalisés comme A-WALL, A-DOOR et A-GLAZ.',
          'Pour les pièces, il reconnaît Bedroom, Kitchen, Living, Majlis, Maid’s room (chambre de l’employée de maison), Driver’s room (chambre du chauffeur) et Laundry ainsi que les noms arabes, pour que chaque pièce soit meublée et mesurée correctement.',
        ],
      },
      {
        h: 'Sous-sols, annexes et majlis extérieur',
        p: [
          'Une maison du Golfe compte généralement plus d’un plan : sous-sol, rez-de-chaussée, étage, annexe et majlis extérieur. Importez chacun dans son propre DXF et réglez la hauteur sous plafond de chacun, car sous-sols et annexes diffèrent souvent des étages principaux.',
          'Dans les offres de l’équipe, nous réunissons les étages en une seule maquette, et l’offre Complète ajoute façades et aménagement paysager.',
        ],
      },
      {
        h: 'Travailler avec nous depuis l’extérieur de l’Arabie saoudite',
        steps: [
          { t: 'Essayer le studio', d: 'Importez un DXF et découvrez la maquette, les surfaces et le mobilier. Sans inscription, et le fichier est traité dans votre navigateur.' },
          { t: 'Envoyer votre commande', d: 'Choisissez une offre et indiquez votre ville et votre pays. Vous pouvez joindre des fichiers DWG ou PDF jusqu’à 15 Mo.' },
          { t: 'Paiement', d: 'Les prix sont en riyals saoudiens. L’offre Express se règle en ligne par carte ou Apple Pay via Moyasar ; les autres offres font l’objet d’un devis sous un jour ouvré.' },
          { t: 'Livraison', d: 'Rendus et fichiers sont livrés par voie électronique, et nous échangeons en arabe ou en anglais par WhatsApp ou e-mail.' },
        ],
      },
    ],
    faq: [
      { q: 'Le service est-il disponible aux Émirats, au Qatar, au Koweït, à Bahreïn et à Oman ?', a: 'Oui. Le service est entièrement en ligne, nous acceptons des plans de tous pays et le site est disponible en arabe et en anglais.' },
      { q: 'Mon plan est dessiné en pieds. Le studio peut-il le lire ?', a: 'Oui, si les unités d’insertion du fichier sont réglées sur Pieds. Les surfaces s’affichent en m² ; multipliez par 10,764 pour obtenir des pieds carrés.' },
      { q: 'Dans quelle devise dois-je payer ?', a: 'Les prix sont en riyals saoudiens. Les clients du Golfe règlent l’offre Express par carte ou Apple Pay, et les autres offres sur devis et facture.' },
      { q: 'Travaillez-vous avec des promoteurs immobiliers du Golfe ?', a: 'Oui. L’abonnement promoteur couvre les rendus et visites virtuelles de jusqu’à 10 types de logements par mois, et nous accueillons volontiers des projets hors du Royaume.' },
    ],
    ctaTitle: 'Essayez avec votre plan, depuis n’importe quel pays',
    ctaText: 'Ouvrez le studio, importez un DXF et voyez votre appartement ou votre villa en 3D en quelques secondes.',
  },

  egypt: {
    title: 'Appartement en 3D en Égypte avant finitions | Oxira',
    description: 'Votre appartement, duplex ou villa en 3D en Égypte avant les finitions, depuis un plan AutoCAD, avec le métré carrelage, peinture et placo gratuit.',
    nav: 'Égypte',
    card: 'Appartement semi-fini ? Voyez-le en 3D et calculez d’abord le métré des finitions.',
    kicker: 'Égypte',
    h1: 'Conception d’appartement en 3D en Égypte, avant les finitions',
    lead: 'Vous avez reçu un logement semi-fini dans un compound ou un immeuble ? Importez le plan AutoCAD et voyez-le en 3D avec mobilier et surfaces en quelques secondes, puis calculez carrelage, peinture et plafonds avant de vous engager avec une entreprise de finition.',
    facts: [['Semi-fini', 'le moment idéal'], ['Gratuit', 'maquette et métré'], ['En ligne', 'du Caire à toute ville']],
    sections: [
      {
        h: 'Logement semi-fini : le bon moment pour concevoir',
        p: [
          'En Égypte, de nombreux logements sont livrés semi-finis (« nos tashteeb ») ou au stade de l’enduit, et c’est le propriétaire qui choisit le niveau de finition : lux, super lux ou ultra super lux. Avant l’arrivée du plombier et de l’électricien, vous devez savoir où tout ira : lits, télévision, cuisine et climatiseurs, car ils déterminent l’emplacement des prises, des points lumineux et des canalisations.',
          'Une maquette 3D montre tout cela avant que les décisions ne se transforment en démolitions et en reprises.',
        ],
      },
      {
        h: 'Les noms de pièces tels qu’écrits sur les plans égyptiens',
        p: ['Le studio reconnaît le type d’une pièce au nom écrit à l’intérieur et la meuble en conséquence. La plupart des noms égyptiens sont compris directement :'],
        ul: [
          '« نوم », « أوضة نوم » ou « Master » : chambre.',
          '« سفرة » : salle à manger ; « مطبخ » (cuisine) et « حمام » (salle de bains) tels quels.',
          '« تراس » et « بلكونة » : espaces extérieurs qui ne reçoivent que le revêtement de sol.',
          '« استقبال », « صالة » ou Reception : espace de séjour.',
        ],
        tip: 'Le mot « ريسبشن » écrit en lettres arabes n’est pas reconnu automatiquement ; écrivez « استقبال » ou Reception, ou modifiez le type de pièce après l’import.',
      },
      {
        h: 'Duplex, toit-terrasse, penthouse et villa',
        ul: [
          'Duplex : importez chaque niveau dans son propre DXF et vérifiez la position de l’escalier intérieur sur les deux niveaux.',
          'Toit-terrasse et penthouse : nommez la partie ouverte du toit « terrasse » (تراس) pour que son revêtement de sol soit compté à part, sans peinture ni plafond.',
          'Townhouses, twin houses et villas individuelles en compound : chaque étage est un plan distinct, et façades et jardins relèvent de notre offre Complète.',
        ],
      },
      {
        h: 'Le métré des finitions dans les termes de l’entrepreneur',
        p: [
          'Le tableau des quantités du studio donne pour chaque pièce la surface de sol avec 10 % de chutes (céramique ou grès cérame), la surface de peinture déduction faite des portes et fenêtres, la faïence des salles de bains et de la cuisine, la surface de plafond pour le placo et les plinthes en mètres linéaires.',
          'Téléchargez le tableau en CSV et demandez à chaque entrepreneur un prix au mètre carré par poste, puis comparez les offres sur les mêmes quantités. N’oubliez pas qu’il s’agit d’estimations ; les mesures définitives se prennent sur place.',
        ],
      },
      {
        h: 'Prix et paiement depuis l’Égypte',
        p: [
          `Le studio, la maquette 3D et le métré sont gratuits. Les offres de l’équipe sont en riyals saoudiens hors TVA : Express ${quick}, architecture intérieure ${perM2} avec un minimum de ${designMin}. Le paiement en ligne se fait par carte bancaire, et pour toute question sur le paiement, écrivez-nous sur WhatsApp.`,
        ],
      },
    ],
    faq: [
      { q: 'Le service est-il disponible en Égypte ?', a: 'Oui, il est entièrement en ligne. Importez le plan dans le studio depuis n’importe quelle ville d’Égypte, commandez auprès de l’équipe et recevez les fichiers par voie électronique.' },
      { q: 'Mon ingénieur m’a envoyé le plan en PDF. Que faire ?', a: 'Demandez le DWG AutoCAD et enregistrez-le en DXF, ou envoyez le PDF avec une commande de l’offre Express et l’équipe le convertit en maquette.' },
      { q: 'Le studio calcule-t-il l’électricité et la plomberie ?', a: 'Non, il couvre les postes de finition architecturale : sols, peinture, faïence, plafonds et plinthes. Placer le mobilier dans la maquette vous aide toutefois à décider de l’emplacement des prises et des points lumineux.' },
      { q: 'Les prix sont-ils en livres égyptiennes ?', a: 'Les prix publiés sont en riyals saoudiens et le studio lui-même est gratuit. Pour les offres payantes, votre banque convertit le montant lors du paiement par carte.' },
      { q: 'Quel style pour un petit appartement ?', a: 'Essayez le moderne et le scandinave et comparez-les sous le même angle ; les couleurs claires et le mobilier simple agrandissent visuellement les espaces.' },
    ],
    ctaTitle: 'Voyez votre appartement avant les finitions',
    ctaText: 'Importez le plan de l’appartement dans le studio gratuit et calculez le métré des finitions dans la foulée.',
  },
};

export const ui: GuideUi = {
  home: 'Accueil',
  hub: 'Services et guides',
  hubTitle: 'Services et guides de conception 3D | Oxira Design',
  hubDescription: 'Tous les services Oxira Design réunis : plan AutoCAD en 3D, appartement et villa en 3D, rendus photoréalistes, décoration par IA et métré des finitions.',
  hubKicker: 'Services et guides',
  hubH1: 'Services de conception 3D, du plan au rendu photoréaliste',
  hubLead: 'Choisissez selon votre situation : vous avez un plan AutoCAD et voulez le voir en 3D, vous préparez les finitions d’un appartement ou d’une villa, ou vous avez la photo d’une pièce et voulez vite une idée de décoration. Chaque page détaille les étapes, les fichiers nécessaires et ce que vous obtenez.',
  services: 'Services',
  servicesLead: 'Des guides pratiques pour chaque service : fonctionnement, fichiers acceptés, ce qui est automatique et ce que fait notre équipe.',
  regions: 'Par pays',
  regionsLead: 'Le même service en ligne, avec ce qui change dans chaque pays : vocabulaire, appartements et villas types, unités et paiement.',
  which: {
    h: 'Par où commencer ?',
    items: [
      'Vous avez un fichier AutoCAD (DWG ou DXF) d’un appartement ou d’une villa : commencez par le studio gratuit, qui vous donne la maquette, les surfaces et les quantités en quelques secondes.',
      'Vous n’avez qu’une photo d’une pièce : essayez la décoration par IA. Votre premier rendu de la journée est gratuit.',
      'Vous avez besoin d’images réalistes pour la commercialisation ou d’un fichier 3ds Max pour votre designer ou entrepreneur : commandez l’une des offres de l’équipe après avoir essayé le studio.',
      'Vous allez lancer les travaux de finition et voulez comparer les devis : téléchargez le tableau des quantités depuis le studio ou demandez des devis de finition.',
    ],
  },
  open: 'Lire le guide',
  steps: 'Étapes',
  faq: 'Questions fréquentes',
  related: 'Pages associées',
  allServices: 'Tous les services et guides',
  onThisPage: 'Sur cette page',
  note: 'Sans inscription. Votre fichier est traité dans votre navigateur.',
  breadcrumb: 'Fil d’Ariane',
  homeSection: { label: 'Services et guides', title: 'Des guides pratiques pour chaque besoin', more: 'Tous les services et guides' },
};
