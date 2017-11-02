import Res from "../core/res"

/**
 * A toast is a view containing a quick little message for the user. The toast class helps
 * you create and show those.
 *
 * When the view is shown to the user, appears as a floating view over the application.It
 * will never receive focus. The user will probably be in the middle of typing something
 * else. The idea is to be as unobtrusive as possible, while still showing the user the
 * information you want them to see. Two examples are the volume control, and the brief
 * message saying that your settings have been saved.
 *
 * The easiest way to use this class is to call one of the static methods that constructs
 * everything you need and returns a new Toast object.
 *
 * Reference: https://developer.android.com/reference/android/widget/Toast.html
 */
export default class Toast {
    private _duration: number;
    private _view: HTMLElement;

    /** Show the view or text notification for a long period of time. This time could be user-definable. */
    static readonly LENGTH_LONG: number = 3500;
    /** Show the view or text notification for a short period of time. This time could be user-definable. This is the default. */
    static readonly LENGTH_SHORT: number = 2000;

    /** Construct an empty Toast object. You must set the View before you can call show(). */
    constructor() {}

    /** Return the duration. */
    get duration(): number {
        return this._duration;
    }

    /** Return the view. */
    get view(): HTMLElement {
        return this._view;
    }

    /** Set how long to show the view for. */
    set duration(duration: number) {
        this._duration = duration;
    }

    /** Update the text in a Toast that was previously created using one of the makeText() methods. */
    set text(text: string) {
        const textElm = this.view.querySelector(".text");
        if (textElm != null) {
            textElm.textContent = text;
        } else {
            console.error("The Toast text Element was not found.");
        }
    }

    /** Set the view to show. */
    set view(view: HTMLElement) {
        this._view = view;
    }

    /**
     * Close the view if it's showing, or don't show it if it isn't showing yet. You do
     * not normally have to call this. Normally view will disappear on its own after the
     * appropriate duration.
     */
    cancel(): void {
        const toastElm = document.querySelector(".toast");
        if (toastElm != null) {
            /** Event handler to remove the Element after it visually disappears from the webpage. */
            const onTransitionEndHandler = () => {
                toastElm.removeEventListener("transitionend", onTransitionEndHandler);

                toastElm.remove();
            };

            toastElm.addEventListener("transitionend", onTransitionEndHandler);
            toastElm.classList.remove("show");
        }
    }

    /** Make a standard toast that just contains a text view. */
    static makeText(text: string, duration: number = Toast.LENGTH_SHORT): Toast {
        const toast = new Toast();
        const frag = <DocumentFragment>Res.layout.framework_Toast;

        const textElm = <HTMLDivElement>frag.querySelector(".text");
        if (textElm != null) {
            textElm.textContent = text;
        }

        toast.duration = duration;
        toast.view = frag.querySelector(".toast");

        return toast;
    }

    /** Show the view for the specified duration. */
    show(): void {
        const toastRef = <Toast>this;
        document.body.appendChild(this.view);

        setTimeout(() => {
            this.view.classList.add("show");

            setTimeout(() => {
                toastRef.cancel();
            }, this.duration);
        }, 0);
    }
}
