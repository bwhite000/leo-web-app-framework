"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvalidArgumentTypeException extends Error {
    constructor() {
        super();
        this.message = "The supplied argument was not the expected type.";
    }
    toString() {
        return `${InvalidArgumentTypeException.name}: ${this.message}`;
    }
}
exports.default = InvalidArgumentTypeException;
