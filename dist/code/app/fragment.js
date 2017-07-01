"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const element_not_found_exception_1 = require("../core/element_not_found_exception");
class Fragment {
    constructor() {
        this.isAdded = false;
        this.isAttached = false;
    }
    getActivity() {
        return this.activity;
    }
    getContext() {
        return this.context;
    }
    onAttach(context) {
        this.context = context;
    }
    onCreate() { }
    onCreateView() {
        return null;
    }
    onActivityCreated() { }
    onStart() { }
    onResume() { }
    onPause() { }
    onStop() { }
    onDestroyView() { }
    onDestroy() { }
    onDetach() { }
    setView(elm) {
        this.elm = elm;
    }
    querySelector(selector) {
        const elm = this.elm.querySelector(selector);
        if (elm == null) {
            throw new element_not_found_exception_1.default();
        }
        return elm;
    }
}
exports.default = Fragment;
