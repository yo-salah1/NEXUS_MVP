# -*- coding: utf-8 -*-
"""
NEXUS FER API
Port: 8002
POST /predict      → single image file
POST /predict/base64 → base64 image
GET  /health
"""

import io
import os
import cv2
import numpy as np
import torch
import timm
from torchvision import transforms
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import uvicorn

# ==========================
# CONFIG
# ==========================
MODEL_PATH = r"D:\HPC_YS\FER_1014\models\best_vit_base_patch16_224_LLRD_ConservW_Warmup_50ep.pth"
IMG_SIZE   = 224
LABELS     = ["Neutral", "Happy", "Sad", "Angry", "Fearful", "Disgust"]
DEVICE     = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ==========================
# LOAD MODEL
# ==========================
print(f"⚙️  Loading FER model on {DEVICE}...")

model = timm.create_model("vit_base_patch16_224", pretrained=False, num_classes=6)
model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
model = model.to(DEVICE)
model.eval()

print("✅ FER model loaded")

# ==========================
# TRANSFORM
# ==========================
transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225]),
])

# ==========================
# FACE DETECTOR
# ==========================
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
)

# في fer_api.py — استبدل الـ face_cascade بـ YuNet
# face_detector = cv2.FaceDetectorYN.create(
#     model="face_detection_yunet_2023mar.onnx",
#     config="",
#     input_size=(320, 320),
#     score_threshold=0.6,
#     nms_threshold=0.3,
#     top_k=1
# )

# from retinaface import RetinaFace

# def predict_frame(img_bgr):
#     faces = RetinaFace.detect_faces(img_bgr)
#     if not faces:
#         return {"face_detected": False, "emotion": "Neutral", ...}
    
#     # خد أول وجه
#     face_data = list(faces.values())[0]
#     x1, y1, x2, y2 = face_data['facial_area']
#     face = img_bgr[y1:y2, x1:x2]
#     pred_idx, probs = predict_face(face)
    

# ==========================
# HELPERS
# ==========================
def decode_image(data: bytes) -> np.ndarray:
    arr = np.frombuffer(data, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    return img


def predict_frame(img_bgr: np.ndarray) -> dict:
    """
    Detect faces → predict emotion for each.
    Returns best face result (highest confidence).
    """
    gray  = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

    if len(faces) == 0:
        return {
            "face_detected": False,
            "emotion": "Neutral",
            "confidence": 0.0,
            "all_probs": {l: 0.0 for l in LABELS},
            "faces": []
        }

    results = []
    for (x, y, w, h) in faces:
        face_bgr = img_bgr[y:y+h, x:x+w]
        face_rgb = cv2.cvtColor(face_bgr, cv2.COLOR_BGR2RGB)
        pil_face = Image.fromarray(face_rgb)

        tensor = transform(pil_face).unsqueeze(0).to(DEVICE)

        with torch.no_grad():
            out   = model(tensor)
            probs = torch.softmax(out, dim=1).cpu().numpy()[0]

        pred_idx = int(np.argmax(probs))
        results.append({
            "bbox": [int(x), int(y), int(w), int(h)],
            "emotion": LABELS[pred_idx],
            "confidence": float(probs[pred_idx]),
            "all_probs": {l: round(float(p), 4) for l, p in zip(LABELS, probs)}
        })

    # return highest confidence face
    best = max(results, key=lambda r: r["confidence"])

    return {
        "face_detected": True,
        "emotion":    best["emotion"],
        "confidence": round(best["confidence"], 4),
        "all_probs":  best["all_probs"],
        "faces":      results
    }

# ==========================
# APP
# ==========================
app = FastAPI(title="NEXUS FER API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================
# ROUTES
# ==========================
@app.get("/")
def root():
    return {"status": "ok", "model": "NEXUS FER 1014", "labels": LABELS}


@app.get("/health")
def health():
    return {"status": "healthy", "device": str(DEVICE)}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.filename.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".bmp")):
        raise HTTPException(status_code=400, detail="Unsupported image format")

    try:
        data   = await file.read()
        img    = decode_image(data)
        result = predict_frame(img)
        return {"status": "ok", "filename": file.filename, **result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict/base64")
async def predict_base64(payload: dict):
    """
    Body: { "image": "<base64 string>" }
    Used for webcam frames from frontend
    """
    import base64
    try:
        img_bytes = base64.b64decode(payload["image"])
        img       = decode_image(img_bytes)
        result    = predict_frame(img)
        return {"status": "ok", **result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==========================
# RUN
# ==========================
if __name__ == "__main__":
    uvicorn.run("fer_api:app", host="0.0.0.0", port=8002, reload=False)
