// Static product catalogue. No database — the storefront renders straight from here,
// which keeps first paint instant and SEO fully under our control.
//
// Photos are placeholders (`/placeholder.svg`) until real shots are added under
// public/img/products/. `productImage()` is the single place that resolves them.

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

export const categories: Category[] = [
  { slug: "pelmeni", title: "Пельмені та хінкалі", blurb: "Тонке тісто, соковита начинка, ручне защипування.", sort: 1 },
  { slug: "vareniki", title: "Вареники", blurb: "Класика української кухні — солоні та солодкі.", sort: 2 },
  { slug: "mlyntsi", title: "Млинці та налисники", blurb: "Тонкі млинці з ситними та солодкими начинками.", sort: 3 },
  { slug: "syrnyky", title: "Сирники та ліниві", blurb: "З домашнього кисломолочного сиру.", sort: 4 },
  { slug: "chebureky", title: "Чебуреки та біляші", blurb: "Смажена випічка з м'ясом і сиром.", sort: 5 },
  { slug: "golubtsi", title: "Голубці та фаршировані перці", blurb: "Загорнуті руками, з м'ясом або пісні.", sort: 6 },
  { slug: "kotlety", title: "Котлети та тефтелі", blurb: "Рублені та січені, готові до сковороди.", sort: 7 },
  { slug: "deserty", title: "Десерти та випічка", blurb: "Запіканки, штруделі, пиріжки.", sort: 8 },
];

const PH = ["/placeholder.svg"];

export const products: Product[] = [
  // ---------- Пельмені та хінкалі ----------
  {
    id: "pelmeni-domashni", slug: "pelmeni-domashni", categorySlug: "pelmeni",
    title: "Пельмені «По-домашньому»", weightGrams: 700, unitLabel: "упаковка 0,7 кг · ~40 шт",
    priceUAH: 189, tags: ["hit"],
    composition: "Борошно пшеничне в/ґ, свинина, яловичина, цибуля, вода, сіль, перець чорний.",
    kbju: { kcal: 248, protein: 11, fat: 12, carb: 24 },
    cooking: "Вкинути в підсолений окріп, варити 7–8 хв після спливання. Подавати зі сметаною чи маслом.",
    storage: "Зберігати за −18 °C до 30 діб. Повторне заморожування не допускається.",
    allergens: "Глютен (пшениця). Може містити сліди яєць, молока, селери.",
    images: PH, isActive: true,
  },
  {
    id: "pelmeni-telyatyna", slug: "pelmeni-z-telyatynoyu", categorySlug: "pelmeni",
    title: "Пельмені з телятиною", weightGrams: 700, unitLabel: "упаковка 0,7 кг",
    priceUAH: 214, tags: [],
    composition: "Борошно пшеничне в/ґ, телятина, цибуля, вершкове масло, вода, сіль, перець.",
    kbju: { kcal: 236, protein: 12, fat: 10, carb: 24 },
    cooking: "У підсолений окріп на 7 хв після спливання, або на пару 12 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко.",
    images: PH, isActive: true,
  },
  {
    id: "pelmeni-kurka", slug: "pelmeni-z-kurkoyu", categorySlug: "pelmeni",
    title: "Пельмені з куркою та зеленню", weightGrams: 700, unitLabel: "упаковка 0,7 кг",
    priceUAH: 169, tags: [],
    composition: "Борошно пшеничне в/ґ, філе куряче, цибуля, кріп, петрушка, вода, сіль, перець.",
    kbju: { kcal: 214, protein: 13, fat: 6, carb: 25 },
    cooking: "Варити 6–7 хв після спливання в підсоленій воді.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця).",
    images: PH, isActive: true,
  },
  {
    id: "hinkali-baranyna", slug: "hinkali-z-baranynoyu", categorySlug: "pelmeni",
    title: "Хінкалі з бараниною", weightGrams: 500, unitLabel: "упаковка 0,5 кг · 10 шт",
    priceUAH: 219, tags: ["spicy"],
    composition: "Борошно пшеничне в/ґ, баранина, яловичина, цибуля, часник, зіра, коріандр, гострий перець, вода, сіль.",
    kbju: { kcal: 252, protein: 12, fat: 13, carb: 22 },
    cooking: "У киплячу підсолену воду, варити 10–12 хв після спливання. Їсти руками, зберігаючи бульйон.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця).",
    images: PH, isActive: true,
  },

  // ---------- Вареники ----------
  {
    id: "vareniki-kartoplya", slug: "vareniki-z-kartopleyu", categorySlug: "vareniki",
    title: "Вареники з картоплею", weightGrams: 500, unitLabel: "упаковка 0,5 кг · ~28 шт",
    priceUAH: 122, tags: ["lenten"],
    composition: "Борошно пшеничне в/ґ, картопля, цибуля смажена, олія соняшникова, сіль, перець чорний, вода.",
    kbju: { kcal: 198, protein: 5, fat: 4, carb: 35 },
    cooking: "Не розморожуючи, вкинути в підсолений окріп, варити 5–7 хв після спливання.",
    storage: "Зберігати за −18 °C до 30 діб. Повторне заморожування не допускається.",
    allergens: "Глютен (пшениця).",
    images: PH, isActive: true,
  },
  {
    id: "vareniki-kartoplya-gryby", slug: "vareniki-z-kartopleyu-ta-grybamy", categorySlug: "vareniki",
    title: "Вареники з картоплею та грибами", weightGrams: 500, unitLabel: "упаковка 0,5 кг · ~28 шт",
    priceUAH: 138, tags: ["hit", "lenten"],
    composition: "Борошно пшеничне в/ґ, картопля, печериці, цибуля смажена, олія соняшникова, сіль, перець, вода.",
    kbju: { kcal: 198, protein: 5, fat: 4, carb: 34 },
    cooking: "У підсолений окріп на 5–7 хв після спливання. Подавати зі смаженою цибулею або сметаною.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця). Вироблено на потужностях, де використовують яйця та молоко.",
    images: PH, isActive: true,
  },
  {
    id: "vareniki-kapusta", slug: "vareniki-z-kapustoyu", categorySlug: "vareniki",
    title: "Вареники з тушкованою капустою", weightGrams: 500, unitLabel: "упаковка 0,5 кг",
    priceUAH: 118, tags: ["lenten"],
    composition: "Борошно пшеничне в/ґ, капуста білоголова, морква, цибуля, томатна паста, олія соняшникова, сіль, вода.",
    kbju: { kcal: 176, protein: 4, fat: 3, carb: 33 },
    cooking: "Варити 6–7 хв після спливання в підсоленій воді.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця).",
    images: PH, isActive: true,
  },
  {
    id: "vareniki-syr", slug: "vareniki-z-solonym-syrom", categorySlug: "vareniki",
    title: "Вареники з солоним сиром", weightGrams: 500, unitLabel: "упаковка 0,5 кг",
    priceUAH: 146, tags: [],
    composition: "Борошно пшеничне в/ґ, сир кисломолочний, яйце, цибуля зелена, сіль, вода.",
    kbju: { kcal: 212, protein: 10, fat: 6, carb: 29 },
    cooking: "У підсолений окріп на 4–5 хв після спливання. Подавати зі сметаною.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "vareniki-vyshnya", slug: "vareniki-z-vyshneyu", categorySlug: "vareniki",
    title: "Вареники з вишнею", weightGrams: 500, unitLabel: "упаковка 0,5 кг",
    priceUAH: 152, tags: ["hit"],
    composition: "Борошно пшеничне в/ґ, вишня без кісточки, цукор, крохмаль кукурудзяний, вода.",
    kbju: { kcal: 224, protein: 4, fat: 2, carb: 47 },
    cooking: "Варити 4–5 хв після спливання. Подавати з цукром і сметаною.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця).",
    images: PH, isActive: true,
  },
  {
    id: "vareniki-polunytsya", slug: "vareniki-z-polunytseyu", categorySlug: "vareniki",
    title: "Вареники з полуницею", weightGrams: 500, unitLabel: "упаковка 0,5 кг",
    priceUAH: 165, tags: ["new"],
    composition: "Борошно пшеничне в/ґ, полуниця, цукор, крохмаль кукурудзяний, вода.",
    kbju: { kcal: 218, protein: 4, fat: 2, carb: 46 },
    cooking: "Варити 4–5 хв після спливання.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця).",
    images: PH, isActive: true,
  },

  // ---------- Млинці та налисники ----------
  {
    id: "mlyntsi-myaso", slug: "mlyntsi-z-myasom", categorySlug: "mlyntsi",
    title: "Млинці з м'ясом", weightGrams: 500, unitLabel: "упаковка 0,5 кг · 5 шт",
    priceUAH: 149, tags: [],
    composition: "Борошно пшеничне, молоко, яйце, свинина, яловичина, цибуля, олія, сіль, перець.",
    kbju: { kcal: 208, protein: 11, fat: 9, carb: 21 },
    cooking: "Обсмажити на розігрітій сковороді по 2–3 хв з кожного боку до золотистого кольору.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "mlyntsi-syr", slug: "mlyntsi-z-syrom", categorySlug: "mlyntsi",
    title: "Млинці з сиром та родзинками", weightGrams: 500, unitLabel: "упаковка 0,5 кг · 5 шт",
    priceUAH: 139, tags: [],
    composition: "Борошно пшеничне, молоко, яйце, сир кисломолочний, цукор, родзинки, ванілін, олія.",
    kbju: { kcal: 216, protein: 9, fat: 7, carb: 30 },
    cooking: "Розігріти на сковороді під кришкою 5–6 хв або в духовці 180 °C 10 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "nalysnyky-pechinka", slug: "nalysnyky-z-pechinkoyu", categorySlug: "mlyntsi",
    title: "Налисники з печінкою", weightGrams: 500, unitLabel: "упаковка 0,5 кг",
    priceUAH: 155, tags: [],
    composition: "Борошно пшеничне, молоко, яйце, печінка куряча, цибуля, морква, олія, сіль, перець.",
    kbju: { kcal: 198, protein: 12, fat: 8, carb: 19 },
    cooking: "Обсмажити на сковороді по 3 хв з кожного боку.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "mlyntsi-shynka-syr", slug: "mlyntsi-z-shynkoyu-ta-syrom", categorySlug: "mlyntsi",
    title: "Млинці з шинкою та сиром", weightGrams: 500, unitLabel: "упаковка 0,5 кг · 5 шт",
    priceUAH: 159, tags: [],
    composition: "Борошно пшеничне, молоко, яйце, шинка, сир твердий, олія, сіль.",
    kbju: { kcal: 232, protein: 12, fat: 11, carb: 21 },
    cooking: "Обсмажити на сковороді 3 хв з кожного боку до розтоплення сиру.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },

  // ---------- Сирники та ліниві ----------
  {
    id: "syrnyky-klasychni", slug: "syrnyky-klasychni", categorySlug: "syrnyky",
    title: "Сирники класичні", weightGrams: 400, unitLabel: "упаковка 0,4 кг · 8 шт",
    priceUAH: 118, tags: [],
    composition: "Сир кисломолочний, борошно пшеничне, яйце, цукор, ванілін, сіль.",
    kbju: { kcal: 224, protein: 13, fat: 7, carb: 27 },
    cooking: "Смажити на невеликому вогні під кришкою по 4 хв з кожного боку, не розморожуючи.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "syrnyky-rodzynky", slug: "syrnyky-z-rodzynkamy", categorySlug: "syrnyky",
    title: "Сирники з родзинками", weightGrams: 400, unitLabel: "упаковка 0,4 кг · 8 шт",
    priceUAH: 124, tags: ["hit"],
    composition: "Сир кисломолочний, борошно пшеничне, яйце, цукор, родзинки, ванілін, сіль.",
    kbju: { kcal: 236, protein: 12, fat: 7, carb: 31 },
    cooking: "Смажити під кришкою по 4 хв з кожного боку. Подавати зі сметаною чи згущеним молоком.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "syrnyky-vyshnya", slug: "syrnyky-z-vyshneyu", categorySlug: "syrnyky",
    title: "Сирники з вишнею", weightGrams: 400, unitLabel: "упаковка 0,4 кг · 8 шт",
    priceUAH: 132, tags: [],
    composition: "Сир кисломолочний, борошно пшеничне, яйце, вишня, цукор, ванілін, сіль.",
    kbju: { kcal: 228, protein: 11, fat: 6, carb: 33 },
    cooking: "Смажити під кришкою по 4–5 хв з кожного боку.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "lynyvi-varenyky", slug: "linyvi-varenyky", categorySlug: "syrnyky",
    title: "Ліниві вареники", weightGrams: 500, unitLabel: "упаковка 0,5 кг",
    priceUAH: 112, tags: [],
    composition: "Сир кисломолочний, борошно пшеничне, яйце, цукор, сіль.",
    kbju: { kcal: 206, protein: 12, fat: 5, carb: 28 },
    cooking: "Вкинути в підсолений окріп, варити 3–4 хв після спливання. Подавати з маслом і сметаною.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },

  // ---------- Чебуреки та біляші ----------
  {
    id: "chebureky-myaso", slug: "chebureky-z-myasom", categorySlug: "chebureky",
    title: "Чебуреки з м'ясом", weightGrams: 400, unitLabel: "упаковка 0,4 кг · 4 шт",
    priceUAH: 128, tags: ["spicy"],
    composition: "Борошно пшеничне, вода, олія, свинина, яловичина, цибуля, часник, сіль, перець чорний та червоний.",
    kbju: { kcal: 268, protein: 10, fat: 15, carb: 24 },
    cooking: "Смажити у розігрітій олії по 3–4 хв з кожного боку до рум'яної скоринки.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця).",
    images: PH, isActive: true,
  },
  {
    id: "chebureky-syr", slug: "chebureky-z-syrom", categorySlug: "chebureky",
    title: "Чебуреки з сиром", weightGrams: 400, unitLabel: "упаковка 0,4 кг · 4 шт",
    priceUAH: 118, tags: [],
    composition: "Борошно пшеничне, вода, олія, сир бринза, сир твердий, зелень, сіль.",
    kbju: { kcal: 262, protein: 11, fat: 14, carb: 23 },
    cooking: "Смажити у розігрітій олії по 3 хв з кожного боку.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко.",
    images: PH, isActive: true,
  },
  {
    id: "bilyashi-yalovychyna", slug: "bilyashi-z-yalovychynoyu", categorySlug: "chebureky",
    title: "Біляші з яловичиною", weightGrams: 360, unitLabel: "упаковка 0,36 кг · 4 шт",
    priceUAH: 132, tags: [],
    composition: "Борошно пшеничне, дріжджі, молоко, яйце, яловичина, свинина, цибуля, сіль, перець.",
    kbju: { kcal: 254, protein: 11, fat: 12, carb: 26 },
    cooking: "Смажити у розігрітій олії отвором донизу 3 хв, перевернути й смажити ще 3 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "samsa-kurka", slug: "samsa-z-kurkoyu", categorySlug: "chebureky",
    title: "Самса з куркою", weightGrams: 400, unitLabel: "упаковка 0,4 кг · 4 шт",
    priceUAH: 135, tags: [],
    composition: "Тісто листкове (борошно пшеничне, маргарин), філе куряче, цибуля, зіра, сіль, перець.",
    kbju: { kcal: 286, protein: 10, fat: 17, carb: 24 },
    cooking: "Випікати в духовці 200 °C 20–25 хв до золотистого кольору.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця). Може містити молоко.",
    images: PH, isActive: true,
  },

  // ---------- Голубці та фаршировані перці ----------
  {
    id: "golubtsi-myaso", slug: "golubtsi-z-myasom", categorySlug: "golubtsi",
    title: "Голубці з м'ясом та рисом", weightGrams: 700, unitLabel: "упаковка 0,7 кг · ~6 шт",
    priceUAH: 175, tags: [],
    composition: "Капуста білоголова, свинина, яловичина, рис, морква, цибуля, томатна паста, олія, сіль, перець.",
    kbju: { kcal: 152, protein: 8, fat: 8, carb: 12 },
    cooking: "Тушкувати під кришкою з невеликою кількістю води чи соусу 25–30 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Може містити глютен, селеру.",
    images: PH, isActive: true,
  },
  {
    id: "golubtsi-pisni", slug: "golubtsi-pisni-z-grybamy", categorySlug: "golubtsi",
    title: "Голубці пісні з грибами", weightGrams: 700, unitLabel: "упаковка 0,7 кг · ~6 шт",
    priceUAH: 159, tags: ["lenten"],
    composition: "Капуста білоголова, рис, печериці, морква, цибуля, томатна паста, олія соняшникова, сіль, перець.",
    kbju: { kcal: 118, protein: 3, fat: 4, carb: 17 },
    cooking: "Тушкувати під кришкою 25 хв з соусом або водою.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Без глютену. Вироблено на потужностях, де є пшениця.",
    images: PH, isActive: true,
  },
  {
    id: "perets-farshyrovanyy", slug: "perets-farshyrovanyy", categorySlug: "golubtsi",
    title: "Перець фарширований м'ясом", weightGrams: 700, unitLabel: "упаковка 0,7 кг · ~6 шт",
    priceUAH: 179, tags: [],
    composition: "Перець солодкий, свинина, яловичина, рис, морква, цибуля, томат, олія, сіль, перець.",
    kbju: { kcal: 146, protein: 8, fat: 7, carb: 13 },
    cooking: "Тушкувати під кришкою 30 хв із соусом.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Може містити селеру.",
    images: PH, isActive: true,
  },
  {
    id: "dolma", slug: "dolma-u-vynogradnomu-lysti", categorySlug: "golubtsi",
    title: "Долма у виноградному листі", weightGrams: 500, unitLabel: "упаковка 0,5 кг",
    priceUAH: 189, tags: [],
    composition: "Листя виноградне, яловичина, баранина, рис, цибуля, зелень (кінза, м'ята), олія, сіль, спеції.",
    kbju: { kcal: 168, protein: 8, fat: 10, carb: 11 },
    cooking: "Тушкувати під кришкою 20–25 хв. Подавати з часниковим соусом на йогурті.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Може містити молоко (соус подається окремо).",
    images: PH, isActive: true,
  },

  // ---------- Котлети та тефтелі ----------
  {
    id: "kotlety-domashni", slug: "kotlety-domashni", categorySlug: "kotlety",
    title: "Котлети домашні", weightGrams: 500, unitLabel: "упаковка 0,5 кг · ~6 шт",
    priceUAH: 145, tags: [],
    composition: "Свинина, яловичина, цибуля, батон, молоко, яйце, часник, сіль, перець, панірувальні сухарі.",
    kbju: { kcal: 242, protein: 13, fat: 16, carb: 10 },
    cooking: "Смажити на розігрітій сковороді по 5–6 хв з кожного боку, довести під кришкою.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "kotlety-kuryachi", slug: "kotlety-kuryachi", categorySlug: "kotlety",
    title: "Котлети курячі", weightGrams: 500, unitLabel: "упаковка 0,5 кг · ~6 шт",
    priceUAH: 135, tags: [],
    composition: "Філе куряче, цибуля, батон, молоко, яйце, сіль, перець, панірувальні сухарі.",
    kbju: { kcal: 196, protein: 15, fat: 10, carb: 11 },
    cooking: "Смажити по 5 хв з кожного боку або запекти 200 °C 25 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "tefteli-tomat", slug: "tefteli-u-tomatnomu-sousi", categorySlug: "kotlety",
    title: "Тефтелі у томатному соусі", weightGrams: 500, unitLabel: "упаковка 0,5 кг",
    priceUAH: 152, tags: [],
    composition: "Свинина, яловичина, рис, цибуля, морква, томатна паста, олія, часник, сіль, перець.",
    kbju: { kcal: 184, protein: 11, fat: 10, carb: 13 },
    cooking: "Тушкувати під кришкою 20 хв. Соус у комплекті.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Може містити глютен, селеру.",
    images: PH, isActive: true,
  },
  {
    id: "kotleta-po-kyivsky", slug: "kotleta-po-kyivsky", categorySlug: "kotlety",
    title: "Котлета по-київськи", weightGrams: 400, unitLabel: "упаковка 0,4 кг · 2 шт",
    priceUAH: 189, tags: ["hit"],
    composition: "Філе куряче, вершкове масло, зелень, часник, яйце, панірувальні сухарі, сіль, перець.",
    kbju: { kcal: 268, protein: 15, fat: 18, carb: 12 },
    cooking: "Обсмажити у фритюрі 2 хв, довести в духовці 190 °C 15 хв. Не проколювати.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "kruchenyky-svynyna", slug: "kruchenyky-zi-svynyny", categorySlug: "kotlety",
    title: "Крученики зі свинини", weightGrams: 500, unitLabel: "упаковка 0,5 кг · 4 шт",
    priceUAH: 198, tags: [],
    composition: "Свинина (шніцель), гриби, цибуля, морква, сир твердий, олія, сіль, перець.",
    kbju: { kcal: 214, protein: 16, fat: 14, carb: 6 },
    cooking: "Обсмажити з усіх боків 5 хв, тушкувати під кришкою 20 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Молоко.",
    images: PH, isActive: true,
  },

  // ---------- Десерти та випічка ----------
  {
    id: "syrna-zapikanka", slug: "syrna-zapikanka", categorySlug: "deserty",
    title: "Сирна запіканка", weightGrams: 500, unitLabel: "упаковка 0,5 кг",
    priceUAH: 138, tags: [],
    composition: "Сир кисломолочний, манка, яйце, цукор, родзинки, ванілін, вершкове масло, сіль.",
    kbju: { kcal: 218, protein: 12, fat: 7, carb: 28 },
    cooking: "Запікати в духовці 180 °C 25–30 хв. Подавати зі сметаною чи ягідним соусом.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "shtrudel-yabluchnyy", slug: "shtrudel-yabluchnyy", categorySlug: "deserty",
    title: "Штрудель яблучний", weightGrams: 400, unitLabel: "упаковка 0,4 кг",
    priceUAH: 142, tags: ["new"],
    composition: "Тісто витяжне (борошно пшеничне), яблука, цукор, родзинки, кориця, горіхи волоські, масло вершкове.",
    kbju: { kcal: 262, protein: 4, fat: 11, carb: 38 },
    cooking: "Випікати в духовці 190 °C 20–25 хв. Присипати цукровою пудрою.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, горіхи.",
    images: PH, isActive: true,
  },
  {
    id: "pyrizhky-yabluko", slug: "pyrizhky-pecheni-z-yablukom", categorySlug: "deserty",
    title: "Пиріжки печені з яблуком", weightGrams: 480, unitLabel: "упаковка 0,48 кг · 6 шт",
    priceUAH: 128, tags: [],
    composition: "Борошно пшеничне, дріжджі, молоко, яйце, цукор, яблука, кориця, масло вершкове, сіль.",
    kbju: { kcal: 244, protein: 6, fat: 6, carb: 42 },
    cooking: "Розігріти в духовці 170 °C 10–12 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця.",
    images: PH, isActive: true,
  },
  {
    id: "kruasany-shokolad", slug: "kruasany-z-shokoladom", categorySlug: "deserty",
    title: "Круасани з шоколадом", weightGrams: 300, unitLabel: "упаковка 0,3 кг · 4 шт",
    priceUAH: 119, tags: [],
    composition: "Тісто листкове дріжджове (борошно пшеничне, масло вершкове), шоколад темний, яйце, цукор, сіль.",
    kbju: { kcal: 396, protein: 7, fat: 22, carb: 42 },
    cooking: "Випікати з замороженого стану в духовці 180 °C 18–20 хв.",
    storage: "Зберігати за −18 °C до 30 діб.",
    allergens: "Глютен (пшениця), молоко, яйця, соя.",
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

export const productImage = (p: Pick<Product, "images">) => p.images[0] ?? "/placeholder.svg";

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
