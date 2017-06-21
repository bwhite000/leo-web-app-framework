import BaseActivity from "./activity"

export default class Fragment {
    constructor(private context: BaseActivity) {}

    onAttach() {}

    onCreate() {}

    onCreateView(): DocumentFragment {
        return new DocumentFragment();
    }

    onActivityCreated() {}

    onStart() {}

    onResume() {}

    onPause() {}

    onStop() {}

    onDestroyView() {}

    onDestroy() {}

    onDetach() {}

    getContext(): BaseActivity {
        return this.context;
    }
}
