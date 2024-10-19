# WidgetX library

## Project Overview

### This project is a WidgetX library built using a custom JavaScript library called X. The library handles the initialization, destruction, and state management of widgets in a DOM tree. It is designed to be environment-agnostic, meaning it can run both in a browser and in Node.js (with the help of JSDOM). The project features four primary operations (Init, Destroy, Done, and Fail), each of which triggers specific behaviors in the widgets.

## Table of Contents

- [Requirements](#requirements)
- [Features](#features)

### Requirements:

1. Environment Agnostic: ✅

   - The library X must work in both browser and Node.js environments. In Node.js, it leverages JSDOM to simulate the DOM structure, ensuring compatibility across platforms.

2. Dynamic Widget Resolver: ✅

   - The library uses a dynamic resolver to load widgets. By default, dynamic imports (import()) are used to load widget modules, allowing flexibility in how widgets are managed and loaded.

3. Asynchronous Initialization and Synchronous Destruction: ✅

   - The X.init() method is asynchronous, meaning it waits for all widgets in the tree to initialize. The X.destroy() method, on the other hand, is synchronous, ensuring immediate cleanup of widgets.

4. Callback Handling in Init: ✅

   - The callback function to the X.init() method. This callback is called once after the entire widget tree has initialized or if there are any errors. Errors during widget initialization prevent child widgets from being initialized, and all encountered errors are passed to the callback.

5. Multiple Init and Destroy Calls: ✅

   - The library supports multiple calls to both X.init() and X.destroy() on any node in the tree, in any order. It guarantees that a widget's init and destroy methods are only called once per instance.

6. Tree Reset After Destroy: ✅

   - After calling X.destroy(), the tree or subtree behaves as though X.init() was never called. If a widget was in the process of being initialized and gets destroyed, a WidgetDestroyedError is thrown, and initialization for that widget is aborted.

7. Widget Initialization: ✅

   - Each widget is responsible for managing its own initialization state. The library provides an API for widgets to mark themselves as initialized in two stages: before subtree initialization and after subtree initialization. This ensures a flexible, widget-driven initialization process.

8. Syntactic Sugar for Event Handlers: ✅

   - Widgets that extend this base class automatically bind event handler methods (methods ending with Handler) to the widget instance, providing syntactic sugar for event handling.

### Features:

- Environment-Agnostic: The library works both in the browser and Node.js.
- Widget Lifecycle Management: Widgets can be initialized, destroyed, and updated using the provided buttons.
- Dynamic Widget Loading: Widgets are loaded dynamically using JavaScript’s native dynamic imports.
- Two-stage initialization:
  - Pre-initialization: Before child widgets are initialized.
  - Post-initialization: After child widgets are initialized.
- Clean API:
  - init(): Asynchronous method to initialize widgets.
  - destroy(): Synchronous method to destroy widgets and reset their state.
  - Automatic event handler binding for methods ending in Handler.
- Error Handling: Handles situations where a widget is destroyed during initialization by throwing a custom WidgetDestroyedError.
