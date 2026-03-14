class WebSocketClient {
  constructor() {
    this.ws = null;
    this.listeners = {};
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.baseDelay = 1000;
    this.heartbeatInterval = null;
    this.connected = false;
  }

  connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const url = `${protocol}//${window.location.host}/ws`;

    this.ws = new WebSocket(url);

    this.ws.addEventListener('open', () => {
      this.connected = true;
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.emit('connected');
    });

    this.ws.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data);
        this.emit(message.type, message.data);
      } catch {
        // Ignore non-JSON messages
      }
    });

    this.ws.addEventListener('close', () => {
      this.connected = false;
      this.stopHeartbeat();
      this.emit('disconnected');
      this.scheduleReconnect();
    });

    this.ws.addEventListener('error', () => {
      this.connected = false;
      this.stopHeartbeat();
    });
  }

  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit('reconnect_failed');
      return;
    }
    const delay = this.baseDelay * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;
    setTimeout(() => this.connect(), delay);
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send('ping', {});
      }
    }, 30000);
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  send(type, data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    }
  }

  sendCursorPosition(page, x, y) {
    this.send('cursor', { page, x, y });
  }

  sendPageJoin(page) {
    this.send('presence', { action: 'join', page });
  }

  sendPageLeave(page) {
    this.send('presence', { action: 'leave', page });
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return this;
  }

  off(event, callback) {
    if (!this.listeners[event]) return;
    if (callback) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    } else {
      delete this.listeners[event];
    }
    return this;
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  disconnect() {
    this.maxReconnectAttempts = 0;
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default new WebSocketClient();
