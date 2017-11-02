import ElementNotFoundException from "../core/element_not_found_exception"
import Res from "../core/res"
import { MenuJson } from "../core/res"
import ResourceNotFoundException from "../core/resource_not_found_exception"
import { StreamController, Stream } from "../core/stream"

export default class ActionBar {
    private _onMenuItemSelectedStreamController: StreamController<string> = new StreamController();
/*
    static readonly Tab = class Tab {
        constructor() {}
    };*/

    constructor() {
        // Bind, then reassign to allow the event listener to have the correct "this" value.
        this._onMenuItemSelected = this._onMenuItemSelected.bind(this);
    }

    get onMenuItemSelected(): Stream<string> {
        return this._onMenuItemSelectedStreamController.stream;
    }

    //addTab(tab: ActionBar.Tab) {}

    async setOptionsMenu(menuJson: MenuJson|Promise<MenuJson>): Promise<void> {
        if (menuJson instanceof Promise) {
            menuJson = await menuJson;
        }

        // Remove any previously set menu items to be replaced by this new config.
        this.clearMenuItems();

        // Loop through the developer defined menu items.
        for (const item of menuJson.items) {
            const iconName = item.icon.replace(/^@drawable\//, "");
            const iconElm = <HTMLElement>Res.getResourceById(Res.id[iconName]);

            iconElm.title = item.title;
            iconElm.dataset.id = item.id;

            this._addMenuItem(iconElm);
        }
    }

    setHomeButton(elm: Node): void {
        const homeBtnElm = <HTMLElement|null>document.querySelector("[data-view='action-bar'] .home_button");
        if (homeBtnElm == null) { throw new ElementNotFoundException() }

        homeBtnElm.appendChild(elm);
    }

    setTitle(title: Node|string) {
        const actionBarTitleElm = <HTMLElement|null>document.querySelector("[data-view='action-bar'] .title");
        if (actionBarTitleElm == null) { throw new ElementNotFoundException() }

        // Clear any previous value.
        actionBarTitleElm.innerHTML = "";

        if (typeof title == "string") {
            actionBarTitleElm.textContent = title;
        } else if (title instanceof Node) {
            actionBarTitleElm.appendChild(title);
        }
    }

    clearTitle() {
        const actionBarTitleElm = <HTMLElement|null>document.querySelector("[data-view='action-bar'] .title");
        if (actionBarTitleElm == null) { throw new ElementNotFoundException() }

        // Clear any previous value.
        actionBarTitleElm.innerHTML = "";
    }

    clearMenuItems(): void {
        const actionBarMenuElms = <NodeListOf<HTMLDivElement>>document.querySelectorAll("header[data-view='action-bar'] .menu_items .menu_item");

        for (const elm of actionBarMenuElms) {
            elm.removeEventListener("click", this._onMenuItemSelected);
            elm.remove();
        }
    }

    private _addMenuItem(iconElm: HTMLElement|SVGElement|HTMLImageElement): void {
        const actionBarElm = <HTMLDivElement|null>document.querySelector("header[data-view='action-bar'] .menu_items");
        if (actionBarElm == null) { throw new ResourceNotFoundException() }

        const container = document.createElement("div");
        container.classList.add("menu_item");

        container.addEventListener("click", this._onMenuItemSelected);

        container.appendChild(iconElm);

        actionBarElm.appendChild(container);
    }

    private _onMenuItemSelected(evt: MouseEvent): void {
        const menuItemElm = <HTMLElement>evt.currentTarget;
        const dataID = menuItemElm.querySelector("[data-id]").dataset.id.replace(/^@\+id\//, "");
        const resId = Res.id[dataID];

        if (dataID != null) {
            (<ActionBar>this)._onMenuItemSelectedStreamController.add(resId);
        }
    }
}
