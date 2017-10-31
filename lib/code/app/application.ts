import BaseActivity from "./activity"
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

    private static determineCurrentActivity(): void {
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

    // Apply the polyfill for browsers that do not support HTML imports (Firefox at the time of writing 2017.10.30).
    private static async polyfillHtmlImports(): Promise<void> {
        // Check if the browser lacks HTML Import support and needs the polyfill to run.
        if ("import" in document.createElement("link") == false) {
            // Get all of the HTML Import <link> Elements on the webpage.
            const importElms = <NodeListOf<HTMLLinkElement>>document.querySelectorAll('link[rel="import"][href]');
            const requestArr = <Promise<void>[]>[];

            // Loop through all of the HTML import Elements.
            for (const importElm of importElms) {
                // Verify that the "import" attribute is still set to a "null" value.
                if (importElm.import == null) {
                    // Create a Promise that fetches the remote document, parses it, and sets
                    // the <link> Element's import value.
                    const polyfillPromise = new Promise<void>(async resolve => {
                        // Fetch the remote HTML import resource and convert it to text.
                        const html = await fetch(importElm.href).then(resp => resp.text());
                        // Parse the remote resource into a [Document] Object.
                        const doc = new DOMParser().parseFromString(html, "text/html");

                        // Set the "import" attribute to the fetched Document.
                        importElm.import = doc;

                        // Resolve this Promise.
                        resolve();
                    });

                    // Add this Promise to the Array so that they can all run concurrently.
                    requestArr.push(polyfillPromise)
                }
            }

            // Wait for all of the remote HTML import resources to be fetched, parsed, and assigned.
            await Promise.all(requestArr);
        }
    }

    /** Event handler for when the Document reaches this ready state. */
    private static async onDOMContentLoaded() {
        // Cleanup and remove this event listener.
        document.removeEventListener("DOMContentLoaded", Application.onDOMContentLoaded);

        // Index the on-page resources.
        Res._indexResources();

        // Apply the polyfill for browsers that do not support HTML imports (Firefox at the time of writing 2017.10.30).
        await Application.polyfillHtmlImports();

        // Determine which activity to start on.
        Application.determineCurrentActivity();
    }
}
