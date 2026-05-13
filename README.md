# Bring to Front

Toggle focused windows between resting, centered (large size), and optionally centered (small size) positions with a keyboard shortcut.

[**Install from GNOME Extensions Store**](https://extensions.gnome.org/extension/9826/bring-to-front/)

Gnome Extension, Wayland, GNOME 45+

## Development

### Install & Update
To deploy local changes to your GNOME extensions directory:
```bash
./install.sh
```

### Reloading Changes
Since you are on **Wayland**, you must log out and back in for GNOME Shell to pick up changes to `extension.js` in your main session. 

**Pro-Tip: Nested Wayland Session (No Logout Required)**
To rapidly test changes without closing all your apps, run a nested GNOME shell inside a window.

Prerequisite: You must have the `mutter` development kit installed:
- Debian/Ubuntu: `sudo apt install mutter-dev-bin`
- Fedora: `sudo dnf install mutter-devel`

Run the nested session:
```bash
dbus-run-session -- gnome-shell --wayland --devkit
```
This boots up a separate GNOME environment where you can safely test the extension. (Note: The window resolution is currently fixed at 1280x800 in GNOME 49).

For quick iterations (GSettings changes or minor logic), you can try toggling it:
```bash
gnome-extensions disable bring-to-front@ildella.github.com
gnome-extensions enable bring-to-front@ildella.github.com
```

### Checking Logs
To see `console.log` output and errors in real-time (and verify your new code loaded):
```bash
journalctl -f -o cat /usr/bin/gnome-shell | grep BringToFront
```

### Extension Management
```bash
# List all extensions
gnome-extensions list

# Check info/status
gnome-extensions info bring-to-front@ildella.github.com
```
