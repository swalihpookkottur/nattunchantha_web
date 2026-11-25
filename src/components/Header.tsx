import React, { useEffect, useRef } from 'react';
import { PackageCheck, RotateCcw, Search, ShoppingCart, Store, X } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  cartItemCount: number;
  onOpenQuickReorder: () => void;
  onCartClick: () => void;
  onLogoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  cartItemCount,
  onOpenQuickReorder,
  onCartClick,
  onLogoClick,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 w-full">
      <div className="max-w-[1600px] w-full mx-auto px-3 sm:px-6 h-[72px] flex items-center justify-between gap-2 sm:gap-4 lg:gap-8 min-w-0">
        {/* Left: Brand Logo */}
        <button
          type="button"
          onClick={onLogoClick}
          className="flex items-center gap-2 text-left whitespace-nowrap shrink-0 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0056D6] rounded-lg py-1"
        >
          <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#0056D6] text-white shrink-0">
            <PackageCheck className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.2} />
          </span>
          <span className="font-display text-base sm:text-xl font-bold tracking-tight text-slate-900">
            Nattuchantha <span className="text-[#0056D6]">B2B</span>
          </span>
        </button>

        {/* Center: Wide Search Bar (Desktop & Tablet) */}
        <div className="hidden md:flex flex-1 max-w-2xl relative min-w-0">
          <Search
            className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products, brands, or SKUs (e.g., Ajmi Puttu Podi, Surf Excel, Tata Tea)..."
            aria-label="Search products, brands, or SKUs"
            className="w-full h-11 pl-10 pr-10 text-sm bg-slate-50 border border-gray-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0056D6] focus:ring-2 focus:ring-[#0056D6]/15 transition-colors"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span
              className="hidden xl:inline-flex items-center px-1.5 py-0.5 text-[11px] font-mono text-slate-400 border border-gray-200 rounded bg-white absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            >
              /
            </span>
          )}
        </div>

        {/* Right: Store Welcome, Quick Reorder & Cart */}
        <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4 shrink-0">
          <div className="hidden xl:flex items-center gap-2 text-sm text-slate-700 pr-2 border-r border-gray-200 whitespace-nowrap shrink-0">
            <Store className="w-4 h-4 text-[#0056D6] shrink-0" aria-hidden="true" />
            <span className="font-medium">Welcome, Ayyas Supermarket</span>
          </div>

          <button
            type="button"
            onClick={onOpenQuickReorder}
            className="inline-flex items-center gap-1.5 h-9 sm:h-10 px-2.5 sm:px-3.5 text-xs sm:text-sm font-medium text-[#0056D6] bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200/80 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0056D6]"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
            <span className="sm:hidden">Reorder</span>
            <span className="hidden sm:inline">Quick Reorder</span>
          </button>

          <button
            type="button"
            onClick={onCartClick}
            aria-label={`Cart with ${cartItemCount} items`}
            className="relative inline-flex items-center justify-center gap-1.5 h-9 sm:h-10 px-2.5 sm:px-3.5 text-xs sm:text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-gray-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0056D6]"
          >
            <ShoppingCart className="w-4 h-4 text-[#0056D6] shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Cart</span>
            {cartItemCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[11px] font-bold text-white bg-red-600 rounded-full tabular-nums">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Row */}
      <div className="md:hidden px-3 sm:px-4 pb-3 w-full">
        <div className="relative w-full">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products, brands, or SKUs..."
            aria-label="Search products, brands, or SKUs"
            className="w-full h-10 pl-9 pr-8 text-sm bg-slate-50 border border-gray-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0056D6]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
