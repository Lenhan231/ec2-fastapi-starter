from fastapi import FastAPI

app = FastAPI(title="EC2 FastAPI Starter 🥀")

@app.get("/")
def root():
    return {"msg": "Hello from FastAPI on EC2 🥀", "ok": True}