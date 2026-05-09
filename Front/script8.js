/* ============================================================
   NEXUS — Text Chat (script8.js) — TER Integrated
   ============================================================ */

const API_BASE_URL = 'http://localhost:8080/api';
let currentSessionId = null;

const EMOTION_COLORS = {
    anger:    '#ef4444', angry:    '#ef4444',
    sadness:  '#60a5fa', sad:      '#60a5fa',
    joy:      '#f59e0b', happy:    '#f59e0b',
    fear:     '#a78bfa', fearful:  '#a78bfa',
    surprise: '#fb923c',
    disgust:  '#10b981',
    neutral:  '#9ca3af',
};

const EMOTION_ICONS = {
    anger: '😤', angry: '😤',
    sadness: '😢', sad: '😢',
    joy: '😊', happy: '😊',
    fear: '😨', fearful: '😨',
    surprise: '😲',
    disgust: '😟',
    neutral: '😐',
};

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initSidebar();
    initChat();
    initNavigation();
    loadChatHistory();
});

// ==================== SIDEBAR ====================
function initSidebar() {
    const sidebar         = document.getElementById('sidebar');
    const sidebarToggle   = document.getElementById('sidebarToggle');
    const newChatNav      = document.getElementById('newChatNav');
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

// ==================== NAVIGATION ====================
function initNavigation() {
    const map = {
        homeNav:    'index7.html',
        historyNav: 'index11.html',
        settingsNav:'index12.html',
    };
    Object.entries(map).forEach(([id, href]) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', () => window.location.href = href);
    });

    ['videoChatBtn','audioChatBtn','textChatBtn'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', () => {
            const type = id.replace('ChatBtn','');
            startNewChat(type);
        });
    });
}

async function startNewChat(type) {
    try {
        const res  = await fetch(`${API_BASE_URL}/chat/session`, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ type })
        });
        const data = await res.json();
        currentSessionId = data.sessionId;
    } catch(_) {}
    hideWelcomeScreen();
    showChatMessages();
}

// ==================== CHAT ====================
function initChat() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn   = document.getElementById('sendBtn');

    sendBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
    });
}

async function handleSendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message   = chatInput.value.trim();
    if (!message) return;

    hideWelcomeScreen();
    showChatMessages();
    addUserMessage(message);
    chatInput.value = '';
    showTypingIndicator();

    try {
        const res  = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ message, sessionId: currentSessionId || generateSessionId() })
        });
        const data = await res.json();
        if (data.sessionId) currentSessionId = data.sessionId;

        hideTypingIndicator();
        addEmotionMessage(data);

    } catch (err) {
        hideTypingIndicator();
        addUserMessage(''); // cleanup
        console.error(err);
    }
}

// ==================== MESSAGE RENDERERS ====================
function addUserMessage(text) {
    const chatMessages = document.getElementById('chatMessages');
    const time = new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });

    const el = document.createElement('div');
    el.className = 'message user';
    el.innerHTML = `
        <div class="message-avatar"><i data-lucide="user"></i></div>
        <div class="message-content">
            <div class="message-text">${escapeHtml(text)}</div>
            <div class="message-time">${time}</div>
        </div>`;
    chatMessages.appendChild(el);
    lucide.createIcons();
    scrollToBottom();
}

function addEmotionMessage(data) {
    const chatMessages = document.getElementById('chatMessages');
    const time  = new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });

    const rawLabel   = (data.emotion     || 'neutral').toLowerCase();
    const label      = (data.mer_emotion || rawLabel).toLowerCase();  // unified MER label
    const confidence = data.confidence  || 0;
    const allProbs   = data.all_probs   || {};
    const color      = EMOTION_COLORS[label] || '#9ca3af';
    const icon       = EMOTION_ICONS[label]  || '🙂';

    // Collapse raw labels → MER labels and sum probabilities
    const MER_MAP = {
        anger:'angry',   sadness:'sad',     joy:'happy',  love:'happy',
        fear:'fear',     surprise:'surprise', disgust:'angry', neutral:'neutral',
        happy:'happy',   sad:'sad',         angry:'angry', fearful:'fear',
    };
    const merProbs = {};
    Object.entries(allProbs).forEach(([lbl, prob]) => {
        const mer = MER_MAP[lbl.toLowerCase()] || lbl.toLowerCase();
        merProbs[mer] = (merProbs[mer] || 0) + prob;
    });
    const sorted = Object.entries(merProbs).sort((a, b) => b[1] - a[1]);

    const barsHTML = sorted.map(([lbl, prob]) => {
        const c   = EMOTION_COLORS[lbl.toLowerCase()] || '#9ca3af';
        const pct = (prob * 100).toFixed(0);
        return `
        <div class="prob-row">
            <span class="prob-lbl">${capitalize(lbl)}</span>
            <div class="prob-track">
                <div class="prob-fill" style="width:${pct}%;background:${c}"></div>
            </div>
            <span class="prob-pct">${pct}%</span>
        </div>`;
    }).join('');

    const el = document.createElement('div');
    el.className = 'message ai';
    el.innerHTML = `
        <div class="message-avatar">
            <img src="avatar.png" alt="NEXUS">
        </div>
        <div class="message-content emotion-card" style="border-color:${color}33">
            <div class="emotion-header">
                <span class="emotion-icon">${icon}</span>
                <div class="emotion-label" style="color:${color}">${capitalize(label)}</div>
                <div class="emotion-confidence" style="color:${color}">${(confidence*100).toFixed(0)}%</div>
            </div>
            ${barsHTML ? `<div class="prob-bars">${barsHTML}</div>` : ''}
            <div class="message-time">${time}</div>
        </div>`;
    chatMessages.appendChild(el);
    scrollToBottom();
}

// ==================== TYPING ====================
function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const el = document.createElement('div');
    el.className = 'message ai';
    el.id = 'typingIndicator';
    el.innerHTML = `
        <div class="message-avatar"><img src="avatar.png" alt="NEXUS"></div>
        <div class="message-content">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>`;
    chatMessages.appendChild(el);
    scrollToBottom();
}

function hideTypingIndicator() {
    document.getElementById('typingIndicator')?.remove();
}

// ==================== HELPERS ====================
function hideWelcomeScreen() { document.getElementById('welcomeScreen').style.display = 'none'; }
function showChatMessages()  { document.getElementById('chatMessages').classList.add('active'); }
function scrollToBottom()    {
    const c = document.getElementById('chatContainer');
    c.scrollTop = c.scrollHeight;
}
function escapeHtml(text) {
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}
function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }
function generateSessionId() { return 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2,8); }

async function loadChatHistory() {
    try {
        const res  = await fetch(`${API_BASE_URL}/chat/history`);
        const data = await res.json();
        if (data.messages?.length) {
            currentSessionId = data.sessionId;
            hideWelcomeScreen();
            showChatMessages();
            data.messages.forEach(m => {
                if (m.sender === 'user') addUserMessage(m.text);
            });
            lucide.createIcons();
        }
    } catch(_) {}
}

// ==================== KEYBOARD ====================
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.getElementById('chatTypeSubmenu').classList.remove('active');
        document.getElementById('newChatNav').classList.remove('active');
    }
});