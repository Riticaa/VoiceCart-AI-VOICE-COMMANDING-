import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Truck, 
  Store, 
  Tag, 
  Check, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { ShoppingListItem } from '../types';

interface CheckoutScreenProps {
  shoppingList: ShoppingListItem[];
  onBack: () => void;
  onProceedToPayment: (details: {
    deliveryType: 'Delivery' | 'Pickup';
    address: any;
    subtotal: number;
    deliveryFee: number;
    discount: number;
    promoCode?: string;
    total: number;
  }) => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  shoppingList,
  onBack,
  onProceedToPayment
}) => {
  const [deliveryType, setDeliveryType] = useState<'Delivery' | 'Pickup'>('Delivery');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [promoError, setPromoError] = useState('');

  const [address, setAddress] = useState({
    name: 'Sarah Connor / Rahul Sharma',
    street: 'Flat 402, Green Glen Heights, Outer Ring Rd, Bellandur',
    city: 'Bengaluru, Karnataka',
    pincode: '560103',
    phone: '+91 98765 43210'
  });

  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const subtotal = shoppingList.reduce((sum, it) => sum + (it.unitPrice * it.quantity), 0);
  const deliveryFee = deliveryType === 'Delivery' ? (subtotal > 500 ? 0 : 0) : 0; // Free delivery promo!
  const discount = appliedPromo ? (subtotal * appliedPromo.discount) : 0;
  const totalPrice = Math.max(0, subtotal + deliveryFee - discount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'VOICECART' || code === 'WELCOME10' || code === 'INDIASAVE' || code === 'STUDENTPRO') {
      setAppliedPromo({ code, discount: 0.15 }); // 15% discount
    } else {
      setPromoError('Invalid coupon code. Try: WELCOME10, INDIASAVE, or STUDENTPRO');
    }
  };

  const handleProceed = () => {
    onProceedToPayment({
      deliveryType,
      address,
      subtotal,
      deliveryFee,
      discount,
      promoCode: appliedPromo?.code,
      total: Math.round(totalPrice)
    });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-lg font-extrabold text-gray-900">Checkout</h1>
          <p className="text-[11px] text-gray-500">Review items & delivery address</p>
        </div>
      </div>

      {/* Delivery vs Pickup Toggle Tabs */}
      <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-2xl">
        <button
          onClick={() => setDeliveryType('Delivery')}
          className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            deliveryType === 'Delivery'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Delivery</span>
        </button>

        <button
          onClick={() => setDeliveryType('Pickup')}
          className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            deliveryType === 'Pickup'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Pickup</span>
        </button>
      </div>

      {/* Delivery Address Card */}
      {deliveryType === 'Delivery' ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Delivery Address</span>
            </div>
            <button
              onClick={() => setIsEditingAddress(!isEditingAddress)}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              {isEditingAddress ? 'Save' : 'Edit'}
            </button>
          </div>

          {isEditingAddress ? (
            <div className="space-y-2 pt-2 text-xs">
              <input
                type="text"
                value={address.name}
                onChange={(e) => setAddress({ ...address, name: e.target.value })}
                placeholder="Full Name"
                className="w-full p-2 border border-gray-200 rounded-xl"
              />
              <input
                type="text"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                placeholder="Street / Building"
                className="w-full p-2 border border-gray-200 rounded-xl"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="City, State"
                  className="p-2 border border-gray-200 rounded-xl"
                />
                <input
                  type="text"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  placeholder="Pincode"
                  className="p-2 border border-gray-200 rounded-xl"
                />
              </div>
              <input
                type="text"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                placeholder="Mobile Number"
                className="w-full p-2 border border-gray-200 rounded-xl"
              />
            </div>
          ) : (
            <div className="text-xs text-gray-600 pl-6 space-y-0.5">
              <div className="font-semibold text-gray-900">{address.name}</div>
              <div>{address.street}</div>
              <div>{address.city} - {address.pincode}</div>
              <div className="text-[11px] text-gray-500">{address.phone}</div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
            <Store className="w-4 h-4 text-emerald-600" />
            <span>Store Pickup Point</span>
          </div>
          <p className="text-xs text-gray-600 pl-6">
            VoiceCart SuperStore, #14 Ground Floor, 100ft Road, Indiranagar, Bengaluru. Ready in 20 mins.
          </p>
        </div>
      )}

      {/* Arrives Today Banner */}
      <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-3.5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
          <Clock className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-bold text-emerald-950">Arrives Today (Express)</div>
          <div className="text-[11px] text-emerald-700">
            Estimated delivery window: Within 30 - 45 Minutes
          </div>
        </div>
      </div>

      {/* Order Summary Itemized */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs space-y-3">
        <h3 className="font-bold text-xs text-gray-900 uppercase tracking-wider">
          Order Summary ({shoppingList.length} items)
        </h3>

        <div className="divide-y divide-gray-50 max-h-48 overflow-y-auto pr-1">
          {shoppingList.map(item => (
            <div key={item.id} className="py-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-700">{item.quantity}x</span>
                <span className="text-gray-900 line-clamp-1">{item.name}</span>
              </div>
              <span className="font-semibold text-gray-900 shrink-0">
                ₹{item.unitPrice * item.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* Promo Code Input */}
        <form onSubmit={handleApplyPromo} className="pt-2">
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code (e.g. INDIASAVE)"
                className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs uppercase placeholder:normal-case font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
            >
              Apply
            </button>
          </div>

          {appliedPromo && (
            <div className="mt-1.5 flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
              <Check className="w-3 h-3" />
              <span>Promo {appliedPromo.code} applied (15% OFF)</span>
            </div>
          )}

          {promoError && (
            <div className="mt-1.5 text-[11px] text-red-600">
              {promoError}
            </div>
          )}
        </form>

        {/* Pricing Calculation Breakdown */}
        <div className="pt-3 border-t border-gray-100 space-y-1.5 text-xs">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between text-gray-500">
            <span>Delivery Fee</span>
            <span className="text-emerald-700 font-semibold">FREE</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Coupon Discount</span>
              <span>-₹{Math.round(discount)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-gray-100">
            <span>Total Price</span>
            <span className="text-emerald-800 text-base">₹{Math.round(totalPrice)}</span>
          </div>
        </div>
      </div>

      {/* Proceed Button */}
      <button
        onClick={handleProceed}
        id="proceed-to-payment-btn"
        className="w-full py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 transition-all"
      >
        <span>Proceed to Payment</span>
        <ChevronRight className="w-4 h-4" />
      </button>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>100% Safe & Secure Payment via RBI-authorized gateways</span>
      </div>
    </div>
  );
};
