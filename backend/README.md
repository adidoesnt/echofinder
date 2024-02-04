# Backend Setup

## Steps to Run:

1. Navigate to the backend directory:
    ```
    cd backend
    ```

2. Install the required dependencies:
    ```
    pip install -r requirements.txt
    ```

3. Run the FastAPI application using uvicorn:
    ```
    uvicorn main:app --port 8080 --reload --reload-exclude venv/
    ```

4. Once the server is running, open your web browser and go to:
    ```
    http://127.0.0.1:8080/docs
    ```
   This URL will open the FastAPI interactive documentation (Swagger UI) where you can explore and test the API endpoints.


## Delete DB

`python3 delete_db.py`
