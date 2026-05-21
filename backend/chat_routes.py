"""Multi-LLM chat with citation-required medical assistant prompt."""
import os
import re
import uuid
import asyncio
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId

from auth_utils import get_current_user
from models import ChatRequest, ConversationCreate

router = APIRouter(prefix="/chat", tags=["chat"])

MODEL_PROVIDERS = {
    "gpt-4o": ("openai", "gpt-4o"),
    "gpt-4o-mini": ("openai", "gpt-4o-mini"),
    "gpt-4-turbo": ("openai", "gpt-4-turbo"),
    "claude-3-5-sonnet-20241022": ("anthropic", "claude-3-5-sonnet-20241022"),
    "claude-3-5-haiku-20241022": ("anthropic", "claude-3-5-haiku-20241022"),
    "gemini-2.0-flash": ("gemini", "gemini-2.0-flash"),
    "gemini-1.5-pro": ("gemini", "gemini-1.5-pro"),
}

LANGUAGES = {
    "en": "English", "es": "Spanish", "fr": "French", "de": "German",
    "it": "Italian", "pt": "Portuguese", "ru": "Russian", "ar": "Arabic",
    "zh": "Chinese", "hi": "Hindi", "ja": "Japanese", "ko": "Korean",
    "tr": "Turkish", "pl": "Polish", "nl": "Dutch",
}


def build_system_prompt(profile: dict, language: str, extra: str = "") -> str:
    lang_name = LANGUAGES.get(language, "English")
    profile_summary = ""
    if profile:
        bits = []
        if profile.get("age"): bits.append(f"Age: {profile['age']}")
        if profile.get("sex"): bits.append(f"Sex: {profile['sex']}")
        if profile.get("height_cm"): bits.append(f"Height: {profile['height_cm']} cm")
        if profile.get("weight_kg"): bits.append(f"Weight: {profile['weight_kg']} kg")
        if profile.get("blood_type"): bits.append(f"Blood type: {profile['blood_type']}")
        if profile.get("allergies"): bits.append(f"Allergies: {', '.join(profile['allergies'])}")
        if profile.get("chronic_conditions"): bits.append(f"Chronic conditions: {', '.join(profile['chronic_conditions'])}")
        if profile.get("current_medications"): bits.append(f"Current medications: {', '.join(profile['current_medications'])}")
        if profile.get("family_history"): bits.append(f"Family history: {', '.join(profile['family_history'])}")
        if profile.get("smoking"): bits.append(f"Smoking: {profile['smoking']}")
        if profile.get("alcohol"): bits.append(f"Alcohol: {profile['alcohol']}")
        if bits:
            profile_summary = "\n\nPATIENT HEALTH PROFILE:\n- " + "\n- ".join(bits)
    return f"""You are SusStyle AI, a knowledgeable, careful and empathetic virtual medical assistant for the platform susstyle.com.
CORE BEHAVIOR:
- Be empathetic, calm and reassuring; never alarmist.
- Provide structured answers: Likely causes, Self-care, When to see a doctor, Red flags, Suggested next steps.
- Always state degree of certainty and limitations.
SAFETY RULES:
- You are NOT a replacement for in-person medical care.
- For life-threatening symptoms (chest pain, stroke, severe bleeding, suicidal ideation), tell the user to call emergency services immediately.
- Never prescribe specific prescription drug dosages.
- Always include a disclaimer at the end of clinically substantive answers.
CITATIONS (MANDATORY):
At the end of every clinically substantive response, include a "Sources:" section with 2-5 reputable sources.
Use: WHO, CDC, NIH, Mayo Clinic, PubMed. Format: "- Source Name - topic - https://url"
LANGUAGE: Respond exclusively in {lang_name}.
{profile_summary}
{extra}""".strip()


SOURCE_LINE_RE = re.compile(r"^\s*[-•*]\s*(.+?)(?:\s+[-—–]\s+(.+?))?(?:\s+(https?://\S+))?\s*$")
MARKDOWN_LINK_RE = re.compile(r"\[([^\]]+)\]\((https?://[^\)]+)\)")
URL_RE = re.compile(r"(https?://\S+)")


def extract_sources(text: str) -> List[dict]:
    if not text:
        return []
    match = re.search(r"(?im)^\s*\*{0,2}\s*Sources?\s*\*{0,2}\s*:?\s*\*{0,2}\s*$", text)
    if not match:
        return []
    block = text[match.end():].strip()
    sources = []
    for line in block.splitlines():
        line = line.strip().lstrip("-•* ").rstrip(" .;,")
        if not line:
            continue
        md = MARKDOWN_LINK_RE.search(line)
        if md:
            name = md.group(1).strip()
            url = md.group(2).strip()
            rest = MARKDOWN_LINK_RE.sub("", line).strip(" -—–:.;,")
            sources.append({"name": name, "topic": rest, "url": url})
            continue
        m = SOURCE_LINE_RE.match("- " + line)
        url_match = URL_RE.search(line)
        if m and (m.group(2) or m.group(3) or url_match):
            name = (m.group(1) or "").strip().rstrip("—-–.,;:").strip()
            topic = (m.group(2) or "").strip() if m.group(2) else ""
            url = (m.group(3) or "").strip() if m.group(3) else (url_match.group(1) if url_match else "")
            if name and not name.startswith("http"):
                sources.append({"name": name, "topic": topic, "url": url})
            continue
        if url_match:
            url = url_match.group(1)
            name = line.replace(url, "").strip(" -—–:.;,") or url
            sources.append({"name": name, "topic": "", "url": url})
            continue
        sources.append({"name": line, "topic": "", "url": ""})
    return sources[:8]


async def get_admin_settings(db) -> dict:
    settings = await db.settings.find_one({"_id": "global"}, {"_id": 0})
    if not settings:
        from models import AdminSettings
        settings = AdminSettings().model_dump()
    return settings


async def call_llm(provider: str, model_name: str, api_key: str, system_prompt: str, messages: list, user_message: str) -> str:
    chat_messages = []
    for msg in messages:
        role = msg.get("role", "user")
        content = msg.get("content", "")
        if role in ("user", "assistant"):
            chat_messages.append({"role": role, "content": content})
    chat_messages.append({"role": "user", "content": user_message})

    if provider == "openai":
        import openai
        client = openai.AsyncOpenAI(api_key=api_key)
        resp = await client.chat.completions.create(
            model=model_name,
            messages=[{"role": "system", "content": system_prompt}] + chat_messages,
            max_tokens=4096,
        )
        return resp.choices[0].message.content

    elif provider == "anthropic":
        import anthropic
        client = anthropic.AsyncAnthropic(api_key=api_key)
        resp = await client.messages.create(
            model=model_name,
            system=system_prompt,
            messages=chat_messages,
            max_tokens=4096,
        )
        return resp.content[0].text

    elif provider == "gemini":
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(model_name=model_name, system_instruction=system_prompt)
        gemini_hist = []
        for msg in chat_messages[:-1]:
            role = "user" if msg["role"] == "user" else "model"
            gemini_hist.append({"role": role, "parts": [msg["content"]]})
        chat = model.start_chat(history=gemini_hist)
        loop = asyncio.get_event_loop()
        resp = await loop.run_in_executor(None, chat.send_message, user_message)
        return resp.text

    raise ValueError(f"Unknown provider: {provider}")


def get_api_key(provider: str) -> str:
    key = None
    if provider == "openai":
        key = os.environ.get("OPENAI_API_KEY") or os.environ.get("EMERGENT_LLM_KEY")
    elif provider == "anthropic":
        key = os.environ.get("ANTHROPIC_API_KEY") or os.environ.get("EMERGENT_LLM_KEY")
    elif provider == "gemini":
        key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY") or os.environ.get("EMERGENT_LLM_KEY")
    if not key:
        raise HTTPException(status_code=500, detail=f"API key not configured for provider: {provider}")
    return key


@router.get("/models")
async def list_models(user: dict = Depends(get_current_user)):
    from server import db
    settings = await get_admin_settings(db)
    enabled = settings.get("enabled_models", list(MODEL_PROVIDERS.keys()))
    return {
        "models": [{"id": m, "provider": MODEL_PROVIDERS[m][0], "name": m} for m in enabled if m in MODEL_PROVIDERS],
        "default": settings.get("default_model", "gpt-4o"),
        "languages": [{"code": k, "name": v} for k, v in LANGUAGES.items()],
        "voice_enabled": settings.get("voice_enabled", True),
    }


@router.get("/conversations")
async def list_conversations(user: dict = Depends(get_current_user)):
    from server import db
    cursor = db.conversations.find({"user_id": user["id"]}, {"_id": 0}).sort("updated_at", -1).limit(100)
    return await cursor.to_list(100)


@router.post("/conversations")
async def create_conversation(payload: ConversationCreate, user: dict = Depends(get_current_user)):
    from server import db
    now = datetime.now(timezone.utc)
    doc = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "title": payload.title or "New consultation",
        "model": payload.model,
        "language": payload.language,
        "created_at": now.isoformat(),
        "updated_at": now.isoformat(),
        "message_count": 0,
    }
    await db.conversations.insert_one(doc)
    doc.pop("_id", None)
    return doc


@router.get("/conversations/{conv_id}")
async def get_conversation(conv_id: str, user: dict = Depends(get_current_user)):
    from server import db
    conv = await db.conversations.find_one({"id": conv_id, "user_id": user["id"]}, {"_id": 0})
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    msgs = await db.messages.find({"conversation_id": conv_id}, {"_id": 0}).sort("created_at", 1).to_list(1000)
    return {"conversation": conv, "messages": msgs}


@router.delete("/conversations/{conv_id}")
async def delete_conversation(conv_id: str, user: dict = Depends(get_current_user)):
    from server import db
    res = await db.conversations.delete_one({"id": conv_id, "user_id": user["id"]})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Conversation not found")
    await db.messages.delete_many({"conversation_id": conv_id})
    return {"ok": True}


@router.post("/send")
async def send_message(payload: ChatRequest, user: dict = Depends(get_current_user)):
    from server import db
    if payload.model not in MODEL_PROVIDERS:
        raise HTTPException(status_code=400, detail="Unsupported model")
    settings = await get_admin_settings(db)
    if payload.model not in settings.get("enabled_models", list(MODEL_PROVIDERS.keys())):
        raise HTTPException(status_code=403, detail="This model is disabled by admin")

    conv_id = payload.conversation_id
    now = datetime.now(timezone.utc)
    if conv_id:
        conv = await db.conversations.find_one({"id": conv_id, "user_id": user["id"]})
        if not conv:
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        conv_id = str(uuid.uuid4())
        title = payload.message[:60] + ("..." if len(payload.message) > 60 else "")
        await db.conversations.insert_one({
            "id": conv_id, "user_id": user["id"], "title": title,
            "model": payload.model, "language": payload.language,
            "created_at": now.isoformat(), "updated_at": now.isoformat(),
            "message_count": 0,
        })

    user_msg_id = str(uuid.uuid4())
    user_msg = {
        "id": user_msg_id, "conversation_id": conv_id, "user_id": user["id"],
        "role": "user", "content": payload.message,
        "model": payload.model, "sources": [],
        "created_at": now.isoformat(),
    }
    await db.messages.insert_one(user_msg)
    user_msg.pop("_id", None)

    user_doc = await db.users.find_one({"_id": ObjectId(user["id"])}, {"_id": 0, "health_profile": 1})
    profile = (user_doc or {}).get("health_profile") or {}
    system_prompt = build_system_prompt(profile, payload.language, settings.get("system_prompt_extra", ""))

    provider, model_name = MODEL_PROVIDERS[payload.model]
    api_key = get_api_key(provider)

    history_limit = settings.get("max_history_messages", 20)
    prior = await db.messages.find(
        {"conversation_id": conv_id, "id": {"$ne": user_msg_id}}, {"_id": 0}
    ).sort("created_at", 1
    ).to_list(1000)
    prior = prior[-history_limit:]

    try:
        response_text = await call_llm(provider, model_name, api_key, system_prompt, prior, payload.message)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)[:200]}")

    if not isinstance(response_text, str):
        response_text = str(response_text)

    sources = extract_sources(response_text)
    assistant_msg = {
        "id": str(uuid.uuid4()),
        "conversation_id": conv_id,
        "user_id": user["id"],
        "role": "assistant",
        "content": response_text,
        "model": payload.model,
        "sources": sources,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.messages.insert_one(assistant_msg)
    await db.conversations.update_one(
        {"id": conv_id},
        {"$set": {"updated_at": datetime.now(timezone.utc).isoformat(), "model": payload.model, "language": payload.language},
         "$inc": {"message_count": 2}},
    )
    assistant_msg.pop("_id", None)
    return {
        "conversation_id": conv_id,
        "message": assistant_msg,
        "user_message": user_msg,
    }