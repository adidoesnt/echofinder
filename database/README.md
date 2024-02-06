# EchoFinder Database

This is the database for the EchoFinder message search bots. It is a ChromaDB database.

## Setup

### Environment Variables

```
CHROMA_SERVER_AUTH_CREDENTIALS=<YOUR-SECRET-KEY>
CHROMA_SERVER_AUTH_CREDENTIALS_PROVIDER=chromadb.auth.token.TokenConfigServerAuthCredentialsProvider
CHROMA_SERVER_AUTH_PROVIDER=chromadb.auth.token.TokenAuthServerProvider
CHROMA_SERVER_AUTH_TOKEN_TRANSPORT_HEADER=X_CHROMA_TOKEN # X-Chroma-Token
PERSIST_DIRECTORY=/storage/chroma-storage
```

### Running

To run locally, you need to have Docker installed.
Once you have Docker installed, you can run the following commands:

```bash
bun run build # or npm run build
bun run local # or npm run local
```
