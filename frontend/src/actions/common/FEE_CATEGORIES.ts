export interface SubscriptionPlan {
  key: string;
  label: string;
  days: number;
  iconName: string;
  popular: boolean;
  features: string[];
  price?: number;
}
import { LISTING_TYPE } from "@/app/utils/types/fee.types";

export const FEE_CATEGORIES = [
  {
    type: LISTING_TYPE.SERVICE,
    fees: [
      {
        key: "art",
        label: "Alaabta qadiimiga & farshaxanka",
        type: LISTING_TYPE.FREE,
      },
      {
        key: "electronics",
        label: "Telefoon, TV iyo qalab guri",
        type: LISTING_TYPE.SERVICE,
      },
      { key: "animal", label: "Xayawaan iyo agabka", type: LISTING_TYPE.FREE },
      {
        key: "sports",
        label: "Qalabka ciyaaraha & dibadda",
        type: LISTING_TYPE.SERVICE,
      },
      {
        key: "furniture",
        label: "Alaabta guriga & qurxinta",
        type: LISTING_TYPE.SERVICE,
      },
      {
        key: "fashion",
        label: "Dharka, boorsooyinka & waxyaabo kale",
        type: LISTING_TYPE.FREE,
      },
    ],
  },
  {
    title: "Real Estate (hantida maguurtada ah)",
    fees: [
      { key: "rent", label: "Kirada (Rent)", type: LISTING_TYPE.SERVICE },
      { key: "sale", label: "Iib (Sale)", type: LISTING_TYPE.SERVICE },
      { key: "land", label: "Dhul iib ah (Land)", type: LISTING_TYPE.SERVICE },
      { key: "farm", label: "Beer iib ah (Farm)", type: LISTING_TYPE.SERVICE },
      {
        key: "business",
        label: "Ganacsi (Business)",
        type: LISTING_TYPE.SERVICE,
      },
    ],
  },
  {
    title: "Cars (Gawaarida)",
    fees: [
      { key: "carSale", label: "Gawaari iib ah", type: LISTING_TYPE.SERVICE },
      { key: "carRent", label: "Gawaari kireyn", type: LISTING_TYPE.SERVICE },
      { key: "trailer", label: "Rimoor", type: LISTING_TYPE.FREE },
      { key: "carParts", label: "Qaybaha gawaarida", type: LISTING_TYPE.FREE },
      { key: "truck", label: "Baabuur xamuul", type: LISTING_TYPE.SERVICE },
      {
        key: "electricCar",
        label: "Gawaari koronto",
        type: LISTING_TYPE.SERVICE,
      },
    ],
  },
  {
    title: "Motorcycles (Mootooyin)",
    fees: [
      {
        key: "motoSale",
        label: "Beec ah (For Sale)",
        type: LISTING_TYPE.SERVICE,
      },
      {
        key: "motoRent",
        label: "Kiro ah (For Rent)",
        type: LISTING_TYPE.SERVICE,
      },
      {
        key: "motoParts",
        label: "Qaybaha (Spare Parts)",
        type: LISTING_TYPE.FREE,
      },
      { key: "motoOther", label: "Wax kale (Other)", type: LISTING_TYPE.FREE },
    ],
  },
  {
    title: "Boats (Doomo)",
    fees: [
      { key: "boatSale", label: "Doomo iib ah", type: LISTING_TYPE.SERVICE },
      {
        key: "boatRent",
        label: "Doomo kireysi ah",
        type: LISTING_TYPE.SERVICE,
      },
      {
        key: "boatEngine",
        label: "Matoorada doomo iib ah",
        type: LISTING_TYPE.FREE,
      },
      { key: "boatParts", label: "Qaybaha doomo", type: LISTING_TYPE.FREE },
    ],
  },
  {
    title: "Traktor (Cagaf Cagaf)",
    fees: [
      {
        key: "tractorSale",
        label: "Cagaf cagaf beec ah",
        type: LISTING_TYPE.SERVICE,
      },
      { key: "agriTool", label: "Qalabka beeraha", type: LISTING_TYPE.FREE },
      {
        key: "fertilizer",
        label: "Faafiyaha bacriminta",
        type: LISTING_TYPE.FREE,
      },
      {
        key: "harvester",
        label: "Makiinada goosashada",
        type: LISTING_TYPE.SERVICE,
      },
    ],
  },
  {
    title: "Jobs (Shaqo)",
    fees: [
      {
        key: "fullTime",
        label: "Shaqo Waqti Buuxa (Full-Time)",
        type: LISTING_TYPE.SERVICE,
      },
      {
        key: "partTime",
        label: "Shaqo Waqti Gaaban (Part-Time)",
        type: LISTING_TYPE.SERVICE,
      },
      {
        key: "freelance",
        label: "Shaqo Xor ah (Freelance)",
        type: LISTING_TYPE.FREE,
      },
    ],
  },
  {
    title: "System & Tax Settings",
    fees: [
      {
        key: "taxRate",
        label: "VAT / Tax Rate (%)",
        type: LISTING_TYPE.SERVICE,
      },
      { key: "waafi", label: "WAAFI Server ($)", type: LISTING_TYPE.SERVICE },
    ],
  },
  {
    title: "Subscriptions (Is-diiwaangelin)",
    fees: [
      {
        key: "basic30",
        label: "30-Day Basic",
        type: LISTING_TYPE.SERVICE,
      },
      {
        key: "standard60",
        label: "60-Day Standard",
        type: LISTING_TYPE.SERVICE,
      },
      {
        key: "premium90",
        label: "90-Day Premium",
        type: LISTING_TYPE.SERVICE,
      },
    ],
  },
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    key: "basic30",
    label: "Basic",
    days: 30,
    iconName: "zap",
    popular: false,
    features: [
      "30 Maalmood",
      "Raadinta aasaasiga ah",
      "10 Sawir",
      "Taageero email",
    ],
  },
  {
    key: "standard60",
    label: "Standard",
    days: 60,
    iconName: "rocket",
    popular: true,
    features: [
      "60 Maalmood",
      "Social Media Boost",
      "Raadinta sare",
      "Sawirro & Muuqaal",
      "Taageero chat",
    ],
  },
  {
    key: "premium90",
    label: "Premium",
    days: 90,
    iconName: "crown",
    popular: false,
    features: [
      "90 Maalmood",
      "Safka hore (Top)",
      "Premium Badge",
      "Sawirro aan xadidnayn",
      "Taageero 24/7 ah",
    ],
  },
];
