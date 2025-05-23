from evdev import InputDevice, list_devices, ecodes
from threading import Thread
from queue import Queue
import requests
import time

# Identificador do seu leitor (nome parcial do dispositivo)
ALVO = "HID 28e9:0380"  # ou apenas "28e9"

# Busca o dispositivo correspondente
devices = [InputDevice(path) for path in list_devices()]
leitor = next((dev for dev in devices if ALVO.lower() in dev.name.lower()), None)

if not leitor:
    print(f"Dispositivo contendo '{ALVO}' não encontrado.")
    exit(1)

print(f"Usando dispositivo: {leitor.name} ({leitor.path})")

# Mapeamento de scancodes para caracteres (sem shift)
key_map = {
    2: "1",
    3: "2",
    4: "3",
    5: "4",
    6: "5",
    7: "6",
    8: "7",
    9: "8",
    10: "9",
    11: "0",
    16: "q",
    17: "w",
    18: "e",
    19: "r",
    20: "t",
    21: "y",
    22: "u",
    23: "i",
    24: "o",
    25: "p",
    30: "a",
    31: "s",
    32: "d",
    33: "f",
    34: "g",
    35: "h",
    36: "j",
    37: "k",
    38: "l",
    44: "z",
    45: "x",
    46: "c",
    47: "v",
    48: "b",
    49: "n",
    50: "m",
    14: "backspace",
    28: "enter",
}

# Mapeamento de códigos para nomes
mapping = {
    "10000229": "LEGUMES",
    "10000113": "AIR-FRIER",
    "10000090": "AQUECEDOR",
    "10000175": "ARROZ",
    "10000007": "AVIÃO",
    "10000038": "BICICLETA",
    "10000137": "CARNE DE BOI",
    "10000144": "CARNE DE PORCO",
    "10000014": "CARRO",
    "10000076": "CHUVEIRO ELÉTRICO",
    "10000083": "DESKTOP",
    "10000182": "FEIJÃO",
    "10000151": "FRANGO",
    "10000212": "FRUTAS",
    "10000052": "GELADEIRA",
    "10000120": "LAVA LOUÇAS ",
    "10000106": "LAVA ROUPAS",
    "10000069": "NOTEBOOK",
    "10000021": "ÔNIBUS",
    "10000168": "PEIXE",
    "10000199": "SALADA",
    "10000045": "TELEVISÃO",
}

buffer = ""
queue = Queue()


# Thread para envio HTTP
def sender_thread():
    while True:
        raw_code = queue.get()
        if raw_code is None:
            break

        barcode = mapping.get(raw_code)
        if barcode:
            print(f"Enviando: {barcode}")
            try:
                requests.get(f"http://localhost:5174/scan/{barcode}")
            except Exception as e:
                print(f"Erro ao enviar: {e}")
        else:
            print(f"Código não encontrado: {raw_code}")
        time.sleep(0.1)  # previne sobrecarga


Thread(target=sender_thread, daemon=True).start()

# Loop de leitura dos eventos
for event in leitor.read_loop():
    if event.type == ecodes.EV_KEY and event.value == 1:  # key down
        code = event.code
        char = key_map.get(code)

        if not char:
            continue

        if char == "enter":
            if buffer:
                queue.put(buffer)
                buffer = ""
        elif char == "backspace":
            buffer = buffer[:-1]
        else:
            buffer += char
