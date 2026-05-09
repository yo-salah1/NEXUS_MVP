/* NEXUS — Voice Interaction (script9.js) - SER INTEGRATED */

const API_BASE_URL = 'http://localhost:8080/api';
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];
let currentSessionId = null;

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initSidebar();
    initVoice();
    initParticles();
});

// ==================== SIDEBAR ====================
function initSidebar() {
    const sidebar         = document.getElementById('sidebar');
    const sidebarToggle   = document.getElementById('sidebarToggle');
    const newChatNav      = document.getElementById('newChatNav');
    const chatTypeSubmenu = document.getElementById('chatTypeSubmenu');

    if (sidebarToggle)
        sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('collapsed'));

    if (newChatNav)
        newChatNav.addEventListener('click', () => {
            chatTypeSubmenu.classList.toggle('active');
            newChatNav.classList.toggle('active');
        });
}

// ==================== VOICE ====================
function initVoice() {
    const voiceBtn = document.getElementById('voiceBtn');
    if (voiceBtn) voiceBtn.addEventListener('click', toggleRecording);
}

document.addEventListener('keydown', (e) => {
    if (e.key === ' ' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        toggleRecording();
    }
});

async function toggleRecording() {
    isRecording ? stopRecording() : await startRecording();
}

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunks = [];
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunks.push(e.data); };
        mediaRecorder.onstop = async () => { stream.getTracks().forEach(t => t.stop()); await processAudio(); };
        mediaRecorder.start();
        isRecording = true;
        document.getElementById('voiceBtn').classList.add('listening');
        setStatus('Listening...');
        setUserMessage('🎙️ Recording... (click again to stop)');
    } catch (err) {
        setUserMessage('❌ Microphone access denied');
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
    isRecording = false;
    document.getElementById('voiceBtn').classList.remove('listening');
    setStatus('Processing...');
}

async function processAudio() {
    try {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        setUserMessage('🧠 Analyzing emotion...');

        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.webm');

        const serRes  = await fetch(`${API_BASE_URL}/voice/analyze`, { method: 'POST', body: formData });
        const serData = await serRes.json();
        const emotion    = serData.emotion    || 'Neutral';
        const confidence = serData.confidence || 0;

        // update in-page panels
        showEmotionPanel(emotion, confidence, serData.all_probs || {});
        setUserMessage(`Detected: ${emotion} (${(confidence * 100).toFixed(0)}%)`);

        // AI response
        currentSessionId = currentSessionId || generateSessionId();
        const chatRes  = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: `I'm feeling ${emotion.toLowerCase()}`, sessionId: currentSessionId, emotion, emotion_confidence: confidence })
        });
        const chatData = await chatRes.json();
        showAIPanel(chatData.reply || '');
        setStatus('');

    } catch (err) {
        setUserMessage('❌ Error: ' + err.message);
        setStatus('');
    }
}

// ==================== UI — IN-PAGE PANELS ====================
const COLORS = { Happy:'#f59e0b', Sad:'#60a5fa', Angry:'#ef4444', Fearful:'#a78bfa', Disgust:'#10b981', Neutral:'#9ca3af' };

function showEmotionPanel(emotion, confidence, allProbs) {
    const color = COLORS[emotion] || '#9ca3af';
    const panel = document.getElementById('emotionPanel');
    panel.classList.add('visible');
    panel.style.borderColor = color;

    document.getElementById('emotionName').textContent = emotion;
    document.getElementById('emotionName').style.color = color;
    document.getElementById('emotionConf').textContent = `${(confidence * 100).toFixed(0)}% confidence`;

    const sorted = Object.entries(allProbs).sort((a,b) => b[1]-a[1]);
    document.getElementById('probBars').innerHTML = sorted.map(([label, prob]) => `
        <div class="prob-row">
            <span class="prob-label">${label}</span>
            <div class="prob-bar-wrap">
                <div class="prob-bar-fill" style="width:${(prob*100).toFixed(0)}%;background:${COLORS[label]||'#9ca3af'}"></div>
            </div>
            <span class="prob-pct">${(prob*100).toFixed(0)}%</span>
        </div>
    `).join('');
}

function showAIPanel(text) {
    if (!text) return;
    const panel = document.getElementById('aiPanel');
    panel.classList.add('visible');
    document.getElementById('aiText').textContent = text;
}

function setUserMessage(text) {
    const el = document.getElementById('userQuery');
    if (el) el.textContent = text;
}

function setStatus(text) {
    const el = document.getElementById('statusText');
    if (!el) return;
    el.style.display = text ? 'block' : 'none';
    el.textContent = text;
}

// ==================== PARTICLES ====================
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({length: 30}, () => ({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1, speedY: Math.random() * 0.5 + 0.3,
        opacity: Math.random() * 0.5 + 0.3
    }));
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
            p.y -= p.speedY;
            if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        });
        requestAnimationFrame(animate);
    }
    animate();
    window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
}

function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}