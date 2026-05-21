"""Voice routes: Whisper STT and OpenAI TTS."""
import os
import io
import base64
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
import openai
from auth_utils import get_current_user
from models import TTSRequest

router = APIRouter(prefix="/voice", tags=["voice"])
ALLOWED_TTS_VOICES = {"alloy", "ash", "coral", "echo", "fable", "nova", "onyx", "sage", "shimmer"}


@router.post("/transcribe")
async def transcribe_audio(
    audio: UploadFile = File(...),
    language: str = Form("en"),
    user: dict = Depends(get_current_user),
):
    api_key = os.environ.get("OPENAI_API_KEY") or os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")
    contents = await audio.read()
    if len(contents) > 25 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Audio file too large (max 25MB)")
    if len(contents) < 100:
        raise HTTPException(status_code=400, detail="Audio file is empty")
    client = openai.AsyncOpenAI(api_key=api_key)
    file_obj = io.BytesIO(contents)
    file_obj.name = audio.filename or "audio.webm"
    try:
        response = await client.audio.transcriptions.create(
            file=(file_obj.name, file_obj),
            model="whisper-1",
            response_format="json",
            language=language if language and len(language) == 2 else None,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Transcription failed: {str(e)[:200]}")
    text = 