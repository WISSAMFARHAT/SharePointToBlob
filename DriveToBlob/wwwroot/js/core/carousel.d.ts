export declare class CoreCarousel {
    private static _items;
    private static _siema;
    static open(elements: HTMLElement[], index?: number): void;
    static close(): void;
    static get currentSlide(): number;
    private static html;
    static goTo(index: number): void;
    static prev(): void;
    static next(): void;
    static isOpened(): boolean;
    static get count(): number;
}

