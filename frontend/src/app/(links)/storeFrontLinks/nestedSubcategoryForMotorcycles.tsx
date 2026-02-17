export interface MotorcycleSubCategoryItem {
  so: string;
  title: string;
}

export const MotorcyclesForNestedSub: MotorcycleSubCategoryItem[] = [
  { so: "Mooto Cusub", title: "New Motorcycle" },
  { so: "Mooto La Isticmaalay", title: "Used Motorcycle" },
  { so: "Vespa Cusub", title: "New Vespa" },
  { so: "Vespa La Isticmaalay", title: "Used Vespa" },
  { so: "Bajaaj Cusub", title: "New Bajaj" },
  { so: "Bajaaj La Isticmaalay", title: "Used Bajaj" },
  { so: "Mootooyin Ciyaar", title: "Sport Bikes" },
  { so: "Mootooyin Xamuul", title: "Cargo Bikes" },
  { so: "Bajaaj Xamuul", title: "Cargo Bajaj (Tuk Tuk)" },
];

export const MotorcycleRentNestedSub: MotorcycleSubCategoryItem[] = [
  { so: "Mootooyin Kiro ah", title: "Motorcycle Rental" },
  { so: "Vespa Kiro ah", title: "Vespa Rental" },
  { so: "Mooto Xamuul Kiro ah", title: "Cargo Motorcycle Rental" },
  { so: "Bajaaj Kiro Ah", title: "Bajaj for Rent" },
  { so: "Bajaaj Xamuul Kiro Ah", title: "Cargo Bajaj Rental" },
  { so: "Bajaaj Kiro Maalinle", title: "Daily Bajaj Rental" },
];

export const MCPartsNestedSub: MotorcycleSubCategoryItem[] = [
  { so: "Matoorrada Mootooyinka", title: "Motorcycle Engines" },
  { so: "Taayirrada Mootooyinka", title: "Tires/Rims" },
  { so: "Qalabka Ilaalinta", title: "Protective Gear" },
  { so: "Matoorrada Bajaaj", title: "Bajaj Engines" },
  { so: "Qaybo Jidhka Bajaaj", title: "Bajaj Body Parts" },
];

export const OtherNestedSub: MotorcycleSubCategoryItem[] = [
  { so: "Qalabka kale", title: "Miscellaneous Equipment" },
];
