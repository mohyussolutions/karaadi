export interface BoatItem {
  id: string;
  userId: string;
  title: string;
  mainCategory: "Boats";
  category: string[];
  subcategory: string[];
  region: string;
  city: string;
  description: string;
  price: number;
  images: string[];
  type: string;
  boatModel: string;
  transmission: string;
  color: string;
  maGaday: boolean;
  isPaid: boolean;
  isBasic30: boolean;
  isStandard60: boolean;
  isPremium90: boolean;
  expiryDate: Date | string | null;
  feeId: string | null;
  feeAmount: number;
  planId: string | null;
  planAmount: number;
}

const USER_A = "64d4a43c9a8b0e6e8c4a5678";
const USER_B = "64d4a43c9a8b0e6e8c4a5679";

export const boatItems = [
  {
    id: "boat_001",
    userId: USER_A,
    title: "Commercial Fishing Dhow",
    mainCategory: "Boats" as const,
    category: ["Boats for Sale"],
    subcategory: ["Doon kalluumaysi", "Doomo iib ah"],
    region: "Hamar",
    city: "Xamar Jajab",
    description:
      "A heavy-duty wooden dhow designed for deep-sea commercial fishing. This vessel spans 15 meters in length and can carry up to 5 tons of catch. Includes net hauling equipment, GPS navigation system, and fish storage compartments. Built with traditional Somali craftsmanship combined with modern durability standards. Perfect for professional fishermen looking to expand their fleet. The hull has been treated with marine-grade sealant and includes a 200HP diesel engine. Comes with a 6-month warranty on all mechanical parts.",
    price: 12000,
    images: [""],
    type: "Dhow",
    boatModel: "Traditional-2024",
    transmission: "Manual",
    color: "Brown",
    maGaday: false,
    isPaid: true,
    isBasic30: false,
    isStandard60: false,
    isPremium90: true,
    expiryDate: new Date("2027-04-03T18:26:40.432Z"),
    feeId: null,
    feeAmount: 25,
    planId: null,
    planAmount: 0,
  },
  {
    id: "boat_002",
    userId: USER_B,
    title: "Modern Fiberglass Boat",
    mainCategory: "Boats" as const,
    category: ["Boats for Sale"],
    subcategory: ["Doon yar", "Doomo iib ah"],
    region: "Jubada Hoose",
    city: "Kismaayo",
    description:
      "Fast and stable fiberglass boat for coastal travel or fishing. Lightweight and easy to maintain at just 450kg. Features a 90HP outboard engine that reaches speeds up to 35 knots. Includes comfortable seating for 6 passengers, storage compartments, and a small cabin for overnight trips. The fiberglass hull is UV-resistant and requires minimal maintenance. Ideal for recreational fishermen or coastal transport services. Comes with a trailer and safety equipment package.",
    price: 8500,
    images: [""],
    type: "Fiberglass",
    boatModel: "CoastMaster",
    transmission: "Outboard",
    color: "White/Blue",
    maGaday: false,
    isPaid: true,
    isBasic30: true,
    isStandard60: false,
    isPremium90: false,
    expiryDate: new Date("2027-04-03T18:26:40.433Z"),
    feeId: null,
    feeAmount: 25,
    planId: null,
    planAmount: 0,
  },
  {
    id: "boat_003",
    userId: USER_B,
    title: "Luxury Leisure Yacht",
    mainCategory: "Boats" as const,
    category: ["Boats for Sale"],
    subcategory: ["Doon raaxo", "Doomo iib ah"],
    region: "Hamar",
    city: "Cabdi Casiis",
    description:
      "Luxury yacht for private events and leisure. Features two spacious bedrooms with en-suite bathrooms, a fully equipped kitchen, and a large sun deck with lounging area. Includes air conditioning throughout, entertainment system with surround sound, and a wet bar. Powered by twin 300HP inboard engines with a cruising speed of 25 knots. The interior is finished with premium leather and hardwood. Perfect for VIP charters, family vacations, or corporate events. Comes with a professional crew option and 1-year comprehensive warranty.",
    price: 75000,
    images: [""],
    type: "Yacht",
    boatModel: "Elite-50",
    transmission: "Inboard",
    color: "White",
    maGaday: false,
    isPaid: true,
    isBasic30: false,
    isStandard60: true,
    isPremium90: false,
    expiryDate: new Date("2027-04-03T18:26:40.433Z"),
    feeId: null,
    feeAmount: 25,
    planId: null,
    planAmount: 0,
  },
  {
    id: "boat_004",
    userId: USER_A,
    title: "Daily Fishing Boat Rental",
    mainCategory: "Boats" as const,
    category: ["Boats for Rent"],
    subcategory: ["Doomo kireysi ah", "Rental"],
    region: "Hamar",
    city: "Dharkeynley",
    description:
      "Professional fishing boat available for daily rental. Great for tourists and fishing enthusiasts. This 8-meter vessel includes all necessary fishing gear including rods, reels, bait, and tackle. Captain and crew included in the daily rate. Safety equipment includes life jackets, first aid kit, VHF radio, and emergency flares. Perfect for group fishing trips up to 8 people. Morning and afternoon trips available with optional lunch package. Clean and well-maintained with a 40HP Yamaha engine.",
    price: 150,
    images: [""],
    type: "Fishing Boat",
    boatModel: "Rental-Pro",
    transmission: "Outboard",
    color: "Blue",
    maGaday: false,
    isPaid: true,
    isBasic30: false,
    isStandard60: false,
    isPremium90: true,
    expiryDate: new Date("2027-04-03T18:26:40.433Z"),
    feeId: null,
    feeAmount: 35,
    planId: null,
    planAmount: 0,
  },
  {
    id: "boat_005",
    userId: USER_A,
    title: "Yamaha 200HP Outboard Engine",
    mainCategory: "Boats" as const,
    category: ["Boat Engines for Sale"],
    subcategory: ["Matoorada doomo iib ah", "Outboard"],
    region: "Hamar",
    city: "Hodan",
    description:
      "Brand new Yamaha V6 outboard engine with 200 horsepower and high fuel efficiency. Features electronic fuel injection for optimal performance, lightweight design at just 220kg, and a 5-year manufacturer warranty. Includes digital gauges, stainless steel propeller, and installation kit. This engine delivers exceptional acceleration and top speed while maintaining low emissions. Perfect for fishing boats, pontoons, or small yachts up to 10 meters. Service intervals every 100 hours with parts readily available. Comes with user manual and tool kit.",
    price: 15000,
    images: [""],
    type: "Engine",
    boatModel: "Yamaha-V6",
    transmission: "N/A",
    color: "Gray",
    maGaday: false,
    isPaid: true,
    isBasic30: true,
    isStandard60: false,
    isPremium90: false,
    expiryDate: new Date("2027-04-03T18:26:40.433Z"),
    feeId: null,
    feeAmount: 20,
    planId: null,
    planAmount: 0,
  },
  {
    id: "boat_006",
    userId: USER_A,
    title: "Stainless Steel Propeller",
    mainCategory: "Boats" as const,
    category: ["Boat Parts"],
    subcategory: ["Qaybaha doomo", "Propeller"],
    region: "Jubada Hoose",
    city: "Kismaayo",
    description:
      "High-grade stainless steel propeller for boat engines. Durable and rust-resistant with precision engineering for optimal water flow. Fits most standard outboard engines with 15-200HP range. Features 4 blades for improved grip and reduced cavitation. Each propeller is balanced and tested before shipping. Increases fuel efficiency by up to 15% compared to aluminum propellers. Includes installation hardware and detailed fitting instructions. Backed by a 2-year warranty against manufacturing defects. Compatible with Yamaha, Mercury, Suzuki, and Honda engines.",
    price: 600,
    images: [""],
    type: "Part",
    boatModel: "Universal-X",
    transmission: "N/A",
    color: "Silver",
    maGaday: false,
    isPaid: true,
    isBasic30: false,
    isStandard60: true,
    isPremium90: false,
    expiryDate: new Date("2027-04-03T18:26:40.433Z"),
    feeId: null,
    feeAmount: 10,
    planId: null,
    planAmount: 0,
  },
];
