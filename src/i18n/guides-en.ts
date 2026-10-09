// English copy for the SEO landing pages. Prices come from PRICES / REDESIGN_PACKS so they stay in sync.
import { PRICES } from './content';
import { REDESIGN_PACKS } from './redesign';
import type { GuideCopy, GuideSlug } from './guides';

const n = (x: number) => x.toLocaleString('en-US');
const [p10, p30, p100] = REDESIGN_PACKS;
const quick = `SAR ${n(PRICES.quick)}`;
const perM2 = `SAR ${n(PRICES.designPerM2)} per m²`;
const designMin = `SAR ${n(PRICES.designMin)}`;

export const guidesEn: Record<GuideSlug, GuideCopy> = {
  'autocad-to-3d': {
    title: 'AutoCAD Floor Plan to 3D Online (DWG/DXF) | Oxira',
    description: 'Convert an AutoCAD floor plan to a 3D model in your browser in seconds: walls, doors, windows, room areas, furniture and a walkthrough. DWG and PDF via our team.',
    nav: 'AutoCAD plan to 3D',
    card: 'Upload a DXF and see the plan in 3D with areas and furniture in seconds.',
    kicker: 'From 2D to 3D',
    h1: 'AutoCAD floor plan to 3D, right in your browser',
    lead: 'Upload a DXF saved from AutoCAD and the Oxira studio builds a 3D model with walls, doors, windows and the area of every room in seconds. No sign-up and nothing to install.',
    facts: [['DXF', 'read directly'], ['DWG · PDF', 'via our team'], ['Free', 'model and areas']],
    sections: [
      {
        h: 'How a 2D drawing becomes a 3D model',
        p: [
          'An AutoCAD plan is really lines, arcs and text spread across layers. The studio reads those layers and works out the role of each one from its name: walls, doors, windows, and what to ignore such as dimensions, hatching, drawn furniture and grid lines.',
          'It then extrudes the walls to the ceiling height you set, cuts door and window openings where they belong, detects closed rooms and measures each one, and reads room names written in the drawing, such as "bedroom", "kitchen" or "majlis", to know what each room is and furnish it accordingly.',
          'All of this happens inside your browser. The file is not uploaded to our servers while you use the studio, so you can safely try it on your own home.',
        ],
      },
      {
        h: 'Step by step',
        steps: [
          { t: 'Save the plan as DXF', d: 'Open the drawing in AutoCAD and save it as DXF (2013 or later). If the file holds several plans or sheets, copy the floor plan you need into its own file first.' },
          { t: 'Upload it to the studio', d: 'Drop the file onto the studio page or pick it from your device, up to 40 MB. You can also start with one of the ready sample plans.' },
          { t: 'Check layers and units', d: 'The studio lists the layers it recognised and their roles. If walls are missing, set the right layer to "Walls" and rebuild. Check the drawing units (mm, cm, m or inches) and the ceiling height.' },
          { t: 'Explore and walk through', d: 'Switch between the 3D view, the top plan and walk mode, cut the walls to see the layout from above, and pick a style to change the furniture.' },
          { t: 'Export or hand over to the team', d: 'Download a PNG, or a GLB or OBJ model in metres, or ask our team for photoreal renders and a ready 3ds Max file.' },
        ],
      },
      {
        h: 'How to export DXF from AutoCAD',
        ul: [
          'File › Save As, then under "Files of type" choose AutoCAD 2013 DXF or a later version.',
          'Or type DXFOUT on the command line and choose the location and version.',
          'Before saving, delete or freeze layers you do not need, such as dimensions, title blocks and borders. Reading is faster and errors are rarer.',
          'Write each room name as text inside the room (TEXT or MTEXT), in English or Arabic, so the studio can recognise its type.',
          'Working in Revit, ArchiCAD or BricsCAD? Export the floor plan to DXF from the Export menu.',
        ],
      },
      {
        h: 'What about DWG and PDF files?',
        p: [
          'DWG is AutoCAD’s native format and browsers cannot read it directly. The quickest fix is to save it as DXF as described above, which takes less than a minute.',
          `If you do not have AutoCAD, or only have the plan as a PDF, send it with a Quick package order (${quick} before VAT) and our team cleans up the drawing, converts it and corrects the model.`,
        ],
      },
      {
        h: 'What you get',
        ul: [
          'A 3D model with walls at real height and doors and windows at the sizes in your drawing.',
          'The area of every room and the total.',
          'Estimated quantities for flooring, paint, ceilings, skirting and bathroom and kitchen wall tiles, downloadable as CSV.',
          'First-pass furniture for every room type in five styles: modern, classic, contemporary Najdi, Scandinavian and luxury.',
          'A walkthrough, room by room.',
          'PNG, GLB and OBJ export that opens in 3ds Max, Blender and SketchUp.',
        ],
      },
      {
        h: 'Tips for a cleaner result',
        ul: [
          'Keep wall lines connected at the corners: a room that is not closed cannot be measured.',
          'Give layers clear names such as Walls, Doors and Windows.',
          'Draw doors and windows as blocks; the studio uses them to classify each opening.',
          'One floor plan per file: each storey in its own DXF.',
          'If the model looks the wrong size, change the drawing units manually in the layers panel and rebuild.',
        ],
      },
    ],
    faq: [
      { q: 'Is converting a plan to 3D free?', a: 'Yes. The model, areas, estimated quantities, furniture, walkthrough and exports are all free in the studio with no sign-up. You only pay for the team’s work, such as photoreal renders and a 3ds Max file.' },
      { q: 'Which DXF version should I use?', a: '2013 or later works best. If reading fails, save again as DXF 2013 and retry.' },
      { q: 'Does the studio understand Arabic layer and room names?', a: 'Yes. It recognises Arabic and English layer names for walls, doors and windows, and room names such as bedroom, kitchen, bathroom, living room and majlis in both languages.' },
      { q: 'My plan has several floors. How do I upload it?', a: 'Upload each floor as a separate DXF. If all floors are in one drawing, copy each plan into a new file before saving.' },
      { q: 'Can I convert a PDF or an image to 3D?', a: 'Not in the studio itself, because it needs real CAD geometry. Send the PDF with a Quick package order and our team converts it.' },
      { q: 'Does the model open in 3ds Max?', a: 'Yes. GLB and OBJ exports are in metres and open in recent versions of 3ds Max. Team packages include an organised .max file with layers and materials.' },
    ],
    ctaTitle: 'Try it on your own plan',
    ctaText: 'Open the studio and upload a DXF, or start with a sample plan and see the result in seconds.',
  },

  'apartment-3d-design': {
    title: 'Apartment 3D Design Online from Your Plan | Oxira',
    description: 'Design your apartment in 3D online from an AutoCAD plan: auto furniture, five styles, room areas and a walkthrough, then order photoreal renders or a full design.',
    nav: 'Apartment 3D design',
    card: 'See your apartment furnished in 3D before finishing and buying furniture.',
    kicker: 'For apartments',
    h1: 'Apartment 3D design online: see it before you finish it',
    lead: 'Upload your apartment plan and see it in 3D with furniture and room areas in seconds. Then settle the style and layout before you start finishing works or buy a single piece of furniture.',
    facts: [['Seconds', 'from plan to 3D'], ['5', 'interior styles'], [`SAR ${n(PRICES.designPerM2)}`, 'per m², full design']],
    sections: [
      {
        h: 'Why design an apartment in 3D first?',
        p: [
          'In an apartment every centimetre counts: where the sofa sits in front of the TV, which way a bedroom door swings, the gap between bed and wardrobe, room to move in the kitchen. None of this is obvious on a paper plan, but it is immediately clear when you walk through the apartment in 3D.',
          'The model also makes conversations easier with your family, your designer and your contractor. Instead of describing an idea, you send a view or a file and everyone sees the same thing.',
        ],
      },
      {
        h: 'How to design your apartment online',
        steps: [
          { t: 'Get the apartment plan', d: 'Ask the developer, the engineering office or the previous owner for the AutoCAD file. If it is DWG, save it as DXF in AutoCAD or ask them for a DXF copy.' },
          { t: 'Upload it to the studio', d: 'In seconds the studio builds walls, doors and windows and measures the living room, bedrooms, kitchen, bathrooms and balcony.' },
          { t: 'Pick a style', d: 'Switch between modern, classic, contemporary Najdi, Scandinavian and luxury; first-pass furniture is laid out per room type.' },
          { t: 'Walk through and decide', d: 'Use walk mode to move through the apartment at eye level, and cut the walls to see the whole layout from above.' },
          { t: 'Hand over to the team if needed', d: 'Order photoreal renders or a full interior design with materials, colours and lighting. Your studio design is attached to the order automatically.' },
        ],
      },
      {
        h: 'What you see in your apartment model',
        ul: [
          'Living room with sofas and a coffee table, bedrooms with beds and wardrobes.',
          'Kitchen and bathrooms with basic fittings, plus the balcony or terrace.',
          'Every room’s area in m² and the apartment total.',
          'Estimated flooring, paint, tiles, ceiling and skirting quantities, useful when comparing finishing quotes.',
          'PNG views to share, and a GLB or OBJ model for anyone continuing in another program.',
        ],
      },
      {
        h: 'From the free model to a full interior design',
        p: ['The model and first-pass furniture are free in the studio and enough to understand the layout and choose a direction. When you need realistic images or production files, there are two team packages:'],
        ul: [
          `Quick (${quick} before VAT): plan clean-up and model correction, 8 high-resolution renders, 3ds Max and GLB files and a PDF quantity table within 48 working hours.`,
          `Interior design (${perM2}, minimum ${designMin}, before VAT): a designer works with you on every room, 15 V-Ray renders, a shareable 360° tour and two revision rounds. Example: a 120 m² apartment costs SAR ${n(120 * PRICES.designPerM2)} before VAT, delivered in 5 to 10 working days depending on size.`,
        ],
      },
      {
        h: 'Practical apartment design tips',
        ul: [
          'Leave comfortable walkways between furniture, and judge space by walking through the model rather than from the plan alone.',
          'Check door swings, especially bedroom and bathroom doors near wardrobes.',
          'In small apartments light colours and low furniture make rooms feel larger; compare the Scandinavian and modern styles.',
          'Fix the positions of the TV, beds and desks before finishing, because they decide where sockets and lights go.',
          'Take one view per style from the same angle and compare them with your family before deciding.',
        ],
      },
    ],
    faq: [
      { q: 'I do not have an AutoCAD file of my apartment. What can I do?', a: 'Ask the developer or the engineering office that designed the building. If you only have a PDF, send it with a Quick package order and our team turns it into a model.' },
      { q: 'Is the furniture in the model true to size?', a: 'Automatic furnishing is a first pass using standard-size pieces per room type, so you can understand layout and space. Choosing specific pieces with exact sizes happens with a designer in the interior design package.' },
      { q: 'How much does a full apartment design cost?', a: `The studio model is free. A full interior design is ${perM2} with a minimum of ${designMin} before 15% VAT, and the Quick package is ${quick}.` },
      { q: 'Do you work on apartments in Egypt and the Gulf?', a: 'Yes. The service is fully online and we accept plans from any country. See the Egypt and Gulf pages for what differs locally.' },
      { q: 'Can I share the design with my contractor?', a: 'Yes. Download PNG views and the CSV quantity table, or export GLB or OBJ. Team packages add a .max file and high-resolution renders.' },
    ],
    ctaTitle: 'See your apartment in 3D today',
    ctaText: 'Upload the apartment plan to the free studio and choose your style before finishing works start.',
  },

  'villa-3d-design': {
    title: 'Villa 3D Design from AutoCAD Plans | Oxira Design',
    description: 'Villa 3D design from AutoCAD plans: each floor as a 3D model with areas, furniture and a majlis, then photoreal renders, facades and full interior design.',
    nav: 'Villa 3D design',
    card: 'Every villa floor in 3D, including the majlis, family living and service rooms.',
    kicker: 'For villas and houses',
    h1: 'Villa 3D design from your AutoCAD plans',
    lead: 'A villa is a big decision with many spaces: a majlis, dining, family living, bedrooms and an annex. Upload the plan of each floor and see it in 3D with furniture and areas before finishing starts.',
    facts: [['Each floor', 'its own model'], ['Majlis', 'Arabic seating'], ['Interior + exterior', 'Complete package']],
    sections: [
      {
        h: 'Why a villa needs a 3D design',
        p: [
          'In a villa, guest, family and service areas overlap, and layout mistakes are hard to fix after finishing: a men’s majlis that overlooks the family hall, a kitchen far from the dining room, a staircase that cuts through the first floor. A 3D model exposes these relationships before they cost money.',
          'Because finishing and furnishing budgets for a villa are large, seeing every floor furnished and measured helps you split the budget between floors and rooms with confidence.',
        ],
      },
      {
        h: 'What is automatic and what the team does',
        ul: [
          'Automatic in the studio: walls and openings for each floor, room detection and areas, first-pass furniture including a majlis with floor seating in the Najdi style, estimated quantities and a walkthrough.',
          'By the team: clean-up of large plans and DWG files, interior design to your taste with materials, colours and lighting, V-Ray or Corona renders and an organised 3ds Max file.',
          'In the Complete package: interior and exterior design, facades and landscaping, construction drawings for the contractor, an animated walkthrough video and a dedicated project manager.',
        ],
      },
      {
        h: 'How to prepare and upload villa plans',
        steps: [
          { t: 'Split the floors', d: 'Save each floor (ground, first, annex or roof, and basement if any) as its own DXF, because the studio builds one floor plan at a time.' },
          { t: 'Name the rooms in the drawing', d: 'Write names such as majlis, living, dining, bedroom, kitchen and driver room inside each room so the studio can recognise and furnish it.' },
          { t: 'Set the ceiling height per floor', d: 'Adjust the ceiling height in the layers panel for each floor; the ground floor and the annex often differ.' },
          { t: 'Review and export', d: 'Walk through every floor, download the quantity table per floor, then send the files with your order if you need renders or a full design.' },
        ],
      },
      {
        h: 'What villa design costs',
        p: [
          `Interior design is priced by area: ${perM2} before VAT with a minimum of ${designMin}. A villa with 400 m² of interior space, for example, comes to SAR ${n(400 * PRICES.designPerM2)} before VAT, including every room, 15 V-Ray renders, a 360° tour and two revision rounds.`,
          'The Complete package with facades, landscaping and construction drawings is quoted per project after we review the plans, and you receive the quote within one working day.',
        ],
      },
      {
        h: 'Villa design tips',
        ul: [
          'Separate guest and family circulation: settle the majlis entrance and the guest washroom before anything else.',
          'Keep the dining room close to the kitchen or a prep kitchen, and check the distance by walking through the model.',
          'Check the staircase position on each floor and make sure bedrooms are not reached through guest areas.',
          'Give service rooms, laundry and storage practical sizes; they affect daily comfort more than you expect.',
          'Compare at least two styles for the living room and majlis, the two spaces guests see most.',
        ],
      },
    ],
    faq: [
      { q: 'Can I upload the whole villa in one file?', a: 'The studio builds one floor plan at a time, so upload each floor as a separate DXF. In design packages our team combines the floors into one model.' },
      { q: 'Do you design exterior facades?', a: 'Yes, in the Complete package together with landscaping. The free studio focuses on interior floor plans.' },
      { q: 'Does the studio support an Arabic majlis?', a: 'Yes. A room named majlis is treated as a seating space, and in the contemporary Najdi style it gets floor seating along the walls.' },
      { q: 'How long does a full villa design take?', a: 'Interior design takes 5 to 10 working days depending on size. For the Complete package the timeline is set in the quote according to project scope.' },
      { q: 'Do I get files for my contractor?', a: 'Team packages include an organised .max file and high-resolution renders, and the Complete package adds construction drawings for the contractor.' },
    ],
    ctaTitle: 'Start with the ground floor',
    ctaText: 'Upload the first floor plan to the free studio and see it in 3D, then ask the team for the full design.',
  },

  'interior-renders': {
    title: 'Photoreal Interior Renders & 3ds Max Files | Oxira',
    description: 'Photorealistic interior renders in V-Ray or Corona and an organised 3ds Max file with layers and materials, from your AutoCAD plan. Quick package in 48 hours.',
    nav: 'Photoreal renders & 3ds Max',
    card: 'Photoreal V-Ray or Corona images and an organised .max file from your plan.',
    kicker: 'Interior visualisation',
    h1: 'Photorealistic interior renders and a ready 3ds Max file',
    lead: 'From an AutoCAD plan to photoreal interior images and an organised 3ds Max file your designer or contractor can build on, with clear packages and published prices.',
    facts: [['V-Ray · Corona', 'render engines'], ['.max · GLB', 'delivered files'], ['48 hours', 'Quick package']],
    sections: [
      {
        h: 'AI renders vs photoreal renders from the team',
        p: [
          'In the studio you can turn any view of the model into a realistic image with AI in under a minute, with 3 free renders a day. These are great for exploring ideas and styles quickly, but they are imaginative and may not match real dimensions.',
          'A photoreal render from our team is built on a 3D model matched to your plan’s dimensions, with defined materials and lighting in 3ds Max, rendered in V-Ray or Corona. That is what you need to present to your family, market a property, or give a contractor a clear brief.',
        ],
      },
      {
        h: 'What each package includes',
        ul: [
          `Quick (${quick} before VAT): plan clean-up and model correction, DWG and PDF accepted, 8 high-resolution renders, a 3ds Max (.max) and GLB file and a PDF quantity table, within 48 working hours.`,
          `Interior design (${perM2}, minimum ${designMin}, before VAT): full design of the unit, materials, colours and lighting, 15 photoreal V-Ray renders, a shareable 360° tour, and two revision rounds with an organised .max file.`,
          'Complete (quoted per project): interior and exterior design, facades and landscaping, construction drawings, an animated walkthrough video and a dedicated project manager.',
        ],
      },
      {
        h: 'Why the 3ds Max file matters',
        p: [
          'Many designers start from scratch by drawing walls in 3ds Max, which takes hours before the first render. An organised .max file with layers and materials skips that stage: walls and openings at the right sizes, furniture and materials named and grouped, so the designer continues where we stopped.',
          'If your team uses Blender or SketchUp, GLB and OBJ exports are in metres and open without rescaling.',
        ],
      },
      {
        h: 'How to order renders',
        steps: [
          { t: 'Open your plan in the studio', d: 'Upload the DXF and pick the style closest to your taste. It gives the designer a clear starting point.' },
          { t: 'Order from the team', d: 'Use "Order from the team" in the studio or the order form on the home page and choose a package. Your studio design is attached automatically.' },
          { t: 'Add your preferences', d: 'Note the colours and materials you like and the rooms and angles that matter most, and attach reference images if you have them.' },
          { t: 'Pay or receive a quote', d: 'The Quick package is paid online through Moyasar (mada, Visa, Mastercard, Apple Pay); other packages receive a quote within one working day.' },
        ],
      },
      {
        h: 'Tips for renders that reflect your taste',
        ul: [
          'Share 3 to 5 reference images instead of a long description; pictures communicate faster.',
          'List the finishes you have actually chosen (floor type, marble or porcelain colour) so the renders match them.',
          'Rank rooms by importance: the living room and majlis usually deserve more angles than service rooms.',
          'If the renders are for real-estate marketing, say so, so style and camera angles suit it.',
        ],
      },
    ],
    faq: [
      { q: 'Which render engine do you use?', a: 'V-Ray or Corona inside 3ds Max, depending on the project.' },
      { q: 'Can I edit the .max file myself?', a: 'Yes. It is organised with layers and materials so any designer can continue. Mention your 3ds Max version in the order notes.' },
      { q: 'What is the difference between 8 and 15 renders?', a: 'The Quick package gives 8 high-resolution renders of the corrected model within 48 working hours. The interior design package includes a full design of every room with 15 V-Ray renders and two revision rounds.' },
      { q: 'Do prices include VAT?', a: 'Published prices are in Saudi riyals before 15% VAT.' },
      { q: 'Do you render real-estate projects with several unit types?', a: 'Yes. The developer subscription covers up to 10 unit types per month. Details are in the developers section on the home page.' },
    ],
    ctaTitle: 'Start from your plan',
    ctaText: 'Upload the plan to the studio, then order renders from the team with one click.',
  },

  'ai-room-design': {
    title: 'AI Room Design from a Photo: How It Works | Oxira',
    description: 'AI room design from a phone photo: how to shoot the room, which style to pick, what the result can and cannot do, and when you need a plan. First design free daily.',
    nav: 'AI room design',
    card: 'Photograph a room and see it redesigned in a new style in under a minute.',
    kicker: 'AI',
    h1: 'AI room design from a phone photo',
    lead: 'Have a finished room and want to see it in a different style? Take a photo, choose the room type and a style, and AI redesigns it with the same walls and windows in under a minute.',
    facts: [['< 1 min', 'per design'], ['8', 'room types'], ['Free', 'first design daily']],
    sections: [
      {
        h: 'How AI room design works',
        steps: [
          { t: 'Photograph the room', d: 'Take a sharp photo from a wide angle, ideally from a corner so two or three walls are visible.' },
          { t: 'Choose the room type', d: 'Living room, bedroom, majlis, dining, kitchen, bathroom, office or kids room. The type guides the furniture choice.' },
          { t: 'Choose a style', d: 'Modern, classic, contemporary Najdi, Scandinavian or luxury.' },
          { t: 'Compare and download', d: 'Drag to compare before and after, download the image, or try another style on the same photo.' },
        ],
      },
      {
        h: 'Which style suits your room?',
        ul: [
          'Modern: clean lines, neutral colours and plain furniture; suits most living rooms and bedrooms.',
          'Classic: ornament, rich fabrics and warm lighting; fits a majlis or a large dining room.',
          'Contemporary Najdi: earthy colours and natural materials inspired by the Najdi house, with a modern feel; suits a majlis or living room.',
          'Scandinavian: light colours, pale wood and practical simplicity; makes small rooms feel larger.',
          'Luxury: marble, metallic accents and considered lighting, for the main rooms where you receive guests.',
        ],
      },
      {
        h: 'Tips for a photo that works',
        ul: [
          'Shoot in daylight with the curtains open; good light improves the result more than anything else.',
          'Stand in a corner, hold the phone at chest height and use the wide lens if you have one.',
          'Clear small clutter from floors and tables, as the AI may try to read it as furniture.',
          'Do not upload photos with people in them.',
          'Try several styles on the same photo; the contrast helps you pin down your taste quickly.',
        ],
      },
      {
        h: 'What the result can and cannot do',
        p: [
          'AI redesign keeps the shape of the room: walls, windows and doors stay where they are, while furniture, colours, materials and lighting change. The result is strong inspiration for choosing a direction, but not a working drawing; furniture sizes in the image are approximate.',
          'If you need decisions based on measurements (will this sofa fit? how much flooring do I need?), upload your AutoCAD plan to the studio or ask our team for an interior design.',
        ],
      },
      {
        h: 'Pricing',
        p: [
          `Your first design each day is free. For more, buy credits once and use them whenever you like: ${p10.renders} designs for SAR ${p10.price}, ${p30.renders} designs for SAR ${p30.price}, or ${p100.renders} designs for SAR ${p100.price}, VAT included. Paid designs are higher quality and keep the room’s shape more accurately.`,
          'After paying you get a link to your balance; save it to use your credits on another device.',
        ],
      },
      {
        h: 'Which tool when?',
        ul: [
          'AI room redesign: the room exists and you want decor or renovation ideas fast.',
          'Studio from an AutoCAD plan: the home is not finished yet, or you need areas, quantities and a furniture layout on the plan.',
          'Team packages: you need measured photoreal renders, a 3ds Max file or a full design with materials and colours.',
        ],
      },
    ],
    faq: [
      { q: 'Is AI room design free?', a: `Your first design each day is free. After that, credits start at ${p10.renders} designs for SAR ${p10.price} including VAT.` },
      { q: 'Do the walls and windows stay the same?', a: 'Yes. The AI redesigns the room with the same walls and windows and changes furniture, colours, materials and lighting.' },
      { q: 'Which room types are supported?', a: 'Living room, bedroom, majlis, dining room, kitchen, bathroom, office and kids room.' },
      { q: 'Is my photo published?', a: 'No. The photo is sent to the AI provider for processing only and is not published.' },
      { q: 'Can I build exactly what the image shows?', a: 'The image is for inspiration and direction. For measured execution, upload your plan to the studio or ask our team for an interior design.' },
    ],
    ctaTitle: 'Photograph your room and try it',
    ctaText: 'Your first design today is free. Upload a photo, pick a style and see the result in a minute.',
  },

  'finishing-quantities': {
    title: 'Finishing Quantities from Your Floor Plan | Oxira',
    description: 'Calculate finishing quantities from your AutoCAD plan for free: flooring, paint, tiles, ceilings and skirting per room. Download CSV or request finishing quotes.',
    nav: 'Finishing quantities',
    card: 'Flooring, paint, tiles and ceiling quantities for every room of your plan.',
    kicker: 'Before finishing',
    h1: 'Finishing quantities from your floor plan, plus quotes',
    lead: 'Before you negotiate with a finishing contractor, know your quantities. Upload your AutoCAD plan and the studio calculates flooring, paint, tiles, ceilings and skirting for every room. Then download them or request quotes.',
    facts: [['5', 'quantity items'], ['CSV', 'download'], ['Free', 'no obligation']],
    sections: [
      {
        h: 'Which quantities does the studio calculate?',
        ul: [
          'Flooring: each room’s area plus 10% waste for cutting and laying.',
          'Wall paint: room perimeter × ceiling height minus doors and windows, for living spaces and corridors.',
          'Wall tiles: bathroom and kitchen walls at full height, minus openings.',
          'Ceilings: the area of each indoor room, useful for gypsum board or paint.',
          'Skirting: in linear metres, room perimeter minus door widths.',
        ],
        tip: 'Balconies and terraces only get flooring, with no interior paint or ceiling.',
      },
      {
        h: 'How to calculate quantities from your plan',
        steps: [
          { t: 'Upload the plan', d: 'Open the studio and upload the DXF floor plan. Closed rooms are detected and measured automatically.' },
          { t: 'Check units and height', d: 'Confirm the drawing units and the ceiling height, since paint and tiles depend directly on height.' },
          { t: 'Open the quantity table', d: 'For each room you see area, flooring, paint, tiles, ceiling and skirting, with totals.' },
          { t: 'Download or request quotes', d: 'Download the table as CSV for Excel, or click "Get finishing quotes" and choose a finish level: economy, standard or premium.' },
        ],
      },
      {
        h: 'Requesting finishing quotes',
        p: [
          'From inside the studio you send your plan quantities with your name, mobile number, city and the finish level you want. We send the quantities to our team and vetted contractors and contact you with a quote on WhatsApp. The request is free and without obligation.',
          'Because quotes are based on defined quantities, you can compare them on the same basis instead of lump-sum offers that are hard to compare.',
        ],
      },
      {
        h: 'Using quantities when negotiating',
        ul: [
          'Ask each contractor for a unit rate per item (per m² or per linear metre), then multiply by your quantities yourself.',
          'Ask whether the rate includes materials or labour only, and what waste percentage they assume.',
          'Compare the contractor’s quantities with yours; a big difference deserves a question.',
          'Treat the figures as planning estimates; final quantities are confirmed by measuring on site.',
        ],
      },
      {
        h: 'Common quantity mistakes',
        ul: [
          'Estimating paint from floor area; in a typical room the wall area is two to three times the floor area.',
          'Forgetting waste, or using one figure for every material; large tiles and diagonal laying need more than 10%, so adjust for your choice.',
          'Ignoring the final ceiling height; if a false ceiling will lower it, calculate paint and tiles at the finished height.',
          'Relying on the area in the purchase contract; the sale area includes walls and sometimes a share of common areas, while finishing is measured on each room’s net area.',
          'Mixing balconies and terraces with indoor rooms, although their materials and costs differ.',
        ],
      },
    ],
    faq: [
      { q: 'How accurate are the quantities?', a: 'Areas are calculated from your drawing to the centimetre; quantities are estimates for planning and comparison. Final figures are reviewed in team packages or by measuring on site.' },
      { q: 'Why do some rooms show no area?', a: 'Their walls are not closed in the drawing. Check layer roles in the studio, or make sure wall lines connect at the corners.' },
      { q: 'Is a quote request binding?', a: 'No. It is free and without obligation, and we contact you with the quote on WhatsApp.' },
      { q: 'Does it calculate electrical and plumbing?', a: 'No. The studio covers architectural finishing items: flooring, paint, tiles, ceilings and skirting.' },
      { q: 'Can I get a formal quantity table?', a: 'The Quick package includes a PDF quantity table after our team cleans up the plan and corrects the model.' },
    ],
    ctaTitle: 'Calculate your quantities now',
    ctaText: 'Upload the plan to the studio and open the quantity table, free and without sign-up.',
  },

  'saudi-arabia': {
    title: '3D Interior Design in Saudi Arabia | Oxira Design',
    description: '3D interior design for apartments and villas in Riyadh, Jeddah and across Saudi Arabia from AutoCAD plans, with majlis and annexes. Prices in SAR, pay with mada.',
    nav: 'Saudi Arabia',
    card: 'Saudi villas and apartments with their floors, annexes and majlis, Riyadh to Jeddah.',
    kicker: 'Saudi Arabia',
    h1: '3D interior design for apartments and villas in Saudi Arabia',
    lead: 'Oxira is a Saudi company based in Riyadh, and the studio is built around the Saudi home: it understands the majlis, the dining room, driver and maid rooms, and furnishes in a contemporary Najdi style. Upload your plan from any city and see it in 3D in seconds.',
    facts: [['Riyadh', 'team base'], ['Najdi', 'local style'], ['mada · Apple Pay', 'payment']],
    sections: [
      {
        h: 'Built around the Saudi home',
        p: [
          'Most 3D design tools are built for Western homes with one living room and an open kitchen. A Saudi home is different: a guest majlis with its own entrance, a dining room (maqlat) close to it, a separate family living room, and service rooms for the driver, maid and laundry.',
          'The studio reads Arabic room names in the drawing: majlis and living rooms become seating areas, dining rooms are furnished for dining, and driver, maid, laundry and storage rooms are treated as service spaces. In the contemporary Najdi style the majlis gets floor seating along the walls.',
        ],
      },
      {
        h: 'Villas in Riyadh and other cities: floors and annexes',
        p: [
          'A typical Saudi villa has a ground floor with the majlis, dining, living room and kitchen, a first floor for bedrooms and the family hall, a roof annex, and sometimes an outdoor annex and driver room in the courtyard.',
          'Upload each of these as its own DXF and set the ceiling height for each. If you bought the villa as a shell ("adhm") and are preparing for finishing, this is the best time to design: you settle layout, style and quantities before the contractor starts.',
        ],
      },
      {
        h: 'Apartments in Riyadh and Jeddah',
        ul: [
          'Owned apartments in residential buildings often have a living room, a small majlis and two to four bedrooms. The model shows whether the majlis is big enough for guests or better merged with the living room.',
          'Ground-floor apartments with a courtyard: walk through the living room and kitchen facing the courtyard and decide seating and openings before finishing.',
          'Roof apartments: label the open roof area "terrace" in the drawing so it gets flooring only, without interior paint or ceiling.',
          'Off-plan purchases: if you have the unit plan from the developer, see it furnished before handover and decide changes early.',
        ],
      },
      {
        h: 'How owners in the Kingdom use 3D design',
        ul: [
          'Before finishing: choose a style, calculate flooring, paint and tile quantities, and request finishing quotes.',
          'Before buying furniture: make sure sofas, beds and wardrobes fit the spaces.',
          'When selling or renting: publish a 3D tour for your property listing with a link and QR code for SAR 49 per listing, to share on listing platforms and social media.',
          'For developers: renders and tours for every unit type in a project on a monthly subscription.',
        ],
      },
      {
        h: 'Prices, payment and contact in the Kingdom',
        p: [
          `Prices are in Saudi riyals before 15% VAT: Quick package ${quick}, interior design ${perM2} with a minimum of ${designMin}. The Quick package is paid online through Moyasar with mada, Visa, Mastercard or Apple Pay; other packages receive a quote and invoice after we review the plan.`,
          'We communicate in Arabic or English on WhatsApp or email, and the team is in Riyadh: 426 Al Sulaymaniyah, Al Urubah Rd.',
        ],
      },
    ],
    faq: [
      { q: 'Do you serve Jeddah, Dammam, Makkah and other cities?', a: 'Yes. The service is fully online: upload the plan to the studio or send it with your order, and delivery is electronic wherever you are in the Kingdom.' },
      { q: 'Does the studio read Arabic plans from Saudi engineering offices?', a: 'Yes. It recognises Arabic layer names for walls, doors and windows, and Arabic room names such as majlis, living, bedroom and kitchen.' },
      { q: 'Can I pay with mada?', a: 'Yes. The Quick package is paid through Moyasar with mada, Visa, Mastercard or Apple Pay.' },
      { q: 'Will I receive an invoice?', a: 'Yes, you receive an invoice with your order. Published prices are before 15% VAT.' },
      { q: 'I have a shell villa. When should I start designing?', a: 'Before the finishing contractor starts, because layout and style determine lighting and socket positions, materials and quantities.' },
    ],
    ctaTitle: 'Upload your home’s plan',
    ctaText: 'From Riyadh, Jeddah or any city: open the studio and see your home in 3D in seconds.',
  },

  gulf: {
    title: '3D Interior Design in the UAE & Gulf | Oxira Design',
    description: '3D interior design from AutoCAD plans for apartments and villas in the UAE, Qatar, Kuwait, Bahrain and Oman: metres or feet, majlis, annexes and basements.',
    nav: 'UAE & Gulf',
    card: 'From Dubai townhouses to Kuwaiti homes with a basement and annex.',
    kicker: 'UAE, Qatar, Kuwait, Bahrain and Oman',
    h1: '3D interior design from floor plans in the UAE and the Gulf',
    lead: 'The service is fully online: upload your apartment or villa plan to the studio from Dubai, Doha, Kuwait City, Manama or Muscat, see it in 3D with furniture and areas in seconds, then ask our team for what you need.',
    facts: [['m² · ft²', 'metres or feet'], ['Majlis', 'Gulf furnishing'], ['Online', 'from any country']],
    sections: [
      {
        h: 'Terms and layouts differ from country to country',
        ul: [
          'UAE: standalone villas, townhouses and tower apartments, and property listings usually state areas in square feet.',
          'Kuwait: the plot ("qasima") and the multi-storey family house, often with a basement ("sirdab") and an annex. Each is uploaded as its own plan.',
          'Qatar, Bahrain and Oman: standalone and compound villas, often with an outdoor majlis separate from the house.',
          'Across the Gulf the majlis is central; the studio recognises a room named majlis and furnishes it as a seating space, with floor seating in the contemporary Najdi style.',
        ],
      },
      {
        h: 'Square metres or square feet?',
        p: [
          'The studio shows areas in square metres. To convert: 1 m² ≈ 10.764 sq ft, so a 1,200 sq ft apartment is roughly 111 m².',
          'If the drawing is in feet, make sure the AutoCAD insertion units are set to Feet (UNITS command, Insertion scale) before saving the DXF, because the studio reads the unit from the file. If it is in inches, choose "Inches" in the drawing units menu.',
        ],
      },
      {
        h: 'Plans in English or Arabic',
        p: [
          'Many Gulf plans use English layer and room names, especially from larger consultancies. The studio understands both: Walls, Doors and Windows or their Arabic equivalents, and even standard names such as A-WALL, A-DOOR and A-GLAZ.',
          'For rooms it recognises Bedroom, Kitchen, Living, Majlis, Maid’s room, Driver’s room and Laundry alongside Arabic names, so each room is furnished and measured appropriately.',
        ],
      },
      {
        h: 'Basements, annexes and outdoor majlis',
        p: [
          'A Gulf home is usually more than one plan: basement, ground floor, first floor, annex and an outdoor majlis. Upload each as its own DXF and set the ceiling height for each, since basements and annexes often differ from the main floors.',
          'In team packages we combine the floors into one model, and the Complete package adds facades and landscaping.',
        ],
      },
      {
        h: 'Working with us from outside Saudi Arabia',
        steps: [
          { t: 'Try the studio', d: 'Upload a DXF and see the model, areas and furniture. No sign-up, and the file is processed in your browser.' },
          { t: 'Send your order', d: 'Choose a package and enter your city and country. You can attach DWG or PDF files up to 15 MB.' },
          { t: 'Payment', d: 'Prices are in Saudi riyals. The Quick package is paid online by card or Apple Pay through Moyasar; other packages receive a quote within one working day.' },
          { t: 'Delivery', d: 'Renders and files are delivered electronically, and we communicate in Arabic or English on WhatsApp or email.' },
        ],
      },
    ],
    faq: [
      { q: 'Is the service available in the UAE, Qatar, Kuwait, Bahrain and Oman?', a: 'Yes. The service is fully online, we accept plans from any country, and the site is available in Arabic and English.' },
      { q: 'My plan is drawn in feet. Can the studio read it?', a: 'Yes, if the file’s insertion units are set to Feet. Areas are shown in m²; multiply by 10.764 for square feet.' },
      { q: 'Which currency do I pay in?', a: 'Prices are in Saudi riyals. Gulf customers pay the Quick package by card or Apple Pay, and other packages through a quote and invoice.' },
      { q: 'Do you work with Gulf real-estate developers?', a: 'Yes. The developer subscription covers renders and virtual tours for up to 10 unit types a month, and we welcome projects from outside the Kingdom.' },
    ],
    ctaTitle: 'Try it on your plan, from any country',
    ctaText: 'Open the studio, upload a DXF and see your apartment or villa in 3D in seconds.',
  },

  egypt: {
    title: '3D Apartment Design in Egypt Before Finishing | Oxira',
    description: 'Design your apartment, duplex or villa in 3D in Egypt before finishing, from an AutoCAD plan, and get free tile, paint and gypsum-board quantities.',
    nav: 'Egypt',
    card: 'Semi-finished apartment? See it in 3D and calculate finishing quantities first.',
    kicker: 'Egypt',
    h1: '3D apartment design in Egypt, before finishing starts',
    lead: 'Received a semi-finished unit in a compound or building? Upload the AutoCAD plan and see it in 3D with furniture and areas in seconds, then calculate tile, paint and ceiling quantities before you agree with a finishing contractor.',
    facts: [['Semi-finished', 'the ideal moment'], ['Free', 'model and quantities'], ['Online', 'Cairo to any city']],
    sections: [
      {
        h: 'Semi-finished units: the right time to design',
        p: [
          'Many units in Egypt are handed over semi-finished ("nos tashteeb") or at the plaster stage, and the owner decides the finishing level: lux, super lux or ultra super lux. Before the plumber and electrician start, you need to know where everything goes: beds, TV, kitchen and air conditioners, because they decide where sockets, lights and pipes go.',
          'A 3D model shows all of this before decisions turn into demolition and rework.',
        ],
      },
      {
        h: 'Room names as written on Egyptian plans',
        p: ['The studio recognises a room’s type from the name written inside it and furnishes it accordingly. Most Egyptian names are understood directly:'],
        ul: [
          '"نوم", "أوضة نوم" or "Master": bedroom.',
          '"سفرة": dining room; "مطبخ" (kitchen) and "حمام" (bathroom) as they are.',
          '"تراس" and "بلكونة": outdoor spaces that only get flooring.',
          '"استقبال", "صالة" or Reception: living space.',
        ],
        tip: 'The word "ريسبشن" written in Arabic letters is not recognised automatically; write "استقبال" or Reception, or change the room type after uploading.',
      },
      {
        h: 'Duplex, roof, penthouse and villa',
        ul: [
          'Duplex: upload each floor as its own DXF and check the internal stair position on both levels.',
          'Roof and penthouse: label the open part of the roof "terrace" (تراس) so its flooring is listed separately with no paint or ceiling.',
          'Townhouses, twin houses and standalone villas in compounds: each floor is its own plan, and facades and gardens are part of our Complete package.',
        ],
      },
      {
        h: 'Finishing quantities in the contractor’s terms',
        p: [
          'The studio’s quantity table gives each room’s floor area with 10% waste (ceramic or porcelain), paint area after deducting doors and windows, bathroom and kitchen wall tiles, ceiling area for gypsum board, and skirting in linear metres.',
          'Download the table as CSV and ask each contractor for a rate per square metre for each item, then compare offers on the same quantities. Remember these are estimates; final measurements are taken on site.',
        ],
      },
      {
        h: 'Prices and payment from Egypt',
        p: [
          `The studio, the 3D model and the quantities are free. Team packages are priced in Saudi riyals before VAT: Quick ${quick}, interior design ${perM2} with a minimum of ${designMin}. Online payment is by bank card, and if you have any payment questions, message us on WhatsApp.`,
        ],
      },
    ],
    faq: [
      { q: 'Is the service available in Egypt?', a: 'Yes, it is fully online. Upload the plan to the studio from any city in Egypt, order from the team and receive the files electronically.' },
      { q: 'My engineer sent the plan as a PDF. What now?', a: 'Ask for the AutoCAD DWG and save it as DXF, or send the PDF with a Quick package order and the team converts it into a model.' },
      { q: 'Does the studio calculate electrical and plumbing?', a: 'No, it covers architectural finishing items: flooring, paint, tiles, ceilings and skirting. Placing furniture in the model does help you decide socket and light positions.' },
      { q: 'Are prices in Egyptian pounds?', a: 'Published prices are in Saudi riyals and the studio itself is free. For paid packages your bank converts the amount when you pay by card.' },
      { q: 'Which style suits a small apartment?', a: 'Try modern and Scandinavian and compare them from the same angle; light colours and simple furniture make spaces feel larger.' },
    ],
    ctaTitle: 'See your apartment before finishing',
    ctaText: 'Upload the apartment plan to the free studio and calculate finishing quantities in the same step.',
  },
};
