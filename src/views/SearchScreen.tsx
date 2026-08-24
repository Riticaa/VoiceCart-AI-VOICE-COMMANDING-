import React, { useState, useMemo } from 'react';
import { 
  Search as SearchIcon, 
  Mic, 
  X, 
  SlidersHorizontal, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { AudioVisualizer } from '../components/AudioVisualizer';
import { Product, ShoppingListItem } from '../types';

interface SearchScreenProps {
  products: Product[];
  shoppingList: ShoppingListItem[];
  onAddToCart: (product: Product) => void;
  activeVoiceQuery?: string;
  isListening: boolean;
  onStartVoiceSearch: () => void;
  onStopVoiceSearch: () => void;
  initialFilter?: {
    maxPrice?: number;
    isOrganic?: boolean;
    brand?: string;
  };
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  products,
  shoppingList,
  onAddToCart,
  activeVoiceQuery = '',
  isListening,
  onStartVoiceSearch,
  onStopVoiceSearch,
  initialFilter
}) => {
  const [searchTerm, setSearchTerm] = useState(activeVoiceQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>(initialFilter?.brand || 'All');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number | null>(initialFilter?.maxPrice || null);
  const [organicOnly, setOrganicOnly] = useState<boolean>(initialFilter?.isOrganic || false);
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating'>('default');

  const categories = ['All', 'Produce', 'Dairy', 'Pantry & Staples', 'Snacks', 'Beverages'];
  const brands = ['All', 'Amul', 'Tata', 'Aashirvaad', 'Epigamia', "Haldiram's", 'Mother Dairy', 'Fortune'];

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(term);
        const matchHindi = p.hindiName && p.hindiName.toLowerCase().includes(term);
        const matchBrand = p.brand.toLowerCase().includes(term);
        const matchCategory = p.category.toLowerCase().includes(term);
        if (!matchName && !matchHindi && !matchBrand && !matchCategory) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Brand
      if (selectedBrand !== 'All' && p.brand !== selectedBrand) {
        return false;
      }

      // Max price
      if (maxPriceFilter !== null && p.price > maxPriceFilter) {
        return false;
      }

      // Organic
      if (organicOnly && !p.isOrganic) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [products, searchTerm, selectedCategory, selectedBrand, maxPriceFilter, organicOnly, sortBy]);

  const activeFiltersCount = (selectedCategory !== 'All' ? 1 : 0) + 
    (selectedBrand !== 'All' ? 1 : 0) + 
    (maxPriceFilter !== null ? 1 : 0) + 
    (organicOnly ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setMaxPriceFilter(null);
    setOrganicOnly(false);
    setSearchTerm('');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-4 pb-24">
      {/* Search Input Bar with Mic */}
      <div className="relative flex items-center">
        <SearchIcon className="absolute left-3.5 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Find organic apples under ₹150..."
          id="search-products-input"
          className="w-full pl-10 pr-20 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-all shadow-2xs"
        />

        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-12 text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={isListening ? onStopVoiceSearch : onStartVoiceSearch}
          id="search-voice-mic-btn"
          className={`absolute right-2 p-2 rounded-xl transition-all ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
          title="Voice Search"
        >
          <Mic className="w-4 h-4" />
        </button>
      </div>

      {/* Voice Processing Banner from mockup */}
      {(isListening || (activeVoiceQuery && activeVoiceQuery.length > 0)) && (
        <div className="bg-radial from-emerald-50 to-white rounded-2xl border border-emerald-200/80 p-4 text-center space-y-2 shadow-xs">
          <p className="text-xs sm:text-sm font-bold text-emerald-950">
            "{activeVoiceQuery || searchTerm || 'Find me organic apples under ₹150'}"
          </p>
          <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-700">
            {isListening ? 'Listening & Processing...' : 'Search Results for Voice Command'}
          </div>
          <AudioVisualizer isListening={isListening} color="bg-emerald-600" barCount={20} />
        </div>
      )}

      {/* Filter Quick Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {/* Price quick filters */}
        <button
          onClick={() => setMaxPriceFilter(maxPriceFilter === 100 ? null : 100)}
          className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all border ${
            maxPriceFilter === 100 
              ? 'bg-emerald-700 text-white border-emerald-700' 
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          Under ₹100
        </button>

        <button
          onClick={() => setMaxPriceFilter(maxPriceFilter === 250 ? null : 250)}
          className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all border ${
            maxPriceFilter === 250 
              ? 'bg-emerald-700 text-white border-emerald-700' 
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          Under ₹250
        </button>

        {/* Organic Tag */}
        <button
          onClick={() => setOrganicOnly(!organicOnly)}
          className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all border flex items-center gap-1 ${
            organicOnly 
              ? 'bg-emerald-700 text-white border-emerald-700' 
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>Organic / Desi</span>
        </button>

        {/* Brand filters */}
        {['Amul', 'Tata', 'Epigamia', "Haldiram's"].map(b => (
          <button
            key={b}
            onClick={() => setSelectedBrand(selectedBrand === b ? 'All' : b)}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all border ${
              selectedBrand === b 
                ? 'bg-emerald-700 text-white border-emerald-700' 
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            Brand: {b}
          </button>
        ))}

        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="px-2.5 py-1.5 rounded-full text-red-600 bg-red-50 hover:bg-red-100 font-medium whitespace-nowrap border border-red-200"
          >
            Reset
          </button>
        )}
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-bold text-gray-700">
          Found {filteredProducts.length} matching products
        </span>
        <div className="flex items-center gap-1 text-[11px] text-gray-500">
          <span>Sort:</span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-transparent font-medium text-emerald-800 focus:outline-none cursor-pointer"
          >
            <option value="default">Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-6 space-y-2">
          <SearchIcon className="w-8 h-8 text-gray-300 mx-auto" />
          <h4 className="text-xs font-bold text-gray-700">No products found</h4>
          <p className="text-[11px] text-gray-500">
            Try adjusting your search query or removing filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-2 text-xs font-medium text-emerald-700 underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map(product => {
            const inList = shoppingList.find(it => it.productId === product.id || it.name.toLowerCase() === product.name.toLowerCase());
            return (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                isInCart={!!inList}
                cartQuantity={inList?.quantity || 0}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
