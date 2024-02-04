#!/bin/bash

source venv/bin/activate
uvicorn main:app --port 8080 --reload --reload-exclude venv/
