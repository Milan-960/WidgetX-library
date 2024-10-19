export class Widget {
  constructor() {
    this.isBeingInitialized = false;
    this.hasFailed = false; // New property to track failure
    this.isDestroyed = false; // Flag to track if widget is destroyed
  }
  async preInit(target) {
    if (this.hasFailed || this.isDestroyed) return;
    this.isBeingInitialized = true;
    this.target = target;
    this._bindEventHandlers();
    this._setPreInitState();
  }

  async postInit() {
    if (this.hasFailed || this.isDestroyed) return;
    this._setPostInitState();
    this.isBeingInitialized = false;
  }

  fail(error) {
    this.hasFailed = true;
    this.target.classList.add("failed");
    console.error(`Widget failed to initialize: ${error.message}`);
  }

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

  _bindEventHandlers() {
    const handlerMethods = Object.keys(this).filter((method) =>
      method.endsWith("Handler")
    );
    handlerMethods.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  _removeEventHandlers() {
    const handlerMethods = Object.keys(this).filter((method) =>
      method.endsWith("Handler")
    );
    handlerMethods.forEach((method) => {
      delete this[method];
    });
  }

  _setPreInitState() {
    this.target.classList.add("pre-initialized");
    this.target.classList.remove("finished");
  }

  _setPostInitState() {
    this.target.classList.add("initialized");
    this.target.classList.remove("pre-initialized");
  }

  _resetState() {
    this.target.classList.remove(
      "pre-initialized",
      "initialized",
      "finished",
      "failed"
    );
  }

  finish() {
    this.target.classList.add("finished");
    console.log("Widget marked as finished.");
  }
}
