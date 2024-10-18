import { Widget } from "../Widget.js";

export class WidgetC extends Widget {
  async preInit() {
    console.log("Widget C initialization.");
  }
}
