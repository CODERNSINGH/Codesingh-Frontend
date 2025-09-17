# Online Code Editor Integration Guide

## Features Implemented
- Monaco Editor as the code editor UI
- Multi-language support: JavaScript (eval), Python (Pyodide), C++ (WASM placeholder)
- Language dropdown, Run and Clear buttons
- Split layout: editor (left), output/console (right), responsive with Tailwind
- Syntax highlighting, dark/light theme toggle
- Modular structure for easy language extension
- Error handling and output display
- Integrated into Course Dashboard sidebar (replaces "Coming Soon" for Online Compiler)

---

## Setup Steps

### 1. Install Dependencies
Run these commands **inside your frontend directory** (`React Frontend/Edtech`):

```
npm install @monaco-editor/react pyodide
```

- `@monaco-editor/react`: Monaco Editor React wrapper
- `pyodide`: Python runtime in browser (WebAssembly)

If you want to experiment with C++ in-browser execution, you can try:
```
npm install cpp-wasm-loader
```
(Currently, C++ is a placeholder in the UI.)

### 2. Add the OnlineCompiler Component
- Created `src/components/OnlineCompiler.jsx` with Monaco Editor, language dropdown, run/clear, output panel, and theme toggle.
- Handles JS (eval), Python (Pyodide), and C++ (placeholder for WASM runner).

### 3. Integrate Into Dashboard
- Updated `CourseDashboard.jsx` to show the OnlineCompiler when the sidebar item is clicked, instead of "Coming Soon".
- State is used to toggle between lectures and compiler view.

---

## Troubleshooting: Invalid Hook Call Error

**Error:**
```
Invalid hook call. Hooks can only be called inside of the body of a function component...
```

**Root Cause:**
- `@monaco-editor/react` was not installed in the actual frontend directory, causing React to be loaded twice or not at all for that package.

**Fix:**
- Run `npm install @monaco-editor/react` inside `React Frontend/Edtech`.
- Ensure only one version of React and React DOM is installed and deduped.
- Restart your dev server after installing.

**Verification:**
- Run `npm ls react react-dom @monaco-editor/react` and check that all are deduped and at the same version.

---

## Usage
- Go to a course dashboard, click "Online Compiler" in the sidebar.
- Write code, select language, and hit Run. Output/errors appear on the right.
- Toggle theme or clear output as needed.

---

## Extending
- To add more languages, extend the `SUPPORTED_LANGUAGES` array in `OnlineCompiler.jsx` and add a runner for the new language.
- For C++/other WASM languages, integrate a suitable WebAssembly runner.

---

## References
- [Monaco Editor React](https://www.npmjs.com/package/@monaco-editor/react)
- [Pyodide](https://pyodide.org/)
- [React DevTools](https://react.dev/link/react-devtools)

---

For further help, see the main README or contact the developer.
