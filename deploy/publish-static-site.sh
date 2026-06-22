#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_ROOT="${1:-/var/www/coderslife/current}"
TARGET_PARENT="$(dirname "$TARGET_ROOT")"

ENTRY_HTML="程序员生存模拟器.html"

rm -rf "$TARGET_ROOT"
mkdir -p "$TARGET_ROOT"
chmod 0755 "$TARGET_PARENT"

install -m 0644 "$PROJECT_ROOT/$ENTRY_HTML" "$TARGET_ROOT/index.html"

find "$TARGET_ROOT" -type d -exec chmod 0755 {} \;
find "$TARGET_ROOT" -type f -exec chmod 0644 {} \;

echo "Published static site to $TARGET_ROOT"
