import { Widget } from "../Widget.js";

/**
 * Class WidgetB
 * Extends the base Widget class to provide specific preInit and postInit logic for Widget B.
 */

export class WidgetB extends Widget {
  /**
   * Pre-initialization for Widget B.
   * Calls parent preInit and adds custom logging.
   *
   * @param {HTMLElement} target - The target DOM element for Widget B.
   */
  async preInit(target) {
    try {
      await super.preInit(target); // Pre-initialize (before children)
      console.log("Widget B pre-initialization.");
    } catch (error) {
      console.error(
        `Error during Widget B pre-initialization: ${error.message}`
      );
      this.fail(error); // Mark the widget as failed
    }
  }

  /**
   * Post-initialization for Widget B.
   * Calls parent postInit and adds custom logging.
   *
   * @param {HTMLElement} target - The target DOM element for Widget B.
   */
  async postInit(target) {
    try {
      await super.postInit(target); // Call parent postInit logic
      console.log("Widget B post-initialization.");
    } catch (error) {
      console.error(
        `Error during Widget B post-initialization: ${error.message}`
      );
      this.fail(error); // Mark the widget as failed
    }
  }
}
