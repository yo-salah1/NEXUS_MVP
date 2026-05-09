/* NEXUS — Settings (script12.js) - API INTEGRATED */

const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initSidebar();
    initNavigation();
    initMobileSidebar();
    loadSettings();
    initSliders();
    initPills();
    initToggles();
    console.log('✨ NEXUS Settings - API Ready');
});

// Sidebar (same as page 8)
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const newChatNav = document.getElementById('newChatNav');
    const chatTypeSubmenu = document.getElementById('chatTypeSubmenu');
    
    sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
    newChatNav.addEventListener('click', () => {
        chatTypeSubmenu.classList.toggle('active');
        newChatNav.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-item:not(#newChatNav)').forEach(item => {
        item.addEventListener('click', () => {
            chatTypeSubmenu.classList.remove('active');
            newChatNav.classList.remove('active');
        });
    });
}

function initNavigation() {
    document.getElementById('homeNav').addEventListener('click', () => window.location.href = 'index13.html');
    document.getElementById('videoChatBtn').addEventListener('click', () => window.location.href = 'index8.html');
    document.getElementById('audioChatBtn').addEventListener('click', () => window.location.href = 'index8.html');
    document.getElementById('textChatBtn').addEventListener('click', () => window.location.href = 'index8.html');
    document.getElementById('historyNav').addEventListener('click', () => window.location.href = 'index11.html');
    document.getElementById('settingsNav').addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        document.getElementById('settingsNav').classList.add('active');
    });
}

function initMobileSidebar() {
    if (window.innerWidth > 768) return;
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i data-lucide="menu"></i>';
    mobileMenuBtn.style.cssText = 'position:fixed;top:1rem;left:1rem;z-index:150;background:var(--sidebar-bg);border:1px solid rgba(255,255,255,0.1);border-radius:8px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;cursor:pointer;';
    document.body.appendChild(mobileMenuBtn);
    lucide.createIcons();
    
    const sidebar = document.getElementById('sidebar');
    mobileMenuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });
}

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') { e.preventDefault(); document.getElementById('newChatNav').click(); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') { e.preventDefault(); document.getElementById('homeNav').click(); }
    if (e.key === 'Escape') {
        document.getElementById('chatTypeSubmenu').classList.remove('active');
        document.getElementById('newChatNav').classList.remove('active');
    }
});

// Load settings from API
async function loadSettings() {
    try {
        const response = await fetch(`${API_BASE_URL}/settings`);
        
        if (!response.ok) throw new Error('Failed to load settings');
        
        const settings = await response.json();
        
        // Apply settings to UI
        document.getElementById('adaptiveSlider').value = settings.adaptiveSensitivity || 75;
        document.getElementById('adaptiveVal').textContent = (settings.adaptiveSensitivity || 75) + '%';
        
        document.getElementById('toneSlider').value = settings.toneWeight || 50;
        document.getElementById('toneVal').textContent = (settings.toneWeight || 50) + '%';
        
        document.getElementById('faceSlider').value = settings.faceWeight || 50;
        document.getElementById('faceVal').textContent = (settings.faceWeight || 50) + '%';
        
        document.getElementById('privacyToggle').checked = settings.privacyMode || false;
        document.getElementById('summaryToggle').checked = settings.autoSummaries !== false;
        document.getElementById('moodToggle').checked = settings.moodAlerts !== false;
        document.getElementById('checkinToggle').checked = settings.dailyCheckin !== false;
        
        // Update slider fills
        updateSliderFill(document.getElementById('adaptiveSlider'));
        updateSliderFill(document.getElementById('toneSlider'));
        updateSliderFill(document.getElementById('faceSlider'));
        
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

function initSliders() {
    const sliders = [
        { id: 'adaptiveSlider', labelId: 'adaptiveVal', key: 'adaptiveSensitivity' },
        { id: 'toneSlider', labelId: 'toneVal', key: 'toneWeight' },
        { id: 'faceSlider', labelId: 'faceVal', key: 'faceWeight' }
    ];

    sliders.forEach(({ id, labelId, key }) => {
        const slider = document.getElementById(id);
        const label = document.getElementById(labelId);

        updateSliderFill(slider);

        slider.addEventListener('input', () => {
            label.textContent = slider.value + '%';
            updateSliderFill(slider);
            saveSetting(key, parseInt(slider.value));
        });
    });
}

function updateSliderFill(slider) {
    const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, var(--slider-fill) ${pct}%, var(--slider-track) ${pct}%)`;
}

function initPills() {
    const group = document.getElementById('faceDetectionGroup');
    const pills = group.querySelectorAll('.pill');

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            saveSetting('faceDetection', pill.dataset.value);
        });
    });
}

function initToggles() {
    const toggles = [
        { id: 'privacyToggle', key: 'privacyMode' },
        { id: 'summaryToggle', key: 'autoSummaries' },
        { id: 'moodToggle', key: 'moodAlerts' },
        { id: 'checkinToggle', key: 'dailyCheckin' }
    ];

    toggles.forEach(({ id, key }) => {
        const input = document.getElementById(id);
        input.addEventListener('change', () => {
            saveSetting(key, input.checked);
        });
    });
}

// Save setting to API
async function saveSetting(key, value) {
    try {
        const response = await fetch(`${API_BASE_URL}/settings`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ [key]: value })
        });
        
        if (!response.ok) throw new Error('Failed to save setting');
        
        console.log(`Setting saved: ${key} = ${value}`);
        
    } catch (error) {
        console.error('Error saving setting:', error);
    }
}
