import asyncio

clients = []
loop = None


def set_loop(event_loop):
    global loop
    loop = event_loop


async def register(ws):
    if ws not in clients:
        clients.append(ws)


async def unregister(ws):
    try:
        clients.remove(ws)
    except ValueError:
        pass


async def _broadcast(event):
    stale_clients = []
    for c in list(clients):
        try:
            await c.send_json(event)
        except Exception:
            stale_clients.append(c)

    for c in stale_clients:
        await unregister(c)


def broadcast_event(event):
    if loop:
        asyncio.run_coroutine_threadsafe(_broadcast(event), loop)
