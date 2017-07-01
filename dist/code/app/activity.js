"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const action_bar_1 = require("./action_bar");
const context_1 = require("./context");
const element_not_found_exception_1 = require("../core/element_not_found_exception");
const fragment_1 = require("./fragment");
const fragment_manager_1 = require("./fragment_manager");
const invalid_argument_type_exception_1 = require("../core/invalid_argument_type_exception");
class Activity extends context_1.default {
    onCreate() { }
    onStart() { }
    onResume() { }
    onPause() { }
    onRestart() { }
    onStop() { }
    onDestroy() { }
    onRestoreInstanceState() { }
    onSaveInstanceState() { }
}
exports.Activity = Activity;
class BaseActivity extends Activity {
    constructor() {
        super();
        this._actionBar = new action_bar_1.default();
        this.fragmentManager = new fragment_manager_1.default();
        this.elms = {
            "querySelector": this.querySelector.bind(this),
            get main() {
                return this.querySelector("main");
            },
            get content() {
                return this.querySelector("#content");
            }
        };
        const rootElm = document.querySelector("#viewport");
        if (rootElm == null) {
            throw new element_not_found_exception_1.default("#viewport");
        }
        else {
            this._rootElm = rootElm;
        }
        this.fragmentManager.activity = this;
        this.fragmentManager.context = this;
        setTimeout(() => this.onCreate(), 0);
    }
    onMenuItemSelected() { }
    onOptionsItemSelected() { }
    findViewById(id) {
        const elm = this._rootElm.querySelector(`[data-id="@+id/${id}"]`);
        if (elm == null) {
            throw new element_not_found_exception_1.default(`[data-id="@+id/${id}"]`);
        }
        return elm;
    }
    querySelector(selector) {
        const elm = this._rootElm.querySelector(selector);
        if (elm == null) {
            throw new element_not_found_exception_1.default(selector);
        }
        return elm;
    }
    setContentView(template) {
        if (template instanceof fragment_1.default) {
            this.currentContentView = template;
            this.currentContentView.onAttach(this);
            this.currentContentView.onCreate();
            const fragElm = this.currentContentView.onCreateView();
            this.elms.content.appendChild(fragElm);
        }
        else if (template instanceof HTMLTemplateElement) {
            this.elms.content.appendChild(template.content);
        }
        else if (template instanceof Document) {
            const defaultTemplate = template.querySelector("template");
            if (defaultTemplate == null) {
                throw new element_not_found_exception_1.default();
            }
            const defaultContentClone = defaultTemplate.content.cloneNode(true);
            this.elms.main.appendChild(defaultContentClone);
        }
        else {
            throw new invalid_argument_type_exception_1.default();
        }
    }
    getActionBar() {
        return this._actionBar;
    }
    getFragmentManager() {
        return this.fragmentManager;
    }
}
exports.default = BaseActivity;
