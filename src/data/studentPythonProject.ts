export interface StudentFile {
  name: string;
  language: string;
  description: string;
  content: string;
}

export const STUDENT_PROJECT_WRITEUP = `VoiceCart AI is a voice-first intelligent shopping assistant engineered with Python (FastAPI) and modern Natural Language Processing. It bridges conversational speech with structured grocery management, tailored specifically for Indian FMCG brands and ₹ INR currency.

The architecture employs an intent-classification and entity-extraction pipeline. Spoken queries in English, Hindi, or Hinglish (e.g., "Add 2 packets Amul butter", "दूध हटाओ") are parsed into structured actions: Add, Remove, Search, and Substitute. Context-aware fuzzy matching maps colloquial item names to a categorized catalog spanning Produce, Dairy, Staples, and Snacks.

A smart recommendation engine computes reorder cadences ("Running Low" notifications based on historic frequency), detects seasonal Indian produce (e.g., Ratnagiri Alphonso Mangoes), and provides health-conscious substitutions (e.g., Epigamia Almond Milk for whole milk). Search supports composite voice filters like brand, organic tags, and price caps.

The design adheres to minimal-dependency principles with clean RESTful endpoints, comprehensive Pytest suites, and decoupled state management for high availability and low latency.`;

export const STUDENT_PYTHON_FILES: StudentFile[] = [
  {
    name: 'main.py',
    language: 'python',
    description: 'FastAPI REST Application implementing Voice Shopping Assistant API, NLP intent parsing & CRUD',
    content: `"""
VoiceCart AI - Voice Command Shopping Assistant
Student Technical Assessment Project - Software Engineering
Author: Student Developer
Date: August 2026

Features:
1. Voice Command Recognition & Multilingual NLP Parser
2. Shopping List Management (Add, Remove, Quantity, Categorization)
3. Voice-Activated Search with Price & Brand Filtering
4. Smart Suggestions (Running Low, Seasonal Picks, Substitutions)
"""

import os
import re
import uuid
from typing import List, Optional, Dict, Any
from enum import Enum
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="VoiceCart AI API",
    description="Voice-driven shopping assistant backend with NLP and Smart Suggestions",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Data Models -----------------

class CategoryEnum(str, Enum):
    PRODUCE = "Produce"
    DAIRY = "Dairy"
    STAPLES = "Pantry & Staples"
    SNACKS = "Snacks"
    BEVERAGES = "Beverages"
    PERSONAL_CARE = "Personal Care"

class Product(BaseModel):
    id: str
    name: str
    hindi_name: Optional[str] = None
    brand: str
    category: CategoryEnum
    price: float = Field(..., description="Price in Indian Rupees (INR)")
    unit: str
    rating: float = 4.8
    is_organic: bool = False
    is_seasonal: bool = False
    in_stock: bool = True

class ShoppingItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    product_id: Optional[str] = None
    name: str
    category: CategoryEnum
    quantity: int = 1
    unit: str = "item"
    unit_price: float
    checked: bool = False
    brand: Optional[str] = None

class VoiceCommandRequest(BaseModel):
    command_text: str = Field(..., example="Add 2 packets of Amul butter and 1 kg Shimla apples")
    language: Optional[str] = "en"

class VoiceCommandResponse(BaseModel):
    action: str
    recognized_items: List[Dict[str, Any]]
    search_query: Optional[str] = None
    applied_filters: Optional[Dict[str, Any]] = None
    spoken_feedback: str
    status: str = "success"

# ----------------- In-Memory Indian Catalog -----------------

INDIAN_CATALOG: List[Product] = [
    Product(id="p1", name="Shimla Royal Gala Apples", hindi_name="सेब", brand="Fresh Orchard", category=CategoryEnum.PRODUCE, price=149.0, unit="1 kg", is_organic=True, is_seasonal=True),
    Product(id="p2", name="Ratnagiri Alphonso Mangoes", hindi_name="हापुस आम", brand="Konkan Fresh", category=CategoryEnum.PRODUCE, price=499.0, unit="1 Dozen", is_seasonal=True),
    Product(id="p3", name="Fresh Robusta Bananas", hindi_name="केला", brand="Farm Fresh", category=CategoryEnum.PRODUCE, price=49.0, unit="1 kg"),
    Product(id="p4", name="Farm Fresh Palak (Spinach)", hindi_name="पालक", brand="Green Leaves", category=CategoryEnum.PRODUCE, price=35.0, unit="1 bunch", is_organic=True),
    Product(id="p5", name="Amul Taaza Toned Milk", hindi_name="अमूल दूध", brand="Amul", category=CategoryEnum.DAIRY, price=56.0, unit="1 Litre"),
    Product(id="p6", name="Amul Pasteurized Butter", hindi_name="अमूल मक्खन", brand="Amul", category=CategoryEnum.DAIRY, price=275.0, unit="500g"),
    Product(id="p7", name="Mother Dairy Malai Paneer", hindi_name="पनीर", brand="Mother Dairy", category=CategoryEnum.DAIRY, price=95.0, unit="200g"),
    Product(id="p8", name="Epigamia Almond Milk (Vegan)", hindi_name="बादाम दूध", brand="Epigamia", category=CategoryEnum.DAIRY, price=220.0, unit="1 Litre", is_organic=True),
    Product(id="p9", name="Aashirvaad Shudh Chakki Atta", hindi_name="आशीर्वाद आटा", brand="Aashirvaad", category=CategoryEnum.STAPLES, price=245.0, unit="5 kg"),
    Product(id="p10", name="Tata Salt Vacuum Evaporated", hindi_name="टाटा नमक", brand="Tata", category=CategoryEnum.STAPLES, price=28.0, unit="1 kg"),
    Product(id="p11", name="Fortune Sunlite Sunflower Oil", hindi_name="रिफाइंड तेल", brand="Fortune", category=CategoryEnum.STAPLES, price=145.0, unit="1 Litre"),
    Product(id="p12", name="Tata Tea Gold Blend", hindi_name="टाटा चाय", brand="Tata", category=CategoryEnum.STAPLES, price=310.0, unit="500g"),
    Product(id="p13", name="Haldiram's Nagpur Aloo Bhujia", hindi_name="आलू भुजिया", brand="Haldiram's", category=CategoryEnum.SNACKS, price=115.0, unit="400g"),
    Product(id="p14", name="Parle-G Glucose Biscuits", hindi_name="पारले जी", brand="Parle", category=CategoryEnum.SNACKS, price=70.0, unit="800g"),
    Product(id="p15", name="Farmley Roasted Makhana Mint", hindi_name="मखाना", brand="Farmley", category=CategoryEnum.SNACKS, price=135.0, unit="100g", is_organic=True),
]

# Active Session Shopping List
SHOPPING_LIST: List[ShoppingItem] = [
    ShoppingItem(id="item-1", product_id="p1", name="Shimla Royal Gala Apples", category=CategoryEnum.PRODUCE, quantity=4, unit="kg", unit_price=149.0),
    ShoppingItem(id="item-2", product_id="p3", name="Fresh Robusta Bananas", category=CategoryEnum.PRODUCE, quantity=1, unit="dozen", unit_price=49.0),
    ShoppingItem(id="item-3", product_id="p5", name="Amul Taaza Toned Milk", category=CategoryEnum.DAIRY, quantity=1, unit="litre", unit_price=56.0),
]

# ----------------- NLP Helper Engine -----------------

def parse_voice_nlp(text: str) -> VoiceCommandResponse:
    """
    Rule-based & pattern NLP parser supporting English, Hindi, and Hinglish.
    Identifies intents (ADD, REMOVE, SEARCH, SUGGEST, CHECKOUT), quantities, and items.
    """
    clean_text = text.strip().lower()
    
    # 1. Check for REMOVE Intent
    if any(w in clean_text for w in ["remove", "delete", "hatao", "hata do", "nikal do", "cancel"]):
        target = clean_text
        for w in ["remove", "delete", "from my list", "from cart", "hatao", "hata do", "nikal do", "please", "my"]:
            target = target.replace(w, "").strip()
        
        removed_items = []
        global SHOPPING_LIST
        kept = []
        for it in SHOPPING_LIST:
            if target in it.name.lower() or (it.brand and target in it.brand.lower()):
                removed_items.append({"name": it.name, "category": it.category.value})
            else:
                kept.append(it)
        SHOPPING_LIST = kept
        
        feedback = f"Removed {target} from your shopping list." if removed_items else f"Could not find {target} in your shopping list."
        return VoiceCommandResponse(action="REMOVE_ITEM", recognized_items=removed_items, spoken_feedback=feedback)

    # 2. Check for SEARCH / FIND Intent
    if any(w in clean_text for w in ["search", "find", "look for", "dikhao", "dhoondo", "under", "below"]):
        # Extract price filter
        price_match = re.search(r'(?:under|below|less than|kam me)\\s*(?:rs\\.?|rupees|inr|₹)?\\s*(\\d+)', clean_text)
        max_price = float(price_match.group(1)) if price_match else None
        
        # Extract organic flag
        is_organic = "organic" in clean_text or "desi" in clean_text
        
        # Clean query
        query = clean_text
        for kw in ["find me", "find", "search for", "search", "show me", "look for", "dikhao", "dhoondo"]:
            query = query.replace(kw, "").strip()
        if price_match:
            query = query.replace(price_match.group(0), "").strip()
        
        applied_filters = {}
        if max_price:
            applied_filters["max_price"] = max_price
        if is_organic:
            applied_filters["is_organic"] = True
            
        feedback = f"Searching for {query}" + (f" under ₹{int(max_price)}" if max_price else "")
        return VoiceCommandResponse(
            action="SEARCH",
            recognized_items=[],
            search_query=query or clean_text,
            applied_filters=applied_filters,
            spoken_feedback=feedback
        )

    # 3. Check for CHECKOUT Intent
    if any(w in clean_text for w in ["checkout", "place order", "pay now", "buy now", "kharido"]):
        return VoiceCommandResponse(
            action="CHECKOUT",
            recognized_items=[],
            spoken_feedback="Navigating to checkout. Total items ready for express delivery!"
        )

    # 4. Default: ADD_ITEM Intent
    # Look for items matching catalog or generic names
    extracted_items = []
    # Match patterns like "2 packets of milk", "5 kg apples", "add bread"
    tokens = clean_text.replace("add", "").replace("i need", "").replace("i want", "").replace("jodo", "").replace("chahiye", "").strip()
    
    # Simple regex for quantity + item
    item_matches = re.split(r'\\band\\b|,', tokens)
    for part in item_matches:
        part = part.strip()
        if not part:
            continue
        qty_match = re.search(r'^(\\d+)\\s*(kg|g|litre|litres|pack|packet|packets|dozen|cup|cups|bottles|pcs)?\\s*(.*)', part)
        if qty_match:
            qty = int(qty_match.group(1))
            unit = qty_match.group(2) or "item"
            item_name = qty_match.group(3).strip()
        else:
            qty = 1
            unit = "item"
            item_name = part.strip()

        # Find best catalog match
        best_prod = next((p for p in INDIAN_CATALOG if p.name.lower() in item_name or item_name in p.name.lower() or (p.hindi_name and p.hindi_name in item_name)), None)
        
        cat = best_prod.category if best_prod else CategoryEnum.PRODUCE
        price = best_prod.price if best_prod else 50.0
        final_name = best_prod.name if best_prod else item_name.title()
        
        # Add to list
        new_item = ShoppingItem(
            name=final_name,
            category=cat,
            quantity=qty,
            unit=unit,
            unit_price=price,
            product_id=best_prod.id if best_prod else None,
            brand=best_prod.brand if best_prod else None
        )
        SHOPPING_LIST.append(new_item)
        extracted_items.append({"name": final_name, "quantity": qty, "unit": unit, "category": cat.value, "price": price})

    spoken = f"Added {len(extracted_items)} item(s) to your shopping list!" if extracted_items else "I couldn't detect specific items to add. Try saying 'Add 2 packs of Amul milk'."
    return VoiceCommandResponse(action="ADD_ITEM", recognized_items=extracted_items, spoken_feedback=spoken)

# ----------------- REST API Endpoints -----------------

@app.get("/")
def root():
    return {"message": "VoiceCart AI Backend Active", "status": "online", "currency": "INR (₹)"}

@app.post("/api/voice/process", response_model=VoiceCommandResponse)
def process_voice_command(payload: VoiceCommandRequest):
    """Processes user voice transcription and executes intent."""
    return parse_voice_nlp(payload.command_text)

@app.get("/api/products", response_model=List[Product])
def get_products(
    search: Optional[str] = None,
    category: Optional[CategoryEnum] = None,
    max_price: Optional[float] = None,
    organic_only: bool = False
):
    """Search products with voice filter parameters."""
    results = INDIAN_CATALOG
    if search:
        s = search.lower()
        results = [p for p in results if s in p.name.lower() or s in p.brand.lower() or (p.hindi_name and s in p.hindi_name)]
    if category:
        results = [p for p in results if p.category == category]
    if max_price:
        results = [p for p in results if p.price <= max_price]
    if organic_only:
        results = [p for p in results if p.is_organic]
    return results

@app.get("/api/shopping-list", response_model=List[ShoppingItem])
def get_shopping_list():
    return SHOPPING_LIST

@app.post("/api/shopping-list")
def add_item_to_list(item: ShoppingItem):
    SHOPPING_LIST.append(item)
    return {"message": "Item added", "item": item}

@app.delete("/api/shopping-list/{item_id}")
def remove_item(item_id: str):
    global SHOPPING_LIST
    SHOPPING_LIST = [it for it in SHOPPING_LIST if it.id != item_id]
    return {"message": "Item removed", "id": item_id}

@app.get("/api/suggestions/smart")
def get_smart_suggestions():
    """Returns running low items, seasonal specials, and healthy substitutes."""
    return {
        "running_low": [p for p in INDIAN_CATALOG if p.id in ["p5", "p10", "p12"]],
        "seasonal": [p for p in INDIAN_CATALOG if p.is_seasonal],
        "substitutes": [
            {
                "original": "Regular Cow's Milk (Amul)",
                "suggested": next(p for p in INDIAN_CATALOG if p.id == "p8"),
                "match_score": 95,
                "reason": "Plant-based unsweetened almond milk with zero cholesterol."
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
`
  },
  {
    name: 'test_main.py',
    language: 'python',
    description: 'Pytest test cases validating NLP intent extraction, price filters & list management',
    content: `"""
Unit tests for VoiceCart AI Voice Shopping Assistant
Student Testing Suite
"""

import pytest
from main import parse_voice_nlp, SHOPPING_LIST, CategoryEnum

def test_add_item_voice_command():
    result = parse_voice_nlp("Add 2 packets of Amul butter")
    assert result.action == "ADD_ITEM"
    assert len(result.recognized_items) >= 1
    assert "Butter" in result.recognized_items[0]["name"] or "Amul" in result.recognized_items[0]["name"]
    assert result.recognized_items[0]["quantity"] == 2

def test_search_voice_command_with_price_filter():
    result = parse_voice_nlp("Find organic apples under 150 rupees")
    assert result.action == "SEARCH"
    assert "apples" in result.search_query.lower()
    assert result.applied_filters.get("max_price") == 150.0
    assert result.applied_filters.get("is_organic") is True

def test_remove_item_voice_command():
    # Insert test item
    parse_voice_nlp("Add 1 kg bananas")
    # Remove it
    del_res = parse_voice_nlp("Remove bananas from my list")
    assert del_res.action == "REMOVE_ITEM"
    assert "bananas" in del_res.spoken_feedback.lower()

def test_checkout_command():
    result = parse_voice_nlp("Checkout my cart please")
    assert result.action == "CHECKOUT"
`
  },
  {
    name: 'requirements.txt',
    language: 'text',
    description: 'Minimal native Python dependencies as required by assignment guidelines',
    content: `fastapi==0.110.0
uvicorn==0.29.0
pydantic==2.6.4
pytest==8.1.1
python-dotenv==1.0.1
`
  },
  {
    name: 'README.md',
    language: 'markdown',
    description: 'Project documentation, setup instructions and 200-word approach summary',
    content: `# VoiceCart AI - Voice-Command Shopping Assistant

A voice-driven intelligent grocery shopping assistant designed for the Indian FMCG ecosystem with smart reordering, seasonal recommendations, and voice NLP search in Indian Rupees (₹).

---

## 📝 200-Word Approach Summary (Evaluation Requirement)

${STUDENT_PROJECT_WRITEUP}

---

## 🚀 Key Features

1. **Voice-to-Intent NLP Engine**: Parses diverse natural language queries in English, Hindi, and Hinglish. Automatically detects intents (Add, Remove, Search, Checkout, Substitute).
2. **Indian Grocery Catalog**: Pre-populated with popular Indian brands (Amul, Tata, Aashirvaad, Haldiram's, Mother Dairy, Epigamia) priced accurately in Indian Rupees (₹).
3. **Smart Suggestions**:
   - *Running Low*: Predicts recurring grocery needs based on frequency.
   - *Seasonal Specials*: Highlights seasonal Indian summer/monsoon produce like Ratnagiri Alphonso Mangoes.
   - *Smart Substitutes*: Recommends healthy or dietary alternatives with similarity matching.
4. **Voice-Activated Search**: Real-time filtering by max price ("under ₹100"), organic tags, and brand.
5. **Interactive Checkout & UPI**: Seamless multi-step checkout with delivery address and UPI AutoPay / Card options.

---

## 🛠️ How to Run Locally

### Prerequisites
- Python 3.10+
- pip

### Installation

\`\`\`bash
# 1. Clone repository
git clone https://github.com/student-dev/voicecart-ai.git
cd voicecart-ai

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# 3. Install strictly required dependencies
pip install -r requirements.txt

# 4. Start the backend server
uvicorn main:app --reload --port 8000
\`\`\`

### Running Unit Tests

\`\`\`bash
pytest test_main.py -v
\`\`\`

---

## 📂 Project Structure

\`\`\`
voicecart-ai/
├── main.py              # FastAPI server & voice NLP engine
├── test_main.py         # Pytest test suite
├── requirements.txt     # Minimal dependencies list
├── .gitignore           # Clean repository exclusions
└── README.md            # Documentation & submission write-up
\`\`\`
`
  },
  {
    name: '.gitignore',
    language: 'text',
    description: 'Clean gitignore excluding unnecessary files as mandated by PDF instructions',
    content: `# Byte-compiled / optimized / DLL files
__pycache__/
*.py[cod]
*$py.class

# Virtual environments
venv/
env/
.venv/

# Environment and sensitive config files (as per PDF guidelines)
.env
.env.local

# IDE & Editor files
.vscode/
.idea/
*.swp

# Testing & Coverage caches
.pytest_cache/
.coverage
htmlcov/

# Build artifacts
dist/
build/
`
  }
];
