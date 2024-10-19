export class WidgetDestroyedError extends Error {
  constructor(widgetNode, widgetPath) {
    const widgetIdentifier =
      widgetNode.id || widgetNode.className || widgetNode.tagName;
    super(
      `Widget ${widgetIdentifier} (Path: ${widgetPath}) was destroyed during initialization.`
    );
    this.name = "WidgetDestroyedError";
    this.widgetPath = widgetPath; // Store widget path for debugging
  }
}
