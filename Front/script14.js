/* NEXUS — AI Help & Support (script14.js) - API INTEGRATED */

const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initSidebar();
    initNavigation();
    initMobileSidebar();
    loadAndRenderFAQs();
    initChatStart();
    initFeedback();
    console.log('✨ NEXUS Help & Support - API Ready');
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

// Load FAQs from API
async function loadAndRenderFAQs() {
    try {
        const response = await fetch(`${API_BASE_URL}/faqs`);
        
        if (!response.ok) throw new Error('Failed to load FAQs');
        
        const faqData = await response.json();
        renderFAQs(faqData);
        
    } catch (error) {
        console.error('Error loading FAQs:', error);
        
        // Fallback to mock data if API fails
        const fallbackFAQs = [
            { icon: 'info', question: 'How does the AI assistant work?', answer: 'The AI assistant uses advanced natural language processing to understand your questions and provide accurate, helpful responses in real-time. It learns from interactions to improve its accuracy and relevance.' },
            { icon: 'sparkles', question: 'How to improve AI accuracy?', answer: 'You can improve AI accuracy by providing clear, specific questions, giving feedback on responses, and using the system regularly. The AI continuously learns from user interactions to enhance its performance.' },
            { icon: 'sparkles', question: 'What can the AI help me with?', answer: 'The AI can assist with a wide range of tasks including answering questions, providing recommendations, helping with decision-making, offering emotional support, and more. It\'s designed to be your comprehensive digital assistant.' },
            { icon: 'shield', question: 'Is my data secure with AI?', answer: 'Yes, your data is protected with enterprise-grade encryption. We follow strict privacy policies and never share your personal information with third parties. All conversations are encrypted and stored securely.' }
        ];
        
        renderFAQs(fallbackFAQs);
    }
}

function renderFAQs(faqData) {
    const container = document.getElementById('faqList');
    container.innerHTML = '';

    faqData.forEach((faq, i) => {
        const item = document.createElement('div');
        item.className = 'faq-item';
        item.tabIndex = 0;
        item.setAttribute('role', 'button');
        item.setAttribute('aria-expanded', 'false');

        item.innerHTML = `
            <div class="faq-header">
                <div class="faq-icon-wrap">
                    <i data-lucide="${faq.icon}" class="faq-icon"></i>
                </div>
                <span class="faq-question">${faq.question}</span>
                <i data-lucide="chevron-down" class="faq-chevron"></i>
            </div>
            <div class="faq-body">
                <div class="faq-answer">${faq.answer}</div>
            </div>
        `;

        const header = item.querySelector('.faq-header');
        header.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
            if (!isOpen) {
                item.classList.add('open');
                item.setAttribute('aria-expanded', 'true');
            } else {
                item.setAttribute('aria-expanded', 'false');
            }
        });

        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });

        container.appendChild(item);
    });

    lucide.createIcons();
}

function initChatStart() {
    document.getElementById('chatStartBtn').addEventListener('click', () => {
        console.log('💬 Starting AI Chat...');
        window.location.href = 'index8.html';
    });
}

// Feedback submission with API integration
function initFeedback() {
    const textarea = document.getElementById('feedbackTextarea');
    const btn = document.getElementById('feedbackSubmitBtn');

    btn.addEventListener('click', async () => {
        const feedback = textarea.value.trim();

        if (!feedback) {
            showNotification('Please enter your feedback before submitting.', 'error');
            return;
        }

        btn.disabled = true;
        btn.innerHTML = '<i data-lucide="loader-2" class="btn-icon animate-spin"></i><span>Submitting...</span>';
        lucide.createIcons();

        try {
            const response = await fetch(`${API_BASE_URL}/feedback`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    feedback: feedback,
                    timestamp: new Date().toISOString(),
                    source: 'help-page'
                })
            });

            if (!response.ok) throw new Error('Failed to submit feedback');

            showNotification('Thank you for your feedback! We appreciate your input.', 'success');
            textarea.value = '';

        } catch (error) {
            console.error('Error submitting feedback:', error);
            showNotification('Failed to submit feedback. Please try again.', 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i data-lucide="send" class="btn-icon"></i><span>Submit Feedback</span>';
            lucide.createIcons();
        }
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position:fixed;top:2rem;right:2rem;z-index:9999;
        background:${type === 'success' ? 'var(--btn-send)' : '#e74c3c'};
        color:white;padding:1rem 1.5rem;border-radius:12px;
        font-size:0.87rem;font-weight:500;max-width:400px;
        box-shadow:0 4px 20px rgba(0,0,0,0.3);
        animation:slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideIn {
        from { opacity: 0; transform: translateX(100px); }
        to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideOut {
        from { opacity: 1; transform: translateX(0); }
        to   { opacity: 0; transform: translateX(100px); }
    }
    .animate-spin {
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
    }
`;
document.head.appendChild(notificationStyle);
