export interface BoatItem {
  id: string;
  userId: string;
  title: string;
  mainCategory: "Boats";
  category: string[];
  subcategory: string[];
  region: string;
  city: string;
  so: string;
  description: string;
  price: number;
  images: string[];
  type: string;
  boatModel: string;
  transmission: string;
  color: string;
  maGaday: boolean;
  isPaid: boolean;
  expiryDate: Date | string | null;
  feeId: string | null;
  feeAmount: number;
  planId: string | null;
  planAmount: number;
  status: "active" | "expired" | "pending";
  isExpired: boolean;
}

const USER_A = "64d4a43c9a8b0e6e8c4a5678";
const USER_B = "64d4a43c9a8b0e6e8c4a5679";

export const boatItems = [
  {
    id: "boat_001",
    userId: USER_A,
    title: "Commercial Fishing Dhow",
    mainCategory: "Boats",
    category: ["Boats for Sale"],
    subcategory: ["Doon kalluumaysi", "Doomo iib ah"],
    region: "Hamar",
    city: "Xamar Jajab",
    so: "Doon kalluumaysi oo weyn",
    description:
      "A heavy-duty wooden dhow designed for deep-sea commercial fishing. Includes net hauling equipment.",
    price: 12000,
    images: ["https://images.unsplash.com/photo-1520626639860-f0f34bd63189"],
    type: "Dhow",
    boatModel: "Traditional-2024",
    transmission: "Manual",
    color: "Brown",
    maGaday: false,
    isPaid: true,
    expiryDate: new Date("2026-04-03T18:26:40.432Z"),
    feeId: null,
    feeAmount: 25,
    planId: null,
    planAmount: 0,
  },
  {
    id: "boat_002",
    userId: USER_B,
    title: "Modern Fiberglass Boat",
    mainCategory: "Boats",
    category: ["Boats for Sale"],
    subcategory: ["Doon yar", "Doomo iib ah"],
    region: "Jubada Hoose",
    city: "Kismaayo",
    so: "Doon fiberglass ah oo casri ah",
    description:
      "Fast and stable fiberglass boat for coastal travel or fishing. Lightweight and easy to maintain.",
    price: 8500,
    images: [
      "https://plus.unsplash.com/premium_photo-1668723712079-7665d7a2d524",
    ],
    type: "Fiberglass",
    boatModel: "CoastMaster",
    transmission: "Outboard",
    color: "White/Blue",
    maGaday: false,
    isPaid: true,
    expiryDate: new Date("2026-04-03T18:26:40.433Z"),
    feeId: null,
    feeAmount: 25,
    planId: null,
    planAmount: 0,
  },
  {
    id: "boat_003",
    userId: USER_A,
    title: "Luxury Leisure Yacht",
    mainCategory: "Boats",
    category: ["Boats for Sale"],
    subcategory: ["Doon raaxo", "Doomo iib ah"],
    region: "Hamar",
    city: "Cabdi Casiis",
    so: "Doon raaxo oo heer sare ah",
    description:
      "Luxury yacht for private events and leisure. Features two bedrooms and a sun deck.",
    price: 75000,
    images: ["https://images.unsplash.com/photo-1517217004452-4ff260cb5598"],
    type: "Yacht",
    boatModel: "Elite-50",
    transmission: "Inboard",
    color: "White",
    maGaday: true,
    isPaid: true,
    expiryDate: new Date("2026-04-03T18:26:40.433Z"),
    feeId: null,
    feeAmount: 25,
    planId: null,
    planAmount: 0,
  },
  {
    id: "boat_004",
    userId: USER_B,
    title: "Daily Fishing Boat Rental",
    mainCategory: "Boats",
    category: ["Boats for Rent"],
    subcategory: ["Doomo kireysi ah", "Rental"],
    region: "Hamar",
    city: "Dharkeynley",
    so: "Kiree doon kalluumaysi",
    description:
      "Professional fishing boat available for daily rental. Great for tourists.",
    price: 150,
    images: [
      "https://plus.unsplash.com/premium_photo-1668723712079-7665d7a2d524",
    ],
    type: "Fishing Boat",
    boatModel: "Rental-Pro",
    transmission: "Outboard",
    color: "Blue",
    maGaday: false,
    isPaid: true,
    expiryDate: new Date("2026-04-03T18:26:40.433Z"),
    feeId: null,
    feeAmount: 35,
    planId: null,
    planAmount: 0,
  },
  {
    id: "boat_005",
    userId: USER_B,
    title: "Yamaha 200HP Outboard Engine",
    mainCategory: "Boats",
    category: ["Boat Engines for Sale"],
    subcategory: ["Matoorada doomo iib ah", "Outboard"],
    region: "Hamar",
    city: "Hodan",
    so: "Matoor Yamaha 200HP ah",
    description:
      "Brand new Yamaha V6 outboard engine. 200 horsepower, high fuel efficiency.",
    price: 15000,
    images: ["https://images.unsplash.com/photo-1520626639860-f0f34bd63189"],
    type: "Engine",
    boatModel: "Yamaha-V6",
    transmission: "N/A",
    color: "Gray",
    maGaday: false,
    isPaid: true,
    expiryDate: new Date("2026-04-03T18:26:40.433Z"),
    feeId: null,
    feeAmount: 20,
    planId: null,
    planAmount: 0,
  },
  {
    id: "boat_006",
    userId: USER_A,
    title: "Stainless Steel Propeller",
    mainCategory: "Boats",
    category: ["Boat Parts"],
    subcategory: ["Qaybaha doomo", "Propeller"],
    region: "Jubada Hoose",
    city: "Kismaayo",
    so: "Shaanbaal bir ah (Propeller)",
    description:
      "High-grade stainless steel propeller for boat engines. Durable and rust-resistant.",
    price: 600,
    images: ["https://images.unsplash.com/photo-1528154291023-a6525fabe5b4"],
    type: "Part",
    boatModel: "Universal-X",
    transmission: "N/A",
    color: "Silver",
    maGaday: false,
    isPaid: true,
    expiryDate: new Date("2026-04-03T18:26:40.433Z"),
    feeId: null,
    feeAmount: 10,
    planId: null,
    planAmount: 0,
  },
];
