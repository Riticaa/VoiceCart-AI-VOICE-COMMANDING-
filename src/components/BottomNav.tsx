import React from 'react';
import { 
  Home, 
  CheckSquare, 
  Search, 
  Sparkles, 
  User
} from 'lucide-react';

export type TabType = 'home' | 'list' | 'search' | 'smart' | 'profile';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  listCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChangeTab,
  listCount
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'list' as TabType, label: 'List', icon: CheckSquare, badge: listCount },
    { id: 'search' as TabType, label: 'Search', icon: Search },
    { id: 'smart' as TabType, label: 'Smart', icon: Sparkles },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-100 px-3 py-2 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                isActive 
                  ? 'text-emerald-700 font-semibold' 
                  : 'text-gray-400 hover:text-gray-600 font-normal'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.3]' : 'stroke-[1.8]'}`} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-1 ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
