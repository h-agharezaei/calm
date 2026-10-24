/**
 * ============================================
 * Calm - فضای آرامش و تمرکز
 * ============================================
 * 
 * توضیحات: فایل اسکریپت اصلی برنامه Calm
 * این فایل مسئول مدیریت تمام قابلیت‌های تعاملی برنامه است
 * 
 * قابلیت‌ها:
 * 1. مدیریت پخش خودکار صدا:
 *    - پخش صدا در بازه‌های زمانی قابل تنظیم
 *    - شمارش معکوس تا پخش بعدی
 *    - قابلیت فعال/غیرفعال کردن پخش صدا
 * 
 * 2. مدیریت تصاویر پس‌زمینه:
 *    - انتخاب تصادفی عکس در هر بار بارگذاری
 *    - حالت چرخش خودکار تصاویر
 *    - انتخاب دستی تصویر از طریق thumbnails
 * 
 * 3. رابط کاربری:
 *    - Overlay شروع برای دریافت تعامل کاربر
 *    - پنل تنظیمات با انیمیشن و overlay
 *    - مدیریت رویدادها و وضعیت‌های مختلف
 * 
 * نویسنده: Calm Development Team
 * آخرین بروزرسانی: 2025
 * ============================================
 */

// ============================================
// عناصر DOM
// ============================================
const audio = document.getElementById('audio');
const startOverlay = document.getElementById('startOverlay');
const startBtn = document.getElementById('startBtn');
const bgModeSelect = document.getElementById('bgMode');
const bgIntervalInput = document.getElementById('bgInterval');
const updateBgBtn = document.getElementById('updateBgBtn');
const bgIntervalRow = document.getElementById('bgIntervalRow');
const imageSelectRow = document.getElementById('imageSelectRow');
const thumbnails = document.querySelectorAll('.thumbnail');
const backgroundImage = document.querySelector('.background-image');
const settingsIcon = document.getElementById('settingsIcon');
const settingsOverlay = document.getElementById('settingsOverlay');
const controlPanel = document.getElementById('controlPanel');
const closePanel = document.getElementById('closePanel');
const loadingOverlay = document.getElementById('loadingOverlay');

// عناصر پنل بازه زمانی
const intervalIcon = document.getElementById('intervalIcon');
const intervalOverlay = document.getElementById('intervalOverlay');
const intervalPanel = document.getElementById('intervalPanel');
const closeIntervalPanel = document.getElementById('closeIntervalPanel');
const intervalInput2 = document.getElementById('interval2');
const updateBtn2 = document.getElementById('updateBtn2');
const soundToggle2 = document.getElementById('soundToggle2');
const soundSelect2 = document.getElementById('soundSelect2');
const statusSpan2 = document.getElementById('status2');
const customIntervalRow2 = document.getElementById('customIntervalRow2');
const presetButtons = document.querySelectorAll('.preset-btn');

// ============================================
// متغیرهای برنامه
// ============================================

// متغیر زبان
let currentLang = 'fa'; // پیش‌فرض فارسی

// ترجمه‌های برنامه
const translations = {
    en: {
        // Tab titles
        tabSettings: '⚙️ Settings',
        tabDonation: '💝 Support',
        tabAbout: 'ℹ️ About',
        
        // Settings tab
        intervalPanelTitle: '⏱️ Sound Interval Settings',
        soundIntervalPresets: 'Sound Playback Templates:',
        presetSilent: 'Silent',
        presetStandard: 'Standard (5 min)',
        presetShort: 'Short (3 min)',
        presetLong: 'Long (10 min)',
        presetExtended: 'Extended (15 min)',
        presetCustom: 'Custom',
        soundInterval: 'Sound Playback Interval (seconds):',
        updateInterval: 'Update Interval',
        soundPlayback: 'Sound Playback',
        selectSound: 'Select Sound:',
        soundGong: 'Singing Bowl - Gong',
        soundChimes: 'Bronze Bowl - Chimes',
        bgMode: 'Background Mode:',
        bgModeSingle: 'Static Image',
        bgModeRotation: 'Rotation',
        selectImage: 'Select Image:',
        imageChangeInterval: 'Image Change Interval (seconds):',
        updateBgInterval: 'Update',
        
        // Status messages
        statusPlaying: 'Playing...',
        statusError: 'Playback error',
        statusIntervalChanged: 'Interval changed to {0} seconds',
        statusSoundEnabled: 'Sound playback enabled',
        statusSoundDisabled: 'Sound playback disabled',
        statusSoundChanged: 'Sound changed to "{0}"',
        statusBgIntervalChanged: 'Background interval changed to {0} seconds',
        statusNextPlayIn: 'Next playback in {0} seconds...',
        
        // Start overlay
        startTitle: 'Welcome to Calm',
        startSubtitle: 'A Space for Relaxation and Focus',
        startButton: 'Start',
        
        // Loading
        loading: 'Loading...',
        
        // Donation tab
        donationTitle: 'Support the Project',
        donationSubtitle: 'Help us continue developing and improving Calm',
        donationDescription: 'If you enjoy using Calm and would like to support its development, you can donate using cryptocurrency:',
        donationDogecoin: 'Dogecoin',
        donationTron: 'Tron',
        donationToncoin: 'Toncoin',
        donationQrScan: 'Scan the QR code or copy the address below:',
        donationCopy: 'Copy Address',
        donationCopied: 'Address copied!',
        donationClose: 'Close',
        donationThanks: 'Thank you for your support! ❤️',
        
        // About tab
        aboutTitle: 'About Calm',
        aboutDescription: 'Calm is a simple web application designed to help you relax, meditate, and focus. With calming background images and soothing sounds, you can create your perfect environment for peace and concentration.',
        aboutFeatures: 'Features:',
        aboutFeature1: 'Automatic sound playback at customizable intervals',
        aboutFeature2: 'Choice of multiple calming sounds',
        aboutFeature3: 'Beautiful background images (static or rotating)',
        aboutFeature4: 'Simple and distraction-free interface',
        aboutFeature5: 'Fully customizable settings',
        aboutFeature6: 'Works offline after initial load',
        aboutUsage: 'How to Use:',
        aboutUsage1: 'Click "Start" to begin',
        aboutUsage2: 'Adjust sound interval and volume to your preference',
        aboutUsage3: 'Choose your preferred background image or enable rotation',
        aboutUsage4: 'Relax and enjoy your peaceful environment',
        aboutVersion: 'Version',
        aboutDeveloper: 'Developed with ❤️ by Calm Team',
        
        // Feedback form
        feedbackTitle: '💌 Feedback & Suggestions',
        feedbackDescription: 'Your feedback and suggestions are valuable to us',
        feedbackName: 'Name (optional)',
        feedbackEmail: 'Email (optional)',
        feedbackMessage: 'Share your suggestions or feedback...',
        feedbackSubmit: 'Send Feedback',
        feedbackNote: 'Your feedback will be sent to us privately',
        feedbackSuccess: 'Thank you! Your feedback has been sent successfully.',
        feedbackError: 'Sorry, there was an error sending your feedback. Please try again.',
        
        // Alerts
        alertInvalidNumber: 'Please enter a valid number',
        alertMinimum5Seconds: 'Please enter a valid number (minimum 5 seconds)',
        
        // Meta tags
        metaTitle: 'Calm - Space for Relaxation and Focus',
        metaDescription: 'Calm is a peaceful web environment with automatic playback of calming sounds and beautiful images for meditation and focus',
        metaKeywords: 'calm, meditation, focus, relaxation, calming sounds, nature images'
    },
    fa: {
        // عناوین تب‌ها
        tabSettings: '⚙️ تنظیمات',
        tabDonation: '💝 حمایت مالی',
        tabAbout: 'ℹ️ درباره',
        
        // تب تنظیمات
        intervalPanelTitle: '⏱️ تنظیمات بازه پخش صدا',
        soundIntervalPresets: 'الگوهای پخش صدا:',
        presetSilent: 'بدون صدا',
        presetStandard: 'استاندارد (۵ دقیقه)',
        presetShort: 'کوتاه (۳ دقیقه)',
        presetLong: 'بلند (۱۰ دقیقه)',
        presetExtended: 'طولانی (۱۵ دقیقه)',
        presetCustom: 'سفارشی',
        soundInterval: 'بازه زمانی پخش صدا (ثانیه):',
        updateInterval: 'تغییر بازه',
        soundPlayback: 'پخش صدا',
        selectSound: 'انتخاب صدا:',
        soundGong: 'کاسه آواز - گونگ',
        soundChimes: 'کاسه برنزی - زنگ',
        bgMode: 'حالت پس‌زمینه:',
        bgModeSingle: 'تصویر ثابت',
        bgModeRotation: 'چرخشی',
        selectImage: 'انتخاب تصویر:',
        imageChangeInterval: 'زمان تغییر تصویر (ثانیه):',
        updateBgInterval: 'تغییر زمان',
        
        // پیام‌های وضعیت
        statusPlaying: 'در حال پخش...',
        statusError: 'خطا در پخش صدا',
        statusIntervalChanged: 'بازه زمانی به {0} ثانیه تغییر یافت',
        statusSoundEnabled: 'پخش صدا فعال شد',
        statusSoundDisabled: 'پخش صدا غیرفعال شد',
        statusSoundChanged: 'صدا به "{0}" تغییر یافت',
        statusBgIntervalChanged: 'بازه تصویر پس‌زمینه به {0} ثانیه تغییر یافت',
        statusNextPlayIn: 'پخش بعدی در {0} ثانیه...',
        
        // Overlay شروع
        startTitle: 'به Calm خوش آمدید',
        startSubtitle: 'فضای آرامش و تمرکز',
        startButton: 'شروع',
        
        // بارگذاری
        loading: 'در حال بارگذاری...',
        
        // تب حمایت مالی
        donationTitle: 'حمایت از پروژه',
        donationSubtitle: 'به ما کمک کنید تا Calm را توسعه و بهبود دهیم',
        donationDescription: 'اگر از استفاده از Calm لذت می‌برید و مایل به حمایت از توسعه آن هستید، می‌توانید از طریق رمزارزها کمک مالی کنید:',
        donationDogecoin: 'Dogecoin',
        donationTron: 'Tron',
        donationToncoin: 'Toncoin',
        donationQrScan: 'کد QR را اسکن کنید یا آدرس زیر را کپی کنید:',
        donationCopy: 'کپی آدرس',
        donationCopied: 'آدرس کپی شد!',
        donationClose: 'بستن',
        donationThanks: 'از حمایت شما متشکریم! ❤️',
        
        // تب درباره
        aboutTitle: 'درباره Calm',
        aboutDescription: 'Calm یک برنامه وب ساده است که برای کمک به شما در آرامش، مدیتیشن و تمرکز طراحی شده است. با تصاویر پس‌زمینه آرامش‌بخش و صداهای دلنشین، می‌توانید محیط ایده‌آل خود را برای آرامش و تمرکز ایجاد کنید.',
        aboutFeatures: 'ویژگی‌ها:',
        aboutFeature1: 'پخش خودکار صدا در بازه‌های زمانی قابل تنظیم',
        aboutFeature2: 'امکان انتخاب از میان صداهای مختلف آرامش‌بخش',
        aboutFeature3: 'تصاویر پس‌زمینه زیبا (ثابت یا چرخشی)',
        aboutFeature4: 'رابط کاربری ساده و بدون حواس‌پرتی',
        aboutFeature5: 'تنظیمات کاملا قابل شخصی‌سازی',
        aboutFeature6: 'قابلیت کار آفلاین پس از بارگذاری اولیه',
        aboutUsage: 'نحوه استفاده:',
        aboutUsage1: 'روی "شروع" کلیک کنید',
        aboutUsage2: 'بازه زمانی و صدا را به دلخواه تنظیم کنید',
        aboutUsage3: 'تصویر پس‌زمینه دلخواه را انتخاب کنید یا حالت چرخشی را فعال کنید',
        aboutUsage4: 'آرام بگیرید و از محیط آرامش‌بخش خود لذت ببرید',
        aboutVersion: 'نسخه',
        aboutDeveloper: 'ساخته شده با ❤️ توسط تیم Calm',
        
        // فرم بازخورد
        feedbackTitle: '💌 پیشنهادات و بازخورد',
        feedbackDescription: 'نظرات و پیشنهادات شما برای ما ارزشمند است',
        feedbackName: 'نام (اختیاری)',
        feedbackEmail: 'ایمیل (اختیاری)',
        feedbackMessage: 'پیشنهاد یا نظر خود را بنویسید...',
        feedbackSubmit: 'ارسال پیشنهاد',
        feedbackNote: 'پیشنهادات شما به صورت خصوصی برای ما ارسال می‌شود',
        feedbackSuccess: 'متشکریم! پیشنهاد شما با موفقیت ارسال شد.',
        feedbackError: 'متاسفانه خطایی در ارسال پیشنهاد رخ داد. لطفا دوباره تلاش کنید.',
        
        // هشدارها
        alertInvalidNumber: 'لطفا یک عدد معتبر وارد کنید',
        alertMinimum5Seconds: 'لطفا یک عدد معتبر وارد کنید (حداقل 5 ثانیه)',
        
        // تگ‌های متا
        metaTitle: 'آرامش - فضای آرامش و تمرکز',
        metaDescription: 'وبسایت آرامش - محیطی آرام‌بخش با پخش خودکار صداهای آرامش‌دهنده و تصاویر زیبا برای مدیتیشن و تمرکز',
        metaKeywords: 'آرامش, مدیتیشن, تمرکز, صدای آرامش‌بخش, تصاویر طبیعت'
    }
};

// متغیرهای مربوط به پخش صدا
const sounds = {
    'singing-bowl-gong.mp3': 'assets/sounds/singing-bowl-gong.mp3',
    'chimes-bronze-singing-bowl-ding.mp3': 'assets/sounds/chimes-bronze-singing-bowl-ding.mp3'
};

// پیش‌فرض‌های بازه زمانی (به ثانیه)
const intervalPresets = {
    'silent': 0,          // بدون صدا
    'short': 180,         // 3 دقیقه
    'standard': 300,      // 5 دقیقه
    'long': 600,          // 10 دقیقه
    'extended': 900,      // 15 دقیقه
    'custom': null        // سفارشی
};

let currentSound = 'singing-bowl-gong.mp3';
let intervalTime = 300000; // پیش‌فرض 300 ثانیه (به میلی‌ثانیه)
let intervalId = null;
let countdown = intervalTime / 1000;
let countdownId = null;
let soundEnabled = true;
let currentPreset = 'standard'; // پیش‌فرض استاندارد

// متغیرهای مربوط به تصاویر پس‌زمینه
const images = ['00', '01', '02', '03', '04'];

// انتخاب اندازه‌ی مناسب تصویر: نسخه‌ی کوچک‌تر برای صفحه‌نمایش‌های کوچک
function imageUrl(name) {
    const pixelWidth = window.screen.width * (window.devicePixelRatio || 1);
    const suffix = pixelWidth <= 1400 ? '-m' : '';
    return `assets/images/${name}${suffix}.webp`;
}
let currentImageIndex = Math.floor(Math.random() * images.length); // شروع با عکس تصادفی
let bgIntervalTime = 60000; // پیش‌فرض 60 ثانیه
let bgIntervalId = null;
let bgMode = 'single'; // 'single' یا 'rotation'
let imagesLoaded = new Set(); // ذخیره تصاویری که لود شده‌اند

// ============================================
// توابع مدیریت زبان
// ============================================

// تابع تغییر زبان
function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('calm-language', lang);
    updateLangToggle();
    
    // تغییر جهت متن
    document.documentElement.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    
    // به‌روزرسانی تمام متن‌ها
    updateAllTexts();
    
    // به‌روزرسانی meta tags
    updateMetaTags();
    
    // اطلاع به بخش‌هایی که متن پویا دارند
    document.dispatchEvent(new Event('calm:languagechange'));
}

// دکمه‌ی تغییر زبان (بالا سمت راست): زبان مقصد را نشان می‌دهد
const langToggle = document.getElementById('langToggle');
const langToggleLabel = document.getElementById('langToggleLabel');

function updateLangToggle() {
    const target = currentLang === 'fa' ? 'en' : 'fa';
    langToggleLabel.textContent = target === 'en' ? 'EN' : 'فا';
    const label = target === 'en' ? 'Switch to English' : 'تغییر به فارسی';
    langToggle.setAttribute('aria-label', label);
    langToggle.title = label;
}

langToggle.addEventListener('click', () => {
    changeLanguage(currentLang === 'fa' ? 'en' : 'fa');
});

// تابع به‌روزرسانی تمام متن‌ها
function updateAllTexts() {
    const t = translations[currentLang];
    
    // به‌روزرسانی عناصر با data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (t[key]) {
            element.textContent = t[key];
        }
    });
    
    // به‌روزرسانی عناصر با data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (t[key]) {
            element.placeholder = t[key];
        }
    });
    
    // به‌روزرسانی options در selectها
    if (soundSelect2) {
        soundSelect2.options[0].text = t.soundGong;
        soundSelect2.options[1].text = t.soundChimes;
    }
    
    const bgModeSelect = document.getElementById('bgMode');
    if (bgModeSelect) {
        bgModeSelect.options[0].text = t.bgModeSingle;
        bgModeSelect.options[1].text = t.bgModeRotation;
    }
}

// تابع به‌روزرسانی meta tags
function updateMetaTags() {
    const t = translations[currentLang];
    
    // به‌روزرسانی title
    document.title = t.metaTitle;
    
    // به‌روزرسانی meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', t.metaDescription);
    }
    
    // به‌روزرسانی meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
        metaKeywords.setAttribute('content', t.metaKeywords);
    }
    
    // به‌روزرسانی Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
        ogTitle.setAttribute('content', t.metaTitle);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
        ogDescription.setAttribute('content', t.metaDescription);
    }
    
    // به‌روزرسانی Twitter Card tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
        twitterTitle.setAttribute('content', t.metaTitle);
    }
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
        twitterDescription.setAttribute('content', t.metaDescription);
    }
}

// بارگذاری زبان ذخیره شده
function loadSavedLanguage() {
    const savedLang = localStorage.getItem('calm-language') || 'fa'; // پیش‌فرض فارسی
    changeLanguage(savedLang);
}

// بارگذاری پیش‌فرض ذخیره شده
function loadSavedPreset() {
    const savedPreset = localStorage.getItem('calm-preset') || 'standard'; // پیش‌فرض استاندارد
    
    // اعمال پیش‌فرض بدون فعال‌سازی رویداد change
    currentPreset = savedPreset;
    
    // به‌روزرسانی کلاس active برای دکمه‌ها
    presetButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.preset === savedPreset) {
            btn.classList.add('active');
        }
    });
    
    // اعمال تنظیمات بر اساس پیش‌فرض
    if (savedPreset === 'silent') {
        if (soundToggle2) soundToggle2.checked = false;
        soundEnabled = false;
        if (customIntervalRow2) customIntervalRow2.style.display = 'none';
    } else if (savedPreset === 'custom') {
        // نمایش فیلد سفارشی
        if (customIntervalRow2) customIntervalRow2.style.display = 'flex';
        // بارگذاری مقدار سفارشی از localStorage اگر وجود دارد
        const savedCustomInterval = localStorage.getItem('calm-custom-interval');
        if (savedCustomInterval) {
            if (intervalInput2) intervalInput2.value = savedCustomInterval;
            intervalTime = parseInt(savedCustomInterval) * 1000;
        }
    } else {
        // پیش‌فرض‌های استاندارد
        if (customIntervalRow2) customIntervalRow2.style.display = 'none';
        const intervalSeconds = intervalPresets[savedPreset];
        if (intervalInput2) intervalInput2.value = intervalSeconds;
        intervalTime = intervalSeconds * 1000;
    }
    
    countdown = intervalTime / 1000;
}


// ============================================
// توابع مدیریت تصاویر پس‌زمینه
// ============================================

// تابع preload تصویر
function preloadImage(imageName) {
    return new Promise((resolve, reject) => {
        if (imagesLoaded.has(imageName)) {
            resolve(imageName);
            return;
        }
        
        const img = new Image();
        img.onload = () => {
            imagesLoaded.add(imageName);
            resolve(imageName);
        };
        img.onerror = reject;
        img.src = imageUrl(imageName);
    });
}

// تابع تنظیم پس‌زمینه
function setBackground(index) {
    currentImageIndex = index;
    const imageName = images[currentImageIndex];
    
    // preload تصویر قبل از نمایش
    preloadImage(imageName).then(() => {
        backgroundImage.style.backgroundImage = `url('${imageUrl(imageName)}')`;
        
        preloadNextImage();
        
        // به‌روزرسانی thumbnail فعال
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        const activeThumbnail = document.querySelector(`.thumbnail[data-index="${index}"]`);
        if (activeThumbnail) {
            activeThumbnail.classList.add('active');
        }
    });
}

// preload فقط تصویر بعدی (و فقط در حالت چرخشی)
function preloadNextImage() {
    if (bgMode !== 'rotation') return;
    const next = images[(currentImageIndex + 1) % images.length];
    preloadImage(next).catch(() => {});
}

// تابع تغییر به عکس بعدی
function nextBackground() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    setBackground(currentImageIndex);
}

// تابع شروع چرخش پس‌زمینه
function startBackgroundRotation() {
    if (bgIntervalId) {
        clearInterval(bgIntervalId);
    }
    
    if (bgMode === 'rotation') {
        bgIntervalId = setInterval(() => {
            nextBackground();
        }, bgIntervalTime);
    }
}

// تابع توقف چرخش پس‌زمینه
function stopBackgroundRotation() {
    if (bgIntervalId) {
        clearInterval(bgIntervalId);
        bgIntervalId = null;
    }
}

// ============================================
// توابع مدیریت پخش صدا
// ============================================

// تابع پخش صدا
function playSound() {
    if (!soundEnabled) {
        // اگر صدا غیرفعال است، نباید شمارنده شروع شود
        return;
    }
    
    const t = translations[currentLang];
    
    // تنظیم فایل صوتی انتخاب شده
    audio.src = sounds[currentSound];
    audio.currentTime = 0;
    audio.play()
        .then(() => {
            console.log('صدا با موفقیت پخش شد');
            updateStatus2(t.statusPlaying);
            setTimeout(() => {
                startCountdown();
            }, 1000);
        })
        .catch(error => {
            console.error('خطا در پخش صدا:', error);
            updateStatus2(t.statusError);
        });
}

// تابع به‌روزرسانی وضعیت
function updateStatus2(message) {
    if (statusSpan2) {
        statusSpan2.textContent = message;
    }
}

// تابع شمارش معکوس
function startCountdown() {
    // پاک کردن شمارش معکوس قبلی
    if (countdownId) {
        clearInterval(countdownId);
    }
    
    countdown = intervalTime / 1000;
    const t = translations[currentLang];
    
    countdownId = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            // فقط اگر soundEnabled فعال باشد، شمارش معکوس نمایش داده شود
            if (soundEnabled) {
                const message = t.statusNextPlayIn.replace('{0}', countdown);
                updateStatus2(message);
            }
        } else {
            clearInterval(countdownId);
        }
    }, 1000);
}

// تابع شروع تایمر
function startTimer() {
    // پاک کردن تایمر قبلی
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    if (countdownId) {
        clearInterval(countdownId);
        countdownId = null;
    }

    // در حالت بدون صدا هیچ تایمری ساخته نشود
    if (!soundEnabled || intervalTime <= 0) {
        return;
    }

    // پخش فوری اولین صدا
    playSound();
    
    // تنظیم تایمر برای پخش‌های بعدی
    intervalId = setInterval(() => {
        playSound();
    }, intervalTime);
}

// ============================================
// توابع مدیریت پیش‌فرض‌های بازه زمانی
// ============================================

// تابع انتخاب پیش‌فرض
function selectPreset(preset) {
    currentPreset = preset;
    
    // به‌روزرسانی کلاس active برای دکمه‌ها
    presetButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.preset === preset) {
            btn.classList.add('active');
        }
    });
    
    // ذخیره در localStorage
    localStorage.setItem('calm-preset', preset);
    
    // اعمال تنظیمات بازه زمانی
    if (preset === 'silent') {
        // حالت بدون صدا
        soundToggle2.checked = false;
        soundToggle2.dispatchEvent(new Event('change'));
        customIntervalRow2.style.display = 'none';
    } else if (preset === 'custom') {
        // نمایش فیلد سفارشی
        customIntervalRow2.style.display = 'flex';
        // ذخیره مقدار سفارشی
        localStorage.setItem('calm-custom-interval', intervalInput2.value);
        // بازگشت به وضعیت قبلی soundToggle
        if (!soundEnabled && intervalInput2.value) {
            soundToggle2.checked = true;
            soundToggle2.dispatchEvent(new Event('change'));
        }
    } else {
        // پیش‌فرض‌های استاندارد
        customIntervalRow2.style.display = 'none';
        const intervalSeconds = intervalPresets[preset];
        intervalInput2.value = intervalSeconds;
        intervalTime = intervalSeconds * 1000;
        
        // فعال کردن صدا اگر غیرفعال بود
        if (!soundEnabled) {
            soundToggle2.checked = true;
            soundToggle2.dispatchEvent(new Event('change'));
        } else {
            // شروع مجدد تایمر با بازه جدید
            startTimer();
        }
        
        const t = translations[currentLang];
        updateStatus2(t.statusIntervalChanged.replace('{0}', intervalSeconds));
    }
}

// رویداد کلیک برای دکمه‌های پیش‌فرض
presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        selectPreset(btn.dataset.preset);
    });
});

// ============================================
// رویدادهای تغییر تنظیمات
// ============================================

// رویداد کلیک دکمه تغییر بازه در پنل جدید
updateBtn2.addEventListener('click', () => {
    const newInterval = parseInt(intervalInput2.value);
    const t = translations[currentLang];
    
    if (newInterval && newInterval > 0) {
        intervalTime = newInterval * 1000;
        selectPreset('custom');
        updateStatus2(t.statusIntervalChanged.replace('{0}', newInterval));
        startTimer();
    } else {
        alert(t.alertInvalidNumber);
    }
});

// رویداد Enter در فیلد ورودی
intervalInput2.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        updateBtn2.click();
    }
});

// رویداد تغییر حالت پس‌زمینه
bgModeSelect.addEventListener('change', (e) => {
    applyBgMode(e.target.value);
    localStorage.setItem('calm-bg-mode', bgMode);
});

function applyBgMode(mode) {
    bgMode = mode;
    bgModeSelect.value = mode;

    if (bgMode === 'rotation') {
        bgIntervalRow.style.display = 'flex';
        imageSelectRow.style.display = 'none';
        startBackgroundRotation();
    } else {
        bgIntervalRow.style.display = 'none';
        imageSelectRow.style.display = 'flex';
        stopBackgroundRotation();
    }
}

// رویداد انتخاب عکس در حالت ثابت
thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
        const selectedIndex = parseInt(thumbnail.dataset.index);
        setBackground(selectedIndex);
        localStorage.setItem('calm-image', selectedIndex);
    });
});

// رویداد تغییر زمان چرخش پس‌زمینه
updateBgBtn.addEventListener('click', () => {
    const newInterval = parseInt(bgIntervalInput.value);
    const t = translations[currentLang];
    
    if (newInterval && newInterval >= 5) {
        bgIntervalTime = newInterval * 1000;
        localStorage.setItem('calm-bg-interval', newInterval);
        if (bgMode === 'rotation') {
            startBackgroundRotation();
        }
        updateStatus2(t.statusBgIntervalChanged.replace('{0}', newInterval));
    } else {
        alert(t.alertMinimum5Seconds);
    }
});

// رویداد Enter در فیلد بازه پس‌زمینه
bgIntervalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        updateBgBtn.click();
    }
});

// رویداد تغییر وضعیت پخش صدا در پنل جدید
soundToggle2.addEventListener('change', (e) => {
    soundEnabled = e.target.checked;
    const t = translations[currentLang];
    
    if (soundEnabled) {
        updateStatus2(t.statusSoundEnabled);
        if (!intervalId) {
            startTimer();
        }
    } else {
        audio.pause();
        audio.currentTime = 0;
        
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        
        if (countdownId) {
            clearInterval(countdownId);
            countdownId = null;
        }
        
        updateStatus2(t.statusSoundDisabled);
    }
});

// رویداد تغییر انتخاب صدا در پنل جدید
soundSelect2.addEventListener('change', (e) => {
    currentSound = e.target.value;
    localStorage.setItem('calm-sound', currentSound);
    const t = translations[currentLang];
    updateStatus2(t.statusSoundChanged.replace('{0}', e.target.options[e.target.selectedIndex].text));
});

// رویداد پایان پخش صدا
audio.addEventListener('ended', () => {
    console.log('پخش صدا تمام شد');
});

// رویداد کلیک دکمه شروع
startBtn.addEventListener('click', () => {
    // مخفی کردن overlay
    startOverlay.classList.add('hidden');
    
    // شروع تایمر
    startTimer();
});

// ============================================
// مدیریت بارگذاری تصاویر
// ============================================

// تابع lazy loading برای thumbnails
function lazyLoadThumbnails() {
    const lazyThumbnails = document.querySelectorAll('.lazy-thumbnail');
    
    lazyThumbnails.forEach((img, index) => {
        const src = img.dataset.src;
        if (src && !img.src) {
            // بارگذاری با تاخیر برای بهینه‌سازی
            setTimeout(() => {
                img.src = src;
                img.removeAttribute('data-src');
                img.classList.remove('lazy-thumbnail');
            }, index * 100); // 100ms فاصله بین هر تصویر
        }
    });
}

// رویداد باز شدن پنل تنظیمات - بارگذاری thumbnails
settingsIcon.addEventListener('click', () => {
    settingsOverlay.classList.add('show');
    // بارگذاری thumbnails زمانی که پنل باز می‌شود
    lazyLoadThumbnails();
});

// رویداد باز کردن پنل بازه زمانی
intervalIcon.addEventListener('click', () => {
    intervalOverlay.classList.add('show');
});

// رویداد بستن پنل بازه زمانی
closeIntervalPanel.addEventListener('click', () => {
    intervalOverlay.classList.remove('show');
});

// بستن پنل با کلیک روی overlay
intervalOverlay.addEventListener('click', (e) => {
    if (e.target === intervalOverlay) {
        intervalOverlay.classList.remove('show');
    }
});

// تابع مخفی کردن loading overlay
function hideLoadingOverlay() {
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
}

// بارگذاری سایر تنظیمات ذخیره‌شده (صدا، تصویر، حالت پس‌زمینه)
function loadSavedSettings() {
    try {
        const savedSound = localStorage.getItem('calm-sound');
        if (savedSound && sounds[savedSound]) {
            currentSound = savedSound;
            soundSelect2.value = savedSound;
        }

        const savedImage = parseInt(localStorage.getItem('calm-image'));
        if (!isNaN(savedImage) && savedImage >= 0 && savedImage < images.length) {
            currentImageIndex = savedImage;
        }

        const savedBgInterval = parseInt(localStorage.getItem('calm-bg-interval'));
        if (savedBgInterval >= 5) {
            bgIntervalTime = savedBgInterval * 1000;
            bgIntervalInput.value = savedBgInterval;
        }

        const savedMode = localStorage.getItem('calm-bg-mode');
        if (savedMode === 'rotation' || savedMode === 'single') {
            applyBgMode(savedMode);
        }
    } catch (err) {
        console.warn('Could not load saved settings:', err);
    }
}

// بارگذاری اولیه: فقط تصویر فعلی
async function initializeApp() {
    try {
        console.log('شروع بارگذاری...');
        
        // بارگذاری زبان ذخیره شده
        loadSavedLanguage();
        console.log('زبان بارگذاری شد');
        
        // بارگذاری پیش‌فرض صدا ذخیره شده
        loadSavedPreset();
        loadSavedSettings();
        
        // بارگذاری تصویر اولیه
        console.log('در حال بارگذاری تصویر:', images[currentImageIndex]);
        await preloadImage(images[currentImageIndex]);
        console.log('تصویر بارگذاری شد');
        
        // تنظیم پس‌زمینه
        if (backgroundImage) {
            backgroundImage.style.backgroundImage = `url('${imageUrl(images[currentImageIndex])}')`;
            console.log('پس‌زمینه تنظیم شد');
        } else {
            console.error('backgroundImage element not found!');
        }
        
        // به‌روزرسانی thumbnail فعال
        const activeThumbnail = document.querySelector(`.thumbnail[data-index="${currentImageIndex}"]`);
        if (activeThumbnail) {
            activeThumbnail.classList.add('active');
        }
        
        // مخفی کردن loading overlay
        hideLoadingOverlay();
        console.log('بارگذاری کامل شد');
        
        // در حالت چرخشی تصویر بعدی از قبل بارگذاری شود
        preloadNextImage();
    } catch (error) {
        console.error('خطا در بارگذاری تصویر:', error);
        hideLoadingOverlay();
    }
}

// اجرای تابع مقداردهی اولیه
initializeApp();

// رویداد بستن پنل تنظیمات
closePanel.addEventListener('click', () => {
    settingsOverlay.classList.remove('show');
});

// بستن پنل با کلیک روی overlay
settingsOverlay.addEventListener('click', (e) => {
    if (e.target === settingsOverlay) {
        settingsOverlay.classList.remove('show');
    }
});

// ============================================
// مدیریت تب‌ها
// ============================================

const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;
        
        // حذف active از همه تب‌ها
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // فعال کردن تب انتخاب شده
        button.classList.add('active');
        document.getElementById(`${targetTab}-tab`).classList.add('active');
    });
});

// جلوگیری از توقف تایمر هنگام تغییر تب
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !intervalId && soundEnabled && startOverlay.classList.contains('hidden')) {
        startTimer();
    }
});

// ============================================
// مدیریت بخش کمک مالی
// ============================================

const cryptoData = {
    doge: {
        name: 'Dogecoin',
        address: 'DRJ5C5DLDpJL4J1goXs2bqD5LBmeNiqGah',
        qr: 'assets/crypto-qr/doge-qr.jpeg'
    },
    trx: {
        name: 'Tron',
        address: 'TXaadj5wJPY7tWiBfugxHXQUfRNVoGaKVq',
        qr: 'assets/crypto-qr/trx-qr.jpeg'
    },
    ton: {
        name: 'Toncoin',
        address: 'UQCgLRDNp1zO9khx86Y-sdoI_x0JZ3kk9QdAs8tdtmNrXPVP',
        qr: 'assets/crypto-qr/ton-qr.jpeg'
    }
};

const cryptoButtons = document.querySelectorAll('.crypto-btn');
const cryptoDetails = document.getElementById('cryptoDetails');
const cryptoQR = document.getElementById('cryptoQR');
const cryptoAddress = document.getElementById('cryptoAddress');
const copyBtn = document.getElementById('copyBtn');
const closeCrypto = document.getElementById('closeCrypto');
const copyFeedback = document.getElementById('copyFeedback');

// نمایش جزئیات رمزارز
cryptoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const crypto = btn.dataset.crypto;
        const data = cryptoData[crypto];
        
        cryptoQR.src = data.qr;
        cryptoQR.alt = `${data.name} QR Code`;
        cryptoAddress.value = data.address;
        cryptoDetails.style.display = 'block';
        
        // اسکرول به جزئیات
        cryptoDetails.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});

// بستن جزئیات
closeCrypto.addEventListener('click', () => {
    cryptoDetails.style.display = 'none';
});

// کپی آدرس
copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(cryptoAddress.value);
        copyFeedback.classList.add('show');
        
        setTimeout(() => {
            copyFeedback.classList.remove('show');
        }, 2000);
    } catch (err) {
        // Fallback برای مرورگرهای قدیمی
        cryptoAddress.select();
        document.execCommand('copy');
        copyFeedback.classList.add('show');
        
        setTimeout(() => {
            copyFeedback.classList.remove('show');
        }, 2000);
    }
});

// ============================================
// مدیریت پخش‌کننده صداهای پس‌زمینه
// ============================================

// عناصر DOM
const bgSoundsIcon = document.getElementById('bgSoundsIcon');
const bgSoundsOverlay = document.getElementById('bgSoundsOverlay');
const bgSoundsPanel = document.getElementById('bgSoundsPanel');
const closeBgSoundsPanel = document.getElementById('closeBgSoundsPanel');

// آبجکت برای نگهداری اطلاعات صداها
const bgSounds = {
    Fire: { audio: null, playing: false },
    Jungle: { audio: null, playing: false },
    River: { audio: null, playing: false },
    Sea: { audio: null, playing: false }
};

// ترجمه‌های نام صداها
translations.en.bgSoundsTitle = '🎵 Background Sounds';
translations.en.bgSoundsSubtitle = 'Choose nature sounds for relaxation';
translations.en.soundFire = 'Fire';
translations.en.soundJungle = 'Jungle';
translations.en.soundRiver = 'River';
translations.en.soundSea = 'Sea';

translations.fa.bgSoundsTitle = '🎵 صداهای پس‌زمینه';
translations.fa.bgSoundsSubtitle = 'صداهای طبیعت را برای آرامش انتخاب کنید';
translations.fa.soundFire = 'آتش';
translations.fa.soundJungle = 'جنگل';
translations.fa.soundRiver = 'رودخانه';
translations.fa.soundSea = 'دریا';

// حجم ذخیره‌شده هر صدا (۰ تا ۱)
function getSavedVolume(soundName) {
    const v = parseFloat(localStorage.getItem(`calm-volume-${soundName}`));
    return (!isNaN(v) && v >= 0 && v <= 1) ? v : 0.5;
}

// اعمال حجم ذخیره‌شده روی اسلایدرها
document.querySelectorAll('.volume-slider').forEach(slider => {
    slider.value = Math.round(getSavedVolume(slider.dataset.sound) * 100);
});

// تابع بارگذاری تنبل صداها - فقط زمانی که نیاز است
function loadBgSound(soundName) {
    if (!bgSounds[soundName].audio) {
        const bgAudio = new Audio(`assets/bg-sounds/${soundName}.mp3`);
        bgAudio.loop = true; // حلقه‌ای شدن صدا
        bgAudio.volume = getSavedVolume(soundName); // حجم ذخیره‌شده (پیش‌فرض 50%)
        bgSounds[soundName].audio = bgAudio;
        console.log(`صدای ${soundName} بارگذاری شد`);
    }
    return bgSounds[soundName].audio;
}

// باز کردن overlay
bgSoundsIcon.addEventListener('click', () => {
    bgSoundsOverlay.classList.add('show');
});

// بستن overlay با دکمه بستن
closeBgSoundsPanel.addEventListener('click', () => {
    bgSoundsOverlay.classList.remove('show');
});

// بستن overlay با کلیک روی پس‌زمینه
bgSoundsOverlay.addEventListener('click', (e) => {
    if (e.target === bgSoundsOverlay) {
        bgSoundsOverlay.classList.remove('show');
    }
});

// مدیریت دکمه‌های پخش/پاز
document.querySelectorAll('.sound-card').forEach(card => {
    card.addEventListener('click', function(e) {
        // اگر کلیک روی volume slider بود، از پخش/توقف جلوگیری کن
        if (e.target.closest('.volume-slider, .offline-btn')) {
            return;
        }
        
        const soundName = this.dataset.sound;
        const soundData = bgSounds[soundName];
        
        // بارگذاری تنبل صدا در صورت نیاز
        const audio = loadBgSound(soundName);
        
        if (soundData.playing) {
            // توقف صدا
            audio.pause();
            soundData.playing = false;
            this.classList.remove('playing');
            this.setAttribute('aria-pressed', 'false');
        } else {
            // پخش صدا
            audio.play().catch(err => {
                console.error(`Error playing ${soundName}:`, err);
            });
            soundData.playing = true;
            this.classList.add('playing');
            this.setAttribute('aria-pressed', 'true');
        }
    });

    // پشتیبانی از کیبورد (Enter / Space)
    card.addEventListener('keydown', function(e) {
        if (e.target !== this) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
});

// بستن پنل‌ها با Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        settingsOverlay.classList.remove('show');
        intervalOverlay.classList.remove('show');
        bgSoundsOverlay.classList.remove('show');
    }
});

// مدیریت اسلایدر حجم صدا
document.querySelectorAll('.volume-slider').forEach(slider => {
    slider.addEventListener('input', function() {
        const soundName = this.dataset.sound;
        const soundData = bgSounds[soundName];
        localStorage.setItem(`calm-volume-${soundName}`, this.value / 100);

        // تنظیم حجم صدا - اگر صدا بارگذاری شده باشد
        if (soundData.audio) {
            soundData.audio.volume = this.value / 100;
        }
    });
});

// حذف مقداردهی اولیه - صداها به صورت lazy load بارگذاری می‌شوند

// ============================================
// ذخیره‌ی صداهای پس‌زمینه برای استفاده‌ی آفلاین
// ============================================

translations.en.offlineDownload = 'Save for offline use';
translations.en.offlineSaving = 'Saving... {0}%';
translations.en.offlineSaved = 'Saved offline - tap to remove';
translations.en.offlineError = 'Download failed - tap to retry';
translations.fa.offlineDownload = 'ذخیره برای استفاده آفلاین';
translations.fa.offlineSaving = 'در حال ذخیره... {0}٪';
translations.fa.offlineSaved = 'ذخیره شده - برای حذف کلیک کنید';
translations.fa.offlineError = 'دانلود ناموفق بود - برای تلاش مجدد کلیک کنید';

const OFFLINE_CACHE = 'calm-offline-sounds'; // باید با sw.js یکی باشد
const offlineSupported = 'caches' in window && 'serviceWorker' in navigator;
const offlineButtons = {}; // soundName -> { button, state, progress }

const OFFLINE_ICONS = {
    idle: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"></path><path d="m7 11 5 5 5-5"></path><path d="M5 21h14"></path></svg>',
    saved: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>',
    error: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 8v5"></path><path d="M12 17h.01"></path><circle cx="12" cy="12" r="10"></circle></svg>'
};

function bgSoundUrl(soundName) {
    return new URL(`assets/bg-sounds/${soundName}.mp3`, document.baseURI).href;
}

async function isSoundSavedOffline(soundName) {
    try {
        const cache = await caches.open(OFFLINE_CACHE);
        return !!(await cache.match(bgSoundUrl(soundName)));
    } catch (err) {
        return false;
    }
}

async function saveSoundOffline(soundName, onProgress) {
    const url = bgSoundUrl(soundName);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const total = parseInt(res.headers.get('Content-Length'), 10) || 0;
    const reader = res.body.getReader();
    const chunks = [];
    let received = 0;
    
    for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        if (total) onProgress(received / total);
    }
    
    const cache = await caches.open(OFFLINE_CACHE);
    await cache.put(url, new Response(new Blob(chunks, { type: 'audio/mpeg' }), {
        status: 200,
        headers: { 'Content-Type': 'audio/mpeg' }
    }));
    
    // درخواست ذخیره‌سازی پایدار تا مرورگر فایل‌ها را خودسرانه پاک نکند
    if (navigator.storage && navigator.storage.persist) {
        navigator.storage.persist().catch(() => {});
    }
}

async function removeSoundOffline(soundName) {
    const cache = await caches.open(OFFLINE_CACHE);
    await cache.delete(bgSoundUrl(soundName));
}

function renderOfflineButton(soundName) {
    const item = offlineButtons[soundName];
    const t = translations[currentLang];
    let label;
    let html;
    
    if (item.state === 'loading') {
        const percent = Math.round(item.progress * 100);
        label = t.offlineSaving.replace('{0}', percent);
        html = `<span class="offline-percent">${percent}%</span>`;
    } else if (item.state === 'saved') {
        label = t.offlineSaved;
        html = OFFLINE_ICONS.saved;
    } else if (item.state === 'error') {
        label = t.offlineError;
        html = OFFLINE_ICONS.error;
    } else {
        label = t.offlineDownload;
        html = OFFLINE_ICONS.idle;
    }
    
    item.button.innerHTML = html;
    item.button.title = label;
    item.button.setAttribute('aria-label', label);
    item.button.dataset.state = item.state;
    item.button.disabled = item.state === 'loading';
}

function setupOfflineButtons() {
    if (!offlineSupported) return;
    
    document.querySelectorAll('.sound-card').forEach(card => {
        const soundName = card.dataset.sound;
        const control = card.querySelector('.volume-control');
        if (!control) return;
        
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'offline-btn';
        control.appendChild(button);
        
        offlineButtons[soundName] = { button, state: 'idle', progress: 0 };
        renderOfflineButton(soundName);
        
        isSoundSavedOffline(soundName).then(saved => {
            if (saved) {
                offlineButtons[soundName].state = 'saved';
                renderOfflineButton(soundName);
            }
        });
        
        button.addEventListener('click', async (e) => {
            e.stopPropagation();
            const item = offlineButtons[soundName];
            
            if (item.state === 'saved') {
                await removeSoundOffline(soundName);
                item.state = 'idle';
                renderOfflineButton(soundName);
                return;
            }
            
            item.state = 'loading';
            item.progress = 0;
            renderOfflineButton(soundName);
            
            try {
                await saveSoundOffline(soundName, (p) => {
                    item.progress = p;
                    renderOfflineButton(soundName);
                });
                item.state = 'saved';
            } catch (err) {
                console.error(`Offline save failed for ${soundName}:`, err);
                item.state = 'error';
            }
            renderOfflineButton(soundName);
        });
        
        // جلوگیری از فعال شدن کارت با کیبورد روی دکمه
        button.addEventListener('keydown', (e) => e.stopPropagation());
    });
}

document.addEventListener('calm:languagechange', () => {
    Object.keys(offlineButtons).forEach(renderOfflineButton);
});

setupOfflineButtons();

// ============================================
// PWA: ثبت Service Worker (نیازمند HTTPS یا localhost)
// ============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(err => {
            console.warn('Service worker registration failed:', err);
        });
    });
}
