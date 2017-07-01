"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Resources {
    constructor() {
        const resourcesTemplateElm = document.querySelector("template[data-view='resources']");
        if (resourcesTemplateElm == null) {
            throw new Resources.NotFoundException();
        }
        this.resourcesTemplateElm = resourcesTemplateElm;
    }
    getString(id) {
        const stringElm = this.resourcesTemplateElm.querySelector(`string[name="${id}"]`);
        Resources.assertElmExists(stringElm);
        return stringElm.textContent;
    }
    static assertElmExists(elm) {
        if (elm == null) {
            throw new Resources.NotFoundException();
        }
    }
}
Resources.NotFoundException = class NotFoundException {
    constructor() {
        this.message = "The requested resource could not be found.";
    }
    toString() {
        return `${Resources.NotFoundException.name}: ${this.message}`;
    }
};
exports.default = Resources;
