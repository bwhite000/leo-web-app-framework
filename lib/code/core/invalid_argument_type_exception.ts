export default class InvalidArgumentTypeException extends Error {
    message: string = "The supplied argument was not the expected type.";

    constructor() {
        super();
    }

    toString() {
        return `${InvalidArgumentTypeException.name}: ${this.message}`;
    }
}
