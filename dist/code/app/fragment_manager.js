"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const element_not_found_exception_1 = require("../core/element_not_found_exception");
const fragment_not_found_exception_1 = require("../core/fragment_not_found_exception");
class FragmentManager {
    constructor() {
        this.fragments = new Map();
    }
    add(containerID, fragment) {
        this.fragments.set(fragment.constructor.name, fragment);
        const fragmentContainer = document.querySelector(`[data-id="@+id/${containerID}"]`);
        if (fragmentContainer == null) {
            throw new element_not_found_exception_1.default(`[data-id="@+id/${containerID}"]`);
        }
        fragment.activity = this.activity;
        fragment.context = this.context;
        fragment.isAdded = true;
        this.attach(fragment);
        fragment.onCreate();
        const fragView = fragment.onCreateView();
        if (fragView != null) {
            fragmentContainer.appendChild(fragView);
            fragment.setView(fragView);
        }
        fragment.onStart();
        fragment.onResume();
    }
    attach(fragment) {
        fragment.isAttached = true;
        fragment.onAttach(this.context);
    }
    detach(fragment) {
        fragment.isAttached = false;
        fragment.onDetach();
    }
    remove(containerID, fragment) {
        const fragmentClassName = fragment.constructor.name;
        if (this.fragments.has(fragmentClassName) == false) {
            throw new fragment_not_found_exception_1.default();
        }
        fragment.isAdded = false;
        fragment.onPause();
        this.detach(fragment);
        fragment.onStop();
        fragment.onDestroyView();
        fragment.onDestroy();
        const fragmentContainer = document.querySelector(`[data-id="@+id/${containerID}"]`);
        if (fragmentContainer == null) {
            throw new element_not_found_exception_1.default(`[data-id="@+id/${containerID}"]`);
        }
        fragmentContainer.innerHTML = "";
    }
}
exports.default = FragmentManager;
