// Spanish copy for the SEO landing pages (translated from guides-en.ts). Prices come from PRICES / REDESIGN_PACKS.
import { PRICES } from '../content';
import { REDESIGN_PACKS } from '../redesign';
import type { GuideCopy, GuideSlug, GuideUi } from '../guides';

const n = (x: number) => x.toLocaleString('es-ES');
const [p10, p30, p100] = REDESIGN_PACKS;
const quick = `${n(PRICES.quick)} SAR`;
const perM2 = `${n(PRICES.designPerM2)} SAR por m²`;
const designMin = `${n(PRICES.designMin)} SAR`;

export const guides: Record<GuideSlug, GuideCopy> = {
  'autocad-to-3d': {
    title: 'Plano AutoCAD a 3D online (DWG/DXF) | Oxira',
    description: 'Convierta un plano de AutoCAD a 3D en su navegador en segundos: muros, puertas, ventanas, superficies, mobiliario y recorrido virtual. DWG y PDF con el equipo.',
    nav: 'Plano AutoCAD a 3D',
    card: 'Suba un DXF y vea el plano en 3D con superficies y mobiliario en segundos.',
    kicker: 'De 2D a 3D',
    h1: 'Plano de AutoCAD a 3D, directamente en su navegador',
    lead: 'Suba un DXF guardado desde AutoCAD y el estudio de Oxira genera en segundos un modelo 3D con muros, puertas, ventanas y la superficie de cada estancia. Sin registro y sin instalar nada.',
    facts: [['DXF', 'lectura directa'], ['DWG · PDF', 'a través del equipo'], ['Gratis', 'modelo y superficies']],
    sections: [
      {
        h: 'Cómo un plano 2D se convierte en un modelo 3D',
        p: [
          'Un plano de AutoCAD es, en realidad, un conjunto de líneas, arcos y textos repartidos en capas. El estudio lee esas capas y deduce la función de cada una a partir de su nombre: muros, puertas, ventanas y lo que debe ignorarse, como cotas, sombreados, mobiliario dibujado y ejes.',
          'A continuación levanta los muros hasta la altura de techo que usted indique, abre los huecos de puertas y ventanas en su sitio, detecta las estancias cerradas y mide cada una, y lee los nombres escritos en el plano, como "dormitorio", "cocina" o "majlis", para saber qué es cada estancia y amueblarla en consecuencia.',
          'Todo ocurre dentro de su navegador. El archivo no se sube a nuestros servidores mientras usa el estudio, así que puede probarlo con tranquilidad con el plano de su propia vivienda.',
        ],
      },
      {
        h: 'Paso a paso',
        steps: [
          { t: 'Guarde el plano como DXF', d: 'Abra el dibujo en AutoCAD y guárdelo como DXF (versión 2013 o posterior). Si el archivo contiene varios planos o láminas, copie primero la planta que necesita a un archivo independiente.' },
          { t: 'Súbalo al estudio', d: 'Arrastre el archivo a la página del estudio o selecciónelo desde su dispositivo, hasta 40 MB. También puede empezar con uno de los planos de ejemplo.' },
          { t: 'Revise capas y unidades', d: 'El estudio muestra las capas que ha reconocido y su función. Si faltan muros, asigne la capa correcta a "Muros" y vuelva a generar el modelo. Compruebe las unidades del dibujo (mm, cm, m o pulgadas) y la altura de techo.' },
          { t: 'Explore y recorra el espacio', d: 'Cambie entre la vista 3D, la planta y el modo paseo, corte los muros para ver la distribución desde arriba y elija un estilo para cambiar el mobiliario.' },
          { t: 'Exporte o páselo al equipo', d: 'Descargue un PNG o un modelo GLB u OBJ en metros, o pida a nuestro equipo renders fotorrealistas y un archivo de 3ds Max listo para trabajar.' },
        ],
      },
      {
        h: 'Cómo exportar a DXF desde AutoCAD',
        ul: [
          'Archivo › Guardar como y, en "Tipo de archivo", elija AutoCAD 2013 DXF o una versión posterior.',
          'O escriba DXFOUT en la línea de comandos y elija la ubicación y la versión.',
          'Antes de guardar, elimine o inutilice las capas que no necesite, como cotas, cajetines y marcos. La lectura es más rápida y hay menos errores.',
          'Escriba el nombre de cada estancia como texto dentro de ella (TEXT o MTEXT), en inglés o en árabe, para que el estudio reconozca su tipo.',
          '¿Trabaja con Revit, ArchiCAD o BricsCAD? Exporte la planta a DXF desde el menú Exportar.',
        ],
      },
      {
        h: '¿Y los archivos DWG y PDF?',
        p: [
          'DWG es el formato nativo de AutoCAD y los navegadores no pueden leerlo directamente. La solución más rápida es guardarlo como DXF tal como se explica arriba, algo que lleva menos de un minuto.',
          `Si no tiene AutoCAD o solo dispone del plano en PDF, envíelo con un pedido del paquete Rápido (${quick} sin IVA) y nuestro equipo limpia el dibujo, lo convierte y corrige el modelo.`,
        ],
      },
      {
        h: 'Qué obtiene',
        ul: [
          'Un modelo 3D con muros a su altura real y puertas y ventanas con las medidas de su plano.',
          'La superficie de cada estancia y la superficie total.',
          'Mediciones estimadas de pavimento, pintura, techos, rodapié y alicatado de baños y cocina, descargables en CSV.',
          'Un primer amueblamiento para cada tipo de estancia en cinco estilos: moderno, clásico, najdí contemporáneo, escandinavo y de lujo.',
          'Un recorrido virtual, estancia por estancia.',
          'Exportación a PNG, GLB y OBJ que se abre en 3ds Max, Blender y SketchUp.',
        ],
      },
      {
        h: 'Consejos para un resultado más limpio',
        ul: [
          'Mantenga las líneas de los muros unidas en las esquinas: una estancia que no está cerrada no se puede medir.',
          'Asigne a las capas nombres claros, como Muros, Puertas y Ventanas.',
          'Dibuje puertas y ventanas como bloques; el estudio los usa para clasificar cada hueco.',
          'Una planta por archivo: cada nivel en su propio DXF.',
          'Si el modelo parece tener un tamaño incorrecto, cambie manualmente las unidades del dibujo en el panel de capas y vuelva a generarlo.',
        ],
      },
    ],
    faq: [
      { q: '¿Convertir un plano a 3D es gratis?', a: 'Sí. El modelo, las superficies, las mediciones estimadas, el mobiliario, el recorrido y las exportaciones son gratuitos en el estudio y sin registro. Solo paga por el trabajo del equipo, como los renders fotorrealistas y el archivo de 3ds Max.' },
      { q: '¿Qué versión de DXF debo usar?', a: 'La 2013 o posterior funciona mejor. Si la lectura falla, vuelva a guardar como DXF 2013 e inténtelo de nuevo.' },
      { q: '¿El estudio entiende nombres de capas y estancias en árabe?', a: 'Sí. Reconoce nombres de capas en árabe e inglés para muros, puertas y ventanas, y nombres de estancias como dormitorio, cocina, baño, salón y majlis (sala de visitas tradicional) en ambos idiomas.' },
      { q: 'Mi plano tiene varias plantas. ¿Cómo lo subo?', a: 'Suba cada planta como un DXF independiente. Si todas están en un mismo dibujo, copie cada planta a un archivo nuevo antes de guardar.' },
      { q: '¿Puedo convertir un PDF o una imagen a 3D?', a: 'No en el propio estudio, porque necesita geometría CAD real. Envíe el PDF con un pedido del paquete Rápido y nuestro equipo lo convierte.' },
      { q: '¿El modelo se abre en 3ds Max?', a: 'Sí. Las exportaciones GLB y OBJ están en metros y se abren en las versiones recientes de 3ds Max. Los paquetes del equipo incluyen un archivo .max organizado con capas y materiales.' },
    ],
    ctaTitle: 'Pruébelo con su propio plano',
    ctaText: 'Abra el estudio y suba un DXF, o empiece con un plano de ejemplo y vea el resultado en segundos.',
  },

  'apartment-3d-design': {
    title: 'Diseño 3D de pisos online desde su plano | Oxira',
    description: 'Diseñe su piso en 3D online desde un plano AutoCAD: mobiliario automático, cinco estilos, superficies y recorrido virtual. Pida renders o un diseño completo.',
    nav: 'Diseño 3D de pisos',
    card: 'Vea su piso amueblado en 3D antes de la reforma y de comprar los muebles.',
    kicker: 'Para pisos y apartamentos',
    h1: 'Diseño 3D de pisos online: véalo antes de reformarlo',
    lead: 'Suba el plano de su piso y véalo en 3D con mobiliario y superficies en segundos. Así puede decidir el estilo y la distribución antes de empezar los acabados o comprar un solo mueble.',
    facts: [['Segundos', 'del plano al 3D'], ['5', 'estilos de interiorismo'], [`${n(PRICES.designPerM2)} SAR`, 'por m², diseño completo']],
    sections: [
      {
        h: '¿Por qué diseñar primero un piso en 3D?',
        p: [
          'En un piso cada centímetro cuenta: dónde va el sofá frente a la televisión, hacia dónde abre la puerta del dormitorio, el espacio entre la cama y el armario, el paso libre en la cocina. Nada de esto es evidente en un plano en papel, pero se ve al instante al recorrer el piso en 3D.',
          'El modelo también facilita la conversación con su familia, su interiorista y su contratista. En lugar de describir una idea, envía una vista o un archivo y todos ven lo mismo.',
        ],
      },
      {
        h: 'Cómo diseñar su piso online',
        steps: [
          { t: 'Consiga el plano del piso', d: 'Pida el archivo de AutoCAD a la promotora, al estudio de arquitectura o al anterior propietario. Si es DWG, guárdelo como DXF en AutoCAD o pida una copia en DXF.' },
          { t: 'Súbalo al estudio', d: 'En segundos el estudio levanta muros, puertas y ventanas y mide el salón, los dormitorios, la cocina, los baños y el balcón.' },
          { t: 'Elija un estilo', d: 'Cambie entre moderno, clásico, najdí contemporáneo, escandinavo y de lujo; se coloca un primer amueblamiento según el tipo de estancia.' },
          { t: 'Recórralo y decida', d: 'Use el modo paseo para moverse por el piso a la altura de los ojos y corte los muros para ver toda la distribución desde arriba.' },
          { t: 'Páselo al equipo si lo necesita', d: 'Pida renders fotorrealistas o un diseño de interiores completo con materiales, colores e iluminación. Su diseño del estudio se adjunta al pedido automáticamente.' },
        ],
      },
      {
        h: 'Qué verá en el modelo de su piso',
        ul: [
          'Salón con sofás y mesa de centro, dormitorios con camas y armarios.',
          'Cocina y baños con equipamiento básico, además del balcón o la terraza.',
          'La superficie de cada estancia en m² y el total del piso.',
          'Mediciones estimadas de pavimento, pintura, alicatado, techos y rodapié, útiles para comparar presupuestos de reforma.',
          'Vistas PNG para compartir y un modelo GLB u OBJ para quien continúe en otro programa.',
        ],
      },
      {
        h: 'Del modelo gratuito a un diseño de interiores completo',
        p: ['El modelo y el primer amueblamiento son gratuitos en el estudio y bastan para entender la distribución y elegir una dirección. Cuando necesite imágenes realistas o archivos de producción, hay dos paquetes del equipo:'],
        ul: [
          `Rápido (${quick} sin IVA): limpieza del plano y corrección del modelo, 8 renders en alta resolución, archivos de 3ds Max y GLB y una tabla de mediciones en PDF en 48 horas laborables.`,
          `Diseño de interiores (${perM2}, mínimo ${designMin}, sin IVA): un interiorista trabaja con usted en cada estancia, 15 renders en V-Ray, un tour 360° para compartir y dos rondas de cambios. Ejemplo: un piso de 120 m² cuesta ${n(120 * PRICES.designPerM2)} SAR sin IVA, con entrega en 5 a 10 días laborables según la superficie.`,
        ],
      },
      {
        h: 'Consejos prácticos para diseñar un piso',
        ul: [
          'Deje pasos cómodos entre los muebles y valore el espacio recorriendo el modelo, no solo mirando el plano.',
          'Compruebe el giro de las puertas, sobre todo las de dormitorios y baños cercanas a armarios.',
          'En pisos pequeños, los colores claros y los muebles bajos amplían visualmente las estancias; compare los estilos escandinavo y moderno.',
          'Fije la posición de la televisión, las camas y los escritorios antes de los acabados, porque determinan dónde van los enchufes y los puntos de luz.',
          'Saque una vista por estilo desde el mismo ángulo y compárelas con su familia antes de decidir.',
        ],
      },
    ],
    faq: [
      { q: 'No tengo el archivo de AutoCAD de mi piso. ¿Qué puedo hacer?', a: 'Pídalo a la promotora o al estudio de arquitectura que diseñó el edificio. Si solo tiene un PDF, envíelo con un pedido del paquete Rápido y nuestro equipo lo convierte en un modelo.' },
      { q: '¿El mobiliario del modelo está a escala real?', a: 'El amueblamiento automático es una primera propuesta con piezas de tamaño estándar según el tipo de estancia, para que entienda la distribución y el espacio. La elección de piezas concretas con medidas exactas se hace con un interiorista en el paquete de diseño de interiores.' },
      { q: '¿Cuánto cuesta el diseño completo de un piso?', a: `El modelo del estudio es gratuito. Un diseño de interiores completo cuesta ${perM2} con un mínimo de ${designMin} sin el 15 % de IVA, y el paquete Rápido cuesta ${quick}.` },
      { q: '¿Trabajan con pisos en Egipto y el Golfo?', a: 'Sí. El servicio es totalmente online y aceptamos planos de cualquier país. Consulte las páginas de Egipto y del Golfo para ver qué cambia en cada lugar.' },
      { q: '¿Puedo compartir el diseño con mi contratista?', a: 'Sí. Descargue vistas PNG y la tabla de mediciones en CSV, o exporte en GLB u OBJ. Los paquetes del equipo añaden un archivo .max y renders en alta resolución.' },
    ],
    ctaTitle: 'Vea su piso en 3D hoy mismo',
    ctaText: 'Suba el plano de su piso al estudio gratuito y elija su estilo antes de empezar la reforma.',
  },

  'villa-3d-design': {
    title: 'Diseño 3D de villas desde planos AutoCAD | Oxira',
    description: 'Diseño 3D de villas desde planos AutoCAD: cada planta en 3D con superficies, mobiliario y majlis, además de renders fotorrealistas, fachadas e interiorismo.',
    nav: 'Diseño 3D de villas',
    card: 'Cada planta de la villa en 3D, con majlis, zona familiar y estancias de servicio.',
    kicker: 'Para villas y casas',
    h1: 'Diseño 3D de villas a partir de sus planos de AutoCAD',
    lead: 'Una villa es una gran decisión con muchos espacios: majlis (sala de visitas), comedor, sala familiar, dormitorios y un anexo. Suba el plano de cada planta y véala en 3D con mobiliario y superficies antes de empezar los acabados.',
    facts: [['Cada planta', 'su propio modelo'], ['Majlis', 'asientos árabes'], ['Interior + exterior', 'paquete Completo']],
    sections: [
      {
        h: 'Por qué una villa necesita un diseño 3D',
        p: [
          'En una villa se cruzan las zonas de invitados, de familia y de servicio, y los errores de distribución son difíciles de corregir una vez terminados los acabados: un majlis de hombres con vistas a la sala familiar, una cocina lejos del comedor, una escalera que parte en dos la primera planta. Un modelo 3D deja al descubierto estas relaciones antes de que cuesten dinero.',
          'Como los presupuestos de acabados y mobiliario de una villa son elevados, ver cada planta amueblada y medida le ayuda a repartir el presupuesto entre plantas y estancias con seguridad.',
        ],
      },
      {
        h: 'Qué es automático y qué hace el equipo',
        ul: [
          'Automático en el estudio: muros y huecos de cada planta, detección de estancias y superficies, un primer amueblamiento que incluye un majlis con asientos bajos de estilo najdí, mediciones estimadas y un recorrido virtual.',
          'A cargo del equipo: limpieza de planos grandes y archivos DWG, diseño de interiores a su gusto con materiales, colores e iluminación, renders en V-Ray o Corona y un archivo de 3ds Max organizado.',
          'En el paquete Completo: diseño interior y exterior, fachadas y paisajismo, planos de ejecución para el contratista, un vídeo de recorrido animado y un director de proyecto dedicado.',
        ],
      },
      {
        h: 'Cómo preparar y subir los planos de una villa',
        steps: [
          { t: 'Separe las plantas', d: 'Guarde cada planta (baja, primera, anexo o cubierta y, si lo hay, sótano) como un DXF independiente, porque el estudio genera una planta cada vez.' },
          { t: 'Nombre las estancias en el plano', d: 'Escriba nombres como majlis, salón, comedor, dormitorio, cocina y cuarto del chófer dentro de cada estancia para que el estudio la reconozca y la amueble.' },
          { t: 'Ajuste la altura de techo por planta', d: 'Indique la altura de techo de cada planta en el panel de capas; la planta baja y el anexo suelen ser distintos.' },
          { t: 'Revise y exporte', d: 'Recorra cada planta, descargue la tabla de mediciones de cada una y envíe los archivos con su pedido si necesita renders o un diseño completo.' },
        ],
      },
      {
        h: 'Cuánto cuesta diseñar una villa',
        p: [
          `El diseño de interiores se calcula por superficie: ${perM2} sin IVA, con un mínimo de ${designMin}. Una villa con 400 m² de superficie interior, por ejemplo, sale por ${n(400 * PRICES.designPerM2)} SAR sin IVA, con todas las estancias, 15 renders en V-Ray, un tour 360° y dos rondas de cambios.`,
          'El paquete Completo, con fachadas, paisajismo y planos de ejecución, se presupuesta por proyecto tras revisar los planos, y recibirá el presupuesto en un día laborable.',
        ],
      },
      {
        h: 'Consejos para diseñar una villa',
        ul: [
          'Separe las circulaciones de invitados y de familia: defina primero la entrada al majlis y el aseo de invitados.',
          'Mantenga el comedor cerca de la cocina o de una cocina auxiliar, y compruebe la distancia recorriendo el modelo.',
          'Revise la posición de la escalera en cada planta y asegúrese de que no se llega a los dormitorios atravesando zonas de invitados.',
          'Dé medidas prácticas a las estancias de servicio, la lavandería y el almacén; influyen en la comodidad diaria más de lo que parece.',
          'Compare al menos dos estilos para el salón y el majlis, los dos espacios que más ven los invitados.',
        ],
      },
    ],
    faq: [
      { q: '¿Puedo subir toda la villa en un solo archivo?', a: 'El estudio genera una planta cada vez, así que suba cada planta como un DXF independiente. En los paquetes de diseño, nuestro equipo une las plantas en un único modelo.' },
      { q: '¿Diseñan fachadas exteriores?', a: 'Sí, en el paquete Completo junto con el paisajismo. El estudio gratuito se centra en las plantas interiores.' },
      { q: '¿El estudio admite un majlis árabe?', a: 'Sí. Una estancia llamada majlis se trata como zona de asientos y, en el estilo najdí contemporáneo, recibe asientos bajos a lo largo de las paredes.' },
      { q: '¿Cuánto tarda el diseño completo de una villa?', a: 'El diseño de interiores lleva de 5 a 10 días laborables según la superficie. En el paquete Completo, el plazo se fija en el presupuesto según el alcance del proyecto.' },
      { q: '¿Recibo archivos para mi contratista?', a: 'Los paquetes del equipo incluyen un archivo .max organizado y renders en alta resolución, y el paquete Completo añade planos de ejecución para el contratista.' },
    ],
    ctaTitle: 'Empiece por la planta baja',
    ctaText: 'Suba el plano de la primera planta al estudio gratuito, véala en 3D y después pida al equipo el diseño completo.',
  },

  'interior-renders': {
    title: 'Render interior 3D fotorrealista y 3ds Max | Oxira',
    description: 'Render interior 3D fotorrealista en V-Ray o Corona y archivo de 3ds Max organizado con capas y materiales, desde su plano AutoCAD. Paquete Rápido en 48 horas.',
    nav: 'Renders y 3ds Max',
    card: 'Imágenes fotorrealistas en V-Ray o Corona y un archivo .max organizado desde su plano.',
    kicker: 'Visualización de interiores',
    h1: 'Renders interiores fotorrealistas y un archivo de 3ds Max listo',
    lead: 'De un plano de AutoCAD a imágenes interiores fotorrealistas y un archivo de 3ds Max organizado sobre el que su interiorista o contratista puede seguir trabajando, con paquetes claros y precios publicados.',
    facts: [['V-Ray · Corona', 'motores de render'], ['.max · GLB', 'archivos entregados'], ['48 horas', 'paquete Rápido']],
    sections: [
      {
        h: 'Renders con IA frente a renders fotorrealistas del equipo',
        p: [
          'En el estudio puede convertir cualquier vista del modelo en una imagen realista con IA en menos de un minuto, con 3 renders gratis al día. Son ideales para explorar ideas y estilos rápidamente, pero son interpretativos y pueden no coincidir con las medidas reales.',
          'Un render fotorrealista de nuestro equipo se basa en un modelo 3D ajustado a las medidas de su plano, con materiales e iluminación definidos en 3ds Max y renderizado en V-Ray o Corona. Es lo que necesita para presentárselo a su familia, comercializar un inmueble o dar a un contratista instrucciones claras.',
        ],
      },
      {
        h: 'Qué incluye cada paquete',
        ul: [
          `Rápido (${quick} sin IVA): limpieza del plano y corrección del modelo, se aceptan DWG y PDF, 8 renders en alta resolución, un archivo de 3ds Max (.max) y GLB y una tabla de mediciones en PDF, en 48 horas laborables.`,
          `Diseño de interiores (${perM2}, mínimo ${designMin}, sin IVA): diseño completo de la vivienda, materiales, colores e iluminación, 15 renders fotorrealistas en V-Ray, un tour 360° para compartir y dos rondas de cambios, con un archivo .max organizado.`,
          'Completo (presupuesto por proyecto): diseño interior y exterior, fachadas y paisajismo, planos de ejecución, un vídeo de recorrido animado y un director de proyecto dedicado.',
        ],
      },
      {
        h: 'Por qué importa el archivo de 3ds Max',
        p: [
          'Muchos interioristas empiezan desde cero dibujando muros en 3ds Max, lo que supone horas antes del primer render. Un archivo .max organizado con capas y materiales se salta esa fase: muros y huecos a la medida correcta, mobiliario y materiales nombrados y agrupados, para que el interiorista continúe donde lo dejamos.',
          'Si su equipo usa Blender o SketchUp, las exportaciones GLB y OBJ están en metros y se abren sin reescalar.',
        ],
      },
      {
        h: 'Cómo encargar renders',
        steps: [
          { t: 'Abra su plano en el estudio', d: 'Suba el DXF y elija el estilo más cercano a su gusto. Así el interiorista tiene un punto de partida claro.' },
          { t: 'Haga el pedido al equipo', d: 'Use "Encargar al equipo" en el estudio o el formulario de pedido de la página de inicio y elija un paquete. Su diseño del estudio se adjunta automáticamente.' },
          { t: 'Añada sus preferencias', d: 'Indique los colores y materiales que le gustan y las estancias y ángulos más importantes, y adjunte imágenes de referencia si las tiene.' },
          { t: 'Pague o reciba un presupuesto', d: 'El paquete Rápido se paga online a través de Moyasar (mada, Visa, Mastercard, Apple Pay); para los demás paquetes recibirá un presupuesto en un día laborable.' },
        ],
      },
      {
        h: 'Consejos para que los renders reflejen su gusto',
        ul: [
          'Comparta de 3 a 5 imágenes de referencia en lugar de una descripción larga; las imágenes comunican más rápido.',
          'Enumere los acabados que ya ha elegido (tipo de pavimento, color del mármol o del porcelánico) para que los renders coincidan con ellos.',
          'Ordene las estancias por importancia: el salón y el majlis suelen merecer más ángulos que las estancias de servicio.',
          'Si los renders son para marketing inmobiliario, indíquelo, para que el estilo y los encuadres se adapten.',
        ],
      },
    ],
    faq: [
      { q: '¿Qué motor de render utilizan?', a: 'V-Ray o Corona dentro de 3ds Max, según el proyecto.' },
      { q: '¿Puedo editar yo mismo el archivo .max?', a: 'Sí. Está organizado con capas y materiales para que cualquier interiorista pueda continuar. Indique su versión de 3ds Max en las notas del pedido.' },
      { q: '¿Qué diferencia hay entre 8 y 15 renders?', a: 'El paquete Rápido ofrece 8 renders en alta resolución del modelo corregido en 48 horas laborables. El paquete de diseño de interiores incluye el diseño completo de cada estancia con 15 renders en V-Ray y dos rondas de cambios.' },
      { q: '¿Los precios incluyen IVA?', a: 'Los precios publicados están en riales saudíes, sin el 15 % de IVA.' },
      { q: '¿Hacen renders de promociones inmobiliarias con varias tipologías?', a: 'Sí. La suscripción para promotoras cubre hasta 10 tipologías de vivienda al mes. Encontrará los detalles en la sección para promotoras de la página de inicio.' },
    ],
    ctaTitle: 'Empiece desde su plano',
    ctaText: 'Suba el plano al estudio y encargue los renders al equipo con un solo clic.',
  },

  'ai-room-design': {
    title: 'Diseño de interiores con IA desde una foto | Oxira',
    description: 'Diseño de interiores con IA desde una foto del móvil: cómo hacer la foto, qué estilo elegir y cuándo necesita un plano. Primer diseño del día gratis.',
    nav: 'Diseño con IA',
    card: 'Fotografíe una estancia y véala rediseñada en otro estilo en menos de un minuto.',
    kicker: 'IA',
    h1: 'Diseño de interiores con IA a partir de una foto del móvil',
    lead: '¿Tiene una estancia terminada y quiere verla en otro estilo? Haga una foto, elija el tipo de estancia y un estilo, y la IA la rediseña con las mismas paredes y ventanas en menos de un minuto.',
    facts: [['< 1 min', 'por diseño'], ['8', 'tipos de estancia'], ['Gratis', 'primer diseño del día']],
    sections: [
      {
        h: 'Cómo funciona el diseño de interiores con IA',
        steps: [
          { t: 'Fotografíe la estancia', d: 'Haga una foto nítida con un ángulo amplio, idealmente desde una esquina para que se vean dos o tres paredes.' },
          { t: 'Elija el tipo de estancia', d: 'Salón, dormitorio, majlis, comedor, cocina, baño, despacho o habitación infantil. El tipo orienta la elección del mobiliario.' },
          { t: 'Elija un estilo', d: 'Moderno, clásico, najdí contemporáneo, escandinavo o de lujo.' },
          { t: 'Compare y descargue', d: 'Deslice para comparar el antes y el después, descargue la imagen o pruebe otro estilo con la misma foto.' },
        ],
      },
      {
        h: '¿Qué estilo le va a su estancia?',
        ul: [
          'Moderno: líneas limpias, colores neutros y mobiliario sencillo; encaja en la mayoría de salones y dormitorios.',
          'Clásico: ornamentación, tejidos ricos e iluminación cálida; ideal para un majlis o un comedor amplio.',
          'Najdí contemporáneo: colores terrosos y materiales naturales inspirados en la casa tradicional del Najd, con un aire moderno; adecuado para un majlis o un salón.',
          'Escandinavo: colores claros, madera clara y sencillez práctica; hace que las estancias pequeñas parezcan más grandes.',
          'Lujo: mármol, detalles metálicos e iluminación cuidada, para las estancias principales donde recibe a sus invitados.',
        ],
      },
      {
        h: 'Consejos para una foto que funcione',
        ul: [
          'Haga la foto con luz natural y las cortinas abiertas; una buena luz mejora el resultado más que cualquier otra cosa.',
          'Colóquese en una esquina, sostenga el móvil a la altura del pecho y use el gran angular si lo tiene.',
          'Retire objetos pequeños del suelo y de las mesas, porque la IA puede interpretarlos como muebles.',
          'No suba fotos en las que aparezcan personas.',
          'Pruebe varios estilos con la misma foto; el contraste le ayuda a definir su gusto rápidamente.',
        ],
      },
      {
        h: 'Qué puede y qué no puede hacer el resultado',
        p: [
          'El rediseño con IA conserva la forma de la estancia: paredes, ventanas y puertas se quedan donde están, mientras cambian el mobiliario, los colores, los materiales y la iluminación. El resultado es una gran fuente de inspiración para elegir una dirección, pero no un plano de trabajo; el tamaño de los muebles en la imagen es aproximado.',
          'Si necesita tomar decisiones basadas en medidas (¿cabe este sofá?, ¿cuánto pavimento necesito?), suba su plano de AutoCAD al estudio o pida a nuestro equipo un diseño de interiores.',
        ],
      },
      {
        h: 'Precios',
        p: [
          `Su primer diseño de cada día es gratuito. Para más, compre créditos una sola vez y úselos cuando quiera: ${p10.renders} diseños por ${p10.price} SAR, ${p30.renders} diseños por ${p30.price} SAR o ${p100.renders} diseños por ${p100.price} SAR, IVA incluido. Los diseños de pago tienen más calidad y respetan con más precisión la forma de la estancia.`,
          'Tras el pago recibirá un enlace a su saldo; guárdelo para usar sus créditos en otro dispositivo.',
        ],
      },
      {
        h: '¿Qué herramienta usar en cada caso?',
        ul: [
          'Rediseño de estancias con IA: la estancia ya existe y quiere ideas de decoración o reforma rápidamente.',
          'Estudio desde un plano de AutoCAD: la vivienda aún no está terminada, o necesita superficies, mediciones y una distribución del mobiliario sobre el plano.',
          'Paquetes del equipo: necesita renders fotorrealistas a escala, un archivo de 3ds Max o un diseño completo con materiales y colores.',
        ],
      },
    ],
    faq: [
      { q: '¿El diseño de interiores con IA es gratis?', a: `Su primer diseño de cada día es gratuito. Después, los créditos empiezan en ${p10.renders} diseños por ${p10.price} SAR con IVA incluido.` },
      { q: '¿Las paredes y ventanas se mantienen iguales?', a: 'Sí. La IA rediseña la estancia con las mismas paredes y ventanas y cambia el mobiliario, los colores, los materiales y la iluminación.' },
      { q: '¿Qué tipos de estancia se admiten?', a: 'Salón, dormitorio, majlis, comedor, cocina, baño, despacho y habitación infantil.' },
      { q: '¿Se publica mi foto?', a: 'No. La foto se envía al proveedor de IA solo para procesarla y no se publica.' },
      { q: '¿Puedo construir exactamente lo que muestra la imagen?', a: 'La imagen sirve de inspiración y orientación. Para una ejecución con medidas, suba su plano al estudio o pida a nuestro equipo un diseño de interiores.' },
    ],
    ctaTitle: 'Fotografíe su estancia y pruébelo',
    ctaText: 'Su primer diseño de hoy es gratis. Suba una foto, elija un estilo y vea el resultado en un minuto.',
  },

  'finishing-quantities': {
    title: 'Mediciones de acabados desde su plano | Oxira',
    description: 'Calcule gratis las mediciones de acabados desde su plano AutoCAD: pavimento, pintura, alicatado, techos y rodapié. Descargue CSV o pida presupuestos.',
    nav: 'Mediciones de acabados',
    card: 'Mediciones de pavimento, pintura, alicatado y techos para cada estancia de su plano.',
    kicker: 'Antes de los acabados',
    h1: 'Mediciones de acabados desde su plano, y presupuestos',
    lead: 'Antes de negociar con un contratista de acabados, conozca sus mediciones. Suba su plano de AutoCAD y el estudio calcula pavimento, pintura, alicatado, techos y rodapié de cada estancia. Después, descárguelas o solicite presupuestos.',
    facts: [['5', 'partidas medidas'], ['CSV', 'descarga'], ['Gratis', 'sin compromiso']],
    sections: [
      {
        h: '¿Qué mediciones calcula el estudio?',
        ul: [
          'Pavimento: la superficie de cada estancia más un 10 % de merma por cortes y colocación.',
          'Pintura de paredes: perímetro de la estancia × altura de techo, menos puertas y ventanas, en zonas habitables y pasillos.',
          'Alicatado: paredes de baños y cocina a altura completa, descontando huecos.',
          'Techos: la superficie de cada estancia interior, útil para placa de yeso laminado o pintura.',
          'Rodapié: en metros lineales, perímetro de la estancia menos el ancho de las puertas.',
        ],
        tip: 'Los balcones y terrazas solo reciben pavimento, sin pintura interior ni techo.',
      },
      {
        h: 'Cómo calcular las mediciones desde su plano',
        steps: [
          { t: 'Suba el plano', d: 'Abra el estudio y suba la planta en DXF. Las estancias cerradas se detectan y se miden automáticamente.' },
          { t: 'Revise unidades y altura', d: 'Confirme las unidades del dibujo y la altura de techo, ya que la pintura y el alicatado dependen directamente de la altura.' },
          { t: 'Abra la tabla de mediciones', d: 'Para cada estancia verá superficie, pavimento, pintura, alicatado, techo y rodapié, con los totales.' },
          { t: 'Descargue o pida presupuestos', d: 'Descargue la tabla en CSV para Excel, o pulse "Pedir presupuestos de acabados" y elija un nivel de acabado: económico, estándar o premium.' },
        ],
      },
      {
        h: 'Cómo solicitar presupuestos de acabados',
        p: [
          'Desde el propio estudio envía las mediciones de su plano junto con su nombre, número de móvil, ciudad y el nivel de acabado que desea. Trasladamos las mediciones a nuestro equipo y a contratistas verificados y le contactamos con un presupuesto por WhatsApp. La solicitud es gratuita y sin compromiso.',
          'Como los presupuestos se basan en mediciones definidas, puede compararlos en igualdad de condiciones en lugar de ofertas a tanto alzado difíciles de comparar.',
        ],
      },
      {
        h: 'Cómo usar las mediciones al negociar',
        ul: [
          'Pida a cada contratista un precio unitario por partida (por m² o por metro lineal) y multiplíquelo usted mismo por sus mediciones.',
          'Pregunte si el precio incluye materiales o solo mano de obra, y qué porcentaje de merma considera.',
          'Compare las mediciones del contratista con las suyas; una diferencia grande merece una pregunta.',
          'Tome las cifras como estimaciones de planificación; las mediciones definitivas se confirman en obra.',
        ],
      },
      {
        h: 'Errores habituales en las mediciones',
        ul: [
          'Estimar la pintura a partir de la superficie del suelo; en una estancia típica, la superficie de paredes es de dos a tres veces la del suelo.',
          'Olvidar la merma o usar la misma cifra para todos los materiales; las piezas de gran formato y la colocación en diagonal necesitan más de un 10 %, así que ajústela según su elección.',
          'No tener en cuenta la altura de techo final; si un falso techo la va a reducir, calcule la pintura y el alicatado con la altura terminada.',
          'Fiarse de la superficie del contrato de compra; la superficie construida incluye muros y a veces parte de las zonas comunes, mientras que los acabados se miden sobre la superficie útil de cada estancia.',
          'Mezclar balcones y terrazas con las estancias interiores, aunque sus materiales y costes son distintos.',
        ],
      },
    ],
    faq: [
      { q: '¿Qué precisión tienen las mediciones?', a: 'Las superficies se calculan a partir de su plano con precisión de centímetros; las mediciones son estimaciones para planificar y comparar. Las cifras finales se revisan en los paquetes del equipo o midiendo en obra.' },
      { q: '¿Por qué algunas estancias no muestran superficie?', a: 'Sus muros no están cerrados en el dibujo. Revise la función de las capas en el estudio o asegúrese de que las líneas de los muros se unen en las esquinas.' },
      { q: '¿Una solicitud de presupuesto es vinculante?', a: 'No. Es gratuita y sin compromiso, y le contactamos con el presupuesto por WhatsApp.' },
      { q: '¿Calcula electricidad y fontanería?', a: 'No. El estudio cubre partidas de acabados arquitectónicos: pavimento, pintura, alicatado, techos y rodapié.' },
      { q: '¿Puedo obtener una tabla de mediciones formal?', a: 'El paquete Rápido incluye una tabla de mediciones en PDF después de que nuestro equipo limpie el plano y corrija el modelo.' },
    ],
    ctaTitle: 'Calcule sus mediciones ahora',
    ctaText: 'Suba el plano al estudio y abra la tabla de mediciones, gratis y sin registro.',
  },

  'saudi-arabia': {
    title: 'Diseño de interiores 3D en Arabia Saudí | Oxira',
    description: 'Diseño de interiores 3D de pisos y villas en Riad, Yeda y toda Arabia Saudí desde planos AutoCAD, con majlis y anexos. Precios en SAR y pago con mada.',
    nav: 'Arabia Saudí',
    card: 'Villas y pisos saudíes con sus plantas, anexos y majlis, de Riad a Yeda.',
    kicker: 'Arabia Saudí',
    h1: 'Diseño de interiores 3D para pisos y villas en Arabia Saudí',
    lead: 'Oxira es una empresa saudí con sede en Riad, y el estudio está pensado para la vivienda saudí: entiende el majlis, el comedor y los cuartos del chófer y del servicio doméstico, y amuebla en un estilo najdí contemporáneo. Suba su plano desde cualquier ciudad y véalo en 3D en segundos.',
    facts: [['Riad', 'sede del equipo'], ['Najdí', 'estilo local'], ['mada · Apple Pay', 'pago']],
    sections: [
      {
        h: 'Pensado para la vivienda saudí',
        p: [
          'La mayoría de las herramientas de diseño 3D están pensadas para viviendas occidentales con un solo salón y cocina abierta. Una vivienda saudí es distinta: un majlis para invitados con entrada propia, un comedor cercano a él, una sala familiar independiente y estancias de servicio para el chófer, el servicio doméstico y la lavandería.',
          'El estudio lee los nombres de estancias en árabe escritos en el plano: el majlis y los salones se convierten en zonas de asientos, los comedores se amueblan para comer, y los cuartos del chófer, del servicio doméstico, la lavandería y el almacén se tratan como espacios de servicio. En el estilo najdí contemporáneo, el majlis recibe asientos bajos a lo largo de las paredes.',
        ],
      },
      {
        h: 'Villas en Riad y otras ciudades: plantas y anexos',
        p: [
          'Una villa saudí típica tiene una planta baja con majlis, comedor, salón y cocina, una primera planta con dormitorios y sala familiar, un anexo en la cubierta y, a veces, un anexo exterior y un cuarto para el chófer en el patio.',
          'Suba cada uno como un DXF independiente y ajuste la altura de techo de cada uno. Si compró la villa en estructura ("adhm") y se prepara para los acabados, es el mejor momento para diseñar: define la distribución, el estilo y las mediciones antes de que empiece el contratista.',
        ],
      },
      {
        h: 'Pisos en Riad y Yeda',
        ul: [
          'Los pisos en propiedad en edificios residenciales suelen tener un salón, un majlis pequeño y de dos a cuatro dormitorios. El modelo muestra si el majlis es suficiente para recibir invitados o conviene unirlo al salón.',
          'Pisos en planta baja con patio: recorra el salón y la cocina que dan al patio y decida los asientos y las aberturas antes de los acabados.',
          'Áticos: indique la zona descubierta de la cubierta como "terraza" en el plano para que solo reciba pavimento, sin pintura interior ni techo.',
          'Compras sobre plano: si tiene el plano de la vivienda facilitado por la promotora, véalo amueblado antes de la entrega y decida los cambios a tiempo.',
        ],
      },
      {
        h: 'Cómo usan el diseño 3D los propietarios en el Reino',
        ul: [
          'Antes de los acabados: elegir un estilo, calcular las mediciones de pavimento, pintura y alicatado, y pedir presupuestos de acabados.',
          'Antes de comprar muebles: comprobar que sofás, camas y armarios caben en los espacios.',
          'Al vender o alquilar: publicar un tour 3D de su anuncio inmobiliario con enlace y código QR por 49 SAR por anuncio, para compartirlo en portales inmobiliarios y redes sociales.',
          'Para promotoras: renders y tours de cada tipología de un proyecto con una suscripción mensual.',
        ],
      },
      {
        h: 'Precios, pago y contacto en el Reino',
        p: [
          `Los precios están en riales saudíes, sin el 15 % de IVA: paquete Rápido ${quick}, diseño de interiores ${perM2} con un mínimo de ${designMin}. El paquete Rápido se paga online a través de Moyasar con mada, Visa, Mastercard o Apple Pay; para los demás paquetes recibirá un presupuesto y una factura tras revisar el plano.`,
          'Nos comunicamos en árabe o en inglés por WhatsApp o correo electrónico, y el equipo está en Riad: 426 Al Sulaymaniyah, Al Urubah Rd.',
        ],
      },
    ],
    faq: [
      { q: '¿Dan servicio en Yeda, Dammam, La Meca y otras ciudades?', a: 'Sí. El servicio es totalmente online: suba el plano al estudio o envíelo con su pedido, y la entrega es electrónica esté donde esté dentro del Reino.' },
      { q: '¿El estudio lee planos en árabe de estudios de arquitectura saudíes?', a: 'Sí. Reconoce nombres de capas en árabe para muros, puertas y ventanas, y nombres de estancias en árabe como majlis, salón, dormitorio y cocina.' },
      { q: '¿Puedo pagar con mada?', a: 'Sí. El paquete Rápido se paga a través de Moyasar con mada, Visa, Mastercard o Apple Pay.' },
      { q: '¿Recibiré una factura?', a: 'Sí, recibirá una factura con su pedido. Los precios publicados no incluyen el 15 % de IVA.' },
      { q: 'Tengo una villa en estructura. ¿Cuándo debo empezar a diseñar?', a: 'Antes de que empiece el contratista de acabados, porque la distribución y el estilo determinan la posición de la iluminación y los enchufes, los materiales y las mediciones.' },
    ],
    ctaTitle: 'Suba el plano de su vivienda',
    ctaText: 'Desde Riad, Yeda o cualquier ciudad: abra el estudio y vea su vivienda en 3D en segundos.',
  },

  gulf: {
    title: 'Diseño de interiores 3D en EAU y el Golfo | Oxira',
    description: 'Diseño de interiores 3D desde planos AutoCAD para pisos y villas en EAU, Catar, Kuwait, Baréin y Omán: metros o pies, majlis, anexos y sótanos.',
    nav: 'EAU y Golfo',
    card: 'De los adosados de Dubái a las casas kuwaitíes con sótano y anexo.',
    kicker: 'EAU, Catar, Kuwait, Baréin y Omán',
    h1: 'Diseño de interiores 3D desde planos en EAU y el Golfo',
    lead: 'El servicio es totalmente online: suba el plano de su piso o villa al estudio desde Dubái, Doha, Ciudad de Kuwait, Manama o Mascate, véalo en 3D con mobiliario y superficies en segundos y después pida a nuestro equipo lo que necesite.',
    facts: [['m² · ft²', 'metros o pies'], ['Majlis', 'mobiliario del Golfo'], ['Online', 'desde cualquier país']],
    sections: [
      {
        h: 'La terminología y las distribuciones cambian según el país',
        ul: [
          'EAU: villas independientes, adosados (townhouses) y pisos en torres; los anuncios inmobiliarios suelen indicar la superficie en pies cuadrados.',
          'Kuwait: la parcela ("qasima") y la casa familiar de varias plantas, a menudo con sótano ("sirdab") y anexo. Cada uno se sube como un plano independiente.',
          'Catar, Baréin y Omán: villas independientes y en urbanizaciones cerradas, a menudo con un majlis exterior separado de la casa.',
          'En todo el Golfo el majlis (sala de recepción de invitados) es central; el estudio reconoce una estancia llamada majlis y la amuebla como zona de asientos, con asientos bajos en el estilo najdí contemporáneo.',
        ],
      },
      {
        h: '¿Metros cuadrados o pies cuadrados?',
        p: [
          'El estudio muestra las superficies en metros cuadrados. Para convertir: 1 m² ≈ 10,764 ft², así que un piso de 1.200 ft² tiene unos 111 m².',
          'Si el dibujo está en pies, asegúrese de que las unidades de inserción de AutoCAD estén en Pies (comando UNIDADES, Escala de inserción) antes de guardar el DXF, porque el estudio lee la unidad del archivo. Si está en pulgadas, elija "Pulgadas" en el menú de unidades del dibujo.',
        ],
      },
      {
        h: 'Planos en inglés o en árabe',
        p: [
          'Muchos planos del Golfo usan nombres de capas y estancias en inglés, sobre todo los de grandes consultoras. El estudio entiende ambos: Walls, Doors y Windows o sus equivalentes en árabe, e incluso nombres normalizados como A-WALL, A-DOOR y A-GLAZ.',
          'En cuanto a las estancias, reconoce Bedroom, Kitchen, Living, Majlis, Maid’s room (cuarto del servicio doméstico), Driver’s room (cuarto del chófer) y Laundry junto a los nombres en árabe, de modo que cada estancia se amuebla y se mide adecuadamente.',
        ],
      },
      {
        h: 'Sótanos, anexos y majlis exterior',
        p: [
          'Una vivienda del Golfo suele ser más de un plano: sótano, planta baja, primera planta, anexo y un majlis exterior. Suba cada uno como un DXF independiente y ajuste la altura de techo de cada uno, ya que sótanos y anexos suelen diferir de las plantas principales.',
          'En los paquetes del equipo unimos las plantas en un único modelo, y el paquete Completo añade fachadas y paisajismo.',
        ],
      },
      {
        h: 'Cómo trabajar con nosotros desde fuera de Arabia Saudí',
        steps: [
          { t: 'Pruebe el estudio', d: 'Suba un DXF y vea el modelo, las superficies y el mobiliario. Sin registro, y el archivo se procesa en su navegador.' },
          { t: 'Envíe su pedido', d: 'Elija un paquete e indique su ciudad y país. Puede adjuntar archivos DWG o PDF de hasta 15 MB.' },
          { t: 'Pago', d: 'Los precios están en riales saudíes. El paquete Rápido se paga online con tarjeta o Apple Pay a través de Moyasar; para los demás paquetes recibirá un presupuesto en un día laborable.' },
          { t: 'Entrega', d: 'Los renders y archivos se entregan de forma electrónica, y nos comunicamos en árabe o en inglés por WhatsApp o correo electrónico.' },
        ],
      },
    ],
    faq: [
      { q: '¿El servicio está disponible en EAU, Catar, Kuwait, Baréin y Omán?', a: 'Sí. El servicio es totalmente online, aceptamos planos de cualquier país y la web está disponible en árabe y en inglés.' },
      { q: 'Mi plano está dibujado en pies. ¿Puede leerlo el estudio?', a: 'Sí, si las unidades de inserción del archivo están en Pies. Las superficies se muestran en m²; multiplique por 10,764 para obtener pies cuadrados.' },
      { q: '¿En qué moneda pago?', a: 'Los precios están en riales saudíes. Los clientes del Golfo pagan el paquete Rápido con tarjeta o Apple Pay, y los demás paquetes mediante presupuesto y factura.' },
      { q: '¿Trabajan con promotoras inmobiliarias del Golfo?', a: 'Sí. La suscripción para promotoras cubre renders y tours virtuales de hasta 10 tipologías al mes, y aceptamos proyectos de fuera del Reino.' },
    ],
    ctaTitle: 'Pruébelo con su plano, desde cualquier país',
    ctaText: 'Abra el estudio, suba un DXF y vea su piso o villa en 3D en segundos.',
  },

  egypt: {
    title: 'Diseño 3D de pisos en Egipto antes de la reforma | Oxira',
    description: 'Diseñe su piso, dúplex o villa en Egipto en 3D antes de los acabados, desde un plano de AutoCAD, y obtenga gratis mediciones de alicatado, pintura y pladur.',
    nav: 'Egipto',
    card: '¿Piso a medio terminar? Véalo en 3D y calcule antes las mediciones de acabados.',
    kicker: 'Egipto',
    h1: 'Diseño 3D de pisos en Egipto, antes de empezar los acabados',
    lead: '¿Le han entregado una vivienda a medio terminar en una urbanización o un edificio? Suba el plano de AutoCAD y véala en 3D con mobiliario y superficies en segundos; después calcule las mediciones de alicatado, pintura y techos antes de cerrar el acuerdo con un contratista de acabados.',
    facts: [['A medio terminar', 'el momento ideal'], ['Gratis', 'modelo y mediciones'], ['Online', 'de El Cairo a cualquier ciudad']],
    sections: [
      {
        h: 'Viviendas a medio terminar: el momento adecuado para diseñar',
        p: [
          'Muchas viviendas en Egipto se entregan a medio terminar ("nos tashteeb") o en fase de enlucido, y el propietario decide el nivel de acabado: lux, super lux o ultra super lux. Antes de que empiecen el fontanero y el electricista, necesita saber dónde irá todo: camas, televisión, cocina y aparatos de aire acondicionado, porque determinan dónde van los enchufes, los puntos de luz y las tuberías.',
          'Un modelo 3D muestra todo esto antes de que las decisiones se conviertan en demoliciones y trabajos repetidos.',
        ],
      },
      {
        h: 'Nombres de estancias tal como aparecen en los planos egipcios',
        p: ['El estudio reconoce el tipo de estancia por el nombre escrito en su interior y la amuebla en consecuencia. La mayoría de los nombres egipcios se entienden directamente:'],
        ul: [
          '"نوم", "أوضة نوم" o "Master": dormitorio.',
          '"سفرة": comedor; "مطبخ" (cocina) y "حمام" (baño) tal cual.',
          '"تراس" y "بلكونة": espacios exteriores que solo reciben pavimento.',
          '"استقبال", "صالة" o Reception: zona de estar.',
        ],
        tip: 'La palabra "ريسبشن" escrita con letras árabes no se reconoce automáticamente; escriba "استقبال" o Reception, o cambie el tipo de estancia después de subir el plano.',
      },
      {
        h: 'Dúplex, azotea, ático y villa',
        ul: [
          'Dúplex: suba cada planta como un DXF independiente y compruebe la posición de la escalera interior en ambos niveles.',
          'Azotea y ático: indique la parte descubierta de la cubierta como "terraza" (تراس) para que su pavimento se mida por separado, sin pintura ni techo.',
          'Adosados, pareados y villas independientes en urbanizaciones: cada planta es un plano propio, y las fachadas y jardines forman parte de nuestro paquete Completo.',
        ],
      },
      {
        h: 'Mediciones de acabados en el lenguaje del contratista',
        p: [
          'La tabla de mediciones del estudio ofrece la superficie de suelo de cada estancia con un 10 % de merma (cerámica o porcelánico), la superficie de pintura descontando puertas y ventanas, el alicatado de baños y cocina, la superficie de techo para placa de yeso (pladur) y el rodapié en metros lineales.',
          'Descargue la tabla en CSV y pida a cada contratista un precio por metro cuadrado para cada partida; después compare las ofertas sobre las mismas mediciones. Recuerde que son estimaciones; las medidas definitivas se toman en obra.',
        ],
      },
      {
        h: 'Precios y pago desde Egipto',
        p: [
          `El estudio, el modelo 3D y las mediciones son gratuitos. Los paquetes del equipo tienen precios en riales saudíes sin IVA: Rápido ${quick}, diseño de interiores ${perM2} con un mínimo de ${designMin}. El pago online se hace con tarjeta bancaria y, si tiene cualquier duda sobre el pago, escríbanos por WhatsApp.`,
        ],
      },
    ],
    faq: [
      { q: '¿El servicio está disponible en Egipto?', a: 'Sí, es totalmente online. Suba el plano al estudio desde cualquier ciudad de Egipto, haga su pedido al equipo y reciba los archivos de forma electrónica.' },
      { q: 'Mi arquitecto me envió el plano en PDF. ¿Qué hago?', a: 'Pida el DWG de AutoCAD y guárdelo como DXF, o envíe el PDF con un pedido del paquete Rápido y el equipo lo convierte en un modelo.' },
      { q: '¿El estudio calcula electricidad y fontanería?', a: 'No, cubre partidas de acabados arquitectónicos: pavimento, pintura, alicatado, techos y rodapié. Colocar el mobiliario en el modelo sí le ayuda a decidir la posición de enchufes y puntos de luz.' },
      { q: '¿Los precios están en libras egipcias?', a: 'Los precios publicados están en riales saudíes y el estudio en sí es gratuito. En los paquetes de pago, su banco convierte el importe al pagar con tarjeta.' },
      { q: '¿Qué estilo le va a un piso pequeño?', a: 'Pruebe el moderno y el escandinavo y compárelos desde el mismo ángulo; los colores claros y los muebles sencillos amplían visualmente los espacios.' },
    ],
    ctaTitle: 'Vea su piso antes de los acabados',
    ctaText: 'Suba el plano de su piso al estudio gratuito y calcule las mediciones de acabados en el mismo paso.',
  },
};

export const ui: GuideUi = {
  home: 'Inicio',
  hub: 'Servicios y guías',
  hubTitle: 'Servicios y guías de diseño 3D | Oxira Design',
  hubDescription: 'Todos los servicios de Oxira Design: plano AutoCAD a 3D, diseño 3D de pisos y villas, renders fotorrealistas, diseño con IA y mediciones de acabados.',
  hubKicker: 'Servicios y guías',
  hubH1: 'Servicios de diseño 3D, del plano al render fotorrealista',
  hubLead: 'Elija lo que encaja con su situación: tiene un plano de AutoCAD y quiere verlo en 3D, está preparando un piso o una villa para los acabados, o tiene una foto de una estancia y quiere una idea de diseño rápida. Cada página explica los pasos, los archivos que necesitamos y lo que obtiene.',
  services: 'Servicios',
  servicesLead: 'Guías prácticas de cada servicio: cómo funciona, archivos aceptados, qué es automático y qué hace nuestro equipo.',
  regions: 'Por país',
  regionsLead: 'El mismo servicio online, más lo que cambia en cada país: terminología, pisos y villas típicos, unidades y formas de pago.',
  which: {
    h: '¿Por dónde empiezo?',
    items: [
      'Tiene un archivo de AutoCAD (DWG o DXF) de un piso o una villa: empiece por el estudio gratuito, que le da el modelo, las superficies y las mediciones en segundos.',
      'Solo tiene una foto de una estancia: pruebe el rediseño con IA. Su primer diseño de cada día es gratuito.',
      'Necesita imágenes realistas para marketing o un archivo de 3ds Max para su interiorista o contratista: encargue uno de los paquetes del equipo después de probar el estudio.',
      'Está a punto de empezar los acabados y quiere comparar presupuestos de contratistas: descargue la tabla de mediciones del estudio o solicite presupuestos de acabados.',
    ],
  },
  open: 'Leer la guía',
  steps: 'Pasos',
  faq: 'Preguntas frecuentes',
  related: 'Páginas relacionadas',
  allServices: 'Todos los servicios y guías',
  onThisPage: 'En esta página',
  note: 'Sin registro. Su archivo se procesa en su navegador.',
  breadcrumb: 'Ruta de navegación',
  homeSection: { label: 'Servicios y guías', title: 'Guías prácticas para lo que necesita', more: 'Todos los servicios y guías' },
};
