import chromadb

client = chromadb.PersistentClient(path="/tmp")
client.delete_collection("telegram_messages")