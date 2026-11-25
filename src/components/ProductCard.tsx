import React, { useState } from 'react';
import { Check, Minus, Package, Plus, ShoppingBag } from 'lucide-react';
import { Product } from '../data/catalog';
import { formatINR, pluralizeUnit } from '../utils/format';

interface ProductCardProps {
  product: Product;
  inCartQty: number;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  inCartQty,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState<number>(product.moq);
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(product.moq, prev - 1));
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  const moqUnit = pluralizeUnit(product.unitLabel, product.moq);

  return (
    <article className="min-w-0 bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between transition-all duration-150 hover:border-gray-300 hover:shadow-sm">
      <div className="min-w-0">
        {/* Product Image on Pure White Background */}
        <div className="relative aspect-[4/3] w-full bg-white rounded-lg overflow-hidden mb-3 flex items-center justify-center border border-gray-100">
          {!imageError && product.image ? (
            <img
              src={product.image}
              alt={product.title}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-contain p-2.5"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 p-4 text-center">
              <Package className="w-8 h-8 mb-1.5 text-slate-300" />
              <span className="text-xs font-medium text-slate-500">
                {product.shortTitle}
              </span>
            </div>
          )}

          {product.isDeal && (
            <span className="absolute top-2 left-2 text-[11px] font-semibold text-[#0056D6] bg-blue-50/95 border border-blue-200/80 px-2 py-0.5 rounded">
              Scheme Deal
            </span>
          )}
        </div>

        {/* Quiet Brand & SKU Line */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1">
          <span className="truncate">
            {product.brand} · <span className="font-mono">{product.sku}</span>
          </span>
          {inCartQty > 0 && (
            <span className="font-semibold text-[#0056D6] tabular-nums whitespace-nowrap shrink-0">
              {inCartQty} in cart
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="font-display text-[15px] font-semibold text-slate-900 leading-snug min-h-[42px] line-clamp-2">
          {product.title}
        </h3>

        {/* Wholesale Price */}
        <div className="mt-2.5 flex items-baseline gap-1.5">
          <span className="font-display text-xl font-bold text-slate-900 tabular-nums">
            {formatINR(product.wholesalePrice)}
          </span>
          <span className="text-xs font-medium text-slate-500">/ unit</span>
        </div>

        {/* MRP & Retail Margin */}
        <div className="mt-1 flex items-center flex-wrap gap-x-2 gap-y-0.5 text-xs">
          <span className="text-slate-500 tabular-nums">
            MRP: {formatINR(product.mrp)}
          </span>
          <span className="text-slate-300" aria-hidden="true">
            |
          </span>
          <span className="font-semibold text-[#15803D] tabular-nums">
            {product.marginPercent.toFixed(1)}% Margin
          </span>
        </div>

        {/* GST & MOQ */}
        <div className="mt-1.5 pt-2 border-t border-gray-100 flex items-center gap-2 text-xs text-slate-600 tabular-nums">
          <span>GST: {product.gstRate}%</span>
          <span className="text-slate-300" aria-hidden="true">
            |
          </span>
          <span className="font-medium text-slate-700">
            MOQ: {product.moq} {moqUnit}
          </span>
        </div>
      </div>

      {/* Action Row: Quantity Selector + Add to Cart */}
      <div className="mt-3.5 flex items-center gap-2">
        <div
          className="inline-flex items-center border border-gray-300 rounded-lg bg-slate-50 h-10 shrink-0"
          role="group"
          aria-label={`Quantity for ${product.shortTitle}`}
        >
          <button
            type="button"
            onClick={handleDecrement}
            disabled={quantity <= product.moq}
            aria-label={`Decrease quantity for ${product.shortTitle}`}
            className="w-8 h-full flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-sm font-semibold text-slate-900 tabular-nums select-none">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrement}
            aria-label={`Increase quantity for ${product.shortTitle}`}
            className="w-8 h-full flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={`flex-1 min-w-0 h-10 px-3 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-white rounded-lg transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#28A745] focus-visible:ring-offset-1 ${
            justAdded
              ? 'bg-emerald-700'
              : 'bg-[#28A745] hover:bg-[#218838] active:bg-[#1e7e34]'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4 shrink-0" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};
