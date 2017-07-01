export default class ResourceNotFoundException extends Error {
    message: string;
    constructor(resName?: string);
    toString(): string;
}
