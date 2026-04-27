import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.stream_service import register, unregister

logger = logging.getLogger(__name__)
router = APIRouter()


@router.websocket("/ws/live")

async def websocket_endpoint(ws: WebSocket):

    await ws.accept()

    await register(ws)

    try:

        while True:

            await ws.receive_text()

    except WebSocketDisconnect:
        logger.debug("WebSocket client disconnected")
        await unregister(ws)
    except Exception as e:
        logger.error(f"WebSocket error: {type(e).__name__}: {e}", exc_info=True)
        try:
            await unregister(ws)
        except Exception as cleanup_error:
            logger.warning(f"Failed to unregister client: {cleanup_error}")