"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FragmentNotFoundException extends Error {
    constructor() {
        super(...arguments);
        this.message = "Unable to locate the specified fragment.";
    }
    toString() {
        return `${FragmentNotFoundException.name}: ${this.message}`;
    }
}
exports.default = FragmentNotFoundException;
