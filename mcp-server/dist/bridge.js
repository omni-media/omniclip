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
            // Clean up existing client if still open
            if (this.client) {
                console.error("[MCP Bridge] Replacing existing client connection");
                try {
                    this.client.terminate();
                }
                catch (_) { }
                this.rejectAllPending(new Error("Replaced by new browser connection"));
            }
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
                if (this.client === ws) {
                    this.client = null;
                    this.rejectAllPending(new Error("Browser disconnected"));
                }
            });
            ws.on("error", (err) => {
                console.error("[MCP Bridge] WebSocket error:", err);
                if (this.client === ws) {
                    this.client = null;
                    this.rejectAllPending(new Error("WebSocket error"));
                }
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
    rejectAllPending(error) {
        for (const [id, pending] of this.pending) {
            clearTimeout(pending.timer);
            pending.reject(error);
        }
        this.pending.clear();
    }
    close() {
        this.rejectAllPending(new Error("Bridge shutting down"));
        this.wss.close();
    }
}
//# sourceMappingURL=bridge.js.map