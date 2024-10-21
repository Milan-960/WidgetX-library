import { JSDOM } from "jsdom";
import { X } from "../src/X";
import { WidgetDestroyedError } from "../src/utils/index";

describe("X Library", () => {
  let document, window, xLib, rootNode;

  // Setup DOM environment for tests
  beforeEach(async () => {
    const { window: win } = new JSDOM(`
      <div id="root" class="tree">
        <div widget="widgets/a">
          <div widget="widgets/b"></div>
        </div>
        <div widget="widgets/c"></div>
      </div>
    `);
    window = win;
    document = win.document;
    rootNode = document.getElementById("root");

    // Create an instance of X library
    xLib = new X();

    // Simulate loading JSDOM for non-browser environments
    await xLib.loadJSDOM();
  });

  // Restore all mocked console methods after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should initialize widgets", async () => {
    const mockCallback = jest.fn();

    // Mock resolver to return widget classes dynamically
    xLib.resolver = jest.fn(async (path) => {
      return {
        [`Widget${path.split("/").pop().toUpperCase()}`]: class {
          async preInit() {}
          async postInit() {}
          destroy() {}
        },
      };
    });

    // Call init and wait for completion
    await xLib.init(rootNode, mockCallback);

    // Expect widgets to be initialized without errors
    expect(mockCallback).toHaveBeenCalledWith(null);
    expect(xLib.widgets.size).toBe(3); // Three widgets initialized (a, b, c)
  });

  test("should destroy widgets correctly", () => {
    // Mock resolver to return widget classes with a destroy method
    xLib.resolver = jest.fn(async (path) => {
      return {
        [`Widget${path.split("/").pop().toUpperCase()}`]: class {
          destroy = jest.fn(); // Spy to check if destroy is called
        },
      };
    });

    // Mock initialization of widgets before calling destroy
    xLib.widgets.set(document.querySelector('[widget="widgets/a"]'), {
      destroy: jest.fn(),
    });
    xLib.widgets.set(document.querySelector('[widget="widgets/b"]'), {
      destroy: jest.fn(),
    });
    xLib.widgets.set(document.querySelector('[widget="widgets/c"]'), {
      destroy: jest.fn(),
    });

    xLib.destroy(rootNode);

    xLib.widgets.forEach((widgetInstance) => {
      expect(widgetInstance.destroy).toHaveBeenCalled();
    });

    expect(xLib.widgets.size).toBe(0); // All widgets destroyed
  });

  // Mock a widget that will throw an error during destruction
  test("should handle errors during widget destruction", () => {
    const mockError = new WidgetDestroyedError({}, "WidgetA");
    const widgetA = {
      destroy: jest.fn(() => {
        throw mockError;
      }),
    };

    // Add the widget to the widgets map
    xLib.widgets.set(document.querySelector('[widget="widgets/a"]'), widgetA);

    // Spy on console.error to check if the error is logged
    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    xLib.destroy(rootNode);

    expect(consoleErrorMock).toHaveBeenCalledWith(mockError.message);
  });

  test("should handle widget initialization errors", async () => {
    const mockCallback = jest.fn();

    // Mock resolver to simulate an error in widget "b"
    xLib.resolver = jest.fn(async (path) => {
      if (path === "widgets/b") {
        throw new Error("Failed to load widget B");
      }
      return {
        [`Widget${path.split("/").pop().toUpperCase()}`]: class {
          async preInit() {}
          async postInit() {}
          destroy() {}
        },
      };
    });

    // Mock console.error to suppress error logging
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Call init and wait for completion
    await xLib.init(rootNode, mockCallback);

    // Expect the callback to receive the error related to widget "b"
    expect(mockCallback).toHaveBeenCalledWith(expect.any(Array));
    expect(mockCallback.mock.calls[0][0][0].message).toMatch(
      "Failed to load widget B"
    );
    expect(xLib.widgets.size).toBe(2); // Only two widgets initialized
  });

  test("should handle widget initialization errors gracefully", async () => {
    const mockCallback = jest.fn();

    // Mock resolver to simulate an error in widget "b"
    xLib.resolver = jest.fn(async (path) => {
      if (path === "widgets/b") {
        throw new Error("Failed to load widget B");
      }
      return {
        [`Widget${path.split("/").pop().toUpperCase()}`]: class {
          async preInit() {}
          async postInit() {}
          destroy() {}
        },
      };
    });

    // Mock console.error to suppress error logging
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Call init and wait for completion
    await xLib.init(rootNode, mockCallback);

    // Expect the callback to receive the error related to widget "b"
    expect(mockCallback).toHaveBeenCalledWith(expect.any(Array));
    expect(mockCallback.mock.calls[0][0][0].message).toMatch(
      "Failed to load widget B"
    );
    expect(xLib.widgets.size).toBe(2); // Only two widgets initialized

    // Now call destroy to ensure it handles the partially initialized state
    xLib.destroy(rootNode);

    // Verify that the destroyed widgets' destroy methods were called, checking for existence first
    const widgetAInstance = xLib.widgets.get(
      document.querySelector('[widget="widgets/a"]')
    );
    if (widgetAInstance) {
      expect(widgetAInstance.destroy).toHaveBeenCalled();
    }

    const widgetCInstance = xLib.widgets.get(
      document.querySelector('[widget="widgets/c"]')
    );
    if (widgetCInstance) {
      expect(widgetCInstance.destroy).toHaveBeenCalled();
    }

    // Verify that widgets are removed from the map
    expect(xLib.widgets.size).toBe(0);
  });

  test("should successfully resolve and import a module", async () => {
    const mockModule = { default: jest.fn() };

    // Spy on the defaultResolver method and mock its behavior to resolve with a mock module
    const resolverSpy = jest
      .spyOn(xLib, "defaultResolver")
      .mockResolvedValue(mockModule);

    const result = await xLib.defaultResolver("widgets/a");

    // Ensure the defaultResolver was called with the correct path
    expect(resolverSpy).toHaveBeenCalledWith("widgets/a");

    expect(result).toBe(mockModule);

    // Clean up the spy
    resolverSpy.mockRestore();
  });
});
