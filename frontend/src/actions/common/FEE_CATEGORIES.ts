import { LISTING_TYPES } from "@/app/utils/types/fee.types";

export const FEE_CATEGORIES = [
  {
    title: "Marketplace (Suuq)",
    fees: [
      {
        key: "art",
        label: "Alaabta qadiimiga & farshaxanka",
        type: LISTING_TYPES.FREE,
      },
      {
        key: "electronics",
        label: "Telefoon, TV iyo qalab guri",
        type: LISTING_TYPES.FEE,
      },
      { key: "animal", label: "Xayawaan iyo agabka", type: LISTING_TYPES.FREE },
      {
        key: "sports",
        label: "Qalabka ciyaaraha & dibadda",
        type: LISTING_TYPES.FEE,
      },
      {
        key: "furniture",
        label: "Alaabta guriga & qurxinta",
        type: LISTING_TYPES.FEE,
      },
      {
        key: "fashion",
        label: "Dharka, boorsooyinka & waxyaabo kale",
        type: LISTING_TYPES.FREE,
      },
    ],
  },
  {
    title: "Real Estate (Hantida Ma-guurtada)",
    fees: [
      { key: "rent", label: "Kirada (Rent)", type: LISTING_TYPES.FEE },
      { key: "sale", label: "Iib (Sale)", type: LISTING_TYPES.FEE },
      { key: "land", label: "Dhul iib ah (Land)", type: LISTING_TYPES.FEE },
      { key: "farm", label: "Beer iib ah (Farm)", type: LISTING_TYPES.FEE },
      { key: "business", label: "Ganacsi (Business)", type: LISTING_TYPES.FEE },
    ],
  },
  {
    title: "Cars (Gawaarida)",
    fees: [
      { key: "carSale", label: "Gawaari iib ah", type: LISTING_TYPES.FEE },
      { key: "carRent", label: "Gawaari kireyn", type: LISTING_TYPES.FEE },
      { key: "trailer", label: "Rimoor", type: LISTING_TYPES.FREE },
      { key: "carParts", label: "Qaybaha gawaarida", type: LISTING_TYPES.FREE },
      { key: "truck", label: "Baabuur xamuul", type: LISTING_TYPES.FEE },
      { key: "electricCar", label: "Gawaari koronto", type: LISTING_TYPES.FEE },
    ],
  },
  {
    title: "Motorcycles (Mootooyin)",
    fees: [
      { key: "motoSale", label: "Beec ah (For Sale)", type: LISTING_TYPES.FEE },
      { key: "motoRent", label: "Kiro ah (For Rent)", type: LISTING_TYPES.FEE },
      {
        key: "motoParts",
        label: "Qaybaha (Spare Parts)",
        type: LISTING_TYPES.FREE,
      },
      { key: "motoOther", label: "Wax kale (Other)", type: LISTING_TYPES.FREE },
    ],
  },
  {
    title: "Boats (Doomo)",
    fees: [
      { key: "boatSale", label: "Doomo iib ah", type: LISTING_TYPES.FEE },
      { key: "boatRent", label: "Doomo kireysi ah", type: LISTING_TYPES.FEE },
      {
        key: "boatEngine",
        label: "Matoorada doomo iib ah",
        type: LISTING_TYPES.FREE,
      },
      { key: "boatParts", label: "Qaybaha doomo", type: LISTING_TYPES.FREE },
    ],
  },
  {
    title: "Traktor (Cagaf Cagaf)",
    fees: [
      {
        key: "tractorSale",
        label: "Cagaf cagaf beec ah",
        type: LISTING_TYPES.FEE,
      },
      { key: "agriTool", label: "Qalabka beeraha", type: LISTING_TYPES.FREE },
      {
        key: "fertilizer",
        label: "Faafiyaha bacriminta",
        type: LISTING_TYPES.FREE,
      },
      {
        key: "harvester",
        label: "Makiinada goosashada",
        type: LISTING_TYPES.FEE,
      },
    ],
  },
  {
    title: "Jobs (Shaqo)",
    fees: [
      {
        key: "fullTime",
        label: "Shaqo Waqti Buuxa (Full-Time)",
        type: LISTING_TYPES.FEE,
      },
      {
        key: "partTime",
        label: "Shaqo Waqti Gaaban (Part-Time)",
        type: LISTING_TYPES.FEE,
      },
      {
        key: "freelance",
        label: "Shaqo Xor ah (Freelance)",
        type: LISTING_TYPES.FREE,
      },
    ],
  },
  {
    title: "System & Tax Settings",
    fees: [
      { key: "taxRate", label: "VAT / Tax Rate (%)", type: LISTING_TYPES.FEE },
      { key: "waafi", label: "WAAFI Server ($)", type: LISTING_TYPES.FEE },
    ],
  },
  {
    title: "Subscriptions (Is-diiwaangelin)",
    fees: [
      {
        key: "basic30",
        label: "30-Day Basic",
        type: LISTING_TYPES.FEE,
      },
      {
        key: "standard60",
        label: "60-Day Standard",
        type: LISTING_TYPES.FEE,
      },
      {
        key: "premium90",
        label: "90-Day Premium",
        type: LISTING_TYPES.FEE,
      },
    ],
  },
];
