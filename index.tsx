
/**
 * Halal Digital Services - Version 2.5
 * Integrated Social Sharing, Floating Contact & Dashboard Eye Toggle
 */

// --- Constants & Data ---
const INITIAL_PROJECTS = [
    { 
        id: '1', 
        name: 'متجر "أناقة" للملابس المغربية', 
        description: 'تطوير متجر إلكتروني متكامل مع نظام دفع محلي وتصميم عصري متجاوب يزيد المبيعات بنسبة 40%.', 
        category: 'تطوير متاجر', 
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800' 
    },
    { 
        id: '2', 
        name: 'موقع وكالة أسفار وطنية', 
        description: 'تصميم موقع سياحي احترافي يضم محرك بحث للرحلات ونظام حجز مباشر في كافة مدن المغرب.', 
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

// --- Helper Functions ---
(window as any).togglePassword = (inputId: string) => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const btn = document.getElementById(inputId + '-btn');
    if (!input) return;
    
    if (input.type === 'password') {
        input.type = 'text';
        if (btn) btn.innerHTML = '🔒';
    } else {
        input.type = 'password';
        if (btn) btn.innerHTML = '👁️';
    }
};

(window as any).shareSite = async () => {
    const shareData = {
        title: 'حلال ديجيتال - برمجة مواقع احترافية',
        text: 'اكتشف أفضل خدمات تصميم المواقع والمتاجر الإلكترونية في المغرب مع حلال ديجيتال.',
        url: window.location.origin
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.log('Error sharing:', err);
        }
    } else {
        (window as any).copyLink();
    }
};

(window as any).copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert('📋 تم نسخ رابط الموقع بنجاح! يمكنك الآن مشاركته.');
    });
};

(window as any).shareTo = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('اطلب موقعك الاحترافي الآن من حلال ديجيتال بالمغرب 🇲🇦');
    let shareUrl = '';

    switch (platform) {
        case 'fb': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
        case 'tw': shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`; break;
        case 'wa': shareUrl = `https://wa.me/?text=${text}%20${url}`; break;
        case 'tg': shareUrl = `https://t.me/share/url?url=${url}&text=${text}`; break;
    }
    window.open(shareUrl, '_blank');
};

// --- Components ---
const renderFloatingActions = () => `
    <div class="fixed bottom-8 left-8 z-[100] flex flex-col gap-4 animate-fadeIn">
        <a href="https://wa.me/212${state.settings.whatsappNumber.substring(1)}" target="_blank" class="w-16 h-16 bg-green-500 text-white rounded-full shadow-2xl flex items-center justify-center text-3xl hover:scale-110 transition active:scale-90" title="تواصل عبر واتساب">
            <svg class="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.161 1.237 8.404 3.48s3.481 5.229 3.481 8.406c0 6.555-5.332 11.887-11.888 11.887-2.007 0-3.974-.506-5.717-1.47l-6.071 1.694zm6.202-3.615c1.545.918 3.518 1.487 5.626 1.487 5.518 0 10.003-4.485 10.003-10.003 0-2.671-1.041-5.181-2.932-7.071s-4.4-2.932-7.071-2.932c-5.517 0-10.002 4.485-10.002 10.002 0 1.956.568 3.864 1.63 5.495l-1.071 3.91 4.015-1.121zm10.741-7.238c-.287-.144-1.697-.838-1.959-.933-.261-.095-.452-.143-.642.144-.191.286-.738.933-.905 1.123-.167.189-.333.213-.62.069-.287-.143-1.21-.446-2.305-1.423-.852-.76-1.427-1.7-1.593-1.986-.167-.286-.018-.441.126-.583.13-.127.286-.334.429-.501.144-.167.191-.286.286-.477.095-.19.048-.357-.024-.5-.071-.144-.642-1.547-.879-2.12-.231-.558-.465-.482-.642-.491-.166-.008-.357-.01-.548-.01s-.5.071-.762.357c-.262.286-1.001.977-1.001 2.383s1.025 2.763 1.168 2.954c.143.19 2.017 3.081 4.885 4.318.682.294 1.214.47 1.63.603.685.217 1.309.186 1.802.112.549-.082 1.697-.693 1.935-1.361s.239-1.241.167-1.362c-.071-.121-.262-.19-.548-.334z"/></svg>
        </a>
        <button onclick="shareSite()" class="w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl hover:bg-blue-700 transition active:scale-95" title="مشاركة الموقع">
            🔗
        </button>
    </div>
`;

// --- Public Renderers ---
const renderHome = () => `
    <div class="space-y-32 animate-fadeIn pb-20">
        <!-- Hero Section -->
        <section class="relative min-h-[700px] flex items-center bg-gray-950 text-white overflow-hidden">
            <div class="absolute inset-0 opacity-10">
                <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1600" class="w-full h-full object-cover">
            </div>
            <div class="max-w-7xl mx-auto px-6 relative z-10 w-full py-20">
                <div class="max-w-4xl space-y-10">
                    <div class="inline-flex items-center gap-3 px-5 py-2.5 bg-blue-600/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-black">
                        وكالة حلال ديجيتال المغربية 🇲🇦
                    </div>
                    <h1 class="text-6xl md:text-8xl font-black leading-tight">شريكك في <br><span class="text-blue-500">النمو الرقمي</span></h1>
                    <p class="text-2xl text-gray-400 font-medium leading-relaxed max-w-2xl">نحن لا نصمم مواقع فحسب، بل نبني بوابات تجارية متكاملة تساعدك على الانتشار وتحقيق الأرباح.</p>
                    <div class="flex flex-wrap gap-6">
                        <button onclick="document.getElementById('portfolio').scrollIntoView({behavior:'smooth'})" class="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 rounded-3xl font-black text-xl transition-all shadow-xl shadow-blue-600/20">تصفح المشاريع</button>
                        <a href="https://wa.me/212${state.settings.whatsappNumber.substring(1)}" class="bg-white/5 hover:bg-white/10 text-white px-12 py-6 rounded-3xl font-black text-xl border border-white/10 flex items-center gap-3">استشارة مجانية 💬</a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Portfolio Section -->
        <section id="portfolio" class="max-w-7xl mx-auto px-6">
            <h2 class="text-5xl font-black text-gray-900 text-center mb-20">سابقة أعمالنا</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                ${state.projects.map((p: any) => `
                    <article class="bg-white rounded-[3rem] overflow-hidden shadow-sm border border-gray-50 group hover:shadow-2xl transition duration-500">
                        <div class="h-72 overflow-hidden relative">
                            <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
                        </div>
                        <div class="p-10 space-y-4">
                            <div class="text-blue-600 font-black text-xs uppercase tracking-widest">${p.category}</div>
                            <h3 class="text-2xl font-black">${p.name}</h3>
                            <p class="text-gray-500 font-medium line-clamp-2">${p.description}</p>
                        </div>
                    </article>
                `).join('')}
            </div>
        </section>

        <!-- Social Share Section -->
        <section class="max-w-5xl mx-auto px-6 text-center space-y-12">
            <div class="bg-white p-12 rounded-[4rem] border-2 border-dashed border-gray-200 space-y-8">
                <h2 class="text-3xl font-black">أعجبك عملنا؟ شاركه مع الآخرين!</h2>
                <p class="text-gray-400 font-medium">ساعد المقاولات المغربية على إيجاد أفضل الحلول البرمجية عبر مشاركة موقعنا.</p>
                <div class="flex flex-wrap justify-center gap-4">
                    <button onclick="shareTo('wa')" class="bg-[#25D366] text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition">واتساب</button>
                    <button onclick="shareTo('fb')" class="bg-[#1877F2] text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition">فيسبوك</button>
                    <button onclick="shareTo('tg')" class="bg-[#0088cc] text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition">تلجرام</button>
                    <button onclick="copyLink()" class="bg-gray-100 text-gray-800 px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition">نسخ الرابط 📋</button>
                </div>
            </div>
        </section>
    </div>
`;

const renderConsultation = () => `
    <div class="max-w-3xl mx-auto px-6 py-24 animate-fadeIn">
        <div class="bg-white p-16 rounded-[4rem] shadow-3xl border border-gray-50 space-y-12">
            <h1 class="text-4xl font-black text-center">ابدأ رحلتك الرقمية الآن</h1>
            <form onsubmit="handleRequest(event)" class="space-y-6">
                <input id="req-name" required class="w-full p-6 bg-gray-50 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold" placeholder="الاسم الكامل">
                <input id="req-phone" required type="tel" class="w-full p-6 bg-gray-50 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-left" dir="ltr" placeholder="06XXXXXXXX">
                <select id="req-type" class="w-full p-6 bg-gray-50 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold">
                    <option>متجر إلكتروني احترافي</option>
                    <option>موقع شركة تعريفي</option>
                    <option>نظام إدارة أعمال (SaaS)</option>
                </select>
                <textarea id="req-desc" required class="w-full p-6 bg-gray-50 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold h-32" placeholder="أخبرنا عن فكرة مشروعك..."></textarea>
                <button type="submit" class="w-full py-6 bg-blue-600 text-white rounded-3xl font-black text-xl shadow-xl shadow-blue-100">إرسال الطلب</button>
            </form>
        </div>
    </div>
`;

// --- Admin Renderers ---
const renderLoginForm = () => `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6 animate-fadeIn">
        <div class="max-w-md w-full bg-white p-12 rounded-[3.5rem] shadow-4xl border border-gray-100 text-center space-y-10">
            <div class="w-24 h-24 bg-blue-600 text-white flex items-center justify-center rounded-[2rem] mx-auto text-4xl shadow-2xl shadow-blue-200">🔐</div>
            <div class="space-y-2">
                <h1 class="text-3xl font-black">لوحة التحكم</h1>
                <p class="text-gray-400 font-bold">أدخل كلمة السر للمتابعة</p>
            </div>
            <div class="space-y-4 relative">
                <input type="password" id="dash-pass" class="w-full p-6 bg-gray-50 rounded-3xl border-none outline-none focus:ring-4 focus:ring-blue-100 font-black text-center text-3xl tracking-widest" placeholder="••••">
                <button type="button" id="dash-pass-btn" onclick="togglePassword('dash-pass')" class="absolute left-6 top-1/2 -translate-y-1/2 text-2xl opacity-50 hover:opacity-100 transition p-2">👁️</button>
            </div>
            <button onclick="login()" class="w-full py-6 bg-blue-600 text-white rounded-3xl font-black text-xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition transform active:scale-95">دخول الإدارة</button>
            <a href="#/" class="block text-gray-400 font-black hover:text-blue-600 transition">العودة للموقع</a>
        </div>
    </div>
`;

const renderDashboard = () => `
    <div class="min-h-screen bg-white flex flex-col md:flex-row animate-fadeIn">
        <aside class="w-full md:w-80 bg-gray-900 text-white p-10 flex flex-col justify-between">
            <div class="space-y-12">
                <div class="text-2xl font-black">حلال <span class="text-blue-500">ADMIN</span></div>
                <nav class="flex flex-col gap-2">
                    <button onclick="switchTab('requests')" class="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition font-black text-right w-full"><span>📊</span> الطلبات</button>
                    <button onclick="switchTab('projects')" class="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition font-black text-right w-full"><span>📁</span> المشاريع</button>
                    <button onclick="switchTab('settings')" class="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition font-black text-right w-full"><span>⚙️</span> الإعدادات</button>
                </nav>
            </div>
            <button onclick="logout()" class="p-4 bg-red-500/10 text-red-400 rounded-2xl font-black text-sm mt-10">تسجيل الخروج</button>
        </aside>
        <main class="flex-1 p-8 md:p-16 overflow-y-auto bg-gray-50">
            <div id="dash-content" class="max-w-5xl mx-auto space-y-12"></div>
        </main>
    </div>
`;

// --- Actions ---
(window as any).login = () => {
    const val = (document.getElementById('dash-pass') as HTMLInputElement).value;
    if (val === state.settings.dashPassword) {
        state.isAuthenticated = true;
        sessionStorage.setItem('isAdmin', 'true');
        router();
    } else {
        alert('❌ كلمة السر غير صحيحة');
    }
};

(window as any).logout = () => {
    state.isAuthenticated = false;
    sessionStorage.removeItem('isAdmin');
    window.location.hash = '#/';
};

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
    alert('✅ تم إرسال طلبك بنجاح! سنتصل بك قريباً.');
    window.location.hash = '#/';
};

(window as any).switchTab = (tab: string) => {
    const container = document.getElementById('dash-content');
    if (!container) return;

    if (tab === 'requests') {
        container.innerHTML = `
            <h2 class="text-4xl font-black">الطلبات الواردة (${state.requests.length})</h2>
            <div class="grid gap-6">
                ${state.requests.length === 0 ? '<p class="text-center py-20 bg-white rounded-3xl border border-dashed font-bold text-gray-400">لا توجد طلبات بعد</p>' : 
                state.requests.map((r: any) => `
                    <div class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div class="space-y-2 text-center md:text-right">
                            <div class="flex items-center gap-3 justify-center md:justify-start">
                                <span class="font-black text-xl">${r.name}</span>
                                <span class="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-black rounded-lg">${r.type}</span>
                            </div>
                            <div class="text-blue-600 font-bold" dir="ltr">${r.phone}</div>
                            <p class="text-gray-500 font-medium">${r.desc}</p>
                        </div>
                        <div class="flex gap-4">
                            <a href="https://wa.me/212${r.phone.substring(1)}" target="_blank" class="p-4 bg-green-50 text-green-600 rounded-2xl font-black">واتساب</a>
                            <button onclick="deleteRequest('${r.id}')" class="p-4 bg-red-50 text-red-500 rounded-2xl font-black">حذف</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (tab === 'projects') {
        container.innerHTML = `
            <div class="flex justify-between items-center">
                <h2 class="text-4xl font-black">معرض الأعمال</h2>
                <button onclick="addProject()" class="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black">إضافة مشروع +</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                ${state.projects.map((p: any) => `
                    <div class="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                        <img src="${p.image}" class="h-48 w-full object-cover">
                        <div class="p-6 flex justify-between items-center">
                            <h3 class="font-black text-lg">${p.name}</h3>
                            <button onclick="deleteProject('${p.id}')" class="text-red-500 font-black">حذف</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (tab === 'settings') {
        container.innerHTML = `
            <h2 class="text-4xl font-black">إعدادات النظام</h2>
            <div class="bg-white p-12 rounded-[3.5rem] shadow-sm border border-gray-100 space-y-8 max-w-xl">
                <div class="space-y-4">
                    <label class="block font-black text-sm text-gray-400">رقم الواتساب</label>
                    <input id="set-wa" class="w-full p-5 bg-gray-50 rounded-2xl outline-none font-bold" value="${state.settings.whatsappNumber}">
                </div>
                <div class="space-y-4">
                    <label class="block font-black text-sm text-gray-400">كلمة سر الإدارة</label>
                    <div class="relative">
                        <input id="set-pass" type="password" class="w-full p-5 bg-gray-50 rounded-2xl outline-none font-bold" value="${state.settings.dashPassword}">
                        <button type="button" id="set-pass-btn" onclick="togglePassword('set-pass')" class="absolute left-5 top-1/2 -translate-y-1/2 text-xl p-2">👁️</button>
                    </div>
                </div>
                <button onclick="updateSettings()" class="w-full py-6 bg-blue-600 text-white rounded-3xl font-black shadow-xl shadow-blue-50">حفظ الإعدادات</button>
            </div>
        `;
    }
};

(window as any).deleteRequest = (id: string) => {
    if (!confirm('هل تريد حذف هذا الطلب؟')) return;
    state.requests = state.requests.filter((r: any) => r.id !== id);
    saveState();
    (window as any).switchTab('requests');
};

(window as any).deleteProject = (id: string) => {
    if (!confirm('حذف المشروع من المعرض؟')) return;
    state.projects = state.projects.filter((p: any) => p.id !== id);
    saveState();
    (window as any).switchTab('projects');
};

(window as any).addProject = () => {
    const name = prompt('اسم المشروع:');
    if (!name) return;
    const img = prompt('رابط الصورة:', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800');
    if (!img) return;
    
    state.projects.unshift({
        id: Date.now().toString(),
        name,
        description: 'مشروع جديد.',
        category: 'تطوير',
        image: img
    });
    saveState();
    (window as any).switchTab('projects');
};

(window as any).updateSettings = () => {
    state.settings.whatsappNumber = (document.getElementById('set-wa') as HTMLInputElement).value;
    state.settings.dashPassword = (document.getElementById('set-pass') as HTMLInputElement).value;
    saveState();
    alert('✅ تم الحفظ بنجاح');
};

// --- Router ---
const router = () => {
    const hash = window.location.hash || '#/';
    const root = document.getElementById('app-root');
    const loading = document.getElementById('loading');
    if (!root || !loading) return;

    loading.style.width = '100%';
    setTimeout(() => loading.style.width = '0', 400);

    const isDashboard = hash.startsWith('#/dashboard');
    const header = document.querySelector('header');
    const footer = document.getElementById('main-footer');
    
    if (header) header.style.display = isDashboard ? 'none' : 'block';
    if (footer) footer.style.display = isDashboard ? 'none' : 'block';

    if (hash === '#/') {
        root.innerHTML = renderHome() + renderFloatingActions();
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
