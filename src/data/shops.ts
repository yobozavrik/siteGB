// Retail points of "Галя Балувана". Static data drives both the /shops list and
// the hand-drawn SVG map of Ukraine (x/y are percentages on that map).
//
// NOTE: addresses/phones below are representative placeholders for layout — verify
// against the real network before production. See README.

export interface Shop {
  id: string;
  city: string;
  district?: string;
  address: string;
  hours: string;
  phone: string;
  features: string[];
  x: number; // % on the SVG map
  y: number;
  isProduction: boolean; // cooking workshop behind glass on site
}

export const shops: Shop[] = [
  // ---- Київ ----
  {
    id: "kyiv-pozniaky",
    city: "Київ", district: "Позняки",
    address: "вул. Анни Ахматової, 22",
    hours: "Щодня 09:00–21:00",
    phone: "+380 73 200 00 47",
    features: ["Виробництво за склом", "Паркінг", "Оплата карткою"],
    x: 51, y: 30, isProduction: true,
  },
  {
    id: "kyiv-nauky",
    city: "Київ", district: "Голосіїв",
    address: "просп. Науки, 54",
    hours: "Щодня 09:00–21:00",
    phone: "+380 73 200 00 48",
    features: ["Виробництво за склом", "Самовивіз за 30 хв"],
    x: 49, y: 31, isProduction: true,
  },
  {
    id: "kyiv-obolon",
    city: "Київ", district: "Оболонь",
    address: "просп. Оболонський, 16",
    hours: "Щодня 09:00–22:00",
    phone: "+380 73 200 00 49",
    features: ["Паркінг", "Оплата карткою"],
    x: 50, y: 28, isProduction: false,
  },
  {
    id: "kyiv-troieshchyna",
    city: "Київ", district: "Троєщина",
    address: "вул. Драйзера, 8",
    hours: "Щодня 09:00–21:00",
    phone: "+380 73 200 00 50",
    features: ["Виробництво за склом"],
    x: 52, y: 29, isProduction: true,
  },

  // ---- Львів ----
  {
    id: "lviv-center",
    city: "Львів", district: "Галицький р-н",
    address: "вул. Городоцька, 108",
    hours: "Пн–Сб 09:00–21:00 · Нд 10:00–20:00",
    phone: "+380 73 210 00 12",
    features: ["Виробництво за склом", "Оплата карткою"],
    x: 18, y: 32, isProduction: true,
  },
  {
    id: "lviv-sykhiv",
    city: "Львів", district: "Сихів",
    address: "просп. Червоної Калини, 62",
    hours: "Щодня 09:00–21:00",
    phone: "+380 73 210 00 13",
    features: ["Паркінг", "Самовивіз за 30 хв"],
    x: 19, y: 33, isProduction: false,
  },

  // ---- Одеса ----
  {
    id: "odesa-tairova",
    city: "Одеса", district: "Таїрова",
    address: "вул. Академіка Корольова, 33",
    hours: "Щодня 09:00–21:00",
    phone: "+380 73 220 00 21",
    features: ["Виробництво за склом", "Паркінг"],
    x: 40, y: 72, isProduction: true,
  },
  {
    id: "odesa-center",
    city: "Одеса", district: "Приморський р-н",
    address: "вул. Пантелеймонівська, 25",
    hours: "Щодня 09:00–21:00",
    phone: "+380 73 220 00 22",
    features: ["Оплата карткою"],
    x: 41, y: 73, isProduction: false,
  },

  // ---- Дніпро ----
  {
    id: "dnipro-center",
    city: "Дніпро", district: "Центр",
    address: "просп. Дмитра Яворницького, 67",
    hours: "Щодня 09:00–21:00",
    phone: "+380 73 230 00 31",
    features: ["Виробництво за склом", "Оплата карткою"],
    x: 64, y: 52, isProduction: true,
  },
  {
    id: "dnipro-pobeda",
    city: "Дніпро", district: "Перемога",
    address: "вул. Набережна Перемоги, 42",
    hours: "Щодня 09:00–21:00",
    phone: "+380 73 230 00 32",
    features: ["Паркінг"],
    x: 65, y: 53, isProduction: false,
  },

  // ---- Харків ----
  {
    id: "kharkiv-center",
    city: "Харків", district: "Нагірний р-н",
    address: "вул. Сумська, 78",
    hours: "Щодня 09:00–21:00",
    phone: "+380 73 240 00 41",
    features: ["Виробництво за склом", "Оплата карткою"],
    x: 75, y: 28, isProduction: true,
  },
  {
    id: "kharkiv-saltivka",
    city: "Харків", district: "Салтівка",
    address: "просп. Тракторобудівників, 94",
    hours: "Щодня 09:00–21:00",
    phone: "+380 73 240 00 42",
    features: ["Самовивіз за 30 хв"],
    x: 76, y: 27, isProduction: false,
  },

  // ---- Вінниця ----
  {
    id: "vinnytsia-center",
    city: "Вінниця", district: "Замостя",
    address: "вул. Келецька, 51",
    hours: "Пн–Сб 09:00–21:00 · Нд 10:00–20:00",
    phone: "+380 73 250 00 51",
    features: ["Виробництво за склом"],
    x: 33, y: 40, isProduction: true,
  },

  // ---- Полтава ----
  {
    id: "poltava-center",
    city: "Полтава", district: "Центр",
    address: "вул. Соборності, 45",
    hours: "Щодня 09:00–21:00",
    phone: "+380 73 260 00 61",
    features: ["Оплата карткою", "Самовивіз за 30 хв"],
    x: 65, y: 35, isProduction: false,
  },
];

// ---------- derivatives ----------

export const totalShops = shops.length;

export const cities = [...new Set(shops.map((s) => s.city))];

export const totalCities = cities.length;

export interface CityWithCount {
  city: string;
  count: number;
  x: number;
  y: number;
  hasProduction: boolean;
}

export const citiesWithCounts: CityWithCount[] = cities.map((city) => {
  const cityShops = shops.filter((s) => s.city === city);
  return {
    city,
    count: cityShops.length,
    x: cityShops[0].x,
    y: cityShops[0].y,
    hasProduction: cityShops.some((s) => s.isProduction),
  };
});

export const shopsByCity = (city: string) => shops.filter((s) => s.city === city);

export const getShop = (id: string) => shops.find((s) => s.id === id);

export const productionShops = shops.filter((s) => s.isProduction);
