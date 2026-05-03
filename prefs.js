// bring-to-front@ildella.github.com — prefs.js
// GTK4 / Libadwaita preferences for GNOME 45+

import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js'
import Adw from 'gi://Adw'
import Gio from 'gi://Gio'
import Gtk from 'gi://Gtk'

export default class BringToFrontPreferences extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    const settings = this.getSettings()

    // 1. Create a Page
    const page = new Adw.PreferencesPage({
      title: 'Settings',
      icon_name: 'preferences-system-symbolic',
    })
    window.add(page)

    // 2. Shortcut Group
    const groupShortcut = new Adw.PreferencesGroup({
      title: 'Keyboard Shortcut',
      description: 'The string format follows GNOME shortcut syntax (e.g. <Control><Alt>f)',
    })
    page.add(groupShortcut)

    const rowShortcut = new Adw.EntryRow({
      title: 'Toggle Shortcut',
    })
    
    // Bind the EntryRow to the 'toggle-front' array key
    // We read/write the first element of the array
    const bindingShortcut = settings.get_strv('toggle-front')
    rowShortcut.set_text(bindingShortcut[0] || '')

    rowShortcut.connect('changed', (entry) => {
      const text = entry.get_text().trim()
      if (text) {
        settings.set_strv('toggle-front', [text])
      }
    })
    groupShortcut.add(rowShortcut)

    // 3. Dimensions Group
    const groupSizes = new Adw.PreferencesGroup({
      title: 'Window Sizes',
      description: 'Dimensions for the two centered states',
    })
    page.add(groupSizes)

    // Size A
    const rowWidthA = new Adw.SpinRow({
      title: 'Standard Width (px)',
      adjustment: new Gtk.Adjustment({ lower: 400, upper: 4000, step_increment: 50, page_increment: 100 }),
    })
    settings.bind('front-width', rowWidthA, 'value', Gio.SettingsBindFlags.DEFAULT)
    groupSizes.add(rowWidthA)

    const rowHeightA = new Adw.SpinRow({
      title: 'Standard Height (px)',
      adjustment: new Gtk.Adjustment({ lower: 300, upper: 3000, step_increment: 50, page_increment: 100 }),
    })
    settings.bind('front-height', rowHeightA, 'value', Gio.SettingsBindFlags.DEFAULT)
    groupSizes.add(rowHeightA)

    // Size B
    const rowWidthB = new Adw.SpinRow({
      title: 'Large Width (px)',
      adjustment: new Gtk.Adjustment({ lower: 400, upper: 4000, step_increment: 50, page_increment: 100 }),
    })
    settings.bind('front-large-width', rowWidthB, 'value', Gio.SettingsBindFlags.DEFAULT)
    groupSizes.add(rowWidthB)

    const rowHeightB = new Adw.SpinRow({
      title: 'Large Height (px)',
      adjustment: new Gtk.Adjustment({ lower: 300, upper: 3000, step_increment: 50, page_increment: 100 }),
    })
    settings.bind('front-large-height', rowHeightB, 'value', Gio.SettingsBindFlags.DEFAULT)
    groupSizes.add(rowHeightB)
  }
}
