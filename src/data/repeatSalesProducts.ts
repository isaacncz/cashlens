export type ProductCategory = 'Personal care' | 'Home care' | 'Nutrition' | 'Filters' | 'Appliances';
export type ProductType = 'consumable' | 'filter' | 'device';
export interface RepeatSalesProduct {
  id: string;
  name: string;
  size: string;
  aboPrice: number;
  every: number;
  category: ProductCategory;
  page: number;
  type: ProductType;
  color: string;
  checked: boolean;
}

// Malaysia ABO price (AP column), ABO Price List SA13, April 2026. Page numbers are printed PDF pages.
// `every` and `checked` are scenario defaults, not source claims or usage instructions.
export const repeatSalesProducts: readonly RepeatSalesProduct[] = [
  {
    "id": "124107",
    "name": "Glister Multi-Action Toothpaste",
    "size": "50g",
    "aboPrice": 9.5,
    "every": 2,
    "category": "Personal care",
    "page": 8,
    "type": "consumable",
    "color": "var(--ledger-accent)",
    "checked": false
  },
  {
    "id": "120519",
    "name": "Glister Kids Toothpaste",
    "size": "85g",
    "aboPrice": 16.8,
    "every": 2,
    "category": "Personal care",
    "page": 8,
    "type": "consumable",
    "color": "var(--ledger-accent)",
    "checked": false
  },
  {
    "id": "109857",
    "name": "L.O.C. Kitchen Cleaner",
    "size": "500ml",
    "aboPrice": 23,
    "every": 3,
    "category": "Home care",
    "page": 11,
    "type": "consumable",
    "color": "var(--ledger-info)",
    "checked": false
  },
  {
    "id": "109859",
    "name": "L.O.C. Glass Cleaner",
    "size": "500ml",
    "aboPrice": 24,
    "every": 6,
    "category": "Home care",
    "page": 11,
    "type": "consumable",
    "color": "var(--ledger-info)",
    "checked": false
  },
  {
    "id": "110480",
    "name": "SA8 Concentrated Fabric Softener",
    "size": "1L",
    "aboPrice": 27,
    "every": 3,
    "category": "Home care",
    "page": 11,
    "type": "consumable",
    "color": "var(--ledger-info)",
    "checked": false
  },
  {
    "id": "124106",
    "name": "Glister Multi-Action Toothpaste",
    "size": "200g",
    "aboPrice": 29.5,
    "every": 3,
    "category": "Personal care",
    "page": 8,
    "type": "consumable",
    "color": "var(--ledger-accent)",
    "checked": true
  },
  {
    "id": "000100",
    "name": "L.O.C. Multi-Purpose Cleaner",
    "size": "1L",
    "aboPrice": 30,
    "every": 3,
    "category": "Home care",
    "page": 11,
    "type": "consumable",
    "color": "var(--ledger-info)",
    "checked": false
  },
  {
    "id": "124112",
    "name": "Glister Multi-Action Dental Floss",
    "size": "2/pack",
    "aboPrice": 32,
    "every": 6,
    "category": "Personal care",
    "page": 8,
    "type": "consumable",
    "color": "var(--ledger-accent)",
    "checked": false
  },
  {
    "id": "110488",
    "name": "Dish Drops Concentrated Dishwashing Liquid",
    "size": "1L",
    "aboPrice": 35,
    "every": 3,
    "category": "Home care",
    "page": 11,
    "type": "consumable",
    "color": "var(--ledger-info)",
    "checked": true
  },
  {
    "id": "125896A",
    "name": "g&h PROTECT Deodorant Roll-On",
    "size": "100ml",
    "aboPrice": 38,
    "every": 3,
    "category": "Personal care",
    "page": 9,
    "type": "consumable",
    "color": "var(--ledger-accent)",
    "checked": false
  },
  {
    "id": "110403",
    "name": "SA8 PreWash Spray Soil & Stain Remover",
    "size": "350g",
    "aboPrice": 39,
    "every": 6,
    "category": "Home care",
    "page": 11,
    "type": "consumable",
    "color": "var(--ledger-info)",
    "checked": false
  },
  {
    "id": "125894A",
    "name": "g&h PROTECT Hand Soap",
    "size": "250ml",
    "aboPrice": 48,
    "every": 2,
    "category": "Personal care",
    "page": 9,
    "type": "consumable",
    "color": "var(--ledger-accent)",
    "checked": false
  },
  {
    "id": "124109",
    "name": "Glister Multi-Action Toothbrush \u00b7 Soft",
    "size": "4 pieces",
    "aboPrice": 52,
    "every": 12,
    "category": "Personal care",
    "page": 8,
    "type": "consumable",
    "color": "var(--ledger-accent)",
    "checked": false
  },
  {
    "id": "112532",
    "name": "SA8 Liquid Concentrated Laundry Detergent",
    "size": "1L",
    "aboPrice": 55,
    "every": 2,
    "category": "Home care",
    "page": 11,
    "type": "consumable",
    "color": "var(--ledger-info)",
    "checked": false
  },
  {
    "id": "126449",
    "name": "Satinique Smooth Moisture Shampoo",
    "size": "280ml",
    "aboPrice": 56,
    "every": 2,
    "category": "Personal care",
    "page": 8,
    "type": "consumable",
    "color": "var(--ledger-accent)",
    "checked": true
  },
  {
    "id": "125890A",
    "name": "g&h NOURISH Body Wash",
    "size": "400ml",
    "aboPrice": 58,
    "every": 2,
    "category": "Personal care",
    "page": 8,
    "type": "consumable",
    "color": "var(--ledger-accent)",
    "checked": false
  },
  {
    "id": "125167",
    "name": "Nutrilite Daily Multivitamin and Multimineral Plus Tablet",
    "size": "90 tablets",
    "aboPrice": 79,
    "every": 3,
    "category": "Nutrition",
    "page": 2,
    "type": "consumable",
    "color": "var(--ledger-warning)",
    "checked": false
  },
  {
    "id": "100066",
    "name": "Nutrilite Salmon Omega Complex",
    "size": "60 softgels",
    "aboPrice": 79.5,
    "every": 2,
    "category": "Nutrition",
    "page": 2,
    "type": "consumable",
    "color": "var(--ledger-warning)",
    "checked": false
  },
  {
    "id": "109849",
    "name": "SA8 Premium Concentrated Laundry Detergent",
    "size": "3kg",
    "aboPrice": 120,
    "every": 6,
    "category": "Home care",
    "page": 11,
    "type": "consumable",
    "color": "var(--ledger-info)",
    "checked": false
  },
  {
    "id": "110415",
    "name": "Nutrilite Soy Protein Drink",
    "size": "450g",
    "aboPrice": 121.5,
    "every": 2,
    "category": "Nutrition",
    "page": 2,
    "type": "consumable",
    "color": "var(--ledger-warning)",
    "checked": false
  },
  {
    "id": "121696",
    "name": "Nutrilite DOUBLE X",
    "size": "186 tablets",
    "aboPrice": 208,
    "every": 2,
    "category": "Nutrition",
    "page": 2,
    "type": "consumable",
    "color": "var(--ledger-warning)",
    "checked": false
  },
  {
    "id": "120541",
    "name": "Atmosphere Sky Carbon (Odor) Filter",
    "size": "1 filter",
    "aboPrice": 445,
    "every": 12,
    "category": "Filters",
    "page": 10,
    "type": "filter",
    "color": "var(--ledger-negative)",
    "checked": false
  },
  {
    "id": "123322",
    "name": "Atmosphere Mini 3-in-1 Replacement Filter",
    "size": "1 filter",
    "aboPrice": 495.6,
    "every": 12,
    "category": "Filters",
    "page": 10,
    "type": "filter",
    "color": "var(--ledger-negative)",
    "checked": false
  },
  {
    "id": "122943M",
    "name": "eSpring e3 Carbon Filter",
    "size": "1 filter",
    "aboPrice": 595,
    "every": 12,
    "category": "Filters",
    "page": 9,
    "type": "filter",
    "color": "var(--ledger-negative)",
    "checked": false
  },
  {
    "id": "127705",
    "name": "Glister Multi-Action Power Toothbrush",
    "size": "1 unit",
    "aboPrice": 760,
    "every": 0,
    "category": "Appliances",
    "page": 8,
    "type": "device",
    "color": "var(--ledger-muted)",
    "checked": false
  },
  {
    "id": "124746",
    "name": "Atmosphere Mini Air Treatment System",
    "size": "1 unit",
    "aboPrice": 2890,
    "every": 0,
    "category": "Appliances",
    "page": 10,
    "type": "device",
    "color": "var(--ledger-muted)",
    "checked": false
  },
  {
    "id": "122940M",
    "name": "eSpring Water Purifier",
    "size": "1 unit",
    "aboPrice": 4680,
    "every": 0,
    "category": "Appliances",
    "page": 9,
    "type": "device",
    "color": "var(--ledger-muted)",
    "checked": false
  },
  {
    "id": "120539",
    "name": "Atmosphere Sky Air Treatment System",
    "size": "1 unit",
    "aboPrice": 5570.5,
    "every": 0,
    "category": "Appliances",
    "page": 10,
    "type": "device",
    "color": "var(--ledger-muted)",
    "checked": false
  }
];
