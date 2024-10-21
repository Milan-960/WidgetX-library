import { Widget } from "../../src/Widget";
import { WidgetA } from "../../src/widgets/a";

describe("WidgetA", () => {
  let widgetAInstance;
  let mockTarget;

  beforeEach(() => {
    // Create a new instance of WidgetA before each test
    widgetAInstance = new WidgetA();

    // Mock a target element (DOM node) for preInit and postInit
    mockTarget = document.createElement("div");
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore any mocks after each test
  });

  test("should pre-initialize successfully", async () => {
    // Spy on the parent class preInit method to simulate success
    jest.spyOn(Widget.prototype, "preInit").mockResolvedValue();

    // Spy on console.log to check the successful log
    // const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    // Call preInit on WidgetA
    await widgetAInstance.preInit(mockTarget);

    // Expect the parent preInit to have been called
    expect(Widget.prototype.preInit).toHaveBeenCalledWith(mockTarget);

    // expect(logSpy).toHaveBeenCalledWith("Widget A pre-initialization.");
  });

  test("should handle errors during pre-initialization", async () => {
    // Spy on the parent class's preInit method to simulate an error
    jest
      .spyOn(Widget.prototype, "preInit")
      .mockRejectedValue(new Error("Failed"));

    // Spy on console.error to check the error log
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    // Call preInit on WidgetA
    try {
      await widgetAInstance.preInit(mockTarget);
    } catch (error) {
      // Expect the parent preInit to have been called
      expect(Widget.prototype.preInit).toHaveBeenCalledWith(mockTarget);

      // Expect the error log
      expect(errorSpy).toHaveBeenCalledWith(
        "Error during Widget A pre-initialization: Failed"
      );

      // Expect the widget to be marked as failed
      expect(widgetAInstance.hasFailed).toBe(true);
    }
  });

  test("should post-initialize successfully", async () => {
    // Spy on the parent class postInit method to simulate success
    jest.spyOn(Widget.prototype, "postInit").mockResolvedValue();

    // Spy on console.log to check the successful log
    // const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await widgetAInstance.postInit(mockTarget);

    // Expect the parent postInit to have been called
    expect(Widget.prototype.postInit).toHaveBeenCalledWith(mockTarget);

    // expect(logSpy).toHaveBeenCalledWith("Widget A post-initialization.");
  });

  test("should handle errors during post-initialization", async () => {
    // Spy on the parent class postInit method to simulate an error
    jest
      .spyOn(Widget.prototype, "postInit")
      .mockRejectedValue(new Error("Failed"));

    // Spy on console.error to check the error log
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    // Call postInit on WidgetA
    try {
      await widgetAInstance.postInit(mockTarget);
    } catch (error) {
      expect(Widget.prototype.postInit).toHaveBeenCalledWith(mockTarget);

      expect(errorSpy).toHaveBeenCalledWith(
        "Error during Widget A post-initialization: Failed"
      );

      // Expect the widget to be marked as failed
      expect(widgetAInstance.hasFailed).toBe(true);
    }
  });
});
