import ActionBar from "./action_bar";
import ElementNotFoundException from "../core/element_not_found_exception"
import Fragment from "./fragment"
import InvalidArgumentTypeException from "../core/invalid_argument_type_exception"

export class Activity {
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
    private currentFragment: Fragment;
    private fragmentManager= new FragmentManager();
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

    setContentView(template: Document|HTMLTemplateElement|Fragment) {
        if (template instanceof Fragment) {
            this.currentFragment = template;

            this.currentFragment.onAttach();
            this.currentFragment.onCreate();
            const fragElm = this.currentFragment.onCreateView();

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

class FragmentManager {
    fragments = new Map<string, Fragment>();

    /** Add a new fragment to a fragment container in this activity. */
    add(containerID: string, fragment: Fragment) {
        // Add this fragment to the index.
        this.fragments.set(fragment.constructor.name, fragment);

        // Get the container for appending the fragment's Element into.
        const fragmentContainer = <HTMLElement|null>document.querySelector(`[data-id="@+id/${containerID}"]`);
        if (fragmentContainer == null) { throw new ElementNotFoundException(`[data-id="@+id/${containerID}"]`) }

        // Fire the initial events for the fragment.
        fragment.onAttach();
        fragment.onCreate();

        // Get the fragment's Element.
        const fragView = fragment.onCreateView();

        // Add the fragment to the DOM.
        fragmentContainer.appendChild(fragView);

        // Fire the activated events for the fragment.
        fragment.onStart();
        fragment.onResume();
    }

    /** Remove a fragment from a fragment container in this activity. */
    remove(containerID: string, fragmentClassName: string) {
        const fragment = this.fragments.get(fragmentClassName);
        if (fragment == null) { throw new FragmentNotFoundException() }

        // Fire the events for removing the fragment.
        fragment.onPause();
        fragment.onStop();
        fragment.onDestroyView();
        fragment.onDestroy();

        // Get the container that contains the specified fragment.
        const fragmentContainer = <HTMLElement|null>document.querySelector(`[data-id="@+id/${containerID}"]`);
        if (fragmentContainer == null) { throw new ElementNotFoundException(`[data-id="@+id/${containerID}"]`) }

        // Empty the contents of the fragmentContainer.
        fragmentContainer.innerHTML = "";
    }

    // replace() {}
}

class FragmentNotFoundException extends Error {
    message: string = "Unable to locate the specified fragment.";

    toString() {
        return `${FragmentNotFoundException.name}: ${this.message}`;
    }
}
