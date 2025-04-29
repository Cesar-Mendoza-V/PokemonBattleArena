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

## Backend Setup (Spring Boot)

### Quick Start Guide

1. **Install Prerequisites**:
   - Java 21 or higher
   - PostgreSQL database

2. **Database Setup**:
   - Create a PostgreSQL database named `pokemondb`

3. **Configure Environment**:
   - Create a `.env` file in the `backend-springboot` folder:
   ```
   DB_URL=jdbc:postgresql://localhost:5432/pokemondb 
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=makeThisALongRandomString
   JWT_EXPIRATION=86400000
   ```
4. **Run the Backend**:
   - On macOS/Linux:
   ```
   cd backend-springboot
   ./mvnw spring-boot:run
   ```
   - On Windows:
   ```
   cd backend-springboot
   mvnw.cmd spring-boot:run
   ```

The API will be available at `http://localhost:3000/api`
