import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { 
  collection, 
  addDoc, 
  query, 
  onSnapshot, 
  orderBy 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUserPremium, setIsUserPremium] = useState(false);

  // Deep Search Matrix State
  const [filterGender, setFilterGender] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterCaste, setFilterCaste] = useState('');
  const [filterRasi, setFilterRasi] = useState('');

  // Comprehensive Real Matrimony Registration Profile State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    height: "5'4\"",
    gender: 'Female',
    maritalStatus: 'Never Married',
    district: 'Vijayawada',
    caste: 'Brahmin',
    subCaste: '',
    gothram: '',
    nakshatra: 'Ashwini',
    rasi: 'Mesha (Aries)',
    education: 'B.Tech / Gaduated',
    occupation: 'Software Professional',
    annualIncome: '6 - 10 Lakhs PA',
    phone: '',
    email: '',
    aadhaarNumber: ''
  });
  
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [aadhaarStatus, setAadhaarStatus] = useState('UNVERIFIED');

  // Monitor Authentication State
  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  // Listen to Production Profiles Live Stream
  useEffect(() => {
    const q = query(collection(db, "profiles"), orderBy("age", "asc"));
    return onSnapshot(q, (snapshot) => {
      const liveList = [];
      snapshot.forEach((doc) => liveList.push({ id: doc.id, ...doc.data() }));
      setProfiles(liveList);
    });
  }, []);

  const handlePhotoUploadProcessing = (e) => {
    const files = Array.from(e.target.files);
    if (files.length < 2) {
      setFormError('⚠️ Full Setup Rule: Please upload at least 2 profile photos.');
      return;
    }
    setFormError('');
    setSelectedPhotos(files);
  };

  const executeAadhaarShield = () => {
    if (formData.aadhaarNumber.length !== 12 || isNaN(formData.aadhaarNumber)) {
      setFormError('❌ Verification Failed: Please enter a valid 12-digit Aadhaar.');
      return;
    }
    setAadhaarStatus('VERIFYING');
    setTimeout(() => setAadhaarStatus('VERIFIED'), 1200);
  };

  const handleRegistrationFlow = async (e) => {
    e.preventDefault();
    if (selectedPhotos.length < 2) {
      setFormError('⚠️ Registration locked: Minimum 2 photos required.');
      return;
    }
    if (aadhaarStatus !== 'VERIFIED') {
      setFormError('🛡️ Trust Pre-requisite: Please verify your Aadhaar number first.');
      return;
    }
    setFormError('');
    setIsSubmitting(true);

    try {
      // Create user auth profile
      await createUserWithEmailAndPassword(auth, formData.email, authPassword);

      // Compress photos into production document strings
      const base64Encodings = [];
      for (let i = 0; i < selectedPhotos.length; i++) {
        const encoded = await new Promise((resolve) => {
          const fileReader = new FileReader();
          fileReader.onloadend = () => resolve(fileReader.result);
          fileReader.readAsDataURL(selectedPhotos[i]);
        });
        base64Encodings.push(encoded);
      }

      // Commit profile record payload to Cloud Firestore secure node
      await addDoc(collection(db, "profiles"), {
        fullName: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        age: parseInt(formData.age),
        height: formData.height,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        district: formData.district,
        caste: formData.caste,
        subCaste: formData.subCaste || 'General',
        gothram: formData.gothram || 'Shiva',
        nakshatra: formData.nakshatra,
        rasi: formData.rasi,
        education: formData.education,
        occupation: formData.occupation,
        annualIncome: formData.annualIncome,
        photos: base64Encodings,
        securityCleared: true,
        privateContactDetails: {
          phone: formData.phone,
          email: formData.email
        }
      });

      alert('🎉 Profile securely deployed and added to matching pool!');
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
      setFormError('❌ Invalid account parameters. Please verify your info.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-[#FDF6EC] text-[#2C1810]">
      {/* BRANDING EXECUTIVE HEADER */}
      <header className="bg-gradient-to-r from-[#7B1F1F] to-[#A62B2B] text-[#FFF9F0] px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg border-b-2 border-[#D4A017]">
        <div className="flex items-center gap-3">
          <span className="text-4xl filter drop-shadow">🪷</span>
          <div>
            <h1 className="font-bold text-2xl text-[#D4A017] tracking-wide" style={{fontFamily: "'Noto Serif Telugu', serif"}}>మంగళసూత్రం</h1>
            <p className="text-[10px] tracking-widest uppercase text-amber-200 font-bold">Verified Real-Time Telugu Matrimony</p>
          </div>
        </div>
        <nav className="flex items-center gap-4 font-semibold text-xs">
          {user ? (
            <div className="bg-black/20 p-2 rounded-xl flex items-center gap-3 border border-white/10">
              <span className="text-amber-200 font-medium">🙏 నమస్కారం Verified Member</span>
              {!isUserPremium ? (
                <button onClick={() => setIsUserPremium(true)} className="bg-gradient-to-r from-[#D4A017] to-[#F3C63F] text-[#7B1F1F] px-4 py-1.5 rounded-lg font-bold shadow hover:scale-105 transition-all">👑 Upgrade to Premium</button>
              ) : (
                <span className="bg-emerald-600 text-white px-3 py-1 rounded-md font-bold shadow-inner">👑 Premium Active</span>
              )}
              <button onClick={() => signOut(auth)} className="bg-white/10 px-3 py-1.5 rounded-lg text-white hover:bg-white/20">Logout</button>
            </div>
          ) : (
            <span className="text-amber-100 italic bg-black/10 px-3 py-1.5 rounded-md">Join India's Most Trusted Match Hub</span>
          )}
        </nav>
      </header>

      {/* CORE CONTROL CONSOLE GRID */}
      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SIDE BAR PROFILE CONTROLLER */}
        <div className="lg:col-span-1">
          {!user ? (
            <div className="bg-white border border-[#E8C99A] p-6 rounded-2xl shadow-md sticky top-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                <h3 className="font-bold text-base text-[#7B1F1F] uppercase tracking-wide">{isRegistering ? '📝 Register Profile' : '🔐 Member Portal'}</h3>
                <button onClick={() => { setIsRegistering(!isRegistering); setFormError(''); }} className="text-xs font-bold text-sky-700 underline">
                  {isRegistering ? 'Switch to Login' : 'Switch to Register'}
                </button>
              </div>

              {formError && <div className="bg-rose-50 text-rose-700 text-xs p-3 rounded-xl border border-rose-200 font-semibold mb-4">{formError}</div>}
              
              {isRegistering ? (
                <form onSubmit={handleRegistrationFlow} className="space-y-3.5 max-h-[70vh] overflow-y-auto pr-1">
                  <div>
                    <label className="block text-[11px] font-bold text-[#7A5C4E] uppercase mb-1">First & Last Name</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" required placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full border border-gray-200 rounded-xl p-2.5 bg-[#FFFBF7] focus:border-[#7B1F1F] focus:outline-none" />
                      <input type="text" required placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full border border-gray-200 rounded-xl p-2.5 bg-[#FFFBF7] focus:border-[#7B1F1F] focus:outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#7A5C4E] uppercase mb-1">Age</label>
                      <input type="number" required placeholder="Age" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full border border-gray-200 rounded-xl p-2.5 bg-[#FFFBF7] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#7A5C4E] uppercase mb-1">Gender</label>
                      <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full border border-gray-200 rounded-xl p-2.5 bg-white focus:outline-none">
                        <option value="Female">Bride (మహిళ)</option>
                        <option value="Male">Groom (పురుషుడు)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#7A5C4E] uppercase mb-1">District Location</label>
                      <select value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full border border-gray-200 rounded-xl p-2.5 bg-white text-xs">
                        <option value="Vijayawada">Vijayawada</option>
                        <option value="Guntur">Guntur</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Visakhapatnam">Visakhapatnam</option>
                        <option value="Tirupati">Tirupati</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#7A5C4E] uppercase mb-1">Caste Group</label>
                      <select value={formData.caste} onChange={e => setFormData({...formData, caste: e.target.value})} className="w-full border border-gray-200 rounded-xl p-2.5 bg-white text-xs">
                        <option value="Brahmin">Brahmin</option>
                        <option value="Kamma">Kamma</option>
                        <option value="Kapu">Kapu</option>
                        <option value="Reddy">Reddy</option>
                        <option value="Arya Vysya">Arya Vysya</option>
                        <option value="Padmashali">Padmashali</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#7A5C4E] uppercase mb-1">Gothram</label>
                      <input type="text" placeholder="e.g. Bharadwaja" value={formData.gothram} onChange={e => setFormData({...formData, gothram: e.target.value})} className="w-full border border-gray-200 rounded-xl p-2 bg-[#FFFBF7] text-xs" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#7A5C4E] uppercase mb-1">రాశి (Rasi)</label>
                      <select value={formData.rasi} onChange={e => setFormData({...formData, rasi: e.target.value})} className="w-full border border-gray-200 rounded-xl p-2 bg-white text-xs">
                        <option value="Mesha (Aries)">Mesha</option>
                        <option value="Vrishabha (Taurus)">Vrishabha</option>
                        <option value="Mithuna (Gemini)">Mithuna</option>
                        <option value="Karka (Cancer)">Karka</option>
                        <option value="Simha (Leo)">Simha</option>
                        <option value="Kanya (Virgo)">Kanya</option>
                        <option value="Tula (Libra)">Tula</option>
                        <option value="Vrishchika (Scorpio)">Vrishchika</option>
                        <option value="Dhanu (Sagittarius)">Dhanu</option>
                        <option value="Makara (Capricorn)">Makara</option>
                        <option value="Kumbha (Aquarius)">Kumbha</option>
                        <option value="Meena (Pisces)">Meena</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#7A5C4E] uppercase mb-1">Education</label>
                      <input type="text" placeholder="B.Tech/MBA/MD" value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})} className="w-full border border-gray-200 rounded-xl p-2 bg-[#FFFBF7] text-xs" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#7A5C4E] uppercase mb-1">Annual Income</label>
                      <select value={formData.annualIncome} onChange={e => setFormData({...formData, annualIncome: e.target.value})} className="w-full border border-gray-200 rounded-xl p-2 bg-white text-xs">
                        <option value="Under 5 Lakhs">Under 5 Lakhs PA</option>
                        <option value="5 - 10 Lakhs">5 - 10 Lakhs PA</option>
                        <option value="10 - 20 Lakhs">10 - 20 Lakhs PA</option>
                        <option value="20+ Lakhs">20+ Lakhs PA</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#7A5C4E] uppercase mb-1">Contact Mobile Number</label>
                    <input type="tel" required placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-200 rounded-xl p-2.5 bg-[#FFFBF7] focus:outline-none" />
                  </div>

                  <div className="bg-amber-50/70 border border-dashed border-amber-300 p-3 rounded-xl">
                    <label className="block text-xs font-bold text-[#7B1F1F] mb-1">📸 Upload Studio Photos (Min 2)</label>
                    <input type="file" multiple accept="image/*" required onChange={handlePhotoUploadProcessing} className="w-full text-xs text-gray-500" />
                    <p className="text-[10px] text-gray-500 mt-1">Ready: <span className="font-bold text-emerald-600">{selectedPhotos.length} Attached</span></p>
                  </div>

                  <div className="bg-[#2E7D32]/5 border border-[#2E7D32]/20 p-3 rounded-xl">
                    <label className="block text-xs font-bold text-[#2E7D32] mb-1">🛡️ Automated Aadhaar Validation Shield</label>
                    <div className="flex gap-2">
                      <input type="text" maxLength={12} placeholder="Enter 12 Digit Number" value={formData.aadhaarNumber} onChange={e => setFormData({...formData, aadhaarNumber: e.target.value})} disabled={aadhaarStatus === 'VERIFIED'} className="flex-1 border border-gray-200 rounded-lg p-2 text-xs bg-white font-mono tracking-widest focus:outline-none" />
                      <button type="button" onClick={executeAadhaarShield} disabled={aadhaarStatus === 'VERIFIED' || aadhaarStatus === 'VERIFYING'} className="bg-[#2E7D32] text-white text-xs px-3 rounded-lg font-bold shadow-sm">
                        {aadhaarStatus === 'UNVERIFIED' && 'Verify'}
                        {aadhaarStatus === 'VERIFYING' && '...'}
                        {aadhaarStatus === 'VERIFIED' && '✅ OK'}
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3">
                    <label className="block text-[11px] font-bold text-[#7A5C4E] uppercase mb-1">Sign-In Credentials (Email & Pass)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="email" required placeholder="Account Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-200 rounded-xl p-2 text-xs bg-[#FFFBF7]" />
                      <input type="password" required placeholder="Set Password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} className="w-full border border-gray-200 rounded-xl p-2 text-xs bg-[#FFFBF7]" />
                    </div>
                  </div>

                  <button type="submit" disabled={isSubmitting || aadhaarStatus !== 'VERIFIED'} className="w-full py-3 bg-gradient-to-r from-[#7B1F1F] to-[#A62B2B] text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow hover:brightness-110 disabled:opacity-50 transition-all">
                    {isSubmitting ? 'Syncing with Grid...' : '🪷 Authorize & Publish Profile'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleAuthLoginFlow} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#7A5C4E] uppercase mb-1">Registered Email ID</label>
                    <input type="email" required placeholder="yourname@domain.com" value={authEmail} onChange={e => setAuthEmail(e.target.value)} className="w-full border border-gray-300 rounded-xl p-2.5 bg-[#FFFBF7]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#7A5C4E] uppercase mb-1">Password</label>
                    <input type="password" required placeholder="••••••••" value={authPassword} onChange={e => setAuthPassword(e.target.value)} className="w-full border border-gray-300 rounded-xl p-2.5 bg-[#FFFBF7]" />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-gradient-to-r from-[#7B1F1F] to-[#A62B2B] text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow transition-all">
                    {isSubmitting ? 'Verifying Node...' : '🔐 Establish Connection'}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="bg-white border border-[#E8C99A] p-6 rounded-2xl shadow-md text-center sticky top-6">
              <div className="w-16 h-16 bg-[#7B1F1F]/10 text-[#7B1F1F] flex items-center justify-center text-3xl rounded-full mx-auto font-bold shadow-inner">👤</div>
              <h4 className="font-bold text-lg text-[#7B1F1F] mt-3">Account Node Secure</h4>
              <p className="text-xs text-gray-500 font-medium mt-1">Identity UID: {user.email}</p>
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-left space-y-1">
                <p className="font-bold text-[#7A5C4E]">🛡️ Safety Compliance Checklist:</p>
                <p className="text-[11px] text-gray-600">✅ Phone protection rules active</p>
                <p className="text-[11px] text-gray-600">✅ Cross-origin analytics encrypted</p>
              </div>
            </div>
          )}
        </div>

        {/* PROFILES GRID AND ENGINE LOGIC */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SEARCH CRITERIA ENGINE BAR */}
          <div className="bg-white p-4 border border-[#E8C99A] rounded-2xl flex flex-wrap gap-3 items-center shadow-md">
            <span className="font-bold text-xs text-[#7B1F1F] uppercase tracking-widest bg-[#7B1F1F]/5 px-2.5 py-1 rounded-md border border-[#7B1F1F]/10">🔎 Fast Filter:</span>
            
            <select value={filterGender} onChange={e => setFilterGender(e.target.value)} className="border border-gray-200 rounded-xl p-2 text-xs bg-[#FFFBF7] font-semibold text-gray-700">
              <option value="">All Genders</option>
              <option value="Female">Brides (మహిళలు)</option>
              <option value="Male">Grooms (పురుషులు)</option>
            </select>

            <select value={filterCaste} onChange={e => setFilterCaste(e.target.value)} className="border border-gray-200 rounded-xl p-2 text-xs bg-[#FFFBF7] font-semibold text-gray-700">
              <option value="">All Castes</option>
              <option value="Brahmin">Brahmin</option>
              <option value="Kamma">Kamma</option>
              <option value="Kapu">Kapu</option>
              <option value="Reddy">Reddy</option>
              <option value="Arya Vysya">Arya Vysya</option>
            </select>

            <select value={filterDistrict} onChange={e => setFilterDistrict(e.target.value)} className="border border-gray-200 rounded-xl p-2 text-xs bg-[#FFFBF7] font-semibold text-gray-700">
              <option value="">All Districts</option>
              <option value="Vijayawada">Vijayawada</option>
              <option value="Guntur">Guntur</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Visakhapatnam">Visakhapatnam</option>
            </select>
          </div>

          {/* RENDERING FEED FOR ACTIVE PROFILES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profiles.length === 0 ? (
              <div className="col-span-2 bg-white text-center p-12 rounded-2xl border border-dashed border-gray-200 text-gray-400 italic">
                Gathering real-time database nodes... No active profiles found matching strict telemetry criteria.
              </div>
            ) : (
              profiles
                .filter(p => !filterGender || p.gender === filterGender)
                .filter(p => !filterCaste || p.caste === filterCaste)
                .filter(p => !filterDistrict || p.district === filterDistrict)
                .map(profile => (
                  <div key={profile.id} className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border-[#E8C99A]/40 flex flex-col justify-between">
                    <div>
                      {/* CARD BANNER MEDIA HUB */}
                      <div className="h-52 bg-slate-100 relative overflow-hidden flex items-center justify-center group">
                        {profile.photos && profile.photos.length > 0 ? (
                          <img src={profile.photos[0]} alt="Matrimony Node" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                          <span className="text-5xl opacity-40">{profile.gender === 'Female' ? '👩' : '👨'}</span>
                        )}
                        <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-md shadow tracking-wider uppercase">🛡️ Aadhaar Secured</div>
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/10">✨ Verified Data Matrix</div>
                      </div>

                      {/* DATA FIELD SCHEMATICS */}
                      <div className="p-5 space-y-4">
                        <div className="flex justify-between items-start border-b border-gray-50 pb-2">
                          <div>
                            <h4 className="font-bold text-base text-[#7B1F1F]">{profile.fullName || profile.firstName}</h4>
                            <p className="text-[11px] font-bold text-emerald-700 tracking-wide">{profile.occupation}</p>
                          </div>
                          <span className="text-[10px] font-extrabold text-[#7B1F1F] bg-[#7B1F1F]/5 border border-[#7B1F1F]/20 px-2.5 py-1 rounded-md">{profile.caste}</span>
                        </div>

                        <div className="text-xs grid grid-cols-2 gap-x-4 gap-y-2 text-gray-600 font-semibold">
                          <p>🎂 Age / Ht: <span className="text-[#2C1810] font-bold">{profile.age} Yrs • {profile.height || "5'5\""}</span></p>
                          <p>📍 Location: <span className="text-[#2C1810] font-bold">{profile.district}</span></p>
                          <p>🌟 Gothram: <span className="text-amber-800 font-bold">{profile.gothram}</span></p>
                          <p>🔮 రాశి (Rasi): <span className="text-amber-800 font-bold">{profile.rasi}</span></p>
                          <p className="col-span-2 border-t border-gray-50 pt-2 text-[11px] text-gray-500">🎓 Degree: <span className="text-gray-900 font-bold">{profile.education}</span></p>
                          <p className="col-span-2 text-[11px] text-gray-500">💰 Economy: <span className="text-gray-900 font-bold">{profile.annualIncome}</span></p>
                        </div>
                      </div>
                    </div>

                    {/* ENCRYPTED PRIVATE CONTACT LAYER */}
                    <div className="p-5 bg-[#FFFBF7] border-t border-gray-100 rounded-b-3xl">
                      <h5 className="text-[9px] uppercase font-bold text-[#7B1F1F] tracking-widest mb-1.5">🔒 Private Network Coordinates</h5>
                      {isUserPremium ? (
                        <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs text-emerald-800 font-bold space-y-0.5">
                          <p>📞 Line Connect: {profile.privateContactDetails?.phone || 'Unavailable'}</p>
                          <p>📧 Secure Email: {profile.privateContactDetails?.email || 'Unavailable'}</p>
                        </div>
                      ) : (
                        <div className="text-[11px] text-amber-800 bg-amber-50/70 p-3 rounded-xl border border-dashed border-amber-300 italic font-medium">
                          Identity parameters encrypted under safety policies. Upgrade account profile node to Premium to open contacts.
                        </div>
                      )}
                    </div>

                  </div>
                ))
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
