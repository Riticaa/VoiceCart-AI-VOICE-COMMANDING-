import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  CheckCircle2, 
  ShieldCheck, 
  Lock,
  Loader2,
  QrCode
} from 'lucide-react';

interface PaymentScreenProps {
  orderDetails: {
    total: number;
    subtotal: number;
    deliveryFee: number;
    discount: number;
  };
  onBack: () => void;
  onPlaceOrderSuccess: (orderId: string) => void;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  orderDetails,
  onBack,
  onPlaceOrderSuccess
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 8902');
  const [expiry, setExpiry] = useState('08/28');
  const [cvv, setCvv] = useState('890');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const generatedOrderId = `#VC-2026-${Math.floor(100 + Math.random() * 900)}`;
      onPlaceOrderSuccess(generatedOrderId);
    }, 1200);
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
          <h1 className="text-lg font-extrabold text-gray-900">Payment</h1>
          <p className="text-[11px] text-gray-500">Choose your preferred payment mode</p>
        </div>
      </div>

      {/* Select Payment Method */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Select Payment Method
        </span>

        {/* 1. Credit / Debit Card (Active Card Form) */}
        <div
          onClick={() => setSelectedMethod('card')}
          className={`bg-white rounded-2xl border p-4 transition-all cursor-pointer shadow-xs space-y-3 ${
            selectedMethod === 'card'
              ? 'border-emerald-600 ring-2 ring-emerald-600/10'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                selectedMethod === 'card' ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'
              }`}>
                {selectedMethod === 'card' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">Credit / Debit Card</div>
                <div className="text-[10px] text-gray-500">Pay securely with your bank card</div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                VISA
              </span>
              <span className="text-[10px] font-bold text-orange-800 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
                Mastercard
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                RuPay
              </span>
            </div>
          </div>

          {selectedMethod === 'card' && (
            <div className="space-y-2.5 pt-2 border-t border-gray-100 text-xs">
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  placeholder="4532 •••• •••• 8902"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    placeholder="MM / YY"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    placeholder="•••"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. UPI AutoPay / Instant Pay */}
        <div
          onClick={() => setSelectedMethod('upi')}
          className={`bg-white rounded-2xl border p-4 transition-all cursor-pointer shadow-xs space-y-2 ${
            selectedMethod === 'upi'
              ? 'border-emerald-600 ring-2 ring-emerald-600/10'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                selectedMethod === 'upi' ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'
              }`}>
                {selectedMethod === 'upi' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <span>UPI Instant Pay & AutoPay</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                    Recommended
                  </span>
                </div>
                <div className="text-[10px] text-gray-500">Instant transfer via secure UPI ID / QR</div>
              </div>
            </div>

            <span className="text-[10px] font-extrabold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
              UPI ⚡
            </span>
          </div>

          {selectedMethod === 'upi' && (
            <div className="space-y-2 pt-2 border-t border-gray-100 text-xs">
              <label className="block text-[10px] font-semibold text-gray-500 uppercase">
                Virtual Payment Address (VPA)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  placeholder="mobilenumber@upi or name@okaxis"
                />
                <button
                  type="button"
                  className="px-3 py-2 bg-emerald-50 text-emerald-700 font-semibold rounded-xl text-xs hover:bg-emerald-100"
                >
                  Verify
                </button>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-gray-500 pt-1">
                <span>Supports:</span>
                <span className="font-semibold text-gray-700">Google Pay</span>•
                <span className="font-semibold text-gray-700">PhonePe</span>•
                <span className="font-semibold text-gray-700">Paytm</span>•
                <span className="font-semibold text-gray-700">BHIM</span>
              </div>
            </div>
          )}
        </div>

        {/* 3. Cash on Delivery (COD) */}
        <div
          onClick={() => setSelectedMethod('cod')}
          className={`bg-white rounded-2xl border p-4 transition-all cursor-pointer shadow-xs ${
            selectedMethod === 'cod'
              ? 'border-emerald-600 ring-2 ring-emerald-600/10'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                selectedMethod === 'cod' ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'
              }`}>
                {selectedMethod === 'cod' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">Cash on Delivery / UPI on Delivery</div>
                <div className="text-[10px] text-gray-500">Pay cash or scan QR upon door delivery</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Total Banner */}
      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-gray-500 uppercase font-semibold">Order Total</span>
          <div className="text-lg font-extrabold text-emerald-950">₹{orderDetails.total}</div>
        </div>
        <div className="text-[11px] text-emerald-700 font-medium bg-emerald-100/70 px-2.5 py-1 rounded-lg">
          No extra delivery fee
        </div>
      </div>

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        disabled={isProcessing}
        id="place-order-btn"
        className="w-full py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] disabled:opacity-75 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 transition-all"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Securing Payment & Confirming...</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            <span>Place Order (₹{orderDetails.total})</span>
          </>
        )}
      </button>

      <div className="text-center text-[10px] text-gray-400 flex items-center justify-center gap-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>256-bit SSL Bank Grade Encryption</span>
      </div>
    </div>
  );
};
