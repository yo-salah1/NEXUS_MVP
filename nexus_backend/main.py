# -*- coding: utf-8 -*-
"""
NEXUS Backend API
Port: 8080
Connects Frontend ↔ SER API (port 8001) ↔ TER API (port 8002) ↔ FER API (port 8003) ↔ LLM
"""

import uuid
import httpx
import datetime
from typing import Optional
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ==========================
# CONFIG
# ==========================
SER_API_URL = "http://localhost:8001"
TER_API_URL = "http://localhost:8002"
FER_API_URL = "http://localhost:8003"

# In-memory storage (replace with DB later)
sessions: dict = {}
messages_store: dict = {}
settings_store: dict = {
    "adaptiveSensitivity": 75,
    "faceDetection": "high",
    "toneWeight": 50,
    "faceWeight": 50,
    "privacyMode": False,
    "autoSummaries": True,
    "moodAlerts": True,
    "dailyCheckin": True
}

# ==========================
# APP
# ==========================
app = FastAPI(title="NEXUS Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================
# MODELS
# ==========================
class ChatRequest(BaseModel):
    message: str
    sessionId: Optional[str] = None
    emotion: Optional[str] = None
    emotion_confidence: Optional[float] = None

class SessionRequest(BaseModel):
    type: str  # text / audio / video

class SaveMessageRequest(BaseModel):
    sender: str
    text: str
    sessionId: str
    timestamp: Optional[str] = None

class VoiceProcessRequest(BaseModel):
    message: str
    sessionId: Optional[str] = None

class CameraStatusRequest(BaseModel):
    status: str  # on / off

class SettingsUpdateRequest(BaseModel):
    adaptiveSensitivity: Optional[int] = None
    faceDetection: Optional[str] = None
    toneWeight: Optional[int] = None
    faceWeight: Optional[int] = None
    privacyMode: Optional[bool] = None
    autoSummaries: Optional[bool] = None
    moodAlerts: Optional[bool] = None
    dailyCheckin: Optional[bool] = None

class FeedbackRequest(BaseModel):
    feedback: str
    timestamp: Optional[str] = None
    source: Optional[str] = None

class PromptChatRequest(BaseModel):
    promptTitle: str
    promptDesc: str

class TextAnalyzeRequest(BaseModel):
    text: str

# ==========================
# HELPERS
# ==========================
def generate_session_id():
    return f"session_{int(datetime.datetime.now().timestamp() * 1000)}_{uuid.uuid4().hex[:9]}"


def build_system_prompt(emotion: Optional[str] = None) -> str:
    base = (
        "You are NEXUS, an empathetic AI assistant specialized in emotional support. "
        "You are warm, understanding, and non-judgmental. "
        "Keep responses concise (2-4 sentences) and emotionally aware."
    )
    if emotion and emotion != "Neutral":
        base += f" The user appears to be feeling {emotion} based on their voice/facial analysis. Acknowledge this subtly in your response."
    return base


EMOTION_REPLIES = {
    "happy":    "You seem happy! That's wonderful to hear. 😊",
    "joy":      "You seem happy! That's wonderful to hear. 😊",
    "sad":      "I'm sorry you're feeling sad. I'm here for you. 💙",
    "sadness":  "I'm sorry you're feeling sad. I'm here for you. 💙",
    "angry":    "I can sense some frustration. Take a deep breath — it's okay. 😤",
    "anger":    "I can sense some frustration. Take a deep breath — it's okay. 😤",
    "fearful":  "It's okay to feel scared. You're safe here. 🤍",
    "fear":     "It's okay to feel scared. You're safe here. 🤍",
    "disgust":  "Something seems off. Want to talk about it? 😟",
    "surprise": "Looks like something caught you off guard! 😲",
    "neutral":  "I'm here and listening. Feel free to share anything. 🙂",
}

async def get_llm_response(message: str, session_id: str, emotion: Optional[str] = None) -> str:
    key = (emotion or "neutral").lower()
    return EMOTION_REPLIES.get(key, "I'm here for you. Feel free to share how you're feeling. 🤍")


# ==========================
# ROUTES — HEALTH
# ==========================
@app.get("/")
def root():
    return {"status": "ok", "service": "NEXUS Backend", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "healthy"}


# ==========================
# ROUTES — CHAT
# ==========================
@app.post("/api/chat")
async def chat(req: ChatRequest):
    session_id = req.sessionId or generate_session_id()

    if session_id not in messages_store:
        messages_store[session_id] = []

    messages_store[session_id].append({
        "sender": "user",
        "text": req.message,
        "timestamp": datetime.datetime.now().isoformat()
    })

    # TER Inference
    ter_label      = "neutral"
    ter_mer        = "neutral"
    ter_confidence = 0.0
    ter_all_probs  = {}

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            ter_res    = await client.post(f"{TER_API_URL}/predict", json={"text": req.message})
            ter_result = ter_res.json()
            ter_label      = ter_result.get("label",      "neutral")
            ter_mer        = ter_result.get("mer_label",  "neutral")
            ter_confidence = ter_result.get("confidence", 0.0)
            ter_all_probs  = ter_result.get("all_probs",  {})
    except Exception as e:
        print(f"[TER] error: {e}")

    reply = f"{ter_label} ({ter_confidence*100:.0f}%)"

    messages_store[session_id].append({
        "sender": "ai",
        "text": reply,
        "timestamp": datetime.datetime.now().isoformat()
    })

    return {
        "reply":       reply,
        "sessionId":   session_id,
        "timestamp":   datetime.datetime.now().isoformat(),
        "emotion":     ter_label,
        "mer_emotion": ter_mer,
        "confidence":  ter_confidence,
        "all_probs":   ter_all_probs,
    }


@app.post("/api/chat/session")
def create_session(req: SessionRequest):
    session_id = generate_session_id()
    sessions[session_id] = {
        "type": req.type,
        "createdAt": datetime.datetime.now().isoformat()
    }
    messages_store[session_id] = []
    return {
        "sessionId": session_id,
        "type": req.type,
        "createdAt": sessions[session_id]["createdAt"]
    }


@app.post("/api/chat/message")
def save_message(req: SaveMessageRequest):
    if req.sessionId not in messages_store:
        messages_store[req.sessionId] = []

    messages_store[req.sessionId].append({
        "sender": req.sender,
        "text": req.text,
        "timestamp": req.timestamp or datetime.datetime.now().isoformat()
    })

    return {"success": True, "messageId": f"msg_{uuid.uuid4().hex[:6]}"}


@app.get("/api/chat/history")
def get_history():
    if not messages_store:
        return {"sessionId": None, "messages": []}

    last_session = list(messages_store.keys())[-1]
    return {
        "sessionId": last_session,
        "messages": messages_store[last_session]
    }


# ==========================
# ROUTES — VOICE (SER)
# ==========================
@app.post("/api/voice/process")
async def voice_process(req: VoiceProcessRequest):
    session_id = req.sessionId or generate_session_id()
    reply = await get_llm_response(req.message, session_id)
    return {"response": reply, "sessionId": session_id}


@app.post("/api/voice/analyze")
async def voice_analyze(file: UploadFile = File(...)):
    try:
        import subprocess, tempfile, os

        audio_data = await file.read()

        with tempfile.NamedTemporaryFile(suffix='.webm', delete=False) as tmp_in:
            tmp_in.write(audio_data)
            tmp_in_path = tmp_in.name

        tmp_out_path = tmp_in_path.replace('.webm', '.wav')

        subprocess.run([
            'ffmpeg', '-y', '-i', tmp_in_path,
            '-ar', '16000', '-ac', '1', '-f', 'wav', tmp_out_path
        ], capture_output=True)

        with open(tmp_out_path, 'rb') as f:
            wav_data = f.read()

        os.unlink(tmp_in_path)
        os.unlink(tmp_out_path)

        async with httpx.AsyncClient(timeout=30.0) as client:
            ser_response = await client.post(
                f"{SER_API_URL}/predict",
                files={"file": ("recording.wav", wav_data, "audio/wav")}
            )
            ser_result = ser_response.json()

        return {
            "status": "ok",
            "emotion": ser_result.get("emotion", "Neutral"),
            "confidence": ser_result.get("confidence", 0.0),
            "all_probs": ser_result.get("all_probs", {})
        }

    except Exception as e:
        print(f"SER error: {e}")
        return {"status": "error", "emotion": "Neutral", "confidence": 0.0, "all_probs": {}}


# ==========================
# ROUTES — TEXT (TER) ← الجديد
# ==========================
@app.post("/api/text/analyze")
async def text_analyze(req: TextAnalyzeRequest):
    """
    Sends text to TER microservice (port 8002) and returns emotion result.
    Response shape mirrors SER for easy frontend reuse:
        { status, emotion, mer_emotion, confidence, all_probs }
    """
    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text field is empty")

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            ter_response = await client.post(
                f"{TER_API_URL}/predict",
                json={"text": text}
            )
            ter_result = ter_response.json()

        return {
            "status":      "ok",
            "emotion":     ter_result.get("label",      "neutral"),
            "mer_emotion": ter_result.get("mer_label",  "neutral"),
            "confidence":  ter_result.get("confidence", 0.0),
            "all_probs":   ter_result.get("all_probs",  {}),
        }

    except Exception as e:
        print(f"TER error: {e}")
        return {
            "status":      "error",
            "emotion":     "neutral",
            "mer_emotion": "neutral",
            "confidence":  0.0,
            "all_probs":   {}
        }


# ==========================
# ROUTES — VIDEO (FER)
# ==========================
@app.post("/api/video/camera")
def camera_status(req: CameraStatusRequest):
    return {"success": True, "status": req.status}


@app.post("/api/fer/analyze")
async def fer_analyze(file: UploadFile = File(...)):
    try:
        image_data = await file.read()
        async with httpx.AsyncClient(timeout=15.0) as client:
            fer_response = await client.post(
                f"{FER_API_URL}/predict",
                files={"file": (file.filename, image_data, "image/jpeg")}
            )
            fer_result = fer_response.json()
        return fer_result
    except Exception as e:
        return {"status": "error", "face_detected": False,
                "emotion": "Neutral", "confidence": 0.0, "all_probs": {}}


# ==========================
# ROUTES — HISTORY
# ==========================
@app.get("/api/history")
def get_all_history():
    result = []
    today = datetime.date.today()
    today_items, yesterday_items, older_items = [], [], []

    for session_id, msgs in messages_store.items():
        if not msgs:
            continue

        first_msg = msgs[0]
        ts = datetime.datetime.fromisoformat(first_msg["timestamp"])
        title = first_msg["text"][:40] + "..." if len(first_msg["text"]) > 40 else first_msg["text"]
        session_type = sessions.get(session_id, {}).get("type", "text")

        item = {
            "title": title,
            "mood": "calm",
            "duration": f"{len(msgs)}msg",
            "type": session_type,
            "id": session_id,
            "timestamp": first_msg["timestamp"]
        }

        if ts.date() == today:
            today_items.append(item)
        elif ts.date() == today - datetime.timedelta(days=1):
            yesterday_items.append(item)
        else:
            older_items.append(item)

    if today_items:    result.append({"separator": "Today",     "items": today_items})
    if yesterday_items:result.append({"separator": "Yesterday", "items": yesterday_items})
    if older_items:    result.append({"separator": "Older",     "items": older_items})

    return result


# ==========================
# ROUTES — SETTINGS
# ==========================
@app.get("/api/settings")
def get_settings():
    return settings_store


@app.put("/api/settings")
def update_settings(req: SettingsUpdateRequest):
    updates = req.model_dump(exclude_none=True)
    settings_store.update(updates)
    return {"success": True, "settings": settings_store}


# ==========================
# ROUTES — PROMPTS
# ==========================
@app.get("/api/prompts")
def get_prompts():
    return [
        {"icon": "message-circle", "title": "Healthy food",       "desc": "Navigate interpersonal challenges",       "link": "Use Prompt →"},
        {"icon": "sparkles",       "title": "Confidence Booster", "desc": "Build self-esteem and positive mindset",  "link": "Use Prompt →"},
        {"icon": "heart",          "title": "Stress Relief Coach","desc": "Calm anxiety and manage stress effectively","link": "Use Prompt →"},
        {"icon": "target",         "title": "Focus Enhancer",     "desc": "Improve concentration and productivity",   "link": "Use Prompt →"},
        {"icon": "flame",          "title": "Anger Cooldown",     "desc": "De-escalate frustration and find peace",  "link": "Use Prompt →"},
        {"icon": "moon",           "title": "Sleep Routine",      "desc": "Wind down and prepare for rest",           "link": "Use Prompt →"},
    ]


@app.post("/api/chat/prompt")
async def start_prompt_chat(req: PromptChatRequest):
    session_id = generate_session_id()
    messages_store[session_id] = []

    system = f"You are NEXUS. The user selected the '{req.promptTitle}' prompt: {req.promptDesc}. Start with a warm, relevant opening message."

    try:
        response = ANTHROPIC_CLIENT.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=150,
            system=system,
            messages=[{"role": "user", "content": "Start"}]
        )
        initial_message = response.content[0].text
    except Exception:
        initial_message = f"I'm here to help you with {req.promptTitle}. What's on your mind?"

    messages_store[session_id].append({
        "sender": "ai",
        "text": initial_message,
        "timestamp": datetime.datetime.now().isoformat()
    })

    return {"sessionId": session_id, "initialMessage": initial_message}


# ==========================
# ROUTES — FAQS
# ==========================
@app.get("/api/faqs")
def get_faqs():
    return [
        {"icon": "info",     "question": "How does the AI assistant work?",   "answer": "NEXUS uses multimodal emotion recognition combining facial expressions, voice tone, and text analysis to provide empathetic AI responses tailored to your emotional state."},
        {"icon": "sparkles", "question": "How to improve AI accuracy?",       "answer": "Speak clearly and ensure good lighting for the camera. The more you interact, the better NEXUS understands your communication style."},
        {"icon": "sparkles", "question": "What can the AI help me with?",     "answer": "NEXUS can provide emotional support, help manage stress and anxiety, offer coping strategies, and engage in meaningful conversations about your wellbeing."},
        {"icon": "shield",   "question": "Is my data secure with AI?",        "answer": "Yes, all conversations are processed locally and your data is never shared with third parties. Privacy mode is available in settings."},
    ]


# ==========================
# ROUTES — FEEDBACK
# ==========================
@app.post("/api/feedback")
def submit_feedback(req: FeedbackRequest):
    print(f"📝 Feedback received: {req.feedback}")
    return {
        "success": True,
        "feedbackId": f"feedback_{uuid.uuid4().hex[:6]}",
        "message": "Thank you for your feedback!"
    }


# ==========================
# RUN
# ==========================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=False)