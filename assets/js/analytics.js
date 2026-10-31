/**
 * Calm - Analytics (Google Analytics 4 / Google Tag Manager)
 *
 * - Analytics is on by default (no consent banner).
 * - The user can turn it off at any time from Settings; the choice is remembered.
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
    const OPT_OUT_KEY = 'calm-analytics-consent'; // 'denied' = user turned analytics off

    const configured = /^(G|GTM)-[A-Z0-9]+$/i.test(ANALYTICS_ID);
    const useTagManager = /^GTM-/i.test(ANALYTICS_ID);

    let scriptLoaded = false;
    let active = false; // analytics running (not switched off by the user)

    function readChoice() {
        try { return localStorage.getItem(OPT_OUT_KEY); } catch (e) { return null; }
    }

    function writeChoice(value) {
        try { localStorage.setItem(OPT_OUT_KEY, value); } catch (e) { /* ignore */ }
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

        // Events are queued in dataLayer right away; the (large) tag script itself is fetched only
        // after the page has loaded and gone idle, so it never competes with the app's own startup.
        const inject = () => document.head.appendChild(script);
        const whenIdle = () => (window.requestIdleCallback
            ? window.requestIdleCallback(inject, { timeout: 3000 })
            : setTimeout(inject, 1500));
        if (document.readyState === 'complete') whenIdle();
        else window.addEventListener('load', whenIdle, { once: true });
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

    // ---------- Settings switch ----------
    const section = document.getElementById('analyticsSection');
    const toggle = document.getElementById('analyticsToggle');

    function applyChoice(value) {
        writeChoice(value);
        setActive(value !== 'denied');
        if (toggle) toggle.checked = value !== 'denied';
    }

    window.calmAnalytics = { track, enabled: configured };

    if (!configured) {
        // Feature off: keep the UI hidden
        return;
    }

    if (section) section.hidden = false;

    // On unless the user turned it off earlier
    const optedOut = readChoice() === 'denied';
    if (toggle) toggle.checked = !optedOut;
    setActive(!optedOut);

    if (toggle) toggle.addEventListener('change', () => applyChoice(toggle.checked ? 'granted' : 'denied'));
})();
