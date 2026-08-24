/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeScreen } from './views/HomeScreen';
import { SearchScreen } from './views/SearchScreen';
import { ShoppingListScreen } from './views/ShoppingListScreen';
import { SmartSuggestionsScreen } from './views/SmartSuggestionsScreen';
import { ProfileScreen } from './views/ProfileScreen';
import { CheckoutScreen } from './views/CheckoutScreen';
import { PaymentScreen } from './views/PaymentScreen';
import { OrderSuccessScreen } from './views/OrderSuccessScreen';
import { INDIAN_PRODUCTS_CATALOG, INITIAL_SHOPPING_LIST } from './data/mockProducts';
import { ShoppingListItem, Product, VoiceCommandHistory, SubstituteSuggestion, NLPCommandResult } from './types';
import { speechManager, speakText } from './utils/speech';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<TabType | 'checkout' | 'payment' | 'order-success'>('home');
  
  // App Data State
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>(INITIAL_SHOPPING_LIST);
  const [recentCommands, setRecentCommands] = useState<VoiceCommandHistory[]>([
    {
      id: 'cmd-1',
      commandText: 'Add organic Aashirvaad atta and Tata salt',
      actionTaken: 'Added 2 items',
      timestamp: new Date(Date.now() - 60000).toISOString(),
      timeAgo: 'Just now'
    },
    {
      id: 'cmd-2',
      commandText: 'Show my list summary',
      actionTaken: 'Displayed List',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      timeAgo: '10 mins ago'
    },
    {
      id: 'cmd-3',
      commandText: 'Remove potato chips from snacks',
      actionTaken: 'Removed 1 item',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      timeAgo: '1 hour ago'
    }
  ]);

  // Voice & Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const [activeTranscript, setActiveTranscript] = useState('');
  const [lastSpokenFeedback, setLastSpokenFeedback] = useState<string>(
    'Hi! Tap the mic or pick any command below to manage your Indian grocery list in Rupees.'
  );
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'hinglish'>('en');

  // Search & Filters State
  const [activeVoiceSearchQuery, setActiveVoiceSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<{ maxPrice?: number; isOrganic?: boolean; brand?: string }>({});

  // Checkout & Order State
  const [orderDetails, setOrderDetails] = useState<{
    orderId: string;
    total: number;
    subtotal: number;
    deliveryFee: number;
    discount: number;
    promoCode?: string;
  }>({
    orderId: '#VC-2026-984',
    total: 350,
    subtotal: 350,
    deliveryFee: 0,
    discount: 0
  });

  // User and Profile State
  const [userName, setUserName] = useState('there');

  // Execute NLP Result on Shopping State
  const handleExecuteNLPResult = useCallback((nlp: NLPCommandResult, originalCommand: string) => {
    // 1. Add to Recent Commands
    const newHistory: VoiceCommandHistory = {
      id: `cmd-${Date.now()}`,
      commandText: originalCommand,
      actionTaken: nlp.action.replace('_', ' '),
      timestamp: new Date().toISOString(),
      timeAgo: 'Just now',
      language: nlp.detectedLanguage || selectedLanguage
    };
    setRecentCommands(prev => [newHistory, ...prev.slice(0, 9)]);

    // 2. Set Voice Feedback & Speak
    if (nlp.spokenFeedback) {
      setLastSpokenFeedback(nlp.spokenFeedback);
      speakText(nlp.spokenFeedback, ttsEnabled, selectedLanguage === 'hi' ? 'hi-IN' : 'en-IN');
    }

    // 3. Perform specific actions
    switch (nlp.action) {
      case 'ADD_ITEM': {
        if (nlp.items && nlp.items.length > 0) {
          nlp.items.forEach(item => {
            const matchedProd = INDIAN_PRODUCTS_CATALOG.find(p => 
              p.name.toLowerCase().includes(item.name.toLowerCase()) || 
              item.name.toLowerCase().includes(p.name.toLowerCase()) ||
              (p.hindiName && p.hindiName.toLowerCase().includes(item.name.toLowerCase()))
            );

            const newItem: ShoppingListItem = {
              id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              productId: matchedProd?.id,
              name: matchedProd ? matchedProd.name : item.name,
              category: (matchedProd?.category || item.category || 'Produce') as any,
              quantity: item.quantity || 1,
              unit: matchedProd?.unit || item.unit || 'pack',
              unitPrice: matchedProd?.price || 50,
              checked: false,
              image: matchedProd?.image,
              brand: matchedProd?.brand || item.brand
            };

            setShoppingList(prev => {
              // Check if already in list -> increment
              const existingIndex = prev.findIndex(p => p.name.toLowerCase() === newItem.name.toLowerCase());
              if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex].quantity += newItem.quantity;
                return updated;
              }
              return [newItem, ...prev];
            });
          });
        }
        break;
      }

      case 'REMOVE_ITEM': {
        if (nlp.items && nlp.items.length > 0) {
          const targetName = nlp.items[0].name.toLowerCase();
          setShoppingList(prev => prev.filter(it => !it.name.toLowerCase().includes(targetName) && (!it.brand || !it.brand.toLowerCase().includes(targetName))));
        }
        break;
      }

      case 'SEARCH': {
        setActiveVoiceSearchQuery(nlp.searchQuery || originalCommand);
        setSearchFilters({
          maxPrice: nlp.filters?.maxPrice,
          isOrganic: nlp.filters?.isOrganic,
          brand: nlp.filters?.brand
        });
        setCurrentTab('search');
        break;
      }

      case 'SHOW_LIST': {
        setCurrentTab('list');
        break;
      }

      case 'SHOW_SUGGESTIONS': {
        setCurrentTab('smart');
        break;
      }

      case 'CHECKOUT': {
        setCurrentTab('checkout');
        break;
      }

      case 'CLEAR_LIST': {
        setShoppingList([]);
        break;
      }

      default:
        break;
    }
  }, [ttsEnabled, selectedLanguage]);

  // Process Voice Query with Gemini / Server NLP
  const processVoiceCommand = async (command: string) => {
    setActiveTranscript(command);
    try {
      const res = await fetch('/api/nlp-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commandText: command,
          language: selectedLanguage
        })
      });

      if (res.ok) {
        const data: NLPCommandResult = await res.json();
        handleExecuteNLPResult(data, command);
      } else {
        // Fallback local execution
        handleExecuteNLPResult({
          action: 'ADD_ITEM',
          items: [{ name: command, quantity: 1, unit: 'pack' }],
          spokenFeedback: `Added ${command} to your list.`
        }, command);
      }
    } catch (e) {
      console.warn('Backend NLP call failed, using client fallback:', e);
      handleExecuteNLPResult({
        action: 'ADD_ITEM',
        items: [{ name: command, quantity: 1, unit: 'pack' }],
        spokenFeedback: `Added ${command} to your list.`
      }, command);
    } finally {
      setIsListening(false);
      setTimeout(() => setActiveTranscript(''), 2500);
    }
  };

  // Start Mic Listening
  const startListening = () => {
    setActiveTranscript('');
    setIsListening(true);
    speechManager.setLanguage(selectedLanguage);

    const started = speechManager.startListening(
      (transcript) => {
        setActiveTranscript(transcript);
      },
      (error) => {
        console.warn('Speech recognition notice:', error);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
        if (activeTranscript.trim()) {
          processVoiceCommand(activeTranscript.trim());
        }
      }
    );

    if (!started) {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    speechManager.stopListening();
    setIsListening(false);
    if (activeTranscript.trim()) {
      processVoiceCommand(activeTranscript.trim());
    }
  };

  // Shopping List Operations
  const handleAddToCart = (product: Product) => {
    setShoppingList(prev => {
      const existing = prev.find(it => it.productId === product.id || it.name.toLowerCase() === product.name.toLowerCase());
      if (existing) {
        return prev.map(it => it.id === existing.id ? { ...it, quantity: it.quantity + 1 } : it);
      }
      const newItem: ShoppingListItem = {
        id: `item-${Date.now()}`,
        productId: product.id,
        name: product.name,
        category: product.category,
        quantity: 1,
        unit: product.unit,
        unitPrice: product.price,
        checked: false,
        image: product.image,
        brand: product.brand
      };
      return [newItem, ...prev];
    });

    const feedback = `Added ${product.name} to your list for ₹${product.price}.`;
    setLastSpokenFeedback(feedback);
    speakText(feedback, ttsEnabled, selectedLanguage === 'hi' ? 'hi-IN' : 'en-IN');
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setShoppingList(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as ShoppingListItem[];
    });
  };

  const handleToggleCheck = (id: string) => {
    setShoppingList(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleRemoveItem = (id: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
  };

  const handleClearList = () => {
    setShoppingList([]);
    setLastSpokenFeedback('Your shopping list has been cleared.');
  };

  const handleQuickAddItem = (name: string) => {
    processVoiceCommand(`Add ${name}`);
  };

  // Handle Smart Swap
  const handleSwapProduct = (sub: SubstituteSuggestion) => {
    const feedback = `Swapped for ${sub.suggestedProduct.name} (${sub.matchPercentage}% healthier match).`;
    handleAddToCart(sub.suggestedProduct);
    setLastSpokenFeedback(feedback);
    speakText(feedback, ttsEnabled, selectedLanguage === 'hi' ? 'hi-IN' : 'en-IN');
    setCurrentTab('list');
  };

  const totalCartCount = shoppingList.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-100/60 font-sans text-gray-900 flex flex-col selection:bg-emerald-200">
      
      {/* Top Header */}
      <Header
        ttsEnabled={ttsEnabled}
        onToggleTTS={() => setTtsEnabled(!ttsEnabled)}
        selectedLanguage={selectedLanguage}
        onChangeLanguage={(lang: any) => setSelectedLanguage(lang)}
        totalCartItems={totalCartCount}
        onOpenCart={() => setCurrentTab('list')}
        userName={userName}
      />

      {/* Main Screen Container - Styled with pristine mobile-first layout */}
      <main className="flex-1 w-full max-w-md mx-auto bg-white min-h-[calc(100vh-58px)] shadow-xl shadow-slate-200/50 border-x border-gray-100 flex flex-col relative overflow-x-hidden">
        
        {currentTab === 'home' && (
          <HomeScreen
            userName={userName}
            isListening={isListening}
            onStartListening={startListening}
            onStopListening={stopListening}
            onRunQuickPrompt={(p) => processVoiceCommand(p)}
            recentCommands={recentCommands}
            lastSpokenFeedback={lastSpokenFeedback}
            activeTranscript={activeTranscript}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
            shoppingList={shoppingList}
          />
        )}

        {currentTab === 'search' && (
          <SearchScreen
            products={INDIAN_PRODUCTS_CATALOG}
            shoppingList={shoppingList}
            onAddToCart={handleAddToCart}
            activeVoiceQuery={activeVoiceSearchQuery}
            isListening={isListening}
            onStartVoiceSearch={startListening}
            onStopVoiceSearch={stopListening}
            initialFilter={searchFilters}
          />
        )}

        {currentTab === 'list' && (
          <ShoppingListScreen
            shoppingList={shoppingList}
            onUpdateQuantity={handleUpdateQuantity}
            onToggleCheck={handleToggleCheck}
            onRemoveItem={handleRemoveItem}
            onClearList={handleClearList}
            onQuickAddItem={handleQuickAddItem}
            onProceedToCheckout={() => setCurrentTab('checkout')}
            onStartVoiceInput={startListening}
            isListening={isListening}
          />
        )}

        {currentTab === 'smart' && (
          <SmartSuggestionsScreen
            onAddProduct={handleAddToCart}
            onSwapProduct={handleSwapProduct}
            shoppingList={shoppingList}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileScreen
            onNavigateToTab={(tab) => setCurrentTab(tab)}
            selectedLanguage={selectedLanguage}
            onChangeLanguage={(lang: any) => setSelectedLanguage(lang)}
            ttsEnabled={ttsEnabled}
            onToggleTTS={() => setTtsEnabled(!ttsEnabled)}
          />
        )}

        {currentTab === 'checkout' && (
          <CheckoutScreen
            shoppingList={shoppingList}
            onBack={() => setCurrentTab('list')}
            onProceedToPayment={(details) => {
              setOrderDetails(prev => ({ ...prev, ...details }));
              setCurrentTab('payment');
            }}
          />
        )}

        {currentTab === 'payment' && (
          <PaymentScreen
            orderDetails={orderDetails}
            onBack={() => setCurrentTab('checkout')}
            onPlaceOrderSuccess={(id) => {
              setOrderDetails(prev => ({ ...prev, orderId: id }));
              setShoppingList([]); // Clear cart after order
              setCurrentTab('order-success');
            }}
          />
        )}

        {currentTab === 'order-success' && (
          <OrderSuccessScreen
            orderId={orderDetails.orderId}
            orderTotal={orderDetails.total}
            onContinueShopping={() => setCurrentTab('home')}
            onViewList={() => setCurrentTab('list')}
          />
        )}
      </main>

      {/* Sticky Bottom Navigation (Shown on main tabs) */}
      {(['home', 'list', 'search', 'smart', 'profile'].includes(currentTab)) && (
        <BottomNav
          currentTab={currentTab as TabType}
          onChangeTab={(tab) => setCurrentTab(tab)}
          listCount={totalCartCount}
        />
      )}
    </div>
  );
}
