class WebSocketService {
    socket: WebSocket | null = null;

    connect(url: string, onMessage: (data: any) => void) {
        if (this.socket) return;

        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.log("WS connected");
        };

        this.socket.onmessage = (payload: any) => {
            onMessage?.(JSON.parse(payload.data));
        };

        this.socket.onerror = (err) => {
            console.error("WS error", err);
        };

        this.socket.onclose = () => {
            console.log("WS closed");
            this.socket = null;
        };
    }

    // send(data: any) {
    //     if (this.socket?.readyState === WebSocket.OPEN) {
    //         this.socket.send(JSON.stringify(data));
    //     }
    // }

    disconnect() {
        this.socket?.close();
        this.socket = null;
    }
}

export const wsService = new WebSocketService();
