from evdev import InputDevice, categorize, ecodes
import requests

# Altere para o seu dispositivo!
device_path = "/dev/input/event14"
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
