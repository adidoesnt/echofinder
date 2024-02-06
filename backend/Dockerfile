FROM python:3.11

WORKDIR /app

COPY . /app

EXPOSE 8080

RUN pip install -r requirements.txt

CMD ["uvicorn", "main:app", "--port", "8080"]

