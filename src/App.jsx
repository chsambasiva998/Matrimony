import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ShieldCheck, Lock, Eye, Heart, Send, Inbox, 
  Wallet, X, Copy, Menu, BadgeCheck, Search, 
  User, MapPin, Award, FileText, Upload, LockKeyhole, Clock, ThumbsUp, Users
} from 'lucide-react';

// Static Configuration Maps for Parity Matching
const INCOME_MAP = { '3-5 LPA': 1, '5-10 LPA': 2, '10-15 LPA': 3, '15-25 LPA': 4, '25-50 LPA': 5, '50+ LPA': 6 };
const ASSET_MAP = { 'No Assets': 0, 'Below 50 Lakhs': 1, '50 Lakhs - 1 Crore': 2, '1 - 3 Crores': 3, '3 - 5 Crores': 4, '5 - 10 Crores': 5, '10 - 20 Crores': 6, '20 Crores+': 7 };

const INITIAL_DATABASE_NODES = [
  {
    __backendId: "seed_groom_anand",
    profile_id: "PP10001",
    first_name: "Anand Kumar",
    last_name: "Yellapragada",
    age: 28,
    gender: "Male",
    marital_status: "Never Married",
    height: "5'10\"",
    education: "M.Tech (IIT Madras)",
    occupation: "Senior Principal Engineer",
    income: "25-50 LPA",
    city: "Hyderabad",
    caste: "Kapu",
    sub_caste: "Telaga",
    gothram: "Srivatsa",
    rashi: "Mesha",
    padam: "1",
    kujaDosham: "No (లేదు)",
    nakshatra: "Ashwini",
    fatherName: "Srinivasa Rao",
    motherName: "Radha Kumari",
    maternalSurnames: "Chavali, Nidadavole",
    propertyWorth: "5 - 10 Crores",
    landDetails: "2.5 Acres near Vijayawada",
    phone: "+91 94901 23456",
    about: "Balancing software innovation with classical music values.",
    profile_status: "approved",
    interests_received: "",
    contact_purchases: "",
    payment_verification_requested: false,
    payment_request_by: "",
    caste_preference_tier: "same_caste",
    avatar_source: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
  },
  {
    __backendId: "seed_bride_priya",
    profile_id: "PP20001",
    first_name: "Sai Priya",
    last_name: "Mamidipudi",
    age: 25,
    gender: "Female",
    marital_status: "Never Married",
    height: "5'4\"",
    education: "MBA (ISB Hyderabad)",
    occupation: "Financial Management Consultant",
    income: "15-25 LPA",
    city: "Visakhapatnam",
    caste: "Kapu",
    sub_caste: "Telaga",
    gothram: "Kaundinya",
    rashi: "Kanya",
    padam: "2",
    kujaDosham: "No (లేదు)",
    nakshatra: "Hasta",
    fatherName: "Satyanarayana Murthy",
    motherName: "Lakshmi Prasanna",
    maternalSurnames: "Ganti, Vinnakota",
    propertyWorth: "10 - 20 Crores",
    landDetails: "Commercial layout assets in Vizag",
    phone: "+91 98480 98765",
    about: "Cultured professional passionate about traditional arts.",
    profile_status: "approved",
    interests_received: "seed_groom_anand",
    contact_purchases: "",
    payment_verification_requested: false,
    payment_request_by: "",
    caste_preference_tier: "open",
    avatar_source: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
  }
];

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
      ctx.save();
      ctx.rotate(-25 * Math.PI / 180);
      ctx.font = "bold 8px DM Sans";
      ctx.fillStyle = "rgba(123, 31, 31, 0.45)";
      ctx.fillText(watermarkText, -15, 60);
      ctx.fillText("P-PUSTHAKAM", -15, 75);
      ctx.restore();
    };
  }, [imageUrl, watermarkText]);

  return <canvas ref={canvasRef} width="120" height="120" className="w-12 h-12 rounded-xl border border-[#d4a017]/30 bg-orange-50 shrink-0 select-none pointer-events-none" />;
}

export default function App() {
  // Fix 1: Lazy State Initialization pattern prevents state parsing mismatch errors on load
  const [profiles, setProfiles] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tv_production_engine_data');
      if (saved) return JSON.parse(saved);
    }
    return INITIAL_DATABASE_NODES;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const activeToken = localStorage.getItem('tv_active_session_token');
      if (activeToken) {
        const found = profiles.find(p => p.__backendId === activeToken);
        if (found) return found;
      }
    }
    return INITIAL_DATABASE_NODES[0];
  });

  const [currentView, setCurrentView] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [toastMessage, setToastMessage] = useState('');
  
  // Filtering Logic states
  const [filterCity, setFilterCity] = useState('');
  const [financialFilterActive, setFinancialFilterActive] = useState(true);
  const [castePreferenceTier, setCastePreferenceTier] = useState(() => currentUser?.caste_preference_tier || 'same_caste');

  // Modals management references
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [aadharInput, setAadharInput] = useState('');
  const [aadharAttached, setAadharAttached] = useState(false);
  const [screenshotAttached, setScreenshotAttached] = useState(false);

  // Registration Form State Data Map
  const [regForm, setRegForm] = useState({
    first_name: '', last_name: '', email: '', phone: '', age: 26, gender: 'Male',
    marital_status: 'Never Married', height: "5'8\"", bloodGroup: 'O+', caste: 'Kapu', sub_caste: '',
    gothram: '', nakshatra: 'Ashwini', padam: '1', rashi: 'Mesha', kujaDosham: 'No (లేదు)',
    education: '', occupation: '', income: '10-15 LPA', city: '', diet: 'Vegetarian',
    physicalStatus: 'Normal Status', fatherName: '', motherName: '', maternalSurnames: '',
    propertyWorth: '3 - 5 Crores', landDetails: '', houseDetails: '', abroadStatus: 'Open to both', 
    about: '', caste_preference_tier: 'same_caste', avatar_source: ''
  });

  const triggerToast = (msg) => setToastMessage(msg);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(''), 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const syncStateUpdate = (updatedSet) => {
    localStorage.setItem('tv_production_engine_data', JSON.stringify(updatedSet));
    setProfiles(updatedSet);
    if (currentUser) {
      const reMatch = updatedSet.find(p => p.__backendId === currentUser.__backendId);
      if (reMatch) {
        setCurrentUser(reMatch);
        setCastePreferenceTier(reMatch.caste_preference_tier || 'same_caste');
      }
    }
  };

  const handleSessionToggle = (id) => {
    localStorage.setItem('tv_active_session_token', id);
    const match = profiles.find(p => p.__backendId === id);
    if (match) {
      setCurrentUser(match);
      setCastePreferenceTier(match.caste_preference_tier || 'same_caste');
      triggerToast(`Swapped view context to: ${match.first_name}`);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!aadharAttached || !aadharInput) {
      triggerToast("❌ Security Error: Aadhaar verification files missing.");
      return;
    }
    const payload = {
      ...regForm,
      __backendId: "user_runtime_" + Date.now(),
      profile_id: "PP" + Math.floor(10000 + Math.random() * 90000),
      profile_status: "pending", 
      interests_received: "", shortlisted: "", contact_purchases: "",
      payment_verification_requested: false, payment_request_by: "",
      avatar_source: regForm.gender === 'Male' 
        ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" 
        : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
    };
    syncStateUpdate([...profiles, payload]);
    triggerToast("🔱 Profile logged into secure review storage database.");
    setStep(1);
    setAadharInput('');
    setAadharAttached(false);
    setCurrentView('home');
  };

  const handleConnectProposal = (id) => {
    if (!currentUser) return;
    const nextSet = profiles.map(p => {
      if (p.__backendId === id) {
        let rec = (p.interests_received || '').split(',').filter(Boolean);
        if (!rec.includes(currentUser.__backendId)) rec.push(currentUser.__backendId);
        return { ...p, interests_received: rec.join(',') };
      }
      return p;
    });
    syncStateUpdate(nextSet);
    triggerToast("🔱 Holy alliance invitation dispatched successfully.");
  };

  const handleRequestUnlockVerification = () => {
    if (!screenshotAttached) {
      triggerToast("❌ Remittance transaction verification screenshot required.");
      return;
    }
    const nextSet = profiles.map(p => {
      if (p.__backendId === selectedProfileId) {
        return { ...p, payment_verification_requested: true, payment_request_by: currentUser.__backendId };
      }
      return p;
    });
    syncStateUpdate(nextSet);
    setShowUpiModal(false);
    setScreenshotAttached(false);
    setSelectedProfileId(null);
    triggerToast("📧 Snapshot routed! Awaiting manual admin statement verification check.");
  };

  const handleAdminApproveProfile = (backendId) => {
    const nextSet = profiles.map(p => p.__backendId === backendId ? { ...p, profile_status: "approved" } : p);
    syncStateUpdate(nextSet);
    triggerToast("✓ Profile authorized and published to search feed live indices.");
  };

  const handleAdminApprovePayment = (targetProfile) => {
    const nextSet = profiles.map(p => {
      if (p.__backendId === targetProfile.__backendId) {
        let cp = (p.contact_purchases || '').split(',').filter(Boolean);
        if (!cp.includes(targetProfile.payment_request_by)) cp.push(targetProfile.payment_request_by);
        return { ...p, payment_verification_requested: false, payment_request_by: "", contact_purchases: cp.join(',') };
      }
      return p;
    });
    syncStateUpdate(nextSet);
    triggerToast("✓ Credit matched successfully! Credentials permanently decrypted.");
  };

  const updateCastePreference = (tier) => {
    setCastePreferenceTier(tier);
    const nextSet = profiles.map(p => p.__backendId === currentUser.__backendId ? { ...p, caste_preference_tier: tier } : p);
    syncStateUpdate(nextSet);
    triggerToast(`Alignment altered: ${tier === 'same_caste' ? 'Strict Caste' : tier === 'sub_caste' ? 'Sub-Caste' : 'Open'}`);
  };

  const computedTargetGender = useMemo(() => {
    if (!currentUser) return 'Female';
    return currentUser.gender === 'Male' ? 'Female' : 'Male';
  }, [currentUser]);

  // Fix 3: Sanitized String Analysis prevents typos from deadlocking the match engine
  const filteredProfiles = useMemo(() => {
    if (!currentUser) return [];
    return profiles.filter(profile => {
      if (profile.profile_status !== "approved") return false;
      if (profile.__backendId === currentUser.__backendId) return false;
      if (profile.gender !== computedTargetGender) return false;
      if (filterCity && !(profile.city || '').toLowerCase().includes(filterCity.toLowerCase())) return false;

      if (currentUser.gothram && profile.gothram) {
        if (currentUser.gothram.trim().toLowerCase() === profile.gothram.trim().toLowerCase()) return false;
      }

      if (currentUser.caste) {
        const cleanUserCaste = currentUser.caste.trim().toLowerCase();
        const cleanProfileCaste = profile.caste.trim().toLowerCase();
        
        if (castePreferenceTier === 'same_caste') {
          if (cleanProfileCaste !== cleanUserCaste) return false;
        } else if (castePreferenceTier === 'sub_caste') {
          if (cleanProfileCaste !== cleanUserCaste) return false;
          const cleanUserSub = (currentUser.sub_caste || '').trim().toLowerCase();
          const cleanProfileSub = (profile.sub_caste || '').trim().toLowerCase();
          if (cleanUserSub && cleanProfileSub && cleanUserSub !== cleanProfileSub) return false;
        }
      }

      if (financialFilterActive) {
        const myIncomeRank = INCOME_MAP[currentUser.income] || 1;
        const matchIncomeRank = INCOME_MAP[profile.income] || 1;
        const myAssetRank = ASSET_MAP[currentUser.propertyWorth] || 1;
        const matchAssetRank = ASSET_MAP[profile.propertyWorth] || 1;

        if (currentUser.gender === 'Female') {
          if (matchIncomeRank < myIncomeRank || matchAssetRank < myAssetRank) return false;
        } else {
          if (matchIncomeRank > myIncomeRank || matchAssetRank > (myAssetRank + 1)) return false;
        }
      }
      return true;
    });
  }, [profiles, currentUser, computedTargetGender, filterCity, financialFilterActive, castePreferenceTier]);

  const activeModalProfile = useMemo(() => profiles.find(p => p.__backendId === selectedProfileId), [profiles, selectedProfileId]);
  const modalHasAccess = currentUser && activeModalProfile && (activeModalProfile.contact_purchases || '').split(',').includes(currentUser.__backendId);

  return (
    <div className="w-full min-h-screen bg-[#FFFDF6] text-[#2c1810] flex flex-col font-serif">
      <div className="h-2.5 w-full bg-gradient-to-r from-[#7b1f1f] via-[#d4a017] to-[#7b1f1f]"></div>

      <nav className="w-full bg-white shadow-md sticky top-0 z-40 border-b border-[#d4a017]/20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="w-10 h-10 bg-[#7b1f1f] rounded-xl flex items-center justify-center text-white font-bold text-xl">మ</div>
            <div>
              <span className="block font-bold text-2xl text-[#7b1f1f] leading-none">పెళ్ళి పుస్తకం</span>
              <span className="text-[9px] font-sans font-bold tracking-widest text-[#d4a017] uppercase block mt-1">Premium Telugu Matrimony</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#7b1f1f]/5 border border-[#7b1f1f]/20 rounded-xl px-3 py-1">
            <span className="text-[10px] font-sans font-bold text-[#7b1f1f] uppercase tracking-wide">Simulation Role:</span>
            <select value={currentUser?.__backendId || ''} onChange={(e) => handleSessionToggle(e.target.value)} className="bg-transparent text-xs font-bold text-gray-800 focus:outline-none max-w-[130px] truncate font-sans">
              {profiles.map(p => <option key={p.__backendId} value={p.__backendId}>{p.first_name} ({p.gender === 'Male' ? 'Varudu' : 'Vadhuvu'})</option>)}
            </select>
          </div>

          <div className="hidden md:flex items-center gap-6 font-sans text-xs font-bold uppercase tracking-wider text-[#5a3e36]">
            <button onClick={() => setCurrentView('home')} className="hover:text-[#7b1f1f]">Home</button>
            <button onClick={() => setCurrentView('search')} className="hover:text-[#7b1f1f]">Find Alliances</button>
            <button onClick={() => setCurrentView('dashboard')} className="hover:text-[#7b1f1f]">My Ledger</button>
            {currentUser?.is_admin && <button onClick={() => setCurrentView('admin')} className="text-emerald-700 font-extrabold tracking-widest">Admin Panel ⚙️</button>}
            <button onClick={() => setCurrentView('register')} className="bg-[#7b1f1f] text-white px-4 py-2.5 rounded-xl border">Register</button>
          </div>
        </div>
      </nav>

      <div className="w-full bg-[#7b1f1f] text-[#FFF4D4] py-2 px-4 text-center text-xs tracking-widest border-b border-[#d4a017]/40 shadow-sm">
        Kalyanam... Kamaneeyam... Jeevitham...
      </div>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
        {currentView === 'home' && (
          <section className="w-full py-6 text-center space-y-6 animate-fadeIn">
            <div className="rounded-3xl bg-gradient-to-br from-[#4a0d0d] via-[#7b1f1f] to-[#2b0505] p-8 md:p-16 border-2 border-[#d4a017]/30 shadow-2xl relative text-white">
              <div className="absolute inset-3 border border-[#d4a017]/20 rounded-2xl pointer-events-none"></div>
              <h1 className="text-5xl md:text-7xl font-bold text-[#FFF4D4]">పెళ్ళి పుస్తకం</h1>
              <p className="text-sm font-sans tracking-wide max-w-xl mx-auto text-gray-200 mt-2">Elite South-Indian matrix aligning three-tier caste affinities, mutual expectations, and verified Aadhaar nodes.</p>
              <div className="pt-6 flex justify-center gap-4 font-sans text-xs font-bold uppercase tracking-wider">
                <button onClick={() => setCurrentView('search')} className="bg-[#d4a017] text-[#3a0a0a] px-6 py-3 rounded-xl shadow-md">Enter Search Feed</button>
                <button onClick={() => setCurrentView('register')} className="border border-white/40 text-white px-6 py-3 rounded-xl">Register Profile</button>
              </div>
            </div>
          </section>
        )}

        {currentView === 'register' && (
          <section className="max-w-2xl mx-auto py-4">
            <h2 className="text-2xl font-bold text-[#7b1f1f] text-center mb-6">Create Verified Family Record</h2>
            <form onSubmit={handleRegisterSubmit} className="bg-white rounded-2xl shadow-xl border border-[#d4a017]/20 p-6 md:p-8 space-y-6 relative">
              <div className="flex items-center justify-center gap-2 max-w-xs mx-auto mb-4 font-sans text-[10px] font-bold">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-[#7b1f1f] text-white' : 'bg-gray-100 text-gray-400'}`}>1</span>
                <span className="h-0.5 w-6 bg-gray-200"></span>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-[#7b1f1f] text-white' : 'bg-gray-100 text-gray-400'}`}>2</span>
                <span className="h-0.5 w-6 bg-gray-200"></span>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-[#7b1f1f] text-white' : 'bg-gray-100 text-gray-400'}`}>3</span>
              </div>

              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg border-b pb-1.5 text-[#7b1f1f]">Step 1: Identity Parameters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs font-bold text-gray-500">
                    <div>First Name *<input type="text" required value={regForm.first_name} onChange={e => setRegForm({...regForm, first_name: e.target.value})} className="w-full mt-1 border rounded-xl p-3 font-normal text-sm text-gray-800" placeholder="Given Name Only" /></div>
                    <div>Surname (Inti Peru) *<input type="text" required value={regForm.last_name} onChange={e => setRegForm({...regForm, last_name: e.target.value})} className="w-full mt-1 border rounded-xl p-3 font-normal text-sm text-gray-800" placeholder="Masked publicly" /></div>
                    <div>Gender Role *
                      <select value={regForm.gender} onChange={e => setRegForm({...regForm, gender: e.target.value})} className="w-full mt-1 border rounded-xl p-3 text-sm font-normal text-gray-800">
                        <option value="Male">Male (Varudu / Groom)</option>
                        <option value="Female">Female (Vadhuvu / Bride)</option>
                      </select>
                    </div>
                    <div>Mobile number *<input type="tel" required value={regForm.phone} onChange={e => setRegForm({...regForm, phone: e.target.value})} className="w-full mt-1 border rounded-xl p-3 font-normal text-sm text-gray-800" placeholder="E.g., 98480..." /></div>
                  </div>
                  <button type="button" onClick={() => setStep(2)} className="w-full bg-[#7b1f1f] text-white py-3 rounded-xl font-sans text-xs font-bold uppercase tracking-wider">Next Step: Lineage Preferences →</button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg border-b pb-1.5 text-[#7b1f1f]">Step 2: Lineage Heritage & Caste Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs font-bold text-gray-500">
                    <div>Caste Classification *
                      <select value={regForm.caste} onChange={e => setRegForm({...regForm, caste: e.target.value})} className="w-full mt-1 border rounded-xl p-3 text-sm font-normal text-gray-800">
                        <option value="Kapu">Kapu</option><option value="Kamma">Kamma</option><option value="Reddy">Reddy</option><option value="Brahmin">Brahmin</option>
                      </select>
                    </div>
                    <div>Sub-Caste Subdivision (ఉపకులం) *<input type="text" required value={regForm.sub_caste} onChange={e => setRegForm({...regForm, sub_caste: e.target.value})} className="w-full mt-1 border rounded-xl p-3 font-normal text-sm text-gray-800" placeholder="E.g., Telaga / Balija" /></div>
                    <div>Gothram Name *<input type="text" required value={regForm.gothram} onChange={e => setRegForm({...regForm, gothram: e.target.value})} className="w-full mt-1 border rounded-xl p-3 font-normal text-sm text-gray-800" /></div>
                    <div>Janma Nakshatram *<input type="text" required value={regForm.nakshatra} onChange={e => setRegForm({...regForm, nakshatra: e.target.value})} className="w-full mt-1 border rounded-xl p-3 font-normal text-sm text-gray-800" /></div>
                    <div>Hometown Location *<input type="text" required value={regForm.city} onChange={e => setRegForm({...regForm, city: e.target.value})} className="w-full mt-1 border rounded-xl p-3 font-normal text-sm text-gray-800" /></div>
                    <div>Income *
                      <select value={regForm.income} onChange={e => setRegForm({...regForm, income: e.target.value})} className="w-full mt-1 border rounded-xl p-3 text-sm font-normal text-gray-800">
                        <option value="10-15 LPA">10-15 LPA</option><option value="15-25 LPA">15-25 LPA</option><option value="25-50 LPA">25-50 LPA</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 font-sans">
                    <button type="button" onClick={() => setStep(1)} className="flex-1 border py-3 rounded-xl font-bold text-xs uppercase tracking-wider">Back</button>
                    <button type="button" onClick={() => setStep(3)} className="flex-1 bg-[#7b1f1f] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider">Next Step →</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg border-b pb-1.5 text-[#7b1f1f]">Step 3: Identity Verification Vault</h3>
                  <div className="p-4 bg-amber-50/60 border-2 border-dashed border-[#d4a017]/30 rounded-xl space-y-3 font-sans">
                    <p className="text-xs font-bold text-[#7b1f1f] uppercase tracking-wider">🔒 Government ID Authentication Sandbox Guard</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input type="password" maxLength={12} required value={aadharInput} onChange={e => setAadharInput(e.target.value.replace(/\D/g,''))} className="border rounded-xl p-2.5 text-xs font-mono tracking-widest bg-white" placeholder="Enter 12-Digit ID Number" />
                      <label className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-xl px-4 py-2 text-xs font-bold cursor-pointer hover:bg-gray-50">
                        <Upload className="w-4 h-4 text-gray-500" />
                        <span>{aadharAttached ? "✓ Document Attached" : "Upload ID File (.jpg/.pdf)"}</span>
                        <input type="file" required onChange={() => setAadharAttached(true)} className="hidden" />
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs font-bold text-gray-500">
                    <div>Maternal Family Surnames *<input type="text" required value={regForm.maternalSurnames} onChange={e => setRegForm({...regForm, maternalSurnames: e.target.value})} className="w-full mt-1 border rounded-xl p-3 font-normal text-sm text-gray-800" placeholder="మేనమామలు" /></div>
                  </div>
                  <div className="flex gap-3 font-sans">
                    <button type="button" onClick={() => setStep(2)} className="flex-1 border border-gray-300 py-3 rounded-xl font-bold text-xs uppercase tracking-wider">Back</button>
                    <button type="submit" className="flex-1 bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md">Complete Registration ✓</button>
                  </div>
                </div>
              )}
            </form>
          </section>
        )}

        {currentView === 'search' && (
          <section className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-xl border border-[#d4a017]/20 p-5 space-y-4 relative">
              <div className="absolute top-0 inset-x-0 h-1 bg-[#7b1f1f]"></div>
              
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 font-sans">
                <div>
                  <h4 className="text-sm font-bold text-gray-800 uppercase tracking-tight flex items-center gap-1.5"><Users className="w-4 h-4 text-[#7b1f1f]" /> కుల ప్రాధాన్యత అమరిక (Caste Affinity Matrix Options)</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Filter matches strictly based on traditional sub-sect guidelines.</p>
                </div>
                
                <div className="grid grid-cols-3 bg-gray-100 p-1 rounded-xl text-xs font-bold w-full lg:w-auto text-center border">
                  <button onClick={() => updateCastePreference('same_caste')} className={`px-4 py-2 rounded-lg transition-all ${castePreferenceTier === 'same_caste' ? 'bg-[#7b1f1f] text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}>Strict Caste Only</button>
                  <button onClick={() => updateCastePreference('sub_caste')} className={`px-4 py-2 rounded-lg transition-all ${castePreferenceTier === 'sub_caste' ? 'bg-[#7b1f1f] text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}>Same Sub-Caste</button>
                  <button onClick={() => updateCastePreference('open')} className={`px-4 py-2 rounded-lg transition-all ${castePreferenceTier === 'open' ? 'bg-[#7b1f1f] text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}>Caste No Bar (General)</button>
                </div>
              </div>

              <div className="border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Filter Region / City</label>
                  <input type="text" value={filterCity} onChange={e => setFilterCity(e.target.value)} className="w-full border rounded-xl px-3 py-2 text-xs bg-[#FFFDF9] outline-none" placeholder="Search city parameters..." />
                </div>
                <div className="flex items-center justify-between bg-[#FFFDF2] p-2 rounded-xl border border-dashed border-[#d4a017]/30 mt-5">
                  <span className="text-[11px] font-bold text-gray-700 pl-2">ఆంతస్తుల పొంతన ఫిల్టర్ (Socioeconomic Engine)</span>
                  <div onClick={() => setFinancialFilterActive(!financialFilterActive)} className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${financialFilterActive ? 'bg-[#7b1f1f]' : 'bg-gray-300'}`}>
                    <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${financialFilterActive ? 'right-0.5' : 'left-0.5'}`}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map(p => {
                const hasAccess = currentUser && (p.contact_purchases || '').split(',').includes(currentUser.__backendId);
                return (
                  <div key={p.__backendId} className="bg-white rounded-2xl shadow-md border border-[#d4a017]/15 overflow-hidden flex flex-col justify-between h-full hover:shadow-xl transition-shadow group">
                    <div className="p-5">
                      <div className="flex justify-between items-center mb-3">
                        <span className="bg-[#7b1f1f]/5 text-[#7b1f1f] text-[10px] font-bold px-2 py-0.5 rounded border font-mono">{p.profile_id}</span>
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-100">✓ Aadhaar Verified</span>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => setSelectedProfileId(p.__backendId)}>
                        <SecureAvatar imageUrl={p.avatar_source} watermarkText={currentUser ? currentUser.profile_id : "PUBLIC"} />
                        <div className="min-w-0">
                          <h4 className="font-bold text-base text-gray-900 truncate group-hover:text-[#7b1f1f] transition-colors">{p.first_name} {hasAccess ? p.last_name : <span className="text-xs text-gray-400 font-sans font-normal block">[Surname Hidden]</span>}</h4>
                          <p className="text-xs text-gray-500 font-sans font-medium mt-0.5"><MapPin className="w-3.5 h-3.5 inline mr-0.5 text-gray-400" />{p.city} • {p.age} Yrs</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs font-medium text-gray-600">
                        <div className="bg-[#FFFDF2] border border-[#d4a017]/30 rounded-lg p-2.5 text-[#7b1f1f] font-serif font-bold">
                          🌟 Caste: {p.caste} (${p.sub_caste || 'General'}) • Gothram: {p.gothram}
                        </div>
                        <div className="bg-gray-50 p-2 rounded-lg text-[#7b1f1f] font-bold border font-sans text-[11px]">
                          📜 Horoscope: {p.nakshatra} ({p.padam}వ పాదం) • Rasi: {p.rashi} Sign
                        </div>
                        <p className="truncate font-sans text-gray-500"><Award className="w-4 h-4 inline mr-1 text-gray-400" />{p.education}</p>
                        <div className="text-[9px] font-sans font-bold text-gray-400 uppercase tracking-tight">Income Tier: {p.income} • Assets: {p.propertyWorth}</div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 border-t flex gap-2 font-sans">
                      <button onClick={() => triggerToast("Shortlist state cached.")} className="flex-1 bg-white border text-gray-700 py-2 rounded-xl text-xs font-bold uppercase">Shortlist</button>
                      <button onClick={() => handleConnectProposal(p.__backendId)} className="flex-1 bg-[#7b1f1f] text-white py-2 rounded-xl text-xs font-bold uppercase">Connect</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {currentView === 'dashboard' && (
          <section className="py-4 animate-fadeIn space-y-6">
            <h2 className="text-3xl font-bold text-center text-[#7b1f1f]">My Interaction Ledger</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
              <div className="bg-white p-5 rounded-2xl border shadow-xl">
                <h3 className="font-serif font-bold text-base text-[#7b1f1f] mb-3 flex items-center gap-2"><Send className="w-4 h-4" /> Sent Alliance Invitations</h3>
                {profiles.filter(p => currentUser && (p.interests_received || '').split(',').includes(currentUser.__backendId)).map(p => (
                  <div key={p.__backendId} className="p-3 bg-gray-50 border rounded-xl mb-2 flex justify-between items-center text-xs">
                    <div><p className="font-bold text-gray-900">{p.first_name}</p><span className="font-mono text-gray-400">{p.profile_id}</span></div>
                    <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 font-bold rounded uppercase">Transmitted</span>
                  </div>
                ))}
              </div>
              <div className="bg-white p-5 rounded-2xl border shadow-xl">
                <h3 className="font-serif font-bold text-base text-[#7b1f1f] mb-3 flex items-center gap-2"><Inbox className="w-4 h-4" /> Received Alliance Inbound Proposals</h3>
                {profiles.filter(p => currentUser && (currentUser.interests_received || '').split(',').includes(p.__backendId)).map(p => (
                  <div key={p.__backendId} className="p-3 bg-gray-50 border rounded-xl mb-2 flex justify-between items-center text-xs">
                    <div><p className="font-bold text-gray-900">{p.first_name}</p><span className="font-mono text-gray-400">{p.profile_id}</span></div>
                    <button onClick={() => setSelectedProfileId(p.__backendId)} className="bg-[#7b1f1f] text-white px-3 py-1 rounded font-bold text-[11px]">Review Bio</button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {currentView === 'admin' && currentUser?.is_admin && (
          <section className="space-y-6 animate-fadeIn py-4">
            <h2 className="text-2xl font-bold font-sans text-emerald-800 border-b pb-2 flex items-center gap-2">⚙️ Security Back-Office Verification Panels</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-xl border p-5 space-y-3">
                <h3 className="font-bold text-xs text-amber-800 uppercase tracking-wider flex items-center gap-1.5"><Clock className="w-4 h-4" /> Awaiting Aadhaar Verification Queue</h3>
                {profiles.filter(p => p.profile_status === 'pending').map(p => (
                  <div key={p.__backendId} className="p-3.5 bg-amber-50/50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs font-sans">
                    <div>
                      <p className="font-bold font-serif text-sm text-gray-900">{p.first_name} {p.last_name}</p>
                      <p className="text-gray-500 font-mono mt-0.5">Caste: {p.caste} • Gothram: {p.gothram}</p>
                    </div>
                    <button onClick={() => handleAdminApproveProfile(p.__backendId)} className="bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase shadow-sm">Authorize</button>
                  </div>
                )) || <p className="text-xs text-gray-400 py-2 text-center">No profiles awaiting review.</p>}
              </div>

              <div className="bg-white rounded-2xl shadow-xl border p-5 space-y-3">
                <h3 className="font-bold text-xs text-blue-800 uppercase tracking-wider flex items-center gap-1.5"><Wallet className="w-4 h-4" /> Awaiting UPI Remittance Audit Tickets</h3>
                {profiles.filter(p => p.payment_verification_requested === true).map(p => (
                  <div key={p.__backendId} className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl flex items-center justify-between gap-3 text-xs font-sans">
                    <div>
                      <p className="font-bold font-serif text-sm text-gray-900">Unlock Request For: {p.profile_id}</p>
                    </div>
                    <button onClick={() => handleAdminApprovePayment(p)} className="bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase shadow-sm flex items-center gap-1 shrink-0"><ThumbsUp className="w-3 h-3" /> Approve Credit</button>
                  </div>
                )) || <p className="text-xs text-gray-400 py-2 text-center">No payment tickets awaiting validation match hooks.</p>}
              </div>
            </div>
          </section>
        )}
      </main>

      {selectedProfileId && activeModalProfile && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm" onClick={() => setSelectedProfileId(null)}>
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 relative shadow-2xl border border-[#d4a017]/30" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedProfileId(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
            <div className="space-y-4 text-sm">
              <div className="text-center bg-[#FFFDF2] p-4 rounded-xl border border-[#d4a017]/20">
                <h3 className="font-serif text-xl font-bold text-[#7b1f1f]">{activeModalProfile.first_name} {modalHasAccess ? activeModalProfile.last_name : ''}</h3>
                <p className="text-xs text-gray-400 font-mono">Signature: {activeModalProfile.profile_id}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border font-sans font-bold text-xs text-gray-700">
                <div><span className="block text-gray-400 text-[10px]">CASTE / SUB-SECT</span>{activeModalProfile.caste} • {activeModalProfile.sub_caste}</div>
                <div><span className="block text-gray-400 text-[10px]">LINEAGE GOTHRAM</span>{activeModalProfile.gothram}</div>
                <div><span className="block text-gray-400 text-[10px]">HOROSCOPE SIGN</span>{activeModalProfile.nakshatra} ({activeModalProfile.padam}వ పాదం)</div>
                <div><span className="block text-gray-400 text-[10px]">CHANDRA RASI</span>{activeModalProfile.rashi} Rasi</div>
              </div>

              <div className="border-t pt-3">
                <h4 className="font-bold text-sm text-[#7b1f1f] uppercase mb-2">🏡 Ancestral Asset registries & Lineage Surnames</h4>
                {modalHasAccess ? (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-1.5 font-sans font-medium text-xs">
                    <p><strong>Maternal Family Surnames (మేనమామలు):</strong> {activeModalProfile.maternalSurnames}</p>
                    <p><strong>Family Net Worth Valuation:</strong> {activeModalProfile.propertyWorth}</p>
                    <p><strong>Landholdings Description:</strong> {activeModalProfile.landDetails || 'None disclosed'}</p>
                    <div className="mt-2 p-3 bg-white border border-emerald-300 rounded-lg text-center font-mono font-bold text-sm text-emerald-800 tracking-wider">
                      📞 Secure Mobile Coordinates: {activeModalProfile.phone}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-[#FFFDF2] text-amber-900 text-xs p-3.5 rounded-xl border border-[#d4a017]/20 font-sans font-medium leading-relaxed">
                      <div className="flex gap-2 text-[#7b1f1f] font-bold mb-1 uppercase tracking-tight text-[11px] items-center"><LockKeyhole className="w-3.5 h-3.5" /> Credentials Encrypted for Privacy</div>
                      Family asset registries, concrete landholdings description metrics, maternal relative lines, and specific contact mobile coordinates are hidden behind an encryption shield. Submit processing verification snapshot token below to decrypt.
                    </div>
                    <button onClick={() => setShowUpiModal(true)} className="w-full mt-3 bg-[#f39c12] text-white py-3 rounded-xl font-sans font-extrabold text-xs uppercase tracking-wider shadow">
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
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowUpiModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative border shadow-2xl animate-scaleUp text-xs space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-serif font-bold text-lg flex items-center gap-2 text-[#7b1f1f] border-b pb-1.5"><Wallet className="w-5 h-5 text-[#d4a017]" /> Authorize Remittance Reference</h3>
            <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-xl font-mono text-sm">
              <span className="flex-1 font-bold text-gray-700">sambasiva.rao@upi</span>
            </div>
            
            <div className="p-4 bg-[#FFFDF2] border border-dashed border-[#d4a017]/40 rounded-xl space-y-2.5 font-sans">
              <label className="block font-bold text-[#7b1f1f] uppercase tracking-wider text-[10px]">📸 Attach Remittance Success Screenshot *</label>
              <label className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-xl px-4 py-2.5 font-bold cursor-pointer hover:bg-gray-50 shadow-sm">
                <Upload className="w-4 h-4 text-gray-500" />
                <span>{screenshotAttached ? "✓ Screenshot Attached" : "Choose Statement Screenshot File"}</span>
                <input type="file" required onChange={() => setScreenshotAttached(true)} className="hidden" />
              </label>
            </div>

            <div className="flex gap-3 pt-1 font-sans">
              <button onClick={() => setShowUpiModal(false)} className="flex-1 border py-2.5 rounded-xl font-bold uppercase tracking-wider text-gray-600">Cancel</button>
              <button onClick={handleRequestUnlockVerification} className="flex-1 bg-emerald-700 text-white py-2.5 rounded-xl font-bold uppercase tracking-wider shadow">Submit Screenshot for Audit ✓</button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-[#210B0B] text-[#FFF6E5]/40 text-center py-8 text-xs border-t border-[#d4a017]/20 mt-auto px-4 font-sans">
        <p>© 2026 Pelli Pusthakam. Configured exclusively for mybestwater.in. All Structural System Rights Reserved.</p>
      </footer>
    </div>
  );
}
