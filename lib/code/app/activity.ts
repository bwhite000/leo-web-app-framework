import ActionBar from "./action_bar";
import Context from "./context"
import ElementNotFoundException from "../core/element_not_found_exception"
import Fragment from "./fragment"
import FragmentManager from "./fragment_manager"
import InvalidArgumentTypeException from "../core/invalid_argument_type_exception"

export class Activity extends Context {
    onCreate(): void {}

    onStart(): void {}

    onResume(): void {}

    onPause(): void {}

    onRestart(): void {}

    onStop(): void {}

    onDestroy(): void {}

    onRestoreInstanceState(): void {}

    onSaveInstanceState(): void {}
}

export default class BaseActivity extends Activity {
    private _actionBar: ActionBar = new ActionBar();
    private _rootElm: HTMLElement;
    private currentContentView: Fragment;
    private fragmentManager = new FragmentManager();
    private elms = {
        // Add the current context as the "this" value.
        "querySelector": this.querySelector.bind(this),
        get main() {
            return this.querySelector("main");
        },
        get content() {
            return this.querySelector("#content");
        }
    };

    constructor() {
        super();

        const rootElm = <HTMLElement|null>document.querySelector("#viewport");
        if (rootElm == null) { throw new ElementNotFoundException("#viewport") }
        else { this._rootElm = rootElm }

        this.fragmentManager.activity = <BaseActivity>this;
        this.fragmentManager.context = <BaseActivity>this;

        setTimeout(() => this.onCreate(), 0);
    }

    onMenuItemSelected(): void {}

    onOptionsItemSelected(): void {}

    findViewById(id: string): HTMLElement {
        const elm = <HTMLElement|null>this._rootElm.querySelector(`[data-id="@+id/${id}"]`);
        if (elm == null) { throw new ElementNotFoundException(`[data-id="@+id/${id}"]`) }

        return elm;
    }

    querySelector(selector: string): HTMLElement {
        const elm = <HTMLElement|null>this._rootElm.querySelector(selector);
        if (elm == null) { throw new ElementNotFoundException(selector) }

        return elm;
    }

    setContentView(template: Document|HTMLTemplateElement|Fragment): void {
        if (template instanceof Fragment) {
            this.currentContentView = template;

            this.currentContentView.onAttach(<BaseActivity>this);
            this.currentContentView.onCreate();
            const fragElm = this.currentContentView.onCreateView();

            this.elms.content.appendChild(fragElm);
        } else if (template instanceof HTMLTemplateElement) {
            this.elms.content.appendChild(template.content);
        } else if (template instanceof Document) {
            const defaultTemplate = <HTMLTemplateElement|null>template.querySelector("template");
            if (defaultTemplate == null) { throw new ElementNotFoundException() }

            const defaultContentClone = <DocumentFragment>defaultTemplate.content.cloneNode(true);

            this.elms.main.appendChild(defaultContentClone);
        } else {
            throw new InvalidArgumentTypeException();
        }
    }

    getActionBar(): ActionBar {
        return this._actionBar;
    }

    getFragmentManager(): FragmentManager {
        return this.fragmentManager;
    }
}
