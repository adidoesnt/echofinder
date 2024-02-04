from datetime import datetime
from typing import Dict, List
import chromadb
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field
import logging

# Initialize FastAPI app
app = FastAPI()

# In-memory database
client = chromadb.PersistentClient(path="/tmp")
collection = client.get_or_create_collection(name="telegram_messages")

# Pydantic model for data validation
class TelegramMessage(BaseModel):
    message_id: str
    username: str
    firstname: str
    lastname: str
    sender_id: str
    chat_id: str
    message_content: str
    sent_at: datetime = Field(default_factory=datetime.now)



@app.post("/items/", response_model=List[TelegramMessage])
async def upsert_items(messages: List[TelegramMessage]):

    ids = [msg.message_id for msg in messages]
    documents = [msg.message_content for msg in messages]
    metadatas = [{"sender_id": msg.sender_id, "chat_id": msg.chat_id, "firstname": msg.firstname, "lastname": msg.lastname,
                  "sent_at": msg.sent_at.strftime("%Y-%m-%d %H:%M:%S")} for msg in messages]

    collection.upsert(ids=ids, metadatas=metadatas, documents=documents)

    return messages



@app.get("/items/search/") #, response_model=Dict[str, List])
async def search_items(search_string: str = Query(..., min_length=1)):
    query_text = f"Who says this - {search_string}"

    results = collection.query(
        query_texts=query_text,
        n_results=5
        )
    
    return results


@app.delete("/items/delete/", response_model=List[str])
async def delete_items(message_ids: List[str]):
    collection.delete(ids=message_ids)
    return message_ids