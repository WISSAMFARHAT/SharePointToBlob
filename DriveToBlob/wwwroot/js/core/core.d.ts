export declare class CoreMain {
    static reinitializeLazyLoadingImages(): void;
    static preventScrolling(): void;
    static allowScrolling(): void;
    static scrollTo(scroll: Element | number, scrollDuration: number): void;
}
export declare class CoreString {
    static randomLetters(length: number): string;
    static randomNumbers(length: number): string;
    static random(length: number): string;
}
export declare class CoreStack {
    static mountAll(): void;
    static mount(parent: HTMLElement): void;
    private static isParentLargerThanVisibleItems;
}
export declare class CorePopup {
    private static _contentLoadedCallBack;
    private static get selector();
    private static get element();
    static get isOpened(): boolean;
    static onContentLoaded(callback: () => void): void;
    static open(content?: string | HTMLElement, settings?: CorePopupSettings): void;
    static close(): void;
    static softClose(): void;
    static updateContent(content: string | HTMLElement): void;
}
export declare class CorePopupSettings {
    preventClose: boolean;
}
export declare class CoreMessage {
    private static get selector();
    private static get element();
    static get isOpened(): boolean;
    static open(title: string | HTMLElement, description: string | HTMLElement, buttons: CoreMessageButton[]): void;
    static close(): void;
    static click(): void;
    static selectPreviousButton(): void;
    static selectNextButton(): void;
}
export declare class CoreMessageButton {
    content: string | HTMLElement;
    method?: () => void;
    constructor(content: string | HTMLElement, method?: () => void);
}
export declare class CoreSideBar {
    private static _contentLoadedCallBack;
    static WindowsWidth: number;
    private static get selector();
    private static get element();
    static get isOpened(): boolean;
    static HeaderHeight: string | number;
    static updateWindowsWidthPropertyValue(): void;
    static onContentLoaded(callback: () => void): void;
    static open(content?: (string | HTMLElement)): void;
    static close(): void;
    static softClose(): void;
    static updateContent(content: (string | HTMLElement)): (void | string | HTMLElement);
}

export declare class CoreHeader {
    static updateLayout(): void;
    private static updateMenuButton;
}

export {};

