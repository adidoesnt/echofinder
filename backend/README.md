# Backend Setup

## Environment variables

### FastAPI (chroma client)
* CHROMA_HOST
* CHROMA_PORT
* API_KEY
* CHROMA_API_KEY

### Chroma server
* CHROMA_SERVER_AUTH_CREDENTIALS
* CHROMA_SERVER_AUTH_CREDENTIALS_PROVIDER="chromadb.auth.token.TokenConfigServerAuthCredentialsProvider"
* CHROMA_SERVER_AUTH_TOKEN_TRANSPORT_HEADER="X_CHROMA_TOKEN"
* CHROMA_SERVER_AUTH_PROVIDER="chromadb.auth.token.TokenAuthServerProvider"

## Steps to Run (development):

1. Navigate to the backend directory:
    ```
    cd backend
    ```

2. Install the required dependencies:
    ```
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

3. Run the FastAPI application using uvicorn:
    ```
    uvicorn main:app --port 8080 --reload --reload-exclude venv/
    ```

4. Run chroma server locally
    ```
    chroma run --path /tmp
    ```

5. Once the server is running, open your web browser and go to:
    ```
    http://127.0.0.1:8080/docs
    ```
   This URL will open the FastAPI interactive documentation (Swagger UI) where you can explore and test the API endpoints.


## Delete DB

`python3 delete_db.py`

## Deployment

```
docker compose up --build
```