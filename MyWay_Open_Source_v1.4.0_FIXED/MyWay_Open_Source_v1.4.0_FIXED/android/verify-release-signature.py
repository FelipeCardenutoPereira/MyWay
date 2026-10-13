#!/usr/bin/env python3
"""Fail the build if an APK has no APK Signing Block (v2/v3+)."""
from pathlib import Path
import struct, sys
p=Path(sys.argv[1] if len(sys.argv)>1 else 'build/outputs/apk/release/MyWay-release.apk')
b=p.read_bytes(); magic=b'APK Sig Block 42'
pos=b.rfind(magic)
if pos < 0:
    raise SystemExit(f'ERRO: {p} não possui APK Signing Block v2/v3+. Não distribuir este APK.')
# Basic structural check: magic must be directly before ZIP Central Directory.
cd=pos+16
if b[cd:cd+4] != b'PK\x01\x02':
    raise SystemExit('ERRO: APK Signing Block existe, mas não está antes do Central Directory.')
size=struct.unpack_from('<Q', b, pos-8)[0]
start=cd-(size+8)
if start < 0 or struct.unpack_from('<Q',b,start)[0] != size:
    raise SystemExit('ERRO: APK Signing Block inconsistente.')
print(f'OK: assinatura APK v2/v3+ detectada em {p.name}.')
