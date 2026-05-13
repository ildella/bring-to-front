// bring-to-front@local — extension.js
// GNOME 49+ / Wayland — ESModule format (required since GNOME 45)
//
// Window states we care about:
//   resting      — the user's free-floating size/position (saved before going front)
//   front-small  — centered, fixed size, optional step in the cycle
//   front-large  — centered, fixed size, first centered step in the cycle
//   maximised / minimised — GNOME native, untouched

import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js'
import * as Main from 'resource:///org/gnome/shell/ui/main.js'

// ------------------------------------------------------------------
// Pure helpers
// ------------------------------------------------------------------

const getWorkAreaForWindow = (metaWindow) => {
  const monitor = metaWindow.get_monitor()
  return metaWindow.get_work_area_for_monitor(monitor)
}

const centeredRect = (workArea, w, h) => ({
  x: workArea.x + Math.round((workArea.width - w) / 2),
  y: workArea.y + Math.round((workArea.height - h) / 2),
  width: w,
  height: h,
})

const frameRectOf = (metaWindow) => {
  const r = metaWindow.get_frame_rect()
  return { x: r.x, y: r.y, width: r.width, height: r.height }
}

const isFront = (metaWindow, frontRect) => {
  const r = metaWindow.get_frame_rect()
  const tol = 40
  return (
    Math.abs(r.x - frontRect.x) <= tol &&
    Math.abs(r.y - frontRect.y) <= tol &&
    Math.abs(r.width - frontRect.width) <= tol &&
    Math.abs(r.height - frontRect.height) <= tol
  )
}

// ------------------------------------------------------------------
// State — one Map keyed by Meta.Window, values: { resting }
// Plain module-level var, reset on disable().
// ------------------------------------------------------------------

let _windowState = new Map()
let _settings = null
let _keybindingId = null

// ------------------------------------------------------------------
// Core action
// ------------------------------------------------------------------

const toggleFront = () => {
  const metaWindow = global.display.focus_window
  if (!metaWindow) return

  // Ignore if maximised or minimised — those are their own states
  if (metaWindow.is_maximized() || metaWindow.minimized) return

  const frontW = _settings.get_int('front-width')
  const frontH = _settings.get_int('front-height')
  const frontLargeW = _settings.get_int('front-large-width')
  const frontLargeH = _settings.get_int('front-large-height')
  const enableSmallCenter = _settings.get_boolean('enable-small-center')

  const workArea = getWorkAreaForWindow(metaWindow)
  const frontRect = centeredRect(workArea, frontW, frontH)
  const frontLargeRect = centeredRect(workArea, frontLargeW, frontLargeH)

  const state = _windowState.get(metaWindow)

  if (state) {
    if (isFront(metaWindow, frontLargeRect)) {
      // In large center -> move to small center, or restore when disabled
      if (enableSmallCenter) {
        metaWindow.move_resize_frame(false, frontRect.x, frontRect.y, frontRect.width, frontRect.height)
      } else {
        const r = state.resting
        metaWindow.move_resize_frame(false, r.x, r.y, r.width, r.height)
        _windowState.delete(metaWindow)
      }
    } else if (isFront(metaWindow, frontRect)) {
      // In small center -> restore resting
      const r = state.resting
      metaWindow.move_resize_frame(false, r.x, r.y, r.width, r.height)
      _windowState.delete(metaWindow)
    } else {
      // Moved manually — start over at large center
      _windowState.set(metaWindow, { resting: frameRectOf(metaWindow) })
      metaWindow.move_resize_frame(false, frontLargeRect.x, frontLargeRect.y, frontLargeRect.width, frontLargeRect.height)
    }
  } else {
    // Save current resting position, move to large center
    _windowState.set(metaWindow, { resting: frameRectOf(metaWindow) })
    metaWindow.move_resize_frame(false, frontLargeRect.x, frontLargeRect.y, frontLargeRect.width, frontLargeRect.height)
  }
}

// ------------------------------------------------------------------
// Cleanup helper — drop state for destroyed windows
// ------------------------------------------------------------------

const onWindowDestroyed = (metaWindow) => {
  _windowState.delete(metaWindow)
}

let _destroySignals = new Map() // metaWindow → signal id

const trackWindow = (metaWindow) => {
  if (_destroySignals.has(metaWindow)) return
  const id = metaWindow.connect('unmanaged', onWindowDestroyed)
  _destroySignals.set(metaWindow, id)
}

const untrackAll = () => {
  for (const [win, id] of _destroySignals) {
    try { win.disconnect(id) } catch (_) {}
  }
  _destroySignals = new Map()
}

// ------------------------------------------------------------------
// Extension lifecycle (ESModule / GNOME 45+ style)
// ------------------------------------------------------------------

export default class BringToFrontExtension extends Extension {
  enable() {
    console.log(`[BringToFront] Extension enabled (v${this.metadata.version})`);
    _settings = this.getSettings()
    _windowState = new Map()
    _destroySignals = new Map()

    // Register the global keybinding
    // Main.wm.addKeybinding returns an id we store for removal
    _keybindingId = Main.wm.addKeybinding(
      'toggle-front',
      _settings,
      // Meta.KeyBindingFlags.NONE = 0
      0,
      // Shell.ActionMode.NORMAL — only when a normal window has focus
      // Shell.ActionMode.NORMAL = 1
      1,
      () => {
        const win = global.display.focus_window
        if (win) trackWindow(win)
        toggleFront()
      }
    )
  }

  disable() {
    if (_keybindingId) {
      Main.wm.removeKeybinding('toggle-front')
      _keybindingId = null
    }
    untrackAll()
    _windowState = new Map()
    _settings = null
  }
}
