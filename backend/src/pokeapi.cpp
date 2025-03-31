#include <iostream>
#include <cpr/cpr.h>  //cambiar curl
#include <nlohmann/json.hpp>
#include "crow.h"

using json = nlohmann::json;
using namespace std;

// Función para obtener los datos del Pokémon desde la PokeAPI
json obtenerDatosPokemon(const string& nombre_pokemon) { // nombre_pokemon es el nombre del Pokémon
    string url = "https://pokeapi.co/api/v2/pokemon/" + nombre_pokemon; // URL de la PokeAPI
    
    CROW_LOG_INFO << "Realizando solicitud a: " << url;

    cpr::Response response = cpr::Get(cpr::Url{url}); // realiza la solicitud GET
    CROW_LOG_INFO << "Código de respuesta de PokeAPI: " << response.status_code;

    if (response.status_code == 200) { // convierte la respuesta en un objeto JSON
        try {
            json datos = json::parse(response.text);

            json resultado = { // extrae los datos necesarios del JSON
                {"nombre", datos["name"]},
                {"imagen", datos["sprites"]["front_default"]},
                {"tipo", json::array()},
                {"estadisticas", json::array()}
            };

            for (const auto& tipo : datos["types"]) { // extrae los tipos y estadísticas del Pokémon
                resultado["tipo"].push_back(tipo["type"]["name"]);
            }

            for (const auto& stat : datos["stats"]) { // crea un nuevo JSON con las estadísticas
                json stat_obj = {
                    {"nombre", stat["stat"]["name"]},
                    {"valor", stat["base_stat"]}
                };
                resultado["estadisticas"].push_back(stat_obj);
            }

            return resultado; // devuelve el JSON con los datos del Pokémon
        } catch (const exception& e) {
            CROW_LOG_ERROR << "Error al parsear JSON: " << e.what();
            return {{"error", "Error al procesar datos del Pokémon"}};
        }
    } else {
        return {
            {"error", "No se pudo obtener el Pokémon"}, // devuelve un JSON con un mensaje de error
            {"codigo", response.status_code}
        };
    }
}

int main() {
    crow::SimpleApp app;

    CROW_ROUTE(app, "/pokemon/<string>") // ruta para obtener los datos de un Pokémon
        .methods("GET"_method, "OPTIONS"_method)
        ([&](const crow::request& req, crow::response& res, string nombre_pokemon) {
            // CORS headers
            res.set_header("Access-Control-Allow-Origin", "*"); 
            res.set_header("Access-Control-Allow-Methods", "GET, OPTIONS");
            res.set_header("Access-Control-Allow-Headers", "Content-Type");

            if (req.method == crow::HTTPMethod::OPTIONS) {
                res.code = 204;
                res.end();
                return;
            }

            CROW_LOG_INFO << "Solicitud recibida para Pokémon: " << nombre_pokemon; // imprime el nombre del Pokémon
            json datos = obtenerDatosPokemon(nombre_pokemon);

            if (datos.contains("error")) {
                res.code = 500;
            } else {
                res.code = 200;
            }

            res.write(datos.dump(4));
            res.end();
        });

    int puerto = 8080;
    CROW_LOG_INFO << "Intentando iniciar servidor en puerto " << puerto; // inicia el servidor en el puerto especificado
    try {
        cout << "Servidor corriendo en http://localhost:" << puerto << endl; // imprime la URL del servidor
        app.port(puerto).multithreaded().run();
    } catch (const exception& e) {
        CROW_LOG_ERROR << "Error al iniciar el servidor: " << e.what();// imprime un mensaje de error si falla
        return 1;
    }

    return 0;
}