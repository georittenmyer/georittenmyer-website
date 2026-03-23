#!/usr/bin/env python3
"""
DNS Sniffer — broadcasts DNS queries on your network over WebSocket.
The widget at ws://localhost:8765 will receive them live.

Requirements:
    pip install scapy websockets

Run as root/sudo (needed for raw packet capture):
    sudo python3 dns_sniffer.py

Optional: specify a network interface:
    sudo python3 dns_sniffer.py --iface eth0
"""

import asyncio
import json
import argparse
import threading
from datetime import datetime

try:
    import websockets
except ImportError:
    raise SystemExit("Install websockets:  pip install websockets")

try:
    from scapy.all import sniff, DNS, DNSQR, IP
except ImportError:
    raise SystemExit("Install scapy:  pip install scapy")

CLIENTS: set = set()
LOOP: asyncio.AbstractEventLoop = None

# ── WebSocket server ──────────────────────────────────────────────────────────

async def handler(websocket):
    CLIENTS.add(websocket)
    print(f"[ws] client connected  ({len(CLIENTS)} total)")
    try:
        await websocket.wait_closed()
    finally:
        CLIENTS.discard(websocket)
        print(f"[ws] client disconnected ({len(CLIENTS)} total)")

async def broadcast(msg: str):
    if CLIENTS:
        await asyncio.gather(*[c.send(msg) for c in CLIENTS], return_exceptions=True)

def send_to_clients(data: dict):
    if LOOP and CLIENTS:
        asyncio.run_coroutine_threadsafe(broadcast(json.dumps(data)), LOOP)

# ── DNS packet handler ────────────────────────────────────────────────────────

def packet_handler(pkt):
    if pkt.haslayer(DNS) and pkt.haslayer(DNSQR):
        qname = pkt[DNSQR].qname
        if isinstance(qname, bytes):
            qname = qname.decode("utf-8", errors="replace").rstrip(".")
        src_ip = pkt[IP].src if pkt.haslayer(IP) else "unknown"
        record = {
            "time": datetime.now().strftime("%H:%M:%S"),
            "domain": qname,
            "src": src_ip,
        }
        print(f"[dns] {record['time']}  {src_ip:>15}  {qname}")
        send_to_clients(record)

def start_sniffer(iface):
    filter_str = "udp port 53"
    kwargs = {"filter": filter_str, "prn": packet_handler, "store": False}
    if iface:
        kwargs["iface"] = iface
    print(f"[sniff] starting on {'all interfaces' if not iface else iface} …")
    sniff(**kwargs)

# ── Entry point ───────────────────────────────────────────────────────────────

async def main(iface):
    global LOOP
    LOOP = asyncio.get_running_loop()

    t = threading.Thread(target=start_sniffer, args=(iface,), daemon=True)
    t.start()

    print("[ws] WebSocket server listening on ws://localhost:8765")
    async with websockets.serve(handler, "localhost", 8765):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="DNS sniffer → WebSocket bridge")
    parser.add_argument("--iface", default=None, help="Network interface (e.g. eth0, en0)")
    args = parser.parse_args()
    asyncio.run(main(args.iface))
