![Auto Assign](https://github.com/Cesar-Mendoza-V/demo-repository/actions/workflows/auto-assign.yml/badge.svg)

![Proof HTML](https://github.com/Cesar-Mendoza-V/demo-repository/actions/workflows/proof-html.yml/badge.svg)

# Pokemon Battle Arena
---
## Frontend FAQ

- Under the `src` folder is the whole project.
- There you'll find a `pages`, `components`, and `styles` folders, here you can add or modify the files that you need.
- Avoid modifing the root files such as `App.tsx`, `main.tsx` and `index.html` unless absolutely necessary.

### How do I set up the React environment?

1.  Have `npm` installed in your system.
2.  Run `npm install` in a terminal inside the repository.
3.  Finally, once all the dependencies are installed, run `npm run dev`.
4.  The terminal will show a local address where the page is running with live changes.

```
VITE v6.0.11  ready in 133 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### What if I need a new dependency?

1. Head to the `package.json`
2. If you need the dependency on the dev environment only, add it to the `devDependencies`, however if the dependency is needed for the functioning of the app, add it to the `dependencies`.
3. Run `npm install` in a terminal inside the repository.

### Good practices

- When creating a component that can be reused, save it under the `components` folder, under it's own subfolder named like the component with it's own `.css` file (use the `Header` component as an example).
- When using colors in your styling, avoid hardcoding them, under the `global.css` add or use a color variable from there.

---

## Backend FAQ

- The project runs **C++** *version 23*, and the minimum **CMake** version required for the project to run is *version 3.30*. If you're not sure which Cmake version you have installed, use the following command in the terminal to get your current CMake version:
``` bash
$ cmake --version

#Output: 
cmake version 3.30.3

CMake suite maintained and supported by Kitware (kitware.com/cmake).
```
- The project lives under the `backend` directory, so you will have to open it from that directory instead of the root project folder.
- There you will find the directories named `src`, `lib`, `include`, `build` and `dependencies`, each having a purpose.
  - The `src` folder is where the main source code of the project resides. This is where you will write and modify the core logic of the application.
  - The `lib` folder contains external libraries that the project depends on. These are typically precompiled or third-party libraries.
  - The `include` folder is for header files, which declare the interfaces used in the project. It often includes `.h` or `.hpp` files that are shared across multiple source files.
  - The `build` folder is used for compiled output and build artifacts. This is where the results of your build process will be stored.
  - The `dependencies` folder includes any third-party tools or modules that the project relies on, which are not part of the core libraries.
- In the `backend` directory, you will also find the `CMakeLists.txt` file. This is where you should:
  - Add any new source files or libraries to be included in the build process.
  - Specify project configurations, such as compiler options or additional dependencies.

Make sure to navigate to the `backend` directory before building or running the project, and ensure all dependencies are installed properly.
