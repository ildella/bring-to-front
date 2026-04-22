#!/usr/bin/env bash
# install.sh — copy extension and compile schema

set -euo pipefail

EXTENSION_UUID="bring-to-front@local"
EXTENSION_DIR="$HOME/.local/share/gnome-shell/extensions/$EXTENSION_UUID"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "→ Installing $EXTENSION_UUID to $EXTENSION_DIR"
mkdir -p "$EXTENSION_DIR/schemas"

cp "$SCRIPT_DIR/metadata.json"  "$EXTENSION_DIR/"
cp "$SCRIPT_DIR/extension.js"   "$EXTENSION_DIR/"
cp "$SCRIPT_DIR/schemas/"*.xml  "$EXTENSION_DIR/schemas/"

echo "→ Compiling GSettings schema"
glib-compile-schemas "$EXTENSION_DIR/schemas/"

echo "→ Enabling extension (you may need to log out/in on Wayland)"
gnome-extensions enable "$EXTENSION_UUID" 2>/dev/null || true

echo ""
echo "✓ Done."
echo ""
echo "On Wayland you cannot restart gnome-shell in-session."
echo "Either log out and back in, or test in a nested shell:"
echo ""
echo "  sudo apt install -y mutter-dev-bin   # if not already installed"
echo "  dbus-run-session gnome-shell --devkit --wayland"
echo ""
echo "Inside the nested session, open a terminal and run:"
echo "  gnome-extensions enable $EXTENSION_UUID"
echo ""
echo "Watch logs with:"
echo "  journalctl -f -o cat /usr/bin/gnome-shell"
