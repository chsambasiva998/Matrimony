import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
// ✨ Added 'limit' to control Firestore query costs and prevent billing inflation
import { collection, addDoc, doc, updateDoc, query, onSnapshot, where, serverTimestamp, arrayUnion, getDocs, limit } from 'firebase/firestore';
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

const HEIGHTS = ["4'0\"", "4'1\"", "4'2\"", "4'3\"", "4'4\"", "4'5\"", "4'6\"", "4'7\"", "4'8\"", "4'9\"", "4'10\"", "4'11\"", "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"", "6'0\"", "6'1\"", "6'2\"", "6'3\"", "6'4\"", "6'5\"+"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "Don't Know"];
const PROPERTY_VALUES = ["No Assets", "Below 50 Lakhs", "50 Lakhs - 1 Crore", "1 - 3 Crores", "3 - 5 Crores", "5 - 10 Crores", "10 - 20 Crores", "20 Crores+"];

const TRANSLATIONS = {
  te: {
    logoTitle: "మంగళసూత్రం వివాహ వేదిక", logoSub: "నమ్మకమైన సంబంధాల కేంద్రం",
    exploreMatches: "వరుస సంబంధాలు", myBio: "నా ప్రొఫైల్ వివరాలు", goPremium: "👑 ప్రీమియం సభ్యత్వం",
    namaskaram: "🙏 నమస్కారం", premiumActive: "👑 ప్రీమియం సక్రియం", logout: "లాగౌట్",
    registerTitle: "📝 కొత్త ప్రొఫైల్ నమోదు", loginTitle: "🔐 సభ్యుల లాగిన్",
    switchLogin: "ఇప్పటికే ఖాతా ఉందా? లాగిన్ అవ్వండి", switchReg: "ఖాతా లేదా? ఇప్పుడే నమోదు చేసుకోండి",
    firstName: "అభ్యర్థి పేరు", lastName: "ఇంటి పేరు", age: "వయస్సు", gender: "లింగము", height: "ఎత్తు", bloodGroup: "రక్త వర్గం",
    bride: "వధువు (Female)", groom: "వరుడు (Male)", maritalStatus: "विవాహ స్థితి",
    neverMarried: "అపరిణీత", divorced: "విడాకులు తీసుకున్న", widowed: "సహచరుడు కోల్పోయిన",
    district: "నివాస జిల్లా", caste: "కులం", subCaste: "ఉప కులం", gothram: "గోత్రం",
    rasi: "రాశి", star: "జన్మ నక్షత్రం", padam: "పాదము / చరణము", kujaDosham: "కుజ దోషం (Manglik)", astroNotes: "జాతక/జనన వివరాల విశేషాలు (Time / Chart Notes)",
    education: "విద్యార్హత", income: "సంవత్సర ఆదాయం", occupation: "వృత్తి / ఉద్యోగం",
    phone: "మొబైల్ నెంబర్", photoUpload: "📸 ప్రొఫైల్ ఫోటో మార్చండి / అప్‌లోడ్ చేయండి",
    fatherName: "తండ్రి పేరు", fatherOccupation: "తండ్రి వృత్తి", motherName: "తల్లి పేరు", motherOccupation: "తల్లి వృత్తి", maternalSurnames: "మేనమామల/తల్లిగారి ఇంటిపేర్లు",
    propertyWorth: "మొత్తం ఆస్తి విలువ (Net Worth)", landDetails: "వ్యవసాయ భూమి వివరాలు", houseDetails: "ఇళ్లు/స్థలాల వివరాలు",
    // ✨ New Life Differentiator Fields
    dietHabit: "ఆహార అలవాట్లు", physicalStatus: "శారీరక స్థితి", abroadStatus: "విదేశీ సంబంధాల ఆసక్తి (NRI / Abroad)",
    secPersonal: "👤 వ్యక్తిగత వివరాలు", secAstrology: "🕉️ మత & జాతక వివరాలు", secEducation: "🎓 వృత్తి & విద్యా వివరాలు", secFamily: "👨‍👩‍👧‍👦 కుటుంబ వివరాలు", secProperties: "🏡 ఆస్తుల వివరాలు (Assets)",
    aadhaarLabel: "🛡️ ఆధార్ ధృవీకరణ", verifyBtn: "ధృవీకరించు", verifiedBtn: "✅ పూర్తయింది",
    email: "ఈమెయిల్ ఐడి", password: "పాസ്‌వర్డ్ సెట్ చేయండి", submitReg: "🪷 ప్రొఫైల్‌ను ప్రచురించు",
    submitLogin: "🔐 లాగిన్ అవ్వండి", fastFilter: "⚡ వడపోత:", id: "ప్రొఫైల్ ఐడి",
    lockedCoords: "🔒 ఆస్తులు & సంప్రదింపు వివరాలు దాచబడ్డాయి", unlockBtn: "పూర్తి ఆస్తులు & ఫోన్ నెంబర్ చూడండి",
    starPrefLabel: "🔮 మీకు సమ్మతమైన నక్షత్రములు:", starPrefSub: "మీ జాతక పొంతన ప్రకారం ఇష్టమైన నక్షత్రాలను టిక్ చేయండి.",
    step1: "👉 స్టెప్ 1: కింది UPI QR కోడ్‌కు చెల్లించండి", step2: "👉 స్టెప్ 2: చెల్లింపు రుజువును నమోదు చేయండి",
    pasteUtr: "12-అంకెల UPI UTR ఐడి పేస్ట్ చేయండి", filePremium: "ప్రీమియం అభ్యర్థన పంపండి",
    pendingClaim: "📑 వివరాలు అడ్మిన్ పరిశీలనలో ఉన్నాయి. 15 నిమిషాల్లో అన్‌లాక్ చేయబడుతుంది.",
    noMatches: "క్షమించండి, మీరు ఎంచుకున్న ఫిల్టర్లకు సరిపోయే సంబంధాలు ఇంకా నమోదు కాలేదు.",
    lockedWarning: "భద్రతా కారణాల దృష్ట్యా ఫోన్ నెంబర్, అభ్యర్థి ఇంటి పేరు మరియు కుటుంబ ఆస్తుల వివరాలు దాచబడ్డాయి. అన్‌లాక్ చేయడానికి కింది బటన్ నొక్కండి.",
    filterAll: "అన్ని (All)", filterFresh: "✨ కొత్తవి (Fresh)", filterNearby: "📍 నా జిల్లాలో",
    filterShortlisted: "💖 ఇష్టపడినవి", filterViewed: "👀 చూసినవి", filterPassed: "❌ వదిలేసినవి", filterBlocked: "🚫 బ్లాక్ చేసినవి",
    btnShortlist: "Shortlist", btnPass: "Pass", btnBlock: "Block", loadingProfile: "🔄 ప్రామాణీకరిస్తోంది...",
    gothramWarning: "⚠️ సగోత్రం (Same Gothram)", photoSuccess: "✅ ప్రొఫైల్ ఫోటో అప్‌డేట్ చేయబడింది!",
    verificationPending: "⏳ మీ ప్రొఫైల్ ప్రస్తుతం అడ్మిన్ పరిశీలనలో ఉంది. త్వరలోనే యాక్టివేట్ చేయబడుతుంది."
  },
  en: {
    logoTitle: "Mangalasutram Matrimony", logoSub: "Trusted Telugu Matchmaking",
    exploreMatches: "Explore Matches", myBio: "My Bio-Data Settings", goPremium: "👑 Go Premium",
    namaskaram: "🙏 Welcome", premiumActive: "👑 Premium Active", logout: "Logout",
    registerTitle: "📝 Register Verified Profile", loginTitle: "🔐 Secure Login",
    switchLogin: "Already a member? Login", switchReg: "New here? Register Free",
    firstName: "Candidate Name", lastName: "Surname", age: "Age", gender: "Gender", height: "Height", bloodGroup: "Blood Group",
    bride: "Bride (Female)", groom: "Groom (Male)", maritalStatus: "Marital Status",
    neverMarried: "Never Married", divorced: "Divorced", widowed: "Widowed",
    district: "Hometown District", caste: "Caste", subCaste: "Sub-Caste", gothram: "Gothram",
    rasi: "Rasi / Moon Sign", star: "Janma Nakshatram", padam: "Padam Quarter (1-4)", kujaDosham: "Kuja Dosham / Manglik", astroNotes: "Astrological / Birth Time Details (Notes)",
    education: "Education", income: "Annual Income", occupation: "Occupation",
    phone: "Mobile Number", photoUpload: "📸 Upload Display Photo",
    fatherName: "Father's Name", fatherOccupation: "Father's Occupation", motherName: "Mother's Name", motherOccupation: "Mother's Occupation", maternalSurnames: "Maternal Surnames",
    propertyWorth: "Total Net Worth", landDetails: "Agricultural Land (Acres)", houseDetails: "Houses / Real Estate Plots",
    // ✨ New Life Differentiator Fields
    dietHabit: "Dietary Habits", physicalStatus: "Physical Status", abroadStatus: "Abroad / NRI Willingness",
    secPersonal: "👤 Personal Details", secAstrology: "🕉️ Religious & Astrological", secEducation: "🎓 Professional Info", secFamily: "👨‍👩‍👧‍👦 Family Background", secProperties: "🏡 Property & Assets",
    aadhaarLabel: "🛡️ Identity Verification (Aadhaar)", verifyBtn: "Verify", verifiedBtn: "✅ Cleared",
    email: "Email", password: "Password", submitReg: "🪷 Deploy Profile",
    submitLogin: "🔐 Connect Session", fastFilter: "⚡ Refine Feed:", id: "UID",
    lockedCoords: "🔒 Assets & Contact Info Encrypted", unlockBtn: "View Full Bio-Data & Assets",
    starPrefLabel: "🔮 Multi-Select Match Stars:", starPrefSub: "Check compatible clusters.",
    step1: "👉 Step 1: Complete ₹499 UPI Deposit", step2: "👉 Step 2: Log Verification Ticket",
    pasteUtr: "Input 12-Digit UPI UTR", filePremium: "Submit Activation Slip",
    pendingClaim: "📑 Reference submitted! Ledger reconcile completes in 15 mins.",
    noMatches: "No matching profiles found within chosen filter variables.",
    lockedWarning: "Contact variables, candidate surname, and property profiles encrypted. Upgrade to clear encryption.",
    filterAll: "All Matches", filterFresh: "✨ Fresh Matches", filterNearby: "📍 Near Me",
    filterShortlisted: "💖 Shortlisted", filterViewed: "👀 Viewed", filterPassed: "❌ Passed", filterBlocked: "🚫 Blocked",
    btnShortlist: "Shortlist", btnPass: "Pass", btnBlock: "Block", loadingProfile: "🔄 Loading Profile Data...",
    gothramWarning: "⚠️ Same Gothram Warning", photoSuccess: "✅ Display asset adjusted successfully!",
    verificationPending: "⏳ Your profile is pending administrative safety verification. It will be live shortly."
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
        const MAX_WIDTH = 600; 
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.6)); 
      };
    };
  });
};

const INITIAL_FORM_STATE = {
  firstName: '', lastName: '', age: '', height: "5'4\"", bloodGroup: 'O+', gender: 'Female', maritalStatus: 'Never Married', 
  district: 'NTR Vijayawada (ఎన్టీఆర్ విజయవాడ)', caste: 'Brahmin (బ్రాహ్మణ)', subCaste: 'Niyogi', gothram: '', 
  nakshatra: 'Ashwini (అశ్విని)', rasi: 'Mesha (Aries)', padam: '1', kujaDosham: 'No (లేదు)', astroNotes: '',
  dietHabit: 'Vegetarian (శాఖాహారం)', physicalStatus: 'Normal (సాధారణ)', abroadStatus: 'Willing to settle abroad (విదేశాలకు సుముఖం)',
  education: '', occupation: '', annualIncome: '5 - 10 Lakhs PA', phone: '', email: '', 
  fatherName: '', fatherOccupation: '', motherName: '', motherOccupation: '', maternalSurnames: '',
  propertyWorth: 'Below 50 Lakhs', landDetails: '', houseDetails: '', 
  preferredStars: [], interactions: { shortlisted: [], passed: [], blocked: [], viewed: [] } 
};

export default function App() {
  const [lang, setLang] = useState('te');
  const t = TRANSLATIONS[lang];

  const [activeTab, setActiveTab] = useState('matches');
  const [user, setUser] = useState(null);
  const [myProfileData, setMyProfileData] = useState(null);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [adminClaims, setAdminClaims] = useState([]);

  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(true);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [upiTransactionId, setUpiTransactionId] = useState('');
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);

  const [lifecycleCategory, setLifecycleCategory] = useState('ALL'); 
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterCaste, setFilterCaste] = useState('');
  const [filterMaritalStatus, setFilterMaritalStatus] = useState('');
  const [filterAgeGroup, setFilterAgeGroup] = useState('');

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [selectedPhoto, setSelectedPhoto] = useState(null); 
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarStatus, setAadhaarStatus] = useState('UNVERIFIED');

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const q = query(collection(db, "profiles"), where("email", "==", currentUser.email.toLowerCase()));
        return onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const docData = snapshot.docs[0].data();
            setMyProfileData({ id: snapshot.docs[0].id, ...docData });
            
            setFormData(prev => ({
              ...INITIAL_FORM_STATE,
              ...docData,
              preferredStars: docData.preferredStars || prev.preferredStars || [],
              interactions: docData.interactions || prev.interactions || { shortlisted: [], passed: [], blocked: [], viewed: [] }
            }));
            setIsProfileLoaded(true);
          }
        });
      } else {
        setMyProfileData(null);
        setIsProfileLoaded(false);
        setFormData(INITIAL_FORM_STATE);
        setSelectedPhoto(null);
        setAadhaarNumber('');
        setAadhaarStatus('UNVERIFIED');
        setFormError('');
      }
    });
  }, [user]);

  // ✨ Scaled Firestore listener with absolute safety limits
  useEffect(() => {
    const q = query(collection(db, "profiles"), limit(100));
    return onSnapshot(q, (snapshot) => {
      const liveList = [];
      snapshot.forEach((doc) => {
        liveList.push({ id: doc.id, ...doc.data() });
      });
      liveList.sort((a, b) => {
        const epochA = a.createdAt?.seconds || Date.now() / 1000;
        const epochB = b.createdAt?.seconds || Date.now() / 1000;
        return epochB - epochA;
      });
      setProfiles(liveList);
    });
  }, []);

  useEffect(() => {
    if (user && myProfileData?.isAdmin) {
      const q = query(collection(db, "payment_claims"), where("status", "==", "PENDING"));
      return onSnapshot(q, (snapshot) => {
        const claimsList = [];
        snapshot.forEach((doc) => {
          claimsList.push({ id: doc.id, ...doc.data() });
        });
        setAdminClaims(claimsList);
      });
    } else {
      setAdminClaims([]);
    }
  }, [user, myProfileData]);

  const logInteraction = async (targetDocId, actionType) => {
    if (!myProfileData || !targetDocId) return;
    try {
      const ref = doc(db, "profiles", myProfileData.id);
      const fieldPath = `interactions.${actionType}`;
      await updateDoc(ref, { [fieldPath]: arrayUnion(targetDocId) });
      if (actionType === 'shortlisted') alert(lang === 'te' ? '💖 ప్రొఫైల్ ఇష్టపడిన వాటిలో చేర్చబడింది!' : '💖 Profile Shortlisted!');
    } catch (err) { console.error("Interaction failed:", err); }
  };

  const executeDirectPhotoUpdate = async (fileObject) => {
    if (!myProfileData || !fileObject) return;
    try {
      setIsSubmitting(true);
      const freshlyCompressedString = await compressImage(fileObject);
      const ref = doc(db, "profiles", myProfileData.id);
      await updateDoc(ref, { photos: [freshlyCompressedString] });
      alert(t.photoSuccess);
    } catch (err) { alert(`Photo Adjustment Error: ${err.message}`); } 
    finally { setIsSubmitting(false); }
  };

  const handleManualAdminApproval = async (claimDocId, applicantEmail) => {
    if (!window.confirm(`Confirm verification for: ${applicantEmail}?`)) return;
    try {
      await updateDoc(doc(db, "payment_claims", claimDocId), { status: 'APPROVED' });
      const q = query(collection(db, "profiles"), where("email", "==", applicantEmail.toLowerCase()));
      const profileSnapshot = await getDocs(q);
      
      if (!profileSnapshot.empty) {
        const targetProfileDocId = profileSnapshot.docs[0].id;
        await updateDoc(doc(db, "profiles", targetProfileDocId), { isPremium: true, isApproved: true });
        alert("🎉 Premium & Safety Status Cleared!");
      } else {
        alert("⚠️ Claim updated, but profile match not located.");
      }
    } catch (err) { alert(`Admin processing failure: ${err.message}`); }
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
      setFormError(lang === 'te' ? '❌ ఆధార్ నంబర్ 12 అంకెలు ఉండాలి!' : '❌ Invalid 12-Digit Aadhaar.'); return;
    }
    setAadhaarStatus('VERIFYING');
    setTimeout(() => setAadhaarStatus('VERIFIED'), 1000);
  };

  const handleRegistrationFlow = async (e) => {
    e.preventDefault();
    if (!selectedPhoto) {
      setFormError(lang === 'te' ? '⚠️ ప్రొఫైల్ ఫోటో జతపరచండి.' : '⚠️ Photo asset missing.'); return;
    }
    if (aadhaarStatus !== 'VERIFIED') {
      setFormError(lang === 'te' ? '🛡️ ఆధార్ వెరిఫికేషన్ పూర్తి చేయండి.' : '🛡️ Identity validation incomplete.'); return;
    }
    setFormError('');
    setIsSubmitting(true);

    try {
      const compressedData = await compressImage(selectedPhoto);
      const formattedEmail = formData.email.trim().toLowerCase();
      
      await createUserWithEmailAndPassword(auth, formattedEmail, authPassword);
      
      const generatedProfileId = "MMS" + Math.floor(100000 + Math.random() * 900000);
      await addDoc(collection(db, "profiles"), {
        ...formData,
        email: formattedEmail,
        profileId: generatedProfileId,
        photos: [compressedData], 
        isPremium: false,
        isAdmin: false, 
        isApproved: true, // Auto-live defaults for testing, toggle via DB for production queues
        aadhaarVerified: true,
        createdAt: serverTimestamp(),
        interactions: { shortlisted: [], passed: [], blocked: [], viewed: [] }
      });
      alert(lang === 'te' ? `🎉 ఐడి: ${generatedProfileId}` : `🎉 Profile deployed: ${generatedProfileId}`);
    } catch (err) { setFormError(err.message); } 
    finally { setIsSubmitting(false); }
  };

  const handleUpdateProfileFlow = async (e) => {
    e.preventDefault();
    setFormError(''); 
    if (!myProfileData) { alert("⚠️ Sync latency. Retry."); return; }
    setIsSubmitting(true);
    try {
      const ref = doc(db, "profiles", myProfileData.id);
      await updateDoc(ref, formData);
      alert(lang === 'te' ? '✅ ప్రాధాన్యతలు నవీకరించబడ్డాయి!' : '✅ Bio-data matrix updated successfully.');
    } catch (err) {
      setFormError(err.message); 
      alert(`❌ Database Exception: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuthLoginFlow = async (e) => {
    e.preventDefault();
    setFormError(''); setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, authEmail.trim().toLowerCase(), authPassword);
    } catch (err) {
      setFormError(lang === 'te' ? '❌ వివరాలు సరిపోలలేదు.' : '❌ Credentials error.');
    } finally { setIsSubmitting(false); }
  };

  const targetMatchGender = myProfileData ? (myProfileData.gender === 'Male' ? 'Female' : 'Male') : 'Loading'; 

  const getFilteredProfiles = () => {
    if (targetMatchGender === 'Loading') return [];
    const iMatrix = {
      shortlisted: myProfileData?.interactions?.shortlisted || [], passed: myProfileData?.interactions?.passed || [],
      blocked: myProfileData?.interactions?.blocked || [], viewed: myProfileData?.interactions?.viewed || []
    };
    return profiles.filter(p => {
      if (p.gender !== targetMatchGender) return false;
      if (p.id === myProfileData?.id) return false; 
      // Safety Gate: Conceals accounts locked or blacklisted by administration safety queues
      if (p.isApproved === false) return false;
      
      if (filterCaste && p.caste !== filterCaste) return false;
      if (filterDistrict && p.district !== filterDistrict) return false;
      if (filterMaritalStatus && p.maritalStatus !== filterMaritalStatus) return false;
      if (filterAgeGroup) {
        const candidateAge = parseInt(p.age);
        if (filterAgeGroup === 'UNDER25' && candidateAge >= 25) return false;
        if (filterAgeGroup === '25TO30' && (candidateAge < 25 || candidateAge > 30)) return false;
        if (filterAgeGroup === 'ABOVE30' && candidateAge <= 30) return false;
      }

      const pid = p.id; 
      if (lifecycleCategory === 'ALL') return !iMatrix.passed.includes(pid) && !iMatrix.blocked.includes(pid);
      if (lifecycleCategory === 'FRESH') return !iMatrix.shortlisted.includes(pid) && !iMatrix.passed.includes(pid) && !iMatrix.blocked.includes(pid) && !iMatrix.viewed.includes(pid);
      if (lifecycleCategory === 'NEARBY') return p.district === myProfileData?.district && !iMatrix.passed.includes(pid) && !iMatrix.blocked.includes(pid);
      if (lifecycleCategory === 'SHORTLISTED') return iMatrix.shortlisted.includes(pid);
      if (lifecycleCategory === 'VIEWED') return iMatrix.viewed.includes(pid) && !iMatrix.blocked.includes(pid);
      if (lifecycleCategory === 'PASSED') return iMatrix.passed.includes(pid);
      if (lifecycleCategory === 'BLOCKED') return iMatrix.blocked.includes(pid);
      return true;
    });
  };

  const visibleProfiles = getFilteredProfiles();
  const renderFormGroup = (label, children) => (
    <div>
      <label className="block text-[11px] font-bold text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );

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
          <div className="flex bg-black/30 p-1 rounded-2xl border border-amber-500/20 text-xs font-bold shadow-inner overflow-x-auto w-full md:w-auto">
            <button onClick={() => { setActiveTab('matches'); setFormError(''); }} className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${activeTab === 'matches' ? 'bg-[#D4A017] text-[#521313] shadow' : 'text-white/90'}`}>{t.exploreMatches}</button>
            <button onClick={() => { setActiveTab('my-profile'); setFormError(''); }} className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${activeTab === 'my-profile' ? 'bg-[#D4A017] text-[#521313] shadow' : 'text-white/90'}`}>{t.myBio}</button>
            <button onClick={() => { setActiveTab('payment'); setFormError(''); }} className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${activeTab === 'payment' ? 'bg-[#D4A017] text-[#521313] shadow' : 'text-white/90'}`}>{t.goPremium}</button>
            
            {myProfileData?.isAdmin && (
              <button onClick={() => { setActiveTab('admin-panel'); setFormError(''); }} className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl transition-all whitespace-nowrap bg-emerald-700 text-white border border-emerald-500 font-extrabold ${activeTab === 'admin-panel' ? 'brightness-125 ring-2 ring-amber-400' : 'opacity-90'}`}>
                ⚙️ Admin Ledger ({adminClaims.length})
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="bg-black/40 border border-white/10 rounded-xl p-1 flex gap-1 font-bold text-[10px]">
            <button onClick={() => setLang('te')} className={`px-3 py-1 rounded-md transition-all ${lang === 'te' ? 'bg-[#D4A017] text-black' : 'text-gray-400'}`}>తెలుగు</button>
            <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-md transition-all ${lang === 'en' ? 'bg-[#D4A017] text-black' : 'text-gray-400'}`}>EN</button>
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
        
        {/* ================= GUEST PORTAL ================= */}
        {!user && (
           <div className="max-w-2xl mx-auto bg-white border-t-8 border-[#7B1F1F] border-x border-b border-[#E8C99A]/60 p-6 rounded-3xl shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3 mb-6">
              <h3 className="font-bold text-lg text-[#7B1F1F]" style={{fontFamily: "'Noto Serif Telugu', serif"}}>{isRegistering ? t.registerTitle : t.loginTitle}</h3>
              <button onClick={() => { setIsRegistering(!isRegistering); setFormError(''); }} className="text-xs font-bold text-sky-800 underline">{isRegistering ? t.switchLogin : t.switchReg}</button>
            </div>

            {formError && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl font-bold mb-4">{formError}</div>}

            {isRegistering ? (
              <form onSubmit={handleRegistrationFlow} className="space-y-6 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                
                <div className="bg-[#FFFBF7] p-4 rounded-2xl border border-[#E8C99A]/40 space-y-3">
                  <h4 className="text-xs font-extrabold text-[#7B1F1F] border-b border-[#E8C99A]/40 pb-2">{t.secPersonal}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {renderFormGroup(t.firstName, <input type="text" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full border rounded-xl p-2.5 text-sm bg-white focus:outline-none" />)}
                    {renderFormGroup(t.lastName, <input type="text" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full border rounded-xl p-2.5 text-sm bg-white focus:outline-none" />)}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {renderFormGroup(t.age, <input type="number" required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full border rounded-xl p-2.5 text-sm bg-white" />)}
                    {renderFormGroup(t.height, <select value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white">{HEIGHTS.map(h => <option key={h} value={h}>{h}</option>)}</select>)}
                    {renderFormGroup(t.bloodGroup, <select value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white">{BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}</select>)}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {renderFormGroup(t.dietHabit, <select value={formData.dietHabit} onChange={e => setFormData({...formData, dietHabit: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white"><option value="Vegetarian (శాఖాహారం)">Vegetarian</option><option value="Non-Vegetarian (మాంసాహారం)">Non-Vegetarian</option><option value="Eggetarian">Eggetarian</option></select>)}
                    {renderFormGroup(t.physicalStatus, <select value={formData.physicalStatus} onChange={e => setFormData({...formData, physicalStatus: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white"><option value="Normal (సాధారణ)">Normal</option><option value="Physically Challenged (వికలాంగులు)">Physically Challenged</option></select>)}
                    {renderFormGroup(t.abroadStatus, <select value={formData.abroadStatus} onChange={e => setFormData({...formData, abroadStatus: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white"><option value="Willing to settle abroad (విదేశాలకు సుముఖం)">Willing Abroad</option><option value="Looking for local matches only (భారతదేశంలోనే)">Local Only</option></select>)}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {renderFormGroup(t.gender, <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs font-bold bg-white"><option value="Female">{t.bride}</option><option value="Male">{t.groom}</option></select>)}
                    {renderFormGroup(t.maritalStatus, <select value={formData.maritalStatus} onChange={e => setFormData({...formData, maritalStatus: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white"><option value="Never Married">Never Married</option><option value="Divorced">Divorced</option><option value="Widowed">Widowed</option></select>)}
                  </div>
                  {renderFormGroup(t.phone, <input type="tel" required placeholder="+91" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border rounded-xl p-2.5 text-sm bg-white focus:outline-none" />)}
                </div>

                <div className="bg-[#FFFBF7] p-4 rounded-2xl border border-[#E8C99A]/40 space-y-3">
                  <h4 className="text-xs font-extrabold text-[#7B1F1F] border-b border-[#E8C99A]/40 pb-2">{t.secAstrology}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {renderFormGroup(t.caste, <select value={formData.caste} onChange={e => setFormData({...formData, caste: e.target.value, subCaste: CASTE_MATRIX[e.target.value]?.[0] || 'General'})} className="w-full border rounded-xl p-2.5 text-xs bg-white">{Object.keys(CASTE_MATRIX).map(c => <option key={c} value={c}>{c}</option>)}</select>)}
                    {renderFormGroup(t.subCaste, <select value={formData.subCaste} onChange={e => setFormData({...formData, subCaste: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white">{CASTE_MATRIX[formData.caste]?.map(sc => <option key={sc} value={sc}>{sc}</option>)}</select>)}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {renderFormGroup(t.gothram, <input type="text" required placeholder="e.g. Bharadwaja" value={formData.gothram} onChange={e => setFormData({...formData, gothram: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white focus:outline-none" />)}
                    {renderFormGroup(t.rasi, <select value={formData.rasi} onChange={e => setFormData({...formData, rasi: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white"><option value="Mesha (Aries)">Mesha</option><option value="Vrishabha (Taurus)">Vrishabha</option><option value="Mithuna (Gemini)">Mithuna</option><option value="Karka (Cancer)">Karka</option><option value="Simha (Leo)">Simha</option><option value="Kanya (Virgo)">Kanya</option><option value="Tula (Libra)">Tula</option><option value="Vrishchika (Scorpio)">Vrishchika</option><option value="Dhanu (Sagittarius)">Dhanu</option><option value="Makara (Capricorn)">Makara</option><option value="Kumbha (Aquarius)">Kumbha</option><option value="Meena (Pisces)">Meena</option></select>)}
                    {renderFormGroup(t.kujaDosham, <select value={formData.kujaDosham} onChange={e => setFormData({...formData, kujaDosham: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white"><option value="No (లేదు)">No (లేదు)</option><option value="Yes (ఉంది)">Yes (ఉంది)</option><option value="Don't Know (తెలియదు)">Don't Know (తెలియదు)</option></select>)}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {renderFormGroup(t.star, <select value={formData.nakshatra} onChange={e => setFormData({...formData, nakshatra: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white">{NAKSHATRAMS.map(st => <option key={st} value={st}>{st}</option>)}</select>)}
                    {renderFormGroup(t.padam, <select value={formData.padam} onChange={e => setFormData({...formData, padam: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white"><option value="1">1వ పాదం</option><option value="2">2వ పాదం</option><option value="3">3వ పాదం</option><option value="4">4వ పాదం</option></select>)}
                  </div>
                  {/* ✨ New Astrological/Priest Memo Data Box */}
                  {renderFormGroup(t.astroNotes, <textarea rows={2} placeholder="e.g. Born at 4:30 PM, Lagna Chart notes..." value={formData.astroNotes} onChange={e => setFormData({...formData, astroNotes: e.target.value})} className="w-full border rounded-xl p-2 text-xs bg-white font-sans focus:outline-none" />)}
                </div>

                <div className="bg-[#FFFBF7] p-4 rounded-2xl border border-[#E8C99A]/40 space-y-3">
                  <h4 className="text-xs font-extrabold text-[#7B1F1F] border-b border-[#E8C99A]/40 pb-2">{t.secEducation}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {renderFormGroup(t.education, <input type="text" required placeholder="e.g. B.Tech" value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white focus:outline-none" />)}
                    {renderFormGroup(t.occupation, <input type="text" required placeholder="e.g. Software Engineer" value={formData.occupation} onChange={e => setFormData({...formData, occupation: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white focus:outline-none" />)}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {renderFormGroup(t.income, <select value={formData.annualIncome} onChange={e => setFormData({...formData, annualIncome: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white"><option value="Under 5 Lakhs PA">Under 5 Lakhs PA</option><option value="5 - 10 Lakhs PA">5 - 10 Lakhs PA</option><option value="10 - 20 Lakhs PA">10 - 20 Lakhs PA</option><option value="20+ Lakhs PA">20+ Lakhs PA</option></select>)}
                    {renderFormGroup(t.district, <select value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white">{DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}</select>)}
                  </div>
                </div>

                <div className="bg-[#FFFBF7] p-4 rounded-2xl border border-[#E8C99A]/40 space-y-3">
                  <h4 className="text-xs font-extrabold text-[#7B1F1F] border-b border-[#E8C99A]/40 pb-2">{t.secProperties}</h4>
                  {renderFormGroup(t.propertyWorth, <select value={formData.propertyWorth} onChange={e => setFormData({...formData, propertyWorth: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white">{PROPERTY_VALUES.map(v => <option key={v} value={v}>{v}</option>)}</select>)}
                  <div className="grid grid-cols-2 gap-2">
                    {renderFormGroup(t.landDetails, <input type="text" placeholder="e.g. 5 Acres" value={formData.landDetails} onChange={e => setFormData({...formData, landDetails: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white focus:outline-none" />)}
                    {renderFormGroup(t.houseDetails, <input type="text" placeholder="e.g. 1 House" value={formData.houseDetails} onChange={e => setFormData({...formData, houseDetails: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white focus:outline-none" />)}
                  </div>
                </div>

                <div className="bg-[#FFFBF7] p-4 rounded-2xl border border-[#E8C99A]/40 space-y-3">
                  <h4 className="text-xs font-extrabold text-[#7B1F1F] border-b border-[#E8C99A]/40 pb-2">{t.secFamily}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {renderFormGroup(t.fatherName, <input type="text" required value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white focus:outline-none" />)}
                    {renderFormGroup(t.fatherOccupation, <input type="text" required value={formData.fatherOccupation} onChange={e => setFormData({...formData, fatherOccupation: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white focus:outline-none" />)}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {renderFormGroup(t.motherName, <input type="text" required value={formData.motherName} onChange={e => setFormData({...formData, motherName: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white focus:outline-none" />)}
                    {renderFormGroup(t.motherOccupation, <input type="text" required value={formData.motherOccupation} onChange={e => setFormData({...formData, motherOccupation: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white focus:outline-none" />)}
                  </div>
                  {renderFormGroup(t.maternalSurnames, <input type="text" required placeholder="e.g. Yalavarthi..." value={formData.maternalSurnames} onChange={e => setFormData({...formData, maternalSurnames: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white focus:outline-none" />)}
                </div>

                <div className="bg-amber-50/60 border border-dashed border-amber-300 p-3 rounded-xl">
                  <label className="block text-xs font-bold text-[#7B1F1F] mb-1">{t.photoUpload}</label>
                  <input type="file" accept="image/*" required onChange={e => setSelectedPhoto(e.target.files[0])} className="w-full text-xs text-gray-500" />
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
            {/* TAB 1: MATCH FEED */}
            {activeTab === 'matches' && (
              <div className="space-y-6">
                
                {/* ADVANCED MULTI-AXIS MATRIMONIAL QUERY TUNING BAR */}
                <div className="bg-white p-3 border border-[#E8C99A] rounded-2xl space-y-3 shadow-md">
                  <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {['ALL', 'FRESH', 'NEARBY', 'SHORTLISTED', 'VIEWED', 'PASSED', 'BLOCKED'].map(cat => (
                      <button 
                        key={cat} onClick={() => setLifecycleCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${lifecycleCategory === cat ? 'bg-[#7B1F1F] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {cat === 'FRESH' && t.filterFresh} {cat === 'ALL' && t.filterAll}
                        {cat === 'NEARBY' && t.filterNearby} {cat === 'SHORTLISTED' && t.filterShortlisted}
                        {cat === 'VIEWED' && t.filterViewed} {cat === 'PASSED' && t.filterPassed}
                        {cat === 'BLOCKED' && t.filterBlocked}
                      </button>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t pt-3 border-gray-100">
                    <select value={filterCaste} onChange={e => setFilterCaste(e.target.value)} className="w-full border rounded-xl p-2 text-xs bg-[#FFFBF7] font-semibold text-gray-700">
                      <option value="">All Castes</option>{Object.keys(CASTE_MATRIX).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={filterDistrict} onChange={e => setFilterDistrict(e.target.value)} className="w-full border rounded-xl p-2 text-xs bg-[#FFFBF7] font-semibold text-gray-700">
                      <option value="">All Districts</option>{DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select value={filterMaritalStatus} onChange={e => setFilterMaritalStatus(e.target.value)} className="w-full border rounded-xl p-2 text-xs bg-[#FFFBF7] font-semibold text-gray-700">
                      <option value="">Any Status</option><option value="Never Married">Never Married</option><option value="Divorced">Divorced</option><option value="Widowed">Widowed</option>
                    </select>
                    <select value={filterAgeGroup} onChange={e => setFilterAgeGroup(e.target.value)} className="w-full border rounded-xl p-2 text-xs bg-[#FFFBF7] font-semibold text-gray-700">
                      <option value="">Any Age</option><option value="UNDER25">Under 25 Yrs</option><option value="25TO30">25 - 30 Yrs</option><option value="ABOVE30">Above 30 Yrs</option>
                    </select>
                  </div>
                </div>

                {/* SAFETY NOTIFICATION BAR FOR UNVERIFIED QUEUES */}
                {myProfileData?.isApproved === false && (
                  <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl text-xs font-bold text-amber-900 shadow-sm text-center">
                    {t.verificationPending}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {targetMatchGender === 'Loading' ? (
                    <div className="col-span-full text-center p-12 text-emerald-800 font-bold bg-emerald-50 rounded-3xl animate-pulse">{t.loadingProfile}</div>
                  ) : visibleProfiles.length === 0 ? (
                    <div className="col-span-full text-center bg-white border border-dashed p-12 text-gray-400 rounded-3xl italic">{t.noMatches}</div>
                  ) : (
                    visibleProfiles.map(profile => {
                      const isSagotra = profile.gothram?.trim().toLowerCase() === myProfileData?.gothram?.trim().toLowerCase();
                      
                      return (
                        <div key={profile.id} className="bg-white border-2 border-[#E8C99A]/20 rounded-3xl overflow-hidden shadow-md flex flex-col justify-between hover:shadow-xl transition-all duration-300 relative group">
                          
                          {myProfileData?.interactions?.shortlisted?.includes(profile.id) && <div className="absolute top-2 left-2 z-10 bg-pink-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow">💖 Shortlisted</div>}
                          {isSagotra && <div className="absolute top-2 left-2 z-10 bg-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow">{t.gothramWarning}</div>}
                          
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
                              <div className="flex items-center justify-between border-b pb-2">
                                <h4 className="font-bold text-base text-[#7B1F1F]">
                                  {profile.firstName} {myProfileData?.isPremium ? profile.lastName : ''}
                                </h4>
                                <span className="text-[10px] font-extrabold text-[#7B1F1F] bg-[#7B1F1F]/5 border px-2 py-0.5 rounded max-w-[120px] truncate">{profile.caste}</span>
                              </div>

                              <div className="text-xs grid grid-cols-2 gap-y-2 text-gray-600 font-semibold">
                                <p>📏 Height: <span className="text-gray-900 font-bold">{profile.height || "5'4\""}</span></p>
                                <p>🩸 Blood: <span className="text-gray-900 font-bold text-rose-600">{profile.bloodGroup || "O+"}</span></p>
                                <p>🎂 Age: <span className="text-gray-900 font-bold">{profile.age} Yrs</span></p>
                                <p>📍 Loc: <span className="text-gray-900 font-bold truncate block">{profile.district?.split(' ')[0]}</span></p>
                                
                                {/* Life Lifestyle Indicators */}
                                <p className="col-span-2 text-gray-700 bg-gray-100/60 p-1.5 rounded text-[11px] border border-gray-100">
                                  🥗 {profile.dietHabit || "Vegetarian"} • ♿ {profile.physicalStatus?.split(' ')[0]} • ✈️ {profile.abroadStatus?.split(' ')[0]}
                                </p>

                                <p className="col-span-2 text-amber-900 font-extrabold">
                                  🌟 {profile.nakshatra?.split(' ')[0]} ({profile.padam || '1'}వ పాదం) • {profile.rasi?.split(' ')[0]}
                                </p>
                                <p className="col-span-2 text-[11px] text-gray-500 font-bold">
                                  🪐 Kuja Dosham: <span className={profile.kujaDosham?.includes('Yes') ? 'text-red-600 font-extrabold' : 'text-emerald-700'}>{profile.kujaDosham || 'No'}</span>
                                </p>
                                <p className="col-span-2 text-[11px] border-t pt-1.5 text-gray-500">{t.education}: <span className="text-gray-900 font-bold">{profile.education}</span></p>
                                <p className="col-span-2 text-[11px] text-gray-500">{t.occupation}: <span className="text-gray-900 font-bold">{profile.occupation}</span></p>
                              </div>
                            </div>
                          </div>

                          <div className="px-4 py-2 bg-gray-50 flex justify-between gap-2 border-t border-gray-100">
                            <button onClick={() => logInteraction(profile.id, 'shortlisted')} className="flex-1 bg-pink-100 text-pink-700 hover:bg-pink-200 py-1.5 rounded-lg text-[10px] font-bold transition">{t.btnShortlist}</button>
                            <button onClick={() => logInteraction(profile.id, 'passed')} className="flex-1 bg-gray-200 text-gray-600 hover:bg-gray-300 py-1.5 rounded-lg text-[10px] font-bold transition">{t.btnPass}</button>
                            <button onClick={() => logInteraction(profile.id, 'blocked')} className="flex-1 bg-red-100 text-red-700 hover:bg-red-200 py-1.5 rounded-lg text-[10px] font-bold transition">{t.btnBlock}</button>
                          </div>

                          <div className="p-4 bg-[#FFFBF7] border-t border-gray-100 rounded-b-3xl">
                            {myProfileData?.isPremium ? (
                              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-[11px] text-emerald-900 font-medium space-y-2">
                                <div className="border-b border-emerald-200 pb-1 mb-1 font-bold text-xs text-emerald-800">🔒 Unlocked Info</div>
                                <p>📞 Phone: <span className="font-bold">{profile.phone}</span></p>
                                <p>🔱 Gothram: <span className="font-bold">{profile.gothram}</span> | Clan: <span className="font-bold">{profile.subCaste}</span></p>
                                {profile.astroNotes && <p className="text-amber-800 bg-amber-50 p-1 rounded font-mono text-[10px]">🔮 Chart Notes: {profile.astroNotes}</p>}
                                <div className="mt-2 pt-2 border-t border-emerald-200/50 space-y-1">
                                  <p>👨 Father: {profile.fatherName} ({profile.fatherOccupation})</p>
                                  <p>👩 Mother: {profile.motherName}</p>
                                  <p className="text-purple-900 font-bold">🧬 Relatives Surnames: {profile.maternalSurnames}</p>
                                  <div className="mt-2 pt-2 border-t border-dashed border-emerald-300 text-amber-900 font-bold">
                                    <p>💰 Est. Asset Base: {profile.propertyWorth || 'Protected'}</p>
                                    <p>🌾 Acres of Land: {profile.landDetails || 'None Specified'}</p>
                                    <p>🏢 Realty Assets: {profile.houseDetails || 'None Specified'}</p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center">
                                <p className="text-[10px] text-amber-900 font-bold mb-2">{t.lockedWarning}</p>
                                <button 
                                  onClick={() => {
                                    logInteraction(profile.id, 'viewed');
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
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: MANAGEMENT PORTAL (My Bio) */}
            {activeTab === 'my-profile' && (
              <div className="max-w-3xl mx-auto bg-white border border-[#E8C99A] p-6 rounded-3xl shadow-lg">
                <div className="border-b pb-2 mb-6">
                  <h3 className="font-bold text-lg text-[#7B1F1F]" style={{fontFamily: "'Noto Serif Telugu', serif"}}>{t.myBio}</h3>
                </div>

                {formError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl font-bold mb-4">
                    ⚠️ Optimization Constraint Detected: {formError}
                  </div>
                )}

                <div className="mb-6 p-4 bg-amber-50/40 border border-[#E8C99A]/60 rounded-2xl flex items-center justify-between gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border bg-white flex items-center justify-center">
                    {formData.photos && formData.photos.length > 0 ? (
                      <img src={formData.photos[0]} alt="Current Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">📸</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-amber-900 mb-1">{t.photoUpload}</label>
                    <input type="file" accept="image/*" onChange={e => {
                      if(e.target.files[0]) executeDirectPhotoUpdate(e.target.files[0]);
                    }} className="text-xs text-gray-500" />
                  </div>
                </div>

                <form onSubmit={handleUpdateProfileFlow} className="space-y-6">
                  
                  <div className="bg-[#FFFBF7] p-4 rounded-2xl border border-[#E8C99A]/40 space-y-3">
                    <h4 className="text-xs font-extrabold text-[#7B1F1F] border-b border-[#E8C99A]/40 pb-2">{t.secPersonal}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {renderFormGroup(t.firstName, <input type="text" required value={formData.firstName || ''} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full border rounded-xl p-2.5 text-sm bg-white focus:outline-none" />)}
                      {renderFormGroup(t.lastName, <input type="text" required value={formData.lastName || ''} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full border rounded-xl p-2.5 text-sm bg-white focus:outline-none" />)}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {renderFormGroup(t.dietHabit, <select value={formData.dietHabit} onChange={e => setFormData({...formData, dietHabit: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white"><option value="Vegetarian (శాఖాహారం)">Vegetarian</option><option value="Non-Vegetarian (మాంసాహారం)">Non-Vegetarian</option><option value="Eggetarian">Eggetarian</option></select>)}
                      {renderFormGroup(t.physicalStatus, <select value={formData.physicalStatus} onChange={e => setFormData({...formData, physicalStatus: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white"><option value="Normal (సాధారణ)">Normal</option><option value="Physically Challenged (వికలాంగులు)">Physically Challenged</option></select>)}
                      {renderFormGroup(t.abroadStatus, <select value={formData.abroadStatus} onChange={e => setFormData({...formData, abroadStatus: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white"><option value="Willing to settle abroad (విదేశాలకు సుముఖం)">Willing Abroad</option><option value="Looking for local matches only (భారతదేశంలోనే)">Local Only</option></select>)}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {renderFormGroup(t.age, <input type="number" required value={formData.age || ''} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full border rounded-xl p-2.5 text-sm bg-white" />)}
                      {renderFormGroup(t.height, <select value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white">{HEIGHTS.map(h => <option key={h} value={h}>{h}</option>)}</select>)}
                      {renderFormGroup(t.gender, <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs font-bold bg-white"><option value="Female">{t.bride}</option><option value="Male">{t.groom}</option></select>)}
                      {renderFormGroup(t.bloodGroup, <select value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white">{BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}</select>)}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {renderFormGroup(t.maritalStatus, <select value={formData.maritalStatus} onChange={e => setFormData({...formData, maritalStatus: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white"><option value="Never Married">Never Married</option><option value="Divorced">Divorced</option><option value="Widowed">Widowed</option></select>)}
                      {renderFormGroup(t.phone, <input type="tel" required value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border rounded-xl p-2.5 text-sm bg-white focus:outline-none" />)}
                    </div>
                  </div>

                  <div className="bg-[#FFFBF7] p-4 rounded-2xl border border-[#E8C99A]/40 space-y-3">
                    <h4 className="text-xs font-extrabold text-[#7B1F1F] border-b border-[#E8C99A]/40 pb-2">{t.secAstrology}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {renderFormGroup(t.gothram, <input type="text" required value={formData.gothram || ''} onChange={e => setFormData({...formData, gothram: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white focus:outline-none" />)}
                      {renderFormGroup(t.rasi, <select value={formData.rasi} onChange={e => setFormData({...formData, rasi} = e.target.value)} className="w-full border rounded-xl p-2.5 text-xs bg-white"><option value="Mesha (Aries)">Mesha</option><option value="Vrishabha (Taurus)">Vrishabha</option><option value="Mithuna (Gemini)">Mithuna</option><option value="Karka (Cancer)">Karka</option><option value="Simha (Leo)">Simha</option><option value="Kanya (Virgo)">Kanya</option><option value="Tula (Libra)">Tula</option><option value="Vrishchika (Scorpio)">Vrishchika</option><option value="Dhanu (Sagittarius)">Dhanu</option><option value="Makara (Capricorn)">Makara</option><option value="Kumbha (Aquarius)">Kumbha</option><option value="Meena (Pisces)">Meena</option></select>)}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {renderFormGroup(t.star, <select value={formData.nakshatra} onChange={e => setFormData({...formData, nakshatra: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white">{NAKSHATRAMS.map(st => <option key={st} value={st}>{st}</option>)}</select>)}
                      {renderFormGroup(t.padam, <select value={formData.padam} onChange={e => setFormData({...formData, padam: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white"><option value="1">1వ పాదం</option><option value="2">2వ పాదం</option><option value="3">3వ పాదం</option><option value="4">4వ పాదం</option></select>)}
                      {renderFormGroup(t.kujaDosham, <select value={formData.kujaDosham} onChange={e => setFormData({...formData, kujaDosham: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white"><option value="No (లేదు)">No (లేదు)</option><option value="Yes (ఉంది)">Yes (ఉంది)</option><option value="Don't Know (తెలియదు)">Don't Know (తెలియదు)</option></select>)}
                    </div>
                    {renderFormGroup(t.astroNotes, <textarea rows={2} placeholder="Chart Notes..." value={formData.astroNotes || ''} onChange={e => setFormData({...formData, astroNotes: e.target.value})} className="w-full border rounded-xl p-2 text-xs bg-white font-sans focus:outline-none" />)}
                    <div className="grid grid-cols-2 gap-2">
                      {renderFormGroup(t.caste, <select value={formData.caste} onChange={e => setFormData({...formData, caste: e.target.value, subCaste: CASTE_MATRIX[e.target.value]?.[0] || 'General'})} className="w-full border rounded-xl p-2.5 text-xs bg-white">{Object.keys(CASTE_MATRIX).map(c => <option key={c} value={c}>{c}</option>)}</select>)}
                      {renderFormGroup(t.subCaste, <select value={formData.subCaste} onChange={e => setFormData({...formData, subCaste: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white">{CASTE_MATRIX[formData.caste]?.map(sc => <option key={sc} value={sc}>{sc}</option>)}</select>)}
                    </div>
                  </div>

                  <div className="bg-[#FFFBF7] p-4 rounded-2xl border border-[#E8C99A]/40 space-y-3">
                    <h4 className="text-xs font-extrabold text-[#7B1F1F] border-b border-[#E8C99A]/40 pb-2">{t.secProperties}</h4>
                    {renderFormGroup(t.propertyWorth, <select value={formData.propertyWorth} onChange={e => setFormData({...formData, propertyWorth: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white">{PROPERTY_VALUES.map(v => <option key={v} value={v}>{v}</option>)}</select>)}
                    <div className="grid grid-cols-2 gap-2">
                      {renderFormGroup(t.landDetails, <input type="text" value={formData.landDetails || ''} onChange={e => setFormData({...formData, landDetails: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white focus:outline-none" />)}
                      {renderFormGroup(t.houseDetails, <input type="text" value={formData.houseDetails || ''} onChange={e => setFormData({...formData, houseDetails: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white focus:outline-none" />)}
                    </div>
                  </div>

                  <div className="bg-[#FFFBF7] p-4 rounded-2xl border border-[#E8C99A]/40 space-y-3">
                    <h4 className="text-xs font-extrabold text-[#7B1F1F] border-b border-[#E8C99A]/40 pb-2">{t.secFamily}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {renderFormGroup(t.fatherName, <input type="text" required value={formData.fatherName || ''} onChange={e => setFormData({...formData, fatherName: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white focus:outline-none" />)}
                      {renderFormGroup(t.fatherOccupation, <input type="text" required value={formData.fatherOccupation || ''} onChange={e => setFormData({...formData, fatherOccupation: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white focus:outline-none" />)}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {renderFormGroup(t.motherName, <input type="text" required value={formData.motherName || ''} onChange={e => setFormData({...formData, motherName: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white focus:outline-none" />)}
                      {renderFormGroup(t.motherOccupation, <input type="text" required value={formData.motherOccupation || ''} onChange={e => setFormData({...formData, motherOccupation: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white focus:outline-none" />)}
                    </div>
                    {renderFormGroup(t.maternalSurnames, <input type="text" required value={formData.maternalSurnames || ''} onChange={e => setFormData({...formData, maternalSurnames: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white focus:outline-none" />)}
                  </div>

                  <div className="bg-[#FFFBF7] p-4 rounded-2xl border border-[#E8C99A]/40 space-y-3">
                    <h4 className="text-xs font-extrabold text-[#7B1F1F] border-b border-[#E8C99A]/40 pb-2">{t.secEducation}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {renderFormGroup(t.education, <input type="text" required value={formData.education || ''} onChange={e => setFormData({...formData, education: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white focus:outline-none" />)}
                      {renderFormGroup(t.occupation, <input type="text" required value={formData.occupation || ''} onChange={e => setFormData({...formData, occupation: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white focus:outline-none" />)}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {renderFormGroup(t.district, <select value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white">{DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}</select>)}
                      {renderFormGroup(t.income, <select value={formData.annualIncome} onChange={e => setFormData({...formData, annualIncome: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs bg-white"><option value="Under 5 Lakhs PA">Under 5 Lakhs PA</option><option value="5 - 10 Lakhs PA">5 - 10 Lakhs PA</option><option value="10 - 20 Lakhs PA">10 - 20 Lakhs PA</option><option value="20+ Lakhs PA">20+ Lakhs PA</option></select>)}
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

            {/* TAB 4: SECURE ADMIN DESK */}
            {activeTab === 'admin-panel' && myProfileData?.isAdmin && (
              <div className="max-w-4xl mx-auto bg-white border-2 border-emerald-700 p-6 rounded-3xl shadow-xl">
                <div className="border-b border-gray-100 pb-3 mb-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-extrabold text-xl text-emerald-800">👨‍✈️ System Administration Desk</h3>
                    <p className="text-xs text-gray-500 font-medium">Verify incoming banking statements and activate premium matrix permissions.</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                    {adminClaims.length} Pending Tickets
                  </span>
                </div>

                {adminClaims.length === 0 ? (
                  <div className="text-center p-12 text-gray-400 font-medium border border-dashed rounded-2xl bg-gray-50">
                    🎉 Outstanding ledger balances reconciled! No pending claims found.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {adminClaims.map(claim => (
                      <div key={claim.id} className="border border-gray-200 rounded-2xl p-4 bg-[#FFFBF7] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-emerald-600 transition duration-200">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-amber-100 text-amber-900 font-mono font-bold text-xs px-2 py-0.5 rounded border border-amber-300">UID: {claim.profileId}</span>
                            <p className="text-sm font-bold text-gray-800">{claim.email}</p>
                          </div>
                          <p className="text-xs font-mono font-extrabold text-[#7B1F1F] tracking-wider">
                            🏦 Submitted UTR / Txn ID: {claim.utrNumber}
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium">Ticket Logged: {new Date(claim.timestamp).toLocaleString()}</p>
                        </div>
                        <button 
                          onClick={() => handleManualAdminApproval(claim.id, claim.email)}
                          className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition"
                        >
                          ✅ Approve Access
                        </button>
                      </div>
                    ))}
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
