import BaseActivity from "./activity";
import Context from "./context";
import Fragment from "./fragment";
export default class FragmentManager {
    activity: BaseActivity;
    context: Context;
    fragments: Map<string, Fragment>;
    constructor();
    add(containerID: string, fragment: Fragment): void;
    attach(fragment: Fragment): void;
    detach(fragment: Fragment): void;
    remove(containerID: string, fragment: Fragment): void;
}
