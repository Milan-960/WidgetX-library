/**
 * Class X
 *
 * This class is responsible for managing widget initialization and destruction
 * in both browser and non-browser environments. It dynamically loads widgets,
 * handles errors locally inside each method, and provides support for JSDOM
 * when needed. The class also allows for an optional custom resolver and
 * optional feedback through an `infoBlock`.
 *
 * Features:
 * - Handles dynamic imports for widgets.
 * - Supports JSDOM for non-browser environments (e.g., Node.js).
 * - Localized error handling in `init`, `_initRecursive`, and `destroy`.
 */

import { WidgetDestroyedError } from "./utils/index.js";

// JSDOM instance for non-browser environments
let JSDOM = null;

export class X {
  /**
   * @constructor
   * Initializes the X class with an optional custom resolver and info block.
   *
   * @param {Function|null} resolver - Custom resolver for widget imports. Falls back to defaultResolver.
   * @param {HTMLElement|null} infoBlock - An optional HTML element to display error messages or logs.
   */
  constructor(resolver = null, infoBlock = null) {
    this.widgets = new Map(); // Track initialized widgets and their corresponding DOM nodes.
    this.resolver = resolver || this.defaultResolver;
    this.infoBlock = infoBlock;

    // If not in a browser environment, load JSDOM.
    if (!this.isBrowser()) {
      this.loadJSDOM();
    }
  }

  /**
   * Determines if the environment is a browser.
   *
   * @returns {boolean} - True if the environment is a browser, false otherwise.
   */
  isBrowser() {
    return typeof window !== "undefined" && typeof document !== "undefined";
  }

  /**
   * Dynamically loads JSDOM in non-browser environments (like Node.js).
   * JSDOM is used to simulate a browser-like environment for widget initialization.
   */
  async loadJSDOM() {
    if (!JSDOM && typeof window === "undefined") {
      const jsdomModule = await import("jsdom");
      JSDOM = jsdomModule.JSDOM;
      const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
      global.window = dom.window;
      global.document = dom.window.document;
      global.Element = dom.window.Element;
      global.Node = dom.window.Node;
    }
  }

  /**
   * Default resolver for dynamically importing widget modules.
   *
   * @param {string} path - Path to the widget module.
   * @returns {Promise<Module>} - A promise resolving to the dynamically imported module.
   */
  defaultResolver(path) {
    return import(`./${path}.js`);
  }

  /**
   * Initializes widgets within a target node and reports any initialization errors through a callback.
   *
   * @param {HTMLElement} target - The target DOM node containing widgets.
   * @param {Function} callback - A function that will be called with an array of errors (or null if none).
   */
  async init(target, callback) {
    try {
      const errors = await this._initRecursive(target); // Recursively initialize widgets within the target.

      if (errors.length > 0) {
        callback(errors);
        errors.forEach((error) => {
          console.error(error.message);
          if (this.infoBlock) {
            this.infoBlock.innerHTML += `<p>${error.message}</p>`; // Display error in the info block (if available).
          }
        });
      } else {
        callback(null);
      }
    } catch (error) {
      console.error(error.message);
      callback([error]);
    }
  }

  /**
   * Recursively initializes all widgets found within a given DOM node.
   * This method dynamically imports and initializes each widget, handling errors at each step.
   *
   * @param {HTMLElement} node - The DOM node containing potential widgets.
   * @returns {Array<Error>} - An array of errors encountered during the initialization process.
   * @private
   */
  async _initRecursive(node) {
    const errors = []; // Array to store any errors encountered during initialization.
    const widgets = node.querySelectorAll("[widget]");

    // Iterate over each widget node and attempt to initialize them.
    for (let widgetNode of widgets) {
      if (!this.widgets.has(widgetNode)) {
        try {
          const widgetPath = widgetNode.getAttribute("widget");
          const module = await this.resolver(widgetPath);
          const widgetClassName = `Widget${widgetPath
            .split("/")
            .pop()
            .toUpperCase()}`; // Derive the widget class name.
          const WidgetClass = module[widgetClassName];

          if (!WidgetClass) {
            throw new Error(
              `Widget class ${widgetClassName} not found in ${widgetPath}`
            );
          }

          const widgetInstance = new WidgetClass();
          await widgetInstance.preInit(widgetNode);

          if (!widgetInstance.hasFailed) {
            // Only set widget if preInit was successful
            this.widgets.set(widgetNode, widgetInstance);
          } else {
            errors.push(
              new Error(
                `Widget ${widgetPath} failed during pre-initialization.`
              )
            );
          }
        } catch (error) {
          const widgetPath = widgetNode.getAttribute("widget");
          const detailedError = new Error(
            `Error in ${widgetPath}: ${error.message}`
          );
          console.error(detailedError.message);
          widgetNode.classList.add("failed");
          errors.push(detailedError);
          continue;
        }
      }
    }

    // Post-initialization phase for successfully initialized widgets.
    for (let widgetNode of widgets) {
      const widgetInstance = this.widgets.get(widgetNode);
      if (widgetInstance && !widgetInstance.hasFailed) {
        try {
          await widgetInstance.postInit(widgetNode);
          widgetNode.classList.add("initialized");
        } catch (error) {
          const widgetPath = widgetNode.getAttribute("widget");
          const detailedError = new Error(
            `Error in ${widgetPath} during post-init: ${error.message}`
          );
          console.error(detailedError.message);
          widgetNode.classList.add("failed");
          errors.push(detailedError);
        }
      }
    }

    return errors;
  }

  /**
   * Destroys all widgets within the given target node, handling errors related to widget destruction.
   *
   * @param {HTMLElement} target - The DOM node containing the widgets to destroy.
   */
  destroy(target) {
    const widgets = target.querySelectorAll("[widget]"); // Find all widget nodes in the target.

    // Iterate over the widgets in reverse order to safely destroy them.
    for (let i = widgets.length - 1; i >= 0; i--) {
      const widgetNode = widgets[i];
      const widgetInstance = this.widgets.get(widgetNode);

      if (widgetInstance && !widgetInstance.isDestroyed) {
        try {
          // Call the widget's destroy method (which includes resetState)
          widgetInstance.destroy();
          this.widgets.delete(widgetNode);
          console.log(`Widget ${widgetNode.getAttribute("widget")} destroyed.`);

          if (this.infoBlock) {
            this.infoBlock.innerHTML += `<p>Widget ${widgetNode.getAttribute(
              "widget"
            )} destroyed.</p>`;
          }
        } catch (error) {
          if (error instanceof WidgetDestroyedError) {
            console.error(error.message);
            if (this.infoBlock) {
              this.infoBlock.innerHTML += `<p>${error.message}</p>`; // Display message in info block.
            }
          } else {
            throw error;
          }
        }
      } else {
        console.log(
          `No instance found or already destroyed for ${widgetNode.getAttribute(
            "widget"
          )}`
        );
      }
    }
  }
}
