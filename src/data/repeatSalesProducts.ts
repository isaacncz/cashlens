export type ProductCategory = 'Personal care' | 'Home care' | 'Nutrition' | 'Filters' | 'Appliances';
export type ProductType = 'consumable' | 'filter' | 'device';
export interface RepeatSalesProduct {
  id: string;
  name: string;
  size: string;
  ap: number;
  price: number;
  every: number;
  category: ProductCategory;
  page: number;
  type: ProductType;
  color: string;
  checked: boolean;
}

// Malaysia AP/RP, ABO Price List SA13, April 2026. Page numbers are printed PDF pages.
// `every` and `checked` are scenario defaults, not source claims or usage instructions.
export const repeatSalesProducts: readonly RepeatSalesProduct[] = [
  {
    "id": "124107",
    "name": "Glister Multi-Action Toothpaste",
    "size": "50g",
    "ap": 9.5,
    "price": 11.9,
    "every": 2,
    "category": "Personal care",
    "page": 8,
    "type": "consumable",
    "color": "#f4cf75",
    "checked": false
  },
  {
    "id": "120519",
    "name": "Glister Kids Toothpaste",
    "size": "85g",
    "ap": 16.8,
    "price": 21.1,
    "every": 2,
    "category": "Personal care",
    "page": 8,
    "type": "consumable",
    "color": "#f4cf75",
    "checked": false
  },
  {
    "id": "109857",
    "name": "L.O.C. Kitchen Cleaner",
    "size": "500ml",
    "ap": 23,
    "price": 28.8,
    "every": 3,
    "category": "Home care",
    "page": 11,
    "type": "consumable",
    "color": "#8ed8b4",
    "checked": false
  },
  {
    "id": "109859",
    "name": "L.O.C. Glass Cleaner",
    "size": "500ml",
    "ap": 24,
    "price": 30,
    "every": 6,
    "category": "Home care",
    "page": 11,
    "type": "consumable",
    "color": "#8ed8b4",
    "checked": false
  },
  {
    "id": "110480",
    "name": "SA8 Concentrated Fabric Softener",
    "size": "1L",
    "ap": 27,
    "price": 33.8,
    "every": 3,
    "category": "Home care",
    "page": 11,
    "type": "consumable",
    "color": "#8ed8b4",
    "checked": false
  },
  {
    "id": "124106",
    "name": "Glister Multi-Action Toothpaste",
    "size": "200g",
    "ap": 29.5,
    "price": 36.9,
    "every": 3,
    "category": "Personal care",
    "page": 8,
    "type": "consumable",
    "color": "#f4cf75",
    "checked": true
  },
  {
    "id": "000100",
    "name": "L.O.C. Multi-Purpose Cleaner",
    "size": "1L",
    "ap": 30,
    "price": 37.5,
    "every": 3,
    "category": "Home care",
    "page": 11,
    "type": "consumable",
    "color": "#8ed8b4",
    "checked": false
  },
  {
    "id": "124112",
    "name": "Glister Multi-Action Dental Floss",
    "size": "2/pack",
    "ap": 32,
    "price": 40,
    "every": 6,
    "category": "Personal care",
    "page": 8,
    "type": "consumable",
    "color": "#f4cf75",
    "checked": false
  },
  {
    "id": "110488",
    "name": "Dish Drops Concentrated Dishwashing Liquid",
    "size": "1L",
    "ap": 35,
    "price": 43.8,
    "every": 3,
    "category": "Home care",
    "page": 11,
    "type": "consumable",
    "color": "#8ed8b4",
    "checked": true
  },
  {
    "id": "125896A",
    "name": "g&h PROTECT Deodorant Roll-On",
    "size": "100ml",
    "ap": 38,
    "price": 47.5,
    "every": 3,
    "category": "Personal care",
    "page": 9,
    "type": "consumable",
    "color": "#f4cf75",
    "checked": false
  },
  {
    "id": "110403",
    "name": "SA8 PreWash Spray Soil & Stain Remover",
    "size": "350g",
    "ap": 39,
    "price": 48.8,
    "every": 6,
    "category": "Home care",
    "page": 11,
    "type": "consumable",
    "color": "#8ed8b4",
    "checked": false
  },
  {
    "id": "125894A",
    "name": "g&h PROTECT Hand Soap",
    "size": "250ml",
    "ap": 48,
    "price": 60,
    "every": 2,
    "category": "Personal care",
    "page": 9,
    "type": "consumable",
    "color": "#f4cf75",
    "checked": false
  },
  {
    "id": "124109",
    "name": "Glister Multi-Action Toothbrush \u00b7 Soft",
    "size": "4 pieces",
    "ap": 52,
    "price": 65,
    "every": 12,
    "category": "Personal care",
    "page": 8,
    "type": "consumable",
    "color": "#f4cf75",
    "checked": false
  },
  {
    "id": "112532",
    "name": "SA8 Liquid Concentrated Laundry Detergent",
    "size": "1L",
    "ap": 55,
    "price": 68.8,
    "every": 2,
    "category": "Home care",
    "page": 11,
    "type": "consumable",
    "color": "#8ed8b4",
    "checked": false
  },
  {
    "id": "126449",
    "name": "Satinique Smooth Moisture Shampoo",
    "size": "280ml",
    "ap": 56,
    "price": 70,
    "every": 2,
    "category": "Personal care",
    "page": 8,
    "type": "consumable",
    "color": "#f4cf75",
    "checked": true
  },
  {
    "id": "125890A",
    "name": "g&h NOURISH Body Wash",
    "size": "400ml",
    "ap": 58,
    "price": 72.5,
    "every": 2,
    "category": "Personal care",
    "page": 8,
    "type": "consumable",
    "color": "#f4cf75",
    "checked": false
  },
  {
    "id": "125167",
    "name": "Nutrilite Daily Multivitamin and Multimineral Plus Tablet",
    "size": "90 tablets",
    "ap": 79,
    "price": 98.8,
    "every": 3,
    "category": "Nutrition",
    "page": 2,
    "type": "consumable",
    "color": "#82b8ed",
    "checked": false
  },
  {
    "id": "100066",
    "name": "Nutrilite Salmon Omega Complex",
    "size": "60 softgels",
    "ap": 79.5,
    "price": 99.5,
    "every": 2,
    "category": "Nutrition",
    "page": 2,
    "type": "consumable",
    "color": "#82b8ed",
    "checked": false
  },
  {
    "id": "109849",
    "name": "SA8 Premium Concentrated Laundry Detergent",
    "size": "3kg",
    "ap": 120,
    "price": 150,
    "every": 6,
    "category": "Home care",
    "page": 11,
    "type": "consumable",
    "color": "#8ed8b4",
    "checked": false
  },
  {
    "id": "110415",
    "name": "Nutrilite Soy Protein Drink",
    "size": "450g",
    "ap": 121.5,
    "price": 152,
    "every": 2,
    "category": "Nutrition",
    "page": 2,
    "type": "consumable",
    "color": "#82b8ed",
    "checked": false
  },
  {
    "id": "121696",
    "name": "Nutrilite DOUBLE X",
    "size": "186 tablets",
    "ap": 208,
    "price": 260,
    "every": 2,
    "category": "Nutrition",
    "page": 2,
    "type": "consumable",
    "color": "#82b8ed",
    "checked": false
  },
  {
    "id": "120541",
    "name": "Atmosphere Sky Carbon (Odor) Filter",
    "size": "1 filter",
    "ap": 445,
    "price": 556.3,
    "every": 12,
    "category": "Filters",
    "page": 10,
    "type": "filter",
    "color": "#b5a4e3",
    "checked": false
  },
  {
    "id": "123322",
    "name": "Atmosphere Mini 3-in-1 Replacement Filter",
    "size": "1 filter",
    "ap": 495.6,
    "price": 619.5,
    "every": 12,
    "category": "Filters",
    "page": 10,
    "type": "filter",
    "color": "#b5a4e3",
    "checked": false
  },
  {
    "id": "122943M",
    "name": "eSpring e3 Carbon Filter",
    "size": "1 filter",
    "ap": 595,
    "price": 743.8,
    "every": 12,
    "category": "Filters",
    "page": 9,
    "type": "filter",
    "color": "#b5a4e3",
    "checked": false
  },
  {
    "id": "127705",
    "name": "Glister Multi-Action Power Toothbrush",
    "size": "1 unit",
    "ap": 760,
    "price": 950,
    "every": 0,
    "category": "Appliances",
    "page": 8,
    "type": "device",
    "color": "#d9a58c",
    "checked": false
  },
  {
    "id": "124746",
    "name": "Atmosphere Mini Air Treatment System",
    "size": "1 unit",
    "ap": 2890,
    "price": 3612.5,
    "every": 0,
    "category": "Appliances",
    "page": 10,
    "type": "device",
    "color": "#d9a58c",
    "checked": false
  },
  {
    "id": "122940M",
    "name": "eSpring Water Purifier",
    "size": "1 unit",
    "ap": 4680,
    "price": 5850,
    "every": 0,
    "category": "Appliances",
    "page": 9,
    "type": "device",
    "color": "#d9a58c",
    "checked": false
  },
  {
    "id": "120539",
    "name": "Atmosphere Sky Air Treatment System",
    "size": "1 unit",
    "ap": 5570.5,
    "price": 6963.4,
    "every": 0,
    "category": "Appliances",
    "page": 10,
    "type": "device",
    "color": "#d9a58c",
    "checked": false
  }
];
