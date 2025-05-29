.PHONY: all enable-user-services enable-root-service start stop status

# Caminhos
USER_SERVICES_DIR = ~/.config/systemd/user
SYSTEM_SERVICES_DIR = /etc/systemd/system

# Nomes dos serviços
USER_SERVICES = calc-server.service calc-app.service node-frontend.service
ROOT_SERVICE = barcode-reader.service

# === Ações gerais ===

all: enable-user-services enable-root-service start

enable-user-services:
	systemctl --user daemon-reload
	systemctl --user enable $(USER_SERVICES)

enable-root-service:
	sudo systemctl daemon-reload
	sudo systemctl enable $(ROOT_SERVICE)

start:
	systemctl --user start $(USER_SERVICES)
	sudo systemctl start $(ROOT_SERVICE)

stop:
	systemctl --user stop $(USER_SERVICES)
	sudo systemctl stop $(ROOT_SERVICE)

status:
	systemctl --user status $(USER_SERVICES) || true
	sudo systemctl status $(ROOT_SERVICE)
	
logs:
	journalctl --user $(foreach svc,$(USER_SERVICES),-u $(svc)) --no-pager -f || true
	sudo journalctl $(foreach svc,$(ROOT_SERVICE),-u $(svc)) --no-pager -f || true

logs-user:
	journalctl --user -u $(USER_SERVICES) --no-pager -f || true
# === Execução manual sem systemd ===

run-calc-server:
	python3 calc_server.py

run-calc-app:
	. .venv/bin/activate && python3 app.py

run-barcode:
	. .bcsvenv/bin/activate && python3 barcode_scan.py

run-node:
	cd frontend && npm run dev -- --host 0.0.0.0 --port 5175