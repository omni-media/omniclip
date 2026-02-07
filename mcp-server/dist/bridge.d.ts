export interface BridgeRequest {
    id: string;
    type: "action" | "query";
    actionType?: string;
    queryType?: string;
    payload?: any;
}
export interface BridgeResponse {
    id: string;
    success: boolean;
    data?: any;
    error?: string;
}
export declare class BrowserBridge {
    private wss;
    private client;
    private pending;
    private readonly REQUEST_TIMEOUT;
    constructor(port: number);
    get isConnected(): boolean;
    sendAction(actionType: string, payload: any): Promise<any>;
    sendQuery(queryType: string, params?: any): Promise<any>;
    private send;
    private handleMessage;
    private rejectAllPending;
    close(): void;
}
