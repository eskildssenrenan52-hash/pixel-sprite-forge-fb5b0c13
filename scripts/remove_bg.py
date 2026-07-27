#!/usr/bin/env python3
"""
Script de remoção de fundo por Chroma Key (Cor Sólida).
Remove fundos verdes (#00FF00), magentas (#FF00FF) ou qualquer cor sólida customizada
de imagens de sprites e portraits do jogo, tornando-as PNGs transparentes de alta qualidade.
"""

import sys
import os
try:
    from PIL import Image
except ImportError:
    print("Pillow não instalado. Instale com: pip install Pillow")
    sys.exit(1)

def remove_solid_background(input_path, output_path, bg_hex="00FF00", tolerance=45):
    """
    Remove a cor de fundo sólida de uma imagem e salva como PNG com transparência.
    
    :param input_path: Caminho da imagem de entrada (JPG, PNG, etc.)
    :param output_path: Caminho da imagem PNG de saída com transparência
    :param bg_hex: Cor Hexadecimal a remover (Padrão: '00FF00' para verde puro)
    :param tolerance: Tolerância de variação de cor (0 a 100)
    """
    if not os.path.exists(input_path):
        print(f"Erro: Arquivo {input_path} não encontrado.")
        return False

    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    # Converter Hex para RGB
    target_r = int(bg_hex[0:2], 16)
    target_g = int(bg_hex[2:4], 16)
    target_b = int(bg_hex[4:6], 16)

    newData = []
    for item in datas:
        r, g, b, a = item
        # Distância Euclidiana ou diferença simples de cor
        diff = max(abs(r - target_r), abs(g - target_g), abs(b - target_b))
        
        # Se estiver dentro da tolerância ou for fortemente verde/cor alvo
        if diff <= tolerance or (target_g > 200 and g > r + 30 and g > b + 30):
            # Transparente
            newData.append((0, 0, 0, 0))
        else:
            newData.append((r, g, b, a))

    img.putdata(newData)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "PNG")
    print(f"Sucesso! Imagem salva sem fundo em: {output_path}")
    return True

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Uso: python3 remove_bg.py <imagem_entrada> <imagem_saida> [cor_hex_ex_00FF00] [tolerancia_45]")
        sys.exit(1)

    inp = sys.argv[1]
    out = sys.argv[2]
    hex_color = sys.argv[3] if len(sys.argv) > 3 else "00FF00"
    tol = int(sys.argv[4]) if len(sys.argv) > 4 else 45

    remove_solid_background(inp, out, hex_color, tol)
