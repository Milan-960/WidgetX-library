/**
 * Class Widget
 *
 * This class represents a base widget that handles its lifecycle,
 * including initialization, destruction, and error handling.
 * The widget is designed to have distinct pre-init and post-init stages,
 * as well as handling event binding and cleanup during destruction.
 *
 * Features:
 * - Handles pre-initialization and post-initialization phases.
 * - Tracks widget failure and destruction states.
 * - Binds and removes event handlers dynamically.
 * - It handles widget destruction, including cleanup.
 */

export class Widget {
  constructor() {
    this.isBeingInitialized = false;
    this.hasFailed = false; // New property to track failure
    this.isDestroyed = false; // Flag to track if widget is destroyed
  }

  /**
   * Pre-initialization logic for the widget.
   * Sets up the widget state and binds event handlers before full initialization.
   *
   * @param {HTMLElement} target - The target DOM element for the widget.
   */
  async preInit(target) {
    if (this.hasFailed || this.isDestroyed) return;
    this.isBeingInitialized = true;
    this.target = target; // Store the target DOM element reference.
    this._bindEventHandlers();
    this._setPreInitState();
  }

  /**
   * Post-initialization logic for the widget.
   * Finalizes the initialization process and updates the widget state.
   */
  async postInit() {
    if (this.hasFailed || this.isDestroyed) return;
    this._setPostInitState();
    this.isBeingInitialized = false;
  }

  /**
   * Marks the widget as failed and logs the error.
   *
   * @param {Error} error - The error that caused the widget to fail.
   */
  fail(error) {
    this.hasFailed = true;
    this.target.classList.add("failed");
    console.error(`Widget failed to initialize: ${error.message}`);
  }

  /**
   * Destroys the widget, cleaning up event handlers and resetting the state.
   * Safeguards against multiple destruction calls.
   */
  destroy() {
    if (this.isDestroyed) {
      console.log("Widget already destroyed.");
      return;
    }
    this.isDestroyed = true;
    this._removeEventHandlers();
    this._resetState();
    console.log("Widget destroyed and state reset.");
  }

  /**
   * Binds event handlers to the widget.
   * Automatically binds any method ending in "Handler" to the widget instance.
   */
  _bindEventHandlers() {
    const handlerMethods = Object.keys(this).filter((method) =>
      method.endsWith("Handler")
    );

    handlerMethods.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  /**
   * Removes event handlers that were bound during initialization.
   * Deletes methods ending in "Handler" from the widget instance.
   */
  _removeEventHandlers() {
    const handlerMethods = Object.keys(this).filter((method) =>
      method.endsWith("Handler")
    );
    handlerMethods.forEach((method) => {
      delete this[method];
    });
  }

  /**
   * Sets the widget's state to pre-initialized.
   * Adds and removes CSS classes to visually indicate pre-initialization.
   */
  _setPreInitState() {
    this.target.classList.add("pre-initialized");
    this.target.classList.remove("finished");
  }

  /**
   * Sets the widget's state to post-initialized.
   * Updates the DOM to reflect that the widget has been fully initialized.
   */
  _setPostInitState() {
    this.target.classList.add("initialized");
    this.target.classList.remove("pre-initialized");
  }

  /**
   * Resets the widgets state, removing any classes that were added during initialization.
   * This is called when the widget is destroyed or if it needs to be reset.
   */
  _resetState() {
    this.target.classList.remove(
      "pre-initialized",
      "initialized",
      "finished",
      "failed"
    );
  }

  /**
   * Marks the widget as finished and logs the completion.
   * Adds a "finished" class to the target element.
   */
  finish() {
    this.target.classList.add("finished");
    console.log("Widget marked as finished.");
  }
}
