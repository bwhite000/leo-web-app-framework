import Context from "./context"
import Dialog from "./dialog"
import { Stream } from "../core/stream"
import { ElementNotFoundException, Res } from "../../index"

export type AlertDialogEventListener = (alertDialog: AlertDialog) => void;

export class Builder {
    private readonly alertDialog: AlertDialog;

    constructor(public context: Context) {
        this.alertDialog = new AlertDialog(context);
    }

    get onCancel(): Stream<void> {
        return this.alertDialog.onCancel;
    }

    get onDismiss(): Stream<void> {
        return this.alertDialog.onDismiss;
    }

    setTitle(title: string): Builder {
        this.alertDialog.setTitle(title);

        return <Builder>this;
    }

    /**
     * Set the title using the custom view {@code customTitleView}.
     *
     * The methods {@link #setTitle(int)} and {@link #setIcon(int)} should
     * be sufficient for most titles, but this is provided if the title
     * needs more customization. Using this will replace the title and icon
     * set via the other methods.
     */
    setCustomTitle(view: HTMLElement): Builder {
        this.alertDialog.setCustomTitle(view);

        return <Builder>this;
    }

    /** Set the message to display. */
    setMessage(message: string): Builder {
        this.setView(document.createTextNode(message));

        return <Builder>this;
    }

    /** Set the icon to be used in the title. */
    //setIcon(drawableResId: string): void {}

    setPositiveButton(text: string, eventListener?: AlertDialogEventListener): Builder {
        this.alertDialog.setButton(1, text, eventListener);

        const positiveBtnElm = this.alertDialog.elm.querySelector("ul.buttons-container > li:last-child");
        if (positiveBtnElm != null) {
            positiveBtnElm.classList.add("raised");
        }

        return <Builder>this;
    }

    setNegativeButton(text: string, eventListener?: AlertDialogEventListener): Builder {
        this.alertDialog.setButton(0, text, eventListener);

        return <Builder>this;
    }

    setNeutralButton(text: string, eventListener?: AlertDialogEventListener): Builder {
        this.alertDialog.setButton(0, text, eventListener);

        return <Builder>this;
    }

    /**
     * Set a custom view resource to be the contents of the Dialog. The
     * resource will be inflated, adding all top-level views to the screen.
     */
    setView(view: Node): Builder {
        this.alertDialog.setView(view);

        return <Builder>this;
    }

    /**
     * Creates an {@link AlertDialog} with the arguments supplied to this
     * builder.
     *
     * Calling this method does not display the dialog. If no additional
     * processing is needed, {@link #show()} may be called instead to both
     * create and display the dialog.
     */
    create(): AlertDialog {
        this.alertDialog.create();

        return this.alertDialog;
    }

    /**
     * Creates an {@link AlertDialog} with the arguments supplied to this
     * builder and immediately displays the dialog.
     *
     * Calling this method is functionally identical to:
     *
     *     AlertDialog dialog = builder.create();
     *     dialog.show();
     */
    show(): AlertDialog {
        this.alertDialog.create();
        this.alertDialog.show();

        return this.alertDialog;
    }
}

export default class AlertDialog extends Dialog {
    constructor(context: Context) {
        super(context);

        this.elmFrag = Res.layout.framework_AlertDialog;

        const alertDialogContainer = <HTMLElement|null>this.elmFrag.querySelector(".alert-dialog-container");
        if (alertDialogContainer == null) { throw new ElementNotFoundException() }
        this.elm = alertDialogContainer;
    }

    private get titleElm() {
        const elm = <HTMLDivElement|null>this.elm.querySelector(".title");
        if (elm == null) { throw new ElementNotFoundException() }

        return elm;
    }

    private get messageElm() {
        const elm = <HTMLDivElement|null>this.elm.querySelector(".message");
        if (elm == null) { throw new ElementNotFoundException() }

        return elm;
    }

    private get buttonsContainerElm() {
        const elm = <HTMLUListElement|null>this.elm.querySelector("ul.buttons-container");
        if (elm == null) { throw new ElementNotFoundException() }

        return elm;
    }

    /** @override */
    setTitle(title: string): void {
        const titleElm = this.titleElm;

        // Clear any previous value.
        titleElm.innerHTML = "";

        // Set the title text.
        titleElm.textContent = title;
    }

    setCustomTitle(view: HTMLElement): void {
        const titleElm = this.titleElm;

        // Clear any previous child Elements value.
        titleElm.innerHTML = "";

        // Set the custom title Element.
        titleElm.appendChild(view);
    }

    /** Set the view to display in that dialog. */
    setView(view: Node) {
        const messageElm = this.messageElm;

        // Clear any existing child Elements.
        messageElm.innerHTML = "";

        // Add the new Element view to the [messageElm].
        messageElm.appendChild(view);
    }

    // setIcon(drawableResId: string): void {}

    setButton(buttonIndex: number, text: string, eventListener?: AlertDialogEventListener) {
        const buttonElm = document.createElement("li");
        buttonElm.textContent = text;

        // Add the button's click event listener.
        buttonElm.addEventListener("click", (_: MouseEvent) => {
            if (eventListener != null) {
                eventListener(<AlertDialog>this);
            }

            (<AlertDialog>this).dismiss();
        });

        this.buttonsContainerElm.appendChild(buttonElm);
    }

    /** @override */
    create(): void {
        super.create();

        this.isCreated = true;
    }

    /** @override */
    show(): void {
        super.show();

        // If showing already, do nothing.
        if (this.isShowing) {
            return;
        }

        // If the Element has not been created yet, create it.
        if (this.isCreated == false) {
            this.create();
        }

        const alertDialogContainerElm = <HTMLElement|null>this.elmFrag.querySelector(".alert-dialog-container");
        if (alertDialogContainerElm == null) { throw new ElementNotFoundException() }

        const alertDialogElm = <HTMLElement|null>this.elm.querySelector(".alert-dialog");
        if (alertDialogElm == null) { throw new ElementNotFoundException() }

        // Add the event listener to cancel the dialog, if permitted by the developer.
        alertDialogContainerElm.addEventListener("click", (evt: MouseEvent) => {
            if (evt.target != alertDialogContainerElm) {
                evt.preventDefault();
                evt.stopPropagation();
            } else {
                this.dismiss();
            }
        });

        // Add the [DocumentFragment] to the webpage.
        document.body.appendChild(this.elmFrag);

        // Get the width of the alert dialog (hidden visually) now that it has been inserted onto the page.
        const alertDialogWidth = alertDialogElm.clientWidth;

        // Center the Element horizontally on the screen.
        alertDialogElm.style.left = `calc(50% - ${Math.floor(alertDialogWidth/2)}px)`;

        // Wait for the initial paint, then insert the Element to allow the transition to happen.
        setTimeout((() => {
            // Show the Elements visually (with transitions).
            this.elm.classList.add("show");
            alertDialogElm.classList.add("show");
        }).bind(this), 0);

        // Set the value that the Element is currently showing.
        this.isShowing = true;
    }

    /**
     * Creates a builder for an alert dialog that uses the default alert
     * dialog theme.
     */
    static readonly Builder = Builder;
}
