// Retail points of "Галя Балувана" in Chernivtsi.
// Static data drives the /shops list, district filters, and interactive maps.

export interface Shop {
  id: string;
  city: string;
  district: string;
  address: string;
  hours: string;
  phone: string;
  features: string[];
  x: number; // relative map coordinate %
  y: number;
  isProduction: boolean; // cooking workshop behind glass on site
  mapQuery?: string;
}

export const shops: Shop[] = [
  {
    id: "cv-maidanu-57",
    city: "Чернівці",
    district: "Південний",
    address: "вул. Героїв Майдану, 57",
    hours: "Пн–Пт 09:00–21:00 · Сб–Нд 09:00–20:00",
    phone: "+380 97 775 69 42",
    features: ["Виробництво за склом", "Оплата карткою", "Зручний паркінг"],
    x: 48,
    y: 55,
    isProduction: true,
    mapQuery: "вулиця Героїв Майдану, 57, Чернівці",
  },
  {
    id: "cv-nezalezhnosti-52a",
    city: "Чернівці",
    district: "Проспект / Центр",
    address: "просп. Незалежності, 52А",
    hours: "Пн–Пт 09:00–21:00 · Сб–Нд 09:00–20:00",
    phone: "+380 99 015 61 88",
    features: ["Широкий асортимент", "Оплата карткою"],
    x: 52,
    y: 42,
    isProduction: false,
    mapQuery: "проспект Незалежності, 52А, Чернівці",
  },
  {
    id: "cv-entuziastiv-5a",
    city: "Чернівці",
    district: "Південний",
    address: "вул. Ентузіастів, 5-А",
    hours: "Пн–Пт 09:00–21:00 · Сб–Нд 09:00–20:00",
    phone: "+380 99 015 61 88",
    features: ["Виробництво за склом", "Оплата карткою"],
    x: 44,
    y: 62,
    isProduction: true,
    mapQuery: "вулиця Ентузіастів, 5А, Чернівці",
  },
  {
    id: "cv-ruska-219",
    city: "Чернівці",
    district: "Гравітон",
    address: "вул. Руська, 219",
    hours: "Пн–Пт 09:00–21:00 · Сб–Нд 09:00–20:00",
    phone: "+380 99 015 61 88",
    features: ["Оплата карткою", "Швидкий самовивіз"],
    x: 68,
    y: 35,
    isProduction: false,
    mapQuery: "вулиця Руська, 219, Чернівці",
  },
  {
    id: "cv-ruska-255",
    city: "Чернівці",
    district: "Гравітон",
    address: "вул. Руська, 255",
    hours: "Пн–Пт 09:00–21:00 · Сб–Нд 09:00–20:00",
    phone: "+380 99 015 61 88",
    features: ["Виробництво за склом", "Оплата карткою"],
    x: 74,
    y: 38,
    isProduction: true,
    mapQuery: "вулиця Руська, 255, Чернівці",
  },
  {
    id: "cv-shcherbaniuka-2",
    city: "Чернівці",
    district: "Центр",
    address: "вул. Олександра Щербанюка, 2",
    hours: "Пн–Пт 09:00–21:00 · Сб–Нд 09:00–20:00",
    phone: "+380 99 015 61 88",
    features: ["Центр міста", "Оплата карткою"],
    x: 49,
    y: 36,
    isProduction: false,
    mapQuery: "вулиця Олександра Щербанюка, 2, Чернівці",
  },
  {
    id: "cv-bukovynska-62a",
    city: "Чернівці",
    district: "Парк / Центр",
    address: "вул. Буковинська, 62А (ЖК «Компас»)",
    hours: "Пн–Пт 09:00–21:00 · Сб–Нд 09:00–20:00",
    phone: "+380 99 015 61 88",
    features: ["ЖК Компас", "Оплата карткою", "Паркінг"],
    x: 58,
    y: 40,
    isProduction: false,
    mapQuery: "вулиця Буковинська, 62А, Чернівці",
  },
  {
    id: "cv-holovna-226",
    city: "Чернівці",
    district: "Автовокзал / Депот",
    address: "вул. Головна, 226",
    hours: "Пн–Пт 09:00–21:00 · Сб–Нд 09:00–20:00",
    phone: "+380 99 015 61 88",
    features: ["Виробництво за склом", "Оплата карткою", "Паркінг"],
    x: 46,
    y: 70,
    isProduction: true,
    mapQuery: "вулиця Головна, 226, Чернівці",
  },
  {
    id: "cv-franka-26",
    city: "Чернівці",
    district: "Центр",
    address: "вул. Івана Франка, 26",
    hours: "Пн–Пт 09:00–21:00 · Сб–Нд 09:00–20:00",
    phone: "+380 99 015 61 88",
    features: ["Історичний центр", "Оплата карткою"],
    x: 50,
    y: 28,
    isProduction: false,
    mapQuery: "вулиця Івана Франка, 26, Чернівці",
  },
  {
    id: "cv-skalda-2a",
    city: "Чернівці",
    district: "Південний",
    address: "вул. Скальда, 2А",
    hours: "Пн–Пт 09:00–21:00 · Сб–Нд 09:00–20:00",
    phone: "+380 99 015 61 88",
    features: ["Оплата карткою", "Зручний заїзд"],
    x: 42,
    y: 52,
    isProduction: false,
    mapQuery: "вулиця Скальда, 2А, Чернівці",
  },
  {
    id: "cv-nebesnoi-sotni-18a",
    city: "Чернівці",
    district: "Центр / Парк Шевченка",
    address: "вул. Небесної Сотні, 18А",
    hours: "Пн–Пт 09:00–21:00 · Сб–Нд 09:00–20:00",
    phone: "+380 99 015 61 88",
    features: ["Виробництво за склом", "Оплата карткою"],
    x: 47,
    y: 38,
    isProduction: true,
    mapQuery: "вулиця Небесної Сотні, 18А, Чернівці",
  },
  {
    id: "cv-hertsena-9",
    city: "Чернівці",
    district: "Центр",
    address: "вул. Герцена, 9",
    hours: "Пн–Пт 09:00–21:00 · Сб–Нд 09:00–20:00",
    phone: "+380 99 015 61 88",
    features: ["Оплата карткою"],
    x: 53,
    y: 33,
    isProduction: false,
    mapQuery: "вулиця Герцена, 9, Чернівці",
  },
  {
    id: "cv-komarova-32",
    city: "Чернівці",
    district: "Південний",
    address: "вул. Комарова, 32",
    hours: "Пн–Пт 09:00–21:00 · Сб–Нд 09:00–20:00",
    phone: "+380 99 015 61 88",
    features: ["Оплата карткою", "Паркінг"],
    x: 41,
    y: 58,
    isProduction: false,
    mapQuery: "вулиця Комарова, 32, Чернівці",
  },
  {
    id: "cv-kalynivska-13v",
    city: "Чернівці",
    district: "Калинівський ринок",
    address: "вул. Калинівська, 13В",
    hours: "Вт–Нд 08:00–17:00 · Пн вихідний",
    phone: "+380 99 015 61 88",
    features: ["Ринок", "Оплата карткою"],
    x: 60,
    y: 18,
    isProduction: false,
    mapQuery: "вулиця Калинівська, 13В, Чернівці",
  },
];

// ---------- derivatives ----------

export const totalShops = shops.length;

export const districts = ["Усі райони", ...new Set(shops.map((s) => s.district))];

export const cities = [...new Set(shops.map((s) => s.city))];

export const totalCities = cities.length;

export interface CityWithCount {
  city: string;
  count: number;
  x: number;
  y: number;
  hasProduction: boolean;
}

export const citiesWithCounts: CityWithCount[] = [
  {
    city: "Чернівці",
    count: shops.length,
    x: 50,
    y: 50,
    hasProduction: shops.some((s) => s.isProduction),
  },
];

export const shopsByDistrict = (district: string) =>
  district === "Усі райони" ? shops : shops.filter((s) => s.district === district);

export const shopsByCity = (city: string) => shops.filter((s) => s.city === city);

export const getShop = (id: string) => shops.find((s) => s.id === id);

export const productionShops = shops.filter((s) => s.isProduction);
