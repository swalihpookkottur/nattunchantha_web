import React from 'react';
import {
  Cookie,
  CupSoda,
  Flame,
  LayoutGrid,
  Snowflake,
  SprayCan,
  Tag,
  Wheat,
} from 'lucide-react';
import { CATEGORIES, CategoryId, PRODUCTS } from '../data/catalog';
import { formatINR } from '../utils/format';

interface CategorySidebarProps {
  selectedCategory: CategoryId;
  onSelectCategory: (category: CategoryId) => void;
  creditUsed: number;
  creditLimit: number;
}

const CATEGORY_ICONS: Record<CategoryId, React.ComponentType<{ className?: string }>> = {
  all: LayoutGrid,
  staples: Wheat,
  spices: Flame,
  'home-care': SprayCan,
  snacks: Cookie,
  beverages: CupSoda,
  dairy: Snowflake,
  deals: Tag,
};

function getCategoryCount(categoryId: CategoryId): number {
  if (categoryId === 'all') return PRODUCTS.length;
  if (categoryId === 'deals') return PRODUCTS.filter((p) => p.isDeal).length;
  return PRODUCTS.filter((p) => p.category === categoryId).length;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  creditUsed,
  creditLimit,
}) => {
  const availableCredit = Math.max(0, creditLimit - creditUsed);

  return (
    <>
      {/* Mobile / Tablet horizontal category bar */}
      <nav
        aria-label="Product categories"
        className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 mb-4 custom-scrollbar"
      >
        {CATEGORIES.map((category) => {
          const Icon = CATEGORY_ICONS[category.id];
          const isActive = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#0056D6] text-white border-[#0056D6]'
                  : 'bg-white text-slate-700 border-gray-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{category.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 gap-5">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="font-display text-sm font-semibold text-slate-900 px-2.5 mb-2.5">
            Categories
          </h2>
          <nav aria-label="Product categories" className="flex flex-col gap-1">
            {CATEGORIES.map((category) => {
              const Icon = CATEGORY_ICONS[category.id];
              const isActive = selectedCategory === category.id;
              const count = getCategoryCount(category.id);

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onSelectCategory(category.id)}
                  className={`w-full flex items-center justify-between gap-2.5 px-2.5 py-2.5 text-sm rounded-lg transition-colors text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0056D6] ${
                    isActive
                      ? 'bg-[#0056D6] text-white font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{category.label}</span>
                  </span>
                  <span
                    className={`text-xs tabular-nums shrink-0 ${
                      isActive ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Store Trade Account Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm">
          <div className="font-display font-semibold text-slate-900">
            Ayyas Supermarket
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Kozhikode Route · Store ID #KL-408
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Available Credit</span>
              <span className="font-semibold text-slate-900 tabular-nums">
                {formatINR(availableCredit)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Credit Limit</span>
              <span className="text-slate-700 tabular-nums">
                {formatINR(creditLimit)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Next Dispatch</span>
              <span className="font-medium text-[#0056D6]">Tomorrow, 6:30 AM</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
