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
        donationThanks: 'Thank you for your support!',
        
        // About tab
        aboutTitle: 'About Calm',
        aboutDescription: '<strong>Calm</strong> is a peaceful web space designed to help you relax, meditate and focus. Calming images and soothing sounds, without distractions.',
        aboutFeatures: 'Features',
        aboutFeature1: '<strong>Beautiful images:</strong> a collection of calming images, fixed or rotating automatically',
        aboutFeature2: '<strong>Singing bowl:</strong> a gentle chime at intervals you choose, or silence',
        aboutFeature3: '<strong>Nature sounds:</strong> fire, jungle, river and sea, each with its own volume',
        aboutFeature4: '<strong>Your settings, remembered:</strong> language, background, sounds and volumes',
        aboutFeature5: '<strong>Simple interface:</strong> no distractions, full focus',
        aboutFeature6: '<strong>Installable:</strong> add it to your home screen; the interface and images work offline',
        aboutUsage: 'How to use',
        aboutUsage1: 'Click "Start" to begin',
        aboutUsage2: 'Enjoy the images and calming sounds',
        aboutUsage3: 'Adjust the sound interval, background and volumes to your taste',
        aboutUsage4: 'Relax, meditate or focus',
        aboutVersion: 'Version',
        aboutDeveloper: 'Developed by Calm Team',
        
        // Feedback form
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
        ariaVolume: '{0} volume',
        imageAlt: 'Background image {0}',
        qrAlt: '{0} QR code',
        
        // Install
        installApp: 'Install app',
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
        donationThanks: 'از حمایت شما متشکریم!',
        
        // تب درباره
        aboutTitle: 'درباره Calm',
        aboutDescription: '<strong>Calm</strong> یک محیط وب آرامش‌بخش است که برای کمک به تمرکز، مدیتیشن و آرامش طراحی شده است. تصاویر و صداهای آرام، بدون حواس‌پرتی.',
        aboutFeatures: 'ویژگی‌ها',
        aboutFeature1: '<strong>تصاویر زیبا:</strong> مجموعه‌ای از تصاویر آرامش‌بخش، ثابت یا با چرخش خودکار',
        aboutFeature2: '<strong>کاسه آواز:</strong> صدای ملایم کاسه در بازه‌های دلخواه شما، یا سکوت',
        aboutFeature3: '<strong>صداهای طبیعت:</strong> آتش، جنگل، رودخانه و دریا، هرکدام با میزان صدای جداگانه',
        aboutFeature4: '<strong>تنظیمات شخصی:</strong> زبان، پس‌زمینه، صداها و میزان صدا به خاطر سپرده می‌شوند',
        aboutFeature5: '<strong>رابط ساده:</strong> بدون حواس‌پرتی، تمرکز کامل',
        aboutFeature6: '<strong>قابل نصب:</strong> به صفحه‌ی اصلی اضافه کنید؛ ظاهر و تصاویر آفلاین هم کار می‌کنند',
        aboutUsage: 'نحوه استفاده',
        aboutUsage1: 'روی دکمه «شروع» کلیک کنید',
        aboutUsage2: 'از تصاویر زیبا و صداهای آرامش‌بخش لذت ببرید',
        aboutUsage3: 'بازه‌ی صدا، پس‌زمینه و میزان صداها را به سلیقه‌ی خود تنظیم کنید',
        aboutUsage4: 'آرام بگیرید، مدیتیشن کنید یا تمرکز کنید',
        aboutVersion: 'نسخه',
        aboutDeveloper: 'ساخته شده توسط تیم Calm',
        
        // فرم بازخورد
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
        ariaVolume: 'میزان صدای {0}',
        imageAlt: 'تصویر پس‌زمینه {0}',
        qrAlt: 'کد QR {0}',
        
        // نصب برنامه
        installApp: 'نصب برنامه',
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
    sessionActiveNote: 'A meditation is in progress. Use the “End” button at the top to stop it.',
    ariaMeditation: 'Timed meditation',
    sessionMinutesUnit: 'minutes',
    sessionCustomAria: 'Length in minutes',
    sessionNoSound: 'No sound',
    sessionEnd: 'End',
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
    sessionActiveNote: 'یک مدیتیشن در جریان است. برای پایان، از دکمه‌ی «پایان» بالای صفحه استفاده کنید.',
    ariaMeditation: 'مدیتیشن زمان‌دار',
    sessionMinutesUnit: 'دقیقه',
    sessionCustomAria: 'مدت به دقیقه',
    sessionNoSound: 'بدون صدا',
    sessionEnd: 'پایان',
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
        track('tab_switch', { tab: targetTab });
        
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

let selectedCrypto = null;
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
        selectedCrypto = crypto;
        track('donation_click', { crypto });
        
        cryptoQR.src = data.qr;
        cryptoQR.alt = translations[currentLang].qrAlt.replace('{0}', data.name);
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
        track('donation_copy', { crypto: selectedCrypto });
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


translations.fa.bgSoundsTitle = 'صداهای پس‌زمینه';
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
const SESSION_FADE_OUT_MS = 4000;    // fade-out پایانی، درست قبل از زنگ پایان
const SESSION_STOP_FADE_MS = 1500;   // fade-out وقتی کاربر زودتر «پایان» را می‌زند
const SESSION_MIN_MINUTES = 1;
const SESSION_MAX_MINUTES = 600;

const sessionBar = document.getElementById('sessionBar');
const sessionTimeEl = document.getElementById('sessionTime');
const sessionEndBtn = document.getElementById('sessionEndBtn');
const sessionDoneEl = document.getElementById('sessionDone');
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
}));

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

function beginSession() {
    const minutes = getSessionMinutes();
    session.minutes = minutes;
    session.timed = true;
    session.periodic = false;
    session.state = 'running';
    session.startedAt = Date.now();
    // زنگ‌های دوره‌ای تا پایان جلسه متوقف می‌شوند (مگر کاربر دوباره روشنشان کند)
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    audio.pause();

    // زنگ شروع همیشه پخش می‌شود (حتی اگر preset بازه «بدون صدا» باشد)
    playSessionBell();
    session.endAt = session.startedAt + minutes * 60000;
    sessionTimeEl.textContent = formatClock(minutes * 60000);
    sessionBar.hidden = false;
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
    const remaining = session.endAt - Date.now();
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
    renderSessionPanelState();
    if (completed) showSessionDone();
    track(completed ? 'session_complete' : 'session_stopped', { minutes: session.minutes, elapsed_minutes: elapsedMin });
}

sessionEndBtn.addEventListener('click', () => finishSession(false));

// پیام کوتاه پایان مدیتیشن
let sessionDoneTimeoutId = null;
function showSessionDone() {
    sessionDoneEl.hidden = false;
    clearTimeout(sessionDoneTimeoutId);
    sessionDoneTimeoutId = setTimeout(() => { sessionDoneEl.hidden = true; }, 10000);
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
// PWA: ثبت Service Worker (نیازمند HTTPS یا localhost)
// ============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(err => {
            console.warn('Service worker registration failed:', err);
        });
    });
}
