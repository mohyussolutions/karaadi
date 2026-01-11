export type Region = {
  id: string;
  name: string;
  count: number;
};

export type Cities = {
  id: string;
  name: string;
  regionId: string;
};
export interface SubDistrict {
  id: string;
  name: string;
}
export interface CityDistricts {
  id: string;
  name: string;
  regionId: string;
  subDistricts: SubDistrict[];
}
export const regions: Region[] = [
  { id: "awdal", name: "Awdal", count: 121 },
  { id: "banadir", name: "Banadir", count: 0 },
  { id: "bari", name: "Bari", count: 0 },
  { id: "bakool", name: "Bakool", count: 0 },
  { id: "bay", name: "Bay", count: 0 },
  { id: "galguduud", name: "Galguduud", count: 0 },
  { id: "gedo", name: "Gedo", count: 0 },
  { id: "hiiraan", name: "Hiiraan", count: 0 },
  { id: "jubada-dhexe", name: "Jubada Dhexe", count: 0 },
  { id: "jubada-hoose", name: "Jubada Hoose", count: 0 },
  { id: "mudug", name: "Mudug", count: 0 },
  { id: "nugaal", name: "Nugaal", count: 0 },
  { id: "sanaag", name: "Sanaag", count: 0 },
  { id: "shabeellaha-dhexe", name: "Shabeellaha Dhexe", count: 0 },
  { id: "shabeellaha-hoose", name: "Shabeellaha Hoose", count: 0 },
  { id: "sool", name: "Sool", count: 0 },
  { id: "togdheer", name: "Togdheer", count: 0 },
  { id: "wqdl", name: "Woqooyi Galbeed", count: 0 },
];

export const cities: Cities[] = [
  { id: "boorama", name: "Boorame", regionId: "awdal" },
  { id: "baki", name: "Baki", regionId: "awdal" },
  { id: "lughaya", name: "Lughaya", regionId: "awdal" },
  { id: "zaylac", name: "Zaylac", regionId: "awdal" },

  { id: "cabdicasiis", name: "Cabdi Casiis", regionId: "banadir" },
  { id: "bondhere", name: "Bondhere", regionId: "banadir" },
  { id: "xamar-jajab", name: "Xamar Jajab", regionId: "banadir" },
  { id: "xamar-weyne", name: "Xamar Weyne", regionId: "banadir" },
  { id: "hawl-wadag", name: "Hawl Wadaag", regionId: "banadir" },
  { id: "heliwaa", name: "Heliwaa", regionId: "banadir" },
  { id: "hodan", name: "Hodan", regionId: "banadir" },
  { id: "karaan", name: "Karaan", regionId: "banadir" },
  { id: "shangaani", name: "Shangaani", regionId: "banadir" },
  { id: "shibis", name: "Shibis", regionId: "banadir" },
  { id: "waaberi", name: "Waaberi", regionId: "banadir" },
  { id: "wadajir", name: "Wadajir", regionId: "banadir" },
  { id: "wardhiigley", name: "Wardhiigley", regionId: "banadir" },
  { id: "yaaqshiid", name: "Yaaqshiid", regionId: "banadir" },
  { id: "dharkeynley", name: "Dharkeynley", regionId: "banadir" },

  { id: "bosaso", name: "Boosaaso", regionId: "bari" },
  { id: "caluula", name: "Caluula", regionId: "bari" },
  { id: "badarbeyla", name: "Badarbeyla", regionId: "bari" },
  { id: "rako", name: "Rako", regionId: "bari" },
  { id: "ufayn", name: "Ufayn", regionId: "bari" },
  { id: "waaciya", name: "Waaciya", regionId: "bari" },
  { id: "qandala", name: "Qandala", regionId: "bari" },
  { id: "qardho", name: "Qardho", regionId: "bari" },
  { id: "xaafuun", name: "Xaafuun", regionId: "bari" },
  { id: "isku-shuban", name: "Isku Shuban", regionId: "bari" },

  { id: "burco", name: "Burco", regionId: "togdheer" },
  { id: "buuhoodle", name: "Buuhoodle", regionId: "togdheer" },
  { id: "shiikh", name: "Shiikh", regionId: "togdheer" },
  { id: "oodweyne", name: "Oodweyne", regionId: "togdheer" },

  { id: "laas-caanood", name: "Laas Caanood", regionId: "sool" },
  { id: "caynabo", name: "Caynabo", regionId: "sool" },
  { id: "xudun", name: "Xudun", regionId: "sool" },
  { id: "taleex", name: "Taleex", regionId: "sool" },

  { id: "dhusamareb", name: "Dhusamareeb", regionId: "galguduud" },
  { id: "cadaado", name: "Cadaado", regionId: "galguduud" },
  { id: "ceelbuur", name: "Ceelbuur", regionId: "galguduud" },
  { id: "ceeldheer", name: "Ceeldheer", regionId: "galguduud" },
  { id: "caabud-waaq", name: "Caabud Waaq", regionId: "galguduud" },
  { id: "gel-hareeri", name: "Gel Hareeri", regionId: "galguduud" },

  { id: "beletweyne", name: "Baladweyne", regionId: "hiiraan" },
  { id: "buula-barde", name: "Buula Barde", regionId: "hiiraan" },
  { id: "jalalaqsi", name: "Jalalaqsi", regionId: "hiiraan" },
  { id: "masax", name: "Masax", regionId: "hiiraan" },
  { id: "matabaan", name: "Matabaan", regionId: "hiiraan" },

  { id: "garbahaarey", name: "Garbahaarey", regionId: "gedo" },
  { id: "baardheere", name: "Baardheere", regionId: "gedo" },
  { id: "beledxaawo", name: "Beled Xaawo", regionId: "gedo" },
  { id: "doolow", name: "Doolow", regionId: "gedo" },
  { id: "ceelwaaq", name: "Ceelwaaq", regionId: "gedo" },
  { id: "luuq", name: "Luuq", regionId: "gedo" },

  { id: "hargeysa", name: "Hargeysa", regionId: "wqdl" },
  { id: "dacar-budhuq", name: "Dacar Budhuq", regionId: "wqdl" },
  { id: "berbera", name: "Berbera", regionId: "wqdl" },
  { id: "gebilay", name: "Gebilay", regionId: "wqdl" },

  { id: "galkacyo", name: "Gaalkacyo", regionId: "mudug" },
  { id: "galdogob", name: "Galdogob", regionId: "mudug" },
  { id: "xarardheere", name: "Xarardheere", regionId: "mudug" },
  { id: "hobyo", name: "Hobyo", regionId: "mudug" },
  { id: "jiriiban", name: "Jiriiban", regionId: "mudug" },

  { id: "jowhar", name: "Jowhar", regionId: "shabeellaha-dhexe" },
  { id: "balcad", name: "Balcad", regionId: "shabeellaha-dhexe" },
  { id: "mahadaay", name: "Mahadaay", regionId: "shabeellaha-dhexe" },
  { id: "cadale", name: "Cadale", regionId: "shabeellaha-dhexe" },
  { id: "aadan-yabaal", name: "Aadan Yabaal", regionId: "shabeellaha-dhexe" },
  { id: "warshiikh", name: "Warshiikh", regionId: "shabeellaha-dhexe" },
  { id: "run-rugood", name: "Run Rugood", regionId: "shabeellaha-dhexe" },

  { id: "marka", name: "Marka", regionId: "shabeellaha-hoose" },
  { id: "afgooye", name: "Afgooye", regionId: "shabeellaha-hoose" },
  { id: "awdhiigle", name: "Aw-dhiigle", regionId: "shabeellaha-hoose" },
  { id: "baraawe", name: "Baraawe", regionId: "shabeellaha-hoose" },
  { id: "kuntiwaarey", name: "Kuntiwaarey", regionId: "shabeellaha-hoose" },
  { id: "qoryooley", name: "Qoryooley", regionId: "shabeellaha-hoose" },
  { id: "sablaale", name: "Sablaale", regionId: "shabeellaha-hoose" },

  { id: "baydhabo", name: "Baydhabo", regionId: "bay" },
  { id: "buurxakabo", name: "Buurxakabo", regionId: "bay" },
  { id: "diinsoor", name: "Diinsoor", regionId: "bay" },
  { id: "qansaxdheere", name: "Qansaxdheere", regionId: "bay" },
  { id: "bardaale", name: "Bardaale", regionId: "bay" },

  { id: "xudur", name: "Xudur", regionId: "bakool" },
  { id: "ceelbarde", name: "Ceelbarde", regionId: "bakool" },
  { id: "rabdhure", name: "Rab Dhure", regionId: "bakool" },
  { id: "tiyeglow", name: "Tiyeglow", regionId: "bakool" },
  { id: "biyooley", name: "Biyooley", regionId: "bakool" },

  { id: "buaale", name: "Bu'aale", regionId: "jubada-dhexe" },
  { id: "dujuma", name: "Dujuma", regionId: "jubada-dhexe" },
  { id: "jilib", name: "Jilib", regionId: "jubada-dhexe" },
  { id: "saakow", name: "Saakow", regionId: "jubada-dhexe" },

  { id: "ceerigaabo", name: "Ceerigaabo", regionId: "sanaag" },
  { id: "ceelafweyn", name: "Ceel Afweyn", regionId: "sanaag" },
  { id: "laasqoray", name: "Laasqoray", regionId: "sanaag" },
  { id: "badhan", name: "Badhan", regionId: "sanaag" },

  { id: "kismaayo", name: "Kismaayo", regionId: "jubada-hoose" },
  { id: "afmadow", name: "Afmadow", regionId: "jubada-hoose" },
  { id: "badhaadhe", name: "Badhaadhe", regionId: "jubada-hoose" },
  { id: "xagar", name: "Xagar", regionId: "jubada-hoose" },
  { id: "jamaame", name: "Jamaame", regionId: "jubada-hoose" },

  { id: "garowe", name: "Garoowe", regionId: "nugaal" },
  { id: "dangorayo", name: "Dangorayo", regionId: "nugaal" },
  { id: "ayl", name: "Ayl", regionId: "nugaal" },
  { id: "burtinle", name: "Burtinle", regionId: "nugaal" },
];
export const Districts: CityDistricts[] = [
  {
    id: "boorama",
    name: "Boorame",
    regionId: "awdal",
    subDistricts: [
      { id: "boorama-1", name: "Sub-district 1" },
      { id: "boorama-2", name: "Sub-district 2" },
      { id: "boorama-3", name: "Sub-district 3" },
      { id: "boorama-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "baki",
    name: "Baki",
    regionId: "awdal",
    subDistricts: [
      { id: "baki-1", name: "Sub-district 1" },
      { id: "baki-2", name: "Sub-district 2" },
      { id: "baki-3", name: "Sub-district 3" },
      { id: "baki-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "lughaya",
    name: "Lughaya",
    regionId: "awdal",
    subDistricts: [
      { id: "lughaya-1", name: "Sub-district 1" },
      { id: "lughaya-2", name: "Sub-district 2" },
      { id: "lughaya-3", name: "Sub-district 3" },
      { id: "lughaya-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "zaylac",
    name: "Zaylac",
    regionId: "awdal",
    subDistricts: [
      { id: "zaylac-1", name: "Sub-district 1" },
      { id: "zaylac-2", name: "Sub-district 2" },
      { id: "zaylac-3", name: "Sub-district 3" },
      { id: "zaylac-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "cabdicasiis",
    name: "Cabdi Casiis",
    regionId: "banadir",
    subDistricts: [
      { id: "cabdicasiis-1", name: "Sub-district 1" },
      { id: "cabdicasiis-2", name: "Sub-district 2" },
      { id: "cabdicasiis-3", name: "Sub-district 3" },
      { id: "cabdicasiis-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "bondhere",
    name: "Bondhere",
    regionId: "banadir",
    subDistricts: [
      { id: "bondhere-1", name: "Sub-district 1" },
      { id: "bondhere-2", name: "Sub-district 2" },
      { id: "bondhere-3", name: "Sub-district 3" },
      { id: "bondhere-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "xamar-jajab",
    name: "Xamar Jajab",
    regionId: "banadir",
    subDistricts: [
      { id: "xamar-jajab-1", name: "Sub-district 1" },
      { id: "xamar-jajab-2", name: "Sub-district 2" },
      { id: "xamar-jajab-3", name: "Sub-district 3" },
      { id: "xamar-jajab-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "xamar-weyne",
    name: "Xamar Weyne",
    regionId: "banadir",
    subDistricts: [
      { id: "xamar-weyne-1", name: "Sub-district 1" },
      { id: "xamar-weyne-2", name: "Sub-district 2" },
      { id: "xamar-weyne-3", name: "Sub-district 3" },
      { id: "xamar-weyne-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "hawl-wadag",
    name: "Hawl Wadaag",
    regionId: "banadir",
    subDistricts: [
      { id: "hawl-wadag-1", name: "Sub-district 1" },
      { id: "hawl-wadag-2", name: "Sub-district 2" },
      { id: "hawl-wadag-3", name: "Sub-district 3" },
      { id: "hawl-wadag-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "heliwaa",
    name: "Heliwaa",
    regionId: "banadir",
    subDistricts: [
      { id: "heliwaa-1", name: "Sub-district 1" },
      { id: "heliwaa-2", name: "Sub-district 2" },
      { id: "heliwaa-3", name: "Sub-district 3" },
      { id: "heliwaa-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "hodan",
    name: "Hodan",
    regionId: "banadir",
    subDistricts: [
      { id: "hodan-1", name: "Sub-district 1" },
      { id: "hodan-2", name: "Sub-district 2" },
      { id: "hodan-3", name: "Sub-district 3" },
      { id: "hodan-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "karaan",
    name: "Karaan",
    regionId: "banadir",
    subDistricts: [
      { id: "karaan-1", name: "Sub-district 1" },
      { id: "karaan-2", name: "Sub-district 2" },
      { id: "karaan-3", name: "Sub-district 3" },
      { id: "karaan-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "shangaani",
    name: "Shangaani",
    regionId: "banadir",
    subDistricts: [
      { id: "shangaani-1", name: "Sub-district 1" },
      { id: "shangaani-2", name: "Sub-district 2" },
      { id: "shangaani-3", name: "Sub-district 3" },
      { id: "shangaani-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "shibis",
    name: "Shibis",
    regionId: "banadir",
    subDistricts: [
      { id: "shibis-1", name: "Sub-district 1" },
      { id: "shibis-2", name: "Sub-district 2" },
      { id: "shibis-3", name: "Sub-district 3" },
      { id: "shibis-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "waaberi",
    name: "Waaberi",
    regionId: "banadir",
    subDistricts: [
      { id: "waaberi-1", name: "Sub-district 1" },
      { id: "waaberi-2", name: "Sub-district 2" },
      { id: "waaberi-3", name: "Sub-district 3" },
      { id: "waaberi-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "wadajir",
    name: "Wadajir",
    regionId: "banadir",
    subDistricts: [
      { id: "wadajir-1", name: "Sub-district 1" },
      { id: "wadajir-2", name: "Sub-district 2" },
      { id: "wadajir-3", name: "Sub-district 3" },
      { id: "wadajir-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "wardhiigley",
    name: "Wardhiigley",
    regionId: "banadir",
    subDistricts: [
      { id: "wardhiigley-1", name: "Sub-district 1" },
      { id: "wardhiigley-2", name: "Sub-district 2" },
      { id: "wardhiigley-3", name: "Sub-district 3" },
      { id: "wardhiigley-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "yaaqshiid",
    name: "Yaaqshiid",
    regionId: "banadir",
    subDistricts: [
      { id: "yaaqshiid-1", name: "Sub-district 1" },
      { id: "yaaqshiid-2", name: "Sub-district 2" },
      { id: "yaaqshiid-3", name: "Sub-district 3" },
      { id: "yaaqshiid-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "dharkeynley",
    name: "Dharkeynley",
    regionId: "banadir",
    subDistricts: [
      { id: "dharkeynley-1", name: "Sub-district 1" },
      { id: "dharkeynley-2", name: "Sub-district 2" },
      { id: "dharkeynley-3", name: "Sub-district 3" },
      { id: "dharkeynley-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "bosaso",
    name: "Boosaaso",
    regionId: "bari",
    subDistricts: [
      { id: "bosaso-1", name: "Sub-district 1" },
      { id: "bosaso-2", name: "Sub-district 2" },
      { id: "bosaso-3", name: "Sub-district 3" },
      { id: "bosaso-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "caluula",
    name: "Caluula",
    regionId: "bari",
    subDistricts: [
      { id: "caluula-1", name: "Sub-district 1" },
      { id: "caluula-2", name: "Sub-district 2" },
      { id: "caluula-3", name: "Sub-district 3" },
      { id: "caluula-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "badarbeyla",
    name: "Badarbeyla",
    regionId: "bari",
    subDistricts: [
      { id: "badarbeyla-1", name: "Sub-district 1" },
      { id: "badarbeyla-2", name: "Sub-district 2" },
      { id: "badarbeyla-3", name: "Sub-district 3" },
      { id: "badarbeyla-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "rako",
    name: "Rako",
    regionId: "bari",
    subDistricts: [
      { id: "rako-1", name: "Sub-district 1" },
      { id: "rako-2", name: "Sub-district 2" },
      { id: "rako-3", name: "Sub-district 3" },
      { id: "rako-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "ufayn",
    name: "Ufayn",
    regionId: "bari",
    subDistricts: [
      { id: "ufayn-1", name: "Sub-district 1" },
      { id: "ufayn-2", name: "Sub-district 2" },
      { id: "ufayn-3", name: "Sub-district 3" },
      { id: "ufayn-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "waaciya",
    name: "Waaciya",
    regionId: "bari",
    subDistricts: [
      { id: "waaciya-1", name: "Sub-district 1" },
      { id: "waaciya-2", name: "Sub-district 2" },
      { id: "waaciya-3", name: "Sub-district 3" },
      { id: "waaciya-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "qandala",
    name: "Qandala",
    regionId: "bari",
    subDistricts: [
      { id: "qandala-1", name: "Sub-district 1" },
      { id: "qandala-2", name: "Sub-district 2" },
      { id: "qandala-3", name: "Sub-district 3" },
      { id: "qandala-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "qardho",
    name: "Qardho",
    regionId: "bari",
    subDistricts: [
      { id: "qardho-1", name: "Sub-district 1" },
      { id: "qardho-2", name: "Sub-district 2" },
      { id: "qardho-3", name: "Sub-district 3" },
      { id: "qardho-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "xaafuun",
    name: "Xaafuun",
    regionId: "bari",
    subDistricts: [
      { id: "xaafuun-1", name: "Sub-district 1" },
      { id: "xaafuun-2", name: "Sub-district 2" },
      { id: "xaafuun-3", name: "Sub-district 3" },
      { id: "xaafuun-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "isku-shuban",
    name: "Isku Shuban",
    regionId: "bari",
    subDistricts: [
      { id: "isku-shuban-1", name: "Sub-district 1" },
      { id: "isku-shuban-2", name: "Sub-district 2" },
      { id: "isku-shuban-3", name: "Sub-district 3" },
      { id: "isku-shuban-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "burco",
    name: "Burco",
    regionId: "togdheer",
    subDistricts: [
      { id: "burco-1", name: "Sub-district 1" },
      { id: "burco-2", name: "Sub-district 2" },
      { id: "burco-3", name: "Sub-district 3" },
      { id: "burco-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "buuhoodle",
    name: "Buuhoodle",
    regionId: "togdheer",
    subDistricts: [
      { id: "buuhoodle-1", name: "Sub-district 1" },
      { id: "buuhoodle-2", name: "Sub-district 2" },
      { id: "buuhoodle-3", name: "Sub-district 3" },
      { id: "buuhoodle-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "shiikh",
    name: "Shiikh",
    regionId: "togdheer",
    subDistricts: [
      { id: "shiikh-1", name: "Sub-district 1" },
      { id: "shiikh-2", name: "Sub-district 2" },
      { id: "shiikh-3", name: "Sub-district 3" },
      { id: "shiikh-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "oodweyne",
    name: "Oodweyne",
    regionId: "togdheer",
    subDistricts: [
      { id: "oodweyne-1", name: "Sub-district 1" },
      { id: "oodweyne-2", name: "Sub-district 2" },
      { id: "oodweyne-3", name: "Sub-district 3" },
      { id: "oodweyne-4", name: "Sub-district 4" },
    ],
  },
  {
    id: "laas-caanood",
    name: "Laas Caanood",
    regionId: "sool",
    subDistricts: [
      { id: "laas-caanood-centre", name: "Laas Caanood Centre" },
      { id: "hargeyso-road", name: "Hargeyso Road" },
      { id: "garas-weyn", name: "Garas Weyn" },
      { id: "balidogle", name: "Balidogle" },
    ],
  },
  {
    id: "caynabo",
    name: "Caynabo",
    regionId: "sool",
    subDistricts: [
      { id: "caynabo-centre", name: "Caynabo Centre" },
      { id: "qayaad", name: "Qayaad" },
      { id: "dhoobo", name: "Dhoobo" },
      { id: "ceelgulaale", name: "Ceelgulaale" },
    ],
  },
  {
    id: "xudun",
    name: "Xudun",
    regionId: "sool",
    subDistricts: [
      { id: "xudun-centre", name: "Xudun Centre" },
      { id: "barwaaqo", name: "Barwaaqo" },
      { id: "garaad", name: "Garaad" },
      { id: "qoraxda", name: "Qoraxda" },
    ],
  },
  {
    id: "taleex",
    name: "Taleex",
    regionId: "sool",
    subDistricts: [
      { id: "taleex-centre", name: "Taleex Centre" },
      { id: "berbera-road", name: "Berbera Road" },
      { id: "lagaar", name: "Lagaar" },
      { id: "hurdi", name: "Hurdi" },
    ],
  },

  // Galguduud Region
  {
    id: "dhusamareb",
    name: "Dhusamareeb",
    regionId: "galguduud",
    subDistricts: [
      { id: "dhusamareb-centre", name: "Dhusamareb Centre" },
      { id: "garas-weyn", name: "Garas Weyn" },
      { id: "mahadley", name: "Mahadley" },
      { id: "ceel-dheer", name: "Ceel Dheer" },
    ],
  },
  {
    id: "cadaado",
    name: "Cadaado",
    regionId: "galguduud",
    subDistricts: [
      { id: "cadaado-centre", name: "Cadaado Centre" },
      { id: "bud-bud", name: "Bud-Bud" },
      { id: "dhoobo", name: "Dhoobo" },
      { id: "qaycad", name: "Qaycad" },
    ],
  },
  {
    id: "ceelbuur",
    name: "Ceelbuur",
    regionId: "galguduud",
    subDistricts: [
      { id: "ceelbuur-centre", name: "Ceelbuur Centre" },
      { id: "xariirad", name: "Xariirad" },
      { id: "balad", name: "Balad" },
      { id: "garas-weyn", name: "Garas Weyn" },
    ],
  },
  {
    id: "ceeldheer",
    name: "Ceeldheer",
    regionId: "galguduud",
    subDistricts: [
      { id: "ceeldheer-centre", name: "Ceeldheer Centre" },
      { id: "buulo-xareed", name: "Buulo Xareed" },
      { id: "lagaar", name: "Lagaar" },
      { id: "goobo", name: "Goobo" },
    ],
  },
  {
    id: "caabud-waaq",
    name: "Caabud Waaq",
    regionId: "galguduud",
    subDistricts: [
      { id: "caabud-centre", name: "Caabud Waaq Centre" },
      { id: "warshadaha", name: "Warshadaha" },
      { id: "bacaad", name: "Bacaad" },
      { id: "degaan", name: "Degaan" },
    ],
  },
  {
    id: "gel-hareeri",
    name: "Gel Hareeri",
    regionId: "galguduud",
    subDistricts: [
      { id: "gel-centre", name: "Gel Hareeri Centre" },
      { id: "hilaac", name: "Hilaac" },
      { id: "warfa", name: "Warfa" },
      { id: "goob-tacsi", name: "Goob Tacsi" },
    ],
  },

  // Hiiraan Region
  {
    id: "beletweyne",
    name: "Baladweyne",
    regionId: "hiiraan",
    subDistricts: [
      { id: "beletweyne-centre", name: "Baladweyne Centre" },
      { id: "warshadaha", name: "Warshadaha" },
      { id: "biyo-xawaale", name: "Biyo Xawaale" },
      { id: "garas-weyn", name: "Garas Weyn" },
    ],
  },
  {
    id: "buula-barde",
    name: "Buula Barde",
    regionId: "hiiraan",
    subDistricts: [
      { id: "buula-centre", name: "Buula Barde Centre" },
      { id: "geel-joog", name: "Geel Joog" },
      { id: "laascaanood-road", name: "Laascaanood Road" },
      { id: "gaal-madow", name: "Gaal Madow" },
    ],
  },
  {
    id: "jalalaqsi",
    name: "Jalalaqsi",
    regionId: "hiiraan",
    subDistricts: [
      { id: "jalalaqsi-centre", name: "Jalalaqsi Centre" },
      { id: "deegaan-bari", name: "Deegaan Bari" },
      { id: "busleey", name: "Busleey" },
      { id: "garaad", name: "Garaad" },
    ],
  },
  {
    id: "masax",
    name: "Masax",
    regionId: "hiiraan",
    subDistricts: [
      { id: "masax-centre", name: "Masax Centre" },
      { id: "caabud-waaq-road", name: "Caabud Waaq Road" },
      { id: "qoryo", name: "Qoryo" },
      { id: "kulmis", name: "Kulmis" },
    ],
  },
  {
    id: "matabaan",
    name: "Matabaan",
    regionId: "hiiraan",
    subDistricts: [
      { id: "matabaan-centre", name: "Matabaan Centre" },
      { id: "degaan-galbeed", name: "Deegaan Galbeed" },
      { id: "garas-dhexe", name: "Garas Dhexe" },
      { id: "xarunta-suuqa", name: "Xarunta Suuqa" },
    ],
  },
  {
    id: "garbahaarey",
    name: "Garbahaarey",
    regionId: "gedo",
    subDistricts: [
      { id: "garbahaarey-centre", name: "Garbahaarey Centre" },
      { id: "buur-hakaba", name: "Buur Hakaba" },
      { id: "ceel-baraf", name: "Ceel Baraf" },
      { id: "barkad", name: "Barkad" },
    ],
  },
  {
    id: "baardheere",
    name: "Baardheere",
    regionId: "gedo",
    subDistricts: [
      { id: "baardheere-centre", name: "Baardheere Centre" },
      { id: "ceel-maleh", name: "Ceel Maleh" },
      { id: "qoryooley", name: "Qoryooley" },
      { id: "laba-dubar", name: "Laba Dubar" },
    ],
  },
  {
    id: "beledxaawo",
    name: "Beled Xaawo",
    regionId: "gedo",
    subDistricts: [
      { id: "beledxaawo-centre", name: "Beled Xaawo Centre" },
      { id: "warfa", name: "Warfa" },
      { id: "ceel-humow", name: "Ceel Humow" },
      { id: "gololey", name: "Gololey" },
    ],
  },
  {
    id: "doolow",
    name: "Doolow",
    regionId: "gedo",
    subDistricts: [
      { id: "doolow-centre", name: "Doolow Centre" },
      { id: "bulo-lakow", name: "Bulo Lakow" },
      { id: "qansax-dheere", name: "Qansax Dheere" },
      { id: "ceel-xaaji", name: "Ceel Xaaji" },
    ],
  },
  {
    id: "ceelwaaq",
    name: "Ceelwaaq",
    regionId: "gedo",
    subDistricts: [
      { id: "ceelwaaq-centre", name: "Ceelwaaq Centre" },
      { id: "guurule", name: "Guurule" },
      { id: "cali-xaar", name: "Cali Xaar" },
      { id: "garas-weyn", name: "Garas Weyn" },
    ],
  },
  {
    id: "luuq",
    name: "Luuq",
    regionId: "gedo",
    subDistricts: [
      { id: "luuq-centre", name: "Luuq Centre" },
      { id: "ceel-barde", name: "Ceel Barde" },
      { id: "laba-godka", name: "Laba Godka" },
      { id: "qaasime", name: "Qaasime" },
    ],
  },

  // Woqooyi Galbeed Region (wqdl)
  {
    id: "hargeysa",
    name: "Hargeysa",
    regionId: "wqdl",
    subDistricts: [
      { id: "hargeysa-centre", name: "Hargeysa Centre" },
      { id: "geed-aleex", name: "Geed Aleex" },
      { id: "xawaadle", name: "Xawaadle" },
      { id: "garas-weyn", name: "Garas Weyn" },
    ],
  },
  {
    id: "dacar-budhuq",
    name: "Dacar Budhuq",
    regionId: "wqdl",
    subDistricts: [
      { id: "dacar-centre", name: "Dacar Budhuq Centre" },
      { id: "qarxis", name: "Qarxis" },
      { id: "gubadle", name: "Gubadle" },
      { id: "badhan", name: "Badhan" },
    ],
  },
  {
    id: "berbera",
    name: "Berbera",
    regionId: "wqdl",
    subDistricts: [
      { id: "berbera-centre", name: "Berbera Centre" },
      { id: "suuga", name: "Suuga" },
      { id: "geel-jire", name: "Geel Jire" },
      { id: "dayax", name: "Dayax" },
    ],
  },
  {
    id: "gebilay",
    name: "Gebilay",
    regionId: "wqdl",
    subDistricts: [
      { id: "gebilay-centre", name: "Gebilay Centre" },
      { id: "buulo-tog", name: "Buulo Tog" },
      { id: "qeylo", name: "Qeylo" },
      { id: "dila", name: "Dila" },
    ],
  },

  // Mudug Region
  {
    id: "galkacyo",
    name: "Gaalkacyo",
    regionId: "mudug",
    subDistricts: [
      { id: "galkacyo-centre", name: "Gaalkacyo Centre" },
      { id: "garas-weyn", name: "Garas Weyn" },
      { id: "sahal", name: "Sahal" },
      { id: "dhexe", name: "Dhexe" },
    ],
  },
  {
    id: "galdogob",
    name: "Galdogob",
    regionId: "mudug",
    subDistricts: [
      { id: "galdogob-centre", name: "Galdogob Centre" },
      { id: "tuulo-jamac", name: "Tuulo Jamac" },
      { id: "garaad", name: "Garaad" },
      { id: "ceel-afweyn", name: "Ceel Afweyn" },
    ],
  },
  {
    id: "xarardheere",
    name: "Xarardheere",
    regionId: "mudug",
    subDistricts: [
      { id: "xarardheere-centre", name: "Xarardheere Centre" },
      { id: "buulo-barde", name: "Buulo Barde" },
      { id: "degaan-barri", name: "Deegaan Barri" },
      { id: "garaad", name: "Garaad" },
    ],
  },
  {
    id: "hobyo",
    name: "Hobyo",
    regionId: "mudug",
    subDistricts: [
      { id: "hobyo-centre", name: "Hobyo Centre" },
      { id: "ceel-gacmeed", name: "Ceel Gacmeed" },
      { id: "bari", name: "Bari" },
      { id: "garaad", name: "Garaad" },
    ],
  },
  {
    id: "jiriiban",
    name: "Jiriiban",
    regionId: "mudug",
    subDistricts: [
      { id: "jiriiban-centre", name: "Jiriiban Centre" },
      { id: "buulo-xarow", name: "Buulo Xarow" },
      { id: "degaan-galbeed", name: "Deegaan Galbeed" },
      { id: "caabud", name: "Caabud" },
    ],
  },

  {
    id: "jowhar",
    name: "Jowhar",
    regionId: "shabeellaha-dhexe",
    subDistricts: [
      { id: "jowhar-centre", name: "Jowhar Centre" },
      { id: "dabeyl", name: "Dabeyl" },
      { id: "cabdulle", name: "Cabdulle" },
      { id: "garawe", name: "Garawe" },
    ],
  },
  {
    id: "balcad",
    name: "Balcad",
    regionId: "shabeellaha-dhexe",
    subDistricts: [
      { id: "balcad-centre", name: "Balcad Centre" },
      { id: "ceel-waaq", name: "Ceel Waaq" },
      { id: "qansax", name: "Qansax" },
      { id: "balcad-barwaaqo", name: "Balcad Barwaaqo" },
    ],
  },
  {
    id: "mahadaay",
    name: "Mahadaay",
    regionId: "shabeellaha-dhexe",
    subDistricts: [
      { id: "mahadaay-centre", name: "Mahadaay Centre" },
      { id: "caga-biyood", name: "Caga Biyood" },
      { id: "garawe-dheere", name: "Garawe Dheere" },
      { id: "ceel-dhagax", name: "Ceel Dhagax" },
    ],
  },
  {
    id: "cadale",
    name: "Cadale",
    regionId: "shabeellaha-dhexe",
    subDistricts: [
      { id: "cadale-centre", name: "Cadale Centre" },
      { id: "qaw", name: "Qaw" },
      { id: "cawlay", name: "Cawlay" },
      { id: "xawaadle", name: "Xawaadle" },
    ],
  },
  {
    id: "aadan-yabaal",
    name: "Aadan Yabaal",
    regionId: "shabeellaha-dhexe",
    subDistricts: [
      { id: "aadan-yabaal-centre", name: "Aadan Yabaal Centre" },
      { id: "dhuuxley", name: "Dhuuxley" },
      { id: "ceel-gogol", name: "Ceel Gogol" },
      { id: "buulo-laf", name: "Buulo Laf" },
    ],
  },
  {
    id: "warshiikh",
    name: "Warshiikh",
    regionId: "shabeellaha-dhexe",
    subDistricts: [
      { id: "warshiikh-centre", name: "Warshiikh Centre" },
      { id: "garas-weyn", name: "Garas Weyn" },
      { id: "ceel-xaaji", name: "Ceel Xaaji" },
      { id: "buulo-wareeg", name: "Buulo Wareeg" },
    ],
  },
  {
    id: "run-rugood",
    name: "Run Rugood",
    regionId: "shabeellaha-dhexe",
    subDistricts: [
      { id: "run-rugood-centre", name: "Run Rugood Centre" },
      { id: "xasan-dhuux", name: "Xasan Dhuux" },
      { id: "qaydhiya", name: "Qaydhiya" },
      { id: "bulo-dheere", name: "Bulo Dheere" },
    ],
  },

  // Shabeellaha Hoose
  {
    id: "marka",
    name: "Marka",
    regionId: "shabeellaha-hoose",
    subDistricts: [
      { id: "marka-centre", name: "Marka Centre" },
      { id: "ceel-xar", name: "Ceel Xar" },
      { id: "saxiix", name: "Saxiix" },
      { id: "bulo-xar", name: "Bulo Xar" },
    ],
  },
  {
    id: "afgooye",
    name: "Afgooye",
    regionId: "shabeellaha-hoose",
    subDistricts: [
      { id: "afgooye-centre", name: "Afgooye Centre" },
      { id: "cadale", name: "Cadale" },
      { id: "guul-daar", name: "Guul Daar" },
      { id: "buulo-qaday", name: "Buulo Qaday" },
    ],
  },
  {
    id: "awdhiigle",
    name: "Aw-dhiigle",
    regionId: "shabeellaha-hoose",
    subDistricts: [
      { id: "awdhiigle-centre", name: "Aw-dhiigle Centre" },
      { id: "ceel-sawa", name: "Ceel Sawa" },
      { id: "xawaadle", name: "Xawaadle" },
      { id: "bulo-wareeg", name: "Buulo Wareeg" },
    ],
  },
  {
    id: "baraawe",
    name: "Baraawe",
    regionId: "shabeellaha-hoose",
    subDistricts: [
      { id: "baraawe-centre", name: "Baraawe Centre" },
      { id: "ceel-sali", name: "Ceel Sali" },
      { id: "safaari", name: "Safaari" },
      { id: "buulo-madow", name: "Buulo Madow" },
    ],
  },
  {
    id: "kuntiwaarey",
    name: "Kuntiwaarey",
    regionId: "shabeellaha-hoose",
    subDistricts: [
      { id: "kuntiwaarey-centre", name: "Kuntiwaarey Centre" },
      { id: "qoryooley", name: "Qoryooley" },
      { id: "guul-daar", name: "Guul Daar" },
      { id: "ceel-xaaji", name: "Ceel Xaaji" },
    ],
  },
  {
    id: "qoryooley",
    name: "Qoryooley",
    regionId: "shabeellaha-hoose",
    subDistricts: [
      { id: "qoryooley-centre", name: "Qoryooley Centre" },
      { id: "ceel-sali", name: "Ceel Sali" },
      { id: "buulo-xar", name: "Buulo Xar" },
      { id: "garas-weyn", name: "Garas Weyn" },
    ],
  },
  {
    id: "sablaale",
    name: "Sablaale",
    regionId: "shabeellaha-hoose",
    subDistricts: [
      { id: "sablaale-centre", name: "Sablaale Centre" },
      { id: "bulo-xar", name: "Bulo Xar" },
      { id: "ceel-dheere", name: "Ceel Dheere" },
      { id: "garawe", name: "Garawe" },
    ],
  },
  {
    id: "baydhabo",
    name: "Baydhabo",
    regionId: "bay",
    subDistricts: [
      { id: "baydhabo-centre", name: "Baydhabo Centre" },
      { id: "cadale", name: "Cadale" },
      { id: "ceel-bardaale", name: "Ceel Bardaale" },
    ],
  },
  {
    id: "buurxakabo",
    name: "Buurxakabo",
    regionId: "bay",
    subDistricts: [
      { id: "buurxakabo-centre", name: "Buurxakabo Centre" },
      { id: "bulo-gadud", name: "Bulo Gadud" },
    ],
  },
  {
    id: "diinsoor",
    name: "Diinsoor",
    regionId: "bay",
    subDistricts: [
      { id: "diinsoor-centre", name: "Diinsoor Centre" },
      { id: "ceel-duwan", name: "Ceel Duwan" },
    ],
  },
  {
    id: "qansaxdheere",
    name: "Qansaxdheere",
    regionId: "bay",
    subDistricts: [
      { id: "qansaxdheere-centre", name: "Qansaxdheere Centre" },
      { id: "bulo-bayle", name: "Bulo Bayle" },
    ],
  },
  {
    id: "bardaale",
    name: "Bardaale",
    regionId: "bay",
    subDistricts: [
      { id: "bardaale-centre", name: "Bardaale Centre" },
      { id: "ceel-hel", name: "Ceel Hel" },
    ],
  },

  // Bakool Region
  {
    id: "xudur",
    name: "Xudur",
    regionId: "bakool",
    subDistricts: [
      { id: "xudur-centre", name: "Xudur Centre" },
      { id: "barire", name: "Barire" },
    ],
  },
  {
    id: "ceelbarde",
    name: "Ceelbarde",
    regionId: "bakool",
    subDistricts: [
      { id: "ceelbarde-centre", name: "Ceelbarde Centre" },
      { id: "bulo-madow", name: "Bulo Madow" },
    ],
  },
  {
    id: "rabdhure",
    name: "Rab Dhure",
    regionId: "bakool",
    subDistricts: [
      { id: "rabdhure-centre", name: "Rab Dhure Centre" },
      { id: "ceel-hel", name: "Ceel Hel" },
    ],
  },
  {
    id: "tiyeglow",
    name: "Tiyeglow",
    regionId: "bakool",
    subDistricts: [
      { id: "tiyeglow-centre", name: "Tiyeglow Centre" },
      { id: "burto", name: "Burto" },
    ],
  },
  {
    id: "biyooley",
    name: "Biyooley",
    regionId: "bakool",
    subDistricts: [
      { id: "biyooley-centre", name: "Biyooley Centre" },
      { id: "ceel-gori", name: "Ceel Gori" },
    ],
  },

  // Jubada Dhexe Region
  {
    id: "buaale",
    name: "Bu'aale",
    regionId: "jubada-dhexe",
    subDistricts: [
      { id: "buaale-centre", name: "Bu'aale Centre" },
      { id: "ceel-sheekh", name: "Ceel Sheekh" },
    ],
  },
  {
    id: "dujuma",
    name: "Dujuma",
    regionId: "jubada-dhexe",
    subDistricts: [
      { id: "dujuma-centre", name: "Dujuma Centre" },
      { id: "qoryooley", name: "Qoryooley" },
    ],
  },
  {
    id: "jilib",
    name: "Jilib",
    regionId: "jubada-dhexe",
    subDistricts: [
      { id: "jilib-centre", name: "Jilib Centre" },
      { id: "qansaxdheere", name: "Qansaxdheere" },
    ],
  },
  {
    id: "saakow",
    name: "Saakow",
    regionId: "jubada-dhexe",
    subDistricts: [
      { id: "saakow-centre", name: "Saakow Centre" },
      { id: "caluula", name: "Caluula" },
    ],
  },

  // Sanaag Region
  {
    id: "ceerigaabo",
    name: "Ceerigaabo",
    regionId: "sanaag",
    subDistricts: [
      { id: "ceerigaabo-centre", name: "Ceerigaabo Centre" },
      { id: "yadaaro", name: "Yadaaro" },
    ],
  },
  {
    id: "ceelafweyn",
    name: "Ceel Afweyn",
    regionId: "sanaag",
    subDistricts: [
      { id: "ceelafweyn-centre", name: "Ceel Afweyn Centre" },
      { id: "ceel-dheer", name: "Ceel Dheer" },
    ],
  },
  {
    id: "laasqoray",
    name: "Laasqoray",
    regionId: "sanaag",
    subDistricts: [
      { id: "laasqoray-centre", name: "Laasqoray Centre" },
      { id: "qalyo", name: "Qalyo" },
    ],
  },
  {
    id: "badhan",
    name: "Badhan",
    regionId: "sanaag",
    subDistricts: [
      { id: "badhan-centre", name: "Badhan Centre" },
      { id: "caluula", name: "Caluula" },
    ],
  },

  // Jubada Hoose Region
  {
    id: "kismaayo",
    name: "Kismaayo",
    regionId: "jubada-hoose",
    subDistricts: [
      { id: "kismaayo-centre", name: "Kismaayo Centre" },
      { id: "buulo-xawaadle", name: "Buulo Xawaadle" },
    ],
  },
  {
    id: "afmadow",
    name: "Afmadow",
    regionId: "jubada-hoose",
    subDistricts: [
      { id: "afmadow-centre", name: "Afmadow Centre" },
      { id: "ceel-waaq", name: "Ceel Waaq" },
    ],
  },
  {
    id: "badhaadhe",
    name: "Badhaadhe",
    regionId: "jubada-hoose",
    subDistricts: [
      { id: "badhaadhe-centre", name: "Badhaadhe Centre" },
      { id: "xagar", name: "Xagar" },
    ],
  },
  {
    id: "xagar",
    name: "Xagar",
    regionId: "jubada-hoose",
    subDistricts: [
      { id: "xagar-centre", name: "Xagar Centre" },
      { id: "buulo-bayle", name: "Buulo Bayle" },
    ],
  },
  {
    id: "jamaame",
    name: "Jamaame",
    regionId: "jubada-hoose",
    subDistricts: [
      { id: "jamaame-centre", name: "Jamaame Centre" },
      { id: "buulo-jamaame", name: "Buulo Jamaame" },
    ],
  },

  // Nugaal Region
  {
    id: "garowe",
    name: "Garoowe",
    regionId: "nugaal",
    subDistricts: [
      { id: "garowe-centre", name: "Garowe Centre" },
      { id: "xarfo", name: "Xarfo" },
    ],
  },
  {
    id: "dangorayo",
    name: "Dangorayo",
    regionId: "nugaal",
    subDistricts: [
      { id: "dangorayo-centre", name: "Dangorayo Centre" },
      { id: "burko", name: "Burko" },
    ],
  },
  {
    id: "ayl",
    name: "Ayl",
    regionId: "nugaal",
    subDistricts: [
      { id: "ayl-centre", name: "Ayl Centre" },
      { id: "ceel-cadde", name: "Ceel Cadde" },
    ],
  },
  {
    id: "burtinle",
    name: "Burtinle",
    regionId: "nugaal",
    subDistricts: [
      { id: "burtinle-centre", name: "Burtinle Centre" },
      { id: "ceel-gori", name: "Ceel Gori" },
    ],
  },
];
