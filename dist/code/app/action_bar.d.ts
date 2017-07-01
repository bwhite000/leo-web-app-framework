import { MenuJson } from "../core/res";
import { Stream } from "../core/stream";
export default class ActionBar {
    private _onMenuItemSelectedStreamController;
    constructor();
    readonly onMenuItemSelected: Stream<string>;
    setOptionsMenu(menuJson: MenuJson | Promise<MenuJson>): Promise<void>;
    setHomeButton(elm: Node): void;
    setTitle(title: Node | string): void;
    clearTitle(): void;
    clearMenuItems(): void;
    private _addMenuItem(iconElm);
    private _onMenuItemSelected(evt);
}
