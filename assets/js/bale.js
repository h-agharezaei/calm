/**
 * Calm - Bale Mini App integration
 *
 * Active only when the page is opened inside Bale (window.Bale.WebApp exists and has initData
 * or runs in an iframe). Outside Bale (normal browser / PWA) this file does nothing.
 *
 * Docs: https://docs.bale.ai/miniapp
 */
(function () {
    const tg = window.Bale && window.Bale.WebApp;
    if (!tg) return; // SDK not loaded (normal browser, or tapi.bale.ai unreachable)

    const PANEL_IDS = ['settingsOverlay', 'intervalOverlay', 'bgSoundsOverlay', 'meditationOverlay', 'breathOverlay'];

    function safe(fn) {
        try { return fn(); } catch (e) { return undefined; }
    }

    document.documentElement.classList.add('bale-miniapp');

    safe(() => tg.ready());
    safe(() => tg.expand());

    // --- Back button: visible while a panel is open; closes it. Otherwise Bale's own back closes the app. ---
    const panels = PANEL_IDS.map((id) => document.getElementById(id)).filter(Boolean);

    function anyPanelOpen() {
        return panels.some((p) => p.classList.contains('show'));
    }

    function syncBackButton() {
        if (!tg.BackButton) return;
        safe(() => (anyPanelOpen() ? tg.BackButton.show() : tg.BackButton.hide()));
    }

    // Reuse the existing Escape handlers (they close every panel and stop a breathing session)
    function onBack() {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        syncBackButton();
    }

    if (tg.BackButton) {
        safe(() => tg.BackButton.onClick(onBack));
        const observer = new MutationObserver(syncBackButton);
        panels.forEach((p) => observer.observe(p, { attributes: true, attributeFilter: ['class'] }));
        syncBackButton();
    }

    // --- Theme: only the header color; the app keeps its own look ---
    if (typeof tg.setHeaderColor === 'function') {
        safe(() => tg.setHeaderColor('#667eea'));
    }
})();
