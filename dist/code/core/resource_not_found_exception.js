"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResourceNotFoundException extends Error {
    constructor(resName) {
        super();
        this.message = "The resource was not found";
        if (resName != null) {
            this.message = `The "${resName}" resource was not found`;
        }
    }
    toString() {
        return `${ResourceNotFoundException.name}: ${this.message}`;
    }
}
exports.default = ResourceNotFoundException;
