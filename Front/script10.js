/* NEXUS — Video Chat (script10.js) - FER INTEGRATED */

const API_BASE_URL = 'http://localhost:8080/api';
const FER_API_URL  = 'http://localhost:8002';

let stream       = null;
let isCameraOn   = false;
let isMicOn      = false;
let isFERActive  = false;
let ferInterval  = null;
let ferCanvas    = document.createElement('canvas');
let ferCtx       = ferCanvas.getContext('2d');

const EMOTION_COLORS = {
    Happy:   '#f59e0b',
    Sad:     '#60a5fa',
    Angry:   '#ef4444',
    Fearful: '#a78bfa',
    Disgust: '#10b981',
    Neutral: '#9ca3af'
};

// ==========================
// INIT
// ==========================
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initSidebar();
    initControls();
    initParticles();
    console.log('✨ NEXUS Video - FER Ready');
});

// ==========================
// SIDEBAR
// ==========================
function initSidebar() {
    const sidebar        = document.getElementById('sidebar');
    const sidebarToggle  = document.getElementById('sidebarToggle');
    const newChatNav     = document.getElementById('newChatNav');
    const chatTypeSubmenu = document.getElementById('chatTypeSubmenu');

    if (sidebarToggle)
        sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('collapsed'));

    if (newChatNav)
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

// ==========================
// CONTROLS
// ==========================
function initControls() {
    document.getElementById('cameraBtn').addEventListener('click', toggleCamera);
    document.getElementById('micBtn').addEventListener('click', toggleMic);
    document.getElementById('ferBtn').addEventListener('click', toggleFER);
    document.getElementById('endBtn').addEventListener('click', endSession);
}

document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'v') toggleCamera();
    if (e.key.toLowerCase() === 'm') toggleMic();
    if (e.key.toLowerCase() === 'f') toggleFER();
    if (e.key === 'Escape') endSession();
});

// ==========================
// CAMERA
// ==========================
async function toggleCamera() {
    const videoEl    = document.getElementById('videoFeed');
    const placeholder = document.getElementById('cameraOffIcon');
    const cameraBtn  = document.getElementById('cameraBtn');

    if (!isCameraOn) {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720, facingMode: 'user' },
                audio: true
            });
            videoEl.srcObject = stream;
            videoEl.style.display = 'block';
            placeholder.style.display = 'none';
            cameraBtn.classList.add('active');
            isCameraOn = true;
            setStatus('Camera on', true);

            // auto-start FER
            startFER();

        } catch (err) {
            console.error('Camera error:', err);
            setStatus('Camera access denied');
        }
    } else {
        stopFER();
        if (stream) stream.getTracks().forEach(t => t.stop());
        videoEl.style.display = 'none';
        placeholder.style.display = 'flex';
        cameraBtn.classList.remove('active');
        isCameraOn = false;
        setStatus('Camera off', false);
        resetEmotionUI();
    }
}

// ==========================
// MIC
// ==========================
function toggleMic() {
    const micBtn = document.getElementById('micBtn');
    isMicOn = !isMicOn;

    if (stream && stream.getAudioTracks().length > 0)
        stream.getAudioTracks()[0].enabled = isMicOn;

    micBtn.classList.toggle('active', isMicOn);
    micBtn.innerHTML = isMicOn
        ? '<i data-lucide="mic"></i>'
        : '<i data-lucide="mic-off"></i>';
    lucide.createIcons();
}

// ==========================
// FER TOGGLE
// ==========================
function toggleFER() {
    if (isFERActive) {
        stopFER();
    } else {
        if (isCameraOn) startFER();
        else setStatus('Turn on camera first');
    }
}

function startFER() {
    if (isFERActive) return;
    isFERActive = true;
    document.getElementById('ferBtn').classList.add('active');
    ferInterval = setInterval(runFER, 1500); // every 1.5s
}

function stopFER() {
    isFERActive = false;
    document.getElementById('ferBtn').classList.remove('active');
    clearInterval(ferInterval);
    ferInterval = null;
    document.getElementById('ferOverlay').classList.remove('visible');
}

// ==========================
// FER — CAPTURE + SEND
// ==========================
async function runFER() {
    const videoEl = document.getElementById('videoFeed');
    if (!videoEl || videoEl.readyState < 2) return;

    // Capture frame
    ferCanvas.width  = videoEl.videoWidth  || 640;
    ferCanvas.height = videoEl.videoHeight || 480;
    ferCtx.drawImage(videoEl, 0, 0);

    ferCanvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
            const formData = new FormData();
            formData.append('file', blob, 'frame.jpg');

            const res = await fetch(`${API_BASE_URL}/fer/analyze`, {
                method: 'POST',
                body: formData
            });

            const data = await res.json();

            if (data.face_detected) {
                updateEmotionUI(data.emotion, data.confidence, data.all_probs);
            }

        } catch (err) {
            console.error('FER error:', err);
        }
    }, 'image/jpeg', 0.8);
}

// ==========================
// EMOTION UI
// ==========================
function updateEmotionUI(emotion, confidence, allProbs) {
    const color = EMOTION_COLORS[emotion] || '#9ca3af';

    // overlay on video
    const overlay = document.getElementById('ferOverlay');
    overlay.classList.add('visible');
    document.getElementById('ferOverlayEmotion').textContent = emotion;
    document.getElementById('ferOverlayEmotion').style.color = color;
    document.getElementById('ferOverlayConf').textContent = `${(confidence * 100).toFixed(0)}% confidence`;

    // side panel
    document.getElementById('emotionBig').textContent = emotion;
    document.getElementById('emotionBig').style.color = color;
    document.getElementById('emotionConf').textContent = `${(confidence * 100).toFixed(0)}% confidence`;

    // prob bars
    const barsEl = document.getElementById('probBars');
    if (allProbs && Object.keys(allProbs).length > 0) {
        const sorted = Object.entries(allProbs).sort((a, b) => b[1] - a[1]);
        barsEl.innerHTML = sorted.map(([label, prob]) => `
            <div class="prob-row">
                <span class="prob-label">${label}</span>
                <div class="prob-bar-wrap">
                    <div class="prob-bar-fill" style="width:${(prob*100).toFixed(0)}%;background:${EMOTION_COLORS[label] || '#9ca3af'}"></div>
                </div>
                <span class="prob-pct">${(prob*100).toFixed(0)}%</span>
            </div>
        `).join('');
    }
}

function resetEmotionUI() {
    document.getElementById('emotionBig').textContent = '—';
    document.getElementById('emotionBig').style.color = '#9ca3af';
    document.getElementById('emotionConf').textContent = 'Waiting for camera...';
    document.getElementById('probBars').innerHTML = '';
    document.getElementById('ferOverlay').classList.remove('visible');
}

// ==========================
// STATUS
// ==========================
function setStatus(text, active = false) {
    const dot = document.getElementById('statusDot');
    const txt = document.getElementById('statusText');
    if (dot) dot.className = 'status-dot' + (active ? ' active' : '');
    if (txt) txt.textContent = text;
}

// ==========================
// END SESSION
// ==========================
function endSession() {
    stopFER();
    if (stream) stream.getTracks().forEach(t => t.stop());
    window.location.href = 'index7.html';
}

// ==========================
// PARTICLES
// ==========================
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 25 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 1,
        speedY: Math.random() * 0.4 + 0.2,
        opacity: Math.random() * 0.4 + 0.2
    }));

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            p.y -= p.speedY;
            if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        });
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

window.addEventListener('beforeunload', () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
});