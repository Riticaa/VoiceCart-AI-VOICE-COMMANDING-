import React, { useEffect } from 'react';
import { 
  Check, 
  ShoppingBag, 
  Truck, 
  PackageCheck, 
  ArrowRight,
  Clock,
  MapPin,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';

interface OrderSuccessScreenProps {
  orderId: string;
  orderTotal: number;
  onContinueShopping: () => void;
  onViewList: () => void;
}

export const OrderSuccessScreen: React.FC<OrderSuccessScreenProps> = ({
  orderId,
  orderTotal,
  onContinueShopping,
  onViewList
}) => {
  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#059669', '#10b981', '#34d399', '#f59e0b']
      });
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-6 text-center pb-24">
      {/* Animated Big Green Checkmark Ring (from Mockup) */}
      <div className="flex justify-center">
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="w-24 h-24 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-xl shadow-emerald-200 ring-8 ring-emerald-100"
        >
          <Check className="w-12 h-12 stroke-[3.5]" />
        </motion.div>
      </div>

      {/* Main Success Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Order Placed Successfully!
        </h1>
        <p className="text-xs text-gray-500 font-normal">
          Thank you for shopping with VoiceCart AI
        </p>
      </div>

      {/* Order ID Badge */}
      <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs">
        <span className="text-gray-500">Order ID:</span>
        <span className="font-mono font-extrabold text-emerald-800">{orderId}</span>
      </div>

      {/* Notification prompt */}
      <p className="text-xs text-gray-500 max-w-xs mx-auto">
        We will notify you when your order is on the way. Express delivery arriving within 30 minutes!
      </p>

      {/* Delivery Tracking Progress Timeline */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 text-left shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-gray-900 border-b border-gray-100 pb-2">
          <span>Live Order Tracking</span>
          <span className="text-emerald-700 font-normal flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Estimated: 25 mins
          </span>
        </div>

        <div className="space-y-3 pt-1">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900">Order Confirmed</div>
              <div className="text-[10px] text-gray-500">Payment received • ₹{orderTotal}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs shrink-0 mt-0.5 animate-pulse">
              <PackageCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900">Packing Items at Dark Store</div>
              <div className="text-[10px] text-gray-500">Fresh produce & dairy verified</div>
            </div>
          </div>

          <div className="flex items-start gap-3 opacity-40">
            <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs shrink-0 mt-0.5">
              <Truck className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900">Out for Delivery</div>
              <div className="text-[10px] text-gray-500">Rider assigned for express drop</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={onContinueShopping}
          id="continue-shopping-btn"
          className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-gray-50 text-emerald-800 font-bold text-xs sm:text-sm border-2 border-emerald-600 transition-all shadow-xs"
        >
          Continue Shopping
        </button>

        <button
          onClick={onViewList}
          className="w-full py-2.5 px-4 text-gray-500 hover:text-gray-900 font-medium text-xs transition-colors"
        >
          Start New Voice Command
        </button>
      </div>
    </div>
  );
};
