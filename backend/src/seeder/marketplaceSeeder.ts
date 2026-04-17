export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  mainCategory: "Marketplace";
  category: string[];
  region: string;
  city: string;
  images: string[];
  isPaid: boolean;
  userId: string;
  isBasic30: boolean;
  isStandard60: boolean;
  isPremium90: boolean;
  maGaday: boolean;
}

const USERS = [
  "user-alpha-001",
  "user-beta-002",
  "user-gamma-003",
  "user-delta-004",
  "user-epsilon-005",
  "user-zeta-006",
  "user-eta-007",
  "user-theta-008",
  "user-iota-009",
  "user-kappa-010",
  "user-lambda-011",
  "user-mu-012",
  "user-nu-013",
  "user-xi-014",
  "user-omicron-015",
  "user-pi-016",
  "user-rho-017",
  "user-sigma-018",
  "user-tau-019",
  "user-upsilon-020",
  "user-phi-021",
  "user-chi-022",
  "user-psi-023",
  "user-omega-024",
  "user-alpha-025",
];

export const marketplaceSeederData: MarketplaceItem[] = [
  {
    id: "item-101",
    title: "Hand-Carved Somali Artifact",
    description:
      "A beautiful, authentic hand-carved piece of Somali history made from premium ebony wood. This artifact represents traditional Somali craftsmanship passed down through generations. Each detail is meticulously carved by hand, depicting ancient Somali cultural symbols and patterns. The piece has been treated with natural oils to preserve its luster and protect against damage. It measures approximately 12 inches in height and comes with a certificate of authenticity. This unique piece would make a perfect addition to any art collection or cultural display, serving as a conversation piece and a testament to Somali artistic heritage.",
    price: 120,
    mainCategory: "Marketplace",
    category: ["Antiques & Art"],
    region: "awdal",
    city: "boorama",
    images: [
      "",
      "",
      "",
    ],
    isPaid: true,
    userId: USERS[0],
    isBasic30: false,
    isStandard60: false,
    isPremium90: true,
    maGaday: false,
  },
  {
    id: "item-102",
    title: "Pro Gaming Monitor 4K",
    description:
      "Ultra-fast 1ms response time monitor perfect for professional gamers and content creators. This 27-inch 4K UHD display features a 144Hz refresh rate, NVIDIA G-Sync compatibility, and HDR10 support for stunning visual clarity. The monitor includes multiple input ports including HDMI 2.1, DisplayPort 1.4, and USB-C connectivity. The ergonomic stand allows for height, tilt, and swivel adjustments. Built-in blue light reduction technology protects your eyes during extended gaming sessions. Whether you're competing in esports or enjoying the latest AAA titles, this monitor delivers the performance and image quality you demand.",
    price: 450,
    mainCategory: "Marketplace",
    category: ["Electronics"],
    region: "hamar",
    city: "hodan",
    images: [
      "",
      "",
    ],
    isPaid: true,
    userId: USERS[1],
    isBasic30: false,
    isStandard60: true,
    isPremium90: false,
    maGaday: false,
  },
  {
    id: "item-103",
    title: "Organic Livestock Feed",
    description:
      "High-protein organic feed suitable for camels, goats, sheep, and cattle. This premium feed blend contains natural grains, minerals, and vitamins essential for healthy animal growth and milk production. The formula is 100% organic with no artificial additives or preservatives. Each 50kg bag provides balanced nutrition that improves digestion, boosts immunity, and increases weight gain. Farmers have reported up to 30% increase in milk yield after switching to this feed. Suitable for both small-scale and commercial farming operations. Store in a cool, dry place for maximum freshness.",
    price: 35,
    mainCategory: "Marketplace",
    category: ["Animal & Supplies"],
    region: "mudug",
    city: "galkacyo",
    images: [
      "",
      "",
    ],
    isPaid: true,
    userId: USERS[2],
    isBasic30: true,
    isStandard60: false,
    isPremium90: false,
    maGaday: false,
  },
  {
    id: "item-104",
    title: "Mountain Hiking Gear",
    description:
      "Complete professional hiking gear set for outdoor enthusiasts and adventurers. This comprehensive kit includes a 65-liter backpack with rain cover, 4-season sleeping bag rated to -10°C, lightweight tent for 2 persons, portable camping stove with fuel canister, and a complete first aid kit. All equipment is made from durable, waterproof materials designed to withstand harsh mountain conditions. The backpack features ergonomic shoulder straps and multiple compartments for organized packing. Perfect for multi-day treks, mountain expeditions, or camping trips. Gear up for your next adventure with this all-in-one solution.",
    price: 180,
    mainCategory: "Marketplace",
    category: ["Sports & Outdoors"],
    region: "sanaag",
    city: "ceerigaabo",
    images: [
      "",
      "",
    ],
    isPaid: true,
    userId: USERS[3],
    isBasic30: false,
    isStandard60: true,
    isPremium90: false,
    maGaday: false,
  },
  {
    id: "item-105",
    title: "Luxury Dining Set",
    description:
      "Solid wood dining table with 6 velvet upholstered chairs, perfect for elegant dining experiences. The table is crafted from premium mahogany wood with a rich walnut finish, measuring 180cm x 90cm. Each chair features high-density foam cushioning covered in soft velvet fabric available in charcoal gray color. The set includes a matching sideboard for additional storage. The table extends to accommodate up to 10 guests with included leaf extensions. The chairs feature gold-finished metal legs and ergonomic backrests for maximum comfort. This dining set transforms any dining room into a sophisticated entertaining space that will impress your guests.",
    price: 850,
    mainCategory: "Marketplace",
    category: ["Furniture"],
    region: "wqdl",
    city: "hargeysa",
    images: [""],
    isPaid: true,
    userId: USERS[4],
    isBasic30: false,
    isStandard60: false,
    isPremium90: true,
    maGaday: false,
  },
  {
    id: "item-106",
    title: "Designer Handbag",
    description:
      "Limited edition genuine leather handbag with gold-plated accents and premium craftsmanship. This elegant accessory features a spacious main compartment with zip closure, interior organizer pockets, and an adjustable shoulder strap. The bag is crafted from full-grain Italian leather that develops a beautiful patina over time. The gold-plated hardware includes a secure turn-lock closure and protective feet on the base. Available in classic black with red interior lining. Includes a dust bag and authenticity card. Perfect for professional settings, evening events, or everyday luxury. An investment piece that elevates any outfit from ordinary to extraordinary.",
    price: 150,
    mainCategory: "Marketplace",
    category: ["Fashion"],
    region: "bari",
    city: "bosaso",
    images: [
      "",
      "",
    ],
    isPaid: true,
    userId: USERS[5],
    isBasic30: true,
    isStandard60: false,
    isPremium90: false,
    maGaday: false,
  },
  {
    id: "item-107",
    title: "Vintage Wall Clock",
    description:
      "Victorian style brass wall clock fully functional with mechanical movement. This antique-inspired timepiece features intricate engravings on the brass casing, Roman numeral dial, and visible pendulum mechanism. The clock measures 14 inches in diameter and requires winding once per week. The chime mechanism strikes on the hour with a pleasant melodic tone. The glass face is scratch-resistant and easily cleaned. The clock has been professionally restored and serviced, keeping accurate time. Mounting hardware included. This timeless piece adds character and elegance to any wall, whether in a living room, office, or hallway.",
    price: 90,
    mainCategory: "Marketplace",
    category: ["Antiques & Art"],
    region: "nugaal",
    city: "Garoowe",
    images: [
      "",
      "",
    ],
    isPaid: true,
    userId: USERS[6],
    isBasic30: false,
    isStandard60: true,
    isPremium90: false,
    maGaday: false,
  },
  {
    id: "item-108",
    title: "Smart Home Speaker",
    description:
      "Voice-controlled smart speaker with AI integration and premium sound quality. This speaker features a powerful 50W audio system with deep bass and clear highs, perfect for music streaming or home automation. Built-in voice assistant responds to commands for playing music, setting reminders, controlling smart home devices, answering questions, and more. The speaker supports Wi-Fi and Bluetooth connectivity, multi-room audio synchronization, and works with major streaming services. The compact design fits any room decor while delivering room-filling sound. Privacy features include a microphone mute button. Upgrade your home entertainment with this intelligent audio companion.",
    price: 210,
    mainCategory: "Marketplace",
    category: ["Electronics"],
    region: "hamar",
    city: "waaberi",
    images: [
      "",
      "",
    ],
    isPaid: true,
    userId: USERS[7],
    isBasic30: false,
    isStandard60: false,
    isPremium90: true,
    maGaday: false,
  },
  {
    id: "item-109",
    title: "Dairy Cow - High Yield",
    description:
      "Healthy dairy cow capable of high daily milk production, vaccinated and dewormed. This Frisian breed cow produces an average of 20-25 liters of milk per day with high butterfat content. She is 4 years old and has calved twice successfully, making her an excellent addition to any dairy operation. The cow is gentle and easy to handle, accustomed to machine milking. She has a current health certificate and all vaccination records are available. The cow eats standard dairy feed and has no health issues. Perfect for small-scale farmers or those looking to start a dairy business. Delivery can be arranged within 200km radius.",
    price: 1100,
    mainCategory: "Marketplace",
    category: ["Animal & Supplies"],
    region: "shabeellaha-hoose",
    city: "afgooye",
    images: [
      "",
      "",
    ],
    isPaid: true,
    userId: USERS[8],
    isBasic30: true,
    isStandard60: false,
    isPremium90: false,
    maGaday: false,
  },
  {
    id: "item-110",
    title: "Professional Football Boots",
    description:
      "Lightweight professional football boots designed for maximum grip and speed on natural grass surfaces. These boots feature a synthetic leather upper for durability and ball control, with strategically placed studs for optimal traction during rapid direction changes. The cushioned insole provides arch support and shock absorption to reduce fatigue during extended play. The boots are available in European sizes 39-46 and come in a striking neon green and black color scheme. Professional players endorse this model for its responsive feel and lightweight construction at just 210 grams per boot. Elevate your game with footwear engineered for performance.",
    price: 85,
    mainCategory: "Marketplace",
    category: ["Sports & Outdoors"],
    region: "jubada-hoose",
    city: "kismaayo",
    images: [
      "",
      "",
    ],
    isPaid: true,
    userId: USERS[9],
    isBasic30: false,
    isStandard60: true,
    isPremium90: false,
    maGaday: false,
  },
];
