#!/usr/bin/env python3
"""
One‑shot SEEG calculator using the live spreadsheet via UNO.
Keeps connection open between calls (singleton pattern) for speed.
"""
import threading, uno, unohelper, json
from pathlib import Path
from com.sun.star.beans import PropertyValue
from com.sun.star.connection import NoConnectException

LO_URL = "uno:socket,host=127.0.0.1,port=2002;urp;StarOffice.ComponentContext"
FILE = (
    Path("~/expo/CalculadoraPegada/table/SEEG_Pessoas.ods")  # your relative‑with‑tilde path
    .expanduser()                                            # → /home/USER/…
    .resolve()                                               # make it absolute, follows symlinks
    .as_uri()                                                # → file:///home/USER/…
)

_lock   = threading.Lock()
_ctx    = None
_loader = None
_doc    = None

def _connect():
    global _ctx, _loader
    if _ctx:        # already connected
        return
    local  = uno.getComponentContext()
    resolver = local.ServiceManager.createInstanceWithContext(
        "com.sun.star.bridge.UnoUrlResolver", local)
    _ctx = resolver.resolve(LO_URL)
    _loader = _ctx.ServiceManager.createInstanceWithContext(
        "com.sun.star.frame.Desktop", _ctx)

        
def calculate(inputs: dict) -> dict:
    with _lock:
        _connect()                          # still reuse the UNO connection

        # open a NEW doc for this request
        props = (PropertyValue("Hidden", 0, True, 0),)
        doc = _loader.loadComponentFromURL(FILE, "_blank", 0, props)
        print(inputs)

        sheet = doc.Sheets["CALCULADORA"]
        sheet["B4"].String  = inputs["estado"]
        sheet["B20"].Value  = 1
        sheet["B22"].Value  = inputs["kwh_mes"]
        sheet["B11"].Value  = inputs["gas"]
        sheet["B39"].Value = inputs["boi"]
        sheet["B41"].Value = inputs["porco"]
        sheet["B40"].Value = inputs["frango"]
        
        
        doc.calculateAll()

        result = {
            "total_tCO2": sheet["B79"].Value,
            "elec_tCO2" : sheet["C30"].Value,
        }

        doc.close(True)                     # OK, we’re done
        return result
