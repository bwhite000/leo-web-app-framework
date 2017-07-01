import BaseActivity from "./activity"
import Context from "./context"
import ElementNotFoundException from "../core/element_not_found_exception"

/** Reference: https://developer.android.com/reference/android/app/Fragment.html */
export default class Fragment {
    activity: BaseActivity;
    context: Context;
    isAdded: boolean = false;
    isAttached: boolean = false;
    private elm: HTMLElement|DocumentFragment|null;

    /** Return the Activity this fragment is currently associated with. */
    getActivity(): BaseActivity {
        return this.activity;
    }

    /** Return the Context this fragment is currently associated with. */
    getContext(): Context {
        return this.context;
    }

    /**
     * Called when a fragment is first attached to its context. onCreate(Bundle) will be called after this.
     *
     * If you override this method you must call through to the superclass implementation.
     */
    onAttach(context: Context) {
        this.context = context;
    }

    /**
     * Called to do initial creation of a fragment. This is called after onAttach(Activity) and before
     * onCreateView(LayoutInflater, ViewGroup, Bundle), but is not called if the fragment instance is
     * retained across Activity re-creation (see setRetainInstance(boolean)).
     *
     * Note that this can be called while the fragment's activity is still in the process of being created.
     * As such, you can not rely on things like the activity's content view hierarchy being initialized
     * at this point. If you want to do work once the activity itself is created, see onActivityCreated(Bundle).
     *
     * If your app's targetSdkVersion is M or lower, child fragments being restored from the
     * savedInstanceState are restored after onCreate returns. When targeting N or above and running on an N
     * or newer platform version they are restored by Fragment.onCreate.
     *
     * If you override this method you must call through to the superclass implementation.
     */
    onCreate() {}

    /**
     * Called to have the fragment instantiate its user interface view. This is optional, and non-graphical
     * fragments can return null (which is the default implementation). This will be called between
     * onCreate(Bundle) and onActivityCreated(Bundle).
     *
     * If you return a View from here, you will later be called in onDestroyView() when the view is
     * being released.
     */
    onCreateView(): HTMLElement|DocumentFragment|null {
        return null;
    }

    /**
     * Called when the fragment's activity has been created and this fragment's view hierarchy instantiated.
     * It can be used to do final initialization once these pieces are in place, such as retrieving views or
     * restoring state. It is also useful for fragments that use setRetainInstance(boolean) to retain their
     * instance, as this callback tells the fragment when it is fully associated with the new activity instance.
     * This is called after onCreateView(LayoutInflater, ViewGroup, Bundle) and before onViewStateRestored(Bundle).
     *
     * If you override this method you must call through to the superclass implementation.
     */
    onActivityCreated() {}

    /**
     * Called when the Fragment is visible to the user. This is generally tied to Activity.onStart of the
     * containing Activity's lifecycle.
     *
     * If you override this method you must call through to the superclass implementation.
     */
    onStart() {}

    /**
     * Called when the fragment is visible to the user and actively running. This is generally tied to
     * Activity.onResume of the containing Activity's lifecycle.
     *
     * If you override this method you must call through to the superclass implementation.
     */
    onResume() {}

    /**
     * Called when the Fragment is no longer resumed. This is generally tied to Activity.onPause of the
     * containing Activity's lifecycle.
     *
     * If you override this method you must call through to the superclass implementation.
     */
    onPause() {}

    /**
     * Called when the Fragment is no longer started. This is generally tied to Activity.onStop of the
     * containing Activity's lifecycle.
     *
     * If you override this method you must call through to the superclass implementation.
     */
    onStop() {}

    /**
     * Called when the view previously created by onCreateView(LayoutInflater, ViewGroup, Bundle) has been
     * detached from the fragment. The next time the fragment needs to be displayed, a new view will be
     * created. This is called after onStop() and before onDestroy(). It is called regardless of whether
     * onCreateView(LayoutInflater, ViewGroup, Bundle) returned a non-null view. Internally it is called
     * after the view's state has been saved but before it has been removed from its parent.
     *
     * If you override this method you must call through to the superclass implementation.
     */
    onDestroyView() {}

    /**
     * Called when the fragment is no longer in use. This is called after onStop() and before onDetach().
     *
     * If you override this method you must call through to the superclass implementation.
     */
    onDestroy() {}

    /**
     * Called when the fragment is no longer attached to its activity. This is called after onDestroy(),
     * except in the cases where the fragment instance is retained across Activity re-creation (see
     * setRetainInstance(boolean)), in which case it is called after onStop().
     *
     * If you override this method you must call through to the superclass implementation.
     */
    onDetach() {}

    setView(elm: HTMLElement|DocumentFragment) {
        this.elm = elm;
    }

    querySelector(selector: string): HTMLElement {
        const elm = <HTMLElement|null>this.elm.querySelector(selector);
        if (elm == null) { throw new ElementNotFoundException() }

        return elm;
    }
}
