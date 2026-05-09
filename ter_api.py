# -*- coding: utf-8 -*-
"""
NEXUS TER API — Text Emotion Recognition (Self-Contained)
==========================================================
Run:
    uvicorn ter_api:app --host 0.0.0.0 --port 8002 --reload

Endpoints:
    POST /predict   -> predict emotion from text
    GET  /health    -> health check + active model info
    GET  /labels    -> list all labels
"""

# +---------------------------------------------------------+
# |  ACTIVE_MODEL -- غير القيمة دي بس عشان تبدل موديل      | 
# |                                                          |
# |  "hartmann" -> j-hartmann/emotion-english-               |
# |               distilroberta-base  (7 emotions)           |
# |               RECOMMENDED -- احسن على general text      |
# |                                                          |
# |  "dair"     -> dair-ai/emotion  (6 emotions)             |
# |               Twitter-trained, weak on greetings         |
# |                                                          |
# |  "local"    -> موديلك اللي اتدرب على HPC               |
# |               لما يبقى عندك best_model جاهز            |
# +---------------------------------------------------------+
ACTIVE_MODEL = "dair"

# =============================================================================
# MODEL REGISTRY
# =============================================================================
MODEL_REGISTRY = {
    # "hartmann": {
    #     # "model_id":    "j-hartmann/emotion-english-distilroberta-base",
    #     "model_id":    r"C:\Users\Yousif\.cache\huggingface\hub\models--j-hartmann--emotion-english-distilroberta-base\snapshots",
    #     "description": "DistilRoBERTa 7 emotions (anger/disgust/fear/joy/neutral/sadness/surprise)",
    #     "local":       False,
    # },
    "hartmann": {
    "model_id":    r"C:\Users\Yousif\.cache\huggingface\hub\models--j-hartmann--emotion-english-distilroberta-base\snapshots\7e9d7fe536a4d2bb472f9e883cc6cbbe81f68961",
    "description": "DistilRoBERTa 7 emotions (anger/disgust/fear/joy/neutral/sadness/surprise)",
    "local":       False,
},
    "dair": {
        "model_id":    "dair-ai/emotion",
        "description": "BERT 6 emotions (Twitter-trained)",
        "local":       False,
    },
    "local": {
        "model_id":    "D:/HPC_YS/TER_1008/best_model",
        "description": "Local fine-tuned model (HPC)",
        "local":       True,
        "mer_map_path":"D:/HPC_YS/TER_1008/mer_label_mapping.json",
    },
}

# =============================================================================
# MER UNIFIED MAPPING
# Maps any model's raw labels -> NEXUS unified emotion space
# Aligned with FER (6 classes) and SER (emotion2vec)
# =============================================================================
MER_MAP = {
    # hartmann
    "anger":    "angry",
    "disgust":  "angry",
    "fear":     "fear",
    "joy":      "happy",
    "neutral":  "neutral",
    "sadness":  "sad",
    "surprise": "surprise",
    # dair-ai
    "love":     "happy",
    # local / aliases
    "happy":    "happy",
    "sad":      "sad",
    "angry":    "angry",
    "fearful":  "fear",
}

# =============================================================================
# LOAD MODEL
# =============================================================================
import json, os
import numpy as np
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

MAX_LENGTH = 128
DEVICE     = torch.device("cuda" if torch.cuda.is_available() else "cpu")

cfg = MODEL_REGISTRY[ACTIVE_MODEL]
print(f"[TER] Active model : {ACTIVE_MODEL}")
print(f"[TER] Model ID     : {cfg['model_id']}")
print(f"[TER] Description  : {cfg['description']}")
print(f"[TER] Device       : {DEVICE}")

# tokenizer = AutoTokenizer.from_pretrained(cfg["model_id"])
# model     = AutoModelForSequenceClassification.from_pretrained(cfg["model_id"])

tokenizer = AutoTokenizer.from_pretrained(cfg["model_id"], local_files_only=True)
model     = AutoModelForSequenceClassification.from_pretrained(cfg["model_id"], local_files_only=True)


model     = model.to(DEVICE)
model.eval()
print(f"[TER] Loaded successfully")

id2label: dict = model.config.id2label
label2id: dict = model.config.label2id

mer_map = dict(MER_MAP)
if cfg.get("local") and cfg.get("mer_map_path"):
    mp = cfg["mer_map_path"]
    if os.path.exists(mp):
        with open(mp) as f:
            mer_map.update(json.load(f).get("text_to_mer", {}))
        print(f"[TER] MER map loaded from file")
    else:
        print(f"[TER] MER map file not found -- using built-in map")

print(f"[TER] Labels: {list(id2label.values())}")

# =============================================================================
# PREDICT
# =============================================================================
def predict_text(text: str) -> dict:
    inputs = tokenizer(
        text,
        return_tensors="pt",
        padding="max_length",
        truncation=True,
        max_length=MAX_LENGTH
    ).to(DEVICE)

    with torch.no_grad():
        probs = torch.softmax(model(**inputs).logits, dim=1).cpu().numpy()[0]

    pred_idx   = int(np.argmax(probs))
    raw_label  = id2label[pred_idx]
    confidence = float(probs[pred_idx])
    all_probs  = {id2label[i]: float(probs[i]) for i in range(len(probs))}
    mer_label  = mer_map.get(raw_label.lower(), raw_label.lower())

    return {
        "label":      raw_label,
        "mer_label":  mer_label,
        "confidence": confidence,
        "all_probs":  all_probs,
        "model":      ACTIVE_MODEL,
    }

# =============================================================================
# APP
# =============================================================================
app = FastAPI(title="NEXUS TER API", version="2.0.0")

class TextRequest(BaseModel):
    text: str

class PredictionResponse(BaseModel):
    label:      str
    mer_label:  str
    confidence: float
    all_probs:  dict[str, float]
    model:      str

@app.get("/health")
def health():
    return {
        "status":       "ok",
        "active_model": ACTIVE_MODEL,
        "model_id":     cfg["model_id"],
        "description":  cfg["description"],
        "device":       str(DEVICE),
        "labels":       list(id2label.values()),
    }

@app.get("/labels")
def labels():
    return {
        "active_model": ACTIVE_MODEL,
        "raw_labels":   list(id2label.values()),
        "mer_labels":   sorted(set(mer_map.values())),
        "mer_mapping":  {k: v for k, v in mer_map.items() if k in [l.lower() for l in id2label.values()]},
    }

@app.post("/predict", response_model=PredictionResponse)
def predict(req: TextRequest):
    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text field is empty")
    return predict_text(text)

# =============================================================================
# RUN
# =============================================================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("ter_api:app", host="0.0.0.0", port=8002, reload=False)
