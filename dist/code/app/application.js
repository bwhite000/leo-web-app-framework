"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const res_1 = require("../core/res");
class Application {
    static init() {
        if (document.readyState == "interactive" || document.readyState == "complete") {
            Application.onDOMContentLoaded();
        }
        else {
            document.addEventListener('DOMContentLoaded', Application.onDOMContentLoaded);
        }
    }
    static defineActivities(activities) {
        for (const activity of activities) {
            const metaElm = document.querySelector(`meta[content="application"][data-activity="${activity.name}"]`);
            if (metaElm != null) {
                const baseUrl = metaElm.dataset.baseUrl;
                if (baseUrl != undefined) {
                    this.activities.set(baseUrl, activity);
                }
            }
        }
        Application.init();
    }
    static determineCurrentActivity() {
        const pathname = window.location.pathname;
        for (const [baseUrl, activity] of this.activities.entries()) {
            if (pathname == baseUrl) {
                Application.currentActivity = new activity();
                break;
            }
        }
    }
    static async polyfillHtmlImports() {
        if ("import" in document.createElement("link") == false) {
            const importElms = document.querySelectorAll('link[rel="import"][href]');
            const requestArr = [];
            for (const importElm of importElms) {
                if (importElm.import == null) {
                    const polyfillPromise = new Promise(async (resolve) => {
                        const html = await fetch(importElm.href).then(resp => resp.text());
                        const doc = new DOMParser().parseFromString(html, "text/html");
                        importElm.import = doc;
                        resolve();
                    });
                    requestArr.push(polyfillPromise);
                }
            }
            await Promise.all(requestArr);
        }
    }
    static async onDOMContentLoaded() {
        document.removeEventListener("DOMContentLoaded", Application.onDOMContentLoaded);
        res_1.default._indexResources();
        await Application.polyfillHtmlImports();
        Application.determineCurrentActivity();
    }
}
Application.activities = new Map();
exports.default = Application;
