#!/bin/bash

# Navigate to the target directory
cd expo/CalculadoraPegada/ || { echo "Directory not found"; exit 1; }

# Run the Python script
python3 calc_server.py
