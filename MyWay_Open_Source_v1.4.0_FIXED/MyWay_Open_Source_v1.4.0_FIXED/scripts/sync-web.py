#!/usr/bin/env python3
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'web'
TARGETS = [ROOT / 'android' / 'assets' / 'www', ROOT / 'windows' / 'current-www']

for target in TARGETS:
    target.mkdir(parents=True, exist_ok=True)
    # Preserve platform-only files only if they are outside the canonical www tree.
    for child in target.iterdir():
        if child.is_dir():
            shutil.rmtree(child)
        else:
            child.unlink()
    for item in SRC.iterdir():
        dest = target / item.name
        if item.is_dir():
            shutil.copytree(item, dest)
        else:
            shutil.copy2(item, dest)
    print(f'Sincronizado: {target.relative_to(ROOT)}')
