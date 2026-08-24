import React, { useState } from 'react';
import { 
  Mic, 
  Volume2, 
  VolumeX, 
  Globe, 
  Bell, 
  Code2, 
  Sparkles,
  ShoppingBag,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  ttsEnabled: boolean;
  onToggleTTS: () => void;
  selectedLanguage: string;
  onChangeLanguage: (lang: string) => void;
  totalCartItems: number;
  onOpenCart: () => void;
  userName?: string;
  onUpdateUserName?: (name: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  ttsEnabled,
  onToggleTTS,
  selectedLanguage,
  onChangeLanguage,
  totalCartItems,
  onOpenCart,
  userName = 'there'
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [notifications] = useState([
    { id: '1', title: 'Running Low Alert', message: 'You usually buy Amul Milk every 3 days. Ready to reorder?', time: '5m ago' },
    { id: '2', title: 'Seasonal Mangoes In Stock', message: 'Fresh Ratnagiri Alphonso Mangoes now available!', time: '1h ago' }
  ]);

  const languages = [
    { code: 'en', label: 'English (India)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'hinglish', label: 'Hinglish (Mix)' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-emerald-100 px-4 py-3 shadow-xs">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* App Brand */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-200">
            <Mic className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg text-emerald-950 tracking-tight">VoiceCart</span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
              AI
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Multilingual Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors border border-gray-200"
              title="Change Voice Recognition Language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span className="uppercase text-[11px] font-semibold">{selectedLanguage}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 text-xs">
                <div className="px-3 py-1 font-semibold text-gray-400 text-[10px] uppercase">
                  Voice Language
                </div>
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onChangeLanguage(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-emerald-50 ${
                      selectedLanguage === lang.code ? 'text-emerald-700 font-medium bg-emerald-50/50' : 'text-gray-700'
                    }`}
                  >
                    <span>{lang.label}</span>
                    {selectedLanguage === lang.code && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Text to Speech Voice Toggle */}
          <button
            onClick={onToggleTTS}
            className={`p-2 rounded-lg transition-colors border ${
              ttsEnabled 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'
            }`}
            title={ttsEnabled ? 'Voice Responses Enabled' : 'Voice Responses Muted'}
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors border border-gray-200 relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white animate-pulse" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="font-semibold text-xs text-gray-900">Notifications</span>
                  <span className="text-[10px] text-emerald-600 font-medium">Mark all read</span>
                </div>
                <div className="divide-y divide-gray-50 max-h-60 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="py-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-gray-900">{n.title}</p>
                        <span className="text-[10px] text-gray-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Cart Pill */}
          <button
            onClick={onOpenCart}
            id="header-cart-btn"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{totalCartItems}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
