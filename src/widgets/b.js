import { Widget } from "../Widget.js";

export class WidgetB extends Widget {
  async preInit() {
    console.log("Widget B initialization.");
  }
}
