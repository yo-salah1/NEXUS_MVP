/* NEXUS — Chat History (script11.js) - API INTEGRATED */

const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initSidebar();
    initNavigation();
    initMobileSidebar();
    loadAndRenderHistory();
    console.log('✨ NEXUS History - API Ready');
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
    document.getElementById('historyNav').addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        document.getElementById('historyNav').classList.add('active');
    });
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

// Load history from API
async function loadAndRenderHistory() {
    const container = document.getElementById('historyList');
    
    try {
        const response = await fetch(`${API_BASE_URL}/history`);
        
        if (!response.ok) throw new Error('Failed to load history');
        
        const historyData = await response.json();
        renderHistory(historyData);
        
    } catch (error) {
        console.error('Error loading history:', error);
        
        // Fallback to mock data if API fails
        const fallbackData = [
            {
                separator: 'Today',
                items: [
                    { title: 'Diet food for breakfast', mood: 'calm', duration: '1:15', type: 'text' },
                    { title: "I'm not feeling well today 😟", mood: 'stressed', duration: '1:15', type: 'text' }
                ]
            },
            {
                separator: 'Yesterday',
                items: [
                    { title: 'What should I eat for lunch?', mood: 'calm', duration: '2:30', type: 'audio' },
                    { title: 'Help me plan my weekend', mood: 'calm', duration: '3:10', type: 'video' }
                ]
            }
        ];
        
        renderHistory(fallbackData);
        showNotification('Using offline data. Some history may be unavailable.', 'warning');
    }
}

function renderHistory(historyData) {
    const container = document.getElementById('historyList');
    container.innerHTML = '';

    historyData.forEach(group => {
        const sep = document.createElement('div');
        sep.className = 'date-separator';
        sep.innerHTML = `<span class="date-sep-pill">${group.separator}</span>`;
        container.appendChild(sep);

        group.items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'history-card';
            card.tabIndex = 0;
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', item.title);

            const typeIcon = item.type === 'video' ? 'video' : item.type === 'audio' ? 'mic' : 'message-square';

            card.innerHTML = `
                <div class="card-body">
                    <div class="card-title">${item.title}</div>
                    <div class="card-meta">
                        <span class="mood-pill ${item.mood}">
                            <span class="mood-dot"></span>
                            ${cap(item.mood)}
                        </span>
                        <span class="card-duration">Duration: ${item.duration}</span>
                    </div>
                    <div class="card-type">
                        <span class="type-label">
                            <i data-lucide="${typeIcon}" class="type-icon"></i>
                            ${cap(item.type)}
                        </span>
                    </div>
                </div>
                <div class="card-chevron">
                    <i data-lucide="chevron-right" class="card-chevron-icon"></i>
                </div>
            `;

            card.addEventListener('click', () => openChat(item));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openChat(item); }
            });

            container.appendChild(card);
        });
    });

    lucide.createIcons();
}

function openChat(item) {
    console.log('Opening chat:', item.title);
    window.location.href = 'index8.html';
}

function cap(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position:fixed;top:2rem;right:2rem;z-index:9999;
        background:${type === 'success' ? 'var(--btn-send)' : type === 'warning' ? '#f39c12' : '#e74c3c'};
        color:white;padding:1rem 1.5rem;border-radius:8px;
        font-size:14px;font-weight:500;
        box-shadow:0 4px 12px rgba(0,0,0,0.3);
        animation:slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
