#include <iostream>
#include <mysql_connection.h>
#include <mysql_driver.h>
#include <cppconn/statement.h>
#include <cppconn/resultset.h>
#include <cppconn/exception.h>

int main() {
    try {
        sql::mysql::MySQL_Driver *driver;
        sql::Connection *conn;
        sql::Statement *stmt;
        sql::ResultSet *res;

        // Crear conexión
        driver = sql::mysql::get_mysql_driver_instance();
        conn = driver->connect("tcp://localhost:3306", "root", "12345678");

        // Seleccionar base de datos
        conn->setSchema("test");

        // Crear y ejecutar consulta
        stmt = conn->createStatement();
        res = stmt->executeQuery("SELECT * FROM users");
        
        // Mostrar resultados
        while (res->next()) {
            std::cout << "Username: " << res->getString("username") << " - Password: " << res->getString("password") << std::endl;
        }


        // Liberar memoria
        delete res;
        delete stmt;
        delete conn;
    } catch (sql::SQLException &e) {
        std::cerr << "Error MySQL: " << e.what() << std::endl;
    }

    return 0;
}