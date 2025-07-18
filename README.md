![header](https://capsule-render.vercel.app/api?type=waving&height=300&color=0A400C&text=Talk%20to%20the%20Artifact&fontColor=FEFAE0&textBg=false&fontSize=70&animation=fadeIn)

> 관람객의 질문에 유물이 응답하는, 감성 대화 기반 AI 전시 시스템



## 프로젝트 개요

**Talk to the Artifact**는 GPT 기반 AI가 유물의 인격을 빌려 관람객의 질문에 응답하는 **인터랙티브 전시 웹 서비스**입니다.  
관람객은 모바일 기기로 QR코드를 스캔하고, 유물에게 직접 질문을 던져 의미와 감정을 담은 이야기를 들을 수 있습니다.

이 시스템은 단순한 정보 제공을 넘어, **몰입감 있는 디지털 전시 경험**을 창출하고 관람자의 **능동적 탐색**을 유도합니다.


## 주요 특징

- **AI 응답 기반 대화형 큐레이션**  
  관람객의 질문에 따라 GPT가 유물의 시점에서 맞춤형 응답을 생성합니다.

- **감정 분석 + 음성 출력**  
  응답 텍스트에 감정 태깅을 적용하고, 해당 감정에 맞는 목소리로 음성(TTS)을 생성합니다.

- **질문/응답 기록 저장**  
  모든 대화는 유물 ID, 질문 내용, 응답, 감정, timestamp로 데이터베이스에 저장되어 향후 연구에 활용할 수 있습니다.

- **QR 기반 인터페이스**  
  각 유물에 고유한 QR을 연결하여, 사용자는 전시 현장에서 간편하게 모바일로 접근할 수 있습니다.


## 사용 기술

| 분야 | 기술 |
|------|------|
| **프론트엔드** | React.js, Tailwind CSS, Framer Motion, Axios |
| **백엔드** | FastAPI, OpenAI GPT API, Hailuo AI TTS API |
| **데이터 저장** | MySQL (또는 SQLite), SQLAlchemy |
| **API 통신** | RESTful API, Function Call 기반 감정분석 |
| **배포** | Vercel (프론트), Docker + Render (백엔드) |


## 시스템 흐름 요약

1. 관람객이 질문 입력
2. 백엔드 서버가 OpenAI GPT API에 질문 전달
3. 응답 텍스트 생성 → 감정 분석(Function Call 활용)
4. 감정 기반 음성(TTS) 생성
5. 텍스트 + 음성을 프론트에 전달
6. 모든 상호작용 정보는 DB에 저장


## 활용 가능성

- 관람객 감정 반응과 질문 유형 분석을 통한 **디지털 인문학 연구**
- 유물별 인터랙션 데이터를 활용한 **큐레이션 개선**
- 시대와 세대에 따른 문화 감수성 및 관심 주제 분석

## 참고한 전시 사례

- **메트로폴리탄 미술관**: GPT 기반 챗봇 “Natalie Potter”로 구현된 몰입형 전시
- **베르사유 궁전**: 조각상과 대화하는 AI 인터랙션
- **DTU 국립미술관**: 작가 목소리 기반의 GPT 음성 챗봇 시스템


## Figma 프로토타입

-> [프로토타입 보기](https://www.figma.com/proto/Bs7knTv7A4GTSp9Z8zL0ga/talk-to-the-artifact?node-id=0-1&t=xEW5AEIrNEANMNP6-1)

---

## 기획 의도

이 프로젝트는 단순히 유물 정보를 전달하는 것을 넘어서,  
> **“잊혀진 감정과 맥락을 복원하고, 관람객이 직접 그 흐름에 참여하는 전시 경험”**  
을 구현하는 것을 목표로 합니다.

---
