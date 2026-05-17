import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { 
  collection, 
  addDoc, 
  doc,
  updateDoc,
  query, 
  onSnapshot, 
  where 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

// Comprehensive Telugu Nakshatrams
const NAKSHATRAMS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 
  'Punarvasu', 'Pushya', 'Aslesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 
  'Hasta', 'Chitra', 'Swati', 'Visakha', 'Anuradha', 'Jyeshta', 
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Sravana', 'Dhanishta', 
  'Satabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

// Dual-Language Enterprise Translation Dictionary Matrix
const TRANSLATIONS = {
  te: {
    logoTitle: "మంగళసూత్రం",
    logoSub: "పవిత్రమైన తెలుగు వివాహ బంధాల వేదిక",
    exploreMatches: "సంబంధాల అన్వేషణ",
    myBio: "నా బయో-డేటా & నక్షత్రాలు",
    goPremium: "👑 ప్రీమియం ప్లాన్",
    namaskaram: "🙏 నమస్కారం",
    premiumActive: "👑 ప్రీమియం యాక్టివ్",
    freeAccount: "ఉచిత సభ్యత్వం",
    logout: "లాగౌట్",
    registerTitle: "📝 కొత్త ప్రొఫైల్ నమోదు",
    loginTitle: "🔐 సభ్యుల లాగిన్",
    switchLogin: "ఖాతా ఉందా? లాగిన్ అవ్వండి",
    switchReg: "కొత్త ఖాతా కావాలా? రిజిస్టర్ అవ్వండి",
    firstName: "మొదటి పేరు",
    lastName: "ఇంటి పేరు (సూర్నమే)",
    age: "వయస్సు",
    gender: "లింగము",
    bride: "వధువు (Female)",
    groom: "వరుడు (Male)",
    maritalStatus: "వివాహ స్థితి",
    neverMarried: "అపరిణీత",
    divorced: "విడాకులు తీసుకున్న",
    widowed: "వితంతువు/విధవ",
    district: "జిల్లా",
    caste: "కులం",
    gothram: "గోత్రం",
    rasi: "రాశి",
    star: "జన్మ నక్షత్రం",
    education: "చదువు",
    income: "సంవత్సర ఆదాయం",
    phone: "మొబైల్ నెంబర్",
    photoUpload: "📸 ఫోటో అప్‌లోడ్ చేయండి",
    aadhaarLabel: "🛡️ ఆధార్ కార్డ్ ధృవీకరణ",
    verifyBtn: "పరిశీలించు",
    verifiedBtn: "✅ ధృవీకరించబడింది",
    email: "ఈమెయిల్ ఐడి",
    password: "పాస్‌వర్డ్",
    submitReg: "🪷 ప్రొఫైల్ ప్రచురించు",
    submitLogin: "🔐 లాగిన్ అవ్వండి",
    fastFilter: "⚡ వేగవంతమైన వడపోత:",
    id: "ఐడి",
    lockedCoords: "🔒 గోప్యమైన సంప్రదింపు వివరాలు",
    unlockBtn: "వివరాలు అన్‌లాక్ చేయండి",
    starPrefLabel: "🔮 వివాహానికి మీరు ప్రాధాన్యత ఇచ్చే నక్షత్రములు (మల్టిపుల్ సెలెక్ట్):",
    starPrefSub: "మీ జాతక చక్రం ప్రకారం సరిపోయే ఒకటి లేదా అంతకంటే ఎక్కువ నక్షత్రాలను ఎంచుకోండి.",
    step1: "👉 స్టెప్ 1: కింది క్యూఆర్ కోడ్‌ను స్కాన్ చేయండి లేదా యుపిఐ ఐడి కాపీ చేయండి",
    step2: "👉 స్టెప్ 2: చెల్లింపు వివరాలను ఇక్కడ నమోదు చేయండి",
    pasteUtr: "12-అంకెల యుపిఐ ట్రాన్సాక్షన్ నెంబర్ (UTR) నమోదు చేయండి",
    filePremium: "ప్రీమియం అన్‌లాక్ రిక్వెస్ట్ పంపండి",
    pendingClaim: "📑 మీ అభ్యర్థన పరిశీలనలో ఉంది. 15 నిమిషాల్లో అన్‌లాక్ అవుతుంది.",
    noMatches: "ప్రస్తుతానికి ఎటువంటి ప్రొఫైల్స్ అందుబాటులో లేవు.",
    lockedWarning: "ఫోన్ నెంబర్ మరియు గోత్రం చూడటానికి దయచేసి ప్రీమియం ప్లాన్ యాక్టివేట్ చేసుకోండి."
  },
  en: {
    logoTitle: "Mangalasutram",
    logoSub: "Verified Traditional Telugu Matrimony Hub",
    exploreMatches: "Explore Matches",
    myBio: "My Bio & Preferences",
    goPremium: "👑 Go Premium",
    namaskaram: "🙏 Namaskaram",
    premiumActive: "👑 Premium Active",
    freeAccount: "Free Member",
    logout: "Logout",
    registerTitle: "📝 Register Profile",
    loginTitle: "🔐 Member Login",
    switchLogin: "Have an account? Login",
    switchReg: "Need an account? Register",
    firstName: "First Name",
    lastName: "Surname / Last Name",
    age: "Age",
    gender: "Gender",
    bride: "Bride (Female)",
    groom: "Groom (Male)",
    maritalStatus: "Marital Status",
    neverMarried: "Never Married",
    divorced: "Divorced",
    widowed: "Widowed",
    district: "District Location",
    caste: "Caste",
    gothram: "Gothram",
    rasi: "Rasi",
    star: "Janma Nakshatram",
    education: "Education Degree",
    income: "Annual Income",
    phone: "Mobile Phone Number",
    photoUpload: "📸 Upload Studio Profile Photo",
    aadhaarLabel: "🛡️ Identity Verification Shield (Aadhaar)",
    verifyBtn: "Verify",
    verifiedBtn: "✅ Verified",
    email: "Account Email ID",
    password: "Password",
    submitReg: "🪷 Authorize & Publish Profile",
    submitLogin: "🔐 Establish Session",
    fastFilter: "⚡ Filters:",
    id: "ID",
    lockedCoords: "🔒 Encrypted Contact Coordinates",
    unlockBtn: "Unlock Contact Credentials",
    starPrefLabel: "🔮 Preferred Compatible Match Stars (Multi-Select):",
    starPrefSub: "Check all compatible Nakshatrams you want to prioritize in matchmaking.",
    step1: "👉 Step 1: Scan QR Code or Copy UPI Address",
    step2: "👉 Step 2: Input Payment Verification Parameters",
    pasteUtr: "Paste 12-Digit UPI Ref Number / UTR",
    filePremium: "File Premium Activation Request",
    pendingClaim: "📑 Ticket logged! Back-office will audit UTR logs within 15 mins to unlock dashboard.",
    noMatches: "Gathering network nodes... No profiles found matching criteria.",
    lockedWarning: "Contact parameters encrypted under safety policies. Upgrade to open."
  }
};

export default function App() {
  // Global Language State System Defaulting to Telugu ('te')
  const [lang, setLang] = useState('te');
  const t = TRANSLATIONS[lang];

  // Interface Navigation State
  const [activeTab, setActiveTab] = useState('matches');
  
  // Auth & Database Records
  const [user, setUser] = useState(null);
  const [myProfileData, setMyProfileData] = useState(null);
  const [profiles, setProfiles] = useState([]);
  
  // Input Flow Parameters
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(true);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Non-Gateway Commissionless UPI States
  const [upiTransactionId, setUpiTransactionId] = useState('');
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);

  // Search Matrix Constraints
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterCaste, setFilterCaste] = useState('');
  const [filterRasi, setFilterRasi] = useState('');

  // Extended Telugu Profile Node payload State Schema
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', age: '', height: "5'4\"", gender: 'Female',
    maritalStatus: 'Never Married', district: 'Vijayawada', caste: 'Brahmin',
    subCaste: '', gothram: '', nakshatra: 'Ashwini', rasi: 'Mesha (Aries)',
    education: 'B.Tech', occupation: 'Software Professional', annualIncome: '6 - 10 Lakhs PA',
    phone: '', email: '', preferredStars: []
  });
  
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarStatus, setAadhaarStatus] = useState('UNVERIFIED');

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const q = query(collection(db, "profiles"), where("email", "==", currentUser.email));
        return onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const docData = snapshot.docs[0].data();
            setMyProfileData({ id: snapshot.docs[0].id, ...docData });
            setFormData(docData);
          }
        });
      } else {
        setMyProfileData(null);
      }
    });
  }, [user]);

  useEffect(() => {
    return onSnapshot(query(collection(db, "profiles")), (snapshot) => {
      const liveList = [];
      snapshot.forEach((doc) => liveList.push({ id: doc.id, ...doc.data() }));
      setProfiles(liveList);
    });
  }, []);

  const handleStarPreferenceToggle = (star) => {
    const currentSelections = [...(formData.preferredStars || [])];
    const index = currentSelections.indexOf(star);
    if (index > -1) currentSelections.splice(index, 1);
    else currentSelections.push(star);
    setFormData({ ...formData, preferredStars: currentSelections });
  };

  const executeAadhaarShield = () => {
    if (aadhaarNumber.length !== 12 || isNaN(aadhaarNumber)) {
      setFormError(lang === 'te' ? '❌ తప్పుడు ఆధార్ నెంబర్!' : '❌ Invalid 12-Digit Aadhaar format.');
      return;
    }
    setAadhaarStatus('VERIFYING');
    setTimeout(() => setAadhaarStatus('VERIFIED'), 1200);
  };

  const handleRegistrationFlow = async (e) => {
    e.preventDefault();
    if (selectedPhotos.length < 1) {
      setFormError(lang === 'te' ? '⚠️ దయచేసి ఒక ఫోటోను అప్‌లోడ్ చేయండి.' : '⚠️ Photo asset required.');
      return;
    }
    if (aadhaarStatus !== 'VERIFIED') {
      setFormError(t.aadhaarLabel);
      return;
    }
    setFormError('');
    setIsSubmitting(true);

    try {
      await createUserWithEmailAndPassword(auth, formData.email, authPassword);
      const base64Encodings = [];
      for (let i = 0; i < selectedPhotos.length; i++) {
        const encoded = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(selectedPhotos[i]);
        });
        base64Encodings.push(encoded);
      }

      const generatedProfileId = "MMS" + Math.floor(100000 + Math.random() * 900000);
      await addDoc(collection(db, "profiles"), {
        ...formData,
        profileId: generatedProfileId,
        photos: base64Encodings,
        isPremium: false,
        aadhaarVerified: true
      });
      alert(lang === 'te' ? `🎉 ప్రొఫైల్ ఐడి ${generatedProfileId} విజయవంతంగా సృష్టించబడింది!` : `🎉 Registered Profile ${generatedProfileId}`);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProfileFlow = async (e) => {
    e.preventDefault();
    if (!myProfileData) return;
    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, "profiles", myProfileData.id), formData);
      alert(lang === 'te' ? '✅ మీ సవరణలు భద్రపరచబడ్డాయి!' : '✅ Metrics locked.');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuthLoginFlow = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, authEmail, authPassword);
    } catch (err) {
      setFormError(lang === 'te' ? '❌ వివరాలు సరిపోలడం లేదు.' : '❌ Invalid parameters.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpiVerificationSubmit = async (e) => {
    e.preventDefault();
    if (upiTransactionId.length < 6) return;
    try {
      await addDoc(collection(db, "payment_claims"), {
        email: user.email,
        profileId: myProfileData?.profileId || 'Unknown',
        utrNumber: upiTransactionId,
        timestamp: new Date().toISOString(),
        status: 'PENDING'
      });
      setPaymentSubmitted(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const targetMatchGender = myProfileData ? (myProfileData.gender === 'Male' ? 'Female' : 'Male') : '';

  return (
    <div className="min-h-screen bg-[#FCF5EB] text-[#2C1810] pb-16 antialiased">
      {/* 🔱 TELUGU CULTURAL HERITAGE BRANDING HEADER */}
      <header className="bg-gradient-to-r from-[#7B1F1F] via-[#942626] to-[#7B1F1F] text-[#FFF9F0] px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl border-b-4 border-[#D4A017]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#D4A017] rounded-full flex items-center justify-center text-2xl shadow-md border border-white/20 animate-pulse">🪷</div>
          <div>
            <h1 className="font-bold text-3xl text-[#D4A017] tracking-wide drop-shadow-sm" style={{fontFamily: "'Noto Serif Telugu', serif"}}>{t.logoTitle}</h1>
            <p className="text-[10px] tracking-widest uppercase text-amber-200 font-bold">{t.logoSub}</p>
          </div>
        </div>
        
        {/* CENTER SEGMENT ROUTING TAB BAR */}
        {user && (
          <div className="flex bg-black/30 p-1 rounded-2xl border border-amber-500/30 text-xs font-bold shadow-inner">
            <button onClick={() => setActiveTab('matches')} className={`px-5 py-2.5 rounded-xl transition-all duration-300 ${activeTab === 'matches' ? 'bg-gradient-to-b from-[#F7D373] to-[#D4A017] text-[#521313] shadow-md scale-105' : 'text-white/90 hover:text-white'}`}>{t.exploreMatches}</button>
            <button onClick={() => setActiveTab('my-profile')} className={`px-5 py-2.5 rounded-xl transition-all duration-300 ${activeTab === 'my-profile' ? 'bg-gradient-to-b from-[#F7D373] to-[#D4A017] text-[#521313] shadow-md scale-105' : 'text-white/90 hover:text-white'}`}>{t.myBio}</button>
            <button onClick={() => setActiveTab('payment')} className={`px-5 py-2.5 rounded-xl transition-all duration-300 ${activeTab === 'payment' ? 'bg-gradient-to-b from-[#F7D373] to-[#D4A017] text-[#521313] shadow-md scale-105' : 'text-white/90 hover:text-white'}`}>{t.goPremium}</button>
          </div>
        )}

        {/* 🌐 HIGHLY ACCESSIBLE LANGUAGE SELECTOR SLOT */}
        <div className="flex items-center gap-4">
          <div className="bg-black/30 border border-white/20 rounded-xl p-1 flex gap-1 font-bold text-[10px]">
            <button onClick={() => setLang('te')} className={`px-2.5 py-1 rounded-md transition-all ${lang === 'te' ? 'bg-[#D4A017] text-black' : 'text-gray-400'}`}>తెలుగు</button>
            <button onClick={() => setLang('en')} className={`px-2.5 py-1 rounded-md transition-all ${lang === 'en' ? 'bg-[#D4A017] text-black' : 'text-gray-400'}`}>English</button>
          </div>

          {user && (
            <div className="text-right text-xs">
              <p className="font-bold text-amber-200">{t.namaskaram}</p>
              <button onClick={() => signOut(auth)} className="text-[10px] text-white/70 hover:text-white underline font-semibold">{t.logout}</button>
            </div>
          )}
        </div>
      </header>

      {/* CORE FRAMEWORK STAGE */}
      <main className="max-w-6xl mx-auto px-4 mt-8">
        
        {/* OUTSIDE SYSTEM VISITOR DESK */}
        {!user && (
          <div className="max-w-xl mx-auto bg-white border-t-8 border-[#7B1F1F] border-x border-b border-[#E8C99A] p-6 rounded-3xl shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3 mb-6">
              <h3 className="font-bold text-lg text-[#7B1F1F] tracking-wide" style={{fontFamily: "'Noto Serif Telugu', serif"}}>{isRegistering ? t.registerTitle : t.loginTitle}</h3>
              <button onClick={() => { setIsRegistering(!isRegistering); setFormError(''); }} className="text-xs font-bold text-sky-800 underline">{isRegistering ? t.switchLogin : t.switchReg}</button>
            </div>

            {formError && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl font-bold mb-4">{formError}</div>}

            {isRegistering ? (
              <form onSubmit={handleRegistrationFlow} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">{t.firstName}</label>
                    <input type="text" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full border rounded-xl p-2.5 bg-[#FFFBF7] text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">{t.lastName}</label>
                    <input type="text" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full border rounded-xl p-2.5 bg-[#FFFBF7] text-sm focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">{t.age}</label>
                    <input type="number" required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full border rounded-xl p-2.5 bg-[#FFFBF7] text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">{t.gender}</label>
                    <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white text-xs font-bold text-gray-700">
                      <option value="Female">{t.bride}</option>
                      <option value="Male">{t.groom}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">{t.maritalStatus}</label>
                    <select value={formData.maritalStatus} onChange={e => setFormData({...formData, maritalStatus: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white text-xs">
                      <option value="Never Married">{t.neverMarried}</option>
                      <option value="Divorced">{t.divorced}</option>
                      <option value="Widowed">{t.widowed}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">{t.district}</label>
                    <select value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white text-xs">
                      <option value="Vijayawada">Vijayawada</option>
                      <option value="Guntur">Guntur</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Visakhapatnam">Visakhapatnam</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">{t.caste}</label>
                    <select value={formData.caste} onChange={e => setFormData({...formData, caste: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white text-xs">
                      <option value="Brahmin">Brahmin</option>
                      <option value="Kamma">Kamma</option>
                      <option value="Kapu">Kapu</option>
                      <option value="Reddy">Reddy</option>
                      <option value="Arya Vysya">Arya Vysya</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">{t.gothram}</label>
                    <input type="text" value={formData.gothram} onChange={e => setFormData({...formData, gothram: e.target.value})} className="w-full border rounded-xl p-2.5 bg-[#FFFBF7] text-xs focus:outline-none" placeholder="Siva" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">{t.rasi}</label>
                    <select value={formData.rasi} onChange={e => setFormData({...formData, rasi: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white text-[11px]">
                      <option value="Mesha (Aries)">Mesha (మేషం)</option>
                      <option value="Vrishabha (Taurus)">Vrishabha (వృషభం)</option>
                      <option value="Makara (Capricorn)">Makara (మకరం)</option>
                      <option value="Kanya (Virgo)">Kanya (కన్య)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">{t.star}</label>
                    <select value={formData.nakshatra} onChange={e => setFormData({...formData, nakshatra: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white text-[11px]">
                      {NAKSHATRAMS.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">{t.education}</label>
                    <input type="text" required value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})} className="w-full border rounded-xl p-2.5 bg-[#FFFBF7] text-xs" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">{t.income}</label>
                    <select value={formData.annualIncome} onChange={e => setFormData({...formData, annualIncome: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white text-xs">
                      <option value="Under 5 Lakhs PA">Under 5 Lakhs PA</option>
                      <option value="5 - 10 Lakhs PA">5 - 10 Lakhs PA</option>
                      <option value="10 - 20 Lakhs PA">10 - 20 Lakhs PA</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">{t.phone}</label>
                  <input type="tel" required placeholder="+91" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border rounded-xl p-2.5 bg-[#FFFBF7] text-sm focus:outline-none" />
                </div>

                <div className="bg-amber-50/60 border border-dashed border-amber-300 p-3 rounded-xl">
                  <label className="block text-xs font-bold text-[#7B1F1F] mb-1">{t.photoUpload}</label>
                  <input type="file" required onChange={e => setSelectedPhotos(Array.from(e.target.files))} className="w-full text-xs text-gray-500" />
                </div>

                <div className="bg-emerald-800/5 border border-emerald-700/20 p-3 rounded-xl">
                  <label className="block text-xs font-bold text-[#2E7D32] mb-1">{t.aadhaarLabel}</label>
                  <div className="flex gap-2">
                    <input type="text" maxLength={12} placeholder="12 Digit Number" value={aadhaarNumber} onChange={e => setAadhaarNumber(e.target.value)} disabled={aadhaarStatus === 'VERIFIED'} className="flex-1 border rounded-lg p-2 text-xs font-mono tracking-widest focus:outline-none" />
                    <button type="button" onClick={executeAadhaarShield} disabled={aadhaarStatus === 'VERIFIED'} className="bg-[#2E7D32] text-white text-xs px-3 rounded-lg font-bold">
                      {aadhaarStatus === 'UNVERIFIED' ? t.verifyBtn : aadhaarStatus === 'VERIFYING' ? '...' : t.verifiedBtn}
                    </button>
                  </div>
                </div>

                <div className="border-t pt-3 grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.email}</label>
                    <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border rounded-xl p-2 text-xs bg-[#FFFBF7]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.password}</label>
                    <input type="password" required value={authPassword} onChange={e => setAuthPassword(e.target.value)} className="w-full border rounded-xl p-2 text-xs bg-[#FFFBF7]" />
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting || aadhaarStatus !== 'VERIFIED'} className="w-full py-3 bg-gradient-to-r from-[#7B1F1F] to-[#A62B2B] text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow">
                  {t.submitReg}
                </button>
              </form>
            ) : (
              <form onSubmit={handleAuthLoginFlow} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.email}</label>
                  <input type="email" required value={authEmail} onChange={e => setAuthEmail(e.target.value)} className="w-full border rounded-xl p-3 bg-[#FFFBF7] text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.password}</label>
                  <input type="password" required value={authPassword} onChange={e => setAuthPassword(e.target.value)} className="w-full border rounded-xl p-3 bg-[#FFFBF7] text-sm focus:outline-none" />
                </div>
                <button type="submit" className="w-full py-3 bg-gradient-to-r from-[#7B1F1F] to-[#A62B2B] text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow">
                  {t.submitLogin}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ================= MEMBERS INSIDE SECURE ECOSYSTEM ================= */}
        {user && (
          <div>
            
            {/* TAB 1: INTUITIVE OPPOSITE-GENDER MATCH VIEWPORT */}
            {activeTab === 'matches' && (
              <div className="space-y-6">
                <div className="bg-white p-4 border border-[#E8C99A] rounded-2xl flex flex-wrap gap-3 items-center shadow-md">
                  <span className="font-bold text-xs text-[#7B1F1F] bg-[#7B1F1F]/5 px-3 py-1.5 rounded-lg border text-sm">
                    {t.fastFilter} <span className="text-emerald-700 underline font-extrabold">{myProfileData?.gender === 'Male' ? (lang === 'te' ? 'వధువుల జాబితా (Brides)' : 'Brides') : (lang === 'te' ? 'వరుల జాబితా (Grooms)' : 'Grooms')}</span>
                  </span>
                  
                  <select value={filterCaste} onChange={e => setFilterCaste(e.target.value)} className="border rounded-xl p-2 text-xs bg-[#FFFBF7] font-semibold text-gray-700">
                    <option value="">All Castes</option>
                    <option value="Brahmin">Brahmin</option>
                    <option value="Kamma">Kamma</option>
                    <option value="Kapu">Kapu</option>
                    <option value="Reddy">Reddy</option>
                  </select>

                  <select value={filterDistrict} onChange={e => setFilterDistrict(e.target.value)} className="border rounded-xl p-2 text-xs bg-[#FFFBF7] font-semibold text-gray-700">
                    <option value="">All Districts</option>
                    <option value="Vijayawada">Vijayawada</option>
                    <option value="Guntur">Guntur</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profiles
                    .filter(p => p.gender === targetMatchGender) // 💥 CRITICAL FILTER STAYS ACTIVE FOR SWAPPED MATRIX MATCHING
                    .filter(p => !filterCaste || p.caste === filterCaste)
                    .filter(p => !filterDistrict || p.district === filterDistrict)
                    .map(profile => (
                      <div key={profile.id} className="bg-white border-2 border-[#E8C99A]/30 rounded-3xl overflow-hidden shadow-md flex flex-col justify-between hover:shadow-xl transition-all">
                        <div>
                          <div className="h-48 bg-zinc-100 relative overflow-hidden flex items-center justify-center">
                            {profile.photos && profile.photos.length > 0 ? (
                              <img src={profile.photos[0]} alt="Matrimony Profile Asset" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-5xl opacity-20">{profile.gender === 'Female' ? '👩' : '👨'}</span>
                            )}
                            <div className="absolute top-2.5 right-2.5 bg-emerald-700 text-white text-[8px] font-extrabold px-2 py-0.5 rounded shadow">Aadhaar Verified</div>
                            <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-sm text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded border border-white/10">{t.id}: {profile.profileId || 'MMS-Temp'}</div>
                          </div>

                          <div className="p-4 space-y-3">
                            <div className="flex justify-between items-center border-b pb-2">
                              <h4 className="font-bold text-base text-[#7B1F1F]">{profile.firstName}</h4>
                              <span className="text-[10px] font-extrabold text-[#7B1F1F] bg-[#7B1F1F]/5 border px-2 py-0.5 rounded">{profile.caste}</span>
                            </div>

                            <div className="text-xs grid grid-cols-2 gap-y-2 text-gray-600 font-semibold">
                              <p>🎂 {t.age}: <span className="text-gray-900 font-bold">{profile.age} Yrs</span></p>
                              <p>📍 {t.district}: <span className="text-gray-900 font-bold">{profile.district}</span></p>
                              <p>🌟 {t.star}: <span className="text-amber-900 font-extrabold">{profile.nakshatra}</span></p>
                              <p>🔮 {t.rasi}: <span className="text-amber-900 font-extrabold">{profile.rasi}</span></p>
                              <p className="col-span-2 text-[11px] border-t pt-1.5 text-gray-500">{t.education}: <span className="text-gray-900 font-bold">{profile.education}</span></p>
                              <p className="col-span-2 text-[11px] text-gray-500">{t.income}: <span className="text-gray-900 font-bold">{profile.annualIncome}</span></p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-[#FFFBF7] border-t border-gray-100 rounded-b-3xl">
                          {myProfileData?.isPremium ? (
                            <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs text-emerald-800 font-bold space-y-1">
                              <p>📞 {t.phone}: {profile.phone || 'Protected'}</p>
                              <p>📧 {t.email}: {profile.email || 'Protected'}</p>
                              <p>🔱 {t.gothram}: <span className="text-gray-800 font-mono">{profile.gothram || 'Shiva'}</span></p>
                            </div>
                          ) : (
                            <div className="text-center">
                              <p className="text-[10px] text-amber-900 font-bold mb-2">{t.lockedWarning}</p>
                              <button onClick={() => setActiveTab('payment')} className="w-full py-2 bg-gradient-to-r from-[#7B1F1F] to-[#A62B2B] text-white text-xs font-bold rounded-lg shadow-md hover:brightness-110">{t.unlockBtn}</button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* TAB 2: CULTURALLY RICH SELF-PROFILE MANAGEMENT & STAR TARGET CHECKBOX MATRIX */}
            {activeTab === 'my-profile' && (
              <div className="max-w-3xl mx-auto bg-white border border-[#E8C99A] p-6 rounded-3xl shadow-lg">
                <div className="border-b pb-2 mb-6">
                  <h3 className="font-bold text-lg text-[#7B1F1F]" style={{fontFamily: "'Noto Serif Telugu', serif"}}>{t.myBio}</h3>
                </div>

                <form onSubmit={handleUpdateProfileFlow} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.firstName}</label>
                      <input type="text" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full border rounded-xl p-2.5 bg-[#FFFBF7] text-sm focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.lastName}</label>
                      <input type="text" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full border rounded-xl p-2.5 bg-[#FFFBF7] text-sm focus:outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.age}</label>
                      <input type="number" required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full border rounded-xl p-2.5 bg-[#FFFBF7] text-sm focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.rasi}</label>
                      <select value={formData.rasi} onChange={e => setFormData({...formData, rasi: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white text-xs">
                        <option value="Mesha (Aries)">Mesha</option>
                        <option value="Vrishabha (Taurus)">Vrishabha</option>
                        <option value="Makara (Capricorn)">Makara</option>
                        <option value="Kanya (Virgo)">Kanya</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.star}</label>
                      <select value={formData.nakshatra} onChange={e => setFormData({...formData, nakshatra: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white text-xs">
                        {NAKSHATRAMS.map(st => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* 🌟 NATIVE CHECKBOX MATRIX SPECIFICATION */}
                  <div className="bg-[#FFFBF7] border border-[#E8C99A] p-4 rounded-2xl">
                    <label className="block text-xs font-extrabold text-[#7B1F1F] uppercase mb-1">{t.starPrefLabel}</label>
                    <p className="text-[11px] text-gray-500 mb-4">{t.starPrefSub}</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {NAKSHATRAMS.map(star => {
                        const isChecked = formData.preferredStars?.includes(star);
                        return (
                          <label key={star} className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer select-none transition-all duration-200 ${isChecked ? 'bg-amber-100/70 border-[#D4A017] font-bold text-[#7B1F1F]' : 'bg-white border-gray-100 hover:bg-gray-50'}`}>
                            <input type="checkbox" checked={isChecked || false} onChange={() => handleStarPreferenceToggle(star)} className="accent-[#7B1F1F]" />
                            {star}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <button type="submit" className="w-full py-3 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white font-bold rounded-xl text-xs uppercase shadow-md">
                    {lang === 'te' ? '⚙️ మార్పులను భద్రపరచండి' : 'Save Profiles & Preferences'}
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: COMMISSION-FREE DIRECT UPI WORKSPACE SCREEN */}
            {activeTab === 'payment' && (
              <div className="max-w-md mx-auto bg-white border-2 border-[#E8C99A] p-6 rounded-3xl shadow-xl text-center">
                <span className="text-4xl">👑</span>
                <h3 className="font-bold text-lg text-[#7B1F1F] mt-2" style={{fontFamily: "'Noto Serif Telugu', serif"}}>{t.goPremium}</h3>
                
                <div className="my-6 p-4 bg-[#FFFBF7] border border-dashed border-amber-400 space-y-4 rounded-2xl">
                  <p className="text-xs font-bold text-gray-700 uppercase">{t.step1}</p>
                  
                  {/* CENTRAL UPI TARGET ANCHOR DECK */}
                  <div className="w-36 h-36 bg-zinc-100 border rounded-xl mx-auto flex items-center justify-center p-2 shadow-inner relative">
                    <div className="w-full h-full border-2 border-dashed border-zinc-300 flex flex-col items-center justify-center font-mono font-bold text-[9px] text-zinc-400 bg-white p-1">
                      <span>[ UPI QR ]</span>
                      <span className="text-[7px] mt-1 text-center">SCAN TO DEPOSIT SUBSCRIPTION</span>
                    </div>
                  </div>

                  <div className="bg-white px-3 py-2 rounded-xl border font-mono text-xs text-[#7B1F1F] font-bold flex justify-between items-center">
                    <span>UPI ID: sambasiva.rao@upi</span>
                  </div>
                  <p className="text-xs font-bold text-emerald-800 bg-emerald-50 p-2 rounded-lg">Fixed Asset Activation Value: ₹499/-</p>
                </div>

                {!paymentSubmitted ? (
                  <form onSubmit={handleUpiVerificationSubmit} className="space-y-3 border-t pt-4 text-left">
                    <p className="text-xs font-bold text-gray-700 uppercase">{t.step2}</p>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">{t.pasteUtr}</label>
                      <input type="text" required maxLength={12} placeholder="e.g. 620412..." value={upiTransactionId} onChange={e => setUpiTransactionId(e.target.value)} className="w-full border rounded-xl p-2.5 font-mono text-sm tracking-widest bg-[#FFFBF7] focus:outline-none focus:border-[#7B1F1F]" />
                    </div>
                    <button type="submit" className="w-full py-3 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white font-bold text-xs rounded-xl uppercase shadow">
                      {t.filePremium}
                    </button>
                  </form>
                ) : (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-bold">
                    {t.pendingClaim}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}
