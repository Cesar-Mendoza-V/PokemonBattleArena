# Copyright 2024 Pokemon Battle Arena Project
# CMake configuration file for building the backend server

# [CMAKE_VERSION] - Specify the minimum required CMake version
cmake_minimum_required(VERSION 3.10)

# [PROJECT_CONFIG] - Define the project name and version
project(backend_main)

# Use C++23 standard
set(CMAKE_CXX_STANDARD 23)

# [DEPENDENCIES] - Configure and find required external libraries
# Add custom CMake modules directory
set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/cmake/")

# Find external dependencies
cmake_policy(SET CMP0167 NEW)
find_package(Boost 1.71 REQUIRED)
find_package(CURL REQUIRED)

# Specify OpenSSL path (adjust if needed)
set(OPENSSL_ROOT_DIR "/opt/homebrew/opt/openssl@3")
find_package(OpenSSL REQUIRED)

# [SOURCE_FILES] - Define project source files
set(
    SOURCES
    src/connection.cpp
    src/database/database_manager.cpp
    src/services/pokemon_generator.cpp
)

# [INCLUDE_DIRS] - Configure include directories
include_directories(
    ${CMAKE_CURRENT_LIST_DIR}/include
    ${CMAKE_CURRENT_LIST_DIR}/include/asio
    ${CMAKE_CURRENT_LIST_DIR}/include/crow
    ${CMAKE_CURRENT_LIST_DIR}/include/jdbc
    ${CMAKE_CURRENT_LIST_DIR}/include/nlohmann
    ${CMAKE_CURRENT_LIST_DIR}/include/cpr
    ${OPENSSL_INCLUDE_DIR}
    ${Boost_INCLUDE_DIRS}
    ${CURL_INCLUDE_DIRS}
)

# [LIBRARY_DIRS] - Specify additional library directories
link_directories(
    ${CMAKE_CURRENT_LIST_DIR}/lib
)

# [EXECUTABLE] - Add the executable target
add_executable(backend ${SOURCES})

# [SSL_CONFIG] - Automatically copy OpenSSL libraries to ./lib
add_custom_target(copy_ssl_libs ALL
    COMMAND ${CMAKE_COMMAND} -E copy ${OPENSSL_SSL_LIBRARY} ${CMAKE_CURRENT_LIST_DIR}/lib/
    COMMAND ${CMAKE_COMMAND} -E copy ${OPENSSL_CRYPTO_LIBRARY} ${CMAKE_CURRENT_LIST_DIR}/lib/
)

# Ensure OpenSSL libraries are copied before building the executable
add_dependencies(backend copy_ssl_libs)

# [RPATH_CONFIG] - Configure RPATH to look for libraries in ./lib
set(CMAKE_INSTALL_RPATH "@executable_path/../lib")
set(CMAKE_BUILD_WITH_INSTALL_RPATH TRUE)

# [LINKING] - Link required libraries
target_link_libraries(
    backend PRIVATE
    mysqlcppconn
    OpenSSL::SSL
    OpenSSL::Crypto
    ${Boost_LIBRARIES}
    ${CURL_LIBRARIES}
)