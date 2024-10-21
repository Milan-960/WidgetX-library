import { Widget } from "../Widget.js";

/**
 * Class WidgetC
 * Extends the base Widget class to provide specific preInit and postInit logic for Widget C.
 */

export class WidgetC extends Widget {
  /**
   * Pre-initialization for Widget C.
   * Calls parent preInit and adds custom logging.
   *
   * @param {HTMLElement} target - The target DOM element for Widget C.
   */
  async preInit(target) {
    try {
      await super.preInit(target); // Pre-initialize (before children)
    } catch (error) {
      console.error(
        `Error during Widget C pre-initialization: ${error.message}`
      );
      this.fail(error); // Mark the widget as failed
    }
  }

  /**
   * Post-initialization for Widget C.
   * Calls parent postInit and adds custom logging.
   *
   * @param {HTMLElement} target - The target DOM element for Widget C.
   */
  async postInit(target) {
    try {
      await super.postInit(target); // Call parent postInit logic
    } catch (error) {
      console.error(
        `Error during Widget C post-initialization: ${error.message}`
      );
      this.fail(error); // Mark the widget as failed
    }
  }
}
