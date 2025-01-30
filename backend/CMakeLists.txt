cmake_minimum_required(VERSION 3.10)
project(backend_main)

set(CMAKE_CXX_STANDARD 23)

# Directorios de encabezados (desde el directorio backend)
include_directories(
    ${CMAKE_CURRENT_LIST_DIR}/include/jdbc  # Ruta relativa desde backend
)

# Directorios de bibliotecas (si es necesario)
link_directories(
    ${CMAKE_CURRENT_LIST_DIR}/lib  # Ruta relativa desde backend
)

# Configurar el ejecutable
add_executable(backend src/connection.cpp)  # connection.cpp está dentro de src