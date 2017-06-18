export class ElementNotFoundException extends Error {
    message: string = "The Element was not found";

    constructor(selector?: string) {
        super();

        if (selector != null) {
            this.message += `: "${selector}"`;
        }
    }

    toString() {
        return `${ElementNotFoundException.name}: ${this.message}`;
    }
}
