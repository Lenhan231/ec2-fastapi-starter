from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()  # đọc biến môi trường từ .env nếu có

app = FastAPI(title="EC2 FastAPI Starter 🥀")

# CORS (tạm allow all; khi có frontend domain thì siết lại)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"msg": "Hello from FastAPI on EC2 🥀", "ok": True}

@app.get("/healthz")
def healthz():
    return {"status": "ok"}
