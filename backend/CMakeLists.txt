cmake_minimum_required(VERSION 3.10)
project(backend_main)

set(CMAKE_CXX_STANDARD 23)

# Header directories (from the backend directory)
include_directories(
    ${CMAKE_CURRENT_LIST_DIR}/include/jdbc
)

# Library directories (if needed)
link_directories(
    ${CMAKE_CURRENT_LIST_DIR}/lib  # Relative path from backend
)

# Configure the executable
add_executable(backend src/connection.cpp)  # connection.cpp is inside src

# Specify libraries to link
target_link_libraries(backend mysqlcppconn)


