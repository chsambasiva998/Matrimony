import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
// ✨ Added arrayUnion to handle appending profile IDs to interaction lists
import { collection, addDoc, doc, updateDoc, query, onSnapshot, where, orderBy, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

// 📍 DISTRICTS MATRIX
const DISTRICTS = [
  'Anantapur (అనంతపురం)', 'Annamayya (అన్నమయ్య)', 'Bapatla (బాపట్ల)', 'Chittoor (చిత్తూరు)', 
  'East Godavari (తూర్పు గోదావరి)', 'Eluru (ఏలూరు)', 'Guntur (గుంటూరు)', 'Hyderabad (హైదరాబాద్)',
  'Kakinada (కాకినాడ)', 'Kona Seema (కోనసీమ)', 'Krishna (కృష్ణా)', 'Kurnool (కర్నూలు)', 
  'Nandyal (నంద్యాల)', 'NTR Vijayawada (ఎన్టీఆర్ విజయవాడ)', 'Palnadu (పల్నాడు)', 
  'Parvathipuram Manyam (పార్వతీపురం మన్యం)', 'Prakasam (ప్రకాశం)', 'Sri Potti Sriramulu Nellore (నెల్లూరు)', 
  'Sri Sathya Sai (శ్రీ సత్యసాయి)', 'Srikakulam (శ్రీకాకుళం)', 'Tirupati (తిరుపతి)', 
  'Visakhapatnam (విశాఖపట్నం)', 'Vizianagaram (విజయనగరం)', 'West Godavari (పశ్చిమ గోదావరి)', 
  'YSR Kadapa (వైఎస్ఆర్ కడప)', 'Warangal (వరంగల్)', 'Khammam (ఖమ్మం)', 'Nalgonda (నల్గొండ)'
].sort();

// 🔱 CASTE MATRIX
const CASTE_MATRIX = {
  "Brahmin (బ్రాహ్మణ)": ["Niyogi", "Vaidiki", "Velanadu", "Dravida", "Madhva", "Sri Vaishnava", "Other"],
  "Kamma (కమ్మ)": ["Pedda Kamma", "Chinna Kamma", "Illuvellani", "Godachatu", "Other"],
  "Kapu / Balija / Telaga (కాపు)": ["Munnuru Kapu", "Turpu Kapu", "Balija Naidu", "Setty Balija", "Telaga", "Other"],
  "Reddy (రెడ్డి)": ["Motati", "Gudati", "Pedakanti", "Pokanati", "Ganjam", "Chowdhary Reddy", "Other"],
  "Arya Vysya (ఆర్య వైశ్య)": ["Komati", "Gavara", "Kalinga Vysya", "Other"],
  "Padmashali / Devanga (పద్మశాలి)": ["Padmashali", "Devanga", "Togata", "Pattu Sali", "Other"],
  "Yadava / Golla (యాదవ)": ["Golla", "Pooja Golla", "Yadav", "Other"],
  "Viswabrahmin (విశ్వబ్రాహ్మణ)": ["Kamsali", "Kammari", "Silpi", "Vadrangi", "Ausula"],
  "Goud (గౌడ్)": ["Ediga", "Settibalija", "Gamalla", "Goud"],
  "Mudiraj (ముదిరాజ్)": ["Mudiraju", "Mutrasi"],
  "Mala (మాల)": ["Netkani", "Paki", "Mala Dasari", "General Mala"],
  "Madiga (మాదిగ)": ["Chamar", "Madiga Dasari", "General Madiga"],
  "Boyar / Valmiki (బోయ)": ["Valmiki", "Boya", "Nishada"],
  "Kalinga (కళింగ)": ["Kalinga", "Buragam Kalinga"],
  "Turpu Kapu (తూర్పు కాపు)": ["General"],
  "Velama (వెలమ)": ["Padma Velama", "Koppala Velama", "Adi Velama"],
  "Vanniyar / Agnikula Kshatriya": ["Palli", "Vannikula Kshatriya"],
  "Other Caste / Inter-Caste": ["No Bar / General"]
};

// 🔮 NAKSHATRAMS
const NAKSHATRAMS = [
  'Ashwini (అశ్విని)', 'Bharani (భరణి)', 'Krittika (కృత్తిక)', 'Rohini (రోహిణి)', 
  'Mrigashira (మృగశిర)', 'Ardra (ఆరుద్ర)', 'Punarvasu (పునర్వసు)', 'Pushya (పుష్యమి)', 
  'Aslesha (ఆశ్లేష)', 'Magha (మఖ)', 'Purva Phalguni (పుబ్బ)', 'Uttara Phalguni (ఉత్తర)', 
  'Hasta (హస్త)', 'Chitra (చిత్త)', 'Swati (స్వాతి)', 'Visakha (విశాఖ)', 
  'Anuradha (అనూరాధ)', 'Jyeshta (జ్యేష్ఠ)', 'Mula (మూల)', 'Purva Ashadha (పూర్వాషాఢ)', 
  'Uttara Ashadha (ఉత్తరాషాఢ)', 'Sravana (శ్రవణం)', 'Dhanishta (ధనిష్ఠ)', 
  'Satabhisha (శతభిషం)', 'Purva Bhadrapada (పూర్వాభాద్ర)', 'Uttara Bhadrapada (ఉత్తరాభాద్ర)', 'Revati (రేవతి)'
];

// 📊 TRANSLATIONS (Updated with authentic Matrimony Terminology)
const TRANSLATIONS = {
  te: {
    logoTitle: "మంగళసూత్రం వివాహ వేదిక", logoSub: "నమ్మకమైన సంబంధాల కేంద్రం",
    exploreMatches: "వరుస సంబంధాలు", myBio: "నా ప్రొఫైల్ వివరాలు", goPremium: "👑 ప్రీమియం సభ్యత్వం",
    namaskaram: "🙏 నమస్కారం", premiumActive: "👑 ప్రీమియం సక్రియం", logout: "లాగౌట్",
    registerTitle: "📝 కొత్త ప్రొఫైల్ నమోదు", loginTitle: "🔐 సభ్యుల లాగిన్",
    switchLogin: "ఇప్పటికే ఖాతా ఉందా? లాగిన్ అవ్వండి", switchReg: "ఖాతా లేదా? ఇప్పుడే నమోదు చేసుకోండి",
    firstName: "అభ్యర్థి పేరు", lastName: "ఇంటి పేరు", age: "వయస్సు", gender: "లింగము",
    bride: "వధువు (Female)", groom: "వరుడు (Male)", maritalStatus: "వివాహ స్థితి",
    neverMarried: "అపరిణీత", divorced: "విడాకులు తీసుకున్న", widowed: "సహచరుడు కోల్పోయిన",
    district: "నివాస జిల్లా", caste: "కులం", subCaste: "ఉప కులం", gothram: "గోత్రం",
    rasi: "రాశి", star: "జన్మ నక్షత్రం", education: "విద్యార్హత", income: "సంవత్సర ఆదాయం",
    phone: "మొబైల్ నెంబర్", photoUpload: "📸 ప్రొఫైల్ ఫోటో",
    aadhaarLabel: "🛡️ ఆధార్ ధృవీకరణ", verifyBtn: "ధృవీకరించు", verifiedBtn: "✅ పూర్తయింది",
    email: "ఈమెయిల్ ఐడి", password: "పాస్‌వర్డ్ సెట్ చేయండి", submitReg: "🪷 ప్రొఫైల్‌ను ప్రచురించు",
    submitLogin: "🔐 లాగిన్ అవ్వండి", fastFilter: "⚡ వడపోత:", id: "ప్రొఫైల్ ఐడి",
    lockedCoords: "🔒 సంప్రదింపు వివరాలు", unlockBtn: "వివరాలు చూడండి & అన్‌లాక్ చేయండి",
    starPrefLabel: "🔮 మీకు సమ్మతమైన నక్షత్రములు:", starPrefSub: "మీ జాతక పొంతన ప్రకారం ఇష్టమైన నక్షత్రాలను టిక్ చేయండి.",
    step1: "👉 స్టెప్ 1: కింది UPI QR కోడ్‌కు చెల్లించండి", step2: "👉 స్టెప్ 2: చెల్లింపు రుజువును నమోదు చేయండి",
    pasteUtr: "12-అంకెల UPI UTR ఐడి పేస్ట్ చేయండి", filePremium: "ప్రీమియం అభ్యర్థన పంపండి",
    pendingClaim: "📑 వివరాలు అడ్మిన్ పరిశీలనలో ఉన్నాయి. 15 నిమిషాల్లో అన్‌లాక్ చేయబడుతుంది.",
    noMatches: "క్షమించండి, మీరు ఎంచుకున్న ఫిల్టర్లకు సరిపోయే సంబంధాలు ఇంకా నమోదు కాలేదు.",
    lockedWarning: "భద్రతా కారణాల దృష్ట్యా ఫోన్ నెంబర్ దాచబడింది. అన్‌లాక్ చేయడానికి కింది బటన్ నొక్కండి.",
    // New Matrimony Lifecycle Terms
    filterAll: "అన్ని సంబంధాలు (All)", filterFresh: "✨ కొత్త సంబంధాలు (Fresh)", filterNearby: "📍 నా జిల్లాలో (Near Me)",
    filterShortlisted: "💖 ఇష్టపడినవి (Shortlisted)", filterViewed: "👀 చూసినవి (Viewed)",
    filterPassed: "❌ వదిలేసినవి (Passed)", filterBlocked: "🚫 బ్లాక్ చేసినవి (Blocked)",
    btnShortlist: "ఇష్టపడినవి లోకి చేర్చు", btnPass: "వదిలేయండి", btnBlock: "బ్లాక్ చేయండి"
  },
  en: {
    logoTitle: "Mangalasutram Matrimony", logoSub: "Trusted Telugu Matchmaking",
    exploreMatches: "Explore Matches", myBio: "My Bio-Data Settings", goPremium: "👑 Go Premium",
    namaskaram: "🙏 Welcome", premiumActive: "👑 Premium Active", logout: "Logout",
    registerTitle: "📝 Register Verified Profile", loginTitle: "🔐 Secure Login",
    switchLogin: "Already a member? Login", switchReg: "New here? Register Free",
    firstName: "Candidate Name", lastName: "Surname", age: "Age", gender: "Gender",
    bride: "Bride (Female)", groom: "Groom (Male)", maritalStatus: "Marital Status",
    neverMarried: "Never Married", divorced: "Divorced", widowed: "Widowed",
    district: "Hometown District", caste: "Caste", subCaste: "Sub-Caste",
    gothram: "Gothram", rasi: "Rasi / Moon Sign", star: "Janma Nakshatram",
    education: "Education", income: "Annual Income",
    phone: "Mobile Number", photoUpload: "📸 Attach Primary Photo",
    aadhaarLabel: "🛡️ Identity Verification (Aadhaar)", verifyBtn: "Verify", verifiedBtn: "✅ Cleared",
    email: "Email", password: "Password", submitReg: "🪷 Deploy Profile",
    submitLogin: "🔐 Connect Session", fastFilter: "⚡ Refine Feed:", id: "UID",
    lockedCoords: "🔒 Encrypted Info", unlockBtn: "View Bio-Data & Unlock",
    starPrefLabel: "🔮 Multi-Select Match Stars:", starPrefSub: "Check compatible clusters.",
    step1: "👉 Step 1: Complete ₹499 UPI Deposit", step2: "👉 Step 2: Log Verification Ticket",
    pasteUtr: "Input 12-Digit UPI UTR", filePremium: "Submit Activation Slip",
    pendingClaim: "📑 Reference submitted! Ledger reconcile completes in 15 mins.",
    noMatches: "No matching profiles found within chosen filter variables.",
    lockedWarning: "Contact variables encrypted. Upgrade to clear encryption.",
    // New Matrimony Lifecycle Terms
    filterAll: "All Matches", filterFresh: "✨ Fresh Matches", filterNearby: "📍 Near Me (My District)",
    filterShortlisted: "💖 Shortlisted", filterViewed: "👀 Recently Viewed",
    filterPassed: "❌ Passed/Ignored", filterBlocked: "🚫 Blocked Profiles",
    btnShortlist: "Shortlist", btnPass: "Pass", btnBlock: "Block"
  }
};

const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800; 
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); 
      };
    };
  });
};

export default function App() {
  const [lang, setLang] = useState('te');
  const t = TRANSLATIONS[lang];

  const [activeTab, setActiveTab] = useState('matches');
  const [user, setUser] = useState(null);
  const [myProfileData, setMyProfileData] = useState(null);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [profiles, setProfiles] = useState([]);
  
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(true);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [upiTransactionId, setUpiTransactionId] = useState('');
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);

  // ✨ Advanced Lifecycle Feed Filters
  const [lifecycleCategory, setLifecycleCategory] = useState('FRESH'); 
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterCaste, setFilterCaste] = useState('');

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', age: '', height: "5'4\"", gender: 'Female',
    maritalStatus: 'Never Married', district: 'NTR Vijayawada (ఎన్టీఆర్ విజయవాడ)', 
    caste: 'Brahmin (బ్రాహ్మణ)', subCaste: 'Niyogi', gothram: '', 
    nakshatra: 'Ashwini (అశ్విని)', rasi: 'Mesha (Aries)',
    education: '', occupation: '', annualIncome: '5 - 10 Lakhs PA',
    phone: '', email: '', preferredStars: [],
    interactions: { shortlisted: [], passed: [], blocked: [], viewed: [] } // Hidden Relationship Matrix
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
            if (!isProfileLoaded) {
              setFormData({
                ...docData,
                interactions: docData.interactions || { shortlisted: [], passed: [], blocked: [], viewed: [] }
              });
              setIsProfileLoaded(true);
            }
          }
        });
      } else {
        setMyProfileData(null);
        setIsProfileLoaded(false);
      }
    });
  }, [user, isProfileLoaded]);

  useEffect(() => {
    const q = query(collection(db, "profiles"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const liveList = [];
      snapshot.forEach((doc) => liveList.push({ id: doc.id, ...doc.data() }));
      setProfiles(liveList);
    });
  }, []);

  // ✨ INTERACTION ENGINE: Permanently logs Shortlists, Passes, Blocks, and Views
  const logInteraction = async (targetProfileId, actionType) => {
    if (!myProfileData) return;
    try {
      const ref = doc(db, "profiles", myProfileData.id);
      const fieldPath = `interactions.${actionType}`;
      await updateDoc(ref, {
        [fieldPath]: arrayUnion(targetProfileId)
      });
      // Optionally show a small alert if they shortlisted
      if (actionType === 'shortlisted') alert(lang === 'te' ? '💖 ప్రొఫైల్ ఇష్టపడిన వాటిలో చేర్చబడింది!' : '💖 Profile Shortlisted!');
    } catch (err) {
      console.error("Interaction failed:", err);
    }
  };

  const handleStarPreferenceToggle = (star) => {
    const currentSelections = [...(formData.preferredStars || [])];
    const index = currentSelections.indexOf(star);
    if (index > -1) currentSelections.splice(index, 1);
    else currentSelections.push(star);
    setFormData({ ...formData, preferredStars: currentSelections });
  };

  const executeAadhaarShield = () => {
    if (aadhaarNumber.length !== 12 || isNaN(aadhaarNumber)) {
      setFormError(lang === 'te' ? '❌ ఆధార్ నంబర్ 12 అంకెలు ఉండాలి!' : '❌ Invalid 12-Digit Aadhaar.');
      return;
    }
    setAadhaarStatus('VERIFYING');
    setTimeout(() => setAadhaarStatus('VERIFIED'), 1000);
  };

  const handleRegistrationFlow = async (e) => {
    e.preventDefault();
    if (selectedPhotos.length < 1) {
      setFormError(lang === 'te' ? '⚠️ ప్రొఫైల్ ఫోటో జతపరచండి.' : '⚠️ Photo asset missing.');
      return;
    }
    if (aadhaarStatus !== 'VERIFIED') {
      setFormError(lang === 'te' ? '🛡️ ఆధార్ వెరిఫికేషన్ పూర్తి చేయండి.' : '🛡️ Identity validation incomplete.');
      return;
    }
    setFormError('');
    setIsSubmitting(true);

    try {
      const base64Encodings = [];
      for (let i = 0; i < selectedPhotos.length; i++) {
        const compressedData = await compressImage(selectedPhotos[i]);
        base64Encodings.push(compressedData);
      }
      
      await createUserWithEmailAndPassword(auth, formData.email, authPassword);
      
      const generatedProfileId = "MMS" + Math.floor(100000 + Math.random() * 900000);
      await addDoc(collection(db, "profiles"), {
        ...formData,
        profileId: generatedProfileId,
        photos: base64Encodings,
        isPremium: false,
        aadhaarVerified: true,
        createdAt: serverTimestamp(),
        interactions: { shortlisted: [], passed: [], blocked: [], viewed: [] }
      });
      alert(lang === 'te' ? `🎉 ఐడి: ${generatedProfileId}` : `🎉 Profile deployed: ${generatedProfileId}`);
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
      alert(lang === 'te' ? '✅ ప్రాధాన్యతలు నవీకరించబడ్డాయి!' : '✅ Match records updated.');
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
      setFormError(lang === 'te' ? '❌ వివరాలు సరిపోలలేదు.' : '❌ Credentials error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpiVerificationSubmit = async (e) => {
    e.preventDefault();
    if (upiTransactionId.length < 8) return;
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

  const targetMatchGender = myProfileData ? (myProfileData.gender === 'Male' ? 'Female' : 'Male') : 'Loading'; 

  // ✨ ADVANCED MATCH ENGINE FILTER LOGIC
  const getFilteredProfiles = () => {
    if (targetMatchGender === 'Loading') return [];
    
    // Safely extract matrices or default to empty arrays
    const iMatrix = myProfileData?.interactions || { shortlisted: [], passed: [], blocked: [], viewed: [] };
    
    return profiles.filter(p => {
      // Base Rule 1: Always ensure opposite gender
      if (p.gender !== targetMatchGender) return false;
      
      // Base Rule 2: Search criteria filters
      if (filterCaste && p.caste !== filterCaste) return false;
      if (filterDistrict && p.district !== filterDistrict) return false;

      // Lifecycle Tab Rules
      const pid = p.profileId;
      if (lifecycleCategory === 'ALL') {
        // Exclude strictly passed or blocked, show everything else
        return !iMatrix.passed.includes(pid) && !iMatrix.blocked.includes(pid);
      }
      if (lifecycleCategory === 'FRESH') {
        // Exclude anyone they've interacted with in any way
        return !iMatrix.shortlisted.includes(pid) && !iMatrix.passed.includes(pid) && !iMatrix.blocked.includes(pid) && !iMatrix.viewed.includes(pid);
      }
      if (lifecycleCategory === 'NEARBY') {
        // Must be in the exact same district as the logged-in user, and not blocked/passed
        if (p.district !== myProfileData?.district) return false;
        return !iMatrix.passed.includes(pid) && !iMatrix.blocked.includes(pid);
      }
      if (lifecycleCategory === 'SHORTLISTED') return iMatrix.shortlisted.includes(pid);
      if (lifecycleCategory === 'VIEWED') return iMatrix.viewed.includes(pid) && !iMatrix.blocked.includes(pid);
      if (lifecycleCategory === 'PASSED') return iMatrix.passed.includes(pid);
      if (lifecycleCategory === 'BLOCKED') return iMatrix.blocked.includes(pid);

      return true;
    });
  };

  const visibleProfiles = getFilteredProfiles();

  return (
    <div className="min-h-screen bg-[#FCF5EB] text-[#2C1810] pb-16 antialiased">
      <header className="bg-gradient-to-r from-[#7B1F1F] via-[#912525] to-[#7B1F1F] text-[#FFF9F0] px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl border-b-4 border-[#D4A017]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#D4A017] rounded-full flex items-center justify-center text-2xl shadow-md border border-white/20">🪷</div>
          <div>
            <h1 className="font-bold text-3xl text-[#D4A017] tracking-wide" style={{fontFamily: "'Noto Serif Telugu', serif"}}>{t.logoTitle}</h1>
            <p className="text-[10px] tracking-widest uppercase text-amber-200 font-bold">{t.logoSub}</p>
          </div>
        </div>
        
        {user && (
          <div className="flex bg-black/30 p-1 rounded-2xl border border-amber-500/20 text-xs font-bold shadow-inner overflow-x-auto">
            <button onClick={() => setActiveTab('matches')} className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${activeTab === 'matches' ? 'bg-[#D4A017] text-[#521313] shadow' : 'text-white/90'}`}>{t.exploreMatches}</button>
            <button onClick={() => setActiveTab('my-profile')} className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${activeTab === 'my-profile' ? 'bg-[#D4A017] text-[#521313] shadow' : 'text-white/90'}`}>{t.myBio}</button>
            <button onClick={() => setActiveTab('payment')} className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${activeTab === 'payment' ? 'bg-[#D4A017] text-[#521313] shadow' : 'text-white/90'}`}>{t.goPremium}</button>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="bg-black/40 border border-white/10 rounded-xl p-1 flex gap-1 font-bold text-[10px]">
            <button onClick={() => setLang('te')} className={`px-3 py-1 rounded-md transition-all ${lang === 'te' ? 'bg-[#D4A017] text-black' : 'text-gray-400'}`}>తెలుగు</button>
            <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-md transition-all ${lang === 'en' ? 'bg-[#D4A017] text-black' : 'text-gray-400'}`}>English</button>
          </div>
          {user && (
            <div className="text-right text-xs">
              <p className="font-bold text-amber-100">{t.namaskaram}</p>
              <button onClick={() => signOut(auth)} className="text-[10px] text-white/60 hover:text-white underline">{t.logout}</button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8">
        
        {/* ================= GUEST PORTAL (Registration / Login) ================= */}
        {!user && (
           <div className="max-w-xl mx-auto bg-white border-t-8 border-[#7B1F1F] border-x border-b border-[#E8C99A]/60 p-6 rounded-3xl shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3 mb-6">
              <h3 className="font-bold text-lg text-[#7B1F1F]" style={{fontFamily: "'Noto Serif Telugu', serif"}}>{isRegistering ? t.registerTitle : t.loginTitle}</h3>
              <button onClick={() => { setIsRegistering(!isRegistering); setFormError(''); }} className="text-xs font-bold text-sky-800 underline">{isRegistering ? t.switchLogin : t.switchReg}</button>
            </div>

            {formError && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl font-bold mb-4">{formError}</div>}

            {isRegistering ? (
              <form onSubmit={handleRegistrationFlow} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">{t.firstName}</label>
                    <input type="text" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full border rounded-xl p-2.5 bg-[#FFFBF7] text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">{t.lastName}</label>
                    <input type="text" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full border rounded-xl p-2.5 bg-[#FFFBF7] text-sm focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">{t.age}</label>
                    <input type="number" required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full border rounded-xl p-2.5 bg-[#FFFBF7] text-sm" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">{t.gender}</label>
                    <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white text-xs font-bold text-gray-700">
                      <option value="Female">{t.bride}</option>
                      <option value="Male">{t.groom}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">{t.maritalStatus}</label>
                    <select value={formData.maritalStatus} onChange={e => setFormData({...formData, maritalStatus: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white text-xs">
                      <option value="Never Married">{t.neverMarried}</option>
                      <option value="Divorced">{t.divorced}</option>
                      <option value="Widowed">{t.widowed}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">{t.caste}</label>
                    <select value={formData.caste} onChange={e => {
                      const selectedCaste = e.target.value;
                      setFormData({...formData, caste: selectedCaste, subCaste: CASTE_MATRIX[selectedCaste]?.[0] || 'General'});
                    }} className="w-full border rounded-xl p-2.5 bg-white text-xs">
                      {Object.keys(CASTE_MATRIX).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">{t.subCaste}</label>
                    <select value={formData.subCaste} onChange={e => setFormData({...formData, subCaste: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white text-xs">
                      {CASTE_MATRIX[formData.caste]?.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">{t.district}</label>
                    <select value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white text-xs">
                      {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">{t.gothram}</label>
                    <input type="text" required placeholder="e.g. Bharadwaja" value={formData.gothram} onChange={e => setFormData({...formData, gothram: e.target.value})} className="w-full border rounded-xl p-2.5 bg-[#FFFBF7] text-xs focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">{t.rasi}</label>
                    <select value={formData.rasi} onChange={e => setFormData({...formData, rasi: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white text-xs">
                      <option value="Mesha (Aries)">Mesha (మేషం)</option>
                      <option value="Vrishabha (Taurus)">Vrishabha (వృషభం)</option>
                      <option value="Mithuna (Gemini)">Mithuna (మిథునం)</option>
                      <option value="Karka (Cancer)">Karka (కర్కాటకం)</option>
                      <option value="Simha (Leo)">Simha (సింహం)</option>
                      <option value="Kanya (Virgo)">Kanya (కన్య)</option>
                      <option value="Tula (Libra)">Tula (తుల)</option>
                      <option value="Vrishchika (Scorpio)">Vrishchika (వృశ్చికం)</option>
                      <option value="Dhanu (Sagittarius)">Dhanu (ధనుస్సు)</option>
                      <option value="Makara (Capricorn)">Makara (మకరం)</option>
                      <option value="Kumbha (Aquarius)">Kumbha (కుంభం)</option>
                      <option value="Meena (Pisces)">Meena (మీనం)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">{t.star}</label>
                    <select value={formData.nakshatra} onChange={e => setFormData({...formData, nakshatra: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white text-xs">
                      {NAKSHATRAMS.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">{t.education}</label>
                    <input type="text" required placeholder="e.g. B.Tech" value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})} className="w-full border rounded-xl p-2.5 bg-[#FFFBF7] text-xs focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">{t.income}</label>
                    <select value={formData.annualIncome} onChange={e => setFormData({...formData, annualIncome: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white text-xs">
                      <option value="Under 5 Lakhs PA">Under 5 Lakhs PA</option>
                      <option value="5 - 10 Lakhs PA">5 - 10 Lakhs PA</option>
                      <option value="10 - 20 Lakhs PA">10 - 20 Lakhs PA</option>
                      <option value="20+ Lakhs PA">20+ Lakhs PA</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">{t.phone}</label>
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
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t.email}</label>
                    <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border rounded-xl p-2 text-xs bg-[#FFFBF7]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t.password}</label>
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
                  <label className="block text-xs font-bold text-gray-500 mb-1">{t.email}</label>
                  <input type="email" required value={authEmail} onChange={e => setAuthEmail(e.target.value)} className="w-full border rounded-xl p-3 bg-[#FFFBF7] text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">{t.password}</label>
                  <input type="password" required value={authPassword} onChange={e => setAuthPassword(e.target.value)} className="w-full border rounded-xl p-3 bg-[#FFFBF7] text-sm focus:outline-none" />
                </div>
                <button type="submit" className="w-full py-3 bg-gradient-to-r from-[#7B1F1F] to-[#A62B2B] text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow">
                  {t.submitLogin}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ================= USER ACTIVE LOGGED-IN WORKSPACE ================= */}
        {user && (
          <div>
            {/* TAB 1: ADVANCED LIFECYCLE MATCH ENGINE */}
            {activeTab === 'matches' && (
              <div className="space-y-6">
                
                {/* LIFECYCLE & SEARCH MATRIX COMMAND BAR */}
                <div className="bg-white p-3 border border-[#E8C99A] rounded-2xl flex flex-col md:flex-row gap-3 shadow-md">
                  
                  {/* Category Filter Tabs */}
                  <div className="flex-1 flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {['FRESH', 'ALL', 'NEARBY', 'SHORTLISTED', 'VIEWED', 'PASSED', 'BLOCKED'].map(cat => (
                      <button 
                        key={cat} 
                        onClick={() => setLifecycleCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${lifecycleCategory === cat ? 'bg-[#7B1F1F] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {cat === 'FRESH' && t.filterFresh}
                        {cat === 'ALL' && t.filterAll}
                        {cat === 'NEARBY' && t.filterNearby}
                        {cat === 'SHORTLISTED' && t.filterShortlisted}
                        {cat === 'VIEWED' && t.filterViewed}
                        {cat === 'PASSED' && t.filterPassed}
                        {cat === 'BLOCKED' && t.filterBlocked}
                      </button>
                    ))}
                  </div>
                  
                  {/* Deep Filters */}
                  <div className="flex gap-2 border-t md:border-t-0 md:border-l border-gray-200 pt-3 md:pt-0 md:pl-3">
                    <select value={filterCaste} onChange={e => setFilterCaste(e.target.value)} className="border rounded-xl p-2 text-xs bg-[#FFFBF7] font-semibold text-gray-700 max-w-[120px]">
                      <option value="">All Castes</option>
                      {Object.keys(CASTE_MATRIX).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <select value={filterDistrict} onChange={e => setFilterDistrict(e.target.value)} className="border rounded-xl p-2 text-xs bg-[#FFFBF7] font-semibold text-gray-700 max-w-[120px]">
                      <option value="">All Districts</option>
                      {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {targetMatchGender !== 'Loading' && visibleProfiles.length === 0 ? (
                    <div className="col-span-full text-center bg-white border border-dashed p-12 text-gray-400 rounded-3xl italic">{t.noMatches}</div>
                  ) : (
                    visibleProfiles.map(profile => (
                      <div key={profile.id} className="bg-white border-2 border-[#E8C99A]/20 rounded-3xl overflow-hidden shadow-md flex flex-col justify-between hover:shadow-xl transition-all duration-300 relative group">
                        
                        {/* Interaction Badge Overlay */}
                        {myProfileData?.interactions?.shortlisted?.includes(profile.profileId) && <div className="absolute top-2 left-2 z-10 bg-pink-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow">💖 Shortlisted</div>}
                        
                        <div>
                          <div className="h-52 bg-zinc-100 relative overflow-hidden flex items-center justify-center">
                            {profile.photos && profile.photos.length > 0 ? (
                              <img src={profile.photos[0]} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-5xl opacity-20">{profile.gender === 'Female' ? '👩' : '👨'}</span>
                            )}
                            <div className="absolute top-2.5 right-2.5 bg-emerald-700 text-white text-[8px] font-extrabold px-2 py-0.5 rounded shadow">Aadhaar Verified</div>
                            <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-sm text-amber-200 text-[10px] font-mono px-2 py-0.5 rounded border border-white/10">{t.id}: {profile.profileId || 'MMS-Temp'}</div>
                          </div>

                          <div className="p-4 space-y-3">
                            <div className="flex justify-between items-center border-b pb-2">
                              <h4 className="font-bold text-base text-[#7B1F1F]">{profile.firstName}</h4>
                              <span className="text-[10px] font-extrabold text-[#7B1F1F] bg-[#7B1F1F]/5 border px-2 py-0.5 rounded max-w-[120px] truncate">{profile.caste}</span>
                            </div>

                            <div className="text-xs grid grid-cols-2 gap-y-2 text-gray-600 font-semibold">
                              <p>🎂 {t.age}: <span className="text-gray-900 font-bold">{profile.age} Yrs</span></p>
                              <p>📍 {t.district}: <span className="text-gray-900 font-bold">{profile.district?.split(' ')[0]}</span></p>
                              <p>🌟 {t.star}: <span className="text-amber-900 font-extrabold truncate block w-full">{profile.nakshatra?.split(' ')[0]}</span></p>
                              <p>🔮 {t.rasi}: <span className="text-amber-900 font-extrabold truncate block w-full">{profile.rasi?.split(' ')[0]}</span></p>
                              <p className="col-span-2 text-[11px] border-t pt-1.5 text-gray-500">{t.education}: <span className="text-gray-900 font-bold">{profile.education}</span></p>
                              <p className="col-span-2 text-[11px] text-gray-500">{t.income}: <span className="text-gray-900 font-bold">{profile.annualIncome}</span></p>
                            </div>
                          </div>
                        </div>

                        {/* ✨ ACTION BUTTONS (Shortlist / Pass / Block) */}
                        <div className="px-4 py-2 bg-gray-50 flex justify-between gap-2 border-t border-gray-100">
                          <button onClick={() => logInteraction(profile.profileId, 'shortlisted')} className="flex-1 bg-pink-100 text-pink-700 hover:bg-pink-200 py-1.5 rounded-lg text-[10px] font-bold transition">{t.btnShortlist}</button>
                          <button onClick={() => logInteraction(profile.profileId, 'passed')} className="flex-1 bg-gray-200 text-gray-600 hover:bg-gray-300 py-1.5 rounded-lg text-[10px] font-bold transition">{t.btnPass}</button>
                          <button onClick={() => logInteraction(profile.profileId, 'blocked')} className="flex-1 bg-red-100 text-red-700 hover:bg-red-200 py-1.5 rounded-lg text-[10px] font-bold transition">{t.btnBlock}</button>
                        </div>

                        <div className="p-4 bg-[#FFFBF7] border-t border-gray-100 rounded-b-3xl">
                          {myProfileData?.isPremium ? (
                            <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs text-emerald-800 font-bold space-y-1">
                              <p>📞 {t.phone}: {profile.phone || 'Protected'}</p>
                              <p>📧 {t.email}: {profile.email || 'Protected'}</p>
                              <p>🔱 {t.gothram}: <span className="text-gray-800 font-mono">{profile.gothram || 'Shiva'}</span></p>
                              <p>🧬 {t.subCaste}: <span className="text-purple-900">{profile.subCaste || 'General'}</span></p>
                            </div>
                          ) : (
                            <div className="text-center">
                              <p className="text-[10px] text-amber-900 font-bold mb-2">{t.lockedWarning}</p>
                              <button 
                                onClick={() => {
                                  // Mark as viewed when they try to unlock
                                  logInteraction(profile.profileId, 'viewed');
                                  setActiveTab('payment');
                                }} 
                                className="w-full py-2 bg-gradient-to-r from-[#7B1F1F] to-[#A62B2B] text-white text-xs font-bold rounded-lg shadow-md hover:brightness-110"
                              >
                                {t.unlockBtn}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: MANAGEMENT PORTAL */}
            {activeTab === 'my-profile' && (
              <div className="max-w-3xl mx-auto bg-white border border-[#E8C99A] p-6 rounded-3xl shadow-lg">
                <div className="border-b pb-2 mb-6">
                  <h3 className="font-bold text-lg text-[#7B1F1F]" style={{fontFamily: "'Noto Serif Telugu', serif"}}>{t.myBio}</h3>
                </div>

                <form onSubmit={handleUpdateProfileFlow} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">{t.firstName}</label>
                      <input type="text" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full border rounded-xl p-2.5 bg-[#FFFBF7] text-sm focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">{t.lastName}</label>
                      <input type="text" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full border rounded-xl p-2.5 bg-[#FFFBF7] text-sm focus:outline-none" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">{t.gender}</label>
                      <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white text-xs font-bold text-gray-700">
                        <option value="Female">{t.bride}</option>
                        <option value="Male">{t.groom}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">{t.maritalStatus}</label>
                      <select value={formData.maritalStatus} onChange={e => setFormData({...formData, maritalStatus: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white text-xs">
                        <option value="Never Married">{t.neverMarried}</option>
                        <option value="Divorced">{t.divorced}</option>
                        <option value="Widowed">{t.widowed}</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">{t.age}</label>
                      <input type="number" required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full border rounded-xl p-2.5 bg-[#FFFBF7] text-sm focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">{t.rasi}</label>
                      <select value={formData.rasi} onChange={e => setFormData({...formData, rasi: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white text-xs">
                        <option value="Mesha (Aries)">Mesha (మేషం)</option>
                        <option value="Vrishabha (Taurus)">Vrishabha (వృషభం)</option>
                        <option value="Mithuna (Gemini)">Mithuna (మిథునం)</option>
                        <option value="Karka (Cancer)">Karka (కర్కాటకం)</option>
                        <option value="Simha (Leo)">Simha (సింహం)</option>
                        <option value="Kanya (Virgo)">Kanya (కన్య)</option>
                        <option value="Tula (Libra)">Tula (తుల)</option>
                        <option value="Vrishchika (Scorpio)">Vrishchika (వృశ్చికం)</option>
                        <option value="Dhanu (Sagittarius)">Dhanu (ధనుస్సు)</option>
                        <option value="Makara (Capricorn)">Makara (మకరం)</option>
                        <option value="Kumbha (Aquarius)">Kumbha (కుంభం)</option>
                        <option value="Meena (Pisces)">Meena (మీనం)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">{t.star}</label>
                      <select value={formData.nakshatra} onChange={e => setFormData({...formData, nakshatra: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white text-xs">
                        {NAKSHATRAMS.map(st => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">{t.caste}</label>
                      <select value={formData.caste} onChange={e => {
                        const selectedCaste = e.target.value;
                        setFormData({...formData, caste: selectedCaste, subCaste: CASTE_MATRIX[selectedCaste]?.[0] || 'General'});
                      }} className="w-full border rounded-xl p-2.5 bg-white text-xs">
                        {Object.keys(CASTE_MATRIX).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">{t.subCaste}</label>
                      <select value={formData.subCaste} onChange={e => setFormData({...formData, subCaste: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white text-xs">
                        {CASTE_MATRIX[formData.caste]?.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">{t.district}</label>
                      <select value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white text-xs">
                        {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">{t.phone}</label>
                      <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border rounded-xl p-2.5 bg-[#FFFBF7] text-sm focus:outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">{t.education}</label>
                      <input type="text" required value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})} className="w-full border rounded-xl p-2.5 bg-[#FFFBF7] text-sm focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">{t.income}</label>
                      <select value={formData.annualIncome} onChange={e => setFormData({...formData, annualIncome: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white text-xs">
                        <option value="Under 5 Lakhs PA">Under 5 Lakhs PA</option>
                        <option value="5 - 10 Lakhs PA">5 - 10 Lakhs PA</option>
                        <option value="10 - 20 Lakhs PA">10 - 20 Lakhs PA</option>
                        <option value="20+ Lakhs PA">20+ Lakhs PA</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-[#FFFBF7] border border-[#E8C99A] p-4 rounded-2xl">
                    <label className="block text-xs font-extrabold text-[#7B1F1F] uppercase mb-1">{t.starPrefLabel}</label>
                    <p className="text-[11px] text-gray-500 mb-4">{t.starPrefSub}</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {NAKSHATRAMS.map(star => {
                        const isChecked = formData.preferredStars?.includes(star);
                        return (
                          <label key={star} className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer select-none transition-all duration-200 ${isChecked ? 'bg-amber-100/70 border-[#D4A017] font-bold text-[#7B1F1F]' : 'bg-white border-gray-100 hover:bg-gray-50'}`}>
                            <input type="checkbox" checked={isChecked || false} onChange={() => handleStarPreferenceToggle(star)} className="accent-[#7B1F1F]" />
                            {star.split(' ')[0]}
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

            {/* TAB 3: CUSTOM UPI CHECKOUT */}
            {activeTab === 'payment' && (
              <div className="max-w-md mx-auto bg-white border-2 border-[#E8C99A] p-6 rounded-3xl shadow-xl text-center">
                <span className="text-4xl">👑</span>
                <h3 className="font-bold text-lg text-[#7B1F1F] mt-2" style={{fontFamily: "'Noto Serif Telugu', serif"}}>{t.goPremium}</h3>
                
                <div className="my-6 p-4 bg-[#FFFBF7] border border-dashed border-amber-400 space-y-4 rounded-2xl">
                  <p className="text-xs font-bold text-gray-700 uppercase">{t.step1}</p>
                  
                  <div className="w-36 h-36 bg-zinc-50 border rounded-xl mx-auto flex flex-col items-center justify-center p-1 shadow-inner">
                    <div className="w-full h-full border border-dashed border-zinc-300 flex flex-col items-center justify-center font-mono font-bold text-[9px] text-zinc-400 bg-white p-1">
                      <span>[ UPI QR CODE ]</span>
                      <span className="text-[7px] font-sans text-center mt-1 text-gray-500">Scan via PhonePe / GPay / Paytm</span>
                    </div>
                  </div>

                  <div className="bg-white px-3 py-2 rounded-xl border font-mono text-xs text-[#7B1F1F] font-bold">
                    <span>UPI ID: sambasiva.rao@upi</span>
                  </div>
                  <p className="text-xs font-bold text-emerald-800 bg-emerald-50 p-2 rounded-lg">Subscription Value: ₹499/-</p>
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
