#!/usr/bin/env python3
"""
AI Worker Client - eKYC WebSocket Connection
"""

import socketio
import json
import sys
from datetime import datetime

# Configuration
WEBSOCKET_URL = 'https://api-dev.x-or.cloud'
WEBSOCKET_NAMESPACE = '/ai-events'
WEBSOCKET_PATH = '/ekyc/socket.io'
SERVICE_TOKEN = 'ai-worker-service-token-ekyc-2026-secure'

# Create Socket.IO client
sio = socketio.Client(
    logger=True,
    engineio_logger=True,
    reconnection=True
)

def log(message, level='INFO'):
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    print(f'[{timestamp}] [{level}] {message}')

@sio.event
def connect():
    log(f'✅ Connected! Socket ID: {sio.sid}', 'SUCCESS')
    log('Joining AI workers room...', 'INFO')
    sio.emit('join-ai-worker', namespace=WEBSOCKET_NAMESPACE, callback=on_join_response)

def on_join_response(data):
    log(f'✅ Joined: {data}', 'SUCCESS')

@sio.event
def connect_error(data):
    log(f'❌ Connection error: {data}', 'ERROR')

@sio.event
def disconnect():
    log('❌ Disconnected', 'WARNING')

@sio.on('ai.process.ocr', namespace=WEBSOCKET_NAMESPACE)
def on_ocr(data):
    log('📥 OCR Job received', 'SUCCESS')
    print(json.dumps(data, indent=2))

@sio.on('ai.process.liveness', namespace=WEBSOCKET_NAMESPACE)
def on_liveness(data):
    log('📥 Liveness Job received', 'SUCCESS')
    print(json.dumps(data, indent=2))

@sio.on('ai.process.facematch', namespace=WEBSOCKET_NAMESPACE)
def on_facematch(data):
    log('📥 Face Match Job received', 'SUCCESS')
    print(json.dumps(data, indent=2))

def main():
    log('🚀 Starting AI Worker...', 'INFO')
    log(f'   URL: {WEBSOCKET_URL}', 'INFO')
    log(f'   Namespace: {WEBSOCKET_NAMESPACE}', 'INFO')
    log(f'   Path: {WEBSOCKET_PATH}', 'INFO')
    try:
        log('Connecting...', 'INFO')
        sio.connect(
            WEBSOCKET_URL,
            socketio_path=WEBSOCKET_PATH,
            namespaces=[WEBSOCKET_NAMESPACE],
            headers={'Authorization': SERVICE_TOKEN},
            transports=['websocket', 'polling'],
            wait_timeout=10
        )
        log('👂 Listening... Press Ctrl+C to stop', 'INFO')
        sio.wait()
    except KeyboardInterrupt:
        log('Stopping...', 'WARNING')
        sio.disconnect()
    except Exception as e:
        log(f'❌ Error: {e}', 'ERROR')
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
