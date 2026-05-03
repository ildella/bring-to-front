#!/bin/bash

set -e

# Ensure jq is installed
if ! command -v jq &> /dev/null; then
    echo "Error: 'jq' is not installed. Please install it to continue."
    exit 1
fi

# Extract UUID dynamically from metadata.json
UUID=$(jq -r '.uuid' metadata.json)
EXT_DIR="$HOME/.local/share/gnome-shell/extensions/$UUID"

echo "Installing GNOME extension '$UUID'..."

# Create extension directory
mkdir -p "$EXT_DIR"

# Copy essential files
cp extension.js metadata.json "$EXT_DIR/"

# Handle schemas
if [ -d "schemas" ]; then
    echo "Copying and compiling schemas..."
    cp -r schemas "$EXT_DIR/"
    glib-compile-schemas "$EXT_DIR/schemas/"
fi

echo "--------------------------------------------------"
echo "Extension installed to $EXT_DIR."
echo "Since you are on Wayland, you MUST log out and log back in for GNOME Shell to recognize the new extension."
echo "After logging back in, you can enable it with:"
echo "  gnome-extensions enable $UUID"
echo "Or use the 'Extensions' (gnome-shell-extension-prefs) application."
echo "--------------------------------------------------"
