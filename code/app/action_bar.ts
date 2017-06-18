import Res from "framework/code/core/res"
import { MenuJson } from "framework/code/core/res"
import ResourceNotFoundException from "framework/code/core/resource_not_found_exception"
import { StreamController, Stream } from "framework/code/core/stream"

export default class ActionBar {
    private _onMenuItemSelectedStreamController: StreamController<string> = new StreamController();

    constructor() {
        // Allow the event listener to have the correct "this" value.
        this._onMenuItemSelected = this._onMenuItemSelected.bind(this);
    }

    static Tab = class Tab {
        constructor() {}
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
            const iconName = item.icon.replace("@drawable/", "");
            const iconElm = Res.drawable[iconName];

            iconElm.dataset.id = item.id;

            iconElm.addEventListener("click", this._onMenuItemSelected);

            this._addMenuItem(iconElm);
        }
    }

    setHomeButton(): void {}

    private _addMenuItem(iconElm: HTMLElement): void {
        const actionBarElm = <HTMLDivElement|null>document.querySelector("header[data-view='action-bar']");
        if (actionBarElm == null) { throw new ResourceNotFoundException() }

        actionBarElm.appendChild(iconElm);
    }

    private _onMenuItemSelected(evt: MouseEvent): void {
        const elm = <HTMLElement>evt.currentTarget;
        const dataID = elm.dataset.id;

        if (dataID != null) {
            (<ActionBar>this)._onMenuItemSelectedStreamController.add(dataID);
        }
    }
}
