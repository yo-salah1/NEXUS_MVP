# NEXUS MER - Models, Datasets, and Results

## 1. English Text Emotion Model (TER)
- **Model Architecture:** `microsoft/deberta-v3-base`
- **Target Classes:** `neutral`, `happy`, `sad`, `angry`, `fearful`, `disgust` / `surprise`

### Datasets Used
1. **`dair-ai/emotion`**: Core academic dataset for basic emotions.
2. **`go_emotions` (Filtered)**: Filtered to match our target classes with high-confidence labels.
3. **`Synthetic Negation Booster`**: Custom synthetic dataset added to force the model to learn complex negations (e.g., "I am not happy at all" -> `sad`/`angry`).

### Data Splits & Numbers
- **Train Set:** 61,715 samples (Explicitly oversampled to balance minority classes like `disgust`, `fearful`, and `angry`).
- **Validation Set:** 6,502 samples.
- **Test Set:** 6,502 samples.

### Results
- **Test Accuracy:** **92.45%** (Achieved target +90%).
- **Test F1-Scores (Highlights):** 
  - `sadness`: 0.97
  - `joy`: 0.94
  - `anger`: 0.93
  - `fear`: 0.88

---

## 2. Arabic Text Emotion Model (TER)
- **Model Architecture:** `UBC-NLP/MARBERTv2` (State-of-the-Art for Arabic Text)
- **Target Classes:** `neutral`, `happy`, `sad`, `angry`, `fearful`, `disgust`

### Datasets Used
1. **`emotone_ar`**: Pure academic Arabic dataset specifically annotated for emotions.
2. **`Synthetic Negation Booster (Arabic)`**: Custom dialectal and Modern Standard Arabic (MSA) dataset created to handle negations (e.g., "أنا مش مبسوط" -> `sad`).

*Note: General Sentiment datasets (like `Arabic_Sentiment_Twitter_Corpus` and `tweet_sentiment_multilingual`) were intentionally excluded during the optimization phase. Including them caused "label contamination" (confusing general 'Negative' tweets with the explicit 'Sad' emotion), which capped the accuracy.*

### Data Splits & Numbers
*(Data was split using a stratified 80/10/10 split)*
- **Train Set:** Oversampled by 50x for extremely rare classes (like `disgust` and `fearful`) to ensure robust training.
- **Validation Set:** ~10% of total purified data.
- **Test Set:** ~10% of total purified data.

### Results
- **Baseline Test Accuracy:** **71.23%** (Achieved with contaminated sentiment data. It performed perfectly on negations but struggled to differentiate between `sad` and `angry`).
- **Target Test Accuracy:** **+90%** (Expected after relying purely on `emotone_ar` and the synthetic boosters).

---

## 3. Speech Emotion Recognition Model (SER)
- **Model Architecture:** `Emotion2Vec+ Base` (Feature Extractor) + `SVM` (Classifier)
- **Target Classes:** `Neutral`, `Happy`, `Sad`, `Angry`, `Fearful`, `Disgust`

### Datasets Used
1. **`CREMA-D`** & Core Audio Datasets: Processed and mapped strictly to the 6 target MER classes.

### Data Splits & Numbers
- **Train Set:** ~5,956 audio files.
- **Test Set:** 1,489 audio files.

### Results
- **Test Accuracy:** **90.19%** (Achieved target +90%).
- **Details:** The SVM was successfully optimized over the embeddings to achieve this high result securely.

---

## 4. Facial Emotion Recognition Model (FER)
- **Model Architecture:** `Vision Transformer (ViT-Base-Patch16-224)`
- **Optimization Strategy:** Layer-wise LR Decay (LLRD) & Conservative Class Weighting.
- **Target Classes:** `neutral`, `happy`, `sad`, `angry`, `fearful`, `disgust`

### Datasets Used
1. **`RAF-DB` (Real-world Affective Faces Database)**: A highly imbalanced, real-world vision dataset. The `surprise` class was intentionally excluded to perfectly match the 6 NEXUS target classes.

### Data Splits & Numbers
- **Train Set:** ~12,271 images (Trained with Conservative Class Weighting capped at 3.0 to handle severe imbalance).
- **Test Set:** 2,739 images.

### Results
- **Test Accuracy:** **88.86%**
- **Test F1-Scores (Highlights):**
  - `happy`: 0.95
  - `neutral`: 0.87
  - `sad`: 0.86
  - `angry`: 0.85
