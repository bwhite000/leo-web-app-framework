import Resources from "../content/res/resources"

export default class Context {
    private resources = new Resources();

    getResources(): Resources {
        return this.resources;
    }

    getString(id: string): string {
        return this.resources.getString(id);
    }
}
