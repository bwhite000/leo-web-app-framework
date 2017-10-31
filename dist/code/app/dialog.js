"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const element_not_found_exception_1 = require("../core/element_not_found_exception");
const stream_1 = require("../core/stream");
class Dialog {
    constructor(context) {
        this.context = context;
        this.isCreated = false;
        this.isShowing = false;
        this.isCancelled = false;
        this.onCancelStreamController = new stream_1.StreamController();
        this.onDismissStreamController = new stream_1.StreamController();
        this.onShowStreamController = new stream_1.StreamController();
    }
    get onCancel() {
        return this.onCancelStreamController.stream;
    }
    get onDismiss() {
        return this.onDismissStreamController.stream;
    }
    get onShow() {
        return this.onShowStreamController.stream;
    }
    getContext() {
        return this.context;
    }
    create() { }
    show() { }
    hide() { }
    dismiss() {
        if (this.elm != null) {
            this.elm.addEventListener("transitionend", () => {
                this.elm.remove();
            });
            this.elm.classList.add("hide");
        }
    }
    onCreate() { }
    onStart() { }
    onStop() { }
    setContentView(view) { }
    addContentView(view) { }
    setTitle(title) { }
    onBackPressed() {
        this.cancel();
    }
    onContentChanged() { }
    onAttachedToWindow() { }
    onDetachedFromWindow() { }
    cancel() { }
    querySelector(selector) {
        const elm = this.elm.querySelector(`.alert-dialog .message ${selector}`);
        if (elm == null) {
            throw new element_not_found_exception_1.default();
        }
        return elm;
    }
}
exports.default = Dialog;
