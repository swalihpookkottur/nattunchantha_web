import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpDown, SearchX, X } from 'lucide-react';
import {
  BRAND_FILTERS,
  BrandFilter,
  CATEGORIES,
  CartItem,
  CategoryId,
  INITIAL_CART,
  INITIAL_PAST_ORDERS,
  PastOrder,
  PaymentMethod,
  Product,
  PRODUCTS,
} from './data/catalog';
import { Header } from './components/Header';
import { CategorySidebar } from './components/CategorySidebar';
import { ProductCard } from './components/ProductCard';
import { computeCartTotals, OrderSummary } from './components/OrderSummary';
import { QuickReorderModal } from './components/QuickReorderModal';
import {
  ConfirmedOrderReceipt,
  OrderConfirmationModal,
} from './components/OrderConfirmationModal';

type SortOption = 'featured' | 'margin-desc' | 'price-asc' | 'price-desc';

const STORAGE_CART_KEY = 'nattuchantha_b2b_cart_v1';
const STORAGE_ORDERS_KEY = 'nattuchantha_b2b_orders_v1';
const STORE_CREDIT_LIMIT = 150000;

function loadInitialCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_CART_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignore storage read errors
  }
  return INITIAL_CART;
}

function loadInitialOrders(): PastOrder[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_ORDERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Ignore storage read errors
  }
  return INITIAL_PAST_ORDERS;
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [selectedBrand, setSelectedBrand] = useState<BrandFilter>('All Brands');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const [cart, setCart] = useState<CartItem[]>(loadInitialCart);
  const [pastOrders, setPastOrders] = useState<PastOrder[]>(loadInitialOrders);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('pay-on-delivery');

  const [isQuickReorderOpen, setIsQuickReorderOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [confirmedReceipt, setConfirmedReceipt] =
    useState<ConfirmedOrderReceipt | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const desktopSummaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cart));
    } catch {
      // Ignore storage write errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(pastOrders));
    } catch {
      // Ignore storage write errors
    }
  }, [pastOrders]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const cartSummary = useMemo(() => computeCartTotals(cart), [cart]);

  const creditUsed = useMemo(() => {
    const outstanding = pastOrders
      .filter((o) => o.paymentMethod === 'credit-account' && o.status === 'Pending Dispatch')
      .reduce((sum, o) => sum + o.totalAmount, 0);
    return 24500 + outstanding;
  }, [pastOrders]);

  const creditAvailable = Math.max(0, STORE_CREDIT_LIMIT - creditUsed);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const list = PRODUCTS.filter((product) => {
      if (selectedCategory === 'deals') {
        if (!product.isDeal) return false;
      } else if (selectedCategory !== 'all') {
        if (product.category !== selectedCategory) return false;
      }

      if (selectedBrand !== 'All Brands' && product.brand !== selectedBrand) {
        return false;
      }

      if (query) {
        const haystack = `${product.title} ${product.shortTitle} ${product.brand} ${product.sku} ${product.category}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });

    if (sortBy === 'margin-desc') {
      return [...list].sort((a, b) => b.marginPercent - a.marginPercent);
    }
    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.wholesalePrice - b.wholesalePrice);
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.wholesalePrice - a.wholesalePrice);
    }
    return list;
  }, [searchQuery, selectedCategory, selectedBrand, sortBy]);

  const handleAddToCart = (product: Product, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId: product.id, quantity }];
    });
    setToastMessage(`Added ${quantity} × ${product.shortTitle} to order`);
  };

  const handleUpdateQuantity = (productId: string, nextQty: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: nextQty } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
    setToastMessage('Order cart cleared');
  };

  const handleRepeatOrder = (order: PastOrder, mode: 'merge' | 'replace') => {
    if (mode === 'replace') {
      setCart(order.items.map((i) => ({ ...i })));
      setPaymentMethod(order.paymentMethod);
      setToastMessage(`Loaded ${order.id} into Order Summary`);
    } else {
      setCart((prev) => {
        const next = [...prev];
        for (const incoming of order.items) {
          const existingIdx = next.findIndex(
            (item) => item.productId === incoming.productId
          );
          if (existingIdx >= 0) {
            next[existingIdx] = {
              ...next[existingIdx],
              quantity: next[existingIdx].quantity + incoming.quantity,
            };
          } else {
            next.push({ ...incoming });
          }
        }
        return next;
      });
      setToastMessage(`Added items from ${order.id} to cart`);
    }
    setIsQuickReorderOpen(false);
  };

  const handlePlaceOrder = () => {
    if (cartSummary.lines.length === 0) return;

    const orderNum = 8450 + pastOrders.length;
    const orderId = `ORD-${orderNum}`;
    const placedAt = new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newPastOrder: PastOrder = {
      id: orderId,
      dateLabel: `Just now · ${placedAt}`,
      paymentMethod,
      status: 'Pending Dispatch',
      items: cart.map((item) => ({ ...item })),
      totalAmount: cartSummary.grandTotal,
    };

    setConfirmedReceipt({
      orderId,
      placedAt,
      paymentMethod,
      summary: cartSummary,
    });
    setPastOrders((prev) => [newPastOrder, ...prev]);
    setCart([]);
    setIsMobileCartOpen(false);
  };

  const handleCartHeaderClick = () => {
    if (window.innerWidth < 1280) {
      setIsMobileCartOpen(true);
    } else {
      desktopSummaryRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('All Brands');
    setSortBy('featured');
  };

  const activeCategoryLabel =
    CATEGORIES.find((c) => c.id === selectedCategory)?.label ?? 'All Products';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 overflow-x-hidden">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartItemCount={cartSummary.totalUnits}
        onOpenQuickReorder={() => setIsQuickReorderOpen(true)}
        onCartClick={handleCartHeaderClick}
        onLogoClick={handleResetFilters}
      />

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-5 min-w-0">
        <div className="flex flex-col lg:flex-row items-start gap-6 min-w-0">
          {/* Left Sidebar: Categories */}
          <CategorySidebar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            creditUsed={creditUsed}
            creditLimit={STORE_CREDIT_LIMIT}
          />

          {/* Center: Brand Filter Bar & 4-Column Product Grid */}
          <div className="flex-1 min-w-0 w-full">
            {/* Heading & Filter Bar */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <h1 className="font-display text-lg font-bold text-slate-900">
                    {activeCategoryLabel}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
                    Showing {filteredProducts.length} wholesale{' '}
                    {filteredProducts.length === 1 ? 'SKU' : 'SKUs'} · Prices ex-GST
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <ArrowUpDown
                    className="w-3.5 h-3.5 text-slate-400 shrink-0"
                    aria-hidden="true"
                  />
                  <label htmlFor="catalog-sort" className="sr-only">
                    Sort products
                  </label>
                  <select
                    id="catalog-sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="h-9 px-3 text-xs font-medium text-slate-700 bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056D6] cursor-pointer"
                  >
                    <option value="featured">Sort: Recommended</option>
                    <option value="margin-desc">Sort: Highest Margin</option>
                    <option value="price-asc">Sort: Price Low to High</option>
                    <option value="price-desc">Sort: Price High to Low</option>
                  </select>
                </div>
              </div>

              {/* Brand Filter Strip */}
              <div
                className="flex items-center gap-1.5 overflow-x-auto pb-0.5 custom-scrollbar"
                role="tablist"
                aria-label="Filter by brand"
              >
                {BRAND_FILTERS.map((brand) => {
                  const isActive = selectedBrand === brand;
                  return (
                    <button
                      key={brand}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setSelectedBrand(brand)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0056D6] ${
                        isActive
                          ? 'bg-[#0056D6] text-white border-[#0056D6]'
                          : 'bg-slate-50 text-slate-700 border-gray-200 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {brand}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl py-16 px-6 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <SearchX className="w-6 h-6" />
                </div>
                <h2 className="font-display text-base font-bold text-slate-900">
                  No matching wholesale products found
                </h2>
                <p className="text-sm text-slate-500 mt-1 max-w-md">
                  Try clearing your brand filter or searching by another product name, brand, or SKU code.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#0056D6] hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => {
                  const inCartItem = cart.find((c) => c.productId === product.id);
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      inCartQty={inCartItem?.quantity ?? 0}
                      onAddToCart={handleAddToCart}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Sticky Sidebar: Order Summary (Desktop XL+) */}
          <aside
            ref={desktopSummaryRef}
            className="hidden xl:block w-[340px] shrink-0 sticky top-[92px]"
          >
            <OrderSummary
              cart={cart}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              onPlaceOrder={handlePlaceOrder}
              onOpenQuickReorder={() => setIsQuickReorderOpen(true)}
              creditAvailable={creditAvailable}
            />
          </aside>
        </div>
      </main>

      {/* Mobile / Tablet Slide-Over Cart Drawer */}
      {isMobileCartOpen && (
        <div
          className="xl:hidden fixed inset-0 z-50 flex justify-end bg-slate-900/50"
          role="dialog"
          aria-modal="true"
          aria-label="Order Summary Drawer"
        >
          <div className="w-full max-w-md bg-[#F8FAFC] h-full p-4 overflow-y-auto flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-bold text-slate-700">
                Ayyas Supermarket — Active Order
              </span>
              <button
                type="button"
                onClick={() => setIsMobileCartOpen(false)}
                aria-label="Close Order Summary"
                className="p-2 bg-white border border-gray-200 rounded-lg text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <OrderSummary
              cart={cart}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              onPlaceOrder={handlePlaceOrder}
              onOpenQuickReorder={() => {
                setIsMobileCartOpen(false);
                setIsQuickReorderOpen(true);
              }}
              creditAvailable={creditAvailable}
            />
          </div>
        </div>
      )}

      {/* Quick Reorder Modal */}
      <QuickReorderModal
        isOpen={isQuickReorderOpen}
        onClose={() => setIsQuickReorderOpen(false)}
        pastOrders={pastOrders}
        onRepeatOrder={handleRepeatOrder}
      />

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        receipt={confirmedReceipt}
        onClose={() => setConfirmedReceipt(null)}
      />

      {/* Subtle Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-lg pointer-events-none"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
