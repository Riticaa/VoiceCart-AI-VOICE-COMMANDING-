import React, { useState } from 'react';
import { 
  Trash2, 
  Plus, 
  Minus, 
  Mic, 
  ArrowRight, 
  Check, 
  ChevronDown, 
  ChevronUp,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { ShoppingListItem, ProductCategory } from '../types';

interface ShoppingListScreenProps {
  shoppingList: ShoppingListItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onToggleCheck: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onClearList: () => void;
  onQuickAddItem: (name: string) => void;
  onProceedToCheckout: () => void;
  onStartVoiceInput: () => void;
  isListening: boolean;
}

export const ShoppingListScreen: React.FC<ShoppingListScreenProps> = ({
  shoppingList,
  onUpdateQuantity,
  onToggleCheck,
  onRemoveItem,
  onClearList,
  onQuickAddItem,
  onProceedToCheckout,
  onStartVoiceInput,
  isListening
}) => {
  const [quickInput, setQuickInput] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const totalItemsCount = shoppingList.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = shoppingList.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);

  // Group items by Category
  const categories: ProductCategory[] = ['Produce', 'Dairy', 'Pantry & Staples', 'Snacks', 'Beverages', 'Personal Care'];
  const groupedItems = categories.map(cat => ({
    category: cat,
    items: shoppingList.filter(item => item.category === cat)
  })).filter(g => g.items.length > 0);

  const toggleCategory = (cat: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickInput.trim()) {
      onQuickAddItem(quickInput.trim());
      setQuickInput('');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-4 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <span>My Shopping List</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              {totalItemsCount} Items
            </span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Estimated Total: <span className="font-bold text-emerald-800">₹{totalPrice}</span>
          </p>
        </div>

        {shoppingList.length > 0 && (
          <button
            onClick={onClearList}
            className="text-[11px] font-medium text-red-600 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Categorized List */}
      {shoppingList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200 p-6 space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-gray-900">Your shopping list is empty</h3>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            Use voice commands like <span className="font-medium text-emerald-700">"Add 2 packs of Amul milk"</span> or type an item below!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedItems.map(({ category, items }) => {
            const isCollapsed = collapsedCategories[category];
            const categoryCount = items.reduce((sum, it) => sum + it.quantity, 0);

            return (
              <div key={category} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full px-4 py-2.5 bg-gray-50/70 hover:bg-gray-100/70 transition-colors flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-gray-800">{category}</span>
                    <span className="text-[11px] font-semibold text-gray-400">
                      {categoryCount}
                    </span>
                  </div>
                  {isCollapsed ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {/* Category Items List */}
                {!isCollapsed && (
                  <div className="divide-y divide-gray-50 p-2 space-y-1">
                    {items.map(item => (
                      <div
                        key={item.id}
                        className={`p-2.5 rounded-xl transition-colors flex items-center justify-between gap-2.5 ${
                          item.checked ? 'bg-gray-50 opacity-60' : 'hover:bg-emerald-50/30'
                        }`}
                      >
                        {/* Checkbox & Item Info */}
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <button
                            onClick={() => onToggleCheck(item.id)}
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                              item.checked
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-gray-300 hover:border-emerald-600 bg-white'
                            }`}
                          >
                            {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>

                          <div className="min-w-0">
                            <h4 className={`text-xs font-semibold text-gray-900 truncate ${item.checked ? 'line-through text-gray-400' : ''}`}>
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                              <span>{item.category}</span>
                              <span>•</span>
                              <span className="font-medium text-emerald-800">
                                ₹{item.unitPrice} each (₹{item.unitPrice * item.quantity})
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Quantity Stepper & Delete Button */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200">
                            <button
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="p-1 rounded-md hover:bg-white text-gray-600 transition-colors"
                              title="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-gray-900 min-w-5 text-center px-1">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="p-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                              title="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Add Voice & Text Bar (Matching Mockup) */}
      <form onSubmit={handleQuickSubmit} className="sticky bottom-16 z-30 pt-2">
        <div className="relative flex items-center shadow-md rounded-2xl bg-white border border-emerald-200">
          <button
            type="button"
            onClick={onStartVoiceInput}
            className={`p-2.5 ml-1 rounded-xl transition-all ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'text-emerald-700 hover:bg-emerald-50'
            }`}
            title="Voice input"
          >
            <Mic className="w-4 h-4" />
          </button>
          
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="Say an item to add (e.g., '2 kg atta')..."
            id="quick-add-item-input"
            className="w-full py-2.5 px-2 bg-transparent text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!quickInput.trim()}
            className="p-2 mr-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 text-white transition-all shadow-xs"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Checkout Floating Button */}
      {shoppingList.length > 0 && (
        <button
          onClick={onProceedToCheckout}
          id="proceed-to-checkout-btn"
          className="w-full py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-xs sm:text-sm flex items-center justify-between shadow-lg shadow-emerald-700/20 transition-all"
        >
          <div className="text-left">
            <div className="text-[10px] text-emerald-100 font-normal uppercase tracking-wider">
              {totalItemsCount} items selected
            </div>
            <div className="text-sm font-extrabold">₹{totalPrice}</div>
          </div>
          <div className="flex items-center gap-1">
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      )}
    </div>
  );
};
