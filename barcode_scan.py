from evdev import InputDevice, categorize, ecodes
import requests

# Altere para o seu dispositivo!
device_path = "/dev/input/event7"
dev = InputDevice(device_path)

buffer = ""
print(f"Escutando leitor em {device_path}...")
key_map = {
    # números
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
    # letras (sem shift)
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
    # símbolos básicos
    12: "-",
    13: "=",
    26: "[",
    27: "]",
    39: ";",
    40: "'",
    41: "`",
    51: ",",
    52: ".",
    53: "/",
    # ações
    14: "backspace",
    28: "enter",
    57: "space",
}

mapping = {
    "10000229":"LEGUMES",
    "10000113":"AIR-FRIER",
    "10000090":"AQUECEDOR",
    "10000175":"ARROZ",
    "10000007":"AVIÃO",
    "10000038":"BICICLETA",
    "10000137":"CARNE DE BOI",
    "10000144":"CARNE DE PORCO",
    "10000014":"CARRO",
    "10000076":"CHUVEIRO ELÉTRICO",
    "10000083":"DESKTOP",
    "10000182":"FEIJÃO",
    "10000151":"FRANGO",
    "10000212":"FRUTAS",
    "10000052":"GELADEIRA",
    "10000120":"LAVA LOUÇAS ",
    "10000069":"NOTEBOOK",
    "10000021":"ONIBUS",
    "10000168":"PEIXE",
    "10000199":"SALADA",
    "10000045":"TELEVISÃO"- 
}


for event in dev.read_loop():
    if event.type == ecodes.EV_KEY:
        key_event = categorize(event)
        if key_event.keystate == key_event.key_down:
            code = key_event.scancode
            print(f"Scancode: {code}")
            char = key_map.get(code, "")
            if not char:
                print(f"Scancode {code} não mapeado.")
                continue
            print(f"Caractere: {char}")
            if char == "enter":
                if buffer:
                    # strip and uppercase
                    buffer = buffer.strip().upper()
                    if buffer not in mapping.keys():
                        print ("warning, buffer not in mapping, sending DUMMY")
                        buffer = "DUMMY CODE"
                    else:
                        buffer = mapping[buffer]
                    print(f"Enviando código: {buffer}")
                    try:
                        requests.get(f"http://localhost:5174/scan/{buffer}")
                    except Exception as e:
                        print(f"Erro ao enviar: {e}")
                buffer = ""
            elif char == "backspace":
                buffer = buffer[:-1]
                print(f"Buffer: {buffer}")
            else:
                buffer += char
                print(f"Buffer: {buffer}")
