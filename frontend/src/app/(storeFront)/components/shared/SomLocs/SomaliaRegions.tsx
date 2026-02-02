export type Region = {
  id: string;
  name: string;
};

export type City = {
  id: string;
  name: string;
  regionId: string;
};

export const regions: Region[] = [
  { id: "awdal", name: "Awdal" },
  { id: "hamar", name: "Hamar" },
  { id: "bari", name: "Bari" },
  { id: "bakool", name: "Bakool" },
  { id: "bay", name: "Bay" },
  { id: "galguduud", name: "Galguduud" },
  { id: "gedo", name: "Gedo" },
  { id: "hiiraan", name: "Hiiraan" },
  { id: "jubada-dhexe", name: "Jubada Dhexe" },
  { id: "jubada-hoose", name: "Jubada Hoose" },
  { id: "mudug", name: "Mudug" },
  { id: "nugaal", name: "Nugaal" },
  { id: "sanaag", name: "Sanaag" },
  { id: "shabeellaha-dhexe", name: "Shabeellaha Dhexe" },
  { id: "shabeellaha-hoose", name: "Shabeellaha Hoose" },
  { id: "sool", name: "Sool" },
  { id: "togdheer", name: "Togdheer" },
  { id: "wqdl", name: "Woqooyi Galbeed" },
];

export const cities: City[] = [
  // Awdal
  { id: "boorama", name: "Boorame", regionId: "awdal" },
  { id: "baki", name: "Baki", regionId: "awdal" },
  { id: "lughaya", name: "Lughaya", regionId: "awdal" },
  { id: "zaylac", name: "Zaylac", regionId: "awdal" },

  // Hamar (previously Banadir)
  { id: "cabdicasiis", name: "Cabdi Casiis", regionId: "hamar" },
  { id: "bondhere", name: "Bondhere", regionId: "hamar" },
  { id: "xamar-jajab", name: "Xamar Jajab", regionId: "hamar" },
  { id: "xamar-weyne", name: "Xamar Weyne", regionId: "hamar" },
  { id: "hawl-wadag", name: "Hawl Wadaag", regionId: "hamar" },
  { id: "heliwaa", name: "Heliwaa", regionId: "hamar" },
  { id: "hodan", name: "Hodan", regionId: "hamar" },
  { id: "karaan", name: "Karaan", regionId: "hamar" },
  { id: "shangaani", name: "Shangaani", regionId: "hamar" },
  { id: "shibis", name: "Shibis", regionId: "hamar" },
  { id: "waaberi", name: "Waaberi", regionId: "hamar" },
  { id: "wadajir", name: "Wadajir", regionId: "hamar" },
  { id: "wardhiigley", name: "Wardhiigley", regionId: "hamar" },
  { id: "yaaqshiid", name: "Yaaqshiid", regionId: "hamar" },
  { id: "dharkeynley", name: "Dharkeynley", regionId: "hamar" },

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

  // Woqooyi Galbeed (wqdl)
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
