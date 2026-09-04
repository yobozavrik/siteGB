// Static product catalogue. Categories follow the official galia-baluvana.com
// grouping (Гомілки-Нагетси, Млинці-Вареники, …). Product names follow the real
// franchise menu.
//
// Composition / KBJU / cooking / storage / allergens are sensible defaults —
// VERIFY against the official product spec before production. Photos are
// placeholders until the franchise photo pack is added under public/img/products/.

export type ProductTag = "hit" | "new" | "lenten" | "spicy";

export interface Category {
  slug: string;
  title: string;
  blurb: string;
  sort: number;
}

export interface Kbju {
  kcal: number;
  protein: number;
  fat: number;
  carb: number;
}

export interface Product {
  id: string;
  slug: string;
  categorySlug: string;
  title: string;
  weightGrams: number;
  unitLabel: string;
  priceUAH: number;
  tags: ProductTag[];
  composition: string;
  kbju: Kbju; // per 100 g
  cooking: string;
  storage: string;
  allergens: string;
  images: string[];
  isActive: boolean;
}

export const TAG_LABELS: Record<ProductTag, string> = {
  hit: "Хіт",
  new: "Новинка",
  lenten: "Пісне",
  spicy: "Гостре",
};

// Categories as grouped on the official galia-baluvana.com site.
export const categories: Category[] = [
  { slug: "homilky", title: "Гомілки-Нагетси", blurb: "Курячі гомілки, нагетси та стріпси в паніровці.", sort: 1 },
  { slug: "mlyntsi-vareniki", title: "Млинці-Вареники", blurb: "Вареники й тонкі млинці — солоні та солодкі.", sort: 2 },
  { slug: "kartoplyani", title: "Картопляні вироби", blurb: "Зрази, деруни, картопляники.", sort: 3 },
  { slug: "kovbasy", title: "Ковбаси та паштет", blurb: "Домашні ковбаски, ковбаса та паштет.", sort: 4 },
  { slug: "kotlety", title: "Котлети та тефтелі", blurb: "Рублені та січені, готові до сковороди.", sort: 5 },
  { slug: "golubtsi", title: "Голубці та перець", blurb: "Загорнуті руками, з м'ясом або пісні.", sort: 6 },
  { slug: "pelmeni", title: "Пельмені та хінкалі", blurb: "Тонке тісто, соковита начинка, ручне защипування.", sort: 7 },
  { slug: "pizza-pyrohy", title: "Піца та пироги", blurb: "Піца, чебуреки, штруделі та солодка випічка.", sort: 8 },
  { slug: "syrnyky", title: "Сирники", blurb: "З домашнього кисломолочного сиру.", sort: 9 },
  { slug: "gotovi", title: "Готові страви", blurb: "Супи, лазаньї, кіші, набори та морозиво.", sort: 10 },
];

const PH: string[] = []; // no photo yet → productImage() falls back to /placeholder.svg

export const products: Product[] = [
  // ---------- Гомілки-Нагетси ----------
  {
    id: "homilky-panirovka", slug: "homilky-kuryachi-v-panirovtsi", categorySlug: "homilky",
    title: "Гомілки курячі в паніровці", weightGrams: 700, unitLabel: "упаковка 0,7 кг",
    priceUAH: 289, tags: ["hit"],
    composition: "Гомілки курячі, борошно, яйце, панірувальні сухарі, часник, паприка, сіль, перець.",
    kbju: { kcal: 224, protein: 17, fat: 14, carb: 8 },
    cooking: "Смажити у фритюрі 6–8 хв або запекти в духовці 200 °C 30 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), яйця.",
    images: PH, isActive: true,
  },
  {
    id: "nagetsy-kuryachi", slug: "nagetsy-kuryachi", categorySlug: "homilky",
    title: "Нагетси курячі", weightGrams: 500, unitLabel: "упаковка 0,5 кг",
    priceUAH: 219, tags: [],
    composition: "Філе куряче, борошно, яйце, панірувальні сухарі, сіль, спеції.",
    kbju: { kcal: 236, protein: 15, fat: 13, carb: 14 },
    cooking: "Смажити у фритюрі 3–4 хв або запекти 200 °C 15–18 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), яйця.",
    images: PH, isActive: true,
  },
  {
    id: "strypsy-kuryachi", slug: "strypsy-kuryachi", categorySlug: "homilky",
    title: "Стріпси курячі", weightGrams: 500, unitLabel: "упаковка 0,5 кг",
    priceUAH: 239, tags: [],
    composition: "Філе куряче (смужки), кляр (борошно, спеції), панірувальні сухарі, сіль, паприка.",
    kbju: { kcal: 232, protein: 16, fat: 12, carb: 15 },
    cooking: "Смажити у фритюрі 3–4 хв або запекти 200 °C 15 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), яйця.",
    images: PH, isActive: true,
  },
  {
    id: "kryltsya-bbq", slug: "kryltsya-bbq", categorySlug: "homilky",
    title: "Крильця курячі BBQ", weightGrams: 700, unitLabel: "упаковка 0,7 кг",
    priceUAH: 269, tags: ["spicy"],
    composition: "Крила курячі, соус BBQ, часник, паприка копчена, соєвий соус, мед, сіль, перець.",
    kbju: { kcal: 214, protein: 16, fat: 14, carb: 6 },
    cooking: "Запекти в духовці 200 °C 30–35 хв або на грилі 20 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Соя. Може містити глютен.",
    images: PH, isActive: true,
  },

  // ---------- Млинці-Вареники ----------
  {
    id: "vareniki-kartoplya", slug: "vareniki-z-kartopleyu", categorySlug: "mlyntsi-vareniki",
    title: "Вареники з картоплею", weightGrams: 900, unitLabel: "упаковка 0,9 кг",
    priceUAH: 199, tags: ["lenten"],
    composition: "Борошно пшеничне в/ґ, картопля, цибуля смажена, олія соняшникова, сіль, перець чорний, вода.",
    kbju: { kcal: 198, protein: 5, fat: 4, carb: 35 },
    cooking: "Не розморожуючи, вкинути в підсолений окріп, варити 5–7 хв після спливання.",
    storage: "Зберігати за −18 °C до 30 діб. Повторне заморожування не допускається.",
    allergens: "Глютен (пшениця).",
    images: PH, isActive: true,
  },
  {
    id: "vareniki-kartoplya-gryby", slug: "vareniki-z-kartopleyu-ta-grybamy", categorySlug: "mlyntsi-vareniki",
    title: "Вареники з картоплею та грибами", weightGrams: 900, unitLabel: "упаковка 0,9 кг",
    priceUAH: 229, tags: ["hit", "lenten"],
    composition: "Борошно пшеничне в/ґ, картопля, печериці, цибуля смажена, олія соняшникова, сіль, перець, вода.",
    kbju: { kcal: 198, protein: 5, fat: 4, carb: 34 },
    cooking: "У підсолений окріп на 5–7 хв після спливання. Подавати зі смаженою цибулею або сметаною.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця).",
    images: PH, isActive: true,
  },
  {
    id: "vareniki-shpynat-syr", slug: "vareniki-zi-shpynatom-i-solonym-syrom", categorySlug: "mlyntsi-vareniki",
    title: "Вареники зі шпинатом і солоним сиром", weightGrams: 700, unitLabel: "упаковка 0,7 кг",
    priceUAH: 269, tags: [],
    composition: "Борошно пшеничне в/ґ, шпинат, сир кисломолочний, бринза, яйце, цибуля, сіль, вода.",
    kbju: { kcal: 212, protein: 10, fat: 6, carb: 29 },
    cooking: "У підсолений окріп на 4–5 хв після спливання. Подавати зі сметаною.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "vareniki-kapusta", slug: "vareniki-z-kapustoyu", categorySlug: "mlyntsi-vareniki",
    title: "Вареники з тушкованою капустою", weightGrams: 900, unitLabel: "упаковка 0,9 кг",
    priceUAH: 199, tags: ["lenten"],
    composition: "Борошно пшеничне в/ґ, капуста білоголова, морква, цибуля, томатна паста, олія соняшникова, сіль, вода.",
    kbju: { kcal: 176, protein: 4, fat: 3, carb: 33 },
    cooking: "Варити 6–7 хв після спливання в підсоленій воді.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця).",
    images: PH, isActive: true,
  },
  {
    id: "vareniki-syr", slug: "vareniki-z-solonym-syrom", categorySlug: "mlyntsi-vareniki",
    title: "Вареники з солоним сиром", weightGrams: 700, unitLabel: "упаковка 0,7 кг",
    priceUAH: 239, tags: [],
    composition: "Борошно пшеничне в/ґ, сир кисломолочний, яйце, цибуля зелена, сіль, вода.",
    kbju: { kcal: 216, protein: 10, fat: 6, carb: 29 },
    cooking: "У підсолений окріп на 4–5 хв після спливання. Подавати зі сметаною.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "vareniki-vyshnya", slug: "vareniki-z-vyshneyu", categorySlug: "mlyntsi-vareniki",
    title: "Вареники з вишнею", weightGrams: 700, unitLabel: "упаковка 0,7 кг",
    priceUAH: 249, tags: ["hit"],
    composition: "Борошно пшеничне в/ґ, вишня без кісточки, цукор, крохмаль кукурудзяний, вода.",
    kbju: { kcal: 224, protein: 4, fat: 2, carb: 47 },
    cooking: "Варити 4–5 хв після спливання. Подавати з цукром і сметаною.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця).",
    images: PH, isActive: true,
  },
  {
    id: "vareniki-polunytsya", slug: "vareniki-z-polunytseyu", categorySlug: "mlyntsi-vareniki",
    title: "Вареники з полуницею", weightGrams: 700, unitLabel: "упаковка 0,7 кг",
    priceUAH: 269, tags: ["new"],
    composition: "Борошно пшеничне в/ґ, полуниця, цукор, крохмаль кукурудзяний, вода.",
    kbju: { kcal: 218, protein: 4, fat: 2, carb: 46 },
    cooking: "Варити 4–5 хв після спливання.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця).",
    images: PH, isActive: true,
  },
  {
    id: "mlyntsi-kurka-gryby", slug: "mlyntsi-z-kurkoyu-ta-grybamy", categorySlug: "mlyntsi-vareniki",
    title: "Млинці з куркою та грибами", weightGrams: 500, unitLabel: "упаковка 0,5 кг · 5 шт",
    priceUAH: 329, tags: [],
    composition: "Борошно пшеничне, молоко, яйце, філе куряче, печериці, цибуля, олія, сіль, перець.",
    kbju: { kcal: 208, protein: 11, fat: 9, carb: 21 },
    cooking: "Обсмажити на розігрітій сковороді по 2–3 хв з кожного боку до золотистого кольору.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "mlyntsi-kurka-syr", slug: "mlyntsi-z-kurkoyu-ta-syrom", categorySlug: "mlyntsi-vareniki",
    title: "Млинці з куркою та сиром", weightGrams: 500, unitLabel: "упаковка 0,5 кг · 5 шт",
    priceUAH: 329, tags: [],
    composition: "Борошно пшеничне, молоко, яйце, філе куряче, сир твердий, цибуля, олія, сіль.",
    kbju: { kcal: 224, protein: 12, fat: 11, carb: 20 },
    cooking: "Обсмажити на сковороді по 3 хв з кожного боку до розтоплення сиру.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "mlyntsi-shpynat-krem-syr", slug: "mlyntsi-shpynatni-z-krem-syrom", categorySlug: "mlyntsi-vareniki",
    title: "Млинці шпинатні з крем-сиром", weightGrams: 500, unitLabel: "упаковка 0,5 кг · 5 шт",
    priceUAH: 339, tags: ["new"],
    composition: "Борошно пшеничне, шпинат, молоко, яйце, крем-сир, зелень, олія, сіль.",
    kbju: { kcal: 198, protein: 8, fat: 10, carb: 19 },
    cooking: "Розігріти на сковороді під кришкою 5–6 хв або в духовці 180 °C 10 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "mlyntsi-polunytsya-syr", slug: "mlyntsi-z-polunytseyu-i-syrom", categorySlug: "mlyntsi-vareniki",
    title: "Млинці з полуницею і сиром", weightGrams: 500, unitLabel: "упаковка 0,5 кг · 5 шт",
    priceUAH: 299, tags: [],
    composition: "Борошно пшеничне, молоко, яйце, сир кисломолочний, полуниця, цукор, ванілін, олія.",
    kbju: { kcal: 216, protein: 9, fat: 7, carb: 30 },
    cooking: "Розігріти на сковороді під кришкою 5–6 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "mlyntsi-mak-vyshnya", slug: "mlyntsi-z-makom-ta-vyshneyu", categorySlug: "mlyntsi-vareniki",
    title: "Млинці з маком та вишнею", weightGrams: 500, unitLabel: "упаковка 0,5 кг · 5 шт",
    priceUAH: 319, tags: [],
    composition: "Борошно пшеничне, молоко, яйце, мак, вишня, цукор, ванілін, олія.",
    kbju: { kcal: 228, protein: 7, fat: 9, carb: 31 },
    cooking: "Розігріти на сковороді під кришкою 5–6 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "bendaryky-kurka-motsarela", slug: "bendaryky-z-kurkoyu-ta-motsareloyu", categorySlug: "mlyntsi-vareniki",
    title: "Бендерики з куркою та моцарелою", weightGrams: 500, unitLabel: "упаковка 0,5 кг",
    priceUAH: 359, tags: [],
    composition: "Млинцеве тісто (борошно, молоко, яйце), філе куряче, сир моцарела, цибуля, олія, сіль, перець.",
    kbju: { kcal: 232, protein: 13, fat: 12, carb: 19 },
    cooking: "Обсмажити на сковороді по 3 хв з кожного боку до золотистого кольору.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },

  // ---------- Картопляні вироби ----------
  {
    id: "zrazy-myaso", slug: "kartoplyani-zrazy-z-myasom", categorySlug: "kartoplyani",
    title: "Картопляні зрази з м'ясом", weightGrams: 700, unitLabel: "упаковка 0,7 кг",
    priceUAH: 289, tags: ["hit"],
    composition: "Картопля, борошно, яйце, свинина, яловичина, цибуля, олія, сіль, перець.",
    kbju: { kcal: 188, protein: 8, fat: 8, carb: 22 },
    cooking: "Обсмажити на сковороді по 4 хв з кожного боку до золотистої скоринки.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), яйця.",
    images: PH, isActive: true,
  },
  {
    id: "zrazy-kapusta", slug: "kartoplyani-zrazy-z-kapustoyu", categorySlug: "kartoplyani",
    title: "Картопляні зрази з капустою", weightGrams: 700, unitLabel: "упаковка 0,7 кг",
    priceUAH: 269, tags: ["lenten"],
    composition: "Картопля, борошно, яйце, капуста тушкована, морква, цибуля, олія, сіль, перець.",
    kbju: { kcal: 172, protein: 4, fat: 6, carb: 26 },
    cooking: "Обсмажити на сковороді по 4 хв з кожного боку.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), яйця.",
    images: PH, isActive: true,
  },
  {
    id: "deruny", slug: "deruny-kartoplyani", categorySlug: "kartoplyani",
    title: "Деруни картопляні", weightGrams: 600, unitLabel: "упаковка 0,6 кг",
    priceUAH: 199, tags: ["lenten"],
    composition: "Картопля, цибуля, борошно, яйце, олія соняшникова, сіль, перець.",
    kbju: { kcal: 168, protein: 3, fat: 7, carb: 24 },
    cooking: "Смажити на розігрітій олії по 3–4 хв з кожного боку. Подавати зі сметаною.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), яйця.",
    images: PH, isActive: true,
  },
  {
    id: "kartoplyanyky-syr", slug: "kartoplyanyky-z-syrom", categorySlug: "kartoplyani",
    title: "Картопляники з сиром", weightGrams: 600, unitLabel: "упаковка 0,6 кг",
    priceUAH: 229, tags: [],
    composition: "Картопля, сир кисломолочний, борошно, яйце, цибуля, олія, сіль.",
    kbju: { kcal: 182, protein: 7, fat: 7, carb: 23 },
    cooking: "Обсмажити на сковороді по 3–4 хв з кожного боку.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },

  // ---------- Ковбаси та паштет ----------
  {
    id: "kovbasa-domashnya", slug: "kovbasa-domashnya", categorySlug: "kovbasy",
    title: "Ковбаса домашня", weightGrams: 700, unitLabel: "упаковка 0,7 кг",
    priceUAH: 519, tags: [],
    composition: "Свинина, сало, часник, сіль, перець чорний, мускатний горіх, натуральна оболонка.",
    kbju: { kcal: 312, protein: 15, fat: 28, carb: 1 },
    cooking: "Запікати в духовці 180 °C 35–40 хв або смажити на сковороді 20 хв, періодично перевертаючи.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Без глютену. Вироблено на потужностях, де використовують пшеницю, молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "kovbaski-kuryachi", slug: "kovbaski-kuryachi", categorySlug: "kovbasy",
    title: "Ковбаски курячі для гриля", weightGrams: 500, unitLabel: "упаковка 0,5 кг",
    priceUAH: 349, tags: [],
    composition: "Філе куряче, сало, часник, паприка, сіль, перець, натуральна оболонка.",
    kbju: { kcal: 236, protein: 16, fat: 18, carb: 1 },
    cooking: "Смажити на грилі чи сковороді 12–15 хв, періодично перевертаючи.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Без глютену. Вироблено на потужностях, де використовують пшеницю, молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "pashtet-kuryachyy", slug: "pashtet-kuryachyy", categorySlug: "kovbasy",
    title: "Паштет курячий", weightGrams: 300, unitLabel: "контейнер 0,3 кг",
    priceUAH: 179, tags: [],
    composition: "Печінка куряча, вершкове масло, цибуля, морква, вершки, сіль, перець, мускатний горіх.",
    kbju: { kcal: 232, protein: 11, fat: 19, carb: 4 },
    cooking: "Розморозити в холодильнику, подавати з тостами чи хлібом.",
    storage: "Зберігати за −18 °C до 30 діб. Після розморожування — 24 год у холодильнику.",
    allergens: "Молоко.",
    images: PH, isActive: true,
  },

  // ---------- Котлети та тефтелі ----------
  {
    id: "kotlety-svynyna-yalovychyna", slug: "kotlety-zi-svynyny-ta-yalovychyny", categorySlug: "kotlety",
    title: "Котлети зі свинини та яловичини", weightGrams: 600, unitLabel: "упаковка 0,6 кг · ~6 шт",
    priceUAH: 359, tags: ["hit"],
    composition: "Свинина, яловичина, цибуля, батон, молоко, яйце, часник, сіль, перець, панірувальні сухарі.",
    kbju: { kcal: 242, protein: 13, fat: 16, carb: 10 },
    cooking: "Смажити на розігрітій сковороді по 5–6 хв з кожного боку, довести під кришкою.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "kotlety-kuryachi", slug: "kotlety-kuryachi", categorySlug: "kotlety",
    title: "Котлети курячі", weightGrams: 600, unitLabel: "упаковка 0,6 кг · ~6 шт",
    priceUAH: 349, tags: [],
    composition: "Філе куряче, цибуля, батон, молоко, яйце, сіль, перець, панірувальні сухарі.",
    kbju: { kcal: 196, protein: 15, fat: 10, carb: 11 },
    cooking: "Смажити по 5 хв з кожного боку або запекти 200 °C 25 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "kotlety-kordon-blyu", slug: "kotlety-kordon-blyu", categorySlug: "kotlety",
    title: "Котлети «Кордон Блю»", weightGrams: 500, unitLabel: "упаковка 0,5 кг · 4 шт",
    priceUAH: 389, tags: [],
    composition: "Філе куряче, шинка, сир твердий, яйце, панірувальні сухарі, сіль, перець.",
    kbju: { kcal: 248, protein: 16, fat: 15, carb: 12 },
    cooking: "Обсмажити 2 хв у фритюрі, довести в духовці 190 °C 15 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "kotlety-indychi", slug: "kotlety-indychi", categorySlug: "kotlety",
    title: "Котлети «Індичі»", weightGrams: 600, unitLabel: "упаковка 0,6 кг · ~6 шт",
    priceUAH: 409, tags: [],
    composition: "Філе індички, цибуля, батон, молоко, яйце, зелень, сіль, перець, панірувальні сухарі.",
    kbju: { kcal: 182, protein: 16, fat: 9, carb: 10 },
    cooking: "Смажити по 5 хв з кожного боку, довести під кришкою.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "frikadelky-dytyachi", slug: "frikadelky-dytyachi", categorySlug: "kotlety",
    title: "Фрикадельки дитячі на перепелиних яйцях", weightGrams: 500, unitLabel: "упаковка 0,5 кг",
    priceUAH: 439, tags: ["new"],
    composition: "Філе куряче, перепелині яйця, цибуля, рис, молоко, сіль.",
    kbju: { kcal: 164, protein: 14, fat: 9, carb: 8 },
    cooking: "Відварити 10 хв або протушкувати в соусі 15 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Яйця, молоко.",
    images: PH, isActive: true,
  },
  {
    id: "tefteli-tomat", slug: "tefteli-u-tomatnomu-sousi", categorySlug: "kotlety",
    title: "Тефтелі у томатному соусі", weightGrams: 700, unitLabel: "упаковка 0,7 кг",
    priceUAH: 329, tags: [],
    composition: "Свинина, яловичина, рис, цибуля, морква, томатна паста, олія, часник, сіль, перець.",
    kbju: { kcal: 184, protein: 11, fat: 10, carb: 13 },
    cooking: "Тушкувати під кришкою 20 хв. Соус у комплекті.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Може містити глютен, селеру.",
    images: PH, isActive: true,
  },

  // ---------- Голубці та перець ----------
  {
    id: "golubtsi-svynyna-telyatyna", slug: "golubtsi-zi-svynynoyu-ta-telyatynoyu", categorySlug: "golubtsi",
    title: "Голубці зі свининою та телятиною", weightGrams: 800, unitLabel: "упаковка 0,8 кг · ~6 шт",
    priceUAH: 369, tags: ["hit"],
    composition: "Капуста білоголова, свинина, телятина, рис, морква, цибуля, томатна паста, олія, сіль, перець.",
    kbju: { kcal: 152, protein: 8, fat: 8, carb: 12 },
    cooking: "Тушкувати під кришкою з невеликою кількістю води чи соусу 25–30 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Може містити глютен, селеру.",
    images: PH, isActive: true,
  },
  {
    id: "golubtsi-pisni", slug: "golubtsi-pisni-z-grybamy", categorySlug: "golubtsi",
    title: "Голубці пісні з грибами", weightGrams: 800, unitLabel: "упаковка 0,8 кг · ~6 шт",
    priceUAH: 299, tags: ["lenten"],
    composition: "Капуста білоголова, рис, печериці, морква, цибуля, томатна паста, олія соняшникова, сіль, перець.",
    kbju: { kcal: 118, protein: 3, fat: 4, carb: 17 },
    cooking: "Тушкувати під кришкою 25 хв з соусом або водою.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Без глютену. Вироблено на потужностях, де використовують пшеницю.",
    images: PH, isActive: true,
  },
  {
    id: "perets-myaso", slug: "perets-farshyrovanyy-z-myasom", categorySlug: "golubtsi",
    title: "Перець фарширований з м'ясом", weightGrams: 800, unitLabel: "упаковка 0,8 кг · ~6 шт",
    priceUAH: 349, tags: [],
    composition: "Перець солодкий, свинина, яловичина, рис, морква, цибуля, томат, олія, сіль, перець.",
    kbju: { kcal: 146, protein: 8, fat: 7, carb: 13 },
    cooking: "Тушкувати під кришкою 30 хв із соусом.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Може містити селеру.",
    images: PH, isActive: true,
  },
  {
    id: "perets-pisnyy", slug: "perets-farshyrovanyy-pisnyy", categorySlug: "golubtsi",
    title: "Перець фарширований пісний", weightGrams: 800, unitLabel: "упаковка 0,8 кг · ~6 шт",
    priceUAH: 289, tags: ["lenten"],
    composition: "Перець солодкий, рис, морква, цибуля, гриби, томат, олія соняшникова, сіль, перець.",
    kbju: { kcal: 108, protein: 3, fat: 3, carb: 17 },
    cooking: "Тушкувати під кришкою 25–30 хв із соусом.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Без глютену. Вироблено на потужностях, де використовують пшеницю, молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "dolma", slug: "dolma-u-vynogradnomu-lysti", categorySlug: "golubtsi",
    title: "Долма у виноградному листі", weightGrams: 500, unitLabel: "упаковка 0,5 кг",
    priceUAH: 329, tags: [],
    composition: "Листя виноградне, яловичина, баранина, рис, цибуля, зелень (кінза, м'ята), олія, сіль, спеції.",
    kbju: { kcal: 168, protein: 8, fat: 10, carb: 11 },
    cooking: "Тушкувати під кришкою 20–25 хв. Подавати з часниковим соусом на йогурті.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Може містити молоко (соус подається окремо).",
    images: PH, isActive: true,
  },

  // ---------- Пельмені та хінкалі ----------
  {
    id: "pelmeni-svynyna-yalovychyna", slug: "pelmeni-zi-svynyny-ta-yalovychyny", categorySlug: "pelmeni",
    title: "Пельмені зі свинини та яловичини", weightGrams: 900, unitLabel: "упаковка 0,9 кг",
    priceUAH: 295, tags: ["hit"],
    composition: "Борошно пшеничне в/ґ, свинина, яловичина, цибуля, вода, сіль, перець чорний.",
    kbju: { kcal: 248, protein: 11, fat: 12, carb: 24 },
    cooking: "Вкинути в підсолений окріп, варити 7–8 хв після спливання. Подавати зі сметаною.",
    storage: "Зберігати за −18 °C до 30 діб. Повторне заморожування не допускається.",
    allergens: "Глютен (пшениця).",
    images: PH, isActive: true,
  },
  {
    id: "pelmeni-losos-shpynat", slug: "pelmeni-z-lososem-ta-shpynatom", categorySlug: "pelmeni",
    title: "Пельмені з лососем та шпинатом", weightGrams: 700, unitLabel: "упаковка 0,7 кг",
    priceUAH: 439, tags: [],
    composition: "Борошно пшеничне в/ґ, лосось, шпинат, цибуля, вершкове масло, сіль, перець білий.",
    kbju: { kcal: 224, protein: 12, fat: 9, carb: 24 },
    cooking: "Варити 5–6 хв після спливання в підсоленій воді. Подавати з вершковим соусом.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), риба, молоко.",
    images: PH, isActive: true,
  },
  {
    id: "pelmeni-kurka", slug: "pelmeni-kuryachi", categorySlug: "pelmeni",
    title: "Пельмені курячі", weightGrams: 900, unitLabel: "упаковка 0,9 кг",
    priceUAH: 269, tags: [],
    composition: "Борошно пшеничне в/ґ, філе куряче, цибуля, зелень, вода, сіль, перець.",
    kbju: { kcal: 214, protein: 13, fat: 6, carb: 25 },
    cooking: "Варити 6–7 хв після спливання в підсоленій воді.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця).",
    images: PH, isActive: true,
  },
  {
    id: "hinkali-svynyna-yalovychyna", slug: "hinkali-zi-svynyny-ta-yalovychyny", categorySlug: "pelmeni",
    title: "Хінкалі зі свинини та яловичини", weightGrams: 600, unitLabel: "упаковка 0,6 кг · ~10 шт",
    priceUAH: 289, tags: ["spicy"],
    composition: "Борошно пшеничне в/ґ, свинина, яловичина, цибуля, часник, зіра, коріандр, гострий перець, вода, сіль.",
    kbju: { kcal: 252, protein: 12, fat: 13, carb: 22 },
    cooking: "У киплячу підсолену воду, варити 10–12 хв після спливання. Їсти руками, зберігаючи бульйон.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця).",
    images: PH, isActive: true,
  },

  // ---------- Піца та пироги ----------
  {
    id: "pizza-margaryta", slug: "pitsa-margaryta", categorySlug: "pizza-pyrohy",
    title: "Піца Маргарита", weightGrams: 400, unitLabel: "1 шт · Ø 30 см",
    priceUAH: 189, tags: [],
    composition: "Тісто (борошно пшеничне, дріжджі, олія), томатний соус, сир моцарела, орегано.",
    kbju: { kcal: 234, protein: 10, fat: 8, carb: 31 },
    cooking: "Випікати з замороженого стану в духовці 220 °C 10–12 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко.",
    images: PH, isActive: true,
  },
  {
    id: "pizza-peperoni", slug: "pitsa-peperoni", categorySlug: "pizza-pyrohy",
    title: "Піца Пепероні", weightGrams: 450, unitLabel: "1 шт · Ø 30 см",
    priceUAH: 219, tags: ["spicy"],
    composition: "Тісто, томатний соус, сир моцарела, салямі пепероні, перець чилі, орегано.",
    kbju: { kcal: 268, protein: 12, fat: 12, carb: 29 },
    cooking: "Випікати в духовці 220 °C 10–12 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко.",
    images: PH, isActive: true,
  },
  {
    id: "pizza-chotyry-syry", slug: "pitsa-chotyry-syry", categorySlug: "pizza-pyrohy",
    title: "Піца Чотири сири", weightGrams: 430, unitLabel: "1 шт · Ø 30 см",
    priceUAH: 239, tags: [],
    composition: "Тісто, вершковий соус, моцарела, пармезан, дор блю, чедер, орегано.",
    kbju: { kcal: 276, protein: 13, fat: 14, carb: 27 },
    cooking: "Випікати в духовці 220 °C 10–12 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко.",
    images: PH, isActive: true,
  },
  {
    id: "chebureky-myaso", slug: "chebureky-z-myasom", categorySlug: "pizza-pyrohy",
    title: "Чебуреки з м'ясом", weightGrams: 500, unitLabel: "упаковка 0,5 кг · ~5 шт",
    priceUAH: 279, tags: ["spicy"],
    composition: "Борошно пшеничне, вода, олія, свинина, яловичина, цибуля, часник, сіль, перець чорний та червоний.",
    kbju: { kcal: 268, protein: 10, fat: 15, carb: 24 },
    cooking: "Смажити у розігрітій олії по 3–4 хв з кожного боку до рум'яної скоринки.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця).",
    images: PH, isActive: true,
  },
  {
    id: "chebureky-myaso-syr-pomidor", slug: "chebureky-z-myasom-syrom-pomidoramy", categorySlug: "pizza-pyrohy",
    title: "Чебуреки з м'ясом, сиром і помідорами", weightGrams: 500, unitLabel: "упаковка 0,5 кг · ~5 шт",
    priceUAH: 279, tags: [],
    composition: "Борошно пшеничне, вода, олія, свинина, яловичина, сир твердий, помідор, цибуля, сіль, перець.",
    kbju: { kcal: 272, protein: 11, fat: 15, carb: 23 },
    cooking: "Смажити у розігрітій олії по 3–4 хв з кожного боку.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко.",
    images: PH, isActive: true,
  },
  {
    id: "shtrudel-yabluchnyy", slug: "shtrudel-yabluchnyy", categorySlug: "pizza-pyrohy",
    title: "Штрудель яблучний", weightGrams: 400, unitLabel: "упаковка 0,4 кг",
    priceUAH: 179, tags: ["new"],
    composition: "Тісто витяжне (борошно пшеничне), яблука, цукор, родзинки, кориця, горіхи волоські, масло вершкове.",
    kbju: { kcal: 262, protein: 4, fat: 11, carb: 38 },
    cooking: "Випікати в духовці 190 °C 20–25 хв. Присипати цукровою пудрою.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, горіхи.",
    images: PH, isActive: true,
  },
  {
    id: "zavyvanets-korytsya", slug: "zavyvanets-z-korytseyu", categorySlug: "pizza-pyrohy",
    title: "Завиванець з корицею", weightGrams: 450, unitLabel: "упаковка 0,45 кг",
    priceUAH: 187, tags: [],
    composition: "Дріжджове тісто (борошно, молоко, яйце, масло), цукор, кориця, ванілін.",
    kbju: { kcal: 286, protein: 6, fat: 9, carb: 46 },
    cooking: "Випікати в духовці 180 °C 22–25 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "kruasany-mygdal", slug: "kruasany-z-mygdalem", categorySlug: "pizza-pyrohy",
    title: "Круасани з мигдалем", weightGrams: 300, unitLabel: "упаковка 0,3 кг · 4 шт",
    priceUAH: 149, tags: [],
    composition: "Тісто листкове дріжджове (борошно, масло вершкове), мигдальний крем, мигдальні пелюстки, цукрова пудра.",
    kbju: { kcal: 402, protein: 8, fat: 24, carb: 40 },
    cooking: "Випікати з замороженого стану в духовці 180 °C 18–20 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця, горіхи.",
    images: PH, isActive: true,
  },
  {
    id: "pyrih-vyshnya", slug: "pyrih-z-vyshneyu", categorySlug: "pizza-pyrohy",
    title: "Пиріг з вишнею", weightGrams: 500, unitLabel: "упаковка 0,5 кг",
    priceUAH: 169, tags: [],
    composition: "Пісочне тісто (борошно, масло, яйце, цукор), вишня без кісточки, крохмаль, цукор.",
    kbju: { kcal: 254, protein: 4, fat: 9, carb: 40 },
    cooking: "Розігріти в духовці 170 °C 12–15 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },

  // ---------- Сирники ----------
  {
    id: "syrnyky-klasychni", slug: "syrnyky", categorySlug: "syrnyky",
    title: "Сирники", weightGrams: 500, unitLabel: "упаковка 0,5 кг · ~10 шт",
    priceUAH: 319, tags: ["hit"],
    composition: "Сир кисломолочний, борошно пшеничне, яйце, цукор, ванілін, сіль.",
    kbju: { kcal: 224, protein: 13, fat: 7, carb: 27 },
    cooking: "Смажити на невеликому вогні під кришкою по 4 хв з кожного боку, не розморожуючи.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "syrnyky-shokolad", slug: "syrnyky-z-shokoladom", categorySlug: "syrnyky",
    title: "Сирники з шоколадом", weightGrams: 500, unitLabel: "упаковка 0,5 кг · ~10 шт",
    priceUAH: 339, tags: [],
    composition: "Сир кисломолочний, борошно пшеничне, яйце, шоколад темний, цукор, ванілін, сіль.",
    kbju: { kcal: 246, protein: 12, fat: 9, carb: 31 },
    cooking: "Смажити під кришкою по 4 хв з кожного боку. Подавати зі сметаною.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця, соя.",
    images: PH, isActive: true,
  },
  {
    id: "lynyvi-varenyky", slug: "linyvi-varenyky", categorySlug: "syrnyky",
    title: "Ліниві вареники", weightGrams: 700, unitLabel: "упаковка 0,7 кг",
    priceUAH: 259, tags: [],
    composition: "Сир кисломолочний, борошно пшеничне, яйце, цукор, сіль.",
    kbju: { kcal: 206, protein: 12, fat: 5, carb: 28 },
    cooking: "Вкинути в підсолений окріп, варити 3–4 хв після спливання. Подавати з маслом і сметаною.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },

  // ---------- Готові страви ----------
  {
    id: "shef-shashlyk-svynyna", slug: "shashlyk-zi-svynyny", categorySlug: "gotovi",
    title: "Шашлик зі свинини з мангалу", weightGrams: 500, unitLabel: "готова страва · 0,5 кг",
    priceUAH: 329, tags: ["hit"],
    composition: "Свинина (шия), цибуля, олія, сіль, суміш перців, спеції для шашлику.",
    kbju: { kcal: 256, protein: 17, fat: 20, carb: 2 },
    cooking: "Розігріти в духовці 180 °C 12–15 хв або на сковороді під кришкою 10 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Без глютену. Вироблено на потужностях, де використовують пшеницю, молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "shef-myaso-po-frantsuzky", slug: "myaso-kuryache-z-motsareloyu", categorySlug: "gotovi",
    title: "М'ясо куряче з моцарелою та помідором", weightGrams: 400, unitLabel: "0,4 кг · 2 порції",
    priceUAH: 289, tags: [],
    composition: "Філе куряче, сир моцарела, помідор, вершки, часник, сіль, перець, зелень.",
    kbju: { kcal: 192, protein: 18, fat: 12, carb: 3 },
    cooking: "Запікати в духовці 190 °C 25–30 хв до рум'яної скоринки.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Молоко.",
    images: PH, isActive: true,
  },
  {
    id: "shef-kasha-befstroganov", slug: "kasha-hrechana-z-befstroganovom", categorySlug: "gotovi",
    title: "Каша гречана та бефстроганов зі свинини", weightGrams: 400, unitLabel: "0,4 кг · 1 порція",
    priceUAH: 189, tags: [],
    composition: "Крупа гречана, свинина, цибуля, морква, сметана, томатна паста, олія, сіль, перець.",
    kbju: { kcal: 168, protein: 9, fat: 8, carb: 16 },
    cooking: "Тушкувати під кришкою 12–15 хв або розігріти в мікрохвильовці 5 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Молоко. Може містити глютен, селеру.",
    images: PH, isActive: true,
  },
  {
    id: "lazanya-bolonieze", slug: "lazanya-bolonieze", categorySlug: "gotovi",
    title: "Лазанья Болоньєзе", weightGrams: 400, unitLabel: "0,4 кг · 1 порція",
    priceUAH: 219, tags: [],
    composition: "Листи для лазаньї (борошно, яйце), фарш яловичий, томатний соус, соус бешамель, сир пармезан.",
    kbju: { kcal: 186, protein: 10, fat: 9, carb: 17 },
    cooking: "Запікати в духовці 190 °C 25–30 хв або мікрохвильовка 6–7 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "kish-kurka-gryby", slug: "kish-z-kurkoyu-ta-grybamy", categorySlug: "gotovi",
    title: "Кіш з куркою та грибами", weightGrams: 400, unitLabel: "0,4 кг · Ø 20 см",
    priceUAH: 209, tags: [],
    composition: "Пісочне тісто, філе куряче, печериці, цибуля, вершки, яйце, сир твердий, зелень.",
    kbju: { kcal: 244, protein: 11, fat: 15, carb: 17 },
    cooking: "Розігріти в духовці 180 °C 15–18 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "patelnya-ovocheva", slug: "patelnya-ovocheva-z-kurkoyu", categorySlug: "gotovi",
    title: "Пательня овочева з куркою", weightGrams: 500, unitLabel: "0,5 кг · 1–2 порції",
    priceUAH: 199, tags: [],
    composition: "Філе куряче, броколі, перець, морква, цукіні, цибуля, олія, соєвий соус, спеції.",
    kbju: { kcal: 118, protein: 10, fat: 5, carb: 9 },
    cooking: "Обсмажити на розігрітій сковороді 10–12 хв, помішуючи.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Соя. Може містити глютен.",
    images: PH, isActive: true,
  },
  {
    id: "special-krem-sup-garbuz", slug: "krem-sup-garbuzovyy-z-parmezanom", categorySlug: "gotovi",
    title: "Крем-суп гарбузовий з пармезаном", weightGrams: 400, unitLabel: "0,4 кг · 1 порція",
    priceUAH: 144, tags: ["new"],
    composition: "Гарбуз, вершки, цибуля, часник, пармезан, олія, сіль, мускатний горіх, гарбузове насіння.",
    kbju: { kcal: 92, protein: 3, fat: 6, carb: 7 },
    cooking: "Прогріти в каструлі 7–10 хв, помішуючи, або мікрохвильовка 4–5 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Молоко.",
    images: PH, isActive: true,
  },
  {
    id: "special-solyanka", slug: "sup-solyanka", categorySlug: "gotovi",
    title: "Суп Солянка", weightGrams: 450, unitLabel: "0,45 кг · 1–2 порції",
    priceUAH: 169, tags: [],
    composition: "Бульйон, копченості (свинина, ковбаса), огірки солоні, оливки, томатна паста, цибуля, лимон.",
    kbju: { kcal: 86, protein: 6, fat: 5, carb: 4 },
    cooking: "Довести до кипіння в каструлі, проварити 5 хв. Подавати зі сметаною та лимоном.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Може містити глютен, селеру.",
    images: PH, isActive: true,
  },
  {
    id: "special-nabir-rodynna-vecherya", slug: "nabir-rodynna-vecherya", categorySlug: "gotovi",
    title: "Набір «Родинна вечеря»", weightGrams: 1800, unitLabel: "набір ~1,8 кг",
    priceUAH: 649, tags: ["hit"],
    composition: "Вареники з картоплею 0,9 кг, котлети зі свинини та яловичини 0,6 кг, сметана 350 г.",
    kbju: { kcal: 210, protein: 9, fat: 10, carb: 22 },
    cooking: "Готувати за інструкціями на кожній позиції набору.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "morozyvo-plombir", slug: "morozyvo-plombir-bez-tsukru", categorySlug: "gotovi",
    title: "Морозиво пломбір без цукру та лактози", weightGrams: 300, unitLabel: "контейнер 0,3 кг",
    priceUAH: 159, tags: ["new"],
    composition: "Вершки безлактозні, еритрит, стевія, яєчний жовток, ваніль.",
    kbju: { kcal: 168, protein: 4, fat: 14, carb: 6 },
    cooking: "Перед подачею потримати 5–7 хв за кімнатної температури.",
    storage: "Зберігати за −18 °C. Після відкриття вжити протягом тижня.",
    allergens: "Яйця. Без лактози.",
    images: PH, isActive: true,
  },
  {
    id: "morozyvo-fistashka", slug: "morozyvo-fistashkove", categorySlug: "gotovi",
    title: "Морозиво фісташкове", weightGrams: 300, unitLabel: "контейнер 0,3 кг",
    priceUAH: 179, tags: [],
    composition: "Вершки, молоко, цукор, фісташкова паста, яєчний жовток.",
    kbju: { kcal: 214, protein: 5, fat: 14, carb: 18 },
    cooking: "Перед подачею потримати 5–7 хв за кімнатної температури.",
    storage: "Зберігати за −18 °C.",
    allergens: "Молоко, яйця, горіхи (фісташки).",
    images: PH, isActive: true,
  },
  {
    id: "morozyvo-karamel", slug: "morozyvo-z-solonoyu-karamellyu", categorySlug: "gotovi",
    title: "Морозиво з солоною карамеллю", weightGrams: 300, unitLabel: "контейнер 0,3 кг",
    priceUAH: 169, tags: [],
    composition: "Вершки, молоко, цукор, карамель, морська сіль, яєчний жовток.",
    kbju: { kcal: 226, protein: 4, fat: 13, carb: 23 },
    cooking: "Перед подачею потримати 5–7 хв за кімнатної температури.",
    storage: "Зберігати за −18 °C.",
    allergens: "Молоко, яйця.",
    images: PH, isActive: true,
  },
];

// ---------- helpers ----------

export const activeProducts = products.filter((p) => p.isActive);

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

export const productsByCategory = (categorySlug: string) =>
  activeProducts.filter((p) => p.categorySlug === categorySlug);

export const pricePer100g = (p: Pick<Product, "priceUAH" | "weightGrams">) =>
  Math.round((p.priceUAH / p.weightGrams) * 100);

const officialCategoryFallbacks: Record<string, string> = {
  homilky: "https://galia-baluvana.com/storage/uploads/images/bIGFP4fRUb6dtdv8aytk7MN4gr6F6NlPvvkpBDm9/bIGFP4fRUb6dtdv8aytk7MN4gr6F6NlPvvkpBDm9_res600x400_opt.jpg",
  "mlyntsi-vareniki": "https://galia-baluvana.com/storage/uploads/images/KdMZjg5dZ5QG6uQr7GodVtCN6UxR0n9kxekcYvuM/KdMZjg5dZ5QG6uQr7GodVtCN6UxR0n9kxekcYvuM_res600x400_opt.jpg",
  kartoplyani: "https://galia-baluvana.com/storage/uploads/images/XexPEvNeq9NWpZFWzuWcSM8hyHCJoWsuRfFpi3F2/XexPEvNeq9NWpZFWzuWcSM8hyHCJoWsuRfFpi3F2_res600x400_opt.jpg",
  kovbasy: "https://galia-baluvana.com/storage/uploads/images/2kqR3c2V2AKIqm1reEpzBTfXQxL7USblQwlJm1gY/2kqR3c2V2AKIqm1reEpzBTfXQxL7USblQwlJm1gY_res600x400_opt.jpg",
  kotlety: "https://galia-baluvana.com/storage/uploads/images/7FojIlejzfiFGAAIbyc90zp23Q3zAOv99aZfzZ6U/7FojIlejzfiFGAAIbyc90zp23Q3zAOv99aZfzZ6U_res600x400_opt.jpg",
  pelmeni: "https://galia-baluvana.com/storage/uploads/images/heUByTjRCe5gFfKrRkKrUYwv8PQVtncVrjuqK9i4/heUByTjRCe5gFfKrRkKrUYwv8PQVtncVrjuqK9i4_res600x400_opt.jpg",
  "pizza-pyrohy": "https://galia-baluvana.com/storage/uploads/images/btGbtGY39D1Bm0LCrdLVvrOlmMDnGwgs5EXUeQjR/btGbtGY39D1Bm0LCrdLVvrOlmMDnGwgs5EXUeQjR_res600x400_opt.jpg",
  syrnyky: "https://galia-baluvana.com/storage/uploads/images/1Vq3uTefVtVUIM2zSMETMnqqUVcWrX5YDHxI4dtf/1Vq3uTefVtVUIM2zSMETMnqqUVcWrX5YDHxI4dtf_res600x400_opt.jpg",
};

const officialProductImages: Record<string, string> = {
  "vareniki-z-kartopleyu": "https://galia-baluvana.com/storage/uploads/images/XEMCKgG3uzGljCKtt5XSMN8mU3oBZ2AEL96I9Uny/XEMCKgG3uzGljCKtt5XSMN8mU3oBZ2AEL96I9Uny_res600x400_opt.jpg",
  "vareniki-z-kartopleyu-ta-grybamy": "https://galia-baluvana.com/storage/uploads/images/eQ1XFBK7pk7yk6TkpxxtNczXtrVwt1u5jFTzFIi1/eQ1XFBK7pk7yk6TkpxxtNczXtrVwt1u5jFTzFIi1_res600x400_opt.jpg",
  "vareniki-zi-shpynatom-i-solonym-syrom": "https://galia-baluvana.com/storage/uploads/images/cVOkwvZx94wd66gM6Q61qVPu1nMX9CcT74BWVC9t/cVOkwvZx94wd66gM6Q61qVPu1nMX9CcT74BWVC9t_res600x400_opt.jpg",
  "vareniki-z-kapustoyu": "https://galia-baluvana.com/storage/uploads/images/iyzlY7G4G47oTPUL0ghrUzl8OY7GLfy5Ke9sRacL/iyzlY7G4G47oTPUL0ghrUzl8OY7GLfy5Ke9sRacL_res600x400_opt.jpg",
  "vareniki-z-solonym-syrom": "https://galia-baluvana.com/storage/uploads/images/9niBPar9dZUanx7Vrsu3qrykNBK2yOBmxKoLlpbd/9niBPar9dZUanx7Vrsu3qrykNBK2yOBmxKoLlpbd_res600x400_opt.jpg",
  "vareniki-z-vyshneyu": "https://galia-baluvana.com/storage/uploads/images/VH0jhSFKJulTFE0Oolb6rkIeUjkRrUHBo9JTWcec/VH0jhSFKJulTFE0Oolb6rkIeUjkRrUHBo9JTWcec_res600x400_opt.jpg",
  "mlyntsi-z-kurkoyu-ta-grybamy": "https://galia-baluvana.com/storage/uploads/images/Z2ow7OumUyMhYY5okYRPgzhMmIysMpWR2r1uZ3br/Z2ow7OumUyMhYY5okYRPgzhMmIysMpWR2r1uZ3br_res600x400_opt.jpg",
  "mlyntsi-shpynatni-z-krem-syrom": "https://galia-baluvana.com/storage/uploads/images/v4FIziHWbgqI81pto8JGCkTvfgSFA2ZJv2jKuCi9/v4FIziHWbgqI81pto8JGCkTvfgSFA2ZJv2jKuCi9_res600x400_opt.jpg",
  "mlyntsi-z-polunytseyu-i-syrom": "https://galia-baluvana.com/storage/uploads/images/0GhvyM06W4IZq5dMjG7gBoAFekRI6uzPGXEdTyY0/0GhvyM06W4IZq5dMjG7gBoAFekRI6uzPGXEdTyY0_res600x400_opt.jpg",
  "mlyntsi-z-makom-ta-vyshneyu": "https://galia-baluvana.com/storage/uploads/images/agDW9BFx60UoXN6alItu0hujcGSXqpTcuhwSh2hi/agDW9BFx60UoXN6alItu0hujcGSXqpTcuhwSh2hi_res600x400_opt.jpg",
  "bendaryky-z-kurkoyu-ta-motsareloyu": "https://galia-baluvana.com/storage/uploads/images/uGiVlAXobIlbUihfRBEiAWS5rOTZPu1Fm4VWQxUW/uGiVlAXobIlbUihfRBEiAWS5rOTZPu1Fm4VWQxUW_res600x400_opt.jpg",
};

export const productImage = (p: Pick<Product, "images"> & Partial<Pick<Product, "slug" | "categorySlug">>) =>
  p.images[0] ?? (p.slug ? officialProductImages[p.slug] : undefined) ?? (p.categorySlug ? officialCategoryFallbacks[p.categorySlug] : undefined) ?? "/placeholder.svg";

/** "з цим беруть" — same category first, then fill from siblings. */
export const relatedProducts = (slug: string, limit = 4): Product[] => {
  const base = getProduct(slug);
  if (!base) return [];
  const sameCat = productsByCategory(base.categorySlug).filter((p) => p.slug !== slug);
  const others = activeProducts.filter(
    (p) => p.categorySlug !== base.categorySlug && p.slug !== slug,
  );
  return [...sameCat, ...others].slice(0, limit);
};

export const categoriesSorted = [...categories].sort((a, b) => a.sort - b.sort);

export const totalProducts = activeProducts.length;
