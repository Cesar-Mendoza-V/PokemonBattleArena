#!/bin/bash

if brew list openssl &>/dev/null; then
    echo "OpenSSL is already installed."
else
    echo "Installing OpenSSL..."
    brew install openssl
fi

echo "Modifying library paths in libmysqlcppconn..."

install_name_tool -change libssl.3.dylib @rpath/libssl.3.dylib ./lib/libmysqlcppconn.10.9.2.0.dylib
install_name_tool -change libcrypto.3.dylib @rpath/libcrypto.3.dylib ./lib/libmysqlcppconn.10.9.2.0.dylib

echo "Paths modified successfully."

echo "Verifying changes with otool..."
otool -L ./lib/libmysqlcppconn.10.9.2.0.dylib

echo "Removing build folder..."
rm -rf ./build

echo "Creating new build folder..."
mkdir ./build
cd ./build

echo "Running CMake..."
cmake ..
echo "Compiling with make..."
make
echo "Compilation finished successfully."
echo ""
echo ""
echo ""
echo ""
echo ""
echo ""
echo ""
echo ""
echo ""
echo ""
echo ""
echo ""
echo "+----------------------+"
echo "| Running backend... |"
echo "+----------------------+"
./backend