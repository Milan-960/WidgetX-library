import { Widget } from "../Widget.js";

export class WidgetA extends Widget {
  async preInit(target) {
    try {
      await super.preInit(target); // Call parent preInit logic
      console.log("Widget A pre-initialization.");
    } catch (error) {
      console.error(
        `Error during Widget A pre-initialization: ${error.message}`
      );
      this.fail(error); // Mark the widget as failed
    }
  }

  async postInit(target) {
    try {
      await super.postInit(target); // Call parent preInit logic
      console.log("Widget A post-initialization.");
    } catch (error) {
      console.error(
        `Error during Widget A post-initialization: ${error.message}`
      );
      this.fail(error); // Mark the widget as failed
    }
  }
}
