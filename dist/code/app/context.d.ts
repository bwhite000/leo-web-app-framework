import Resources from "../content/res/resources";
export default class Context {
    private resources;
    getResources(): Resources;
    getString(id: string): string;
}
