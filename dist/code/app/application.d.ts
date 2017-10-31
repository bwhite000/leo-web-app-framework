import BaseActivity from "./activity";
export interface UninstantiatedBaseActivity {
    new (): BaseActivity;
}
export default abstract class Application {
    private static activities;
    private static currentActivity;
    private static init();
    static defineActivities(activities: UninstantiatedBaseActivity[]): void;
    private static determineCurrentActivity();
    private static polyfillHtmlImports();
    private static onDOMContentLoaded();
}
