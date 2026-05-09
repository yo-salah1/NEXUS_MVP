// Enhanced loading animation with interactive features
document.addEventListener('DOMContentLoaded', () => {
    const spinner = document.querySelector('.spinner');
    const spinnerWrapper = document.querySelector('.spinner-wrapper');
    const loadingText = document.querySelector('.loading-text');
    const glowEffect = document.querySelector('.glow-effect');
    const blades = document.querySelectorAll('.spinner-blades path');
    
    // Track loading progress (simulate)
    let loadingProgress = 0;
    let isComplete = false;
    
    // Initialize
    init();
    
    function init() {
        // Add hover effect to spinner
        addHoverEffects();
        
        // Simulate loading progress
        simulateLoading();
        
        // Add click interaction
        addClickInteraction();
        
        // Dynamic blade opacity based on rotation
        animateBladesOpacity();
        
        // Parallax mouse movement effect
        addParallaxEffect();
    }
    
    // Add hover effects
    function addHoverEffects() {
        spinnerWrapper.addEventListener('mouseenter', () => {
            if (!isComplete) {
                spinner.style.animationDuration = '1s';
                glowEffect.style.transform = 'scale(1.3)';
                glowEffect.style.opacity = '1';
            }
        });
        
        spinnerWrapper.addEventListener('mouseleave', () => {
            if (!isComplete) {
                spinner.style.animationDuration = '2s';
                glowEffect.style.transform = 'scale(1)';
                glowEffect.style.opacity = '0.5';
            }
        });
    }
    
    // Simulate loading progress
    function simulateLoading() {
        const duration = 5000; // 5 seconds
        const interval = 50;
        const steps = duration / interval;
        const increment = 100 / steps;
        
        const progressInterval = setInterval(() => {
            loadingProgress += increment;
            
            if (loadingProgress >= 100) {
                loadingProgress = 100;
                clearInterval(progressInterval);
                completeLoading();
            }
            
            // Update visual feedback based on progress
            updateProgress(loadingProgress);
        }, interval);
    }
    
    // Update visual feedback
    function updateProgress(progress) {
        // Speed up rotation as progress increases
        const duration = 2 - (progress / 100);
        spinner.style.animationDuration = `${Math.max(duration, 0.5)}s`;
        
        // Increase glow intensity
        const glowIntensity = 0.5 + (progress / 200);
        glowEffect.style.opacity = glowIntensity;
        
        // Scale up slightly as loading progresses
        const scale = 1 + (progress / 1000);
        spinnerWrapper.style.transform = `scale(${scale})`;
    }
    
    // Complete loading animation
    function completeLoading() {
        isComplete = true;
        
        // Add completion class for special effects
        spinnerWrapper.classList.add('loading-complete');
        
        // Burst effect
        createBurstEffect();
        
        // Update loading text
        if (loadingText) {
            const label = loadingText.querySelector('.loading-label');
            const dots = loadingText.querySelector('.loading-dots');
            
            if (label) label.textContent = 'READY';
            if (dots) dots.style.display = 'none';
        }
        
        // Slow down and stop rotation
        setTimeout(() => {
            spinner.style.animation = 'none';
            spinner.style.filter = 'drop-shadow(0 0 30px rgba(255, 255, 255, 0.8))';
        }, 500);
    }
    
    // Create burst effect on completion
    function createBurstEffect() {
        const particles = 12;
        
        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: white;
                border-radius: 50%;
                pointer-events: none;
            `;
            
            spinnerWrapper.appendChild(particle);
            
            const angle = (i / particles) * 360;
            const distance = 100;
            const duration = 1000;
            
            const x = Math.cos(angle * Math.PI / 180) * distance;
            const y = Math.sin(angle * Math.PI / 180) * distance;
            
            // Animate particle
            particle.animate([
                { transform: 'translate(0, 0)', opacity: 1 },
                { transform: `translate(${x}px, ${y}px)`, opacity: 0 }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards'
            });
            
            // Remove particle after animation
            setTimeout(() => particle.remove(), duration);
        }
    }
    
    // Add click interaction
    function addClickInteraction() {
        spinnerWrapper.addEventListener('click', () => {
            // Create ripple effect
            createRipple(event);
            
            // Pulse animation
            spinnerWrapper.style.animation = 'none';
            setTimeout(() => {
                spinnerWrapper.style.animation = 'fadeInScale 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }, 10);
        });
    }
    
    // Create ripple effect on click
    function createRipple(e) {
        const ripple = document.createElement('div');
        const rect = spinnerWrapper.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            pointer-events: none;
            transform: translate(-50%, -50%) scale(0);
            left: 50%;
            top: 50%;
        `;
        
        spinnerWrapper.appendChild(ripple);
        
        ripple.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
            { transform: 'translate(-50%, -50%) scale(2)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    // Animate blade opacity dynamically
    function animateBladesOpacity() {
        let currentBlade = 0;
        
        setInterval(() => {
            blades.forEach((blade, index) => {
                const distance = Math.abs(index - currentBlade);
                const opacity = 1 - (distance * 0.1);
                blade.style.opacity = Math.max(opacity, 0.3);
            });
            
            currentBlade = (currentBlade + 1) % blades.length;
        }, 250);
    }
    
    // Parallax mouse movement effect
    function addParallaxEffect() {
        document.addEventListener('mousemove', (e) => {
            if (!isComplete) {
                const { clientX, clientY } = e;
                const { innerWidth, innerHeight } = window;
                
                const xPercent = (clientX / innerWidth - 0.5) * 20;
                const yPercent = (clientY / innerHeight - 0.5) * 20;
                
                spinnerWrapper.style.transform = `
                    translate(${xPercent}px, ${yPercent}px) 
                    scale(${1 + (loadingProgress / 1000)})
                `;
                
                glowEffect.style.transform = `
                    translate(${-xPercent * 0.5}px, ${-yPercent * 0.5}px) 
                    scale(${1 + (xPercent + yPercent) / 100})
                `;
            }
        });
    }
    
    // Keyboard accessibility
    spinnerWrapper.setAttribute('tabindex', '0');
    spinnerWrapper.setAttribute('role', 'progressbar');
    spinnerWrapper.setAttribute('aria-valuenow', '0');
    spinnerWrapper.setAttribute('aria-valuemin', '0');
    spinnerWrapper.setAttribute('aria-valuemax', '100');
    spinnerWrapper.setAttribute('aria-label', 'Loading progress');
    
    // Update aria-valuenow as progress changes
    setInterval(() => {
        if (!isComplete) {
            spinnerWrapper.setAttribute('aria-valuenow', Math.floor(loadingProgress));
        }
    }, 100);
    
    // Handle keyboard interaction
    spinnerWrapper.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            spinnerWrapper.click();
        }
    });
    
    // Easter egg: Press 'R' to restart animation
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'r' && isComplete) {
            location.reload();
        }
    });
    
    // Add visual feedback for page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            spinner.style.animationPlayState = 'paused';
        } else {
            spinner.style.animationPlayState = 'running';
        }
    });
    
    console.log('🌟 Loading animation initialized');
    console.log('💡 Tip: Hover over the spinner for a speed boost!');
    console.log('🔄 Press R to restart when complete');
});
