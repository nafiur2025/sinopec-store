import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ShoppingBag, X, Check, MapPin, Phone, User, Truck, ChevronRight, Star, Menu, Search, ShieldCheck, Sparkles, Send, Bot, Volume2, Loader, Info, ChevronLeft, Droplets, Gauge, Share2, Heart, Minus, Plus, Globe, Ticket, Car, Bike, UserCircle, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'lucide-react';

// --- Assets & Icons ---

const SinopecLogo = () => (
  <svg viewBox="0 0 200 50" className="h-8 w-auto">
    <text x="0" y="40" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="38" fill="#E60012" letterSpacing="-1">SINOPEC</text>
  </svg>
);

const OilBottleIcon = ({ color = "#E60012", type = "Car" }) => (
  <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-lg filter">
    <defs>
      <linearGradient id={`grad-${color.replace('#','')}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="1" />
        <stop offset="100%" stopColor="#111" stopOpacity="1" />
      </linearGradient>
    </defs>
    {/* Bottle Shape */}
    <path d="M30 5 L70 5 L70 20 L85 30 L85 110 Q85 120 70 120 L30 120 Q15 120 15 110 L15 30 L30 20 Z" fill={`url(#grad-${color.replace('#','')})`} />
    {/* Cap */}
    <rect x="35" y="0" width="30" height="10" fill="#111" />
    {/* Label Area */}
    <rect x="25" y="45" width="50" height="50" rx="5" fill="white" opacity="0.9" />
    {/* Logo Hint */}
    <circle cx="50" cy="55" r="6" fill="#E60012" />
    <rect x="30" y="70" width="40" height="4" rx="2" fill="#333" />
    <rect x="30" y="77" width="25" height="3" rx="1.5" fill="#333" opacity="0.6" />
    {/* Reflection */}
    <path d="M75 35 L75 110" stroke="white" strokeWidth="2" strokeOpacity="0.2" fill="none" />
  </svg>
);

// --- Confetti Component ---
const Confetti = () => {
  const colors = ['#E60012', '#FFD700', '#000000', '#4CAF50', '#2196F3'];
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[70] overflow-hidden">
      {[...Array(50)].map((_, i) => {
        const style = {
          left: `${Math.random() * 100}%`,
          top: `-10px`,
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          animation: `fall ${Math.random() * 3 + 2}s linear infinite`,
          animationDelay: `${Math.random() * 5}s`,
          width: `${Math.random() * 10 + 5}px`,
          height: `${Math.random() * 10 + 5}px`,
          transform: `rotate(${Math.random() * 360}deg)`,
        };
        return (
            <div key={i} className="absolute rounded-sm opacity-80" style={style}>
                 <style>{`
                    @keyframes fall {
                        to { transform: translateY(100vh) rotate(720deg); }
                    }
                 `}</style>
            </div>
        )
      })}
    </div>
  );
};

// --- Zoomable Image Component (Smart Offset Lens) ---
const ZoomableImage = ({ src, alt, fallback }) => {
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false); // Track if user is using touch
  const [imgError, setImgError] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX, clientY) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    let x = clientX - left;
    let y = clientY - top;

    // Constrain inside
    x = Math.max(0, Math.min(x, width));
    y = Math.max(0, Math.min(y, height));

    setPosition({ x, y });
  };

  // Mouse Handlers
  const onMouseMove = (e) => {
    setIsTouch(false);
    setIsActive(true);
    handleMove(e.clientX, e.clientY);
  };

  // Touch Handlers
  const onTouchStart = (e) => {
    setIsTouch(true);
    setIsActive(true);
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };

  const onTouchMove = (e) => {
    // Prevent scrolling while zooming on image
    if (e.cancelable) e.preventDefault(); 
    setIsTouch(true);
    setIsActive(true);
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };
  
  const onTouchEnd = () => {
      setIsActive(false);
  }

  if (!src || imgError) return fallback;

  // Configuration
  const lensSize = 130; // Kept the larger size
  const zoomLevel = 2.5;
  
  // Offset values for touch (Directly above finger)
  const offsetX = 0;    // Centered horizontally
  const offsetY = -100; // Shifted up by 100px to sit above the finger

  return (
    <div className="flex flex-col items-center w-full h-full">
        <div 
        ref={containerRef}
        className="relative w-full h-full overflow-hidden rounded-xl cursor-crosshair touch-none"
        onMouseEnter={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
        onMouseMove={onMouseMove}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchMove={onTouchMove}
        >
        <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-contain pointer-events-none" 
            onError={() => setImgError(true)}
        />
        
        {isActive && (
            <div 
            className="absolute border-2 border-white shadow-2xl rounded-full bg-no-repeat pointer-events-none z-50 bg-white"
            style={{
                width: `${lensSize}px`,
                height: `${lensSize}px`,
                // Apply offsets based on input type
                left: `${position.x - lensSize / 2 + (isTouch ? offsetX : 0)}px`, 
                top: `${position.y - lensSize / 2 + (isTouch ? offsetY : 0)}px`,
                backgroundImage: `url(${src})`,
                backgroundSize: `${containerRef.current?.offsetWidth * zoomLevel}px ${containerRef.current?.offsetHeight * zoomLevel}px`,
                // Background position logic ensures the zoomed part matches what is under the finger, 
                // regardless of where the lens is physically drawn.
                backgroundPosition: `-${position.x * zoomLevel - lensSize / 2}px -${position.y * zoomLevel - lensSize / 2}px`
            }}
            />
        )}
        </div>
        <p className="text-[10px] text-gray-400 mt-2 sm:hidden">Touch & Hold to Zoom</p>
    </div>
  );
};


// --- Helper Component for Robust Images (Updated to use Zoomable) ---
const ProductImage = ({ product, enableZoom = false }) => {
  const [imgError, setImgError] = useState(false);
  const fallback = <OilBottleIcon color={product.color} type={product.category} />;

  if (enableZoom && product.image && !imgError) {
      return <ZoomableImage src={product.image} alt={product.name} fallback={fallback} />;
  }

  if (product.image && !imgError) {
    return (
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-full object-contain drop-shadow-md"
        onError={(e) => {
          e.target.onerror = null; 
          setImgError(true);
        }}
      />
    );
  }
  return fallback;
};

// --- Helper for Bengali Numbers ---
const toBnNum = (num) => {
  return num.toString().replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[d]);
};

// --- Translations ---
const TRANSLATIONS = {
  en: {
    officialDistributor: "Official Distributor",
    heroTitle: "Premium Power.\nDelivered.",
    heroSubtitle: "Original Sinopec lubricants. Fast delivery across Bangladesh.",
    authentic: "100% Authentic",
    findMyOil: "Find My Oil",
    catAll: "All",
    catCar: "Car",
    catMoto: "Moto",
    viewCart: "View Cart",
    total: "Total",
    subtotal: "Subtotal",
    checkout: "Checkout",
    yourCart: "Your Cart",
    orderConfirmed: "Order Confirmed",
    emptyCart: "Your cart is empty",
    startShopping: "Start Shopping",
    phone: "Phone Number",
    name: "Full Name",
    address: "Delivery Address",
    payment: "Payment Method",
    cod: "Cash on Delivery",
    payReceive: "Pay when you receive",
    onlinePay: "Online Payment",
    comingSoon: "Coming Soon",
    checkoutNow: "Checkout Now",
    confirmOrder: "Confirm Order",
    orderPlaced: "Order Placed!",
    weCall: "We will call you shortly to confirm.",
    continueShopping: "Continue Shopping",
    viscosity: "Viscosity",
    spec: "Specification",
    series: "Series",
    features: "Key Features",
    application: "Best Application",
    addToCart: "Add to Cart",
    officialStock: "Official Stock",
    aiTitle: "AI Oil Finder",
    aiSubtitle: "Powered by Gemini",
    aiPlaceholder: "E.g., Toyota Axio 2015...",
    aiThinking: "Thinking...",
    aiGreeting: "Hi! I'm your Sinopec Oil Expert. Tell me your vehicle model, and I'll find the perfect oil for you!",
    viewProduct: "View Product",
    pricePrefix: "৳",
    chooseLang: "Choose Language",
    langBn: "বাংলা",
    langEn: "English",
    tagPerformance: "Performance",
    tagBestValue: "Best Value",
    tagPopular: "Popular",
    deliveryArea: "Delivery Area",
    insideDhaka: "Inside Dhaka City",
    outsideDhaka: "Outside Dhaka City",
    shipping: "Shipping Fee",
    free: "Free",
    shippingNote: "Free Shipping within Dhaka City!",
    haveCoupon: "Have a coupon?",
    apply: "Apply",
    discount: "Discount",
    invalidCoupon: "Invalid Code",
    orderSummary: "Order Summary",
    items: "Items",
    qty: "Qty",
    recommendedFor: "Recommended For",
    reviewsTitle: "Customer Reviews",
  },
  bn: {
    officialDistributor: "অফিসিয়াল ডিস্ট্রিবিউটর",
    heroTitle: "প্রিমিয়াম শক্তি।\nদ্রুত ডেলিভারি।",
    heroSubtitle: "আসল সিনোপেক লুব্রিকেন্ট। সারা বাংলাদেশে হোম ডেলিভারি।",
    authentic: "১০০% অথেনটিক",
    findMyOil: "অয়েল খুজুন",
    catAll: "সব",
    catCar: "গাড়ি",
    catMoto: "বাইক",
    viewCart: "কার্ট দেখুন",
    total: "মোট",
    subtotal: "সাবটোটাল",
    checkout: "চেকআউট",
    yourCart: "আপনার কার্ট",
    orderConfirmed: "অর্ডার নিশ্চিত",
    emptyCart: "আপনার কার্ট খালি",
    startShopping: "কেনাকাটা করুন",
    phone: "ফোন নম্বর",
    name: "পুরো নাম",
    address: "ডেলিভারি ঠিকানা",
    payment: "পেমেন্ট পদ্ধতি",
    cod: "ক্যাশ অন ডেলিভারি",
    payReceive: "পণ্য হাতে পেয়ে পেমেন্ট",
    onlinePay: "অনলাইন পেমেন্ট",
    comingSoon: "শীঘ্রই আসছে",
    checkoutNow: "অর্ডার করুন",
    confirmOrder: "অর্ডার নিশ্চিত করুন",
    orderPlaced: "অর্ডার সফল হয়েছে!",
    weCall: "আমরা শীঘ্রই আপনাকে কল করব।",
    continueShopping: "আরও কিনুন",
    viscosity: "ভিসকোসিটি",
    spec: "স্পেসিফিকেশন",
    series: "সিরিজ",
    features: "বৈশিষ্ট্য",
    application: "ব্যবহারের ক্ষেত্র",
    addToCart: "কার্টে যোগ করুন",
    officialStock: "অফিসিয়াল স্টক",
    aiTitle: "এআই অটো এক্সপার্ট",
    aiSubtitle: "পাওয়ার্ড বাই জেমিনি",
    aiPlaceholder: "যেমন: টয়োটা এক্সিও ২০১৫...",
    aiThinking: "ভাবছি...",
    aiGreeting: "আসসালামু আলাইকুম! আমি সিনোপেক এক্সপার্ট। আপনার গাড়ির মডেল বলুন, আমি সেরা অয়েল খুঁজে দেব!",
    viewProduct: "পণ্য দেখুন",
    pricePrefix: "৳",
    chooseLang: "ভাষা নির্বাচন করুন",
    langBn: "বাংলা",
    langEn: "English",
    tagPerformance: "পারফরম্যান্স",
    tagBestValue: "সেরা মূল্য",
    tagPopular: "জনপ্রিয়",
    deliveryArea: "ডেলিভারি এলাকা",
    insideDhaka: "ঢাকা সিটির ভেতরে",
    outsideDhaka: "ঢাকা সিটির বাইরে",
    shipping: "ডেলিভারি চার্জ",
    free: "ফ্রি",
    shippingNote: "ঢাকা সিটির ভেতরে ফ্রি ডেলিভারি!",
    haveCoupon: "কুপন কোড আছে?",
    apply: "প্রয়োগ করুন",
    discount: "ছাড়",
    invalidCoupon: "ভুল কোড",
    orderSummary: "অর্ডার বিবরণ",
    items: "পণ্য",
    qty: "পরিমাণ",
    recommendedFor: "উপযুক্ত মডেল",
    reviewsTitle: "গ্রাহক পর্যালোচনা",
  }
};

// --- Review Data ---
const REVIEWS = [
  { id: 1, name: "Rahim Ullah", text: "Excellent oil for my Toyota Axio. Engine runs smoother now!", rating: 5 },
  { id: 2, name: "Karim Ahmed", text: "Best semi-synthetic oil for bikes. Using it in my Pulsar 150.", rating: 5 },
  { id: 3, name: "Saima Islam", text: "Fast delivery within Dhaka. Original product received.", rating: 5 },
  { id: 4, name: "Tanvir Hasan", text: "Great value for money. Highly recommended for hybrid cars.", rating: 5 },
  { id: 5, name: "Mehedi Hasan", text: "Good packaging and authentic product. Will order again.", rating: 5 },
];

// --- Review Slider Component ---
const ReviewSlider = ({ reviews }) => {
  const scrollRef = useRef(null);

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const nextScroll = scrollLeft + 300; 
        
        if (scrollLeft + clientWidth >= scrollWidth) {
           scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
           scrollRef.current.scrollTo({ left: nextScroll, behavior: 'smooth' });
        }
      }
    }, 3000); // Auto scroll every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleScroll = (direction) => {
      if (scrollRef.current) {
          const { scrollLeft } = scrollRef.current;
          const offset = direction === 'left' ? -300 : 300;
          scrollRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' });
      }
  }

  return (
    <div className="relative group">
        <div 
            ref={scrollRef}
            className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide snap-x scroll-smooth"
        >
             {reviews.map(review => (
               <div key={review.id} className="min-w-[280px] bg-white p-4 rounded-2xl shadow-sm border border-gray-100 snap-start flex-shrink-0">
                 <div className="flex items-center gap-1 mb-2 text-yellow-400">
                   {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                 </div>
                 <p className="text-sm text-gray-600 italic mb-3 line-clamp-2">"{review.text}"</p>
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      <UserCircle size={20} />
                   </div>
                   <span className="text-xs font-bold text-gray-900">{review.name}</span>
                 </div>
               </div>
             ))}
        </div>
        
        {/* Navigation Buttons */}
        <button 
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md hover:bg-gray-50 hidden sm:flex z-10 -ml-2"
        >
            <ChevronLeftIcon size={20} className="text-gray-600" />
        </button>
        <button 
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md hover:bg-gray-50 hidden sm:flex z-10 -mr-2"
        >
            <ChevronRightIcon size={20} className="text-gray-600" />
        </button>
    </div>
  );
};


// --- Data (With Recommended Models) ---

const PRODUCTS = [
  // --- CAR OILS ---
  {
    id: 'j700-5w40',
    name: "Justar J700 5W-40",
    name_bn: "জাস্টার J700 5W-40",
    series: "J700",
    desc: "Fully Synthetic. A3/B4. High performance power.",
    desc_bn: "ফুল সিন্থেটিক। A3/B4। উচ্চ ক্ষমতা সম্পন্ন ইঞ্জিনের জন্য।",
    price: 4500,
    category: "Car",
    tag: "Performance",
    color: "#E60012", 
    image: "/j700-5w40.png",
    viscosity: "5W-40",
    specs: "API SP, ACEA A3/B4",
    application: "High performance petrol & light diesel without DPF. Turbocharged (TGDI) engines.",
    application_bn: "জিপিএফ/ডিপিএফ ছাড়া উচ্চ-ক্ষমতাসম্পন্ন পেট্রল ও হালকা ডিজেল গাড়ি। টার্বোচার্জড (TGDI) ইঞ্জিন।",
    features: ["Constant strong power", "High temp stability", "Excellent wear protection", "VW 502.00/505.00"],
    features_bn: ["ধ্রুবক শক্তিশালী শক্তি", "উচ্চ তাপমাত্রা স্থিতিশীলতা", "চমৎকার পরিধান সুরক্ষা", "VW 502.00/505.00"],
    recommendedModels: ["Toyota Premio", "Toyota Allion", "Toyota Camry", "Toyota Corolla", "Toyota Fortuner", "Toyota Prado", "Honda Accord", "Honda CR-V", "Nissan X-Trail", "Mitsubishi Pajero", "BMW 3/5 Series", "Mercedes C/E Class", "Audi A3/A4"]
  },
  {
    id: 'j700-5w30',
    name: "Justar J700 5W-30",
    name_bn: "জাস্টার J700 5W-30",
    series: "J700",
    desc: "Fully Synthetic. C3/SP. DPF Compatible.",
    desc_bn: "ফুল সিন্থেটিক। C3/SP। DPF সাশ্রয়ী।",
    price: 4500,
    category: "Car",
    color: "#E60012",
    image: "/j700-5w30.png",
    viscosity: "5W-30",
    specs: "API SP, ACEA C3",
    application: "Euro cars with DPF/GPF. GM Dexos2 approved. Suitable for BMW & Mercedes.",
    application_bn: "DPF/GPF সহ ইউরো গাড়ি। GM Dexos2 অনুমোদিত। বিএমডব্লিউ এবং মার্সিডিজ এর জন্য উপযুক্ত।",
    features: ["Emission system friendly", "Long engine life", "Deposit control", "MB 229.51"],
    features_bn: ["নির্গমন সিস্টেম বান্ধব", "দীর্ঘ ইঞ্জিন জীবন", "ডিপোজিট নিয়ন্ত্রণ", "MB 229.51"],
    recommendedModels: ["Toyota Land Cruiser", "Toyota Harrier", "Toyota RAV4", "Honda Vezel", "Honda Civic Turbo", "Nissan Juke", "Hyundai Tucson", "Kia Sportage"]
  },
  {
    id: 'j700-0w20',
    name: "Justar J700 0W-20",
    name_bn: "জাস্টার J700 0W-20",
    series: "J700",
    desc: "Fully Synthetic. SP/GF-6A. Advanced Efficiency.",
    desc_bn: "ফুল সিন্থেটিক। SP/GF-6A। উন্নত দক্ষতা।",
    price: 4200,
    category: "Car",
    color: "#E60012",
    image: "/j700-0w20.png",
    viscosity: "0W-20",
    specs: "API SP, ILSAC GF-6A",
    application: "American & Asian vehicles requiring 0W-20. Ford WSS-M2C962-A1.",
    application_bn: "আমেরিকান এবং এশিয়ান যানবাহন যাদের 0W-20 প্রয়োজন। Ford WSS-M2C962-A1.",
    features: ["Improved friction properties", "Low fuel consumption", "Chain wear protection"],
    features_bn: ["উন্নত ঘর্ষণ বৈশিষ্ট্য", "কম জ্বালানী খরচ", "চেইন পরিধান সুরক্ষা"],
    recommendedModels: ["Toyota Axio Hybrid", "Toyota Fielder Hybrid", "Toyota Aqua", "Toyota Prius", "Toyota Noah Hybrid", "Toyota C-HR Hybrid", "Honda Grace", "Honda Fit/Jazz", "Nissan Note e-Power"]
  },
  {
    id: 'j600-5w30',
    name: "Justar J600 5W-30",
    name_bn: "জাস্টার J600 5W-30",
    series: "J600",
    desc: "Synthetic Tech. SP/GF-6A. Advanced protection.",
    desc_bn: "সিন্থেটিক টেক। SP/GF-6A। উন্নত সুরক্ষা।",
    price: 3200,
    category: "Car",
    tag: "Best Value",
    color: "#1a4dad", // Blue
    image: "/j600-5w30.png",
    viscosity: "5W-30",
    specs: "API SP, ILSAC GF-6A",
    application: "Modern Asian & American petrol engines. Turbo & GDI suitable.",
    application_bn: "আধুনিক এশিয়ান এবং আমেরিকান পেট্রল ইঞ্জিন। টার্বো এবং GDI উপযুক্ত।",
    features: ["Prevent low speed pre-ignition", "Fuel economy", "Clean engine"],
    features_bn: ["কম গতির প্রি-ইগনিশন প্রতিরোধ করে", "জ্বালানী সাশ্রয়", "পরিচ্ছন্ন ইঞ্জিন"],
    recommendedModels: ["Toyota Axio (Non-Hybrid)", "Toyota Fielder (Non-Hybrid)", "Toyota Probox", "Toyota Succeed", "Honda City", "Honda Airwave", "Toyota Vitz", "Toyota Passo"]
  },
  {
    id: 'j500-10w40',
    name: "Justar J500 10W-40",
    name_bn: "জাস্টার J500 10W-40",
    series: "J500",
    desc: "Synthetic Tech. API SN. Reliable daily driver.",
    desc_bn: "সিন্থেটিক টেক। API SN। নির্ভরযোগ্য নিত্যদিনের সঙ্গী।",
    price: 2600,
    category: "Car",
    color: "#555",
    image: "/j500-10w40.png",
    viscosity: "10W-40",
    specs: "API SN",
    application: "Daily driving petrol cars. CNG/LPG compatible.",
    application_bn: "প্রতিদিনের পেট্রল গাড়ি। সিএনজি/এলপিজি (CNG/LPG) এর জন্য উপযুক্ত।",
    features: ["Good oxidation resistance", "Wear protection", "Smooth drive"],
    features_bn: ["ভাল জারণ প্রতিরোধ", "পরিধান সুরক্ষা", "স্মুথ ড্রাইভ"],
    recommendedModels: ["Toyota Corolla NZE", "Toyota RunX", "Toyota Allex", "Nissan Sunny", "Nissan Bluebird Sylphy", "Mitsubishi Lancer", "Toyota Hiace (Petrol)"]
  },
  {
    id: 'sl-20w50',
    name: "Justar SL 20W-50",
    name_bn: "জাস্টার SL 20W-50",
    series: "SL",
    desc: "Premium Mineral. API SL. For older engines.",
    desc_bn: "প্রিমিয়াম মিনারেল। API SL। পুরনো ইঞ্জিনের জন্য।",
    price: 1800,
    category: "Car",
    color: "#333",
    image: "/sl-20w50.png",
    viscosity: "20W-50",
    specs: "API SL",
    application: "Older petrol engines, high mileage vehicles.",
    application_bn: "পুরানো পেট্রল ইঞ্জিন, বেশি মাইলেজ চলা গাড়ি।",
    features: ["Strong oil film", "Seal conditioning", "High load protection"],
    features_bn: ["শক্তিশালী তেলের স্তর", "সিল কন্ডিশনিং", "উচ্চ লোড সুরক্ষা"],
    recommendedModels: ["Toyota Corolla AE90/100", "Toyota Noah (KR42)", "Older Petrol Engines", "High Mileage CNG Vehicles"]
  },

  // --- MOTORCYCLE OILS (MCO) ---
  {
    id: 'xplore-10w30',
    name: "Xplore 10W-30 4T",
    name_bn: "এক্সপ্লোর 10W-30 4T",
    series: "Xplore",
    desc: "Synthetic Tech. Smooth Shifting.",
    desc_bn: "সিন্থেটিক টেক। স্মুথ শিফটিং।",
    price: 750,
    category: "Moto",
    color: "#E60012",
    image: "/xplore-10w30.png", 
    viscosity: "10W-30",
    specs: "API SN, JASO MA2",
    application: "Modern 4T bikes requiring JASO MA2. Fuel efficient engines.",
    application_bn: "আধুনিক 4T বাইক যাদের JASO MA2 প্রয়োজন। জ্বালানী সাশ্রয়ী ইঞ্জিন।",
    features: ["Improves power & efficiency", "Reinforced cleanliness", "Seal protection"],
    features_bn: ["শক্তি ও দক্ষতা বৃদ্ধি করে", "পরিচ্ছন্নতা জোরদার করে", "সিল সুরক্ষা"],
    recommendedModels: ["Honda CBR 150R", "Honda XBlade", "Honda Hornet", "Honda CB Shine", "Hero Thriller", "Hero Hunk", "Hero Splendor", "TVS Apache RTR 160 4V", "TVS Metro"]
  },
  {
    id: 'xplore-10w40',
    name: "Xplore 10W-40 4T",
    name_bn: "এক্সপ্লোর 10W-40 4T",
    series: "Xplore",
    desc: "Synthetic Tech. All-Rounder.",
    desc_bn: "সিন্থেটিক টেক। অল-রাউন্ডার।",
    price: 750,
    category: "Moto",
    tag: "Popular",
    color: "#E60012",
    image: "/xplore-10w40.png",
    viscosity: "10W-40",
    specs: "API SN, JASO MA2",
    application: "Standard & Performance 4T motorcycles. Air or water cooled.",
    application_bn: "স্ট্যান্ডার্ড ও পারফরম্যান্স 4T মোটরসাইকেল। এয়ার বা ওয়াটার কুলড।",
    features: ["DUAL PROTECH technology", "Optimum friction for clutch", "Extended engine life"],
    features_bn: ["DUAL PROTECH প্রযুক্তি", "ক্লাচের জন্য সঠিক ঘর্ষণ", "বর্ধিত ইঞ্জিন লাইফ"],
    recommendedModels: ["Yamaha R15 V3/V4", "Yamaha MT-15", "Yamaha Fazer FI", "Yamaha FZS V2/V3", "Suzuki Gixxer", "Lifan KPR", "Runner Knight Rider"]
  },
  {
    id: 'xpert-20w50',
    name: "Xpert 20W-50 4T",
    name_bn: "এক্সপার্ট 20W-50 4T",
    series: "Xpert",
    desc: "Premium Mineral. Heavy Duty Protection.",
    desc_bn: "প্রিমিয়াম মিনারেল। হেভি ডিউটি সুরক্ষা।",
    price: 550,
    category: "Moto",
    color: "#333",
    image: "/xpert-20w50.png",
    viscosity: "20W-50",
    specs: "API SL, JASO MA2",
    application: "Older bikes or high-load conditions. Air cooled engines.",
    application_bn: "পুরানো বাইক বা অতিরিক্ত লোড কন্ডিশন। এয়ার কুলড ইঞ্জিন।",
    features: ["High temp stability", "Low oil consumption", "Prevents clutch slippage"],
    features_bn: ["উচ্চ তাপমাত্রা স্থিতিশীলতা", "কম তেল খরচ", "ক্লাচ স্লিপেজ প্রতিরোধ করে"],
    recommendedModels: ["Bajaj Pulsar 150/NS/DTSi", "Bajaj Discover", "Bajaj Platina", "Bajaj Avenger", "Hero Splendor (Old)", "TVS Metro (Old)"]
  }
];

// --- Components ---

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('cart'); 
  const [activeCategory, setActiveCategory] = useState('All');
  const [showConfetti, setShowConfetti] = useState(false);
  const [lang, setLang] = useState('en'); 
  const [showLangModal, setShowLangModal] = useState(true);
  const [shippingZone, setShippingZone] = useState('inside');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailQty, setDetailQty] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  
  // Checkout Form Data State
  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    address: ''
  });

  // State to hold order details for the success screen
  const [lastOrder, setLastOrder] = useState(null);
  
  // AI State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', text: TRANSLATIONS['en'].aiGreeting, productId: null }
  ]);
  const chatEndRef = useRef(null);

  // Helper for translations
  const t = (key) => TRANSLATIONS[lang][key] || key;

  // Helper for getting product attribute based on lang
  const pAttr = (product, attr) => {
    if (lang === 'bn') {
      return product[`${attr}_bn`] || product[attr];
    }
    return product[attr];
  }

  // Helper for formatting price
  const formatPrice = (price) => {
      const p = lang === 'bn' ? toBnNum(price) : price.toLocaleString();
      return `${t('pricePrefix')}${p}`;
  }

  // Update AI Greeting on Language Change
  useEffect(() => {
    setChatHistory(prev => {
        if(prev.length === 1 && prev[0].role === 'assistant') {
            return [{ role: 'assistant', text: t('aiGreeting'), productId: null }];
        }
        return prev;
    });
  }, [lang]);
  
  // NEW EFFECT: Communicate Splash Screen state to index.html via body attribute
  useEffect(() => {
    const shouldHideChat = showLangModal || isCartOpen || isAiOpen;
    if (shouldHideChat) {
      document.body.setAttribute('data-splash-visible', 'true');
    } else {
      document.body.removeAttribute('data-splash-visible');
    }
  }, [showLangModal, isCartOpen, isAiOpen]);

  // Reset detail qty when product opens
  useEffect(() => {
    if (selectedProduct) setDetailQty(1);
  }, [selectedProduct]);

  // Cart Logic
  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + qty } : p);
      }
      return [...prev, { ...product, qty: qty }];
    });
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(p => {
      if (p.id === id) return { ...p, qty: Math.max(0, p.qty + delta) };
      return p;
    }).filter(p => p.qty > 0));
  };

  // Coupon Logic
  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'SAVE10') {
      setAppliedDiscount(0.10); // 10% discount
      setCouponError('');
    } else {
      setAppliedDiscount(0);
      setCouponError(t('invalidCoupon'));
    }
  };

  // Totals Calculation
  const cartSubtotal = useMemo(() => cart.reduce((sum, p) => sum + (p.price * p.qty), 0), [cart]);
  const shippingCost = shippingZone === 'inside' ? 0 : 50;
  const discountAmount = Math.round(cartSubtotal * appliedDiscount);
  const grandTotal = cartSubtotal - discountAmount + shippingCost;
  const cartCount = useMemo(() => cart.reduce((sum, p) => sum + p.qty, 0), [cart]);

  const filteredProducts = activeCategory === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckoutSubmit = async (e) => {
  e.preventDefault();

  const orderData = {
    items: cart.map(item => ({
      id: item.id,
      name: item.name,
      qty: item.qty,
      price: item.price
    })),
    total: grandTotal,
    details: { ...formData },
    shippingZone,
    discount: discountAmount
  };

  try {
    const response = await fetch('https://chatbot.iqibd.com/save_order.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();

    if (result.success) {
      setLastOrder(orderData);
      setCheckoutStep('success');
      setShowConfetti(true);
      setCart([]);
      setAppliedDiscount(0);
      setCouponCode('');
      setFormData({ phone: '', name: '', address: '' });
    } else {
      alert('Order failed: ' + result.message);
    }
  } catch (err) {
    console.error(err);
    alert('Something went wrong');
  }
};


  // --- Gemini API Logic ---

  const handleAiSubmit = async (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMsg = aiInput;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setAiInput('');
    setAiLoading(true);

    try {
      // NOTE TO DEVELOPER: Insert your Google Gemini API Key here for production.
      const apiKey = "AIzaSyD7IkMqhNs0Aqk8w-zshRREYYUNkquwNLQ"; 
      
      const productContext = JSON.stringify(PRODUCTS.map(p => ({ 
        id: p.id, 
        name: p.name, 
        desc: p.desc, 
        viscosity: p.viscosity,
        specs: p.specs,
        application: p.application
      })));
      
      const prompt = `
        You are a friendly Sinopec Lubricant Expert for the Bangladesh market.
        Language Preference: ${lang === 'bn' ? 'Bengali' : 'English'}.
        Inventory: ${productContext}.
        
        User Query: "${userMsg}"
        
        Rules:
        1. Recommend a specific product based on vehicle type (Car vs Bike) and viscosity.
        2. For wet-clutch bikes (e.g., FZS, Gixxer), recommend JASO MA2 oils (Xtreme, Xplore).
        3. Reply in strict JSON: { "text": "Advice...", "productId": "id_string" | null }.
        4. Keep advice under 30 words.
        5. Respond in ${lang === 'bn' ? 'Bengali' : 'English'}.

        5. Model-Specific Recommendations for Bike/Motorcycles:
\-- Brand: Bajaj --\
All Bajaj → Sinopec 4T SL MA2 20W-50 (Mineral, API SL/MA2)\
Trigger words indicating Bajaj:\
• “Bajaj Pulsar”\
• “Pulsar” (any variant: 150, NS, Neon, DTSi, SD, etc.)\
• “Discover”\
• “Avenger”\
• “V15”\
• “Platina”\
• “CT100”
\-- Brand: Hero/Honda/TVS (Most 100–160cc) --\
Recommends → 10W-30 Semi-Synthetic\
Trigger words indicating Hero/Honda/TVS:\
• “Hero”\
• “Honda”\
• “TVS”\
• “Thriller”\
• “Extreme Sports”\
• “Hunk”\
• “Glamour”\
• “Passion Pro”\
• “Pleasure”\
• “Splendor”\
• “Achiever”\
• “Splendor Pro”\
• “Ignitor 125”\
• “HF Delux”\
• “HF Dawn”\
• “Passion Xpro”\
• “Duet 110”\
• “CBR 150R Exmotion”\
• “CBR 150R”\
• “CB 150R Streetfire”\
• “CB Trigger”\
• “CB Shine”\
• “Livo”\
• “Dream Neo”\
• “CD80”\
• “CD 110 Dream Dx”\
• “Xblade 160”\
• “Rs 150R”\
• “Navi”\
• “Dream Yuga”\
• “Beat”\
• “NXR 160 Bros”\
• “CB Hornet 160R”\
• “CB Twister”\
• “SFA 150”\
• “Dio”\
• “CB Unicorn 150”\
• “Apache RTR 150”\
• “Jupiter”\
• “Wego”\
• “Phonix 125”\
• “Max 125”\
• “Stryker 125”\
• “Metro Plus”\
• “Metro”\
• “XL 100 Comfort”\
• “Apache RTR 160 4V”
\-- Brand: Yamaha/Runner/Lifan/Keeway (125–160cc) --\
Recommends → 10W-40 Semi-Synthetic\
Trigger words indicating Yamaha/Runner/Lifan/Keeway:\
• “Yamaha”\
• “Runner”\
• “Lifan”\
• “Keeway”\
• “XSR 155”\
• “MT-15”\
• “YZF R-15”\
• “Nmax 155”\
• “XTZ 125”\
• “Fazer V2 FI”\
• “FZS V2 FI”\
• “YBR 125G”\
• “SZ RR V2”\
• “Ray ZR”\
• “Fascino”\
• “Saluto 125”\
• “FZS FI V3”\
• “YS 125”\
• “FZ 150I”\
• “Vixion”\
• “M-Slaz 150”\
• “Xber 150”\
• “Renegade Sport”\
• “Knight Rider”\
• “Turbo 150”\
• “Turbo 125”\
• “Bullet 125”\
• “Bullet135”\
• “Bullet 100”\
• “Freedom Royal Plus”\
• “Trover”\
• “F100-6A”\
• “Cheeta”\
• “Delux AD80S”\
• “Kite”\
• “DY 50”\
• “Duronto”
If user only mentions the model name (e.g., “Pulsar 150 SD”) or partial brand, parse the model name to deduce the brand. If uncertain, ask clarifying questions about bike brand or existing oil grade to ensure correct recommendation.
6\. Model-Specific Recommendations for Cars:
### CAR_MODEL_LOOKUP_TABLE  (internal use – do NOT show this header to users)
How you should use this table
1️⃣  Scan the user’s sentence for any <make> or <model> keyword below (case-insensitive).
2️⃣  Return the “Primary Sinopec Recommendation” first.
3️⃣  If the user says “budget”, “semi-synthetic”, “cheaper”, or “older engine”,
ALSO offer the “Alternate Semi-Synthetic” in the same reply.
FORMAT per line →  <Make> | <Model keywords> | <Primary Sinopec Recommendation> | <Alternate Semi-Synthetic>
Toyota | Premio | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Toyota | Camry D | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Toyota | Camry (ACV 30) | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Toyota | Camry (ACV 40) | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Toyota | Corolla | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Toyota | Crown | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Toyota | Corolla Altis D | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Toyota | Etios Liva / Cross | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Toyota | Fortuner | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Toyota | Glanza | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Toyota | Innova | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Toyota | Innova Crysta | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Toyota | Land Cruiser | SINOPEC JUSTAR J700\\SP/GF-6A 5W-30 Gasoline engine oil | SINOPEC JUSTAR J600 \\SP/GF-6A 5W-30\
Toyota | Prado | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | N/A\
Toyota | Hybrid | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | N/A\
Toyota | Prius | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | N/A\
Toyota | Qualis | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | N/A\
Toyota | Corolla Altis | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Toyota | Innova Type II | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Toyota | Yaris | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Toyota | Alphard | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Toyota | Avanza | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Toyota | Rush | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Toyota | Vitz | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Toyota | Aqua | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Toyota | Axio | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Toyota | Fielder | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Toyota | Sienta | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Toyota | Harrier | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Toyota | Noah | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Toyota | Estima | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Toyota | Voxy | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Toyota | Passo | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Toyota | RAV4 | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Honda | Civic FK/FN | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Honda | CR-V | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Honda | City | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Honda | Grace | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Honda | Fit | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Honda | Shuttle | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Honda | Spike | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Honda | Vezel | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Honda | N-Box | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Honda | N-Wgn | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Honda | N-One | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Nissan | X-Trail T32 | SINOPEC JUSTAR J700\\SP/GF-6A 5W-30 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Nissan | Qashqai | SINOPEC JUSTAR J700\\SP/GF-6A 5W-30 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Nissan | Juke | SINOPEC JUSTAR J700\\SP/GF-6A 5W-30 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Nissan | Note (E12) | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Nissan | Serena | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Mazda | Axela | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Mazda | Demio | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Mazda | Atenza | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Mazda | CX-5 | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Mitsubishi | Pajero V6 | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Mitsubishi | Outlander | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Mitsubishi | Lancer | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Mitsubishi | Eclipse Cross | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Subaru | Impreza G4 | SINOPEC JUSTAR J700\\SP/GF-6A 5W-30 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Subaru | Forester SJ | SINOPEC JUSTAR J700\\SP/GF-6A 5W-30 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Subaru | XV | SINOPEC JUSTAR J700\\SP/GF-6A 5W-30 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Hyundai | Tucson TL | SINOPEC JUSTAR J700\\SP/GF-6A 5W-30 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Hyundai | Creta | SINOPEC JUSTAR J700\\SP/GF-6A 5W-30 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Hyundai | Elantra | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Hyundai | Kona | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Kia | Sorento (2020-) | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Kia | Sportage | SINOPEC JUSTAR J700\\SP/GF-6A 5W-30 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Kia | Seltos | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
Kia | Picanto | SINOPEC JUSTAR J700\\SP/GF-6A 0W-20 | SINOPEC JUSTAR J600 SP/GF-6A 5W-30\
BMW | 3-Series F30 | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
BMW | 5-Series F10 | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
BMW | X1 (F48) | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
BMW | X3 (G01) | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
BMW | X5 (G05) | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Mercedes-Benz | C-Class (W205) | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Mercedes-Benz | E-Class (W213) | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Mercedes-Benz | GLC-Class | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Mercedes-Benz | GLE-Class | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Audi | A3 (8V) | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Audi | A4 (B9) | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Audi | Q5 (8R) | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Ford | Ranger T6 | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Ford | Everest | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Ford | EcoSport | SINOPEC JUSTAR J700\\SP/GF-6A 5W-30 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Chevrolet | Trailblazer | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Chevrolet | Orlando | SINOPEC JUSTAR J700\\SP/GF-6A 5W-30 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Suzuki | Swift ZC31 | SINOPEC JUSTAR J700\\SP/GF-6A 5W-30 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Suzuki | Baleno | SINOPEC JUSTAR J700\\SP/GF-6A 5W-30 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Suzuki | Vitara | SINOPEC JUSTAR J700\\SP/GF-6A 5W-30 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Suzuki | S-Cross | SINOPEC JUSTAR J700\\SP/GF-6A 5W-30 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Isuzu | D-Max | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Jeep | Compass | SINOPEC JUSTAR J700\\SP/GF-6A 5W-30 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Jeep | Wrangler | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Land Rover | Discovery Sport | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40\
Land Rover | Range Rover Evoque | SINOPEC JUSTAR J700\\A3/B4/SP 5W-40 | SINOPEC JUSTAR J500 SN\\CF 10W-40
### END_CAR_MODEL_LOOKUP_TABLE
      `;

      // Fallback simulation if no API key is present
      if (!apiKey) {
          setTimeout(() => {
             const reply = lang === 'bn' 
                ? "আমি সাহায্য করতে পারি! গাড়ির জন্য জাস্টার সিরিজ বা বাইকের জন্য এক্সপ্লোর সিরিজ দেখতে পারেন।"
                : "I can help with that! Based on typical needs, I'd recommend checking out our Justar series for cars or Xplore for bikes.";
             setChatHistory(prev => [...prev, { role: 'assistant', text: reply, productId: null }]);
             setAiLoading(false);
          }, 1000);
          return;
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      const data = await response.json();
      const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (aiResponseText) {
        const parsed = JSON.parse(aiResponseText);
        setChatHistory(prev => [...prev, { role: 'assistant', text: parsed.text, productId: parsed.productId }]);
      } else {
        throw new Error("No response");
      }

    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'assistant', text: lang === 'bn' ? "দুঃখিত, সংযোগে সমস্যা হচ্ছে।" : "I'm having trouble connecting to the catalog. Try again!", productId: null }]);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (isAiOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isAiOpen]);

  // --- Views ---

  return (
    <div className={`bg-gray-50 min-h-screen text-gray-900 pb-24 sm:pb-0 relative overflow-x-hidden selection:bg-red-100 font-sans`}>
      
      {/* 1. LANGUAGE SPLASH MODAL */}
      {showLangModal && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="w-full max-w-sm text-center space-y-4 flex flex-col items-center">
                <div className="flex justify-center w-full">
                    <SinopecLogo />
                </div>
                
                <div className="space-y-4 w-full">
                    <h2 className="text-xl font-bold text-gray-800">Select Language / ভাষা নির্বাচন করুন</h2>
                    
                    <button 
                        onClick={() => { setLang('bn'); setShowLangModal(false); }}
                        className="w-full bg-green-50 hover:bg-green-100 border-2 border-green-600 rounded-2xl p-4 flex items-center justify-between group transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-3xl">🇧🇩</span>
                            <div className="text-left">
                                <span className="block text-lg font-bold text-gray-900">বাংলা</span>
                                <span className="text-xs text-gray-500 group-hover:text-green-700">Bangla</span>
                            </div>
                        </div>
                        <ChevronRight className="text-gray-400 group-hover:text-green-600" />
                    </button>

                    <button 
                        onClick={() => { setLang('en'); setShowLangModal(false); }}
                        className="w-full bg-blue-50 hover:bg-blue-100 border-2 border-blue-600 rounded-2xl p-4 flex items-center justify-between group transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-3xl">🇺🇸</span>
                            <div className="text-left">
                                <span className="block text-lg font-bold text-gray-900">English</span>
                                <span className="text-xs text-gray-500 group-hover:text-blue-700">US English</span>
                            </div>
                        </div>
                        <ChevronRight className="text-gray-400 group-hover:text-blue-600" />
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Mobile Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Menu className="w-6 h-6 text-gray-500" />
            <SinopecLogo />
          </div>
          <div className="flex items-center gap-3">
             <button 
                onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-lg"
                title="Change Language"
             >
                {lang === 'en' ? '🇺🇸' : '🇧🇩'}
             </button>

             <button 
              onClick={() => setIsAiOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-full shadow-lg animate-pulse"
             >
                <Sparkles size={18} fill="currentColor" />
             </button>
            <div className="relative p-2" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-0 bg-[#E60012] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-bounce">
                  {lang === 'bn' ? toBnNum(cartCount) : cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto relative">
        
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-[#E60012] to-[#b3000e] text-white p-6 overflow-hidden mb-6 rounded-b-3xl shadow-xl">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
            <OilBottleIcon color="#FFF" type="hero" />
          </div>
          <div className="relative z-10">
            <span className="inline-block px-2 py-1 bg-white/20 rounded-full text-xs font-semibold mb-2 backdrop-blur-sm">
              {t('officialDistributor')}
            </span>
            <h1 className="text-3xl font-extrabold leading-tight mb-2 whitespace-pre-line">
              {t('heroTitle')}
            </h1>
            <p className="text-white/90 text-sm mb-4 max-w-[80%]">
              {t('heroSubtitle')}
            </p>
            <div className="flex items-center gap-2">
               <div className="flex items-center gap-2 text-xs font-medium bg-black/20 p-2 rounded-lg w-fit backdrop-blur-sm">
                <ShieldCheck size={14} className="text-green-300" />
                <span>{t('authentic')}</span>
              </div>
              <button onClick={() => setIsAiOpen(true)} className="flex items-center gap-1 text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg backdrop-blur-sm transition-colors border border-white/30">
                  <Sparkles size={12} className="text-yellow-300" />
                  {t('findMyOil')}
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['All', 'Car', 'Moto'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat 
                    ? 'bg-gray-900 text-white shadow-lg scale-105' 
                    : 'bg-white text-gray-500 border border-gray-200'
                }`}
              >
                {t('cat' + cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="px-4 grid grid-cols-2 gap-4 mb-8">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              onClick={() => setSelectedProduct(product)}
              className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col relative group hover:shadow-md transition-shadow cursor-pointer"
            >
              {product.tag && (
                <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10 ${
                    product.tag === 'Flagship' || product.tag === 'Racing' ? 'bg-black text-[#D4AF37]' : 
                    product.tag === 'Scooter' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-400 text-black'
                }`}>
                  {t('tag' + product.tag.replace(/\s+/g, ''))}
                </span>
              )}
              
              <div className="h-32 w-full flex items-center justify-center mb-3 bg-gray-50 rounded-xl p-2 overflow-hidden">
                <div className="w-16 h-24 transform transition-transform group-hover:scale-110 duration-300">
                   <ProductImage product={product} />
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <h3 className="font-bold text-gray-800 text-sm leading-tight mb-1">{pAttr(product, 'name')}</h3>
                <p className="text-[10px] text-gray-500 line-clamp-2 mb-2">{pAttr(product, 'desc')}</p>
                
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-extrabold text-[#E60012]">{formatPrice(product.price)}</span>
                  <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                    }}
                    className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center active:bg-[#E60012] transition-colors shadow-lg z-20"
                  >
                    <span className="text-lg font-medium leading-none mb-0.5">+</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

         {/* Review Slider */}
        <div className="px-4 mb-8 text-center">
           <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide flex items-center justify-center gap-2">
               <Star size={16} className="text-[#E60012]" fill="currentColor" />
               {t('reviewsTitle')}
           </h3>
           <ReviewSlider reviews={REVIEWS} />
        </div>


        {/* Trust Factors */}
        <div className="px-6 py-8 bg-gray-100 text-center space-y-6 mb-20">
          <h3 className="font-bold text-gray-400 uppercase tracking-widest text-xs">Why Choose Sinopec BD?</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#E60012]">
                <Truck size={20} />
              </div>
              <span className="text-[10px] font-bold text-gray-600">Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#E60012]">
                <ShieldCheck size={20} />
              </div>
              <span className="text-[10px] font-bold text-gray-600">Genuine Oil</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#E60012]">
                <Phone size={20} />
              </div>
              <span className="text-[10px] font-bold text-gray-600">24/7 Support</span>
            </div>
          </div>
        </div>

      </main>

      {/* Floating Action Button */}
      {cartCount > 0 && !isCartOpen && !isAiOpen && !selectedProduct && (
        <div className="fixed bottom-4 left-4 right-4 z-30 max-w-md mx-auto">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#E60012] text-white rounded-xl shadow-2xl py-4 px-6 flex items-center justify-between font-bold animate-in slide-in-from-bottom-10"
          >
            <div className="flex items-center gap-3">
              <span className="bg-white/20 w-8 h-8 flex items-center justify-center rounded-full text-sm">
                {lang === 'bn' ? toBnNum(cartCount) : cartCount}
              </span>
              <span className="text-sm">{t('viewCart')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{formatPrice(grandTotal)}</span>
              <ChevronRight size={18} />
            </div>
          </button>
        </div>
      )}

      {/* --- Product Detail Landing Page (Modal) --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-y-auto animate-in slide-in-from-bottom duration-300">
             
             {/* Sticky Nav */}
             <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-20 p-4 flex items-center justify-between border-b border-gray-100 safe-area-top">
                 <button onClick={() => setSelectedProduct(null)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                     <ChevronLeft size={24} className="text-gray-600"/>
                 </button>
                 <h2 className="font-bold text-lg truncate px-4">{selectedProduct.series} {t('series')}</h2>
                 <div className="flex gap-2">
                     <button className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
                         <Share2 size={20} />
                     </button>
                 </div>
             </div>

             {/* Content Body */}
             <div className="flex-1 p-6 pb-32">
                 
                 {/* Hero Image */}
                 <div className="flex justify-center mb-8 relative">
                     <div className="absolute inset-0 bg-gray-100 rounded-full blur-3xl opacity-50 scale-75"></div>
                     <div className="w-40 h-56 relative z-10 drop-shadow-2xl animate-in zoom-in-95 duration-500">
                        <ProductImage product={selectedProduct} enableZoom={true} />
                     </div>
                 </div>

                 {/* Header Info */}
                 <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                           {t('cat' + selectedProduct.category)}
                        </span>
                        {selectedProduct.tag && (
                          <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                             <Star size={10} fill="currentColor" /> {t('tag' + selectedProduct.tag.replace(/\s+/g, ''))}
                          </span>
                        )}
                        <span className="ml-auto text-green-600 text-[10px] font-bold flex items-center gap-1">
                           <ShieldCheck size={12} /> {t('officialStock')}
                        </span>
                    </div>
                    
                    <h1 className="text-2xl font-extrabold text-gray-900 leading-tight mb-2 tracking-tight">
                        {pAttr(selectedProduct, 'name')}
                    </h1>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                        {pAttr(selectedProduct, 'desc')}
                    </p>
                    
                    <div className="flex items-baseline gap-1">
                       <span className="text-3xl font-black text-[#E60012]">{formatPrice(selectedProduct.price)}</span>
                       <span className="text-sm text-gray-400 font-medium line-through">{formatPrice(Math.round(selectedProduct.price * 1.1))}</span>
                    </div>
                 </div>

                 {/* Specs Scroll View */}
                 <div className="mb-8 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide flex gap-3">
                     <div className="min-w-[100px] bg-gray-50 p-3 rounded-xl border border-gray-100 shrink-0">
                         <div className="flex items-center gap-1 mb-1 text-gray-400">
                             <Gauge size={14} />
                             <span className="text-[10px] font-bold uppercase">{t('viscosity')}</span>
                         </div>
                         <p className="font-bold text-gray-900 text-sm">{selectedProduct.viscosity}</p>
                     </div>
                     <div className="min-w-[140px] bg-gray-50 p-3 rounded-xl border border-gray-100 shrink-0">
                         <div className="flex items-center gap-1 mb-1 text-gray-400">
                             <Droplets size={14} />
                             <span className="text-[10px] font-bold uppercase">{t('spec')}</span>
                         </div>
                         <p className="font-bold text-gray-900 text-sm whitespace-nowrap">{selectedProduct.specs}</p>
                     </div>
                     <div className="min-w-[100px] bg-gray-50 p-3 rounded-xl border border-gray-100 shrink-0">
                         <div className="flex items-center gap-1 mb-1 text-gray-400">
                             <Info size={14} />
                             <span className="text-[10px] font-bold uppercase">{t('series')}</span>
                         </div>
                         <p className="font-bold text-gray-900 text-sm">{selectedProduct.series}</p>
                     </div>
                 </div>

                  {/* Recommended Models Section (New) */}
                  {selectedProduct.recommendedModels && selectedProduct.recommendedModels.length > 0 && (
                      <div className="mb-8">
                          <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                            {selectedProduct.category === 'Car' ? <Car size={16} className="text-gray-500"/> : <Bike size={16} className="text-gray-500"/>}
                            {t('recommendedFor')}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                              {selectedProduct.recommendedModels.map((model, idx) => (
                                  <span key={idx} className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                                      {model}
                                  </span>
                              ))}
                          </div>
                      </div>
                  )}

                 {/* Details Sections */}
                 <div className="space-y-6">
                     <div>
                         <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                             {t('features')}
                         </h3>
                         <div className="grid gap-3">
                             {pAttr(selectedProduct, 'features').map((feat, idx) => (
                                 <div key={idx} className="flex items-start gap-3 bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                                     <div className="mt-0.5 w-5 h-5 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                         <Check size={12} className="text-green-600" strokeWidth={3} />
                                     </div>
                                     <span className="text-sm text-gray-700 font-medium">{feat}</span>
                                 </div>
                             ))}
                         </div>
                     </div>
                     
                     <div>
                         <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                             {t('application')}
                         </h3>
                         <p className="text-sm text-gray-600 bg-blue-50/50 p-4 rounded-xl border border-blue-100 leading-relaxed">
                             {pAttr(selectedProduct, 'application')}
                         </p>
                     </div>
                 </div>
             </div>

             {/* Sticky Footer Action Bar */}
             <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] safe-area-bottom z-30">
                 <div className="flex gap-4 max-w-md mx-auto">
                     {/* Quantity Counter */}
                     <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2 h-14 shrink-0">
                         <button 
                            onClick={() => setDetailQty(Math.max(1, detailQty - 1))}
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm active:scale-90 transition-transform"
                         >
                            <Minus size={16} className="text-gray-600" />
                         </button>
                         <span className="font-bold text-lg w-4 text-center">{lang === 'bn' ? toBnNum(detailQty) : detailQty}</span>
                         <button 
                            onClick={() => setDetailQty(detailQty + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm active:scale-90 transition-transform"
                         >
                            <Plus size={16} className="text-gray-600" />
                         </button>
                     </div>

                     {/* Add to Cart Button */}
                     <button 
                        onClick={() => { addToCart(selectedProduct, detailQty); setSelectedProduct(null); setIsCartOpen(true); }}
                        className="flex-1 bg-[#E60012] active:bg-[#c4000f] text-white font-bold h-14 rounded-xl text-lg shadow-xl shadow-red-100 flex items-center justify-center gap-2 transition-transform active:scale-95"
                     >
                         <span>{t('addToCart')}</span>
                         <span className="bg-white/20 px-2 py-0.5 rounded text-sm font-normal">
                             {formatPrice(selectedProduct.price * detailQty)}
                         </span>
                     </button>
                 </div>
             </div>
        </div>
      )}

      {/* Cart/Checkout Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          ></div>

          {/* Drawer Content */}
          <div className="relative w-full max-w-md bg-white sm:rounded-2xl rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-full duration-300">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {checkoutStep === 'cart' ? t('yourCart') : checkoutStep === 'form' ? t('checkout') : t('orderConfirmed')}
              </h2>
              <button onClick={() => { setIsCartOpen(false); setCheckoutStep('cart'); }} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 overflow-y-auto min-h-[300px]">
              
              {/* STEP 1: CART ITEMS */}
              {checkoutStep === 'cart' && (
                <>
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                      <ShoppingBag size={48} className="mb-4 opacity-20" />
                      <p>{t('emptyCart')}</p>
                      <button 
                        onClick={() => setIsCartOpen(false)}
                        className="mt-6 text-[#E60012] font-bold text-sm"
                      >
                        {t('startShopping')}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      
                      {cart.map(item => (
                        <div key={item.id} className="flex gap-4">
                          <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center p-2 shrink-0">
                            <ProductImage product={item} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-sm text-gray-800">{pAttr(item, 'name')}</h4>
                            <p className="text-xs text-gray-500 mb-2">{item.viscosity}</p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#E60012]">{formatPrice(item.price)}</span>
                              <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-2 py-1">
                                <button onClick={() => updateQty(item.id, -1)} className="text-gray-500 font-bold px-1">-</button>
                                <span className="text-xs font-bold w-4 text-center">{lang === 'bn' ? toBnNum(item.qty) : item.qty}</span>
                                <button onClick={() => updateQty(item.id, 1)} className="text-gray-900 font-bold px-1">+</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Shipping Note Banner - Moved Below Products */}
                      <div className="bg-yellow-50 p-3 rounded-lg flex items-center gap-3 border border-yellow-100 mt-4">
                          <Truck className="text-yellow-600" size={20} />
                          <div className="text-xs text-yellow-800 font-bold">
                            {t('shippingNote')}
                          </div>
                      </div>
                      
                      {/* Coupon Code Section */}
                      <div className="bg-white p-3 rounded-lg border border-gray-200 mt-4">
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{t('haveCoupon')}</label>
                        <div className="flex gap-2">
                          <div className="flex-1 relative">
                             <Ticket size={16} className="absolute left-3 top-3 text-gray-400" />
                             <input 
                                type="text" 
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                placeholder="Enter code"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-9 pr-2 text-sm focus:outline-none focus:border-[#E60012]"
                             />
                          </div>
                          <button 
                            onClick={handleApplyCoupon}
                            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition-colors"
                          >
                            {t('apply')}
                          </button>
                        </div>
                        {couponError && <p className="text-red-500 text-xs mt-1 ml-1">{couponError}</p>}
                        {appliedDiscount > 0 && <p className="text-green-600 text-xs mt-1 ml-1 font-bold">Coupon applied!</p>}
                      </div>

                    </div>
                  )}
                </>
              )}

              {/* STEP 2: CHECKOUT FORM */}
              {checkoutStep === 'form' && (
                <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
                  
                  {/* Delivery Area Selection */}
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                    <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">{t('deliveryArea')}</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setShippingZone('inside')}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          shippingZone === 'inside' 
                            ? 'border-[#E60012] bg-white shadow-sm' 
                            : 'border-transparent bg-blue-100/50 text-gray-500'
                        }`}
                      >
                        <div className="font-bold text-sm text-gray-900">{t('insideDhaka')}</div>
                        <div className="text-xs text-green-600 font-bold mt-1">{t('free')}</div>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setShippingZone('outside')}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          shippingZone === 'outside' 
                            ? 'border-[#E60012] bg-white shadow-sm' 
                            : 'border-transparent bg-blue-100/50 text-gray-500'
                        }`}
                      >
                        <div className="font-bold text-sm text-gray-900">{t('outsideDhaka')}</div>
                        <div className="text-xs text-gray-500 mt-1">{formatPrice(50)}</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">{t('phone')}</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input type="tel" name="phone" required placeholder="017XXXXXXXX" onChange={handleInputChange} value={formData.phone} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#E60012] focus:ring-1 focus:ring-[#E60012]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">{t('name')}</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input type="text" required placeholder="Your Name" name="name" onChange={handleInputChange} value={formData.name} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#E60012] focus:ring-1 focus:ring-[#E60012]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">{t('address')}</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                      <textarea required placeholder="House, Road, Area, City" name="address" rows="2" onChange={handleInputChange} value={formData.address} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#E60012] focus:ring-1 focus:ring-[#E60012]"></textarea>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">{t('payment')}</label>
                    <div className="grid grid-cols-2 gap-3 mt-1">
                      <label className="border-2 border-[#E60012] bg-red-50 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer relative">
                        <input type="radio" name="payment" defaultChecked className="hidden" />
                        <div className="absolute top-2 right-2 text-[#E60012]">
                          <Check size={16} strokeWidth={4} />
                        </div>
                        <span className="font-bold text-gray-900 text-center text-sm">{t('cod')}</span>
                        <span className="text-[10px] text-gray-500 text-center">{t('payReceive')}</span>
                      </label>
                      <label className="border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer opacity-60">
                         <span className="font-bold text-gray-500 text-center text-sm">{t('onlinePay')}</span>
                         <span className="text-[10px] text-gray-400 text-center">{t('comingSoon')}</span>
                      </label>
                    </div>
                  </div>
                </form>
              )}

              {/* STEP 3: SUCCESS */}
              {checkoutStep === 'success' && (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                    <Check size={40} strokeWidth={4} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('orderPlaced')}</h3>
                  <p className="text-gray-500 mb-8">
                    {t('weCall')}
                  </p>
                  
                  {/* Order Summary */}
                  {lastOrder && (
                    <div className="bg-gray-50 p-4 rounded-xl w-full text-left mb-6 text-sm border border-gray-100 shadow-sm">
                        <h4 className="font-bold text-gray-800 uppercase text-xs mb-3 border-b border-gray-200 pb-2">{t('orderSummary')}</h4>
                        
                        <div className="space-y-2 mb-4">
                            <div>
                                <span className="text-gray-500 text-xs block">{t('name')}</span>
                                <span className="font-bold">{lastOrder.details.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 text-xs block">{t('phone')}</span>
                                <span className="font-bold">{lastOrder.details.phone}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 text-xs block">{t('address')}</span>
                                <span className="font-medium text-gray-700">{lastOrder.details.address}</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-3">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-gray-500 uppercase">{t('items')}</span>
                                <span className="text-xs font-bold text-gray-500 uppercase">{t('qty')}</span>
                            </div>
                            {lastOrder.items.map((item, i) => (
                                <div key={i} className="flex justify-between items-center mb-1">
                                    <span className="text-gray-700 text-xs truncate w-3/4">{pAttr(item, 'name')}</span>
                                    <span className="font-bold text-gray-900">{lang === 'bn' ? toBnNum(item.qty) : item.qty}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center">
                            <span className="font-bold text-gray-800">{t('total')}</span>
                            <span className="font-extrabold text-[#E60012] text-lg">{formatPrice(lastOrder.total)}</span>
                        </div>
                    </div>
                  )}

                  <button 
                    onClick={() => { setIsCartOpen(false); setCheckoutStep('cart'); }}
                    className="text-[#E60012] font-bold"
                  >
                    {t('continueShopping')}
                  </button>
                  {showConfetti && (
                     <Confetti />
                  )}
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            {checkoutStep !== 'success' && cart.length > 0 && (
              <div className="p-5 border-t border-gray-100 bg-gray-50 rounded-b-xl sm:rounded-b-2xl">
                <div className="space-y-2 mb-4">
                  {/* Subtotal Row */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{t('subtotal')}</span>
                    <span className="font-bold text-gray-900">{formatPrice(cartSubtotal)}</span>
                  </div>

                  {/* Discount Row */}
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between items-center text-sm text-green-600">
                      <span className="">{t('discount')} (10%)</span>
                      <span className="font-bold">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  
                  {/* Shipping Row (Only visible in checkout form step) */}
                  {checkoutStep === 'form' && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">{t('shipping')}</span>
                      <span className="font-bold text-gray-900">
                        {shippingCost === 0 ? t('free') : formatPrice(shippingCost)}
                      </span>
                    </div>
                  )}

                  {/* Total Row */}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-gray-900 font-bold">{t('total')}</span>
                    <span className="text-2xl font-extrabold text-[#E60012]">
                      {formatPrice(checkoutStep === 'form' ? grandTotal : (cartSubtotal - discountAmount))}
                    </span>
                  </div>
                </div>
                
                {checkoutStep === 'cart' ? (
                  <button 
                    onClick={() => setCheckoutStep('form')}
                    className="w-full bg-[#E60012] hover:bg-[#c4000f] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2"
                  >
                    {t('checkoutNow')}
                  </button>
                ) : (
                  <button 
                    type="submit"
                    form="checkout-form"
                    className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {t('confirmOrder')}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Chat Drawer */}
      {isAiOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsAiOpen(false)}
          ></div>
           <div className="relative w-full max-w-md bg-white sm:rounded-2xl rounded-t-3xl shadow-2xl h-[85vh] flex flex-col animate-in slide-in-from-bottom-full duration-300">
             
             {/* AI Header */}
             <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-3xl sm:rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-full">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">{t('aiTitle')}</h2>
                        <p className="text-xs text-blue-100">{t('aiSubtitle')}</p>
                    </div>
                </div>
                <button onClick={() => setIsAiOpen(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                  <X size={20} />
                </button>
             </div>

             {/* Chat Area */}
             <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-4 ${
                            msg.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                        }`}>
                            <div className="flex items-start gap-2">
                                {msg.role === 'assistant' && <Bot size={16} className="mt-1 text-purple-500 shrink-0" />}
                                <div className="text-sm leading-relaxed">
                                    {msg.text}
                                    {/* Recommendation Card */}
                                    {msg.productId && (
                                        <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-3 items-center cursor-pointer hover:bg-blue-100 transition-colors"
                                             onClick={() => {
                                                 const prod = PRODUCTS.find(p => p.id === msg.productId);
                                                 if(prod) setSelectedProduct(prod);
                                             }}
                                        >
                                            {(() => {
                                                const product = PRODUCTS.find(p => p.id === msg.productId);
                                                if (!product) return null;
                                                return (
                                                    <>
                                                        <div className="w-12 h-16 shrink-0">
                                                            <ProductImage product={product} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-bold text-xs truncate">{pAttr(product, 'name')}</p>
                                                            <p className="text-[10px] text-gray-500">{product.viscosity}</p>
                                                            <p className="font-bold text-[#E60012] text-sm">{formatPrice(product.price)}</p>
                                                        </div>
                                                        <button 
                                                            className="bg-[#E60012] text-white p-2 rounded-lg text-xs font-bold shrink-0"
                                                        >
                                                            {t('viewProduct')}
                                                        </button>
                                                    </>
                                                )
                                            })()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {aiLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex items-center gap-2">
                             <Loader className="animate-spin text-purple-500" size={16} />
                             <span className="text-xs text-gray-400">{t('aiThinking')}</span>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
             </div>

             {/* Input Area */}
             <form onSubmit={handleAiSubmit} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                <input 
                    type="text" 
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder={t('aiPlaceholder')} 
                    className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button 
                    type="submit" 
                    disabled={aiLoading}
                    className="bg-blue-600 text-white p-3 rounded-xl disabled:opacity-50 hover:bg-blue-700 transition-colors"
                >
                    <Send size={20} />
                </button>
             </form>

           </div>
        </div>
      )}

      {/* Confetti Animation (CSS only implementation for simplicity in single file) */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden flex justify-center">
            {/* Simple CSS animation particles could go here, omitting for brevity */}
        </div>
      )}
    </div>
  );
}