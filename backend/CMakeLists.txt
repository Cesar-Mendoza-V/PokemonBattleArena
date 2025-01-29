cmake_minimum_required(VERSION 3.30)
project(backend_main)

set(CMAKE_CXX_STANDARD 23)

# Add include path directories
include_directories(
    ${CMAKE_SOURCE_DIR}/include
)

# Add lib path directories
link_directories(
    ${CMAKE_SOURCE_DIR}/lib
)

# Setting up stuff
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR}/build) # Path for build executable
add_executable(backend main.cpp) # Executable name and files needed
