# NEXUS API Endpoints Documentation

**Base URL:** `http://localhost:8080/api`

All endpoints updated in frontend JavaScript files (script8.js through script14.js)

---

## 📝 Chat Endpoints

### 1. **Send Chat Message**
**Endpoint:** `POST /api/chat`

**Request Body:**
```json
{
  "message": "What should I do? I just broke up",
  "sessionId": "session_1738531200000_abc123"
}
```

**Response:**
```json
{
  "reply": "I understand this is a difficult time. Let me help you process these feelings...",
  "sessionId": "session_1738531200000_abc123",
  "timestamp": "2026-02-03T10:30:00Z"
}
```

**Used in:** `script8.js` - Main chat page

---

### 2. **Create New Session**
**Endpoint:** `POST /api/chat/session`

**Request Body:**
```json
{
  "type": "text"  // or "video", "audio"
}
```

**Response:**
```json
{
  "sessionId": "session_1738531200000_xyz789",
  "type": "text",
  "createdAt": "2026-02-03T10:30:00Z"
}
```

**Used in:** `script8.js` - When starting new chat

---

### 3. **Save Chat Message**
**Endpoint:** `POST /api/chat/message`

**Request Body:**
```json
{
  "sender": "user",  // or "ai"
  "text": "Hello, how are you?",
  "sessionId": "session_1738531200000_abc123",
  "timestamp": "2026-02-03T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "msg_123456"
}
```

**Used in:** `script8.js` - Save each message for history

---

### 4. **Get Chat History**
**Endpoint:** `GET /api/chat/history`

**Response:**
```json
{
  "sessionId": "session_1738531200000_abc123",
  "messages": [
    {
      "sender": "user",
      "text": "Hello",
      "timestamp": "2026-02-03T10:30:00Z"
    },
    {
      "sender": "ai",
      "text": "Hi! How can I help you?",
      "timestamp": "2026-02-03T10:30:05Z"
    }
  ]
}
```

**Used in:** `script8.js` - Load previous chat on page load

---

### 5. **Start Prompt Chat**
**Endpoint:** `POST /api/chat/prompt`

**Request Body:**
```json
{
  "promptTitle": "Stress Relief Coach",
  "promptDesc": "Calm anxiety and manage stress effectively"
}
```

**Response:**
```json
{
  "sessionId": "session_1738531200000_prompt123",
  "initialMessage": "I'm here to help you manage stress. What's on your mind?"
}
```

**Used in:** `script13.js` - When user clicks prompt card

---

## 📜 History Endpoints

### 6. **Get All Chat History**
**Endpoint:** `GET /api/history`

**Response:**
```json
[
  {
    "separator": "Today",
    "items": [
      {
        "title": "Diet food for breakfast",
        "mood": "calm",
        "duration": "1:15",
        "type": "text",
        "id": "chat_001",
        "timestamp": "2026-02-03T09:00:00Z"
      },
      {
        "title": "I'm not feeling well today 😟",
        "mood": "stressed",
        "duration": "2:30",
        "type": "text",
        "id": "chat_002",
        "timestamp": "2026-02-03T11:00:00Z"
      }
    ]
  },
  {
    "separator": "Yesterday",
    "items": [
      {
        "title": "What should I eat for lunch?",
        "mood": "calm",
        "duration": "3:10",
        "type": "audio",
        "id": "chat_003",
        "timestamp": "2026-02-02T12:00:00Z"
      }
    ]
  }
]
```

**Used in:** `script11.js` - History page

---

## ⚙️ Settings Endpoints

### 7. **Get User Settings**
**Endpoint:** `GET /api/settings`

**Response:**
```json
{
  "adaptiveSensitivity": 75,
  "faceDetection": "high",
  "toneWeight": 50,
  "faceWeight": 50,
  "privacyMode": false,
  "autoSummaries": true,
  "moodAlerts": true,
  "dailyCheckin": true
}
```

**Used in:** `script12.js` - Settings page load

---

### 8. **Update Settings**
**Endpoint:** `PUT /api/settings`

**Request Body:**
```json
{
  "adaptiveSensitivity": 80
}
```

**Response:**
```json
{
  "success": true,
  "settings": {
    "adaptiveSensitivity": 80,
    "faceDetection": "high",
    "toneWeight": 50,
    "faceWeight": 50,
    "privacyMode": false,
    "autoSummaries": true,
    "moodAlerts": true,
    "dailyCheckin": true
  }
}
```

**Used in:** `script12.js` - When user changes any setting

---

## 🎯 Prompts Endpoint

### 9. **Get All Prompts**
**Endpoint:** `GET /api/prompts`

**Response:**
```json
[
  {
    "icon": "message-circle",
    "title": "Healthy food",
    "desc": "Navigate interpersonal challenges",
    "link": "Use Prompt →"
  },
  {
    "icon": "sparkles",
    "title": "Confidence Booster",
    "desc": "Build self-esteem and positive mindset",
    "link": "Use Prompt →"
  },
  {
    "icon": "heart",
    "title": "Stress Relief Coach",
    "desc": "Calm anxiety and manage stress effectively",
    "link": "Use Prompt →"
  },
  {
    "icon": "target",
    "title": "Focus Enhancer",
    "desc": "Improve concentration and productivity",
    "link": "Use Prompt →"
  },
  {
    "icon": "flame",
    "title": "Anger Cooldown",
    "desc": "De-escalate frustration and find peace",
    "link": "Use Prompt →"
  },
  {
    "icon": "moon",
    "title": "Sleep Routine",
    "desc": "Wind down and prepare for rest",
    "link": "Use Prompt →"
  }
]
```

**Used in:** `script13.js` - Home page prompt cards

---

## ❓ FAQ Endpoint

### 10. **Get FAQs**
**Endpoint:** `GET /api/faqs`

**Response:**
```json
[
  {
    "icon": "info",
    "question": "How does the AI assistant work?",
    "answer": "The AI assistant uses advanced natural language processing to understand your questions and provide accurate, helpful responses in real-time. It learns from interactions to improve its accuracy and relevance."
  },
  {
    "icon": "sparkles",
    "question": "How to improve AI accuracy?",
    "answer": "You can improve AI accuracy by providing clear, specific questions, giving feedback on responses, and using the system regularly. The AI continuously learns from user interactions to enhance its performance."
  },
  {
    "icon": "sparkles",
    "question": "What can the AI help me with?",
    "answer": "The AI can assist with a wide range of tasks including answering questions, providing recommendations, helping with decision-making, offering emotional support, and more. It's designed to be your comprehensive digital assistant."
  },
  {
    "icon": "shield",
    "question": "Is my data secure with AI?",
    "answer": "Yes, your data is protected with enterprise-grade encryption. We follow strict privacy policies and never share your personal information with third parties. All conversations are encrypted and stored securely."
  }
]
```

**Used in:** `script14.js` - Help & Support page

---

## 💬 Feedback Endpoint

### 11. **Submit Feedback**
**Endpoint:** `POST /api/feedback`

**Request Body:**
```json
{
  "feedback": "The AI is really helpful! Would love more customization options.",
  "timestamp": "2026-02-03T10:30:00Z",
  "source": "help-page"
}
```

**Response:**
```json
{
  "success": true,
  "feedbackId": "feedback_123456",
  "message": "Thank you for your feedback!"
}
```

**Used in:** `script14.js` - Help & Support page

---

## 🎙️ Voice Endpoint

### 12. **Process Voice Input**
**Endpoint:** `POST /api/voice/process`

**Request Body:**
```json
{
  "message": "What should I do? I just broke up"
}
```

**Response:**
```json
{
  "response": "I'm here to help you through this difficult time...",
  "sessionId": "session_voice_123"
}
```

**Used in:** `script9.js` - Voice interaction page

---

## 📹 Video Endpoint

### 13. **Camera Status**
**Endpoint:** `POST /api/video/camera`

**Request Body:**
```json
{
  "status": "on"  // or "off"
}
```

**Response:**
```json
{
  "success": true,
  "status": "on"
}
```

**Used in:** `script10.js` - Video call page

---

## 🔒 CORS Configuration Required

Add this to your Spring Boot `application.properties`:

```properties
# Allow frontend to call API
spring.web.cors.allowed-origins=*
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
```

Or configure in Java:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }
}
```

---

## 📊 Summary

| Page | Script File | API Endpoints Used |
|------|-------------|-------------------|
| Chat (8) | script8.js | `/chat`, `/chat/session`, `/chat/message`, `/chat/history` |
| Voice (9) | script9.js | `/voice/process` |
| Video (10) | script10.js | `/video/camera` |
| History (11) | script11.js | `/history` |
| Settings (12) | script12.js | `/settings` (GET & PUT) |
| Home (13) | script13.js | `/prompts`, `/chat/prompt` |
| Help (14) | script14.js | `/faqs`, `/feedback` |

**Total Endpoints:** 13

**All scripts include:**
- ✅ Error handling with try/catch
- ✅ Fallback to mock data if API fails
- ✅ Loading states
- ✅ Success/error notifications
- ✅ Full sidebar functionality (unchanged)

---

## 🚀 Next Steps

1. Create Spring Boot backend with these 13 endpoints
2. Test each endpoint with Postman
3. Connect frontend to backend
4. Add authentication (JWT tokens)
5. Deploy to production

All frontend code is ready and waiting for your Java Spring Boot backend! 🎉
