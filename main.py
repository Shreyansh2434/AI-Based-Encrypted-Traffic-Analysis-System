from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import threading

from api.predict import router as predict_router
from api.websocket import router as websocket_router

from capture.packet_capture import start_capture
from services.stream_service import set_loop

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router)
app.include_router(websocket_router)


@app.on_event("startup")
async def startup():

    loop = asyncio.get_running_loop()
    set_loop(loop)

    thread = threading.Thread(target=start_capture)
    thread.daemon = True
    thread.start()