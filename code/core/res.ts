import InvalidArgumentTypeException from "framework/code/core/invalid_argument_type_exception";
import ResourceNotFoundException from "framework/code/core/resource_not_found_exception";

interface Json {
    [x: string]: any
}

const Utils = {
    "_cachedResources": null,
    "doesResourceElementExist" : (document.querySelector("[data-id='resources']") != null),
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

        const resourcesElm = <HTMLTemplateElement|null>document.querySelector("[data-id='resources']");
        if (resourcesElm == null) { throw new ResourceNotFoundException() }

        const resources = resourcesElm.content;
        this._cachedResources = resources;

        return resources;
    }
};

const drawableRes: {[x: string]: any} = {};

export interface MenuJson {
    items: ItemJson[]
}
interface ItemJson {
    id: string
    icon: string
    title: string
}
const menuRes: {[x: string]: any} = {
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

const Res = {
    drawable: new Proxy(drawableRes, {
        get(_, name: PropertyKey) {
            if (Utils.doesResourceElementExist == true) {
                const resource = Utils.resources.querySelector(`drawable[data-name='${name}']`);
                if (resource == null) { throw new ResourceNotFoundException() }

                return <SVGElement>resource.firstElementChild.cloneNode(true);
            }

            throw new ResourceNotFoundException();
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
