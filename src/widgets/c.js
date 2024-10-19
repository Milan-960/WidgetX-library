import { Widget } from "../Widget.js";

export class WidgetC extends Widget {
  async preInit(target) {
    try {
      await super.preInit(target); // Call parent preInit logic
      console.log("Widget C pre-initialization.");
    } catch (error) {
      console.error(
        `Error during Widget C pre-initialization: ${error.message}`
      );
      this.fail(error); // Mark the widget as failed
    }
  }

  async postInit(target) {
    try {
      await super.postInit(target); // Call parent preInit logic
      console.log("Widget C post-initialization.");
    } catch (error) {
      console.error(
        `Error during Widget C post-initialization: ${error.message}`
      );
      this.fail(error); // Mark the widget as failed
    }
  }
}
