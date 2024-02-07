FROM python:3.11

WORKDIR /app

COPY . /app

EXPOSE 8080

RUN pip install -r requirements.txt

CMD uvicorn main:app --workers 1 --host 0.0.0.0 --port $PORT

