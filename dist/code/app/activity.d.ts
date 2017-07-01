import ActionBar from "./action_bar";
import Context from "./context";
import Fragment from "./fragment";
import FragmentManager from "./fragment_manager";
export declare class Activity extends Context {
    onCreate(): void;
    onStart(): void;
    onResume(): void;
    onPause(): void;
    onRestart(): void;
    onStop(): void;
    onDestroy(): void;
    onRestoreInstanceState(): void;
    onSaveInstanceState(): void;
}
export default class BaseActivity extends Activity {
    private _actionBar;
    private _rootElm;
    private currentContentView;
    private fragmentManager;
    private elms;
    constructor();
    onMenuItemSelected(): void;
    onOptionsItemSelected(): void;
    findViewById(id: string): HTMLElement;
    querySelector(selector: string): HTMLElement;
    setContentView(template: Document | HTMLTemplateElement | Fragment): void;
    getActionBar(): ActionBar;
    getFragmentManager(): FragmentManager;
}
