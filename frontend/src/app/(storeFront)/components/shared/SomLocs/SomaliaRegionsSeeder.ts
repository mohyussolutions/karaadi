export type Region = {
  id: string;
  name: string;
  icon?: string;
};

export type City = {
  id: string;
  name: string;
  regionId: string;
};

export const regions: Region[] = [
  { id: "awdal",              name: "Awdal",              icon: "🏔️" },
  { id: "hamar",              name: "Hamar",              icon: "🏙️" },
  { id: "bari",               name: "Bari",               icon: "⚓" },
  { id: "bakool",             name: "Bakool",             icon: "🌾" },
  { id: "bay",                name: "Bay",                icon: "🌿" },
  { id: "galguduud",          name: "Galguduud",          icon: "🏜️" },
  { id: "gedo",               name: "Gedo",               icon: "🌄" },
  { id: "hiiraan",            name: "Hiiraan",            icon: "🌊" },
  { id: "jubada-dhexe",       name: "Jubada Dhexe",       icon: "🌲" },
  { id: "jubada-hoose",       name: "Jubada Hoose",       icon: "🌴" },
  { id: "mudug",              name: "Mudug",              icon: "🏕️" },
  { id: "nugaal",             name: "Nugaal",             icon: "⛰️" },
  { id: "sanaag",             name: "Sanaag",             icon: "🗻" },
  { id: "shabeellaha-dhexe",  name: "Shabeellaha Dhexe",  icon: "💧" },
  { id: "shabeellaha-hoose",  name: "Shabeellaha Hoose",  icon: "🌊" },
  { id: "sool",               name: "Sool",               icon: "🏞️" },
  { id: "togdheer",           name: "Togdheer",           icon: "🌱" },
  { id: "wqdl",               name: "Woqooyi Galbeed",   icon: "🌅" },
];

export const cities: City[] = [
  { id: "boorama",        name: "Boorame",       regionId: "awdal" },
  { id: "baki",           name: "Baki",          regionId: "awdal" },
  { id: "lughaya",        name: "Lughaya",       regionId: "awdal" },
  { id: "zaylac",         name: "Zaylac",        regionId: "awdal" },

  { id: "cabdicasiis",    name: "Cabdi Casiis",  regionId: "hamar" },
  { id: "bondhere",       name: "Bondhere",      regionId: "hamar" },
  { id: "xamar-jajab",    name: "Xamar Jajab",   regionId: "hamar" },
  { id: "xamar-weyne",    name: "Xamar Weyne",   regionId: "hamar" },
  { id: "hawl-wadag",     name: "Hawl Wadaag",   regionId: "hamar" },
  { id: "heliwaa",        name: "Heliwaa",       regionId: "hamar" },
  { id: "hodan",          name: "Hodan",         regionId: "hamar" },
  { id: "karaan",         name: "Karaan",        regionId: "hamar" },
  { id: "shangaani",      name: "Shangaani",     regionId: "hamar" },
  { id: "shibis",         name: "Shibis",        regionId: "hamar" },
  { id: "waaberi",        name: "Waaberi",       regionId: "hamar" },
  { id: "wadajir",        name: "Wadajir",       regionId: "hamar" },
  { id: "wardhiigley",    name: "Wardhiigley",   regionId: "hamar" },
  { id: "yaaqshiid",      name: "Yaaqshiid",     regionId: "hamar" },
  { id: "dharkeynley",    name: "Dharkeynley",   regionId: "hamar" },

  { id: "bosaso",         name: "Boosaaso",      regionId: "bari" },
  { id: "caluula",        name: "Caluula",       regionId: "bari" },
  { id: "badarbeyla",     name: "Badarbeyla",    regionId: "bari" },
  { id: "rako",           name: "Rako",          regionId: "bari" },
  { id: "ufayn",          name: "Ufayn",         regionId: "bari" },
  { id: "waaciya",        name: "Waaciya",       regionId: "bari" },
  { id: "qandala",        name: "Qandala",       regionId: "bari" },
  { id: "qardho",         name: "Qardho",        regionId: "bari" },
  { id: "xaafuun",        name: "Xaafuun",       regionId: "bari" },
  { id: "isku-shuban",    name: "Isku Shuban",   regionId: "bari" },

  { id: "burco",          name: "Burco",         regionId: "togdheer" },
  { id: "buuhoodle",      name: "Buuhoodle",     regionId: "togdheer" },
  { id: "shiikh",         name: "Shiikh",        regionId: "togdheer" },
  { id: "oodweyne",       name: "Oodweyne",      regionId: "togdheer" },

  { id: "laas-caanood",   name: "Laas Caanood",  regionId: "sool" },
  { id: "caynabo",        name: "Caynabo",       regionId: "sool" },
  { id: "xudun",          name: "Xudun",         regionId: "sool" },
  { id: "taleex",         name: "Taleex",        regionId: "sool" },

  { id: "dhusamareb",     name: "Dhusamareeb",   regionId: "galguduud" },
  { id: "cadaado",        name: "Cadaado",       regionId: "galguduud" },
  { id: "ceelbuur",       name: "Ceelbuur",      regionId: "galguduud" },
  { id: "ceeldheer",      name: "Ceeldheer",     regionId: "galguduud" },
  { id: "caabud-waaq",    name: "Caabud Waaq",   regionId: "galguduud" },
  { id: "gel-hareeri",    name: "Gel Hareeri",   regionId: "galguduud" },

  { id: "beletweyne",     name: "Baladweyne",    regionId: "hiiraan" },
  { id: "buula-barde",    name: "Buula Barde",   regionId: "hiiraan" },
  { id: "jalalaqsi",      name: "Jalalaqsi",     regionId: "hiiraan" },
  { id: "masax",          name: "Masax",         regionId: "hiiraan" },
  { id: "matabaan",       name: "Matabaan",      regionId: "hiiraan" },

  { id: "garbahaarey",    name: "Garbahaarey",   regionId: "gedo" },
  { id: "baardheere",     name: "Baardheere",    regionId: "gedo" },
  { id: "beledxaawo",     name: "Beled Xaawo",   regionId: "gedo" },
  { id: "doolow",         name: "Doolow",        regionId: "gedo" },
  { id: "ceelwaaq",       name: "Ceelwaaq",      regionId: "gedo" },
  { id: "luuq",           name: "Luuq",          regionId: "gedo" },

  { id: "hargeysa",       name: "Hargeysa",      regionId: "wqdl" },
  { id: "dacar-budhuq",   name: "Dacar Budhuq",  regionId: "wqdl" },
  { id: "berbera",        name: "Berbera",       regionId: "wqdl" },
  { id: "gebilay",        name: "Gebilay",       regionId: "wqdl" },

  { id: "galkacyo",       name: "Gaalkacyo",     regionId: "mudug" },
  { id: "galdogob",       name: "Galdogob",      regionId: "mudug" },
  { id: "xarardheere",    name: "Xarardheere",   regionId: "mudug" },
  { id: "hobyo",          name: "Hobyo",         regionId: "mudug" },
  { id: "jiriiban",       name: "Jiriiban",      regionId: "mudug" },

  { id: "jowhar",         name: "Jowhar",        regionId: "shabeellaha-dhexe" },
  { id: "balcad",         name: "Balcad",        regionId: "shabeellaha-dhexe" },
  { id: "mahadaay",       name: "Mahadaay",      regionId: "shabeellaha-dhexe" },
  { id: "cadale",         name: "Cadale",        regionId: "shabeellaha-dhexe" },
  { id: "aadan-yabaal",   name: "Aadan Yabaal",  regionId: "shabeellaha-dhexe" },
  { id: "warshiikh",      name: "Warshiikh",     regionId: "shabeellaha-dhexe" },
  { id: "run-rugood",     name: "Run Rugood",    regionId: "shabeellaha-dhexe" },

  { id: "marka",          name: "Marka",         regionId: "shabeellaha-hoose" },
  { id: "afgooye",        name: "Afgooye",       regionId: "shabeellaha-hoose" },
  { id: "awdhiigle",      name: "Aw-dhiigle",    regionId: "shabeellaha-hoose" },
  { id: "baraawe",        name: "Baraawe",       regionId: "shabeellaha-hoose" },
  { id: "kuntiwaarey",    name: "Kuntiwaarey",   regionId: "shabeellaha-hoose" },
  { id: "qoryooley",      name: "Qoryooley",     regionId: "shabeellaha-hoose" },
  { id: "sablaale",       name: "Sablaale",      regionId: "shabeellaha-hoose" },

  { id: "baydhabo",       name: "Baydhabo",      regionId: "bay" },
  { id: "buurxakabo",     name: "Buurxakabo",    regionId: "bay" },
  { id: "diinsoor",       name: "Diinsoor",      regionId: "bay" },
  { id: "qansaxdheere",   name: "Qansaxdheere",  regionId: "bay" },

  { id: "xudur",          name: "Xudur",         regionId: "bakool" },
  { id: "ceelbarde",      name: "Ceelbarde",     regionId: "bakool" },
  { id: "rabdhure",       name: "Rab Dhure",     regionId: "bakool" },
  { id: "tiyeglow",       name: "Tiyeglow",      regionId: "bakool" },
  { id: "biyooley",       name: "Biyooley",      regionId: "bakool" },

  { id: "buaale",         name: "Bu'aale",       regionId: "jubada-dhexe" },
  { id: "dujuma",         name: "Dujuma",        regionId: "jubada-dhexe" },
  { id: "jilib",          name: "Jilib",         regionId: "jubada-dhexe" },
  { id: "saakow",         name: "Saakow",        regionId: "jubada-dhexe" },

  { id: "ceerigaabo",     name: "Ceerigaabo",    regionId: "sanaag" },
  { id: "ceelafweyn",     name: "Ceel Afweyn",   regionId: "sanaag" },
  { id: "laasqoray",      name: "Laasqoray",     regionId: "sanaag" },
  { id: "badhan",         name: "Badhan",        regionId: "sanaag" },

  { id: "kismaayo",       name: "Kismaayo",      regionId: "jubada-hoose" },
  { id: "afmadow",        name: "Afmadow",       regionId: "jubada-hoose" },
  { id: "badhaadhe",      name: "Badhaadhe",     regionId: "jubada-hoose" },
  { id: "xagar",          name: "Xagar",         regionId: "jubada-hoose" },
  { id: "jamaame",        name: "Jamaame",       regionId: "jubada-hoose" },

  { id: "garowe",         name: "Garoowe",       regionId: "nugaal" },
  { id: "dangorayo",      name: "Dangorayo",     regionId: "nugaal" },
  { id: "ayl",            name: "Ayl",           regionId: "nugaal" },
  { id: "burtinle",       name: "Burtinle",      regionId: "nugaal" },
];
