import React from 'react';
import { Star, Plus, Check, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isInCart?: boolean;
  cartQuantity?: number;
  buttonLabel?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  isInCart = false,
  cartQuantity = 0,
  buttonLabel = 'Add to Cart'
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group">
      <div>
        {/* Product Image & Badges */}
        <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-gray-50 mb-2.5">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {product.isOrganic && (
            <span className="absolute top-2 left-2 bg-emerald-700/90 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
              Organic
            </span>
          )}
          {product.isSeasonal && (
            <span className="absolute top-2 right-2 bg-amber-500/90 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              {product.seasonalTag || 'Seasonal'}
            </span>
          )}
        </div>

        {/* Brand & Category */}
        <div className="flex items-center justify-between text-[11px] text-gray-500 mb-0.5">
          <span className="font-medium text-emerald-800">{product.brand}</span>
          <span className="text-gray-400">{product.category}</span>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 leading-snug">
          {product.name}
        </h3>

        {/* Price & Unit */}
        <div className="flex items-baseline gap-1 mt-1 mb-1.5">
          <span className="text-base font-bold text-gray-900">
            ₹{product.price}
          </span>
          <span className="text-[11px] text-gray-500">
            / {product.unit}
          </span>
        </div>

        {/* Ratings */}
        <div className="flex items-center gap-1 text-[11px] text-amber-500 mb-3">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
              />
            ))}
          </div>
          <span className="text-gray-500 font-medium text-[10px]">
            ({product.reviewCount})
          </span>
        </div>
      </div>

      {/* Add Button */}
      <button
        onClick={() => onAddToCart(product)}
        id={`add-product-${product.id}`}
        className={`w-full py-2 px-3 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
          isInCart
            ? 'bg-emerald-700 text-white hover:bg-emerald-800'
            : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98]'
        }`}
      >
        {isInCart ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>In List ({cartQuantity})</span>
          </>
        ) : (
          <>
            <Plus className="w-3.5 h-3.5" />
            <span>{buttonLabel}</span>
          </>
        )}
      </button>
    </div>
  );
};
