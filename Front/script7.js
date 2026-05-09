// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Initialize features
    initVoiceOrb();
    initButtons();
    initNavigation();
    initParticles();
    
    console.log('✨ NEXUS AI Voice Assistant - Initialized');
});

// ==================== VOICE ORB ====================
let isListening = false;
let waveformAnimation = null;

function initVoiceOrb() {
    const voiceOrb = document.getElementById('voiceOrb');
    const orbStatus = document.getElementById('orbStatus');
    const canvas = document.getElementById('waveformCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 200;
    canvas.height = 200;
    
    // Click to activate voice
    voiceOrb.addEventListener('click', toggleListening);
    
    // Animate waveform
    animateWaveform(ctx, canvas);
}

function toggleListening() {
    const voiceOrb = document.getElementById('voiceOrb');
    const orbStatus = document.getElementById('orbStatus');
    
    isListening = !isListening;
    
    if (isListening) {
        voiceOrb.classList.add('active');
        orbStatus.textContent = 'Listening...';
        console.log('🎤 Voice activated');
        
        // Simulate listening
        setTimeout(() => {
            orbStatus.textContent = 'Processing...';
        }, 2000);
        
        setTimeout(() => {
            toggleListening();
        }, 5000);
    } else {
        voiceOrb.classList.remove('active');
        orbStatus.textContent = 'Ready to listen...';
        console.log('🎤 Voice deactivated');
    }
}

function animateWaveform(ctx, canvas) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 70;
    let time = 0;
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (isListening) {
            // Draw animated waveform
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                
                for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
                    const wave = Math.sin(angle * 3 + time + i) * 10;
                    const r = radius + wave;
                    const x = centerX + Math.cos(angle) * r;
                    const y = centerY + Math.sin(angle) * r;
                    
                    if (angle === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                
                ctx.closePath();
                ctx.stroke();
            }
            
            time += 0.1;
        }
        
        requestAnimationFrame(draw);
    }
    
    draw();
}

// ==================== BUTTONS ====================
function initButtons() {
    const textChatBtn = document.getElementById('textChatBtn');
    const voiceCallBtn = document.getElementById('voiceCallBtn');
    const videoCallBtn = document.getElementById('videoCallBtn');
    const authBtn = document.getElementById('authBtn');
    
    // Text Chat
    textChatBtn.addEventListener('click', () => {
        console.log('💬 Opening text chat...');
        addRippleEffect(textChatBtn, event);
        setTimeout(() => {
            window.location.href = 'chat.html'; // Change to your target page
        }, 300);
    });
    
    // Voice Call
    voiceCallBtn.addEventListener('click', () => {
        console.log('📞 Starting voice call...');
        addRippleEffect(voiceCallBtn, event);
        setTimeout(() => {
            window.location.href = 'voice-call.html'; // Change to your target page
        }, 300);
    });
    
    // Video Call
    videoCallBtn.addEventListener('click', () => {
        console.log('📹 Starting video call...');
        addRippleEffect(videoCallBtn, event);
        setTimeout(() => {
            window.location.href = 'video-call.html'; // Change to your target page
        }, 300);
    });
    
    // Auth Button (Sign Up / Sign In)
    authBtn.addEventListener('click', () => {
        console.log('👤 Opening authentication...');
        addRippleEffect(authBtn, event);
        setTimeout(() => {
            window.location.href = 'index.html'; // Change to your login/signup page
        }, 300);
    });
}

// ==================== NAVIGATION ====================
function initNavigation() {
    const historyBtn = document.getElementById('historyBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const helpBtn = document.getElementById('helpBtn');
    
    const navButtons = [historyBtn, settingsBtn, helpBtn];
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            handleNavigation(btn, navButtons);
        });
    });
}

function handleNavigation(activeBtn, allButtons) {
    // Remove active class from all buttons
    allButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    activeBtn.classList.add('active');
    
    // Add ripple effect
    addRippleEffect(activeBtn, event);
    
    // Handle navigation
    const btnId = activeBtn.id;
    
    switch(btnId) {
        case 'historyBtn':
            console.log('🕐 History');
            setTimeout(() => {
                window.location.href = 'history.html';
            }, 300);
            break;
        case 'settingsBtn':
            console.log('⚙️ Settings');
            setTimeout(() => {
                window.location.href = 'settings.html';
            }, 300);
            break;
        case 'helpBtn':
            console.log('❓ Help');
            setTimeout(() => {
                window.location.href = 'help.html';
            }, 300);
            break;
    }
}

// ==================== RIPPLE EFFECT ====================
function addRippleEffect(button, e) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    
    const size = Math.max(rect.width, rect.height);
    const x = e ? e.clientX - rect.left - size / 2 : rect.width / 2 - size / 2;
    const y = e ? e.clientY - rect.top - size / 2 : rect.height / 2 - size / 2;
    
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
        animation: rippleExpand 0.6s ease-out;
        z-index: 100;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    ripple.addEventListener('animationend', () => {
        ripple.remove();
    });
}

// Add ripple animation to CSS dynamically
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleExpand {
        to {
            transform: scale(2.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

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

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', (e) => {
    // Space to toggle listening
    if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        toggleListening();
    }
    
    // Escape to stop listening
    if (e.code === 'Escape' && isListening) {
        toggleListening();
    }
    
    // Number keys for quick navigation (1-3 for History, Settings, Help)
    if (e.key >= '1' && e.key <= '3' && !e.ctrlKey && !e.metaKey) {
        const buttons = ['historyBtn', 'settingsBtn', 'helpBtn'];
        const index = parseInt(e.key) - 1;
        const btn = document.getElementById(buttons[index]);
        if (btn) btn.click();
    }
});

// ==================== PAGE VISIBILITY ====================
document.addEventListener('visibilitychange', () => {
    if (document.hidden && isListening) {
        toggleListening();
    }
});

// ==================== VOICE RECOGNITION (Optional) ====================
// Uncomment to enable real speech recognition

/*
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
        console.log('🎤 Speech recognition started');
    };
    
    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
        
        console.log('Transcript:', transcript);
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
    };
    
    recognition.onend = () => {
        console.log('🎤 Speech recognition ended');
    };
    
    // Modify toggleListening to use real recognition
    function toggleListeningWithRecognition() {
        if (isListening) {
            recognition.start();
        } else {
            recognition.stop();
        }
    }
}
*/

// ==================== UTILITY FUNCTIONS ====================

// Detect mobile
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Check microphone permission
async function checkMicrophonePermission() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        console.log('✅ Microphone access granted');
        return true;
    } catch (err) {
        console.error('❌ Microphone access denied:', err);
        return false;
    }
}

// ==================== DEBUGGING ====================
console.log('🔧 Debug Info:', {
    isMobile: isMobileDevice(),
    hasSpeechRecognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
    hasMediaDevices: 'mediaDevices' in navigator,
    viewport: {
        width: window.innerWidth,
        height: window.innerHeight
    }
});

// ==================== TOOLTIPS (Optional) ====================
function showTooltip(element, message) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = message;
    tooltip.style.cssText = `
        position: absolute;
        bottom: calc(100% + 10px);
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        white-space: nowrap;
        pointer-events: none;
        z-index: 1000;
        animation: fadeIn 0.2s ease;
    `;
    
    element.style.position = 'relative';
    element.appendChild(tooltip);
    
    setTimeout(() => {
        tooltip.remove();
    }, 2000);
}

// Add keyboard shortcuts tooltip on page load
setTimeout(() => {
    console.log('⌨️ Keyboard Shortcuts:');
    console.log('  Space - Toggle listening');
    console.log('  Escape - Stop listening');
    console.log('  1-3 - Navigate (History, Settings, Help)');
}, 2000);
