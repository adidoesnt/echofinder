import os
from dotenv import load_dotenv
from datetime import datetime
from typing import Any, Dict, List, Literal, Optional
import chromadb
from fastapi import Depends, FastAPI, HTTPException, Query, Security, status
from fastapi.security import APIKeyHeader
from pydantic import BaseModel, Field
from custom_logger import setup_custom_logger

load_dotenv()


# Initialize FastAPI app
app = FastAPI()


api_key = os.environ.get('API_KEY')
api_key_header = APIKeyHeader(name="X-Api-Key")

def get_api_key(api_key_header: str = Security(api_key_header)) -> str:
    if api_key_header == api_key:
        return api_key_header
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or missing API Key",
    )

client = chromadb.HttpClient(host=os.environ.get('CHROMA_HOST'),
                             port = os.environ.get('CHROMA_PORT'),
                             headers={"X-Chroma-Token": os.environ.get('CHROMA_API_KEY')})
collection = client.get_or_create_collection(name="messages")

# Initialize the custom logger
logger = setup_custom_logger(__name__)

# Pydantic model for data validation
class MessageInfo(BaseModel):
    message_id: str
    username: str
    firstname: str
    message_type: Literal['whatsapp', 'telegram']
    lastname: Optional[str] = None
    sender_id: str
    chat_id: str
    message_content: str
    sent_at: datetime = Field(default_factory=datetime.now)



@app.post("/messages/", response_model=List[MessageInfo])
async def upsert_messages(messages: List[MessageInfo], api_key: str = Security(get_api_key)):

    ids = [msg.message_id for msg in messages]
    documents = [msg.message_content for msg in messages]
    metadatas = [{"sender_id": msg.sender_id, "chat_id": msg.chat_id, "name": msg.firstname, "lastname": msg.lastname if msg.lastname else "",
                  "sent_at": msg.sent_at.strftime("%Y-%m-%d %H:%M:%S")} for msg in messages]

    collection.upsert(ids=ids, metadatas=metadatas, documents=documents)

    return messages


@app.get("/message/{message_id}") # response_model=TelegramMessage)
async def get_message_by_id(message_id: str, api_key: str = Security(get_api_key)):
    message = collection.get(message_id)
    return message



@app.get("/messages/search/") # TODO - Add response model
async def search_messages(search_string: str = Query(..., min_length=1), api_key: str = Security(get_api_key)):
    query_text = f"Who says this - {search_string}"

    results = collection.query(
        query_texts=query_text,
        n_results=5
        )
    
    results["documents"] = results["documents"][0]
    
    return results


@app.delete("/messages/delete/", response_model=List[str])
async def delete_messages(message_ids: List[str], api_key: str = Security(get_api_key)):
    collection.delete(ids=message_ids)
    return message_ids


@app.delete("/messages/delete_all/")
async def delete_messages(api_key: str = Security(get_api_key)):
    client.delete_collection("messages")
    return {"Deleted": "RESTART API NOW!!"}