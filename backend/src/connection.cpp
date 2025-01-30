/* 

Para compilar (Ingresar paths manualmente):
g++ -o connection connection.cpp -I../include/jdbc -L../lib -lmysqlcppconn -std=c++11

Para correr(se debe de estar en la carpeta donde se encuentra el archivo): 
./connection

*/


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

        // Create connection
        system("clear");
        driver = sql::mysql::get_mysql_driver_instance();
        conn = driver->connect("tcp://localhost:3306", "root", "12345678");
        std::cout << "Database connection successful!!\n" << std::endl;

        // Select database
        conn->setSchema("test");

        // Create and execute query
        stmt = conn->createStatement();
        res = stmt->executeQuery("SELECT * FROM users");
        
        // Display results
        while (res->next()) {
            std::cout << "Username: " << res->getString("username") << " - Password: " << res->getString("password") << std::endl;
        }

        std::cout << "\n" << std::endl;

        // Free memory
        delete res;
        delete stmt;
        delete conn;
    } catch (sql::SQLException &e) {
        std::cerr << "MySQL Error: " << e.what() << std::endl;
    }

    return 0;
}
