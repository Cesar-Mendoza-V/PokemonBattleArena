// [LOGOUT_ENDPOINT] - Elimina la cookie y borra el token de la BD
CROW_ROUTE(app, "/logout").methods("POST"_method)(
    [&db](const crow::request& req) {
        auto it = req.headers.find("Cookie");

        if (it == req.headers.end() || it->second.find("session_token=") == std::string::npos) {
            return crow::response(401, "No active session found");
        }

        // Extraer el token de la cookie
        std::string cookieHeader = it->second;
        std::string token = cookieHeader.substr(cookieHeader.find("session_token=") + 14);
        size_t endPos = token.find(";");
        if (endPos != std::string::npos) {
            token = token.substr(0, endPos);
        }

        // Eliminar la sesión en la base de datos
        db.clear_session_token(token);

        // Eliminar la cookie de sesión
        crow::response res(200);
        res.set_header("Set-Cookie", "session_token=; Max-Age=0; HttpOnly; Secure; SameSite=Strict");
        res.json_value["message"] = "Logout successful";
        res.json_value["status"] = 200;
        return res;
    });


// [LOGOUT_ENDPOINT] - Elimina la cookie de sesión sin modificar el login
CROW_ROUTE(app, "/logout").methods("POST"_method)(
    [](const crow::request& req) {
        crow::response res(200);
        res.set_header("Set-Cookie", "session_token=; Max-Age=0; HttpOnly; Secure; SameSite=Strict");
        res.json_value["message"] = "Logout successful";
        res.json_value["status"] = 200;
        return res;
    });