import React from 'react';
import {
  CreditCard,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  ShoppingCart,
  Trash2,
  Truck,
} from 'lucide-react';
import { CartItem, PaymentMethod, PRODUCTS, Product } from '../data/catalog';
import { groupOrderByDistributor } from '../data/platformData';
import { formatINR, pluralizeUnit } from '../utils/format';

export interface CartComputation {
  lines: Array<{
    product: Product;
    quantity: number;
    lineSubtotal: number;
    lineGst: number;
    lineTotal: number;
    lineMrpTotal: number;
  }>;
  totalUnits: number;
  subtotal: number;
  totalGst: number;
  grandTotal: number;
  totalMrpValue: number;
  estimatedProfit: number;
  uniformGstRate: number | null;
}

export function computeCartTotals(cart: CartItem[]): CartComputation {
  const lines = cart
    .map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      if (!product || item.quantity <= 0) return null;
      const lineSubtotal = product.wholesalePrice * item.quantity;
      const lineGst = +(lineSubtotal * (product.gstRate / 100)).toFixed(2);
      const lineTotal = +(lineSubtotal + lineGst).toFixed(2);
      const lineMrpTotal = product.mrp * item.quantity;
      return {
        product,
        quantity: item.quantity,
        lineSubtotal,
        lineGst,
        lineTotal,
        lineMrpTotal,
      };
    })
    .filter((line): line is NonNullable<typeof line> => line !== null);

  const totalUnits = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = +lines.reduce((sum, l) => sum + l.lineSubtotal, 0).toFixed(2);
  const totalGst = +lines.reduce((sum, l) => sum + l.lineGst, 0).toFixed(2);
  const grandTotal = +(subtotal + totalGst).toFixed(2);
  const totalMrpValue = +lines.reduce((sum, l) => sum + l.lineMrpTotal, 0).toFixed(2);
  const estimatedProfit = Math.max(0, +(totalMrpValue - grandTotal).toFixed(2));

  const gstRates = new Set(lines.map((l) => l.product.gstRate));
  const uniformGstRate = gstRates.size === 1 ? Array.from(gstRates)[0] : null;

  return {
    lines,
    totalUnits,
    subtotal,
    totalGst,
    grandTotal,
    totalMrpValue,
    estimatedProfit,
    uniformGstRate,
  };
}

interface OrderSummaryProps {
  cart: CartItem[];
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onUpdateQuantity: (productId: string, nextQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: () => void;
  onOpenQuickReorder: () => void;
  creditAvailable: number;
  className?: string;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  cart,
  paymentMethod,
  onPaymentMethodChange,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
  onOpenQuickReorder,
  creditAvailable,
  className = '',
}) => {
  const summary = computeCartTotals(cart);
  const distributorGroups = groupOrderByDistributor(cart);
  const exceedsCredit =
    paymentMethod === 'credit-account' && summary.grandTotal > creditAvailable;

  return (
    <section
      aria-label="Order Summary"
      className={`bg-white border border-gray-200 rounded-xl flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-bold text-slate-900">
            Order Summary
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
            {summary.lines.length} {summary.lines.length === 1 ? 'SKU' : 'SKUs'} ·{' '}
            {summary.totalUnits} total units
          </p>
        </div>
        {summary.lines.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            className="text-xs font-medium text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Itemized List */}
      {summary.lines.length === 0 ? (
        <div className="px-5 py-10 text-center flex flex-col items-center">
          <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-slate-800">
            Your wholesale cart is empty
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
            Add bulk items from the catalog or repeat a recent store order.
          </p>
          <button
            type="button"
            onClick={onOpenQuickReorder}
            className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#0056D6] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Open Quick Reorder</span>
          </button>
        </div>
      ) : (
        <>
          <div className="px-5 py-3 divide-y divide-gray-100 max-h-[270px] xl:max-h-[290px] overflow-y-auto custom-scrollbar">
            {summary.lines.map(({ product, quantity, lineSubtotal }) => {
              const unitText = pluralizeUnit(product.unitLabel, quantity);
              return (
                <div key={product.id} className="py-3 first:pt-1 last:pb-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 leading-snug">
                        {product.shortTitle}{' '}
                        <span className="text-slate-500 font-normal tabular-nums">
                          ({quantity} {unitText})
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 tabular-nums">
                        {formatINR(product.wholesalePrice)} / {product.unitLabel.toLowerCase()} · GST {product.gstRate}%
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 tabular-nums shrink-0">
                      {formatINR(lineSubtotal)}
                    </span>
                  </div>

                  {/* Inline Controls */}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="inline-flex items-center border border-gray-200 rounded-md bg-slate-50 h-7">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQuantity(
                            product.id,
                            Math.max(product.moq, quantity - 1)
                          )
                        }
                        disabled={quantity <= product.moq}
                        aria-label={`Decrease ${product.shortTitle} quantity`}
                        className="w-7 h-full flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-semibold text-slate-800 tabular-nums">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                        aria-label={`Increase ${product.shortTitle} quantity`}
                        className="w-7 h-full flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(product.id)}
                      aria-label={`Remove ${product.shortTitle} from cart`}
                      className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Distributor Split Preview */}
          <div className="px-5 py-2.5 bg-blue-50/60 border-t border-blue-100/80 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-[#0056D6] mb-1">
              <Share2 className="w-3.5 h-3.5 shrink-0" />
              <span>
                Splits into {distributorGroups.length}{' '}
                {distributorGroups.length === 1 ? 'Distributor Order' : 'Distributor Orders'}
              </span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-600">
              {distributorGroups.map((g) => (
                <div key={g.distributor.id} className="flex items-center justify-between gap-2">
                  <span className="truncate">{g.distributor.name}</span>
                  <span className="font-semibold text-slate-800 tabular-nums shrink-0">
                    {g.lines.length} SKU · {formatINR(g.grandTotal)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Billing Breakdown */}
          <div className="px-5 py-4 border-t border-gray-200 bg-slate-50/70 space-y-2 text-sm">
            <div className="flex items-center justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-medium text-slate-900 tabular-nums">
                {formatINR(summary.subtotal)}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>
                {summary.uniformGstRate !== null
                  ? `GST (${summary.uniformGstRate}%)`
                  : 'GST (Mixed Slabs)'}
              </span>
              <span className="font-medium text-slate-900 tabular-nums">
                {formatINR(summary.totalGst)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-[#15803D]">
              <span>Est. Retail Margin</span>
              <span className="font-semibold tabular-nums">
                +{formatINR(summary.estimatedProfit)} at MRP
              </span>
            </div>

            <div className="pt-2.5 border-t border-gray-200 flex items-center justify-between">
              <span className="font-display text-base font-bold text-slate-900">
                Grand Total
              </span>
              <span className="font-display text-lg font-bold text-[#0056D6] tabular-nums">
                {formatINR(summary.grandTotal)}
              </span>
            </div>
          </div>

          {/* Payment Option Toggle & Confirm CTA */}
          <div className="px-5 py-4 border-t border-gray-200 space-y-3.5">
            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-2">
                Payment Option
              </span>
              <div
                className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg border border-gray-200"
                role="radiogroup"
                aria-label="Payment Option"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={paymentMethod === 'pay-on-delivery'}
                  onClick={() => onPaymentMethodChange('pay-on-delivery')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    paymentMethod === 'pay-on-delivery'
                      ? 'bg-white text-[#0056D6] shadow-xs border border-gray-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5 shrink-0" />
                  <span>Pay on Delivery</span>
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={paymentMethod === 'credit-account'}
                  onClick={() => onPaymentMethodChange('credit-account')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    paymentMethod === 'credit-account'
                      ? 'bg-white text-[#0056D6] shadow-xs border border-gray-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 shrink-0" />
                  <span>Credit Account</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                {paymentMethod === 'pay-on-delivery'
                  ? 'Pay via UPI, NEFT, or Cash upon morning delivery.'
                  : `14-day distributor credit · Available: ${formatINR(creditAvailable)}`}
              </p>
              {exceedsCredit && (
                <p className="text-[11px] font-medium text-red-600 mt-1">
                  Order exceeds available credit limit. Switch to Pay on Delivery.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onPlaceOrder}
              disabled={exceedsCredit}
              className="w-full h-11 px-4 bg-[#28A745] hover:bg-[#218838] active:bg-[#1e7e34] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-display text-sm font-bold rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#28A745] focus-visible:ring-offset-2"
            >
              Confirm & Place Order
            </button>
          </div>
        </>
      )}
    </section>
  );
};
