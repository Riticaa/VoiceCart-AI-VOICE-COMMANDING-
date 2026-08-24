import React from 'react';
import { 
  Sparkles, 
  Clock, 
  Sun, 
  Repeat, 
  Plus, 
  Check, 
  ArrowRightLeft,
  Info
} from 'lucide-react';
import { Product, ShoppingListItem, SubstituteSuggestion } from '../types';
import { RUNNING_LOW_ITEMS, SEASONAL_PICKS, SMART_SUBSTITUTES_LIST } from '../data/mockProducts';

interface SmartSuggestionsScreenProps {
  onAddProduct: (product: Product) => void;
  onSwapProduct: (substitute: SubstituteSuggestion) => void;
  shoppingList: ShoppingListItem[];
}

export const SmartSuggestionsScreen: React.FC<SmartSuggestionsScreenProps> = ({
  onAddProduct,
  onSwapProduct,
  shoppingList
}) => {
  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-1.5">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span>Suggested For You</span>
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          AI recommendations based on purchase frequency, season & healthy swaps.
        </p>
      </div>

      {/* 1. Running Low Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Running Low</span>
          <span className="text-[10px] text-gray-400 font-normal ml-auto flex items-center gap-1">
            <Info className="w-3 h-3" />
            Based on regular cadence
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {RUNNING_LOW_ITEMS.map(product => {
            const inList = shoppingList.some(it => it.productId === product.id || it.name.includes(product.name));
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-100 p-3 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-gray-50 mb-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-semibold text-xs text-gray-900 line-clamp-1">
                    {product.name}
                  </h4>
                  <div className="text-[10px] text-amber-700 font-medium mt-0.5">
                    {product.lastBoughtTime}
                  </div>
                  <div className="text-xs font-bold text-gray-900 mt-1">
                    ₹{product.price}
                  </div>
                </div>

                <button
                  onClick={() => onAddProduct(product)}
                  className={`mt-2.5 w-full py-1.5 px-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1 transition-all ${
                    inList
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  {inList ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  <span>{inList ? 'In List' : 'Add to List'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Seasonal Summer / Monsoon Picks */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Seasonal Picks (Indian Specials)</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {SEASONAL_PICKS.map(product => {
            const inList = shoppingList.some(it => it.productId === product.id || it.name.includes(product.name));
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-100 p-3 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-gray-50 mb-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1.5 right-1.5 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      Seasonal
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs text-gray-900 line-clamp-1">
                    {product.name}
                  </h4>
                  <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                    {product.seasonalTag}
                  </div>
                  <div className="text-xs font-bold text-gray-900 mt-1">
                    ₹{product.price} <span className="text-[10px] font-normal text-gray-500">/ {product.unit}</span>
                  </div>
                </div>

                <button
                  onClick={() => onAddProduct(product)}
                  className={`mt-2.5 w-full py-1.5 px-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1 transition-all ${
                    inList
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  {inList ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  <span>{inList ? 'In List' : 'Add to List'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Recommended Substitutes */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
          <Repeat className="w-3.5 h-3.5 text-emerald-600" />
          <span>Recommended Substitutes</span>
        </div>

        <div className="space-y-2.5">
          {SMART_SUBSTITUTES_LIST.map((sub, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-100 p-3.5 shadow-xs flex items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-gray-400 font-medium">
                  Instead of <span className="text-gray-600">{sub.originalItem}</span>
                </div>
                <h4 className="font-bold text-xs text-gray-900 mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span>{sub.suggestedProduct.name}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                    {sub.matchPercentage}% match
                  </span>
                </h4>
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">
                  {sub.reason}
                </p>
                <div className="text-xs font-bold text-emerald-800 mt-1">
                  ₹{sub.suggestedProduct.price} <span className="text-[10px] font-normal text-gray-400">/ {sub.suggestedProduct.unit}</span>
                </div>
              </div>

              <button
                onClick={() => onSwapProduct(sub)}
                id={`swap-btn-${idx}`}
                className="py-2 px-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-semibold text-xs flex items-center gap-1 shrink-0 shadow-xs transition-all"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Swap</span>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
