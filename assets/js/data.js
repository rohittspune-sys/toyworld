// Mock data for Gen X Toybox

const PRODUCTS = [
  {
    id: 'retro-robot',
    name: 'Retro Tin Robot',
    brand: 'RetroWorks',
    category: 'Retro Classics',
    type: 'Figure',
    educationalFocus: 'Creativity',
    ageMin: 8,
    ageMax: 99,
    price: 39.99,
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80&auto=format&fit=crop'
    ],
    benefits: ['Collectible build', 'Durable tin body', 'Retro charm'],
    reviews: [
      { name: 'Alex P.', rating: 5, comment: 'Looks just like my childhood robot. Love it!' },
      { name: 'Dana K.', rating: 4, comment: 'Great quality and fast shipping.' }
    ],
    stock: 24
  },
  {
    id: 'stem-lab',
    name: 'STEM Experiment Lab',
    brand: 'EduForge',
    category: 'Modern Learning',
    type: 'Kit',
    educationalFocus: 'STEM',
    ageMin: 7,
    ageMax: 14,
    price: 49.5,
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1581092921461-eab62e97a428?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80&auto=format&fit=crop'
    ],
    benefits: ['Hands-on learning', 'Builds problem solving', 'Fun experiments'],
    reviews: [
      { name: 'Sam W.', rating: 5, comment: 'Kept my kids engaged for hours!' },
      { name: 'Priya N.', rating: 4, comment: 'Educational and fun.' }
    ],
    stock: 58
  },
  {
    id: 'wood-blocks',
    name: 'Classic Wooden Blocks',
    brand: 'PlayCraft',
    category: 'Retro Classics',
    type: 'Blocks',
    educationalFocus: 'Fine Motor',
    ageMin: 2,
    ageMax: 7,
    price: 29.0,
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1541976076758-347942db1970?w=800&q=80&auto=format&fit=crop'
    ],
    benefits: ['Safe and sturdy', 'Boosts creativity', 'Eco-friendly'],
    reviews: [
      { name: 'Jordan R.', rating: 5, comment: 'Beautiful finish and safe for toddlers.' }
    ],
    stock: 40
  },
  {
    id: 'collector-console',
    name: 'Mini Retro Game Console',
    brand: 'PixelTime',
    category: 'For Collectors',
    type: 'Electronics',
    educationalFocus: 'Problem Solving',
    ageMin: 12,
    ageMax: 99,
    price: 89.99,
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1617727553252-65863a841f07?w=800&q=80&auto=format&fit=crop'
    ],
    benefits: ['Preloaded classics', 'HDMI output', 'Two controllers'],
    reviews: [
      { name: 'Chris L.', rating: 5, comment: 'Nostalgia overload!' }
    ],
    stock: 14
  },
  {
    id: 'art-kit',
    name: 'Creative Art Starter Kit',
    brand: 'BrightMinds',
    category: 'Modern Learning',
    type: 'Art',
    educationalFocus: 'Creativity',
    ageMin: 5,
    ageMax: 12,
    price: 24.99,
    rating: 4.3,
    images: [
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80&auto=format&fit=crop'
    ],
    benefits: ['Non-toxic', 'Colorful variety', 'Encourages expression'],
    reviews: [],
    stock: 77
  },
  {
    id: 'lego-style-bot',
    name: 'Build-a-Bot Coding Set',
    brand: 'CodeKidz',
    category: 'Modern Learning',
    type: 'Kit',
    educationalFocus: 'STEM',
    ageMin: 8,
    ageMax: 14,
    price: 59.99,
    rating: 4.4,
    images: [
      'https://images.unsplash.com/photo-1581091870622-7b1b1f4b4b36?w=800&q=80&auto=format&fit=crop'
    ],
    benefits: ['Intro to coding', 'Modular builds', 'Interactive play'],
    reviews: [],
    stock: 31
  },
  {
    id: 'plush-dino',
    name: 'Plush Dino Buddy',
    brand: 'SnuggleZoo',
    category: 'Retro Classics',
    type: 'Plush',
    educationalFocus: 'Creativity',
    ageMin: 1,
    ageMax: 6,
    price: 18.5,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800&q=80&auto=format&fit=crop'
    ],
    benefits: ['Soft and huggable', 'Machine washable'],
    reviews: [],
    stock: 120
  },
  {
    id: 'metal-puzzle',
    name: 'Collector’s Metal Puzzle',
    brand: 'MindFlex',
    category: 'For Collectors',
    type: 'Puzzle',
    educationalFocus: 'Problem Solving',
    ageMin: 10,
    ageMax: 99,
    price: 34.99,
    rating: 4.2,
    images: [
      'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=800&q=80&auto=format&fit=crop'
    ],
    benefits: ['Premium finish', 'Challenging design'],
    reviews: [],
    stock: 21
  },
  {
    id: 'marble-run',
    name: 'Transparent Marble Run',
    brand: 'STEMFlow',
    category: 'Modern Learning',
    type: 'Kit',
    educationalFocus: 'STEM',
    ageMin: 6,
    ageMax: 12,
    price: 44.0,
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1615484477398-5b3d7e1ef0df?w=800&q=80&auto=format&fit=crop'
    ],
    benefits: ['Physics in action', 'Creative builds'],
    reviews: [],
    stock: 45
  }
];

const TESTIMONIALS = [
  { quote: 'A perfect blend of nostalgia and learning. My kids love it, and so do I!', name: 'Taylor M.' },
  { quote: 'Fast delivery and top-notch quality. Highly recommend!', name: 'Jamie C.' },
  { quote: 'The curated collections make gift shopping so easy.', name: 'Morgan S.' }
];

const BLOG_POSTS = [
  {
    id: 'retro-trends',
    title: '5 Retro Toy Trends Making a Comeback',
    date: '2025-05-18',
    author: 'Gen X Toybox Team',
    image: 'https://images.unsplash.com/photo-1520975922299-96a83a63a318?w=1200&q=80&auto=format&fit=crop',
    excerpt: 'From tin robots to classic blocks, here are the old-school favorites charming a new generation.'
  },
  {
    id: 'stem-at-home',
    title: 'STEM at Home: Simple Experiments for Curious Kids',
    date: '2025-04-22',
    author: 'Dr. Play',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80&auto=format&fit=crop',
    excerpt: 'Turn your living room into a mini lab with these safe, fun activities.'
  },
  {
    id: 'collector-care',
    title: 'Collector’s Corner: Caring for Vintage Toys',
    date: '2025-03-10',
    author: 'Gen X Toybox Team',
    image: 'https://images.unsplash.com/photo-1472457897821-70d3819a0e24?w=1200&q=80&auto=format&fit=crop',
    excerpt: 'Preserve value and charm with our best care tips for vintage pieces.'
  }
];

const ORDERS = [
  { id: 'GX-1042', email: 'alex@example.com', status: 'Shipped', eta: '2025-08-20', items: ['retro-robot', 'wood-blocks'] },
  { id: 'GX-1043', email: 'sam@example.com', status: 'Processing', eta: '2025-08-22', items: ['stem-lab'] },
  { id: 'GX-1044', email: 'morgan@example.com', status: 'Delivered', eta: '2025-08-10', items: ['collector-console'] }
];