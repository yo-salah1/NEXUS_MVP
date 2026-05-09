// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Initialize features
    initParticles();
    initButtons();
    initKeyboardNavigation();
    initAdvancedEffects();
    
    console.log('🚀 NEXUS AI Assistant - Page Loaded');
});

// ==================== PARTICLE SYSTEM ====================
function initParticles() {
    const container = document.getElementById('particlesContainer');
    const particleCount = window.innerWidth > 768 ? 30 : 15;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(container, i);
    }
}

function createParticle(container, index) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random positioning
    const left = Math.random() * 100;
    const size = Math.random() * 3 + 2;
    const duration = Math.random() * 5 + 8;
    const delay = Math.random() * 5;
    
    particle.style.left = `${left}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    
    container.appendChild(particle);
    
    // Recreate particle after animation
    particle.addEventListener('animationend', () => {
        particle.remove();
        createParticle(container, index);
    });
}

// ==================== BUTTON INTERACTIONS ====================
function initButtons() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    
    // Login Button
    loginBtn.addEventListener('click', handleLogin);
    
    // Signup Button
    signupBtn.addEventListener('click', handleSignup);
    
    // Add ripple effect on click
    [loginBtn, signupBtn].forEach(btn => {
        btn.addEventListener('click', createRipple);
    });
    
    // Add magnetic effect on hover
    [loginBtn, signupBtn].forEach(btn => {
        btn.addEventListener('mousemove', magneticEffect);
        btn.addEventListener('mouseleave', resetMagnetic);
    });
}

function handleLogin(e) {
    const button = e.currentTarget;
    
    // Add loading state
    button.classList.add('loading');
    button.disabled = true;
    
    // Simulate authentication
    setTimeout(() => {
        console.log('🔐 Logging in...');
        
        // Create success animation
        createSuccessAnimation(button);
        
        // Redirect after animation
        setTimeout(() => {
            // Replace with your actual login page or dashboard
            window.location.href = 'dashboard.html';
        }, 1500);
    }, 1500);
}

function handleSignup(e) {
    const button = e.currentTarget;
    
    // Add loading state
    button.classList.add('loading');
    button.disabled = true;
    
    // Simulate registration
    setTimeout(() => {
        console.log('📝 Signing up...');
        
        // Create success animation
        createSuccessAnimation(button);
        
        // Redirect after animation
        setTimeout(() => {
            // Replace with your actual signup page
            window.location.href = 'signup.html';
        }, 1500);
    }, 1500);
}

// ==================== VISUAL EFFECTS ====================

// Ripple Effect
function createRipple(e) {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    
    const ripple = document.createElement('div');
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
        animation: rippleEffect 0.6s ease-out;
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
    @keyframes rippleEffect {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Magnetic Effect (subtle pull towards cursor)
function magneticEffect(e) {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const moveX = x * 0.15;
    const moveY = y * 0.15;
    
    button.style.transform = `translate(${moveX}px, ${moveY}px)`;
}

function resetMagnetic(e) {
    const button = e.currentTarget;
    button.style.transform = '';
}

// Success Animation
function createSuccessAnimation(button) {
    const originalText = button.querySelector('.btn-text').textContent;
    
    // Create checkmark
    const checkmark = document.createElement('span');
    checkmark.innerHTML = '✓';
    checkmark.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(0);
        font-size: 24px;
        animation: checkmarkPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        z-index: 3;
    `;
    
    button.appendChild(checkmark);
    
    // Add checkmark animation
    const checkStyle = document.createElement('style');
    checkStyle.textContent = `
        @keyframes checkmarkPop {
            to {
                transform: translate(-50%, -50%) scale(1);
            }
        }
    `;
    document.head.appendChild(checkStyle);
    
    // Fade out text
    button.querySelector('.btn-text').style.opacity = '0';
}

// ==================== KEYBOARD NAVIGATION ====================
function initKeyboardNavigation() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    
    // Tab navigation enhancement
    [loginBtn, signupBtn].forEach((btn, index) => {
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
            
            // Arrow key navigation
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const nextBtn = index === 0 ? signupBtn : loginBtn;
                nextBtn.focus();
            }
        });
    });
}

// ==================== ADVANCED EFFECTS ====================
function initAdvancedEffects() {
    // Parallax effect for decorations
    document.addEventListener('mousemove', parallaxEffect);
    
    // Dynamic gradient based on mouse position
    document.addEventListener('mousemove', dynamicGradient);
    
    // Easter egg: Konami code
    initKonamiCode();
}

function parallaxEffect(e) {
    const decorations = document.querySelectorAll('.decoration');
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    decorations.forEach((decoration, index) => {
        const speed = (index + 1) * 0.05;
        const x = (clientX / innerWidth - 0.5) * 50 * speed;
        const y = (clientY / innerHeight - 0.5) * 50 * speed;
        
        decoration.style.transform = `translate(${x}px, ${y}px)`;
    });
}

function dynamicGradient(e) {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    const xPercent = (clientX / innerWidth) * 100;
    const yPercent = (clientY / innerHeight) * 100;
    
    document.querySelector('.page-container').style.backgroundPosition = 
        `${xPercent}% ${yPercent}%`;
}

// ==================== EASTER EGGS ====================
function initKonamiCode() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}

function activateEasterEgg() {
    console.log('🎉 Easter Egg Activated!');
    
    // Create confetti effect
    const colors = ['#7c5cdb', '#8d6fe6', '#6842c2', '#ffffff'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            createConfetti(colors[Math.floor(Math.random() * colors.length)]);
        }, i * 30);
    }
    
    // Temporary rainbow mode
    const container = document.querySelector('.page-container');
    container.style.animation = 'rainbow 2s linear infinite';
    
    setTimeout(() => {
        container.style.animation = 'gradientFlow 15s ease infinite';
    }, 3000);
}

function createConfetti(color) {
    const confetti = document.createElement('div');
    const x = Math.random() * window.innerWidth;
    const size = Math.random() * 10 + 5;
    const duration = Math.random() * 2 + 2;
    
    confetti.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: -20px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        pointer-events: none;
        z-index: 9999;
        animation: confettiFall ${duration}s ease-out forwards;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        transform: rotate(${Math.random() * 360}deg);
    `;
    
    document.body.appendChild(confetti);
    
    confetti.addEventListener('animationend', () => {
        confetti.remove();
    });
}

// Add confetti animation
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(${window.innerHeight + 50}px) rotate(${Math.random() * 720}deg);
            opacity: 0;
        }
    }
    
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(confettiStyle);

// ==================== PERFORMANCE OPTIMIZATION ====================

// Throttle expensive operations
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) return;
        lastCall = now;
        return func(...args);
    };
}

// Optimize parallax and gradient effects
document.addEventListener('mousemove', throttle(parallaxEffect, 50));
document.addEventListener('mousemove', throttle(dynamicGradient, 100));

// ==================== PAGE VISIBILITY ====================

// Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    const container = document.querySelector('.page-container');
    
    if (document.hidden) {
        container.style.animationPlayState = 'paused';
    } else {
        container.style.animationPlayState = 'running';
    }
});

// ==================== ACCESSIBILITY ENHANCEMENTS ====================

// Announce button states to screen readers
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        announcement.remove();
    }, 1000);
}

// Add screen reader only class
const srStyle = document.createElement('style');
srStyle.textContent = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }
`;
document.head.appendChild(srStyle);

// ==================== ERROR HANDLING ====================

window.addEventListener('error', (e) => {
    console.error('⚠️ An error occurred:', e.error);
});

// ==================== UTILITY FUNCTIONS ====================

// Check if user prefers reduced motion
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Detect mobile device
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Log device info for debugging
console.log('📱 Device Info:', {
    isMobile: isMobileDevice(),
    reducedMotion: prefersReducedMotion(),
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight
});
