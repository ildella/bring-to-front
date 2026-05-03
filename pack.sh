#!/bin/bash

# gnome-extensions pack creates a zip file suitable for upload to extensions.gnome.org
# --force: overwrites the output if it already exists
# --extra-source=schemas/: ensures the schema directory is included in the zip

echo "Packaging extension..."

gnome-extensions pack --force --extra-source=schemas/ --out-dir=. .

echo "--------------------------------------------------"
echo "Packaging complete!"
echo "The file is ready for upload at:"
echo "bring-to-front@ildella.github.com.shell-extension.zip"
echo "--------------------------------------------------"
