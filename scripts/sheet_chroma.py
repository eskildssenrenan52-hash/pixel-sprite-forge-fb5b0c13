#!/usr/bin/env python3
"""Remove fundo solido (magenta + linhas de grade cinza) de sprite sheets.

Uso: python3 scripts/sheet_chroma.py entrada.png saida.png
Mantem o alinhamento do grid intacto (nao corta nem redimensiona a imagem).
"""
import sys
from collections import deque
from PIL import Image

MAGENTA = (255, 0, 255)


def is_bg(px):
    r, g, b = px[:3]
    # magenta puro (com tolerancia)
    if abs(r - MAGENTA[0]) < 70 and g < 90 and abs(b - MAGENTA[2]) < 70:
        return True
    # linhas de grade cinza neutras
    mx, mn = max(r, g, b), min(r, g, b)
    if mx - mn < 18 and 80 < mx < 200:
        return True
    return False


def main(inp, out):
    img = Image.open(inp).convert("RGBA")
    w, h = img.size
    px = img.load()
    seen = bytearray(w * h)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            q.append((x, y))
    while q:
        x, y = q.popleft()
        i = y * w + x
        if seen[i]:
            continue
        seen[i] = 1
        if not is_bg(px[x, y]):
            continue
        px[x, y] = (0, 0, 0, 0)
        for nx, ny in ((x+1, y), (x-1, y), (x, y+1), (x, y-1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx]:
                q.append((nx, ny))
    # varredura extra: magenta residual dentro das celulas
    for y in range(h):
        for x in range(w):
            p = px[x, y]
            if p[3] and p[0] > 180 and p[1] < 80 and p[2] > 180:
                px[x, y] = (0, 0, 0, 0)
    img.save(out, "PNG")
    print(f"ok: {out} ({w}x{h})")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
