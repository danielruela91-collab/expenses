const emojiMap: [string[], string][] = [
  // Laticínios / Dairy
  [['leite', 'milk'], '🥛'],
  [['manteiga', 'butter'], '🧈'],
  [['queijo', 'cheese'], '🧀'],
  [['iogurte', 'yogurt', 'yoghurt'], '🍶'],
  [['creme de leite', 'cream'], '🥛'],
  [['requeijão', 'requeijao'], '🧀'],

  // Ovos / Eggs
  [['ovo', 'ovos', 'egg', 'eggs'], '🥚'],

  // Pães / Bread
  [['pão', 'pao', 'bread', 'baguete', 'baguette'], '🍞'],
  [['bolo', 'cake'], '🎂'],
  [['biscoito', 'bolacha', 'cookie', 'cracker'], '🍪'],
  [['torrada', 'toast'], '🍞'],

  // Carnes / Meat
  [['frango', 'chicken', 'galinha'], '🍗'],
  [['carne', 'bife', 'beef', 'meat', 'steak', 'picanha', 'alcatra'], '🥩'],
  [['peixe', 'fish', 'atum', 'sardinha', 'salmon', 'salmão', 'salmao'], '🐟'],
  [['camarão', 'camarao', 'shrimp'], '🍤'],
  [['bacon', 'presunto', 'ham'], '🥓'],
  [['salsicha', 'linguiça', 'linguica', 'sausage'], '🌭'],
  [['porco', 'pork'], '🥩'],

  // Grãos / Grains
  [['arroz', 'rice'], '🍚'],
  [['feijão', 'feijao', 'beans', 'lentilha', 'lentil'], '🫘'],
  [['macarrão', 'macarrao', 'massa', 'pasta', 'espaguete', 'spaghetti', 'talharim'], '🍝'],
  [['farinha', 'flour'], '🌾'],
  [['aveia', 'oatmeal', 'oats'], '🌾'],
  [['cereal', 'granola'], '🥣'],
  [['tapioca'], '🫓'],

  // Vegetais / Vegetables
  [['tomate', 'tomato'], '🍅'],
  [['alface', 'lettuce', 'rúcula', 'rucula', 'agrião', 'agriao'], '🥬'],
  [['cenoura', 'carrot'], '🥕'],
  [['batata', 'potato', 'batata doce', 'sweet potato'], '🥔'],
  [['cebola', 'onion'], '🧅'],
  [['alho', 'garlic'], '🧄'],
  [['pepino', 'cucumber'], '🥒'],
  [['pimentão', 'pimentao', 'pepper', 'pimenta'], '🫑'],
  [['brócolis', 'brocolis', 'broccoli'], '🥦'],
  [['espinafre', 'spinach', 'couve', 'repolho', 'cabbage'], '🥬'],
  [['milho', 'corn'], '🌽'],
  [['cogumelo', 'mushroom', 'champignon'], '🍄'],
  [['abobrinha', 'zucchini'], '🥒'],
  [['berinjela', 'eggplant', 'aubergine'], '🍆'],
  [['abacate', 'avocado'], '🥑'],
  [['beterraba', 'beetroot', 'beet'], '🍠'],
  [['inhame', 'yam', 'aipim', 'mandioca', 'cassava'], '🍠'],

  // Frutas / Fruits
  [['maçã', 'maca', 'apple'], '🍎'],
  [['banana'], '🍌'],
  [['laranja', 'orange'], '🍊'],
  [['limão', 'limao', 'lemon', 'lime'], '🍋'],
  [['uva', 'grape'], '🍇'],
  [['morango', 'strawberry'], '🍓'],
  [['melancia', 'watermelon'], '🍉'],
  [['melão', 'melao', 'melon'], '🍈'],
  [['abacaxi', 'pineapple'], '🍍'],
  [['manga', 'mango'], '🥭'],
  [['pêra', 'pera', 'pear'], '🍐'],
  [['pêssego', 'pessego', 'peach', 'nectarina'], '🍑'],
  [['cereja', 'cherry'], '🍒'],
  [['framboesa', 'raspberry', 'mirtilo', 'blueberry', 'amora'], '🫐'],
  [['coco', 'coconut'], '🥥'],
  [['mamão', 'mamao', 'papaya'], '🍈'],
  [['kiwi'], '🥝'],
  [['goiaba', 'guava'], '🍈'],

  // Bebidas / Drinks
  [['água', 'agua', 'water'], '💧'],
  [['suco', 'juice', 'néctar', 'nectar'], '🧃'],
  [['café', 'cafe', 'coffee', 'expresso', 'espresso', 'cappuccino', 'nescafé', 'nescafe'], '☕'],
  [['chá', 'cha', 'tea'], '🍵'],
  [['cerveja', 'beer'], '🍺'],
  [['vinho', 'wine'], '🍷'],
  [['refrigerante', 'soda', 'coca', 'pepsi', 'guaraná', 'guarana', 'fanta'], '🥤'],
  [['energético', 'energetico', 'energy drink', 'red bull'], '⚡'],
  [['whisky', 'whiskey', 'vodka', 'gin', 'rum'], '🥃'],

  // Temperos / Condiments
  [['azeite', 'olive oil'], '🫒'],
  [['óleo', 'oleo', 'oil'], '🫙'],
  [['sal', 'salt'], '🧂'],
  [['açúcar', 'acucar', 'sugar', 'adoçante', 'adocante'], '🍬'],
  [['mel', 'honey'], '🍯'],
  [['ketchup'], '🍅'],
  [['mostarda', 'mustard'], '🟡'],
  [['maionese', 'mayonnaise', 'mayo'], '🥚'],
  [['molho', 'sauce', 'shoyu', 'soy sauce'], '🍶'],
  [['vinagre', 'vinegar'], '🍶'],
  [['orégano', 'oregano', 'tempero', 'spice', 'erva'], '🌿'],
  [['pimenta', 'pepper', 'chili'], '🌶️'],

  // Doces / Sweets
  [['chocolate', 'achocolatado', 'nutella'], '🍫'],
  [['sorvete', 'ice cream', 'gelato'], '🍦'],
  [['doce', 'candy', 'bala', 'chiclete', 'gum'], '🍬'],
  [['bolo', 'torta', 'pie'], '🥧'],

  // Snacks
  [['salgadinho', 'chips', 'snack', 'batata frita', 'french fries'], '🍟'],
  [['pipoca', 'popcorn'], '🍿'],
  [['amendoim', 'peanut', 'pasta de amendoim', 'peanut butter'], '🥜'],
  [['castanha', 'nut', 'nozes', 'walnut', 'amêndoa', 'amendoa', 'almond'], '🌰'],
  [['barra de cereal', 'granola bar'], '🌾'],

  // Limpeza / Cleaning
  [['sabão', 'sabao', 'sabonete', 'soap'], '🧼'],
  [['detergente', 'detergent', 'dish soap', 'lava louças', 'lava loucas'], '🧴'],
  [['shampoo', 'xampu'], '🧴'],
  [['condicionador', 'conditioner'], '🧴'],
  [['papel higiênico', 'papel higienico', 'toilet paper', 'papel toalha', 'papel'], '🧻'],
  [['esponja', 'sponge', 'esfregão', 'esfregao'], '🧽'],
  [['vassoura', 'broom', 'rodo', 'mop', 'esfregona'], '🧹'],
  [['limpador', 'cleaner', 'desinfetante', 'disinfectant', 'multiuso'], '🧴'],
  [['saco de lixo', 'garbage bag', 'trash bag', 'lixo'], '🗑️'],
  [['alvejante', 'bleach', 'água sanitária', 'agua sanitaria'], '🧴'],
  [['amaciante', 'fabric softener', 'sabão em pó', 'sabao em po', 'detergente de roupa', 'ariel', 'omo'], '🧺'],

  // Higiene / Personal Care
  [['escova de dente', 'toothbrush', 'escova'], '🪥'],
  [['pasta de dente', 'creme dental', 'toothpaste', 'colgate'], '🦷'],
  [['fio dental', 'dental floss'], '🦷'],
  [['desodorante', 'deodorant', 'desodorante'], '🧴'],
  [['absorvente', 'pad', 'tampon', 'sempre livre'], '🩸'],
  [['fralda', 'diaper', 'pampers', 'huggies'], '👶'],
  [['lenço', 'lenco', 'tissue', 'kleenex'], '🤧'],
  [['cotonete', 'cotton swab', 'q-tips'], '🩹'],
  [['curativo', 'band-aid', 'bandaid', 'band aid'], '🩹'],

  // Remédios / Medicine
  [['remédio', 'remedio', 'medicine', 'medicamento', 'comprimido', 'cápsula', 'capsula'], '💊'],
  [['vitamina', 'vitamin', 'suplemento', 'supplement'], '💊'],

  // Casa / Home
  [['pilha', 'battery', 'batteries'], '🔋'],
  [['lâmpada', 'lampada', 'lamp', 'light bulb'], '💡'],
  [['vela', 'candle'], '🕯️'],
  [['presente', 'gift'], '🎁'],
  [['flor', 'flower', 'planta', 'plant'], '💐'],
]

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function getEmoji(name: string): string {
  const normalizedName = normalize(name)

  for (const [keywords, emoji] of emojiMap) {
    for (const keyword of keywords) {
      if (normalizedName.includes(normalize(keyword))) {
        return emoji
      }
    }
  }

  return ''
}
