import Context from "./context"
import ElementNotFoundException from "../core/element_not_found_exception"
import { StreamController, Stream } from "../core/stream"

export default class Dialog {
    protected elmFrag: DocumentFragment;
    protected elm: HTMLElement;

    //final Window window;

    isCreated: boolean = false;
    isShowing: boolean = false;
    isCancelled: boolean = false;

    private onCancelStreamController = new StreamController<void>();
    private onDismissStreamController = new StreamController<void>();
    private onShowStreamController = new StreamController<void>();

    constructor(public context: Context) {}

    get onCancel(): Stream<void> {
        return this.onCancelStreamController.stream;
    }

    get onDismiss(): Stream<void> {
        return this.onDismissStreamController.stream;
    }

    get onShow(): Stream<void> {
        return this.onShowStreamController.stream;
    }

    getContext(): Context {
        return this.context;
    }

    /**
     * Forces immediate creation of the dialog.
     *
     * Note that you should not override this method to perform dialog creation.
     * Rather, override {@link #onCreate}.
     */
    create(): void {}

    /**
     * Start the dialog and display it on screen. The window is placed in the
     * application layer and opaque.  Note that you should not override this
     * method to do initialization when the dialog is shown, instead implement
     * that in {@link #onStart}.
     */
    show(): void {}

    /** Hide the dialog, but do not dismiss it. */
    hide(): void {}

    /**
     * Dismiss this dialog, removing it from the screen. This method can be
     * invoked safely from any thread.  Note that you should not override this
     * method to do cleanup when the dialog is dismissed, instead implement
     * that in {@link #onStop}.
     */
    dismiss(): void {
        if (this.elm != null) {
            this.elm.remove();
        }
    }

    /**
     * Similar to {@link Activity#onCreate}, you should initialize your dialog
     * in this method, including calling {@link #setContentView}.
     */
    protected onCreate(): void {}

    /** Called when the dialog is starting. */
    protected onStart(): void {}

    /** Called to tell you that you're stopping. */
    protected onStop(): void {}

    /**
     * Set the screen content from a layout resource. The resource will be
     * inflated, adding all top-level views to the screen.
     */
    setContentView(view: HTMLElement): void {}

    /**
     * Add an additional content view to the screen. Added after any existing
     * ones in the screen -- existing views are NOT removed.
     */
    addContentView(view: HTMLElement): void {}

    /** Set the title text for this dialog's window. */
    setTitle(title: string): void {}

    /**
     * Called when the dialog has detected the user's press of the back
     * key. The default implementation simply cancels the dialog (only if
     * it is cancelable), but you can override this to do whatever you want.
     */
    onBackPressed(): void {
        this.cancel();
    }

    onContentChanged(): void {}

    onAttachedToWindow(): void {}

    onDetachedFromWindow(): void {}

    /**
     * Cancel the dialog. This is essentially the same as calling {@link #dismiss()}, but it will
     * also call your {@link DialogInterface.OnCancelListener} (if registered).
     */
    cancel(): void {}

    querySelector(selector: string): HTMLElement {
        const elm = <HTMLElement|null>this.elm.querySelector(`.alert-dialog .message ${selector}`);
        if (elm == null) { throw new ElementNotFoundException() }

        return elm;
    }
}
