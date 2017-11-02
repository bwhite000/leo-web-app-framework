"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const element_not_found_exception_1 = require("../core/element_not_found_exception");
const res_1 = require("../core/res");
const resource_not_found_exception_1 = require("../core/resource_not_found_exception");
const stream_1 = require("../core/stream");
class ActionBar {
    constructor() {
        this._onMenuItemSelectedStreamController = new stream_1.StreamController();
        this._onMenuItemSelected = this._onMenuItemSelected.bind(this);
    }
    get onMenuItemSelected() {
        return this._onMenuItemSelectedStreamController.stream;
    }
    async setOptionsMenu(menuJson) {
        if (menuJson instanceof Promise) {
            menuJson = await menuJson;
        }
        this.clearMenuItems();
        for (const item of menuJson.items) {
            const iconName = item.icon.replace(/^@drawable\//, "");
            const iconElm = res_1.default.getResourceById(res_1.default.id[iconName]);
            iconElm.title = item.title;
            iconElm.dataset.id = item.id;
            this._addMenuItem(iconElm);
        }
    }
    setHomeButton(elm) {
        const homeBtnElm = document.querySelector("[data-view='action-bar'] .home_button");
        if (homeBtnElm == null) {
            throw new element_not_found_exception_1.default();
        }
        homeBtnElm.appendChild(elm);
    }
    setTitle(title) {
        const actionBarTitleElm = document.querySelector("[data-view='action-bar'] .title");
        if (actionBarTitleElm == null) {
            throw new element_not_found_exception_1.default();
        }
        actionBarTitleElm.innerHTML = "";
        if (typeof title == "string") {
            actionBarTitleElm.textContent = title;
        }
        else if (title instanceof Node) {
            actionBarTitleElm.appendChild(title);
        }
    }
    clearTitle() {
        const actionBarTitleElm = document.querySelector("[data-view='action-bar'] .title");
        if (actionBarTitleElm == null) {
            throw new element_not_found_exception_1.default();
        }
        actionBarTitleElm.innerHTML = "";
    }
    clearMenuItems() {
        const actionBarMenuElms = document.querySelectorAll("header[data-view='action-bar'] .menu_items .menu_item");
        for (const elm of actionBarMenuElms) {
            elm.removeEventListener("click", this._onMenuItemSelected);
            elm.remove();
        }
    }
    _addMenuItem(iconElm) {
        const actionBarElm = document.querySelector("header[data-view='action-bar'] .menu_items");
        if (actionBarElm == null) {
            throw new resource_not_found_exception_1.default();
        }
        const container = document.createElement("div");
        container.classList.add("menu_item");
        container.addEventListener("click", this._onMenuItemSelected);
        container.appendChild(iconElm);
        actionBarElm.appendChild(container);
    }
    _onMenuItemSelected(evt) {
        const menuItemElm = evt.currentTarget;
        const dataID = menuItemElm.querySelector("[data-id]").dataset.id.replace(/^@\+id\//, "");
        const resId = res_1.default.id[dataID];
        if (dataID != null) {
            this._onMenuItemSelectedStreamController.add(resId);
        }
    }
}
exports.default = ActionBar;
