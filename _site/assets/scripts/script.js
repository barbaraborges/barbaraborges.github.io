const reduceFontSizeBtn = document.getElementById('reduce-font-size-btn');
const increaseFontSizeBtn = document.getElementById('increase-font-size-btn');

let showReduceFontSizeBtn = true;
let showIncreaseFontSizeBtn = true;

function changeFontSize(delta) {
    const root = document.documentElement;

    // Get the current max and min padding based on viewport width
    // Mobile and Small Screens (< 1024px): max = 1, min = 0.25
    // Desktop (>= 1024px): max = 4, min = 0.25
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const isDesktop = viewportWidth >= 1024;
   
    const minFontSizeMultiplier = 1;
    const maxFontSizeMultiplier = isDesktop ? 2.5 : 1.5;

    const maxBasePaddingMultiplier = isDesktop ? 4 : 0.25;
    const minBasePaddingMultiplier = 0.25;

    // Font size
    const initialFontSize = root.style.getPropertyValue("--base-font-size") || getComputedStyle(root).getPropertyValue("--base-font-size");
    const currentFontSize = Number.parseFloat(initialFontSize);

    const newFontSize = Math.max(minFontSizeMultiplier, Math.min(currentFontSize + delta, maxFontSizeMultiplier));

    root.style.setProperty("--base-font-size", String(newFontSize));

    // Update buttons visibility
    showIncreaseFontSizeBtn = newFontSize >= maxFontSizeMultiplier ? false : true;
    showReduceFontSizeBtn = newFontSize <= minFontSizeMultiplier ? false : true;

    reduceFontSizeBtn.style.display = showReduceFontSizeBtn ? 'inline-flex' : 'none';
    increaseFontSizeBtn.style.display = showIncreaseFontSizeBtn ? 'inline-flex' : 'none';

    // Calculate padding inversely proportional to font size
    // When font size increases, padding decreases proportionally
    const fontRange = maxFontSizeMultiplier - minFontSizeMultiplier;
    const paddingRange = maxBasePaddingMultiplier - minBasePaddingMultiplier;
    const ratio = (newFontSize - minFontSizeMultiplier) / fontRange;
    const newPaddingSize = maxBasePaddingMultiplier - (ratio * paddingRange);
    const clampedPaddingSize = Math.max(minBasePaddingMultiplier, Math.min(newPaddingSize, maxBasePaddingMultiplier));
    
    root.style.setProperty("--base-padding", String(clampedPaddingSize));
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
