import ElementNotFoundException from "./element_not_found_exception"
import InvalidArgumentTypeException from "./invalid_argument_type_exception"
import ResourceNotFoundException from "./resource_not_found_exception"

interface Json {
    [x: string]: any
}

const Utils = {
    "_cachedResources": null,
    "doesResourceElementExist" : (document.querySelector("template[data-view='resources']") != null),
    getTemplateByName(name: string): Document {
        const templateElm = <HTMLLinkElement|null>document.querySelector(`[id="${name}"]`);
        if (templateElm == null) { throw new ResourceNotFoundException(`Res.layout.${name}`); }

        const doc = <Document|undefined>templateElm.import;
        if (doc == null) { throw new ResourceNotFoundException(`Res.layout.${name}`); }

        return doc;
    },
    get resources() {
        if (this._cachedResources != null) {
            return this._cachedResources;
        }

        const resourcesElm = <HTMLTemplateElement|null>document.querySelector("template[data-view='resources']");
        if (resourcesElm == null) { throw new ResourceNotFoundException() }

        const resources = resourcesElm.content;
        this._cachedResources = resources;

        return resources;
    }
};

const drawableRes: {ids: Map<string, string>, elms: Map<string, (SVGElement|HTMLImageElement)>, [x: string]: string} = {
    "ids": new Map<string, string>(),
    "elms": new Map<string, (SVGElement|HTMLImageElement)>(),
    _indexResources() {
        const drawables = <NodeListOf<HTMLElement>>Utils.resources.querySelectorAll("drawable");

        // Loop through all of the drawable Elements.
        for (const elm of drawables) {
            // Res.drawable.<name>
            const name = elm.dataset.name;

            // Check that the name value is not empty.
            if (name != null && name != "") {
                const targetElm = <SVGElement|HTMLImageElement>elm.firstElementChild;

                // Check that the resource is of an acceptable type.
                if (targetElm instanceof SVGElement || targetElm instanceof HTMLImageElement) {
                    drawableRes.elms.set(name, targetElm);
                }
            }
        }
    }
};

export interface MenuJson {
    items: ItemJson[]
}
interface ItemJson {
    id: string
    icon: string
    title: string
}
const menuRes: {ids: Map<string, string>, [x: string]: any} = {
    "ids": new Map<string, string>(),
    converHtmlToJson(menuElm: HTMLElement): MenuJson {
        const json = <MenuJson>{
            "items": <ItemJson[]>[]
        };

        for (const itemElm of <NodeListOf<HTMLElement>>menuElm.querySelectorAll("item")) {
            const itemJson = <ItemJson>{
                "id": itemElm.dataset.id,
                "icon": itemElm.dataset.icon,
                "title": itemElm.dataset.title
            };

            json.items.push(itemJson);
        }

        return json;
    }
};

interface ResInterface {
    ids: Set<string>
    elms: Map<string, HTMLElement>
    getResourceById(id: string): HTMLElement
    _indexResources(): void,
    id: {[x: string]: string}
    drawable: any
    layout: any
    menu: {[x: string]: MenuJson}
}

const Res: ResInterface = {
    "ids": new Set<string>(),
    "elms": new Map<string, HTMLElement>(),
    getResourceById(id: string): HTMLElement {
        return <HTMLElement>Res.elms.get(id).cloneNode(true);
    },
    _indexResources(): void {
        const resourcesElm = <HTMLTemplateElement|null>document.querySelector("template[data-view='resources']");
        if (resourcesElm == null) { throw new ElementNotFoundException() }

        const templateContent = resourcesElm.content;
        const idElms = <NodeListOf<HTMLElement>>templateContent.querySelectorAll("[data-id]");

        // Loop through the drawables and assign IDs to their names.
        for (let elm of idElms) {
            let id = elm.dataset.id;

            if (elm.nodeName == "DRAWABLE") {
                elm = <HTMLElement>elm.querySelector("*");
            }

            if (id != null || id != "") {
                // Remove the ID prefix, if present.
                if (id.startsWith("@+id/")) {
                    id = id.replace(/^@\+id\//, "");
                }

                // const randomID = `${Math.floor(Math.random() * 10000)}-${window.performance.now()}`;
                // elm.dataset.resourceId = randomID;
                Res.ids.add(id);
                Res.elms.set(id, elm);
            }
        }
    },
    id: new Proxy({}, {
        get(_, name: PropertyKey) {
            const nameStr = `${name}`;

            const elm = document.querySelector(`[data-id="@+id/${nameStr}"]`);

            // Check if this resource has been indexed, if so, return the key as
            // the Element's ID.
            if (elm != null || Res.ids.has(nameStr)) {
                return nameStr;
            }

            throw new ResourceNotFoundException(`R.id.${nameStr}`);
        }
    }),
    drawable: new Proxy(drawableRes, {
        get(target, name: PropertyKey) {
            const nameStr = `${name}`;

            if (drawableRes.elms.has(nameStr)) {
                return drawableRes.elms.get(nameStr);
            }

            throw new ResourceNotFoundException(`Res.drawables.${nameStr}`);
        }
    }),
    layout: new Proxy(<{[x: string]: Document}>{}, {
        get(_, name: PropertyKey): Document {
            if (typeof name == "string") {
                return Utils.getTemplateByName(name);
            }

            throw new InvalidArgumentTypeException();
        }
    }),
    menu: new Proxy(menuRes, {
        get(target, name: PropertyKey): Promise<MenuJson> {
            return new Promise((resolve, reject) => {
                const fetchRes = () => {
                    fetch(`/resources/menu/${name}.json`)
                        .then(response => response.json())
                        .then((json: MenuJson) => resolve(json))
                        .catch(err => reject(err));
                };

                if (Utils.doesResourceElementExist == true) {
                    const resource = Utils.resources.querySelector(`menu[data-name='${name}']`);
                    if (resource != null) {
                        const json: MenuJson = target.converHtmlToJson(resource);

                        resolve(json);
                    } else {
                        fetchRes();
                    }
                } else {
                    fetchRes();
                }
            });
        }
    })
};

export default Res;
