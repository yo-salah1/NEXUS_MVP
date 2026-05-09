// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Initialize features
    initForm();
    initSocialButtons();
    initParticles();
    initKeyboardNavigation();
    initAdvancedEffects();
    
    console.log('✨ NEXUS Login Page - Initialized');
});

// ==================== FORM HANDLING ====================
function initForm() {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('emailInput');
    const continueBtn = document.getElementById('continueBtn');
    
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
    
    // Real-time email validation
    emailInput.addEventListener('input', validateEmail);
    
    // Add ripple effect on button click
    continueBtn.addEventListener('click', createButtonRipple);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('emailInput');
    const continueBtn = document.getElementById('continueBtn');
    const email = emailInput.value.trim();
    
    // Validate email
    if (!isValidEmail(email)) {
        showError(emailInput, 'Please enter a valid email address');
        return;
    }
    
    // Remove any existing error
    removeError(emailInput);
    
    // Add loading state
    continueBtn.classList.add('loading');
    continueBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        console.log('📧 Email submitted:', email);
        
        // Show success state
        emailInput.classList.add('success');
        
        // Redirect to dashboard or next page
        setTimeout(() => {
            window.location.href = 'dashboard.html'; // Change to your target page
        }, 800);
    }, 1500);
}

function validateEmail(e) {
    const input = e.target;
    const email = input.value.trim();
    
    if (email.length > 0) {
        if (isValidEmail(email)) {
            input.classList.remove('error');
            input.classList.add('success');
            removeError(input);
        } else {
            input.classList.remove('success');
        }
    } else {
        input.classList.remove('success', 'error');
        removeError(input);
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
    input.parentElement.appendChild(errorDiv);
    
    // Shake animation
    input.parentElement.style.animation = 'none';
    setTimeout(() => {
        input.parentElement.style.animation = 'shake 0.3s ease';
    }, 10);
}

function removeError(input) {
    const errorMsg = input.parentElement.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
    input.classList.remove('error');
}

// ==================== SOCIAL BUTTONS ====================
function initSocialButtons() {
    const googleBtn = document.getElementById('googleBtn');
    const phoneBtn = document.getElementById('phoneBtn');
    
    googleBtn.addEventListener('click', handleGoogleLogin);
    phoneBtn.addEventListener('click', handlePhoneLogin);
    
    // Add ripple effect
    [googleBtn, phoneBtn].forEach(btn => {
        btn.addEventListener('click', createButtonRipple);
    });
}

function handleGoogleLogin(e) {
    const button = e.currentTarget;
    
    // Add loading state
    button.classList.add('loading');
    button.disabled = true;
    
    // Simulate Google OAuth
    setTimeout(() => {
        console.log('🔐 Google login initiated');
        
        // Redirect to Google OAuth or your auth endpoint
        // window.location.href = '/auth/google';
        
        // For demo, just show success
        showSuccess(button, 'Connecting...');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }, 1000);
}

function handlePhoneLogin(e) {
    const button = e.currentTarget;
    
    // Add loading state
    button.classList.add('loading');
    button.disabled = true;
    
    // Simulate phone auth
    setTimeout(() => {
        console.log('📱 Phone login initiated');
        
        // Redirect to phone verification page
        window.location.href = 'phone-verification.html';
    }, 1000);
}

function showSuccess(button, message) {
    const originalText = button.querySelector('.btn-text').textContent;
    button.querySelector('.btn-text').textContent = message;
    
    button.style.background = 'rgba(74, 222, 128, 0.2)';
    button.style.borderColor = '#4ade80';
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
    const particleCount = window.innerWidth > 768 ? 50 : 25;
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
    const emailInput = document.getElementById('emailInput');
    const continueBtn = document.getElementById('continueBtn');
    const googleBtn = document.getElementById('googleBtn');
    const phoneBtn = document.getElementById('phoneBtn');
    
    const elements = [emailInput, continueBtn, googleBtn, phoneBtn];
    
    elements.forEach((element, index) => {
        element.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (index + 1) % elements.length;
                elements[nextIndex].focus();
            }
            
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = (index - 1 + elements.length) % elements.length;
                elements[prevIndex].focus();
            }
        });
    });
    
    // Auto-focus email input on page load
    setTimeout(() => {
        emailInput.focus();
    }, 1000);
}

// ==================== ADVANCED EFFECTS ====================
function initAdvancedEffects() {
    // Parallax effect for decorations
    document.addEventListener('mousemove', throttle(parallaxEffect, 50));
    
    // Tilt effect on icon
    initIconTilt();
    
    // Input glow effect
    initInputGlow();
}

function parallaxEffect(e) {
    const decorations = document.querySelectorAll('.bg-decoration');
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    decorations.forEach((decoration, index) => {
        const speed = (index + 1) * 0.03;
        const x = (clientX / innerWidth - 0.5) * 50 * speed;
        const y = (clientY / innerHeight - 0.5) * 50 * speed;
        
        decoration.style.transform = `translate(${x}px, ${y}px)`;
    });
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

function initInputGlow() {
    const emailInput = document.getElementById('emailInput');
    
    emailInput.addEventListener('focus', () => {
        createGlowEffect(emailInput);
    });
}

function createGlowEffect(element) {
    const glow = document.createElement('div');
    glow.style.cssText = `
        position: absolute;
        inset: -2px;
        background: linear-gradient(45deg, transparent, rgba(139, 125, 216, 0.5), transparent);
        border-radius: 12px;
        pointer-events: none;
        z-index: -1;
        opacity: 0;
        animation: glowPulse 2s ease-in-out;
    `;
    
    element.parentElement.style.position = 'relative';
    element.parentElement.appendChild(glow);
    
    glow.addEventListener('animationend', () => {
        glow.remove();
    });
}

const glowStyle = document.createElement('style');
glowStyle.textContent = `
    @keyframes glowPulse {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
    }
`;
document.head.appendChild(glowStyle);

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

// Detect reduced motion preference
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

// ==================== ACCESSIBILITY ====================

// Announce to screen readers
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

// Screen reader only class
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
    console.error('⚠️ Error occurred:', e.error);
});

// ==================== EASTER EGG ====================

// Secret konami code
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    console.log('🎉 Easter Egg Activated!');
    
    // Rainbow mode
    const wrapper = document.querySelector('.page-wrapper');
    wrapper.style.animation = 'rainbow 3s linear';
    
    setTimeout(() => {
        wrapper.style.animation = '';
    }, 3000);
    
    // Confetti
    createConfettiEffect();
}

function createConfettiEffect() {
    const colors = ['#8b7dd8', '#9d8ee3', '#ffffff', '#b8acff'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            const x = Math.random() * window.innerWidth;
            const size = Math.random() * 8 + 4;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            confetti.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: -20px;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                pointer-events: none;
                z-index: 9999;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                animation: confettiFall ${Math.random() * 2 + 2}s ease-out forwards;
            `;
            
            document.body.appendChild(confetti);
            
            confetti.addEventListener('animationend', () => {
                confetti.remove();
            });
        }, i * 50);
    }
}

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

// ==================== DEBUGGING ====================

console.log('🔧 Debug Info:', {
    isMobile: isMobileDevice(),
    reducedMotion: prefersReducedMotion(),
    viewport: {
        width: window.innerWidth,
        height: window.innerHeight
    }
});
