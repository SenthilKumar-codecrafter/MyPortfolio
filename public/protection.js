/**
 * Website Protection Script
 * Deter casual inspection and source code viewing.
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  CONTROL SWITCH                                             │
 * │  Set PROTECTION_ENABLED = true  → restrict right-click     │
 * │                                   and DevTools shortcuts   │
 * │  Set PROTECTION_ENABLED = false → allow inspect / DevTools │
 * └─────────────────────────────────────────────────────────────┘
 */
const PROTECTION_ENABLED = true; // ← change to false to allow inspect

if (PROTECTION_ENABLED) {

    // Disable right-click context menu
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    }, false);

    // Disable keyboard shortcuts for developer tools
    document.addEventListener('keydown', function (e) {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }

        // Ctrl+Shift+I (Inspect)
        if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 105)) {
            e.preventDefault();
            return false;
        }

        // Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && (e.keyCode === 74 || e.keyCode === 106)) {
            e.preventDefault();
            return false;
        }

        // Ctrl+Shift+C (Element picker)
        if (e.ctrlKey && e.shiftKey && (e.keyCode === 67 || e.keyCode === 99)) {
            e.preventDefault();
            return false;
        }

        // Ctrl+U (View Source)
        if (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 117)) {
            e.preventDefault();
            return false;
        }

        // Ctrl+S (Save Page)
        if (e.ctrlKey && (e.keyCode === 83 || e.keyCode === 115)) {
            e.preventDefault();
            return false;
        }
    }, false);

    // Deter text selection (as a backup to CSS)
    document.addEventListener('selectstart', function (e) {
        e.preventDefault();
    }, false);

    console.log("%cProtection active.", "color: red; font-size: 20px; font-weight: bold;");

} else {
    console.log("%cProtection disabled — DevTools are allowed.", "color: green; font-size: 16px; font-weight: bold;");
}
