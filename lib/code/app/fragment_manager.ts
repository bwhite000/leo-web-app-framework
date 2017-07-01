import BaseActivity from "./activity"
import Context from "./context"
import ElementNotFoundException from "../core/element_not_found_exception"
import Fragment from "./fragment"
import FragmentNotFoundException from "../core/fragment_not_found_exception"

/** Reference: https://developer.android.com/reference/android/app/FragmentTransaction.html */
export default class FragmentManager {
    activity: BaseActivity;
    context: Context;
    fragments = new Map<string, Fragment>();

    constructor() {}

    /**
     * Add a fragment to the activity state. This fragment may optionally also have its view (if
     * Fragment.onCreateView returns non-null) inserted into a container view of the activity.
     */
    add(containerID: string, fragment: Fragment) {
        // Add this fragment to the index.
        this.fragments.set(fragment.constructor.name, fragment);

        // Get the container for appending the fragment's Element into.
        const fragmentContainer = <HTMLElement|null>document.querySelector(`[data-id="@+id/${containerID}"]`);
        if (fragmentContainer == null) { throw new ElementNotFoundException(`[data-id="@+id/${containerID}"]`) }

        // Add the context information for the newly inflated Fragment.
        fragment.activity = this.activity;
        fragment.context = this.context;
        fragment.isAdded = true;

        // Fire the initial events for the fragment.
        this.attach(fragment);
        fragment.onCreate();

        // Get the fragment's Element.
        const fragView = fragment.onCreateView();
        if (fragView != null) {
            // Add the fragment to the DOM.
            fragmentContainer.appendChild(fragView);
            fragment.setView(fragView);
        }

        // Fire the activated events for the fragment.
        fragment.onStart();
        fragment.onResume();
    }

    /**
     * Re-attach a fragment after it had previously been detached from the UI with detach(Fragment).
     * This causes its view hierarchy to be re-created, attached to the UI, and displayed.
     */
    attach(fragment: Fragment) {
        // Update the fragment's status.
        fragment.isAttached = true;

        // Fire the event listener for this action.
        fragment.onAttach(this.context);
    }

    /**
     * Detach the given fragment from the UI. This is the same state as when it is put on the
     * back stack: the fragment is removed from the UI, however its state is still being actively
     * managed by the fragment manager. When going into this state its view hierarchy is destroyed.
     */
    detach(fragment: Fragment) {
        // Update the fragment's status.
        fragment.isAttached = false;

        // Fire the event listener for this action.
        fragment.onDetach();
    }

    /**
     * Remove an existing fragment. If it was added to a container, its view is also removed from
     * that container.
     */
    remove(containerID: string, fragment: Fragment) {
        const fragmentClassName = fragment.constructor.name;
        if (this.fragments.has(fragmentClassName) == false) { throw new FragmentNotFoundException() }

        // Update the fragment's status.
        fragment.isAdded = false;

        // Fire the events for removing the fragment.
        fragment.onPause();
        this.detach(fragment);
        fragment.onStop();
        fragment.onDestroyView();
        fragment.onDestroy();

        // Get the container that contains the specified fragment.
        const fragmentContainer = <HTMLElement|null>document.querySelector(`[data-id="@+id/${containerID}"]`);
        if (fragmentContainer == null) { throw new ElementNotFoundException(`[data-id="@+id/${containerID}"]`) }

        // Empty the contents of the fragmentContainer.
        fragmentContainer.innerHTML = "";
    }

    /**
     * Replace an existing fragment that was added to a container. This is essentially the same as
     * calling remove(Fragment) for all currently added fragments that were added with the same
     * containerViewId and then add(int, Fragment, String) with the same arguments given here.
     */
    // replace() {}
}
