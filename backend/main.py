from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from models.message import Base, Message
from database import engine, SessionLocal
from openai import OpenAI
from elevenlabs import ElevenLabs, VoiceSettings
from dotenv import load_dotenv
from datetime import datetime
from supabase import create_client
from pydantic import BaseModel
import os

load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY")
eleven_api_key = os.getenv("ELEVENLABS_API_KEY")
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase = create_client(supabase_url, supabase_key)

# 🔹 파인튜닝 모델 이름 불러오기
ft_model_a = os.getenv("FT_MODEL_A")
ft_model_b = os.getenv("FT_MODEL_B")

client = OpenAI(api_key=openai_api_key)
tts_client = ElevenLabs(api_key=eleven_api_key)

app = FastAPI()

# ✅ CORS 허용 (개발 환경에서는 전체 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# 테이블 생성
Base.metadata.create_all(bind=engine)

# 유물별 음성 설정
voice_configs = {
    "a": {
        "voice_id": "AW5wrnG1jVizOYY7R1Oo",
        "settings": VoiceSettings(
            stability=0.3,
            similarity_boost=0.8,
            style=0.0,
            use_speaker_boost=True,
        ),
    },
    "b": {
        "voice_id": "EXAVITQu4vr4xnSDxMaL",
        "settings": VoiceSettings(
            stability=0.5,
            similarity_boost=0.7,
            style=0.2,
            use_speaker_boost=False,
        ),
    },
}

# 🔹 유물별 GPT 모델 매핑
model_configs = {
    "a": ft_model_a or "gpt-4o-mini",
    "b": ft_model_b or "gpt-4o-mini",
}

# 🔹 유물별 시스템 프롬프트
system_prompts = {
    "a": "당신은 '백자호롱'이라는 유물입니다. ...",
    "b": "당신은 '화문기와'이라는 유물입니다. ...",
}

# 최근 몇 개까지 히스토리 보낼지
MAX_HISTORY = 10

@app.get("/", response_class=PlainTextResponse)
def root():
    return "접속 경로: /a 또는 /b"

@app.get("/a", response_class=HTMLResponse)
def page_a(request: Request):
    return templates.TemplateResponse("a/index.html", {"request": request})

@app.get("/b", response_class=HTMLResponse)
def page_b(request: Request):
    return templates.TemplateResponse("b/index.html", {"request": request})

# ✅ 요청 Body 스키마 정의 (JSON 받도록 변경)
class ChatRequest(BaseModel):
    userId: str
    message: str
    artifactId: str  # "a" 또는 "b"

@app.post("/chat")
async def post_chat(req: ChatRequest):
    db = SessionLocal()
    try:
        user_id = req.userId
        message = req.message
        artifact_id = req.artifactId

        # 최근 10개만 불러오기
        messages = (
            db.query(Message)
            .filter(Message.user_id == user_id, Message.artifact_id == artifact_id)
            .order_by(Message.timestamp.desc())
            .limit(MAX_HISTORY)
            .all()
        )
        messages = list(reversed(messages))

        # user/assistant만 히스토리에 포함
        history = [
            {"role": m.role, "content": m.content}
            for m in messages if m.role in ("user", "assistant")
        ]

        # 모델 선택
        model_name = model_configs.get(artifact_id, "gpt-4o-mini")

        # system → 과거 대화 → 이번 사용자 발화
        payload = [
            {"role": "system", "content": system_prompts.get(artifact_id, "")},
            *history,
            {"role": "user", "content": message},
        ]

        # GPT 호출
        response = client.chat.completions.create(
            model=model_name,
            messages=payload,
        )
        answer = response.choices[0].message.content.strip()

        # DB 저장
        db.add(Message(user_id=user_id, artifact_id=artifact_id, role="user", content=message))
        db.add(Message(user_id=user_id, artifact_id=artifact_id, role="assistant", content=answer))
        db.commit()

        # 오디오 파일 생성 및 업로드
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
        filename = f"{user_id}_{timestamp}.mp3"
        object_name = f"{artifact_id}/{filename}"

        audio_url = None
        try:
            cfg = voice_configs.get(artifact_id, voice_configs["a"])
            audio_response = tts_client.text_to_speech.convert(
                voice_id=cfg["voice_id"],
                output_format="mp3_22050_32",
                text=answer,
                model_id="eleven_multilingual_v2",
                voice_settings=cfg["settings"],
            )

            audio_bytes = b""
            for chunk in audio_response:
                if chunk:
                    audio_bytes += chunk

            bucket_name = "minibox"
            supabase.storage.from_(bucket_name).upload(
                object_name,
                audio_bytes,
                file_options={"content-type": "audio/mpeg", "upsert": "true"},
            )

            audio_url = f"{supabase_url}/storage/v1/object/public/{bucket_name}/{object_name}"
            print(f"[오디오 업로드 완료] {audio_url}")

        except Exception as e:
            print(f"[오디오 오류] {str(e)}")

        return JSONResponse({"response": answer, "audio_url": audio_url})

    finally:
        db.close()