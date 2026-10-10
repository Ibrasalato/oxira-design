// German copy for the SEO landing pages (translated from guides-en.ts). Prices come from PRICES / REDESIGN_PACKS.
import { PRICES } from '../content';
import { REDESIGN_PACKS } from '../redesign';
import type { GuideCopy, GuideSlug, GuideUi } from '../guides';

const n = (x: number) => x.toLocaleString('de-DE');
const [p10, p30, p100] = REDESIGN_PACKS;
const quick = `${n(PRICES.quick)} SAR`;
const perM2 = `${n(PRICES.designPerM2)} SAR pro m²`;
const designMin = `${n(PRICES.designMin)} SAR`;

export const guides: Record<GuideSlug, GuideCopy> = {
  'autocad-to-3d': {
    title: 'AutoCAD Grundriss in 3D umwandeln (DXF/DWG) | Oxira',
    description: 'AutoCAD Grundriss online in 3D umwandeln: Wände, Türen, Fenster, Raumflächen, Möbel und Rundgang in Sekunden im Browser. DWG und PDF über unser Team.',
    nav: 'AutoCAD-Grundriss in 3D',
    card: 'DXF hochladen und den Grundriss in Sekunden in 3D sehen – mit Flächen und Möbeln.',
    kicker: 'Von 2D zu 3D',
    h1: 'AutoCAD-Grundriss in 3D umwandeln – direkt im Browser',
    lead: 'Laden Sie eine aus AutoCAD gespeicherte DXF-Datei hoch, und das Oxira Studio erstellt in Sekunden ein 3D-Modell mit Wänden, Türen, Fenstern und der Fläche jedes Raums. Ohne Registrierung, ohne Installation.',
    facts: [['DXF', 'direkt eingelesen'], ['DWG · PDF', 'über unser Team'], ['Kostenlos', 'Modell und Flächen']],
    sections: [
      {
        h: 'So wird aus einer 2D-Zeichnung ein 3D-Modell',
        p: [
          'Ein AutoCAD-Grundriss besteht im Kern aus Linien, Bögen und Texten, verteilt auf Layer. Das Studio liest diese Layer und erkennt anhand ihrer Namen, welche Rolle sie spielen: Wände, Türen, Fenster – und was ignoriert werden soll, etwa Bemaßungen, Schraffuren, gezeichnete Möbel und Achsraster.',
          'Anschließend werden die Wände auf die von Ihnen gewählte Raumhöhe extrudiert, Tür- und Fensteröffnungen an den richtigen Stellen ausgeschnitten, geschlossene Räume erkannt und vermessen. Raumbezeichnungen in der Zeichnung wie „Schlafzimmer“, „Küche“ oder „Majlis“ (arabischer Empfangsraum) werden gelesen, damit jeder Raum passend möbliert wird.',
          'All das geschieht in Ihrem Browser. Während Sie das Studio nutzen, wird die Datei nicht auf unsere Server hochgeladen – Sie können es also bedenkenlos mit dem Grundriss Ihres eigenen Zuhauses ausprobieren.',
        ],
      },
      {
        h: 'Schritt für Schritt',
        steps: [
          { t: 'Grundriss als DXF speichern', d: 'Öffnen Sie die Zeichnung in AutoCAD und speichern Sie sie als DXF (Version 2013 oder neuer). Enthält die Datei mehrere Grundrisse oder Blätter, kopieren Sie den benötigten Grundriss zuerst in eine eigene Datei.' },
          { t: 'Im Studio hochladen', d: 'Ziehen Sie die Datei auf die Studio-Seite oder wählen Sie sie auf Ihrem Gerät aus, bis 40 MB. Alternativ starten Sie mit einem der Beispielgrundrisse.' },
          { t: 'Layer und Einheiten prüfen', d: 'Das Studio listet die erkannten Layer und ihre Rollen auf. Fehlen Wände, weisen Sie dem richtigen Layer die Rolle „Wände“ zu und bauen das Modell neu auf. Prüfen Sie außerdem die Zeichnungseinheiten (mm, cm, m oder Zoll) und die Raumhöhe.' },
          { t: 'Erkunden und begehen', d: 'Wechseln Sie zwischen 3D-Ansicht, Draufsicht und Begehungsmodus, schneiden Sie die Wände ab, um den Grundriss von oben zu sehen, und wählen Sie einen Stil, um die Möblierung zu ändern.' },
          { t: 'Exportieren oder ans Team übergeben', d: 'Laden Sie ein PNG oder ein GLB- bzw. OBJ-Modell in Metern herunter – oder beauftragen Sie unser Team mit fotorealistischen Renderings und einer fertigen 3ds Max-Datei.' },
        ],
      },
      {
        h: 'DXF aus AutoCAD exportieren',
        ul: [
          'Datei › Speichern unter, dann unter „Dateityp“ AutoCAD 2013 DXF oder eine neuere Version wählen.',
          'Oder in der Befehlszeile DXFOUT eingeben und Speicherort sowie Version wählen.',
          'Löschen oder frieren Sie vor dem Speichern nicht benötigte Layer wie Bemaßungen, Schriftfelder und Rahmen ein. Das beschleunigt das Einlesen und reduziert Fehler.',
          'Schreiben Sie jede Raumbezeichnung als Text in den Raum (TEXT oder MTEXT), auf Englisch oder Arabisch, damit das Studio den Raumtyp erkennt.',
          'Sie arbeiten mit Revit, ArchiCAD oder BricsCAD? Exportieren Sie den Grundriss über das Export-Menü als DXF.',
        ],
      },
      {
        h: 'Und was ist mit DWG- und PDF-Dateien?',
        p: [
          'DWG ist das native AutoCAD-Format und kann von Browsern nicht direkt gelesen werden. Am schnellsten speichern Sie die Datei wie oben beschrieben als DXF – das dauert keine Minute.',
          `Haben Sie kein AutoCAD oder liegt der Grundriss nur als PDF vor, senden Sie ihn mit einer Bestellung des Quick-Pakets (${quick} zzgl. MwSt.). Unser Team bereinigt die Zeichnung, konvertiert sie und korrigiert das Modell.`,
        ],
      },
      {
        h: 'Das erhalten Sie',
        ul: [
          'Ein 3D-Modell mit Wänden in realer Höhe sowie Türen und Fenstern in den Maßen Ihrer Zeichnung.',
          'Die Fläche jedes Raums und die Gesamtfläche.',
          'Geschätzte Mengen für Bodenbelag, Wandfarbe, Decken, Sockelleisten und Wandfliesen in Bad und Küche – als CSV herunterladbar.',
          'Eine erste Möblierung für jeden Raumtyp in fünf Stilen: modern, klassisch, zeitgenössisch-nadschdisch, skandinavisch und luxuriös.',
          'Einen virtuellen Rundgang, Raum für Raum.',
          'Export als PNG, GLB und OBJ, der sich in 3ds Max, Blender und SketchUp öffnen lässt.',
        ],
      },
      {
        h: 'Tipps für ein saubereres Ergebnis',
        ul: [
          'Wandlinien an den Ecken verbinden: Ein nicht geschlossener Raum kann nicht vermessen werden.',
          'Layer eindeutig benennen, etwa Walls, Doors und Windows bzw. Wände, Türen und Fenster.',
          'Türen und Fenster als Blöcke zeichnen – das Studio nutzt sie, um jede Öffnung zuzuordnen.',
          'Ein Grundriss pro Datei: jedes Geschoss in einer eigenen DXF.',
          'Wirkt das Modell falsch skaliert, stellen Sie die Zeichnungseinheiten im Layer-Bereich manuell ein und bauen es neu auf.',
        ],
      },
    ],
    faq: [
      { q: 'Ist die Umwandlung eines Grundrisses in 3D kostenlos?', a: 'Ja. Modell, Flächen, geschätzte Mengen, Möblierung, Rundgang und Exporte sind im Studio kostenlos und ohne Registrierung. Sie bezahlen nur für die Arbeit unseres Teams, etwa fotorealistische Renderings und eine 3ds Max-Datei.' },
      { q: 'Welche DXF-Version sollte ich verwenden?', a: 'Am besten 2013 oder neuer. Schlägt das Einlesen fehl, speichern Sie erneut als DXF 2013 und versuchen es noch einmal.' },
      { q: 'Versteht das Studio arabische Layer- und Raumnamen?', a: 'Ja. Es erkennt arabische und englische Layernamen für Wände, Türen und Fenster sowie Raumbezeichnungen wie Schlafzimmer, Küche, Bad, Wohnzimmer und Majlis in beiden Sprachen.' },
      { q: 'Mein Grundriss hat mehrere Geschosse. Wie lade ich ihn hoch?', a: 'Laden Sie jedes Geschoss als separate DXF hoch. Liegen alle Geschosse in einer Zeichnung, kopieren Sie jeden Grundriss vor dem Speichern in eine neue Datei.' },
      { q: 'Kann ich ein PDF oder ein Bild in 3D umwandeln?', a: 'Im Studio selbst nicht, da es echte CAD-Geometrie benötigt. Senden Sie das PDF mit einer Bestellung des Quick-Pakets, und unser Team konvertiert es.' },
      { q: 'Lässt sich das Modell in 3ds Max öffnen?', a: 'Ja. GLB- und OBJ-Exporte sind in Metern und öffnen sich in aktuellen 3ds Max-Versionen. Die Team-Pakete enthalten eine strukturierte .max-Datei mit Layern und Materialien.' },
    ],
    ctaTitle: 'Probieren Sie es mit Ihrem eigenen Grundriss',
    ctaText: 'Öffnen Sie das Studio und laden Sie eine DXF hoch – oder starten Sie mit einem Beispielgrundriss und sehen Sie das Ergebnis in Sekunden.',
  },

  'apartment-3d-design': {
    title: 'Wohnung 3D planen online aus dem Grundriss | Oxira',
    description: 'Wohnung online in 3D planen aus dem AutoCAD-Grundriss: automatische Möblierung, fünf Stile, Raumflächen und Rundgang, dazu Renderings oder komplette Planung.',
    nav: 'Wohnung in 3D planen',
    card: 'Sehen Sie Ihre Wohnung möbliert in 3D – vor dem Innenausbau und dem Möbelkauf.',
    kicker: 'Für Wohnungen',
    h1: 'Wohnung online in 3D planen: sehen, bevor Sie ausbauen',
    lead: 'Laden Sie den Grundriss Ihrer Wohnung hoch und sehen Sie sie in Sekunden in 3D, mit Möbeln und Raumflächen. So legen Sie Stil und Aufteilung fest, bevor der Innenausbau beginnt oder Sie auch nur ein Möbelstück kaufen.',
    facts: [['Sekunden', 'vom Grundriss zu 3D'], ['5', 'Einrichtungsstile'], [`${n(PRICES.designPerM2)} SAR`, 'pro m², komplette Planung']],
    sections: [
      {
        h: 'Warum eine Wohnung zuerst in 3D planen?',
        p: [
          'In einer Wohnung zählt jeder Zentimeter: wo das Sofa vor dem Fernseher steht, in welche Richtung die Schlafzimmertür aufgeht, wie viel Platz zwischen Bett und Kleiderschrank bleibt, wie viel Bewegungsfläche die Küche bietet. Auf einem Papiergrundriss ist das nicht offensichtlich – bei einem 3D-Rundgang durch die Wohnung sofort.',
          'Das Modell erleichtert auch die Abstimmung mit Familie, Innenarchitekt und Handwerkern. Statt eine Idee zu beschreiben, senden Sie eine Ansicht oder eine Datei, und alle sehen dasselbe.',
        ],
      },
      {
        h: 'So planen Sie Ihre Wohnung online',
        steps: [
          { t: 'Grundriss besorgen', d: 'Fragen Sie den Bauträger, das Planungsbüro oder den Vorbesitzer nach der AutoCAD-Datei. Liegt sie als DWG vor, speichern Sie sie in AutoCAD als DXF oder lassen Sie sich eine DXF-Kopie geben.' },
          { t: 'Im Studio hochladen', d: 'In Sekunden erstellt das Studio Wände, Türen und Fenster und vermisst Wohnzimmer, Schlafzimmer, Küche, Bäder und Balkon.' },
          { t: 'Stil wählen', d: 'Wechseln Sie zwischen modern, klassisch, zeitgenössisch-nadschdisch, skandinavisch und luxuriös; eine erste Möblierung wird je nach Raumtyp angeordnet.' },
          { t: 'Begehen und entscheiden', d: 'Bewegen Sie sich im Begehungsmodus auf Augenhöhe durch die Wohnung und schneiden Sie die Wände ab, um den gesamten Grundriss von oben zu sehen.' },
          { t: 'Bei Bedarf ans Team übergeben', d: 'Bestellen Sie fotorealistische Renderings oder eine komplette Innenarchitektur mit Materialien, Farben und Beleuchtung. Ihr Studio-Entwurf wird der Bestellung automatisch beigefügt.' },
        ],
      },
      {
        h: 'Das zeigt Ihnen das Wohnungsmodell',
        ul: [
          'Wohnzimmer mit Sofas und Couchtisch, Schlafzimmer mit Betten und Kleiderschränken.',
          'Küche und Bäder mit Grundausstattung, dazu Balkon oder Terrasse.',
          'Die Fläche jedes Raums in m² und die Gesamtwohnfläche.',
          'Geschätzte Mengen für Bodenbelag, Wandfarbe, Fliesen, Decken und Sockelleisten – hilfreich beim Vergleich von Ausbauangeboten.',
          'PNG-Ansichten zum Teilen sowie ein GLB- oder OBJ-Modell für alle, die in einem anderen Programm weiterarbeiten.',
        ],
      },
      {
        h: 'Vom kostenlosen Modell zur kompletten Innenarchitektur',
        p: ['Modell und erste Möblierung sind im Studio kostenlos und reichen, um die Aufteilung zu verstehen und eine Richtung festzulegen. Brauchen Sie realistische Bilder oder Produktionsdateien, gibt es zwei Team-Pakete:'],
        ul: [
          `Quick (${quick} zzgl. MwSt.): Bereinigung des Grundrisses und Modellkorrektur, 8 hochauflösende Renderings, 3ds Max- und GLB-Dateien sowie eine Mengentabelle als PDF innerhalb von 48 Arbeitsstunden.`,
          `Innenarchitektur (${perM2}, mindestens ${designMin}, zzgl. MwSt.): Eine Designerin oder ein Designer plant mit Ihnen jeden Raum, 15 V-Ray-Renderings, ein teilbarer 360°-Rundgang und zwei Korrekturschleifen. Beispiel: Eine 120-m²-Wohnung kostet ${n(120 * PRICES.designPerM2)} SAR zzgl. MwSt., Lieferung je nach Größe in 5 bis 10 Arbeitstagen.`,
        ],
      },
      {
        h: 'Praktische Tipps für die Wohnungsplanung',
        ul: [
          'Lassen Sie bequeme Laufwege zwischen den Möbeln und beurteilen Sie den Platz beim Rundgang durch das Modell, nicht nur anhand des Grundrisses.',
          'Prüfen Sie die Türaufschläge, besonders bei Schlafzimmer- und Badtüren in der Nähe von Kleiderschränken.',
          'In kleinen Wohnungen lassen helle Farben und niedrige Möbel Räume größer wirken; vergleichen Sie den skandinavischen und den modernen Stil.',
          'Legen Sie die Positionen von Fernseher, Betten und Schreibtischen vor dem Ausbau fest, denn danach richten sich Steckdosen und Leuchten.',
          'Erstellen Sie pro Stil eine Ansicht aus demselben Blickwinkel und vergleichen Sie sie mit Ihrer Familie, bevor Sie sich entscheiden.',
        ],
      },
    ],
    faq: [
      { q: 'Ich habe keine AutoCAD-Datei meiner Wohnung. Was kann ich tun?', a: 'Fragen Sie den Bauträger oder das Planungsbüro, das das Gebäude entworfen hat. Haben Sie nur ein PDF, senden Sie es mit einer Bestellung des Quick-Pakets, und unser Team erstellt daraus ein Modell.' },
      { q: 'Sind die Möbel im Modell maßstabsgetreu?', a: 'Die automatische Möblierung ist ein erster Entwurf mit Möbeln in Standardgrößen je Raumtyp, damit Sie Aufteilung und Platz einschätzen können. Konkrete Möbelstücke mit exakten Maßen wählen Sie im Innenarchitektur-Paket gemeinsam mit einer Designerin oder einem Designer.' },
      { q: 'Was kostet die komplette Planung einer Wohnung?', a: `Das Studio-Modell ist kostenlos. Eine komplette Innenarchitektur kostet ${perM2}, mindestens ${designMin}, zzgl. 15 % MwSt.; das Quick-Paket kostet ${quick}.` },
      { q: 'Arbeiten Sie auch für Wohnungen in Ägypten und am Golf?', a: 'Ja. Der Service läuft vollständig online, und wir nehmen Grundrisse aus jedem Land an. Was lokal anders ist, erfahren Sie auf den Seiten zu Ägypten und den Golfstaaten.' },
      { q: 'Kann ich den Entwurf mit meinem Bauunternehmer teilen?', a: 'Ja. Laden Sie PNG-Ansichten und die Mengentabelle als CSV herunter oder exportieren Sie GLB bzw. OBJ. Die Team-Pakete ergänzen eine .max-Datei und hochauflösende Renderings.' },
    ],
    ctaTitle: 'Sehen Sie Ihre Wohnung noch heute in 3D',
    ctaText: 'Laden Sie den Wohnungsgrundriss ins kostenlose Studio hoch und wählen Sie Ihren Stil, bevor der Innenausbau beginnt.',
  },

  'villa-3d-design': {
    title: 'Villa 3D planen aus AutoCAD-Grundrissen | Oxira Design',
    description: 'Villa in 3D planen aus AutoCAD-Grundrissen: jedes Geschoss als 3D-Modell mit Flächen, Möbeln und Majlis, dazu Renderings, Fassaden und Innenarchitektur.',
    nav: 'Villa in 3D planen',
    card: 'Jedes Villengeschoss in 3D – inklusive Majlis, Familienwohnbereich und Nebenräumen.',
    kicker: 'Für Villen und Häuser',
    h1: 'Villa in 3D planen – aus Ihren AutoCAD-Grundrissen',
    lead: 'Eine Villa ist eine große Entscheidung mit vielen Bereichen: Majlis (Empfangsraum für Gäste), Essbereich, Familienwohnbereich, Schlafzimmer und Nebengebäude. Laden Sie den Grundriss jedes Geschosses hoch und sehen Sie es in 3D mit Möbeln und Flächen, bevor der Ausbau beginnt.',
    facts: [['Jedes Geschoss', 'eigenes Modell'], ['Majlis', 'arabische Sitzecke'], ['Innen + außen', 'Komplett-Paket']],
    sections: [
      {
        h: 'Warum eine Villa eine 3D-Planung braucht',
        p: [
          'In einer Villa überschneiden sich Gäste-, Familien- und Servicebereiche, und Fehler in der Raumaufteilung sind nach dem Ausbau schwer zu korrigieren: ein Herren-Majlis mit Blick in den Familienbereich, eine Küche weit weg vom Esszimmer, eine Treppe, die das Obergeschoss zerschneidet. Ein 3D-Modell macht diese Zusammenhänge sichtbar, bevor sie Geld kosten.',
          'Da die Budgets für Ausbau und Einrichtung einer Villa hoch sind, hilft es, jedes Geschoss möbliert und vermessen zu sehen – so verteilen Sie das Budget sicher auf Geschosse und Räume.',
        ],
      },
      {
        h: 'Was automatisch geschieht und was das Team übernimmt',
        ul: [
          'Automatisch im Studio: Wände und Öffnungen jedes Geschosses, Raumerkennung und Flächen, eine erste Möblierung inklusive Majlis mit Bodensitzen im nadschdischen Stil, geschätzte Mengen und ein Rundgang.',
          'Durch das Team: Bereinigung großer Grundrisse und DWG-Dateien, Innenarchitektur nach Ihrem Geschmack mit Materialien, Farben und Beleuchtung, V-Ray- oder Corona-Renderings und eine strukturierte 3ds Max-Datei.',
          'Im Komplett-Paket: Innen- und Außenplanung, Fassaden und Landschaftsgestaltung, Ausführungspläne für den Bauunternehmer, ein animiertes Rundgangsvideo und eine eigene Projektleitung.',
        ],
      },
      {
        h: 'Villengrundrisse vorbereiten und hochladen',
        steps: [
          { t: 'Geschosse trennen', d: 'Speichern Sie jedes Geschoss (Erdgeschoss, Obergeschoss, Dachaufbau bzw. Nebengebäude und ggf. Keller) als eigene DXF, denn das Studio baut jeweils einen Grundriss auf.' },
          { t: 'Räume in der Zeichnung benennen', d: 'Schreiben Sie Bezeichnungen wie Majlis, Wohnen, Essen, Schlafen, Küche und Fahrerzimmer in jeden Raum, damit das Studio ihn erkennen und möblieren kann.' },
          { t: 'Raumhöhe pro Geschoss festlegen', d: 'Passen Sie die Raumhöhe im Layer-Bereich für jedes Geschoss an; Erdgeschoss und Nebengebäude unterscheiden sich oft.' },
          { t: 'Prüfen und exportieren', d: 'Begehen Sie jedes Geschoss, laden Sie die Mengentabelle pro Geschoss herunter und senden Sie die Dateien mit Ihrer Bestellung, wenn Sie Renderings oder eine komplette Planung benötigen.' },
        ],
      },
      {
        h: 'Was die Planung einer Villa kostet',
        p: [
          `Die Innenarchitektur wird nach Fläche berechnet: ${perM2} zzgl. MwSt., mindestens ${designMin}. Eine Villa mit 400 m² Innenfläche kostet zum Beispiel ${n(400 * PRICES.designPerM2)} SAR zzgl. MwSt. – inklusive aller Räume, 15 V-Ray-Renderings, einem 360°-Rundgang und zwei Korrekturschleifen.`,
          'Das Komplett-Paket mit Fassaden, Landschaftsgestaltung und Ausführungsplänen wird nach Prüfung der Grundrisse projektbezogen angeboten; das Angebot erhalten Sie innerhalb eines Arbeitstages.',
        ],
      },
      {
        h: 'Tipps für die Villenplanung',
        ul: [
          'Trennen Sie die Wege von Gästen und Familie: Legen Sie zuerst den Majlis-Eingang und das Gäste-WC fest.',
          'Planen Sie das Esszimmer nah an der Küche oder einer Vorbereitungsküche und prüfen Sie die Entfernung beim Rundgang durch das Modell.',
          'Kontrollieren Sie die Treppenposition auf jedem Geschoss und stellen Sie sicher, dass Schlafzimmer nicht über Gästebereiche erreicht werden.',
          'Geben Sie Nebenräumen, Hauswirtschaftsraum und Abstellraum praxistaugliche Größen – sie beeinflussen den Alltag stärker als gedacht.',
          'Vergleichen Sie für Wohnzimmer und Majlis, die Räume, die Gäste am häufigsten sehen, mindestens zwei Stile.',
        ],
      },
    ],
    faq: [
      { q: 'Kann ich die ganze Villa in einer Datei hochladen?', a: 'Das Studio baut jeweils einen Grundriss auf; laden Sie daher jedes Geschoss als separate DXF hoch. In den Planungspaketen fügt unser Team die Geschosse zu einem Modell zusammen.' },
      { q: 'Planen Sie auch Außenfassaden?', a: 'Ja, im Komplett-Paket zusammen mit der Landschaftsgestaltung. Das kostenlose Studio konzentriert sich auf Innengrundrisse.' },
      { q: 'Unterstützt das Studio einen arabischen Majlis?', a: 'Ja. Ein Raum mit der Bezeichnung Majlis wird als Sitz- und Empfangsbereich behandelt und erhält im zeitgenössisch-nadschdischen Stil Bodensitze entlang der Wände.' },
      { q: 'Wie lange dauert die komplette Planung einer Villa?', a: 'Die Innenarchitektur dauert je nach Größe 5 bis 10 Arbeitstage. Beim Komplett-Paket wird der Zeitrahmen im Angebot entsprechend dem Projektumfang festgelegt.' },
      { q: 'Erhalte ich Dateien für meinen Bauunternehmer?', a: 'Die Team-Pakete enthalten eine strukturierte .max-Datei und hochauflösende Renderings; das Komplett-Paket ergänzt Ausführungspläne für den Bauunternehmer.' },
    ],
    ctaTitle: 'Beginnen Sie mit dem Erdgeschoss',
    ctaText: 'Laden Sie den ersten Geschossgrundriss ins kostenlose Studio hoch, sehen Sie ihn in 3D und beauftragen Sie dann das Team mit der kompletten Planung.',
  },

  'interior-renders': {
    title: 'Innenraum-Visualisierung & 3ds Max-Dateien | Oxira',
    description: 'Fotorealistische Innenraum-Visualisierung mit V-Ray oder Corona und eine strukturierte 3ds Max-Datei aus Ihrem AutoCAD-Grundriss. Quick-Paket in 48 Stunden.',
    nav: 'Renderings & 3ds Max',
    card: 'Fotorealistische V-Ray- oder Corona-Bilder und eine strukturierte .max-Datei aus Ihrem Grundriss.',
    kicker: 'Innenraum-Visualisierung',
    h1: 'Fotorealistische Innenraum-Renderings und eine fertige 3ds Max-Datei',
    lead: 'Vom AutoCAD-Grundriss zu fotorealistischen Innenraumbildern und einer strukturierten 3ds Max-Datei, auf der Ihr Innenarchitekt oder Bauunternehmer aufbauen kann – mit klaren Paketen und veröffentlichten Preisen.',
    facts: [['V-Ray · Corona', 'Render-Engines'], ['.max · GLB', 'gelieferte Dateien'], ['48 Stunden', 'Quick-Paket']],
    sections: [
      {
        h: 'KI-Renderings oder fotorealistische Renderings vom Team',
        p: [
          'Im Studio verwandeln Sie jede Ansicht des Modells in unter einer Minute per KI in ein realistisches Bild, mit 3 kostenlosen Renderings pro Tag. Ideal, um Ideen und Stile schnell zu erkunden – die Bilder sind jedoch frei interpretiert und entsprechen nicht unbedingt den realen Maßen.',
          'Ein fotorealistisches Rendering unseres Teams basiert auf einem 3D-Modell, das exakt auf die Maße Ihres Grundrisses abgestimmt ist, mit definierten Materialien und Beleuchtung in 3ds Max, gerendert mit V-Ray oder Corona. Genau das brauchen Sie, um Ihrer Familie einen Entwurf zu präsentieren, eine Immobilie zu vermarkten oder einem Bauunternehmer eine klare Vorgabe zu geben.',
        ],
      },
      {
        h: 'Was die Pakete enthalten',
        ul: [
          `Quick (${quick} zzgl. MwSt.): Bereinigung des Grundrisses und Modellkorrektur, DWG und PDF werden akzeptiert, 8 hochauflösende Renderings, eine 3ds Max-Datei (.max) und eine GLB-Datei sowie eine Mengentabelle als PDF – innerhalb von 48 Arbeitsstunden.`,
          `Innenarchitektur (${perM2}, mindestens ${designMin}, zzgl. MwSt.): komplette Planung der Einheit, Materialien, Farben und Beleuchtung, 15 fotorealistische V-Ray-Renderings, ein teilbarer 360°-Rundgang und zwei Korrekturschleifen mit strukturierter .max-Datei.`,
          'Komplett (Angebot pro Projekt): Innen- und Außenplanung, Fassaden und Landschaftsgestaltung, Ausführungspläne, ein animiertes Rundgangsvideo und eine eigene Projektleitung.',
        ],
      },
      {
        h: 'Warum die 3ds Max-Datei wichtig ist',
        p: [
          'Viele Designer beginnen bei null und zeichnen die Wände in 3ds Max nach – das kostet Stunden vor dem ersten Rendering. Eine strukturierte .max-Datei mit Layern und Materialien überspringt diesen Schritt: Wände und Öffnungen in den richtigen Maßen, Möbel und Materialien benannt und gruppiert, sodass der Designer dort weitermacht, wo wir aufgehört haben.',
          'Arbeitet Ihr Team mit Blender oder SketchUp, sind die GLB- und OBJ-Exporte in Metern und öffnen sich ohne Neuskalierung.',
        ],
      },
      {
        h: 'So bestellen Sie Renderings',
        steps: [
          { t: 'Grundriss im Studio öffnen', d: 'Laden Sie die DXF hoch und wählen Sie den Stil, der Ihrem Geschmack am nächsten kommt. Das gibt dem Designer einen klaren Ausgangspunkt.' },
          { t: 'Beim Team bestellen', d: 'Nutzen Sie „Beim Team bestellen“ im Studio oder das Bestellformular auf der Startseite und wählen Sie ein Paket. Ihr Studio-Entwurf wird automatisch beigefügt.' },
          { t: 'Wünsche ergänzen', d: 'Notieren Sie bevorzugte Farben und Materialien sowie die wichtigsten Räume und Blickwinkel, und fügen Sie Referenzbilder bei, falls vorhanden.' },
          { t: 'Bezahlen oder Angebot erhalten', d: 'Das Quick-Paket bezahlen Sie online über Moyasar (mada, Visa, Mastercard, Apple Pay); für die anderen Pakete erhalten Sie innerhalb eines Arbeitstages ein Angebot.' },
        ],
      },
      {
        h: 'Tipps für Renderings, die Ihren Geschmack treffen',
        ul: [
          'Teilen Sie 3 bis 5 Referenzbilder statt einer langen Beschreibung – Bilder kommunizieren schneller.',
          'Nennen Sie die bereits gewählten Oberflächen (Bodenart, Marmor- oder Feinsteinzeugfarbe), damit die Renderings dazu passen.',
          'Ordnen Sie die Räume nach Wichtigkeit: Wohnzimmer und Majlis verdienen meist mehr Blickwinkel als Nebenräume.',
          'Sind die Renderings für die Immobilienvermarktung gedacht, sagen Sie es uns, damit Stil und Kameraperspektiven darauf abgestimmt werden.',
        ],
      },
    ],
    faq: [
      { q: 'Welche Render-Engine verwenden Sie?', a: 'Je nach Projekt V-Ray oder Corona in 3ds Max.' },
      { q: 'Kann ich die .max-Datei selbst bearbeiten?', a: 'Ja. Sie ist mit Layern und Materialien strukturiert, sodass jeder Designer weiterarbeiten kann. Geben Sie Ihre 3ds Max-Version in den Bestellnotizen an.' },
      { q: 'Was ist der Unterschied zwischen 8 und 15 Renderings?', a: 'Das Quick-Paket liefert 8 hochauflösende Renderings des korrigierten Modells innerhalb von 48 Arbeitsstunden. Das Innenarchitektur-Paket umfasst die komplette Planung jedes Raums mit 15 V-Ray-Renderings und zwei Korrekturschleifen.' },
      { q: 'Sind die Preise inklusive Mehrwertsteuer?', a: 'Die veröffentlichten Preise verstehen sich in Saudi-Riyal zuzüglich 15 % MwSt.' },
      { q: 'Rendern Sie Immobilienprojekte mit mehreren Wohnungstypen?', a: 'Ja. Das Bauträger-Abonnement umfasst bis zu 10 Wohnungstypen pro Monat. Details finden Sie im Bereich für Bauträger auf der Startseite.' },
    ],
    ctaTitle: 'Starten Sie mit Ihrem Grundriss',
    ctaText: 'Laden Sie den Grundriss ins Studio hoch und bestellen Sie die Renderings dann mit einem Klick beim Team.',
  },

  'ai-room-design': {
    title: 'KI Raumgestaltung per Foto: So funktioniert es | Oxira',
    description: 'Raumgestaltung mit KI per Handyfoto: wie Sie den Raum fotografieren, welcher Stil passt, was das Ergebnis leistet und wann Sie einen Grundriss brauchen.',
    nav: 'KI-Raumgestaltung',
    card: 'Raum fotografieren und in unter einer Minute in einem neuen Stil sehen.',
    kicker: 'KI',
    h1: 'Raumgestaltung mit KI – aus einem Handyfoto',
    lead: 'Sie haben einen fertigen Raum und möchten ihn in einem anderen Stil sehen? Machen Sie ein Foto, wählen Sie Raumtyp und Stil, und die KI gestaltet ihn in unter einer Minute neu – mit denselben Wänden und Fenstern.',
    facts: [['< 1 Min.', 'pro Entwurf'], ['8', 'Raumtypen'], ['Kostenlos', 'erster Entwurf täglich']],
    sections: [
      {
        h: 'So funktioniert die KI-Raumgestaltung',
        steps: [
          { t: 'Raum fotografieren', d: 'Machen Sie ein scharfes Foto aus einem weiten Winkel, idealerweise aus einer Ecke, sodass zwei oder drei Wände sichtbar sind.' },
          { t: 'Raumtyp wählen', d: 'Wohnzimmer, Schlafzimmer, Majlis, Esszimmer, Küche, Bad, Arbeitszimmer oder Kinderzimmer. Der Typ steuert die Möbelauswahl.' },
          { t: 'Stil wählen', d: 'Modern, klassisch, zeitgenössisch-nadschdisch, skandinavisch oder luxuriös.' },
          { t: 'Vergleichen und herunterladen', d: 'Ziehen Sie den Regler, um Vorher und Nachher zu vergleichen, laden Sie das Bild herunter oder probieren Sie einen anderen Stil mit demselben Foto.' },
        ],
      },
      {
        h: 'Welcher Stil passt zu Ihrem Raum?',
        ul: [
          'Modern: klare Linien, neutrale Farben und schlichte Möbel; passt zu den meisten Wohn- und Schlafzimmern.',
          'Klassisch: Ornamente, edle Stoffe und warmes Licht; ideal für einen Majlis oder ein großes Esszimmer.',
          'Zeitgenössisch-nadschdisch: Erdtöne und natürliche Materialien, inspiriert vom traditionellen Haus der Region Nadschd, mit modernem Touch; passt zu Majlis oder Wohnzimmer.',
          'Skandinavisch: helle Farben, helles Holz und praktische Schlichtheit; lässt kleine Räume größer wirken.',
          'Luxuriös: Marmor, Metallakzente und durchdachte Beleuchtung – für die Haupträume, in denen Sie Gäste empfangen.',
        ],
      },
      {
        h: 'Tipps für ein Foto, das funktioniert',
        ul: [
          'Fotografieren Sie bei Tageslicht mit geöffneten Vorhängen; gutes Licht verbessert das Ergebnis mehr als alles andere.',
          'Stellen Sie sich in eine Ecke, halten Sie das Handy auf Brusthöhe und nutzen Sie das Weitwinkelobjektiv, falls vorhanden.',
          'Räumen Sie Kleinkram von Böden und Tischen, da die KI ihn sonst als Möbel deuten könnte.',
          'Laden Sie keine Fotos mit Personen hoch.',
          'Probieren Sie mehrere Stile mit demselben Foto aus; der Kontrast hilft, Ihren Geschmack schnell einzugrenzen.',
        ],
      },
      {
        h: 'Was das Ergebnis leisten kann – und was nicht',
        p: [
          'Die KI-Neugestaltung behält die Form des Raums bei: Wände, Fenster und Türen bleiben, wo sie sind, während sich Möbel, Farben, Materialien und Beleuchtung ändern. Das Ergebnis ist eine starke Inspiration für die Richtungsentscheidung, aber kein Ausführungsplan; die Möbelgrößen im Bild sind Näherungswerte.',
          'Wenn Sie Entscheidungen auf Basis von Maßen treffen müssen (Passt dieses Sofa? Wie viel Bodenbelag brauche ich?), laden Sie Ihren AutoCAD-Grundriss ins Studio hoch oder beauftragen Sie unser Team mit einer Innenarchitektur.',
        ],
      },
      {
        h: 'Preise',
        p: [
          `Ihr erster Entwurf pro Tag ist kostenlos. Für mehr kaufen Sie einmalig Guthaben und nutzen es, wann Sie möchten: ${p10.renders} Entwürfe für ${p10.price} SAR, ${p30.renders} Entwürfe für ${p30.price} SAR oder ${p100.renders} Entwürfe für ${p100.price} SAR, inklusive MwSt. Bezahlte Entwürfe haben eine höhere Qualität und behalten die Form des Raums genauer bei.`,
          'Nach der Zahlung erhalten Sie einen Link zu Ihrem Guthaben; speichern Sie ihn, um Ihr Guthaben auch auf einem anderen Gerät zu nutzen.',
        ],
      },
      {
        h: 'Welches Werkzeug wofür?',
        ul: [
          'KI-Raumgestaltung: Der Raum existiert bereits und Sie möchten schnell Ideen für Einrichtung oder Renovierung.',
          'Studio mit AutoCAD-Grundriss: Das Zuhause ist noch nicht fertig, oder Sie brauchen Flächen, Mengen und eine Möblierung auf dem Grundriss.',
          'Team-Pakete: Sie benötigen maßgenaue fotorealistische Renderings, eine 3ds Max-Datei oder eine komplette Planung mit Materialien und Farben.',
        ],
      },
    ],
    faq: [
      { q: 'Ist die KI-Raumgestaltung kostenlos?', a: `Ihr erster Entwurf pro Tag ist kostenlos. Danach gibt es Guthaben ab ${p10.renders} Entwürfen für ${p10.price} SAR inklusive MwSt.` },
      { q: 'Bleiben Wände und Fenster gleich?', a: 'Ja. Die KI gestaltet den Raum mit denselben Wänden und Fenstern neu und ändert Möbel, Farben, Materialien und Beleuchtung.' },
      { q: 'Welche Raumtypen werden unterstützt?', a: 'Wohnzimmer, Schlafzimmer, Majlis, Esszimmer, Küche, Bad, Arbeitszimmer und Kinderzimmer.' },
      { q: 'Wird mein Foto veröffentlicht?', a: 'Nein. Das Foto wird ausschließlich zur Verarbeitung an den KI-Anbieter übermittelt und nicht veröffentlicht.' },
      { q: 'Kann ich genau das umsetzen, was das Bild zeigt?', a: 'Das Bild dient der Inspiration und Orientierung. Für eine maßgenaue Umsetzung laden Sie Ihren Grundriss ins Studio hoch oder beauftragen unser Team mit einer Innenarchitektur.' },
    ],
    ctaTitle: 'Raum fotografieren und ausprobieren',
    ctaText: 'Ihr erster Entwurf heute ist kostenlos. Foto hochladen, Stil wählen und das Ergebnis in einer Minute sehen.',
  },

  'finishing-quantities': {
    title: 'Mengenermittlung Ausbau aus dem Grundriss | Oxira',
    description: 'Mengenermittlung für den Ausbau kostenlos aus Ihrem AutoCAD-Grundriss: Bodenbelag, Farbe, Fliesen, Decken und Sockelleisten pro Raum. CSV oder Angebote.',
    nav: 'Mengenermittlung Ausbau',
    card: 'Mengen für Bodenbelag, Farbe, Fliesen und Decken für jeden Raum Ihres Grundrisses.',
    kicker: 'Vor dem Ausbau',
    h1: 'Mengenermittlung für den Ausbau aus Ihrem Grundriss – plus Angebote',
    lead: 'Bevor Sie mit einem Ausbaubetrieb verhandeln, sollten Sie Ihre Mengen kennen. Laden Sie Ihren AutoCAD-Grundriss hoch, und das Studio berechnet Bodenbelag, Farbe, Fliesen, Decken und Sockelleisten für jeden Raum. Anschließend laden Sie die Werte herunter oder fragen Angebote an.',
    facts: [['5', 'Mengenpositionen'], ['CSV', 'Download'], ['Kostenlos', 'unverbindlich']],
    sections: [
      {
        h: 'Welche Mengen berechnet das Studio?',
        ul: [
          'Bodenbelag: die Fläche jedes Raums zuzüglich 10 % Verschnitt für Zuschnitt und Verlegung.',
          'Wandfarbe: Raumumfang × Raumhöhe abzüglich Türen und Fenster, für Wohnräume und Flure.',
          'Wandfliesen: Bad- und Küchenwände in voller Höhe, abzüglich Öffnungen.',
          'Decken: die Fläche jedes Innenraums, nützlich für Gipskarton oder Anstrich.',
          'Sockelleisten: in laufenden Metern, Raumumfang abzüglich Türbreiten.',
        ],
        tip: 'Balkone und Terrassen erhalten nur Bodenbelag, ohne Innenanstrich und Decke.',
      },
      {
        h: 'So ermitteln Sie die Mengen aus Ihrem Grundriss',
        steps: [
          { t: 'Grundriss hochladen', d: 'Öffnen Sie das Studio und laden Sie den DXF-Grundriss hoch. Geschlossene Räume werden automatisch erkannt und vermessen.' },
          { t: 'Einheiten und Höhe prüfen', d: 'Bestätigen Sie die Zeichnungseinheiten und die Raumhöhe, denn Farbe und Fliesen hängen direkt von der Höhe ab.' },
          { t: 'Mengentabelle öffnen', d: 'Für jeden Raum sehen Sie Fläche, Bodenbelag, Farbe, Fliesen, Decke und Sockelleisten, jeweils mit Summen.' },
          { t: 'Herunterladen oder Angebote anfragen', d: 'Laden Sie die Tabelle als CSV für Excel herunter oder klicken Sie auf „Ausbauangebote anfragen“ und wählen Sie einen Ausbaustandard: einfach, Standard oder gehoben.' },
        ],
      },
      {
        h: 'Ausbauangebote anfragen',
        p: [
          'Direkt aus dem Studio senden Sie die Mengen Ihres Grundrisses zusammen mit Name, Mobilnummer, Stadt und gewünschtem Ausbaustandard. Wir leiten die Mengen an unser Team und geprüfte Ausbaubetriebe weiter und melden uns per WhatsApp mit einem Angebot. Die Anfrage ist kostenlos und unverbindlich.',
          'Da die Angebote auf definierten Mengen beruhen, können Sie sie auf derselben Grundlage vergleichen – statt Pauschalangeboten, die kaum vergleichbar sind.',
        ],
      },
      {
        h: 'Mengen in der Verhandlung nutzen',
        ul: [
          'Fragen Sie jeden Betrieb nach einem Einheitspreis pro Position (pro m² oder pro laufendem Meter) und multiplizieren Sie selbst mit Ihren Mengen.',
          'Klären Sie, ob der Preis Material enthält oder nur die Arbeitsleistung, und mit welchem Verschnitt gerechnet wird.',
          'Vergleichen Sie die Mengen des Betriebs mit Ihren eigenen; eine große Abweichung verdient eine Nachfrage.',
          'Betrachten Sie die Werte als Planungsschätzung; die endgültigen Mengen werden durch ein Aufmaß vor Ort bestätigt.',
        ],
      },
      {
        h: 'Häufige Fehler bei der Mengenermittlung',
        ul: [
          'Farbe anhand der Bodenfläche schätzen: In einem typischen Raum ist die Wandfläche zwei- bis dreimal so groß wie die Bodenfläche.',
          'Verschnitt vergessen oder für alle Materialien denselben Wert ansetzen: Großformatige Fliesen und Diagonalverlegung brauchen mehr als 10 %, passen Sie den Wert also an Ihre Wahl an.',
          'Die endgültige Raumhöhe ignorieren: Senkt eine abgehängte Decke die Höhe, berechnen Sie Farbe und Fliesen mit der fertigen Höhe.',
          'Sich auf die Fläche im Kaufvertrag verlassen: Die Verkaufsfläche enthält Wände und teils einen Anteil an Gemeinschaftsflächen, während der Ausbau nach der Nettofläche jedes Raums abgerechnet wird.',
          'Balkone und Terrassen mit Innenräumen vermischen, obwohl sich Materialien und Kosten unterscheiden.',
        ],
      },
    ],
    faq: [
      { q: 'Wie genau sind die Mengen?', a: 'Die Flächen werden zentimetergenau aus Ihrer Zeichnung berechnet; die Mengen sind Schätzwerte für Planung und Vergleich. Die endgültigen Werte werden in den Team-Paketen oder durch ein Aufmaß vor Ort geprüft.' },
      { q: 'Warum zeigen manche Räume keine Fläche?', a: 'Ihre Wände sind in der Zeichnung nicht geschlossen. Prüfen Sie die Layer-Rollen im Studio oder stellen Sie sicher, dass die Wandlinien an den Ecken verbunden sind.' },
      { q: 'Ist eine Angebotsanfrage verbindlich?', a: 'Nein. Sie ist kostenlos und unverbindlich, und wir melden uns mit dem Angebot per WhatsApp.' },
      { q: 'Werden auch Elektro und Sanitär berechnet?', a: 'Nein. Das Studio deckt die Ausbaugewerke ab: Bodenbelag, Farbe, Fliesen, Decken und Sockelleisten.' },
      { q: 'Kann ich eine formelle Mengentabelle erhalten?', a: 'Das Quick-Paket enthält eine Mengentabelle als PDF, nachdem unser Team den Grundriss bereinigt und das Modell korrigiert hat.' },
    ],
    ctaTitle: 'Jetzt Ihre Mengen berechnen',
    ctaText: 'Laden Sie den Grundriss ins Studio hoch und öffnen Sie die Mengentabelle – kostenlos und ohne Registrierung.',
  },

  'saudi-arabia': {
    title: 'Innenarchitektur 3D in Saudi-Arabien | Oxira Design',
    description: '3D-Innenarchitektur für Wohnungen und Villen in Riad, Dschidda und ganz Saudi-Arabien aus AutoCAD-Grundrissen, mit Majlis. Preise in SAR, Zahlung mit mada.',
    nav: 'Saudi-Arabien',
    card: 'Saudische Villen und Wohnungen mit Geschossen, Nebengebäuden und Majlis – von Riad bis Dschidda.',
    kicker: 'Saudi-Arabien',
    h1: '3D-Innenarchitektur für Wohnungen und Villen in Saudi-Arabien',
    lead: 'Oxira ist ein saudisches Unternehmen mit Sitz in Riad, und das Studio ist auf das saudische Zuhause ausgerichtet: Es versteht Majlis, Esszimmer, Fahrer- und Hausangestelltenzimmer und möbliert im zeitgenössisch-nadschdischen Stil. Laden Sie Ihren Grundriss aus jeder Stadt hoch und sehen Sie ihn in Sekunden in 3D.',
    facts: [['Riad', 'Sitz des Teams'], ['Nadschdisch', 'lokaler Stil'], ['mada · Apple Pay', 'Zahlung']],
    sections: [
      {
        h: 'Ausgerichtet auf das saudische Zuhause',
        p: [
          'Die meisten 3D-Planungstools sind für westliche Häuser mit einem Wohnzimmer und offener Küche gemacht. Ein saudisches Zuhause ist anders: ein Gäste-Majlis mit eigenem Eingang, ein Esszimmer (Maqlat) in seiner Nähe, ein separates Familienwohnzimmer sowie Nebenräume für Fahrer, Hausangestellte und Wäsche.',
          'Das Studio liest arabische Raumbezeichnungen in der Zeichnung: Majlis und Wohnzimmer werden zu Sitzbereichen, Esszimmer werden zum Essen möbliert, und Fahrer-, Hausangestellten-, Wasch- und Abstellräume gelten als Nebenräume. Im zeitgenössisch-nadschdischen Stil erhält der Majlis Bodensitze entlang der Wände.',
        ],
      },
      {
        h: 'Villen in Riad und anderen Städten: Geschosse und Nebengebäude',
        p: [
          'Eine typische saudische Villa hat ein Erdgeschoss mit Majlis, Esszimmer, Wohnzimmer und Küche, ein Obergeschoss mit Schlafzimmern und Familienhalle, einen Dachaufbau (Mulhaq) und manchmal ein Nebengebäude mit Fahrerzimmer im Hof.',
          'Laden Sie jeden dieser Bereiche als eigene DXF hoch und legen Sie jeweils die Raumhöhe fest. Haben Sie die Villa im Rohbau („Adhm“) gekauft und bereiten den Ausbau vor, ist jetzt der beste Zeitpunkt für die Planung: Sie legen Aufteilung, Stil und Mengen fest, bevor der Bauunternehmer beginnt.',
        ],
      },
      {
        h: 'Wohnungen in Riad und Dschidda',
        ul: [
          'Eigentumswohnungen in Wohngebäuden haben oft ein Wohnzimmer, einen kleinen Majlis und zwei bis vier Schlafzimmer. Das Modell zeigt, ob der Majlis für Gäste groß genug ist oder besser mit dem Wohnzimmer zusammengelegt wird.',
          'Erdgeschosswohnungen mit Innenhof: Begehen Sie Wohnzimmer und Küche zum Hof hin und legen Sie Sitzbereiche und Öffnungen vor dem Ausbau fest.',
          'Dachwohnungen: Bezeichnen Sie die offene Dachfläche in der Zeichnung als „Terrasse“, damit sie nur Bodenbelag erhält, ohne Innenanstrich und Decke.',
          'Kauf vom Plan: Haben Sie den Wohnungsgrundriss vom Bauträger, sehen Sie die Einheit vor der Übergabe möbliert und entscheiden Änderungen frühzeitig.',
        ],
      },
      {
        h: 'Wie Eigentümer im Königreich die 3D-Planung nutzen',
        ul: [
          'Vor dem Ausbau: einen Stil wählen, Mengen für Bodenbelag, Farbe und Fliesen berechnen und Ausbauangebote anfragen.',
          'Vor dem Möbelkauf: sicherstellen, dass Sofas, Betten und Kleiderschränke in die Räume passen.',
          'Beim Verkauf oder bei der Vermietung: einen 3D-Rundgang für Ihr Immobilienangebot mit Link und QR-Code für 49 SAR pro Inserat veröffentlichen – zum Teilen auf Immobilienportalen und in sozialen Medien.',
          'Für Bauträger: Renderings und Rundgänge für jeden Wohnungstyp eines Projekts im monatlichen Abonnement.',
        ],
      },
      {
        h: 'Preise, Zahlung und Kontakt im Königreich',
        p: [
          `Die Preise gelten in Saudi-Riyal zuzüglich 15 % MwSt.: Quick-Paket ${quick}, Innenarchitektur ${perM2}, mindestens ${designMin}. Das Quick-Paket wird online über Moyasar mit mada, Visa, Mastercard oder Apple Pay bezahlt; für die anderen Pakete erhalten Sie nach Prüfung des Grundrisses ein Angebot und eine Rechnung.`,
          'Wir kommunizieren auf Arabisch oder Englisch per WhatsApp oder E-Mail, und das Team sitzt in Riad: 426 Al Sulaymaniyah, Al Urubah Rd.',
        ],
      },
    ],
    faq: [
      { q: 'Bedienen Sie auch Dschidda, Dammam, Mekka und andere Städte?', a: 'Ja. Der Service läuft vollständig online: Laden Sie den Grundriss ins Studio hoch oder senden Sie ihn mit Ihrer Bestellung; die Lieferung erfolgt elektronisch, wo immer Sie sich im Königreich befinden.' },
      { q: 'Liest das Studio arabische Grundrisse saudischer Planungsbüros?', a: 'Ja. Es erkennt arabische Layernamen für Wände, Türen und Fenster sowie arabische Raumbezeichnungen wie Majlis, Wohnzimmer, Schlafzimmer und Küche.' },
      { q: 'Kann ich mit mada bezahlen?', a: 'Ja. Das Quick-Paket wird über Moyasar mit mada, Visa, Mastercard oder Apple Pay bezahlt.' },
      { q: 'Erhalte ich eine Rechnung?', a: 'Ja, Sie erhalten mit Ihrer Bestellung eine Rechnung. Die veröffentlichten Preise verstehen sich zuzüglich 15 % MwSt.' },
      { q: 'Ich habe eine Villa im Rohbau. Wann sollte ich mit der Planung beginnen?', a: 'Bevor der Ausbaubetrieb beginnt, denn Aufteilung und Stil bestimmen die Positionen von Leuchten und Steckdosen, die Materialien und die Mengen.' },
    ],
    ctaTitle: 'Laden Sie den Grundriss Ihres Zuhauses hoch',
    ctaText: 'Aus Riad, Dschidda oder jeder anderen Stadt: Öffnen Sie das Studio und sehen Sie Ihr Zuhause in Sekunden in 3D.',
  },

  gulf: {
    title: 'Innenarchitektur 3D in den VAE & am Golf | Oxira Design',
    description: '3D-Innenarchitektur aus AutoCAD-Grundrissen für Wohnungen und Villen in VAE, Katar, Kuwait, Bahrain und Oman: Meter oder Fuß, Majlis, Nebengebäude, Keller.',
    nav: 'VAE & Golfstaaten',
    card: 'Vom Townhouse in Dubai bis zum kuwaitischen Familienhaus mit Keller und Nebengebäude.',
    kicker: 'VAE, Katar, Kuwait, Bahrain und Oman',
    h1: '3D-Innenarchitektur aus Grundrissen in den VAE und am Golf',
    lead: 'Der Service läuft vollständig online: Laden Sie den Grundriss Ihrer Wohnung oder Villa aus Dubai, Doha, Kuwait-Stadt, Manama oder Maskat ins Studio hoch, sehen Sie ihn in Sekunden in 3D mit Möbeln und Flächen und beauftragen Sie unser Team mit dem, was Sie brauchen.',
    facts: [['m² · ft²', 'Meter oder Fuß'], ['Majlis', 'Golf-Einrichtung'], ['Online', 'aus jedem Land']],
    sections: [
      {
        h: 'Begriffe und Grundrisse unterscheiden sich von Land zu Land',
        ul: [
          'VAE: freistehende Villen, Townhouses und Apartments in Hochhäusern; Immobilienangebote nennen Flächen meist in Quadratfuß.',
          'Kuwait: das Grundstück („Qasima“) und das mehrgeschossige Familienhaus, oft mit Keller („Sirdab“) und Nebengebäude. Jeder Bereich wird als eigener Grundriss hochgeladen.',
          'Katar, Bahrain und Oman: freistehende Villen und Villen in Wohnanlagen, oft mit einem separaten Außen-Majlis.',
          'Am ganzen Golf ist der Majlis zentral; das Studio erkennt einen Raum mit der Bezeichnung Majlis und möbliert ihn als Sitz- und Empfangsbereich, im zeitgenössisch-nadschdischen Stil mit Bodensitzen.',
        ],
      },
      {
        h: 'Quadratmeter oder Quadratfuß?',
        p: [
          'Das Studio zeigt Flächen in Quadratmetern an. Zur Umrechnung: 1 m² ≈ 10,764 sq ft, eine Wohnung mit 1.200 sq ft hat also rund 111 m².',
          'Ist die Zeichnung in Fuß angelegt, stellen Sie vor dem Speichern der DXF sicher, dass die Einfügeeinheiten in AutoCAD auf Fuß gesetzt sind (Befehl UNITS, Einfügemaßstab), denn das Studio liest die Einheit aus der Datei. Bei Zoll wählen Sie im Menü der Zeichnungseinheiten „Zoll“.',
        ],
      },
      {
        h: 'Grundrisse auf Englisch oder Arabisch',
        p: [
          'Viele Grundrisse am Golf verwenden englische Layer- und Raumnamen, besonders von größeren Planungsbüros. Das Studio versteht beides: Walls, Doors und Windows oder ihre arabischen Entsprechungen, und sogar Standardnamen wie A-WALL, A-DOOR und A-GLAZ.',
          'Bei Räumen erkennt es Bedroom, Kitchen, Living, Majlis, Maid’s room (Zimmer für Hausangestellte), Driver’s room (Fahrerzimmer) und Laundry neben arabischen Bezeichnungen, sodass jeder Raum passend möbliert und vermessen wird.',
        ],
      },
      {
        h: 'Keller, Nebengebäude und Außen-Majlis',
        p: [
          'Ein Zuhause am Golf besteht meist aus mehr als einem Grundriss: Keller, Erdgeschoss, Obergeschoss, Nebengebäude und Außen-Majlis. Laden Sie jeden als eigene DXF hoch und legen Sie jeweils die Raumhöhe fest, da Keller und Nebengebäude oft von den Hauptgeschossen abweichen.',
          'In den Team-Paketen fügen wir die Geschosse zu einem Modell zusammen; das Komplett-Paket ergänzt Fassaden und Landschaftsgestaltung.',
        ],
      },
      {
        h: 'Zusammenarbeit von außerhalb Saudi-Arabiens',
        steps: [
          { t: 'Studio ausprobieren', d: 'Laden Sie eine DXF hoch und sehen Sie Modell, Flächen und Möbel. Ohne Registrierung – die Datei wird in Ihrem Browser verarbeitet.' },
          { t: 'Bestellung senden', d: 'Wählen Sie ein Paket und geben Sie Stadt und Land an. Sie können DWG- oder PDF-Dateien bis 15 MB anhängen.' },
          { t: 'Zahlung', d: 'Die Preise sind in Saudi-Riyal. Das Quick-Paket wird online per Karte oder Apple Pay über Moyasar bezahlt; für die anderen Pakete erhalten Sie innerhalb eines Arbeitstages ein Angebot.' },
          { t: 'Lieferung', d: 'Renderings und Dateien werden elektronisch geliefert, und wir kommunizieren auf Arabisch oder Englisch per WhatsApp oder E-Mail.' },
        ],
      },
    ],
    faq: [
      { q: 'Ist der Service in den VAE, Katar, Kuwait, Bahrain und Oman verfügbar?', a: 'Ja. Der Service läuft vollständig online, wir nehmen Grundrisse aus jedem Land an, und die Website ist auf Arabisch und Englisch verfügbar.' },
      { q: 'Mein Grundriss ist in Fuß gezeichnet. Kann das Studio ihn lesen?', a: 'Ja, sofern die Einfügeeinheiten der Datei auf Fuß gesetzt sind. Flächen werden in m² angezeigt; multiplizieren Sie mit 10,764 für Quadratfuß.' },
      { q: 'In welcher Währung bezahle ich?', a: 'Die Preise sind in Saudi-Riyal. Kunden am Golf bezahlen das Quick-Paket per Karte oder Apple Pay, die anderen Pakete über Angebot und Rechnung.' },
      { q: 'Arbeiten Sie mit Bauträgern am Golf?', a: 'Ja. Das Bauträger-Abonnement umfasst Renderings und virtuelle Rundgänge für bis zu 10 Wohnungstypen pro Monat, und wir freuen uns auf Projekte außerhalb des Königreichs.' },
    ],
    ctaTitle: 'Probieren Sie es mit Ihrem Grundriss – aus jedem Land',
    ctaText: 'Öffnen Sie das Studio, laden Sie eine DXF hoch und sehen Sie Ihre Wohnung oder Villa in Sekunden in 3D.',
  },

  egypt: {
    title: 'Wohnung 3D planen in Ägypten vor dem Ausbau | Oxira',
    description: 'Planen Sie Wohnung, Duplex oder Villa in Ägypten vor dem Ausbau in 3D aus einem AutoCAD-Grundriss – mit kostenlosen Mengen für Fliesen, Farbe und Gipskarton.',
    nav: 'Ägypten',
    card: 'Teilfertige Wohnung? Erst in 3D ansehen und die Ausbaumengen berechnen.',
    kicker: 'Ägypten',
    h1: 'Wohnung in Ägypten in 3D planen – bevor der Ausbau beginnt',
    lead: 'Sie haben eine teilfertige Einheit in einem Compound oder Wohngebäude übernommen? Laden Sie den AutoCAD-Grundriss hoch, sehen Sie ihn in Sekunden in 3D mit Möbeln und Flächen und berechnen Sie die Mengen für Fliesen, Farbe und Decken, bevor Sie sich mit einem Ausbaubetrieb einigen.',
    facts: [['Teilfertig', 'der ideale Zeitpunkt'], ['Kostenlos', 'Modell und Mengen'], ['Online', 'von Kairo bis überall']],
    sections: [
      {
        h: 'Teilfertige Einheiten: der richtige Zeitpunkt für die Planung',
        p: [
          'Viele Einheiten in Ägypten werden teilfertig („nos tashteeb“) oder im Putzzustand übergeben, und der Eigentümer entscheidet über den Ausbaustandard: Lux, Super Lux oder Ultra Super Lux. Bevor Installateur und Elektriker loslegen, müssen Sie wissen, wo alles hinkommt – Betten, Fernseher, Küche und Klimageräte –, denn danach richten sich Steckdosen, Leuchten und Leitungen.',
          'Ein 3D-Modell zeigt all das, bevor Entscheidungen zu Abriss und Nacharbeit führen.',
        ],
      },
      {
        h: 'Raumbezeichnungen wie auf ägyptischen Grundrissen',
        p: ['Das Studio erkennt den Raumtyp an der Bezeichnung im Raum und möbliert ihn entsprechend. Die meisten ägyptischen Bezeichnungen werden direkt verstanden:'],
        ul: [
          '„نوم“, „أوضة نوم“ oder „Master“: Schlafzimmer.',
          '„سفرة“: Esszimmer; „مطبخ“ (Küche) und „حمام“ (Bad) unverändert.',
          '„تراس“ und „بلكونة“: Außenbereiche, die nur Bodenbelag erhalten.',
          '„استقبال“, „صالة“ oder Reception: Wohnbereich.',
        ],
        tip: 'Das in arabischen Buchstaben geschriebene Wort „ريسبشن“ wird nicht automatisch erkannt; schreiben Sie „استقبال“ oder Reception, oder ändern Sie den Raumtyp nach dem Hochladen.',
      },
      {
        h: 'Duplex, Dachwohnung, Penthouse und Villa',
        ul: [
          'Duplex: Laden Sie jedes Geschoss als eigene DXF hoch und prüfen Sie die Position der Innentreppe auf beiden Ebenen.',
          'Dachwohnung und Penthouse: Bezeichnen Sie den offenen Dachteil als „Terrasse“ (تراس), damit sein Bodenbelag separat und ohne Farbe oder Decke ausgewiesen wird.',
          'Townhouses, Twin Houses und freistehende Villen in Compounds: Jedes Geschoss ist ein eigener Grundriss; Fassaden und Gärten gehören zu unserem Komplett-Paket.',
        ],
      },
      {
        h: 'Ausbaumengen in der Sprache der Handwerker',
        p: [
          'Die Mengentabelle des Studios liefert für jeden Raum die Bodenfläche mit 10 % Verschnitt (Keramik oder Feinsteinzeug), die Anstrichfläche abzüglich Türen und Fenster, Wandfliesen für Bad und Küche, die Deckenfläche für Gipskarton und Sockelleisten in laufenden Metern.',
          'Laden Sie die Tabelle als CSV herunter, fragen Sie jeden Betrieb nach einem Quadratmeterpreis pro Position und vergleichen Sie die Angebote auf Basis derselben Mengen. Denken Sie daran, dass es Schätzwerte sind; die endgültigen Maße werden vor Ort genommen.',
        ],
      },
      {
        h: 'Preise und Zahlung aus Ägypten',
        p: [
          `Studio, 3D-Modell und Mengen sind kostenlos. Die Team-Pakete werden in Saudi-Riyal zzgl. MwSt. berechnet: Quick ${quick}, Innenarchitektur ${perM2}, mindestens ${designMin}. Die Online-Zahlung erfolgt per Bankkarte; bei Fragen zur Zahlung schreiben Sie uns per WhatsApp.`,
        ],
      },
    ],
    faq: [
      { q: 'Ist der Service in Ägypten verfügbar?', a: 'Ja, er läuft vollständig online. Laden Sie den Grundriss aus jeder Stadt Ägyptens ins Studio hoch, bestellen Sie beim Team und erhalten Sie die Dateien elektronisch.' },
      { q: 'Mein Ingenieur hat den Grundriss als PDF geschickt. Was nun?', a: 'Bitten Sie um die AutoCAD-DWG und speichern Sie sie als DXF, oder senden Sie das PDF mit einer Bestellung des Quick-Pakets, und das Team wandelt es in ein Modell um.' },
      { q: 'Berechnet das Studio auch Elektro und Sanitär?', a: 'Nein, es deckt die Ausbaugewerke ab: Bodenbelag, Farbe, Fliesen, Decken und Sockelleisten. Die Möblierung im Modell hilft Ihnen aber, die Positionen von Steckdosen und Leuchten festzulegen.' },
      { q: 'Sind die Preise in ägyptischen Pfund angegeben?', a: 'Die veröffentlichten Preise sind in Saudi-Riyal, und das Studio selbst ist kostenlos. Bei kostenpflichtigen Paketen rechnet Ihre Bank den Betrag bei Kartenzahlung um.' },
      { q: 'Welcher Stil passt zu einer kleinen Wohnung?', a: 'Probieren Sie modern und skandinavisch und vergleichen Sie beide aus demselben Blickwinkel; helle Farben und schlichte Möbel lassen Räume größer wirken.' },
    ],
    ctaTitle: 'Sehen Sie Ihre Wohnung vor dem Ausbau',
    ctaText: 'Laden Sie den Wohnungsgrundriss ins kostenlose Studio hoch und berechnen Sie im selben Schritt die Ausbaumengen.',
  },
};

export const ui: GuideUi = {
  home: 'Startseite',
  hub: 'Leistungen & Ratgeber',
  hubTitle: '3D-Planung: Leistungen & Ratgeber | Oxira Design',
  hubDescription: 'Alle Leistungen von Oxira Design auf einen Blick: AutoCAD-Grundriss in 3D, Wohnung und Villa in 3D planen, Renderings, KI-Raumgestaltung und Mengenermittlung.',
  hubKicker: 'Leistungen & Ratgeber',
  hubH1: '3D-Planung vom Grundriss bis zum fotorealistischen Rendering',
  hubLead: 'Wählen Sie, was zu Ihrer Situation passt: Sie haben einen AutoCAD-Grundriss und möchten ihn in 3D sehen, Sie bereiten eine Wohnung oder Villa auf den Ausbau vor, oder Sie haben ein Foto eines Raums und wünschen sich schnell eine Gestaltungsidee. Jede Seite erklärt die Schritte, die benötigten Dateien und was Sie erhalten.',
  services: 'Leistungen',
  servicesLead: 'Praxisnahe Ratgeber zu jeder Leistung: wie sie funktioniert, welche Dateien akzeptiert werden, was automatisch geschieht und was unser Team übernimmt.',
  regions: 'Nach Land',
  regionsLead: 'Derselbe Online-Service, dazu was in jedem Land anders ist: Begriffe, typische Wohnungen und Villen, Einheiten und Zahlung.',
  which: {
    h: 'Wo fange ich am besten an?',
    items: [
      'Sie haben eine AutoCAD-Datei (DWG oder DXF) einer Wohnung oder Villa: Starten Sie mit dem kostenlosen Studio – es liefert Modell, Flächen und Mengen in Sekunden.',
      'Sie haben nur ein Foto eines Raums: Probieren Sie die KI-Raumgestaltung. Ihr erster Entwurf pro Tag ist kostenlos.',
      'Sie brauchen realistische Bilder für die Vermarktung oder eine 3ds Max-Datei für Ihren Designer oder Bauunternehmer: Bestellen Sie nach dem Test im Studio eines der Team-Pakete.',
      'Der Innenausbau steht bevor und Sie möchten Angebote von Handwerkern vergleichen: Laden Sie die Mengentabelle aus dem Studio herunter oder fragen Sie Ausbauangebote an.',
    ],
  },
  open: 'Ratgeber lesen',
  steps: 'Schritte',
  faq: 'Häufig gestellte Fragen',
  related: 'Verwandte Seiten',
  allServices: 'Alle Leistungen und Ratgeber',
  onThisPage: 'Auf dieser Seite',
  note: 'Ohne Registrierung. Ihre Datei wird in Ihrem Browser verarbeitet.',
  breadcrumb: 'Brotkrumennavigation',
  homeSection: { label: 'Leistungen & Ratgeber', title: 'Praxisnahe Ratgeber für Ihr Vorhaben', more: 'Alle Leistungen und Ratgeber' },
};
