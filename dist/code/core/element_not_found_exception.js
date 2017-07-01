"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ElementNotFoundException extends Error {
    constructor(selector) {
        super();
        this.message = "The Element was not found";
        if (selector != null) {
            this.message += `: "${selector}"`;
        }
    }
    toString() {
        return `${ElementNotFoundException.name}: ${this.message}`;
    }
}
exports.default = ElementNotFoundException;
