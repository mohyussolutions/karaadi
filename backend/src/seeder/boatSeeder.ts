export interface BoatItem {
  title: string;
  so: string;
  description: string;
  price: number;
  mainCategory: "Boats";
  category: string[];
  subcategory: string[];
  region: string;
  city: string;
  district: string;
  subDistrict: string | null;
  images: string[];
  type: string;
  boatModel: string;
  transmission: string;
  color: string;
  listingType: string;
  userId: string;
  maGaday: boolean;
  isPaid: boolean;
}

const USER_A = "user_74x01";
const USER_B = "user_89y02";
const USER_C = "user_56z03";

export const boatItems: BoatItem[] = [
  // Boats for Sale - Fishing Boats (Doon kalluumaysi)
  {
    title: "Reliable Commercial Fishing Boat",
    so: "Doon kalluumaysi ganacsi",
    description:
      "A reliable fishing boat for commercial fishing. Well-maintained and ready for the season.",
    price: 5000,
    mainCategory: "Boats",
    category: ["Boats for Sale"],
    subcategory: ["Doon kalluumaysi"], // Somali name from BoatsForSaleNestedSub
    region: "Banaadir",
    city: "Mogadishu",
    district: "Hamar Jajab",
    subDistrict: null,
    images: [
      "https://images.unsplash.com/photo-1520626639860-f0f34bd63189?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGJvYXR8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9hdHxlbnwwfHwwfHx8MA%3D%3D0",
      "https://plus.unsplash.com/premium_photo-1668723712079-7665d7a2d524?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym9hdHxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1517217004452-4ff260cb5598?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJvYXR8ZW58MHx8MHx8fDA%3D",
    ],
    type: "Dhow",
    boatModel: "Model A",
    transmission: "Manual",
    color: "Blue",
    listingType: "For Sale",
    userId: USER_A,
    maGaday: false,
    isPaid: true,
  },
  {
    title: "Well-Maintained Fishing Boat B",
    so: "Doon kalluumaysi oo casri ah",
    description:
      "Well-maintained fiberglass fishing boat with modern GPS and radio equipment.",
    price: 7500,
    mainCategory: "Boats",
    category: ["Boats for Sale"],
    subcategory: ["Doon kalluumaysi"], // Somali name from BoatsForSaleNestedSub
    region: "Lower Juba",
    city: "Kismayo",
    district: "Calanley",
    subDistrict: null,
    images: [
      "https://plus.unsplash.com/premium_photo-1668723712079-7665d7a2d524?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym9hdHxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1520626639860-f0f34bd63189?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGJvYXR8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1517217004452-4ff260cb5598?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJvYXR8ZW58MHx8MHx8fDA%3D",
    ],
    type: "Fiberglass",
    boatModel: "Model B",
    transmission: "Outboard",
    color: "Green",
    listingType: "For Sale",
    userId: USER_B,
    maGaday: false,
    isPaid: true,
  },
  // Boats for Sale - Leisure Yacht (Doon raaxo)
  {
    title: "Luxury Yacht C",
    so: "Doon raaxo weyn",
    description:
      "Luxury yacht for leisure and entertainment. Two cabins, full kitchen, ready for long cruises.",
    price: 50000,
    mainCategory: "Boats",
    category: ["Boats for Sale"],
    subcategory: ["Doon raaxo"], // Somali name from BoatsForSaleNestedSub
    region: "Banaadir",
    city: "Mogadishu",
    district: "Waberi",
    subDistrict: null,
    images: [
      "https://plus.unsplash.com/premium_photo-1668723712079-7665d7a2d524?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym9hdHxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1520626639860-f0f34bd63189?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGJvYXR8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1517217004452-4ff260cb5598?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJvYXR8ZW58MHx8MHx8fDA%3D",
    ],
    type: "Leisure Yacht",
    boatModel: "Model C",
    transmission: "Inboard",
    color: "White",
    listingType: "For Sale",
    userId: USER_A,
    maGaday: true,
    isPaid: true,
  },
  // Boats for Sale - Speedboat (Doon yar oo xawaare leh)
  {
    title: "High-Performance Speedboat X1",
    so: "Doon xawaare sare leh",
    description:
      "High-performance speedboat for water sports. Excellent condition and low engine hours.",
    price: 25000,
    mainCategory: "Boats",
    category: ["Boats for Sale"],
    subcategory: ["Doon yar oo xawaare leh"], // Somali name from BoatsForSaleNestedSub
    region: "Galguduud",
    city: "Dhusamareb",
    district: "Dhusamareb",
    subDistrict: null,
    images: [
      "https://images.unsplash.com/photo-1520626639860-f0f34bd63189?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGJvYXR8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9hdHxlbnwwfHwwfHx8MA%3D%3D0",
    ],
    type: "Speedboat",
    boatModel: "X1",
    transmission: "Jet",
    color: "Red",
    listingType: "For Sale",
    userId: USER_B,
    maGaday: false,
    isPaid: true,
  },
  // Boats for Rent - Fishing Boat Rental (Kiree Doon kalluumaysi)
  {
    title: "Premium Daily Fishing Boat Rental",
    so: "Kiree doon kalluumaysi maalinle ah",
    description:
      "Daily rental fishing boat with full equipment including rods, reels, and tackle.",
    price: 200,
    mainCategory: "Boats",
    category: ["Boats for Rent"],
    subcategory: ["Kiree Doon kalluumaysi"], // Somali name from BoatsForRentNestedSub
    region: "Banaadir",
    city: "Mogadishu",
    district: "Dharkenley",
    subDistrict: null,
    images: [
      "https://plus.unsplash.com/premium_photo-1668723712079-7665d7a2d524?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym9hdHxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1520626639860-f0f34bd63189?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGJvYXR8ZW58MHx8MHx8fDA%3D",
    ],
    type: "Fishing Boat",
    boatModel: "Rental Pro",
    transmission: "Outboard",
    color: "Blue",
    listingType: "For Rent",
    userId: USER_A,
    maGaday: false,
    isPaid: true,
  },
  // Boats for Rent - Yacht Charter (Kiree Doon raaxo)
  {
    title: "Elite Weekly Luxury Yacht Charter",
    so: "Kiree doon raaxo toddobaadle ah",
    description:
      "Weekly yacht charter with professional crew and full luxury amenities for up to 8 guests.",
    price: 5000,
    mainCategory: "Boats",
    category: ["Boats for Rent"],
    subcategory: ["Kiree Doon raaxo"], // Somali name from BoatsForRentNestedSub
    region: "Awdal",
    city: "Boorame",
    district: "Dila",
    subDistrict: null,
    images: [
      "https://images.unsplash.com/photo-1517217004452-4ff260cb5598?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJvYXR8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9hdHxlbnwwfHwwfHx8MA%3D%3D0",
    ],
    type: "Leisure Yacht",
    boatModel: "Charter Elite",
    transmission: "Inboard",
    color: "White",
    listingType: "For Rent",
    userId: USER_B,
    maGaday: false,
    isPaid: true,
  },
  // Boat Engines for Sale - Outboard Engine (Matoor dibadda ah (Outboard))
  {
    title: "New Yamaha Outboard Engine 150HP",
    so: "Matoor dibadda ah (Outboard) 150HP",
    description:
      "Brand new Yamaha 4-stroke outboard engine 150 horsepower. Still in original packaging.",
    price: 8000,
    mainCategory: "Boats",
    category: ["Boat Engines for Sale"],
    subcategory: ["Matoor dibadda ah (Outboard)"], // Somali name from BoatEnginesForSaleNestedSub
    region: "Banaadir",
    city: "Mogadishu",
    district: "Hodan",
    subDistrict: null,
    images: [
      "https://images.unsplash.com/photo-1520626639860-f0f34bd63189?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGJvYXR8ZW58MHx8MHx8fDA%3D",
      "https://plus.unsplash.com/premium_photo-1668723712079-7665d7a2d524?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym9hdHxlbnwwfHwwfHx8MA%3D%3D",
    ],
    type: "Engine",
    boatModel: "Yamaha 150",
    transmission: "Outboard",
    color: "Gray",
    listingType: "For Sale",
    userId: USER_C,
    maGaday: false,
    isPaid: true,
  },
  // Boat Engines for Sale - Inboard Engine (Matoor gudaha ah (Inboard))
  {
    title: "Powerful Mercury Inboard Engine 250HP",
    so: "Matoor gudaha ah (Inboard) 250HP",
    description:
      "Powerful Mercury V8 inboard engine for large cabin cruisers. Low running hours.",
    price: 12000,
    mainCategory: "Boats",
    category: ["Boat Engines for Sale"],
    subcategory: ["Matoor gudaha ah (Inboard)"], // Somali name from BoatEnginesForSaleNestedSub
    region: "Lower Shabelle",
    city: "Marka",
    district: "Marka",
    subDistrict: null,
    images: [
      "https://images.unsplash.com/photo-1517217004452-4ff260cb5598?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJvYXR8ZW58MHx8MHx8fDA%3D",
    ],
    type: "Engine",
    boatModel: "Mercury 250",
    transmission: "Inboard",
    color: "Black",
    listingType: "For Sale",
    userId: USER_C,
    maGaday: false,
    isPaid: true,
  },
  // Boat Parts - Engine Parts (Qaybaha Mashiinka)
  {
    title: "Stainless Steel Boat Propeller Set",
    so: "Shaanbaal bir ah oo doonta",
    description:
      "Stainless steel propeller set for various boat models. Increases speed and efficiency.",
    price: 500,
    mainCategory: "Boats",
    category: ["Boat Parts"],
    subcategory: ["Qaybaha Mashiinka"], // Somali name from BoatPartsNestedSub
    region: "Banaadir",
    city: "Mogadishu",
    district: "Hamar Weyne",
    subDistrict: null,
    images: [
      "https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9hdHxlbnwwfHwwfHx8MA%3D%3D0",
    ],
    type: "Engine Part",
    boatModel: "Universal",
    transmission: "N/A",
    color: "Silver",
    listingType: "For Sale",
    userId: USER_C,
    maGaday: false,
    isPaid: true,
  },
  // Boat Parts - Safety Gear (Qalabka Badbaadada)
  {
    title: "Complete Marine Safety Kit",
    so: "Qalabka Badbaadada Badda oo Dhamaystiran",
    description:
      "Complete marine safety gear kit including four life jackets, signal flares, and a waterproof first aid box.",
    price: 300,
    mainCategory: "Boats",
    category: ["Boat Parts"],
    subcategory: ["Qalabka Badbaadada"], // Somali name from BoatPartsNestedSub
    region: "Gedo",
    city: "Doolow",
    district: "Bulo Lakow",
    subDistrict: null,
    images: [
      "https://plus.unsplash.com/premium_photo-1668723712079-7665d7a2d524?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym9hdHxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1520626639860-f0f34bd63189?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGJvYXR8ZW58MHx8MHx8fDA%3D",
    ],
    type: "Safety Gear",
    boatModel: "N/A",
    transmission: "N/A",
    color: "Orange",
    listingType: "For Sale",
    userId: USER_A,
    maGaday: false,
    isPaid: true,
  },
  // Boat Engines for Sale - Used Engine (Matoor la isticmaalay)
  {
    title: "Used 60HP Outboard Engine",
    so: "Matoor dibadda ah oo la isticmaalay 60HP",
    description:
      "Reliable used 60 horsepower outboard. Recently tuned, great for medium-sized fishing boats.",
    price: 3500,
    mainCategory: "Boats",
    category: ["Boat Engines for Sale"],
    subcategory: ["Matoor la isticmaalay"], // Somali name from BoatEnginesForSaleNestedSub
    region: "Banaadir",
    city: "Mogadishu",
    district: "Waberi",
    subDistrict: null,
    images: [
      "https://images.unsplash.com/photo-1517217004452-4ff260cb5598?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJvYXR8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1520626639860-f0f34bd63189?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGJvYXR8ZW58MHx8MHx8fDA%3D",
    ],
    type: "Engine",
    boatModel: "Honda 60",
    transmission: "Outboard",
    color: "Silver",
    listingType: "For Sale",
    userId: USER_B,
    maGaday: true,
    isPaid: true,
  },
  // Boat Parts - Navigation Equipment (Qalabka Navigashanka)
  {
    title: "Marine GPS Unit",
    so: "Qalabka GPS-ka Badda",
    description:
      "Garmin marine GPS unit with color screen and pre-loaded coastal maps. Brand new.",
    price: 650,
    mainCategory: "Boats",
    category: ["Boat Parts"],
    subcategory: ["Qalabka Navigashanka"], // Somali name from BoatPartsNestedSub
    region: "Lower Juba",
    city: "Kismayo",
    district: "Calanley",
    subDistrict: null,
    images: [
      "https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9hdHxlbnwwfHwwfHx8MA%3D%3D0",
      "https://plus.unsplash.com/premium_photo-1668723712079-7665d7a2d524?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym9hdHxlbnwwfHwwfHx8MA%3D%3D",
    ],
    type: "Accessory",
    boatModel: "Garmin 78S",
    transmission: "N/A",
    color: "Black",
    listingType: "For Sale",
    userId: USER_C,
    maGaday: false,
    isPaid: true,
  },
  // Additional Sailboat example for Boats for Sale (Doon shiraac)
  {
    title: "Traditional Somali Sailboat",
    so: "Doon shiraac Soomaali ah",
    description:
      "Traditional Somali sailboat made from local wood, perfect for coastal sailing.",
    price: 3000,
    mainCategory: "Boats",
    category: ["Boats for Sale"],
    subcategory: ["Doon shiraac"], // Somali name from BoatsForSaleNestedSub
    region: "Somaliland",
    city: "Berbera",
    district: "Berbera Port",
    subDistrict: null,
    images: [
      "https://images.unsplash.com/photo-1517217004452-4ff260cb5598?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJvYXR8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1520626639860-f0f34bd63189?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGJvYXR8ZW58MHx8MHx8fDA%3D",
    ],
    type: "Sailboat",
    boatModel: "Traditional",
    transmission: "Wind",
    color: "Brown",
    listingType: "For Sale",
    userId: USER_A,
    maGaday: false,
    isPaid: false,
  },
];
