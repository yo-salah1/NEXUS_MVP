// Country data
const countries = [
    { name: 'Egypt', code: 'EG', dialCode: '+20', flag: 'eg' },
    { name: 'United States', code: 'US', dialCode: '+1', flag: 'us' },
    { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: 'gb' },
    { name: 'Saudi Arabia', code: 'SA', dialCode: '+966', flag: 'sa' },
    { name: 'United Arab Emirates', code: 'AE', dialCode: '+971', flag: 'ae' },
    { name: 'Kuwait', code: 'KW', dialCode: '+965', flag: 'kw' },
    { name: 'Qatar', code: 'QA', dialCode: '+974', flag: 'qa' },
    { name: 'Bahrain', code: 'BH', dialCode: '+973', flag: 'bh' },
    { name: 'Oman', code: 'OM', dialCode: '+968', flag: 'om' },
    { name: 'Jordan', code: 'JO', dialCode: '+962', flag: 'jo' },
    { name: 'Lebanon', code: 'LB', dialCode: '+961', flag: 'lb' },
    { name: 'Iraq', code: 'IQ', dialCode: '+964', flag: 'iq' },
    { name: 'Palestine', code: 'PS', dialCode: '+970', flag: 'ps' },
    { name: 'Syria', code: 'SY', dialCode: '+963', flag: 'sy' },
    { name: 'Libya', code: 'LY', dialCode: '+218', flag: 'ly' },
    { name: 'Tunisia', code: 'TN', dialCode: '+216', flag: 'tn' },
    { name: 'Algeria', code: 'DZ', dialCode: '+213', flag: 'dz' },
    { name: 'Morocco', code: 'MA', dialCode: '+212', flag: 'ma' },
    { name: 'Sudan', code: 'SD', dialCode: '+249', flag: 'sd' },
    { name: 'Canada', code: 'CA', dialCode: '+1', flag: 'ca' },
    { name: 'Germany', code: 'DE', dialCode: '+49', flag: 'de' },
    { name: 'France', code: 'FR', dialCode: '+33', flag: 'fr' },
    { name: 'Italy', code: 'IT', dialCode: '+39', flag: 'it' },
    { name: 'Spain', code: 'ES', dialCode: '+34', flag: 'es' },
    { name: 'Turkey', code: 'TR', dialCode: '+90', flag: 'tr' },
    { name: 'India', code: 'IN', dialCode: '+91', flag: 'in' },
    { name: 'Pakistan', code: 'PK', dialCode: '+92', flag: 'pk' },
    { name: 'China', code: 'CN', dialCode: '+86', flag: 'cn' },
    { name: 'Japan', code: 'JP', dialCode: '+81', flag: 'jp' },
    { name: 'South Korea', code: 'KR', dialCode: '+82', flag: 'kr' },
    { name: 'Australia', code: 'AU', dialCode: '+61', flag: 'au' },
    { name: 'Brazil', code: 'BR', dialCode: '+55', flag: 'br' },
    { name: 'Russia', code: 'RU', dialCode: '+7', flag: 'ru' },
];

let selectedCountry = countries[0]; // Default: Egypt

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Initialize features
    initCountrySelector();
    initForm();
    initParticles();
    initKeyboardNavigation();
    initAdvancedEffects();
    
    console.log('✨ NEXUS Phone Login Page - Initialized');
});

// ==================== COUNTRY SELECTOR ====================
function initCountrySelector() {
    const selector = document.getElementById('countrySelector');
    const dropdown = document.getElementById('countryDropdown');
    const overlay = document.getElementById('dropdownOverlay');
    const closeBtn = document.getElementById('closeDropdown');
    const countryList = document.getElementById('countryList');
    const searchInput = document.getElementById('searchCountry');
    
    // Populate country list
    populateCountryList(countries);
    
    // Open dropdown
    selector.addEventListener('click', () => {
        dropdown.classList.add('active');
        overlay.classList.add('active');
        selector.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus search input
        setTimeout(() => {
            searchInput.focus();
        }, 300);
    });
    
    // Close dropdown
    function closeDropdown() {
        dropdown.classList.remove('active');
        overlay.classList.remove('active');
        selector.classList.remove('active');
        document.body.style.overflow = '';
        searchInput.value = '';
        populateCountryList(countries);
    }
    
    closeBtn.addEventListener('click', closeDropdown);
    overlay.addEventListener('click', closeDropdown);
    
    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = countries.filter(country => 
            country.name.toLowerCase().includes(query) ||
            country.dialCode.includes(query)
        );
        populateCountryList(filtered);
    });
}

function populateCountryList(countryData) {
    const countryList = document.getElementById('countryList');
    countryList.innerHTML = '';
    
    countryData.forEach(country => {
        const item = document.createElement('div');
        item.className = 'country-item';
        item.innerHTML = `
            <img src="https://flagcdn.com/w40/${country.flag}.png" alt="${country.name}" class="flag-icon">
            <div class="country-info">
                <div class="country-name">${country.name}</div>
                <div class="country-dial-code">${country.dialCode}</div>
            </div>
        `;
        
        item.addEventListener('click', () => {
            selectCountry(country);
        });
        
        countryList.appendChild(item);
    });
}

function selectCountry(country) {
    selectedCountry = country;
    
    // Update UI
    const flagIcon = document.getElementById('flagIcon');
    const countryCode = document.getElementById('countryCode');
    
    flagIcon.src = `https://flagcdn.com/w40/${country.flag}.png`;
    flagIcon.alt = country.name;
    countryCode.textContent = country.dialCode;
    
    // Close dropdown
    const dropdown = document.getElementById('countryDropdown');
    const overlay = document.getElementById('dropdownOverlay');
    const selector = document.getElementById('countrySelector');
    
    dropdown.classList.remove('active');
    overlay.classList.remove('active');
    selector.classList.remove('active');
    document.body.style.overflow = '';
    
    // Clear search
    document.getElementById('searchCountry').value = '';
    populateCountryList(countries);
    
    // Focus phone input
    document.getElementById('phoneInput').focus();
    
    console.log('Selected country:', country.name, country.dialCode);
}

// ==================== FORM HANDLING ====================
function initForm() {
    const form = document.getElementById('phoneForm');
    const phoneInput = document.getElementById('phoneInput');
    const continueBtn = document.getElementById('continueBtn');
    
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
    
    // Phone number formatting and validation
    phoneInput.addEventListener('input', formatPhoneNumber);
    
    // Add ripple effect on button click
    continueBtn.addEventListener('click', createButtonRipple);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const phoneInput = document.getElementById('phoneInput');
    const continueBtn = document.getElementById('continueBtn');
    const phone = phoneInput.value.trim();
    
    // Validate phone number
    if (!isValidPhone(phone)) {
        showError(phoneInput, 'Please enter a valid phone number');
        return;
    }
    
    // Remove any existing error
    removeError(phoneInput);
    
    // Add loading state
    continueBtn.classList.add('loading');
    continueBtn.disabled = true;
    
    const fullPhone = selectedCountry.dialCode + phone;
    
    // Simulate API call
    setTimeout(() => {
        console.log('📱 Phone number submitted:', fullPhone);
        
        // Redirect to verification page
        setTimeout(() => {
            window.location.href = 'verification.html'; // Change to your target page
        }, 800);
    }, 1500);
}

function formatPhoneNumber(e) {
    const input = e.target;
    let value = input.value.replace(/\D/g, ''); // Remove non-digits
    
    // Limit length based on country
    const maxLength = 15;
    if (value.length > maxLength) {
        value = value.slice(0, maxLength);
    }
    
    input.value = value;
    
    // Real-time validation feedback
    if (value.length > 0) {
        if (isValidPhone(value)) {
            input.classList.remove('error');
            removeError(input);
        }
    } else {
        input.classList.remove('error');
        removeError(input);
    }
}

function isValidPhone(phone) {
    // Basic validation: at least 7 digits
    return phone.length >= 7 && /^\d+$/.test(phone);
}

function showError(input, message) {
    // Remove existing error
    removeError(input);
    
    // Add error class
    input.classList.add('error');
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Insert after input wrapper
    const wrapper = input.closest('.phone-input-wrapper');
    wrapper.parentElement.insertBefore(errorDiv, wrapper.nextSibling);
    
    // Shake animation
    wrapper.style.animation = 'none';
    setTimeout(() => {
        wrapper.style.animation = 'shake 0.3s ease';
    }, 10);
}

function removeError(input) {
    const wrapper = input.closest('.phone-input-wrapper');
    const errorMsg = wrapper.parentElement.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
    input.classList.remove('error');
}

// ==================== PARTICLE SYSTEM ====================
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 10;
            this.size = Math.random() * 3 + 1;
            this.speedY = Math.random() * 1 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            
            if (this.y < -10) {
                this.reset();
            }
        }
        
        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Create particles
    const particleCount = window.innerWidth > 768 ? 40 : 20;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ==================== BUTTON RIPPLE EFFECT ====================
function createButtonRipple(e) {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        pointer-events: none;
        left: ${x}px;
        top: ${y}px;
        transform: scale(0);
        animation: buttonRipple 0.6s ease-out;
        z-index: 1;
    `;
    
    button.appendChild(ripple);
    
    ripple.addEventListener('animationend', () => {
        ripple.remove();
    });
}

// Add ripple animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes buttonRipple {
        to {
            transform: scale(2.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== KEYBOARD NAVIGATION ====================
function initKeyboardNavigation() {
    const phoneInput = document.getElementById('phoneInput');
    const continueBtn = document.getElementById('continueBtn');
    
    // ESC to close dropdown
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const dropdown = document.getElementById('countryDropdown');
            const overlay = document.getElementById('dropdownOverlay');
            const selector = document.getElementById('countrySelector');
            
            if (dropdown.classList.contains('active')) {
                dropdown.classList.remove('active');
                overlay.classList.remove('active');
                selector.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
    
    // Auto-focus phone input on page load
    setTimeout(() => {
        phoneInput.focus();
    }, 1000);
}

// ==================== ADVANCED EFFECTS ====================
function initAdvancedEffects() {
    // Icon tilt effect
    initIconTilt();
}

function initIconTilt() {
    const iconWrapper = document.querySelector('.icon-wrapper');
    
    if (!iconWrapper) return;
    
    iconWrapper.addEventListener('mousemove', (e) => {
        const rect = iconWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const tiltX = (y / rect.height) * 10;
        const tiltY = -(x / rect.width) * 10;
        
        iconWrapper.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    
    iconWrapper.addEventListener('mouseleave', () => {
        iconWrapper.style.transform = '';
    });
}

// ==================== UTILITY FUNCTIONS ====================

// Throttle function
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) return;
        lastCall = now;
        return func(...args);
    };
}

// Detect mobile
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// ==================== PAGE VISIBILITY ====================

// Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    const canvas = document.getElementById('particleCanvas');
    
    if (document.hidden) {
        canvas.style.animationPlayState = 'paused';
    } else {
        canvas.style.animationPlayState = 'running';
    }
});

// ==================== ERROR HANDLING ====================

window.addEventListener('error', (e) => {
    console.error('⚠️ Error occurred:', e.error);
});

// ==================== DEBUGGING ====================

console.log('🔧 Debug Info:', {
    isMobile: isMobileDevice(),
    defaultCountry: selectedCountry.name,
    totalCountries: countries.length,
    viewport: {
        width: window.innerWidth,
        height: window.innerHeight
    }
});
