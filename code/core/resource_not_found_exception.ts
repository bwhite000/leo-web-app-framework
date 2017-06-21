export default class ResourceNotFoundException extends Error {
    message: string = "The resource was not found";

    constructor(resName?: string) {
        super();

        if (resName != null) {
            this.message = `The "${resName}" resource was not found`;
        }
    }

    toString() {
        return `${ResourceNotFoundException.name}: ${this.message}`;
    }
}
