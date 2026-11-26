export { DISTRIBUTORS, ENTERPRISE_SCHEMES, INITIAL_PARTIES, INITIAL_STATEMENT_REQUESTS, PRODUCT_DISTRIBUTOR_MAP, buildDistributorWhatsAppText, getDistributorForProduct, groupOrderByDistributor } from './platformdata';
export type { DistributorInfo, DistributorOrderGroup, EnterpriseScheme, PartyAccount, StatementRequest, UserRole } from './platformdata';
export type ConfirmedOrderReceipt = {
  orderId: string;
  placedAt: string;
  paymentMethod: import('./catalog').PaymentMethod;
  lines: import('./catalog').CartItem[];
  distributorGroups: import('./platformdata').DistributorOrderGroup[];
  totalAmount: number;
};
