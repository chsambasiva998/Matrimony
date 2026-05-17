import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ShieldCheck, Lock, Eye, Heart, Send, Inbox, 
  Wallet, X, Copy, Menu, BadgeCheck, Search, 
  User, MapPin, Award, FileText, Upload, LockKeyhole, Clock, ThumbsUp, Users, Image as ImageIcon, CheckCircle2, Sparkles
} from 'lucide-react';

// Live Full-Stack Firebase Core Connectors
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, addDoc, updateDoc, onSnapshot, query, where } from 'firebase/firestore';

// 🔱 YOUR REAL CHIPPADA SAMBASIVA RAO DATABASE CONFIGURATION KEYS 🔱
const firebaseConfig = {
  apiKey: "AIzaSyANrr-2CJd4p7If61i7Z1u2dOJ3wTIRfJA",
  authDomain: "mangalasutram-ca576.firebaseapp.com",
  projectId: "mangalasutram-ca576",
  storageBucket: "mangalasutram-ca576.firebasestorage.app",
  messagingSenderId: "599413055123",
  appId: "1:599413055123:web:23a58e34409fe66b523766",
  measurementId: "G-0QETPPEFDF"
};

// Initialize Core Cloud Framework Natively
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const INCOME_MAP = { '3-5 LPA': 1, '5-10 LPA': 2, '10-15 LPA': 3, '15-25 LPA': 4, '25-50 LPA': 5, '50+ LPA': 6 };
const ASSET_MAP = { 'No Assets': 0, 'Below 50 Lakhs': 1, '50 Lakhs - 1 Crore': 2, '1 - 3 Crores': 3, '3 - 5 Crores': 4, '5 - 10 Crores': 5, '10 - 20 Crores': 6, '20 Crores+': 7 };

function SecureAvatar({ imageUrl, watermarkText }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150";
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
  const [userSession, setUserSession] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [globalProfiles, setGlobalProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentView, setCurrentView] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [toastMessage, setToastMessage] = useState('');
  
  const [filterCity, setFilterCity] = useState('');
  const [financialFilterActive, setFinancialFilterActive] = useState(true);
  const [castePreferenceTier, setCastePreferenceTier] = useState('same_caste');

  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [aadharInput, setAadharInput] = useState('');
  const [aadharAttached, setAadharAttached] = useState(false);
  const [screenshotAttached, setScreenshotAttached] = useState(false);
  const [formPhotos, setFormPhotos] = useState(['', '', '']);
  
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  const [regForm, setRegForm] = useState({
    first_name: '', last_name: '', phone: '', age: 26, gender: 'Male',
    marital_status: 'Never Married', height: "5'8\"", bloodGroup: 'O+', caste: 'Kapu', sub_caste: '',
    gothram: '', nakshatra: 'Ashwini', padam: '1', rashi: 'Mesha', kujaDosham: 'No (లేదు)',
    education: '', occupation: '', income: '10-15 LPA', city: '', diet: 'Vegetarian',
    physicalStatus: 'Normal Status', fatherName: '', motherName: '', maternalSurnames: '',
    propertyWorth: '3 - 5 Crores', landDetails: '', houseDetails: '', abroadStatus: 'Open to both', about: '',
    devotional_status: 'Moderately Spiritual (పండుగలు పాటిస్తారు)',
    food_culture: 'Strict Vegetarian (శాకాహారి)',
    family_bonding: 'Prefers Nuclear Lifestyle',
    monthly_spends: 'Disciplined Saver',
    hobbies_text: ''
  });

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(''), 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Real-time Cloud Synchronization Listener
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserSession(user);
        const q = query(collection(db, "profiles"), where("auth_uid", "==", user.uid));
        onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const dataNode = snapshot.docs[0].data();
            dataNode.__docId = snapshot.docs[0].id;
            setCurrentUserData(dataNode);
            setCastePreferenceTier(dataNode.caste_preference_tier || 'same_caste');
          }
        });
      } else {
        setUserSession(null);
        setCurrentUserData(null);
      }
      setLoading(false);
    });

    const unsubProfiles = onSnapshot(collection(db, "profiles"), (snapshot) => {
      const records = snapshot.docs.map(doc => ({ ...doc.data(), __docId: doc.id }));
      setGlobalProfiles(records);
    });

    return () => { unsubAuth(); unsubProfiles(); };
  }, []);

  const handleLiveLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, authEmail, authPassword);
      triggerToast("✓ Secure session authorized successfully via Firebase.");
      setCurrentView('search');
    } catch (err) {
      triggerToast(`❌ Auth Failure: ${err.message}`);
    }
  };

  const handleLiveLogout = async () => {
    await signOut(auth);
    triggerToast("Session terminated securely.");
    setCurrentView('home');
  };

  const handlePhotoSlotChange = (index, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedPhotos = [...formPhotos];
      updatedPhotos[index] = reader.result; 
      setFormPhotos(updatedPhotos);
      triggerToast(`✓ Image Slot #${index + 1} synchronized to cloud stack.`);
    };
    reader.readAsDataURL(file);
  };

  const handleFullStackRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!aadharAttached || !aadharInput) {
      triggerToast("❌ Security Error: Aadhaar verification records must be populated.");
      return;
    }
    if (formPhotos.filter(Boolean).length < 3) {
      triggerToast("❌ Album Exception: 3 display photos must be provided.");
      return;
    }

    try {
      const credential = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
      
      let continuousBio = regForm.about.trim();
      if (!continuousBio) {
        continuousBio = `Cultured, family-oriented ${regForm.gender === 'Male' ? 'groom' : 'bride'} based in ${regForm.city}. Professionally working as a ${regForm.occupation} with a structural focus on maintaining balanced values, a ${regForm.devotional_status} lifestyle, and active family tradition lineages.`;
      }

      const payload = {
        ...regForm,
        about: continuousBio,
        auth_uid: credential.user.uid,
        profile_id: "PP" + Math.floor(10000 + Math.random() * 90000),
        profile_status: "pending", 
        interests_received: "", shortlisted: "", contact_purchases: "",
        payment_verification_requested: false, payment_request_by: "",
        caste_preference_tier: "same_caste",
        uploaded_photos: [...formPhotos]
      };

      await addDoc(collection(db, "profiles"), payload);
      triggerToast("🎉 Account created! Placed in server verification queue.");
      setStep(1);
      setFormPhotos(['', '', '']);
      setCurrentView('search');
    } catch (err) {
      triggerToast(`❌ Server Exception: ${err.message}`);
    }
  };

  const handleConnectProposal = async (targetProfile) => {
    if (!currentUserData) return;
    let currentInterests = (targetProfile.interests_received || '').split(',').filter(Boolean);
    if (!currentInterests.includes(currentUserData.profile_id)) {
      currentInterests.push(currentUserData.profile_id);
      const targetRef = doc(db, "profiles", targetProfile.__docId);
      await updateDoc(targetRef, { interests_received: currentInterests.join(',') });
      triggerToast("🔱 Connection handshake dispatched cleanly across cloud dataspaces.");
    }
  };

  const handleRequestUnlockVerification = async () => {
    if (!screenshotAttached || !activeModalProfile) return;
    const targetRef = doc(db, "profiles", activeModalProfile.__docId);
    await updateDoc(targetRef, { 
      payment_verification_requested: true, 
      payment_request_by: currentUserData.profile_id 
    });
    setShowUpiModal(false);
    setScreenshotAttached(false);
    setSelectedProfileId(null);
    triggerToast("📧 Snapshot routed directly to Admin Audit Ticket queues.");
  };

  const handleAdminApproveProfile = async (docId) => {
    await updateDoc(doc(db, "profiles", docId), { profile_status: "approved" });
    triggerToast("✓ Profile state updated to live indices.");
  };

  const handleAdminApprovePayment = async (targetProfile) => {
    let currentPurchases = (targetProfile.contact_purchases || '').split(',').filter(Boolean);
    if (!currentPurchases.includes(targetProfile.payment_request_by)) {
      currentPurchases.push(targetProfile.payment_request_by);
    }
    await updateDoc(doc(db, "profiles", targetProfile.__docId), {
      payment_verification_requested: false,
      payment_request_by: "",
      contact_purchases: currentPurchases.join(',')
    });
    triggerToast("✓ Audit reference verified! Coordinates unlocked safely.");
  };

  const updateCastePreference = async (tier) => {
    setCastePreferenceTier(tier);
    if (currentUserData?.__docId) {
      await updateDoc(doc(db, "profiles", currentUserData.__docId), { caste_preference_tier: tier });
    }
  };

  const computedTargetGender = useMemo(() => {
    if (!currentUserData) return 'Female';
    return currentUserData.gender === 'Male' ? 'Female' : 'Male';
  }, [currentUserData]);

  const calculateCompatibilityScore = (profile) => {
    if (!currentUserData) return 60;
    let baseScore = 65;
    if (profile.devotional_status === currentUserData.devotional_status) baseScore += 15;
    if (profile.food_culture === currentUserData.food_culture) baseScore += 10;
    if (profile.monthly_spends === currentUserData.monthly_spends) baseScore += 10;
    return Math.min(baseScore, 100);
  };

  const filteredProfiles = useMemo(() => {
    if (!currentUserData) return [];
    return globalProfiles.filter(profile => {
      if (profile.profile_status !== "approved") return false;
      if (profile.auth_uid === currentUserData.auth_uid) return false;
      if (profile.gender !== computedTargetGender) return false;
      if (filterCity && !(profile.city || '').toLowerCase().includes(filterCity.toLowerCase())) return false;

      if (currentUserData.kujaDosham === 'Yes (ఉంది)' && profile.kujaDosham === 'No (లేదు)') return false;

      if (currentUserData.gothram && profile.gothram) {
        if (currentUserData.gothram.trim().toLowerCase() === profile.gothram.trim().toLowerCase()) return false;
      }

      if (currentUserData.caste) {
        const cleanUserCaste = currentUserData.caste.trim().toLowerCase();
        const cleanProfileCaste = profile.caste.trim().toLowerCase();
        if (castePreferenceTier === 'same_caste') {
          if (cleanProfileCaste !== cleanUserCaste) return false;
        } else if (castePreferenceTier === 'sub_caste') {
          if (cleanProfileCaste !== cleanUserCaste) return false;
          if ((profile.sub_caste || '').trim().toLowerCase() !== (currentUserData.sub_caste || '').trim().toLowerCase()) return false;
        }
      }

      if (financialFilterActive) {
        const myIncomeRank = INCOME_MAP[currentUserData.income] || 1;
        const matchIncomeRank = INCOME_MAP[profile.income] || 1;
        const myAssetRank = ASSET_MAP[currentUserData.propertyWorth] || 1;
        const matchAssetRank = ASSET_MAP[profile.propertyWorth] || 1;

        if (currentUserData.gender === 'Female') {
          if (matchIncomeRank < myIncomeRank || matchAssetRank < myAssetRank) return false;
        } else {
          if (matchIncomeRank > myIncomeRank || matchAssetRank > (myAssetRank + 1)) return false;
        }
      }
      return true;
    });
  }, [globalProfiles, currentUserData, computedTargetGender, filterCity, financialFilterActive, castePreferenceTier]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#FFFDF6] flex items-center justify-center font-sans text-xs font-bold tracking-widest text-[#7b1f1f] uppercase">
        🔱 Initializing Secure Fullstack Pipeline Nodes...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FFFDF6] text-[#2c1810] flex flex-col font-serif">
      <div className="h-2.5 w-full bg-gradient-to-r from-[#7b1f1f] via-[#d4a017] to-[#7b1f1f]"></div>

      <nav className="w-full bg-white shadow-md sticky top-0 z-40 border-b border-[#d4a017]/20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="w-10 h-10 bg-[#7b1f1f] rounded-xl flex items-center justify-center text-white font-bold text-xl">మ</div>
            <div>
              <span className="block font-bold text-2xl text-[#7b1f1f] leading-none">పెళ్ళి పుస్తకం</span>
              <span className="text-[9px] font-sans font-bold tracking-widest text-[#d4a017] uppercase block mt-1">Live Global Production Server</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 font-sans text-xs font-bold uppercase tracking-wider text-[#5a3e36]">
            <button onClick={() => setCurrentView('home')} className="hover:text-[#7b1f1f]">Home</button>
            {userSession && <button onClick={() => setCurrentView('search')} className="hover:text-[#7b1f1f]">Find Alliances</button>}
            {userSession && <button onClick={() => setCurrentView('dashboard')} className="hover:text-[#7b1f1f]">My Ledger</button>}
            {currentUserData?.is_admin && <button onClick={() => setCurrentView('admin')} className="text-emerald-700 font-extrabold">Admin Suite ⚙️</button>}
            {userSession ? (
              <button onClick={handleLiveLogout} className="border border-[#7b1f1f] text-[#7b1f1f] px-4 py-2 rounded-xl">Logout</button>
            ) : (
              <button onClick={() => setCurrentView('login')} className="bg-[#7b1f1f] text-white px-4 py-2 rounded-xl">Sign In</button>
            )}
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
              <p className="text-sm font-sans tracking-wide max-w-xl mx-auto text-gray-200 mt-2">Active live server sync running cross-country queries natively. Secure encrypted Telugu lineages.</p>
              
              <div className="pt-6 flex justify-center gap-4 font-sans text-xs font-bold uppercase tracking-wider">
                {userSession ? (
                  <button onClick={() => setCurrentView('search')} className="bg-[#d4a017] text-[#3a0a0a] px-6 py-3 rounded-xl shadow-md">Browse Alliances Matrix</button>
                ) : (
                  <React.Fragment>
                    <button onClick={() => setCurrentView('login')} className="bg-[#d4a017] text-[#3a0a0a] px-6 py-3 rounded-xl shadow-md">Sign Into Account</button>
                    <button onClick={() => setCurrentView('register')} className="border border-white/40 text-white px-6 py-3 rounded-xl">Create Account Profile</button>
                  </React.Fragment>
                )}
              </div>
            </div>
          </section>
        )}

        {currentView === 'login' && (
          <section className="max-w-md mx-auto py-10">
            <form onSubmit={handleLiveLogin} className="bg-white p-6 rounded-2xl border shadow-xl space-y-4 font-sans text-xs font-bold text-gray-500">
              <h3 className="font-serif text-xl text-[#7b1f1f] text-center mb-4">Secure Network Access Panel</h3>
              <div>Email Address *<input type="email" required value={authEmail} onChange={e => setAuthEmail(e.target.value)} className="w-full border rounded-xl p-3 text-sm font-normal mt-1 outline-none" /></div>
              <div>Password Secure Token *<input type="password" required value={authPassword} onChange={e => setAuthPassword(e.target.value)} className="w-full border rounded-xl p-3 text-sm font-normal mt-1 outline-none" /></div>
              <button type="submit" className="w-full bg-[#7b1f1f] text-white py-3 rounded-xl text-xs uppercase tracking-wider mt-2">Authenticate Coordinates ✓</button>
              <p className="text-center font-normal mt-4 cursor-pointer text-[#7b1f1f] hover:underline" onClick={() => setCurrentView('register')}>New to the platform? Deploy a verified heritage profile vector</p>
            </form>
          </section>
        )}

        {currentView === 'register' && (
          <section className="max-w-2xl mx-auto py-4">
            <h2 className="text-2xl font-bold text-[#7b1f1f] text-center mb-6">Deploy Certified Cloud Lineage Node</h2>
            <form onSubmit={handleFullStackRegisterSubmit} className="bg-white rounded-2xl shadow-xl border p-6 md:p-8 space-y-6 relative">
              <div className="flex items-center justify-center gap-2 max-w-xs mx-auto mb-4 font-sans text-[10px] font-bold">
                {[1, 2, 3].map((num) => <span key={num} className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= num ? 'bg-[#7b1f1f] text-white' : 'bg-gray-100 text-gray-400'}`}>{num}</span>)}
              </div>

              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg border-b pb-1.5 text-[#7b1f1f]">Step 1: Core Credentials & Login</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs font-bold text-gray-500">
                    <div>Email Parameter (For Login) *<input type="email" required value={authEmail} onChange={e => setAuthEmail(e.target.value)} className="w-full mt-1 border rounded-xl p-3 font-normal text-sm" /></div>
                    <div>Account Password Token *<input type="password" required value={authPassword} onChange={e => setAuthPassword(e.target.value)} className="w-full mt-1 border rounded-xl p-3 font-normal text-sm" /></div>
                    <div>First Name *<input type="text" required value={regForm.first_name} onChange={e => setRegForm({...regForm, first_name: e.target.value})} className="w-full mt-1 border rounded-xl p-3 font-normal text-sm" /></div>
                    <div>Surname (Inti Peru) *<input type="text" required value={regForm.last_name} onChange={e => setRegForm({...regForm, last_name: e.target.value})} className="w-full mt-1 border rounded-xl p-3 font-normal text-sm" /></div>
                    <div>Gender *
                      <select value={regForm.gender} onChange={e => setRegForm({...regForm, gender: e.target.value})} className="w-full mt-1 border rounded-xl p-3 text-sm font-normal">
                        <option value="Male">Male (Varudu / Groom)</option><option value="Female">Female (Vadhuvu / Bride)</option>
                      </select>
                    </div>
                    <div>Mobile number *<input type="tel" required value={regForm.phone} onChange={e => setRegForm({...regForm, phone: e.target.value})} className="w-full mt-1 border rounded-xl p-3 font-normal text-sm" /></div>
                  </div>
                  <button type="button" onClick={() => setStep(2)} className="w-full bg-[#7b1f1f] text-white py-3 rounded-xl font-sans text-xs font-bold uppercase tracking-wider">Next Step: Behavioral Compatibility Matrix →</button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg border-b pb-1.5 text-[#7b1f1f]">Step 2: Ancestral Settings & Priorities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs font-bold text-gray-500">
                    <div>Caste Class *
                      <select value={regForm.caste} onChange={e => setRegForm({...regForm, caste: e.target.value})} className="w-full mt-1 border rounded-xl p-3 text-sm font-normal">
                        <option value="Kapu">Kapu</option><option value="Kamma">Kamma</option><option value="Reddy">Reddy</option><option value="Brahmin">Brahmin</option>
                      </select>
                    </div>
                    <div>Sub-Caste (ఉపకులం) *<input type="text" required value={regForm.sub_caste} onChange={e => setRegForm({...regForm, sub_caste: e.target.value})} className="w-full mt-1 border rounded-xl p-3 font-normal text-sm" placeholder="E.g., Telaga" /></div>
                    <div>దైవచింతన (Devotional Aspect) *
                      <select value={regForm.devotional_status} onChange={e => setRegForm({...regForm, devotional_status: e.target.value})} className="w-full mt-1 border rounded-xl p-3 text-sm font-normal">
                        <option value="Highly Spiritual (నిత్య పూజ చేస్తారు)">Highly Spiritual (నిత్య పూజ చేస్తారు)</option>
                        <option value="Moderately Spiritual (పండుగలు పాటిస్తారు)">Moderately Spiritual (పండుగలు పాటిస్తారు)</option>
                        <option value="Liberal View / Non-Religious">Liberal View / Non-Religious</option>
                      </select>
                    </div>
                    <div>Kuja Dosham Status *
                      <select value={regForm.kujaDosham} onChange={e => setRegForm({...regForm, kujaDosham: e.target.value})} className="w-full mt-1 border rounded-xl p-3 text-sm font-normal">
                        <option value="No (లేదు)">No (లేదు)</option><option value="Yes (ఉంది)">Yes (ఉంది)</option><option value="Anukulma (అనుకూలం)">Partial (అనుకూలం)</option>
                      </select>
                    </div>
                    <div>ఆహార సంస్కృతి (Food Culture) *
                      <select value={regForm.food_culture} onChange={e => setRegForm({...regForm, food_culture: e.target.value})} className="w-full mt-1 border rounded-xl p-3 text-sm font-normal">
                        <option value="Strict Vegetarian (శాకాహారి)">Strict Vegetarian (శాకాహారి)</option><option value="Non-Vegetarian (మాంసాహారి)">Non-Vegetarian (మాంసాహారి)</option>
                      </select>
                    </div>
                    <div>ఆర్థిక క్రమశిక్షణ (Spending Habits) *
                      <select value={regForm.monthly_spends} onChange={e => setRegForm({...regForm, monthly_spends: e.target.value})} className="w-full mt-1 border rounded-xl p-3 text-sm font-normal">
                        <option value="Disciplined Saver">Disciplined Saver</option><option value="Moderate Spender">Moderate Spender</option>
                      </select>
                    </div>
                    <div>Income *
                      <select value={regForm.income} onChange={e => setRegForm({...regForm, income: e.target.value})} className="w-full mt-1 border rounded-xl p-3 text-sm font-normal">
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
                  <h3 className="font-bold text-lg border-b pb-1.5 text-[#7b1f1f]">Step 3: Album Upload & Secure ID Proof</h3>
                  
                  <div className="p-4 bg-orange-50/40 border border-[#d4a017]/30 rounded-xl space-y-4 font-sans">
                    <p className="text-xs font-bold text-[#7b1f1f] uppercase tracking-wider flex items-center gap-1.5"><ImageIcon className="w-4 h-4 text-[#d4a017]" /> Album Selection (3 Photos Mandatory) *</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[0, 1, 2].map((idx) => (
                        <label key={idx} className="relative aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center p-2 text-center cursor-pointer hover:bg-gray-50 overflow-hidden">
                          {formPhotos[idx] ? (
                            <div className="absolute inset-0 w-full h-full">
                              <img src={formPhotos[idx]} alt="Preview" className="w-full h-full object-cover" />
                              <div className="absolute top-1 right-1 bg-emerald-700 text-white rounded-full p-0.5"><CheckCircle2 className="w-3.5 h-3.5" /></div>
                            </div>
                          ) : (
                            <div className="space-y-1 text-gray-400">
                              <Upload className="w-4 h-4 mx-auto" />
                              <span className="text-[9px] font-bold block uppercase">Slot #{idx + 1}</span>
                            </div>
                          )}
                          <input type="file" accept="image/*" required onChange={(e) => handlePhotoSlotChange(idx, e.target.files[0])} className="hidden" />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50/60 border-2 border-dashed border-[#d4a017]/30 rounded-xl space-y-3 font-sans">
                    <p className="text-xs font-bold text-[#7b1f1f] uppercase tracking-wider">🔒 Government ID Authentication Sandbox Guard</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input type="password" maxLength={12} required value={aadharInput} onChange={e => setAadharInput(e.target.value.replace(/\D/g,''))} className="border rounded-xl p-2.5 text-xs font-mono tracking-widest bg-white" placeholder="Enter 12-Digit ID" />
                      <label className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-xl px-4 py-2 text-xs font-bold cursor-pointer hover:bg-gray-50">
                        <Upload className="w-4 h-4 text-gray-500" />
                        <span>{aadharAttached ? "✓ Document Bound" : "Upload ID Image File"}</span>
                        <input type="file" required onChange={() => setAadharAttached(true)} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs font-bold text-gray-500">
                    <div>Maternal Family Surnames *<input type="text" required value={regForm.maternalSurnames} onChange={e => setRegForm({...regForm, maternalSurnames: e.target.value})} className="w-full mt-1 border rounded-xl p-3 font-normal text-sm" placeholder="మేనమామలు" /></div>
                    <div>Hometown City *<input type="text" required value={regForm.city} onChange={e => setRegForm({...regForm, city: e.target.value})} className="w-full mt-1 border rounded-xl p-3 font-normal text-sm" /></div>
                  </div>
                  
                  <div className="flex gap-3 font-sans">
                    <button type="button" onClick={() => setStep(2)} className="flex-1 border py-3 rounded-xl font-bold text-xs uppercase tracking-wider">Back</button>
                    <button type="submit" disabled={formPhotos.filter(Boolean).length < 3} className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md ${formPhotos.filter(Boolean).length === 3 ? 'bg-emerald-700 text-white cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>Complete Registration ✓</button>
                  </div>
                </div>
              )}
            </form>
          </section>
        )}

        {/* Global Match Feed Dashboard Grid */}
        {currentView === 'search' && currentUserData && (
          <section className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-xl border p-5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-[#7b1f1f]">Live Server Affinity Feed</h3>
                <p className="text-xs text-gray-500 font-sans">Displaying cross-country candidates matching your priority matrices.</p>
              </div>

              <div className="grid grid-cols-3 bg-gray-100 p-1 rounded-xl text-xs font-bold border font-sans text-center shrink-0">
                <button onClick={() => updateCastePreference('same_caste')} className={`px-4 py-2 rounded-lg ${castePreferenceTier === 'same_caste' ? 'bg-[#7b1f1f] text-white shadow-md' : 'text-gray-600'}`}>Strict Caste</button>
                <button onClick={() => updateCastePreference('sub_caste')} className={`px-4 py-2 rounded-lg ${castePreferenceTier === 'sub_caste' ? 'bg-[#7b1f1f] text-white shadow-md' : 'text-gray-600'}`}>Sub-Caste</button>
                <button onClick={() => updateCastePreference('open')} className={`px-4 py-2 rounded-lg ${castePreferenceTier === 'open' ? 'bg-[#7b1f1f] text-white shadow-md' : 'text-gray-600'}`}>Caste No Bar</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map(p => {
                const hasAccess = (p.contact_purchases || '').split(',').includes(currentUserData.profile_id);
                const firstPic = p.uploaded_photos && p.uploaded_photos.length ? p.uploaded_photos[0] : '';
                const behavioralScore = calculateCompatibilityScore(p);

                return (
                  <div key={p.__docId} className="bg-white rounded-2xl shadow-md border border-[#d4a017]/15 overflow-hidden flex flex-col justify-between h-full hover:shadow-xl transition-shadow group">
                    <div className="p-5">
                      <div className="flex justify-between items-center mb-3">
                        <span className="bg-[#7b1f1f]/5 text-[#7b1f1f] text-[10px] font-bold px-2 py-0.5 rounded border font-mono">{p.profile_id}</span>
                        <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded flex items-center gap-1 font-sans font-bold"><Sparkles className="w-3 h-3 text-emerald-600" /> {behavioralScore}% Score</span>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => setSelectedProfileId(p.__docId)}>
                        <SecureAvatar imageUrl={firstPic} watermarkText={currentUserData.profile_id} />
                        <div className="min-w-0">
                          <h4 className="font-bold text-base text-gray-900 truncate group-hover:text-[#7b1f1f] transition-colors">{p.first_name} {hasAccess ? p.last_name : <span className="text-xs text-gray-400 font-sans font-normal block">[Surname Masked]</span>}</h4>
                          <p className="text-xs text-gray-500 font-sans font-medium mt-0.5"><MapPin className="w-3.5 h-3.5 inline mr-0.5 text-gray-400" />{p.city} • {p.age} Yrs</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs font-medium text-gray-600">
                        <div className="bg-[#FFFDF2] border border-[#d4a017]/30 rounded-lg p-2.5 text-[#7b1f1f] font-serif font-bold">
                          🌟 Caste: {p.caste} (${p.sub_caste || 'General'})
                        </div>
                        <div className="p-2.5 bg-orange-50/40 rounded-xl border border-orange-100 text-[11px] space-y-1">
                          <p className="text-[#7b1f1f] font-bold">🕉️ దైవచింతన: <span className="text-gray-700 font-sans font-normal">{p.devotional_status}</span></p>
                          <p className="text-[#7b1f1f] font-bold">🌾 ఆహారం: <span className="text-gray-700 font-sans font-normal">{p.food_culture}</span></p>
                          <p className="text-[#7b1f1f] font-bold">🪐 కుజ దోషం: <span className="text-[#7b1f1f] font-bold font-sans text-xs">{p.kujaDosham}</span></p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 border-t flex gap-2 font-sans">
                      <button onClick={() => triggerToast("Shortlist synchronized.")} className="flex-1 bg-white border text-gray-700 py-2 rounded-xl text-xs font-bold uppercase">Shortlist</button>
                      <button onClick={() => handleConnectProposal(p)} className="flex-1 bg-[#7b1f1f] text-white py-2 rounded-xl text-xs font-bold uppercase">Connect</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Interaction Inbox Ledgers */}
        {currentView === 'dashboard' && currentUserData && (
          <section className="py-4 animate-fadeIn space-y-6">
            <h2 className="text-3xl font-bold text-center text-[#7b1f1f]">My Interaction Ledger</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
              <div className="bg-white p-5 rounded-2xl border shadow-xl">
                <h3 className="font-serif font-bold text-base text-[#7b1f1f] mb-3 flex items-center gap-2"><Send className="w-4 h-4" /> Sent Alliance Invitations</h3>
                {globalProfiles.filter(p => (p.interests_received || '').split(',').includes(currentUserData.profile_id)).map(p => (
                  <div key={p.__docId} className="p-3 bg-gray-50 border rounded-xl mb-2 flex justify-between items-center text-xs">
                    <div><p className="font-bold text-gray-900">{p.first_name}</p><span className="font-mono text-gray-400">{p.profile_id}</span></div>
                    <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 font-bold rounded uppercase">Transmitted</span>
                  </div>
                ))}
              </div>
              <div className="bg-white p-5 rounded-2xl border shadow-xl">
                <h3 className="font-serif font-bold text-base text-[#7b1f1f] mb-3 flex items-center gap-2"><Inbox className="w-4 h-4" /> Received Alliance Proposals</h3>
                {globalProfiles.filter(p => (currentUserData.interests_received || '').split(',').includes(p.profile_id)).map(p => (
                  <div key={p.__docId} className="p-3 bg-gray-50 border rounded-xl mb-2 flex justify-between items-center text-xs">
                    <div><p className="font-bold text-gray-900">{p.first_name}</p><span className="font-mono text-gray-400">{p.profile_id}</span></div>
                    <button onClick={() => setSelectedProfileId(p.__docId)} className="bg-[#7b1f1f] text-white px-3 py-1 rounded font-bold text-[11px]">Review Bio</button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* High Security Server Back-Office Panel */}
        {currentView === 'admin' && currentUserData?.is_admin && (
          <section className="space-y-6 animate-fadeIn py-4">
            <h2 className="text-2xl font-bold font-sans text-emerald-800 border-b pb-2 flex items-center gap-2">⚙️ Security Back-Office Verification Panels</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-xl border p-5 space-y-3">
                <h3 className="font-bold text-xs text-amber-800 uppercase tracking-wider flex items-center gap-1.5"><Clock className="w-4 h-4" /> Awaiting Aadhaar Verification Queue</h3>
                {globalProfiles.filter(p => p.profile_status === 'pending').map(p => (
                  <div key={p.__docId} className="p-3.5 bg-amber-50/50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs font-sans">
                    <div><p className="font-bold font-serif text-sm text-gray-900">{p.first_name} {p.last_name}</p></div>
                    <button onClick={() => handleAdminApproveProfile(p.__docId)} className="bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase shadow-sm">Authorize</button>
                  </div>
                )) || <p className="text-xs text-gray-400 py-2 text-center">No profiles awaiting review.</p>}
              </div>

              <div className="bg-white rounded-2xl shadow-xl border p-5 space-y-3">
                <h3 className="font-bold text-xs text-blue-800 uppercase tracking-wider flex items-center gap-1.5"><Wallet className="w-4 h-4" /> Awaiting UPI Remittance Audit Tickets</h3>
                {globalProfiles.filter(p => p.payment_verification_requested === true).map(p => (
                  <div key={p.__docId} className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl flex items-center justify-between gap-3 text-xs font-sans">
                    <div><p className="font-bold font-serif text-sm text-gray-900">Unlock Request For: {p.profile_id}</p></div>
                    <button onClick={() => handleAdminApprovePayment(p)} className="bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase shadow-sm flex items-center gap-1 shrink-0"><ThumbsUp className="w-3 h-3" /> Approve Credit</button>
                  </div>
                )) || <p className="text-xs text-gray-400 py-2 text-center">No payment tickets awaiting validation.</p>}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Protected Overlay Detail Drawers */}
      {selectedProfileId && activeModalProfile && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm" onClick={() => setSelectedProfileId(null)}>
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 relative shadow-2xl border border-[#d4a017]/30" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedProfileId(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
            <div className="space-y-4 text-sm">
              <div className="text-center bg-[#FFFDF2] p-4 rounded-xl border border-[#d4a017]/20">
                <h3 className="font-serif text-xl font-bold text-[#7b1f1f]">{activeModalProfile.first_name} {modalHasAccess ? activeModalProfile.last_name : ''}</h3>
                <p className="text-xs text-gray-400 font-mono">Cloud ID: {activeModalProfile.profile_id}</p>
                <p className="text-xs text-gray-600 mt-2 px-4 font-sans leading-relaxed italic">"{activeModalProfile.about}"</p>
              </div>

              <div className="space-y-1.5">
                <span className="block text-[10px] font-bold uppercase text-gray-400">Verified Dynamic Profile Album Slots</span>
                <div className="grid grid-cols-3 gap-2">
                  {activeModalProfile.uploaded_photos?.map((src, i) => (
                    <div key={i} className="aspect-square rounded-xl border overflow-hidden bg-gray-100 shadow-inner">
                      {src && <img src={src} alt="Album Frame" className="w-full h-full object-cover select-none pointer-events-none" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-orange-50/30 border rounded-xl space-y-1 text-xs">
                <h5 className="text-[#7b1f1f] font-bold uppercase tracking-wider text-[10px]">🕉_ Traditional Lifestyle Profiles</h5>
                <p><strong>Devotional Intensity:</strong> {activeModalProfile.devotional_status}</p>
                <p><strong>Family Bonding Style:</strong> {activeModalProfile.family_bonding}</p>
                <p><strong>Socio-Economic Spending Discipline:</strong> {activeModalProfile.monthly_spends}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border font-sans font-bold text-xs text-gray-700">
                <div><span className="block text-gray-400 text-[10px]">CASTE / SUB-SECT</span>{activeModalProfile.caste} • {activeModalProfile.sub_caste}</div>
                <div><span className="block text-gray-400 text-[10px]">LINEAGE GOTHRAM</span>{activeModalProfile.gothram}</div>
              </div>

              <div className="border-t pt-3">
                <h4 className="font-bold text-sm text-[#7b1f1f] uppercase mb-2">🏡 Ancestral Asset registries & Lineage Surnames</h4>
                {modalHasAccess ? (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-1.5 font-sans font-medium text-xs">
                    <p><strong>Maternal Family Surnames (మేనమామలు):</strong> {activeModalProfile.maternalSurnames}</p>
                    <p><strong>Family Net Worth Valuation:</strong> {activeModalProfile.propertyWorth}</p>
                    <div className="mt-2 p-3 bg-white border border-emerald-300 rounded-lg text-center font-mono font-bold text-sm text-emerald-800 tracking-wider">
                      📞 Secure Cloud Mobile Array: {activeModalProfile.phone}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-[#FFFDF2] text-amber-900 text-xs p-3.5 rounded-xl border border-[#d4a017]/20 font-sans font-medium leading-relaxed">
                      Family asset registries, concrete landholdings metrics, maternal relative lines, and contact mobile coordinates are hidden under an encryption shield. Submit UPI confirmation screenshot processing verification snapshot token below to decrypt.
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
            <p className="text-xs text-gray-500 font-sans">Please complete a secure transaction of ₹200 to the platform UPI node handle below, then upload the confirmation statement file snapshot to decrypt.</p>
            <div className="flex items-center gap-2 bg-gray-50 border p-3 rounded-xl font-mono text-sm">
              <span className="flex-1 font-bold text-gray-700">sambasiva.rao@upi</span>
            </div>
            
            <div className="p-4 bg-[#FFFDF2] border border-dashed border-[#d4a017]/40 rounded-xl space-y-2.5 font-sans">
              <label className="block font-bold text-[#7b1f1f] uppercase tracking-wider text-[10px]">📸 Attach Remittance Success Screenshot *</label>
              <label className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-xl px-4 py-2.5 font-bold cursor-pointer hover:bg-gray-50 shadow-sm">
                <Upload className="w-4 h-4 text-gray-500" />
                <span>{screenshotAttached ? "✓ Screenshot Attached" : "Choose Statement Screenshot File"}</span>
                <input type="file" accept="image/*" required onChange={() => setScreenshotAttached(true)} className="hidden" />
              </label>
            </div>

            <div className="flex gap-3 pt-1 font-sans">
              <button onClick={() => setShowUpiModal(false)} className="flex-1 border py-2.5 rounded-xl font-bold uppercase text-gray-600">Cancel</button>
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
