import Context from "./context";
import Dialog from "./dialog";
import { Stream } from "../core/stream";
export declare type AlertDialogEventListener = (alertDialog: AlertDialog) => void;
export declare class Builder {
    context: Context;
    private readonly alertDialog;
    constructor(context: Context);
    readonly onCancel: Stream<void>;
    readonly onDismiss: Stream<void>;
    setTitle(title: string): Builder;
    setCustomTitle(view: HTMLElement): Builder;
    setMessage(message: string): Builder;
    setPositiveButton(text: string, eventListener?: AlertDialogEventListener): Builder;
    setNegativeButton(text: string, eventListener?: AlertDialogEventListener): Builder;
    setNeutralButton(text: string, eventListener?: AlertDialogEventListener): Builder;
    setView(view: Node): Builder;
    create(): AlertDialog;
    show(): AlertDialog;
}
export default class AlertDialog extends Dialog {
    constructor(context: Context);
    private readonly titleElm;
    private readonly messageElm;
    private readonly buttonsContainerElm;
    setTitle(title: string): void;
    setCustomTitle(view: HTMLElement): void;
    setView(view: Node): void;
    setButton(buttonIndex: number, text: string, eventListener?: AlertDialogEventListener): void;
    create(): void;
    show(): void;
    static readonly Builder: typeof Builder;
}
