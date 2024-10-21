import { Widget } from "../Widget.js";

/**
 * Class WidgetA
 * Extends the base Widget class to provide specific preInit and postInit logic for Widget A.
 */

export class WidgetA extends Widget {
  /**
   * Pre-initialization for Widget A.
   * Calls parent preInit and adds custom logging.
   *
   * @param {HTMLElement} target - The target DOM element for Widget A.
   */
  async preInit(target) {
    try {
      await super.preInit(target); // Call parent preInit logic
    } catch (error) {
      console.error(
        `Error during Widget A pre-initialization: ${error.message}`
      );
      this.fail(error); // Mark the widget as failed
    }
  }

  /**
   * Post-initialization for Widget A.
   * Calls parent postInit and adds custom logging.
   *
   * @param {HTMLElement} target - The target DOM element for Widget A.
   */
  async postInit(target) {
    try {
      await super.postInit(target); // Call parent postInit logic
    } catch (error) {
      console.error(
        `Error during Widget A post-initialization: ${error.message}`
      );
      this.fail(error); // Mark the widget as failed
    }
  }
}
