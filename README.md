# Bring to Front

Gnome Extension, Wayland, GNOME 45+

## Purpose

The final objective is to have one shortcut say ctrl+alt+f that globally do one action that we call "bring-to-front". What it does is get the active focused window and put it in the center of the screen, with a default w+h (customizable but hardcoded is ok to start). From that position is very important that we can revert to the original position. 

also we need nomenclature: we have maximised and minimised, those are obvious. 
then we have the "current" or "default" window startup user can just manually resize. What's a good name? default? 

then our new bring-to-front position. or "front" position which is another one. Pressing `ctrl+alt+f` again will move it back to default.

## Development

### Install & Update
To deploy local changes to your GNOME extensions directory:
```bash
./install.sh
```

### Reloading Changes
Since you are on **Wayland**, you must log out and back in for GNOME Shell to pick up changes to `extension.js` in your main session. 

**Pro-Tip: Nested Wayland Session (No Logout Required)**
To rapidly test changes without closing all your apps, run a nested GNOME shell inside a window:
```bash
dbus-run-session -- gnome-shell --nested --wayland
```
This boots up a separate GNOME environment where you can safely test the extension.

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

