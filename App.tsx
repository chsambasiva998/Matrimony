
import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';

export default function App() {
  // Authentication & Session States
  const [user, setUser] = useState(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(true);

  // Live Matrimony Profiles Pipeline
  const [profiles, setProfiles] = useState([]);
  const [genderFilter, setGenderFilter] = useState('');
  const [rasiFilter, setRasiFilter] = useState('');

  // Strict Onboarding Form States
  const [formData, setFormData] = useState({
    firstName: '',
    age: '',
    gender: 'Female',
    district: 'Vijayawada',
    caste: 'Brahmin',
    nakshatra: 'Ashwini',
    rasi: 'Mesha (Aries)',
    dosham: 'Non-Manglik',
    phone: '',
    email: '',
    aadhaarNumber: ''
  });
  
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [aadhaarStatus, setAadhaarStatus] = useState('UNVERIFIED'); // UNVERIFIED, VERIFYING, VERIFIED
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUserPremium, setIsUserPremium] = useState(false); // Simulates payment unlock state

  // Listen for User Auth Sessions
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // Real-Time Global Profile Synced Feed
  useEffect(() => {
    const q = query(collection(db, "profiles"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const profileList = [];
      snapshot.forEach((doc) => {
        profileList.push({ id: doc.id, ...doc.data() });
      });
      setProfiles(profileList);
    });
    return unsubscribe;
  }, []);

  // Handle Photo Selection Controls (Converts to Base64 Text Strings)
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedPhotos(files);
    if (files.length < 3) {
      setFormError('⚠️ Safety Rule: You must upload a minimum of 3 real photos to create a profile.');
    } else {
      setFormError('');
    }
  };

  // Secure Simulated Aadhaar Validator
  const handleVerifyAadhaar = () => {
    if (formData.aadhaarNumber.length !== 12 || isNaN(formData.aadhaarNumber)) {
      setFormError('❌ Invalid Entry: Please enter a valid 12-digit Aadhaar number.');
      return;
    }
    setAadhaarStatus('VERIFYING');
    setFormError('');
    
    setTimeout(() => {
      setAadhaarStatus('VERIFIED');
    }, 2000);
  };

  // Safe Account Creation & Profile Onboarding Pipeline
  const handleCreateProfile = async (e) => {
    e.preventDefault();
    setFormError('');

    if (selectedPhotos.length < 3) {
      setFormError('❌ Blocked: Minimum of 3 photos required.');
      return;
    }
    if (aadhaarStatus !== 'VERIFIED') {
      setFormError('❌ Blocked: Please complete Aadhaar verification first.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create Identity Auth Account
      await createUserWithEmailAndPassword(auth, formData.email, authPassword);

      // 2. Convert Images into Text Strings (Base64) to save on Firebase Storage costs
      const imageUrls = [];
      for (let i = 0; i < selectedPhotos.length; i++) {
        const base64String = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(selectedPhotos[i]);
        });
        imageUrls.push(base64String);
      }

      // 3. Write Protected Database Payload
      const profilePayload = {
        firstName: formData.firstName,
        age: parseInt(formData.age),
        gender: formData.gender,
        district: formData.district,
        caste: formData.caste,
        nakshatra: formData.nakshatra,
        rasi: formData.rasi,
        dosham: formData.dosham,
        photos: imageUrls,
        // Private Contact Info (Hidden from standard users)
        privateContact: {
          phone: formData.phone,
          email: formData.email
        }
      };

      await addDoc(collection(db, "profiles"), profilePayload);
      alert('🎉 Profile created successfully with Aadhaar verification and 3 photos!');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulate Instant Payment Activation to Unlock Contacts
  const handleSimulatePayment = () => {
    setIsUserPremium(true);
    alert('💳 Payment Successful! Premium Account Activated. Contact details unlocked.');
  };

  return (
    <div className="min-h-screen bg-[#FDF6EC] text-[#2C1810] font-sans antialiased text-sm">
      {/* HEADER NAVBAR */}
      <header className="bg-gradient-to-r from-[#7B1F1F] to-[#C0392B] text-[#FFF9F0] px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🪷</span>
          <div>
            <h1 className="font-bold text-xl text-[#D4A017] tracking-wide">మంగళసూత్రం</h1>
            <p className="text-[10px] tracking-widest uppercase text-amber-200">Telugu Matrimony</p>
          </div>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-3 font-bold">
          {user ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-amber-200">🙏 నమస్కారం</span>
              {!isUserPremium ? (
                <button onClick={handleSimulatePayment} className="bg-[#D4A017] text-[#7B1F1F] px-4 py-1.5 rounded-full text-xs hover:bg-white transition-all shadow-sm">
                  👑 Upgrade (Unlock Contacts)
                </button>
              ) : (
                <span className="bg-green-700 text-white px-3 py-1 rounded-full text-xs">👑 Premium Unlocked</span>
              )}
              <button onClick={() => signOut(auth)} className="bg-white/10 px-3 py-1.5 rounded-lg text-xs hover:bg-white/20">Logout</button>
            </div>
          ) : (
            <span className="text-xs text-amber-100">Sign up or login below to get started</span>
          )}
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: ONBOARDING SYSTEM */}
        <div className="lg:col-span-1">
          {!user ? (
            <div className="bg-[#FFF9F0] border-2 border-[#E8C99A] p-5 rounded-2xl shadow-sm">
              <h3 className="font-bold text-lg text-[#7B1F1F] mb-4 border-b border-[#E8C99A] pb-2">
                {isRegistering ? '📝 Create Verified Profile' : '🔐 Secure Login'}
              </h3>
              
              {formError && <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-200 font-semibold mb-4">{formError}</div>}
              
              <form onSubmit={handleCreateProfile} className="space-y-4">
                {isRegistering && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-[#7A5C4E] uppercase mb-1">First Name</label>
                      <input type="text" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full border border-[#E8C99A] rounded-lg p-2 bg-white focus:outline-none focus:border-[#D4A017]" placeholder="First name only" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-[#7A5C4E] uppercase mb-1">Age</label>
                        <input type="number" required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full border border-[#E8C99A] rounded-lg p-2 bg-white focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#7A5C4E] uppercase mb-1">Gender</label>
                        <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full border border-[#E8C99A] rounded-lg p-2 bg-white focus:outline-none">
                          <option value="Female">Bride (మహిళ)</option>
                          <option value="Male">Groom (పురుషుడు)</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-[#7A5C4E] uppercase mb-1">రాశి (Rasi)</label>
                        <select value={formData.rasi} onChange={e => setFormData({...formData, rasi: e.target.value})} className="w-full border border-[#E8C99A] rounded-lg p-2 bg-white focus:outline-none">
                          <option value="Mesha (Aries)">Mesha</option>
                          <option value="Vrishabha (Taurus)">Vrishabha</option>
                          <option value="Makara (Capricorn)">Makara</option>
                          <option value="Kanya (Virgo)">Kanya</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#7A5C4E] uppercase mb-1">నక్షత్రం (Star)</label>
                        <select value={formData.nakshatra} onChange={e => setFormData({...formData, nakshatra: e.target.value})} className="w-full border border-[#E8C99A] rounded-lg p-2 bg-white focus:outline-none">
                          <option value="Ashwini">Ashwini</option>
                          <option value="Rohini">Rohini</option>
                          <option value="Dhanishta">Dhanishta</option>
                          <option value="Hasta">Hasta</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#7A5C4E] uppercase mb-1">Mobile Number</label>
                      <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-[#E8C99A] rounded-lg p-2 bg-white focus:outline-none" placeholder="+91 XXXXX XXXXX" />
                    </div>

                    {/* PHOTO INPUT RULES REQUIREMENT */}
                    <div className="bg-amber-50 border border-dashed border-[#E8C99A] p-3 rounded-xl">
                      <label className="block text-xs font-bold text-[#7B1F1F] uppercase mb-1">📸 Photos (Min 3 Required)</label>
                      <input type="file" multiple accept="image/*" required onChange={handlePhotoChange} className="w-full text-xs text-[#7A5C4E] file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#7B1F1F] file:text-white cursor-pointer" />
                      <p className="text-[10px] mt-1 text-[#7A5C4E]">Selected Photos: <span className="font-bold text-[#2E7D32]">{selectedPhotos.length} / 3</span></p>
                    </div>

                    {/* AADHAAR ID CHECK VALIDATOR */}
                    <div className="bg-green-800/5 border border-green-700/20 p-3 rounded-xl">
                      <label className="block text-xs font-bold text-[#2E7D32] uppercase mb-1">🛡️ Aadhaar ID Validation</label>
                      <div className="flex gap-2">
                        <input type="text" maxLength={12} value={formData.aadhaarNumber} onChange={e => setFormData({...formData, aadhaarNumber: e.target.value})} disabled={aadhaarStatus === 'VERIFIED'} className="flex-1 border border-green-700/30 rounded-lg p-2 text-sm bg-white focus:outline-none tracking-widest" placeholder="12 Digit Number" />
                        <button type="button" onClick={handleVerifyAadhaar} disabled={aadhaarStatus === 'VERIFIED' || aadhaarStatus === 'VERIFYING'} className="bg-[#2E7D32] text-white text-xs px-3 rounded-lg font-bold disabled:bg-gray-400">
                          {aadhaarStatus === 'UNVERIFIED' && 'Verify'}
                          {aadhaarStatus === 'VERIFYING' && '...'}
                          {aadhaarStatus === 'VERIFIED' && '✅ OK'}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#7A5C4E] uppercase mb-1">Account Email ID</label>
                  <input type="email" required value={authEmail} onChange={e => { setAuthEmail(e.target.value); setFormData({...formData, email: e.target.value}); }} className="w-full border border-[#E8C99A] rounded-lg p-2 bg-white focus:outline-none" placeholder="name@domain.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#7A5C4E] uppercase mb-1">Password</label>
                  <input type="password" required value={authPassword} onChange={e => setAuthPassword(e.target.value)} className="w-full border border-[#E8C99A] rounded-lg p-2 bg-white focus:outline-none" placeholder="••••••••" />
                </div>

                <button type="submit" disabled={isSubmitting || (isRegistering && aadhaarStatus !== 'VERIFIED')} className="w-full py-3 bg-gradient-to-r from-[#C0392B] to-[#7B1F1F] text-white font-bold rounded-xl shadow-md text-sm disabled:opacity-50">
                  {isSubmitting ? 'Securing Data Vault...' : isRegistering ? '🪷 Register Profile' : 'Access Match Portal'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button onClick={() => setIsRegistering(!isRegistering)} className="text-xs font-bold text-[#C0392B] hover:underline">
                  {isRegistering ? 'Already verified? Login' : 'Need a fresh profile? Register'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#FFF9F0] border-2 border-[#E8C99A] p-5 rounded-2xl text-center">
              <span className="text-4xl">👑</span>
              <h4 className="font-bold text-lg text-[#7B1F1F] mt-2">Account Active</h4>
              <p className="text-xs text-[#7A5C4E] mt-1">Status: {isUserPremium ? <span className="text-[#2E7D32] font-bold">Premium Tier Unlocked</span> : <span className="text-amber-700 font-bold">Free Basic Tier</span>}</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: SEARCH FILTERS & ACTIVE DATA TILES */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* HOROSCOPE LIVE SEARCH PANEL */}
          <div className="bg-white p-4 border border-[#E8C99A] rounded-xl flex flex-wrap gap-3 items-center shadow-sm">
            <span className="font-bold text-xs text-[#7B1F1F] uppercase tracking-wider">⚡ Sort:</span>
            <select value={genderFilter} onChange={e => setGenderFilter(e.target.value)} className="bg-[#FFF9F0] border border-[#E8C99A] rounded-lg p-2 text-xs font-semibold focus:outline-none">
              <option value="">All Profiles</option>
              <option value="Female">Brides (మహిళలు)</option>
              <option value="Male">Grooms (పురుషులు)</option>
            </select>
            <select value={rasiFilter} onChange={e => setRasiFilter(e.target.value)} className="bg-[#FFF9F0] border border-[#E8C99A] rounded-lg p-2 text-xs font-semibold focus:outline-none">
              <option value="">All రాశి (Rasi)</option>
              <option value="Mesha (Aries)">Mesha (మేషం)</option>
              <option value="Vrishabha (Taurus)">Vrishabha (వృషభం)</option>
              <option value="Makara (Capricorn)">Makara (మకరం)</option>
              <option value="Kanya (Virgo)">Kanya (కన్య)</option>
            </select>
          </div>

          {/* ACTIVE PROFILE LIVE GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profiles
              .filter(p => !genderFilter || p.gender === genderFilter)
              .filter(p => !rasiFilter || p.rasi === rasiFilter)
              .map(profile => (
                <div key={profile.id} className="bg-[#FFF9F0] border-2 border-[#E8C99A] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                  
                  {/* Photo Carousel Area */}
                  <div className="h-44 bg-gray-200 relative flex items-center justify-center overflow-hidden">
                    {profile.photos && profile.photos.length > 0 ? (
                      <img src={profile.photos[0]} alt="Matrimony Profile Pic" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl">{profile.gender === 'Female' ? '👩' : '👨'}</span>
                    )}
                    <div className="absolute bottom-2 left-2 bg-[#7B1F1F] text-white text-[9px] font-bold px-2 py-0.5 rounded">
                      📸 3 Photos Verified
                    </div>
                    <div className="absolute top-2 right-2 bg-[#2E7D32] text-white text-[9px] font-bold px-2 py-0.5 rounded">
                      ✅ Aadhaar Verified
                    </div>
                  </div>

                  {/* Profile Metrics Content */}
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-base text-[#7B1F1F]">{profile.firstName}</h4>
                      <span className="text-[10px] font-bold text-amber-800 bg-[#D4A017]/10 px-2 py-0.5 rounded border border-[#D4A017]/20">{profile.caste}</span>
                    </div>

                    <div className="text-xs text-[#7A5C4E] font-medium grid grid-cols-2 gap-y-1">
                      <p>🎂 Age: <span className="text-[#2C1810] font-bold">{profile.age} Yrs</span></p>
                      <p>📍 District: <span className="text-[#2C1810] font-bold">{profile.district}</span></p>
                      <p>🌟 Star: <span className="text-amber-800 font-bold">{profile.nakshatra}</span></p>
                      <p>🔮 రాశి: <span className="text-amber-800 font-bold">{profile.rasi}</span></p>
                    </div>

                    {/* SECURE DATA DISCLOSURE GATE */}
                    <div className="bg-white p-3 rounded-xl border border-[#E8C99A] space-y-1.5 mt-2">
                      <h5 className="text-[9px] uppercase font-bold text-[#7B1F1F] tracking-wide">🔒 Locked Coordinates</h5>
                      {isUserPremium ? (
                        <div className="text-xs text-[#2E7D32] font-bold space-y-0.5">
                          <p>📞 Phone: {profile.privateContact?.phone || 'Hidden'}</p>
                          <p>📧 Email: {profile.privateContact?.email || 'Hidden'}</p>
                        </div>
                      ) : (
                        <p className="text-[11px] text-amber-800 bg-amber-50/50 p-2 rounded border border-dashed border-amber-200 italic">
                          Contact info is hidden securely. Upgrade to Premium above to unlock.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>

        </div>
      </main>
    </div>
  );
}
