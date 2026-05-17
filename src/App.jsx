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
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
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
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
     <div class="flex items-center gap-2">
      <div class="w-9 h-9 gradient-primary rounded-lg flex items-center justify-center">
       <span class="text-white font-heading font-bold text-lg">మ</span>
      </div><span id="nav-title" class="font-heading font-bold text-xl text-[#7b1f1f]">Telugu Vivaham</span>
     </div>
     <div class="hidden md:flex items-center gap-6 text-sm font-medium text-[#5a3e36]">
      <button onclick="switchView('home')" class="hover:text-[#7b1f1f] transition">Home</button> 
      <button onclick="switchView('search')" class="hover:text-[#7b1f1f] transition">Search Feed</button> 
      <button onclick="switchView('dashboard')" class="hover:text-[#7b1f1f] transition relative"><i data-lucide="inbox" class="w-4 h-4 inline mr-1"></i>My Dashboard<span id="nav-badge" class="hidden absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">0</span></button> 
      <button id="admin-nav-btn" onclick="switchView('admin')" class="hidden text-emerald-700 hover:text-emerald-900 font-bold transition"><i data-lucide="lock" class="w-4 h-4 inline mr-1"></i>Admin Control Desk</button> 
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
       <p class="text-sm text-[#5a3e36]">Mandatory family field profiles ensure authentic connections while mitigating invalid matching accounts.</p>
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
     <div class="bg-[#2c1810] text-white py-12 px-4">
      <div class="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
       <div>
        <p class="text-2xl md:text-3xl font-bold font-heading" id="stat-profiles">0</p>
        <p class="text-sm opacity-70">Total Members</p>
       </div>
       <div>
        <p class="text-2xl md:text-3xl font-bold font-heading">100%</p>
        <p class="text-sm opacity-70">Aadhaar Screened</p>
       </div>
       <div>
        <p class="text-2xl md:text-3xl font-bold font-heading">29 Districts</p>
        <p class="text-sm opacity-70">Andhra & Telangana</p>
       </div>
       <div>
        <p class="text-2xl md:text-3xl font-bold font-heading">Live</p>
        <p class="text-sm opacity-70">Manual Reconcile</p>
       </div>
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
         <div><label class="block text-xs font-bold text-gray-600 mb-1" for="r-page-min">Partner Age Min</label><input id="r-page-min" type="number
