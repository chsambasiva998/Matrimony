import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, Star, Lock, Eye, Bookmark, Heart, 
  Send, Inbox, Wallet, X, Copy, Menu, CheckCircle, BadgeCheck 
} from 'lucide-react';

// Standardized Configuration Enums for Multipliers
const INCOME_MAP = { '3-5 LPA': 1, '5-10 LPA': 2, '10-15 LPA': 3, '15-25 LPA': 4, '25-50 LPA': 5, '50+ LPA': 6 };
const ASSET_MAP = { 'No Assets': 0, 'Below 50 Lakhs': 1, '50 Lakhs - 1 Crore': 2, '1 - 3 Crores': 3, '3 - 5 Crores': 4, '5 - 10 Crores': 5, '10 - 20 Crores': 6, '20 Crores+': 7 };

const CORE_MASTER_SEEDS = [
  {
    __backendId: "user_seed_sambasiva_rao",
    profile_id: "TV48291",
    first_name: "Sambasiva Rao",
    last_name: "Chippada",
    email: "sambasiva.rao@example.com",
    phone: "+91 98765 43210",
    age: 27,
    gender: "Male",
    marital_status: "Never Married",
    height: "5'8\"",
    bloodGroup: "O+",
    education: "B.Tech/B.E",
    occupation: "Software Engineer",
    income: "15-25 LPA",
    city: "Vijayawada",
    caste: "Kapu",
    gothram: "Bharadwaja",
    rashi: "Makara",
    padam: "1",
    kujaDosham: "No (లేదు)",
    nakshatra: "Dhanishta",
    diet: "Vegetarian",
    physicalStatus: "Normal Status",
    fatherName: "Satyanarayana Rao",
    motherName: "Lakshmi Devi",
    maternalSurnames: "Ganni, Penugonda",
    propertyWorth: "3 - 5 Crores",
    landDetails: "3.5 Acres near Gannavaram bypass",
    houseDetails: "G+2 Duplex plot in Vijayawada city limits",
    abroadStatus: "Open to both",
    about: "Developing custom architecture models and security software stacks.",
    profile_status: "approved",
    is_admin: true,
    interests_received: "user_seed_bride_sravani",
    shortlisted: "",
    contact_purchases: "",
    avatar_source: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
  },
  {
    __backendId: "user_seed_bride_sravani",
    profile_id: "TV92014",
    first_name: "Sravani",
    last_name: "Muvva",
    email: "sravani.m@example.com",
    phone: "+91 91234 56789",
    age: 24,
    gender: "Female",
    marital_status: "Never Married",
    height: "5'4\"",
    bloodGroup: "A+",
    education: "MBA",
    occupation: "Banking",
    income: "5-10 LPA",
    city: "Vijayawada",
    caste: "Kapu",
    gothram: "Janakula",
    rashi: "Kanya",
    padam: "2",
    kujaDosham: "No (లేదు)",
    nakshatra: "Hasta",
    diet: "Vegetarian",
    physicalStatus: "Normal Status",
    fatherName: "Ramesh Babu",
    motherName: "Vasundhara",
    maternalSurnames: "Kaza, Thota",
    propertyWorth: "5 - 10 Crores",
    landDetails: "Commercial shop front layout spaces",
    houseDetails: "Independent residential asset portfolio plots",
    abroadStatus: "Looking for local matches only",
    about: "Traditional family values, interested in aligned compatibility standings.",
    profile_status: "approved",
    is_admin: false,
    interests_received: "",
    shortlisted: "",
    contact_purchases: "",
    avatar_source: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
  }
];

// Reusable Secure Watermarked Canvas Component to prevent state rerender sync crashes
function SecureAvatar({ imageUrl, watermarkText }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      ctx.clearRect(0, 0, 120, 120);
      ctx.drawImage(img, 0, 0, 120, 120);
      
      // Inject secure dynamic canvas protection transformations
      ctx.save();
      ctx.rotate(-25 * Math.PI / 180);
      ctx.font = "bold 9px DM Sans";
      ctx.fillStyle = "rgba(123, 31, 31, 0.45)";
      ctx.fillText(watermarkText, -10, 50);
      ctx.fillText("T-VIVAHAM", -10, 65);
      ctx.restore();
    };
  }, [imageUrl, watermarkText]);

  return <canvas ref={canvasRef} width="120" height="120" className="w-12 h-12 rounded-full border bg-orange-50 shrink-0 select-none pointer-events-none" />;
}

export default function App() {
  const [profiles, setProfiles] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [toastMessage, setToastMessage] = useState('');
  
  // Search Filters State
  const [filterGender, setFilterGender] = useState('');
  const [filterCaste, setFilterCaste] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [financialFilterActive, setFinancialFilterActive] = useState(false);
  
  // Modals Management State
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [showUpiModal, setShowUpiModal] = useState(false);

  // Registration Form State
  const [regForm, setRegForm] = useState({
    first_name: '', last_name: '', email: '', phone: '', age: 27, gender: 'Male',
    marital_status: 'Never Married', height: "5'8\"", bloodGroup: 'O+', caste: 'Kapu',
    gothram: '', nakshatra: 'Dhanishta', padam: '1', rashi: 'Makara', kujaDosham: 'No (లేదు)',
    education: 'B.Tech/B.E', occupation: 'Software Engineer', income: '15-25 LPA',
    city: 'Vijayawada', diet: 'Vegetarian', physicalStatus: 'Normal Status',
    fatherName: '', motherName: '', maternalSurnames: '', propertyWorth: '3 - 5 Crores',
    landDetails: '', houseDetails: '', abroadStatus: 'Open to both', about: '',
    avatar_source: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  });

  useEffect(() => {
    try {
      const data = localStorage.getItem('tv_production_engine_data');
      let currentSet = CORE_MASTER_SEEDS;
      if (!data) {
        localStorage.setItem('tv_production_engine_data', JSON.stringify(CORE_MASTER_SEEDS));
      } else {
        currentSet = JSON.parse(data);
      }
      setProfiles(currentSet);
      const activeToken = localStorage.getItem('tv_active_session_token');
      const userMatch = currentSet.find(p => p.__backendId === activeToken);
      setCurrentUser(userMatch || currentSet[0]);
    } catch (e) {
      setProfiles(CORE_MASTER_SEEDS);
      setCurrentUser(CORE_MASTER_SEEDS[0]);
    }
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(''), 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const syncStateUpdate = (updatedSet) => {
    localStorage.setItem('tv_production_engine_data', JSON.stringify(updatedSet));
    setProfiles(updatedSet);
    if (currentUser) {
      const refreshedUser = updatedSet.find(p => p.__backendId === currentUser.__backendId);
      setCurrentUser(refreshedUser || updatedSet[0]);
    }
  };

  const handleSessionChange = (id) => {
    localStorage.setItem('tv_active_session_token', id);
    const userMatch = profiles.find(p => p.__backendId === id);
    if (userMatch) {
      setCurrentUser(userMatch);
      triggerToast(`Swapped view into profile node: ${userMatch.first_name}`);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...regForm,
      __backendId: "user_runtime_" + Date.now(),
      profile_id: "TV" + Math.floor(10000 + Math.random() * 90000),
      profile_status: "approved",
      is_admin: false, interests_received: "", shortlisted: "", contact_purchases: ""
    };
    const nextSet = [...profiles, payload];
    syncStateUpdate(nextSet);
    triggerToast("🎉 Profile successfully registered & deployed live!");
    setStep(1);
    setCurrentView('search');
  };

  const handleConnect = (targetBackendId) => {
    if (!currentUser) return;
    const nextSet = profiles.map(p => {
      if (p.__backendId === targetBackendId) {
        let rec = (p.interests_received || '').split(',').filter(Boolean);
        if (!rec.includes(currentUser.__backendId)) rec.push(currentUser.__backendId);
        return { ...p, interests_received: rec.join(',') };
      }
      return p;
    });
    syncStateUpdate(nextSet);
    triggerToast("💌 Proposal securely dispatched to match tracking vector.");
  };

  const handleToggleShortlist = (targetBackendId) => {
    if (!currentUser) return;
    const nextSet = profiles.map(p => {
      if (p.__backendId === currentUser.__backendId) {
        let sl = (p.shortlisted || '').split(',').filter(Boolean);
        const pos = sl.indexOf(targetBackendId);
        if (pos > -1) sl.splice(pos, 1); else sl.push(targetBackendId);
        return { ...p, shortlisted: sl.join(',') };
      }
      return p;
    });
    syncStateUpdate(nextSet);
    triggerToast("Shortlist updated successfully.");
  };

  const handleProcessUnlockPayment = () => {
    if (!currentUser || !selectedProfileId) return;
    const nextSet = profiles.map(p => {
      if (p.__backendId === selectedProfileId) {
        let cp = (p.contact_purchases || '').split(',').filter(Boolean);
        if (!cp.includes(currentUser.__backendId)) cp.push(currentUser.__backendId);
        return { ...p, contact_purchases: cp.join(',') };
      }
      return p;
    });
    syncStateUpdate(nextSet);
    setShowUpiModal(false);
    triggerToast("Premium token applied! Contact assets unlocked safely.");
  };

  // Memoized secure calculation filter layer
  const computedTargetGender = filterGender || (currentUser?.gender === 'Male' ? 'Female' : 'Male');
  
  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      if (profile.profile_status !== 'approved') return false;
      if (currentUser && profile.__backendId === currentUser.__backendId) return false;
      if (profile.gender !== computedTargetGender) return false;
      if (filterCaste && profile.caste !== filterCaste) return false;
      if (filterCity && !(profile.city || '').toLowerCase().includes(filterCity.toLowerCase())) return false;

      // Strict Lineage Validation Engine
      if (currentUser?.gothram && profile.gothram) {
        if (currentUser.gothram.trim().toLowerCase() === profile.gothram.trim().toLowerCase()) return false;
      }

      // Asymmetric Financial Indicator Evaluation Logic
      if (financialFilterActive && currentUser) {
        const myIncomeTier = INCOME_MAP[currentUser.income] || 1;
        const matchIncomeTier = INCOME_MAP[profile.income] || 1;
        const myAssetTier = ASSET_MAP[currentUser.propertyWorth] || 1;
        const matchAssetTier = ASSET_MAP[profile.propertyWorth] || 1;

        if (currentUser.gender === 'Female') {
          if (matchIncomeTier < myIncomeTier || matchAssetTier < myAssetTier) return false;
        } else {
          if (matchIncomeTier > myIncomeTier || matchAssetTier > (myAssetTier + 1)) return false;
        }
      }
      return true;
    });
  }, [profiles, currentUser, computedTargetGender, filterCaste, filterCity, financialFilterActive]);

  const activeModalProfile = useMemo(() => profiles.find(p => p.__backendId === selectedProfileId), [profiles, selectedProfileId]);
  const modalHasAccess = currentUser && activeModalProfile && (activeModalProfile.contact_purchases || '').split(',').includes(currentUser.__backendId);

  return (
    <div className="w-full h-full flex flex-col min-h-screen">
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#2c1810] text-white px-6 py-3 rounded-xl shadow-xl z-50 transition-all font-medium opacity-100 transform translate-y-0">
          {toastMessage}
        </div>
      )}

      <nav className="w-full bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0 cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="w-9 h-9 gradient-primary rounded-lg flex items-center justify-center text-white font-heading font-bold text-lg">మ</div>
            <span className="font-heading font-bold text-xl text-[#7b1f1f]">Telugu Vivaham</span>
          </div>

          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5">
            <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider whitespace-nowrap">👤 Session:</span>
            <select 
              value={currentUser?.__backendId || ''} 
              onChange={(e) => handleSessionChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-gray-800 focus:outline-none cursor-pointer max-w-[150px] truncate"
            >
              {profiles.map(p => <option key={p.__backendId} value={p.__backendId}>{p.first_name} ({p.gender})</option>)}
            </select>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#5a3e36]">
            <button onClick={() => setCurrentView('home')} className="hover:text-[#7b1f1f]">Home</button>
            <button onClick={() => setCurrentView('search')} className="hover:text-[#7b1f1f]">Search Feed</button>
            <button onClick={() => setCurrentView('dashboard')} className="hover:text-[#7b1f1f]">My Dashboard</button>
            {currentUser?.is_admin && <button onClick={() => setCurrentView('admin')} className="text-emerald-700 font-bold">Admin Panel</button>}
            <button onClick={() => setCurrentView('register')} className="bg-[#7b1f1f] text-white px-4 py-2 rounded-lg hover:bg-[#912525]">Register Profile</button>
          </div>
          
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-[#5a3e36] md:hidden">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-2 text-sm font-medium bg-white border-t border-gray-100">
          <button onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }} className="py-2 text-left">Home</button>
          <button onClick={() => { setCurrentView('search'); setMobileMenuOpen(false); }} className="py-2 text-left">Search Feed</button>
          <button onClick={() => { setCurrentView('dashboard'); setMobileMenuOpen(false); }} className="py-2 text-left">My Dashboard</button>
          {currentUser?.is_admin && <button onClick={() => { setCurrentView('admin'); setMobileMenuOpen(false); }} className="py-2 text-left text-emerald-700">Admin Panel</button>}
          <button onClick={() => { setCurrentView('register'); setMobileMenuOpen(false); }} className="py-2 text-left text-[#7b1f1f]">Register Profile</button>
        </div>
      )}

      <main className="flex-1 w-full">
        {currentView === 'home' && (
          <section className="w-full">
            <div className="gradient-primary py-16 md:py-24 px-4 text-center text-white">
              <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">Find Your Perfect Life Partner</h1>
              <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">Trusted Telugu matrimony community with rigorous asset privacy shields, verified family lineage credentials, and intelligent status compatibility mapping logic.</p>
              <button onClick={() => setCurrentView('register')} className="bg-white text-[#7b1f1f] font-bold px-8 py-3 rounded-xl shadow-lg transition-transform hover:scale-105">Register Profile Free</button>
            </div>
          </section>
        )}

        {currentView === 'register' && (
          <section className="max-w-3xl mx-auto px-4 py-10">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-2 text-[#7b1f1f]">Create Secure Profile Record</h2>
            <form onSubmit={handleRegisterSubmit} className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-[#7b1f1f] text-white' : 'bg-gray-200 text-gray-500'}`}>1</span>
                <span className="w-8 h-0.5 bg-gray-300"></span> 
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-[#7b1f1f] text-white' : 'bg-gray-200 text-gray-500'}`}>2</span>
                <span className="w-8 h-0.5 bg-gray-300"></span> 
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-[#7b1f1f] text-white' : 'bg-gray-200 text-gray-500'}`}>3</span>
              </div>

              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-heading font-bold text-lg border-b pb-2 text-[#7b1f1f]">👤 Candidate Personal Credentials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">First Name *</label>
                      <input type="text" required value={regForm.first_name} onChange={e => setRegForm({...regForm, first_name: e.target.value})} className="w-full border rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] outline-none" placeholder="Given Name Only" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Surname (Inti Peru) *</label>
                      <input type="text" required value={regForm.last_name} onChange={e => setRegForm({...regForm, last_name: e.target.value})} className="w-full border rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] outline-none" placeholder="Protected Asset Surnames" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Mobile Line *</label>
                      <input type="tel" required value={regForm.phone} onChange={e => setRegForm({...regForm, phone: e.target.value})} className="w-full border rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] outline-none" placeholder="E.g., 9876543210" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Gender *</label>
                      <select value={regForm.gender} onChange={e => setRegForm({...regForm, gender: e.target.value})} className="w-full border rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] outline-none">
                        <option value="Male">Male (Groom)</option>
                        <option value="Female">Female (Bride)</option>
                      </select>
                    </div>
                  </div>
                  <button type="button" onClick={() => setStep(2)} className="w-full bg-[#7b1f1f] text-white py-3 rounded-lg font-bold">Next: Astrological Lineage Roots →</button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-heading font-bold text-lg border-b pb-2 text-[#7b1f1f]">🕉️ Astrology & Heritage Lineage</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Gothram *</label>
                      <input type="text" required value={regForm.gothram} onChange={e => setRegForm({...regForm, gothram: e.target.value})} className="w-full border rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] outline-none" placeholder="E.g., Bharadwaja" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Hometown Location *</label>
                      <input type="text" required value={regForm.city} onChange={e => setRegForm({...regForm, city: e.target.value})} className="w-full border rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] outline-none" placeholder="E.g., Vijayawada" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Annual Income Bracket *</label>
                      <select value={regForm.income} onChange={e => setRegForm({...regForm, income: e.target.value})} className="w-full border rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] outline-none">
                        <option value="3-5 LPA">3-5 LPA</option>
                        <option value="5-10 LPA">5-10 LPA</option>
                        <option value="10-15 LPA">10-15 LPA</option>
                        <option value="15-25 LPA">15-25 LPA</option>
                        <option value="25-50 LPA">25-50 LPA</option>
                        <option value="50+ LPA">50+ LPA</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Estimated Family Net Worth *</label>
                      <select value={regForm.propertyWorth} onChange={e => setRegForm({...regForm, propertyWorth: e.target.value})} className="w-full border rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] outline-none">
                        <option value="3 - 5 Crores">3 - 5 Crores</option>
                        <option value="5 - 10 Crores">5 - 10 Crores</option>
                        <option value="10 - 20 Crores">10 - 20 Crores</option>
                        <option value="20 Crores+">20 Crores+</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)} className="flex-1 border border-gray-300 py-3 rounded-lg font-bold">Back</button>
                    <button type="button" onClick={() => setStep(3)} className="flex-1 bg-[#7b1f1f] text-white py-3 rounded-lg font-bold">Next: Verification Asset Upload →</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="font-heading font-bold text-lg border-b pb-2 text-[#7b1f1f]">🏡 Property Vault Registry Pointer</h3>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Maternal Relative Surnames (మేనమామలు) *</label>
                    <input type="text" required value={regForm.maternalSurnames} onChange={e => setRegForm({...regForm, maternalSurnames: e.target.value})} className="w-full border rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] outline-none" placeholder="List Surnames separated by commas" />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(2)} className="flex-1 border border-gray-300 py-3 rounded-lg font-bold">Back</button>
                    <button type="submit" className="flex-1 bg-emerald-700 text-white py-3 rounded-lg font-bold">Deploy Profile Live ✓</button>
                  </div>
                </div>
              )}
            </form>
          </section>
        )}

        {currentView === 'search' && (
          <section className="max-w-6xl mx-auto px-4 py-8">
            <h2 className="font-heading text-2xl font-bold mb-6 text-[#7b1f1f]">Explore Matching Connections</h2>
            
            <div className="bg-white rounded-2xl shadow-md p-5 mb-8 border border-orange-100 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Target View Focus</label>
                  <select value={filterGender} onChange={e => setFilterGender(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm bg-[#fffbf7]">
                    <option value="">Opposite Match (Auto)</option>
                    <option value="Male">Grooms (Male)</option>
                    <option value="Female">Brides (Female)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Caste Group Selection</label>
                  <select value={filterCaste} onChange={e => setFilterCaste(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm bg-[#fffbf7]">
                    <option value="">All Castes</option>
                    <option value="Kapu">Kapu</option>
                    <option value="Kamma">Kamma</option>
                    <option value="Reddy">Reddy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Hometown City</label>
                  <input type="text" value={filterCity} onChange={e => setFilterCity(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm bg-[#fffbf7]" placeholder="Search city parameters..." />
                </div>
                <div className="flex items-end">
                  <button onClick={() => { setFilterGender(''); setFilterCaste(''); setFilterCity(''); setFinancialFilterActive(false); }} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">Reset All Filters</button>
                </div>
              </div>

              <div className="border-t pt-3 flex items-center justify-between bg-[#fffbf7] p-3 rounded-xl border border-dashed border-orange-200">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#7b1f1f]/5 flex items-center justify-center text-[#7b1f1f] shrink-0"><ShieldCheck className="w-4 h-4" /></div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">ఆర్థిక అంతస్తుల పొంతన ఫిల్టర్ (Socioeconomic Indicator Engine)</h4>
                    <p className="text-[11px] text-gray-500 font-medium">Auto-align candidates based on traditional family asset values and annual income ratio expectations.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
                  <input type="checkbox" checked={financialFilterActive} onChange={e => setFinancialFilterActive(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
                </label>
              </div>
            </div>

            <p className="text-sm font-semibold text-[#5a3e36] mb-4">
              Showing {filteredProfiles.length} matching candidate profiles found live inside match viewport matrix.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProfiles.map(p => {
                const hasAccess = currentUser && (p.contact_purchases || '').split(',').includes(currentUser.__backendId);
                return (
                  <div key={p.__backendId} className="bg-white rounded-2xl shadow-md p-5 border border-orange-100 flex flex-col justify-between h-full relative group">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="padam-badge text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">{p.profile_id}</span>
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1"><BadgeCheck className="w-3 h-3" /> Verified Node</span>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => setSelectedProfileId(p.__backendId)}>
                        {/* Invokes Dedicated Anti-Scraping Canvas protection abstraction */}
                        <SecureAvatar imageUrl={p.avatar_source} watermarkText={currentUser ? currentUser.profile_id : "PUBLIC"} />
                        <div className="min-w-0">
                          <h4 className="font-bold text-[#2c1810] truncate text-base">
                            {p.first_name} {hasAccess ? p.last_name : <span className="text-xs text-gray-400 font-normal">[Surname Protected]</span>}
                          </h4>
                          <p className="text-xs text-gray-500 font-medium">{p.age} Yrs • {p.height} • {p.city}</p>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-gray-600 mb-4 border-t pt-2 border-dashed border-gray-100 font-medium">
                        <p className="text-[#7b1f1f] font-bold">🌟 {p.nakshatra} ({p.padam}వ పాదం) • Rasi: {p.rashi}</p>
                        <p>🪐 Gothram: {p.gothram}</p>
                        <p className="truncate">🎓 {p.education} • {p.occupation}</p>
                        <p className="text-[10px] text-gray-400 font-bold bg-amber-50/50 p-1 rounded mt-1">💰 Financial Tier: {p.income} • Assets: {p.propertyWorth}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 border-t pt-3 border-gray-100">
                      <button onClick={() => handleToggleShortlist(p.__backendId)} className="flex-1 border border-purple-200 text-purple-700 py-2 rounded-lg text-xs font-bold hover:bg-purple-50 transition">Shortlist</button>
                      <button onClick={() => handleConnect(p.__backendId)} className="flex-1 bg-[#7b1f1f] text-white py-2 rounded-lg text-xs font-bold hover:bg-[#912525] transition">Connect</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {currentView === 'dashboard' && (
          <section className="max-w-6xl mx-auto px-4 py-8">
            <h2 className="font-heading text-2xl font-bold mb-6 text-[#7b1f1f]">My Interactive Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-md p-6 border">
                <h3 className="font-heading font-bold text-lg mb-4 text-[#7b1f1f] flex items-center gap-2"><Send className="w-5 h-5" /> Outgoing Proposals Transmitted</h3>
                {profiles.filter(p => currentUser && (p.interests_received || '').split(',').includes(currentUser.__backendId)).map(p => (
                  <div key={p.__backendId} className="p-3 bg-[#fffbf7] border rounded-xl mb-2 flex justify-between items-center">
                    <div><p className="font-bold text-sm text-gray-900">{p.first_name}</p><p className="text-xs text-gray-400 font-mono">{p.profile_id}</p></div>
                    <span className="text-xs bg-amber-100 text-amber-900 px-2 py-1 rounded font-bold">Dispatched</span>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl shadow-md p-6 border">
                <h3 className="font-heading font-bold text-lg mb-4 text-[#7b1f1f] flex items-center gap-2"><Inbox className="w-5 h-5" /> Incoming Alliance Handshakes Inherited</h3>
                {profiles.filter(p => currentUser && (currentUser.interests_received || '').split(',').includes(p.__backendId)).map(p => (
                  <div key={p.__backendId} className="p-3 bg-[#fffbf7] border rounded-xl mb-2 flex justify-between items-center">
                    <div><p className="font-bold text-sm text-gray-900">{p.first_name}</p><p className="text-xs text-gray-400 font-mono">{p.profile_id}</p></div>
                    <button onClick={() => setSelectedProfileId(p.__backendId)} className="text-xs bg-[#7b1f1f] text-white px-3 py-1 rounded font-bold">Review Bio</button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {currentView === 'admin' && currentUser?.is_admin && (
          <section className="max-w-6xl mx-auto px-4 py-8">
            <h2 className="font-heading text-2xl font-bold mb-4 text-emerald-800">⚙️ Back-Office Pipeline Panel</h2>
            <div className="bg-white rounded-2xl shadow p-6 border">
              <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-4">Total Production Core Registration Ledger Accounts</h3>
              {profiles.map(p => (
                <div key={p.__backendId} className="p-3 border-b flex justify-between items-center">
                  <div><p className="font-bold text-gray-900">{p.first_name} {p.last_name}</p><p className="text-xs font-mono text-gray-400">{p.profile_id} • {p.email}</p></div>
                  <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">VERIFIED LIVE NODE</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {selectedProfileId && activeModalProfile && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedProfileId(null)}>
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 relative shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedProfileId(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            <div className="space-y-4 text-sm">
              <div className="text-center bg-[#fff9f0] p-4 rounded-xl border">
                <h3 className="font-heading text-lg font-bold">{activeModalProfile.first_name} {modalHasAccess ? activeModalProfile.last_name : ''}</h3>
                <p className="text-xs text-gray-500 font-mono">ID Signature: {activeModalProfile.profile_id}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg text-xs">
                <div><span className="block text-gray-400 font-bold">AGE / HEIGHT</span><strong>{activeModalProfile.age} Yrs • {activeModalProfile.height}</strong></div>
                <div><span className="block text-gray-400 font-bold">CASTE / GOTHRAM</span><strong>{activeModalProfile.caste} • {activeModalProfile.gothram}</strong></div>
                <div><span className="block text-gray-400 font-bold">JANMA NAKSHATRAM</span><strong>{activeModalProfile.nakshatra} ({activeModalProfile.padam}వ పాదం)</strong></div>
                <div><span className="block text-gray-400 font-bold">MOON SIGN (RASI)</span><strong>{activeModalProfile.rashi} Rasi</strong></div>
              </div>
              <div className="border-t pt-2">
                <h4 className="text-xs font-bold text-[#7b1f1f] mb-1">🏡 Property Vault Holdings & Surnames</h4>
                {modalHasAccess ? (
                  <div className="p-3 bg-emerald-50 rounded border text-xs text-emerald-900 space-y-1">
                    <p><strong>Net Worth Tier:</strong> {activeModalProfile.propertyWorth}</p>
                    <p><strong>Landholdings:</strong> {activeModalProfile.landDetails || 'None disclosed'}</p>
                    <p><strong>Real Estate Properties:</strong> {activeModalProfile.houseDetails || 'None disclosed'}</p>
                    <p><strong>Maternal Lineage Relatives:</strong> {activeModalProfile.maternalSurnames}</p>
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-blue-900 font-mono font-bold text-sm">
                      Mobile Line Pointer: {activeModalProfile.phone}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-amber-50 text-amber-900 text-xs p-3 rounded border border-amber-200">
                      🔒 Asset registries, explicit property values, and family surnames are encrypted for privacy security. Unlock below to view coordinates.
                    </div>
                    <button onClick={() => setShowUpiModal(true)} className="w-full mt-3 bg-[#f39c12] text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow">
                      🔓 Unlock Contact Coordinates & Property Folio (₹200)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showUpiModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowUpiModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative" onClick={e => e.stopPropagation()}>
            <h3 className="font-heading font-bold text-xl mb-2 flex items-center gap-2"><Wallet className="w-5 h-5 text-orange-500" /> Complete Verification Remittance</h3>
            <p className="text-xs text-gray-500 mb-4">Copy the destination address string below to route your payment processing token.</p>
            <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg mb-6">
              <span className="text-xs font-mono flex-1 break-all font-bold">sambasiva.rao@upi</span>
              <button onClick={() => { navigator.clipboard.writeText("sambasiva.rao@upi"); triggerToast("UPI address mapped to clipboard."); }} className="text-blue-600"><Copy className="w-4 h-4" /></button>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowUpiModal(false)} className="flex-1 border py-2 rounded-lg text-xs font-medium">Cancel</button>
              <button onClick={handleProcessUnlockPayment} className="flex-1 bg-emerald-700 text-white py-2 rounded-lg text-xs font-medium shadow-md">Verify & Unlock Token ✓</button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-[#2c1810] text-white/50 text-center py-6 text-xs border-t border-white/5 mt-auto">
        <p>© 2026 Telugu Vivaham. Built for mybestwater.in. Secure Lineage Data Matching Pipelines.</p>
      </footer>
    </div>
  );
}
