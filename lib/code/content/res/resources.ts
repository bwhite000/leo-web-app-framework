export default class Resources {
    private resourcesTemplateElm: HTMLTemplateElement;
    /** This exception is thrown by the resource APIs when a requested resource can not be found. */
    private static readonly NotFoundException = class NotFoundException {
        message = "The requested resource could not be found.";

        toString() {
            return `${Resources.NotFoundException.name}: ${this.message}`;
        }
    }

    constructor() {
        const resourcesTemplateElm = <HTMLTemplateElement|null>document.querySelector("template[data-view='resources']");
        if (resourcesTemplateElm == null) { throw new Resources.NotFoundException() }

        this.resourcesTemplateElm = resourcesTemplateElm;
    }

    getString(id: string): string {
        const stringElm = <HTMLElement|null>this.resourcesTemplateElm.querySelector(`string[name="${id}"]`);
        Resources.assertElmExists(stringElm);

        return stringElm.textContent;
    }

    private static assertElmExists(elm: HTMLElement|null) {
        if (elm == null) { throw new Resources.NotFoundException() }
    }
}
