"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const element_not_found_exception_1 = require("./element_not_found_exception");
const invalid_argument_type_exception_1 = require("./invalid_argument_type_exception");
const resource_not_found_exception_1 = require("./resource_not_found_exception");
const Utils = {
    "_cachedResources": null,
    "doesResourceElementExist": (document.querySelector("template[data-view='resources']") != null),
    getLayoutTemplateByName(name) {
        const templateElm = document.querySelector(`link[rel="import"][id="${name}"], link[rel="import"][href$="/layout/${name}.html"]`);
        if (templateElm == null) {
            throw new resource_not_found_exception_1.default(`Res.layout.${name}`);
        }
        const doc = templateElm.import;
        if (doc == null) {
            throw new resource_not_found_exception_1.default(`Res.layout.${name}`);
        }
        return doc;
    },
    get resources() {
        if (this._cachedResources != null) {
            return this._cachedResources;
        }
        const resourcesElm = document.querySelector("template[data-view='resources']");
        if (resourcesElm == null) {
            throw new resource_not_found_exception_1.default();
        }
        const resources = resourcesElm.content;
        this._cachedResources = resources;
        return resources;
    }
};
const drawableRes = {
    "ids": new Map(),
    "elms": new Map(),
    _indexResources() {
        const drawables = Utils.resources.querySelectorAll("drawable");
        for (const elm of drawables) {
            const name = elm.dataset.name;
            if (name != null && name != "") {
                const targetElm = elm.firstElementChild;
                if (targetElm instanceof SVGElement || targetElm instanceof HTMLImageElement) {
                    drawableRes.elms.set(name, targetElm);
                }
            }
        }
    }
};
const menuRes = {
    "ids": new Map(),
    converHtmlToJson(menuElm) {
        const json = {
            "items": []
        };
        for (const itemElm of menuElm.querySelectorAll("item")) {
            const itemJson = {
                "id": itemElm.dataset.id,
                "icon": itemElm.dataset.icon,
                "title": itemElm.dataset.title
            };
            json.items.push(itemJson);
        }
        return json;
    }
};
const Res = {
    "ids": new Set(),
    "elms": new Map(),
    getResourceById(id) {
        return Res.elms.get(id).cloneNode(true);
    },
    getString(id) {
        const stringElm = Utils.resources.querySelector(`string[name="${id}"]`);
        if (stringElm == null) {
            throw new resource_not_found_exception_1.default();
        }
        return stringElm.textContent;
    },
    _indexResources() {
        const resourcesElm = document.querySelector("template[data-view='resources']");
        if (resourcesElm == null) {
            throw new element_not_found_exception_1.default();
        }
        const templateContent = resourcesElm.content;
        const idElms = templateContent.querySelectorAll("[data-id]");
        for (let elm of idElms) {
            let id = elm.dataset.id;
            if (elm.nodeName == "DRAWABLE") {
                elm = elm.querySelector("*");
            }
            if (id != null || id != "") {
                if (id.startsWith("@+id/")) {
                    id = id.replace(/^@\+id\//, "");
                }
                Res.ids.add(id);
                Res.elms.set(id, elm);
            }
        }
    },
    id: new Proxy({}, {
        get(_, name) {
            const nameStr = `${name}`;
            const elm = document.querySelector(`[data-id="@+id/${nameStr}"]`);
            if (elm != null || Res.ids.has(nameStr)) {
                return nameStr;
            }
            throw new resource_not_found_exception_1.default(`R.id.${nameStr}`);
        }
    }),
    drawable: new Proxy(drawableRes, {
        get(target, name) {
            const nameStr = `${name}`;
            if (drawableRes.elms.has(nameStr)) {
                return drawableRes.elms.get(nameStr);
            }
            throw new resource_not_found_exception_1.default(`Res.drawables.${nameStr}`);
        }
    }),
    layout: new Proxy({}, {
        get(_, name) {
            if (typeof name == "string") {
                const doc = Utils.getLayoutTemplateByName(name);
                const optDefaultTemplates = doc.querySelectorAll("template[data-default], template");
                if (optDefaultTemplates.length == 1) {
                    return optDefaultTemplates[0].content.cloneNode(true);
                }
                else {
                    return doc;
                }
            }
            throw new invalid_argument_type_exception_1.default();
        }
    }),
    menu: new Proxy(menuRes, {
        get(target, name) {
            return new Promise((resolve, reject) => {
                const fetchRes = () => {
                    fetch(`/resources/menu/${name}.json`)
                        .then(response => response.json())
                        .then((json) => resolve(json))
                        .catch(err => reject(err));
                };
                if (Utils.doesResourceElementExist == true) {
                    const resource = Utils.resources.querySelector(`menu[data-name='${name}']`);
                    if (resource != null) {
                        const json = target.converHtmlToJson(resource);
                        resolve(json);
                    }
                    else {
                        fetchRes();
                    }
                }
                else {
                    fetchRes();
                }
            });
        }
    }),
    string: new Proxy({}, {
        get(_, name) {
            return `${name}`;
        }
    })
};
exports.default = Res;
