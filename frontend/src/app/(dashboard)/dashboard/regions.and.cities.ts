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
  // Awdal
  { id: "boorama", name: "Boorame", regionId: "awdal" },
  { id: "baki", name: "Baki", regionId: "awdal" },
  { id: "lughaya", name: "Lughaya", regionId: "awdal" },
  { id: "zaylac", name: "Zaylac", regionId: "awdal" },

  // Banadir
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

  // Bari
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

  // Togdheer
  { id: "burco", name: "Burco", regionId: "togdheer" },
  { id: "buuhoodle", name: "Buuhoodle", regionId: "togdheer" },
  { id: "shiikh", name: "Shiikh", regionId: "togdheer" },
  { id: "oodweyne", name: "Oodweyne", regionId: "togdheer" },

  // Sool
  { id: "laas-caanood", name: "Laas Caanood", regionId: "sool" },
  { id: "caynabo", name: "Caynabo", regionId: "sool" },
  { id: "xudun", name: "Xudun", regionId: "sool" },
  { id: "taleex", name: "Taleex", regionId: "sool" },

  // Galguduud
  { id: "dhusamareb", name: "Dhusamareeb", regionId: "galguduud" },
  { id: "cadaado", name: "Cadaado", regionId: "galguduud" },
  { id: "ceelbuur", name: "Ceelbuur", regionId: "galguduud" },
  { id: "ceeldheer", name: "Ceeldheer", regionId: "galguduud" },
  { id: "caabud-waaq", name: "Caabud Waaq", regionId: "galguduud" },
  { id: "gel-hareeri", name: "Gel Hareeri", regionId: "galguduud" },

  // Hiiraan
  { id: "beletweyne", name: "Baladweyne", regionId: "hiiraan" },
  { id: "buula-barde", name: "Buula Barde", regionId: "hiiraan" },
  { id: "jalalaqsi", name: "Jalalaqsi", regionId: "hiiraan" },
  { id: "masax", name: "Masax", regionId: "hiiraan" },
  { id: "matabaan", name: "Matabaan", regionId: "hiiraan" },

  // Gedo
  { id: "garbahaarey", name: "Garbahaarey", regionId: "gedo" },
  { id: "baardheere", name: "Baardheere", regionId: "gedo" },
  { id: "beledxaawo", name: "Beled Xaawo", regionId: "gedo" },
  { id: "doolow", name: "Doolow", regionId: "gedo" },
  { id: "ceelwaaq", name: "Ceelwaaq", regionId: "gedo" },
  { id: "luuq", name: "Luuq", regionId: "gedo" },

  // Woqooyi Galbeed (WQDL)
  { id: "hargeysa", name: "Hargeysa", regionId: "wqdl" },
  { id: "dacar-budhuq", name: "Dacar Budhuq", regionId: "wqdl" },
  { id: "berbera", name: "Berbera", regionId: "wqdl" },
  { id: "gebilay", name: "Gebilay", regionId: "wqdl" },

  // Mudug
  { id: "galkacyo", name: "Gaalkacyo", regionId: "mudug" },
  { id: "galdogob", name: "Galdogob", regionId: "mudug" },
  { id: "xarardheere", name: "Xarardheere", regionId: "mudug" },
  { id: "hobyo", name: "Hobyo", regionId: "mudug" },
  { id: "jiriiban", name: "Jiriiban", regionId: "mudug" },

  // Shabeellaha Dhexe
  { id: "jowhar", name: "Jowhar", regionId: "shabeellaha-dhexe" },
  { id: "balcad", name: "Balcad", regionId: "shabeellaha-dhexe" },
  { id: "mahadaay", name: "Mahadaay", regionId: "shabeellaha-dhexe" },
  { id: "cadale", name: "Cadale", regionId: "shabeellaha-dhexe" },
  { id: "aadan-yabaal", name: "Aadan Yabaal", regionId: "shabeellaha-dhexe" },
  { id: "warshiikh", name: "Warshiikh", regionId: "shabeellaha-dhexe" },
  { id: "run-rugood", name: "Run Rugood", regionId: "shabeellaha-dhexe" },

  // Shabeellaha Hoose
  { id: "marka", name: "Marka", regionId: "shabeellaha-hoose" },
  { id: "afgooye", name: "Afgooye", regionId: "shabeellaha-hoose" },
  { id: "awdhiigle", name: "Aw-dhiigle", regionId: "shabeellaha-hoose" },
  { id: "baraawe", name: "Baraawe", regionId: "shabeellaha-hoose" },
  { id: "kuntiwaarey", name: "Kuntiwaarey", regionId: "shabeellaha-hoose" },
  { id: "qoryooley", name: "Qoryooley", regionId: "shabeellaha-hoose" },
  { id: "sablaale", name: "Sablaale", regionId: "shabeellaha-hoose" },

  // Bay
  { id: "baydhabo", name: "Baydhabo", regionId: "bay" },
  { id: "buurxakabo", name: "Buurxakabo", regionId: "bay" },
  { id: "diinsoor", name: "Diinsoor", regionId: "bay" },
  { id: "qansaxdheere", name: "Qansaxdheere", regionId: "bay" },
  { id: "bardaale", name: "Bardaale", regionId: "bay" },

  // Bakool
  { id: "xudur", name: "Xudur", regionId: "bakool" },
  { id: "ceelbarde", name: "Ceelbarde", regionId: "bakool" },
  { id: "rabdhure", name: "Rab Dhure", regionId: "bakool" },
  { id: "tiyeglow", name: "Tiyeglow", regionId: "bakool" },
  { id: "biyooley", name: "Biyooley", regionId: "bakool" },

  // Jubada Dhexe
  { id: "buaale", name: "Bu'aale", regionId: "jubada-dhexe" },
  { id: "dujuma", name: "Dujuma", regionId: "jubada-dhexe" },
  { id: "jilib", name: "Jilib", regionId: "jubada-dhexe" },
  { id: "saakow", name: "Saakow", regionId: "jubada-dhexe" },

  // Sanaag
  { id: "ceerigaabo", name: "Ceerigaabo", regionId: "sanaag" },
  { id: "ceelafweyn", name: "Ceel Afweyn", regionId: "sanaag" },
  { id: "laasqoray", name: "Laasqoray", regionId: "sanaag" },
  { id: "badhan", name: "Badhan", regionId: "sanaag" },

  // Jubada Hoose
  { id: "kismaayo", name: "Kismaayo", regionId: "jubada-hoose" },
  { id: "afmadow", name: "Afmadow", regionId: "jubada-hoose" },
  { id: "badhaadhe", name: "Badhaadhe", regionId: "jubada-hoose" },
  { id: "xagar", name: "Xagar", regionId: "jubada-hoose" },
  { id: "jamaame", name: "Jamaame", regionId: "jubada-hoose" },

  // Nugaal
  { id: "garowe", name: "Garoowe", regionId: "nugaal" },
  { id: "dangorayo", name: "Dangorayo", regionId: "nugaal" },
  { id: "ayl", name: "Ayl", regionId: "nugaal" },
  { id: "burtinle", name: "Burtinle", regionId: "nugaal" },
];

// Districts can be rebuilt similarly if you want the full list.
