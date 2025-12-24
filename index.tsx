
/**
 * Halal Digital Services - Professional Portfolio & Agency
 * Web Design & Development
 */

// --- Constants ---
const INITIAL_PROJECTS = [
    { 
        id: '1', 
        name: 'منصة تسوق فاخرة', 
        description: 'تصميم وتطوير متجر إلكتروني متكامل مع نظام دفع متطور وواجهة مستخدم عصرية تزيد من نسبة المبيعات.', 
        price: 5000, 
        category: 'تطوير متاجر', 
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800' 
    },
    { 
        id: '2', 
        name: 'موقع شركة عقارية', 
        description: 'موقع تعريفي احترافي لشركة عقارات كبرى يضم معرضاً للمشاريع ونظام تواصل مباشر مع الوكلاء.', 
        price: 3500, 
        category: 'مواقع تعريفية', 
        image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800' 
    },
    { 
        id: '3', 
        name: 'تطبيق إدارة المطاعم', 
        description: 'نظام سحابي متطور لإدارة الطلبات والمخزون في المطاعم، صمم ليعمل بكفاءة على كافة الأجهزة.', 
        price: 8000, 
        category: 'تطبيقات الويب', 
        image: 'https://images.unsplash.com/photo-1551288049-bbbda536639a?auto=format&fit=crop&q=80&w=800' 
    }
];

const INITIAL_SETTINGS = {
    fbPixel: '',
    shippingFee: 0,
    currency: 'د.م.',
    dashPassword: '1234',
    whatsappNumber: '0649075664',
    email: 'abdelghaforbahaddou@gmail.com'
};

// --- App State ---
let state = {
    projects: JSON.parse(localStorage.getItem('projects') || 'null') || INITIAL_PROJECTS,
    requests: JSON.parse(localStorage.getItem('requests') || '[]'),
    settings: JSON.parse(localStorage.getItem('settings') || 'null') || INITIAL_SETTINGS,
    selectedService: null as any,
    isAuthenticated: false
};

// --- Utilities ---
const saveState = () => {
    localStorage.setItem('projects', JSON.stringify(state.projects));
    localStorage.setItem('requests', JSON.stringify(state.requests));
    localStorage.setItem('settings', JSON.stringify(state.settings));
};

// --- Helper Functions ---
(window as any).togglePassword = (inputId: string) => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
};

// --- Renderers ---
const renderHome = () => `
    <div class="space-y-24">
        <!-- Hero Section -->
        <section class="relative min-h-[600px] flex items-center bg-gray-900 text-white overflow-hidden">
            <div class="absolute inset-0 opacity-20">
                <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600" class="w-full h-full object-cover">
            </div>
            <div class="max-w-7xl mx-auto px-6 relative z-10 w-full py-20">
                <div class="max-w-3xl space-y-8 animate-fadeIn">
                    <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-sm font-bold">
                        <span class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                        نحول أفكارك إلى واقع رقمي مبهر
                    </div>
                    <h1 class="text-5xl md:text-7xl font-black leading-tight">حلال للخدمات <br><span class="text-blue-500 text-outline">التقنية والبرمجة</span></h1>
                    <p class="text-xl text-gray-400 font-medium leading-relaxed">نحن نصمم ونطور مواقع إلكترونية عصرية، سريعة، ومتوافقة مع محركات البحث لمساعدتك على تنمية عملك في الفضاء الرقمي.</p>
                    <div class="flex flex-wrap gap-4">
                        <button onclick="document.getElementById('portfolio').scrollIntoView({behavior:'smooth'})" class="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black transition-all shadow-2xl shadow-blue-600/30 transform hover:-translate-y-1">مشاهدة أعمالنا</button>
                        <a href="mailto:${state.settings.email}" class="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-10 py-5 rounded-2xl font-black transition-all border border-white/10">تواصل معنا الآن</a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Stats Section -->
        <section class="max-w-7xl mx-auto px-6">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white p-12 rounded-[3rem] shadow-xl border border-gray-50">
                <div class="text-center space-y-2 border-l last:border-l-0 border-gray-100">
                    <div class="text-4xl font-black text-blue-600">+50</div>
                    <div class="text-gray-400 font-bold text-sm">مشروع ناجح</div>
                </div>
                <div class="text-center space-y-2 border-l last:border-l-0 border-gray-100">
                    <div class="text-4xl font-black text-blue-600">100%</div>
                    <div class="text-gray-400 font-bold text-sm">رضا العملاء</div>
                </div>
                <div class="text-center space-y-2 border-l last:border-l-0 border-gray-100">
                    <div class="text-4xl font-black text-blue-600">24/7</div>
                    <div class="text-gray-400 font-bold text-sm">دعم فني</div>
                </div>
                <div class="text-center space-y-2">
                    <div class="text-4xl font-black text-blue-600">+5</div>
                    <div class="text-gray-400 font-bold text-sm">سنوات خبرة</div>
                </div>
            </div>
        </section>

        <!-- Services Section -->
        <section class="max-w-7xl mx-auto px-6">
            <div class="text-center space-y-4 mb-16">
                <h2 class="text-4xl font-black text-gray-900">ماذا نقدم لك؟</h2>
                <p class="text-gray-400 max-w-2xl mx-auto font-medium">حلول برمجية متكاملة مصممة خصيصاً لتلبية احتياجاتك وأهدافك التجارية.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-2xl transition group">
                    <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:bg-blue-600 group-hover:text-white transition duration-500">💻</div>
                    <h3 class="text-xl font-black text-gray-800 mb-4">تطوير الويب</h3>
                    <p class="text-gray-500 leading-relaxed">بناء مواقع سريعة ومتجاوبة باستخدام أحدث التقنيات لضمان أفضل تجربة للمستخدم.</p>
                </div>
                <div class="bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-2xl transition group">
                    <div class="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:bg-purple-600 group-hover:text-white transition duration-500">🎨</div>
                    <h3 class="text-xl font-black text-gray-800 mb-4">تصميم UI/UX</h3>
                    <p class="text-gray-500 leading-relaxed">تصاميم بصرية جذابة وسهلة الاستخدام تركز على تحويل الزوار إلى عملاء دائمين.</p>
                </div>
                <div class="bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-2xl transition group">
                    <div class="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:bg-green-600 group-hover:text-white transition duration-500">🚀</div>
                    <h3 class="text-xl font-black text-gray-800 mb-4">تحسين SEO</h3>
                    <p class="text-gray-500 leading-relaxed">تصدر نتائج البحث الأولى وجذب المزيد من الزوار العضويين إلى موقعك باستمرار.</p>
                </div>
            </div>
        </section>

        <!-- Portfolio Section -->
        <section id="portfolio" class="max-w-7xl mx-auto px-6 pb-20">
            <div class="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
                <div class="space-y-4">
                    <h2 class="text-4xl font-black text-gray-900">معرض أعمالنا</h2>
                    <p class="text-gray-400 font-medium">نفتخر بتقديم أفضل الحلول الرقمية لعملائنا في مختلف المجالات.</p>
                </div>
                <div class="flex gap-2">
                    <button class="bg-blue-600 text-white px-8 py-3 rounded-xl font-black shadow-lg shadow-blue-100">الكل</button>
                    <button class="bg-gray-100 text-gray-500 px-8 py-3 rounded-xl font-black">متاجر</button>
                    <button class="bg-gray-100 text-gray-500 px-8 py-3 rounded-xl font-black">شركات</button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                ${state.projects.map((p: any) => `
                    <div class="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-50 group hover:shadow-2xl transition duration-500">
                        <div class="relative h-64 overflow-hidden">
                            <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
                            <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 flex items-end p-8">
                                <button onclick="requestProject('${p.id}')" class="bg-white text-gray-900 w-full py-4 rounded-xl font-black transform translate-y-4 group-hover:translate-y-0 transition duration-500">طلب مشروع مماثل</button>
                            </div>
                        </div>
                        <div class="p-8 space-y-4">
                            <div class="text-xs font-black text-blue-600 uppercase tracking-widest">${p.category}</div>
                            <h3 class="text-2xl font-black text-gray-800">${p.name}</h3>
                            <p class="text-gray-500 text-sm leading-relaxed line-clamp-2">${p.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>

        <!-- Contact Banner -->
        <section class="max-w-7xl mx-auto px-6 mb-24">
            <div class="bg-blue-600 rounded-[3.5rem] p-12 md:p-20 text-white text-center space-y-8 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <h2 class="text-4xl md:text-5xl font-black relative z-10">هل لديك مشروع قيد التفكير؟</h2>
                <p class="text-xl text-blue-100 relative z-10 max-w-2xl mx-auto">تواصل معنا اليوم وسوف نساعدك في بناء هويتك الرقمية باحترافية عالية.</p>
                <div class="flex flex-wrap justify-center gap-6 relative z-10">
                    <a href="https://wa.me/212${state.settings.whatsappNumber.substring(1)}" class="bg-white text-blue-600 px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 hover:bg-gray-50 transition">
                        <span>💬</span> واتساب: ${state.settings.whatsappNumber}
                    </a>
                    <a href="mailto:${state.settings.email}" class="bg-blue-700 text-white border border-white/20 px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 hover:bg-blue-800 transition">
                        <span>📧</span> ${state.settings.email}
                    </a>
                </div>
            </div>
        </section>
    </div>
`;

const renderConsultation = () => `
    <div class="max-w-4xl mx-auto px-6 py-24 animate-fadeIn">
        <div class="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-gray-50 space-y-10">
            <div class="text-center space-y-4">
                <div class="text-5xl">📝</div>
                <h1 class="text-3xl font-black text-gray-900">طلب استشارة لمشروع جديد</h1>
                <p class="text-gray-400 font-medium">املأ البيانات وسنتصل بك في أقل من 24 ساعة</p>
            </div>
            <form onsubmit="handleRequest(event)" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label class="mr-4 font-black text-xs text-gray-400 uppercase">الاسم بالكامل</label>
                        <input id="req-name" required class="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-100 font-bold" placeholder="أدخل اسمك">
                    </div>
                    <div class="space-y-2">
                        <label class="mr-4 font-black text-xs text-gray-400 uppercase">رقم الهاتف</label>
                        <input id="req-phone" required type="tel" class="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-100 font-bold text-left" dir="ltr" placeholder="06XXXXXXXX">
                    </div>
                    <div class="space-y-2 md:col-span-2">
                        <label class="mr-4 font-black text-xs text-gray-400 uppercase">نوع المشروع</label>
                        <select id="req-type" class="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-100 font-bold">
                            <option>متجر إلكتروني</option>
                            <option>موقع شركة</option>
                            <option>تطبيق ويب خاص</option>
                            <option>تحسين SEO</option>
                            <option>تصميم فقط</option>
                        </select>
                    </div>
                    <div class="space-y-2 md:col-span-2">
                        <label class="mr-4 font-black text-xs text-gray-400 uppercase">تفاصيل المشروع (اختياري)</label>
                        <textarea id="req-desc" class="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-100 font-bold h-40" placeholder="أخبرنا المزيد عما تحتاجه..."></textarea>
                    </div>
                </div>
                <button type="submit" class="w-full py-6 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition shadow-xl shadow-blue-100 active:scale-95">إرسال الطلب الآن 🚀</button>
            </form>
        </div>
    </div>
`;

const renderDashboard = () => {
    if (!state.isAuthenticated) return renderLogin();
    const subRoute = window.location.hash.split('/dashboard/')[1] || 'portfolio';
    return `
        <div class="min-h-screen bg-[#f8fafc] flex">
            <aside class="w-72 bg-gray-900 text-white p-8 h-screen fixed right-0 flex flex-col">
                <h2 class="text-2xl font-black text-blue-500 mb-12">لوحة التحكم</h2>
                <nav class="flex-grow space-y-4 font-bold">
                    <a href="#/dashboard/portfolio" class="flex items-center gap-3 p-4 rounded-xl ${subRoute === 'portfolio' ? 'bg-blue-600' : 'text-gray-400 hover:bg-white/5'}">🖼️ الأعمال</a>
                    <a href="#/dashboard/requests" class="flex items-center gap-3 p-4 rounded-xl ${subRoute === 'requests' ? 'bg-blue-600' : 'text-gray-400 hover:bg-white/5'}">📥 الطلبات <span class="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full mr-auto">${state.requests.length}</span></a>
                    <a href="#/dashboard/settings" class="flex items-center gap-3 p-4 rounded-xl ${subRoute === 'settings' ? 'bg-blue-600' : 'text-gray-400 hover:bg-white/5'}">⚙️ الإعدادات</a>
                </nav>
                <button onclick="logout()" class="text-red-400 font-bold p-4 hover:bg-red-500/10 rounded-xl transition">🚪 خروج</button>
            </aside>
            <main class="flex-grow mr-72 p-16">
                ${subRoute === 'portfolio' ? renderProjectManager() : subRoute === 'requests' ? renderRequestManager() : renderSettingsManager()}
            </main>
        </div>
    `;
};

const renderLogin = () => `
    <div class="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6">
        <div class="bg-white p-12 rounded-[3.5rem] shadow-2xl border w-full max-w-md space-y-8 animate-fadeIn">
            <div class="text-center">
                <div class="text-6xl mb-6">🔒</div>
                <h1 class="text-3xl font-black text-gray-900">دخول الإدارة</h1>
            </div>
            <div class="space-y-6">
                <div class="relative">
                    <input id="dash-pass" type="password" class="w-full p-6 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-100 text-center text-3xl font-black tracking-widest" placeholder="••••">
                    <button onclick="togglePassword('dash-pass')" class="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                </div>
                <button onclick="login()" class="w-full py-6 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition">فتح النظام</button>
            </div>
        </div>
    </div>
`;

const renderProjectManager = () => `
    <div class="space-y-12">
        <h2 class="text-4xl font-black text-gray-900">إدارة الأعمال (Portfolio)</h2>
        <div class="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
            <h3 class="font-black text-xl text-blue-600">إضافة عمل جديد</h3>
            <div class="grid grid-cols-2 gap-6">
                <input id="p-name" class="p-5 bg-gray-50 rounded-xl border-none font-bold" placeholder="اسم المشروع">
                <input id="p-cat" class="p-5 bg-gray-50 rounded-xl border-none font-bold" placeholder="التصنيف (مثلاً: متجر)">
                <input id="p-image" class="p-5 bg-gray-50 rounded-xl border-none font-bold col-span-2" placeholder="رابط صورة المشروع">
                <textarea id="p-desc" class="p-5 bg-gray-50 rounded-xl border-none font-bold col-span-2 h-32" placeholder="وصف تفصيلي للمشروع..."></textarea>
            </div>
            <button onclick="addProject()" class="bg-blue-600 text-white px-10 py-5 rounded-xl font-black hover:bg-blue-700 transition">نشر المشروع في المعرض</button>
        </div>
        <div class="grid grid-cols-1 gap-4">
            ${state.projects.map((p: any) => `
                <div class="bg-white p-6 rounded-3xl border flex items-center justify-between">
                    <div class="flex items-center gap-6">
                        <img src="${p.image}" class="w-20 h-20 rounded-2xl object-cover">
                        <div>
                            <h4 class="font-black text-gray-800">${p.name}</h4>
                            <p class="text-gray-400 text-sm">${p.category}</p>
                        </div>
                    </div>
                    <button onclick="deleteProject('${p.id}')" class="text-red-400 font-bold hover:text-red-600">حذف</button>
                </div>
            `).join('')}
        </div>
    </div>
`;

const renderRequestManager = () => `
    <div class="space-y-12">
        <h2 class="text-4xl font-black text-gray-900">طلبات المشاريع الواردة</h2>
        <div class="bg-white rounded-[3rem] border overflow-hidden shadow-sm">
            <table class="w-full text-right">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        <th class="p-6 text-xs font-black text-gray-400 uppercase">الزبون</th>
                        <th class="p-6 text-xs font-black text-gray-400 uppercase">نوع الخدمة</th>
                        <th class="p-6 text-xs font-black text-gray-400 uppercase">تاريخ الطلب</th>
                        <th class="p-6 text-xs font-black text-gray-400 uppercase">إجراء</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    ${state.requests.map((r: any) => `
                        <tr>
                            <td class="p-6">
                                <div class="font-black text-gray-800">${r.name}</div>
                                <div class="text-xs text-blue-500 font-bold" dir="ltr">${r.phone}</div>
                            </td>
                            <td class="p-6 font-bold text-gray-600">${r.type}</td>
                            <td class="p-6 text-gray-400 text-sm">${new Date(r.createdAt).toLocaleDateString('ar-MA')}</td>
                            <td class="p-6">
                                <button onclick="deleteRequest('${r.id}')" class="text-red-300 hover:text-red-600">🗑️</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </div>
`;

const renderSettingsManager = () => `
    <div class="space-y-12 max-w-2xl">
        <h2 class="text-4xl font-black text-gray-900">الإعدادات والبيانات</h2>
        <div class="bg-white p-12 rounded-[3.5rem] shadow-sm border space-y-8">
            <div class="space-y-6">
                <div class="space-y-2">
                    <label class="font-black text-xs text-gray-400 mr-4">كلمة سر اللوحة</label>
                    <div class="relative">
                        <input id="s-pass" type="password" class="w-full p-5 bg-gray-50 rounded-2xl border-none font-bold" value="${state.settings.dashPassword}">
                        <button onclick="togglePassword('s-pass')" class="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                    </div>
                </div>
                <div class="space-y-2">
                    <label class="font-black text-xs text-gray-400 mr-4">رقم واتساب المبيعات</label>
                    <input id="s-wa" class="w-full p-5 bg-gray-50 rounded-2xl border-none font-bold text-left" dir="ltr" value="${state.settings.whatsappNumber}">
                </div>
                <div class="space-y-2">
                    <label class="font-black text-xs text-gray-400 mr-4">البريد الإلكتروني للإدارة</label>
                    <input id="s-email" class="w-full p-5 bg-gray-50 rounded-2xl border-none font-bold text-left" dir="ltr" value="${state.settings.email}">
                </div>
            </div>
            <button onclick="saveSettings()" class="w-full py-6 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-2xl shadow-blue-100">تحديث البيانات ✅</button>
        </div>
    </div>
`;

// --- Actions ---
(window as any).login = () => {
    const pass = (document.getElementById('dash-pass') as HTMLInputElement).value;
    if (pass === state.settings.dashPassword) { state.isAuthenticated = true; router(); }
    else alert('❌ كلمة السر خاطئة');
};

(window as any).logout = () => { state.isAuthenticated = false; window.location.hash = '#/'; };

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
    alert('🎉 شكراً لك! تم استلام طلبك، سنتصل بك قريباً جداً.');
    window.location.hash = '#/';
};

(window as any).addProject = () => {
    const name = (document.getElementById('p-name') as HTMLInputElement).value;
    const cat = (document.getElementById('p-cat') as HTMLInputElement).value;
    const img = (document.getElementById('p-image') as HTMLInputElement).value;
    const desc = (document.getElementById('p-desc') as HTMLTextAreaElement).value;
    if (!name || !img) return;
    state.projects.push({ id: Date.now().toString(), name, category: cat, image: img, description: desc });
    saveState(); router();
};

(window as any).deleteProject = (id: string) => { if(confirm('حذف؟')) { state.projects = state.projects.filter((x:any)=>x.id!==id); saveState(); router(); } };
(window as any).deleteRequest = (id: string) => { if(confirm('حذف؟')) { state.requests = state.requests.filter((x:any)=>x.id!==id); saveState(); router(); } };

(window as any).saveSettings = () => {
    state.settings.dashPassword = (document.getElementById('s-pass') as HTMLInputElement).value;
    state.settings.whatsappNumber = (document.getElementById('s-wa') as HTMLInputElement).value;
    state.settings.email = (document.getElementById('s-email') as HTMLInputElement).value;
    saveState(); alert('✅ تم التحديث بنجاح'); router();
};

(window as any).requestProject = (id: string) => { window.location.hash = '#/request'; };

// --- Router ---
const router = () => {
    const hash = window.location.hash || '#/';
    const root = document.getElementById('app-root');
    const loading = document.getElementById('loading');
    if (!root || !loading) return;

    loading.style.width = '100%';
    setTimeout(() => loading.style.width = '0', 300);

    const isDashboard = hash.startsWith('#/dashboard');
    document.getElementById('main-nav')!.style.display = isDashboard ? 'none' : 'block';
    document.getElementById('main-footer')!.style.display = isDashboard ? 'none' : 'block';

    if (hash === '#/') root.innerHTML = renderHome();
    else if (hash === '#/request') root.innerHTML = renderConsultation();
    else if (isDashboard) root.innerHTML = renderDashboard();
    else root.innerHTML = `<div class="text-center py-40 font-black text-3xl">404 - الصفحة غير موجودة</div>`;
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
