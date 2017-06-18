import ActionBar from "framework/code/app/action_bar";
import { ElementNotFoundException } from "framework/code/app/view"

export class Activity {}

export default class BaseActivity extends Activity {
    private _actionBar: ActionBar = new ActionBar();
    private _rootElm: HTMLElement;

    constructor() {
        super();

        const rootElm = <HTMLElement|null>document.querySelector("#viewport");
        if (rootElm == null) { throw new ElementNotFoundException() }
        else { this._rootElm = rootElm }

        setTimeout(() => this.onCreate(), 0);
    }

    private elms = {
        // Add the current context as the "this" value.
        "querySelector": this.querySelector.bind(this),
        get content() {
            return this.querySelector("#content");
        }
    };

    onCreate() {}

    onStart() {}

    onResume() {}

    onPause() {}

    onStop() {}

    onDestroy() {}

    onRestart() {}

    onMenuItemSelected() {}

    onOptionsItemSelected() {}

    querySelector(selector: string) {
        const elm = <HTMLElement|null>this._rootElm.querySelector(selector);
        if (elm == null) { throw new ElementNotFoundException(selector) }

        return elm;
    }

    setContentView(template: HTMLTemplateElement) {
        this.elms.content.appendChild(template.content);
    }

    getActionBar(): ActionBar {
        return this._actionBar;
    }
}
