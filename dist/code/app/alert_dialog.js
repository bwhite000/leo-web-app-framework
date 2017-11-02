"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dialog_1 = require("./dialog");
const index_1 = require("../../index");
class Builder {
    constructor(context) {
        this.context = context;
        this.alertDialog = new AlertDialog(context);
    }
    get onCancel() {
        return this.alertDialog.onCancel;
    }
    get onDismiss() {
        return this.alertDialog.onDismiss;
    }
    setTitle(title) {
        this.alertDialog.setTitle(title);
        return this;
    }
    setCustomTitle(view) {
        this.alertDialog.setCustomTitle(view);
        return this;
    }
    setMessage(message) {
        this.setView(document.createTextNode(message));
        return this;
    }
    setPositiveButton(text, eventListener) {
        this.alertDialog.setButton(1, text, eventListener);
        const positiveBtnElm = this.alertDialog.elm.querySelector("ul.buttons-container > li:last-child");
        if (positiveBtnElm != null) {
            positiveBtnElm.classList.add("raised");
        }
        return this;
    }
    setNegativeButton(text, eventListener) {
        this.alertDialog.setButton(0, text, eventListener);
        return this;
    }
    setNeutralButton(text, eventListener) {
        this.alertDialog.setButton(0, text, eventListener);
        return this;
    }
    setView(view) {
        this.alertDialog.setView(view);
        return this;
    }
    create() {
        this.alertDialog.create();
        return this.alertDialog;
    }
    show() {
        this.alertDialog.create();
        this.alertDialog.show();
        return this.alertDialog;
    }
}
exports.Builder = Builder;
class AlertDialog extends dialog_1.default {
    constructor(context) {
        super(context);
        this.elmFrag = index_1.Res.layout.framework_AlertDialog;
        const alertDialogContainer = this.elmFrag.querySelector(".alert-dialog-container");
        if (alertDialogContainer == null) {
            throw new index_1.ElementNotFoundException();
        }
        this.elm = alertDialogContainer;
    }
    get titleElm() {
        const elm = this.elm.querySelector(".title");
        if (elm == null) {
            throw new index_1.ElementNotFoundException();
        }
        return elm;
    }
    get messageElm() {
        const elm = this.elm.querySelector(".message");
        if (elm == null) {
            throw new index_1.ElementNotFoundException();
        }
        return elm;
    }
    get buttonsContainerElm() {
        const elm = this.elm.querySelector("ul.buttons-container");
        if (elm == null) {
            throw new index_1.ElementNotFoundException();
        }
        return elm;
    }
    setTitle(title) {
        const titleElm = this.titleElm;
        titleElm.innerHTML = "";
        titleElm.textContent = title;
    }
    setCustomTitle(view) {
        const titleElm = this.titleElm;
        titleElm.innerHTML = "";
        titleElm.appendChild(view);
    }
    setView(view) {
        const messageElm = this.messageElm;
        messageElm.innerHTML = "";
        messageElm.appendChild(view);
    }
    setButton(buttonIndex, text, eventListener) {
        const buttonElm = document.createElement("li");
        buttonElm.textContent = text;
        buttonElm.addEventListener("click", (_) => {
            if (eventListener != null) {
                eventListener(this);
            }
            this.dismiss();
        });
        this.buttonsContainerElm.appendChild(buttonElm);
    }
    create() {
        super.create();
        this.isCreated = true;
    }
    show() {
        super.show();
        if (this.isShowing) {
            return;
        }
        if (this.isCreated == false) {
            this.create();
        }
        const alertDialogContainerElm = this.elmFrag.querySelector(".alert-dialog-container");
        if (alertDialogContainerElm == null) {
            throw new index_1.ElementNotFoundException();
        }
        const alertDialogElm = this.elm.querySelector(".alert-dialog");
        if (alertDialogElm == null) {
            throw new index_1.ElementNotFoundException();
        }
        alertDialogContainerElm.addEventListener("click", (evt) => {
            if (evt.target != alertDialogContainerElm) {
                evt.preventDefault();
                evt.stopPropagation();
            }
            else {
                this.dismiss();
            }
        });
        document.body.appendChild(this.elmFrag);
        const alertDialogWidth = alertDialogElm.clientWidth;
        alertDialogElm.style.left = `calc(50% - ${Math.floor(alertDialogWidth / 2)}px)`;
        setTimeout((() => {
            this.elm.classList.add("show");
            alertDialogElm.classList.add("show");
        }).bind(this), 0);
        this.isShowing = true;
    }
}
AlertDialog.Builder = Builder;
exports.default = AlertDialog;
