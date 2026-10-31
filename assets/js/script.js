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

// ثبت رویداد آمار (فقط اگر کاربر موافقت کرده باشد؛ در غیر این صورت هیچ کاری نمی‌کند)
function track(name, params) {
    if (window.calmAnalytics) {
        window.calmAnalytics.track(name, params);
    }
}

// متغیر زبان
let currentLang = 'fa'; // پیش‌فرض فارسی

// ترجمه‌های برنامه
const translations = {
    en: {
        // Tab titles
        tabSettings: 'Settings',
        tabDonation: 'Support',
        tabAbout: 'About',
        
        // Settings tab
        intervalPanelTitle: 'Sound Interval Settings',
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
        chimeVolume: 'Chime Volume:',
        soundGong: 'Singing Bowl - Gong',
        soundChimes: 'Bronze Bowl - Chimes',
        bgMode: 'Background Mode:',
        bgModeSingle: 'Static Image',
        bgModeRotation: 'Rotation',
        bgModeKaleidoscope: 'Kaleidoscope',
        bgModeKaleidoscopeSoft: 'Soft kaleidoscope',
        bgModeGalaxy: 'Galaxy',
        bgModeOcean: 'Ocean',
        bgModeMerger: 'Colliding galaxies',
        bgModeCandle: 'Oil lamp',
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
        donationGram: 'Gram',
        donationQrScan: 'Scan the QR code or copy the address below:',
        donationCopy: 'Copy Address',
        donationCopied: 'Address copied! Thank you for your support 💜',
        donationClose: 'Close',
        donationThanks: 'Thank you for your support!',
        donationNetworkWarn: 'Send only on the {0} network. Funds sent on another network may be lost.',
        donationTapQr: 'Tap the QR code to copy the address',
        
        // About tab
        aboutTitle: 'About Calm',
        aboutDescription: '<strong>Calm</strong> is a peaceful web space for mindful breathing, meditation and focus. Guided breathing exercises and timed meditation, with calming images and soothing sounds, without distractions.',
        aboutFeatures: 'Features',
        aboutFeatureBreath: '<strong>Breathing exercises:</strong> eight methods including Box, 4-7-8 and the physiological sigh, with a guided inhale/exhale circle, your choice of rounds and your practice stats',
        aboutFeatureMeditation: '<strong>Timed meditation:</strong> from 10 minutes to several hours, with a bell at the start and end and a background sound of your choice',
        aboutFeature1: '<strong>Beautiful images:</strong> a collection of calming images, fixed or rotating automatically',
        aboutFeatureKaleido: '<strong>Kaleidoscope:</strong> a slow, moving kaleidoscope as your background instead of an image',
        aboutFeature2: '<strong>Singing bowl:</strong> a gentle chime at intervals you choose, or silence',
        aboutFeature3: '<strong>Nature sounds and music:</strong> fire, jungle, river and sea, plus calm 432 Hz music, each with its own volume',
        aboutFeature4: '<strong>Your settings, remembered:</strong> language, background, sounds and volumes',
        aboutFeature5: '<strong>Simple interface:</strong> no distractions, full focus',
        aboutFeature6: '<strong>Installable:</strong> add it to your home screen; the interface and images work offline',
        aboutUsage: 'How to use',
        aboutUsage1: 'Click "Start" to begin',
        aboutUsage2: 'For quick calm, open "Breathing exercise" from the corner buttons, pick a method and follow the circle',
        aboutUsage3: 'To sit in silence, open "Meditation" and choose a length and a sound',
        aboutUsage4: 'Adjust the background (image or kaleidoscope), nature sounds and chime interval to your taste',
        aboutVersion: 'Version',
        aboutDeveloper: 'Developed by Calm Team',
        
        // Feedback form
        blogTitle: 'Blog',
        blogDescription: 'Ready-made meditations and short guides on meditation, breathing and calm are on the <a href="/en/blog/">Calm blog</a>.',
        creditsTitle: 'Credits',
        creditsOilLamp: 'Oil lamp background photo: <a href="https://commons.wikimedia.org/wiki/File:Diya,_an_oil_lamp.jpg" target="_blank" rel="noopener">siddarth varanasi</a>, <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener">CC BY 2.0</a>, via Wikimedia Commons (cropped, original flame replaced with an animated one).',
        feedbackTitle: 'Feedback & Suggestions',
        feedbackDescription: 'Your feedback and suggestions are valuable to us',
        feedbackName: 'Name (optional)',
        feedbackEmail: 'Email (optional)',
        feedbackMessage: 'Share your suggestions or feedback...',
        feedbackSubmit: 'Send Feedback',
        feedbackNote: 'Your feedback will be sent to us privately',
        feedbackSuccess: 'Thank you! Your feedback has been sent successfully.',
        feedbackError: 'Sorry, there was an error sending your feedback. Please try again.',
        
        // Accessibility labels
        ariaClose: 'Close',
        ariaSoundInterval: 'Sound interval settings',
        ariaBgSounds: 'Background sounds',
        ariaSettings: 'Settings',
        ariaMenu: 'Menu',
        ariaFullscreen: 'Enter fullscreen',
        ariaExitFullscreen: 'Exit fullscreen',
        ariaDonate: 'Support the project',
        ariaVolume: '{0} volume',
        imageAlt: 'Background image {0}',
        qrAlt: '{0} QR code',
        
        // Install
        installApp: 'Install app',
        installTitle: 'Install on your device',
        installDesc: 'Quicker access from your home screen, and offline use',
        settingsSectionBackground: 'Background',
        settingsSectionApp: 'App & privacy',
        
        // What's new + updates
        whatsNewTitle: "What's new",
        whatsNewTag: 'New',
        wnBlogTitle: 'Calm blog',
        wnBlogBody: 'Ready-made meditations (like 10 minutes of ocean sounds) and short guides to meditation and breathing, each with a button that starts the session here.',
        wnBlogLink: 'Open the blog',
        sessionDoneBlog: 'More meditations on the blog',
        wnKaleidoTitle: 'Kaleidoscope background',
        wnKaleidoBody: 'You can now use a slow, moving kaleidoscope as your background instead of an image. In Settings, set Background Mode to Kaleidoscope.',
        wn432Title: '432 Hz music',
        wn432Body: 'A calm 432 Hz track is now in the background sounds. Open the music icon to try it.',
        wnMeditationTitle: 'New meditation screen',
        wnMeditationBody: 'Meditation now opens a focused full-screen view with a 5-second get-ready countdown before the timer starts.',
        updateReady: 'A new version is ready.',
        updateAction: 'Update',
        installIosHint: 'To install: tap the Share button in Safari, then choose "Add to Home Screen".',
        
        // Analytics
        analyticsToggleLabel: 'Anonymous usage statistics',
        analyticsNote: 'To improve the app, visits and feature usage (no name, email or exact location) are recorded with Google Analytics. You can turn this off here at any time.',
        
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
        tabSettings: 'تنظیمات',
        tabDonation: 'حمایت مالی',
        tabAbout: 'درباره',
        
        // تب تنظیمات
        intervalPanelTitle: 'تنظیمات بازه پخش صدا',
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
        chimeVolume: 'میزان صدای زنگ:',
        soundGong: 'کاسه آواز - گونگ',
        soundChimes: 'کاسه برنزی - زنگ',
        bgMode: 'حالت پس‌زمینه:',
        bgModeSingle: 'تصویر ثابت',
        bgModeRotation: 'چرخشی',
        bgModeKaleidoscope: 'زیبابین',
        bgModeKaleidoscopeSoft: 'زیبابین نرم',
        bgModeGalaxy: 'کهکشان',
        bgModeOcean: 'اقیانوس',
        bgModeMerger: 'برخورد کهکشان‌ها',
        bgModeCandle: 'چراغ روغنی',
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
        donationGram: 'Gram',
        donationQrScan: 'کد QR را اسکن کنید یا آدرس زیر را کپی کنید:',
        donationCopy: 'کپی آدرس',
        donationCopied: 'آدرس کپی شد! از حمایت شما متشکریم 💜',
        donationClose: 'بستن',
        donationThanks: 'از حمایت شما متشکریم!',
        donationNetworkWarn: 'فقط روی شبکه‌ی {0} ارسال کنید. ارسال روی شبکه‌ی دیگر ممکن است باعث از دست رفتن دارایی شود.',
        donationTapQr: 'برای کپی آدرس روی QR بزنید',
        
        // تب درباره
        aboutTitle: 'درباره Calm',
        aboutDescription: '<strong>Calm</strong> یک محیط وب آرامش‌بخش برای تنفس آگاهانه، مدیتیشن و تمرکز است. تمرین‌های تنفس هدایت‌شده و مدیتیشن زمان‌دار، در کنار تصاویر و صداهای آرام و بدون حواس‌پرتی.',
        aboutFeatures: 'ویژگی‌ها',
        aboutFeatureBreath: '<strong>تمرین تنفس:</strong> هشت روش از جمله باکس، ۴-۷-۸ و آه فیزیولوژیک، با راهنمای دم و بازدم، تعداد دور دلخواه و آمار تمرین شما',
        aboutFeatureMeditation: '<strong>مدیتیشن زمان‌دار:</strong> از ۱۰ دقیقه تا چند ساعت، با زنگ آغاز و پایان و صدای پس‌زمینه‌ی دلخواه',
        aboutFeature1: '<strong>تصاویر زیبا:</strong> مجموعه‌ای از تصاویر آرامش‌بخش، ثابت یا با چرخش خودکار',
        aboutFeatureKaleido: '<strong>زیبابین:</strong> یک زیبابین (کالیدوسکوپ) آرام و متحرک به‌جای تصویر، به‌عنوان پس‌زمینه',
        aboutFeature2: '<strong>کاسه آواز:</strong> صدای ملایم کاسه در بازه‌های دلخواه شما، یا سکوت',
        aboutFeature3: '<strong>صداهای طبیعت و موسیقی:</strong> آتش، جنگل، رودخانه و دریا، و موسیقی آرام ۴۳۲ هرتز، هرکدام با میزان صدای جداگانه',
        aboutFeature4: '<strong>تنظیمات شخصی:</strong> زبان، پس‌زمینه، صداها و میزان صدا به خاطر سپرده می‌شوند',
        aboutFeature5: '<strong>رابط ساده:</strong> بدون حواس‌پرتی، تمرکز کامل',
        aboutFeature6: '<strong>قابل نصب:</strong> به صفحه‌ی اصلی اضافه کنید؛ ظاهر و تصاویر آفلاین هم کار می‌کنند',
        aboutUsage: 'نحوه استفاده',
        aboutUsage1: 'روی دکمه «شروع» کلیک کنید',
        aboutUsage2: 'برای آرام شدن سریع، از دکمه‌های گوشه‌ی صفحه «تمرین تنفس» را باز کنید، یک روش انتخاب کنید و دایره را دنبال کنید',
        aboutUsage3: 'برای نشستن در سکوت، «مدیتیشن» را باز کنید و مدت و صدای دلخواه را انتخاب کنید',
        aboutUsage4: 'پس‌زمینه (تصویر یا زیبابین)، صداهای طبیعت و بازه‌ی زنگ را به سلیقه‌ی خود تنظیم کنید',
        aboutVersion: 'نسخه',
        aboutDeveloper: 'ساخته شده توسط تیم Calm',
        
        // فرم بازخورد
        blogTitle: 'بلاگ',
        blogDescription: 'مدیتیشن‌های آماده و راهنماهای کوتاه درباره‌ی مدیتیشن، تمرین تنفس و آرامش را در <a href="/blog/">بلاگ Calm</a> بخوانید.',
        creditsTitle: 'منابع تصاویر',
        creditsOilLamp: 'عکس پس‌زمینه‌ی چراغ روغنی: <a href="https://commons.wikimedia.org/wiki/File:Diya,_an_oil_lamp.jpg" target="_blank" rel="noopener">siddarth varanasi</a>، با مجوز <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener">CC BY 2.0</a>، از ویکی‌مدیا کامنز (بریده شده و شعله‌ی اصلی با شعله‌ی متحرک جایگزین شده).',
        feedbackTitle: 'پیشنهادات و بازخورد',
        feedbackDescription: 'نظرات و پیشنهادات شما برای ما ارزشمند است',
        feedbackName: 'نام (اختیاری)',
        feedbackEmail: 'ایمیل (اختیاری)',
        feedbackMessage: 'پیشنهاد یا نظر خود را بنویسید...',
        feedbackSubmit: 'ارسال پیشنهاد',
        feedbackNote: 'پیشنهادات شما به صورت خصوصی برای ما ارسال می‌شود',
        feedbackSuccess: 'متشکریم! پیشنهاد شما با موفقیت ارسال شد.',
        feedbackError: 'متاسفانه خطایی در ارسال پیشنهاد رخ داد. لطفا دوباره تلاش کنید.',
        
        // برچسب‌های دسترس‌پذیری
        ariaClose: 'بستن',
        ariaSoundInterval: 'تنظیمات بازه پخش صدا',
        ariaBgSounds: 'صداهای پس‌زمینه',
        ariaSettings: 'تنظیمات',
        ariaMenu: 'منو',
        ariaFullscreen: 'حالت تمام‌صفحه',
        ariaExitFullscreen: 'خروج از تمام‌صفحه',
        ariaDonate: 'حمایت از پروژه',
        ariaVolume: 'میزان صدای {0}',
        imageAlt: 'تصویر پس‌زمینه {0}',
        qrAlt: 'کد QR {0}',
        
        // نصب برنامه
        installApp: 'نصب برنامه',
        installTitle: 'نصب روی دستگاه',
        installDesc: 'دسترسی سریع‌تر از صفحه‌ی اصلی و استفاده‌ی آفلاین',
        settingsSectionBackground: 'پس‌زمینه',
        settingsSectionApp: 'برنامه و حریم خصوصی',
        
        // تازه‌ها و به‌روزرسانی
        whatsNewTitle: 'تازه‌ها',
        whatsNewTag: 'جدید',
        wnBlogTitle: 'بلاگ Calm',
        wnBlogBody: 'مدیتیشن‌های آماده (مثل ۱۰ دقیقه صدای اقیانوس) و راهنماهای کوتاه درباره‌ی مدیتیشن و تنفس، هرکدام با دکمه‌ای که جلسه را همین‌جا شروع می‌کند.',
        wnBlogLink: 'باز کردن بلاگ',
        sessionDoneBlog: 'مدیتیشن‌های بیشتر در بلاگ',
        wnKaleidoTitle: 'پس‌زمینه‌ی زیبابین',
        wnKaleidoBody: 'حالا می‌توانید به‌جای تصویر، یک زیبابین (کالیدوسکوپ) آرام و متحرک را پس‌زمینه کنید. در تنظیمات، «حالت پس‌زمینه» را روی «زیبابین» بگذارید.',
        wn432Title: 'موسیقی ۴۳۲ هرتز',
        wn432Body: 'یک موسیقی آرام ۴۳۲ هرتز به صداهای پس‌زمینه اضافه شد. آیکون موسیقی را باز کنید و امتحانش کنید.',
        wnMeditationTitle: 'صفحه‌ی تازه‌ی مدیتیشن',
        wnMeditationBody: 'مدیتیشن حالا در یک صفحه‌ی تمام‌صفحه و بدون حواس‌پرتی باز می‌شود و قبل از شروع تایمر، ۵ ثانیه برای آماده‌شدن وقت دارید.',
        updateReady: 'نسخه‌ی جدید آماده است.',
        updateAction: 'به‌روزرسانی',
        installIosHint: 'برای نصب: دکمه‌ی اشتراک‌گذاری (Share) را در Safari بزنید و «Add to Home Screen» را انتخاب کنید.',
        
        // آمار استفاده
        analyticsToggleLabel: 'آمار ناشناس استفاده',
        analyticsNote: 'برای بهبود برنامه، بازدیدها و استفاده از بخش‌ها (بدون نام، ایمیل یا موقعیت دقیق) با Google Analytics ثبت می‌شود. هر زمان می‌توانید آن را خاموش کنید.',
        
        // هشدارها
        alertInvalidNumber: 'لطفا یک عدد معتبر وارد کنید',
        alertMinimum5Seconds: 'لطفا یک عدد معتبر وارد کنید (حداقل 5 ثانیه)',
        
        // تگ‌های متا
        metaTitle: 'آرامش - فضای آرامش و تمرکز',
        metaDescription: 'وبسایت آرامش - محیطی آرام‌بخش با پخش خودکار صداهای آرامش‌دهنده و تصاویر زیبا برای مدیتیشن و تمرکز',
        metaKeywords: 'آرامش, مدیتیشن, تمرکز, صدای آرامش‌بخش, تصاویر طبیعت'
    }
};

// ترجمه‌های پنل صداهای پس‌زمینه (باید قبل از اولین updateAllTexts تعریف شوند)
translations.en.bgSoundsTitle = 'Background Sounds';
translations.en.bgSoundsSubtitle = 'Choose nature sounds for relaxation';
translations.en.soundFire = 'Fire';
translations.en.soundJungle = 'Jungle';
translations.en.soundRiver = 'River';
translations.en.soundSea = 'Sea';
translations.en.sound432 = '432 Hz';
translations.en.sound528 = '528 Hz';
translations.en.soundWhale = 'Whale 52 Hz';

// ترجمه‌های جلسه‌ی مدیتیشن زمان‌دار
Object.assign(translations.en, {
    sessionDurationLabel: 'Meditation length',
    sessionSoundLabel: 'Meditation sound',
    session10: '10 min',
    session15: '15 min',
    session30: '30 min',
    session60: '1 hour',
    sessionCustom: 'Custom',
    meditationTitle: 'Meditation',
    sessionStart: 'Start meditation',
    sessionHint: 'A bell rings at the start and another at the end. Periodic chimes are off during the session.',
    sessionActiveNote: 'A meditation is in progress. Use the “End” button in the middle of the screen to stop it.',
    ariaMeditation: 'Timed meditation',
    sessionMinutesUnit: 'minutes',
    sessionCustomAria: 'Length in minutes',
    sessionNoSound: 'No sound',
    sessionEnd: 'End',
    sessionStatus: 'Meditating…',
    sessionPrep: 'Get ready',
    sessionDone: 'Your meditation is complete. Be well.'
});
Object.assign(translations.fa, {
    sessionDurationLabel: 'مدت مدیتیشن',
    sessionSoundLabel: 'صدای مدیتیشن',
    session10: '۱۰ دقیقه',
    session15: '۱۵ دقیقه',
    session30: '۳۰ دقیقه',
    session60: '۱ ساعت',
    sessionCustom: 'دلخواه',
    meditationTitle: 'مدیتیشن',
    sessionStart: 'شروع مدیتیشن',
    sessionHint: 'با شروع، یک زنگ پخش می‌شود و در پایان هم زنگ دیگری. زنگ‌های دوره‌ای در این مدت خاموش‌اند.',
    sessionActiveNote: 'یک مدیتیشن در جریان است. برای پایان، از دکمه‌ی «پایان» وسط صفحه استفاده کنید.',
    ariaMeditation: 'مدیتیشن زمان‌دار',
    sessionMinutesUnit: 'دقیقه',
    sessionCustomAria: 'مدت به دقیقه',
    sessionNoSound: 'بدون صدا',
    sessionEnd: 'پایان',
    sessionStatus: 'در حال مدیتیشن…',
    sessionPrep: 'آماده شوید',
    sessionDone: 'مدیتیشن به پایان رسید. آرامش با شما.'
});

// ترجمه‌های تمرین تنفس
Object.assign(translations.en, {
    ariaBreath: 'Breathing exercise',
    ariaBreathStage: 'Breathing exercise',
    ariaDecrease: 'Decrease',
    ariaIncrease: 'Increase',
    breathTitle: 'Breathing exercise',
    breathPatternLabel: 'Breathing method',
    breathBox: 'Box',
    breath478: '4-7-8',
    breath369: '3-6-9',
    breathCoherent: 'Coherent',
    breathCalm: '4-6 Calm',
    breathExhale: 'Long exhale',
    breathSigh: 'Physiological sigh',
    breathCustom: 'Custom',
    breathDesc_box: 'Four equal phases. Helps you stay focused and steady under pressure.',
    breathDesc_478: 'A short inhale, a long hold and a slow exhale. Good before sleep and for quick calming.',
    breathDesc_369: 'Inhale 3, hold 6, exhale 9 seconds. The long exhale signals the body to relax.',
    breathDesc_coherent: 'About 5.5 seconds in and 5.5 out, with no pauses. A smooth, balanced rhythm.',
    breathDesc_calm: 'Inhale 4, exhale 6. The simplest way to start and ease tension.',
    breathDesc_exhale: 'Inhale 4, exhale 8: an exhale twice as long as the inhale. Helps with anxiety.',
    breathDesc_sigh: 'Two inhales in a row (the second one short) and one long exhale. A fast stress reliever; 3 to 5 rounds are enough.',
    breathDesc_custom: 'Set the length of every phase yourself.',
    breathCustomLabel: 'Length of each phase (seconds)',
    breathIn: 'Inhale',
    breathHold1: 'Hold after inhale',
    breathOut: 'Exhale',
    breathHold2: 'Hold after exhale',
    breathRoundsLabel: 'Rounds',
    breathInfinite: 'Unlimited',
    breathStart: 'Start',
    breathTotal: 'Total time: {0}',
    breathTotalOpen: 'No time limit. Stop whenever you like.',
    breathStats: 'Your practice: {0} sessions · {1} min · {2} rounds',
    breathBlockedNote: 'A meditation is in progress. You can start a breathing exercise after it ends.',
    breathPhaseIn: 'Inhale',
    breathPhaseIn2: 'Inhale again, a little more',
    breathPhaseHold: 'Hold',
    breathHoldShort: 'Hold',
    breathPhaseOut: 'Exhale',
    breathPrep: 'Get ready',
    breathRound: 'Round {0} of {1}',
    breathRoundOpen: 'Round {0}',
    breathDone: 'Breathing exercise complete: {0} rounds. Well done.',
    breathDoneStopped: 'Exercise ended after {0} rounds.'
});
Object.assign(translations.fa, {
    ariaBreath: 'تمرین تنفس',
    ariaBreathStage: 'تمرین تنفس',
    ariaDecrease: 'کم کردن',
    ariaIncrease: 'زیاد کردن',
    breathTitle: 'تمرین تنفس',
    breathPatternLabel: 'روش تنفس',
    breathBox: 'باکس',
    breath478: '۴-۷-۸',
    breath369: '۳-۶-۹',
    breathCoherent: 'منسجم',
    breathCalm: '۴-۶ آرام',
    breathExhale: 'بازدم بلند',
    breathSigh: 'آه فیزیولوژیک',
    breathCustom: 'دلخواه',
    breathDesc_box: 'چهار مرحله‌ی مساوی. برای تمرکز و آرام ماندن ذهن زیر فشار.',
    breathDesc_478: 'دم کوتاه، نگه‌داشت بلند و بازدم آهسته. مناسب پیش از خواب و آرام‌شدن سریع.',
    breathDesc_369: 'دم ۳، نگه‌داشت ۶ و بازدم ۹ ثانیه. بازدمِ بلند به بدن پیام آرامش می‌دهد.',
    breathDesc_coherent: 'حدود ۵٫۵ ثانیه دم و ۵٫۵ ثانیه بازدم، بدون مکث. ریتمی نرم و متعادل.',
    breathDesc_calm: 'دم ۴ و بازدم ۶. ساده‌ترین روش برای شروع و کم‌کردن تنش.',
    breathDesc_exhale: 'دم ۴ و بازدم ۸؛ بازدم دو برابر دم. برای کاهش اضطراب.',
    breathDesc_sigh: 'دو دم پشت‌سرهم (دم دوم کوتاه) و یک بازدم بلند. راهی سریع برای کم‌کردن استرس؛ ۳ تا ۵ دور کافی است.',
    breathDesc_custom: 'زمان هر مرحله را خودتان تعیین کنید.',
    breathCustomLabel: 'زمان هر مرحله (ثانیه)',
    breathIn: 'دم',
    breathHold1: 'نگه‌داشت پس از دم',
    breathOut: 'بازدم',
    breathHold2: 'نگه‌داشت پس از بازدم',
    breathRoundsLabel: 'تعداد دور',
    breathInfinite: 'نامحدود',
    breathStart: 'شروع تمرین',
    breathTotal: 'مدت کل: {0}',
    breathTotalOpen: 'بدون محدودیت زمان. هر وقت خواستید پایان دهید.',
    breathStats: 'تمرین‌های شما: {0} جلسه · {1} دقیقه · {2} دور',
    breathBlockedNote: 'یک مدیتیشن در جریان است. پس از پایان آن می‌توانید تمرین تنفس را شروع کنید.',
    breathPhaseIn: 'دم',
    breathPhaseIn2: 'کمی دیگر دم بگیرید',
    breathPhaseHold: 'نگه دارید',
    breathHoldShort: 'نگه‌داشت',
    breathPhaseOut: 'بازدم',
    breathPrep: 'آماده شوید',
    breathRound: 'دور {0} از {1}',
    breathRoundOpen: 'دور {0}',
    breathDone: 'تمرین تنفس تمام شد: {0} دور. آفرین.',
    breathDoneStopped: 'تمرین پس از {0} دور پایان یافت.'
});

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

const CHIME_DEFAULT_VOLUME = 20; // درصد
let currentSound = 'singing-bowl-gong.mp3';
let intervalTime = 300000; // پیش‌فرض 300 ثانیه (به میلی‌ثانیه)
let intervalId = null;
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
let bgMode = 'single'; // 'single' | 'rotation' | 'kaleidoscope' | 'kaleidoscope-soft' | 'galaxy' | 'ocean' | 'merger' | 'candle'
const KALEIDO_MODES = ['kaleidoscope', 'kaleidoscope-soft']; // زیبابین نرم = همان، بدون مثلث‌ها
const CANVAS_MODES = KALEIDO_MODES.concat('galaxy', 'ocean', 'merger', 'candle'); // حالت‌هایی که تصویر ندارند
let imagesLoaded = new Set(); // ذخیره تصاویری که لود شده‌اند
let bgImageRequested = false; // تصویر پس‌زمینه‌ی فعلی درخواست شده؟ (در حالت‌های canvas لازم نیست)
let bgImageDeferred = true;   // تا پایان راه‌اندازی صبر کن (لینک اشتراکی ممکن است حالت/تصویر را عوض کند)

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
let syncFullscreenLabel = null; // set by setupFullscreen() at the end of the file
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
    track('language_change', { language: currentLang });
});

// تابع به‌روزرسانی تمام متن‌ها
function updateAllTexts() {
    const t = translations[currentLang];
    
    // به‌روزرسانی عناصر با data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (t[key]) {
            // متن‌های داخلی خودمان که HTML (مثل <strong>) دارند با data-i18n-html علامت‌گذاری شده‌اند
            if (element.hasAttribute('data-i18n-html')) {
                element.innerHTML = t[key];
            } else {
                element.textContent = t[key];
            }
        }
    });
    
    // به‌روزرسانی aria-labelها
    document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
        const key = element.getAttribute('data-i18n-aria-label');
        if (t[key]) {
            element.setAttribute('aria-label', t[key]);
        }
    });
    
    if (syncFullscreenLabel) syncFullscreenLabel();
    
    // tooltip (title) برای دکمه‌های فقط‌آیکون
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        if (t[key]) {
            element.title = t[key];
        }
    });
    
    // alt تصاویر بندانگشتی و برچسب اسلایدرهای حجم صدا
    document.querySelectorAll('img[data-i18n-alt-index]').forEach((img, i) => {
        img.alt = t.imageAlt.replace('{0}', i + 1);
    });
    document.querySelectorAll('.volume-slider').forEach(slider => {
        const name = t['sound' + slider.dataset.sound] || slider.dataset.sound;
        slider.setAttribute('aria-label', t.ariaVolume.replace('{0}', name));
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
        bgModeSelect.options[2].text = t.bgModeKaleidoscope;
        bgModeSelect.options[3].text = t.bgModeKaleidoscopeSoft;
        bgModeSelect.options[4].text = t.bgModeGalaxy;
        bgModeSelect.options[5].text = t.bgModeOcean;
        bgModeSelect.options[6].text = t.bgModeMerger;
        bgModeSelect.options[7].text = t.bgModeCandle;
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
    
    bgImageRequested = true;

    // به‌روزرسانی thumbnail فعال (بدون انتظار برای بارگذاری تصویر)
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    const activeThumbnail = document.querySelector(`.thumbnail[data-index="${index}"]`);
    if (activeThumbnail) {
        activeThumbnail.classList.add('active');
    }

    // preload تصویر قبل از نمایش (اگر نیامد، رابط کاربری بدون تصویر کار می‌کند)
    preloadImage(imageName).then(() => {
        if (images[currentImageIndex] !== imageName) return; // در این فاصله تصویر دیگری انتخاب شده
        backgroundImage.style.backgroundImage = `url('${imageUrl(imageName)}')`;
        backgroundImage.classList.add('loaded');
        preloadNextImage();
    }).catch(() => {});
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
// زیبابین (کالیدوسکوپ) به‌عنوان والپیپر
// ============================================
// چند لکه‌ی نرم و رنگی به‌آرامی در یک گوه‌ی کوچک حرکت می‌کنند و آن گوه
// با آینه‌کاری دور مرکز تکرار می‌شود. تعداد قطعه‌ها باید زوج باشد تا لبه‌ها پیوسته بمانند.
const kaleidoCanvas = document.getElementById('kaleidoscopeCanvas');
const KALEIDO_SEGMENTS = 12;
const KALEIDO_BASE = '#0b1226';
const KALEIDO_PALETTE = [
    [64, 196, 190], [245, 180, 90], [236, 112, 140],
    [150, 120, 235], [110, 200, 130], [90, 150, 240]
];
const KALEIDO_EDGE = 0.04;
const KALEIDO_FRAME_MS = 1000 / 30;
const KALEIDO_BLOBS = KALEIDO_PALETTE.concat(KALEIDO_PALETTE.slice(0, 3)).map((color, i) => ({
    color,
    fx: 0.07 + ((i * 37) % 11) * 0.012,
    fy: 0.06 + ((i * 53) % 13) * 0.010,
    px: i * 1.7,
    py: i * 2.3,
    size: 0.22 + ((i * 29) % 7) * 0.035
}));
// تکه‌های شیشه‌ای: مثلث‌های نیمه‌شفاف که آرام می‌چرخند
const KALEIDO_SHARDS = KALEIDO_PALETTE.slice(0, 5).map((color, i) => ({
    color,
    fx: 0.05 + i * 0.011,
    fy: 0.045 + i * 0.013,
    px: i * 2.1 + 0.5,
    py: i * 1.3 + 1.1,
    rot: 0.06 + i * 0.02,
    size: 0.10 + i * 0.02
}));

let kaleidoCtx = null;
let kaleidoSrc = null;
let kaleidoSrcCtx = null;
let kaleidoRadius = 0;
let kaleidoMargin = 0;
let kaleidoRaf = 0;
let kaleidoLastTs = 0;
let kaleidoElapsed = 0;
let kaleidoActive = false;
let kaleidoShards = true; // در «زیبابین نرم» خاموش است

function kaleidoResize() {
    if (!kaleidoCanvas) return;
    const scale = 0.6; // وضوح کمتر = سبک‌تر؛ لکه‌ها نرم‌اند و تفاوتی دیده نمی‌شود
    kaleidoCanvas.width = Math.max(2, Math.round(window.innerWidth * scale));
    kaleidoCanvas.height = Math.max(2, Math.round(window.innerHeight * scale));
    kaleidoRadius = Math.hypot(kaleidoCanvas.width, kaleidoCanvas.height) / 2 + 2;
    const wedge = (Math.PI * 2) / KALEIDO_SEGMENTS;
    kaleidoSrc = document.createElement('canvas');
    kaleidoSrc.width = Math.ceil(kaleidoRadius);
    // حاشیه‌ی کوچک دو طرف گوه، تا لبه‌ی قطعه‌ها هم‌پوشانی داشته باشند و درزی دیده نشود
    kaleidoMargin = Math.ceil(kaleidoRadius * Math.sin(KALEIDO_EDGE));
    kaleidoSrc.height = Math.ceil(kaleidoRadius * Math.sin(wedge + KALEIDO_EDGE)) + kaleidoMargin + 2;
    kaleidoSrcCtx = kaleidoSrc.getContext('2d');
    kaleidoCtx = kaleidoCanvas.getContext('2d');
}

function kaleidoDraw() {
    if (!kaleidoCtx || !kaleidoSrcCtx) return;
    const t = kaleidoElapsed;
    const w = kaleidoSrc.width;
    const h = kaleidoSrc.height;
    const sc = kaleidoSrcCtx;

    // ۱) گوه‌ی منبع. مختصات از مرکز ماندالا است (مبدأ = (0, kaleidoMargin) در بوم منبع).
    // نوارهای حاشیه‌ی دو طرف گوه، دقیقاً آینه‌ی محتوای داخل گوه نسبت به همان مرز رسم می‌شوند؛
    // پس جایی که دو قطعه‌ی کنار هم روی هم می‌افتند هر دو پیکسل یکسان می‌کشند: نه درز دیده می‌شود
    // و نه لبه‌ی مثلث‌ها کنار مرز جابه‌جا می‌شود.
    const m = kaleidoMargin;
    const wedge = (Math.PI * 2) / KALEIDO_SEGMENTS;
    const wedgeH = w * Math.sin(wedge);
    const drawContent = () => {
        sc.globalCompositeOperation = 'lighter';
        KALEIDO_BLOBS.forEach(b => {
            const x = w * (0.5 + 0.5 * Math.sin(t * b.fx + b.px));
            const y = wedgeH * (0.5 + 0.5 * Math.sin(t * b.fy + b.py));
            const r = w * b.size;
            const g = sc.createRadialGradient(x, y, 0, x, y, r);
            g.addColorStop(0, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},0.42)`);
            g.addColorStop(1, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},0)`);
            sc.fillStyle = g;
            sc.fillRect(x - r, y - r, r * 2, r * 2);
        });

        if (kaleidoShards) KALEIDO_SHARDS.forEach(d => {
            const x = w * (0.2 + 0.8 * (0.5 + 0.5 * Math.sin(t * d.fx + d.px)));
            const y = wedgeH * (0.5 + 0.5 * Math.sin(t * d.fy + d.py));
            const r = w * d.size;
            const col = d.color.join(',');
            sc.save();
            sc.translate(x, y);
            sc.rotate(t * d.rot + d.px);
            sc.beginPath();
            sc.moveTo(0, -r);
            sc.lineTo(r * 0.87, r * 0.5);
            sc.lineTo(-r * 0.87, r * 0.5);
            sc.closePath();
            sc.fillStyle = `rgba(${col},0.16)`;
            sc.fill();
            sc.lineWidth = 1.5;
            sc.strokeStyle = `rgba(255,255,255,0.22)`;
            sc.stroke();
            sc.restore();
        });
        sc.globalCompositeOperation = 'source-over';
    };

    sc.setTransform(1, 0, 0, 1, 0, m);
    sc.globalCompositeOperation = 'source-over';
    sc.fillStyle = KALEIDO_BASE;
    sc.fillRect(0, -m, w, h);
    drawContent();

    // نوار زیر مرز زاویه‌ی صفر: آینه نسبت به محور افقی
    sc.save();
    sc.beginPath();
    sc.rect(0, -m - 1, w, m + 1);
    sc.clip();
    sc.fillStyle = KALEIDO_BASE;
    sc.fillRect(0, -m - 1, w, m + 1);
    sc.transform(1, 0, 0, -1, 0, 0);
    drawContent();
    sc.restore();

    // نوار بعد از مرز دوم گوه: آینه نسبت به خط با زاویه‌ی wedge
    sc.save();
    sc.beginPath();
    sc.moveTo(0, 0);
    sc.arc(0, 0, w * 1.5, wedge, wedge + KALEIDO_EDGE * 2);
    sc.closePath();
    sc.clip();
    sc.fillStyle = KALEIDO_BASE;
    sc.fillRect(0, -m, w, h);
    const c2 = Math.cos(2 * wedge);
    const s2 = Math.sin(2 * wedge);
    sc.transform(c2, s2, s2, -c2, 0, 0);
    drawContent();
    sc.restore();
    sc.setTransform(1, 0, 0, 1, 0, 0);

    // ۲) تکرار آینه‌ای دور مرکز
    const c = kaleidoCtx;
    c.globalCompositeOperation = 'source-over';
    c.fillStyle = KALEIDO_BASE;
    c.fillRect(0, 0, kaleidoCanvas.width, kaleidoCanvas.height);
    const spin = t * 0.025;
    for (let i = 0; i < KALEIDO_SEGMENTS; i++) {
        c.save();
        c.translate(kaleidoCanvas.width / 2, kaleidoCanvas.height / 2);
        if (i % 2 === 0) {
            c.rotate(spin + i * wedge);
        } else {
            c.rotate(spin + (i + 1) * wedge);
            c.scale(1, -1);
        }
        c.beginPath();
        c.moveTo(0, 0);
        c.arc(0, 0, kaleidoRadius, -KALEIDO_EDGE, wedge + KALEIDO_EDGE);
        c.closePath();
        c.clip();
        c.drawImage(kaleidoSrc, 0, -m);
        c.restore();
    }
}

function kaleidoFrame(ts) {
    if (!kaleidoActive) return;
    kaleidoRaf = requestAnimationFrame(kaleidoFrame);
    if (!kaleidoLastTs) kaleidoLastTs = ts;
    const dt = ts - kaleidoLastTs;
    if (dt < KALEIDO_FRAME_MS) return;
    kaleidoLastTs = ts;
    kaleidoElapsed += Math.min(dt, 100) / 1000;
    kaleidoDraw();
}

function startKaleidoscope() {
    if (!kaleidoCanvas) return;
    kaleidoActive = true;
    kaleidoCanvas.hidden = false;
    backgroundImage.style.visibility = 'hidden';
    kaleidoResize();
    kaleidoDraw();
    cancelAnimationFrame(kaleidoRaf);
    kaleidoLastTs = 0;
    // با «کاهش حرکت» فقط یک فریم ثابت رسم می‌شود
    if (!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) && !document.hidden) {
        kaleidoRaf = requestAnimationFrame(kaleidoFrame);
    }
}

function stopKaleidoscope() {
    kaleidoActive = false;
    cancelAnimationFrame(kaleidoRaf);
    if (kaleidoCanvas) kaleidoCanvas.hidden = true;
    backgroundImage.style.visibility = '';
}

window.addEventListener('resize', () => {
    if (!kaleidoActive) return;
    kaleidoResize();
    kaleidoDraw();
});

document.addEventListener('visibilitychange', () => {
    if (!kaleidoActive) return;
    cancelAnimationFrame(kaleidoRaf);
    if (!document.hidden && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
        kaleidoLastTs = 0;
        kaleidoRaf = requestAnimationFrame(kaleidoFrame);
    }
});

// ============================================
// پس‌زمینه‌ی کهکشان: یک کهکشان مارپیچی که آرام می‌چرخد
// ============================================
let galaxyCanvas = document.getElementById('galaxyCanvas');
const GALAXY_BASE = '#03040c';
const GALAXY_FRAME_MS = 1000 / 30;
const GALAXY_ARMS = 3;
const GALAXY_R0 = 0.1;         // شعاعی که بازوها از آنجا شروع می‌شوند
const GALAXY_PITCH = 0.42;     // زاویه‌ی باز شدن بازوها (tan)
const GALAXY_TILT = 0.5;       // نسبت کشیدگی (نمای مورب)
const GALAXY_ANGLE = -0.45;    // چرخش کل کهکشان روی صفحه
const GALAXY_SPEED = 0.05;     // رادیان بر ثانیه در لبه‌ی داخلی
// رنگ‌ها: هسته‌ی گرم → بازوهای آبی؛ کلاس‌ها برای کم‌کردن تعویض fillStyle
const GALAXY_COLORS = ['#ffe9c4', '#fff4e0', '#ffffff', '#cfe0ff', '#9fbcff', '#ffb7d5'];
let galaxyCtx = null;
let galaxyStars = [];
let galaxyBg = [];
let galaxyDust = [];
let galaxySprites = null;
let galaxyW = 0;
let galaxyH = 0;
let galaxyScale = 1;
let galaxyRaf = 0;
let galaxyLastTs = 0;
let galaxyElapsed = 0;
let galaxyActive = false;

function galaxyBuildSprite(rgb) {
    // نقطه‌ی نرم و درخشان رنگی برای هسته و ابرهای غبار
    const s = document.createElement('canvas');
    s.width = s.height = 64;
    const c = s.getContext('2d');
    const g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, `rgba(${rgb},1)`);
    g.addColorStop(0.3, `rgba(${rgb},0.3)`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    c.fillStyle = g;
    c.fillRect(0, 0, 64, 64);
    return s;
}

function galaxyArmAngle(r, arm) {
    // مارپیچ لگاریتمی: از لبه‌ی هسته شروع می‌شود و آرام‌آرام باز می‌شود
    return arm * (Math.PI * 2 / GALAXY_ARMS) + Math.log(Math.max(r, GALAXY_R0) / GALAXY_R0) / GALAXY_PITCH;
}

function galaxyGauss() {
    return Math.random() + Math.random() + Math.random() - 1.5; // تقریباً نرمال، ±1.5
}

function galaxyBuild() {
    galaxyStars = [];
    galaxyDust = [];
    galaxyBg = [];
    const big = galaxyW * galaxyH > 600000;
    const N = big ? 6500 : 4200;
    for (let i = 0; i < N; i++) {
        const kind = Math.random();
        let r, th, bright = 1;
        if (kind < 0.2) {
            // برآمدگی‌ی مرکزی: متراکم و گرد
            r = Math.pow(Math.random(), 2.2) * 0.3 + 0.01;
            th = Math.random() * Math.PI * 2;
        } else if (kind < 0.45) {
            // دیسک پراکنده بین بازوها (چگالی نمایی)
            do { r = 0.05 - Math.log(1 - Math.random()) * 0.38; } while (r > 1);
            th = Math.random() * Math.PI * 2;
            bright = 0.6;
        } else {
            // ستاره‌های بازوها: چگالی نمایی، عرض بازو با شعاع بیشتر می‌شود
            do { r = GALAXY_R0 * 0.8 - Math.log(1 - Math.random()) * 0.5; } while (r > 1);
            const arm = Math.floor(Math.random() * GALAXY_ARMS);
            const width = 0.12 + 0.22 * r;               // پراکندگی زاویه‌ای
            th = galaxyArmAngle(r, arm) + galaxyGauss() * width * 2;
            r *= 1 + galaxyGauss() * 0.06;               // کمی پراکندگی شعاعی
        }
        // کلاس رنگ: نزدیک مرکز گرم، دورتر آبی
        const warm = Math.max(0, 1 - r * 2.6);
        let cls;
        if (Math.random() < warm) cls = Math.random() < 0.6 ? 0 : 1;
        else if (kind >= 0.45 && Math.random() < 0.07 && r > 0.25) cls = 5;
        else cls = r > 0.4 ? (Math.random() < 0.6 ? 4 : 3) : (Math.random() < 0.5 ? 2 : 3);
        galaxyStars.push({
            r, th, cls,
            om: GALAXY_SPEED / Math.pow(r + 0.45, 0.6),
            a: (0.3 + Math.random() * 0.7) * bright,
            z: Math.random() < 0.1 + r * 0.12 ? 2 : 1,
            jy: (Math.random() - 0.5) * 0.03 * (1 - r)
        });
    }
    // ابرهای غبار/گاز درخشان روی بازوها
    for (let i = 0; i < 90; i++) {
        const r = 0.15 + Math.pow(Math.random(), 0.8) * 0.8;
        const arm = i % GALAXY_ARMS;
        galaxyDust.push({
            r,
            th: galaxyArmAngle(r, arm) + galaxyGauss() * 0.25,
            om: GALAXY_SPEED / Math.pow(r + 0.45, 0.6),
            s: 0.05 + Math.random() * 0.1,
            a: 0.07 + Math.random() * 0.08,
            hue: Math.random() < 0.25 ? 'pink' : 'blue'
        });
    }
    // ستاره‌های پس‌زمینه (ثابت، چشمک‌زن)
    const B = big ? 260 : 170;
    for (let i = 0; i < B; i++) {
        galaxyBg.push({
            x: Math.random(), y: Math.random(),
            a: 0.2 + Math.random() * 0.6,
            f: 0.5 + Math.random() * 1.5,
            p: Math.random() * 6.28
        });
    }
}

function galaxyResize2D() {
    if (!galaxyCanvas) return;
    const scale = 0.7;
    galaxyW = Math.max(2, Math.round(window.innerWidth * scale));
    galaxyH = Math.max(2, Math.round(window.innerHeight * scale));
    galaxyCanvas.width = galaxyW;
    galaxyCanvas.height = galaxyH;
    galaxyScale = Math.max(galaxyW, galaxyH) * 0.52; // شعاع کهکشان
    galaxyCtx = galaxyCanvas.getContext('2d');
    if (!galaxySprites) galaxySprites = {
        warm: galaxyBuildSprite('255,205,140'),
        blue: galaxyBuildSprite('120,155,255'),
        pink: galaxyBuildSprite('255,140,200')
    };
    galaxyBuild();
}

function galaxyDraw2D() {
    if (!galaxyCtx) return;
    const c = galaxyCtx;
    const t = galaxyElapsed;
    const cx = galaxyW / 2;
    const cy = galaxyH / 2;
    const R = galaxyScale;
    const ca = Math.cos(GALAXY_ANGLE);
    const sa = Math.sin(GALAXY_ANGLE);

    c.globalCompositeOperation = 'source-over';
    c.globalAlpha = 1;
    c.fillStyle = GALAXY_BASE;
    c.fillRect(0, 0, galaxyW, galaxyH);

    // ستاره‌های پس‌زمینه
    c.fillStyle = '#ffffff';
    for (let i = 0; i < galaxyBg.length; i++) {
        const s = galaxyBg[i];
        c.globalAlpha = s.a * (0.65 + 0.35 * Math.sin(t * s.f + s.p));
        c.fillRect(Math.floor(s.x * galaxyW), Math.floor(s.y * galaxyH), 1, 1);
    }

    c.globalCompositeOperation = 'lighter';
    const project = (r, th, jy) => {
        const x = Math.cos(th) * r * R;
        const y = (Math.sin(th) * r + (jy || 0)) * R * GALAXY_TILT;
        return [cx + x * ca - y * sa, cy + x * sa + y * ca];
    };

    // هاله‌ی کلی دیسک
    let p = project(0, 0);
    const halo = R * 1.15;
    c.globalAlpha = 0.16;
    c.save();
    c.translate(cx, cy);
    c.rotate(GALAXY_ANGLE);
    c.scale(1, GALAXY_TILT);
    c.drawImage(galaxySprites.blue, -halo, -halo, halo * 2, halo * 2);
    c.globalAlpha = 0.3;
    c.drawImage(galaxySprites.warm, -halo * 0.45, -halo * 0.45, halo * 0.9, halo * 0.9);
    c.restore();

    // ابرهای غبار درخشان
    for (let i = 0; i < galaxyDust.length; i++) {
        const d = galaxyDust[i];
        p = project(d.r, d.th - d.om * t);
        const size = d.s * R * 2;
        c.save();
        c.globalAlpha = d.a;
        c.drawImage(d.hue === 'pink' ? galaxySprites.pink : galaxySprites.blue, p[0] - size / 2, p[1] - size / 2, size, size);
        c.restore();
    }

    // ستاره‌ها (دسته‌بندی‌شده بر اساس رنگ)
    for (let k = 0; k < GALAXY_COLORS.length; k++) {
        c.fillStyle = GALAXY_COLORS[k];
        for (let i = 0; i < galaxyStars.length; i++) {
            const s = galaxyStars[i];
            if (s.cls !== k) continue;
            p = project(s.r, s.th - s.om * t, s.jy);
            c.globalAlpha = s.a;
            c.fillRect(p[0], p[1], s.z, s.z);
        }
    }

    // هسته‌ی درخشان
    c.globalAlpha = 0.55;
    const core = R * 0.3;
    c.save();
    c.translate(cx, cy);
    c.rotate(GALAXY_ANGLE);
    c.scale(1, 0.8);
    c.drawImage(galaxySprites.warm, -core, -core, core * 2, core * 2);
    c.restore();
    c.globalAlpha = 0.7;
    const core2 = R * 0.08;
    c.drawImage(galaxySprites.warm, cx - core2, cy - core2, core2 * 2, core2 * 2);
    c.globalAlpha = 1;
    c.globalCompositeOperation = 'source-over';
}

// ---------- نسخه‌ی WebGL (اصلی): ستاره‌ها روی مدار خودشان می‌چرخند ----------
// مدل موج چگالی: هر ستاره روی یک مدار کمی سه‌پر می‌چرخد و جهت مدارها با شعاع پیچ می‌خورد.
// جایی که مدارها به هم نزدیک می‌شوند بازو دیده می‌شود؛ ستاره‌ها از بازوها رد می‌شوند ولی بازوها پیچیده نمی‌شوند.
const GALAXY_GL_PIXELS = 1600000;  // سقف پیکسل بوم
const GALAXY_ECC = 0.11;           // کشیدگی مدارها (کمتر از PITCH/ARMS تا مدارها هم را قطع نکنند)
const GALAXY_PATTERN_SPEED = 0.012; // چرخش آرام خود الگوی بازوها
let galaxyMode = '';               // '' | 'gl' | '2d'
let galaxyGL = null;
let galaxyPx = 1;                  // پیکسل بوم به ازای هر پیکسل CSS

const GALAXY_GLSL_COMMON = `
const float ARMS = ${GALAXY_ARMS}.0;
const float R0 = ${GALAXY_R0};
const float PITCH = ${GALAXY_PITCH};
const float TILT = ${GALAXY_TILT};
const float ANG = ${GALAXY_ANGLE};
const float ECC = ${GALAXY_ECC};
float ecc(float a) { return ECC * smoothstep(0.06, 0.22, a) * (1.0 - 0.35 * smoothstep(0.7, 1.05, a)); }
// تراکم مدارها در نقطه‌ای با شعاع پایه‌ی a و زاویه‌ی th (۱ = بی‌بازو)
float compression(float a, float th, float pat, float e) {
    float ph = ARMS * (th - log(max(a, R0) / R0) / PITCH - pat);
    return 1.0 / max(1.0 + e * cos(ph) + (ARMS * e / PITCH) * sin(ph), 0.08);
}
`;

const GALAXY_PT_VERT = `
attribute vec4 aOrb;   // a, زاویه‌ی اولیه, ضخامت عمودی, نوع (0 پیر، 1 جوان، 2 برآمدگی، 3 گاز)
attribute vec4 aLook;  // رنگ و روشنایی
uniform vec2 uRes;
uniform float uScale;
uniform float uT;
uniform float uPat;
uniform float uPx;
uniform float uMaxPt;
uniform float uSpeed;
varying vec3 vCol;
varying float vK;
${GALAXY_GLSL_COMMON}
void main() {
    float a = aOrb.x;
    float kind = aOrb.w;
    // پراکندگی سرعت: هر ستاره کمی از مدار ایده‌آل فاصله دارد تا بازوها نرم و پهن شوند
    float j1 = fract(aOrb.y * 437.585);
    float j2 = fract(aOrb.y * 911.317);
    float e = kind > 1.5 && kind < 2.5 ? 0.0 : ecc(a) * (0.55 + 0.7 * j2);
    float th = aOrb.y - uSpeed / pow(a + 0.45, 0.6) * uT;
    float ph = ARMS * (th - log(max(a, R0) / R0) / PITCH - uPat + (j1 - 0.5) * 0.55);
    float r = a * (1.0 + e * cos(ph));
    float comp = 1.0 / max(1.0 + e * cos(ph) + (ARMS * e / PITCH) * sin(ph), 0.08);
    vec2 p = vec2(cos(th), sin(th)) * r;
    p.y += aOrb.z;
    float ca = cos(ANG), sa = sin(ANG);
    vec2 s = vec2(p.x * ca - p.y * TILT * sa, p.x * sa + p.y * TILT * ca) * uScale;
    gl_Position = vec4(2.0 * s.x / uRes.x, -2.0 * s.y / uRes.y, 0.0, 1.0);

    float b = aLook.w;
    float size = (1.0 + b) * uPx;
    vK = 14.0;
    if (kind > 2.5) {
        // ابر گاز: وقتی وارد بازو می‌شود روشن می‌شود و بیرون که می‌رود خاموش
        b *= smoothstep(1.2, 3.2, comp);
        size = min(uScale * (0.022 + 0.035 * fract(aOrb.y * 3.7)), uMaxPt);
        vK = 9.0;
    } else if (kind > 0.5 && kind < 1.5) {
        // ستاره‌ی جوان آبی: بیشتر داخل بازوها دیده می‌شود
        b *= 0.15 + 0.7 * clamp(comp - 1.0, 0.0, 4.0);
        size = (1.2 + 0.8 * aLook.w) * uPx;
    }
    gl_PointSize = max(size, 1.0);
    vCol = aLook.rgb * b;
}
`;

const GALAXY_PT_FRAG = `
precision mediump float;
varying vec3 vCol;
varying float vK;
void main() {
    vec2 d = gl_PointCoord - 0.5;
    gl_FragColor = vec4(vCol * exp(-dot(d, d) * vK), 1.0);
}
`;

// گذر تمام‌صفحه: uPass=0 آسمان و نور پخش دیسک، uPass=1 رگه‌های غبار (ضرب‌شونده)
const GALAXY_FS_FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uScale;
uniform float uTime;
uniform float uPat;
uniform float uTwinkle;
uniform float uPass;
${GALAXY_GLSL_COMMON}
vec3 hash32(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yxz + 33.33);
    return fract((p3.xxy + p3.yzz) * p3.zyx);
}
float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x),
               mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
    float s = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { s += a * noise(p); p = mat2(1.6, 1.2, -1.2, 1.6) * p + 17.0; a *= 0.5; }
    return s / 0.9375;
}
vec3 skyStars(vec2 frag, float cell, float prob, float seed) {
    vec2 c = floor(frag / cell);
    vec3 h = hash32(c + seed);
    if (h.z > prob) return vec3(0.0);
    vec2 d = (c + 0.2 + 0.6 * h.xy) * cell - frag;
    float lum = 0.05 + 0.85 * pow(1.0 - h.z / prob, 4.0);
    float tw = 1.0 + uTwinkle * 0.4 * sin(uTime * (0.6 + 1.7 * h.x) + 40.0 * h.y);
    vec3 k = mix(vec3(1.0, 0.88, 0.75), vec3(0.75, 0.85, 1.0), h.y);
    float w = cell / 9.0;
    return k * lum * tw * exp(-dot(d, d) / (0.6 * w * w));
}
void main() {
    vec2 frag = gl_FragCoord.xy;
    vec2 sd = vec2(frag.x - 0.5 * uRes.x, 0.5 * uRes.y - frag.y) / uScale;
    float ca = cos(ANG), sa = sin(ANG);
    vec2 v = vec2(sd.x * ca + sd.y * sa, -sd.x * sa + sd.y * ca);
    vec2 p = vec2(v.x, v.y / TILT);
    float r = length(p);
    float th = atan(p.y, p.x);
    float env = smoothstep(0.08, 0.22, r) * smoothstep(1.15, 0.5, r);

    if (uPass > 0.5) {
        float cd = compression(r * 1.07, th, uPat, ecc(r * 1.07));
        float pt = th - uPat;
        vec2 q = vec2(cos(pt), sin(pt)) * r;
        float n = fbm(q * 14.0 + 5.0);
        float tau = clamp(cd - 1.6, 0.0, 4.0) * 0.16 * (0.2 + 1.6 * n * n) * env;
        tau += smoothstep(0.55, 0.85, n) * 0.25 * env * exp(-r / 0.5);
        gl_FragColor = vec4(exp(-tau * vec3(0.8, 1.0, 1.3)), 1.0);
        return;
    }

    vec3 col = vec3(0.012, 0.016, 0.047);
    col += vec3(0.010, 0.010, 0.024) * fbm(sd * 1.7 + 3.0);
    float cell = 9.0;
    col += skyStars(frag, cell * 0.8, 0.14, 11.0) + skyStars(frag, cell * 1.5, 0.2, 47.0);

    float comp = compression(r, th, uPat, ecc(r));
    float disk = exp(-r / 0.24) * smoothstep(1.3, 0.4, r);
    col += vec3(1.0, 0.86, 0.7) * disk * 0.22;
    col += vec3(0.5, 0.65, 1.0) * clamp(comp - 1.0, 0.0, 4.0) * env * exp(-r / 0.6) * 0.05;
    col += vec3(0.55, 0.62, 0.9) * 0.035 * exp(-r / 0.55);
    vec2 bq = vec2(v.x, v.y / 0.78);
    float rb = length(bq);
    col += vec3(1.0, 0.8, 0.56) * (0.5 * exp(-rb / 0.05) + 0.12 * exp(-rb / 0.16) + 0.6 * exp(-rb * rb / 0.00008));
    gl_FragColor = vec4(col, 1.0);
}
`;

// ذرات یک‌بار ساخته می‌شوند؛ حرکتشان کاملاً در شیدر رأس حساب می‌شود
function galaxyBuildParticles(big) {
    const nStars = big ? 36000 : 18000;
    const nGas = big ? 520 : 320;
    const data = new Float32Array((nStars + nGas) * 8);
    const hex = (h) => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
    const pal = GALAXY_COLORS.map(hex);
    let k = 0;
    const push = (a, th, jy, kind, c, b) => {
        data[k++] = a; data[k++] = th; data[k++] = jy; data[k++] = kind;
        data[k++] = c[0]; data[k++] = c[1]; data[k++] = c[2]; data[k++] = b;
    };
    for (let i = 0; i < nStars; i++) {
        const u = Math.random();
        const th = Math.random() * Math.PI * 2;
        if (u < 0.16) {
            // برآمدگی‌ی مرکزی: متراکم، گرد و کمی ضخیم
            const a = Math.pow(Math.random(), 2.2) * 0.3 + 0.01;
            push(a, th, galaxyGauss() * 0.05 * (1 - a / 0.32), 2, pal[Math.random() < 0.6 ? 0 : 1], 0.25 + 0.55 * Math.random());
        } else if (u < 0.55) {
            // ستاره‌های پیر دیسک (زرد و سفید)
            let a;
            do { a = 0.05 - Math.log(1 - Math.random()) * 0.32; } while (a > 1.05);
            const warm = Math.max(0, 1 - a * 2.6);
            const c = Math.random() < warm ? pal[Math.random() < 0.6 ? 0 : 1] : pal[Math.random() < 0.5 ? 2 : 3];
            push(a, th, galaxyGauss() * 0.012, 0, c, 0.18 + 0.5 * Math.random());
        } else {
            // ستاره‌های جوان (آبی، گاهی صورتی)
            let a;
            do { a = 0.14 - Math.log(1 - Math.random()) * 0.42; } while (a > 1.05);
            const c = Math.random() < 0.06 && a > 0.25 ? pal[5] : pal[Math.random() < 0.6 ? 4 : 3];
            push(a, th, galaxyGauss() * 0.008, 1, c, 0.4 + 0.6 * Math.pow(Math.random(), 2));
        }
    }
    const pink = [1.0, 0.45, 0.72];
    const blue = [0.47, 0.6, 1.0];
    for (let i = 0; i < nGas; i++) {
        let a;
        do { a = 0.18 - Math.log(1 - Math.random()) * 0.32; } while (a > 0.85);
        push(a, Math.random() * Math.PI * 2, 0, 3, Math.random() < 0.35 ? pink : blue, 0.12 + 0.14 * Math.random());
    }
    return { data, count: nStars + nGas };
}

function galaxyInitGL() {
    let gl = null;
    try {
        const opts = { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' };
        gl = galaxyCanvas.getContext('webgl', opts) || galaxyCanvas.getContext('experimental-webgl', opts);
    } catch (err) {
        gl = null;
    }
    if (!gl) return null;
    const compile = (type, src) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.warn('galaxy shader:', gl.getShaderInfoLog(s));
            return null;
        }
        return s;
    };
    const link = (vsSrc, fsSrc) => {
        const vs = compile(gl.VERTEX_SHADER, vsSrc);
        const fs = compile(gl.FRAGMENT_SHADER, fsSrc);
        if (!vs || !fs) return null;
        const prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        return gl.getProgramParameter(prog, gl.LINK_STATUS) ? prog : null;
    };
    const fsProg = link('attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}', GALAXY_FS_FRAG);
    const ptProg = link(GALAXY_PT_VERT, GALAXY_PT_FRAG);
    if (!fsProg || !ptProg) return null;
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const big = window.innerWidth * window.innerHeight > 600000;
    const parts = galaxyBuildParticles(big);
    const pts = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pts);
    gl.bufferData(gl.ARRAY_BUFFER, parts.data, gl.STATIC_DRAW);
    const uf = (n) => gl.getUniformLocation(fsProg, n);
    const up = (n) => gl.getUniformLocation(ptProg, n);
    const range = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE);
    return {
        gl, fsProg, ptProg, quad, pts, count: parts.count,
        maxPt: Math.min(range ? range[1] : 64, 256),
        fsP: gl.getAttribLocation(fsProg, 'p'),
        aOrb: gl.getAttribLocation(ptProg, 'aOrb'),
        aLook: gl.getAttribLocation(ptProg, 'aLook'),
        f: { uRes: uf('uRes'), uScale: uf('uScale'), uTime: uf('uTime'), uPat: uf('uPat'), uTwinkle: uf('uTwinkle'), uPass: uf('uPass') },
        p: { uRes: up('uRes'), uScale: up('uScale'), uT: up('uT'), uPat: up('uPat'), uPx: up('uPx'), uMaxPt: up('uMaxPt'), uSpeed: up('uSpeed') }
    };
}

function galaxyResize() {
    if (!galaxyCanvas) return;
    if (!galaxyMode) {
        galaxyGL = galaxyInitGL();
        if (galaxyGL) {
            galaxyMode = 'gl';
            galaxyCanvas.addEventListener('webglcontextlost', (e) => {
                e.preventDefault();
                cancelAnimationFrame(galaxyRaf);
            });
            galaxyCanvas.addEventListener('webglcontextrestored', () => {
                galaxyGL = galaxyInitGL();
                if (!galaxyGL) return;
                if (galaxyActive) startGalaxy();
            });
        } else {
            // بومی که getContext('webgl') رویش صدا زده شده دیگر 2D نمی‌دهد
            galaxyMode = '2d';
            const fresh = galaxyCanvas.cloneNode(false);
            galaxyCanvas.replaceWith(fresh);
            galaxyCanvas = fresh;
        }
    }
    if (galaxyMode === '2d') {
        galaxyResize2D();
        return;
    }
    const cssW = window.innerWidth;
    const cssH = window.innerHeight;
    galaxyPx = Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(GALAXY_GL_PIXELS / Math.max(1, cssW * cssH)));
    galaxyW = Math.max(2, Math.round(cssW * galaxyPx));
    galaxyH = Math.max(2, Math.round(cssH * galaxyPx));
    galaxyCanvas.width = galaxyW;
    galaxyCanvas.height = galaxyH;
    galaxyScale = Math.max(galaxyW, galaxyH) * 0.52; // شعاع کهکشان
}

function galaxyDraw() {
    if (galaxyMode === '2d') {
        galaxyDraw2D();
        return;
    }
    if (!galaxyGL) return;
    const o = galaxyGL;
    const gl = o.gl;
    const t = galaxyElapsed;
    const pat = -((t * GALAXY_PATTERN_SPEED) % (Math.PI * 2));
    gl.viewport(0, 0, galaxyW, galaxyH);

    // ۱) آسمان و نور پخش
    gl.disable(gl.BLEND);
    gl.useProgram(o.fsProg);
    gl.disableVertexAttribArray(o.aOrb);
    gl.disableVertexAttribArray(o.aLook);
    gl.bindBuffer(gl.ARRAY_BUFFER, o.quad);
    gl.enableVertexAttribArray(o.fsP);
    gl.vertexAttribPointer(o.fsP, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(o.f.uRes, galaxyW, galaxyH);
    gl.uniform1f(o.f.uScale, galaxyScale);
    gl.uniform1f(o.f.uTime, t % 1000);
    gl.uniform1f(o.f.uPat, pat);
    gl.uniform1f(o.f.uTwinkle, galaxyReducedMotion() ? 0 : 1);
    gl.uniform1f(o.f.uPass, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // ۲) ستاره‌ها و ابرهای گاز (جمع‌شونده)
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.useProgram(o.ptProg);
    gl.disableVertexAttribArray(o.fsP);
    gl.bindBuffer(gl.ARRAY_BUFFER, o.pts);
    gl.enableVertexAttribArray(o.aOrb);
    gl.vertexAttribPointer(o.aOrb, 4, gl.FLOAT, false, 32, 0);
    gl.enableVertexAttribArray(o.aLook);
    gl.vertexAttribPointer(o.aLook, 4, gl.FLOAT, false, 32, 16);
    gl.uniform2f(o.p.uRes, galaxyW, galaxyH);
    gl.uniform1f(o.p.uScale, galaxyScale);
    gl.uniform1f(o.p.uT, t);
    gl.uniform1f(o.p.uPat, pat);
    gl.uniform1f(o.p.uPx, galaxyPx);
    gl.uniform1f(o.p.uMaxPt, o.maxPt);
    gl.uniform1f(o.p.uSpeed, GALAXY_SPEED);   // زاویه کم می‌شود: بازوها «دنباله‌رو» باشند، مثل کهکشان واقعی
    gl.drawArrays(gl.POINTS, 0, o.count);

    // ۳) رگه‌های غبار روی لبه‌ی داخلی بازوها (ضرب در عبور نور)
    gl.blendFunc(gl.ZERO, gl.SRC_COLOR);
    gl.useProgram(o.fsProg);
    gl.disableVertexAttribArray(o.aOrb);
    gl.disableVertexAttribArray(o.aLook);
    gl.bindBuffer(gl.ARRAY_BUFFER, o.quad);
    gl.enableVertexAttribArray(o.fsP);
    gl.vertexAttribPointer(o.fsP, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1f(o.f.uPass, 1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.disable(gl.BLEND);
}

function galaxyFrame(ts) {
    if (!galaxyActive) return;
    galaxyRaf = requestAnimationFrame(galaxyFrame);
    if (!galaxyLastTs) galaxyLastTs = ts;
    const dt = ts - galaxyLastTs;
    if (dt < GALAXY_FRAME_MS) return;
    galaxyLastTs = ts;
    galaxyElapsed += Math.min(dt, 100) / 1000;
    galaxyDraw();
}

function galaxyReducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

function startGalaxy() {
    if (!galaxyCanvas) return;
    galaxyActive = true;
    galaxyCanvas.hidden = false;
    backgroundImage.style.visibility = 'hidden';
    galaxyResize();
    galaxyDraw();
    cancelAnimationFrame(galaxyRaf);
    galaxyLastTs = 0;
    if (!galaxyReducedMotion() && !document.hidden) {
        galaxyRaf = requestAnimationFrame(galaxyFrame);
    }
}

function stopGalaxy() {
    galaxyActive = false;
    cancelAnimationFrame(galaxyRaf);
    if (galaxyCanvas) galaxyCanvas.hidden = true;
}

window.addEventListener('resize', () => {
    if (!galaxyActive) return;
    galaxyResize();
    galaxyDraw();
});

document.addEventListener('visibilitychange', () => {
    if (!galaxyActive) return;
    cancelAnimationFrame(galaxyRaf);
    if (!document.hidden && !galaxyReducedMotion()) {
        galaxyLastTs = 0;
        galaxyRaf = requestAnimationFrame(galaxyFrame);
    }
});

// ============================================
// پس‌زمینه‌ی اقیانوس: دریای آرام در شب مهتابی
// اصلی با WebGL (سطح آب واقعی با بازتاب ماه)؛ اگر WebGL نبود، نسخه‌ی ساده‌ی Canvas 2D
// ============================================

let oceanCanvas = document.getElementById('oceanCanvas');
const OCEAN_FRAME_MS = 1000 / 30;
const OCEAN_HORIZON = 0.4;      // ارتفاع افق نسبت به صفحه
const OCEAN_LAYERS = 12;        // تعداد لایه‌های موج
const OCEAN_MOON_Y = 0.19;
let oceanCtx = null;
let oceanW = 0;
let oceanH = 0;
let oceanSky = null;            // آسمان ثابت (گرادیان + ستاره + ماه)، یک‌بار رسم می‌شود
let oceanSprites = null;
let oceanMoonGrad = null;       // گرادیان افقی نور ماه روی تاج موج‌ها
let oceanTwinkle = [];
let oceanClouds = [];
let oceanGlints = [];
let oceanRaf = 0;
let oceanLastTs = 0;
let oceanElapsed = 0;
let oceanActive = false;

// در صفحه‌ی عمودی (گوشی) ماه کمی به وسط نزدیک‌تر است
function oceanMoonX() {
    return oceanW < oceanH ? 0.62 : 0.7;
}

// ---------- نسخه‌ی WebGL (اصلی) ----------
// هر پیکسل آب: برخورد پرتو دوربین با سطح دریا، نرمال از جمع موج‌های تیز (exp(sin))،
// سپس بازتاب آسمان و ماه با ضریب فرنل. مسیر نور ماه خودش از زاویه‌ی موج‌ها درمی‌آید.
const OCEAN_FOCAL = 1.4;
const OCEAN_GL_PIXELS = 650000;   // سقف تعداد پیکسل بوم (برای گرم نشدن گوشی)
let oceanMode = '';               // '' | 'gl' | '2d'
let oceanGL = null;

const OCEAN_VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}';
const OCEAN_FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uMoon;
uniform float uMoonR;
uniform float uHz;
uniform float uFocal;
uniform sampler2D uMoonTex;   // نیمه‌ی رو به زمینِ نقشه‌ی ماه (NASA LRO)، طول جغرافیایی ‎-90 تا 90
uniform float uMoonTexOn;
uniform float uMeteor;      // ۰ با «کاهش حرکت»

const float CAM_H = 4.0;
const float WAVE_H = 0.6;
const float DRAG = 0.38;
const vec3 SKY_HZ = vec3(0.16, 0.31, 0.47);
const vec3 SKY_MID = vec3(0.035, 0.075, 0.18);
const vec3 SKY_TOP = vec3(0.010, 0.022, 0.055);
const vec3 DEEP = vec3(0.004, 0.014, 0.028);
const vec3 MOON = vec3(0.93, 0.95, 1.0);

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p = p * 2.03 + vec2(1.7, 9.2);
        a *= 0.5;
    }
    return v;
}

// ارتفاع آب (۰ تا ۱): موج‌هایی با جهت‌های مختلف که هر کدام موقعیت موج بعدی را کمی جابه‌جا می‌کند
float waves(vec2 p, float iters) {
    float iter = 0.0;
    float freq = 1.0;
    float tm = 1.0;
    float w = 1.0;
    float sv = 0.0;
    float sw = 0.0;
    float t = uTime * 0.8;
    for (int i = 0; i < 24; i++) {
        if (float(i) >= iters) break;
        vec2 d = vec2(sin(iter), cos(iter));
        float x = dot(d, p) * freq + t * tm;
        float wv = exp(sin(x) - 1.0);
        float dx = wv * cos(x);
        p -= d * dx * w * DRAG;
        sv += wv * w;
        sw += w;
        w *= 0.82;
        freq *= 1.18;
        tm *= 1.07;
        iter += 1232.399963;
    }
    return sv / sw;
}

vec3 skyGrad(float y) {
    y = max(y, 0.0);
    vec3 c = mix(SKY_TOP, SKY_MID, exp(-y * 6.0));
    return mix(c, SKY_HZ, exp(-y * 22.0));
}

// هش بدون الگوی تکراری (Dave Hoskins)
vec3 hash3(vec2 p) {
    vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
    q += dot(q, q.yxz + 33.33);
    return fract((q.xxy + q.yzz) * q.zyx);
}

// یک لایه ستاره: در هر خانه‌ی شبکه حداکثر یک ستاره با جای تصادفی، روشنایی و رنگ متفاوت
// scint: شدت سوسو (نزدیک افق بیشتر، چون نور از هوای بیشتری رد می‌شود)
vec3 starLayer(vec2 uv, float cell, float chance, float bright, float px, float scint) {
    vec2 g = uv / cell;
    vec2 id = floor(g);
    vec3 h = hash3(id + cell * 1000.0);
    if (h.x > chance) return vec3(0.0);
    vec3 h2 = hash3(id.yx + 71.3);
    vec2 pos = (id + 0.15 + 0.7 * h2.xy) * cell;
    float b = pow(h.y, 5.0) * bright + 0.04;            // بیشترشان کم‌سو، چندتا پرنور
    float sigma = px * (0.55 + 0.9 * pow(h.y, 6.0));
    float d = length(uv - pos);
    // حاصل‌ضرب دو موج با بسامد متفاوت: چشمک نامنظم، نه تپش یکنواخت
    float s1 = 0.5 + 0.5 * sin(uTime * (1.1 + 3.0 * h.z) + h2.z * 40.0);
    float s2 = 0.5 + 0.5 * sin(uTime * (2.3 + 4.0 * h2.x) + h.y * 25.0);
    float tw = 1.0 - scint + scint * 1.6 * s1 * (0.4 + 0.6 * s2);
    vec3 tint = mix(vec3(0.75, 0.85, 1.0), vec3(1.0, 0.9, 0.75), h.z);
    tint *= 1.0 + scint * 0.35 * vec3(s2 - 0.5, 0.0, 0.5 - s2);   // کمی تغییر رنگ هنگام سوسو
    return tint * b * tw * exp(-d * d / (sigma * sigma));
}

// تراکم ابر در جهت d (۰ تا ۱): ابرهای کشیده‌ی پیچ‌خورده که آرام به راست می‌روند
float clouds(vec3 d) {
    vec2 cp = d.xz / (max(d.y, 0.0) + 0.04);
    cp = cp * vec2(0.16, 0.45) + vec2(uTime * 0.018, 0.0);
    vec2 warp = vec2(fbm(cp * 0.7 + 5.0), fbm(cp * 0.7 + 9.0));
    float n = fbm(cp + warp * 0.6);
    return smoothstep(0.44, 0.74, n) * smoothstep(0.0, 0.08, d.y);
}

// شهاب: در هر بازه‌ی ۳۰ ثانیه‌ای حداکثر یکی، با زمان، جا و جهت تصادفی
vec3 meteor(vec2 uv, float px) {
    float slot = floor(uTime / 30.0);
    vec3 h = hash3(vec2(slot, 17.0));
    vec3 h2 = hash3(vec2(slot, 41.0));
    if (h.z > 0.8) return vec3(0.0);
    float dur = 0.7 + 0.6 * h2.z;
    float t0 = h.x * (30.0 - dur);
    float p = (uTime - slot * 30.0 - t0) / dur;
    if (p < 0.0 || p > 1.0) return vec3(0.0);
    float asp = uRes.x / uRes.y;
    vec2 st = vec2((h.y - 0.5) * asp * 0.9, uHz + 0.18 + 0.25 * h2.x);
    float ang = mix(-2.6, -0.55, h2.y);                  // رو به پایین، چپ یا راست
    vec2 dv = vec2(cos(ang), sin(ang));
    float len = 0.12 + 0.12 * h2.x;
    vec2 head = st + dv * len * p;
    vec2 tail = st + dv * len * max(0.0, p - 0.4);
    vec2 ba = head - tail;
    vec2 pa = uv - tail;
    float k = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-7), 0.0, 1.0);
    float d = length(pa - ba * k);
    float w = px * 0.9;
    float line = exp(-d * d / (w * w)) * k * k;          // پررنگ‌تر نزدیک سر
    float life = sin(3.14159 * p);
    return vec3(0.85, 0.9, 1.0) * line * life * 1.6 * smoothstep(0.0, 0.06, uv.y - uHz);
}

// نوار کهکشان راه شیری: از نزدیک افق سمت چپ، مورب به بالا (دور از ماه)
// x = فاصله تا خط وسط نوار، y = جای روی نوار (۰ پایین، ۱ بالا)
vec2 milkyCoords(vec2 uv) {
    float asp = uRes.x / uRes.y;
    vec2 a = vec2((0.42 - 0.5) * asp, uHz);
    vec2 b = vec2((0.1 - 0.5) * asp, 0.55);
    vec2 ab = b - a;
    float len = length(ab);
    vec2 dirv = ab / len;
    vec2 q = uv - a;
    return vec2(dot(q, vec2(dirv.y, -dirv.x)), dot(q, dirv) / len);
}

float moonDist(vec3 d) {
    return sqrt(max(0.0, 2.0 * (1.0 - dot(d, uMoon))));
}

// قرص و هاله‌ی ماه؛ bright شدت قرص است (در بازتاب بیشتر، تا درخشش‌ها دیده شوند)
// soft لبه‌ی قرص را نرم می‌کند تا درخشش‌های روی آب لبه‌ی پیکسلی نداشته باشند
vec3 moonLight(vec3 d, float bright, float soft) {
    float a = moonDist(d);
    float disc = smoothstep(uMoonR * (1.0 + soft), uMoonR * (0.9 - soft), a);
    float halo = 0.28 * exp(-a / (uMoonR * 1.4)) + 0.10 * exp(-a / (uMoonR * 6.0)) + 0.03 * exp(-a / (uMoonR * 20.0));
    return MOON * (halo + disc * bright);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
    vec3 dir = normalize(vec3(uv.x, uv.y - uHz, uFocal));
    vec3 col;
    if (dir.y > 0.0) {
        float a = moonDist(dir);
        col = skyGrad(dir.y);
        // ستاره‌ها: دو لایه (ریز و پرتعداد + درشت و کم‌تعداد)، کم‌سوتر نزدیک افق و ماه
        float px = 1.0 / uRes.y;
        float fade = smoothstep(0.01, 0.12, dir.y) * smoothstep(uMoonR * 3.0, uMoonR * 12.0, a);
        float scint = mix(0.55, 0.15, smoothstep(0.02, 0.22, dir.y));
        // راه شیری: نور مه‌آلود ابرمانند + رگه‌های تیره‌ی غبار + ستاره‌های ریز انبوه
        vec2 mw = milkyCoords(uv);
        float w = 0.075 + 0.03 * mw.y;
        float band = exp(-mw.x * mw.x / (w * w));
        float wide = exp(-mw.x * mw.x / (w * w * 5.0));
        vec2 bc = vec2(mw.x * 9.0, mw.y * 3.2);
        float clump = fbm(bc * vec2(1.4, 1.0) + 3.0);
        float lane = smoothstep(0.45, 0.72, fbm(bc * vec2(2.5, 1.6) + 17.0)) * exp(-pow((mw.x + 0.012) / (w * 0.45), 2.0));
        float glow = (band * (0.35 + 0.9 * clump) + wide * 0.25) * (1.0 - 0.75 * lane);
        glow *= mix(1.25, 0.55, clamp(mw.y, 0.0, 1.0));     // نزدیک افق (مرکز کهکشان) پرنورتر
        vec3 mwCol = mix(vec3(0.42, 0.48, 0.62), vec3(0.75, 0.66, 0.52), band * clump);
        col += mwCol * glow * 0.22 * fade;
        // ستاره‌ها: دو لایه‌ی عمومی + غبار ستاره‌ای داخل نوار
        vec3 stars = starLayer(uv, 0.018, 0.4, 0.9, px, scint) + starLayer(uv + 7.3, 0.06, 0.35, 2.2, px, scint);
        stars += starLayer(uv + 3.1, 0.006, 0.75, 0.6, px, scint * 0.5) * band * (0.5 + clump) * (1.0 - 0.6 * lane);
        stars += starLayer(uv + 5.7, 0.011, 0.6, 0.9, px, scint * 0.5) * wide;
        col += stars * fade;
        // ماه: کره با دریاهای تیره، دهانه‌های ریز، تیرگی لبه و لبه‌ی نرم
        vec3 mr = normalize(cross(vec3(0.0, 1.0, 0.0), uMoon));
        vec3 mu = cross(uMoon, mr);
        vec2 mp = vec2(dot(dir, mr), dot(dir, mu)) / uMoonR;
        float r = length(mp);
        float edge = px / (uMoonR * uFocal) * 1.5;
        float disc = smoothstep(1.0 + edge, 1.0 - edge, r);
        col += moonLight(dir, 0.0, 0.0);
        if (disc > 0.0) {
            float z = sqrt(max(0.0, 1.0 - r * r));
            // نقطه‌ی روی کره → طول و عرض جغرافیایی → نقشه‌ی واقعی ماه
            vec3 sph = vec3(mp, z);
            float lat = asin(clamp(sph.y, -1.0, 1.0));
            float lon = atan(sph.x, max(sph.z, 1e-4));
            vec3 tc = texture2D(uMoonTex, vec2(0.5 + lon / 3.14159265, 0.5 - lat / 3.14159265)).rgb;
            float lum = dot(tc, vec3(0.3, 0.59, 0.11));
            vec3 surf = pow(mix(vec3(lum), tc, 0.35) / 0.62, vec3(1.25));
            // تا وقتی تصویر بار نشده: قرص ساده با کمی بافت
            surf = mix(vec3(0.95 + 0.05 * fbm(mp * 6.0)), surf, uMoonTexOn);
            float limb = 0.72 + 0.28 * pow(z, 0.5);
            vec3 moonCol = vec3(1.0, 0.97, 0.9) * 2.0 * surf * limb;
            col = mix(col, col * 0.3 + moonCol, disc);
        }
        // شهاب‌ها (پشت ابرها)
        col += meteor(uv, px) * uMeteor;
        // ابرها: نزدیک ماه نقره‌ای و با لبه‌ی روشن، دورتر تیره؛ از جلوی ماه هم رد می‌شوند
        float cl = clouds(dir);
        float lit = exp(-a / (uMoonR * 7.0));
        vec3 cloudCol = mix(vec3(0.075, 0.095, 0.15), vec3(0.62, 0.66, 0.74), lit) * (1.0 + 0.6 * lit * (1.0 - cl));
        col = mix(col, cloudCol, cl * 0.85);
    } else {
        float t = min(CAM_H / -dir.y, 3000.0);
        vec2 p = dir.xz * t;
        // دورتر = جزئیات کمتر (هم سریع‌تر، هم بدون سوسوی نویز)
        float iters = floor(mix(24.0, 8.0, clamp(t / 150.0, 0.0, 1.0)));
        float e = 0.01 + t * 0.003;
        float h0 = waves(p, iters);
        float hx = waves(p + vec2(e, 0.0), iters);
        float hz = waves(p + vec2(0.0, e), iters);
        vec3 N = normalize(vec3((h0 - hx) * WAVE_H, e, (h0 - hz) * WAVE_H));
        N = normalize(mix(N, vec3(0.0, 1.0, 0.0), smoothstep(40.0, 400.0, t) * 0.85));
        vec3 R = reflect(dir, N);
        R.y = abs(R.y);
        float fres = 0.02 + 0.98 * pow(1.0 - max(dot(N, -dir), 0.0), 5.0);
        // وقتی ابر جلوی ماه است، مسیر نور روی آب هم کم‌نور می‌شود
        float occ = clouds(uMoon);
        vec3 refl = skyGrad(R.y) + moonLight(R, 16.0, 0.45) * (1.0 - 0.75 * occ);
        vec3 water = DEEP + vec3(0.015, 0.04, 0.05) * pow(h0, 3.0);
        col = mix(water, refl, fres);
        // مه افق
        col = mix(col, SKY_HZ * 0.85, smoothstep(60.0, 700.0, t) * 0.7);
    }
    col = 1.0 - exp(-col * 1.15);
    gl_FragColor = vec4(col, 1.0);
}
`;

function oceanInitGL() {
    let gl = null;
    try {
        const opts = { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' };
        gl = oceanCanvas.getContext('webgl', opts) || oceanCanvas.getContext('experimental-webgl', opts);
    } catch (err) {
        gl = null;
    }
    if (!gl) return null;
    const compile = (type, src) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.warn('ocean shader:', gl.getShaderInfoLog(s));
            return null;
        }
        return s;
    };
    const vs = compile(gl.VERTEX_SHADER, OCEAN_VERT);
    const fs = compile(gl.FRAGMENT_SHADER, OCEAN_FRAG);
    if (!vs || !fs) return null;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n) => gl.getUniformLocation(prog, n);
    const o = { gl, uRes: u('uRes'), uTime: u('uTime'), uMoon: u('uMoon'), uMoonR: u('uMoonR'), uHz: u('uHz'), uFocal: u('uFocal'), uMoonTexOn: u('uMoonTexOn'), uMeteor: u('uMeteor'), tex: gl.createTexture(), texOn: false };
    gl.uniform1i(u('uMoonTex'), 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, o.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([200, 200, 200]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    oceanLoadMoon(o);
    return o;
}

// تصویر سطح ماه یک‌بار دانلود می‌شود و بعد از رسیدن، روی کره‌ی ماه می‌نشیند
let oceanMoonImg = null;
function oceanLoadMoon(o) {
    const upload = () => {
        if (oceanGL !== o && oceanGL) return;
        const gl = o.gl;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, o.tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, oceanMoonImg);
        o.texOn = true;
        if (oceanActive) oceanDraw();   // در حالت «کاهش حرکت» هم یک‌بار دوباره رسم شود
    };
    if (oceanMoonImg && oceanMoonImg.complete && oceanMoonImg.naturalWidth) {
        upload();
        return;
    }
    if (!oceanMoonImg) {
        oceanMoonImg = new Image();
        oceanMoonImg.src = 'assets/images/moon.jpg';
    }
    oceanMoonImg.addEventListener('load', upload, { once: true });
}

// اگر WebGL ساخته شد ولی شیدر خطا داد، بوم دیگر 2D نمی‌گیرد؛ یک بوم تازه جایش می‌گذاریم
function oceanFreshCanvas() {
    const fresh = oceanCanvas.cloneNode(false);
    oceanCanvas.replaceWith(fresh);
    oceanCanvas = fresh;
}

function oceanResize() {
    if (!oceanCanvas) return;
    if (!oceanMode) {
        oceanGL = oceanInitGL();
        if (oceanGL) {
            oceanMode = 'gl';
            oceanCanvas.addEventListener('webglcontextlost', (e) => {
                e.preventDefault();
                cancelAnimationFrame(oceanRaf);
            });
            oceanCanvas.addEventListener('webglcontextrestored', () => {
                oceanGL = oceanInitGL();
                if (!oceanGL) return;
                if (oceanActive) startOcean();
            });
        } else {
            oceanMode = '2d';
            oceanFreshCanvas();
        }
    }
    if (oceanMode === '2d') {
        oceanResize2D();
        return;
    }
    const cssW = window.innerWidth;
    const cssH = window.innerHeight;
    const scale = Math.min(0.75, Math.sqrt(OCEAN_GL_PIXELS / Math.max(1, cssW * cssH)));
    oceanW = Math.max(2, Math.round(cssW * scale));
    oceanH = Math.max(2, Math.round(cssH * scale));
    oceanCanvas.width = oceanW;
    oceanCanvas.height = oceanH;
}

function oceanDraw() {
    if (oceanMode === '2d') {
        oceanDraw2D();
        return;
    }
    if (!oceanGL) return;
    const o = oceanGL;
    const gl = o.gl;
    const hz = 0.5 - OCEAN_HORIZON;   // افق در مختصات uv
    const mx = (oceanMoonX() - 0.5) * oceanW / oceanH;
    const my = 0.5 - OCEAN_MOON_Y - hz;
    const len = Math.hypot(mx, my, OCEAN_FOCAL);
    gl.viewport(0, 0, oceanW, oceanH);
    gl.uniform2f(o.uRes, oceanW, oceanH);
    gl.uniform1f(o.uTime, 20 + (oceanElapsed % 10000));
    gl.uniform3f(o.uMoon, mx / len, my / len, OCEAN_FOCAL / len);
    gl.uniform1f(o.uMoonR, 0.05 * Math.min(oceanW, oceanH) / oceanH / OCEAN_FOCAL);
    gl.uniform1f(o.uHz, hz);
    gl.uniform1f(o.uFocal, OCEAN_FOCAL);
    gl.uniform1f(o.uMoonTexOn, o.texOn ? 1 : 0);
    gl.uniform1f(o.uMeteor, oceanReducedMotion() ? 0 : 1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

// ---------- نسخه‌ی Canvas 2D (پشتیبان، وقتی WebGL نیست) ----------

function oceanLerp(a, b, t) {
    return a + (b - a) * t;
}

function oceanRadialSprite(size, stops) {
    const cv = document.createElement('canvas');
    cv.width = cv.height = size;
    const g = cv.getContext('2d');
    const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    stops.forEach(s => gr.addColorStop(s[0], s[1]));
    g.fillStyle = gr;
    g.fillRect(0, 0, size, size);
    return cv;
}

function oceanBuild() {
    const W = oceanW;
    const H = oceanH;
    const hzY = H * OCEAN_HORIZON;
    const moonX = W * oceanMoonX();
    const moonY = H * OCEAN_MOON_Y;
    const moonR = Math.min(W, H) * 0.05;

    if (!oceanSprites) {
        oceanSprites = {
            halo: oceanRadialSprite(256, [[0, 'rgba(210,225,255,0.55)'], [0.18, 'rgba(170,200,255,0.25)'], [0.5, 'rgba(110,150,230,0.07)'], [1, 'rgba(80,120,220,0)']]),
            glow: oceanRadialSprite(128, [[0, 'rgba(200,220,255,0.5)'], [0.5, 'rgba(150,185,245,0.14)'], [1, 'rgba(120,160,240,0)']]),
            cloud: oceanRadialSprite(128, [[0, 'rgba(150,175,225,0.55)'], [0.55, 'rgba(110,140,200,0.2)'], [1, 'rgba(90,120,190,0)']])
        };
    }

    // ---- آسمان ثابت ----
    oceanSky = document.createElement('canvas');
    oceanSky.width = W;
    oceanSky.height = Math.ceil(hzY) + 2;
    const s = oceanSky.getContext('2d');
    const sg = s.createLinearGradient(0, 0, 0, hzY);
    sg.addColorStop(0, '#03060f');
    sg.addColorStop(0.55, '#0a1530');
    sg.addColorStop(0.88, '#17335a');
    sg.addColorStop(1, '#27507a');
    s.fillStyle = sg;
    s.fillRect(0, 0, W, oceanSky.height);

    // ستاره‌ها (کم‌سو‌تر نزدیک افق و نزدیک ماه)
    for (let i = 0; i < 170; i++) {
        const x = Math.random() * W;
        const y = Math.pow(Math.random(), 1.25) * hzY * 0.92;
        const near = Math.hypot(x - moonX, y - moonY) / (moonR * 9);
        const a = (0.25 + Math.random() * 0.6) * Math.min(1, near) * (1 - (y / hzY) * 0.6);
        s.fillStyle = 'rgba(' + (Math.random() < 0.3 ? '255,235,210' : '215,230,255') + ',' + a.toFixed(3) + ')';
        const sz = Math.random() < 0.08 ? 2 : 1;
        s.fillRect(Math.floor(x), Math.floor(y), sz, sz);
    }

    // هاله و قرص ماه
    const halo = moonR * 11;
    s.drawImage(oceanSprites.halo, moonX - halo, moonY - halo, halo * 2, halo * 2);
    const disc = s.createRadialGradient(moonX - moonR * 0.3, moonY - moonR * 0.3, moonR * 0.1, moonX, moonY, moonR);
    disc.addColorStop(0, '#fffdf4');
    disc.addColorStop(1, '#e3ebfa');
    s.fillStyle = disc;
    s.beginPath();
    s.arc(moonX, moonY, moonR, 0, Math.PI * 2);
    s.fill();
    s.fillStyle = 'rgba(160,178,210,0.13)';
    [[-0.3, -0.1, 0.28], [0.25, 0.3, 0.2], [0.1, -0.45, 0.14], [-0.35, 0.4, 0.12]].forEach(c => {
        s.beginPath();
        s.arc(moonX + c[0] * moonR, moonY + c[1] * moonR, c[2] * moonR, 0, Math.PI * 2);
        s.fill();
    });

    // ---- ستاره‌های چشمک‌زن ----
    oceanTwinkle = [];
    for (let i = 0; i < 28; i++) {
        oceanTwinkle.push({
            x: Math.floor(Math.random() * W),
            y: Math.floor(Math.pow(Math.random(), 1.2) * hzY * 0.8),
            ph: Math.random() * 6.28,
            sp: 0.6 + Math.random() * 1.6,
            z: Math.random() < 0.2 ? 2 : 1
        });
    }

    // ---- ابرهای نازک که آرام می‌روند ----
    oceanClouds = [];
    for (let i = 0; i < 5; i++) {
        oceanClouds.push({
            x: Math.random(),
            y: oceanLerp(0.06, 0.34, Math.random()) * H,
            w: W * oceanLerp(0.35, 0.7, Math.random()),
            h: H * oceanLerp(0.025, 0.05, Math.random()),
            v: oceanLerp(0.004, 0.011, Math.random()),
            a: oceanLerp(0.35, 0.8, Math.random())
        });
    }

    // ---- درخشش‌های بازتاب ماه ----
    oceanGlints = [];
    for (let i = 0; i < 170; i++) {
        const u = Math.pow(Math.random(), 1.35);   // 0 = افق، 1 = جلو
        const g1 = (Math.random() + Math.random() + Math.random() - 1.5) * 1.3;
        oceanGlints.push({
            u: u,
            dx: g1 * (0.012 + 0.11 * u),
            w: (0.006 + 0.045 * u) * (0.4 + Math.random() * 0.9),
            a: 0.25 + Math.random() * 0.6,
            ph: Math.random() * 6.28,
            sp: 0.5 + Math.random() * 1.6,
            dr: (Math.random() - 0.5) * 0.01
        });
    }

    // ---- نور ماه روی تاج موج‌ها ----
    oceanMoonGrad = s.createLinearGradient(moonX - W * 0.4, 0, moonX + W * 0.4, 0);
    oceanMoonGrad.addColorStop(0, 'rgba(190,215,255,0)');
    oceanMoonGrad.addColorStop(0.5, 'rgba(225,238,255,1)');
    oceanMoonGrad.addColorStop(1, 'rgba(190,215,255,0)');
}

function oceanResize2D() {
    if (!oceanCanvas) return;
    const scale = 0.75;
    oceanW = Math.max(2, Math.round(window.innerWidth * scale));
    oceanH = Math.max(2, Math.round(window.innerHeight * scale));
    oceanCanvas.width = oceanW;
    oceanCanvas.height = oceanH;
    oceanCtx = oceanCanvas.getContext('2d');
    oceanBuild();
}

// رنگ آب: نزدیک افق روشن‌تر (بازتاب آسمان)، جلو تیره
function oceanWaterColor(d, dark) {
    const k = dark ? 0.55 : 1;
    const r = oceanLerp(34, 4, Math.pow(d, 0.7)) * k;
    const g = oceanLerp(78, 14, Math.pow(d, 0.7)) * k;
    const b = oceanLerp(118, 32, Math.pow(d, 0.7)) * k;
    return 'rgb(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ')';
}

function oceanDraw2D() {
    if (!oceanCtx || !oceanSky) return;
    const c = oceanCtx;
    const W = oceanW;
    const H = oceanH;
    const t = oceanElapsed;
    const hzY = H * OCEAN_HORIZON;
    const moonX = W * oceanMoonX();
    const px = Math.max(1, W / 900);   // ضخامت خط‌ها متناسب با اندازه‌ی بوم

    // ---- آسمان ----
    c.globalAlpha = 1;
    c.fillStyle = '#050a18';
    c.fillRect(0, 0, W, H);
    c.drawImage(oceanSky, 0, 0);

    for (let i = 0; i < oceanTwinkle.length; i++) {
        const st = oceanTwinkle[i];
        const a = 0.15 + 0.6 * Math.pow(0.5 + 0.5 * Math.sin(t * st.sp + st.ph), 2);
        c.fillStyle = 'rgba(235,242,255,' + a.toFixed(3) + ')';
        c.fillRect(st.x, st.y, st.z, st.z);
    }

    for (let i = 0; i < oceanClouds.length; i++) {
        const cl = oceanClouds[i];
        const x = ((cl.x + cl.v * t / 10) % 1.4) * (W * 1.4) - cl.w;
        c.globalAlpha = cl.a * 0.55;
        c.drawImage(oceanSprites.cloud, x, cl.y - cl.h / 2, cl.w, cl.h);
    }
    c.globalAlpha = 1;

    // ---- آب ----
    c.fillStyle = oceanWaterColor(0, false);
    c.fillRect(0, hzY, W, H - hzY);

    // درخشش بازتاب ماه روی آب (ستونی نرم)
    c.save();
    c.beginPath();
    c.rect(0, hzY, W, H - hzY);
    c.clip();
    c.globalAlpha = 0.55;
    const gw = W * 0.34;
    c.drawImage(oceanSprites.glow, moonX - gw / 2, hzY - (H - hzY) * 0.15, gw, (H - hzY) * 1.0);
    c.restore();
    c.globalAlpha = 1;

    const step = 4;
    for (let i = 0; i < OCEAN_LAYERS; i++) {
        const d = i / (OCEAN_LAYERS - 1);
        const base = hzY + (H * 0.93 - hzY) * Math.pow(d, 1.75);
        const amp = H * (0.0012 + 0.014 * Math.pow(d, 1.3));
        const lam = W * (0.1 + 0.42 * d);
        const dir = i % 2 ? -1 : 1;
        const sp = (0.28 + 0.55 * d) * dir;
        const ph = i * 1.7;
        const k1 = Math.PI * 2 / lam;
        const k2 = k1 / 0.47;

        // مسیر موج
        const next = hzY + (H * 0.93 - hzY) * Math.pow(Math.min(1, (i + 1) / (OCEAN_LAYERS - 1)), 1.75);
        c.beginPath();
        c.moveTo(0, H + 2);
        let prevY = 0;
        for (let x = 0; x <= W + step; x += step) {
            const y = base + amp * (Math.sin(x * k1 + t * sp + ph) + 0.45 * Math.sin(x * k2 - t * sp * 1.35 + ph * 2.1));
            c.lineTo(x, y);
            prevY = y;
        }
        c.lineTo(W + step, H + 2);
        c.closePath();
        const fg = c.createLinearGradient(0, base - amp, 0, Math.max(next, base + amp * 6));
        fg.addColorStop(0, oceanWaterColor(d, false));
        fg.addColorStop(1, oceanWaterColor(Math.min(1, d + 1 / (OCEAN_LAYERS - 1)), true));
        c.fillStyle = fg;
        c.fill();

        // تاج موج که ماه روشنش می‌کند
        c.beginPath();
        for (let x = 0; x <= W + step; x += step) {
            const y = base + amp * (Math.sin(x * k1 + t * sp + ph) + 0.45 * Math.sin(x * k2 - t * sp * 1.35 + ph * 2.1));
            if (x === 0) c.moveTo(x, y); else c.lineTo(x, y);
        }
        c.strokeStyle = oceanMoonGrad;
        c.globalAlpha = 0.06 + 0.22 * d;
        c.lineWidth = px * (0.7 + 1.1 * d);
        c.stroke();

        // کف نرم روی تاج‌های بلند لایه‌های نزدیک
        if (d >= 0.4) {
            c.fillStyle = 'rgb(205,225,250)';
            for (let x = 0; x <= W; x += step * 4) {
                const crest = Math.sin(x * k1 + t * sp + ph);
                if (crest < 0.86) continue;
                const jitter = Math.sin(x * 12.9898 + i * 78.233) * 0.5 + 0.5;
                const y = base + amp * (crest + 0.45 * Math.sin(x * k2 - t * sp * 1.35 + ph * 2.1));
                c.globalAlpha = (crest - 0.86) / 0.14 * (0.12 + 0.2 * d) * (0.4 + jitter);
                const fw = (3 + 7 * d) * (0.5 + jitter) * px;
                c.fillRect(x - fw / 2, y - px * 0.5, fw, px * (1 + d));
            }
        }
        c.globalAlpha = 1;
    }

    // ---- درخشش‌های ماه ----
    c.fillStyle = 'rgb(232,242,255)';
    const waterH = H * 0.93 - hzY;
    for (let i = 0; i < oceanGlints.length; i++) {
        const g = oceanGlints[i];
        const pulse = Math.pow(0.5 + 0.5 * Math.sin(t * g.sp + g.ph), 2);
        const a = g.a * pulse * (1 - 0.45 * g.u);
        if (a < 0.02) continue;
        const y = hzY + waterH * g.u + Math.sin(t * 0.5 + g.ph) * px * (0.4 + g.u * 1.6);
        const x = moonX + W * (g.dx + g.dr * Math.sin(t * 0.3 + g.ph) * 3);
        const gw2 = W * g.w;
        c.globalAlpha = a;
        c.fillRect(x - gw2 / 2, y, gw2, px * (0.8 + 1.8 * g.u));
    }
    c.globalAlpha = 1;

    // ---- مه‌ی افق ----
    const hg = c.createLinearGradient(0, hzY - H * 0.05, 0, hzY + H * 0.05);
    hg.addColorStop(0, 'rgba(120,165,215,0)');
    hg.addColorStop(0.5, 'rgba(140,180,225,0.2)');
    hg.addColorStop(1, 'rgba(120,165,215,0)');
    c.fillStyle = hg;
    c.fillRect(0, hzY - H * 0.05, W, H * 0.1);
}

function oceanFrame(ts) {
    if (!oceanActive) return;
    oceanRaf = requestAnimationFrame(oceanFrame);
    if (!oceanLastTs) oceanLastTs = ts;
    const dt = ts - oceanLastTs;
    if (dt < OCEAN_FRAME_MS) return;
    oceanLastTs = ts;
    oceanElapsed += Math.min(dt, 100) / 1000;
    oceanDraw();
}

function oceanReducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

function startOcean() {
    if (!oceanCanvas) return;
    oceanActive = true;
    oceanCanvas.hidden = false;
    backgroundImage.style.visibility = 'hidden';
    oceanResize();
    oceanDraw();
    cancelAnimationFrame(oceanRaf);
    oceanLastTs = 0;
    // با «کاهش حرکت» فقط یک فریم ثابت رسم می‌شود
    if (!oceanReducedMotion() && !document.hidden) {
        oceanRaf = requestAnimationFrame(oceanFrame);
    }
}

function stopOcean() {
    oceanActive = false;
    cancelAnimationFrame(oceanRaf);
    if (oceanCanvas) oceanCanvas.hidden = true;
}

window.addEventListener('resize', () => {
    if (!oceanActive) return;
    oceanResize();
    oceanDraw();
});

document.addEventListener('visibilitychange', () => {
    if (!oceanActive) return;
    cancelAnimationFrame(oceanRaf);
    if (!document.hidden && !oceanReducedMotion()) {
        oceanLastTs = 0;
        oceanRaf = requestAnimationFrame(oceanFrame);
    }
});

// ============================================
// پس‌زمینه‌ی «برخورد کهکشان‌ها»: شبیه‌سازی گرانشی برخورد دو کهکشان مارپیچی
// مدل «سه‌جسمی محدود» تومره و تومره (۱۹۷۲)، همان مدلی که دم‌های کهکشان‌های آنتن را توضیح داد:
// دو هسته‌ی سنگین هم را جذب می‌کنند و با اصطکاک دینامیکی آخر یکی می‌شوند؛ ستاره‌ها و گاز
// فقط از این دو هسته نیرو می‌گیرند، پس دم‌ها و پل‌ها خودشان شکل می‌گیرند.
// هر جا گاز فشرده شود، خوشه‌های صورتی ستاره‌زایی روشن می‌شوند.
// رسم با WebGL: جمع نور ستاره‌ها، درخشش (bloom)، جذب نور توسط غبار و نگاشت تُن.
// بدون WebGL: نقطه‌ها با Canvas 2D.
// ============================================

let mergerCanvas = document.getElementById('mergerCanvas');
const MERGER_FRAME_MS = 1000 / 30;
const MERGER_GL_PIXELS = 650000;
const MERGER_SPEED = 0.045;       // واحد زمان شبیه‌سازی در هر ثانیه (کل برخورد ≈ ۱۴ دقیقه)
const MERGER_T_START = 1;
const MERGER_T_END = 40;
const MERGER_T_STATIC = 15;       // لحظه‌ای شبیه کهکشان‌های آنتن، برای «کاهش حرکت»
const MERGER_FADE = 4 * MERGER_SPEED;
const MERGER_EPS2 = 0.09;         // نرم‌کننده‌ی گرانش هسته‌ها (Plummer، ε = 0.3)
const MERGER_DISK_R = 1.5;
const MERGER_DT = 0.01;
const MERGER_GRID = 40;           // شبکه‌ی سه‌بعدی برای چگالی گاز
const MERGER_GRID_HALF = 5;
let mergerMode = '';              // '' | 'gl' | '2d'
let mergerGL = null;
let mergerCtx = null;
let mergerW = 0;
let mergerH = 0;
let mergerRaf = 0;
let mergerLastTs = 0;
let mergerActive = false;
let mergerT = 0;
let mergerN = 0;
let mergerPos = null;             // Float64Array، N×3
let mergerVel = null;
let mergerBuf = null;             // Float32Array، N×7 برای GPU: مکان، روشنایی، شعاع نرم، جهت جریان روی صفحه
let mergerAttr = null;            // Float32Array، N×8: رنگ نور، غبار، اندازه‌ی ستاره‌ی تیز، تیز است؟، دانه، نوع
let mergerSmooth = null;          // شعاع لکه‌ی نور هر ذره (واحد جهان)، از روی تراکم اطراف
let mergerKind = null;            // 0 ستاره، 1 غبار، 2 خوشه‌ی ستاره‌زا
let mergerCls = null;             // کلاس رنگ برای نسخه‌ی 2D
let mergerGlow = null;            // روشنایی نرم‌شده‌ی خوشه‌ها
let mergerBase = null;            // چگالی گاز اطراف هر خوشه در دیسک آرام (پیش از برخورد)
let mergerCell = null;
let mergerGrid = null;
let mergerExpect = 1;             // تعداد گاز مورد انتظار در هر خانه‌ی دیسک آرام
let mergerCore = new Float64Array(6);
let mergerCoreV = new Float64Array(6);
let mergerCam = { az: 0, tilt: 0.7, roll: 0 };
let mergerStaticDirty = true;

function mergerRand(a, b) { return a + Math.random() * (b - a); }
function mergerGauss() { return Math.random() + Math.random() + Math.random() - 1.5; }
function mergerVc(r) { return Math.sqrt(r * r / Math.pow(r * r + MERGER_EPS2, 1.5)); }

function mergerReducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

// ساخت دو کهکشان و مدار برخورد
function mergerSetup() {
    const small = Math.max(window.innerWidth, window.innerHeight) < 900;
    const perGal = small ? 6000 : 11000;
    if (mergerN !== perGal * 2) {
        mergerN = perGal * 2;
        mergerPos = new Float64Array(mergerN * 3);
        mergerVel = new Float64Array(mergerN * 3);
        mergerBuf = new Float32Array(mergerN * 7);
        mergerAttr = new Float32Array(mergerN * 8);
        mergerSmooth = new Float32Array(mergerN);
        mergerKind = new Uint8Array(mergerN);
        mergerCls = new Uint8Array(mergerN);
        mergerGlow = new Float32Array(mergerN);
        mergerBase = new Float32Array(mergerN);
        mergerCell = new Int32Array(mergerN);
        mergerGrid = new Uint16Array(MERGER_GRID * MERGER_GRID * MERGER_GRID);
    }
    mergerStaticDirty = true;

    // مدار نسبی کپلری (بیضی e=0.7، کمترین فاصله q)، شروع کمی پیش از نزدیک‌ترین نقطه
    const q = 1.0, e = 0.7, mu = 2, p = q * (1 + e), f = -2.5;
    const r = p / (1 + e * Math.cos(f));
    const k = Math.sqrt(mu / p);
    const vr = k * e * Math.sin(f), vt = k * (1 + e * Math.cos(f));
    const rel = [r * Math.cos(f), r * Math.sin(f), 0];
    const relV = [vr * Math.cos(f) - vt * Math.sin(f), vr * Math.sin(f) + vt * Math.cos(f), 0];
    for (let a = 0; a < 3; a++) {
        mergerCore[a] = -rel[a] / 2; mergerCore[3 + a] = rel[a] / 2;
        mergerCoreV[a] = -relV[a] / 2; mergerCoreV[3 + a] = relV[a] / 2;
    }

    // دیسک‌ها: هر دو هم‌جهت با مدار (prograde) ولی کج؛ همین دم‌های بلند می‌سازد
    const incs = [mergerRand(20, 40), mergerRand(55, 75)].map(d => d * Math.PI / 180);
    const azs = [mergerRand(0, 6.283), mergerRand(0, 6.283)];
    mergerCam.az = mergerRand(-0.4, 0.4);
    mergerCam.tilt = mergerRand(0.55, 0.85);

    const gasExp = [];
    let i = 0;
    for (let g = 0; g < 2; g++) {
        const ci = g * 3;
        const n = [Math.sin(incs[g]) * Math.cos(azs[g]), Math.sin(incs[g]) * Math.sin(azs[g]), Math.cos(incs[g])];
        // u عمود بر n، w = n × u
        let u = Math.abs(n[2]) < 0.9 ? [n[1], -n[0], 0] : [0, n[2], -n[1]];
        const ul = Math.hypot(u[0], u[1], u[2]);
        u = u.map(x => x / ul);
        const w = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]];
        const armPhase = Math.random() * 6.283;
        let gasCount = 0;
        for (let j = 0; j < perGal; j++, i++) {
            const roll = Math.random();
            const o = i * 3, oa = i * 8;
            let kind = 0, rgb, dust = 0, size, soft = 0, cls = 0;
            if (roll < 0.2) {
                // برآمدگی مرکزی: ستاره‌های پیر و گرم روی مدارهای تصادفی
                const rr = 0.02 + Math.pow(Math.random(), 1.6) * 0.45;   // برآمدگی با لبه‌ی نرم
                let dx = mergerGauss(), dy = mergerGauss(), dz = mergerGauss();
                const dl = Math.hypot(dx, dy, dz) || 1;
                dx /= dl; dy /= dl; dz /= dl;
                let tx = mergerGauss(), ty = mergerGauss(), tz = mergerGauss();
                const dot = tx * dx + ty * dy + tz * dz;
                tx -= dot * dx; ty -= dot * dy; tz -= dot * dz;
                const tl = Math.hypot(tx, ty, tz) || 1;
                const v = mergerVc(rr);
                mergerPos[o] = mergerCore[ci] + dx * rr;
                mergerPos[o + 1] = mergerCore[ci + 1] + dy * rr;
                mergerPos[o + 2] = mergerCore[ci + 2] + dz * rr;
                mergerVel[o] = mergerCoreV[ci] + tx / tl * v;
                mergerVel[o + 1] = mergerCoreV[ci + 1] + ty / tl * v;
                mergerVel[o + 2] = mergerCoreV[ci + 2] + tz / tl * v;
                rgb = [0.4, 0.29, 0.18];          // برآمدگی متراکم است؛ نور هر ستاره کمتر
                size = 1.4 + Math.random() * 0.6;
                soft = Math.random() < 0.06 ? 1 : 0;
                cls = 0;
            } else {
                const gas = roll >= 0.72;
                // نیمی نمایی (متمرکز) و نیمی یکنواخت تا لبه، تا دم‌ها ستاره‌ی کافی داشته باشند
                let rr;
                if (Math.random() < 0.5) { do { rr = 0.1 - Math.log(1 - Math.random()) * 0.35; } while (rr > MERGER_DISK_R); }
                else rr = Math.sqrt(Math.random()) * MERGER_DISK_R;
                if (gas && rr < 0.15) rr = 0.15 + Math.random() * 0.4;
                // بازوهای مارپیچی اولیه برای گاز و ستاره‌های جوان
                let th = Math.random() * 6.283;
                if ((gas || rr > 0.4) && Math.random() < 0.6) {
                    th = armPhase + (Math.random() < 0.5 ? 0 : Math.PI) + Math.log(rr / 0.2) / 0.35 + mergerGauss() * 0.3;
                }
                const ct = Math.cos(th), st = Math.sin(th);
                const z = mergerGauss() * (gas ? 0.012 : 0.025);
                const v = mergerVc(rr) * (1 + mergerGauss() * 0.02);
                for (let a = 0; a < 3; a++) {
                    mergerPos[o + a] = mergerCore[ci + a] + rr * (ct * u[a] + st * w[a]) + n[a] * z;
                    mergerVel[o + a] = mergerCoreV[ci + a] + v * (-st * u[a] + ct * w[a]);
                }
                if (!gas) {
                    const blue = Math.min(1, Math.max(0, (rr - 0.2) / 0.7));
                    rgb = [1.0 - 0.4 * blue, 0.85 - 0.08 * blue, 0.66 + 0.34 * blue];
                    size = 1.1 + Math.random() * 1.2;
                    soft = Math.random() < 0.3 ? 1 : 0;
                    cls = blue < 0.33 ? 1 : (blue < 0.66 ? 2 : 3);
                } else if (Math.random() < 0.3) {
                    kind = 2;
                    rgb = [1.0, 0.36, 0.62];
                    size = 1.8 + Math.random() * 1.2;
                    soft = 1;
                    cls = 4;
                    gasCount++;
                } else {
                    kind = 1;
                    rgb = [0, 0, 0];
                    dust = 1;
                    size = 0;
                    soft = 0;
                    cls = 5;
                    gasCount++;
                }
            }
            mergerKind[i] = kind;
            mergerCls[i] = cls;
            mergerGlow[i] = 0;
            mergerAttr[oa] = rgb[0]; mergerAttr[oa + 1] = rgb[1]; mergerAttr[oa + 2] = rgb[2];
            // soft اینجا یعنی «ستاره‌ی تیز هم رسم شود»
            mergerAttr[oa + 3] = dust; mergerAttr[oa + 4] = size; mergerAttr[oa + 5] = soft;
            mergerAttr[oa + 6] = Math.random(); mergerAttr[oa + 7] = kind;
            mergerSmooth[i] = 0.1;
        }
        gasExp.push(gasCount);
    }
    // گاز مورد انتظار در هر خانه برای یک دیسک آرام
    const cell = 2 * MERGER_GRID_HALF / MERGER_GRID;
    mergerExpect = Math.max(1, (gasExp[0] + gasExp[1]) / 2 * cell * cell / (Math.PI * MERGER_DISK_R * MERGER_DISK_R));
    mergerT = 0;
}

// یک گام زمانی (اویلر سیمپلکتیک): اول ستاره‌ها با جای فعلی هسته‌ها، بعد خود هسته‌ها
function mergerStep(dt) {
    const c = mergerCore, cv = mergerCoreV;
    const P = mergerPos, V = mergerVel;
    const ax = c[0], ay = c[1], az = c[2], bx = c[3], by = c[4], bz = c[5];
    for (let o = 0, n3 = mergerN * 3; o < n3; o += 3) {
        const x = P[o], y = P[o + 1], z = P[o + 2];
        let dx = ax - x, dy = ay - y, dz = az - z;
        let d2 = dx * dx + dy * dy + dz * dz + MERGER_EPS2;
        let inv = 1 / (d2 * Math.sqrt(d2));
        let fx = dx * inv, fy = dy * inv, fz = dz * inv;
        dx = bx - x; dy = by - y; dz = bz - z;
        d2 = dx * dx + dy * dy + dz * dz + MERGER_EPS2;
        inv = 1 / (d2 * Math.sqrt(d2));
        fx += dx * inv; fy += dy * inv; fz += dz * inv;
        V[o] += fx * dt; V[o + 1] += fy * dt; V[o + 2] += fz * dt;
        P[o] += V[o] * dt; P[o + 1] += V[o + 1] * dt; P[o + 2] += V[o + 2] * dt;
    }
    // هسته‌ها: گرانش متقابل + اصطکاک دینامیکی وقتی هاله‌ها در هم فرو می‌روند
    const dx = bx - ax, dy = by - ay, dz = bz - az;
    const r2 = dx * dx + dy * dy + dz * dz;
    const d2 = r2 + 0.25;
    const inv = 1 / (d2 * Math.sqrt(d2));
    const drag = 0.05 * Math.exp(-Math.sqrt(r2) / 1.6);
    const rvx = cv[3] - cv[0], rvy = cv[4] - cv[1], rvz = cv[5] - cv[2];
    cv[0] += (dx * inv + drag * rvx * 0.5) * dt;
    cv[1] += (dy * inv + drag * rvy * 0.5) * dt;
    cv[2] += (dz * inv + drag * rvz * 0.5) * dt;
    cv[3] += (-dx * inv - drag * rvx * 0.5) * dt;
    cv[4] += (-dy * inv - drag * rvy * 0.5) * dt;
    cv[5] += (-dz * inv - drag * rvz * 0.5) * dt;
    for (let a = 0; a < 6; a++) c[a] += cv[a] * dt;
    mergerT += dt;
}

function mergerAdvance(simDt) {
    const steps = Math.max(1, Math.ceil(simDt / MERGER_DT - 1e-6));
    const dt = simDt / steps;
    for (let s = 0; s < steps; s++) mergerStep(dt);
}

// از ابتدا تا زمان t (برای شروع، تکرار حلقه و حالت ثابت)
function mergerSeek(t) {
    mergerSetup();
    mergerUpdateGlow(0, true, true);
    mergerUpdateRoll(0, true);
    mergerAdvance(t);
    mergerUpdateGlow(0, true);
    mergerUpdateRoll(0, true);
}

// چگالی گاز در شبکه‌ی سه‌بعدی → روشنایی خوشه‌های ستاره‌زا (آرام عوض می‌شود)
function mergerUpdateGlow(dtReal, instant, setBase) {
    const G = MERGER_GRID, H = MERGER_GRID_HALF, sc = G / (2 * H);
    const grid = mergerGrid, P = mergerPos;
    grid.fill(0);
    for (let i = 0; i < mergerN; i++) {
        const o = i * 3;
        const gx = Math.floor((P[o] + H) * sc), gy = Math.floor((P[o + 1] + H) * sc), gz = Math.floor((P[o + 2] + H) * sc);
        if (gx < 0 || gy < 0 || gz < 0 || gx >= G || gy >= G || gz >= G) { mergerCell[i] = -1; continue; }
        const cell = (gz * G + gy) * G + gx;
        mergerCell[i] = cell;
        if (grid[cell] < 65535) grid[cell]++;
    }
    const k = instant ? 1 : Math.min(1, dtReal / 2.5);
    const ks = instant ? 1 : Math.min(1, dtReal / 1.2);
    const ref = mergerN / 13000;
    for (let i = 0; i < mergerN; i++) {
        const cell = mergerCell[i];
        const count = cell < 0 ? 0 : grid[cell];
        // شعاع لکه‌ی نور: جای شلوغ کوچک و تیز، جای خلوت بزرگ و کم‌نور (مثل نمایش SPH)
        let hT = Math.min(0.24, Math.max(0.02, 0.25 * Math.sqrt(6 / Math.max(count, 0.5))));
        if (mergerKind[i] === 2) hT = Math.min(hT * 0.6, 0.1);
        else if (mergerKind[i] === 1) hT *= 1.3;
        mergerSmooth[i] += (hT - mergerSmooth[i]) * ks;
        if (mergerKind[i] === 0) {
            // ستاره‌های تنها (ذره‌های پراکنده‌ی دم) کم‌نورترند؛ دم‌های پرستاره روشن می‌مانند
            const x = Math.min(1, Math.max(0, (count / ref - 1) / 13));
            mergerGlow[i] += (0.1 + 0.9 * x * (2 - x) - mergerGlow[i]) * ks;
            continue;
        }
        if (mergerKind[i] !== 2) continue;
        if (setBase) mergerBase[i] = Math.max(count, mergerExpect * 0.5);
        // فشرده‌تر شدن گاز نسبت به حالت آرام خودش → ستاره‌زایی
        const ratio = count / mergerBase[i];
        let target = Math.min(1, Math.max(0, (ratio - 1.3) / 1.7));
        target = 0.1 * Math.min(1, ratio * ratio) + 0.9 * target * target * (3 - 2 * target);
        mergerGlow[i] += (target - mergerGlow[i]) * k;
    }
}

// دوربین: ردیف‌های ماتریس چرخش (x و y صفحه) + مقیاس
function mergerCamera() {
    const portrait = mergerW < mergerH;
    const ca = Math.cos(mergerCam.az), sa = Math.sin(mergerCam.az);
    const ct = Math.cos(mergerCam.tilt), stl = Math.sin(mergerCam.tilt);
    const roll = mergerCam.roll + (portrait ? Math.PI / 2 - 0.25 : 0.3);
    const cr = Math.cos(roll), sr = Math.sin(roll);
    // R = Rz(roll) · Rx(tilt) · Rz(az)
    const a0 = [ca, -sa, 0];
    const a1 = [sa * ct, ca * ct, -stl];
    const rx = [cr * a0[0] - sr * a1[0], cr * a0[1] - sr * a1[1], cr * a0[2] - sr * a1[2]];
    const ry = [sr * a0[0] + cr * a1[0], sr * a0[1] + cr * a1[1], sr * a0[2] + cr * a1[2]];
    // با جلو رفتن برخورد کمی نزدیک‌تر می‌شویم
    // با بلند شدن دم‌ها عقب می‌رویم و وقتی دم‌ها کم‌رنگ شدند دوباره نزدیک می‌شویم
    const ease = (a, b) => { const x = Math.min(1, Math.max(0, (mergerT - a) / (b - a))); return x * x * (3 - 2 * x); };
    const span = 4.6 + 1.8 * ease(5, 10) - 2.2 * ease(14, 24);   // واحدهایی که در ضلع کوتاه صفحه دیده می‌شود
    const s = Math.min(mergerW, mergerH) / span;           // پیکسل در هر واحد
    return { rx, ry, s };
}

// دوربین آرام می‌چرخد تا خط میان دو هسته کمی مورب در امتداد ضلع بلند صفحه بماند
function mergerUpdateRoll(dtReal, instant) {
    const c = mergerCore;
    const dx = c[3] - c[0], dy = c[4] - c[1], dz = c[5] - c[2];
    const ca = Math.cos(mergerCam.az), sa = Math.sin(mergerCam.az);
    const ct = Math.cos(mergerCam.tilt), stl = Math.sin(mergerCam.tilt);
    const px = ca * dx - sa * dy;
    const py = sa * ct * dx + ca * ct * dy - stl * dz;
    const len = Math.hypot(px, py);
    if (len < 0.8 && !instant) return;           // هسته‌ها خیلی نزدیک‌اند؛ جهت معنایی ندارد
    let target = -Math.atan2(py, px);
    let d = target - mergerCam.roll;
    d = Math.atan2(Math.sin(2 * d), Math.cos(2 * d)) / 2;   // خط جهت ندارد: پیمانه‌ی π
    mergerCam.roll += instant ? d : d * Math.min(1, dtReal / 60);
}

function mergerFadeLevel() {
    const a = Math.min(1, Math.max(0, (mergerT - MERGER_T_START) / MERGER_FADE));
    const b = Math.min(1, Math.max(0, (MERGER_T_END - mergerT) / MERGER_FADE));
    return mergerReducedMotion() ? 1 : Math.min(a, b);
}

// ---------- WebGL ----------
const MERGER_FS_VERT = 'attribute vec2 p;varying vec2 vUv;void main(){vUv=p*0.5+0.5;gl_Position=vec4(p,0.0,1.0);}';
const MERGER_PT_VERT = `
attribute vec4 aPos;    // مکان، روشنایی
attribute vec3 aDyn;    // شعاع لکه (واحد جهان)، جهت جریان روی صفحه
attribute vec4 aCol;    // رنگ نور، غبار
attribute vec4 aSz;     // اندازه‌ی ستاره‌ی تیز، تیز است؟، دانه‌ی تصادفی، نوع
uniform vec3 uRx;
uniform vec3 uRy;
uniform vec2 uScale;
uniform float uPx;      // پیکسل در هر واحد جهان
uniform float uStarPx;
uniform float uPass;    // ۰: نور پخش و غبار، ۱: ستاره‌های تیز
uniform float uFlux;
uniform float uDustK;
uniform float uSharp;
varying vec4 vCol;
varying vec2 vDir;
varying float vE;
varying float vMode;
varying float vSeed;
void main(){
    gl_Position = vec4(vec2(dot(uRx, aPos.xyz), dot(uRy, aPos.xyz)) * uScale, 0.0, 1.0);
    vSeed = aSz.z;
    vec2 dir = aDyn.yz * uScale;
    float dl = length(dir);
    vDir = dl > 1e-6 ? dir / dl : vec2(1.0, 0.0);
    if (uPass > 0.5) {
        vE = 1.0;
        vMode = 2.0;
        if (aSz.y < 0.5) {
            gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
            gl_PointSize = 1.0;
            vCol = vec4(0.0);
            return;
        }
        gl_PointSize = aSz.x * uStarPx;
        vCol = vec4(aCol.rgb * aPos.w * uSharp, 0.0);
        return;
    }
    bool dust = aCol.a > 0.0;
    float lum = aSz.w > 1.5 ? aPos.w * 10.0 : 1.0;          // خوشه‌ها: روشنایی از فشردگی گاز
    float ps = clamp(3.2 * aDyn.x * uPx, 1.5, 64.0);
    float e = dust ? 2.4 : 1.0 + min(0.7, aDyn.x * 3.0);   // کشیدگی در جهت جریان
    // شار ثابت: روشنایی سطحی به اندازه‌ی لکه و بزرگ‌نمایی بستگی ندارد
    float k = uPx * uPx * 4.5 * e / (ps * ps);
    vCol = dust ? vec4(0.0, 0.0, 0.0, aCol.a * uDustK * k) : vec4(aCol.rgb * lum * uFlux * k, 0.0);
    vE = e;
    vMode = dust ? 1.0 : 0.0;
    gl_PointSize = ps;
}`;
const MERGER_PT_FRAG = `
precision mediump float;
varying vec4 vCol;
varying vec2 vDir;
varying float vE;
varying float vMode;
varying float vSeed;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
void main(){
    vec2 d = gl_PointCoord - 0.5;
    d.y = -d.y;
    if (vMode > 1.5) {
        gl_FragColor = vCol * exp(-dot(d, d) * 14.0);
        return;
    }
    vec2 q = vec2(dot(d, vDir), dot(d, vec2(-vDir.y, vDir.x)));
    float f = exp(-(q.x * q.x + q.y * q.y * vE * vE) * 14.0);
    if (vMode > 0.5) {
        // غبار: رگه‌های رشته‌ای در امتداد جریان
        float n = noise(q * vec2(5.0, 16.0) + vSeed * 53.0);
        f *= smoothstep(0.25, 0.85, n) * 1.8;
    }
    gl_FragColor = vCol * f;
}`;
const MERGER_DOWN_FRAG = `
precision mediump float;
uniform sampler2D uTex;
uniform vec2 uTexel;
varying vec2 vUv;
void main(){
    gl_FragColor = 0.25 * (texture2D(uTex, vUv + uTexel * vec2(-1.0, -1.0)) + texture2D(uTex, vUv + uTexel * vec2(1.0, -1.0))
                         + texture2D(uTex, vUv + uTexel * vec2(-1.0, 1.0)) + texture2D(uTex, vUv + uTexel * vec2(1.0, 1.0)));
}`;
const MERGER_BLUR_FRAG = `
precision mediump float;
uniform sampler2D uTex;
uniform vec2 uDir;
varying vec2 vUv;
void main(){
    vec4 s = texture2D(uTex, vUv) * 0.2270;
    s += (texture2D(uTex, vUv + uDir * 1.3846) + texture2D(uTex, vUv - uDir * 1.3846)) * 0.3162;
    s += (texture2D(uTex, vUv + uDir * 3.2308) + texture2D(uTex, vUv - uDir * 3.2308)) * 0.0703;
    gl_FragColor = s;
}`;
const MERGER_COMP_FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uA;
uniform sampler2D uB;
uniform vec2 uRes;
uniform float uGain;
uniform float uFade;
uniform float uTime;
varying vec2 vUv;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main(){
    vec4 a = texture2D(uA, vUv) * uGain;
    vec4 b = texture2D(uB, vUv) * uGain;
    // نور تیز ستاره‌ها + نور پخش‌شده (میلیاردها ستاره‌ی تفکیک‌نشده)
    vec3 light = a.rgb + b.rgb * 0.4;
    // غبار نور آبی را بیشتر می‌گیرد → رگه‌های قهوه‌ای
    float dust = a.a + b.a * 0.3;
    dust = dust / (1.0 + dust * 0.4);   // غبار خیلی متراکم سیاه مطلق نشود
    light *= exp(-dust * vec3(1.8, 2.3, 3.0));
    vec3 col = (1.0 - exp(-pow(light, vec3(0.85)) * 1.7)) * uFade;   // منحنی نرم‌تر تا دم‌های کم‌نور هم دیده شوند

    // آسمان پس‌زمینه: ستاره‌های دور و چند کهکشان کوچک دوردست (ثابت روی صفحه)
    vec2 sc = gl_FragCoord.xy / uRes.y * 300.0;
    float sh = hash(floor(sc));
    float sky = step(0.986, sh) * smoothstep(0.42, 0.0, length(fract(sc) - 0.5)) * (0.2 + 0.6 * fract(sh * 91.7));
    sky *= 0.8 + 0.2 * sin(uTime * (0.5 + sh) + sh * 30.0);
    vec2 gc = gl_FragCoord.xy / uRes.y * 14.0;
    float gh = hash(floor(gc) + 17.0);
    vec2 gp = fract(gc) - 0.5;
    float ang = gh * 31.0;
    gp = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * gp * vec2(1.0, 2.6);
    float far = step(0.93, gh) * exp(-dot(gp, gp) * 900.0) * 0.35;
    vec3 bg = vec3(0.012, 0.014, 0.022) + sky * vec3(0.85, 0.9, 1.0) + far * vec3(1.0, 0.7, 0.45);
    col += bg * (1.0 - clamp(dot(col, vec3(0.33)) * 3.0, 0.0, 1.0));

    vec2 v = vUv - 0.5;
    col *= 1.0 - 0.5 * dot(v, v);
    gl_FragColor = vec4(col, 1.0);
}`;

function mergerProgram(gl, vsrc, fsrc, attrs) {
    const compile = (type, src) => {
        const sh = gl.createShader(type);
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
            console.warn('merger shader:', gl.getShaderInfoLog(sh));
            return null;
        }
        return sh;
    };
    const vs = compile(gl.VERTEX_SHADER, vsrc);
    const fs = compile(gl.FRAGMENT_SHADER, fsrc);
    if (!vs || !fs) return null;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    attrs.forEach((name, idx) => gl.bindAttribLocation(prog, idx, name));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    const u = {};
    const count = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
    for (let k = 0; k < count; k++) {
        const info = gl.getActiveUniform(prog, k);
        u[info.name] = gl.getUniformLocation(prog, info.name);
    }
    return { prog, u };
}

function mergerTarget(o, w, h) {
    const gl = o.gl;
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, o.type, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, o.filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, o.filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    if (!ok) { gl.deleteTexture(tex); gl.deleteFramebuffer(fb); return null; }
    return { tex, fb, w, h };
}

function mergerFreeTargets(o) {
    ['A', 'B', 'C'].forEach(k => {
        if (!o[k]) return;
        o.gl.deleteTexture(o[k].tex);
        o.gl.deleteFramebuffer(o[k].fb);
        o[k] = null;
    });
}

// اگر بافت نیم‌شناور (HDR) شد، از آن استفاده می‌کنیم؛ وگرنه ۸ بیتی با نور کم‌تر
function mergerBuildTargets(o) {
    mergerFreeTargets(o);
    const gl = o.gl;
    const bw = Math.max(1, Math.round(mergerW / 4)), bh = Math.max(1, Math.round(mergerH / 4));
    const tryMake = () => {
        o.A = mergerTarget(o, mergerW, mergerH);
        o.B = o.A && mergerTarget(o, bw, bh);
        o.C = o.B && mergerTarget(o, bw, bh);
        return !!o.C;
    };
    if (o.half) {
        o.type = o.half.HALF_FLOAT_OES;
        o.filter = o.halfLinear ? gl.LINEAR : gl.NEAREST;
        o.gain = 1;
        if (tryMake()) return true;
        mergerFreeTargets(o);
        o.half = null;
    }
    o.type = gl.UNSIGNED_BYTE;
    o.filter = gl.LINEAR;
    o.gain = 4;
    return tryMake();
}

function mergerInitGL() {
    let gl = null;
    try {
        const opts = { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' };
        gl = mergerCanvas.getContext('webgl', opts) || mergerCanvas.getContext('experimental-webgl', opts);
    } catch (err) {
        gl = null;
    }
    if (!gl) return null;
    const pts = mergerProgram(gl, MERGER_PT_VERT, MERGER_PT_FRAG, ['aPos', 'aDyn', 'aCol', 'aSz']);
    const down = mergerProgram(gl, MERGER_FS_VERT, MERGER_DOWN_FRAG, ['p']);
    const blur = mergerProgram(gl, MERGER_FS_VERT, MERGER_BLUR_FRAG, ['p']);
    const comp = mergerProgram(gl, MERGER_FS_VERT, MERGER_COMP_FRAG, ['p']);
    if (!pts || !down || !blur || !comp) return null;
    const o = { gl, pts, down, blur, comp, A: null, B: null, C: null };
    o.half = gl.getExtension('OES_texture_half_float');
    o.halfLinear = !!gl.getExtension('OES_texture_half_float_linear');
    gl.getExtension('EXT_color_buffer_half_float');
    o.tri = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, o.tri);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    o.dyn = gl.createBuffer();
    o.stat = gl.createBuffer();
    mergerStaticDirty = true;
    return o;
}

function mergerFullscreen(o, prog, target) {
    const gl = o.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.fb : null);
    gl.viewport(0, 0, target ? target.w : mergerW, target ? target.h : mergerH);
    gl.useProgram(prog.prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, o.tri);
    gl.enableVertexAttribArray(0);
    gl.disableVertexAttribArray(1);
    gl.disableVertexAttribArray(2);
    gl.disableVertexAttribArray(3);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
}

function mergerDrawGL() {
    const o = mergerGL;
    if (!o || !o.A) return;
    const gl = o.gl;
    const cam = mergerCamera();

    // داده‌ی هر فریم: مکان، روشنایی، شعاع لکه و جهت حرکت نسبت به هسته‌ی نزدیک‌تر (روی صفحه)
    const B = mergerBuf, P = mergerPos, V = mergerVel, c = mergerCore, cv = mergerCoreV;
    const rx = cam.rx, ry = cam.ry;
    for (let i = 0; i < mergerN; i++) {
        const o7 = i * 7, o3 = i * 3;
        const x = P[o3], y = P[o3 + 1], z = P[o3 + 2];
        const da = (x - c[0]) ** 2 + (y - c[1]) ** 2 + (z - c[2]) ** 2;
        const db = (x - c[3]) ** 2 + (y - c[4]) ** 2 + (z - c[5]) ** 2;
        const ci = da < db ? 0 : 3;
        const vx = V[o3] - cv[ci], vy = V[o3 + 1] - cv[ci + 1], vz = V[o3 + 2] - cv[ci + 2];
        B[o7] = x; B[o7 + 1] = y; B[o7 + 2] = z;
        B[o7 + 3] = mergerKind[i] === 1 ? 1 : mergerGlow[i];
        B[o7 + 4] = mergerSmooth[i];
        B[o7 + 5] = rx[0] * vx + rx[1] * vy + rx[2] * vz;
        B[o7 + 6] = ry[0] * vx + ry[1] * vy + ry[2] * vz;
    }

    // ۱) نور و غبار ذره‌ها جمع می‌شود
    gl.bindFramebuffer(gl.FRAMEBUFFER, o.A.fb);
    gl.viewport(0, 0, o.A.w, o.A.h);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.useProgram(o.pts.prog);
    const g = 1 / o.gain;
    const u = o.pts.u;
    gl.uniform3f(u.uRx, rx[0], rx[1], rx[2]);
    gl.uniform3f(u.uRy, ry[0], ry[1], ry[2]);
    gl.uniform2f(u.uScale, 2 * cam.s / mergerW, 2 * cam.s / mergerH);
    gl.uniform1f(u.uPx, cam.s);
    gl.uniform1f(u.uStarPx, Math.max(1, mergerH / 700));
    gl.uniform1f(u.uFlux, 6 / mergerN * g);
    gl.uniform1f(u.uDustK, 6 / mergerN * g);
    gl.uniform1f(u.uSharp, 0.9 * g);
    gl.bindBuffer(gl.ARRAY_BUFFER, o.dyn);
    gl.bufferData(gl.ARRAY_BUFFER, B, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 28, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 28, 16);
    gl.bindBuffer(gl.ARRAY_BUFFER, o.stat);
    if (mergerStaticDirty) {
        gl.bufferData(gl.ARRAY_BUFFER, mergerAttr, gl.STATIC_DRAW);
        mergerStaticDirty = false;
    }
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 32, 0);
    gl.enableVertexAttribArray(3);
    gl.vertexAttribPointer(3, 4, gl.FLOAT, false, 32, 16);
    gl.uniform1f(u.uPass, 0);
    gl.drawArrays(gl.POINTS, 0, mergerN);
    gl.uniform1f(u.uPass, 1);
    gl.drawArrays(gl.POINTS, 0, mergerN);
    gl.disable(gl.BLEND);

    // ۲) کوچک‌سازی و تار کردن برای درخشش و غبار نرم
    gl.activeTexture(gl.TEXTURE0);
    mergerFullscreen(o, o.down, o.B);
    gl.uniform1i(o.down.u.uTex, 0);
    gl.uniform2f(o.down.u.uTexel, 1 / o.A.w, 1 / o.A.h);
    gl.bindTexture(gl.TEXTURE_2D, o.A.tex);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    for (let pass = 0; pass < 2; pass++) {
        mergerFullscreen(o, o.blur, o.C);
        gl.uniform1i(o.blur.u.uTex, 0);
        gl.uniform2f(o.blur.u.uDir, (pass + 1) / o.B.w, 0);
        gl.bindTexture(gl.TEXTURE_2D, o.B.tex);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        mergerFullscreen(o, o.blur, o.B);
        gl.uniform2f(o.blur.u.uDir, 0, (pass + 1) / o.B.h);
        gl.bindTexture(gl.TEXTURE_2D, o.C.tex);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    // ۳) ترکیب نهایی روی صفحه
    mergerFullscreen(o, o.comp, null);
    gl.uniform1i(o.comp.u.uA, 0);
    gl.uniform1i(o.comp.u.uB, 1);
    gl.uniform2f(o.comp.u.uRes, mergerW, mergerH);
    gl.uniform1f(o.comp.u.uGain, o.gain);
    gl.uniform1f(o.comp.u.uFade, mergerFadeLevel());
    gl.uniform1f(o.comp.u.uTime, mergerReducedMotion() ? 0 : (performance.now() / 1000) % 1000);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, o.B.tex);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, o.A.tex);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

// ---------- Canvas 2D (پشتیبان) ----------
const MERGER_2D_COLORS = ['#ffc98a', '#ffe2bd', '#e6e4f2', '#a9c0ff', '#ff6fa8'];
function mergerDraw2D() {
    const c = mergerCtx;
    if (!c) return;
    const cam = mergerCamera();
    const cx = mergerW / 2, cy = mergerH / 2, P = mergerPos;
    c.globalCompositeOperation = 'source-over';
    c.globalAlpha = 1;
    c.fillStyle = '#030409';
    c.fillRect(0, 0, mergerW, mergerH);
    c.globalCompositeOperation = 'lighter';
    const fade = mergerFadeLevel();
    for (let k = 0; k < MERGER_2D_COLORS.length; k++) {
        c.fillStyle = MERGER_2D_COLORS[k];
        const size = k === 4 ? 3 : 1.5;
        for (let i = 0; i < mergerN; i++) {
            if (mergerCls[i] !== k) continue;
            const o = i * 3;
            const x = cx + (cam.rx[0] * P[o] + cam.rx[1] * P[o + 1] + cam.rx[2] * P[o + 2]) * cam.s;
            const y = cy - (cam.ry[0] * P[o] + cam.ry[1] * P[o + 1] + cam.ry[2] * P[o + 2]) * cam.s;
            c.globalAlpha = fade * (k === 4 ? mergerGlow[i] * 0.8 : 0.55);
            c.fillRect(x, y, size, size);
        }
    }
    c.globalAlpha = 1;
    c.globalCompositeOperation = 'source-over';
}

function mergerResize() {
    if (!mergerCanvas) return;
    if (!mergerMode) {
        mergerGL = mergerInitGL();
        if (mergerGL) {
            mergerMode = 'gl';
            mergerCanvas.addEventListener('webglcontextlost', (e) => {
                e.preventDefault();
                cancelAnimationFrame(mergerRaf);
            });
            mergerCanvas.addEventListener('webglcontextrestored', () => {
                mergerGL = mergerInitGL();
                if (mergerGL && mergerActive) startMerger();
            });
        } else {
            mergerMode = '2d';
            // بومی که getContext('webgl') رویش صدا زده شده دیگر 2D نمی‌دهد
            const fresh = mergerCanvas.cloneNode(false);
            mergerCanvas.replaceWith(fresh);
            mergerCanvas = fresh;
        }
    }
    const cssW = window.innerWidth;
    const cssH = window.innerHeight;
    let scale = 0.75;
    if (cssW * cssH * scale * scale > MERGER_GL_PIXELS) scale = Math.sqrt(MERGER_GL_PIXELS / (cssW * cssH));
    mergerW = Math.max(4, Math.round(cssW * scale));
    mergerH = Math.max(4, Math.round(cssH * scale));
    mergerCanvas.width = mergerW;
    mergerCanvas.height = mergerH;
    if (mergerMode === 'gl' && mergerGL && !mergerBuildTargets(mergerGL)) {
        console.warn('merger: no render target');
    }
    if (mergerMode === '2d') mergerCtx = mergerCanvas.getContext('2d');
}

function mergerDraw() {
    if (!mergerN) return;
    if (mergerMode === 'gl') mergerDrawGL();
    else mergerDraw2D();
}

function mergerFrame(ts) {
    if (!mergerActive) return;
    mergerRaf = requestAnimationFrame(mergerFrame);
    if (!mergerLastTs) mergerLastTs = ts;
    const dt = ts - mergerLastTs;
    if (dt < MERGER_FRAME_MS) return;
    mergerLastTs = ts;
    const real = Math.min(dt, 100) / 1000;
    mergerAdvance(real * MERGER_SPEED);
    if (mergerT >= MERGER_T_END) mergerSeek(MERGER_T_START);   // برخورد بعدی با زاویه‌ای تازه
    else {
        mergerUpdateGlow(real, false);
        mergerUpdateRoll(real, false);
    }
    mergerDraw();
}

function startMerger() {
    if (!mergerCanvas) return;
    mergerActive = true;
    mergerResize();
    mergerCanvas.hidden = false;
    backgroundImage.style.visibility = 'hidden';
    if (mergerReducedMotion()) mergerSeek(MERGER_T_STATIC);
    else if (!mergerN) mergerSeek(MERGER_T_START);
    mergerDraw();
    cancelAnimationFrame(mergerRaf);
    mergerLastTs = 0;
    if (!mergerReducedMotion() && !document.hidden) {
        mergerRaf = requestAnimationFrame(mergerFrame);
    }
}

function stopMerger() {
    mergerActive = false;
    cancelAnimationFrame(mergerRaf);
    if (mergerCanvas) mergerCanvas.hidden = true;
}

window.addEventListener('resize', () => {
    if (!mergerActive) return;
    mergerResize();
    mergerDraw();
});

document.addEventListener('visibilitychange', () => {
    if (!mergerActive) return;
    cancelAnimationFrame(mergerRaf);
    if (!document.hidden && !mergerReducedMotion()) {
        mergerLastTs = 0;
        mergerRaf = requestAnimationFrame(mergerFrame);
    }
});

// ============================================
// پس‌زمینه‌ی «چراغ روغنی»: یک چراغ روغنی روشن در اتاقی تاریک، با شیدر WebGL
// شعله از یک پروفایل قطره‌ای با نوسان نرم ساخته می‌شود (هسته‌ی تیره‌ی بخار، منطقه‌ی زرد، لبه‌ی نارنجی و
// پایه‌ی آبی)، و نور آن روی دیوار، بدنه‌ی موم، حوضچه‌ی موم مذاب و ذره‌های گردوغبار می‌افتد.
// بدون WebGL یک نسخه‌ی ساده‌ی Canvas 2D رسم می‌شود.
// ============================================

let candleCanvas = document.getElementById('candleCanvas');
const CANDLE_GL_PIXELS = 1300000;
const CANDLE_FRAME_MS = 1000 / 60 - 2;
let candleW = 0;
let candleH = 0;
let candleRaf = 0;
let candleLastTs = 0;
let candleElapsed = 12;
let candleActive = false;
let candleMode = '';          // '' | 'gl' | '2d'
let candleGL = null;
let candleCtx = null;

const CANDLE_VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}';
const CANDLE_FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;
uniform float uMotion;   // ۰ با «کاهش حرکت»

uniform sampler2D uTex;      // عکس چراغ سفالی، شعله‌ی عکس پاک شده
uniform float uTexOn;

// هندسه (واحد: ارتفاع عکس)
const vec2 TIP = vec2(0.603, 0.419);  // سر فتیله در عکس (از بالا)
const float TEXA = 1.2966;            // نسبت پهنا به ارتفاع عکس
const float YT = -0.02;               // سر فتیله در صحنه
const float HF = 0.30;                // ارتفاع شعله (هم‌اندازه‌ی شعله‌ی عکس)
const float YB = YT - 0.012;          // پایه‌ی شعله
const float FW = 0.056;               // نیم‌پهنای شعله
const vec3 LCOL = vec3(1.0, 0.57, 0.25);

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

float fbm(vec2 p) {
    float s = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
        s += a * noise(p);
        p = p * 2.03 + vec2(17.1, 9.3);
        a *= 0.5;
    }
    return s;
}

float tn(float x) {
    float i = floor(x);
    float f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(hash(vec2(i, 3.7)), hash(vec2(i + 1.0, 3.7)), f);
}

// جابه‌جایی افقی خط مرکزی شعله در ارتفاع نسبی h
float flameSway(float h, float t, float lean) {
    h = clamp(h, 0.0, 1.0);
    return 0.8 * (lean * h * h
        + (noise(vec2(t * 2.7, h * 1.6 + 1.0)) - 0.5) * 0.014 * h
        + (noise(vec2(t * 6.9 + 4.0, h * 2.7)) - 0.5) * 0.006 * h * h);
}

vec3 ramp(float T) {
    vec3 c = mix(vec3(0.50, 0.05, 0.0), vec3(1.0, 0.36, 0.04), smoothstep(0.0, 0.35, T));
    c = mix(c, vec3(1.0, 0.70, 0.20), smoothstep(0.3, 0.65, T));
    c = mix(c, vec3(1.0, 0.84, 0.42), smoothstep(0.6, 0.9, T));
    c = mix(c, vec3(1.0, 0.96, 0.78), smoothstep(0.9, 1.0, T));
    return c;
}

// خود شعله (نور خروجی، HDR)
vec3 flame(vec2 p, float t, float lean, float Hf, float Fw, float L) {
    vec2 q = p - vec2(0.0, YB);
    float h = q.y / Hf;
    if (h < -0.2 || h > 1.15) return vec3(0.0);
    float hc = clamp(h, 0.0, 1.0);
    float x = q.x - flameSway(h, t, lean);
    x += (noise(vec2(hc * 5.0 - t * 4.5, 3.3 + t * 1.1)) - 0.5) * 0.006 * hc * uMotion;
    float w = Fw * pow(sin(3.14159 * pow(hc, 0.62)), 0.9) * (1.0 - 0.25 * hc);
    float s = abs(x) - w;                       // منفی یعنی داخل شعله
    float soft = 0.0035 + 0.004 * hc;
    float a = 1.0 - smoothstep(-soft, soft * 1.6, s);
    a *= 1.0 - smoothstep(0.82, 1.0, h);   // نوک شعله نرم محو شود، نه بریده
    float d = clamp(-s / max(w, 0.0008), 0.0, 1.0);
    float T = pow(d, 0.75);
    float vp = exp(-pow((h - 0.25) / 0.38, 2.0));
    T *= 0.45 + 0.55 * vp;
    T *= 1.0 - 0.55 * smoothstep(0.5, 1.0, h);
    float I = mix(0.40, 1.9, smoothstep(0.0, 1.0, T));
    // هسته‌ی تیره‌ی بخار دور فتیله
    float vapor = exp(-pow(x / (0.0055 + 0.009 * hc), 2.0))
        * smoothstep(0.10, 0.20, h) * (1.0 - smoothstep(0.34, 0.62, h));
    I *= 1.0 - 0.45 * vapor;
    // رگه‌های ریز در حال بالا رفتن
    I *= 0.88 + 0.24 * noise(vec2(x * 140.0, h * 6.0 - t * 5.0));
    I *= mix(0.08, 1.0, smoothstep(0.05, 0.32, h));   // پایین شعله شفاف تا فتیله‌ی عکس دیده شود
    vec3 c = ramp(T) * I * a;
    // پایه‌ی آبی
    float bl = exp(-pow(h / 0.17, 2.0)) * (0.45 + 0.55 * (1.0 - d)) * a;
    bl *= 1.0 - 0.5 * smoothstep(0.08, 0.2, h) * exp(-pow(x / 0.012, 2.0));   // کنار فتیله آبی کمتر، تیره‌تر
    c += vec3(0.10, 0.28, 1.0) * 0.9 * bl * smoothstep(0.35, 0.8, 1.0 - d);   // آبی فقط لبه‌ی نازک پایین
    return c * L * smoothstep(-0.03, 0.03, h);   // زیر پایه‌ی شعله چیزی نماند
}

// ذره‌های گردوغبار که در نور شمع می‌درخشند
vec3 motes(vec2 p, float t, vec3 LP) {
    vec3 c = vec3(0.0);
    for (int k = 0; k < 2; k++) {
        float fk = float(k);
        float sc = 7.0 + 6.0 * fk;
        vec2 q = p * sc;
        q.y -= t * (0.35 + 0.2 * fk) * uMotion;
        q += vec2(fk * 21.0, fk * 8.0);
        vec2 id = floor(q);
        vec2 f = fract(q);
        float h = hash(id + 5.0);
        float occ = step(0.72, hash(id + 9.0));
        vec2 pos = vec2(0.5) + 0.2 * vec2(sin(t * 0.7 * uMotion + h * 6.28), cos(t * 0.5 * uMotion + h * 9.0));
        pos += (vec2(hash(id), hash(id + 2.0)) - 0.5) * 0.3;
        float d = length(f - pos) / sc;
        float r = 0.0022 + 0.0014 * hash(id + 4.0);
        float dot_ = (1.0 - smoothstep(r * 0.4, r, d));
        vec2 dl = p - LP.xy;
        float I = 0.0035 / (dot(dl, dl) + 0.012);
        float tw = 0.6 + 0.4 * sin(t * 1.3 * uMotion + h * 30.0);
        c += LCOL * dot_ * occ * I * tw;
    }
    return c;
}

// چراغ روغنی سفالی: کاسه‌ی گلی پر از روغن، فتیله روی لبه‌ی چپ (مثل چراغ‌های سنتی)
void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
    float asp = uRes.x / uRes.y;
    float zoom = min(1.1, asp / 1.0);
    // مرکز صفحه روی نقطه‌ی (0.42, 0.5) عکس؛ محور شعله x=0 روی سر فتیله
    vec2 p = uv / zoom + vec2((0.42 - TIP.x) * TEXA, YT - (0.5 - TIP.y));
    float px = 1.5 / (uRes.y * zoom);
    float t = uTime;
    float m = uMotion;

    // نوسان شعله
    float f1 = tn(t * 2.3);
    float f2 = tn(t * 5.7 + 10.0);
    float f3 = tn(t * 0.8 + 30.0);
    float gust = smoothstep(0.82, 1.0, tn(t * 0.33 + 50.0)) * m;
    float lean = ((tn(t * 0.5 + 7.0) - 0.5) * 0.020 + (tn(t * 0.21 + 90.0) - 0.5) * 0.03 * gust) * m - 0.02;
    float Hf = HF * (1.0 + m * (0.10 * (f1 - 0.5) + 0.06 * (f2 - 0.5) - 0.10 * gust));
    float Fw = FW * (1.0 - 0.5 * (Hf / HF - 1.0));
    float L = 1.0 + m * (0.16 * (f1 - 0.5) + 0.08 * (f2 - 0.5) + 0.05 * (f3 - 0.5) - 0.12 * gust);
    vec3 LP = vec3(flameSway(0.3, t, lean), YB + 0.3 * Hf, 0.07);

    // عکس چراغ (شعله‌ی خودِ عکس پاک شده)
    vec3 col = vec3(0.0);
    vec2 tc = vec2(TIP.x + p.x / TEXA, TIP.y - (p.y - YT));
    if (uTexOn > 0.5 && tc.x > 0.0 && tc.x < 1.0 && tc.y > 0.0 && tc.y < 1.0) {
        vec3 ph = texture2D(uTex, tc).rgb;
        ph *= ph;                                                   // تقریبی به فضای خطی
        float lum = dot(ph, vec3(0.3, 0.5, 0.2));
        ph *= 1.0 + (L - 1.0) * 1.6 * smoothstep(0.002, 0.08, lum); // نور عکس با شعله می‌لرزد
        float edge = smoothstep(0.0, 0.07, tc.x) * smoothstep(1.0, 0.93, tc.x) * smoothstep(0.0, 0.07, tc.y) * smoothstep(1.0, 0.93, tc.y);
        float env = mix(1.0, 0.2, smoothstep(0.30, 0.62, length((tc - vec2(0.38, 0.55)) * vec2(1.0, 1.25))));   // محیط تاریک
        col = ph * edge * env * 1.15;
    }

    // شعله
    col += flame(p, t, lean, Hf, Fw, L);

    // هاله‌ی نور دور شعله
    vec2 dl = p - vec2(LP.x, YB + 0.34 * Hf);
    dl.y *= 0.7;
    float rl = length(dl);
    col += vec3(1.0, 0.55, 0.20) * (0.22 * exp(-rl * rl / 0.0025) + 0.12 * exp(-rl * rl / 0.018) + 0.012 * exp(-rl / 0.25)) * L;

    col += motes(p, t, LP) * 0.6;

    col = 1.0 - exp(-col * 1.2);
    col = pow(col, vec3(0.8));
    col += (hash(gl_FragCoord.xy + fract(t) * 91.0) - 0.5) / 255.0;
    gl_FragColor = vec4(col, 1.0);
}
`;

function candleReducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

function candleInitGL() {
    let gl = null;
    try {
        const opts = { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' };
        gl = candleCanvas.getContext('webgl', opts) || candleCanvas.getContext('experimental-webgl', opts);
    } catch (err) {
        gl = null;
    }
    if (!gl) return null;
    const compile = (type, src) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.warn('candle shader:', gl.getShaderInfoLog(s));
            return null;
        }
        return s;
    };
    const vs = compile(gl.VERTEX_SHADER, CANDLE_VERT);
    const fs = compile(gl.FRAGMENT_SHADER, CANDLE_FRAG);
    if (!vs || !fs) return null;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const o = {
        gl,
        uRes: gl.getUniformLocation(prog, 'uRes'),
        uTime: gl.getUniformLocation(prog, 'uTime'),
        uMotion: gl.getUniformLocation(prog, 'uMotion'),
        uTexOn: gl.getUniformLocation(prog, 'uTexOn'),
        tex: gl.createTexture(),
        texOn: false
    };
    gl.uniform1i(gl.getUniformLocation(prog, 'uTex'), 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, o.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    candleLoadPhoto(o);
    return o;
}

// عکس چراغ: «Diya, an oil lamp» از siddarth varanasi، CC BY 2.0، ویکی‌مدیا کامنز
// (بریده شده و شعله‌ی عکس پاک شده؛ شعله با شیدر ساخته می‌شود)
let candlePhoto = null;
function candleLoadPhoto(o) {
    const upload = () => {
        if (candleGL !== o && candleGL) return;
        const gl = o.gl;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, o.tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, candlePhoto);
        o.texOn = true;
        if (candleActive) candleDraw();
    };
    if (candlePhoto && candlePhoto.complete && candlePhoto.naturalWidth) {
        upload();
        return;
    }
    if (!candlePhoto) {
        candlePhoto = new Image();
        candlePhoto.src = 'assets/images/diya.jpg';
    }
    candlePhoto.addEventListener('load', upload, { once: true });
}

function candleResize() {
    if (!candleCanvas) return;
    if (!candleMode) {
        candleGL = candleInitGL();
        if (candleGL) {
            candleMode = 'gl';
            candleCanvas.addEventListener('webglcontextlost', (e) => {
                e.preventDefault();
                cancelAnimationFrame(candleRaf);
            });
            candleCanvas.addEventListener('webglcontextrestored', () => {
                candleGL = candleInitGL();
                if (candleGL && candleActive) startCandle();
            });
        } else {
            candleMode = '2d';
            // روی بومی که WebGL گرفته نمی‌شود 2D ساخت؛ بوم تازه جایگزین می‌شود
            const fresh = candleCanvas.cloneNode(false);
            candleCanvas.replaceWith(fresh);
            candleCanvas = fresh;
        }
    }
    const cssW = window.innerWidth;
    const cssH = window.innerHeight;
    const scale = Math.min(Math.min(window.devicePixelRatio || 1, 1.5), Math.sqrt(CANDLE_GL_PIXELS / Math.max(1, cssW * cssH)));
    candleW = Math.max(2, Math.round(cssW * scale));
    candleH = Math.max(2, Math.round(cssH * scale));
    candleCanvas.width = candleW;
    candleCanvas.height = candleH;
    if (candleMode === '2d') candleCtx = candleCanvas.getContext('2d');
}

function candleDraw() {
    if (candleMode === '2d') {
        candleDraw2D();
        return;
    }
    if (!candleGL) return;
    const o = candleGL;
    const gl = o.gl;
    gl.viewport(0, 0, candleW, candleH);
    gl.uniform2f(o.uRes, candleW, candleH);
    gl.uniform1f(o.uTime, candleElapsed % 5000);
    gl.uniform1f(o.uMotion, candleReducedMotion() ? 0 : 1);
    gl.uniform1f(o.uTexOn, o.texOn ? 1 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

// ---------- نسخه‌ی Canvas 2D (پشتیبان، وقتی WebGL نیست) ----------

function candleDraw2D() {
    const c = candleCtx;
    if (!c) return;
    const W = candleW;
    const H = candleH;
    const moving = !candleReducedMotion();
    const t = candleElapsed;
    const flick = moving ? 1 + 0.07 * Math.sin(t * 9.1) * Math.sin(t * 3.7 + 1) + 0.04 * Math.sin(t * 17.3) : 1;
    const zoom = Math.min(1.1, W / H);
    const u = H * zoom;                       // ارتفاع عکس به پیکسل (مثل شیدر)
    const TIPX = 0.603;
    const TIPY = 0.419;
    const TEXA = 1.2966;
    const ox = W / 2 - 0.42 * TEXA * u;       // گوشه‌ی بالا-چپ عکس
    const oy = H / 2 - 0.5 * u;
    const cx = ox + TIPX * TEXA * u;          // سر فتیله
    const ty = oy + TIPY * u;
    const lean = moving ? Math.sin(t * 1.7) * 0.01 * u : 0;
    const fh = u * 0.25 * flick;
    const fy = ty - u * 0.004;
    const fw = u * 0.048;

    c.fillStyle = '#000';
    c.fillRect(0, 0, W, H);
    if (candlePhoto && candlePhoto.complete && candlePhoto.naturalWidth) {
        c.drawImage(candlePhoto, ox, oy, TEXA * u, u);
    } else if (!candlePhoto) {
        candlePhoto = new Image();
        candlePhoto.src = 'assets/images/diya.jpg';
        candlePhoto.addEventListener('load', () => { if (candleActive) candleDraw(); }, { once: true });
    }
    const glow = c.createRadialGradient(cx, fy - fh * 0.35, 0, cx, fy - fh * 0.35, u * 0.35);
    glow.addColorStop(0, 'rgba(255,150,60,0.35)');
    glow.addColorStop(1, 'rgba(255,120,40,0)');
    c.fillStyle = glow;
    c.fillRect(0, 0, W, H);
    const flameGrad = c.createRadialGradient(cx + lean * 0.3, fy - fh * 0.28, 0, cx + lean * 0.3, fy - fh * 0.3, fh * 0.6);
    flameGrad.addColorStop(0, '#fff6d0');
    flameGrad.addColorStop(0.35, '#ffc24a');
    flameGrad.addColorStop(0.75, '#ff7a14');
    flameGrad.addColorStop(1, 'rgba(255,60,0,0)');
    c.fillStyle = flameGrad;
    c.beginPath();
    c.moveTo(cx, fy);
    c.bezierCurveTo(cx - fw * 1.6, fy - fh * 0.2, cx - fw * 0.8 + lean * 0.5, fy - fh * 0.7, cx + lean, fy - fh);
    c.bezierCurveTo(cx + fw * 0.8 + lean * 0.5, fy - fh * 0.7, cx + fw * 1.6, fy - fh * 0.2, cx, fy);
    c.fill();
}

function candleFrame(ts) {
    if (!candleActive) return;
    candleRaf = requestAnimationFrame(candleFrame);
    if (!candleLastTs) candleLastTs = ts;
    const dt = ts - candleLastTs;
    if (dt < CANDLE_FRAME_MS) return;
    candleLastTs = ts;
    candleElapsed += Math.min(dt, 100) / 1000;
    candleDraw();
}

function startCandle() {
    if (!candleCanvas) return;
    candleActive = true;
    candleCanvas.hidden = false;
    backgroundImage.style.visibility = 'hidden';
    candleResize();
    candleDraw();
    cancelAnimationFrame(candleRaf);
    candleLastTs = 0;
    // با «کاهش حرکت» فقط یک فریم ثابت رسم می‌شود
    if (!candleReducedMotion() && !document.hidden) {
        candleRaf = requestAnimationFrame(candleFrame);
    }
}

function stopCandle() {
    candleActive = false;
    cancelAnimationFrame(candleRaf);
    if (candleCanvas) candleCanvas.hidden = true;
}

window.addEventListener('resize', () => {
    if (!candleActive) return;
    candleResize();
    candleDraw();
});

document.addEventListener('visibilitychange', () => {
    if (!candleActive) return;
    cancelAnimationFrame(candleRaf);
    if (!document.hidden && !candleReducedMotion()) {
        candleLastTs = 0;
        candleRaf = requestAnimationFrame(candleFrame);
    }
});

// ============================================
// توابع مدیریت پخش صدا
// ============================================

// زمان‌بندی بر اساس ساعت واقعی (Date.now) است، نه شمارش tickها؛
// پس اگر مرورگر تایمرها را کند کند (تب پس‌زمینه، موبایل، sleep)، پخش بعدی سر وقت یا با کمترین تأخیر انجام می‌شود.
let soundPlayTracked = false;
let nextPlayAt = 0;        // زمان پخش بعدی (میلی‌ثانیه)
let statusHoldUntil = 0;   // تا این زمان پیام «در حال پخش» روی صفحه می‌ماند
const MAX_LATE_MS = 90 * 1000; // اگر بیش از این دیر شد (مثلاً بعد از sleep)، گونگ ناگهانی پخش نشود

// تابع پخش صدا
function playSound() {
    if (!soundEnabled) {
        return;
    }
    
    const t = translations[currentLang];
    
    // تنظیم فایل صوتی انتخاب شده
    audio.src = sounds[currentSound];
    audio.currentTime = 0;
    audio.play()
        .then(() => {
            updateStatus2(t.statusPlaying);
            statusHoldUntil = Date.now() + 1000;
            // فقط اولین پخش هر نشست ثبت می‌شود، نه هر تکرار
            if (!soundPlayTracked) {
                soundPlayTracked = true;
                track('sound_play', { sound: currentSound });
            }
        })
        .catch(error => {
            console.error('خطا در پخش صدا:', error);
            updateStatus2(t.statusError);
            statusHoldUntil = Date.now() + 3000;
        });
}

// تابع به‌روزرسانی وضعیت
function updateStatus2(message) {
    if (statusSpan2) {
        statusSpan2.textContent = message;
    }
}

// هر ثانیه (و هنگام بازگشت به تب) اجرا می‌شود
function tick() {
    if (!soundEnabled) {
        return;
    }
    
    const now = Date.now();
    const remaining = Math.ceil((nextPlayAt - now) / 1000);
    
    if (remaining <= 0) {
        const lateBy = now - nextPlayAt;
        nextPlayAt = now + intervalTime;
        if (lateBy <= MAX_LATE_MS) {
            playSound();
        }
        return;
    }
    
    if (now >= statusHoldUntil) {
        const t = translations[currentLang];
        updateStatus2(t.statusNextPlayIn.replace('{0}', remaining));
    }
}

// تابع شروع تایمر
function startTimer() {
    // پاک کردن تایمر قبلی
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    
    // در حالت بدون صدا هیچ تایمری ساخته نشود
    if (!soundEnabled || intervalTime <= 0) {
        return;
    }

    // در جلسه‌ی زمان‌دار، زنگ‌های دوره‌ای تا وقتی کاربر خودش روشن نکند خاموش‌اند
    if (periodicChimesBlocked()) {
        return;
    }
    
    // پخش فوری اولین صدا
    playSound();
    nextPlayAt = Date.now() + intervalTime;
    
    // بررسی هر ثانیه
    intervalId = setInterval(tick, 1000);
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
        if (btn.dataset.preset !== 'silent') allowPeriodicChimes();
        selectPreset(btn.dataset.preset);
        track('preset_selected', { preset: btn.dataset.preset });
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
        allowPeriodicChimes();
        intervalTime = newInterval * 1000;
        selectPreset('custom');
        track('custom_interval_set', { seconds: newInterval });
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
    track('background_mode', { mode: bgMode });
});

// کاشی‌های انتخاب حالت پس‌زمینه
document.querySelectorAll('.bg-mode-tile').forEach(tile => {
    tile.addEventListener('click', () => {
        if (tile.dataset.mode === bgMode) return;
        applyBgMode(tile.dataset.mode);
        localStorage.setItem('calm-bg-mode', bgMode);
        track('background_mode', { mode: bgMode });
    });
});

function applyBgMode(mode) {
    bgMode = mode;
    bgModeSelect.value = mode;
    document.querySelectorAll('.bg-mode-tile').forEach(tile => {
        tile.setAttribute('aria-pressed', tile.dataset.mode === mode ? 'true' : 'false');
    });

    if (bgMode === 'rotation') {
        bgIntervalRow.style.display = 'flex';
        imageSelectRow.style.display = 'none';
        startBackgroundRotation();
    } else {
        bgIntervalRow.style.display = 'none';
        imageSelectRow.style.display = CANVAS_MODES.includes(bgMode) ? 'none' : 'flex';
        stopBackgroundRotation();
    }

    // اول هر دو را متوقف می‌کنیم، بعد فقط حالت انتخاب‌شده را روشن می‌کنیم
    stopKaleidoscope();
    stopGalaxy();
    stopOcean();
    stopMerger();
    stopCandle();
    if (KALEIDO_MODES.includes(bgMode)) {
        kaleidoShards = bgMode === 'kaleidoscope';
        startKaleidoscope();
    } else if (bgMode === 'galaxy') {
        startGalaxy();
    } else if (bgMode === 'ocean') {
        startOcean();
    } else if (bgMode === 'merger') {
        startMerger();
    } else if (bgMode === 'candle') {
        startCandle();
    } else {
        // از حالت canvas به حالت تصویر برگشته‌ایم و تصویر هنوز بارگذاری نشده
        ensureBackgroundImage();
    }
}

// رویداد انتخاب عکس در حالت ثابت
thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
        const selectedIndex = parseInt(thumbnail.dataset.index);
        setBackground(selectedIndex);
        localStorage.setItem('calm-image', selectedIndex);
        track('background_change', { image: selectedIndex + 1, mode: 'single' });
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
    if (e.isTrusted) {
        track('sound_toggle', { enabled: soundEnabled });
        if (soundEnabled) allowPeriodicChimes();
    }
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
        
        updateStatus2(t.statusSoundDisabled);
    }
});

// میزان صدای زنگ (گونگ/زنگ بازه‌ای)
const chimeVolumeInput = document.getElementById('chimeVolume');
const chimeVolumeValue = document.getElementById('chimeVolumeValue');

function applyChimeVolume(percent) {
    percent = Math.min(100, Math.max(0, Math.round(percent)));
    audio.volume = percent / 100;
    chimeVolumeInput.value = percent;
    chimeVolumeValue.textContent = `${percent}%`;
}

function loadChimeVolume() {
    let percent = CHIME_DEFAULT_VOLUME;
    try {
        const saved = parseInt(localStorage.getItem('calm-chime-volume'), 10);
        if (!isNaN(saved) && saved >= 0 && saved <= 100) {
            percent = saved;
        }
    } catch (err) {
        // localStorage در دسترس نیست
    }
    applyChimeVolume(percent);
}

chimeVolumeInput.addEventListener('input', () => {
    applyChimeVolume(parseInt(chimeVolumeInput.value, 10));
    try {
        localStorage.setItem('calm-chime-volume', chimeVolumeInput.value);
    } catch (err) {
        // نادیده گرفته می‌شود
    }
});

// وقتی کاربر اسلایدر را رها کرد، یک نمونه از صدا پخش شود تا میزانش را بشنود
chimeVolumeInput.addEventListener('change', () => {
    audio.src = sounds[currentSound];
    audio.currentTime = 0;
    audio.play().catch(() => {});
});

// رویداد تغییر انتخاب صدا در پنل جدید
soundSelect2.addEventListener('change', (e) => {
    currentSound = e.target.value;
    localStorage.setItem('calm-sound', currentSound);
    track('sound_selected', { sound: currentSound });
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
    track('app_start', { language: currentLang });
    
    // شروع تایمر
    startTimer();
});

// ============================================
// مدیریت بارگذاری تصاویر
// ============================================

// تابع lazy loading برای thumbnails
function lazyLoadThumbnails() {
    settingsOverlay.classList.add('thumbs-ready'); // تصاویر پیش‌نمایش حالت‌های پس‌زمینه (CSS)
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
    track('panel_open', { panel: 'settings' });
    // بارگذاری thumbnails زمانی که پنل باز می‌شود
    lazyLoadThumbnails();
});

// رویداد باز کردن پنل بازه زمانی
intervalIcon.addEventListener('click', () => {
    intervalOverlay.classList.add('show');
    track('panel_open', { panel: 'sound_interval' });
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
    loadChimeVolume();
    
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
        if (savedMode === 'rotation' || savedMode === 'single' || CANVAS_MODES.includes(savedMode)) {
            applyBgMode(savedMode);
        }
    } catch (err) {
        console.warn('Could not load saved settings:', err);
    }
}

// تصویر پس‌زمینه فقط وقتی لازم است بارگذاری می‌شود (حالت‌های بوم/canvas تصویر ندارند)
function ensureBackgroundImage() {
    if (bgImageDeferred || bgImageRequested || CANVAS_MODES.includes(bgMode)) return;
    bgImageRequested = true;
    setBackground(currentImageIndex);
}

// بارگذاری اولیه: رابط کاربری منتظر تصویر نمی‌ماند.
// اول زبان و تنظیمات اعمال می‌شود و loading overlay کنار می‌رود؛ تصویر بعداً و بی‌صدا می‌آید.
function initializeApp() {
    try {
        loadSavedLanguage();
        loadSavedPreset();
        loadSavedSettings();
    } catch (error) {
        console.error('خطا در بارگذاری تنظیمات:', error);
    }

    const activeThumbnail = document.querySelector(`.thumbnail[data-index="${currentImageIndex}"]`);
    if (activeThumbnail) activeThumbnail.classList.add('active');

    hideLoadingOverlay();
    document.documentElement.classList.add('js-ready'); // دکمه‌ی «شروع» از این لحظه کار می‌کند (CSS)

    // بعد از اجرای کامل اسکریپت (لینک اشتراکی ممکن است حالت/تصویر را عوض کند) تصویر را بخواه
    setTimeout(() => {
        bgImageDeferred = false;
        ensureBackgroundImage();
    }, 0);
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

function activateTab(targetTab) {
    tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === targetTab));
    tabContents.forEach(content => content.classList.toggle('active', content.id === `${targetTab}-tab`));
}

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;
        track('tab_switch', { tab: targetTab });
        activateTab(targetTab);
    });
});

// دکمه‌ی کم‌رنگ حمایت: پنل تنظیمات را روی تب حمایت مالی باز می‌کند
document.getElementById('donateFab').addEventListener('click', () => {
    activateTab('donation');
    settingsOverlay.classList.add('show');
    track('donation_icon_click');
    track('panel_open', { panel: 'settings' });
    lazyLoadThumbnails();
});

// جلوگیری از توقف تایمر هنگام تغییر تب
document.addEventListener('visibilitychange', () => {
    if (document.hidden || !soundEnabled || !startOverlay.classList.contains('hidden') || periodicChimesBlocked()) {
        return;
    }
    if (intervalId) {
        // تایمرها در پس‌زمینه ممکن است کند شده باشند: فوراً با ساعت واقعی هماهنگ شو
        tick();
    } else {
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
        network: 'Dogecoin',
        qr: 'assets/crypto-qr/doge-qr-v2.jpeg'
    },
    trx: {
        name: 'Tron',
        address: 'TXaadj5wJPY7tWiBfugxHXQUfRNVoGaKVq',
        network: 'Tron (TRC20)',
        qr: 'assets/crypto-qr/trx-qr-v2.jpeg'
    },
    gram: {
        name: 'Gram',
        address: 'UQC-51N1lRqKkkRr9AjZw7RbqdZew5mKqbZQWcJ7dJF86ykA',
        network: 'TON',
        qr: 'assets/crypto-qr/gram-qr-v2.jpeg'
    }
};

let selectedCrypto = null;
const cryptoButtons = document.querySelectorAll('.crypto-btn');
const cryptoDetails = document.getElementById('cryptoDetails');
const cryptoQR = document.getElementById('cryptoQR');
const cryptoAddress = document.getElementById('cryptoAddress');
const copyBtn = document.getElementById('copyBtn');
const closeCrypto = document.getElementById('closeCrypto');
const copyFeedback = document.getElementById('copyFeedback');

const cryptoNetwork = document.getElementById('cryptoNetwork');

// آدرس کوتاه‌شده برای نمایش (کپی همیشه آدرس کامل را برمی‌دارد)
function shortAddress(addr) {
    return addr.length > 20 ? `${addr.slice(0, 8)}…${addr.slice(-6)}` : addr;
}

// متن‌های وابسته به زبان در جزئیات رمزارز
function updateCryptoTexts() {
    if (!selectedCrypto) return;
    const t = translations[currentLang];
    const data = cryptoData[selectedCrypto];
    cryptoQR.alt = t.qrAlt.replace('{0}', data.name);
    cryptoNetwork.textContent = t.donationNetworkWarn.replace('{0}', data.network);
}
document.addEventListener('calm:languagechange', updateCryptoTexts);

// نمایش جزئیات رمزارز
cryptoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const crypto = btn.dataset.crypto;
        const data = cryptoData[crypto];
        selectedCrypto = crypto;
        track('donation_click', { crypto });

        cryptoButtons.forEach(b => b.classList.toggle('active', b === btn));
        cryptoQR.src = data.qr;
        cryptoAddress.value = shortAddress(data.address);
        cryptoAddress.title = data.address;
        updateCryptoTexts();
        cryptoDetails.style.display = 'block';

        // اسکرول به جزئیات
        cryptoDetails.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});

// بستن جزئیات
closeCrypto.addEventListener('click', () => {
    cryptoDetails.style.display = 'none';
    cryptoButtons.forEach(b => b.classList.remove('active'));
});

// کپی آدرس کامل (با دکمه کپی، لمس QR یا لمس آدرس)
async function copyCryptoAddress() {
    if (!selectedCrypto) return;
    const full = cryptoData[selectedCrypto].address;
    try {
        await navigator.clipboard.writeText(full);
    } catch (err) {
        // Fallback برای مرورگرهای قدیمی
        const tmp = document.createElement('textarea');
        tmp.value = full;
        tmp.style.position = 'fixed';
        tmp.style.opacity = '0';
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand('copy');
        tmp.remove();
    }
    track('donation_copy', { crypto: selectedCrypto });
    copyFeedback.classList.add('show');
    clearTimeout(copyBtn._t);
    copyBtn._t = setTimeout(() => copyFeedback.classList.remove('show'), 2500);
}

copyBtn.addEventListener('click', copyCryptoAddress);
cryptoQR.addEventListener('click', copyCryptoAddress);
cryptoAddress.addEventListener('click', copyCryptoAddress);

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
    Sea: { audio: null, playing: false },
    '432Hz': { audio: null, playing: false },
    '528Hz': { audio: null, playing: false },
    Whale52Hz: { audio: null, playing: false }
};


translations.fa.bgSoundsTitle = 'صداهای پس‌زمینه';
translations.fa.bgSoundsSubtitle = 'صداهای طبیعت را برای آرامش انتخاب کنید';
translations.fa.soundFire = 'آتش';
translations.fa.soundJungle = 'جنگل';
translations.fa.soundRiver = 'رودخانه';
translations.fa.soundSea = 'دریا';
translations.fa.sound432 = '۴۳۲ هرتز';
translations.fa.sound528 = '۵۲۸ هرتز';
translations.fa.soundWhale = 'نهنگ ۵۲ هرتز';

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
    track('panel_open', { panel: 'background_sounds' });
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
            track('bg_sound_play', { sound: soundName });
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
        meditationOverlay.classList.remove('show');
        breathOverlay.classList.remove('show');
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
// دسترس‌پذیری پنل‌ها: focus trap و بازگرداندن فوکوس
// ============================================

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function setupDialogFocusTrap(overlay) {
    if (!overlay || !overlay.firstElementChild) return;
    const panel = overlay.firstElementChild;
    panel.setAttribute('tabindex', '-1'); // fallback برای فوکوس روی خود پنل
    let opener = null;
    let wasOpen = overlay.classList.contains('show');
    
    // فقط عناصری که واقعاً دیده می‌شوند (تب‌های غیرفعال display:none هستند)
    const getFocusable = () => Array.from(panel.querySelectorAll(FOCUSABLE_SELECTOR))
        .filter(el => el.offsetParent !== null || el === document.activeElement);
    
    new MutationObserver(() => {
        const isOpen = overlay.classList.contains('show');
        if (isOpen === wasOpen) return;
        wasOpen = isOpen;
        
        if (isOpen) {
            opener = document.activeElement;
            // تا پایان انیمیشن (visibility) ممکن است فوکوس ناموفق باشد؛ چند بار تلاش می‌کنیم
            let attempts = 0;
            const focusFirst = () => {
                if (!overlay.classList.contains('show') || panel.contains(document.activeElement)) return;
                const items = getFocusable();
                (items[0] || panel).focus();
                if (!panel.contains(document.activeElement) && ++attempts < 8) {
                    setTimeout(focusFirst, 50);
                }
            };
            setTimeout(focusFirst, 30);
        } else {
            if (opener && document.contains(opener) && (panel.contains(document.activeElement) || document.activeElement === document.body)) {
                opener.focus();
            }
            opener = null;
        }
    }).observe(overlay, { attributes: true, attributeFilter: ['class'] });
    
    overlay.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        
        const items = getFocusable();
        if (!items.length) {
            e.preventDefault();
            return;
        }
        
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;
        const outside = !panel.contains(active);
        
        if (e.shiftKey && (active === first || outside)) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && (active === last || outside)) {
            e.preventDefault();
            first.focus();
        }
    });
}

[settingsOverlay, intervalOverlay, bgSoundsOverlay].forEach(setupDialogFocusTrap);

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
                track('offline_sound_saved', { sound: soundName });
            } catch (err) {
                console.error(`Offline save failed for ${soundName}:`, err);
                item.state = 'error';
            }
            renderOfflineButton(soundName);
        });
    });
}

document.addEventListener('calm:languagechange', () => {
    Object.keys(offlineButtons).forEach(renderOfflineButton);
});

setupOfflineButtons();

// ============================================
// نصب برنامه (PWA)
// ============================================
// - Chrome/Edge/Samsung Internet: دکمه‌ی «نصب برنامه» با رویداد beforeinstallprompt
// - iPhone/iPad (Safari): نصب خودکار پشتیبانی نمی‌شود، فقط راهنما نمایش داده می‌شود

(function setupInstall() {
    const section = document.getElementById('installSection');
    const button = document.getElementById('installBtn');
    const iosHint = document.getElementById('installIosHint');
    const fab = document.getElementById('installFab'); // دکمه‌ی محو گوشه‌ی پایین سمت چپ
    if (!section || !button || !iosHint || !fab) return;
    
    // اگر برنامه نصب شده و از خود آیکون باز شده است، هیچ دکمه‌ای نشان داده نمی‌شود
    const isInstalledApp = ['standalone', 'fullscreen', 'minimal-ui']
        .some(mode => window.matchMedia(`(display-mode: ${mode})`).matches)
        || window.navigator.standalone === true;
    if (isInstalledApp) return;
    
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
        || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    let deferredPrompt = null;
    
    function showInstallUI() {
        section.hidden = false;
        button.hidden = false;
        fab.hidden = false;
        document.body.classList.add('install-available');
    }
    
    function hideInstallUI() {
        button.hidden = true;
        fab.hidden = true;
        document.body.classList.remove('install-available');
        if (iosHint.hidden) {
            section.hidden = true;
        }
    }
    
    async function promptInstall() {
        if (!deferredPrompt) return;
        try {
            await deferredPrompt.prompt();
            const choice = await deferredPrompt.userChoice;
            track('install_prompt_result', { outcome: choice && choice.outcome });
        } catch (err) {
            console.warn('Install prompt failed:', err);
        }
        // هر پیشنهاد فقط یک بار قابل استفاده است
        deferredPrompt = null;
        hideInstallUI();
    }
    
    // iPhone/iPad: نصب خودکار نیست، فقط راهنما در تنظیمات
    if (isIos) {
        section.hidden = false;
        iosHint.hidden = false;
    }
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault(); // منوی پیش‌فرض نشان داده نشود؛ دکمه‌های خودمان را نشان می‌دهیم
        deferredPrompt = e;
        showInstallUI();
        track('install_available');
    });
    
    button.addEventListener('click', promptInstall);
    fab.addEventListener('click', promptInstall);
    
    window.addEventListener('appinstalled', () => {
        track('pwa_installed');
        deferredPrompt = null;
        hideInstallUI();
    });
})();

// ============================================
// جلسه‌ی مدیتیشن زمان‌دار
// ============================================
// کاربر از پنل مدیتیشن (آیکون کنار آیکون‌ها) مدت و صدا را انتخاب می‌کند.
// جریان: زنگ شروع ← (چند ثانیه) ← صدای پس‌زمینه با fade-in ← ... ← fade-out ← زنگ پایان
// زمان‌بندی بر اساس ساعت واقعی (Date.now) است تا با کند شدن تایمرها در پس‌زمینه جابه‌جا نشود.

const SESSION_BG_DELAY_MS = 4000;    // فاصله‌ی زنگ شروع تا ورود صدای پس‌زمینه
const SESSION_FADE_IN_MS = 5000;
const SESSION_PREP_MS = 5000;        // مهلت آماده‌شدن قبل از شروع شمارش جلسه
const SESSION_FADE_OUT_MS = 4000;    // fade-out پایانی، درست قبل از زنگ پایان
const SESSION_STOP_FADE_MS = 1500;   // fade-out وقتی کاربر زودتر «پایان» را می‌زند
const SESSION_MIN_MINUTES = 1;
const SESSION_MAX_MINUTES = 600;

const sessionBar = document.getElementById('sessionBar');
const sessionTimeEl = document.getElementById('sessionTime');
const sessionEndBtn = document.getElementById('sessionEndBtn');
const sessionDoneEl = document.getElementById('sessionDone');
const sessionDoneBlogEl = document.getElementById('sessionDoneBlog');
const syncBlogLinks = () => { if (sessionDoneBlogEl) sessionDoneBlogEl.href = blogUrl(); };
document.addEventListener('calm:languagechange', syncBlogLinks);
if (sessionDoneBlogEl) sessionDoneBlogEl.addEventListener('click', () => track('blog_open', { from: 'session_done' }));
const sessionStatusEl = document.getElementById('sessionStatus');
const sessionSky = document.getElementById('sessionSky');
const sessionVolumeWrap = document.getElementById('sessionVolume');
const sessionVolumeInput = document.getElementById('sessionVolumeInput');
const meditationIcon = document.getElementById('meditationIcon');
const meditationOverlay = document.getElementById('meditationOverlay');
const closeMeditationPanel = document.getElementById('closeMeditationPanel');
const sessionStartBtn = document.getElementById('sessionStartBtn');
const sessionActiveNote = document.getElementById('sessionActiveNote');
const sessionCustomRow = document.getElementById('sessionCustomRow');
const sessionCustomInput = document.getElementById('sessionCustomMinutes');
const durationChips = document.querySelectorAll('#sessionDurations .session-chip');
const soundChips = document.querySelectorAll('#sessionSounds .session-chip');

const session = {
    state: 'idle',        // idle | running | ending
    timed: false,
    periodic: false,      // کاربر زنگ‌های دوره‌ای را داخل جلسه روشن کرده؟
    endAt: 0,
    startedAt: 0,
    minutes: 0,
    tickId: null,
    bgTimeoutId: null,
    wakeLock: null,
    fades: new Map()
};
let sessionBell = null;
let selectedDuration = '10';  // '10' | '15' | '30' | '60' | 'custom'
let selectedSessionBg = 'River'; // نام صدا یا 'none'

// زنگ‌های دوره‌ای در جلسه‌ی زمان‌دار پیش‌فرض خاموش‌اند، مگر کاربر از پنل بازه روشنشان کند
function periodicChimesBlocked() {
    // در تمرین تنفس هم زنگ‌های دوره‌ای تا پایان تمرین خاموش‌اند
    return (session.state !== 'idle' && session.timed && !session.periodic) || breath.state !== 'idle';
}

function allowPeriodicChimes() {
    if (session.state !== 'idle' && session.timed) {
        session.periodic = true;
    }
}

// ---------- تنظیمات ذخیره‌شده و رابط انتخاب ----------

function loadSessionSettings() {
    try {
        const d = localStorage.getItem('calm-session-duration');
        if (['10', '15', '30', '60', 'custom'].includes(d)) selectedDuration = d;
        const c = parseInt(localStorage.getItem('calm-session-custom'));
        if (c >= SESSION_MIN_MINUTES && c <= SESSION_MAX_MINUTES) sessionCustomInput.value = c;
        const b = localStorage.getItem('calm-session-bg');
        if (b === 'none' || (b && bgSounds[b])) selectedSessionBg = b;
    } catch (err) {
        console.warn('Could not load session settings:', err);
    }
}

function saveSessionSetting(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (err) { /* ذخیره‌سازی در دسترس نیست؛ مهم نیست */ }
}

function clampCustomMinutes() {
    let m = parseInt(sessionCustomInput.value);
    if (isNaN(m)) m = 20;
    m = Math.min(SESSION_MAX_MINUTES, Math.max(SESSION_MIN_MINUTES, m));
    sessionCustomInput.value = m;
    return m;
}

function renderSessionSetup() {
    durationChips.forEach(chip => {
        const on = chip.dataset.duration === selectedDuration;
        chip.classList.toggle('active', on);
        chip.setAttribute('aria-pressed', String(on));
    });
    soundChips.forEach(chip => {
        const on = chip.dataset.bg === selectedSessionBg;
        chip.classList.toggle('active', on);
        chip.setAttribute('aria-pressed', String(on));
    });
    sessionCustomRow.hidden = selectedDuration !== 'custom';
}

durationChips.forEach(chip => chip.addEventListener('click', () => {
    selectedDuration = chip.dataset.duration;
    saveSessionSetting('calm-session-duration', selectedDuration);
    renderSessionSetup();
    if (selectedDuration === 'custom') sessionCustomInput.focus();
}));

soundChips.forEach(chip => chip.addEventListener('click', () => {
    selectedSessionBg = chip.dataset.bg;
    saveSessionSetting('calm-session-bg', selectedSessionBg);
    renderSessionSetup();
    prefetchSessionBg(selectedSessionBg);
}));

// فقط صدای انتخاب‌شده در تنظیمات جلسه شروع به بافر شدن می‌کند؛ بقیه‌ی صداهای در حال دانلود
// (که پخش نمی‌شوند) رها می‌شوند تا پهنای باند صرف همان یک فایل شود
function prefetchSessionBg(name) {
    const conn = navigator.connection || {};
    if (conn.saveData) return;
    Object.keys(bgSounds).forEach(other => {
        const s = bgSounds[other];
        if (other === name || s.playing || !s.audio) return;
        s.audio.removeAttribute('src');
        s.audio.load();
        s.audio = null;
    });
    if (name === 'none' || !bgSounds[name]) return;
    const el = loadBgSound(name);
    el.preload = 'auto';
    if (el.readyState === 0) el.load();
}

sessionCustomInput.addEventListener('change', () => {
    saveSessionSetting('calm-session-custom', clampCustomMinutes());
});

// مدت انتخاب‌شده به دقیقه
function getSessionMinutes() {
    if (selectedDuration === 'custom') return clampCustomMinutes();
    return parseInt(selectedDuration);
}

// ---------- ابزارهای صدا ----------

function playSessionBell() {
    if (!sessionBell) sessionBell = new Audio();
    sessionBell.src = sounds[currentSound];
    sessionBell.volume = audio.volume; // همان «میزان صدای زنگ» تنظیم‌شده در پنل بازه
    sessionBell.currentTime = 0;
    return sessionBell.play().catch(err => console.error('خطا در پخش زنگ جلسه:', err));
}

function setBgCardState(name, playing) {
    bgSounds[name].playing = playing;
    const card = document.querySelector(`.sound-card[data-sound="${name}"]`);
    if (card) {
        card.classList.toggle('playing', playing);
        card.setAttribute('aria-pressed', String(playing));
    }
}

function cancelBgFade(name) {
    clearInterval(session.fades.get(name));
    session.fades.delete(name);
}

// تغییر تدریجی حجم؛ ضریب نسبت به حجم ذخیره‌شده‌ی کاربر است تا اسلایدر حجم هم کار کند
// (روی iOS تغییر حجم با کد ممکن نیست و صدا بدون fade می‌آید و می‌رود)
function fadeBgSound(name, from, to, ms, onDone) {
    cancelBgFade(name);
    const el = loadBgSound(name);
    const t0 = Date.now();
    let finished = false;
    const step = () => {
        const p = ms > 0 ? Math.min(1, (Date.now() - t0) / ms) : 1;
        el.volume = Math.min(1, Math.max(0, getSavedVolume(name) * (from + (to - from) * p)));
        if (p >= 1) {
            finished = true;
            cancelBgFade(name);
            if (onDone) onDone();
        }
    };
    step();
    if (!finished) session.fades.set(name, setInterval(step, 100));
}

function stopBgSounds(ms) {
    Object.keys(bgSounds).forEach(name => {
        if (!bgSounds[name].playing) return;
        const el = loadBgSound(name);
        const saved = getSavedVolume(name);
        const factor = saved > 0 ? Math.min(1, el.volume / saved) : 1;
        fadeBgSound(name, factor, 0, ms, () => {
            el.pause();
            el.volume = getSavedVolume(name);
            setBgCardState(name, false);
        });
    });
}

function startSessionBg(name) {
    if (name === 'none' || !bgSounds[name] || bgSounds[name].playing) return;
    const el = loadBgSound(name);
    el.volume = 0; // از داخل کلیک شروع می‌کنیم (قفل autoplay) ولی بی‌صدا؛ با تأخیر fade-in می‌شود
    el.play().catch(err => console.error(`Error playing ${name}:`, err));
    setBgCardState(name, true);
    track('bg_sound_play', { sound: name });
    session.bgTimeoutId = setTimeout(() => {
        session.bgTimeoutId = null;
        if (session.state !== 'idle') fadeBgSound(name, 0, 1, SESSION_FADE_IN_MS);
    }, SESSION_BG_DELAY_MS);
}

// ---------- Wake Lock و Media Session ----------

async function requestSessionWakeLock() {
    try {
        if ('wakeLock' in navigator && !session.wakeLock) {
            session.wakeLock = await navigator.wakeLock.request('screen');
            session.wakeLock.addEventListener('release', () => { session.wakeLock = null; });
        }
    } catch (err) { /* ممکن است رد شود (مثلاً باتری کم)؛ جلسه ادامه می‌یابد */ }
}

function releaseSessionWakeLock() {
    if (session.wakeLock) {
        session.wakeLock.release().catch(() => {});
        session.wakeLock = null;
    }
}

// ---------- نمایش زمان ----------

function localizeDigits(str) {
    return currentLang === 'fa' ? str.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]) : str;
}

function formatClock(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const sec = total % 60;
    const mm = String(m).padStart(2, '0');
    const ss = String(sec).padStart(2, '0');
    return localizeDigits(h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`);
}

// ---------- چرخه‌ی جلسه ----------

// متن وضعیت: «آماده شوید» در مهلت اولیه، «در حال مدیتیشن» بعد از آن
function setSessionPrepping(on) {
    session.prepping = on;
    const key = on ? 'sessionPrep' : 'sessionStatus';
    sessionStatusEl.dataset.i18n = key;
    sessionStatusEl.textContent = bt(key);
}

// ---------- بلندی صدای طبیعت در طول جلسه ----------
// همان مقدار ذخیره‌شده‌ی پنل «صداهای پس‌زمینه» را تغییر می‌دهد؛ اگر صدای طبیعت انتخاب نشده باشد مخفی است
function renderSessionVolume() {
    const name = selectedSessionBg;
    const has = name !== 'none' && !!bgSounds[name];
    sessionVolumeWrap.hidden = !has;
    if (!has) return;
    sessionVolumeInput.value = Math.round(getSavedVolume(name) * 100);
    const label = translations[currentLang]['sound' + name] || name;
    sessionVolumeInput.setAttribute('aria-label', translations[currentLang].ariaVolume.replace('{0}', label));
}

sessionVolumeInput.addEventListener('input', () => {
    const name = selectedSessionBg;
    if (!bgSounds[name]) return;
    const value = sessionVolumeInput.value;
    saveSessionSetting(`calm-volume-${name}`, value / 100);
    // اسلایدر پنل صداها هم هم‌گام بماند
    const panelSlider = document.querySelector(`.volume-slider[data-sound="${name}"]`);
    if (panelSlider) panelSlider.value = value;
    // در fade-in/out یا قبل از ورود صدا، مقدار جدید خودکار در گام بعدی اعمال می‌شود؛ در حالت عادی همین الان
    const el = bgSounds[name].audio;
    if (el && !session.fades.has(name) && !session.bgTimeoutId) el.volume = value / 100;
});

document.addEventListener('calm:languagechange', () => {
    if (session.state !== 'idle') renderSessionVolume();
});

// ---------- آسمان: ابر و باد تصادفی ----------
// هر ابر با اندازه، ارتفاع، جهت، سرعت و شفافیت تصادفی ساخته می‌شود و بعد از خروج از صفحه
// با مشخصات تازه دوباره ظاهر می‌شود؛ پس حرکت‌ها تکراری و همه در یک جهت نیستند.
const SKY_CLOUDS = 5;
const SKY_WINDS = 4;
let skyActive = false;
const skyTimers = new Set();

const rand = (a, b) => a + Math.random() * (b - a);

function skyReduceMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function spawnCloud(initial) {
    if (!skyActive) return;
    const vw = window.innerWidth;
    const width = rand(Math.min(vw * 0.45, 200), Math.min(vw * 0.9, 460));
    const dir = Math.random() < 0.5 ? 1 : -1;
    const duration = rand(70, 150);
    const cloud = document.createElement('div');
    cloud.className = 'sky-cloud';
    cloud.style.width = `${width}px`;
    cloud.style.height = `${width * 0.42}px`;
    cloud.style.top = `${rand(2, 85)}%`;
    cloud.style.setProperty('--sx', Math.random() < 0.5 ? -1 : 1);       // آینه‌ای برای تنوع شکل
    cloud.style.setProperty('--s', rand(0.8, 1.4).toFixed(2));
    cloud.style.setProperty('--x0', `${dir > 0 ? -width * 1.5 : vw + width * 0.5}px`);
    cloud.style.setProperty('--x1', `${dir > 0 ? vw + width * 0.5 : -width * 1.5}px`);
    cloud.style.setProperty('--dy', `${rand(-40, 40).toFixed(0)}px`);
    cloud.style.setProperty('--o', rand(0.16, 0.3).toFixed(2));
    cloud.style.animationDuration = `${duration.toFixed(0)}s`;
    // اولین ابرها وسط راه شروع می‌شوند تا آسمان از ابتدا خالی نباشد
    if (initial) cloud.style.animationDelay = `-${(duration * rand(0.05, 0.85)).toFixed(0)}s`;

    // ابر از چند برآمدگی گرد ساخته می‌شود: بزرگ‌تر در وسط، کوچک‌تر در لبه‌ها، با کف تقریباً صاف
    const puffs = [
        [4, 38, 34], [20, 12, 44], [42, 0, 50], [64, 10, 42], [80, 34, 32], [30, 40, 46], [56, 38, 44]
    ];
    puffs.forEach(([l, t, size]) => {
        const puff = document.createElement('span');
        puff.className = 'sky-puff';
        const jitter = rand(0.9, 1.12);
        puff.style.left = `${l}%`;
        puff.style.top = `${t}%`;
        puff.style.width = `${size * jitter}%`;
        puff.style.height = `${size * jitter * 1.6}%`;
        cloud.appendChild(puff);
    });

    if (skyReduceMotion()) {
        cloud.classList.add('still');
        cloud.style.setProperty('--xs', `${rand(0, Math.max(0, vw - width)).toFixed(0)}px`);
    } else {
        cloud.addEventListener('animationend', () => {
            cloud.remove();
            spawnCloud(false);
        }, { once: true });
    }
    sessionSky.appendChild(cloud);
}

function spawnWind() {
    if (!skyActive || skyReduceMotion()) return;
    const vw = window.innerWidth;
    const dir = Math.random() < 0.5 ? 1 : -1;
    const length = rand(120, 320);
    const wind = document.createElement('span');
    wind.className = 'sky-wind';
    wind.style.width = `${length}px`;
    wind.style.top = `${rand(5, 92)}%`;
    wind.style.setProperty('--x0', `${dir > 0 ? -length : vw}px`);
    wind.style.setProperty('--x1', `${dir > 0 ? vw : -length}px`);
    wind.style.setProperty('--dy', `${rand(-30, 30).toFixed(0)}px`);
    wind.style.setProperty('--rot', `${rand(-4, 4).toFixed(1)}deg`);
    wind.style.animationDuration = `${rand(7, 14).toFixed(1)}s`;
    wind.addEventListener('animationend', () => {
        wind.remove();
        // مکث تصادفی تا باد بعدی
        const id = setTimeout(() => {
            skyTimers.delete(id);
            spawnWind();
        }, rand(1000, 7000));
        skyTimers.add(id);
    }, { once: true });
    sessionSky.appendChild(wind);
}

function startSky() {
    stopSky();
    // روی پس‌زمینه‌ی زیبابین و کهکشان ابر و باد نمی‌خواهیم (خود پس‌زمینه متحرک است)
    if (CANVAS_MODES.includes(bgMode)) return;
    skyActive = true;
    for (let i = 0; i < SKY_CLOUDS; i++) spawnCloud(true);
    for (let i = 0; i < SKY_WINDS; i++) {
        const id = setTimeout(() => {
            skyTimers.delete(id);
            spawnWind();
        }, rand(0, 8000));
        skyTimers.add(id);
    }
}

function stopSky() {
    skyActive = false;
    skyTimers.forEach(clearTimeout);
    skyTimers.clear();
    sessionSky.textContent = '';
}

// ---------- قفل صفحه‌ی مدیتیشن ----------
// در طول جلسه بقیه‌ی صفحه (دکمه‌ها و منوها) با inert از دسترس ماوس، لمس و صفحه‌کلید خارج می‌شود
let sessionInertEls = [];

function lockPageForSession() {
    sessionInertEls = [...document.body.children].filter(el =>
        el !== sessionBar && !el.hasAttribute('inert') && !['SCRIPT', 'AUDIO'].includes(el.tagName));
    sessionInertEls.forEach(el => el.setAttribute('inert', ''));
}

function unlockPageAfterSession() {
    sessionInertEls.forEach(el => el.removeAttribute('inert'));
    sessionInertEls = [];
}

function beginSession() {
    const minutes = getSessionMinutes();
    session.minutes = minutes;
    session.timed = true;
    session.periodic = false;
    session.state = 'running';
    session.startedAt = Date.now();
    session.prepEnd = session.startedAt + SESSION_PREP_MS;
    // زنگ‌های دوره‌ای تا پایان جلسه متوقف می‌شوند (مگر کاربر دوباره روشنشان کند)
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    audio.pause();

    // زنگ شروع همیشه پخش می‌شود (حتی اگر preset بازه «بدون صدا» باشد)
    playSessionBell();
    session.endAt = session.prepEnd + minutes * 60000;
    setSessionPrepping(true);
    renderSessionVolume();
    sessionTimeEl.textContent = localizeDigits(String(Math.ceil(SESSION_PREP_MS / 1000)));
    sessionBar.hidden = false;
    startSky();
    lockPageForSession();
    sessionEndBtn.focus({ preventScroll: true });
    session.tickId = setInterval(tickSession, 500);
    requestSessionWakeLock();
    if ('mediaSession' in navigator && typeof MediaMetadata === 'function') {
        navigator.mediaSession.metadata = new MediaMetadata({ title: document.title });
    }
    renderSessionPanelState();

    startSessionBg(selectedSessionBg);
    track('session_start', { minutes, sound: selectedSessionBg });
}

function tickSession() {
    if (session.state === 'idle' || !session.timed) return;
    const now = Date.now();

    // مهلت آماده‌شدن: شمارش معکوس چند ثانیه‌ای، بدون کم شدن از زمان جلسه
    if (now < session.prepEnd) {
        sessionTimeEl.textContent = localizeDigits(String(Math.ceil((session.prepEnd - now) / 1000)));
        return;
    }
    if (session.prepping) setSessionPrepping(false);

    const remaining = session.endAt - now;
    if (remaining <= 0) {
        finishSession(true);
        return;
    }
    if (session.state === 'running' && remaining <= SESSION_FADE_OUT_MS) {
        session.state = 'ending';
        if (session.bgTimeoutId) {
            clearTimeout(session.bgTimeoutId);
            session.bgTimeoutId = null;
        }
        stopBgSounds(remaining);
    }
    sessionTimeEl.textContent = formatClock(remaining);
}

function finishSession(completed) {
    if (session.state === 'idle') return;
    const elapsedMin = Math.round((Date.now() - session.startedAt) / 60000);

    clearInterval(session.tickId);
    session.tickId = null;
    if (session.bgTimeoutId) {
        clearTimeout(session.bgTimeoutId);
        session.bgTimeoutId = null;
    }
    session.state = 'idle';
    session.periodic = false;

    // اگر در fade-out پایانی هستیم همه را همین الان ببند؛ در پایان زودهنگام نرم‌تر ببند
    stopBgSounds(completed ? 0 : SESSION_STOP_FADE_MS);

    // زنگ‌های دوره‌ای (اگر قبل از جلسه فعال بودند) از نو، بدون زنگ فوری، ادامه یابند
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    audio.pause();
    if (soundEnabled && intervalTime > 0) {
        nextPlayAt = Date.now() + intervalTime;
        intervalId = setInterval(tick, 1000);
    }

    if (completed) {
        playSessionBell();
    } else if (sessionBell) {
        sessionBell.pause();
    }

    releaseSessionWakeLock();
    sessionBar.hidden = true;
    stopSky();
    unlockPageAfterSession();
    renderSessionPanelState();
    if (completed) showSessionDone();
    track(completed ? 'session_complete' : 'session_stopped', { minutes: session.minutes, elapsed_minutes: elapsedMin });
}

sessionEndBtn.addEventListener('click', () => finishSession(false));

// پیام کوتاه پایان مدیتیشن
let sessionDoneTimeoutId = null;
function showSessionDone() {
    syncBlogLinks();
    sessionDoneEl.hidden = false;
    clearTimeout(sessionDoneTimeoutId);
    sessionDoneTimeoutId = setTimeout(() => { sessionDoneEl.hidden = true; }, 15000);
}

// ---------- پنل مدیتیشن ----------

// وقتی جلسه در جریان است، شروع دوباره غیرفعال و توضیح نشان داده می‌شود
function renderSessionPanelState() {
    const active = session.state !== 'idle';
    sessionStartBtn.disabled = active;
    sessionActiveNote.hidden = !active;
}

meditationIcon.addEventListener('click', () => {
    meditationOverlay.classList.add('show');
    track('panel_open', { panel: 'meditation' });
});

closeMeditationPanel.addEventListener('click', () => meditationOverlay.classList.remove('show'));

meditationOverlay.addEventListener('click', (e) => {
    if (e.target === meditationOverlay) meditationOverlay.classList.remove('show');
});

sessionStartBtn.addEventListener('click', () => {
    if (session.state !== 'idle') return;
    clampCustomMinutes();
    sessionDoneEl.hidden = true;
    meditationOverlay.classList.remove('show');
    beginSession();
});

setupDialogFocusTrap(meditationOverlay);

// با بازگشت به تب: دوباره با ساعت واقعی هماهنگ شو و wake lock (که با مخفی شدن تب آزاد می‌شود) را بگیر
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && session.state !== 'idle' && session.timed) {
        requestSessionWakeLock();
        tickSession();
    }
});

loadSessionSettings();
renderSessionSetup();

// ============================================
// تمرین تنفس
// ============================================
// هر الگو: [دم، نگه‌داشت پس از دم، بازدم، نگه‌داشت پس از بازدم] به ثانیه
const BREATH_PATTERNS = {
    box:      { times: [4, 4, 4, 4] },
    '478':    { times: [4, 7, 8, 0] },
    '369':    { times: [3, 6, 9, 0] },
    coherent: { times: [5.5, 0, 5.5, 0] },
    calm:     { times: [4, 0, 6, 0] },
    exhale:   { times: [4, 0, 8, 0] },
    sigh:     { sigh: true },        // دم ۲ + دم کوتاه ۱ + بازدم ۶
    custom:   { times: [4, 4, 4, 4] }
};
const BREATH_FIELDS = ['in', 'hold1', 'out', 'hold2'];
const BREATH_STEP = 0.5;
const BREATH_MAX_SECONDS = 15;
const BREATH_MIN_ROUNDS = 1;
const BREATH_MAX_ROUNDS = 99;
const BREATH_PREP_MS = 3000;
const BREATH_SCALE_MIN = 0.45;
const BREATH_SCALE_MAX = 1;
const BREATH_SETTINGS_KEY = 'calm-breath-settings';
const BREATH_STATS_KEY = 'calm-breath-stats';

const breathIcon = document.getElementById('breathIcon');
const breathOverlay = document.getElementById('breathOverlay');
const closeBreathPanel = document.getElementById('closeBreathPanel');
const breathPatternChips = document.querySelectorAll('#breathPatterns .session-chip');
const breathDescEl = document.getElementById('breathDesc');
const breathTimingEl = document.getElementById('breathTiming');
const breathCustomRow = document.getElementById('breathCustomRow');
const breathRoundsRow = document.querySelector('.breath-rounds-row');
const breathInfiniteBtn = document.getElementById('breathInfinite');
const breathTotalEl = document.getElementById('breathTotal');
const breathStatsEl = document.getElementById('breathStats');
const breathBlockedNote = document.getElementById('breathBlockedNote');
const breathStartBtn = document.getElementById('breathStartBtn');
const breathStage = document.getElementById('breathStage');
const breathCircle = document.getElementById('breathCircle');
const breathPhaseEl = document.getElementById('breathPhase');
const breathCountEl = document.getElementById('breathCount');
const breathRoundEl = document.getElementById('breathRound');
const breathStopBtn = document.getElementById('breathStopBtn');
const breathDoneEl = document.getElementById('breathDone');

const breathSettings = {
    pattern: 'box',
    rounds: 10,
    infinite: false,
    custom: { in: 4, hold1: 4, out: 4, hold2: 4 }
};

const breath = {
    state: 'idle',       // idle | prep | running
    phases: [],
    phaseIdx: 0,
    phaseEnd: 0,
    prepEnd: 0,
    runStart: 0,
    completedRounds: 0,
    rounds: 0,           // 0 = نامحدود
    pattern: 'box',
    tickId: null
};
let breathBell = null;
let breathDoneTimeoutId = null;

function bt(key) {
    return translations[currentLang][key] || key;
}

// ---------- الگو و زمان‌ها ----------

function getBreathTimes() {
    if (breathSettings.pattern === 'custom') {
        return BREATH_FIELDS.map(f => breathSettings.custom[f]);
    }
    return BREATH_PATTERNS[breathSettings.pattern].times;
}

// فازهای یک دور؛ to = اندازه‌ی نهایی دایره در پایان فاز
function buildBreathPhases(pattern, times) {
    if (BREATH_PATTERNS[pattern].sigh) {
        return [
            { kind: 'in', dur: 2, to: 0.85 },
            { kind: 'in2', dur: 1, to: BREATH_SCALE_MAX },
            { kind: 'out', dur: 6, to: BREATH_SCALE_MIN }
        ];
    }
    const [inT, h1, outT, h2] = times;
    const phases = [{ kind: 'in', dur: inT, to: BREATH_SCALE_MAX }];
    if (h1 > 0) phases.push({ kind: 'hold', dur: h1, to: BREATH_SCALE_MAX });
    phases.push({ kind: 'out', dur: outT, to: BREATH_SCALE_MIN });
    if (h2 > 0) phases.push({ kind: 'hold', dur: h2, to: BREATH_SCALE_MIN });
    return phases;
}

function breathCycleSeconds() {
    return buildBreathPhases(breathSettings.pattern, getBreathTimes())
        .reduce((sum, p) => sum + p.dur, 0);
}

function fmtNum(n) {
    return localizeDigits(String(n));
}

function formatBreathTotal(seconds) {
    const total = Math.round(seconds);
    const m = Math.floor(total / 60);
    const sec = total % 60;
    return localizeDigits(`${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`);
}

// ---------- ذخیره‌ی تنظیمات و آمار (localStorage) ----------

function loadBreathSettings() {
    try {
        const raw = JSON.parse(localStorage.getItem(BREATH_SETTINGS_KEY) || 'null');
        if (!raw || typeof raw !== 'object') return;
        if (BREATH_PATTERNS[raw.pattern]) breathSettings.pattern = raw.pattern;
        const r = parseInt(raw.rounds);
        if (r >= BREATH_MIN_ROUNDS && r <= BREATH_MAX_ROUNDS) breathSettings.rounds = r;
        breathSettings.infinite = raw.infinite === true;
        if (raw.custom) {
            BREATH_FIELDS.forEach((f, i) => {
                const v = Number(raw.custom[f]);
                const min = (f === 'in' || f === 'out') ? 1 : 0;
                if (isFinite(v) && v >= min && v <= BREATH_MAX_SECONDS) breathSettings.custom[f] = v;
            });
        }
    } catch (err) {
        console.warn('Could not load breathing settings:', err);
    }
}

function saveBreathSettings() {
    try {
        localStorage.setItem(BREATH_SETTINGS_KEY, JSON.stringify(breathSettings));
    } catch (err) { /* ذخیره‌سازی در دسترس نیست؛ مهم نیست */ }
}

function loadBreathStats() {
    try {
        const raw = JSON.parse(localStorage.getItem(BREATH_STATS_KEY) || 'null');
        if (raw && raw.sessions > 0) {
            return { sessions: raw.sessions | 0, seconds: Math.max(0, raw.seconds | 0), rounds: Math.max(0, raw.rounds | 0) };
        }
    } catch (err) { /* ignore */ }
    return { sessions: 0, seconds: 0, rounds: 0 };
}

function addBreathStats(seconds, rounds) {
    const stats = loadBreathStats();
    stats.sessions += 1;
    stats.seconds += Math.round(seconds);
    stats.rounds += rounds;
    try {
        localStorage.setItem(BREATH_STATS_KEY, JSON.stringify(stats));
    } catch (err) { /* ignore */ }
}

// ---------- رابط پنل ----------

function renderBreathPanel() {
    const pattern = breathSettings.pattern;
    breathPatternChips.forEach(chip => {
        const on = chip.dataset.pattern === pattern;
        chip.classList.toggle('active', on);
        chip.setAttribute('aria-pressed', String(on));
    });
    breathDescEl.textContent = bt('breathDesc_' + pattern);
    breathCustomRow.hidden = pattern !== 'custom';

    // خلاصه‌ی زمان‌ها
    if (BREATH_PATTERNS[pattern].sigh) {
        breathTimingEl.textContent = `${bt('breathIn')} ${fmtNum(2)} + ${fmtNum(1)} · ${bt('breathOut')} ${fmtNum(6)}`;
    } else {
        const [a, h1, b, h2] = getBreathTimes();
        const parts = [`${bt('breathIn')} ${fmtNum(a)}`];
        if (h1 > 0) parts.push(`${bt('breathHoldShort')} ${fmtNum(h1)}`);
        parts.push(`${bt('breathOut')} ${fmtNum(b)}`);
        if (h2 > 0) parts.push(`${bt('breathHoldShort')} ${fmtNum(h2)}`);
        breathTimingEl.textContent = parts.join('  •  ');
    }

    // مقدار گام‌شمارها
    document.querySelectorAll('#breathCustomRow .breath-stepper').forEach(el => {
        el.querySelector('.breath-step-val').textContent = fmtNum(breathSettings.custom[el.dataset.field]);
    });
    document.getElementById('breathRoundsVal').textContent = fmtNum(breathSettings.rounds);
    breathRoundsRow.classList.toggle('infinite', breathSettings.infinite);
    breathInfiniteBtn.classList.toggle('active', breathSettings.infinite);
    breathInfiniteBtn.setAttribute('aria-pressed', String(breathSettings.infinite));
    document.querySelectorAll('.breath-stepper[data-field="rounds"] .breath-step-btn').forEach(b => {
        b.disabled = breathSettings.infinite;
    });

    // مدت کل
    if (breathSettings.infinite) {
        breathTotalEl.textContent = bt('breathTotalOpen');
    } else {
        breathTotalEl.textContent = bt('breathTotal').replace('{0}', formatBreathTotal(breathCycleSeconds() * breathSettings.rounds));
    }

    // آمار
    const stats = loadBreathStats();
    breathStatsEl.hidden = stats.sessions === 0;
    if (stats.sessions > 0) {
        breathStatsEl.textContent = bt('breathStats')
            .replace('{0}', fmtNum(stats.sessions))
            .replace('{1}', fmtNum(Math.max(1, Math.round(stats.seconds / 60))))
            .replace('{2}', fmtNum(stats.rounds));
    }

    // اگر مدیتیشن در جریان است، شروع تنفس ممکن نیست
    const blocked = session.state !== 'idle';
    breathStartBtn.disabled = blocked || breath.state !== 'idle';
    breathBlockedNote.hidden = !blocked;
}

breathPatternChips.forEach(chip => chip.addEventListener('click', () => {
    breathSettings.pattern = chip.dataset.pattern;
    saveBreathSettings();
    renderBreathPanel();
}));

breathInfiniteBtn.addEventListener('click', () => {
    breathSettings.infinite = !breathSettings.infinite;
    saveBreathSettings();
    renderBreathPanel();
});

document.querySelectorAll('.breath-stepper .breath-step-btn').forEach(btn => btn.addEventListener('click', () => {
    const field = btn.closest('.breath-stepper').dataset.field;
    const dir = parseInt(btn.dataset.dir);
    if (field === 'rounds') {
        breathSettings.rounds = Math.min(BREATH_MAX_ROUNDS, Math.max(BREATH_MIN_ROUNDS, breathSettings.rounds + dir));
    } else {
        const min = (field === 'in' || field === 'out') ? 1 : 0;
        const v = breathSettings.custom[field] + dir * BREATH_STEP;
        breathSettings.custom[field] = Math.min(BREATH_MAX_SECONDS, Math.max(min, v));
    }
    saveBreathSettings();
    renderBreathPanel();
}));

breathIcon.addEventListener('click', () => {
    renderBreathPanel();
    breathOverlay.classList.add('show');
    track('panel_open', { panel: 'breathing' });
});
closeBreathPanel.addEventListener('click', () => breathOverlay.classList.remove('show'));
breathOverlay.addEventListener('click', (e) => {
    if (e.target === breathOverlay) breathOverlay.classList.remove('show');
});
setupDialogFocusTrap(breathOverlay);

// ---------- صدا ----------

function playBreathBell() {
    if (!breathBell) breathBell = new Audio();
    breathBell.src = sounds[currentSound];
    breathBell.volume = audio.volume; // همان «میزان صدای زنگ»
    breathBell.currentTime = 0;
    return breathBell.play().catch(err => console.error('خطا در پخش زنگ تنفس:', err));
}

// ---------- چرخه‌ی تمرین ----------

function setCircle(scale, seconds) {
    breathCircle.style.transition = seconds > 0 ? `transform ${seconds}s ease-in-out` : 'none';
    breathCircle.style.transform = `scale(${scale})`;
}

function renderBreathRound() {
    const n = breath.completedRounds + 1;
    breathRoundEl.textContent = (breath.rounds > 0
        ? bt('breathRound').replace('{0}', fmtNum(n)).replace('{1}', fmtNum(breath.rounds))
        : bt('breathRoundOpen').replace('{0}', fmtNum(n)));
}

function enterBreathPhase() {
    const phase = breath.phases[breath.phaseIdx];
    const labels = { in: 'breathPhaseIn', in2: 'breathPhaseIn2', hold: 'breathPhaseHold', out: 'breathPhaseOut' };
    breathPhaseEl.textContent = bt(labels[phase.kind]);
    const holding = phase.kind === 'hold';
    breathCircle.classList.toggle('holding', holding);
    // در نگه‌داشت دایره ثابت می‌ماند؛ در دم و بازدم در طول فاز بزرگ/کوچک می‌شود
    if (!holding) setCircle(phase.to, phase.dur);
    renderBreathRound();
}

function startBreathing() {
    breath.state = 'running';
    breath.runStart = performance.now();
    breath.phaseIdx = 0;
    breath.phaseEnd = breath.runStart + breath.phases[0].dur * 1000;
    enterBreathPhase();
}

function tickBreath() {
    if (breath.state === 'idle') return;
    const now = performance.now();

    if (breath.state === 'prep') {
        const remaining = breath.prepEnd - now;
        if (remaining <= 0) {
            startBreathing();
            tickBreath();
        } else {
            breathCountEl.textContent = fmtNum(Math.ceil(remaining / 1000));
        }
        return;
    }

    let changed = false;
    while (now >= breath.phaseEnd) {
        breath.phaseIdx++;
        if (breath.phaseIdx >= breath.phases.length) {
            breath.phaseIdx = 0;
            breath.completedRounds++;
            if (breath.rounds > 0 && breath.completedRounds >= breath.rounds) {
                finishBreath(true);
                return;
            }
        }
        breath.phaseEnd += breath.phases[breath.phaseIdx].dur * 1000;
        changed = true;
    }
    if (changed) enterBreathPhase();
    breathCountEl.textContent = fmtNum(Math.max(1, Math.ceil((breath.phaseEnd - now) / 1000)));
}

function beginBreath() {
    const pattern = breathSettings.pattern;
    breath.pattern = pattern;
    breath.phases = buildBreathPhases(pattern, getBreathTimes());
    breath.rounds = breathSettings.infinite ? 0 : breathSettings.rounds;
    breath.completedRounds = 0;
    breath.state = 'prep';
    breath.prepEnd = performance.now() + BREATH_PREP_MS;

    // زنگ‌های دوره‌ای تا پایان تمرین متوقف می‌شوند
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    audio.pause();

    // زنگ شروع (داخل رویداد کلیک، تا مرورگر اجازه‌ی پخش بدهد)
    playBreathBell();

    breathDoneEl.hidden = true;
    breathStage.hidden = false;
    breathRoundEl.textContent = '';
    breathPhaseEl.textContent = bt('breathPrep');
    breathCircle.classList.remove('holding');
    setCircle(BREATH_SCALE_MIN, 0);
    breathCircle.getBoundingClientRect(); // اعمال فوری حالت اولیه، قبل از انیمیشن
    breathCountEl.textContent = fmtNum(Math.ceil(BREATH_PREP_MS / 1000));
    breath.tickId = setInterval(tickBreath, 100);
    requestSessionWakeLock();
    breathStopBtn.focus();
    track('breath_start', { pattern, rounds: breath.rounds });
}

function finishBreath(completed) {
    if (breath.state === 'idle') return;
    const wasRunning = breath.state === 'running';
    const rounds = breath.completedRounds;
    const seconds = wasRunning ? (performance.now() - breath.runStart) / 1000 : 0;

    clearInterval(breath.tickId);
    breath.tickId = null;
    breath.state = 'idle';

    breathStage.hidden = true;
    setCircle(BREATH_SCALE_MIN, 0);
    if (session.state === 'idle') releaseSessionWakeLock();
    if (document.contains(breathIcon)) breathIcon.focus();

    // زنگ‌های دوره‌ای (اگر قبل از تمرین فعال بودند) از نو، بدون زنگ فوری، ادامه یابند
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    audio.pause();
    if (soundEnabled && intervalTime > 0 && session.state === 'idle') {
        nextPlayAt = Date.now() + intervalTime;
        intervalId = setInterval(tick, 1000);
    }

    if (completed) {
        playBreathBell();
    } else if (breathBell) {
        breathBell.pause();
    }

    // فقط تمرینی که حداقل یک دور کامل داشته در آمار ثبت می‌شود
    if (rounds > 0) addBreathStats(seconds, rounds);
    if (completed || rounds > 0) showBreathDone(completed, rounds);
    track(completed ? 'breath_complete' : 'breath_stopped', { pattern: breath.pattern, rounds, seconds: Math.round(seconds) });
}

function showBreathDone(completed, rounds) {
    breathDoneEl.textContent = bt(completed ? 'breathDone' : 'breathDoneStopped').replace('{0}', fmtNum(rounds));
    breathDoneEl.hidden = false;
    clearTimeout(breathDoneTimeoutId);
    breathDoneTimeoutId = setTimeout(() => { breathDoneEl.hidden = true; }, 10000);
}

breathStartBtn.addEventListener('click', () => {
    if (breath.state !== 'idle' || session.state !== 'idle') return;
    breathOverlay.classList.remove('show');
    beginBreath();
});

breathStopBtn.addEventListener('click', () => finishBreath(false));

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && breath.state !== 'idle') finishBreath(false);
});

// با بازگشت به تب: دوباره با ساعت واقعی هماهنگ شو و wake lock را بگیر
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && breath.state !== 'idle') {
        requestSessionWakeLock();
        tickBreath();
    }
});

// تغییر زبان: متن‌های پویا را دوباره بساز
document.addEventListener('calm:languagechange', () => {
    renderBreathPanel();
    if (breath.state === 'running') {
        enterBreathPhase();
    } else if (breath.state === 'prep') {
        breathPhaseEl.textContent = bt('breathPrep');
    }
});

loadBreathSettings();
renderBreathPanel();

// ============================================
// لینک جلسه‌ی آماده (پارامترهای آدرس)
// ============================================
// نمونه‌ها:
//   ?breath=478&rounds=8&img=2       تنفس ۴-۷-۸، ۸ دور، تصویر شماره‌ی ۲
//   ?min=10&sound=river              مدیتیشن ۱۰ دقیقه‌ای با صدای رودخانه
//   ?lang=en                         فقط زبان
//   ?min=15&bg=kaleidoscope          مدیتیشن ۱۵ دقیقه‌ای با پس‌زمینه‌ی زیبابین
// breath=الگو | min=دقیقه | sound=Fire|Jungle|River|Sea|432Hz|528Hz|Whale52Hz|none | img=0..4 یا kaleidoscope یا kaleidoscope-soft (برای مدیتیشن و تنفس) | rounds=1..99 | lang=fa|en
// تنظیمات فقط برای همین بازدید اعمال می‌شود (در localStorage ذخیره نمی‌شود)
// و جلسه بعد از فشردن «شروع» شروع می‌شود، چون مرورگر بدون کلیک اجازه‌ی پخش صدا نمی‌دهد.
(function applyUrlParams() {
    let params;
    try {
        params = new URLSearchParams(window.location.search);
    } catch (err) {
        return;
    }
    if (![...params.keys()].length) return;

    const lang = params.get('lang');
    if ((lang === 'fa' || lang === 'en') && lang !== currentLang) changeLanguage(lang);

    // تصویر پس‌زمینه: img=شماره یا kaleidoscope؛ bg=شماره یا bg=kaleidoscope هم پذیرفته می‌شود
    const bg = params.get('bg');
    const isKaleido = (v) => CANVAS_MODES.includes((v || '').toLowerCase());
    const imgRaw = params.get('img') !== null ? params.get('img') : (/^\d+$/.test(bg || '') || isKaleido(bg) ? bg : null);
    const img = parseInt(imgRaw);
    if (isKaleido(imgRaw)) {
        // فقط برای همین بازدید (ذخیره نمی‌شود)
        const mode = imgRaw.toLowerCase();
        if (bgMode !== mode) applyBgMode(mode);
    } else if (imgRaw !== null && img >= 0 && img < images.length) {
        // اگر کاربر حالت چرخشی را ذخیره کرده بود، تصویر انتخاب‌شده با لینک ثابت بماند (ذخیره نمی‌شود)
        if (bgMode !== 'single') applyBgMode('single');
        setBackground(img);
    }

    // صدای طبیعت: sound=نام؛ bg=نام هم پذیرفته می‌شود
    const soundRaw = (params.get('sound') || (/^\d+$/.test(bg || '') || isKaleido(bg) ? '' : bg) || '').toLowerCase();
    if (soundRaw === 'none') {
        selectedSessionBg = 'none';
    } else {
        const name = Object.keys(bgSounds).find(n => n.toLowerCase() === soundRaw);
        if (name) selectedSessionBg = name;
    }

    // تنفس (اولویت بیشتر نسبت به مدیتیشن)
    const breathParam = params.get('breath');
    const minutes = parseInt(params.get('min'));
    let launch = null;

    if (breathParam && BREATH_PATTERNS[breathParam] && breathParam !== 'custom') {
        breathSettings.pattern = breathParam;
        const rounds = parseInt(params.get('rounds'));
        if (rounds >= BREATH_MIN_ROUNDS && rounds <= BREATH_MAX_ROUNDS) {
            breathSettings.rounds = rounds;
            breathSettings.infinite = false;
        }
        renderBreathPanel();
        launch = () => {
            if (breath.state !== 'idle' || session.state !== 'idle') return;
            beginBreath();
        };
    } else if (minutes >= SESSION_MIN_MINUTES && minutes <= SESSION_MAX_MINUTES) {
        if (['10', '15', '30', '60'].includes(String(minutes))) {
            selectedDuration = String(minutes);
        } else {
            selectedDuration = 'custom';
            sessionCustomInput.value = minutes;
        }
        launch = () => {
            if (breath.state !== 'idle' || session.state !== 'idle') return;
            beginSession();
        };
    }
    renderSessionSetup();

    if (launch) {
        // بعد از شنونده‌ی اصلی دکمه‌ی شروع اجرا می‌شود (overlay بسته و تایمر راه افتاده)
        startBtn.addEventListener('click', launch, { once: true });
        track('shared_link_open', { kind: breathParam ? 'breath' : 'session' });
    }
})();

// ============================================
// تازه‌ها: نشان «جدید» روی آیکون‌ها + پنجره‌ی تازه‌ها
// ============================================
// برای معرفی قابلیت جدید فقط یک مورد به WHATS_NEW اضافه کنید (id بزرگ‌تر از همه‌ی قبلی‌ها):
// - id: عدد صعودی | titleKey/bodyKey: کلیدهای translations
// - badge: (اختیاری) id دکمه‌ای که نقطه‌ی «جدید» می‌گیرد؛ با اولین کلیک کاربر برداشته می‌شود
// - until: (اختیاری) تاریخ YYYY-MM-DD؛ بعد از آن نقطه‌ی روی آیکون دیگر نشان داده نمی‌شود
// بازدیدکننده‌ی تازه‌وارد همه‌چیز را «تازه» می‌بیند، پس برایش هیچ نشانی گذاشته نمی‌شود.

// آدرس بلاگ به زبان فعلی (صفحه‌ی بلاگ در تب جدید باز می‌شود تا جلسه‌ی در حال اجرا قطع نشود)
const blogUrl = () => (currentLang === 'en' ? '/en/blog/' : '/blog/');

const WHATS_NEW = [
    { id: 4, titleKey: 'wnBlogTitle', bodyKey: 'wnBlogBody', linkKey: 'wnBlogLink', until: '2027-01-31' },
    { id: 3, titleKey: 'wnKaleidoTitle', bodyKey: 'wnKaleidoBody', badge: 'settingsIcon', until: '2027-01-31' },
    { id: 2, titleKey: 'wn432Title', bodyKey: 'wn432Body', badge: 'bgSoundsIcon', until: '2026-12-31' },
    { id: 1, titleKey: 'wnMeditationTitle', bodyKey: 'wnMeditationBody', badge: 'meditationIcon', until: '2026-12-31' }
];

const WN_SEEN_KEY = 'calm-whatsnew-seen';       // بزرگ‌ترین id که کاربر در پنجره دیده
const WN_BADGES_KEY = 'calm-whatsnew-badges';   // idهایی که نقطه‌ی آیکونشان برداشته شده

const whatsNew = (function setupWhatsNew() {
    const btn = document.getElementById('whatsNewBtn');
    const dot = document.getElementById('whatsNewDot');
    const overlay = document.getElementById('whatsNewOverlay');
    const list = document.getElementById('whatsNewList');
    const closeBtn = document.getElementById('closeWhatsNewPanel');
    if (!btn || !dot || !overlay || !list || !closeBtn) return { unseenCount: () => 0, open() {} };
    
    const latestId = Math.max(0, ...WHATS_NEW.map(item => item.id));
    const readNum = (key) => {
        try {
            const raw = localStorage.getItem(key);
            return raw === null ? null : Number(raw);
        } catch (e) { return null; }
    };
    const writeStr = (key, value) => {
        try { localStorage.setItem(key, value); } catch (e) { /* حالت خصوصی/ذخیره‌سازی بسته */ }
    };
    const readBadges = () => {
        try {
            const arr = JSON.parse(localStorage.getItem(WN_BADGES_KEY) || '[]');
            return Array.isArray(arr) ? arr : [];
        } catch (e) { return []; }
    };
    
    // اولین بازدید: همه‌چیز را دیده‌شده حساب کن (بدون هیچ نشانی)
    if (readNum(WN_SEEN_KEY) === null) {
        writeStr(WN_SEEN_KEY, String(latestId));
        writeStr(WN_BADGES_KEY, JSON.stringify(WHATS_NEW.map(item => item.id)));
    }
    
    const seenId = () => readNum(WN_SEEN_KEY) || 0;
    const unseenItems = () => WHATS_NEW.filter(item => item.id > seenId());
    
    function renderDot() {
        const has = unseenItems().length > 0;
        dot.hidden = !has;
        btn.classList.toggle('has-unseen', has);
    }
    
    function renderBadges() {
        const dismissed = readBadges();
        const today = new Date().toISOString().slice(0, 10);
        WHATS_NEW.forEach(item => {
            const el = item.badge && document.getElementById(item.badge);
            if (!el) return;
            const active = !dismissed.includes(item.id) && (!item.until || today <= item.until);
            el.classList.toggle('has-new-badge', active);
            if (active && !el.dataset.wnBound) {
                el.dataset.wnBound = '1';
                el.addEventListener('click', () => {
                    const next = readBadges();
                    if (!next.includes(item.id)) next.push(item.id);
                    writeStr(WN_BADGES_KEY, JSON.stringify(next));
                    el.classList.remove('has-new-badge');
                });
            }
        });
    }
    
    function renderList() {
        const t = translations[currentLang];
        const unseen = new Set(unseenItems().map(item => item.id));
        list.textContent = '';
        WHATS_NEW.forEach(item => {
            const li = document.createElement('li');
            li.className = 'whatsnew-item' + (unseen.has(item.id) ? ' is-unseen' : '');
            const h = document.createElement('h3');
            h.className = 'whatsnew-item-title';
            h.textContent = t[item.titleKey];
            if (unseen.has(item.id)) {
                const tag = document.createElement('span');
                tag.className = 'whatsnew-tag';
                tag.textContent = t.whatsNewTag;
                h.appendChild(tag);
            }
            const p = document.createElement('p');
            p.className = 'whatsnew-item-body';
            p.textContent = t[item.bodyKey];
            li.append(h, p);
            if (item.linkKey) {
                const a = document.createElement('a');
                a.className = 'whatsnew-link';
                a.href = blogUrl();
                a.target = '_blank';
                a.rel = 'noopener';
                a.textContent = t[item.linkKey];
                a.addEventListener('click', () => track('blog_open', { from: 'whats_new' }));
                li.appendChild(a);
            }
            list.appendChild(li);
        });
    }
    
    function open() {
        const unseenCount = unseenItems().length;
        renderList(); // قبل از ثبت «دیده‌شد»، تا برچسب «جدید» هنوز نشان داده شود
        overlay.classList.add('show');
        writeStr(WN_SEEN_KEY, String(latestId));
        renderDot();
        track('whats_new_open', { unseen: unseenCount });
    }
    
    const close = () => overlay.classList.remove('show');
    btn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });
    document.addEventListener('calm:languagechange', () => {
        // متن‌ها با زبان عوض می‌شوند؛ برچسب «جدید» تا بسته شدن پنجره می‌ماند
        if (overlay.classList.contains('show')) renderList();
    });
    
    setupDialogFocusTrap(overlay);
    renderDot();
    renderBadges();
    
    return { unseenCount: () => unseenItems().length, open };
})();

// ============================================
// PWA: ثبت Service Worker + اعلان «نسخه‌ی جدید آماده است»
// ============================================
// SW جدید خودش فعال می‌شود (skipWaiting) ولی صفحه‌ی باز تا رفرش همان نسخه‌ی قبلی را نشان می‌دهد.
// پس یک نوار کوچک می‌آید؛ رفرش خودکار نمی‌کنیم تا جلسه‌ی مدیتیشن/تنفس قطع نشود.
const UPDATED_FLAG = 'calm-just-updated';

function setupUpdateNotice(registration) {
    const toast = document.getElementById('updateToast');
    const reloadBtn = document.getElementById('updateReloadBtn');
    const dismissBtn = document.getElementById('updateDismissBtn');
    if (!toast || !reloadBtn || !dismissBtn) return;
    let announced = false;
    
    const busy = () => session.state !== 'idle' || breath.state !== 'idle';
    
    function announce() {
        if (announced) return;
        announced = true;
        // وسط مدیتیشن یا تنفس مزاحم نمی‌شویم؛ بعد از پایان نشان می‌دهیم
        const tryShow = () => {
            if (busy()) { setTimeout(tryShow, 5000); return; }
            toast.hidden = false;
            track('update_notice_shown');
        };
        tryShow();
    }
    
    reloadBtn.addEventListener('click', () => {
        try { sessionStorage.setItem(UPDATED_FLAG, '1'); } catch (e) { /* ignore */ }
        track('update_notice_reload');
        window.location.reload();
    });
    dismissBtn.addEventListener('click', () => { toast.hidden = true; });
    
    // فقط وقتی قبلاً SW فعالی بوده (نصب اول، «به‌روزرسانی» نیست)
    const watch = (worker) => worker.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) announce();
    });
    if (registration.waiting && navigator.serviceWorker.controller) announce();
    if (registration.installing) watch(registration.installing);
    registration.addEventListener('updatefound', () => {
        if (registration.installing) watch(registration.installing);
    });
    
    // اپ نصب‌شده ممکن است ساعت‌ها باز بماند: با برگشتن به برنامه دنبال نسخه‌ی تازه بگرد
    let lastCheck = Date.now();
    document.addEventListener('visibilitychange', () => {
        if (document.hidden || Date.now() - lastCheck < 30 * 60 * 1000) return;
        lastCheck = Date.now();
        registration.update().catch(() => {});
    });
}

// بعد از «به‌روزرسانی»: وقتی کاربر «شروع» را زد، یک‌بار پنجره‌ی تازه‌ها را نشان بده (اگر چیز دیده‌نشده‌ای هست)
(function showWhatsNewAfterUpdate() {
    let flagged = false;
    try {
        flagged = sessionStorage.getItem(UPDATED_FLAG) === '1';
        sessionStorage.removeItem(UPDATED_FLAG);
    } catch (e) { /* ignore */ }
    if (!flagged || whatsNew.unseenCount() === 0) return;
    startBtn.addEventListener('click', () => {
        setTimeout(() => {
            // اگر لینک اشتراکی جلسه را شروع کرده، مزاحمش نمی‌شویم
            if (session.state === 'idle' && breath.state === 'idle') whatsNew.open();
        }, 800);
    }, { once: true });
})();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(setupUpdateNotice)
            .catch(err => {
                console.warn('Service worker registration failed:', err);
            });
    });
}

// <audio preload="none"> keeps the bowl sound out of the startup. After the page has loaded (and the
// service worker has precached the sound, so this is not a second download) the chime is buffered,
// so the first gong after «شروع» plays at once, as it did with preload="auto".
(function warmUpChime() {
    function warm() {
        if (!soundEnabled || intervalId || !audio.paused || audio.currentTime > 0) return; // already in use
        if (navigator.connection && navigator.connection.saveData) return;
        audio.preload = 'auto';
        audio.src = sounds[currentSound];
        audio.load();
    }
    window.addEventListener('load', () => {
        const fallback = setTimeout(warm, 4000); // no service worker (or it failed)
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(() => { clearTimeout(fallback); warm(); });
        }
    }, { once: true });
})();


// دکمه‌ی تمام‌صفحه: فقط وقتی مرورگر Fullscreen API دارد نمایش داده می‌شود
// (آیفون Safari ندارد)
(function setupFullscreen() {
    const btn = document.getElementById('fullscreenIcon');
    if (!btn) return;
    const root = document.documentElement;
    const enter = root.requestFullscreen || root.webkitRequestFullscreen;
    if (!enter || (document.fullscreenEnabled === false)) return;
    btn.hidden = false;

    const current = () => document.fullscreenElement || document.webkitFullscreenElement;
    function sync() {
        const on = !!current();
        btn.classList.toggle('is-fullscreen', on);
        const label = translations[currentLang][on ? 'ariaExitFullscreen' : 'ariaFullscreen'];
        btn.setAttribute('aria-label', label);
        btn.title = label;
    }
    btn.addEventListener('click', () => {
        if (current()) {
            (document.exitFullscreen || document.webkitExitFullscreen).call(document);
        } else {
            const p = enter.call(root);
            if (p && p.catch) p.catch(() => {});
        }
        track('fullscreen_toggle', { on: !current() });
    });
    document.addEventListener('fullscreenchange', sync);
    document.addEventListener('webkitfullscreenchange', sync);
    syncFullscreenLabel = sync;
    sync();
})();


// منوی کناری جمع‌شونده: با رفتن موس روی دکمه‌ی منو باز می‌شود، با رفتن موس بیرون
// (یا کلیک بیرون / Esc) بسته می‌شود. در لمسی با ضربه باز و بسته می‌شود.
(function setupControlsMenu() {
    const menu = document.getElementById('controlsMenu');
    const toggle = document.getElementById('controlsToggle');
    if (!menu || !toggle) return;
    let closeTimer = null;

    function setOpen(on) {
        clearTimeout(closeTimer);
        menu.classList.toggle('open', on);
        toggle.setAttribute('aria-expanded', on ? 'true' : 'false');
    }
    function closeSoon() {
        clearTimeout(closeTimer);
        closeTimer = setTimeout(() => {
            if (!menu.contains(document.activeElement) || !menu.matches(':focus-within')) setOpen(false);
        }, 250);
    }

    toggle.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') setOpen(true); });
    menu.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' && menu.classList.contains('open')) clearTimeout(closeTimer); });
    menu.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { clearTimeout(closeTimer); closeTimer = setTimeout(() => setOpen(false), 250); } });
    toggle.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
    // keyboard: focusing any button inside opens the menu
    menu.addEventListener('focusin', e => { if (e.target.matches(':focus-visible')) setOpen(true); });
    menu.addEventListener('focusout', e => { if (!menu.contains(e.relatedTarget)) closeSoon(); });
    document.addEventListener('pointerdown', e => { if (!menu.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
    // choosing an item (opens a panel / starts something) folds the menu again
    menu.querySelectorAll('button:not(.controls-toggle)').forEach(b => {
        b.addEventListener('click', () => { if (b.id !== 'fullscreenIcon') setOpen(false); });
    });
})();
