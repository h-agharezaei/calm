/**
 * Calm - Analytics (Google Analytics 4 / Google Tag Manager)
 *
 * - Nothing is loaded and nothing is sent before the user accepts.
 * - The user can turn analytics off at any time from Settings.
 * - If ANALYTICS_ID is empty, the whole feature is disabled (no banner, no settings row).
 *   (window.CALM_ANALYTICS_ID, if defined before this script, overrides it; handy for tests.)
 *
 * Set ANALYTICS_ID to one of:
 *   'G-XXXXXXXXXX'   Google Analytics 4 measurement ID (events are sent with gtag)
 *   'GTM-XXXXXXX'    Google Tag Manager container ID (events are pushed to dataLayer;
 *                    create the GA4 tags/triggers inside Tag Manager)
 */
(function () {
    const ANALYTICS_ID = window.CALM_ANALYTICS_ID || 'G-223Q9E18JP';
    const CONSENT_KEY = 'calm-analytics-consent'; // 'granted' | 'denied'

    const configured = /^(G|GTM)-[A-Z0-9]+$/i.test(ANALYTICS_ID);
    const useTagManager = /^GTM-/i.test(ANALYTICS_ID);

    let scriptLoaded = false;
    let active = false; // consent granted and not switched off

    function readConsent() {
        try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
    }

    function writeConsent(value) {
        try { localStorage.setItem(CONSENT_KEY, value); } catch (e) { /* ignore */ }
    }

    function loadScript() {
        if (scriptLoaded) return;
        scriptLoaded = true;

        window.dataLayer = window.dataLayer || [];
        const script = document.createElement('script');
        script.async = true;

        if (useTagManager) {
            window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
            script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(ANALYTICS_ID)}`;
        } else {
            window.gtag = function () { window.dataLayer.push(arguments); };
            window.gtag('js', new Date());
            window.gtag('config', ANALYTICS_ID);
            script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ANALYTICS_ID)}`;
        }
        document.head.appendChild(script);
    }

    function setActive(on) {
        active = on;
        // Official GA4 opt-out switch (also stops events already queued in the page)
        if (!useTagManager) {
            window[`ga-disable-${ANALYTICS_ID}`] = !on;
        }
        if (on) loadScript();
    }

    function track(name, params) {
        if (!configured || !active) return;
        params = params || {};
        if (useTagManager) {
            window.dataLayer.push(Object.assign({ event: name }, params));
        } else if (window.gtag) {
            window.gtag('event', name, params);
        }
    }

    // ---------- UI: consent banner and Settings switch ----------
    const banner = document.getElementById('consentBanner');
    const acceptBtn = document.getElementById('consentAccept');
    const rejectBtn = document.getElementById('consentReject');
    const section = document.getElementById('analyticsSection');
    const toggle = document.getElementById('analyticsToggle');

    function applyConsent(value) {
        writeConsent(value);
        setActive(value === 'granted');
        if (toggle) toggle.checked = value === 'granted';
        if (banner) banner.hidden = true;
    }

    window.calmAnalytics = { track, enabled: configured };

    if (!configured) {
        // Feature off: keep the UI hidden
        return;
    }

    if (section) section.hidden = false;

    const saved = readConsent();
    if (saved === 'granted') {
        setActive(true);
        if (toggle) toggle.checked = true;
    } else if (saved === 'denied') {
        if (toggle) toggle.checked = false;
    } else if (banner) {
        banner.hidden = false; // first visit: ask
    }

    if (acceptBtn) acceptBtn.addEventListener('click', () => applyConsent('granted'));
    if (rejectBtn) rejectBtn.addEventListener('click', () => applyConsent('denied'));
    if (toggle) toggle.addEventListener('change', () => applyConsent(toggle.checked ? 'granted' : 'denied'));
})();
