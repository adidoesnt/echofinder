from datetime import datetime
from typing import Any, Dict, List, Optional
import chromadb
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field
from custom_logger import setup_custom_logger

# Initialize FastAPI app
app = FastAPI()

# In-memory database
client = chromadb.PersistentClient(path="/tmp")
collection = client.get_or_create_collection(name="telegram_messages")

# Initialize the custom logger
logger = setup_custom_logger(__name__)

# Pydantic model for data validation
class TelegramMessage(BaseModel):
    message_id: str
    username: str
    firstname: str
    lastname: Optional[str] = None
    sender_id: str
    chat_id: str
    message_content: str
    sent_at: datetime = Field(default_factory=datetime.now)



@app.post("/messages/", response_model=List[TelegramMessage])
async def upsert_messages(messages: List[TelegramMessage]):

    ids = [msg.message_id for msg in messages]
    documents = [msg.message_content for msg in messages]
    metadatas = [{"sender_id": msg.sender_id, "chat_id": msg.chat_id, "name": msg.firstname, "lastname": msg.lastname if msg.lastname else "",
                  "sent_at": msg.sent_at.strftime("%Y-%m-%d %H:%M:%S")} for msg in messages]

    collection.upsert(ids=ids, metadatas=metadatas, documents=documents)

    return messages


@app.get("/message/{message_id}") # response_model=TelegramMessage)
async def get_message_by_id(message_id: str):
    message = collection.get(message_id)
    return message



@app.get("/messages/search/") # TODO - Add response model
async def search_messages(search_string: str = Query(..., min_length=1)):
    query_text = f"Who says this - {search_string}"

    results = collection.query(
        query_texts=query_text,
        n_results=5
        )
    
    results["documents"] = results["documents"][0]
    
    return results


@app.delete("/items/delete/", response_model=List[str])
async def delete_items(message_ids: List[str]):
    collection.delete(ids=message_ids)
    return message_ids