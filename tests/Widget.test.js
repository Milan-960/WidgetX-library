import { Widget } from "../src/Widget.js";

describe("Widget Class", () => {
  let widgetInstance, mockTarget;

  beforeEach(() => {
    widgetInstance = new Widget();
    // Create a mock DOM element for testing
    mockTarget = document.createElement("div");
    widgetInstance.target = mockTarget; // Set mock target

    // Mock console.error to allow tracking failure logs
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  // Restore original console methods after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should reset state on destroy", () => {
    widgetInstance.destroy();
    expect(widgetInstance.isDestroyed).toBe(true);
    expect(mockTarget.classList.contains("pre-initialized")).toBe(false);
    expect(mockTarget.classList.contains("initialized")).toBe(false);
    expect(mockTarget.classList.contains("finished")).toBe(false);
    expect(mockTarget.classList.contains("failed")).toBe(false);
  });

  test("should mark widget as failed on fail method", () => {
    const error = new Error("Widget failed");
    widgetInstance.fail(error);
    expect(widgetInstance.hasFailed).toBe(true);
    expect(mockTarget.classList.contains("failed")).toBe(true); // Expect class to be added
    expect(console.error).toHaveBeenCalledWith(
      "Widget failed to initialize: Widget failed"
    );
  });

  test("should bind event handlers that end with Handler", () => {
    // Bind event handlers using the widget method
    widgetInstance._bindEventHandlers();

    // Now mock the handler after it has been bound
    widgetInstance.someEventHandler = jest.fn();

    // Ensure the handler is still a mock function after binding
    expect(widgetInstance.someEventHandler).toBeDefined();
    expect(widgetInstance.someEventHandler).toHaveBeenCalledTimes(0);

    // Test if the handler works by calling it
    widgetInstance.someEventHandler();
    expect(widgetInstance.someEventHandler).toHaveBeenCalledTimes(1);
  });

  test("should add pre-initialized class during preInit", async () => {
    await widgetInstance.preInit(mockTarget);
    expect(widgetInstance.isBeingInitialized).toBe(true);
    expect(mockTarget.classList.contains("pre-initialized")).toBe(true);
  });

  test("should add initialized class during postInit", async () => {
    // Ensure preInit is called first
    await widgetInstance.preInit(mockTarget);
    await widgetInstance.postInit();
    expect(widgetInstance.isBeingInitialized).toBe(false);
    expect(mockTarget.classList.contains("initialized")).toBe(true);
  });

  test("should reset state after destroy", () => {
    widgetInstance.destroy();
    expect(mockTarget.classList.contains("pre-initialized")).toBe(false);
    expect(mockTarget.classList.contains("initialized")).toBe(false);
    expect(mockTarget.classList.contains("finished")).toBe(false);
    expect(mockTarget.classList.contains("failed")).toBe(false);
    expect(widgetInstance.isDestroyed).toBe(true);
  });

  test("should set finish state on finish method", () => {
    widgetInstance.finish();
    // Check if the "finished" class is added
    expect(mockTarget.classList.contains("finished")).toBe(true);
  });
});
