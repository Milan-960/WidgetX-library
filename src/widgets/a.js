import { Widget } from "../Widget.js";

export class WidgetA extends Widget {
  async preInit() {
    console.log("Widget A initialization.");
  }
}
