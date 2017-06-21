import BaseActivity from "./activity"
import ElementNotFoundException from "../core/element_not_found_exception"
import Res from "../core/res"

export interface UninstantiatedBaseActivity {
    new(): BaseActivity
}

export default abstract class Application {
    private static activities = new Map<string, UninstantiatedBaseActivity>();

    private static currentActivity: BaseActivity|null;

    private static init() {
        if (document.readyState == "interactive" || document.readyState == "complete") {
            Application.onDOMContentLoaded();
        } else {
            document.addEventListener('DOMContentLoaded', Application.onDOMContentLoaded);
        }
    }

    /** Called by the Application developer to provide the framework with the Application classes. */
    static defineActivities(activities: UninstantiatedBaseActivity[]) {
        // Loop through the provided activities and collect the meta information from the webpage manifest.
        for (const activity of activities) {
            const metaElm = <HTMLMetaElement|null>document.querySelector(`meta[content="application"][data-activity="${activity.name}"]`);

            // Check that en Element was matched.
            if (metaElm != null) {
                const baseUrl: string|undefined = metaElm.dataset.baseUrl;

                // Check that the meta tag defined a baseurl.
                if (baseUrl != undefined) {
                    // Add this activity to the list of activities.
                    this.activities.set(baseUrl, activity);
                }
            }
        }

        // Startup the Application.
        Application.init();
    }

    private static determineCurrentActivity() {
        const pathname = window.location.pathname;

        // Loop through all of the activities and their matching base url to determine
        // which activity is the current one.
        for (const [baseUrl, activity] of this.activities.entries()) {
            if (pathname == baseUrl) {
                Application.currentActivity = new activity();
                break;
            }
        }
    }

    /** */
    private static onDOMContentLoaded() {
        // Cleanup and remove this event listener.
        document.removeEventListener("DOMContentLoaded", Application.onDOMContentLoaded);

        // Index the on-page resources.
        Res._indexResources();

        // Determine which activity to start on.
        Application.determineCurrentActivity();
    }
}
