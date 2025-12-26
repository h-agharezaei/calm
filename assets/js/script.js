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
const intervalInput = document.getElementById('interval');
const updateBtn = document.getElementById('updateBtn');
const statusSpan = document.getElementById('status');
const startOverlay = document.getElementById('startOverlay');
const startBtn = document.getElementById('startBtn');
const bgModeSelect = document.getElementById('bgMode');
const bgIntervalInput = document.getElementById('bgInterval');
const updateBgBtn = document.getElementById('updateBgBtn');
const bgIntervalRow = document.getElementById('bgIntervalRow');
const imageSelectRow = document.getElementById('imageSelectRow');
const thumbnails = document.querySelectorAll('.thumbnail');
const backgroundImage = document.querySelector('.background-image');
const soundToggle = document.getElementById('soundToggle');
const settingsIcon = document.getElementById('settingsIcon');
const settingsOverlay = document.getElementById('settingsOverlay');
const controlPanel = document.getElementById('controlPanel');
const closePanel = document.getElementById('closePanel');

// ============================================
// متغیرهای برنامه
// ============================================

// متغیرهای مربوط به پخش صدا
let intervalTime = 30000; // پیش‌فرض 30 ثانیه (به میلی‌ثانیه)
let intervalId = null;
let countdown = intervalTime / 1000;
let countdownId = null;
let soundEnabled = true;

// متغیرهای مربوط به تصاویر پس‌زمینه
const images = ['00.jpg', '01.jpg', '02.jpg', '03.jpg', '04.jpg'];
let currentImageIndex = Math.floor(Math.random() * images.length); // شروع با عکس تصادفی
let bgIntervalTime = 60000; // پیش‌فرض 60 ثانیه
let bgIntervalId = null;
let bgMode = 'single'; // 'single' یا 'rotation'

// ============================================
// توابع مدیریت تصاویر پس‌زمینه
// ============================================

// تابع تنظیم پس‌زمینه
function setBackground(index) {
    currentImageIndex = index;
    backgroundImage.style.backgroundImage = `url('assets/images/${images[currentImageIndex]}')`;
    
    // به‌روزرسانی thumbnail فعال
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    const activeThumbnail = document.querySelector(`.thumbnail[data-index="${index}"]`);
    if (activeThumbnail) {
        activeThumbnail.classList.add('active');
    }
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
        startCountdown();
        return;
    }
    
    audio.currentTime = 0;
    audio.play()
        .then(() => {
            console.log('صدا با موفقیت پخش شد');
            updateStatus('در حال پخش...');
            setTimeout(() => {
                startCountdown();
            }, 1000);
        })
        .catch(error => {
            console.error('خطا در پخش صدا:', error);
            updateStatus('خطا در پخش صدا');
        });
}

// تابع به‌روزرسانی وضعیت
function updateStatus(message) {
    statusSpan.textContent = message;
}

// تابع شمارش معکوس
function startCountdown() {
    // پاک کردن شمارش معکوس قبلی
    if (countdownId) {
        clearInterval(countdownId);
    }
    
    countdown = intervalTime / 1000;
    
    countdownId = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            updateStatus(`پخش بعدی در ${countdown} ثانیه...`);
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
    }
    if (countdownId) {
        clearInterval(countdownId);
    }
    
    // پخش فوری اولین صدا
    playSound();
    
    // تنظیم تایمر برای پخش‌های بعدی
    intervalId = setInterval(() => {
        playSound();
    }, intervalTime);
}

// رویداد کلیک دکمه تغییر بازه
updateBtn.addEventListener('click', () => {
    const newInterval = parseInt(intervalInput.value);
    
    if (newInterval && newInterval > 0) {
        intervalTime = newInterval * 1000; // تبدیل به میلی‌ثانیه
        updateStatus(`بازه زمانی به ${newInterval} ثانیه تغییر یافت`);
        startTimer();
    } else {
        alert('لطفا یک عدد معتبر وارد کنید');
    }
});

// رویداد Enter در فیلد ورودی
intervalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        updateBtn.click();
    }
});

// رویداد تغییر حالت پس‌زمینه
bgModeSelect.addEventListener('change', (e) => {
    bgMode = e.target.value;
    
    if (bgMode === 'rotation') {
        bgIntervalRow.style.display = 'flex';
        imageSelectRow.style.display = 'none';
        startBackgroundRotation();
    } else {
        bgIntervalRow.style.display = 'none';
        imageSelectRow.style.display = 'flex';
        stopBackgroundRotation();
    }
});

// رویداد انتخاب عکس در حالت ثابت
thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
        const selectedIndex = parseInt(thumbnail.dataset.index);
        setBackground(selectedIndex);
    });
});

// رویداد تغییر زمان چرخش پس‌زمینه
updateBgBtn.addEventListener('click', () => {
    const newInterval = parseInt(bgIntervalInput.value);
    
    if (newInterval && newInterval >= 5) {
        bgIntervalTime = newInterval * 1000;
        if (bgMode === 'rotation') {
            startBackgroundRotation();
        }
    } else {
        alert('لطفا یک عدد معتبر وارد کنید (حداقل 5 ثانیه)');
    }
});

// رویداد Enter در فیلد بازه پس‌زمینه
bgIntervalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        updateBgBtn.click();
    }
});

// رویداد تغییر وضعیت پخش صدا
soundToggle.addEventListener('change', (e) => {
    soundEnabled = e.target.checked;
    
    if (soundEnabled) {
        updateStatus('پخش صدا فعال شد');
        // اگر تایمر در حال اجرا نیست، شروع کن
        if (!intervalId) {
            startTimer();
        }
    } else {
        // متوقف کردن صدای در حال پخش
        audio.pause();
        audio.currentTime = 0;
        
        // متوقف کردن شمارش معکوس
        if (countdownId) {
            clearInterval(countdownId);
            countdownId = null;
        }
        
        updateStatus('پخش صدا غیرفعال شد');
    }
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

// تنظیم پس‌زمینه اولیه با عکس تصادفی
setBackground(currentImageIndex);

// رویداد کلیک آیکون تنظیمات
settingsIcon.addEventListener('click', () => {
    settingsOverlay.classList.add('show');
});

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

// جلوگیری از توقف تایمر هنگام تغییر تب
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !intervalId) {
        startTimer();
    }
});
