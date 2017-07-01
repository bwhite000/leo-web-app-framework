export default class ElementNotFoundException extends Error {
    message: string;
    constructor(selector?: string);
    toString(): string;
}
