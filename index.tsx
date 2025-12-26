
/**
 * Halal Digital Services - Professional Portfolio & Agency
 * Web Design & Development SEO Optimized - Version 2.2 (Complete Admin System)
 */

// --- Constants ---
const INITIAL_PROJECTS = [
    { 
        id: '1', 
        name: 'متجر "أناقة" للملابس المغربية', 
        description: 'تطوير متجر إلكتروني متكامل مع نظام دفع محلي وتصميم عصري متجاوب يزيد المبيعات بنسبة 40%.', 
        price: 5500, 
        category: 'تطوير متاجر', 
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800' 
    },
    { 
        id: '2', 
        name: 'موقع وكالة أسفار وطنية', 
        description: 'تصميم موقع سياحي احترافي يضم محرك بحث للرحلات ونظام حجز مباشر.', 
        price: 4500, 
        category: 'مواقع تعريفية', 
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800' 
    }
];

const INITIAL_SETTINGS = {
    dashPassword: '1234',
    whatsappNumber: '0649075664',
    email: 'abdelghaforbahaddou@gmail.com'
};

// --- App State ---
let state = {
    projects: JSON.parse(localStorage.getItem('projects') || 'null') || INITIAL_PROJECTS,
    requests: JSON.parse(localStorage.getItem('requests') || '[]'),
    settings: JSON.parse(localStorage.getItem('settings') || 'null') || INITIAL_SETTINGS,
    isAuthenticated: sessionStorage.getItem('isAdmin') === 'true'
};

const saveState = () => {
    localStorage.setItem('projects', JSON.stringify(state.projects));
    localStorage.setItem('requests', JSON.stringify(state.requests));
    localStorage.setItem('settings', JSON.stringify(state.settings));
};

// --- Renderers ---

const renderLoginForm = () => `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6 animate-fadeIn">
        <div class="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-4xl border border-gray-100 text-center space-y-8">
            <div class="w-20 h-20 bg-blue-600 text-white flex items-center justify-center rounded-3xl mx-auto text-3xl shadow-xl shadow-blue-200">🔐</div>
            <div class="space-y-2">
                <h1 class="text-3xl font-black text-gray-900">دخول الإدارة</h1>
                <p class="text-gray-400 font-bold">يرجى إدخال كلمة السر للوصول للوحة التحكم</p>
            </div>
            <div class="space-y-4">
                <input type="password" id="dash-pass" class="w-full p-6 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-100 font-black text-center text-2xl tracking-widest" placeholder="••••">
                <button onclick="login()" class="w-full py-6 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition shadow-xl shadow-blue-100">دخول الآن</button>
            </div>
            <a href="#/" class="block text-gray-400 font-bold text-sm hover:text-blue-600 transition">العودة للموقع الرئيسي</a>
        </div>
    </div>
`;

const renderDashboard = () => `
    <div class="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        <!-- Sidebar -->
        <aside class="w-full md:w-80 bg-gray-900 text-white p-10 space-y-12">
            <div class="text-2xl font-black">حلال <span class="text-blue-500">لوحة التحكم</span></div>
            <nav class="flex flex-col gap-4 font-bold">
                <button onclick="switchTab('requests')" class="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition text-right w-full"><span>📊</span> طلبات الزبناء</button>
                <button onclick="switchTab('projects')" class="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition text-right w-full"><span>📁</span> إدارة المشاريع</button>
                <button onclick="switchTab('settings')" class="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition text-right w-full"><span>⚙️</span> الإعدادات العامة</button>
                <hr class="border-white/5 my-4">
                <button onclick="logout()" class="flex items-center gap-4 p-4 rounded-2xl hover:bg-red-500/10 text-red-400 transition text-right w-full"><span>🚪</span> تسجيل الخروج</button>
            </nav>
        </aside>

        <!-- Content -->
        <main class="flex-1 p-8 md:p-16 overflow-y-auto">
            <div id="dash-content" class="max-w-6xl mx-auto space-y-12">
                <!-- Content will be injected here via switchTab -->
            </div>
        </main>
    </div>
`;

// --- Dashboard Tabs ---

(window as any).switchTab = (tab: string) => {
    const content = document.getElementById('dash-content');
    if (!content) return;

    if (tab === 'requests') {
        content.innerHTML = `
            <div class="flex justify-between items-center">
                <h2 class="text-4xl font-black">طلبات الاستشارة (${state.requests.length})</h2>
            </div>
            <div class="grid grid-cols-1 gap-6">
                ${state.requests.length === 0 ? '<div class="p-20 text-center bg-white rounded-3xl text-gray-400 font-bold">لا توجد طلبات حالياً</div>' : 
                state.requests.map((r: any) => `
                    <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition">
                        <div class="space-y-2">
                            <div class="flex items-center gap-3">
                                <span class="font-black text-xl text-gray-900">${r.name}</span>
                                <span class="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-black rounded-lg">${r.type}</span>
                            </div>
                            <div class="text-blue-600 font-bold" dir="ltr">${r.phone}</div>
                            <p class="text-gray-500 font-medium">${r.desc}</p>
                            <div class="text-[10px] text-gray-300 font-black uppercase">${new Date(r.createdAt).toLocaleString('ar-MA')}</div>
                        </div>
                        <div class="flex items-center gap-4">
                            <a href="https://wa.me/212${r.phone.substring(1)}" target="_blank" class="p-4 bg-green-50 text-green-600 rounded-2xl hover:bg-green-100 transition">واتساب</a>
                            <button onclick="deleteRequest('${r.id}')" class="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition">حذف</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (tab === 'projects') {
        content.innerHTML = `
            <div class="flex justify-between items-center">
                <h2 class="text-4xl font-black">إدارة المشاريع</h2>
                <button onclick="showAddProjectForm()" class="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-blue-100">إضافة مشروع +</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="projects-grid">
                ${state.projects.map((p: any) => `
                    <div class="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm">
                        <img src="${p.image}" class="w-full h-48 object-cover">
                        <div class="p-6 space-y-4">
                            <h3 class="text-xl font-black">${p.name}</h3>
                            <button onclick="deleteProject('${p.id}')" class="w-full py-3 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-100 transition">حذف المشروع</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (tab === 'settings') {
        content.innerHTML = `
            <h2 class="text-4xl font-black text-gray-900">إعدادات الوكالة</h2>
            <div class="bg-white p-12 rounded-[3.5rem] shadow-sm border border-gray-100 space-y-10 max-w-2xl">
                <div class="space-y-6">
                    <div class="space-y-2">
                        <label class="font-black text-sm text-gray-400 mr-4">رقم الواتساب (للتواصل)</label>
                        <input id="set-wa" class="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none font-black text-lg" value="${state.settings.whatsappNumber}">
                    </div>
                    <div class="space-y-2">
                        <label class="font-black text-sm text-gray-400 mr-4">البريد الإلكتروني</label>
                        <input id="set-email" class="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none font-black text-lg" value="${state.settings.email}">
                    </div>
                    <div class="space-y-2">
                        <label class="font-black text-sm text-gray-400 mr-4">كلمة سر لوحة التحكم</label>
                        <input id="set-pass" type="text" class="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none font-black text-lg" value="${state.settings.dashPassword}">
                    </div>
                </div>
                <button onclick="updateSettings()" class="w-full py-6 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition">حفظ التغييرات</button>
            </div>
        `;
    }
};

// --- Admin Actions ---

(window as any).login = () => {
    const pass = (document.getElementById('dash-pass') as HTMLInputElement).value;
    if (pass === state.settings.dashPassword) {
        state.isAuthenticated = true;
        sessionStorage.setItem('isAdmin', 'true');
        router();
    } else {
        alert('❌ كلمة السر خاطئة! حاول مرة أخرى.');
    }
};

(window as any).logout = () => {
    state.isAuthenticated = false;
    sessionStorage.removeItem('isAdmin');
    window.location.hash = '#/';
};

(window as any).deleteRequest = (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    state.requests = state.requests.filter((r: any) => r.id !== id);
    saveState();
    (window as any).switchTab('requests');
};

(window as any).deleteProject = (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المشروع من المعرض؟')) return;
    state.projects = state.projects.filter((p: any) => p.id !== id);
    saveState();
    (window as any).switchTab('projects');
};

(window as any).updateSettings = () => {
    state.settings.whatsappNumber = (document.getElementById('set-wa') as HTMLInputElement).value;
    state.settings.email = (document.getElementById('set-email') as HTMLInputElement).value;
    state.settings.dashPassword = (document.getElementById('set-pass') as HTMLInputElement).value;
    saveState();
    alert('✅ تم تحديث الإعدادات بنجاح!');
    (window as any).switchTab('settings');
};

(window as any).showAddProjectForm = () => {
    const name = prompt('اسم المشروع:');
    if (!name) return;
    const img = prompt('رابط الصورة (URL):', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800');
    if (!img) return;
    
    const newProject = {
        id: Date.now().toString(),
        name,
        description: 'مشروع جديد مضاف من لوحة التحكم.',
        price: 0,
        category: 'مشروع جديد',
        image: img
    };
    state.projects.unshift(newProject);
    saveState();
    (window as any).switchTab('projects');
};

// --- Core App Logic ---

const renderHome = () => `
    <div class="space-y-32">
        <!-- Hero Section -->
        <section class="relative min-h-[700px] flex items-center bg-gray-950 text-white overflow-hidden">
            <div class="absolute inset-0 opacity-10">
                <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1600" alt="وكالة حلال ديجيتال المغرب" class="w-full h-full object-cover">
            </div>
            <div class="max-w-7xl mx-auto px-6 relative z-10 w-full py-20">
                <article class="max-w-4xl space-y-10 animate-fadeIn">
                    <div class="inline-flex items-center gap-3 px-5 py-2.5 bg-blue-600/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-black">
                        <span class="relative flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span></span>
                        أفضل خدمات برمجة المواقع بالمغرب
                    </div>
                    <h1 class="text-6xl md:text-8xl font-black leading-tight tracking-tight">خبراء <span class="text-blue-500">تصميم المواقع</span> <br>في المغرب</h1>
                    <p class="text-2xl text-gray-400 font-medium leading-relaxed max-w-2xl">نساعدك على مضاعفة مبيعاتك من خلال <strong>مواقع إلكترونية</strong> سريعة كأنها تطبيق هاتف، ومتصدرة لمحركات البحث.</p>
                    <div class="flex flex-wrap gap-6">
                        <button onclick="document.getElementById('portfolio').scrollIntoView({behavior:'smooth'})" class="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 rounded-3xl font-black text-xl transition-all shadow-3xl shadow-blue-600/20 transform hover:-translate-y-1">اكتشف أعمالنا المميزة</button>
                        <a href="https://wa.me/212${state.settings.whatsappNumber.substring(1)}" class="bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white px-12 py-6 rounded-3xl font-black text-xl transition-all border border-white/10 flex items-center gap-3">تحدث مع المبرمج 💬</a>
                    </div>
                </article>
            </div>
        </section>

        <!-- Portfolio Section -->
        <section id="portfolio" class="max-w-7xl mx-auto px-6">
            <div class="text-center space-y-4 mb-20">
                <h2 class="text-5xl font-black text-gray-900">أحدث أعمالنا الاحترافية</h2>
                <p class="text-gray-400 text-xl font-medium">قصص نجاح سطرناها مع زبنائنا من خلال الابتكار الرقمي في المغرب.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                ${state.projects.map((p: any) => `
                    <article class="bg-white rounded-[3.5rem] overflow-hidden shadow-sm border border-gray-50 group hover:shadow-4xl transition duration-500">
                        <div class="relative h-72 overflow-hidden">
                            <img src="${p.image}" alt="${p.name} - تصميم حلال ديجيتال" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
                            <div class="absolute inset-0 bg-blue-600/90 opacity-0 group-hover:opacity-100 transition duration-500 flex flex-col items-center justify-center p-8 text-white text-center">
                                <p class="font-bold mb-6">${p.description}</p>
                                <button onclick="window.location.hash='#/request'" class="bg-white text-blue-600 px-8 py-3 rounded-2xl font-black">اطلب نسخة مماثلة</button>
                            </div>
                        </div>
                        <div class="p-10 space-y-4">
                            <div class="text-sm font-black text-blue-600 uppercase tracking-widest">${p.category}</div>
                            <h3 class="text-3xl font-black text-gray-800">${p.name}</h3>
                        </div>
                    </article>
                `).join('')}
            </div>
        </section>

        <!-- FAQ Section -->
        <section id="faq" class="max-w-4xl mx-auto px-6">
            <h2 class="text-4xl font-black text-gray-900 text-center mb-16">الأسئلة الأكثر شيوعاً</h2>
            <div class="space-y-6">
                ${[
                    { q: "ما هي تكلفة إنشاء موقع؟", a: "تختلف حسب المشروع، لكن أسعارنا تبدأ من 3500 درهم للمواقع التعريفية." },
                    { q: "هل الموقع متوافق مع الهاتف؟", a: "بالتأكيد، جميع مواقعنا مصممة بنظام Mobile-First لتكون سريعة جداً على الهواتف." }
                ].map((f, i) => `
                    <div class="bg-white p-8 rounded-[2rem] border border-gray-100 hover:border-blue-200 transition-colors shadow-sm">
                        <h3 class="text-xl font-black text-gray-800 mb-4 flex items-center gap-4">
                            <span class="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-sm">${i+1}</span>
                            ${f.q}
                        </h3>
                        <p class="text-gray-500 font-medium leading-relaxed pr-14">${f.a}</p>
                    </div>
                `).join('')}
            </div>
        </section>
    </div>
`;

const renderConsultation = () => `
    <div class="max-w-4xl mx-auto px-6 py-24 animate-fadeIn">
        <div class="bg-white p-16 rounded-[4rem] shadow-4xl border border-gray-50 space-y-12">
            <div class="text-center space-y-4">
                <div class="text-7xl mb-6">🖋️</div>
                <h1 class="text-4xl font-black text-gray-900">طلب استشارة تقنية</h1>
                <p class="text-xl text-gray-400 font-medium">سنقوم بدراسة مشروعك بدقة وإرسال عرض مفصل لك.</p>
            </div>
            <form onsubmit="handleRequest(event)" class="space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-3">
                        <label class="font-black text-sm text-gray-400 mr-4">اسم الزبون / الشركة</label>
                        <input id="req-name" required class="w-full p-6 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-100 font-black text-lg" placeholder="أدخل اسمك هنا">
                    </div>
                    <div class="space-y-3">
                        <label class="font-black text-sm text-gray-400 mr-4">رقم الهاتف (واتساب)</label>
                        <input id="req-phone" required type="tel" class="w-full p-6 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-100 font-black text-lg text-left" dir="ltr" placeholder="06XXXXXXXX">
                    </div>
                    <div class="md:col-span-2 space-y-3">
                        <label class="font-black text-sm text-gray-400 mr-4">نوع الخدمة المطلوبة</label>
                        <select id="req-type" class="w-full p-6 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-100 font-black text-lg">
                            <option>إنشاء متجر إلكتروني احترافي</option>
                            <option>تصميم موقع تعريفي للشركة</option>
                            <option>برمجة تطبيق خاص (SaaS)</option>
                            <option>تحسين السيو SEO وتصدر النتائج</option>
                        </select>
                    </div>
                    <div class="md:col-span-2 space-y-3">
                        <label class="font-black text-sm text-gray-400 mr-4">وصف مختصر للمشروع</label>
                        <textarea id="req-desc" required class="w-full p-6 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-100 font-black text-lg h-44" placeholder="أخبرنا عن فكرة موقعك..."></textarea>
                    </div>
                </div>
                <button type="submit" class="w-full py-8 bg-blue-600 text-white rounded-[2.5rem] font-black text-2xl hover:bg-blue-700 transition shadow-2xl shadow-blue-100 active:scale-95">ارسال الطلب للمراجعة 📤</button>
            </form>
        </div>
    </div>
`;

(window as any).handleRequest = (e: Event) => {
    e.preventDefault();
    const req = {
        id: Date.now().toString(),
        name: (document.getElementById('req-name') as HTMLInputElement).value,
        phone: (document.getElementById('req-phone') as HTMLInputElement).value,
        type: (document.getElementById('req-type') as HTMLSelectElement).value,
        desc: (document.getElementById('req-desc') as HTMLTextAreaElement).value,
        createdAt: new Date().toISOString()
    };
    state.requests.unshift(req);
    saveState();
    alert('🎉 تم إرسال طلبك بنجاح! فريق حلال ديجيتال سيتصل بك قريباً جداً.');
    window.location.hash = '#/';
};

const router = () => {
    const hash = window.location.hash || '#/';
    const root = document.getElementById('app-root');
    const loading = document.getElementById('loading');
    if (!root || !loading) return;

    loading.style.width = '100%';
    setTimeout(() => loading.style.width = '0', 300);

    const isDashboard = hash.startsWith('#/dashboard');
    const headerEl = document.querySelector('header');
    if (headerEl) headerEl.style.display = isDashboard ? 'none' : 'block';
    const footerEl = document.getElementById('main-footer');
    if (footerEl) footerEl.style.display = isDashboard ? 'none' : 'block';

    if (hash === '#/') {
        root.innerHTML = renderHome();
    } else if (hash === '#/request') {
        root.innerHTML = renderConsultation();
    } else if (isDashboard) {
        if (!state.isAuthenticated) {
            root.innerHTML = renderLoginForm();
        } else {
            root.innerHTML = renderDashboard();
            (window as any).switchTab('requests');
        }
    } else {
        root.innerHTML = `<div class="text-center py-40 font-black text-3xl">404 - الصفحة غير موجودة</div>`;
    }
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
