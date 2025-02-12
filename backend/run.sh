#!/bin/bash

echo "Modificando las rutas de las librerías en libmysqlcppconn..."

install_name_tool -change libssl.3.dylib @rpath/libssl.3.dylib ./lib/libmysqlcppconn.10.9.2.0.dylib
install_name_tool -change libcrypto.3.dylib @rpath/libcrypto.3.dylib ./lib/libmysqlcppconn.10.9.2.0.dylib

echo "Rutas modificadas correctamente."
echo "Verificando cambios con otool..."

otool -L ./lib/libmysqlcppconn.10.9.2.0.dylib

echo "Eliminando la carpeta build..."
rm -rf ./build

echo "Creando nueva carpeta build..."
mkdir ./build
cd ./build

echo "Ejecutando CMake..."
cmake ..

echo "Compilando con make..."
make

echo "Compilación finalizada con éxito."

echo ""
echo ""
echo ""
echo "+----------------------+"
echo "l Corriendo backend... l"
echo "+----------------------+"
./backend