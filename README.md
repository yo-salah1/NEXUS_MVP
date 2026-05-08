# NEXUS_MVP
# 🧠 NEXUS — Multilingual Emotion Recognition System

<div align="center">

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge\&logo=python)
![PyTorch](https://img.shields.io/badge/PyTorch-Deep%20Learning-red?style=for-the-badge\&logo=pytorch)
![Transformers](https://img.shields.io/badge/HuggingFace-Transformers-yellow?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

### 🚀 Arabic & English Text Emotion Recognition using State-of-the-Art Transformer Models

</div>

---

# 📌 Overview

**NEXUS** is an advanced multilingual **Text Emotion Recognition (TER)** system designed to classify emotions from Arabic and English text using modern Transformer-based architectures.

The project focuses on:

* 🎯 High Accuracy Emotion Detection
* 🌍 Arabic + English Support
* ⚡ Efficient Transformer Fine-Tuning
* 📊 Research-Level Evaluation
* 🧠 Real-World Deployment Readiness

NEXUS is being developed as a graduation project at the Faculty of Computers and Information.

---

# 🎭 Supported Emotions

The system currently supports the following emotion classes:

| Emotion    | Description                 |
| ---------- | --------------------------- |
| 😐 Neutral | Emotionally balanced text   |
| 😊 Happy   | Joy, excitement, positivity |
| 😢 Sad     | Sadness and disappointment  |
| 😡 Angry   | Anger and frustration       |
| 😨 Fearful | Fear and anxiety            |
| 🤢 Disgust | Disgust and rejection       |

---

# 🏗️ Project Architecture

```text
                    ┌──────────────────┐
                    │  Raw Datasets    │
                    └────────┬─────────┘
                             │
                             ▼
                 ┌──────────────────────┐
                 │ Data Cleaning Layer  │
                 └────────┬─────────────┘
                          │
                          ▼
                ┌────────────────────────┐
                │ Label Mapping Engine   │
                └────────┬───────────────┘
                         │
                         ▼
              ┌────────────────────────────┐
              │ Transformer Tokenization   │
              └────────┬───────────────────┘
                       │
                       ▼
          ┌──────────────────────────────────┐
          │ Fine-Tuned Transformer Models   │
          └────────┬─────────────────────────┘
                   │
                   ▼
          ┌──────────────────────────────────┐
          │ Emotion Classification Output   │
          └──────────────────────────────────┘
```

---

# 🤖 Models Used

## 🇸🇦 Arabic Models

* `aubmindlab/bert-base-arabertv2`
* `UBC-NLP/MARBERTv2`
* `CAMeL-Lab/bert-base-arabic-camelbert-mix`

## 🇺🇸 English Models

* `bert-base-uncased`
* `roberta-base`
* `distilbert-base-uncased`

---

# 📚 Datasets

## Arabic Datasets

* ArSarcasm
* LABR
* Arabic Twitter Emotion datasets
* Custom Egyptian Dialect Samples

## English Datasets

* ISEAR
* MELD
* GoEmotions
* Emotion Dataset (HuggingFace)

---

# ⚙️ Tech Stack

| Category             | Technologies             |
| -------------------- | ------------------------ |
| Programming Language | Python                   |
| Deep Learning        | PyTorch                  |
| NLP Framework        | HuggingFace Transformers |
| Data Processing      | Pandas, NumPy            |
| Evaluation           | Scikit-learn             |
| Visualization        | Matplotlib, Seaborn      |
| Experiment Tracking  | TensorBoard              |

---

# 📂 Project Structure

```bash
NEXUS/
│
├── datasets/
│   ├── arabic/
│   └── english/
│
├── checkpoints/
│
├── notebooks/
│
├── src/
│   ├── preprocessing/
│   ├── training/
│   ├── evaluation/
│   ├── inference/
│   └── utils/
│
├── logs/
│
├── app/
│
├── requirements.txt
│
└── README.md
```

---

# 🚀 Installation

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/NEXUS.git
cd NEXUS
```

## 2️⃣ Create Virtual Environment

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux / Mac

```bash
source venv/bin/activate
```

## 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

# 🏋️ Training

## Arabic Model

```bash
python train_ar.py
```

## English Model

```bash
python train_en.py
```

---

# 🧪 Evaluation

```bash
python evaluate.py
```

Metrics used:

* Accuracy
* Precision
* Recall
* F1-Score
* Confusion Matrix

---

# 💡 Example Inference

```python
from model import predict_emotion

text = "أنا حزين جدا النهاردة"

prediction = predict_emotion(text)

print(prediction)
```

### Output

```bash
Sad
```

---

# 📈 Research Goals

The project aims to:

* Improve Arabic Emotion Recognition performance
* Handle dialectal Arabic efficiently
* Build multilingual TER systems
* Reduce emotion classification bias
* Create deployable AI services for real-world applications

---

# 🌐 Future Plans

* 🎤 Speech Emotion Recognition
* 🎥 Multimodal Emotion Recognition
* 🤖 LLM Integration
* 📱 Mobile Application
* ☁️ API Deployment
* 🧠 Real-Time Emotion Analysis

---

# 👨‍💻 Team

## NEXUS Team

| Role                   | Member       |
| ---------------------- | ------------ |
| AI / Data Science Lead | Yousif Salah |
| Frontend Developer     | Team Member  |
| Backend Developer      | Team Member  |
| UI/UX Designer         | Team Member  |

---

# 📊 Sample Results

| Model     | Language | Accuracy |
| --------- | -------- | -------- |
| MARBERTv2 | Arabic   | 90%+     |
| AraBERTv2 | Arabic   | 88%+     |
| RoBERTa   | English  | 92%+     |

> Results are continuously improving during experimentation.

---

# 🔥 Why NEXUS?

Most emotion recognition systems focus mainly on English.

NEXUS aims to bridge the gap by building a powerful multilingual emotion recognition engine with strong Arabic language understanding — especially Egyptian dialect support.

---

# 🤝 Contributing

Contributions are welcome.

If you'd like to contribute:

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

# 📜 License

This project is licensed under the MIT License.

---

# 📬 Contact

## 👤 Yousif Salah Mohamed

* 📧 Email: [yosalah100@gmail.com](mailto:yosalah100@gmail.com)
* 💼 LinkedIn: [https://www.linkedin.com/in/yousif-salah/](https://www.linkedin.com/in/yousif-salah/)
* 💻 GitHub: [https://github.com/yo-salah1](https://github.com/yo-salah1)

---

<div align="center">

## ⭐ If you like this project, don't forget to star the repository!

### Built with ❤️ using AI & Deep Learning

</div>
