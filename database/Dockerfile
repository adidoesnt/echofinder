FROM --platform=linux/amd64 ghcr.io/chroma-core/chroma:latest
EXPOSE 8000
VOLUME [ "/storage" ]
CMD uvicorn chromadb.app:app --reload --workers 1 --host 0.0.0.0 --port $PORT --log-config chromadb/log_config.yml --timeout-keep-alive 30