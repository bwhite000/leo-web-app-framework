"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resources_1 = require("../content/res/resources");
class Context {
    constructor() {
        this.resources = new resources_1.default();
    }
    getResources() {
        return this.resources;
    }
    getString(id) {
        return this.resources.getString(id);
    }
}
exports.default = Context;
