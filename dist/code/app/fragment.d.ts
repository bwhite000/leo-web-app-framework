import BaseActivity from "./activity";
import Context from "./context";
export default class Fragment {
    activity: BaseActivity;
    context: Context;
    isAdded: boolean;
    isAttached: boolean;
    private elm;
    getActivity(): BaseActivity;
    getContext(): Context;
    onAttach(context: Context): void;
    onCreate(): void;
    onCreateView(): HTMLElement | DocumentFragment | null;
    onActivityCreated(): void;
    onStart(): void;
    onResume(): void;
    onPause(): void;
    onStop(): void;
    onDestroyView(): void;
    onDestroy(): void;
    onDetach(): void;
    setView(elm: HTMLElement | DocumentFragment): void;
    querySelector(selector: string): HTMLElement;
}
