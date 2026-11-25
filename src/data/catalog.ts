import ajmiPuttuPodiImg from '../assets/images/prod_ajmi_puttu_podi_1795318142766.jpg';
import tataTeaGoldImg from '../assets/images/prod_tata_tea_gold_1795318143353.jpg';
import easternMasalaImg from '../assets/images/prod_eastern_masala_1795318142380.jpg';
import surfDetergentImg from '../assets/images/prod_surf_detergent_1795318143510.jpg';
import aashirvaadAttaImg from '../assets/images/prod_aashirvaad_atta_1795318142896.jpg';
import biscuitPackImg from '../assets/images/prod_biscuit_pack_1795318143002.jpg';
import cowGheeImg from '../assets/images/prod_cow_ghee_1795318142688.jpg';
import coconutOilImg from '../assets/images/prod_coconut_oil_1795318143540.jpg';
import soapMultipackImg from '../assets/images/prod_soap_multipack_1795318142621.jpg';
import impexKettleImg from '../assets/images/prod_impex_kettle_1795318143509.jpg';
import chipsSnacksImg from '../assets/images/prod_chips_snacks_1795318143022.jpg';
import juiceTetrapackImg from '../assets/images/prod_juice_tetrapack_1795318143128.jpg';

export type CategoryId =
  | 'all'
  | 'staples'
  | 'spices'
  | 'home-care'
  | 'snacks'
  | 'beverages'
  | 'dairy'
  | 'deals';

export type BrandFilter =
  | 'All Brands'
  | 'Ajmi'
  | 'Eastern'
  | 'HUL'
  | 'ITC'
  | 'Impex'
  | 'Tata';

export type PaymentMethod = 'pay-on-delivery' | 'credit-account';

export interface CategoryMeta {
  id: CategoryId;
  label: string;
}

export interface Product {
  id: string;
  sku: string;
  title: string;
  shortTitle: string;
  brand: Exclude<BrandFilter, 'All Brands'>;
  category: Exclude<CategoryId, 'all' | 'deals'>;
  wholesalePrice: number;
  mrp: number;
  marginPercent: number;
  gstRate: number;
  moq: number;
  unitLabel: string;
  image: string;
  isDeal?: boolean;
  dealNote?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface PastOrder {
  id: string;
  dateLabel: string;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  totalAmount: number;
  status: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'all', label: 'All Products' },
  { id: 'staples', label: 'Grocery & Staples' },
  { id: 'spices', label: 'Spices & Masalas' },
  { id: 'home-care', label: 'Home & Personal Care' },
  { id: 'snacks', label: 'Biscuits & Snacks' },
  { id: 'beverages', label: 'Beverages & Juices' },
  { id: 'dairy', label: 'Dairy & Frozen' },
  { id: 'deals', label: "Today's Deals / Schemes" },
];

export const BRAND_FILTERS: BrandFilter[] = [
  'All Brands',
  'Ajmi',
  'Eastern',
  'HUL',
  'ITC',
  'Impex',
  'Tata',
];

export const PRODUCTS: Product[] = [
  {
    id: 'ajmi-puttu-podi-1kg',
    sku: 'AJM-PP-101',
    title: 'Ajmi Roasted Puttu Podi - 1kg',
    shortTitle: 'Ajmi Puttu Podi',
    brand: 'Ajmi',
    category: 'staples',
    wholesalePrice: 75.0,
    mrp: 90.0,
    marginPercent: 16.6,
    gstRate: 5,
    moq: 5,
    unitLabel: 'Pack',
    image: ajmiPuttuPodiImg,
    isDeal: true,
    dealNote: 'Scheme: Extra 2% off on 20+ Packs',
  },
  {
    id: 'tata-tea-gold-250g',
    sku: 'TAT-TG-250',
    title: 'Tata Tea Gold Assam Blend - 250g',
    shortTitle: 'Tata Tea Gold',
    brand: 'Tata',
    category: 'beverages',
    wholesalePrice: 107.5,
    mrp: 135.0,
    marginPercent: 20.4,
    gstRate: 5,
    moq: 10,
    unitLabel: 'Pack',
    image: tataTeaGoldImg,
  },
  {
    id: 'eastern-sambar-masala-200g',
    sku: 'EST-SM-200',
    title: 'Eastern Sambar & Chilli Masala - 200g',
    shortTitle: 'Eastern Sambar Masala',
    brand: 'Eastern',
    category: 'spices',
    wholesalePrice: 58.0,
    mrp: 74.0,
    marginPercent: 21.6,
    gstRate: 5,
    moq: 10,
    unitLabel: 'Box',
    image: easternMasalaImg,
    isDeal: true,
    dealNote: '1 Box Free on Master Case (24)',
  },
  {
    id: 'hul-surf-excel-1kg',
    sku: 'HUL-SE-100',
    title: 'Surf Excel Easy Wash Detergent - 1kg',
    shortTitle: 'Surf Excel 1kg',
    brand: 'HUL',
    category: 'home-care',
    wholesalePrice: 112.0,
    mrp: 138.0,
    marginPercent: 18.8,
    gstRate: 18,
    moq: 6,
    unitLabel: 'Pack',
    image: surfDetergentImg,
  },
  {
    id: 'itc-aashirvaad-atta-5kg',
    sku: 'ITC-AA-500',
    title: 'Aashirvaad Whole Wheat Atta - 5kg',
    shortTitle: 'Aashirvaad Atta 5kg',
    brand: 'ITC',
    category: 'staples',
    wholesalePrice: 218.0,
    mrp: 265.0,
    marginPercent: 17.7,
    gstRate: 5,
    moq: 4,
    unitLabel: 'Bag',
    image: aashirvaadAttaImg,
  },
  {
    id: 'itc-sunfeast-biscuits-1200g',
    sku: 'ITC-SB-120',
    title: 'Sunfeast Butter Cream Biscuits Family Pack - 1.2kg',
    shortTitle: 'Sunfeast Butter Cream',
    brand: 'ITC',
    category: 'snacks',
    wholesalePrice: 145.0,
    mrp: 180.0,
    marginPercent: 19.4,
    gstRate: 18,
    moq: 5,
    unitLabel: 'Pack',
    image: biscuitPackImg,
    isDeal: true,
    dealNote: 'Festival Wholesale Rate',
  },
  {
    id: 'eastern-pure-cow-ghee-500ml',
    sku: 'EST-CG-500',
    title: 'Eastern Pure Indian Cow Ghee - 500ml Jar',
    shortTitle: 'Eastern Cow Ghee',
    brand: 'Eastern',
    category: 'dairy',
    wholesalePrice: 295.0,
    mrp: 355.0,
    marginPercent: 16.9,
    gstRate: 12,
    moq: 4,
    unitLabel: 'Jar',
    image: cowGheeImg,
  },
  {
    id: 'ajmi-coconut-oil-1l',
    sku: 'AJM-CO-100',
    title: 'Ajmi Cold-Pressed Kerala Coconut Oil - 1L',
    shortTitle: 'Ajmi Coconut Oil 1L',
    brand: 'Ajmi',
    category: 'staples',
    wholesalePrice: 184.0,
    mrp: 225.0,
    marginPercent: 18.2,
    gstRate: 5,
    moq: 6,
    unitLabel: 'Bottle',
    image: coconutOilImg,
    isDeal: true,
    dealNote: 'Wholesale Drop: ₹8/L Off',
  },
  {
    id: 'hul-lifebuoy-4pack',
    sku: 'HUL-LB-400',
    title: 'Lifebuoy Total Care Bath Soap 4-Pack - 400g',
    shortTitle: 'Lifebuoy 4-Bar Bundle',
    brand: 'HUL',
    category: 'home-care',
    wholesalePrice: 108.0,
    mrp: 136.0,
    marginPercent: 20.6,
    gstRate: 18,
    moq: 6,
    unitLabel: 'Bundle',
    image: soapMultipackImg,
  },
  {
    id: 'impex-stainless-kettle-15l',
    sku: 'IMP-EK-150',
    title: 'Impex Brushed Steel Electric Kettle - 1.5L',
    shortTitle: 'Impex Electric Kettle',
    brand: 'Impex',
    category: 'home-care',
    wholesalePrice: 625.0,
    mrp: 895.0,
    marginPercent: 30.2,
    gstRate: 18,
    moq: 2,
    unitLabel: 'Unit',
    image: impexKettleImg,
    isDeal: true,
    dealNote: 'High-Margin Retail Promo',
  },
  {
    id: 'itc-bingo-chips-multipack',
    sku: 'ITC-BC-150',
    title: 'Bingo! Spicy Masala Chips Multipack - 6 x 25g',
    shortTitle: 'Bingo! Masala Chips',
    brand: 'ITC',
    category: 'snacks',
    wholesalePrice: 92.0,
    mrp: 120.0,
    marginPercent: 23.3,
    gstRate: 12,
    moq: 8,
    unitLabel: 'Pack',
    image: chipsSnacksImg,
  },
  {
    id: 'itc-bnatural-mango-1l',
    sku: 'ITC-FJ-100',
    title: 'B Natural Mango & Mixed Fruit Juice - 1L Tetra Pak',
    shortTitle: 'B Natural Mango Juice',
    brand: 'ITC',
    category: 'beverages',
    wholesalePrice: 88.0,
    mrp: 115.0,
    marginPercent: 23.5,
    gstRate: 12,
    moq: 6,
    unitLabel: 'Carton',
    image: juiceTetrapackImg,
    isDeal: true,
    dealNote: 'Buy 12 Cartons, Get 1 Free',
  },
];

export const INITIAL_CART: CartItem[] = [
  { productId: 'ajmi-puttu-podi-1kg', quantity: 5 },
  { productId: 'tata-tea-gold-250g', quantity: 10 },
];

export const INITIAL_PAST_ORDERS: PastOrder[] = [
  {
    id: 'ORD-8419',
    dateLabel: '3 days ago · Delivered',
    paymentMethod: 'credit-account',
    status: 'Delivered',
    totalAmount: 4236.75,
    items: [
      { productId: 'ajmi-puttu-podi-1kg', quantity: 15 },
      { productId: 'eastern-sambar-masala-200g', quantity: 20 },
      { productId: 'ajmi-coconut-oil-1l', quantity: 10 },
    ],
  },
  {
    id: 'ORD-8392',
    dateLabel: 'Last Tuesday · Delivered',
    paymentMethod: 'pay-on-delivery',
    status: 'Delivered',
    totalAmount: 3178.5,
    items: [
      { productId: 'tata-tea-gold-250g', quantity: 10 },
      { productId: 'itc-aashirvaad-atta-5kg', quantity: 6 },
      { productId: 'hul-surf-excel-1kg', quantity:
