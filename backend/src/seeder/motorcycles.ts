export interface MotorcycleItem {
  id: string;
  userId: string;
  title: string;
  mainCategory: string;
  category: string[];
  subcategory: string[];
  transmission: string | null;
  price: number;
  region: string;
  city: string;
  images: string[];
  type: string;
  make: string;
  modelName: string;
  year: number;
  mileage: number;
  engineSize: string;
  fuelType: string;
  color: string;
  description: string;
  isPaid: boolean;
  isBasic30: boolean;
  isStandard60: boolean;
  isPremium90: boolean;
  maGaday: boolean;
}

const USER_A = "64d4a43c9a8b0e6e8c4a5678";
const USER_B = "64d4a43c9a8b0e6e8c4a5679";
const USER_C = "64d4a43c9a8b0e6e8c4a5680";

export const motorcycleItems: MotorcycleItem[] = [
  {
    id: "m1",
    userId: USER_A,
    title: "Yamaha YZF-R1 High Performance Bike",
    mainCategory: "Motorcycle",
    category: ["For Sale"],
    subcategory: ["New Motorcycle"],
    transmission: "Manual",
    price: 15500,
    region: "hamar",
    city: "hamar",
    images: [
      "",
    ],
    type: "Motorcycle",
    make: "Yamaha",
    modelName: "YZF-R1",
    year: 2024,
    mileage: 0,
    engineSize: "1000cc",
    fuelType: "Petrol",
    color: "Red",
    description:
      "High performance sports bike in brand new condition with zero mileage. The Yamaha YZF-R1 features a powerful 1000cc crossplane engine producing over 200 horsepower. This machine includes advanced electronics such as traction control, wheelie control, and multiple riding modes. The lightweight aluminum frame provides exceptional handling and cornering ability. LED lighting, full-color TFT display, and Brembo brakes complete this superbike package. Perfect for experienced riders seeking the ultimate in performance and adrenaline. Full factory warranty included with purchase.",
    isPaid: true,
    isBasic30: false,
    isStandard60: true,
    isPremium90: false,
    maGaday: false,
  },
  {
    id: "m2",
    userId: USER_B,
    title: "Honda CRF 250L Dual Sport",
    mainCategory: "Motorcycle",
    category: ["For Sale"],
    subcategory: ["Used Motorcycle"],
    transmission: "Manual",
    price: 4500,
    region: "gedo",
    city: "garbaharey",
    images: [
      "",
    ],
    type: "Motorcycle",
    make: "Honda",
    modelName: "CRF 250L",
    year: 2019,
    mileage: 8000,
    engineSize: "250cc",
    fuelType: "Petrol",
    color: "White/Red",
    description:
      "Reliable dual-sport bike that excels on both paved roads and challenging terrain. The Honda CRF 250L features a fuel-injected 250cc engine that delivers smooth power and excellent fuel economy. This well-maintained motorcycle has 8,000 miles and includes upgraded hand guards and skid plate. The long-travel suspension provides comfort over rough surfaces while maintaining stability at highway speeds. Perfect for commuting, trail riding, or adventure touring. Recent service includes oil change, air filter, and chain adjustment. A versatile machine for riders who want one bike for all purposes.",
    isPaid: true,
    isBasic30: true,
    isStandard60: false,
    isPremium90: false,
    maGaday: false,
  },
  {
    id: "m3",
    userId: USER_C,
    title: "Piaggio Vespa Scooter",
    mainCategory: "Motorcycle",
    category: ["For Sale"],
    subcategory: ["Used Vespa"],
    transmission: "Automatic",
    price: 3200,
    region: "hamar",
    city: "hamar",
    images: [
      "",
    ],
    type: "Scooter",
    make: "Piaggio",
    modelName: "Vespa Primavera 150",
    year: 2023,
    mileage: 500,
    engineSize: "150cc",
    fuelType: "Petrol",
    color: "Light Blue",
    description:
      "Classic Italian scooter with minimal use, ideal for city commuting and urban style. The Vespa Primavera 150 features a fuel-efficient 150cc engine, automatic transmission, and iconic retro design that turns heads everywhere. With only 500 miles, this scooter is practically new and has been garage-kept. Includes front disc brake, LED lighting, and a comfortable seat for rider and passenger. The under-seat storage fits a helmet and daily essentials. Perfect for navigating busy city streets, running errands, or weekend cruising along the coast. A stylish and practical transportation solution.",
    isPaid: true,
    isBasic30: false,
    isStandard60: false,
    isPremium90: true,
    maGaday: false,
  },
  {
    id: "m4",
    userId: USER_A,
    title: "Bajaj RE Passenger Tuk Tuk",
    mainCategory: "Motorcycle",
    category: ["For Rent"],
    subcategory: ["Bajaj for Rent"],
    transmission: "Manual",
    price: 25,
    region: "hamar",
    city: "hamar",
    images: [
      "",
    ],
    type: "Tuk Tuk",
    make: "Bajaj",
    modelName: "RE Compact",
    year: 2020,
    mileage: 30000,
    engineSize: "200cc",
    fuelType: "Petrol/Gas",
    color: "Yellow",
    description:
      "Reliable Tuk Tuk for passenger transport, available for daily rental at competitive rates. This Bajaj RE Compact can carry up to 4 passengers plus driver comfortably. The vehicle is well-maintained with regular service checks and features a durable 200cc engine that provides adequate power for city driving. Includes comfortable seating, roof cover for sun and rain protection, and storage space for luggage. Perfect for taxi service, tourist transport, or delivery business. Rental includes basic insurance and 24/7 roadside assistance. Weekly and monthly rental discounts available for long-term arrangements.",
    isPaid: true,
    isBasic30: true,
    isStandard60: false,
    isPremium90: false,
    maGaday: false,
  },
  {
    id: "m5",
    userId: USER_B,
    title: "Motorcycle Rental Touring Bike",
    mainCategory: "Motorcycle",
    category: ["For Rent"],
    subcategory: ["Motorcycle Rental"],
    transmission: "Manual",
    price: 35,
    region: "awdal",
    city: "boorame",
    images: [],
    type: "Touring Bike",
    make: "Kawasaki",
    modelName: "Versys 650",
    year: 2018,
    mileage: 45000,
    engineSize: "650cc",
    fuelType: "Petrol",
    color: "Grey",
    description:
      "Adventure touring bike available for rental, perfect for long-distance journeys and exploring new routes. The Kawasaki Versys 650 features a responsive 650cc parallel-twin engine, comfortable upright riding position, and adjustable windshield for wind protection. This well-maintained motorcycle has been regularly serviced and includes hard saddlebags for storage. The bike handles confidently on both paved highways and gravel roads. Ideal for weekend getaways, cross-country tours, or daily commuting. Rental includes helmet, basic tool kit, and unlimited mileage. Daily, weekly, and monthly rates available with security deposit required.",
    isPaid: true,
    isBasic30: false,
    isStandard60: true,
    isPremium90: false,
    maGaday: false,
  },
  {
    id: "m6",
    userId: USER_C,
    title: "Cargo Bajaj Rental",
    mainCategory: "Motorcycle",
    category: ["For Rent"],
    subcategory: ["Cargo Bajaj Rental"],
    transmission: "Manual",
    price: 30,
    region: "hamar",
    city: "hamar",
    images: [
      "",
    ],
    type: "Cargo Tuk Tuk",
    make: "Bajaj",
    modelName: "Maxima C",
    year: 2021,
    mileage: 20000,
    engineSize: "400cc",
    fuelType: "Diesel",
    color: "Green",
    description:
      "Heavy-duty cargo Tuk Tuk for transporting goods, available for daily or weekly rental. The Bajaj Maxima C features a powerful 400cc diesel engine, large cargo bed capable of carrying up to 500kg, and durable construction for commercial use. This vehicle has been well-maintained and is perfect for moving furniture, delivering supplies, or operating a small delivery business. The cargo area measures 6 feet by 4 feet with tie-down points for securing loads. Includes canopy cover to protect goods from weather. Ideal for small business owners, market vendors, or logistics operations. Long-term rental discounts available for business partners.",
    isPaid: true,
    isBasic30: false,
    isStandard60: false,
    isPremium90: true,
    maGaday: false,
  },
  {
    id: "m7",
    userId: USER_A,
    title: "Used Honda 125cc Engine",
    mainCategory: "Motorcycle",
    category: ["Spare Parts"],
    subcategory: ["Motorcycle Engines"],
    transmission: "Manual",
    price: 350,
    region: "hamar",
    city: "hamar",
    images: [],
    type: "Engine",
    make: "Honda",
    modelName: "CG 125",
    year: 2010,
    mileage: 0,
    engineSize: "125cc",
    fuelType: "Petrol",
    color: "Silver",
    description:
      "Reliable used engine for standard 125cc motorcycles, tested and in working condition. This Honda CG 125 engine has been removed from a donor bike and inspected by mechanics. The engine runs smoothly with no unusual noises or oil leaks. Includes carburetor, ignition coil, and wiring harness. Compression is within factory specifications. Perfect replacement engine for bikes with failed motors or for custom projects. Sold as-is with 30-day warranty against major mechanical failure. Professional installation recommended. An affordable solution to get your motorcycle back on the road.",
    isPaid: true,
    isBasic30: true,
    isStandard60: false,
    isPremium90: false,
    maGaday: false,
  },
  {
    id: "m12",
    userId: USER_B,
    title: "Bajaj RE 200cc Engine",
    mainCategory: "Motorcycle",
    category: ["Spare Parts"],
    subcategory: ["Bajaj Engines"],
    transmission: null,
    price: 450,
    region: "hamar",
    city: "hamar",
    images: [],
    type: "Engine",
    make: "Bajaj",
    modelName: "RE 200cc",
    year: 2018,
    mileage: 0,
    engineSize: "200cc",
    fuelType: "Petrol",
    color: "N/A",
    description:
      "Fully working Bajaj engine removed from a scrapped model, tested and ready for installation. This 200cc powerplant is compatible with various Bajaj RE models and similar three-wheelers. The engine has been inspected and shows normal wear for its age with no major issues. Includes starter motor, alternator, and intake manifold. Compression is good and the engine turns over smoothly. Perfect replacement for failed engines or for rebuilding a project vehicle. Sold with 60-day warranty. Professional installation recommended for optimal results. An economical way to restore your Bajaj vehicle to working condition.",
    isPaid: true,
    isBasic30: false,
    isStandard60: true,
    isPremium90: false,
    maGaday: false,
  },
];
