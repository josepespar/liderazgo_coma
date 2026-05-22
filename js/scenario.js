/* scenario.js — Engine narrativo IIFE. Sin dependencias externas. */
(function () {
  'use strict';

  /* ════════════════════════════════════════════════
     CONSTANTES
  ════════════════════════════════════════════════ */
  var CANONICAL_SCENE_COUNT = 10;
  var BRANCH_SCENES = ['E03b', 'E06b', 'E09b', 'E09c'];

  var BADGE_DEFS = {
    B_RESIST:   { id: 'B_RESIST',   label: 'Autenticidad bajo presión',   icon: '🛡' },
    B_LISTEN:   { id: 'B_LISTEN',   label: 'Escucha activa',              icon: '👂' },
    B_EMPATH:   { id: 'B_EMPATH',   label: 'Inteligencia emocional',      icon: '💙' },
    B_EVIDENCE: { id: 'B_EVIDENCE', label: 'Liderazgo basado en evidencia',icon: '📊' },
    B_COURAGE:  { id: 'B_COURAGE',  label: 'Decisión valiente',           icon: '⚡' }
  };

  var TEMP_LABELS = ['Roto', 'Fracturado', 'Tenso', 'Activo', 'Conectado'];
  var TEMP_COLORS = ['#C0392B', '#E67E22', '#F1C40F', '#27AE60', '#1A6EFF'];
  var TEMP_ICONS  = ['🔴', '🟠', '🟡', '🟢', '🔵'];

  /* ════════════════════════════════════════════════
     ESTADO GLOBAL
  ════════════════════════════════════════════════ */
  var STATE = {
    currentScene: 'E01',
    score: 0,
    decisions: [],
    leadershipProfile: 'none',
    badgesUnlocked: [],
    groupTemperature: 3,
    alternativePathViewed: false,
    routeTaken: 'A',
    canonicalProgress: 0,
    completed: false
  };

  /* ════════════════════════════════════════════════
     CONTENIDO NARRATIVO — ESCENAS
  ════════════════════════════════════════════════ */
  var SCENES = {

    /* ── E01 ── */
    E01: {
      id: 'E01', canonical: true, canonicalIndex: 1,
      title: 'El Primer Silencio',
      act: 'Mundo Ordinario · Acto I',
      emotionIcon: 'tension',
      imatge: null,
      narrative: [
        'Son las 9:03 de la mañana.',
        'Jordi Coma entra a la sala con su portátil bajo el brazo y una taza de café que ya se ha enfriado. Recorre el espacio con la mirada: cinco entrenadores. Cinco biografías de resistencia. Cinco razones para no estar aquí.',
        'Nadie aplaude. Nadie sonríe. Marc tamborilea sobre la mesa con el bolígrafo. Jack examina sus propias notas como si ya supiera lo que viene. Elena recoloca sus papeles por tercera vez.',
        'Jordi deja el café sobre la mesa. No abre el portátil.',
        '"Antes de empezar —dice—, necesito que alguien me diga por qué está aquí. Y no me vale 'porque me lo mandaron'."',
        'El silencio dura cuatro segundos. Cuatro segundos que pesan como cuatro años.',
        'Nadie levanta la mano.'
      ],
      quote: '"El liderazgo no comienza cuando hablas. Comienza cuando decides escuchar lo que nadie está diciendo."',
      activity: {
        type: 'thermometer',
        prompt: '¿Cómo describes la temperatura emocional del grupo en este primer momento?',
        scale: 5,
        labels: ['Completamente desconectado', 'Muy frío', 'Tenso pero presente', 'Con algo de apertura', 'Sorprendentemente receptivo'],
        onSelect: function (val) {
          STATE.groupTemperature = val;
          STATE.decisions.push({ scene: 'E01', type: 'thermometer', value: val });
          saveAndAdvance('E02');
        }
      },
      pedagogical: 'Conducta observable inicial del grupo vs. conducta requerida (Chelladurai, 1984).',
      hookLine: 'El silencio no es ausencia de respuesta. Es la respuesta.',
      next: 'E02'
    },

    /* ── E02 ── */
    E02: {
      id: 'E02', canonical: true, canonicalIndex: 2,
      title: 'El Modelo',
      act: 'El Llamado · Acto I — Bloque Pedagógico',
      emotionIcon: 'apertura',
      imatge: null,
      narrative: [
        'Jordi abre el portátil. En la pantalla: una diapositiva limpia. Fondo blanco. Texto azul.',
        '"Este fin de semana vamos a trabajar con un modelo. No os pido que lo creáis. Os pido que lo probéis."',
        'Pausa. Mira a Marc directamente.',
        '"Si después de tres escenas no os ha dicho nada nuevo, me voy yo."',
        'Marc levanta una ceja. Es la primera vez que alguien en este tipo de seminario pone algo encima de la mesa.'
      ],
      quote: null,
      pedagogicalBlock: {
        title: 'Modelo Multidimensional de Liderazgo — Chelladurai (1984)',
        items: [
          '<strong>Conducta requerida:</strong> lo que la situación y la organización exigen del líder.',
          '<strong>Conducta preferida:</strong> lo que los miembros del grupo quieren y necesitan del líder.',
          '<strong>Conducta real:</strong> lo que el líder efectivamente hace.',
          '<strong>Congruencia:</strong> cuando las tres conductas se alinean, emerge el rendimiento y la satisfacción.',
          '<strong>Madurez del grupo:</strong> condiciona qué tipo de conducta preferida es genuinamente necesaria.',
          '<strong>Liderazgo transformacional:</strong> modifica las necesidades percibidas del grupo elevando la madurez colectiva.'
        ]
      },
      activity: {
        type: 'info',
        prompt: 'Lee el modelo. Cuando estés listo para ver cómo se rompe en la práctica, continúa.',
        buttonLabel: 'Continuar',
        onSelect: function () { saveAndAdvance('E03'); }
      },
      pedagogical: 'Presentación del marco teórico antes del conflicto. Único momento donde la teoría precede a la emoción.',
      hookLine: 'Un modelo no sirve para explicar el pasado. Sirve para sobrevivir el presente.',
      next: 'E03'
    },

    /* ── E03 ── */
    E03: {
      id: 'E03', canonical: true, canonicalIndex: 3,
      title: 'No. Gracias, pero no.',
      act: 'Rechazo del Llamado · Acto I · ⚡ CIMA EMOCIONAL · D1',
      emotionIcon: 'resistencia',
      imatge: null,
      specialFX: true,
      narrative: [
        'Jack levanta la mano. No para pedir la palabra: para tomarla.',
        '<span class="jack-voice">"Jordi. Con todo el respeto —y lo digo en serio—, este modelo lleva cuarenta años en los libros. Lo conozco. Lo he aplicado. Y te digo una cosa: en el este de Europa, con presupuesto cero y cuarenta chavales que no hablaban tu idioma, lo que funcionó no fue la congruencia. Fue la autoridad. La disciplina. El miedo, si hace falta. Y ganamos."</span>',
        'El grupo no respira.',
        '<span class="jordi-thought">Jordi siente el golpe en el pecho antes de procesarlo en la cabeza. Conoce este momento. Lo ha vivido veinte veces. Pero esta vez hay cinco pares de ojos mirándole. Y todos están tomando nota.</span>',
        'Elena deja de recolocar sus papeles. Gery cierra los ojos medio segundo. Nadia mira a Jack como si lo estuviera diseccionando.',
        '<span class="jack-voice">"¿Seguimos con el PowerPoint, o empezamos a hablar de lo que realmente pasa en un vestuario?"</span>',
        'Diez segundos. Jordi tiene diez segundos para decidir quién es.'
      ],
      quote: '"La gestión de la resistencia no mide tu paciencia. Mide tu claridad sobre quién eres cuando alguien te pone a prueba."',
      activity: {
        type: 'decision',
        countdown: 10,
        prompt: '¿Qué hace Jordi?',
        options: [
          {
            id: 'D1_A', label: 'Sostiene la posición con calma',
            text: '"Jack, lo que describes es liderazgo que funciona bajo ciertas condiciones. El modelo no lo niega. Lo explica. La pregunta no es si funcionó. La pregunta es qué precio pagaron los que estaban contigo."',
            score: 25, badge: 'B_RESIST', nextScene: 'E04', routeTag: 'A',
            feedback: 'Jordi no ataca los resultados de Jack. Desplaza el marco: de la eficacia al coste humano. Esto es exactamente lo que el Modelo Multidimensional distingue entre rendimiento y satisfacción del grupo. Alta conducta directiva puede producir resultados a corto plazo; la congruencia entre conducta real y preferida determina la sostenibilidad.',
            feedbackConcept: 'Chelladurai: Congruencia entre conducta real y preferida → satisfacción sostenida.'
          },
          {
            id: 'D1_B', label: 'Cede para no perder al grupo',
            text: '"Tienes razón en que el contexto importa. Veamos juntos cómo adaptar el modelo a situaciones extremas."',
            score: 0, badge: null, nextScene: 'E03b', routeTag: 'B',
            feedback: 'Jordi evita el conflicto pero entrega el control. Jack llenará ese vacío. El grupo aprende que la resistencia funciona.',
            feedbackConcept: 'Chelladurai: La conducta real del líder diverge de la requerida → el grupo pierde referencia.'
          },
          {
            id: 'D1_C', label: 'Devuelve el ataque directamente',
            text: '"Con todo el respeto, Jack, lo que describes es liderazgo del siglo XX. Y los atletas del siglo XXI se llaman a sí mismos personas."',
            score: 0, badge: null, nextScene: 'E03b', routeTag: 'B',
            feedback: 'La réplica directa gana el momento pero cierra la conversación. Jack se atrinchera. El grupo elige bando.',
            feedbackConcept: 'Chelladurai: El conflicto no resuelto eleva la temperatura grupal y reduce la conducta de apoyo.'
          }
        ]
      },
      pedagogical: 'Gestión de la resistencia. Congruencia entre conducta real y requerida.',
      hookLine: 'El líder que no cede cuando debe mantenerse es el líder que sabe quién es.',
      temperatureChange: { D1_A: 0, D1_B: -1, D1_C: -1 }
    },

    /* ── E03b ── */
    E03b: {
      id: 'E03b', canonical: false,
      title: 'El Precio de Ceder',
      act: 'Consecuencia Ruta B',
      emotionIcon: 'quiebre',
      imatge: null,
      narrative: [
        'Jordi ha cedido. O ha atacado. El resultado es idéntico: Jack ha tomado el espacio.',
        '<span class="jack-voice">"Bien. Entonces trabajemos con casos reales. Yo tengo tres."</span>',
        'Durante los siguientes veinte minutos, Jack habla. Tiene datos. Tiene resultados. Tiene la sala.',
        'Jordi sigue el guión. La temperatura del grupo baja un grado.',
        'Elena está mirando por la ventana. Nadie lo nota.',
        'Gery escribe algo en su cuaderno. Lo subraya dos veces. No lo comparte.'
      ],
      quote: null,
      activity: {
        type: 'info',
        prompt: 'El grupo sigue adelante, pero algo se ha roto. Continúa.',
        buttonLabel: 'Continuar — Ruta B',
        onSelect: function () { saveAndAdvance('E04'); }
      },
      pedagogical: 'Consecuencia de la falta de congruencia entre conducta real y requerida.',
      hookLine: 'Ceder una vez no es una decisión. Es un precedente.',
      next: 'E04'
    },

    /* ── E04 ── */
    E04: {
      id: 'E04', canonical: true, canonicalIndex: 4,
      title: 'La Voz que Nadie Esperaba',
      act: 'El Mentor · Acto II',
      emotionIcon: 'apertura',
      imatge: null,
      narrative: [
        'Gery lleva dos horas sin decir una palabra.',
        'Jack está en mitad de una historia sobre el campeonato del 2009 cuando Gery pone la mano sobre la mesa. Despacio. Sin prisa.',
        '"Jack."',
        'Una sola palabra. El nombre. Y todo el mundo en la sala sabe que algo ha cambiado.',
        '"Entrenaste bajo un sistema que funcionaba porque todos lo aceptaban. Eso no es liderazgo. Es consentimiento colectivo bajo presión. Yo entrené sin sistema. Sin recursos. Con dos entrenadores que no sabían leer. Y lo que aprendí es que la gente no sigue a quien tiene razón. Sigue a quien confía en ellos primero."',
        'Silencio.',
        'Jack no responde. Es la primera vez en todo el día que Jack no tiene respuesta.'
      ],
      quote: '"La madurez de un grupo no se mide por lo que saben. Se mide por lo que están dispuestos a arriesgar juntos."',
      activity: {
        type: 'dragdrop',
        prompt: 'Gery acaba de articular una jerarquía de liderazgo diferente a la de Jack. Ordena estas cuatro acciones según la prioridad que Gery daría a cada una:',
        items: [
          { id: 'dd_1', text: 'Establecer autoridad a través de resultados demostrables' },
          { id: 'dd_2', text: 'Crear condiciones de confianza antes de exigir rendimiento' },
          { id: 'dd_3', text: 'Adaptar el estilo al nivel de madurez del grupo' },
          { id: 'dd_4', text: 'Mantener la disciplina como base de la cohesión grupal' }
        ],
        correctOrder: ['dd_2', 'dd_3', 'dd_1', 'dd_4'],
        feedback: 'El orden de Gery refleja el modelo de Chelladurai: la conducta de apoyo precede a la conducta de rendimiento. Exigir antes de confiar genera obediencia, no transformación.',
        onComplete: function (order) {
          STATE.decisions.push({ scene: 'E04', type: 'dragdrop', value: order });
          saveAndAdvance('E05');
        }
      },
      pedagogical: 'Conducta de apoyo vs. conducta de rendimiento. La madurez percibida vs. real (Chelladurai).',
      hookLine: 'La gente no sigue a quien tiene razón. Sigue a quien confía en ellos primero.',
      next: 'E05'
    },

    /* ── E05 ── */
    E05: {
      id: 'E05', canonical: true, canonicalIndex: 5,
      title: 'La Evidencia',
      act: 'La Prueba · Acto II — Hallazgo del Artículo',
      emotionIcon: 'apertura',
      imatge: null,
      narrative: [
        'Jordi se levanta. Va a la pizarra. Escribe un número: <strong>23%</strong>.',
        '"Este es el aumento de rendimiento deportivo objetivado en estudios longitudinales cuando un entrenador practica conducta de apoyo de forma sistemática. No cuando gana. No cuando tiene un equipo estrella. Cuando practica apoyo. De forma consistente. Con cualquier equipo."',
        'Marc deja el bolígrafo.',
        '"Veintitrés por ciento." —repite, como si el número no cuadrara con lo que él ha visto—. "¿En qué deporte?"',
        '"En todos los estudiados. Pero el número que más me interesa no es ese." Jordi señala la pizarra. "El número que más me interesa es el que no está aquí. El coste del liderazgo directivo puro: rotación, lesiones por sobre-entrenamiento, abandono prematuro del deporte. Esos datos no aparecen en las columnas de resultados. Aparecen cinco años después."',
        'Jack escucha. No asiente. Pero escucha.',
        'Es suficiente.'
      ],
      quote: '"El liderazgo no se mide por lo que consigues en la temporada. Se mide por quién sigue contigo en la siguiente."',
      activity: {
        type: 'thermometer',
        prompt: '¿Cómo valoras la temperatura del grupo tras la evidencia presentada por Jordi?',
        scale: 5,
        labels: ['Sin impacto visible', 'Ligera apertura', 'Reflexión real', 'Cambio de posición', 'Transformación en curso'],
        onSelect: function (val) {
          var delta = val - STATE.groupTemperature;
          STATE.groupTemperature = Math.max(1, Math.min(5, STATE.groupTemperature + Math.round(delta / 2)));
          STATE.decisions.push({ scene: 'E05', type: 'thermometer', value: val });
          saveAndAdvance('E06');
        }
      },
      pedagogical: 'Hallazgo contraintuitivo: la conducta de apoyo tiene mayor impacto en el rendimiento a largo plazo que la conducta directiva.',
      hookLine: 'El liderazgo no se mide en la temporada. Se mide en la siguiente.',
      next: 'E06'
    },

    /* ── E06 ── */
    E06: {
      id: 'E06', canonical: true, canonicalIndex: 6,
      title: 'Lo que Elena No Dice',
      act: 'La Crisis · Acto II · D2',
      emotionIcon: 'tension',
      imatge: null,
      narrative: [
        'Son las 11:47. Break de diez minutos.',
        'Elena no se levanta.',
        'Nadia la observa desde la máquina de café. Gery también. Marc no: está revisando su teléfono.',
        'Cuando el grupo vuelve, Elena tiene los ojos secos pero el cuello rígido de alguien que ha estado llorando en silencio.',
        'Jordi lo ve. Tiene tres opciones.',
        'El grupo también lo ve, aunque nadie lo dice.',
        'Lo que Jordi haga ahora no enseñará nada sobre el modelo de Chelladurai.',
        'Lo enseñará todo.'
      ],
      quote: '"La inteligencia emocional de un líder no se activa cuando el grupo está bien. Se activa cuando alguien está roto y nadie más lo ha visto."',
      activity: {
        type: 'subtextIdentify',
        prompt: 'Antes de decidir qué hace Jordi, observa las reacciones del grupo. ¿Quién miente, quién necesita ayuda, quién está a punto de irse?',
        characters: [
          { name: 'Elena', reaction: 'Recoloca los papeles. Sonríe cuando Jordi la mira. Aprieta el bolígrafo.', truth: 'necesita_ayuda' },
          { name: 'Marc', reaction: 'Revisa el móvil. Suspira. Tamborileo de dedos aumenta.', truth: 'a_punto_de_irse' },
          { name: 'Nadia', reaction: 'Mira a Elena. Mira a Jordi. Espera.', truth: 'observa_y_sabe' }
        ],
        correctMap: { Elena: 'necesita_ayuda', Marc: 'a_punto_de_irse', Nadia: 'observa_y_sabe' },
        onComplete: function (result) {
          STATE.decisions.push({ scene: 'E06', type: 'subtext', value: result });
          /* unlock hidden info */
        }
      },
      decisionActivity: {
        type: 'decision',
        prompt: '¿Qué hace Jordi?',
        options: [
          {
            id: 'D2_A', label: 'Nombra lo que ve, con cuidado',
            text: '"Elena, antes de continuar: ¿estás bien?" No en voz alta. En voz baja. Solo para ella. Pausa el grupo un momento.',
            score: 25, badge: 'B_EMPATH', nextScene: 'E07', routeTag: 'A',
            feedback: 'Jordi ejerce conducta de apoyo individualizada. Chelladurai distingue entre conducta orientada al grupo y conducta individualizada. Nombrar la realidad emocional de alguien es el primer acto de liderazgo transformacional real.',
            feedbackConcept: 'Chelladurai: Conducta de apoyo individualizada → satisfacción y madurez creciente del miembro.'
          },
          {
            id: 'D2_B', label: 'Continúa la sesión, lo aborda después',
            text: 'Decide no interrumpir el ritmo del grupo. Hablará con Elena al final.',
            score: 0, badge: null, nextScene: 'E06b', routeTag: 'B',
            feedback: 'El grupo observa que Jordi ha visto y ha elegido no actuar. El mensaje implícito: el ritmo importa más que la persona.',
            feedbackConcept: 'Chelladurai: La brecha entre conducta real y preferida genera insatisfacción silenciosa.'
          },
          {
            id: 'D2_C', label: 'Hace una pausa para el grupo entero',
            text: '"Vamos a parar dos minutos. Respirad. Esto que estamos haciendo hoy es exigente."',
            score: 10, badge: null, nextScene: 'E07', routeTag: 'A',
            feedback: 'Jordi protege a Elena sin singularizarla. No es la opción más valiente, pero es la más inteligente si no confías en que ella quiera ser nombrada.',
            feedbackConcept: 'Chelladurai: Conducta de apoyo grupal → reduce la tensión colectiva, aunque no resuelve la individual.'
          }
        ]
      },
      pedagogical: 'Inteligencia emocional como conducta de apoyo. Clima de grupo como variable del rendimiento.',
      hookLine: 'Ver a alguien no es mirarle. Es decidir que lo que siente importa.',
      temperatureChange: { D2_A: 1, D2_B: -1, D2_C: 0 },
      next: { D2_A: 'E07', D2_B: 'E06b', D2_C: 'E07' }
    },

    /* ── E06b ── */
    E06b: {
      id: 'E06b', canonical: false,
      title: 'Elena no Existe',
      act: 'Consecuencia evasiva en D2',
      emotionIcon: 'quiebre',
      imatge: null,
      narrative: [
        'La sesión continúa.',
        'Elena está presente en cuerpo. En el resto, ya no.',
        'Nadia le pasa una nota: "¿Bien?" Elena asiente con la cabeza.',
        'Es mentira. Nadia lo sabe. Nadia mira a Jordi.',
        'Jordi sigue con el esquema.',
        'Gery escribe en su cuaderno: "Momento perdido". Lo cierra.'
      ],
      quote: null,
      activity: {
        type: 'info',
        prompt: 'El grupo llega a E07 con una grieta invisible. Continúa.',
        buttonLabel: 'Continuar',
        onSelect: function () { saveAndAdvance('E07'); }
      },
      pedagogical: 'Coste de la omisión en conducta de apoyo.',
      hookLine: 'No ver no es neutralidad. Es elección.',
      next: 'E07'
    },

    /* ── E07 ── */
    E07: {
      id: 'E07', canonical: true, canonicalIndex: 7,
      title: 'La Cueva',
      act: 'La Caverna · Acto II · ★ Convergencia',
      emotionIcon: 'quiebre',
      imatge: null,
      isConvergence: true,
      narrative: [
        'Pausa del almuerzo. La sala se vacía.',
        'Jordi se queda solo.',
        'No come. Abre el cuaderno en una página en blanco y escribe tres palabras. Las tacha. Las vuelve a escribir.',
        'En la Ruta A, la pregunta es: <em>"¿Estoy realmente ayudando a este grupo a crecer, o estoy cumpliendo un guión que a mí me hace sentir bien?"</em>',
        'En la Ruta B, la pregunta es: <em>"¿Por qué sigo aquí si ya no soy yo quien conduce esto?"</em>',
        'Son la misma duda con diferente temperatura.',
        'Jordi cierra el cuaderno. Se levanta.',
        'La tarde empieza en cinco minutos.'
      ],
      quote: null,
      alternativePath: {
        forRouteA: {
          title: 'Lo que habría pasado si hubieras cedido',
          text: 'Si Jordi hubiera cedido ante Jack en E03, la tarde habría comenzado con Jack en el centro de la sala. No como facilitador: como evidencia viva de que la resistencia funciona. El grupo habría aprendido que el liderazgo se mide por quién sobrevive al desafío, no por quién lo transforma. Elena habría desaparecido en silencio durante el break. Gery no habría hablado. Marc habría salido convencido de que ya sabía todo lo que necesitaba saber. Jordi habría llegado a esta pausa no con una pregunta sobre su propósito, sino con una acusación hacia sí mismo: "he fallado". Y esa diferencia —entre dudar y acusarse— es la diferencia entre un líder en proceso y un líder que ha parado de crecer. No es una condena. Es un espejo. Y los espejos solo sirven si te atreves a mirarlos.'
        },
        forRouteB: {
          title: 'Lo que habría pasado si hubieras mantenido tu posición',
          text: 'Si Jordi hubiera sostenido su posición ante Jack en E03, esta pausa del almuerzo habría sido diferente. No mejor, necesariamente. Pero diferente. Gery habría hablado en E04 porque habría habido espacio para hablar. Elena habría tenido al menos la posibilidad de ser vista. Marc habría dejado el bolígrafo sobre la mesa. El grupo habría llegado aquí con una tensión diferente: no la tensión del vacío, sino la tensión de algo que todavía puede romperse en luz o en oscuridad. Esa posibilidad todavía existe. La tarde no ha terminado. Las decisiones del pasado se quedan en el pasado. Lo que viene ahora puede ser diferente, si quieres que lo sea.'
        }
      },
      activity: {
        type: 'wordAnchor',
        prompt: 'Jordi está en su cueva. ¿Qué palabra describe mejor lo que siente en este momento?',
        words: ['Duda', 'Claridad', 'Fatiga', 'Propósito', 'Miedo', 'Resistencia'],
        anchors: {
          Duda:       'La duda es el punto de partida del liderazgo reflexivo. Sin duda no hay crecimiento.',
          Claridad:   'La claridad no es ausencia de conflicto. Es saber por qué estás ahí a pesar del conflicto.',
          Fatiga:     'El liderazgo sostenido requiere gestión del propio estado emocional. Reconocer la fatiga es el primer paso.',
          Propósito:  'El propósito es lo que diferencia a un líder que aguanta de uno que transforma.',
          Miedo:      'El miedo a perder el control del grupo es la señal de que sigues poniendo el proceso por encima de las personas.',
          Resistencia:'La resistencia del grupo no es un obstáculo. Es información sobre qué necesitan realmente.'
        },
        onSelect: function (word) {
          STATE.decisions.push({ scene: 'E07', type: 'wordAnchor', value: word });
          saveAndAdvance('E08');
        }
      },
      pedagogical: 'Autoconciencia del líder como prerequisito de la conducta transformacional.',
      hookLine: 'El momento más peligroso para un líder no es cuando el grupo se rebela. Es cuando el líder se pregunta si merece estar ahí.',
      next: 'E08'
    },

    /* ── E08 ── */
    E08: {
      id: 'E08', canonical: true, canonicalIndex: 8,
      title: 'El Momento de Verdad',
      act: 'La Prueba Suprema · Acto III · QUIZ (25 pts)',
      emotionIcon: 'tension',
      imatge: null,
      narrative: [
        'La tarde comienza.',
        'Jordi ha vuelto a la sala. Diferente. No más seguro. Más presente.',
        '"Antes de continuar, una pregunta. Solo una. Y no busco la respuesta del manual."',
        'Mira al grupo. El grupo le devuelve la mirada.',
        '"Los estudios sobre liderazgo en entornos deportivos de alto rendimiento muestran que un factor predice el rendimiento a largo plazo mejor que cualquier estilo de liderazgo concreto. ¿Cuál es?"'
      ],
      quote: '"El dato más contraintuitivo del liderazgo deportivo no está en cómo lideras. Está en si el grupo percibe que alguien les está viendo."',
      activity: {
        type: 'quiz',
        prompt: '¿Qué factor predice mejor el rendimiento deportivo sostenido a largo plazo según la investigación en liderazgo?',
        options: [
          { id: 'Q_A', text: 'El estilo de liderazgo del entrenador (transformacional vs. transaccional)', correct: false },
          { id: 'Q_B', text: 'La percepción del deportista de que su bienestar personal importa al entrenador', correct: true },
          { id: 'Q_C', text: 'El número de horas de entrenamiento técnico semanal', correct: false },
          { id: 'Q_D', text: 'La cohesión del grupo medida en test sociométricos', correct: false }
        ],
        score: 25,
        feedbackCorrect: 'Exacto. La investigación de Chelladurai y estudios posteriores (incluido el meta-análisis de Loughead & Hardy, 2005) muestra que la percepción del deportista de que su bienestar importa al entrenador —independientemente del estilo de liderazgo— es el predictor más robusto del rendimiento sostenido. No la táctica. No la cohesión. La percepción de que alguien te ve como persona.',
        feedbackIncorrect: 'No exactamente. El hallazgo más sorprendente es que no es el estilo de liderazgo lo que mejor predice el rendimiento sostenido, sino la percepción del deportista de que su bienestar personal importa al entrenador. Esto reencuadra toda la discusión sobre estilos: sin ese componente relacional, incluso el liderazgo "correcto" produce rendimiento frágil.',
        badgeOnCorrect: 'B_EVIDENCE',
        onSelect: function (optId, correct) {
          if (correct) STATE.score += 25;
          if (correct) unlockBadge('B_EVIDENCE');
          STATE.decisions.push({ scene: 'E08', type: 'quiz', value: optId, correct: correct });
          saveAndAdvance('E09');
        }
      },
      pedagogical: 'Hallazgo contraintuitivo: la conducta de apoyo percibida supera al estilo de liderazgo como predictor de rendimiento.',
      hookLine: 'No se trata del estilo. Nunca se trató del estilo.',
      next: 'E09'
    },

    /* ── E09 ── */
    E09: {
      id: 'E09', canonical: true, canonicalIndex: 9,
      title: 'La Decisión Final',
      act: 'La Transformación · Acto III · D3',
      emotionIcon: 'transformacion',
      imatge: null,
      narrative: [
        'Son las 17:15.',
        'Queda una hora.',
        'Jack se levanta. Todos lo miran.',
        'Y hace algo que nadie esperaba: se disculpa.',
        '<span class="jack-voice">"Esta mañana he estado defendiendo lo que me funcionó a mí. Y me he dado cuenta —mientras Gery hablaba, y mientras miraba los datos de Jordi— de que lo que yo llamo resultados incluye tres jugadores que abandonaron el deporte con veinte años. Nunca los conté en mis estadísticas."</span>',
        'El grupo no sabe qué hacer con esto.',
        'Jordi tampoco.',
        'Este es el momento. No el de antes. Este.'
      ],
      quote: '"El líder que reconoce el coste de sus decisiones es el líder que puede transformarse. Y un líder que se transforma transforma a los que tiene alrededor."',
      activity: {
        type: 'dialogue',
        prompt: '¿Qué responde Jordi a Jack?',
        options: [
          {
            id: 'D3_A', label: 'Recibe la honestidad y la convierte en aprendizaje colectivo',
            text: '"Jack, lo que acabas de hacer tiene más valor pedagógico que todo lo que yo podría decir esta tarde. Gracias. En serio."',
            score: 25, badge: 'B_COURAGE', nextScene: 'E10', routeTag: 'A',
            feedback: 'Jordi transforma un momento personal en un recurso colectivo. Esto es liderazgo transformacional en su versión más concreta: no el líder que tiene razón, sino el líder que crea condiciones para que otros crezcan.',
            feedbackConcept: 'Chelladurai: Conducta transformacional → eleva la madurez colectiva más allá del individuo.'
          },
          {
            id: 'D3_B', label: 'Lo valida pero deriva a lo teórico',
            text: '"Exactamente. El modelo predice esto: el coste del liderazgo directivo no aparece inmediatamente."',
            score: 0, badge: null, nextScene: 'E09b', routeTag: 'B',
            feedback: 'Jordi utiliza el marco para protegerse de la emoción. El momento de Jack queda anclado en el modelo en lugar de en el grupo. Una oportunidad transformacional convertida en confirmación teórica.',
            feedbackConcept: 'Chelladurai: El líder que intelectualiza las emociones bloquea la madurez colectiva.'
          },
          {
            id: 'D3_C', label: 'Deja que el silencio trabaje',
            text: 'Jordi no dice nada. Asiente. Espera.',
            score: 15, badge: null, nextScene: 'E10', routeTag: 'A',
            feedback: 'El silencio intencionado es una forma de conducta de apoyo. No cierra la emoción. Pero tampoco la convierte en recurso colectivo. Es la opción más segura y la menos transformadora.',
            feedbackConcept: 'Chelladurai: La conducta de apoyo pasiva protege; la activa transforma.'
          }
        ]
      },
      pedagogical: 'Momento de verdad del veterano. Transformación real vs. gestión retórica del cambio.',
      hookLine: 'El veterano que admite su coste no se rinde. Se convierte en el mejor argumento del seminario.',
      temperatureChange: { D3_A: 1, D3_B: 0, D3_C: 0 },
      next: { D3_A: 'E10', D3_B: 'E09b', D3_C: 'E10' }
    },

    /* ── E09b ── */
    E09b: {
      id: 'E09b', canonical: false,
      title: 'La Salida Fácil',
      act: 'Consecuencia evasiva en D3',
      emotionIcon: 'resistencia',
      imatge: null,
      narrative: [
        'Jack asiente. El marco ha absorbido su momento.',
        'Nadia mira al techo. Gery cierra el cuaderno.',
        'Elena ha vuelto a estar presente, pero la puerta que Jack abrió se ha cerrado antes de que alguien pudiera pasar.',
        'El seminario termina con orden. Con conclusiones. Con evaluaciones positivas.',
        'Y con la sensación incómoda de que algo importante no llegó a ocurrir.'
      ],
      quote: null,
      activity: {
        type: 'info',
        prompt: 'El orden puede ser la forma más elegante de evitar la transformación. Continúa al epílogo.',
        buttonLabel: 'Ver el epílogo',
        onSelect: function () { saveAndAdvance('E10'); }
      },
      pedagogical: 'La intelectualización como defensa contra la transformación.',
      hookLine: 'Las mejores conclusiones a veces son el mejor escondite.',
      next: 'E10'
    },

    /* ── E09c ── */
    E09c: {
      id: 'E09c', canonical: false,
      title: 'El Espejo que Duele',
      act: 'Variante extrema en D3',
      emotionIcon: 'quiebre',
      imatge: null,
      narrative: [
        'Jordi responde a Jack de la única forma que no debería: con superioridad velada.',
        '"Bueno, Jack. Esto es exactamente lo que el modelo predecía. Me alegra que puedas verlo ahora."',
        'La sala se congela.',
        'Jack se sienta.',
        'No dice nada más en el resto del día.',
        'Gery mira a Jordi con algo que no es enfado. Es decepción.',
        'Y eso es mucho peor.'
      ],
      quote: null,
      activity: {
        type: 'info',
        prompt: 'Jordi acaba de repetir el error que lleva todo el día enseñando a evitar. Continúa.',
        buttonLabel: 'Ver el epílogo',
        onSelect: function () { saveAndAdvance('E10'); }
      },
      pedagogical: 'El líder que enseña y no practica. Incoherencia entre conducta real y requerida.',
      hookLine: 'La coherencia no se declama. Se practica en el momento que menos la esperas.',
      next: 'E10'
    },

    /* ── E10 ── */
    E10: {
      id: 'E10', canonical: true, canonicalIndex: 10,
      title: 'El Regreso',
      act: 'El Elixir · Acto III · ★ Convergencia Final · Epílogo',
      emotionIcon: 'reconexion',
      imatge: null,
      isConvergence: true,
      isFinal: true,
      narrative: [
        'Son las 18:30.',
        'Los entrenadores recogen sus cosas.',
        'Hay algo diferente en cómo lo hacen. No en todos. Pero en algunos.',
        'Jack habla con Elena junto a la puerta. Gery espera a que el resto salga para acercarse a Jordi.',
        '"No sé si este modelo es el correcto —dice Gery—. Pero sé que esta tarde alguien me ha escuchado. Y eso no me pasaba desde hace mucho tiempo."',
        'Jordi cierra el portátil.',
        'El cuaderno sigue en blanco. Pero ya no parece vacío.'
      ],
      quote: '"El legado de un líder no se mide en lo que construye. Se mide en la capacidad de construir que deja en los demás."',
      alternativePath: {
        summary: 'Tres caminos posibles en este mismo momento. Tres versiones de Jordi Coma.'
      },
      activity: {
        type: 'wordAnchor',
        prompt: 'Al final del día, ¿qué palabra describes como el aprendizaje más importante que te llevas?',
        words: ['Congruencia', 'Escucha', 'Valentía', 'Presencia', 'Coste', 'Transformación'],
        anchors: {
          Congruencia:    'Chelladurai: La congruencia entre conducta real, requerida y preferida es la condición del liderazgo eficaz y satisfactorio.',
          Escucha:        'La escucha activa no es una técnica. Es la decisión de que lo que el otro siente tiene peso en tu mundo.',
          Valentía:       'La valentía en liderazgo no es no tener miedo. Es actuar con claridad cuando el miedo está presente.',
          Presencia:      'La presencia plena del líder es la primera condición de la conducta de apoyo real.',
          Coste:          'Todo estilo de liderazgo tiene un coste. El liderazgo transformacional no elimina el coste; elige a quién se lo cobra.',
          Transformación: 'La transformación no es un estado que se alcanza. Es un proceso que se elige repetidamente.'
        },
        onSelect: function (word) {
          STATE.decisions.push({ scene: 'E10', type: 'wordAnchor', value: word });
          STATE.completed = true;
          updateLeadershipProfile();
          showFinalEpilogue();
        }
      },
      pedagogical: 'Consolidación del aprendizaje. Legado como medida del liderazgo transformacional.',
      hookLine: 'No viniste a enseñar. Viniste a que algo cambiara. Y algo ha cambiado.',
      next: null
    }
  };

  /* ════════════════════════════════════════════════
     EPÍLOGOS ADAPTATIVOS
  ════════════════════════════════════════════════ */
  var EPILOGUES = {
    A: {
      title: 'El Líder que Conecta',
      scoreRange: '90-100 pts',
      concept: 'Liderazgo Transformacional Sostenible',
      text: 'Jordi sale de la sala con la certeza tranquila de quien no ha ganado un debate sino facilitado un proceso. El grupo no se ha transformado en un día. Pero algo se ha movido. Jack ha contado sus tres jugadores perdidos. Elena ha sido vista. Gery ha hablado. Estos no son resultados de un modelo: son consecuencias de un líder que eligió ser coherente bajo presión. El liderazgo transformacional no es un estilo que se adopta. Es una práctica que se sostiene, especialmente cuando el grupo resiste. Lo que Jordi ha hecho hoy no es enseñar el Modelo Multidimensional de Chelladurai. Ha demostrado que la congruencia entre lo que exige el contexto, lo que necesita el grupo y lo que uno realmente hace es posible. Incluso cuando duele. Especialmente cuando duele.',
      action: 'Revisa tu última intervención como líder. ¿Hubo un momento en que cediste para no perder el control? ¿Qué habrías dicho si hubieras tenido diez segundos más?',
      endQuestion: '¿Cuándo fue la última vez que elegiste la incomodidad porque era lo correcto?'
    },
    B: {
      title: 'La Semilla Plantada',
      scoreRange: '70-89 pts',
      concept: 'Liderazgo en Proceso de Maduración',
      text: 'No todo ha salido como esperabas. Hay decisiones que habrías tomado diferente. Y eso no es un fracaso: es información. Jordi sale de la sala con algo agridulce en el pecho: la sensación de que estuvo cerca de algo más grande y no del todo llegó. Pero cerca cuenta. La semilla que Gery plantó cuando habló, la grieta que se abrió en el silencio de Jack, el momento en que Elena fue —aunque fuera por un instante— visible: todo eso ocurrió. No fue el seminario que Jordi había planeado. Fue mejor que algunos y peor que otros. El liderazgo no siempre tiene aplausos. A veces tiene el ruido sordo de algo que acaba de empezar a crecer.',
      action: 'Identifica la decisión de hoy que más incertidumbre te generó. ¿Qué habrías necesitado saber para tomarla con más claridad?',
      endQuestion: '¿Qué semilla plantaste hoy que no sabrás si germinó hasta dentro de un año?'
    },
    C: {
      title: 'La Lección del Fracaso',
      scoreRange: '50-69 pts',
      concept: 'Aprendizaje a través de la Fricción',
      text: 'El seminario ha sido un desastre controlado. Jordi lo sabe. El grupo también. Pero hay algo inesperado en el aire cuando la sala se vacía: nadie se ha ido indiferente. El conflicto que no se resolvió, la tensión que no se transformó, la evidencia que no convenció a quien tenía que convencer: todo eso ha dejado rastro. A veces el mayor servicio que puede hacer un líder es ser el espejo que le muestra al grupo lo que aún no quiere verse. Jordi ha fallado en ser el líder que quería ser hoy. Pero al fallar con integridad —sin trampa, sin atajos fáciles— ha enseñado algo que ningún PowerPoint podría: que el liderazgo real incluye el fracaso, y que el fracaso real incluye la posibilidad de empezar de nuevo.',
      action: 'Lee de nuevo el Modelo Multidimensional de Chelladurai. Esta vez, aplícalo a tu propio equipo real. ¿Dónde está la mayor brecha entre conducta real y preferida?',
      endQuestion: '¿Cuándo fue la última vez que un fracaso tuyo le enseñó algo útil a alguien?'
    },
    D: {
      title: 'El Espejo Roto',
      scoreRange: '0-49 pts',
      concept: 'Incoherencia entre Teoría y Práctica',
      text: 'Jordi se queda solo en la sala. El portátil cerrado. El cuaderno en blanco.',
      textFull: 'Jordi se queda solo en la sala. El portátil cerrado. El cuaderno en blanco. Hoy ha enseñado todo lo que sabe y no ha practicado nada de lo que enseña. Ha predicado la congruencia y ha sido incongruente. Ha hablado de conducta de apoyo y ha ignorado a Elena. Ha defendido el liderazgo transformacional y ha reaccionado con defensiva cuando le cuestionaron. No hay moraleja fácil aquí. Solo un espejo. Y un cuaderno en blanco que espera. El espejo roto no significa que el liderazgo que describes sea falso. Significa que todavía hay distancia entre quien eres y quien quieres ser. Esa distancia no es una condena. Es el espacio donde ocurre el trabajo real.',
      action: 'Vuelve al inicio. Empieza por E01. Esta vez, nota el momento en que el miedo al conflicto empieza a tomar decisiones por ti.',
      endQuestion: '¿Qué está en blanco en tu cuaderno que llevas tiempo sin atreverte a escribir?'
    }
  };

  /* ════════════════════════════════════════════════
     UTILIDADES DE ESTADO
  ════════════════════════════════════════════════ */

  function unlockBadge(badgeId) {
    if (STATE.badgesUnlocked.indexOf(badgeId) === -1) {
      STATE.badgesUnlocked.push(badgeId);
      showBadgeNotification(badgeId);
    }
  }

  function updateLeadershipProfile() {
    var transformational = 0;
    STATE.decisions.forEach(function (d) {
      if (d.type === 'decision' || d.type === 'dialogue') {
        if (d.value && (d.value.endsWith('_A') || d.value.endsWith('_C'))) transformational++;
      }
    });
    if (STATE.score >= 90) STATE.leadershipProfile = 'transformacional';
    else if (STATE.score >= 70) STATE.leadershipProfile = 'situacional';
    else if (STATE.score >= 50) STATE.leadershipProfile = 'correctivo';
    else STATE.leadershipProfile = 'reactivo';
  }

  function getEpilogueKey() {
    if (STATE.score >= 90) return 'A';
    if (STATE.score >= 70) return 'B';
    if (STATE.score >= 50) return 'C';
    return 'D';
  }

  function saveAndAdvance(nextSceneId) {
    if (nextSceneId) STATE.currentScene = nextSceneId;
    SCORM.saveState(STATE);
    renderScene(nextSceneId);
  }

  /* ════════════════════════════════════════════════
     RENDERIZADO — HUD
  ════════════════════════════════════════════════ */

  function updateHUD() {
    var scene = SCENES[STATE.currentScene];
    var canonIdx = scene && scene.canonical ? scene.canonicalIndex : STATE.canonicalProgress;

    el('hud-progress-text').textContent = canonIdx + ' / ' + CANONICAL_SCENE_COUNT;
    el('hud-score').textContent = STATE.score + ' pts';

    var pct = (canonIdx / CANONICAL_SCENE_COUNT) * 100;
    el('hud-progress-bar').style.width = pct + '%';

    updateTemperatureBar();
    updateMinimap();
    updateDecisionTracker();
  }

  function updateTemperatureBar() {
    var t = Math.max(1, Math.min(5, STATE.groupTemperature)) - 1;
    el('temp-icon').textContent = TEMP_ICONS[t];
    el('temp-label').textContent = TEMP_LABELS[t];
    el('temp-fill').style.height = ((t + 1) * 20) + '%';
    el('temp-fill').style.backgroundColor = TEMP_COLORS[t];
  }

  function updateMinimap() {
    var mm = el('minimap');
    if (!mm) return;
    var nodes = mm.querySelectorAll('[data-scene]');
    nodes.forEach(function (n) {
      var sid = n.getAttribute('data-scene');
      n.className = 'mm-node';
      if (sid === STATE.currentScene) n.classList.add('mm-current');
      else if (STATE.decisions.some(function (d) { return d.scene === sid; })) n.classList.add('mm-visited');
    });
  }

  function updateDecisionTracker() {
    var tracker = el('decision-tracker');
    if (!tracker) return;
    var relevant = STATE.decisions.filter(function (d) {
      return d.type === 'decision' || d.type === 'quiz' || d.type === 'dialogue';
    }).slice(-3);
    tracker.innerHTML = '';
    relevant.forEach(function (d) {
      var span = document.createElement('span');
      span.className = 'dt-icon';
      if (d.type === 'quiz') {
        span.textContent = d.correct ? '✓' : '✗';
        span.title = d.correct ? 'Quiz correcto' : 'Quiz incorrecto';
      } else {
        var val = d.value || '';
        if (val.endsWith('_A')) { span.textContent = 'T'; span.title = 'Transformacional'; }
        else if (val.endsWith('_C')) { span.textContent = 'S'; span.title = 'Situacional'; }
        else { span.textContent = 'R'; span.title = 'Reactivo/Evasivo'; }
      }
      tracker.appendChild(span);
    });
  }

  /* ════════════════════════════════════════════════
     RENDERIZADO — ESCENAS
  ════════════════════════════════════════════════ */

  function renderScene(sceneId) {
    var scene = SCENES[sceneId];
    if (!scene) { console.error('Scene not found:', sceneId); return; }

    if (scene.canonical) {
      STATE.canonicalProgress = scene.canonicalIndex;
    }

    /* Scene transition animation */
    var container = el('scene-container');
    container.classList.add('scene-exit');
    setTimeout(function () {
      container.classList.remove('scene-exit');
      container.classList.add('scene-enter');
      buildSceneDOM(scene, container);
      updateHUD();
      setTimeout(function () {
        container.classList.remove('scene-enter');
      }, 400);
    }, 300);
  }

  function buildSceneDOM(scene, container) {
    container.innerHTML = '';

    /* Special FX for E03 */
    if (scene.specialFX) {
      container.classList.add('scene-cold');
    } else {
      container.classList.remove('scene-cold');
    }

    /* Header */
    var header = make('div', 'scene-header');
    var emotionTag = make('span', 'emotion-tag emotion-' + scene.emotionIcon);
    emotionTag.textContent = emotionIconLabel(scene.emotionIcon);
    header.appendChild(emotionTag);
    var titleEl = make('h1', 'scene-title');
    titleEl.textContent = scene.title;
    header.appendChild(titleEl);
    var actEl = make('p', 'scene-act');
    actEl.textContent = scene.act;
    header.appendChild(actEl);
    container.appendChild(header);

    /* Narrative */
    if (scene.narrative && scene.narrative.length) {
      var narDiv = make('div', 'narrative');
      scene.narrative.forEach(function (line) {
        var p = document.createElement('p');
        p.innerHTML = line;
        narDiv.appendChild(p);
      });
      container.appendChild(narDiv);
    }

    /* Pedagogical block (E02) */
    if (scene.pedagogicalBlock) {
      var pb = make('div', 'pedagogical-block');
      var pbTitle = make('h3', 'pb-title');
      pbTitle.textContent = scene.pedagogicalBlock.title;
      pb.appendChild(pbTitle);
      var ol = document.createElement('ol');
      scene.pedagogicalBlock.items.forEach(function (item) {
        var li = document.createElement('li');
        li.innerHTML = item;
        ol.appendChild(li);
      });
      pb.appendChild(ol);
      container.appendChild(pb);
    }

    /* Quote */
    if (scene.quote) {
      var quoteEl = make('blockquote', 'scene-quote');
      quoteEl.innerHTML = scene.quote;
      container.appendChild(quoteEl);
    }

    /* Convergence / Alternative Path */
    if (scene.isConvergence && scene.alternativePath) {
      container.appendChild(buildAlternativePathCard(scene));
    }

    /* Activity */
    var activityData = scene.activity || scene.decisionActivity;
    if (activityData) {
      if (scene.activity && scene.decisionActivity) {
        /* E06 has two activities */
        container.appendChild(buildActivity(scene.activity, scene));
        container.appendChild(buildActivity(scene.decisionActivity, scene));
      } else {
        container.appendChild(buildActivity(activityData, scene));
      }
    }

    /* Hook line */
    if (scene.hookLine) {
      var hook = make('div', 'hook-line');
      hook.textContent = scene.hookLine;
      container.appendChild(hook);
    }
  }

  function buildAlternativePathCard(scene) {
    var card = make('div', 'alt-path-card');
    var toggleBtn = make('button', 'alt-path-toggle');
    toggleBtn.textContent = '🗺  Ver el otro camino';
    var content = make('div', 'alt-path-content hidden');

    var pathData;
    if (scene.id === 'E07') {
      pathData = STATE.routeTaken === 'A' ? scene.alternativePath.forRouteA : scene.alternativePath.forRouteB;
    } else {
      pathData = scene.alternativePath;
    }

    if (pathData && pathData.text) {
      var ptitle = make('h4', 'alt-path-title');
      ptitle.textContent = pathData.title || 'Otro camino';
      content.appendChild(ptitle);
      var ptext = make('p', '');
      ptext.textContent = pathData.text;
      content.appendChild(ptext);
    }

    toggleBtn.addEventListener('click', function () {
      content.classList.toggle('hidden');
      if (!content.classList.contains('hidden')) {
        STATE.alternativePathViewed = true;
        STATE.score += 3;
        el('hud-score').textContent = STATE.score + ' pts';
        toggleBtn.textContent = '🗺  Cerrar';
        SCORM.saveState(STATE);
      } else {
        toggleBtn.textContent = '🗺  Ver el otro camino';
      }
    });

    card.appendChild(toggleBtn);
    card.appendChild(content);
    return card;
  }

  function buildActivity(act, scene) {
    var wrapper = make('div', 'activity-wrapper');

    var promptEl = make('p', 'activity-prompt');
    promptEl.textContent = act.prompt;
    wrapper.appendChild(promptEl);

    switch (act.type) {
      case 'thermometer': wrapper.appendChild(buildThermometer(act, scene)); break;
      case 'decision': wrapper.appendChild(buildDecision(act, scene)); break;
      case 'quiz': wrapper.appendChild(buildQuiz(act, scene)); break;
      case 'dragdrop': wrapper.appendChild(buildDragDrop(act, scene)); break;
      case 'subtextIdentify': wrapper.appendChild(buildSubtext(act, scene)); break;
      case 'dialogue': wrapper.appendChild(buildDecision(act, scene)); break;
      case 'wordAnchor': wrapper.appendChild(buildWordAnchor(act, scene)); break;
      case 'info': wrapper.appendChild(buildInfo(act, scene)); break;
    }

    return wrapper;
  }

  /* ── Activity builders ── */

  function buildThermometer(act) {
    var div = make('div', 'thermometer-activity');
    for (var i = 1; i <= act.scale; i++) {
      (function (val) {
        var btn = make('button', 'thermo-btn');
        btn.setAttribute('data-val', val);
        btn.innerHTML = '<span class="thermo-num">' + val + '</span><span class="thermo-label">' + act.labels[val - 1] + '</span>';
        btn.addEventListener('click', function () {
          var allBtns = div.querySelectorAll('.thermo-btn');
          allBtns.forEach(function (b) { b.classList.remove('selected'); });
          btn.classList.add('selected');
          setTimeout(function () { act.onSelect(val); }, 400);
        });
        div.appendChild(btn);
      }(i));
    }
    return div;
  }

  function buildDecision(act, scene) {
    var div = make('div', 'decision-activity');

    /* Countdown for E03 */
    var countdown = null;
    var countdownInterval = null;
    if (scene.specialFX && act.countdown) {
      countdown = make('div', 'countdown-bar');
      var fill = make('div', 'countdown-fill');
      countdown.appendChild(fill);
      var cdLabel = make('span', 'countdown-label');
      cdLabel.textContent = 'Jordi tiene ' + act.countdown + ' segundos.';
      countdown.appendChild(cdLabel);
      div.appendChild(countdown);
      var remaining = act.countdown;
      countdownInterval = setInterval(function () {
        remaining--;
        fill.style.width = (remaining / act.countdown * 100) + '%';
        cdLabel.textContent = 'Jordi tiene ' + remaining + ' segundo' + (remaining !== 1 ? 's' : '') + '.';
        if (remaining <= 0) clearInterval(countdownInterval);
      }, 1000);
    }

    act.options.forEach(function (opt) {
      var btn = make('button', 'decision-btn');
      btn.textContent = opt.label;
      btn.addEventListener('click', function () {
        if (countdownInterval) clearInterval(countdownInterval);
        btn.classList.add('selected');
        div.querySelectorAll('.decision-btn').forEach(function (b) { b.disabled = true; });

        /* Record decision */
        STATE.decisions.push({ scene: scene.id, type: act.type, value: opt.id });
        if (opt.score) STATE.score += opt.score;
        if (opt.badge) unlockBadge(opt.badge);
        if (opt.routeTag) STATE.routeTaken = opt.routeTag;

        /* Temperature */
        if (scene.temperatureChange && scene.temperatureChange[opt.id] !== undefined) {
          STATE.groupTemperature = Math.max(1, Math.min(5, STATE.groupTemperature + scene.temperatureChange[opt.id]));
        }

        updateHUD();

        /* Feedback */
        var fb = make('div', 'feedback-block');
        var fbText = make('p', 'feedback-text');
        fbText.textContent = opt.feedback;
        fb.appendChild(fbText);
        if (opt.feedbackConcept) {
          var fc = make('p', 'feedback-concept');
          fc.textContent = opt.feedbackConcept;
          fb.appendChild(fc);
        }
        div.appendChild(fb);

        /* Quote display */
        var quoteText = make('p', 'option-text-display');
        quoteText.innerHTML = '<em>"' + opt.text + '"</em>';
        div.insertBefore(quoteText, fb);

        /* Next btn */
        var nextBtn = make('button', 'btn-next');
        nextBtn.textContent = 'Continuar →';
        nextBtn.addEventListener('click', function () {
          saveAndAdvance(opt.nextScene);
        });
        div.appendChild(nextBtn);
      });
      div.appendChild(btn);
    });
    return div;
  }

  function buildQuiz(act) {
    var div = make('div', 'quiz-activity');
    var answered = false;
    act.options.forEach(function (opt) {
      var btn = make('button', 'quiz-btn');
      btn.textContent = opt.text;
      btn.addEventListener('click', function () {
        if (answered) return;
        answered = true;
        div.querySelectorAll('.quiz-btn').forEach(function (b) { b.disabled = true; });
        btn.classList.add(opt.correct ? 'correct' : 'incorrect');
        if (opt.correct) btn.classList.add('correct'); else btn.classList.add('incorrect');

        /* Mark correct */
        if (!opt.correct) {
          div.querySelectorAll('.quiz-btn').forEach(function (b) {
            var oid = b.getAttribute('data-opt');
            if (act.options.find(function (o) { return o.id === oid && o.correct; })) {
              b.classList.add('correct-reveal');
            }
          });
        }

        var fb = make('div', 'feedback-block');
        fb.innerHTML = '<p>' + (opt.correct ? act.feedbackCorrect : act.feedbackIncorrect) + '</p>';
        div.appendChild(fb);

        act.onSelect(opt.id, opt.correct);

        var nextBtn = make('button', 'btn-next');
        nextBtn.textContent = 'Continuar →';
        nextBtn.addEventListener('click', function () { saveAndAdvance('E09'); });
        div.appendChild(nextBtn);
      });
      btn.setAttribute('data-opt', opt.id);
      div.appendChild(btn);
    });
    return div;
  }

  function buildDragDrop(act) {
    var div = make('div', 'dragdrop-activity');
    var listEl = make('ul', 'dd-list');

    var currentOrder = act.items.slice();
    /* Simple click-to-reorder fallback (mobile-friendly) */
    var selectedIdx = null;

    function renderItems() {
      listEl.innerHTML = '';
      currentOrder.forEach(function (item, idx) {
        var li = make('li', 'dd-item');
        li.setAttribute('data-id', item.id);
        li.textContent = (idx + 1) + '. ' + item.text;
        li.setAttribute('draggable', 'true');

        if (selectedIdx === idx) li.classList.add('dd-selected');

        li.addEventListener('click', function () {
          if (selectedIdx === null) {
            selectedIdx = idx;
            renderItems();
          } else if (selectedIdx === idx) {
            selectedIdx = null;
            renderItems();
          } else {
            var tmp = currentOrder[selectedIdx];
            currentOrder[selectedIdx] = currentOrder[idx];
            currentOrder[idx] = tmp;
            selectedIdx = null;
            renderItems();
          }
        });

        /* Drag events */
        li.addEventListener('dragstart', function () { selectedIdx = idx; li.classList.add('dragging'); });
        li.addEventListener('dragend', function () { li.classList.remove('dragging'); });
        li.addEventListener('dragover', function (e) { e.preventDefault(); });
        li.addEventListener('drop', function (e) {
          e.preventDefault();
          if (selectedIdx !== null && selectedIdx !== idx) {
            var tmp = currentOrder[selectedIdx];
            currentOrder[selectedIdx] = currentOrder[idx];
            currentOrder[idx] = tmp;
            selectedIdx = null;
            renderItems();
          }
        });

        listEl.appendChild(li);
      });
    }
    renderItems();
    div.appendChild(listEl);

    var hint = make('p', 'dd-hint');
    hint.textContent = 'Haz clic en dos elementos para intercambiarlos, o arrástralos.';
    div.appendChild(hint);

    var confirmBtn = make('button', 'btn-confirm');
    confirmBtn.textContent = 'Confirmar orden';
    confirmBtn.addEventListener('click', function () {
      var orderIds = currentOrder.map(function (i) { return i.id; });
      var fb = make('div', 'feedback-block');
      fb.innerHTML = '<p>' + act.feedback + '</p>';
      div.appendChild(fb);
      confirmBtn.disabled = true;
      act.onComplete(orderIds);
      var nextBtn = make('button', 'btn-next');
      nextBtn.textContent = 'Continuar →';
      nextBtn.addEventListener('click', function () { saveAndAdvance('E05'); });
      div.appendChild(nextBtn);
    });
    div.appendChild(confirmBtn);
    return div;
  }

  function buildSubtext(act, scene) {
    var div = make('div', 'subtext-activity');
    var results = {};
    var labels = { necesita_ayuda: 'Necesita ayuda', a_punto_de_irse: 'A punto de irse', observa_y_sabe: 'Observa y sabe' };

    act.characters.forEach(function (char) {
      var charCard = make('div', 'subtext-card');
      var nameEl = make('strong', 'subtext-name');
      nameEl.textContent = char.name;
      charCard.appendChild(nameEl);
      var reactEl = make('p', 'subtext-reaction');
      reactEl.textContent = char.reaction;
      charCard.appendChild(reactEl);

      var btnRow = make('div', 'subtext-btns');
      Object.keys(labels).forEach(function (key) {
        var btn = make('button', 'subtext-btn');
        btn.textContent = labels[key];
        btn.addEventListener('click', function () {
          charCard.querySelectorAll('.subtext-btn').forEach(function (b) { b.classList.remove('selected'); });
          btn.classList.add('selected');
          results[char.name] = key;
          if (key === char.truth) btn.classList.add('correct');
          else btn.classList.add('incorrect');
        });
        btnRow.appendChild(btn);
      });
      charCard.appendChild(btnRow);
      div.appendChild(charCard);
    });

    var confirmBtn = make('button', 'btn-confirm');
    confirmBtn.textContent = 'Confirmar lectura';
    confirmBtn.addEventListener('click', function () {
      act.onComplete(results);
      confirmBtn.disabled = true;
      var fb = make('div', 'feedback-block');
      fb.innerHTML = '<p>Buena lectura del subtexto. Ahora decide qué hace Jordi.</p>';
      div.appendChild(fb);
    });
    div.appendChild(confirmBtn);
    return div;
  }

  function buildWordAnchor(act, scene) {
    var div = make('div', 'word-anchor-activity');
    act.words.forEach(function (word) {
      var btn = make('button', 'word-btn');
      btn.textContent = word;
      btn.addEventListener('click', function () {
        div.querySelectorAll('.word-btn').forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        var anchor = act.anchors[word];
        var existing = div.querySelector('.word-anchor-result');
        if (existing) existing.remove();
        var res = make('div', 'word-anchor-result');
        res.innerHTML = '<p><strong>' + word + ':</strong> ' + anchor + '</p>';
        div.appendChild(res);

        var nextBtn = div.querySelector('.btn-next');
        if (!nextBtn) {
          nextBtn = make('button', 'btn-next');
          nextBtn.textContent = 'Continuar →';
          nextBtn.addEventListener('click', function () { act.onSelect(word); });
          div.appendChild(nextBtn);
        }
      });
      div.appendChild(btn);
    });
    return div;
  }

  function buildInfo(act) {
    var div = make('div', 'info-activity');
    var btn = make('button', 'btn-next btn-large');
    btn.textContent = act.buttonLabel || 'Continuar →';
    btn.addEventListener('click', act.onSelect);
    div.appendChild(btn);
    return div;
  }

  /* ════════════════════════════════════════════════
     EPÍLOGO FINAL
  ════════════════════════════════════════════════ */

  function showFinalEpilogue() {
    var key = getEpilogueKey();
    var epi = EPILOGUES[key];
    var container = el('scene-container');
    container.innerHTML = '';
    container.classList.add('scene-final');

    var results = make('div', 'results-screen');

    var profileTitle = make('h2', 'results-profile-title');
    profileTitle.textContent = 'Perfil de Liderazgo Desbloqueado';
    results.appendChild(profileTitle);

    var profileName = make('div', 'results-profile-name profile-' + STATE.leadershipProfile);
    profileName.textContent = epi.title;
    results.appendChild(profileName);

    var scoreBar = make('div', 'results-score-bar');
    var fill = make('div', 'results-score-fill');
    fill.style.width = STATE.score + '%';
    scoreBar.appendChild(fill);
    var scoreLabel = make('p', 'results-score-label');
    scoreLabel.textContent = 'Puntuación: ' + STATE.score + ' / 100';
    results.appendChild(scoreBar);
    results.appendChild(scoreLabel);

    /* Badges */
    var badgeRow = make('div', 'results-badges');
    STATE.badgesUnlocked.forEach(function (bid) {
      var bdef = BADGE_DEFS[bid];
      if (!bdef) return;
      var bEl = make('div', 'badge-display');
      bEl.innerHTML = bdef.icon + '<span>' + bdef.label + '</span>';
      badgeRow.appendChild(bEl);
    });
    results.appendChild(badgeRow);

    /* Narrative */
    var text = make('div', 'results-text');
    text.textContent = epi.textFull || epi.text;
    results.appendChild(text);

    /* Concept */
    var concept = make('p', 'results-concept');
    concept.innerHTML = '<strong>Concepto de liderazgo:</strong> ' + epi.concept;
    results.appendChild(concept);

    /* Action */
    var action = make('div', 'results-action');
    action.innerHTML = '<strong>Recomendación post-curso:</strong> ' + epi.action;
    results.appendChild(action);

    /* End question */
    var eq = make('blockquote', 'results-endquestion');
    eq.textContent = epi.endQuestion;
    results.appendChild(eq);

    /* Alternative paths summary */
    var altSummary = make('div', 'alt-paths-summary');
    altSummary.innerHTML = '<h4>Los tres caminos posibles</h4>';
    ['A', 'B', 'C'].forEach(function (k) {
      var ep = EPILOGUES[k];
      var card = make('div', 'alt-path-mini' + (k === key ? ' highlight' : ''));
      card.innerHTML = '<strong>' + ep.title + '</strong><br/><small>' + ep.scoreRange + '</small><p>' + ep.text.substring(0, 120) + '…</p>';
      altSummary.appendChild(card);
    });
    results.appendChild(altSummary);

    /* Restart */
    var restartBtn = make('button', 'btn-restart');
    restartBtn.textContent = 'Volver a empezar desde E01';
    restartBtn.addEventListener('click', function () {
      resetState();
      SCORM.saveState(STATE);
      renderScene('E01');
    });
    results.appendChild(restartBtn);

    container.appendChild(results);

    STATE.completed = true;
    SCORM.saveState(STATE);
    SCORM.finish();
  }

  /* ════════════════════════════════════════════════
     BADGE NOTIFICATION
  ════════════════════════════════════════════════ */

  function showBadgeNotification(badgeId) {
    var bdef = BADGE_DEFS[badgeId];
    if (!bdef) return;
    var notif = make('div', 'badge-notification');
    notif.innerHTML = '<span class="badge-icon">' + bdef.icon + '</span><span class="badge-label">+<strong>' + bdef.label + '</strong> desbloqueado</span>';
    document.body.appendChild(notif);
    setTimeout(function () { notif.classList.add('show'); }, 50);
    setTimeout(function () { notif.classList.remove('show'); setTimeout(function () { notif.remove(); }, 400); }, 3000);
  }

  /* ════════════════════════════════════════════════
     RESET
  ════════════════════════════════════════════════ */

  function resetState() {
    STATE.currentScene = 'E01';
    STATE.score = 0;
    STATE.decisions = [];
    STATE.leadershipProfile = 'none';
    STATE.badgesUnlocked = [];
    STATE.groupTemperature = 3;
    STATE.alternativePathViewed = false;
    STATE.routeTaken = 'A';
    STATE.canonicalProgress = 0;
    STATE.completed = false;
  }

  /* ════════════════════════════════════════════════
     DOM HELPERS
  ════════════════════════════════════════════════ */

  function el(id) { return document.getElementById(id); }
  function make(tag, className) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    return e;
  }

  function emotionIconLabel(icon) {
    var map = {
      tension: '⚡ Tensión',
      apertura: '◎ Apertura',
      resistencia: '◈ Resistencia',
      quiebre: '◆ Quiebre',
      reconexion: '◉ Reconexión',
      transformacion: '✦ Transformación'
    };
    return map[icon] || icon;
  }

  /* ════════════════════════════════════════════════
     INIT
  ════════════════════════════════════════════════ */

  function init() {
    SCORM.initialize();
    var saved = SCORM.loadState();
    if (saved) {
      Object.assign(STATE, saved);
    }
    renderScene(STATE.currentScene);
    updateHUD();
  }

  document.addEventListener('DOMContentLoaded', init);

}());
