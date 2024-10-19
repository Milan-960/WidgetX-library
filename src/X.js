import { WidgetDestroyedError } from "./utils/index.js";

let JSDOM = null;

export class X {
  constructor(resolver = null, infoBlock = null) {
    this.widgets = new Map(); // Keeps track of widgets per node
    this.resolver = resolver || this.defaultResolver; // Set resolver for dynamic imports
    this.infoBlock = infoBlock; // Store infoBlock for updates

    if (!this.isBrowser()) {
      this.loadJSDOM();
    }
  }

  isBrowser() {
    return typeof window !== "undefined" && typeof document !== "undefined";
  }

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

  defaultResolver(path) {
    return import(`./${path}.js`);
  }

  async init(target, callback) {
    try {
      const errors = await this._initRecursive(target);
      if (errors.length > 0) {
        callback(errors);
        errors.forEach((error) => {
          console.error(error.message);
          if (this.infoBlock) {
            this.infoBlock.innerHTML += `<p>${error.message}</p>`; // Show in infoBlock
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

  async _initRecursive(node) {
    const errors = [];
    const widgets = node.querySelectorAll("[widget]");

    for (let widgetNode of widgets) {
      if (!this.widgets.has(widgetNode)) {
        try {
          const widgetPath = widgetNode.getAttribute("widget");
          const module = await this.resolver(widgetPath);
          const widgetClassName = `Widget${widgetPath
            .split("/")
            .pop()
            .toUpperCase()}`;
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

  destroy(target) {
    const widgets = target.querySelectorAll("[widget]");
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
              this.infoBlock.innerHTML += `<p>${error.message}</p>`;
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
