#!/bin/bash

set -e
# Detect user info and working dir
USER_NAME="$(whoami)"
USER_HOME="$HOME"
APP_DIR="$(pwd)"
USER_SYSTEMD_DIR="$USER_HOME/.config/systemd/user"
ROOT_SYSTEMD_DIR="/etc/systemd/system"

echo "🔧 Iniciando setup de serviços systemd..."

# Função para escrever arquivo de forma idempotente com backup
write_service() {
  local target="$1"
  local content="$2"

  if [ -f "$target" ]; then
    if ! diff -q <(echo "$content") "$target" > /dev/null; then
      cp "$target" "$target.bak"
      echo "$content" > "$target"
      echo "🔁 Atualizado $target (backup em .bak)"
    else
      echo "✅ $target já está atualizado"
    fi
  else
    echo "$content" > "$target"
    echo "➕ Criado $target"
  fi
}

# Cria pasta do usuário
echo "📁 Criando diretório $USER_SYSTEMD_DIR (se necessário)..."
mkdir -p "$USER_SYSTEMD_DIR"

# === Serviços do usuário ===

write_service "$USER_SYSTEMD_DIR/calc-server.service" "
[Unit]
Description=Calculadora Pegada - Backend (porta 8080)
After=default.target

[Service]
Type=simple
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/make run-calc-server
Restart=on-failure
RestartSec=2

[Install]
WantedBy=default.target
"

write_service "$USER_SYSTEMD_DIR/calc-app.service" "
[Unit]
Description=Calculadora Pegada - Backend (porta 5174)
After=default.target

[Service]
Type=simple
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/make run-calc-app
Restart=on-failure
RestartSec=2

[Install]
WantedBy=default.target
"

write_service "$USER_SYSTEMD_DIR/node-frontend.service" "
[Unit]
Description=Calculadora Pegada - Frontend (porta 5175)
After=graphical-session.target

[Service]
Type=simple
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/make run-node
Restart=on-failure
RestartSec=2
Environment=PATH=/home/souwattone/.nvm/versions/node/v18.20.8/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin:/snap/bin
[Install]
WantedBy=default.target
"

# === Serviço root ===

write_service "$ROOT_SYSTEMD_DIR/barcode-reader.service" "
[Unit]
Description=Leitor de Código de Barras (USB)
After=multi-user.target udev.service

[Service]
Type=simple
User=root
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/make run-barcode
Restart=on-failure
RestartSec=2

[Install]
WantedBy=multi-user.target
"

echo "🔄 Habilitando lingering para $USER_NAME..."
sudo loginctl enable-linger "$USER_NAME"

if [ "$(whoami)" = "$USER_NAME" ]; then
  echo "🔁 Recarregando systemd do usuário..."
  systemctl --user daemon-reload

  echo "🟢 Habilitando serviços do usuário..."
  systemctl --user enable calc-server.service
  systemctl --user enable calc-app.service
  systemctl --user enable node-frontend.service
else
  echo "⚠️ Você não está logado como $USER_NAME, portanto os serviços do usuário não foram ativados agora."
  echo "👉 Para finalizar, entre como $USER_NAME e rode:"
  echo "   systemctl --user daemon-reload"
  echo "   systemctl --user enable calc-server.service calc-app.service node-frontend.service"
fi

echo "🔁 Recarregando systemd do root..."
sudo systemctl daemon-reload

echo "🟢 Habilitando serviço root..."
sudo systemctl enable barcode-reader.service

echo ""
echo "✅ Setup finalizado!"
echo "📦 Serviços prontos:"
echo "  - Usuário: calc-server, calc-app, node-frontend"
echo "  - Sistema: barcode-reader"