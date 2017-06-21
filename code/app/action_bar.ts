import Res from "../core/res"
import { MenuJson } from "../core/res"
import ResourceNotFoundException from "../core/resource_not_found_exception"
import { StreamController, Stream } from "../core/stream"

export default class ActionBar {
    private _onMenuItemSelectedStreamController: StreamController<string> = new StreamController();

    static Tab = class {
        constructor() {}
    };

    constructor() {
        // Allow the event listener to have the correct "this" value.
        this._onMenuItemSelected = this._onMenuItemSelected.bind(this);
    }

    get onMenuItemSelected(): Stream<string> {
        return this._onMenuItemSelectedStreamController.stream;
    }

    addTab(tab: ActionBar.Tab) {}

    async setOptionsMenu(menuJson: MenuJson|Promise<MenuJson>): Promise<void> {
        if (menuJson instanceof Promise) {
            menuJson = await menuJson;
        }

        // Loop through the developer defined menu items.
        for (const item of menuJson.items) {
            const iconName = item.icon.replace(/^@drawable\//, "");
            const iconElm = Res.getResourceById(Res.id[iconName]);

            iconElm.title = item.title;
            iconElm.dataset.id = item.id;

            iconElm.addEventListener("click", this._onMenuItemSelected);

            this._addMenuItem(iconElm);
        }
    }

    setHomeButton(elm: Node): void {
        document.querySelector("[data-view='action-bar'] .home_button").appendChild(elm);
    }

    private _addMenuItem(iconElm: SVGElement|HTMLImageElement): void {
        const actionBarElm = <HTMLDivElement|null>document.querySelector("header[data-view='action-bar'] .menu_items");
        if (actionBarElm == null) { throw new ResourceNotFoundException() }

        const container = document.createElement("div");
        container.classList.add("menu_item");
        container.appendChild(iconElm);

        actionBarElm.appendChild(container);
    }

    private _onMenuItemSelected(evt: MouseEvent): void {
        const elm = <HTMLElement>evt.currentTarget;
        const dataID = elm.dataset.id;
        const resId = Res.id[dataID];

        if (dataID != null) {
            (<ActionBar>this)._onMenuItemSelectedStreamController.add(resId);
        }
    }
}
