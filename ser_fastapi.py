# -*- coding: utf-8 -*-
"""
NEXUS SER - FastAPI Inference Server
POST /predict → emotion + confidence + all_probs
"""

import os
import io
import numpy as np
import joblib
import soundfile as sf
import librosa
import torch
from funasr import AutoModel as FunModel
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# ==========================
# CONFIG
# ==========================
MODEL_DIR = "SER_1004"
SAMPLE_RATE = 16000

# ==========================
# STARTUP — LOAD MODELS ONCE
# ==========================
print("⚙️  Loading models...")

device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"🔥 Device: {device}")

svm    = joblib.load(os.path.join(MODEL_DIR, "svm.pkl"))
scaler = joblib.load(os.path.join(MODEL_DIR, "scaler.pkl"))
labels = joblib.load(os.path.join(MODEL_DIR, "labels.pkl"))

extractor = FunModel(
    model="iic/emotion2vec_plus_base",
    hub="hf",
    device=device,
    disable_update=True,
    disable_pbar=True
)

print(f"✅ Models loaded | Labels: {labels}")

# ==========================
# APP
# ==========================
app = FastAPI(title="NEXUS SER API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # .NET + React
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================
# HELPERS
# ==========================
def load_audio(data: bytes) -> np.ndarray:
    audio, sr = sf.read(io.BytesIO(data))
    if sr != SAMPLE_RATE:
        audio = librosa.resample(audio, orig_sr=sr, target_sr=SAMPLE_RATE)
    if audio.ndim > 1:
        audio = audio.mean(axis=1)
    return audio.astype(np.float32)


def predict_emotion(audio: np.ndarray) -> dict:
    res = extractor.generate(
        input=audio,
        granularity="utterance",
        extract_embedding=True
    )
    feat = np.array(res[0]["feats"]).flatten().reshape(1, -1)
    feat = scaler.transform(feat)

    pred_label = svm.predict(feat)[0]
    proba      = svm.predict_proba(feat)[0]

    all_probs = {label: round(float(p), 4) for label, p in zip(labels, proba)}
    confidence = round(float(proba.max()), 4)

    return {
        "emotion":    pred_label,
        "confidence": confidence,
        "all_probs":  all_probs
    }

# ==========================
# ROUTES
# ==========================
@app.get("/")
def root():
    return {"status": "ok", "model": "NEXUS SER 1004", "labels": labels}


@app.get("/health")
def health():
    return {"status": "healthy", "device": device}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # validate
    if not file.filename.lower().endswith((".wav", ".mp3", ".ogg", ".flac", ".webm")):
        raise HTTPException(status_code=400, detail="Unsupported file format")

    try:
        data  = await file.read()
        audio = load_audio(data)
        result = predict_emotion(audio)
        return {
            "status":     "ok",
            "filename":   file.filename,
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict/base64")
async def predict_base64(payload: dict):
    """
    Alternative endpoint for .NET/SignalR that sends base64 audio
    Body: { "audio": "<base64>", "format": "wav" }
    """
    import base64
    try:
        audio_bytes = base64.b64decode(payload["audio"])
        audio = load_audio(audio_bytes)
        result = predict_emotion(audio)
        return {"status": "ok", **result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==========================
# RUN
# ==========================
if __name__ == "__main__":
    uvicorn.run("ser_fastapi:app", host="0.0.0.0", port=8001, reload=False)
