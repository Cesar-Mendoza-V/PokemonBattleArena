# Specifies the minimum CMake version required for this project
cmake_minimum_required(VERSION 3.10)

# Defines the project name for the backend main application
project(backend_main)

# Sets the C++ standard to C++23 for modern language features
set(CMAKE_CXX_STANDARD 23)

# Configures the module path to include custom CMake modules from the project's cmake directory
set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/cmake/")

# Finds required external dependencies
# Boost library is required for various utility functions
find_package(Boost REQUIRED)

# OpenSSL library is required for secure communication
find_package(OpenSSL REQUIRED)

# Attempts to find ASIO networking library
find_package(ASIO)

# Adds include directory for ASIO if not found in standard locations
# Specifically configures for Homebrew installation on macOS
if(NOT ASIO_FOUND)
 include_directories(/opt/homebrew/include)
endif()

# Adds Crow web framework as a subdirectory
# This allows using Crow's CMake configuration
add_subdirectory(${CMAKE_CURRENT_SOURCE_DIR}/external/Crow)

# Defines source files for the backend executable
# Includes connection and database management source files
set(SOURCES
 src/connection.cpp
 src/database/database_manager.cpp # Ensures database manager is compiled
)

# Configures include directories for header files
# Adds project-specific, external library, and system include paths
include_directories(
${CMAKE_CURRENT_LIST_DIR}/include
${CMAKE_CURRENT_LIST_DIR}/include/jdbc
${CMAKE_CURRENT_LIST_DIR}/external/Crow/include
${OPENSSL_INCLUDE_DIR}
${Boost_INCLUDE_DIRS}
)

# Specifies additional library directories
link_directories(
${CMAKE_CURRENT_LIST_DIR}/lib
)

# Creates the backend executable from the specified source files
add_executable(backend ${SOURCES})

# Links required libraries to the backend executable
# Uses PRIVATE linking to keep dependencies internal to this target
target_link_libraries(backend
 PRIVATE
 mysqlcppconn  # MySQL C++ connector
 Crow::Crow    # Crow web framework
${OPENSSL_LIBRARIES}  # OpenSSL security libraries
${Boost_LIBRARIES}    # Boost utility libraries
)