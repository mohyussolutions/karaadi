import prisma from "src/core/utils/db.ts";

const SEED_DATA = [
  {
    key: "antiques",
    nameEn: "Antiques & Art",
    nameSo: "Qadiimi & Farshaxan",
    subcategories: [
      { key: "bowls", nameEn: "Bowls", nameSo: "Baaquli" },
      { key: "parts", nameEn: "Parts", nameSo: "Qaybo" },
      { key: "coffeeService", nameEn: "Coffee Service", nameSo: "Adeegga Bunka" },
      { key: "porcelain", nameEn: "Porcelain", nameSo: "Fooraan" },
      { key: "vintage", nameEn: "Vintage", nameSo: "Duug" },
      { key: "other", nameEn: "Other", nameSo: "Kale" },
    ],
  },
  {
    key: "electronics",
    nameEn: "Electronics",
    nameSo: "Elektarooniga",
    subcategories: [
      { key: "mobilePhones", nameEn: "Mobile Phones", nameSo: "Telefoonada" },
      { key: "laptopsComputers", nameEn: "Laptops & Computers", nameSo: "Kumbuyuutarada" },
      { key: "tvsAccessories", nameEn: "TVs & Accessories", nameSo: "TV-yada" },
      { key: "camerasPhotography", nameEn: "Cameras & Photography", nameSo: "Kamaradaha" },
      { key: "homeAppliances", nameEn: "Home Appliances", nameSo: "Qalabka Guriga" },
      { key: "other", nameEn: "Other", nameSo: "Kale" },
    ],
  },
  {
    key: "animalAndSupplies",
    nameEn: "Animal & Supplies",
    nameSo: "Xayawaanada",
    subcategories: [
      { key: "camels", nameEn: "Camels", nameSo: "Geel" },
      { key: "goats", nameEn: "Goats", nameSo: "Ari" },
      { key: "cattle", nameEn: "Cattle / Cows", nameSo: "Lo' / Dibi" },
      { key: "sheep", nameEn: "Sheep", nameSo: "Ido" },
      { key: "horses", nameEn: "Horses", nameSo: "Faras" },
      { key: "donkeys", nameEn: "Donkeys", nameSo: "Dameer" },
      { key: "poultry", nameEn: "Poultry / Chickens", nameSo: "Digaag" },
      { key: "birds", nameEn: "Birds", nameSo: "Shimbiraha" },
      { key: "feed", nameEn: "Animal Feed", nameSo: "Cuntada Xoolaha" },
      { key: "vetSupplies", nameEn: "Veterinary Supplies", nameSo: "Daawooyinka Xoolaha" },
      { key: "accessories", nameEn: "Animal Accessories", nameSo: "Agabka Xoolaha" },
      { key: "other", nameEn: "Other", nameSo: "Kale" },
    ],
  },
  {
    key: "sportsAndOutdoors",
    nameEn: "Sports & Outdoors",
    nameSo: "Ciyaaraha & Dibadda",
    subcategories: [
      { key: "gymEquipment", nameEn: "Gym Equipment", nameSo: "Qalabka Jimicsiga" },
      { key: "bicycles", nameEn: "Bicycles", nameSo: "Baaskiilada" },
      { key: "sportingGoods", nameEn: "Sporting Goods", nameSo: "Qalabka Ciyaaraha" },
      { key: "campingGear", nameEn: "Camping Gear", nameSo: "Qalabka Safarka" },
      { key: "toys", nameEn: "Toys", nameSo: "Ciyaaraha" },
      { key: "other", nameEn: "Other", nameSo: "Kale" },
    ],
  },
  {
    key: "furniture",
    nameEn: "Furniture",
    nameSo: "Alaabta Guriga",
    subcategories: [
      { key: "sofasCouches", nameEn: "Sofas & Couches", nameSo: "Fadhiyada" },
      { key: "bedsMattresses", nameEn: "Beds & Mattresses", nameSo: "Sariiraha" },
      { key: "tablesDesks", nameEn: "Tables & Desks", nameSo: "Miisaska" },
      { key: "kitchenFurnishings", nameEn: "Kitchen Furnishings", nameSo: "Qalabka Jikada" },
      { key: "other", nameEn: "Other", nameSo: "Kale" },
    ],
  },
  {
    key: "fashion",
    nameEn: "Fashion",
    nameSo: "Dharka & Boorsooyinka",
    subcategories: [
      { key: "mensClothing", nameEn: "Men's Clothing", nameSo: "Dharka Ragga" },
      { key: "womensClothing", nameEn: "Women's Clothing", nameSo: "Dharka Haweenka" },
      { key: "shoesFootwear", nameEn: "Shoes & Footwear", nameSo: "Kabaha" },
      { key: "bagsWallets", nameEn: "Bags & Wallets", nameSo: "Boorsooyinka" },
      { key: "other", nameEn: "Other", nameSo: "Kale" },
    ],
  },
];

export async function seedMarketplaceCategories() {
  for (const cat of SEED_DATA) {
    await prisma.marketplaceCategory.upsert({
      where: { key: cat.key },
      update: { nameEn: cat.nameEn, nameSo: cat.nameSo },
      create: { key: cat.key, nameEn: cat.nameEn, nameSo: cat.nameSo },
    });
    for (const sub of cat.subcategories) {
      await prisma.marketplaceSubcategory.upsert({
        where: { key_categoryKey: { key: sub.key, categoryKey: cat.key } },
        update: { nameEn: sub.nameEn, nameSo: sub.nameSo },
        create: { key: sub.key, nameEn: sub.nameEn, nameSo: sub.nameSo, categoryKey: cat.key },
      });
    }
  }
}
