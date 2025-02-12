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
The project runs **C++** *version 23*, and the minimum **CMake** version required for the project to run is *version 3.30*. If you're not sure which CMake version you have installed, use the following command in the terminal to get your current CMake version:
``` bash
cmake --version
```

### Prerequisites
Before setting up the backend, make sure you have the following installed:

#### For macOS:
1. Install Homebrew if not already installed:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. To install dependencies and run the project, execute the following commands:
```bash
xattr -d com.apple.quarantine ./run.sh
chmod +x ./run.sh
./run.sh
```

#### For Windows:
1. Install [Visual Studio](https://visualstudio.microsoft.com/downloads/) with C++ development tools
2. Install [CMake](https://cmake.org/download/)
3. Install [MySQL](https://dev.mysql.com/downloads/installer/)
4. Install [Boost](https://www.boost.org/users/download/)

### Database Setup
1. Start MySQL Server:
   - macOS: `brew services start mysql`
   - Windows: Through Services app or `net start mysql` in admin command prompt

2. Create the database:
```sql
mysql -u root -p
CREATE DATABASE pruebaBase;
```

### Environment Setup
1. In the `backend` folder, create a `.env` file with your database credentials:
```
DB_HOST=tcp://127.0.0.1:3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=pruebaBase
```

### Building the Project

#### For macOS:
```bash
./run.sh
```

#### For Windows:
```cmd
cd backend
mkdir build
cd build
cmake ..
cmake --build .
```

### Running the Server
After building, start the server (make sure to be inside the 'build' folder):
- macOS: `./backend`
- Windows: `.\Debug\backend.exe` or `.\Release\backend.exe`

The server will start running on `http://localhost:3000`.

### API Endpoints

### Adding New Functionality

#### Adding a New Database Function
1. In `include/database/database_manager.hpp`:
   - Declare your new function in the DatabaseManager class
   - Follow the existing function declaration patterns

2. In `src/database/database_manager.cpp`:
   - Implement your declared function
   - Use try-catch blocks for error handling
   - Use prepared statements for database queries

#### Adding a New Endpoint
1. In `src/connection.cpp`, locate the endpoints section (where other CROW_ROUTE are defined)
2. Add your new endpoint following this pattern:
```cpp
CROW_ROUTE(app, "/your-endpoint").methods(crow::HTTPMethod::POST/GET)
([&db](const crow::request& req) {
    // Your endpoint logic here
});
```

3. Remember to:
   - Handle requests and responses in JSON format
   - Use the ApiResponse structure for consistent responses
   - Include appropriate error handling
   - Test your endpoint before committing

### Common Response Format
All endpoints should return responses in this format:
```json
{
    "httpStatusCode": number,
    "message": "string"
}
```

### Testing the API
You can test the signup endpoint using curl on your terminal:
```bash
curl -X POST http://localhost:3000/your_endpoint_method \
  -H "Content-Type: application/json" \
  -d '{
    "field": "information"
  }'
```
Or you can make use of Postman and follow these steps:

1. Open Postman
2. Create a new request
3. Configure the request as follows:
   - Method: `POST/GET/PUT/PATCH/DELETE/HEAD`
   - URL: `http://localhost:3000/your_endpoint_method`
   - Headers:
     ```
     Content-Type: application/json
     ```
   - Body: 
     - Select "raw" and "JSON"
     - Paste this JSON and modify it to your convenience:
     ```json
     {
         "field": "information",
     }
     ```

### Common Issues and Solutions
1. **MySQL Connection Issues**:
   - Verify MySQL is running
   - Check credentials in .env file
   - Ensure database exists

2. **Build Errors**:
   - Verify all dependencies are installed
   - Check CMake version compatibility
   - Ensure C++ compiler supports C++23

3. **ASIO/Crow Errors**:
   - Verify Boost and ASIO are properly installed
   - Check include paths in CMakeLists.txt

4. **Missing Crow Submodule**:
   If after pulling changes you notice the 'external/Crow' folder is empty or missing, you'll need to initialize and update the submodule. Run these commands from the backend folder:
   ```bash
   git submodule init
   git submodule update

### Project Structure (Backend)
```
backend/
├── .env                  (not in repository - create locally)
├── .env.example         (template for .env)
├── CMakeLists.txt       (build configuration)
├── external/            (external dependencies)
│   └── Crow/           (Crow framework submodule)
├── include/             (header files)
│   ├── database/
│   └── models/
└── src/                 (source files)
    └── database/
```