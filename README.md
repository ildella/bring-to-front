
## Dev system
Wayland, GNOME 49+

## Extension

The final objective is to have one shortcut say ctrl+alt+f that globally do one action that we call "bring-to-front". What it does is get the active focused window and put it in the center of the screen, with a default w+h (customizable but hardcoded is ok to start). From that position is very important that we can revert to the original position. 

also we need nomenclature: we have maximised and minimised, those are obvious. 
then we have the "current" or "default" window startup user can just manually resize. What's a good name? default? 

then our new bring-to-front position. or "front" position which is another one. Pressing `ctrl+alt+f` again will move it back to default.
