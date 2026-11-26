import { CartItem, PRODUCTS, Product } from './catalog';
import { formatINR, pluralizeUnit } from '../utils/format';

export type UserRole = 'retailer' | 'supermarket' | 'distributor' | 'super_admin';

export interface DistributorInfo {
  id: string;
  name: string;
  area: string;
  phone: string; // digits with country code, e.g. 919847000001
  brands: string[];
}

export interface PartyAccount {
  id: string;
  loginId: string;
  password: string;
  role: Exclude<UserRole, 'super_admin'>;
  businessName: string;
  storeCode: string;
  routeArea: string;
  phone: string;
  creditLimit: number;
  creditUsed: number;
  active: boolean;
}

export interface StatementRequest {
  id: string;
  partyId: string;
  businessName: string;
  storeCode: string;
  period: string;
  requestedAt: string;
  status: 'Pending' | 'Approved';
}

export interface EnterpriseScheme {
  id: string;
  title: string;
  productId: string;
  minQty: number;
  schemeBadge: string;
  description: string;
  extraDiscountPercent: number;
}

export interface DistributorOrderGroup {
  distributor: DistributorInfo;
  lines: Array<{
    product: Product;
    quantity: number;
    lineSubtotal: number;
    lineGst: number;
    lineTotal: number;
  }>;
  subtotal: number;
  gstTotal: number;
  grandTotal: number;
  totalUnits: number;
}

export const DISTRIBUTORS: DistributorInfo[] = [
  {
    id: 'dist-malabar-agro',
    name: 'Malabar Agro & Staples Agency',
    area: 'Malappuram & Kozhikode',
    phone: '919847011201',
    brands: ['Ajmi', 'ITC'],
  },
  {
    id: 'dist-western-spice',
    name: 'Western Spice & Dairy Distributors',
    area: 'Kozhikode & Wayanad',
    phone: '919847011202',
    brands: ['Eastern', 'Tata'],
  },
  {
    id: 'dist-kera-fmcg',
    name: 'Kera FMCG & Homecare Hub',
    area: 'Malappuram Central',
    phone: '919847011203',
    brands: ['HUL', 'Impex'],
  },
];

// Product ID -> Distributor ID mapping
export const PRODUCT_DISTRIBUTOR_MAP: Record<string, string> = {
  'ajmi-puttu-podi-1kg': 'dist-malabar-agro',
  'tata-tea-gold-250g': 'dist-western-spice',
  'eastern-sambar-masala-200g': 'dist-western-spice',
  'hul-surf-excel-1kg': 'dist-kera-fmcg',
  'itc-aashirvaad-atta-5kg': 'dist-malabar-agro',
  'itc-sunfeast-biscuits-1200g': 'dist-malabar-agro',
  'eastern-pure-cow-ghee-500ml': 'dist-western-spice',
  'ajmi-coconut-oil-1l': 'dist-malabar-agro',
  'hul-lifebuoy-4pack': 'dist-kera-fmcg',
  'impex-stainless-kettle-15l': 'dist-kera-fmcg',
  'itc-bingo-chips-multipack': 'dist-malabar-agro',
  'itc-bnatural-mango-1l': 'dist-western-spice',
};

export function getDistributorForProduct(product: Product): DistributorInfo {
  const distId = PRODUCT_DISTRIBUTOR_MAP[product.id];
  const found = DISTRIBUTORS.find((d) => d.id === distId);
  if (found) return found;

  const byBrand = DISTRIBUTORS.find((d) => d.brands.includes(product.brand));
  return byBrand ?? DISTRIBUTORS[0];
}

export function groupOrderByDistributor(cart: CartItem[]): DistributorOrderGroup[] {
  const map = new Map<string, DistributorOrderGroup>();

  for (const item of cart) {
    const product = PRODUCTS.find((p) => p.id === item.productId);
    if (!product || item.quantity <= 0) continue;

    const distributor = getDistributorForProduct(product);
    const lineSubtotal = +(product.wholesalePrice * item.quantity).toFixed(2);
    const lineGst = +(lineSubtotal * (product.gstRate / 100)).toFixed(2);
    const lineTotal = +(lineSubtotal + lineGst).toFixed(2);

    if (!map.has(distributor.id)) {
      map.set(distributor.id, {
        distributor,
        lines: [],
        subtotal: 0,
        gstTotal: 0,
        grandTotal: 0,
        totalUnits: 0,
      });
    }

    const group = map.get(distributor.id)!;
    group.lines.push({
      product,
      quantity: item.quantity,
      lineSubtotal,
      lineGst,
      lineTotal,
    });
    group.subtotal = +(group.subtotal + lineSubtotal).toFixed(2);
    group.gstTotal = +(group.gstTotal + lineGst).toFixed(2);
    group.grandTotal = +(group.grandTotal + lineTotal).toFixed(2);
    group.totalUnits += item.quantity;
  }

  return Array.from(map.values());
}

export function buildDistributorWhatsAppText(params: {
  orderId: string;
  storeName: string;
  storeCode: string;
  routeArea: string;
  placedAt: string;
  group: DistributorOrderGroup;
}): string {
  const { orderId, storeName, storeCode, routeArea, placedAt, group } = params;
  const itemLines = group.lines
    .map((l, idx) => {
      const unit = pluralizeUnit(l.product.unitLabel, l.quantity);
      return `${idx + 1}. ${l.product.shortTitle} (${l.product.sku}) — ${l.quantity} ${unit} @ ${formatINR(
        l.product.wholesalePrice
      )} = ${formatINR(l.lineSubtotal)}`;
    })
    .join('\n');

  return [
    `*Nattuchantha B2B — Distributor Order*`,
    `Order ID: *${orderId}*`,
    `Distributor: *${group.distributor.name}*`,
    `Retailer: *${storeName}* (${storeCode})`,
    `Route/Area: ${routeArea}`,
    `Time: ${placedAt}`,
    ``,
    `*Items (${group.totalUnits} units):*`,
    itemLines,
    ``,
    `Subtotal: ${formatINR(group.subtotal)}`,
    `GST: ${formatINR(group.gstTotal)}`,
    `Order Total: *${formatINR(group.grandTotal)}*`,
  ].join('\n');
}

export const INITIAL_PARTIES: PartyAccount[] = [
  {
    id: 'party-ayyas-sm',
    loginId: 'ayyas.sm',
    password: '123',
    role: 'supermarket',
    businessName: 'Ayyas Supermarket',
    storeCode: 'SM-KL-408',
    routeArea: 'Kozhikode Route',
    phone: '9847000101',
    creditLimit: 150000,
    creditUsed: 24500,
    active: true,
  },
  {
    id: 'party-malabar-hyper',
    loginId: 'malabar.hyper',
    password: '123',
    role: 'supermarket',
    businessName: 'Malabar Hypermarket',
    storeCode: 'HM-KL-212',
    routeArea: 'Malappuram Bypass',
    phone: '9847000102',
    creditLimit: 300000,
    creditUsed: 68000,
    active: true,
  },
  {
    id: 'party-pookkottur-ret',
    loginId: 'pookkottur.store',
    password: '123',
    role: 'retailer',
    businessName: 'Pookkottur General Stores',
    storeCode: 'RT-KL-089',
    routeArea: 'Pookkottur Route',
    phone: '9847000103',
    creditLimit: 50000,
    creditUsed: 8200,
    active: true,
  },
];

export const INITIAL_STATEMENT_REQUESTS: StatementRequest[] = [
  {
    id: 'STMT-101',
    partyId: 'party-ayyas-sm',
    businessName: 'Ayyas Supermarket',
    storeCode: 'SM-KL-408',
    period: '01 Nov 2026 – 26 Nov 2026',
    requestedAt: '2 days ago',
    status: 'Approved',
  },
];

export const ENTERPRISE_SCHEMES: EnterpriseScheme[] = [
  {
    id: 'sch-ajmi-bulk',
    title: 'Bulk Slab: Ajmi Puttu Podi (25+ Packs)',
    productId: 'ajmi-puttu-podi-1kg',
    minQty: 25,
    schemeBadge: 'Extra 3% Enterprise Rebate',
    description: 'Applicable for supermarkets ordering 25 or more 1kg packs in a single batch.',
    extraDiscountPercent: 3,
  },
  {
    id: 'sch-atta-bulk',
    title: 'Supermarket Case Deal: Aashirvaad Atta 5kg (15+ Bags)',
    productId: 'itc-aashirvaad-atta-5kg',
    minQty: 15,
    schemeBadge: 'Priority Morning Slot + ₹4/Bag Off',
    description: 'Dedicated morning delivery dispatch with bulk supermarket billing.',
    extraDiscountPercent: 2,
  },
  {
    id: 'sch-surf-bulk',
    title: 'Homecare Bulk Slab: Surf Excel 1kg (20+ Packs)',
    productId: 'hul-surf-excel-1kg',
    minQty: 20,
    schemeBadge: 'Extra 4% Margin Boost',
    description: 'High-volume retail scheme for supermarket & hypermarket shelf replenishment.',
    extraDiscountPercent: 4,
  },
];
