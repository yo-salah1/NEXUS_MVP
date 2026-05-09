# -*- coding: utf-8 -*-
"""
NEXUS FER API (Pure PyTorch & GPU Optimized)
Port: 8002
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
import base64

# ==========================
# 1. CHECK GPU & DEVICE
# ==========================
if torch.cuda.is_available():
    DEVICE = torch.device("cuda")
    gpu_name = torch.cuda.get_device_name(0)
    print(f"🚀 SUCCESS: PyTorch is strictly using GPU: {gpu_name}")
    # تحسين أداء الـ GPU
    torch.backends.cudnn.benchmark = True 
else:
    DEVICE = torch.device("cpu")
    print("⚠️ WARNING: CUDA not available. PyTorch is falling back to CPU!")

# ==========================
# 2. CONFIG
# ==========================
MODEL_PATH = r"D:\HPC_YS\FER_1014\models\best_vit_base_patch16_224_LLRD_ConservW_Warmup_50ep.pth"
IMG_SIZE   = 224
LABELS     = ["Neutral", "Happy", "Sad", "Angry", "Fearful", "Disgust"]

# ==========================
# 3. LOAD FER MODEL (ViT)
# ==========================
print(f"⚙️  Loading FER ViT model on {DEVICE}...")
model = timm.create_model("vit_base_patch16_224", pretrained=False, num_classes=6)
model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
model = model.to(DEVICE)
model.eval()
print("✅ FER model loaded")

# ==========================
# 4. LOAD FACE DETECTOR (YOLO PyTorch)
# ==========================
from ultralytics import YOLO

print(f"⚙️  Loading YOLO Face Detector on {DEVICE}...")
# YOLOv8n-face مبني على PyTorch
yolo_model = YOLO("yolov8n-face.pt")
# إجبار YOLO إنه يترفع على نفس الـ GPU 
yolo_model.to(DEVICE) 
print("✅ YOLO Face Detector Ready")

# ==========================
# 5. TRANSFORM
# ==========================
transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225]),
])

# ==========================
# 6. HELPERS
# ==========================
def decode_image(data: bytes) -> np.ndarray:
    arr = np.frombuffer(data, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    return img

def get_faces_bboxes(img_bgr: np.ndarray) -> list:
    bboxes = []
    # تمرير الصورة لـ YOLO مع التأكيد إن العملية بتتم على الـ GPU وبدون طباعة في الكونسول
    results = yolo_model.predict(img_bgr, device=DEVICE, verbose=False) 
    
    for result in results:
        boxes = result.boxes.xyxy.cpu().numpy() # سحب النتيجة من الكارت للمعالج عشان تتقص
        for box in boxes:
            x1, y1, x2, y2 = map(int, box)
            bboxes.append([x1, y1, x2, y2])
            
    return bboxes

def predict_frame(img_bgr: np.ndarray) -> dict:
    bboxes = get_faces_bboxes(img_bgr)
    img_h, img_w = img_bgr.shape[:2]

    if len(bboxes) == 0:
        return {
            "face_detected": False,
            "emotion": "Neutral",
            "confidence": 0.0,
            "all_probs": {l: 0.0 for l in LABELS},
            "faces": []
        }

    results = []
    for (x1, y1, x2, y2) in bboxes:
        x1, y1 = max(0, x1), max(0, y1)
        x2, y2 = min(img_w, x2), min(img_h, y2)
        
        if x2 - x1 < 10 or y2 - y1 < 10:
            continue

        face_bgr = img_bgr[y1:y2, x1:x2]
        face_rgb = cv2.cvtColor(face_bgr, cv2.COLOR_BGR2RGB)
        pil_face = Image.fromarray(face_rgb)

        tensor = transform(pil_face).unsqueeze(0).to(DEVICE)

        with torch.no_grad():
            out   = model(tensor)
            probs = torch.softmax(out, dim=1).cpu().numpy()[0]

        pred_idx = int(np.argmax(probs))
        results.append({
            "bbox": [int(x1), int(y1), int(x2-x1), int(y2-y1)],
            "emotion": LABELS[pred_idx],
            "confidence": float(probs[pred_idx]),
            "all_probs": {l: round(float(p), 4) for l, p in zip(LABELS, probs)}
        })

    if len(results) == 0:
        return {
            "face_detected": False,
            "emotion": "Neutral",
            "confidence": 0.0,
            "all_probs": {l: 0.0 for l in LABELS},
            "faces": []
        }

    best = max(results, key=lambda r: r["confidence"])

    return {
        "face_detected": True,
        "emotion":    best["emotion"],
        "confidence": round(best["confidence"], 4),
        "all_probs":  best["all_probs"],
        "faces":      results
    }

# ==========================
# 7. APP & ROUTES
# ==========================
app = FastAPI(title="NEXUS FER API (GPU Optimized)", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok", "model": "NEXUS FER 1014", "hardware": str(DEVICE), "labels": LABELS}

@app.get("/health")
def health():
    return {"status": "healthy", "device": str(DEVICE), "cuda_available": torch.cuda.is_available()}

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
    try:
        img_bytes = base64.b64decode(payload["image"])
        img       = decode_image(img_bytes)
        result    = predict_frame(img)
        return {"status": "ok", **result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("fer_api:app", host="0.0.0.0", port=8003, reload=False)