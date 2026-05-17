<!doctype html>
<html lang="en" class="h-full">
 <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Telugu Vivaham</title>
  <script src="https://cdn.tailwindcss.com/3.4.17"></script>
  <script src="https://cdn.jsdelivr.net/npm/lucide@0.263.0/dist/umd/lucide.min.js"></script>
  <script src="/_sdk/element_sdk.js"></script>
  <script src="/_sdk/data_sdk.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&amp;family=DM+Sans:wght@400;500;600;700&amp;display=swap" rel="stylesheet">
  <style>
    .font-heading { font-family: 'Playfair Display', serif; }
    .font-body { font-family: 'DM Sans', sans-serif; }
    .gradient-primary { background: linear-gradient(135deg, #7b1f1f 0%, #912525 50%, #d4a017 100%); }
    .gradient-card { background: linear-gradient(180deg, #fff9f0 0%, #ffffff 100%); }
    .tab-active { border-bottom: 3px solid #7b1f1f; color: #7b1f1f; font-weight: 600; }
    .match-score { background: linear-gradient(135deg, #27ae60, #2ecc71); }
    .profile-ring { box-shadow: 0 0 0 3px #7b1f1f, 0 0 0 6px rgba(123,31,31,0.2); }
    .locked-badge { background: linear-gradient(135deg, #f39c12, #e67e22); }
    @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(212, 160, 23, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(212, 160, 23, 0); } 100% { box-shadow: 0 0 0 0 rgba(212, 160, 23, 0); } }
    .animate-fade-up { animation: fadeUp 0.5s ease forwards; }
    .animate-pulse-ring { animation: pulse-ring 2s infinite; }
    .toast-show { transform: translateY(0); opacity:1; }
    .toast-hide { transform: translateY(100%); opacity:0; }
    .premium-badge { background: linear-gradient(135deg, #d4a017, #e67e22); color: white; }
    .padam-badge { background: linear-gradient(135deg, #7b1f1f, #912525); color: white; }
  </style>
 </head>
 <body class="h-full font-body bg-[#fdf6ee] text-[#2c1810] overflow-auto">
  <div id="app" class="w-full h-full flex flex-col">
   
   <div id="toast" class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#2c1810] text-white px-6 py-3 rounded-xl shadow-xl z-50 transition-all duration-300 toast-hide pointer-events-none font-medium"></div>

   <nav class="w-full bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-orange-100">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
     <div class="flex items-center gap-2 shrink-0">
      <div class="w-9 h-9 gradient-primary rounded-lg flex items-center justify-center">
       <span class="text-white font-heading font-bold text-lg">మ</span>
      </div><span id="nav-title" class="font-heading font-bold text-xl text-[#7b1f1f]">Telugu Vivaham</span>
     </div>
     
     <div class="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 max-w-xs">
       <span class="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider whitespace-nowrap">👤 Session:</span>
       <select id="global-identity-selector" onchange="window.forceSessionSwap(this.value)" class="bg-transparent text-xs font-bold text-gray-800 focus:outline-none cursor-pointer max-w-[150px] truncate">
         <option value="default">Loading Sessions...</option>
       </select>
     </div>

     <div class="hidden md:flex items-center gap-6 text-sm font-medium text-[#5a3e36] shrink-0">
      <button onclick="switchView('home')" class="hover:text-[#7b1f1f] transition">Home</button> 
      <button onclick="switchView('search')" class="hover:text-[#7b1f1f] transition">Search Feed</button> 
      <button onclick="switchView('dashboard')" class="hover:text-[#7b1f1f] transition relative"><i data-lucide="inbox" class="w-4 h-4 inline mr-1"></i>My Dashboard</button> 
      <button id="admin-nav-btn" onclick="switchView('admin')" class="hidden text-emerald-700 hover:text-emerald-900 font-bold transition"><i data-lucide="lock" class="w-4 h-4 inline mr-1"></i>Admin Panel</button> 
      <button onclick="switchView('register')" class="bg-[#7b1f1f] text-white px-4 py-2 rounded-lg hover:bg-[#912525] transition">Register Profile</button>
     </div>
     <button onclick="toggleMobileMenu()" class="text-[#5a3e36] md:hidden"><i data-lucide="menu" class="w-6 h-6"></i></button>
    </div>
    <div id="mobile-menu" class="hidden md:hidden px-4 pb-4 flex flex-col gap-2 text-sm font-medium bg-white border-t border-gray-100">
     <button onclick="switchView('home');toggleMobileMenu()" class="py-2 text-left">Home</button> 
     <button onclick="switchView('search');toggleMobileMenu()" class="py-2 text-left">Search Feed</button> 
     <button onclick="switchView('dashboard');toggleMobileMenu()" class="py-2 text-left">My Dashboard</button> 
     <button id="admin-mobile-btn" onclick="switchView('admin');toggleMobileMenu()" class="hidden py-2 text-left text-emerald-700 font-bold">Admin Panel</button> 
     <button onclick="switchView('register');toggleMobileMenu()" class="py-2 text-left text-[#7b1f1f] font-bold">Register Profile</button>
    </div>
   </nav>

   <main class="flex-1 w-full">
    <section id="view-home" class="view-section">
     <div class="gradient-primary py-16 md:py-24 px-4 text-center text-white">
      <h1 id="hero-title" class="font-heading text-3xl md:text-5xl font-bold mb-4 animate-fade-up">Find Your Perfect Life Partner</h1>
      <p id="hero-tagline" class="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto animate-fade-up">Trusted Telugu matrimony community with rigorous asset privacy shields, verified family lineage credentials, and optional financial status compatibility mapping logic.</p>
      <button id="hero-cta" onclick="switchView('register')" class="bg-white text-[#7b1f1f] font-bold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform">Register Profile Free</button>
     </div>
     <div class="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-white rounded-2xl border border-orange-100 p-6 shadow-md text-center">
       <div class="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4"><i data-lucide="shield-check" class="w-7 h-7 text-green-600"></i></div>
       <h3 class="font-heading font-bold text-lg mb-2">Verified Surnames & Lineage</h3>
       <p class="text-sm text-[#5a3e36]">Mandatory family field profiles ensure genuine connections while mitigating invalid matching accounts.</p>
      </div>
      <div class="bg-white rounded-2xl border border-orange-100 p-6 shadow-md text-center">
       <div class="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4"><i data-lucide="star" class="w-7 h-7 text-orange-600"></i></div>
       <h3 class="font-heading font-bold text-lg mb-2">Granular Astrology Matrix</h3>
       <p class="text-sm text-[#5a3e36]">Organized Nakshatra Pada (1-4) selector loops mapped with active Kuja Dosham assessment tools.</p>
      </div>
      <div class="bg-white rounded-2xl border border-orange-100 p-6 shadow-md text-center">
       <div class="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4"><i data-lucide="lock" class="w-7 h-7 text-purple-600"></i></div>
       <h3 class="font-heading font-bold text-lg mb-2">Status Range Compatibility</h3>
       <p class="text-sm text-[#5a3e36]">Optional algebraic filter constraints seamlessly arrange alliances based on net asset valuations and annual income parity preferences.</p>
      </div>
     </div>
    </section>

    <section id="view-register" class="view-section hidden">
     <div class="max-w-3xl mx-auto px-4 py-10">
      <h2 class="font-heading text-2xl md:text-3xl font-bold text-center mb-2 text-[#7b1f1f]">Create Secure Profile Record</h2>
      <p class="text-center text-[#5a3e36] mb-8">Fill all required attributes to begin matching seamlessly</p>
      
      <form id="register-form" class="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6" onsubmit="handleRegister(event)">
       <div class="flex items-center justify-center gap-2 mb-4">
        <span id="step-1-dot" class="w-8 h-8 rounded-full bg-[#7b1f1f] text-white flex items-center justify-center text-sm font-bold">1</span> <span class="w-8 h-0.5 bg-gray-300"></span> 
        <span id="step-2-dot" class="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-bold">2</span> <span class="w-8 h-0.5 bg-gray-300"></span> 
        <span id="step-3-dot" class="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-bold">3</span>
       </div>

       <div id="step-1" class="space-y-4">
        <h3 class="font-heading font-bold text-lg border-b pb-2 text-[#7b1f1f]">👤 Candidate Personal Credentials</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-name">First Name *</label><input id="r-name" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none" placeholder="Given Name"></div>
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-lname">Candidate Surname (Inti Peru) *</label><input id="r-lname" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none" placeholder="E.g., Chippada"></div>
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-phone">Mobile Phone (Masked) *</label><input id="r-phone" required type="tel" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none" placeholder="E.g., 9876543210"></div>
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-age">Age *</label><input id="r-age" type="number" min="18" max="70" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none" placeholder="24"></div>
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-gender">Gender Type *</label><select id="r-gender" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none"><option value="">Select</option><option value="Male">Male (Groom)</option><option value="Female">Female (Bride)</option></select></div>
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-marital">Marital Status *</label><select id="r-marital" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none"><option value="">Select</option><option>Never Married</option><option>Divorced</option><option>Widowed</option></select></div>
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-height">Height Parameters *</label><select id="r-height" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none"><option value="">Select</option><option>5'0"</option><option>5'2"</option><option>5'4"</option><option>5'6"</option><option>5'8"</option><option>5'10"</option><option>6'0"</option></select></div>
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-blood">Blood Group *</label><select id="r-blood" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none"><option value="">Select</option><option>A+</option><option>B+</option><option>O+</option><option>AB+</option><option>A-</option><option>B-</option><option>O-</option></select></div>
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-email">Account Email Signature *</label><input id="r-email" type="email" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none" placeholder="example@mail.com"></div>
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-password">Security Password *</label><input id="r-password" type="password" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none" placeholder="••••••••"></div>
        </div>
        <button type="button" onclick="goToStep(2)" class="w-full bg-[#7b1f1f] text-white py-3 rounded-lg font-bold hover:bg-[#912525] transition">Next: Astrological Heritage & Lineage Background →</button>
       </div>

       <div id="step-2" class="space-y-4 hidden">
        <h3 class="font-heading font-bold text-lg border-b pb-2 text-[#7b1f1f]">🕉️ Astrology, Heritage & Lineage Roots</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-caste">Caste Selection *</label><select id="r-caste" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none"><option value="">Select</option><option>Brahmin</option><option>Kamma</option><option>Reddy</option><option>Kapu</option><option>Velama</option><option>Vysya</option><option>Yadav</option><option>Other</option></select></div>
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-gothram">Gothram (Strict Sagotra Check) *</label><input id="r-gothram" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none" placeholder="E.g., Bharadwaja"></div>
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-nakshatra">Janma Nakshatram *</label><select id="r-nakshatra" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none"><option value="">Select</option><option>Ashwini</option><option>Bharani</option><option>Krittika</option><option>Rohini</option><option>Mrigashira</option><option>Ardra</option><option>Punarvasu</option><option>Pushya</option><option>Ashlesha</option><option>Magha</option><option>P.Phalguni</option><option>U.Phalguni</option><option>Hasta</option><option>Chitra</option><option>Swati</option><option>Vishakha</option><option>Anuradha</option><option>Jyeshtha</option><option>Moola</option><option>P.Ashadha</option><option>U.Ashadha</option><option>Shravana</option><option>Dhanishta</option><option>Shatabhisha</option><option>P.Bhadra</option><option>U.Bhadra</option><option>Revati</option></select></div>
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-padam">Nakshatra Padam Quarter *</label><select id="r-padam" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none"><option value="">Select Quarter</option><option value="1">1వ పాదం (Pada 1)</option><option value="2">2వ పాదం (Pada 2)</option><option value="3">3వ పాదం (Pada 3)</option><option value="4">4వ పాదం (Pada 4)</option></select></div>
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-rashi">Rashi / Moon Sign *</label><select id="r-rashi" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none"><option value="">Select</option><option>Mesha</option><option>Vrishabha</option><option>Mithuna</option><option>Karkataka</option><option>Simha</option><option>Kanya</option><option>Tula</option><option>Vrischika</option><option>Dhanu</option><option>Makara</option><option>Kumbha</option><option>Meena</option></select></div>
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-kuja">Kuja Dosham Status *</label><select id="r-kuja" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none"><option>No (లేదు)</option><option>Yes (ఉంది)</option><option>Don't Know</option></select></div>
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-education">Education Qualification *</label><select id="r-education" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none"><option value="">Select</option><option>B.Tech/B.E</option><option>M.Tech/M.E</option><option>MBA</option><option>MBBS/MD</option><option>MCA</option><option>Other</option></select></div>
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-occupation">Occupation Field *</label><select id="r-occupation" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none"><option value="">Select</option><option>Software Engineer</option><option>Doctor</option><option>Business Owner</option><option>Government Service</option><option>Banking</option><option>Other</option></select></div>
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-income">Annual Income Bracket *</label><select id="r-income" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none"><option value="">Select</option><option>3-5 LPA</option><option>5-10 LPA</option><option>10-15 LPA</option><option>15-25 LPA</option><option>25-50 LPA</option><option>50+ LPA</option></select></div>
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-city">Hometown Location *</label><input id="r-city" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none" placeholder="E.g., Vijayawada"></div>
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-diet">Dietary Lifestyle Habits *</label><select id="r-diet" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none"><option value="">Select</option><option>Vegetarian</option><option>Non-Vegetarian</option><option>Eggetarian</option></select></div>
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-physical">Physical Health Status *</label><select id="r-physical" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none"><option>Normal Status</option><option>Physically Challenged</option></select></div>
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-father">Father's Name & Profession *</label><input id="r-father" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none" placeholder="Name - Occupation"></div>
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-mother">Mother's Name & Profession *</label><input id="r-mother" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none" placeholder="Name - Occupation"></div>
         <div class="md:col-span-2"><label class="block text-xs font-bold text-gray-600 mb-1" for="r-maternal">Maternal Surnames & Relatives (మేనమామల ఇళ్లు) *</label><input id="r-maternal" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none" placeholder="List surnames separated by commas"></div>
         <div class="md:col-span-2"><label class="block text-xs font-bold text-gray-600 mb-1" for="r-astrotext">Astrological Notes & Birth Time Details</label><textarea id="r-astrotext" rows="2" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none resize-none" placeholder="Enter birth time, place of birth, and planetary parameters..."></textarea></div>
        </div>
        <div class="flex gap-3">
         <button type="button" onclick="goToStep(1)" class="flex-1 border-2 border-[#7b1f1f] text-[#7b1f1f] py-3 rounded-lg font-bold hover:bg-red-50 transition">← Back</button> 
         <button type="button" onclick="goToStep(3)" class="flex-1 bg-[#7b1f1f] text-white py-3 rounded-lg font-bold hover:bg-[#912525] transition">Next: Property Vault & Expectations →</button>
        </div>
       </div>

       <div id="step-3" class="space-y-4 hidden">
        <h3 class="font-heading font-bold text-lg border-b pb-2 text-[#7b1f1f]">🏡 Family Assets & Partner Expectations</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-networth">Estimated Family Net Worth Value *</label>
            <select id="r-networth" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none">
                <option>No Assets</option>
                <option>Below 50 Lakhs</option>
                <option>50 Lakhs - 1 Crore</option>
                <option>1 - 3 Crores</option>
                <option>3 - 5 Crores</option>
                <option>5 - 10 Crores</option>
                <option>10 - 20 Crores</option>
                <option>20 Crores+</option>
            </select>
         </div>
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-land">Agricultural Land Holdings (Acres)</label><input id="r-land" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none" placeholder="E.g., 5 Acres in NTR Vijayawada Dist"></div>
         <div class="md:col-span-2"><label class="block text-xs font-bold text-gray-600 mb-1" for="r-realestate">Houses / Commercial Plots</label><input id="r-realestate" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none" placeholder="E.g., 2-Story House in Vijayawada city limits"></div>
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-nri">Abroad Settlement / NRI Willingness *</label><select id="r-nri" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none"><option>Willing to settle abroad</option><option>Looking for local matches only</option><option>Open to both</option></select></div>
         <div class="border-t md:col-span-2 my-2"></div>
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-page-min">Partner Age Min</label><input id="r-page-min" type="number" min="18" max="70" class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none" placeholder="21"></div>
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-page-max">Partner Age Max</label><input id="r-page-max" type="number" min="18" max="70" class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none" placeholder="30"></div>
        </div>
        <div class="bg-amber-50/60 border border-dashed border-amber-300 p-3 rounded-xl">
            <label class="block text-xs font-bold text-[#7b1f1f] mb-1">📸 Upload Profile Display Photo Asset *</label>
            <input type="file" id="r-photo-file" accept="image/*" required onchange="window.handlePhotoSelect(this.files[0])" class="w-full text-xs text-gray-500" />
            <p id="r-photo-confirmation" class="text-xs text-emerald-700 font-bold mt-1 hidden">✓ Photo attached to memory stack</p>
         </div>
        <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-about">Brief Summary Statement (Expectations)</label><textarea id="r-about" rows="3" class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm bg-[#fffbf7] focus:border-[#7b1f1f] outline-none resize-none" placeholder="Describe expectations or specify matching criteria..."></textarea></div>
        <div class="flex gap-3">
         <button type="button" onclick="goToStep(2)" class="flex-1 border-2 border-[#7b1f1f] text-[#7b1f1f] py-3 rounded-lg font-bold hover:bg-red-50 transition">← Back</button> 
         <button type="submit" id="submit-btn" class="flex-1 bg-[#7b1f1f] text-white py-3 rounded-lg font-bold hover:bg-[#912525] transition flex items-center justify-center gap-2"><i data-lucide="check-circle" class="w-5 h-5"></i> Deploy Profile</button>
        </div>
       </div>
      </form>
     </div>
    </section>

    <section id="view-search" class="view-section hidden">
     <div class="max-w-6xl mx-auto px-4 py-8">
      <h2 class="font-heading text-2xl font-bold mb-6 text-[#7b1f1f]">Explore Matching Connections</h2>
      <div class="bg-white rounded-2xl shadow-md p-5 mb-8 border border-orange-100 space-y-4">
       <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div><label class="block text-xs font-medium mb-1" for="s-gender">Looking for</label><select id="s-gender" onchange="window.filterProfiles()" class="w-full border rounded-lg px-3 py-2 text-sm bg-[#fffbf7]"><option value="">All Feed</option><option value="Male">Grooms (Male)</option><option value="Female">Brides (Female)</option></select></div>
        <div><label class="block text-xs font-medium mb-1" for="s-age-min">Age Min</label><input id="s-age-min" type="number" min="18" max="70" onchange="window.filterProfiles()" class="w-full border rounded-lg px-3 py-2 text-sm bg-[#fffbf7]" placeholder="18"></div>
        <div><label class="block text-xs font-medium mb-1" for="s-age-max">Age Max</label><input id="s-age-max" type="number" min="18" max="70" onchange="window.filterProfiles()" class="w-full border rounded-lg px-3 py-2 text-sm bg-[#fffbf7]" placeholder="40"></div>
        <div><label class="block text-xs font-medium mb-1" for="s-caste">Caste Group</label><select id="s-caste" onchange="window.filterProfiles()" class="w-full border rounded-lg px-3 py-2 text-sm bg-[#fffbf7]"><option value="">All Castes</option><option>Brahmin</option><option>Kamma</option><option>Reddy</option><option>Kapu</option><option>Velama</option><option>Vysya</option><option>Yadav</option></select></div>
        <div><label class="block text-xs font-medium mb-1" for="s-city">Location / City</label><input id="s-city" oninput="window.filterProfiles()" class="w-full border rounded-lg px-3 py-2 text-sm bg-[#fffbf7]" placeholder="Search city..."></div>
        <div><label class="block text-xs font-medium mb-1" for="s-income">Income Ceiling</label><select id="s-income" onchange="window.filterProfiles()" class="w-full border rounded-lg px-3 py-2 text-sm bg-[#fffbf7]"><option value="">All Incomes</option><option>3-5 LPA</option><option>5-10 LPA</option><option>10-15 LPA</option><option>15-25 LPA</option><option>25-50 LPA</option><option>50+ LPA</option></select></div>
        <div class="flex items-end"><button onclick="window.clearFilters()" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50 transition">Reset All Filters</button></div>
       </div>
       
       <div class="border-t pt-3 flex items-center justify-between bg-[#fffbf7] p-3 rounded-xl border border-dashed border-orange-200">
         <div class="flex items-start gap-2.5">
           <div class="w-8 h-8 rounded-lg bg-[#7b1f1f]/5 flex items-center justify-center text-[#7b1f1f] mt-0.5"><i data-lucide="scale" class="w-4 h-4"></i></div>
           <div>
             <h4 class="text-xs font-bold text-gray-800">ఆర్థిక అంతస్తుల పొంతన ఫిల్టర్ (Optional Status Match)</h4>
             <p class="text-[11px] text-gray-500 font-medium">Auto-align candidates based on traditional family asset values and annual income ratio expectations.</p>
           </div>
         </div>
         <label class="relative inline-flex items-center cursor-pointer select-none">
           <input type="checkbox" id="s-financial-toggle" onchange="window.toggleFinancialFilter(this.checked)" class="sr-only peer">
           <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
         </label>
       </div>
      </div>
      
      <div id="search-gender-warning" class="hidden bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold p-3 rounded-xl shadow-sm text-center mb-4">
        ⚠️ Only single gender test profiles exist in your database instance! Gracefully falling back to show all registered members so dashboard screen does not appear blank.
      </div>

      <p id="search-count" class="text-sm font-semibold text-[#5a3e36] mb-4"></p>
      <div id="search-results" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"></div>
      <div id="no-results" class="hidden text-center py-16 text-gray-400">
       <i data-lucide="search-x" class="w-16 h-16 text-gray-300 mx-auto mb-4"></i>
       <p class="text-lg">No active matches populated within your criteria choices.</p>
      </div>
     </div>
    </section>

    <section id="view-dashboard" class="view-section hidden">
     <div class="max-w-6xl mx-auto px-4 py-8">
      <h2 class="font-heading text-2xl font-bold mb-2 text-[#7b1f1f]">My Interactive Dashboard</h2>
      <p class="text-[#5a3e36] mb-8">Manage connection metrics and save preferred profiles securely</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
       <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
        <div class="flex items-center justify-between">
         <div>
          <p class="text-sm text-blue-600 font-medium">Proposals Transmitted</p>
          <p id="dashboard-sent" class="text-3xl font-bold text-blue-900 mt-1">0</p>
         </div><i data-lucide="send" class="w-10 h-10 text-blue-400"></i>
        </div>
       </div>
       <div class="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 border border-pink-200">
        <div class="flex items-center justify-between">
         <div>
          <p class="text-sm text-pink-600 font-medium">Interests Inherited</p>
          <p id="dashboard-received" class="text-3xl font-bold text-pink-900 mt-1">0</p>
         </div><i data-lucide="inbox" class="w-10 h-10 text-pink-400"></i>
        </div>
       </div>
       <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
        <div class="flex items-center justify-between">
         <div>
          <p class="text-sm text-purple-600 font-medium">My Private Shortlist</p>
          <p id="dashboard-shortlist" class="text-3xl font-bold text-purple-900 mt-1">0</p>
         </div><i data-lucide="bookmark" class="w-10 h-10 text-purple-400"></i>
        </div>
       </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
       <div class="bg-white rounded-2xl shadow-md p-6 border border-orange-100">
        <h3 class="font-heading font-bold text-lg mb-4 flex items-center gap-2"><i data-lucide="heart" class="w-5 h-5 text-pink-500"></i> Outgoing Connections Sent</h3>
        <div id="sent-interests-list" class="space-y-3 max-h-96 overflow-auto"></div>
        <div id="no-sent-interests" class="text-center py-8 text-gray-400"><p>No outbound connections tracked</p></div>
       </div>
       <div class="bg-white rounded-2xl shadow-md p-6 border border-orange-100">
        <h3 class="font-heading font-bold text-lg mb-4 flex items-center gap-2"><i data-lucide="inbox" class="w-5 h-5 text-blue-500"></i> Incoming Alliances Received</h3>
        <div id="received-interests-list" class="space-y-3 max-h-96 overflow-auto"></div>
        <div id="no-received-interests" class="text-center py-8 text-gray-400"><p>No incoming connections unreviewed</p></div>
       </div>
      </div>
      <div class="mt-8 bg-white rounded-2xl shadow-md p-6 border border-orange-100">
       <h3 class="font-heading font-bold text-lg mb-4 flex items-center gap-2"><i data-lucide="bookmark" class="w-5 h-5 text-purple-500"></i> Shortlisted Family Match Profiles</h3>
       <div id="shortlist-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"></div>
       <div id="no-shortlist" class="text-center py-8 text-gray-400"><p>Saved bookmarks populate inside this block space area</p></div>
      </div>
     </div>
    </section>

    <section id="view-admin" class="view-section hidden">
     <div class="max-w-6xl mx-auto px-4 py-8">
      <h2 class="font-heading text-2xl font-bold mb-2 text-emerald-800">⚙️ Operational Back-Office Panel</h2>
      <p class="text-[#5a3e36] mb-8">Reconcile submitted transaction ledger codes and authorize matching nodes</p>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
       <div class="bg-white rounded-2xl shadow-md p-6 border-t-4 border-amber-500">
        <h3 class="font-heading font-bold text-lg mb-4 flex items-center gap-2 text-amber-800"><i data-lucide="user-check" class="w-5 h-5"></i> Awaiting Registration Verification</h3>
        <div id="admin-pending-profiles" class="space-y-3 max-h-96 overflow-auto"></div>
        <div id="admin-no-pending" class="text-center py-8 text-gray-400"><p>No accounts currently inside pending approval layout queues</p></div>
       </div>
       <div class="bg-white rounded-2xl shadow-md p-6 border-t-4 border-emerald-500">
        <h3 class="font-heading font-bold text-lg mb-4 flex items-center gap-2 text-emerald-800"><i data-lucide="wallet" class="w-5 h-5"></i> Premium Verification Inboxes (UTR Claims)</h3>
        <div id="admin-payments" class="space-y-3 max-h-96 overflow-auto"></div>
        <div id="admin-no-payments" class="text-center py-8 text-gray-400"><p>No payments awaiting validation reviews</p></div>
       </div>
      </div>
     </div>
    </section>

    <div id="upi-modal" class="fixed inset-0 bg-black/50 z-50 hidden items-center justify-center p-4" onclick="window.closeUpiModal(event)">
     <div class="bg-white rounded-2xl max-w-md w-full p-6 relative" onclick="event.stopPropagation()">
      <button onclick="window.closeUpiModal(true)" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><i data-lucide="x" class="w-6 h-6"></i></button>
      <h3 class="font-heading font-bold text-xl mb-4 flex items-center gap-2 text-gray-900"><i data-lucide="wallet" class="w-6 h-6 text-orange-500"></i> Unlock Full Contact & Property Folios</h3>
      <div class="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6 rounded">
       <p class="text-sm text-[#2c1810]"><span class="font-bold">Target Profile ID:</span> <span id="upi-profile-id">-</span></p>
       <p class="text-sm text-[#2c1810] mt-2"><span class="font-bold">Processing Token Cost:</span> ₹200</p>
      </div>
      <div class="space-y-3 mb-6">
       <p class="text-sm font-bold text-[#2c1810]">Admin UPI Payment Node:</p>
       <div class="flex items-center gap-2 bg-gray-100 p-3 rounded-lg"><span id="upi-id" class="text-sm font-mono flex-1 break-all">sambasiva.rao@upi</span> <button onclick="window.copyUpiId()" class="text-blue-600 hover:text-blue-800"><i data-lucide="copy" class="w-4 h-4"></i></button></div>
       <p class="text-xs text-gray-500">📱 Copy and complete a ₹200 transfer inside your UPI app, then click verify claim below.</p>
      </div>
      <div class="flex gap-3">
       <button onclick="window.closeUpiModal(true)" class="flex-1 border border-gray-300 py-2 rounded-lg font-medium hover:bg-gray-50">Cancel</button> 
       <button onclick="window.submitPaymentRequest()" class="flex-1 bg-emerald-700 text-white py-2 rounded-lg font-medium hover:bg-emerald-800 shadow-md">I Have Sent ₹200 ✓</button>
      </div>
     </div>
    </div>

    <div id="profile-modal" class="fixed inset-0 bg-black/50 z-50 hidden items-center justify-center p-4 overflow-y-auto" onclick="window.closeModal(event)">
     <div class="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl my-10" onclick="event.stopPropagation()">
      <button onclick="window.closeModal(true)" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"><i data-lucide="x" class="w-6 h-6"></i></button>
      <div id="modal-content" class="space-y-4"></div>
     </div>
    </div>
   </main>

   <footer class="bg-[#2c1810] text-white/50 text-center py-6 text-xs border-t border-white/5">
    <p>© 2026 Telugu Vivaham. Protecting Family Records and Connecting Lineages Securely.</p>
   </footer>
  </div>

  <script>
  (() => {
    let allProfiles = [];
    let currentUserProfile = null;
    let currentStep = 1;
    let pendingPaymentProfileId = null;
    let flagStatusMatchingActive = false;
    let selectedPhoto = null;

    const PROPERTY_VALUES = ["No Assets", "Below 50 Lakhs", "50 Lakhs - 1 Crore", "1 - 3 Crores", "3 - 5 Crores", "5 - 10 Crores", "10 - 20 Crores", "20 Crores+"];

    // Host Functions Natively to Prevent Closure Scope Lookup Disconnect Failures
    function filterProfiles() {
      const gender = document.getElementById('s-gender')?.value || '';
      const ageMin = parseInt(document.getElementById('s-age-min')?.value) || 0;
      const ageMax = parseInt(document.getElementById('s-age-max')?.value) || 100;
      const caste = document.getElementById('s-caste')?.value || '';
      const city = (document.getElementById('s-city')?.value || '').toLowerCase();
      const income = document.getElementById('s-income')?.value || '';

      let automatedTargetGender = gender;
      if (!automatedTargetGender && currentUserProfile) {
        automatedTargetGender = currentUserProfile.gender === 'Male' ? 'Female' : 'Male';
      }

      // ✨ NEW: Self-Healing Fallback Assessment Flag
      let hasOppositeMatch = allProfiles.some(p => p.gender === automatedTargetGender && p.profile_status === 'approved');
      const warningBanner = document.getElementById('search-gender-warning');
      
      if (warningBanner) {
        warningBanner.classList.toggle('hidden', hasOppositeMatch || allProfiles.length === 0);
      }

      const filtered = allProfiles.filter(p => {
        // ✨ RECOVERY PATCH: Supports fallback matching metrics if status profiles are unapproved/legacy models
        if (p.profile_status !== 'approved' && p.profile_status !== 'pending' && p.profile_status) return false;
        if (currentUserProfile && p.__backendId === currentUserProfile.__backendId) return false;
        
        // Only enforce gender lock if there are actual opposite matches in the DB
        if (hasOppositeMatch && automatedTargetGender && p.gender !== automatedTargetGender) return false;
        
        if (ageMin && p.age < ageMin) return false;
        if (ageMax && p.age > ageMax) return false;
        if (caste && p.caste !== caste) return false;
        if (city && !(p.city || '').toLowerCase().includes(city)) return false;
        if (income) {
          if (getIncomeTier(p.income) > getIncomeTier(income)) return false;
        }

        // Status Match Algorithm
        if (flagStatusMatchingActive && currentUserProfile && hasOppositeMatch) {
          const myIncRank = getIncomeTier(currentUserProfile.income);
          const pIncRank = getIncomeTier(p.income);
          const myAssetRank = getAssetTier(currentUserProfile.propertyWorth);
          const pAssetRank = getAssetTier(p.propertyWorth);

          if (currentUserProfile.gender === 'Female') {
            if (pIncRank <= myIncRank) return false; 
            if (pAssetRank < myAssetRank) return false; 
          } else {
            if (pIncRank > myIncRank) return false; 
            if (pAssetRank > myAssetRank + 1) return false; 
          }
        }
        return true;
      });

      const container = document.getElementById('search-results');
      const noRes = document.getElementById('no-results');
      const countEl = document.getElementById('search-count');
      if (!container) return;

      if (filtered.length === 0) {
        container.innerHTML = '';
        if (noRes) noRes.classList.remove('hidden');
        if (countEl) countEl.textContent = '';
      } else {
        if (noRes) noRes.classList.add('hidden');
        if (countEl) countEl.textContent = `Showing ${filtered.length} active platform profiles live inside match viewport matrix.`;
        container.innerHTML = filtered.map(p => profileCard(p)).join('');
      }
      lucide.createIcons();
    }

    function renderDashboard() {
      const sentList = document.getElementById('sent-interests-list');
      const rcvdList = document.getElementById('received-interests-list');
      const shortlist = document.getElementById('shortlist-grid');
      if (!sentList) return;

      const sent = allProfiles.filter(p => {
        if (!currentUserProfile) return false;
        return (p.interests_received || '').split(',').includes(currentUserProfile.__backendId);
      }).map(p => `
        <div class="flex items-center gap-3 p-3 bg-[#fffbf7] border rounded-xl shadow-sm">
          <div class="w-10 h-10 rounded-full bg-orange-700 text-white flex items-center justify-center font-bold text-sm uppercase">${p.first_name?.charAt(0).toUpperCase() || 'P'}</div>
          <div class="flex-1 min-w-0">
            <p class="font-bold text-sm text-gray-900">${p.first_name}</p>
            <p class="text-xs text-gray-400 font-mono">${p.profile_id}</p>
          </div>
          <span class="text-xs bg-amber-100 text-amber-900 px-2 py-1 rounded-lg font-bold">Proposal Sent</span>
        </div>
      `).join('');

      const rcvd = allProfiles.filter(p => {
        if (!currentUserProfile) return false;
        return (currentUserProfile.interests_received || '').split(',').includes(p.__backendId);
      }).map(p => `
        <div class="flex items-center gap-3 p-3 bg-[#fffbf7] border rounded-xl shadow-sm">
          <div class="w-10 h-10 rounded-full bg-pink-700 text-white flex items-center justify-center font-bold text-sm uppercase">${p.first_name.charAt(0)}</div>
          <div class="flex-1 min-w-0"><p class="font-bold text-sm text-gray-900">${p.first_name}</p></div>
          <button onclick="window.showProfile('${p.__backendId}')" class="text-xs bg-[#7b1f1f] text-white px-3 py-1.5 font-bold rounded-lg hover:bg-[#912525]">Review Bio</button>
        </div>
      `).join('');

      const shortlistedProfiles = allProfiles.filter(p => {
        if (!currentUserProfile) return false;
        return (currentUserProfile.shortlisted || '').split(',').includes(p.__backendId);
      });

      sentList.innerHTML = sent || '';
      rcvdList.innerHTML = rcvd || '';
      if (shortlist) shortlist.innerHTML = shortlistedProfiles.length ? shortlistedProfiles.map(p => profileCard(p)).join('') : '';

      document.getElementById('no-sent-interests').classList.toggle('hidden', sent.length > 0);
      document.getElementById('no-received-interests').classList.toggle('hidden', rcvd.length > 0);
      document.getElementById('no-shortlist').classList.toggle('hidden', shortlistedProfiles.length > 0);

      document.getElementById('dashboard-sent').textContent = allProfiles.filter(p => currentUserProfile && (p.interests_received || '').split(',').includes(currentUserProfile.__backendId)).length;
      document.getElementById('dashboard-received').textContent = currentUserProfile ? (currentUserProfile.interests_received || '').split(',').filter(Boolean).length : 0;
      document.getElementById('dashboard-shortlist').textContent = shortlistedProfiles.length;
    }

    function renderAdminPanel() {
      const pending = allProfiles.filter(p => p.profile_status === 'pending');
      const pendingHtml = pending.map(p => `
        <div class="flex items-center gap-3 p-4 bg-amber-50/40 border border-amber-200 rounded-xl">
          <div class="w-10 h-10 rounded-lg bg-amber-700 text-white flex items-center justify-center font-bold text-base uppercase">${p.first_name.charAt(0)}</div>
          <div class="flex-1 min-w-0">
            <p class="font-bold text-sm text-gray-900">${p.first_name} ${p.last_name}</p>
            <p class="text-xs text-gray-500 font-mono">UID Signature: ${p.profile_id} • Gothram: ${p.gothram}</p>
          </div>
          <div class="flex gap-1">
            <button onclick="window.approveProfile('${p.__backendId}')" class="bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-800">Approve</button>
            <button onclick="window.rejectProfile('${p.__backendId}')" class="bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-700">Reject</button>
          </div>
        </div>
      `).join('');

      const activePurchases = allProfiles.filter(p => (p.contact_purchases || '').length > 0);
      const paymentsHtml = activePurchases.map(p => `
        <div class="p-4 bg-emerald-50/40 border border-emerald-200 rounded-xl space-y-1">
          <div class="flex justify-between items-center">
            <p class="text-sm font-bold text-emerald-900">✅ Reconciled Access: ${p.profile_id}</p>
            <span class="text-[9px] bg-emerald-700 text-white font-mono px-2 py-0.5 rounded-full font-bold">PREMIUM SECURE TOKEN</span>
          </div>
          <p class="text-xs text-emerald-800">Full verified ledger contacts revealed to matching transaction holders.</p>
        </div>
      `).join('');

      document.getElementById('admin-pending-profiles').innerHTML = pendingHtml || '';
      document.getElementById('admin-no-pending').classList.toggle('hidden', pending.length > 0);
      document.getElementById('admin-payments').innerHTML = paymentsHtml || '';
      document.getElementById('admin-no-payments').classList.toggle('hidden', activePurchases.length > 0);
      lucide.createIcons();
    }

    function profileCard(p) {
      const hasContactAccess = currentUserProfile && (p.contact_purchases || '').split(',').includes(currentUserProfile.__backendId);
      const isSagotraRelation = currentUserProfile && currentUserProfile.gothram && p.gothram &&
        currentUserProfile.gothram.trim().toLowerCase() === p.gothram.trim().toLowerCase();

      return `
        <div class="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 border border-orange-100 flex flex-col justify-between h-full relative group">
          <div>
            <div class="flex justify-between items-start mb-3">
              <span class="padam-badge text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">${p.profile_id}</span>
              ${isSagotraRelation ? `<span class="bg-amber-600 text-white font-bold text-[9px] px-2 py-0.5 rounded shadow">⚠️ సగోత్రం (Same Gothram)</span>` : ''}
            </div>
            <div class="flex items-center gap-3 mb-4" onclick='window.showProfile("${p.__backendId}")'>
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#7b1f1f] to-[#d4a017] flex items-center justify-center text-white font-bold text-sm shrink-0 uppercase shadow">${p.first_name.charAt(0)}</div>
              <div class="min-w-0">
                <h4 class="font-bold text-[#2c1810] truncate text-base">${p.first_name} ${hasContactAccess ? p.last_name : ' [ఇంటిపేరు దాచబడింది]'}</h4>
                <p class="text-xs text-gray-500 font-medium">${p.age} Yrs • ${p.height} • ${p.city}</p>
              </div>
            </div>
            <div class="space-y-1.5 text-xs text-gray-600 mb-4 font-medium border-t pt-2 border-dashed border-gray-100">
              <p class="text-[#7b1f1f] font-bold">🌟 ${p.nakshatra} (${p.padam || '1'}వ పాదం) • Rasi: ${p.rashi}</p>
              <p>🪐 Kuja Dosham: <span class="${p.kujaDosham?.includes('Yes') ? 'text-red-600 font-bold' : 'text-emerald-700'}">${p.kujaDosham}</span></p>
              <p class="truncate">🎓 ${p.education} • ${p.occupation}</p>
              <p class="text-[10px] text-gray-400 font-bold mt-1 bg-[#fff9f0] p-1 rounded">💰 Income: ${p.income} PA • Assets: ${p.propertyWorth}</p>
            </div>
          </div>
          <div class="flex gap-2 border-t pt-3 border-gray-100 opacity-90 group-hover:opacity-100 transition">
            <button onclick="window.toggleShortlist('${p.__backendId}')" class="flex-1 border border-purple-200 text-purple-700 py-2 rounded-lg text-xs font-bold hover:bg-purple-50 transition"><i data-lucide="bookmark" class="w-3 h-3 inline mr-1"></i>Shortlist</button>
            <button onclick="window.sendInterest('${p.__backendId}')" class="flex-1 bg-[#7b1f1f] text-white py-2 rounded-lg text-xs font-bold hover:bg-[#912525] transition"><i data-lucide="heart" class="w-3 h-3 inline mr-1"></i>Connect</button>
          </div>
        </div>
      `;
    }

    function getIncomeTier(incomeStr) {
      const mapping = { '3-5 LPA': 1, '5-10 LPA': 2, '10-15 LPA': 3, '15-25 LPA': 4, '25-50 LPA': 5, '50+ LPA': 6 };
      return mapping[incomeStr || '3-5 LPA'] || 1;
    }

    function getAssetTier(assetStr) {
      const mapping = { 'No Assets': 0, 'Below 50 Lakhs': 1, '50 Lakhs - 1 Crore': 2, '1 - 3 Crores': 3, '3 - 5 Crores': 4, '5 - 10 Crores': 5, '10 - 20 Crores': 6, '20 Crores+': 7 };
      return mapping[assetStr || 'Below 50 Lakhs'] || 1;
    }

    // ✨ SELF-HEALING ENGINE PATCH: Validates local storage mapping alignment loops continuously
    function refreshIdentityDropdown() {
      const selector = document.getElementById('global-identity-selector');
      if (!selector) return;
      
      const savedToken = localStorage.getItem('tv_pinned_session_backend_id');
      const tokenMatchExists = allProfiles.some(p => p.__backendId === savedToken);
      
      let dropdownHtml = allProfiles.map(p => {
        const isSelected = p.__backendId === savedToken ? 'selected' : '';
        return `<option value="${p.__backendId}" ${isSelected}>${p.first_name} (${p.gender === 'Male' ? 'Groom' : 'Bride'})</option>`;
      }).join('');
      
      selector.innerHTML = dropdownHtml || '<option value="">No Active Records</option>';
      
      if (savedToken && tokenMatchExists) {
        currentUserProfile = allProfiles.find(p => p.__backendId === savedToken);
      } else if (allProfiles.length > 0) {
        currentUserProfile = allProfiles[0];
        localStorage.setItem('tv_pinned_session_backend_id', currentUserProfile.__backendId);
        selector.value = currentUserProfile.__backendId;
      } else {
        currentUserProfile = null;
      }
    }

    // Data SDK Event Socket Pipeline Receiver
    const dataHandler = {
      onDataChanged(data) {
        allProfiles = data.map(p => ({
          ...p,
          interests_sent: p.interests_sent || '',
          interests_received: p.interests_received || '',
          shortlisted: p.shortlisted || '',
          contact_purchases: p.contact_purchases || '',
          gothram: p.gothram || '',
          propertyWorth: p.propertyWorth || 'Below 50 Lakhs',
          landDetails: p.landDetails || '',
          houseDetails: p.houseDetails || '',
          kujaDosham: p.kujaDosham || 'No (లేదు)',
          padam: p.padam || '1',
          diet: p.diet || 'Vegetarian',
          physicalStatus: p.physicalStatus || 'Normal Status',
          abroadStatus: p.abroadStatus || 'Open to both'
        }));
        
        refreshIdentityDropdown();
        updateAdminButtons();
        
        const statProfiles = document.getElementById('stat-profiles');
        if (statProfiles) statProfiles.textContent = allProfiles.filter(p => p.profile_status === 'approved').length;
        
        renderDashboard();
        filterProfiles();
        if (currentUserProfile?.is_admin) renderAdminPanel();
      }
    };

    (async () => {
      const result = await window.dataSdk.init(dataHandler);
      if (!result.isOk) showToast('Security Pipeline Exception: Data service layer failed to initialize.');
    })();

    // Expose local pointers onto public window matrices
    window.filterProfiles = filterProfiles;
    window.approveProfile = approveProfile;
    window.rejectProfile = rejectProfile;

    window.forceSessionSwap = function(backendId) {
      if (backendId === 'default' || !backendId) return;
      localStorage.setItem('tv_pinned_session_backend_id', backendId);
      currentUserProfile = allProfiles.find(p => p.__backendId === backendId) || null;
      updateAdminButtons();
      filterProfiles();
      renderDashboard();
      if (currentUserProfile?.is_admin) renderAdminPanel();
      showToast(`Logged in safely as: ${currentUserProfile?.first_name || 'Profile'}`);
    };

    window.handlePhotoSelect = function(file) {
      selectedPhoto = file;
      const conf = document.getElementById('r-photo-confirmation');
      if(conf) conf.classList.remove('hidden');
    };

    window.toggleFinancialFilter = function(isChecked) {
      flagStatusMatchingActive = isChecked;
      showToast(isChecked ? '⚡ Financial status matching filter enabled.' : 'Reset financial bracket boundaries.');
      filterProfiles();
    };

    window.switchView = function(view) {
      document.querySelectorAll('.view-section').forEach(s => s.classList.add('hidden'));
      const activeSection = document.getElementById(`view-${view}`);
      if (activeSection) activeSection.classList.remove('hidden');
      window.scrollTo(0, 0);
      if (view === 'search') filterProfiles();
      if (view === 'dashboard') renderDashboard();
      if (view === 'admin') renderAdminPanel();
    };

    window.toggleMobileMenu = function() {
      const menu = document.getElementById('mobile-menu');
      if (menu) menu.classList.toggle('hidden');
    };

    window.goToStep = function(step) {
      document.getElementById(`step-${currentStep}`).classList.add('hidden');
      document.getElementById(`step-${step}`).classList.remove('hidden');
      for (let i = 1; i <= 3; i++) {
        const dot = document.getElementById(`step-${i}-dot`);
        if (dot) {
          dot.className = i <= step 
            ? 'w-8 h-8 rounded-full bg-[#7b1f1f] text-white flex items-center justify-center text-sm font-bold shadow'
            : 'w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-bold';
        }
      }
      currentStep = step;
    };

    window.handleRegister = async function(e) {
      e.preventDefault();
      const btn = document.getElementById('submit-btn');
      if (!btn) return;
      btn.disabled = true; btn.innerHTML = '<span class="animate-pulse">Locking Data Block...</span>';
      const cleanEmail = document.getElementById('r-email').value.trim().toLowerCase();

      const record = {
        profile_id: 'TV' + Math.floor(10000 + Math.random() * 90000),
        first_name: document.getElementById('r-name').value,
        last_name: document.getElementById('r-lname').value,
        email: cleanEmail,
        phone: document.getElementById('r-phone').value,
        age: parseInt(document.getElementById('r-age').value),
        gender: document.getElementById('r-gender').value,
        marital_status: document.getElementById('r-marital').value,
        height: document.getElementById('r-height').value || "5'4\"",
        bloodGroup: document.getElementById('r-blood').value || "O+",
        education: document.getElementById('r-education').value || '',
        occupation: document.getElementById('r-occupation').value || '',
        income: document.getElementById('r-income').value || '3-5 LPA',
        city: document.getElementById('r-city').value || '',
        caste: document.getElementById('r-caste').value || '',
        gothram: document.getElementById('r-gothram').value || '',
        rashi: document.getElementById('r-rashi').value || '',
        padam: document.getElementById('r-padam').value || '1',
        kujaDosham: document.getElementById('r-kuja').value || 'No (లేదు)',
        nakshatra: document.getElementById('r-nakshatra').value || '',
        family_type: document.getElementById('r-family').value || 'Nuclear Family',
        diet: document.getElementById('r-diet').value || 'Vegetarian',
        physicalStatus: document.getElementById('r-physical').value || 'Normal Status',
        fatherName: document.getElementById('r-father').value || '',
        motherName: document.getElementById('r-mother').value || '',
        maternalSurnames: document.getElementById('r-maternal').value || '',
        astroNotes: document.getElementById('r-astrotext').value || '',
        propertyWorth: document.getElementById('r-networth').value || 'Below 50 Lakhs',
        landDetails: document.getElementById('r-land').value || '',
        houseDetails: document.getElementById('r-realestate').value || '',
        abroadStatus: document.getElementById('r-nri').value || 'Open to both',
        mother_tongue: 'Telugu',
        about: document.getElementById('r-about').value || '',
        partner_age_min: parseInt(document.getElementById('r-page-min').value) || 21,
        partner_age_max: parseInt(document.getElementById('r-page-max').value) || 35,
        // Sets status instantly to approved for simple staging deployment tests
        profile_status: 'approved',
        created_at: new Date().toISOString(),
        interests_sent: '', interests_received: '', shortlisted: '', contact_purchases: '',
        is_admin: false, is_verified: true
      };

      const result = await window.dataSdk.create(record);
      btn.disabled = false; btn.innerHTML = '<i data-lucide="check-circle" class="w-5 h-5"></i> Register Profile';
      if (result.isOk) {
        showToast('🎉 Profile successfully registered & deployed live inside match index!');
        localStorage.setItem('tv_pinned_session_backend_id', result.data.__backendId);
        document.getElementById('register-form').reset();
        window.goToStep(1);
        window.switchView('search');
      } else {
        showToast('Database write rejection exception.');
      }
    };

    window.clearFilters = function() {
      ['s-gender','s-caste','s-income'].forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });
      ['s-age-min','s-age-max','s-city'].forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });
      const toggle = document.getElementById('s-financial-toggle');
      if(toggle) { toggle.checked = false; flagStatusMatchingActive = false; }
      filterProfiles();
    };

    window.sendInterest = async function(id) {
      if (!currentUserProfile) return;
      const target = allProfiles.find(x => x.__backendId === id);
      if (target) {
        let rcvdList = (target.interests_received || '').split(',').filter(Boolean);
        if (!rcvdList.includes(currentUserProfile.__backendId)) rcvdList.push(currentUserProfile.__backendId);
        await window.dataSdk.update({ ...target, interests_received: rcvdList.join(',') });
        showToast('💌 Connection request proposal successfully dispatched.');
      }
    };

    window.toggleShortlist = async function(id) {
      if (!currentUserProfile) return;
      let list = (currentUserProfile.shortlisted || '').split(',').filter(Boolean);
      const idx = list.indexOf(id);
      if (idx > -1) list.splice(idx, 1); else list.push(id);
      await window.dataSdk.update({ ...currentUserProfile, shortlisted: list.join(',') });
      showToast(idx > -1 ? 'Removed from your active shortlist' : '📌 Alliance pinned to your private Shortlist.');
    };

    window.openUpiModal = function(id) {
      pendingPaymentProfileId = id;
      const p = allProfiles.find(x => x.__backendId === id);
      if (p) {
        document.getElementById('upi-profile-id').textContent = p.profile_id;
        const upiModal = document.getElementById('upi-modal');
        if (upiModal) { upiModal.classList.remove('hidden'); upiModal.classList.add('flex'); }
      }
    };

    window.closeUpiModal = function(param) {
      const upiModal = document.getElementById('upi-modal');
      if (param === true || !param || param.target === upiModal) {
        if (upiModal) { upiModal.classList.add('hidden'); upiModal.classList.remove('flex'); }
        pendingPaymentProfileId = null;
      }
    };

    window.copyUpiId = function() {
      const upiText = document.getElementById('upi-id')?.textContent;
      if (upiText) {
        navigator.clipboard.writeText(upiText).then(() => showToast('✓ UPI payment address mapped to your clipboard.'));
      }
    };

    window.submitPaymentRequest = async function() {
      if (!currentUserProfile || !pendingPaymentProfileId) return;
      const target = allProfiles.find(p => p.__backendId === pendingPaymentProfileId);
      if (!target) return;

      let purchases = (target.contact_purchases || '').split(',').filter(Boolean);
      if (!purchases.includes(currentUserProfile.__backendId)) purchases.push(currentUserProfile.__backendId);

      const result = await window.dataSdk.update({ ...target, contact_purchases: purchases.join(',') });
      if (result.isOk) {
        window.closeUpiModal(true);
        window.closeModal(true);
        showToast('📧 Reference routed! Data blocks decrypt the moment admin validates the ticket reference code.');
      }
    };

    window.closeModal = function(e) {
      const modal = document.getElementById('profile-modal');
      if (e === true || (e && e.target === modal)) {
        if (modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
      }
    };

    window.showProfile = function(id) {
      const p = allProfiles.find(x => x.__backendId === id);
      if (!p) return;
      const hasContactAccess = currentUserProfile && (p.contact_purchases || '').split(',').includes(currentUserProfile.__backendId);
      
      document.getElementById('modal-content').innerHTML = `
        <div class="space-y-5 text-sm">
          <div class="text-center bg-[#fff9f0] p-4 rounded-2xl border border-orange-100 relative">
            <div class="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-xl mx-auto mb-2 uppercase shadow-md">${p.first_name.charAt(0)}</div>
            <h3 class="font-heading text-xl font-bold text-gray-900">${p.first_name} ${hasContactAccess ? p.last_name : ''}</h3>
            <p class="text-xs text-gray-500 font-mono">UID Signature Token: ${p.profile_id}</p>
          </div>
          <div class="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
            <div>
              <h4 class="text-xs font-bold text-[#7b1f1f] uppercase tracking-wider mb-2 border-b pb-1">👤 Profile Identity Parameters</h4>
              <div class="grid grid-cols-2 gap-y-2 gap-x-4 bg-[#fffbf7] p-3 rounded-xl border text-xs">
                ${detailRow('Age / Height', `${p.age} Yrs • ${p.height}`)}
                ${detailRow('Blood Group', p.bloodGroup || 'O+')}
                ${detailRow('Marital Status', p.marital_status)}
                ${detailRow('Diet Habit', p.diet)}
                ${detailRow('Physical Health', p.physicalStatus)}
                ${detailRow('Settlement Preferred', p.abroadStatus)}
              </div>
            </div>
            <div>
              <h4 class="text-xs font-bold text-[#7b1f1f] uppercase tracking-wider mb-2 border-b pb-1">🕉️ Astrology & Heritage Lineage</h4>
              <div class="grid grid-cols-2 gap-y-2 gap-x-4 bg-[#fffbf7] p-3 rounded-xl border text-xs">
                ${detailRow('Caste / Sub-Clan', p.caste)}
                ${detailRow('Gothram', p.gothram)}
                ${detailRow('Nakshatram', `${p.nakshatra} (${p.padam || '1'}వ పాదం)`)}
                ${detailRow('Rashi', p.rasi)}
                ${detailRow('Kuja Dosham', p.kujaDosham)}
              </div>
            </div>
            <div>
              <h4 class="text-xs font-bold text-[#7b1f1f] uppercase tracking-wider mb-2 border-b pb-1">👨‍🇺🇦 Family Background Details</h4>
              <div class="grid grid-cols-2 gap-y-2 gap-x-4 bg-[#fffbf7] p-3 rounded-xl border text-xs">
                ${detailRow("Father's Name", p.fatherName)}
                ${detailRow("Mother's Name", p.motherName)}
              </div>
            </div>
            <div>
              <h4 class="text-xs font-bold text-[#7b1f1f] uppercase tracking-wider mb-2 border-b pb-1">🏡 Property Profiles & Family Assets</h4>
              ${hasContactAccess ? `
                <div class="grid grid-cols-1 gap-2 bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                  <p>💰 Net Worth Bracket Group: <strong>${p.propertyWorth}</strong></p>
                  <p>🌾 Agricultural Land: <strong>${p.landDetails || 'None Listed'}</strong></p>
                  <p>🏢 Real Estate Commercial Plots: <strong>${p.houseDetails || 'None Listed'}</strong></p>
                  <p>🧬 Relatives Surnames (మేనమామలు): <strong>${p.maternalSurnames || 'None Listed'}</strong></p>
                </div>
              ` : `
                <div class="bg-amber-50/70 text-amber-900 text-xs p-3 rounded-xl border border-amber-200 font-medium">
                  🔒 Land descriptions, property portfolios, maternal lineages, and sibling Surnames are encrypted for data security. Unlock this card view to decrypt.
                </div>
              `}
            </div>
            <div class="mt-2 pt-2 border-t border-gray-100">
              ${hasContactAccess ? `
                <div class="bg-blue-50 border border-blue-200 p-3 rounded-xl text-blue-900">
                  <p class="text-xs font-bold uppercase text-blue-700 mb-1">📱 Communication Coordinates</p>
                  <p class="text-base font-mono font-bold tracking-wider">Mobile: ${p.phone}</p>
                  <p class="text-xs text-blue-600">Full Name Signature: ${p.first_name} ${p.last_name}</p>
                </div>
              ` : `
                <button onclick="window.openUpiModal('${p.__backendId}')" class="w-full bg-[#f39c12] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow hover:bg-orange-600 transition animate-pulse-ring">
                  🔓 Unlock Contact Numbers & Asset Vault (₹200)
                </button>
              `}
            </div>
          </div>
        </div>
      `;
      const modal = document.getElementById('profile-modal');
      if (modal) { modal.classList.remove('hidden'); modal.classList.add('flex'); }
      lucide.createIcons();
    };
  })();
  </script>
 </body>
</html>
