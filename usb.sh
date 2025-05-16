#!/bin/bash

# Navega até o diretório da aplicação
cd expo/CalculadoraPegada
. ./bcsvenv/bin/activate

# Lista os dispositivos USB conectados
lsusb

# Executa o script de leitura de código de barras
python3 barcode_scan.py

