export default class FragmentNotFoundException extends Error {
    message: string = "Unable to locate the specified fragment.";

    toString() {
        return `${FragmentNotFoundException.name}: ${this.message}`;
    }
}
