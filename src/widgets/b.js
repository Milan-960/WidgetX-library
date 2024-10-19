import { Widget } from "../Widget.js";

export class WidgetB extends Widget {
  async preInit(target) {
    try {
      await super.preInit(target); // Call parent preInit logic
      console.log("Widget B pre-initialization.");
    } catch (error) {
      console.error(
        `Error during Widget B pre-initialization: ${error.message}`
      );
      this.fail(error); // Mark the widget as failed
    }
  }

  async postInit(target) {
    try {
      await super.postInit(target); // Call parent preInit logic
      console.log("Widget B post-initialization.");
    } catch (error) {
      console.error(
        `Error during Widget B post-initialization: ${error.message}`
      );
      this.fail(error); // Mark the widget as failed
    }
  }
}
