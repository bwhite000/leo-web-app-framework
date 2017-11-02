export default class Toast {
    private _duration;
    private _view;
    static readonly LENGTH_LONG: number;
    static readonly LENGTH_SHORT: number;
    constructor();
    duration: number;
    view: HTMLElement;
    text: string;
    cancel(): void;
    static makeText(text: string, duration?: number): Toast;
    show(): void;
}
