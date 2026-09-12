// Original, procedural marks in a 100 × 100 coordinate system. No remote artwork.
const baseIconDescriptions: Record<string, string> = {
  bun: 'a soft bun, vada patty, and green chutney wave',
  cart: 'a striped street-food cart carrying a fresh bun',
  packet: 'a takeaway snack packet with a pav symbol',
  'pav-badge': 'a circular street-food seal framing a pav',
  'flame-plate': 'a spice flame rising above a serving plate',
  'cutlery-bun': 'a bun framed by a fork and spoon',
  circuit: 'connected circuit traces',
  nodes: 'an interconnected node network',
  cube: 'an isometric digital cube',
  orbit: 'an orbital system suggesting discovery',
  cloud: 'a connected cloud',
  chip: 'a microchip with circuit pins',
  coin: 'a coin with a rising value mark',
  graph: 'an upward financial graph',
  shield: 'a protective shield around a growth arrow',
  arrow: 'an upward arrow through a ring',
  rupee: 'a rupee symbol within a coin',
  bars: 'ascending financial bars',
  book: 'an open book',
  globe: 'a globe with latitude and longitude lines',
  laptop: 'an online learning laptop',
  calculator: 'a calculator for math learning',
  microscope: 'a microscope for science education',
  atom: 'an atom symbol for science and discovery',
  rocket: 'a launch rocket for ambitious learning',
  schoolhouse: 'a school building with a welcoming doorway',
  library: 'a library shelf with books',
  stationery: 'a cup filled with pencils, pens, and rulers',
  notebook: 'a notebook page with a pencil',
  crayons: 'a bright set of crayons and markers',
  ruler: 'a ruler crossed with a pencil',
  backpack: 'a school backpack with learning supplies',
  clipboard: 'a checklist clipboard with a pencil',
  artbrushes: 'paint brushes and pencils for creative learning',
  paperclip: 'a paper sheet held by a paperclip and pencil',
  lamp: 'a lamp representing knowledge',
  pencil: 'a pencil drawing a new path',
  cap: 'a graduation cap',
  pages: 'open pages forming a learning horizon',
  knowledge: 'a book inside a knowledge seal',
  pin: 'a map pin with a route',
  compass: 'a compass pointing toward exploration',
  mountain: 'mountain peaks and a rising sun',
  'sun-road': 'a road leading toward the sun',
  suitcase: 'a travel suitcase',
  road: 'a road toward a distant horizon',
  heart: 'a heart with a care pulse',
  pulse: 'an electrocardiogram pulse',
  cross: 'a healthcare cross',
  leaf: 'an organic leaf',
  'care-shield': 'a health cross within a protective shield',
  'care-circle': 'two caring arcs surrounding a heart',
  sparkle: 'a balanced sparkle',
  flower: 'a blooming flower',
  face: 'a flowing facial outline',
  hanger: 'a clothing hanger',
  crown: 'an elegant crown',
  curve: 'a flowing ribbon curve',
  thread: 'a needle and flowing thread',
  controller: 'a gaming controller',
  lightning: 'a lightning bolt',
  'game-shield': 'a shield with a lightning bolt',
  pixels: 'a pixel grid',
  trophy: 'a trophy',
  joystick: 'an arcade joystick',
  house: 'a house with a welcoming doorway',
  roof: 'a sheltering roof',
  window: 'a four-pane window',
  building: 'a multi-storey building',
  key: 'a property key',
  floor: 'an architectural floor plan',
  cup: 'a cup with rising steam',
  'coffee-bean': 'a coffee bean',
  'cup-badge': 'a café cup inside a seal',
  kettle: 'a tea kettle',
  steam: 'three steam curves above a cup',
  'cup-cart': 'a mobile coffee cart',
  pizza: 'a pizza slice with toppings',
  'pizza-box': 'a pizza takeaway box',
  'pizza-badge': 'a pizza slice in a seal',
  oven: 'a pizza oven',
  'flame-pizza': 'a wood-fired pizza symbol',
  'pizza-plate': 'a pizza on a plate',
  bread: 'a scored loaf of bread',
  cake: 'a layered cake',
  wheat: 'a wheat stalk',
  'bread-badge': 'an artisan bread seal',
  'bakery-shop': 'a bakery storefront',
  'rolling-pin': 'a baker’s rolling pin',
  ball: 'a sports ball',
  medal: 'a sporting medal',
  shoe: 'a running shoe',
  flag: 'a finish flag',
  music: 'a musical note',
  'play-button': 'a play symbol within a frame',
  film: 'a strip of film',
  headphones: 'a pair of headphones',
  microphone: 'a microphone',
  spotlight: 'a stage spotlight',
  wheel: 'a wheel',
  car: 'a car silhouette',
  gear: 'a mechanical gear',
  speed: 'motion lines and a speed arrow',
  bag: 'a shopping bag',
  'cart-shop': 'a shopping cart',
  package: 'a parcel box',
  store: 'a striped storefront',
  tag: 'a retail tag',
  basket: 'a shopping basket',
  facets: 'interlocking geometric facets',
  monogram: 'a custom initial framed by geometry',
};
const compositeIconParts: Record<string, [string, string]> = {
  'burger-badge': ['bun', 'pav-badge'],
  'burger-flame': ['bun', 'flame-plate'],
  'burger-cart': ['bun', 'cart'],
  'burger-box': ['bun', 'packet'],
  'burger-cutlery': ['bun', 'cutlery-bun'],
  'burger-spark': ['bun', 'sparkle'],
  'pizza-cart': ['pizza', 'cart'],
  'pizza-flame-badge': ['pizza', 'flame-plate'],
  'pizza-spark': ['pizza', 'sparkle'],
  'coffee-leaf': ['cup', 'leaf'],
  'coffee-store': ['cup', 'store'],
  'coffee-spark': ['cup', 'sparkle'],
  'tea-badge': ['kettle', 'cup-badge'],
  'bread-wheat': ['bread', 'wheat'],
  'cake-spark': ['cake', 'sparkle'],
  'sweet-box': ['cake', 'packet'],
  'ai-chip': ['chip', 'sparkle'],
  'cloud-chip': ['cloud', 'chip'],
  'data-nodes': ['nodes', 'graph'],
  'robot-circuit': ['circuit', 'monogram'],
  'cyber-shield': ['shield', 'circuit'],
  'app-cube': ['cube', 'play-button'],
  'code-orbit': ['orbit', 'nodes'],
  'server-cloud': ['cloud', 'cube'],
  'nova-spark': ['orbit', 'sparkle'],
  'pay-shield': ['shield', 'coin'],
  'wealth-graph': ['graph', 'coin'],
  'bank-column': ['building', 'coin'],
  'rupee-growth': ['rupee', 'arrow'],
  'trade-bars': ['bars', 'graph'],
  'loan-key': ['key', 'coin'],
  'capital-badge': ['coin', 'shield'],
  'academy-cap': ['cap', 'book'],
  'book-lamp': ['book', 'lamp'],
  'course-pages': ['pages', 'pencil'],
  'online-class': ['laptop', 'book'],
  'global-learning': ['globe', 'book'],
  'math-academy': ['calculator', 'cap'],
  'science-school': ['microscope', 'atom'],
  'stem-rocket': ['rocket', 'atom'],
  'library-badge': ['library', 'knowledge'],
  'schoolhouse-book': ['schoolhouse', 'book'],
  'pencil-bundle': ['stationery', 'pencil'],
  'notebook-pencil': ['notebook', 'pencil'],
  'crayon-badge': ['crayons', 'sparkle'],
  'ruler-pencil': ['ruler', 'pencil'],
  'backpack-school': ['backpack', 'schoolhouse'],
  'clipboard-course': ['clipboard', 'pencil'],
  'art-class': ['artbrushes', 'sparkle'],
  'paper-pencil': ['paperclip', 'pencil'],
  'study-spark': ['lamp', 'sparkle'],
  'school-shield': ['shield', 'book'],
  'class-pencil': ['pencil', 'pages'],
  'learn-orbit': ['orbit', 'book'],
  'clinic-leaf': ['cross', 'leaf'],
  'wellness-heart': ['heart', 'leaf'],
  'doctor-shield': ['care-shield', 'pulse'],
  'yoga-leaf': ['leaf', 'sparkle'],
  'life-pulse': ['pulse', 'heart'],
  'medical-circle': ['care-circle', 'cross'],
  'skin-flower': ['flower', 'sparkle'],
  'salon-face': ['face', 'sparkle'],
  'glam-crown': ['crown', 'sparkle'],
  'cosmetic-leaf': ['leaf', 'face'],
  'makeup-curve': ['curve', 'sparkle'],
  'style-hanger': ['hanger', 'sparkle'],
  'couture-crown': ['crown', 'thread'],
  'apparel-thread': ['thread', 'hanger'],
  'wear-leaf': ['leaf', 'hanger'],
  'game-pixels': ['pixels', 'controller'],
  'arena-trophy': ['trophy', 'lightning'],
  'esports-shield': ['game-shield', 'controller'],
  'quest-orbit': ['orbit', 'joystick'],
  'play-bolt': ['play-button', 'lightning'],
  'cricket-medal': ['medal', 'ball'],
  'fitness-shoe': ['shoe', 'pulse'],
  'team-flag': ['flag', 'trophy'],
  'athletic-bolt': ['lightning', 'shoe'],
  'home-key': ['house', 'key'],
  'interior-window': ['window', 'sparkle'],
  'realty-roof': ['roof', 'key'],
  'property-building': ['building', 'pin'],
  'space-floor': ['floor', 'house'],
  'map-suitcase': ['pin', 'suitcase'],
  'mountain-compass': ['mountain', 'compass'],
  'hotel-key': ['key', 'suitcase'],
  'trip-road': ['road', 'pin'],
  'darshan-sun': ['sun-road', 'sparkle'],
  'sound-wave': ['music', 'pulse'],
  'studio-film': ['film', 'spotlight'],
  'media-play': ['play-button', 'film'],
  'podcast-mic': ['microphone', 'headphones'],
  'cinema-star': ['spotlight', 'sparkle'],
  'garage-gear': ['gear', 'car'],
  'drive-speed': ['speed', 'wheel'],
  'auto-key': ['key', 'car'],
  'motor-bolt': ['lightning', 'wheel'],
  'shop-bag': ['bag', 'tag'],
  'market-store': ['store', 'basket'],
  'commerce-cart': ['cart-shop', 'package'],
  'retail-spark': ['tag', 'sparkle'],
  'delivery-cube': ['package', 'speed'],
  'legal-shield': ['shield', 'book'],
  'law-pages': ['pages', 'shield'],
  'justice-badge': ['knowledge', 'shield'],
  'contract-pen': ['pencil', 'pages'],
  'agri-leaf': ['leaf', 'wheat'],
  'farm-sun': ['sun-road', 'leaf'],
  'organic-badge': ['leaf', 'pav-badge'],
  'harvest-wheat': ['wheat', 'basket'],
  'logistics-box': ['package', 'road'],
  'delivery-speed': ['package', 'speed'],
  'route-pin': ['pin', 'road'],
  'warehouse-store': ['store', 'package'],
  'builder-gear': ['gear', 'building'],
  'construction-roof': ['roof', 'gear'],
  'plan-building': ['floor', 'building'],
  'property-hammer': ['building', 'lightning'],
  'camera-frame': ['film', 'sparkle'],
  'photo-lens': ['orbit', 'sparkle'],
  'studio-camera': ['spotlight', 'film'],
  'portrait-mark': ['face', 'sparkle'],
  'consulting-nodes': ['nodes', 'book'],
  'strategy-graph': ['graph', 'compass'],
  'advisor-shield': ['shield', 'lamp'],
  'growth-orbit': ['orbit', 'arrow'],
  'green-energy': ['leaf', 'lightning'],
  'solar-road': ['sun-road', 'sparkle'],
  'power-bolt': ['lightning', 'orbit'],
  'eco-shield': ['care-shield', 'leaf'],
  'cause-heart': ['heart', 'care-circle'],
  'community-circle': ['care-circle', 'nodes'],
  'charity-hand': ['heart', 'leaf'],
  'mission-badge': ['shield', 'sparkle'],
  'hotel-pin': ['suitcase', 'pin'],
  'resort-sun': ['sun-road', 'cup'],
  'stay-key': ['key', 'house'],
  'dining-stay': ['cup', 'suitcase'],
  'factory-gear': ['gear', 'building'],
  'industrial-cube': ['cube', 'gear'],
  'precision-chip': ['chip', 'gear'],
  'supply-chain': ['nodes', 'package'],
  'creator-monogram': ['monogram', 'curve'],
  'speaker-mark': ['microphone', 'sparkle'],
  'author-book': ['book', 'monogram'],
  'coach-compass': ['compass', 'pulse'],
  'abstract-orbit': ['orbit', 'facets'],
  'founder-mark': ['monogram', 'sparkle'],
  'venture-nodes': ['nodes', 'arrow'],
  'studio-facets': ['facets', 'curve'],
};
export const iconDescriptions: Record<string, string> = {
  ...baseIconDescriptions,
  ...Object.fromEntries(
    Object.entries(compositeIconParts).map(([key, [primary, accent]]) => [
      key,
      `${baseIconDescriptions[primary]} paired with ${baseIconDescriptions[accent]}`,
    ]),
  ),
};
export function iconMarkup(key: string, p: string, s: string, a: string, initial = 'B'): string {
  const path = (d: string, fill = p, stroke = 'none', sw = 0) =>
    `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const line = (d: string, color = p, w = 5) => path(d, 'none', color, w);
  const circle = (x: number, y: number, r: number, fill = p) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
  const rect = (x: number, y: number, w: number, h: number, r = 0, fill = p) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;
  const inner = (k: string) => iconMarkup(k, p, s, a, initial);
  const small = (k: string, x = 22, y = 20, scale = 0.56) =>
    `<g transform="translate(${x} ${y}) scale(${scale})">${inner(k)}</g>`;
  const seal = (k: string) =>
    circle(50, 50, 47, s) +
    circle(50, 50, 40, p) +
    circle(50, 50, 35, '#fff') +
    small(k, 17, 17, 0.66);
  if (compositeIconParts[key]) {
    const [primary, accent] = compositeIconParts[key];
    return (
      `<g transform="translate(7 7) scale(0.86)">${inner(primary)}</g>` +
      circle(74, 25, 22, '#fff') +
      `<g transform="translate(57 8) scale(0.35)">${iconMarkup(accent, s, p, a, initial)}</g>` +
      circle(77, 80, 8, a)
    );
  }
  const bun =
    path('M15 43C15 9 85 9 85 43Z') +
    rect(13, 49, 74, 15, 7, s) +
    path('M14 48Q23 38 33 47T52 47T71 47T86 47L86 54Q76 62 68 54T49 54T30 54T14 54Z', a) +
    path('M15 68H85Q82 85 68 85H31Q18 85 15 68Z') +
    line('M36 27l3 -3M50 24l2 -3M63 28l3 2', '#fff', 3);
  const shield = path('M50 8L87 22V47Q85 74 50 93Q15 75 13 47V22Z', s);
  switch (key) {
    case 'bun':
      return bun;
    case 'cart':
    case 'cup-cart':
      return (
        line('M18 48v31h65V48M25 79v9M79 79v9', s, 5) +
        path('M10 43L21 17H79L91 43Z') +
        path('M28 17h13l-3 26H23ZM57 17h13l8 26H61Z', a) +
        circle(29, 87, 6, s) +
        circle(75, 87, 6, s) +
        small(key === 'cart' ? 'bun' : 'cup', 33, 41, 0.35)
      );
    case 'packet':
      return (
        path('M20 10L33 15L46 10L59 15L73 10L82 90H18Z', s) +
        rect(25, 30, 50, 46, 8, '#fff') +
        small('bun', 30, 34, 0.4) +
        line('M30 22h37', p, 4)
      );
    case 'pav-badge':
      return seal('bun');
    case 'flame-plate':
      return (
        path(
          'M51 5C56 25 75 28 71 48C69 69 29 70 27 47C26 35 40 26 38 16C47 22 45 30 47 32C55 26 48 16 51 5Z',
        ) +
        path('M48 34C68 53 48 68 40 53C36 45 47 44 48 34Z', a) +
        `<ellipse cx="50" cy="78" rx="39" ry="10" fill="none" stroke="${s}" stroke-width="5"/>`
      );
    case 'cutlery-bun':
      return (
        small('bun', 22, 18, 0.56) +
        line('M9 13v24q0 9 9 9V87M18 12v24M27 13v24q0 9 -9 9M90 44V88', s, 4) +
        `<ellipse cx="90" cy="28" rx="7" ry="18" fill="${p}"/>`
      );
    case 'circuit':
      return (
        rect(33, 33, 34, 34, 9, p) +
        line('M50 33V13M67 50H89M50 67V89M33 50H11M33 40H21V20M61 67V81H81', s, 5) +
        [
          circle(50, 10, 6, a),
          circle(91, 50, 6, a),
          circle(50, 91, 6, a),
          circle(9, 50, 6, a),
          circle(20, 18, 5, p),
          circle(84, 81, 5, p),
        ].join('') +
        rect(42, 42, 16, 16, 4, '#fff')
      );
    case 'nodes':
      return (
        line('M50 13L85 36L73 78H28L13 36ZM13 36L50 52L85 36M50 13V52L28 78M50 52L73 78', s, 4) +
        [
          [50, 13],
          [85, 36],
          [73, 78],
          [28, 78],
          [13, 36],
        ]
          .map(([x, y]) => circle(x, y, 8, p))
          .join('') +
        circle(50, 52, 12, a)
      );
    case 'cube':
    case 'package':
      return (
        path('M50 7L89 29V73L50 95L11 73V29Z') +
        path('M50 51L89 29V73L50 95Z', s) +
        path('M50 51L11 29L50 7L89 29Z', a) +
        line('M50 52V86M19 33L50 52L82 33', '#fff', 3)
      );
    case 'orbit':
      return (
        `<ellipse cx="50" cy="50" rx="42" ry="21" fill="none" stroke="${p}" stroke-width="6" transform="rotate(-34 50 50)"/>` +
        `<ellipse cx="50" cy="50" rx="42" ry="21" fill="none" stroke="${s}" stroke-width="4" transform="rotate(50 50 50)"/>` +
        circle(50, 50, 13, p) +
        circle(83, 24, 7, a)
      );
    case 'cloud':
      return (
        path('M25 75C0 75 2 41 25 38C29 7 72 8 78 40C103 41 101 75 78 75Z') +
        line('M32 53v9h36V51M50 62v20', '#fff', 4) +
        circle(50, 85, 6, a)
      );
    case 'chip':
      return (
        rect(23, 23, 54, 54, 12, p) +
        rect(35, 35, 30, 30, 5, s) +
        [32, 50, 68]
          .map((x) => line(`M${x} 10V23M${x} 77V90M10 ${x}H23M77 ${x}H90`, p, 5))
          .join('') +
        line('M42 50h16M50 42v16', '#fff', 3)
      );
    case 'coin':
    case 'rupee':
      return (
        circle(50, 50, 43, p) +
        circle(50, 50, 34, s) +
        (key === 'rupee'
          ? line('M34 30H67M34 40H67M41 30Q68 41 38 53L62 73', '#fff', 5)
          : line('M29 63L45 48L55 56L73 34M59 34H73V48', '#fff', 5))
      );
    case 'graph':
      return line('M14 16v66h76', s, 5) + line('M26 65L43 47L58 53L84 20M69 20H84V35', p, 7);
    case 'shield':
    case 'care-shield':
    case 'game-shield':
      return (
        shield +
        small(
          key === 'care-shield' ? 'cross' : key === 'game-shield' ? 'lightning' : 'arrow',
          26,
          24,
          0.48,
        )
      );
    case 'arrow':
      return circle(50, 50, 43, p) + path('M50 23L73 48H59V76H41V48H27Z', '#fff');
    case 'bars':
      return (
        rect(13, 58, 18, 27, 4, s) +
        rect(41, 39, 18, 46, 4, p) +
        rect(69, 16, 18, 69, 4, a) +
        line('M16 38L71 10M58 9H75V25', p, 4)
      );
    case 'book':
    case 'pages':
      return (
        path('M50 29Q28 15 9 24V77Q29 69 50 82Q73 68 91 77V24Q71 15 50 29Z') +
        path('M50 29V82Q73 68 91 77V24Q71 15 50 29Z', s) +
        line('M21 36Q32 33 40 38M21 46Q32 43 40 48M61 37Q70 32 79 35M61 47Q70 42 79 45', '#fff', 3)
      );
    case 'globe':
      return (
        circle(50, 50, 43, p) +
        `<ellipse cx="50" cy="50" rx="19" ry="42" fill="none" stroke="#fff" stroke-width="5"/>` +
        line('M9 50H91M18 31H82M18 69H82', '#fff', 4) +
        circle(73, 25, 6, a)
      );
    case 'laptop':
      return (
        rect(17, 18, 66, 47, 6, p) +
        rect(25, 26, 50, 31, 3, '#fff') +
        path('M8 73H92L82 86H18Z', s) +
        small('book', 35, 29, 0.3)
      );
    case 'calculator':
      return (
        rect(22, 8, 56, 84, 10, p) +
        rect(31, 18, 38, 16, 3, '#fff') +
        [31, 47, 63]
          .map((x) => [44, 60, 76].map((y) => rect(x, y, 9, 9, 2, x === 63 ? a : s)).join(''))
          .join('')
      );
    case 'microscope':
      return (
        `<g transform="rotate(-22 48 38)">${rect(42, 7, 17, 48, 5, p)}${rect(37, 4, 28, 10, 4, s)}</g>` +
        line('M51 48Q70 58 63 77H36Q31 56 51 48M29 88H78M55 76V88', s, 6) +
        circle(42, 54, 9, a)
      );
    case 'atom':
      return (
        `<ellipse cx="50" cy="50" rx="43" ry="17" fill="none" stroke="${p}" stroke-width="6"/>` +
        `<ellipse cx="50" cy="50" rx="43" ry="17" fill="none" stroke="${s}" stroke-width="5" transform="rotate(60 50 50)"/>` +
        `<ellipse cx="50" cy="50" rx="43" ry="17" fill="none" stroke="${a}" stroke-width="4" transform="rotate(120 50 50)"/>` +
        circle(50, 50, 8, p)
      );
    case 'rocket':
      return (
        path('M52 5Q76 25 70 58L92 77L68 82L58 96L45 70L18 57L32 47Q32 21 52 5Z') +
        circle(56, 33, 9, '#fff') +
        path('M35 69Q21 73 14 91Q32 86 43 77Z', a)
      );
    case 'schoolhouse':
      return (
        path('M12 44L50 14L88 44V90H12Z', p) +
        path('M50 10L95 46L87 55L50 26L13 55L5 46Z', s) +
        rect(24, 54, 14, 14, 2, '#fff') +
        rect(62, 54, 14, 14, 2, '#fff') +
        rect(42, 68, 16, 22, 2, a)
      );
    case 'library':
      return (
        rect(12, 24, 76, 62, 5, s) +
        rect(20, 16, 14, 70, 3, p) +
        rect(42, 23, 14, 63, 3, a) +
        rect(64, 12, 14, 74, 3, p) +
        line('M19 37H34M42 42H56M64 31H78', '#fff', 3)
      );
    case 'stationery':
      return (
        path('M23 40H77L70 91H30Z', s) +
        `<g transform="rotate(-10 34 35)">${rect(29, 8, 10, 58, 2, p)}${path('M29 66H39L34 81Z', a)}</g>` +
        `<g transform="rotate(8 51 33)">${rect(46, 5, 10, 62, 2, a)}${path('M46 67H56L51 84Z', p)}</g>` +
        `<g transform="rotate(18 68 36)">${rect(63, 10, 10, 55, 2, p)}${path('M63 65H73L68 80Z', s)}</g>` +
        line('M30 52H70', '#fff', 4)
      );
    case 'notebook':
      return (
        rect(21, 8, 58, 84, 8, p) +
        line('M33 8V92M18 25H29M18 42H29M18 59H29M18 76H29', s, 4) +
        line('M43 33H67M43 47H67M43 61H58', '#fff', 3) +
        small('pencil', 52, 50, 0.28)
      );
    case 'crayons':
      return (
        `<g transform="rotate(-11 30 46)">${rect(24, 12, 13, 66, 4, p)}${path('M24 12L31 2L37 12Z', s)}${rect(24, 59, 13, 12, 0, a)}</g>` +
        `<g transform="rotate(4 50 45)">${rect(44, 9, 13, 70, 4, a)}${path('M44 9L51 0L57 9Z', s)}${rect(44, 60, 13, 12, 0, p)}</g>` +
        `<g transform="rotate(14 70 46)">${rect(64, 14, 13, 64, 4, s)}${path('M64 14L71 4L77 14Z', p)}${rect(64, 59, 13, 12, 0, a)}</g>` +
        path('M18 77H82L75 91H25Z', p)
      );
    case 'ruler':
      return (
        `<g transform="rotate(-35 50 50)">${rect(16, 39, 68, 22, 4, a)}${line('M25 40V52M36 40V48M47 40V52M58 40V48M69 40V52', '#fff', 3)}</g>` +
        small('pencil', 30, 15, 0.55)
      );
    case 'backpack':
      return (
        path('M25 29Q29 9 50 9Q71 9 75 29Q86 35 86 59V90H14V59Q14 35 25 29Z', p) +
        rect(28, 48, 44, 32, 7, s) +
        line('M34 30Q50 43 66 30M28 62H72', '#fff', 4) +
        circle(71, 78, 5, a)
      );
    case 'clipboard':
      return (
        rect(22, 14, 56, 78, 7, p) +
        rect(36, 7, 28, 15, 5, s) +
        line('M34 38H66M34 52H66M34 66H55', '#fff', 4) +
        small('pencil', 54, 48, 0.34)
      );
    case 'artbrushes':
      return (
        `<g transform="rotate(-20 30 45)">${rect(25, 11, 10, 54, 4, p)}${path('M22 68Q31 92 40 68Z', s)}</g>` +
        `<g transform="rotate(9 50 45)">${rect(45, 8, 10, 57, 4, a)}${path('M42 68Q51 92 60 68Z', p)}</g>` +
        `<g transform="rotate(24 68 48)">${rect(63, 16, 10, 52, 4, s)}${path('M60 71Q69 92 78 71Z', a)}</g>` +
        line('M20 86H82', p, 6)
      );
    case 'paperclip':
      return (
        `<g transform="rotate(-7 50 50)">${rect(25, 14, 50, 70, 3, '#fff')}${line('M35 34H66M35 47H66M35 60H58', p, 4)}</g>` +
        line('M67 21C86 20 87 48 70 49H45C30 49 30 27 44 27H64', s, 5) +
        small('pencil', 47, 49, 0.32)
      );
    case 'lamp':
      return path('M30 15H70L85 53H15Z') + line('M50 54V82M29 86H71', s, 6) + circle(50, 57, 5, a);
    case 'pencil':
      return `<g transform="rotate(35 50 50)">${rect(38, 12, 24, 62, 4, p)}${path('M38 74H62L50 94Z', s)}${rect(38, 14, 24, 12, 3, a)}${line('M48 34v34', '#fff', 3)}</g>`;
    case 'cap':
      return (
        path('M4 37L50 15L96 37L50 60Z') +
        path('M24 51V73Q50 90 76 73V51L50 66Z', s) +
        line('M88 42V73', a, 4) +
        circle(88, 77, 5, a)
      );
    case 'knowledge':
      return seal('book');
    case 'pin':
      return (
        path('M50 94C45 83 15 53 15 36C15 -3 85 -3 85 36C85 55 57 84 50 94Z') +
        circle(50, 35, 15, '#fff') +
        circle(50, 35, 7, s)
      );
    case 'compass':
      return (
        circle(50, 50, 44, s) +
        circle(50, 50, 37, '#fff') +
        path('M71 22L60 60L29 78L41 40Z') +
        path('M41 40L60 60L29 78Z', a) +
        circle(50, 50, 5, '#fff')
      );
    case 'mountain':
      return (
        circle(73, 23, 13, a) +
        path('M3 83L35 23L61 60L72 40L97 83Z') +
        path('M35 23L49 44L36 39L26 43Z', '#fff') +
        path('M36 83L60 48L83 83Z', s)
      );
    case 'sun-road':
    case 'road':
      return (
        circle(50, 30, 22, a) +
        path('M37 40H63L89 94H11Z', s) +
        line('M50 48v8M50 65v10M50 84v7', '#fff', 4)
      );
    case 'suitcase':
      return (
        line('M36 23v-9h28v9', s, 5) +
        rect(14, 26, 72, 59, 10, p) +
        line('M30 30v49M70 30v49', a, 4) +
        circle(28, 90, 5, s) +
        circle(72, 90, 5, s)
      );
    case 'heart':
      return (
        path('M50 85C34 73 5 53 9 30C12 6 39 9 50 29C63 8 87 7 92 29C98 53 69 73 50 85Z') +
        line('M19 48H36L44 34L56 66L64 48H82', '#fff', 4)
      );
    case 'pulse':
      return line('M6 52H29L41 18L58 83L70 43L78 52H95', p, 7);
    case 'cross':
      return path('M36 9H64V36H91V64H64V91H36V64H9V36H36Z');
    case 'leaf':
      return (
        path('M18 81C-4 27 50 7 88 11C88 55 69 94 24 83Z') +
        line('M15 91L70 29M35 69V48M49 55H68', '#fff', 4)
      );
    case 'care-circle':
      return (
        line('M18 29C-5 56 18 89 42 90M81 70C102 43 81 10 58 10', s, 7) +
        small('heart', 24, 24, 0.52)
      );
    case 'sparkle':
      return (
        path('M50 6C56 35 65 43 93 50C65 57 56 65 50 94C44 65 36 57 7 50C36 43 44 35 50 6Z') +
        circle(83, 17, 7, a)
      );
    case 'flower':
      return (
        [0, 60, 120, 180, 240, 300]
          .map(
            (deg) =>
              `<ellipse cx="50" cy="28" rx="14" ry="24" fill="${deg % 120 === 0 ? p : s}" transform="rotate(${deg} 50 50)"/>`,
          )
          .join('') + circle(50, 50, 15, a)
      );
    case 'face':
      return (
        line(
          'M68 91C50 86 52 72 52 68C29 68 30 58 36 51C27 45 33 41 37 36C37 15 57 5 75 16M45 36h9M48 52h9',
          p,
          5,
        ) + line('M26 82C13 48 19 7 47 8', s, 4)
      );
    case 'hanger':
      return line(
        'M40 24C39 6 64 8 62 24C61 31 50 30 50 39L10 68Q3 75 15 77H85Q96 75 90 68L50 39',
        p,
        6,
      );
    case 'crown':
      return (
        path('M10 27L32 46L50 14L68 46L90 27L79 80H21Z') +
        rect(20, 82, 60, 8, 3, s) +
        circle(50, 59, 6, a)
      );
    case 'curve':
      return (
        line('M78 14C8 8 11 50 51 50C93 50 91 91 22 86', p, 10) +
        line('M29 28C63 21 75 63 44 73', s, 4)
      );
    case 'thread':
      return line('M15 85L68 13Q82 2 86 14Q87 22 75 30L15 85M74 17C92 57 21 45 37 82', p, 4);
    case 'controller':
      return (
        path('M28 27H72Q85 27 91 64Q96 84 81 80L64 65H36L19 80Q4 85 9 64Q15 27 28 27Z') +
        line('M30 39V57M21 48H39', '#fff', 5) +
        circle(71, 42, 5, a) +
        circle(80, 52, 5, s)
      );
    case 'lightning':
      return path('M58 3L13 57H44L35 97L88 38H55Z');
    case 'pixels':
      return [
        [10, 10],
        [38, 10],
        [66, 10],
        [10, 38],
        [38, 38],
        [66, 38],
        [10, 66],
        [38, 66],
      ]
        .map(([x, y], i) => rect(x, y, 22, 22, 2, i % 3 === 0 ? a : i % 2 ? s : p))
        .join('');
    case 'trophy':
      return (
        path('M28 10H72V36Q71 59 50 65Q28 58 28 36Z') +
        line('M27 20H11V37Q12 52 30 52M73 20H89V37Q88 52 70 52M50 65V84M32 88H68', s, 6) +
        path('M50 20L54 29L64 30L56 37L58 47L50 42L42 47L44 37L36 30L46 29Z', a)
      );
    case 'joystick':
      return (
        rect(12, 63, 76, 25, 8, s) +
        line('M43 64V30', p, 7) +
        circle(43, 22, 15, p) +
        circle(71, 69, 5, a)
      );
    case 'house':
      return path('M7 47L50 9L93 47L85 55L79 50V90H59V64H41V90H21V50L15 55Z');
    case 'roof':
      return line('M9 52L50 15L91 52M24 50V86H76V50', p, 8) + rect(42, 59, 16, 27, 2, s);
    case 'window':
      return (
        rect(13, 13, 74, 74, 13, s) +
        [
          [23, 23],
          [54, 23],
          [23, 54],
          [54, 54],
        ]
          .map(([x, y]) => rect(x, y, 23, 23, 2, p))
          .join('')
      );
    case 'building':
      return (
        rect(19, 8, 47, 84, 2, p) +
        rect(65, 37, 20, 55, 2, s) +
        [21, 39, 57]
          .map((y) => rect(28, y, 9, 10, 1, '#fff') + rect(47, y, 9, 10, 1, '#fff'))
          .join('') +
        rect(35, 78, 15, 14, 1, a)
      );
    case 'key':
      return (
        circle(31, 30, 23, p) +
        circle(31, 30, 10, '#fff') +
        path('M42 43L84 85L94 76L81 63L72 71L64 63L72 55L57 40Z', s)
      );
    case 'floor':
      return line('M12 12H88V88H12ZM12 50H48V88M48 12V35M48 50H70M88 50H80', p, 6);
    case 'cup':
    case 'steam':
      return (
        path('M17 35H72V66Q67 83 45 83Q23 83 17 66Z') +
        line('M73 39H84Q97 40 89 56Q84 63 74 61M24 91H72', s, 5) +
        line('M32 25C22 17 38 14 30 5M48 25C38 17 54 14 46 5M64 25C54 17 70 14 62 5', a, 3)
      );
    case 'coffee-bean':
      return (
        `<ellipse cx="50" cy="50" rx="30" ry="44" fill="${p}" transform="rotate(28 50 50)"/>` +
        line('M66 13C34 23 70 62 32 86', s, 6)
      );
    case 'kettle':
      return (
        path('M29 28H70Q83 32 83 60Q82 86 47 85Q21 84 21 60L6 40H25Z') +
        line('M70 32C98 12 100 70 82 65M39 22H64', s, 6) +
        circle(51, 15, 7, a)
      );
    case 'cup-badge':
      return seal('cup');
    case 'pizza':
      return (
        path('M10 21Q49 0 90 23L50 94Z') +
        path('M10 21Q49 0 90 23L84 35Q50 17 16 33Z', s) +
        circle(36, 39, 6, s) +
        circle(61, 44, 6, s) +
        circle(49, 66, 6, s) +
        line('M47 32l5 2M34 53l4 2M57 56l3 2', a, 3)
      );
    case 'pizza-box':
      return (
        rect(10, 10, 80, 80, 9, s) + rect(17, 17, 66, 66, 6, '#fff') + small('pizza', 25, 20, 0.5)
      );
    case 'pizza-badge':
      return seal('pizza');
    case 'oven':
      return (
        path('M10 88V47C10 -4 90 -4 90 47V88Z') +
        path('M27 88V52C27 23 73 23 73 52V88Z', s) +
        rect(37, 68, 26, 6, 3, a)
      );
    case 'flame-pizza':
      return small('flame-plate', 10, 0, 0.8) + small('pizza', 32, 46, 0.36);
    case 'pizza-plate':
      return circle(50, 50, 44, s) + circle(50, 50, 36, '#fff') + small('pizza', 23, 18, 0.54);
    case 'bread':
      return (
        path('M18 87V41C-2 28 15 3 32 15C42 1 60 1 70 15C90 4 104 31 82 41V87Z') +
        line('M35 34L29 48M53 31L47 45M70 37L64 51', s, 5)
      );
    case 'cake':
      return (
        rect(15, 38, 70, 46, 7, p) +
        path('M15 44Q23 56 31 45T48 45T66 45T85 44V35H15Z', s) +
        line('M21 65H79M50 32V17', '#fff', 4) +
        path('M50 2Q65 15 50 19Q38 16 50 2Z', a)
      );
    case 'wheat':
      return (
        line('M50 91V19', s, 4) +
        [26, 45, 64]
          .map(
            (y) =>
              path(`M49 ${y + 13}Q19 ${y + 12} 24 ${y - 8}Q44 ${y - 5} 49 ${y + 13}Z`) +
              path(`M51 ${y + 13}Q81 ${y + 12} 76 ${y - 8}Q56 ${y - 5} 51 ${y + 13}Z`, a),
          )
          .join('')
      );
    case 'bread-badge':
      return seal('bread');
    case 'bakery-shop':
      return inner('store') + small('bread', 34, 42, 0.32);
    case 'rolling-pin':
      return `<g transform="rotate(-35 50 50)">${rect(22, 32, 56, 36, 10, p)}${rect(4, 42, 20, 16, 6, s)}${rect(76, 42, 20, 16, 6, s)}${line('M32 40H65', a, 3)}</g>`;
    case 'ball':
      return (
        circle(50, 50, 42, p) + line('M8 50H92M50 8V92M20 21Q69 49 20 79M80 21Q31 49 80 79', s, 4)
      );
    case 'medal':
      return (
        path('M15 5H37L52 47L35 62Z', s) +
        path('M64 5H86L65 62L47 47Z', p) +
        circle(50, 66, 26, p) +
        small('sparkle', 36, 52, 0.28)
      );
    case 'shoe':
      return (
        path('M12 27H35Q36 45 54 54L90 66Q96 77 89 85H12Z') +
        line('M15 76H88M44 48l-8 9M56 55l-8 9M68 60l-8 9', '#fff', 4)
      );
    case 'flag':
      return (
        line('M20 8V93', s, 6) +
        path('M25 14Q48 4 62 19Q75 31 93 19V62Q74 75 60 60Q45 46 25 57Z') +
        rect(37, 25, 12, 12, 0, '#fff') +
        rect(50, 38, 12, 12, 0, '#fff') +
        rect(66, 30, 12, 12, 0, '#fff')
      );
    case 'music':
      return (
        path('M39 17L87 7V68H76V29L50 35V79H39Z') +
        `<ellipse cx="28" cy="79" rx="21" ry="13" fill="${s}"/><ellipse cx="67" cy="68" rx="20" ry="13" fill="${p}"/>`
      );
    case 'play-button':
      return rect(8, 18, 84, 64, 18, p) + path('M40 32L69 50L40 69Z', '#fff');
    case 'film':
      return (
        rect(11, 9, 78, 82, 8, p) +
        rect(28, 19, 44, 62, 2, s) +
        [20, 38, 56, 74]
          .map((y) => rect(16, y, 6, 8, 1, '#fff') + rect(78, y, 6, 8, 1, '#fff'))
          .join('')
      );
    case 'headphones':
      return (
        line('M15 65V43C15 -2 85 -2 85 43V65', p, 9) +
        rect(9, 49, 21, 39, 8, s) +
        rect(70, 49, 21, 39, 8, s)
      );
    case 'microphone':
      return (
        rect(34, 6, 32, 57, 16, p) +
        line('M24 44v8C24 87 76 87 76 52V44M50 78V91M35 93H65', s, 5) +
        line('M43 19H57M43 30H57', '#fff', 3)
      );
    case 'spotlight':
      return (
        path('M28 19L55 9L73 43L45 56Z', s) +
        path('M44 59L76 47L96 91H7Z', p) +
        line('M32 45L19 61V86', s, 5)
      );
    case 'wheel':
    case 'gear':
      return (
        circle(50, 50, 44, p) +
        circle(50, 50, 31, s) +
        circle(50, 50, 11, a) +
        [0, 60, 120, 180, 240, 300]
          .map(
            (d) =>
              `<path d="M50 36V21" stroke="#fff" stroke-width="6" transform="rotate(${d} 50 50)"/>`,
          )
          .join('')
      );
    case 'car':
      return (
        path('M9 47L24 20H76L91 47V77H9Z') +
        path('M30 28H70L80 47H20Z', s) +
        rect(16, 61, 16, 8, 3, a) +
        rect(68, 61, 16, 8, 3, a) +
        rect(15, 77, 14, 14, 3, s) +
        rect(71, 77, 14, 14, 3, s)
      );
    case 'speed':
      return line('M6 25H48M6 50H34M6 75H48', s, 6) + path('M48 9L95 50L48 91L67 50Z');
    case 'bag':
      return (
        path('M18 29H82L90 92H10Z') +
        line('M34 39V22C34 -1 66 -1 66 22V39', s, 6) +
        small('sparkle', 32, 47, 0.36)
      );
    case 'cart-shop':
      return (
        line('M7 10H20L34 68H80M25 27H93L82 57H33', p, 6) +
        circle(40, 85, 8, s) +
        circle(76, 85, 8, s)
      );
    case 'store':
      return (
        rect(14, 40, 72, 49, 3, s) +
        path('M6 39L20 11H80L94 39Z') +
        path('M30 11H42L37 39H23ZM58 11H70L78 39H63Z', a) +
        rect(22, 49, 26, 29, 2, '#fff') +
        rect(58, 51, 18, 38, 1, p)
      );
    case 'tag':
      return (
        path('M11 10H54L94 52L52 94L11 53Z') +
        circle(32, 31, 8, '#fff') +
        line('M42 60L64 38M54 72L76 50', s, 4)
      );
    case 'basket':
      return (
        path('M8 39H92L78 88H22Z') +
        line('M28 40L40 12M72 40L60 12', s, 6) +
        line('M34 51v24M50 51v24M66 51v24', '#fff', 4)
      );
    case 'facets':
      return (
        path('M50 3L94 28L78 79L50 96L6 71L22 20Z') +
        path('M50 3V96L78 79L94 28Z', s) +
        path('M22 20L78 79L6 71Z', a)
      );
    case 'monogram':
      return (
        rect(10, 10, 80, 80, 21, p) +
        `<text x="50" y="69" font-family="Arial, sans-serif" font-size="55" font-weight="800" text-anchor="middle" fill="#fff">${initial}</text>`
      );
    default:
      return inner('facets');
  }
}
