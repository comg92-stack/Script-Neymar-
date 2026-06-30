document.addEventListener("DOMContentLoaded", function () {
    // 1. فحص هل الرابط يحتوي على سكربت مُنشأ مسبقاً؟
    const urlParams = new URLSearchParams(window.location.search);
    const encodedScript = urlParams.get('sc');

    if (encodedScript) {
        // فحص هل الطلب قادم من داخل لعبة روبلوكس (المنفذات تستخدم HttpGet)
        // معظم المنفذات مثل Delta تحتوي على كلمة Roblox أو تفتقر لمتصفحات القياسية في الـ UserAgent
        const isRoblox = navigator.userAgent.includes("Roblox") || navigator.userAgent.includes("Protocol") || !navigator.userAgent.includes("Mozilla");

        if (isRoblox) {
            // إذا كان الطلب من داخل روبلوكس، نخرج السكربت الصافي فوراً ليعمل الـ loadstring
            try {
                document.body.innerHTML = atob(encodedScript);
            } catch (e) {
                document.body.innerHTML = "-- خطأ في قراءة السكربت";
            }
            return; // إيقاف باقي الكود لعدم عرض واجهة الموقع
        } else {
            // إذا كان شخص عادي يفتح الرابط من المتصفح
            document.body.innerHTML = `
                <div style="background-color: #1e293b; color: white; text-align: center; padding: 50px; font-family: sans-serif; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; direction: ltr;">
                    <h1 style="color: #38bdf8; margin-bottom: 20px;">This text is saved by Hasanein</h1>
                    <h1 style="color: #4ade80; font-family: 'Segoe UI', Tahoma; direction: rtl;">هذا النص محفوظ من حسنين</h1>
                </div>
            `;
            return;
        }
    }

    // 2. إدارة تنقلات الصفحة الرئيسية وصفحة الإنشاء للزائر العادي
    const homePage = document.getElementById("home-page");
    const createPage = document.getElementById("create-page");
    const goToCreateBtn = document.getElementById("go-to-create");
    const backToHomeBtn = document.getElementById("back-to-home");
    const saveBtn = document.getElementById("save-btn");
    const scriptInput = document.getElementById("script-input");
    const resultSection = document.getElementById("result-section");
    const rawUrlInput = document.getElementById("raw-url");
    const copyBtn = document.getElementById("copy-btn");

    goToCreateBtn.addEventListener("click", () => {
        homePage.classList.add("hidden");
        createPage.classList.remove("hidden");
    });

    backToHomeBtn.addEventListener("click", () => {
        createPage.classList.add("hidden");
        homePage.classList.remove("hidden");
        resultSection.classList.add("hidden");
        scriptInput.value = "";
    });

    // 3. توليد الرابط عند الضغط على احفظ السكربت
    saveBtn.addEventListener("click", () => {
        const scriptText = scriptInput.value.trim();
        if (!scriptText) {
            alert("الرجاء إدخال السكربت أولاً!");
            return;
        }

        // تحويل النص إلى ترميز Base64 لضمان نقله الآمن والكامل بالرابط
        const encoded = btoa(unescape(encodeURIComponent(scriptText)));
        
        // بناء الرابط المباشر للموقع الحالي
        const currentUrl = window.location.href.split('?')[0];
        const rawUrl = `${currentUrl}?sc=${encoded}`;

        // عرض النتيجة
        rawUrlInput.value = rawUrl;
        resultSection.classList.remove("hidden");
    });

    // 4. نسخ الرابط لملصق الحافظة
    copyBtn.addEventListener("click", () => {
        rawUrlInput.select();
        document.execCommand("copy");
        alert("تم نسخ الرابط بنجاح!");
    });
});
