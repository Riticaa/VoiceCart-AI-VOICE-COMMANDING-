import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  ShoppingBag, 
  Heart, 
  CreditCard, 
  Bell, 
  Shield, 
  HelpCircle, 
  ChevronRight, 
  LogOut,
  Edit3,
  Check,
  Globe,
  Volume2
} from 'lucide-react';

interface ProfileScreenProps {
  onNavigateToTab: (tab: 'home' | 'list' | 'search' | 'smart' | 'profile') => void;
  selectedLanguage: string;
  onChangeLanguage: (lang: string) => void;
  ttsEnabled: boolean;
  onToggleTTS: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onNavigateToTab,
  selectedLanguage,
  onChangeLanguage,
  ttsEnabled,
  onToggleTTS
}) => {
  const [name, setName] = useState('Rahul Sharma');
  const [email, setEmail] = useState('rahul.sharma@example.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [isEditing, setIsEditing] = useState(false);

  const [dietaryPrefs, setDietaryPrefs] = useState<string[]>(['Organic Only', 'Vegetarian']);

  const togglePref = (pref: string) => {
    setDietaryPrefs(prev => 
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-5 pb-24">
      {/* Profile Info Banner */}
      <div className="bg-radial from-emerald-800 to-teal-900 text-white rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center font-bold text-xl text-white shadow-inner">
              {name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight">{name}</h2>
              <p className="text-xs text-emerald-200">{phone}</p>
              <p className="text-[11px] text-emerald-300/80">{email}</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Edit Profile"
          >
            {isEditing ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          </button>
        </div>

        {isEditing && (
          <div className="pt-3 border-t border-emerald-700/50 space-y-2 text-xs">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full p-2 rounded-xl bg-emerald-950/60 border border-emerald-600/60 text-white placeholder-emerald-400 focus:outline-none"
            />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              className="w-full p-2 rounded-xl bg-emerald-950/60 border border-emerald-600/60 text-white placeholder-emerald-400 focus:outline-none"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full p-2 rounded-xl bg-emerald-950/60 border border-emerald-600/60 text-white placeholder-emerald-400 focus:outline-none"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-700/50 text-xs">
          <div className="bg-white/10 rounded-xl p-2.5">
            <span className="text-emerald-200 text-[10px] uppercase font-semibold">Active Currency</span>
            <div className="font-bold text-sm">Indian Rupee (₹)</div>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5">
            <span className="text-emerald-200 text-[10px] uppercase font-semibold">Saved Items</span>
            <div className="font-bold text-sm">18 items in list</div>
          </div>
        </div>
      </div>

      {/* Dietary & Smart Voice Preferences */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
          Dietary & Shopping Preferences
        </h3>
        <div className="flex flex-wrap gap-2">
          {['Organic Only', 'Vegetarian', 'Gluten-Free', 'Low Sugar', 'Seasonal Alerts', 'Substitute Prompts'].map(pref => {
            const active = dietaryPrefs.includes(pref);
            return (
              <button
                key={pref}
                onClick={() => togglePref(pref)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                  active 
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs' 
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {active && '✓ '}
                {pref}
              </button>
            );
          })}
        </div>
      </div>

      {/* Account Navigation Options */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs divide-y divide-gray-50 text-xs">
        <div 
          onClick={() => onNavigateToTab('list')}
          className="p-3.5 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3 text-gray-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">Active Shopping List</div>
              <div className="text-[11px] text-gray-400">View and edit items in your cart</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>

        <div className="p-3.5 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="flex items-center gap-3 text-gray-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">Saved Delivery Addresses</div>
              <div className="text-[11px] text-gray-400">Flat 402, Green Glen Heights, Bengaluru</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>

        <div className="p-3.5 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="flex items-center gap-3 text-gray-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">Payment Methods & UPI</div>
              <div className="text-[11px] text-gray-400">UPI AutoPay, RuPay Cards & COD</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>

        <div className="p-3.5 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="flex items-center gap-3 text-gray-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">Help & Customer Support</div>
              <div className="text-[11px] text-gray-400">24x7 Assistant & FAQ</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Voice Assistant Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
          Voice Assistant Settings
        </h3>

        <div className="flex items-center justify-between text-xs py-1">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <div>
              <div className="font-bold text-gray-900">Voice Audio Feedback</div>
              <div className="text-[10px] text-gray-400">Read back added grocery items out loud</div>
            </div>
          </div>
          <button
            onClick={onToggleTTS}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              ttsEnabled ? 'bg-emerald-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                ttsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between text-xs py-1 border-t border-gray-50 pt-2">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600" />
            <div>
              <div className="font-bold text-gray-900">Speech Recognition Language</div>
              <div className="text-[10px] text-gray-400">Indian English, Hindi, and Hinglish supported</div>
            </div>
          </div>
          <select
            value={selectedLanguage}
            onChange={(e) => onChangeLanguage(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-emerald-900 text-xs font-medium rounded-lg p-1.5 focus:outline-none"
          >
            <option value="en">English (India)</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="hinglish">Hinglish</option>
          </select>
        </div>
      </div>

    </div>
  );
};
