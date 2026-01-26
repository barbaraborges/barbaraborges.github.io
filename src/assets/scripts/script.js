function changeFontSize(delta) {
    const root = document.documentElement;

    // Get the current max and min padding based on viewport width
    // Mobile (< 768px): max = 1, min = 0.25 (allows padding to decrease)
    // Desktop (>= 1280px): max = 4, min = 1
    // This matches the CSS media query breakpoint
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const isDesktop = viewportWidth >= 768;
    const maxBasePaddingMultiplier = isDesktop ? 4 : 1;
    const minBasePaddingMultiplier = isDesktop ? 1 : 0.25;
    const minFontSizeMultiplier = 1;
    const maxFontSizeMultiplier = isDesktop ? 3 : 1.5;
    const step = 0.25;

    // Font size
    // Prefer the inline value we previously set; fall back to computed
    const initialFontSize = root.style.getPropertyValue("--base-font-size") || getComputedStyle(root).getPropertyValue("--base-font-size");
    const currentFontSize = Number.parseFloat(initialFontSize) || minFontSizeMultiplier;
    const unclampedFontSize = currentFontSize + delta;
    const clampedFontSize = Math.min(maxFontSizeMultiplier, Math.max(minFontSizeMultiplier, unclampedFontSize));
    // Avoid float drift (e.g. 1.0000000002) which can look like “bouncing”.
    const roundedFontSize = Math.round(clampedFontSize / step) * step;
    // No-op if nothing changes.
    if (roundedFontSize === currentFontSize) 
        return;

    root.style.setProperty("--base-font-size", String(roundedFontSize));


    // Calculate padding inversely proportional to font size
    // When font size increases, padding decreases proportionally
    const fontSizeRange = maxFontSizeMultiplier - minFontSizeMultiplier;
    const paddingRange = maxBasePaddingMultiplier - minBasePaddingMultiplier;
    // Calculate progress: 0 when fontSize is at min (1), 1 when fontSize is at max (3)
    const fontSizeProgress = fontSizeRange > 0 ? (roundedFontSize - minFontSizeMultiplier) / fontSizeRange : 0;
    
    // Inverse relationship: when progress is 0 (fontSize=min), padding=max; when progress is 1 (fontSize=max), padding=min
    // Formula: padding = maxPadding - (progress * paddingRange)
    // On desktop (maxPadding=4, minPadding=1): fontSize=1 → padding=4, fontSize=2 → padding=2.5, fontSize=3 → padding=1
    // On mobile (maxPadding=1, minPadding=0.25): fontSize=1 → padding=1, fontSize=2 → padding=0.625, fontSize=3 → padding=0.25
    const calculatedPadding = maxBasePaddingMultiplier - (fontSizeProgress * paddingRange);
    // Avoid float drift (e.g. 1.0000000002) which can look like “bouncing”.
    const roundedBasePadding = Math.round(calculatedPadding / step) * step;
    const clampedBasePadding = Math.min(maxBasePaddingMultiplier, Math.max(minBasePaddingMultiplier, roundedBasePadding));
    
    root.style.setProperty("--base-padding", String(clampedBasePadding));
    
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
    } else {
        toggleButton.textContent = 'Off';
    } toggleButton.addEventListener('click', function () {
        const isRotating = starImage.classList.contains('rotating');
        if (isRotating) {
            starImage.classList.remove('rotating');
            toggleButton.setAttribute('aria-pressed', 'false');
            toggleButton.textContent = 'Off';
            localStorage.setItem('starAnimation', 'false');
        } else {
            starImage.classList.add('rotating');
            toggleButton.setAttribute('aria-pressed', 'true');
            toggleButton.textContent = 'On';
            localStorage.setItem('starAnimation', 'true');
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
// Header toggle for mobile
function initHeaderToggle() {
    const toggleButton = document.getElementById('header-toggle');
    const headerControls = document.getElementById('header-controls');
    
    if (!toggleButton || !headerControls) return;
    
    // Check if controls should be collapsed (stored in localStorage)
    const isCollapsed = localStorage.getItem('headerCollapsed') === 'true';
    if (isCollapsed) {
        headerControls.classList.add('collapsed');
        toggleButton.textContent = 'Show controls';
        toggleButton.setAttribute('aria-expanded', 'false');
    }
    
    toggleButton.addEventListener('click', function() {
        const isCollapsed = headerControls.classList.contains('collapsed');
        
        if (isCollapsed) {
            headerControls.classList.remove('collapsed');
            toggleButton.textContent = 'Hide Settings';
            toggleButton.setAttribute('aria-expanded', 'true');
            localStorage.setItem('headerCollapsed', 'false');
        } else {
            headerControls.classList.add('collapsed');
            toggleButton.textContent = 'Show Settings';
            toggleButton.setAttribute('aria-expanded', 'false');
            localStorage.setItem('headerCollapsed', 'true');
        }
    });
}

// Wait for DOM to be ready
function initAll() {
    initStarAnimation();
    initThemeSwitcher();
    initHeaderToggle();
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else { // DOM is already ready
    initAll();
}
