export declare class CoreIdentity {
    static get headerSelector(): string;
    private static get headerElement();
    private static get menuSelector();
    private static get menuElement();
    static get isOpened(): boolean;
    static open(): void;
    static close(): void;
    static swap(): void;
}

