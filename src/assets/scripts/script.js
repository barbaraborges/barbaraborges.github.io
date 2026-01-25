function changeFontSize(delta) {
    const root = document.documentElement;
    const minFontSizeMultiplier = 1;
    const maxFontSizeMultiplier = 3;
    const minBasePaddingMultiplier = 1;
    const maxBasePaddingMultiplier = 4;
    // Font size
    // //Prefer the inline value we previously set; fall back to computed
    const initialFontSize = root.style.getPropertyValue("--base-font-size") || getComputedStyle(root).getPropertyValue("--base-font-size");
    const currentFontSize = Number.parseFloat(initialFontSize) || minFontSizeMultiplier;
    const unclampedFontSize = currentFontSize + delta;
    const clampedFontSize = Math.min(maxFontSizeMultiplier, Math.max(minFontSizeMultiplier, unclampedFontSize));
    // Avoid float drift (e.g. 1.0000000002) which can look like “bouncing”.
    const roundedFontSize = Math.round(clampedFontSize / delta) * delta;
    // No-op if nothing changes.
    if (roundedFontSize === currentFontSize) 
        return;

    // Base padding
    const initialBasePadding = root.style.getPropertyValue("--base-padding") || getComputedStyle(root).getPropertyValue("--base-padding");
    const currentBasePadding = Number.parseFloat(initialBasePadding) || minBasePaddingMultiplier;
    const unclampedBasePadding = currentBasePadding - delta;
    const clampedBasePadding = Math.min(maxBasePaddingMultiplier, Math.max(minBasePaddingMultiplier, unclampedBasePadding));
    // Avoid float drift (e.g. 1.0000000002) which can look like “bouncing”.
    const roundedBasePadding = Math.round(clampedBasePadding / delta) * delta;
    // No-op if nothing changes.
    if (roundedBasePadding === currentBasePadding) 
    
    root.style.setProperty("--base-padding", String(roundedBasePadding));
    root.style.setProperty("--base-font-size", String(roundedFontSize));
}
// Star animation toggle
function initStarAnimation() {
    const toggleButton = document.getElementById('star-animation-toggle');
    const starImage = document.querySelector('.avatar-star');
    if (! toggleButton || ! starImage) 
        return;
    
    // Check if animation is enabled (stored in localStorage)
    const isAnimated = localStorage.getItem('starAnimation') === 'true';
    if (isAnimated) {
        starImage.classList.add('rotating');
        toggleButton.setAttribute('aria-pressed', 'true');
        toggleButton.textContent = 'On';
        console.log('Animation started on page load');
    } else {
        toggleButton.textContent = 'Off';
    } toggleButton.addEventListener('click', function () {
        const isRotating = starImage.classList.contains('rotating');
        console.log('Toggle clicked. Current state:', isRotating);
        if (isRotating) {
            starImage.classList.remove('rotating');
            toggleButton.setAttribute('aria-pressed', 'false');
            toggleButton.textContent = 'Off';
            localStorage.setItem('starAnimation', 'false');
            console.log('Animation stopped');
        } else {
            starImage.classList.add('rotating');
            toggleButton.setAttribute('aria-pressed', 'true');
            toggleButton.textContent = 'On';
            localStorage.setItem('starAnimation', 'true');
            console.log('Animation started');
        }
    });
}
// Theme switcher
function initThemeSwitcher() {
    const themeSelect = document.getElementById('theme-select');
    const root = document.documentElement;
    if (! themeSelect) 
        return;
    
    // Default theme colors
    const themes = {
        'sunny-day': {
            '--header-bg-color': '#F6EBC8',
            '--bg-color': '#BFDAFF',
            '--primary-color': '#04474F'
        },
        'eclipse': {
            '--header-bg-color': '#592727',
            '--bg-color': '#031630',
            '--primary-color': '#fff'
        }
    };
    // Apply theme
    function applyTheme(themeName) {
        const theme = themes[themeName];
        if (theme) {
            Object.entries(theme).forEach(([property, value]) => {
                root.style.setProperty(property, value);
            });
            localStorage.setItem('theme', themeName);
        }
    }
    // Load saved theme or default
    const savedTheme = localStorage.getItem('theme') || 'sunny-day';
    themeSelect.value = savedTheme;
    applyTheme(savedTheme);
    // Handle theme change
    themeSelect.addEventListener('change', function () {
        applyTheme(this.value);
    });
}
// Wait for DOM to be ready
function initAll() {
    initStarAnimation();
    initThemeSwitcher();
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else { // DOM is already ready
    initAll();
}
