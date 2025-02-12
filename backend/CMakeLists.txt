# Especifica la versión mínima de CMake requerida
cmake_minimum_required(VERSION 3.10)

# Define el nombre del proyecto
project(backend_main)

# Usa C++23
set(CMAKE_CXX_STANDARD 23)

# Agrega el directorio de módulos personalizados de CMake
set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/cmake/")

# Encuentra las dependencias externas
find_package(Boost REQUIRED)

# Especifica la ruta de OpenSSL (ajústala si es necesario)
set(OPENSSL_ROOT_DIR "/opt/homebrew/opt/openssl@3")
find_package(OpenSSL REQUIRED)

# Define los archivos fuente del proyecto
set(
    SOURCES
    src/connection.cpp
    src/database/database_manager.cpp
)

# Configura los directorios de inclusión
include_directories(
    ${CMAKE_CURRENT_LIST_DIR}/include
    ${CMAKE_CURRENT_LIST_DIR}/include/asio
    ${CMAKE_CURRENT_LIST_DIR}/include/crow
    ${CMAKE_CURRENT_LIST_DIR}/include/jdbc
    ${OPENSSL_INCLUDE_DIR}
    ${Boost_INCLUDE_DIRS}
)

# Especifica directorios adicionales de librerías
link_directories(
    ${CMAKE_CURRENT_LIST_DIR}/lib
)

# Agrega el ejecutable
add_executable(backend ${SOURCES})

# Copia automáticamente las librerías de OpenSSL a ./lib
add_custom_target(copy_ssl_libs ALL
    COMMAND ${CMAKE_COMMAND} -E copy ${OPENSSL_SSL_LIBRARY} ${CMAKE_CURRENT_LIST_DIR}/lib/
    COMMAND ${CMAKE_COMMAND} -E copy ${OPENSSL_CRYPTO_LIBRARY} ${CMAKE_CURRENT_LIST_DIR}/lib/
)

# Asegurar que las librerías de OpenSSL sean copiadas antes de compilar el ejecutable
add_dependencies(backend copy_ssl_libs)

# Configurar RPATH para que el ejecutable busque en ./lib
set(CMAKE_INSTALL_RPATH "@executable_path/../lib")
set(CMAKE_BUILD_WITH_INSTALL_RPATH TRUE)

# Enlazar librerías necesarias
target_link_libraries(
    backend PRIVATE
    mysqlcppconn
    OpenSSL::SSL
    OpenSSL::Crypto
    ${Boost_LIBRARIES}
)
