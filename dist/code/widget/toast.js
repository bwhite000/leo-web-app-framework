"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const res_1 = require("../core/res");
class Toast {
    constructor() { }
    get duration() {
        return this._duration;
    }
    get view() {
        return this._view;
    }
    set duration(duration) {
        this._duration = duration;
    }
    set text(text) {
        const textElm = this.view.querySelector(".text");
        if (textElm != null) {
            textElm.textContent = text;
        }
        else {
            console.error("The Toast text Element was not found.");
        }
    }
    set view(view) {
        this._view = view;
    }
    cancel() {
        const toastElm = document.querySelector(".toast");
        if (toastElm != null) {
            const onTransitionEndHandler = () => {
                toastElm.removeEventListener("transitionend", onTransitionEndHandler);
                toastElm.remove();
            };
            toastElm.addEventListener("transitionend", onTransitionEndHandler);
            toastElm.classList.remove("show");
        }
    }
    static makeText(text, duration = Toast.LENGTH_SHORT) {
        const toast = new Toast();
        const frag = res_1.default.layout.framework_Toast;
        const textElm = frag.querySelector(".text");
        if (textElm != null) {
            textElm.textContent = text;
        }
        toast.duration = duration;
        toast.view = frag.querySelector(".toast");
        return toast;
    }
    show() {
        const toastRef = this;
        document.body.appendChild(this.view);
        setTimeout(() => {
            this.view.classList.add("show");
            setTimeout(() => {
                toastRef.cancel();
            }, this.duration);
        }, 0);
    }
}
Toast.LENGTH_LONG = 3500;
Toast.LENGTH_SHORT = 2000;
exports.default = Toast;
