import React from 'react';
import { PackagePlus, RotateCcw, X } from 'lucide-react';
import { PastOrder, PRODUCTS } from '../data/catalog';
import { formatINR, pluralizeUnit } from '../utils/format';

interface QuickReorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  pastOrders: PastOrder[];
  onRepeatOrder: (order: PastOrder, mode: 'merge' | 'replace') => void;
}

export const QuickReorderModal: React.FC<QuickReorderModalProps> = ({
  isOpen,
  onClose,
  pastOrders,
  onRepeatOrder,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-[1px] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-reorder-title"
    >
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2
              id="quick-reorder-title"
              className="font-display text-lg font-bold text-slate-900"
            >
              Quick Reorder — Ayyas Supermarket
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Repeat a recent wholesale invoice in one click
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Quick Reorder"
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          {pastOrders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-xl p-4 bg-slate-50/40"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-200/80">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-slate-900">
                      {order.id}
                    </span>
                    <span className="text-xs text-slate-500">·</span>
                    <span className="text-xs text-slate-600">{order.dateLabel}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {order.paymentMethod === 'credit-account'
                      ? 'Credit Account'
                      : 'Pay on Delivery'}{' '}
                    · {order.items.length} SKUs
                  </p>
                </div>

                <div className="text-right">
                  <div className="font-display text-base font-bold text-slate-900 tabular-nums">
                    {formatINR(order.totalAmount)}
                  </div>
                  <div className="text-[11px] text-slate-500">Incl. GST</div>
                </div>
              </div>

              <ul className="py-2.5 space-y-1.5 text-xs text-slate-700">
                {order.items.map((item) => {
                  const product = PRODUCTS.find((p) => p.id === item.productId);
                  if (!product) return null;
                  return (
                    <li
                      key={item.productId}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="truncate">
                        {product.title} —{' '}
                        <strong className="font-semibold text-slate-900 tabular-nums">
                          {item.quantity} {pluralizeUnit(product.unitLabel, item.quantity)}
                        </strong>
                      </span>
                      <span className="font-mono text-slate-600 tabular-nums shrink-0">
                        {formatINR(product.wholesalePrice * item.quantity)}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="pt-3 border-t border-gray-200/80 flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => onRepeatOrder(order, 'merge')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#0056D6] bg-white hover:bg-blue-50 border border-[#0056D6]/30 rounded-lg transition-colors cursor-pointer"
                >
                  <PackagePlus className="w-3.5 h-3.5" />
                  <span>Add Items to Cart</span>
                </button>
                <button
                  type="button"
                  onClick={() => onRepeatOrder(order, 'replace')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#28A745] hover:bg-[#218838] rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Load as Current Order</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
