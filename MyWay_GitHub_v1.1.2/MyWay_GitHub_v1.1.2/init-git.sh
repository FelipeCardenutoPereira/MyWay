#!/usr/bin/env sh
set -eu
if [ ! -d .git ]; then git init; git branch -M main; fi
git add .
echo "Arquivos adicionados ao stage. Faça: git commit -m 'MyWay 1.1.0'"
