import React from 'react';
import { CheckCircle2, Printer, Truck, X } from 'lucide-react';
import { PaymentMethod } from '../data/catalog';
import { CartComputation } from './OrderSummary';
import { formatINR, pluralizeUnit } from '../utils/format';

export interface ConfirmedOrderReceipt {
  orderId: string;
  placedAt: string;
  paymentMethod: PaymentMethod;
  summary: CartComputation;
}

interface OrderConfirmationModalProps {
  receipt: ConfirmedOrderReceipt | null;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  receipt,
  onClose,
}) => {
  if (!receipt) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-[1px] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-confirm-title"
    >
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="px-6 py-5 bg-emerald-50/70 border-b border-emerald-100 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#28A745] shrink-0 mt-0.5" />
            <div>
              <h2
                id="order-confirm-title"
                className="font-display text-lg font-bold text-slate-900"
              >
                Order Confirmed — {receipt.orderId}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Ayyas Supermarket · Placed on {receipt.placedAt}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close confirmation"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-blue-50/70 border border-blue-100 rounded-lg text-xs text-slate-700">
            <Truck className="w-4 h-4 text-[#0056D6] shrink-0" />
            <span>
              Scheduled dispatch: <strong>Tomorrow, 6:30 AM – 9:00 AM</strong> (Kozhikode Morning Route)
            </span>
          </div>

          <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-52 overflow-y-auto custom-scrollbar">
            {receipt.summary.lines.map(({ product, quantity, lineSubtotal }) => (
              <div
                key={product.id}
                className="px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs"
              >
                <span className="text-slate-800 font-medium">
                  {product.shortTitle}{' '}
                  <span className="text-slate-500 font-normal tabular-nums">
                    × {quantity} {pluralizeUnit(product.unitLabel, quantity)}
                  </span>
                </span>
                <span className="font-semibold text-slate-900 tabular-nums shrink-0">
                  {formatINR(lineSubtotal)}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-lg p-3.5 space-y-1.5 text-xs border border-gray-200/80">
            <div className="flex justify-between text-slate-600">
              <span>Payment Method</span>
              <span className="font-semibold text-slate-900">
                {receipt.paymentMethod === 'credit-account'
                  ? 'Credit Account (14-Day Terms)'
                  : 'Pay on Delivery'}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="tabular-nums font-medium text-slate-900">
                {formatINR(receipt.summary.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total GST</span>
              <span className="tabular-nums font-medium text-slate-900">
                {formatINR(receipt.summary.totalGst)}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-bold text-slate-900">
              <span>Grand Total</span>
              <span className="tabular-nums text-[#0056D6]">
                {formatINR(receipt.summary.grandTotal)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#0056D6] hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
            >
              Continue Ordering
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
