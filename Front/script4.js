// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Initialize features
    initForm();
    initPasswordToggle();
    initPasswordStrength();
    initParticles();
    initKeyboardNavigation();
    initAdvancedEffects();
    
    console.log('✨ NEXUS Sign Up Page - Initialized');
});

// ==================== FORM HANDLING ====================
function initForm() {
    const form = document.getElementById('signupForm');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
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
    const passwordInput = document.getElementById('passwordInput');
    const continueBtn = document.getElementById('continueBtn');
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Validate email
    if (!isValidEmail(email)) {
        showError(emailInput, 'Please enter a valid email address');
        return;
    }
    
    // Validate password
    if (password.length < 8) {
        showError(passwordInput, 'Password must be at least 8 characters long');
        return;
    }
    
    // Remove any existing errors
    removeError(emailInput);
    removeError(passwordInput);
    
    // Add loading state
    continueBtn.classList.add('loading');
    continueBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        console.log('📝 Sign up data:', { email, password: '***' });
        
        // Show success state
        emailInput.classList.add('success');
        passwordInput.classList.add('success');
        
        // Redirect to dashboard or verification page
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

// ==================== PASSWORD TOGGLE ====================
function initPasswordToggle() {
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('passwordInput');
    
    toggleBtn.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        
        // Change icon
        const icon = toggleBtn.querySelector('.eye-icon');
        const iconName = type === 'password' ? 'eye-off' : 'eye';
        icon.setAttribute('data-lucide', iconName);
        
        // Reinitialize icons
        lucide.createIcons();
        
        // Add animation
        toggleBtn.style.transform = 'translateY(-50%) scale(0.8)';
        setTimeout(() => {
            toggleBtn.style.transform = 'translateY(-50%) scale(1)';
        }, 100);
    });
}

// ==================== PASSWORD STRENGTH ====================
function initPasswordStrength() {
    const passwordInput = document.getElementById('passwordInput');
    const strengthContainer = document.getElementById('passwordStrength');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    passwordInput.addEventListener('input', (e) => {
        const password = e.target.value;
        
        if (password.length === 0) {
            strengthContainer.classList.remove('visible');
            strengthFill.className = 'strength-fill';
            strengthText.textContent = '';
            return;
        }
        
        strengthContainer.classList.add('visible');
        
        const strength = calculatePasswordStrength(password);
        
        // Update UI based on strength
        strengthFill.className = 'strength-fill ' + strength.level;
        strengthText.className = 'strength-text ' + strength.level;
        strengthText.textContent = strength.text;
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Complexity checks
    if (/[a-z]/.test(password)) score++; // lowercase
    if (/[A-Z]/.test(password)) score++; // uppercase
    if (/[0-9]/.test(password)) score++; // numbers
    if (/[^a-zA-Z0-9]/.test(password)) score++; // special chars
    
    // Determine strength
    if (score <= 2) {
        return { level: 'weak', text: 'Weak password' };
    } else if (score <= 4) {
        return { level: 'medium', text: 'Medium password' };
    } else {
        return { level: 'strong', text: 'Strong password' };
    }
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
    const passwordInput = document.getElementById('passwordInput');
    const continueBtn = document.getElementById('continueBtn');
    
    const elements = [emailInput, passwordInput, continueBtn];
    
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
    const inputs = document.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            createGlowEffect(input);
        });
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

// ==================== PASSWORD REQUIREMENTS HINT ====================

// Show password requirements on focus
const passwordInput = document.getElementById('passwordInput');
let requirementsHint = null;

passwordInput.addEventListener('focus', () => {
    if (!requirementsHint) {
        requirementsHint = document.createElement('div');
        requirementsHint.className = 'password-hint';
        requirementsHint.style.cssText = `
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
            text-align: left;
            margin-top: 0.5rem;
            animation: fadeIn 0.3s ease;
        `;
        requirementsHint.innerHTML = `
            Password must contain:<br>
            • At least 8 characters<br>
            • Mix of uppercase and lowercase<br>
            • At least one number
        `;
        passwordInput.parentElement.appendChild(requirementsHint);
    }
});

// ==================== DEBUGGING ====================

console.log('🔧 Debug Info:', {
    isMobile: isMobileDevice(),
    reducedMotion: prefersReducedMotion(),
    viewport: {
        width: window.innerWidth,
        height: window.innerHeight
    }
});
