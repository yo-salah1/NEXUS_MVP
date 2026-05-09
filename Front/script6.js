// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Initialize features
    initOTPInputs();
    initForm();
    initResendTimer();
    initParticles();
    initAdvancedEffects();
    
    console.log('✨ NEXUS OTP Verification Page - Initialized');
});

// ==================== OTP INPUT HANDLING ====================
function initOTPInputs() {
    const otpBoxes = document.querySelectorAll('.otp-box');
    
    otpBoxes.forEach((box, index) => {
        // Handle input
        box.addEventListener('input', (e) => handleOTPInput(e, index));
        
        // Handle keydown for navigation
        box.addEventListener('keydown', (e) => handleOTPKeydown(e, index));
        
        // Handle paste
        box.addEventListener('paste', (e) => handleOTPPaste(e, index));
        
        // Handle focus
        box.addEventListener('focus', (e) => {
            e.target.select();
        });
    });
    
    // Auto-focus first box
    setTimeout(() => {
        otpBoxes[0].focus();
    }, 1000);
}

function handleOTPInput(e, index) {
    const otpBoxes = document.querySelectorAll('.otp-box');
    const input = e.target;
    const value = input.value;
    
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
        input.value = '';
        return;
    }
    
    // Add filled class
    if (value) {
        input.classList.add('filled');
        input.classList.remove('error');
        
        // Move to next box
        if (index < otpBoxes.length - 1) {
            otpBoxes[index + 1].focus();
        } else {
            // All boxes filled, auto-submit
            input.blur();
            checkOTPComplete();
        }
    } else {
        input.classList.remove('filled');
    }
}

function handleOTPKeydown(e, index) {
    const otpBoxes = document.querySelectorAll('.otp-box');
    const input = e.target;
    
    // Backspace
    if (e.key === 'Backspace') {
        e.preventDefault();
        
        if (input.value) {
            input.value = '';
            input.classList.remove('filled', 'error');
        } else if (index > 0) {
            otpBoxes[index - 1].focus();
            otpBoxes[index - 1].value = '';
            otpBoxes[index - 1].classList.remove('filled', 'error');
        }
    }
    
    // Arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault();
        otpBoxes[index - 1].focus();
    }
    
    if (e.key === 'ArrowRight' && index < otpBoxes.length - 1) {
        e.preventDefault();
        otpBoxes[index + 1].focus();
    }
    
    // Delete
    if (e.key === 'Delete') {
        e.preventDefault();
        input.value = '';
        input.classList.remove('filled', 'error');
    }
}

function handleOTPPaste(e, index) {
    e.preventDefault();
    
    const pastedData = e.clipboardData.getData('text').trim();
    const otpBoxes = document.querySelectorAll('.otp-box');
    
    // Only paste if it's all digits
    if (!/^\d+$/.test(pastedData)) {
        return;
    }
    
    // Fill boxes with pasted data
    const digits = pastedData.split('');
    
    digits.forEach((digit, i) => {
        const boxIndex = index + i;
        if (boxIndex < otpBoxes.length) {
            otpBoxes[boxIndex].value = digit;
            otpBoxes[boxIndex].classList.add('filled');
            otpBoxes[boxIndex].classList.remove('error');
        }
    });
    
    // Focus the next empty box or last box
    const nextIndex = Math.min(index + digits.length, otpBoxes.length - 1);
    otpBoxes[nextIndex].focus();
    
    // Check if complete
    setTimeout(() => checkOTPComplete(), 100);
}

function checkOTPComplete() {
    const otpBoxes = document.querySelectorAll('.otp-box');
    const otp = Array.from(otpBoxes).map(box => box.value).join('');
    
    if (otp.length === otpBoxes.length) {
        console.log('OTP Complete:', otp);
        // Auto-enable continue button
        document.getElementById('continueBtn').disabled = false;
    }
}

function getOTPValue() {
    const otpBoxes = document.querySelectorAll('.otp-box');
    return Array.from(otpBoxes).map(box => box.value).join('');
}

function clearOTP() {
    const otpBoxes = document.querySelectorAll('.otp-box');
    otpBoxes.forEach(box => {
        box.value = '';
        box.classList.remove('filled', 'error', 'success');
    });
    otpBoxes[0].focus();
}

// ==================== FORM HANDLING ====================
function initForm() {
    const form = document.getElementById('otpForm');
    const continueBtn = document.getElementById('continueBtn');
    
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
    
    // Add ripple effect on button click
    continueBtn.addEventListener('click', createButtonRipple);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const continueBtn = document.getElementById('continueBtn');
    const otp = getOTPValue();
    
    // Validate OTP length
    if (otp.length !== 6) {
        showError('Please enter all 6 digits');
        highlightEmptyBoxes();
        return;
    }
    
    // Remove any existing error
    removeError();
    
    // Add loading state
    continueBtn.classList.add('loading');
    continueBtn.disabled = true;
    
    // Simulate API verification
    setTimeout(() => {
        const isValid = verifyOTP(otp);
        
        if (isValid) {
            console.log('✅ OTP Verified:', otp);
            
            // Show success state
            showSuccess();
            
            // Redirect to next page
            setTimeout(() => {
                window.location.href = 'dashboard.html'; // Change to your target page
            }, 1000);
        } else {
            console.log('❌ Invalid OTP');
            
            // Show error
            showError('Invalid OTP. Please try again.');
            highlightErrorBoxes();
            
            // Remove loading state
            continueBtn.classList.remove('loading');
            continueBtn.disabled = false;
            
            // Clear OTP after delay
            setTimeout(() => {
                clearOTP();
            }, 1000);
        }
    }, 1500);
}

function verifyOTP(otp) {
    // Simulate verification (in real app, call your API)
    // For demo, accept any 6-digit code
    return otp.length === 6 && /^\d{6}$/.test(otp);
}

function showSuccess() {
    const otpBoxes = document.querySelectorAll('.otp-box');
    otpBoxes.forEach(box => {
        box.classList.add('success');
        box.classList.remove('error');
    });
}

function highlightErrorBoxes() {
    const otpBoxes = document.querySelectorAll('.otp-box');
    otpBoxes.forEach(box => {
        box.classList.add('error');
    });
}

function highlightEmptyBoxes() {
    const otpBoxes = document.querySelectorAll('.otp-box');
    otpBoxes.forEach(box => {
        if (!box.value) {
            box.classList.add('error');
        }
    });
}

function showError(message) {
    // Remove existing error
    removeError();
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Insert after OTP inputs
    const otpInputs = document.getElementById('otpInputs');
    otpInputs.parentElement.insertBefore(errorDiv, otpInputs.nextSibling);
}

function removeError() {
    const errorMsg = document.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

// ==================== RESEND TIMER ====================
let resendTimer = null;
let timeRemaining = 60;

function initResendTimer() {
    const resendBtn = document.getElementById('resendBtn');
    const timerDisplay = document.getElementById('timerDisplay');
    const timerCountdown = document.getElementById('timerCountdown');
    
    // Start timer on page load
    startResendTimer();
    
    // Handle resend button click
    resendBtn.addEventListener('click', handleResend);
}

function startResendTimer() {
    const resendBtn = document.getElementById('resendBtn');
    const timerDisplay = document.getElementById('timerDisplay');
    const timerCountdown = document.getElementById('timerCountdown');
    
    timeRemaining = 60;
    resendBtn.disabled = true;
    timerDisplay.classList.add('visible');
    
    resendTimer = setInterval(() => {
        timeRemaining--;
        timerCountdown.textContent = timeRemaining;
        
        if (timeRemaining <= 0) {
            clearInterval(resendTimer);
            resendBtn.disabled = false;
            timerDisplay.classList.remove('visible');
        }
    }, 1000);
}

function handleResend() {
    const resendBtn = document.getElementById('resendBtn');
    
    console.log('📱 Resending OTP...');
    
    // Show loading state briefly
    resendBtn.textContent = 'Sending...';
    resendBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        resendBtn.textContent = 'press here';
        
        // Clear current OTP
        clearOTP();
        
        // Restart timer
        startResendTimer();
        
        // Show success message
        showTemporaryMessage('OTP sent successfully!');
    }, 1000);
}

function showTemporaryMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #22c55e;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        animation: slideDown 0.3s ease, slideUp 0.3s ease 2.7s;
        z-index: 9999;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Add animations for temporary message
const messageStyle = document.createElement('style');
messageStyle.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(messageStyle);

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

// ==================== PAGE VISIBILITY ====================

// Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    const canvas = document.getElementById('particleCanvas');
    
    if (document.hidden) {
        canvas.style.animationPlayState = 'paused';
        if (resendTimer) {
            clearInterval(resendTimer);
        }
    } else {
        canvas.style.animationPlayState = 'running';
        if (timeRemaining > 0) {
            startResendTimer();
        }
    }
});

// ==================== ERROR HANDLING ====================

window.addEventListener('error', (e) => {
    console.error('⚠️ Error occurred:', e.error);
});

// ==================== UTILITY FUNCTIONS ====================

// Detect mobile
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// ==================== DEBUGGING ====================

console.log('🔧 Debug Info:', {
    isMobile: isMobileDevice(),
    otpLength: 6,
    viewport: {
        width: window.innerWidth,
        height: window.innerHeight
    }
});
