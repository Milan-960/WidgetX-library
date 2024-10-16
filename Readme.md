# Widget Management System

## Project Overview

### This project is a Widget Management System built using a custom JavaScript library called X. The library handles the initialization, destruction, and state management of widgets in a DOM tree. It is designed to be environment-agnostic, meaning it can run both in a browser and in Node.js (with the help of JSDOM). The project features four primary operations (Init, Destroy, Done, and Fail), each of which triggers specific behaviors in the widgets.

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
