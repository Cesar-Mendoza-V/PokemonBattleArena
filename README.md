![Auto Assign](https://github.com/Cesar-Mendoza-V/demo-repository/actions/workflows/auto-assign.yml/badge.svg)

![Proof HTML](https://github.com/Cesar-Mendoza-V/demo-repository/actions/workflows/proof-html.yml/badge.svg)

# Pokemon Battle Arena

## Frontend FAQ

- Under the `src` folder is the whole project.
- There you'll find a `pages`, `components`, and `styles` folders, here you can add or modify the files that you need.
- Avoid modifing the root files such as `App.tsx`, `main.tsx` and `index.html` unless absolutely necessary.

### How do I set up the React environment?

1.  Have `npm` installed in your system.
2.  Run `npm install` in a terminal inside the repository.
3.  Finally, once all the dependencies are installed, run `npm run dev`.
4.  The terminal will show a local address where the page is running with live changes.

### What if I need a new dependency?

1. Head to the `package.json`
2. If you need the dependency on the dev environment only, add it to the `devDependencies`, however if the dependency is needed for the functioning of the app, add it to the `dependencies`.
3. Run `npm install` in a terminal inside the repository.

### Good practices

- When creating a component that can be reused, save it under the `components` folder, under it's own subfolder named like the component with it's own `.css` file (use the `Header` component as an example).
- When using colors in your styling, avoid hardcoding them, under the `global.css` add or use a color variable from there.
