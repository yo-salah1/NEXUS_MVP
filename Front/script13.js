/* NEXUS — Home/Prompts (script13.js) - API INTEGRATED */

const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initSidebar();
    initNavigation();
    initMobileSidebar();
    loadAndRenderPrompts();
    initCTA();
    console.log('✨ NEXUS Home - API Ready');
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
    document.getElementById('homeNav').addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        document.getElementById('homeNav').classList.add('active');
    });
    document.getElementById('videoChatBtn').addEventListener('click', () => window.location.href = 'index8.html');
    document.getElementById('audioChatBtn').addEventListener('click', () => window.location.href = 'index8.html');
    document.getElementById('textChatBtn').addEventListener('click', () => window.location.href = 'index8.html');
    document.getElementById('historyNav').addEventListener('click', () => window.location.href = 'index11.html');
    document.getElementById('settingsNav').addEventListener('click', () => window.location.href = 'index12.html');
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

// Load prompts from API
async function loadAndRenderPrompts() {
    try {
        const response = await fetch(`${API_BASE_URL}/prompts`);
        
        if (!response.ok) throw new Error('Failed to load prompts');
        
        const promptCards = await response.json();
        renderPromptCards(promptCards);
        
    } catch (error) {
        console.error('Error loading prompts:', error);
        
        // Fallback to mock data if API fails
        const fallbackPrompts = [
            { icon: 'message-circle', title: 'Healthy food', desc: 'Navigate interpersonal challenges', link: 'Use Prompt →' },
            { icon: 'sparkles', title: 'Confidence Booster', desc: 'Build self-esteem and positive mindset', link: 'Use Prompt →' },
            { icon: 'heart', title: 'Stress Relief Coach', desc: 'Calm anxiety and manage stress effectively', link: 'Use Prompt →' },
            { icon: 'target', title: 'Healthy food', desc: 'Improve concentration and productivity', link: 'Use Prompt →' },
            { icon: 'flame', title: 'Anger Cooldown', desc: 'De-escalate frustration and find peace', link: 'Use Prompt →' },
            { icon: 'moon', title: 'Sleep Routine', desc: 'Wind down and prepare for rest', link: 'Use Prompt →' }
        ];
        
        renderPromptCards(fallbackPrompts);
    }
}

function renderPromptCards(promptCards) {
    const grid = document.getElementById('promptGrid');
    grid.innerHTML = '';

    promptCards.forEach((card, i) => {
        const el = document.createElement('div');
        el.className = 'prompt-card';
        el.tabIndex = 0;
        el.setAttribute('role', 'button');
        el.setAttribute('aria-label', card.title);

        el.innerHTML = `
            <div class="card-icon-wrap">
                <i data-lucide="${card.icon}" class="card-icon"></i>
            </div>
            <div class="card-title">${card.title}</div>
            <div class="card-desc">${card.desc}</div>
            <a href="#" class="card-link" data-index="${i}">${card.link}</a>
        `;

        el.addEventListener('click', (e) => {
            if (e.target.closest('.card-link')) return;
            startPromptChat(card);
        });

        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                startPromptChat(card);
            }
        });

        grid.appendChild(el);
    });

    grid.querySelectorAll('.card-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const idx = parseInt(link.dataset.index);
            startPromptChat(promptCards[idx]);
        });
    });

    lucide.createIcons();
}

async function startPromptChat(card) {
    console.log('💬 Starting prompt chat →', card.title);
    
    try {
        // Send prompt to API to start session
        const response = await fetch(`${API_BASE_URL}/chat/prompt`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ promptTitle: card.title, promptDesc: card.desc })
        });
        
        if (response.ok) {
            const data = await response.json();
            // Redirect to chat with session ID
            window.location.href = `index8.html?session=${data.sessionId}`;
        } else {
            window.location.href = 'index8.html';
        }
        
    } catch (error) {
        console.error('Error starting prompt chat:', error);
        window.location.href = 'index8.html';
    }
}

function initCTA() {
    document.getElementById('ctaBtn').addEventListener('click', () => {
        console.log('✨ Create New Session clicked');
        window.location.href = 'index8.html';
    });
}
