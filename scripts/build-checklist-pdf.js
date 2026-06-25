// scripts/build-checklist-pdf.js
// Генерирует PDF лид-магнит: «Чек-лист: как не попасть на дешёвый фундамент»
// Запуск: node scripts/build-checklist-pdf.js
// Выход: public/lead-magnets/cheklist-fundament-2026.pdf

const PdfPrinter = require('pdfmake');
const fs = require('fs');
const path = require('path');

// Шрифты: используем встроенные dejavu (без необходимости качать кириллицу)
// Если нет dejavu — fallback на Roboto через node_modules pdfmake
const fonts = {
  Roboto: {
    normal: path.join(__dirname, '..', 'node_modules', 'pdfmake', 'build', 'vfs_fonts.js') // placeholder
      .replace('build/vfs_fonts.js', 'build/vfs_fonts.js'), // не используется, переопределим ниже
  },
};

// Реально pdfmake требует TTF на диске. Используем DejaVu Sans который обычно есть.
const DEJAVU_PATH = '/usr/share/fonts/truetype/dejavu';

const realFonts = {
  DejaVu: {
    normal: `${DEJAVU_PATH}/DejaVuSans.ttf`,
    bold: `${DEJAVU_PATH}/DejaVuSans-Bold.ttf`,
    italics: `${DEJAVU_PATH}/DejaVuSans.ttf`, // нет Oblique у обычного — используем normal
    bolditalics: `${DEJAVU_PATH}/DejaVuSans-Bold.ttf`,
  },
};

const printer = new PdfPrinter(realFonts);

const INK = '#1B3A5C';
const SAND = '#F5F0E6';
const RED = '#C8553D';
const MUTE = '#666';

const docDefinition = {
  pageSize: 'A4',
  pageMargins: [40, 60, 40, 60],
  defaultStyle: { font: 'DejaVu', fontSize: 10, color: '#222', lineHeight: 1.4 },

  background: function (currentPage, pageSize) {
    return [
      {
        canvas: [
          { type: 'rect', x: 0, y: 0, w: pageSize.width, h: 30, color: INK },
          { type: 'rect', x: 0, y: pageSize.height - 30, w: pageSize.width, h: 30, color: INK },
        ],
      },
    ];
  },

  header: {
    columns: [
      { text: 'СК «Юрьевич»', style: 'headerText', alignment: 'left', margin: [40, 9, 0, 0] },
      { text: 'sk-yurievich.ru · +7 911 830-01-10', style: 'headerText', alignment: 'right', margin: [0, 9, 40, 0] },
    ],
  },

  footer: function (currentPage, pageCount) {
    return {
      columns: [
        { text: '239 объектов · 5★ Авито · Гарантия 5 лет', style: 'footerText', alignment: 'left', margin: [40, 9, 0, 0] },
        { text: `Стр. ${currentPage} / ${pageCount}`, style: 'footerText', alignment: 'right', margin: [0, 9, 40, 0] },
      ],
    };
  },

  content: [
    // ============ ОБЛОЖКА ============
    { text: 'ЧЕК-ЛИСТ', style: 'eyebrow', margin: [0, 30, 0, 0] },
    { text: 'Как не попасть\nна дешёвый\nфундамент', style: 'h1', margin: [0, 10, 0, 0] },
    { text: '7 признаков подрядчика-«экономиста», по которым через 2-3 зимы лопается плита.', style: 'subtitle', margin: [0, 20, 0, 0] },

    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2, lineColor: INK }], margin: [0, 30, 0, 0] },

    {
      columns: [
        { width: '*', text: [
          { text: 'От кого: ', style: 'small', color: MUTE },
          { text: 'СК «Юрьевич»\n', style: 'small', bold: true },
          { text: 'Юрий Демченко · 7 лет в нише фундаментов\n', style: 'small' },
          { text: '239 завершённых объектов\n', style: 'small' },
          { text: '5,0★ Авито (35 отзывов)\n', style: 'small' },
        ]},
        { width: 'auto', text: [
          { text: 'Для кого: ', style: 'small', color: MUTE },
          { text: 'Заказчиков ИЖС\n', style: 'small', bold: true },
          { text: 'СПб + Ленинградская область\n', style: 'small' },
          { text: 'Бюджет 250-600 тыс ₽\n', style: 'small' },
          { text: 'Дом из газобетона/каркас\n', style: 'small' },
        ]},
      ],
      margin: [0, 20, 0, 0],
    },

    { text: '', pageBreak: 'after' },

    // ============ СТРАНИЦА 2 — ВВЕДЕНИЕ ============
    { text: 'Почему дешёвый фундамент = снос дома через 5 лет', style: 'h2' },

    { text: 'В СПб и Ленобласти 7 из 10 подрядчиков фундамента «экономят» на ключевых этапах. Заказчик подписывает смету «дёшево», через 2-3 зимы получает трещины, через 5 — снос дома (потому что ремонтировать фундамент под готовой коробкой нельзя).', margin: [0, 10, 0, 0] },

    { text: 'Этот чек-лист — выжимка из 239 наших объектов и 50+ случаев, когда мы переделывали за «дешёвыми». Каждый пункт — реальный случай.', margin: [0, 10, 0, 0] },

    { text: 'Что внутри:', style: 'h3', margin: [0, 20, 0, 5] },
    {
      ul: [
        '7 признаков подрядчика-«экономиста» (с цифрами)',
        'Что должно быть в честной смете (чек-лист 12 пунктов)',
        '4 вопроса, которые ставят дешёвых в тупик',
        'Реальные цены 2026 — бетон, арматура, работа',
        'Список наших объектов по районам ЛО',
      ],
      margin: [0, 5, 0, 0],
    },

    { text: '⚠️ Время чтения: 12 минут.', style: 'cardSand', margin: [0, 25, 0, 0] },
    { text: 'Сэкономит вам 300-800 тыс рублей.', style: 'cardSand', bold: true },

    { text: '', pageBreak: 'after' },

    // ============ 7 ПРИЗНАКОВ ============
    { text: '7 признаков подрядчика-«экономиста»', style: 'h2' },

    ...signItem(
      '1.',
      'В смете нет паспорта бетона',
      'Без паспорта на каждый миксер вы не докажете что бетон М300, а не М200. М200 имеет морозостойкость F100 — на нашей зиме –25°C это приговор за 3 сезона.',
      'Что просить: «Дайте паспорт бетона на каждый замес» — фото с печатью завода.'
    ),

    ...signItem(
      '2.',
      'Арматура «А240» или «А400» вместо А500С',
      'А500С — современный класс по ГОСТ 34028-2016, прочность на изгиб 510 МПа. А240/А400 — старые классы, прочность 240-400 МПа. На плите 10×10 разница в несущей способности — 40%.',
      'Что просить: сертификат соответствия на партию арматуры.'
    ),

    ...signItem(
      '3.',
      'Подушка ПГС 200 мм вместо 400-500',
      'СП 22.13330.2016 требует подушку ≥300 мм для плит. Меньше — грунт продавливается, плита «гуляет». Экономия 25 тыс — потеря фундамента.',
      'Что просить: спецификация подушки с толщиной и фракцией щебня.'
    ),

    ...signItem(
      '4.',
      'Нет геотекстиля под подушкой',
      'Без геотекстиля 200 г/м² подушка ПГС вмешивается в грунт через 3-5 сезонов, толщина уходит на 30%, плита проседает.',
      'Что просить: чек или ТТН на геотекстиль с плотностью.'
    ),

    ...signItem(
      '5.',
      'Шаг арматуры 250-300 мм вместо 200',
      'СП 50-101-2004 требует шаг арматуры 200 мм для плит под газобетон. 250 мм = -25% жёсткости, трещины по плите через 2 зимы.',
      'Что просить: схема армирования с шагом сеток.'
    ),

    { text: '', pageBreak: 'after' },

    ...signItem(
      '6.',
      '«Затрём правилом» вместо реечной стяжки',
      'Без лазерного нивелира поверхность плиты с перепадом 20-30 мм. На газобетоне это приводит к перекосу стен и трещинам. У нас — реечная стяжка с допуском ±5 мм на 10 м.',
      'Что просить: нивелировка с подписанным актом.'
    ),

    ...signItem(
      '7.',
      'Нет «ухода за бетоном» в первые 7 суток',
      'Бетон без укрытия плёнкой и увлажнения теряет до 30% прочности из-за усадочных трещин. Это видно через год — паутина трещин по верхней поверхности.',
      'Что просить: фото объекта в первые 7 дней (укрытая плёнкой плита).'
    ),

    // ============ ЧТО ДОЛЖНО БЫТЬ В СМЕТЕ ============
    { text: 'Что ДОЛЖНО быть в честной смете', style: 'h2', margin: [0, 20, 0, 10] },
    {
      ol: [
        'Выезд инженера на участок',
        'Геодезическая разбивка осей',
        'Разработка котлована с вывозом грунта',
        'Геотекстиль 200 г/м² под подушку',
        'Подушка ПГС 300-500 мм с послойной трамбовкой виброплитой',
        'ЭППС 100-150 мм (для УШП или тёплых полов)',
        'Гидроизоляция — двухслойная наплавляемая',
        'Арматурный каркас А500С Ø12-14, два ряда, шаг 200',
        'Опалубка из ламинированной фанеры',
        'Бетон М300 W6 F150 с паспортом на КАЖДЫЙ миксер',
        'Виброуплотнение глубинными вибраторами',
        'Реечная стяжка по лазерному нивелиру (допуск ±5 мм на 10 м)',
        'Уход за бетоном — укрытие плёнкой, увлажнение 7 суток',
        'Паспорт бетона + исполнительная схема + акт приёмки',
      ],
      margin: [0, 0, 0, 0],
    },
    { text: 'Если в смете нет какого-то пункта — это либо «забыли» включить (доплата +50-150 тыс по факту), либо НЕ сделают вообще.', style: 'cardSand', margin: [0, 15, 0, 0] },

    { text: '', pageBreak: 'after' },

    // ============ 4 ВОПРОСА ============
    { text: '4 вопроса, которые ставят дешёвых в тупик', style: 'h2' },

    {
      text: [
        { text: '1. ', bold: true, color: INK },
        { text: 'По какому СП вы рассчитываете плиту под мой дом?', bold: true },
        { text: '\nЧестный ответ: СП 22.13330.2016 + СП 50-101-2004 + ГОСТ 25192-2012 на бетон.\nДешёвый: «Обычно ставлю 250 мм» — без расчёта.\n', margin: [0, 5, 0, 10] },
      ],
      margin: [0, 15, 0, 0],
    },

    {
      text: [
        { text: '2. ', bold: true, color: INK },
        { text: 'Какая морозостойкость и водонепроницаемость бетона?', bold: true },
        { text: '\nЧестный ответ: F150 (морозостойкость) и W6 (водонепроницаемость) минимум.\nДешёвый: «М300» — без указания F и W, скорее всего F100/W4.\n', margin: [0, 5, 0, 10] },
      ],
      margin: [0, 15, 0, 0],
    },

    {
      text: [
        { text: '3. ', bold: true, color: INK },
        { text: 'Сколько составляет защитный слой бетона снизу плиты?', bold: true },
        { text: '\nЧестный ответ: 40-50 мм по СП 50-101-2004 (важно для плит).\nДешёвый: «Какой защитный слой?» — не знает понятия. ⚠️\n', margin: [0, 5, 0, 10] },
      ],
      margin: [0, 15, 0, 0],
    },

    {
      text: [
        { text: '4. ', bold: true, color: INK },
        { text: 'Что в гарантии 5 лет? Что НЕ покрывается?', bold: true },
        { text: '\nЧестный ответ: гарантирую геометрию плиты, отсутствие усадочных трещин сверх СП 50-101, целостность каркаса, марку бетона по паспорту. НЕ покрывается: ваши нарушения эксплуатации, форс-мажор.\nДешёвый: «Гарантия есть, не переживайте» — без конкретики.\n', margin: [0, 5, 0, 10] },
      ],
      margin: [0, 15, 0, 0],
    },

    { text: '', pageBreak: 'after' },

    // ============ ЦЕНЫ 2026 ============
    { text: 'Реальные цены июнь 2026', style: 'h2' },

    { text: 'Материалы (с поставкой по СПб+ЛО):', style: 'h3', margin: [0, 15, 0, 5] },
    {
      table: {
        widths: ['*', 'auto'],
        body: [
          [{ text: 'Материал', style: 'tableHeader' }, { text: 'Цена', style: 'tableHeader', alignment: 'right' }],
          ['Бетон М300 W6 F150 с миксером', { text: '6 500-7 000 ₽/м³', alignment: 'right' }],
          ['Арматура А500С Ø12 (ГОСТ 34028)', { text: '55 000 ₽/т', alignment: 'right' }],
          ['Арматура А500С Ø14', { text: '58 000 ₽/т', alignment: 'right' }],
          ['ПГС с поставкой', { text: '1 400 ₽/м³', alignment: 'right' }],
          ['Геотекстиль 200 г/м² (рулон 50 м²)', { text: '4 500 ₽/рулон', alignment: 'right' }],
          ['ЭППС 100 мм Пеноплекс 35', { text: '5 500 ₽/м³', alignment: 'right' }],
          ['Гидроизоляция Технониколь 2 слоя', { text: '450 ₽/м²', alignment: 'right' }],
        ],
      },
      layout: 'lightHorizontalLines',
      margin: [0, 5, 0, 0],
    },

    { text: 'Готовая плита под ключ (с материалами):', style: 'h3', margin: [0, 25, 0, 5] },
    {
      table: {
        widths: ['*', 'auto', 'auto'],
        body: [
          [{ text: 'Размер плиты', style: 'tableHeader' }, { text: 'Толщина', style: 'tableHeader', alignment: 'right' }, { text: 'Цена под ключ', style: 'tableHeader', alignment: 'right' }],
          ['8×8 м (64 м²)', '250 мм', { text: '530 000 ₽', alignment: 'right', bold: true }],
          ['10×10 м (100 м²)', '250 мм', { text: '750 000 ₽', alignment: 'right', bold: true }],
          ['10×10 м (100 м²)', '300 мм', { text: '950 000 ₽', alignment: 'right', bold: true }],
          ['10×12 м (120 м²)', '300 мм', { text: '1 080 000 ₽', alignment: 'right', bold: true }],
          ['12×12 м (144 м²)', '300 мм', { text: '1 300 000 ₽', alignment: 'right', bold: true }],
          ['12×12 м (144 м²) — УШП', '300 мм', { text: '1 500 000 ₽', alignment: 'right', bold: true }],
        ],
      },
      layout: 'lightHorizontalLines',
      margin: [0, 5, 0, 0],
    },

    { text: '⚠️ Если вам предлагают цены НИЖЕ на 20-30% — спросите что именно вырезано из 14 пунктов сметы (стр. 4). Обычно это бетон М200 + А240 + подушка 200 мм + без паспорта.', style: 'cardSand', margin: [0, 20, 0, 0] },

    { text: '', pageBreak: 'after' },

    // ============ КОНТАКТЫ ============
    { text: 'Получить расчёт под ваш участок', style: 'h2' },

    { text: 'Бесплатный выезд инженера по СПб и Ленобласти:', margin: [0, 15, 0, 5] },
    {
      ul: [
        'Всеволожский, Гатчинский, Выборгский, Тосненский районы',
        'Кировский, Приозерский, Ломоносовский, Курортный районы',
        'Лесколово, Васкелово, Сосново, Сиверский, Кобрино, Сестрорецк, Шлиссельбург',
      ],
      margin: [0, 0, 0, 10],
    },

    { text: 'Свяжитесь с Юрием напрямую:', style: 'h3', margin: [0, 20, 0, 10] },

    {
      table: {
        widths: ['*'],
        body: [
          [{ text: '📞 +7 911 830-01-10\n(звонок, WhatsApp)', style: 'contactCard' }],
          [{ text: '💬 @YuraDem01\n(Telegram личный)', style: 'contactCard' }],
          [{ text: '🌐 sk-yurievich.ru\n(онлайн-калькулятор по районам)', style: 'contactCard' }],
        ],
      },
      layout: 'noBorders',
    },

    { text: 'Что получите в течение 1-2 дней:', style: 'h3', margin: [0, 25, 0, 10] },
    {
      ol: [
        'Звонок Юрия в течение часа после заявки',
        'Выезд инженера на участок (бесплатно)',
        'Письменная смета с разбивкой по 14 пунктам',
        'Договор с фикс-ценой (без «по факту вылезет»)',
        'Гарантия 5 лет с указанием конкретики',
      ],
      margin: [0, 0, 0, 10],
    },

    { text: 'СК «Юрьевич» — семейная компания (Юрий, Валерий, Евгений). Без субподряда — всегда сами на объекте.', style: 'cardSand', margin: [0, 25, 0, 0] },
  ],

  styles: {
    headerText: { fontSize: 8, color: 'white', bold: true },
    footerText: { fontSize: 8, color: 'white' },
    eyebrow: { fontSize: 11, color: RED, bold: true, characterSpacing: 2 },
    h1: { fontSize: 32, color: INK, bold: true, lineHeight: 1.1 },
    h2: { fontSize: 20, color: INK, bold: true, margin: [0, 15, 0, 10] },
    h3: { fontSize: 14, color: INK, bold: true },
    subtitle: { fontSize: 13, color: MUTE, lineHeight: 1.3 },
    small: { fontSize: 9, lineHeight: 1.3 },
    cardSand: { fontSize: 11, color: INK, italics: true, fillColor: SAND, margin: [0, 10, 0, 10] },
    tableHeader: { bold: true, color: 'white', fillColor: INK, fontSize: 10 },
    contactCard: { fontSize: 12, color: INK, bold: true, fillColor: SAND, margin: [10, 10, 10, 10] },
  },
};

function signItem(num, title, desc, ask) {
  return [
    { text: num + ' ' + title, fontSize: 13, bold: true, color: INK, margin: [0, 15, 0, 5] },
    { text: desc, margin: [0, 0, 0, 5] },
    { text: ask, italics: true, color: RED, fontSize: 10, margin: [0, 0, 0, 0] },
  ];
}

const OUT = path.join(__dirname, '..', 'public', 'lead-magnets', 'cheklist-fundament-2026.pdf');
fs.mkdirSync(path.dirname(OUT), { recursive: true });

const pdfDoc = printer.createPdfKitDocument(docDefinition);
const stream = fs.createWriteStream(OUT);
pdfDoc.pipe(stream);
pdfDoc.end();

stream.on('finish', () => {
  const stats = fs.statSync(OUT);
  console.log(`✓ PDF создан: ${OUT}`);
  console.log(`  Размер: ${(stats.size / 1024).toFixed(1)} KB`);
});
stream.on('error', (err) => {
  console.error('Ошибка:', err);
  process.exit(1);
});
