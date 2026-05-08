import { Product, Testimonial } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'ASUS ROG Strix 26.5” 1440P QD-OLED Gaming Monitor (XG27ACDNG) -QHD (2560x1440), 360Hz, 0.03ms, Custom Heatsink, OLED Care+, G-SYNC Compatible, 99% DCI-P3, DisplayWidget, AI Gaming, 3yr Warranty',
    category: 'Electronics',
    price: 43.85,
    image: 'https://i.ibb.co.com/PsGswJDm/61-Su-Pk-DGYf-L-AC-SY695.jpg',
    badge: 'Promotion',
    rating: 4.7,
    reviews: '1.4K',
    boughtCount: '500+ bought in past month',
    delivery: 'FREE delivery Fri, May 15',
    options: '4 colors available',
    description: 'The ROG Strix XG27ACDNG is a 26.5-inch QD-OLED gaming monitor featuring balanced visuals and lightning-fast performance. Its 360Hz refresh rate and 0.03ms (GTG) response time ensure incredibly fluid gameplay, while the custom heatsink and OLED Care+ technology provide exceptional heat management and long-term reliability.',
    features: [
      '26.5-inch 1440p QD-OLED panel',
      '360Hz refresh rate and 0.03ms response time',
      'High-efficiency custom heatsink',
      'OLED Care+ for panel protection',
      'AI-powered gaming features',
      'G-SYNC Compatible support'
    ],
    specifications: {
      'Panel Size': '26.5 Inch',
      'Resolution': '2560 x 1440',
      'Panel Type': 'QD-OLED',
      'Refresh Rate': '360Hz',
      'Response Time': '0.03ms (GTG)',
      'Brightness': '450 cd/m² (Typical)',
      'Contrast Ratio': '1,500,000:1 (Typ.)',
      'Color Gamut': '99% DCI-P3',
      'Connectivity': 'DisplayPort 1.4, HDMI 2.1, USB-C'
    }
  },
  {
    id: '10',
    name: 'ASUS ROG Strix 26.5” 1440P QD-OLED Gaming Monitor (XG27ACDNG) -QHD (2560x1440), 360Hz, 0.03ms, Custom Heatsink, OLED Care+, G-SYNC Compatible, 99% DCI-P3, DisplayWidget, AI Gaming, 3yr Warranty',
    category: 'Electronics',
    price: 679.99,
    image: 'https://i.ibb.co.com/XdvMLzG/912-YTNXMZ1-L-AC-SL1500.jpg',
    description: 'The iconic clog that started a comfort revolution around the world! The irreverent go-to comfort shoe that you\'re sure to fall deeper in love with day after day. Crocs Classic Clogs offer lightweight Iconic Crocs Comfort™, a color for every personality, and an ongoing invitation to be comfortable in your own shoes.',
    options: 'Available in 20+ colors including Black, Navy, and White',
    rating: 4.8,
    reviews: '15.2K',
    boughtCount: '5K+ bought in past month',
    delivery: 'FREE delivery tomorrow'
  },
  {
    id: '2',
    name: 'Non-toxic cookware for sustainable cooking.',
    category: 'Cookware',
    price: 78.35,
    image: 'https://i.ibb.co.com/5hRd1Gxv/51-RYtih7-YJL-SL1080.jpg',
    badge: 'New',
    rating: 4.9,
    reviews: '850',
    boughtCount: '300+ bought in past month',
    delivery: 'FREE delivery Mon, May 18',
    options: '2 sets available'
  },
  {
    id: '3',
    name: 'Kettle & Toaster eco-friendly meals.',
    category: 'Appliances',
    price: 143.65,
    image: 'https://i.ibb.co.com/G47WpSXg/61la3-VOa99-L-AC-SL1500.jpg',
    badge: 'Customer Favorite',
    options: '3 finishes available',
    description: 'Fast boiling, energy efficient, and matches any modern kitchen.',
    rating: 4.8,
    reviews: '2.1K',
    boughtCount: '800+ bought in past month',
    delivery: 'FREE delivery tomorrow'
  },
  {
    id: '4',
    name: 'Bamboo Made Utensil Holder',
    category: 'Utensils',
    price: 26.27,
    image: 'https://i.ibb.co.com/V0wQfQMc/61-VF9-Oir-Vx-L-SL1500.jpg',
    badge: 'New',
    rating: 4.6,
    reviews: '520',
    boughtCount: '100+ bought in past month',
    delivery: 'FREE delivery tomorrow',
    options: '3 sizes available'
  },
  {
    id: '5',
    name: 'Ceramic serving bowl with natural stone finish.',
    category: 'Tableware',
    price: 32.50,
    image: 'https://i.ibb.co.com/zhs299qt/61mh-BSKOin-L-AC-SL1500.jpg',
    rating: 4.8,
    reviews: '340',
    boughtCount: '50+ bought in past month',
    delivery: 'FREE delivery Mon, May 18',
    options: '2 colors'
  },
  {
    id: '6',
    name: 'Linen Napkin Set for organic dining.',
    category: 'Textiles',
    price: 18.00,
    image: 'https://i.ibb.co.com/TMVW693f/71-ZFnk-By-GJL-AC-SY695.jpg',
    rating: 4.5,
    reviews: '120',
    boughtCount: '200+ bought in past month',
    delivery: 'FREE delivery tomorrow',
    options: '6 pack'
  },
  {
    id: '7',
    name: 'Glass storage jars with airtight bamboo lids.',
    category: 'Storage',
    price: 15.20,
    image: 'https://i.ibb.co.com/Dg8j1Dw8/81d-Di-IN-PSL-AC-SL1500.jpg',
    badge: 'Bestseller',
    rating: 4.9,
    reviews: '3.2K',
    boughtCount: '1K+ bought in past month',
    delivery: 'FREE delivery tomorrow',
    options: 'Set of 4'
  },
  {
    id: '8',
    name: 'Cotton tea towels for a plastic-free kitchen.',
    category: 'Textiles',
    price: 12.99,
    image: 'https://i.ibb.co.com/1GQHqBhr/81-Io-BUeo-PWL-AC-SL1500.jpg',
    rating: 4.4,
    reviews: '410',
    boughtCount: '400+ bought in past month',
    delivery: 'FREE delivery Fri, May 15'
  },
  {
    id: '9',
    name: 'Recycled steel peeler with ergonomic grip.',
    category: 'Utensils',
    price: 9.50,
    image: 'https://i.ibb.co.com/C5m8jvGh/61wc-VTDKb9-L-AC-SL1000.jpg',
    badge: 'Eco Pick',
    rating: 4.7,
    reviews: '1.8K',
    boughtCount: '900+ bought in past month',
    delivery: 'FREE delivery tomorrow'
  }
];

export const CATEGORIES = [
  { name: 'CupEco', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800' },
  { name: 'EcoSpoonery', image: 'https://images.unsplash.com/photo-1591871937573-74dbba515c4c?auto=format&fit=crop&q=80&w=800' },
  { name: 'NatureSip', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800' },
  { name: 'FreshPitcher', image: 'https://images.unsplash.com/photo-1544415291-72909188e99e?auto=format&fit=crop&q=80&w=800' }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Jane Cooper',
    role: 'Nutritionist',
    content: "NextGenShop's glass jars are awesome for storage, and the bamboo utensils are perfect for daily use!",
    rating: 5
  },
  {
    id: '2',
    name: 'Darlene Robertson',
    role: 'Culinary Instructor',
    content: "Fantastic products and fast delivery. My kitchen feels so much greener!",
    rating: 5
  },
  {
    id: '3',
    name: 'Jacob Jones',
    role: 'Food Blogger',
    content: "Love NextGenShop's eco-style! Glass jars keep things fresh, and bamboo utensils are so chic.",
    rating: 5
  }
];
