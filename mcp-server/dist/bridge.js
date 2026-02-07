import { WebSocketServer, WebSocket } from "ws";
import { randomUUID } from "crypto";
export class BrowserBridge {
    wss;
    client = null;
    pending = new Map();
    REQUEST_TIMEOUT = 10000;
    constructor(port) {
        this.wss = new WebSocketServer({ port });
        this.wss.on("connection", (ws) => {
            console.error(`[MCP Bridge] Browser connected`);
            this.client = ws;
            ws.on("message", (data) => {
                try {
                    const msg = JSON.parse(data.toString());
                    this.handleMessage(msg);
                }
                catch (err) {
                    console.error("[MCP Bridge] Failed to parse message:", err);
                }
            });
            ws.on("close", () => {
                console.error("[MCP Bridge] Browser disconnected");
                this.client = null;
                // Reject all pending requests
                for (const [id, pending] of this.pending) {
                    clearTimeout(pending.timer);
                    pending.reject(new Error("Browser disconnected"));
                    this.pending.delete(id);
                }
            });
            ws.on("error", (err) => {
                console.error("[MCP Bridge] WebSocket error:", err);
            });
        });
        console.error(`[MCP Bridge] WebSocket server listening on port ${port}`);
    }
    get isConnected() {
        return this.client !== null && this.client.readyState === WebSocket.OPEN;
    }
    async sendAction(actionType, payload) {
        return this.send({
            id: randomUUID(),
            type: "action",
            actionType,
            payload,
        });
    }
    async sendQuery(queryType, params) {
        return this.send({
            id: randomUUID(),
            type: "query",
            queryType,
            payload: params,
        });
    }
    send(request) {
        return new Promise((resolve, reject) => {
            if (!this.isConnected) {
                reject(new Error("Omniclip browser app is not connected. Please open the editor at http://localhost:8080 and ensure the MCP bridge is active."));
                return;
            }
            const timer = setTimeout(() => {
                this.pending.delete(request.id);
                reject(new Error("Request timed out after 10s. The browser may be unresponsive."));
            }, this.REQUEST_TIMEOUT);
            this.pending.set(request.id, { resolve, reject, timer });
            this.client.send(JSON.stringify(request));
        });
    }
    handleMessage(msg) {
        const pending = this.pending.get(msg.id);
        if (!pending) {
            console.error(`[MCP Bridge] Received response for unknown request: ${msg.id}`);
            return;
        }
        clearTimeout(pending.timer);
        this.pending.delete(msg.id);
        if (msg.success) {
            pending.resolve(msg.data);
        }
        else {
            pending.reject(new Error(msg.error || "Unknown error from browser"));
        }
    }
    close() {
        for (const [id, pending] of this.pending) {
            clearTimeout(pending.timer);
            pending.reject(new Error("Bridge shutting down"));
        }
        this.pending.clear();
        this.wss.close();
    }
}
//# sourceMappingURL=bridge.js.map