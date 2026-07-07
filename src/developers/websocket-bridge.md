---
title: WebSocket Bridge
eleventyNavigation:
  parent: developers
  key: websocket-bridge
  title: WebSocket Bridge
  order: 4
---

# WebSocket Bridge

The WebSocket bridge connects pi-Stomp to MOD-UI for real-time state synchronization — live parameter, bypass, and snapshot state via bidirectional messaging. It supplements the older `last.json` file monitor, which is still polled once a second to detect pedalboard changes (`modhandler.py` `poll_modui_changes()`).

## Architecture

`AsyncWebSocketBridge` (`modalapi/websocket_bridge.py`) runs a background daemon thread that owns the WebSocket connection to `ws://localhost:80/websocket`. It reconnects with exponential backoff, but only up to `MAX_RECONNECT_ATTEMPTS` (4); after that it calls `os._exit(1)` and lets systemd (`Restart=always`) restart the whole service rather than trying to self-heal indefinitely. The outbound command queue is flushed on every reconnect, so stale messages are dropped rather than replayed.

## Why keep the `last.json` poll?

`last.json` records the pedalboard **bundle path** (`save_last_bank_and_pedalboard`), which pi-stomp needs to load that board's `config.yml` and match plugins. The `loading_end` message carries only the display **title** and snapshot id — not the bundle, and potentially ambiguous. Dropping the poll would require MOD-UI to broadcast the bundle path over the socket first.

### Queues

- **Outbound**: `command_queue` (unbounded — never drops blend-mode messages under normal streaming; it is flushed on reconnect and on `loading_start`). `send_parameter(instance_id, symbol, value)` and `send_bpm(bpm)` enqueue typed commands. Backpressure monitoring: if the TCP write buffer exceeds 8 KB, outbound sends return `False` until it drains.
- **Inbound**: `received_queue`, drained by `get_received_messages()` on every 10ms tick. `output_set` messages (audio meters) are dropped at reception.

## Message protocol

`ws_protocol.py` (`modalapi/ws_protocol.py`) parses raw text into typed dataclasses.

### Inbound messages

| Pattern | Typed message | Effect |
|---------|---------------|--------|
| `param_set …/:bypass v` | `PluginBypassMessage` | Set bypass, redraw |
| `param_set …/{sym} v` | `ParamSetMessage` | Cache value, mirror to bound control |
| `add {inst} … {bypassed} …` | `AddPluginMessage` | Connect/reconnect dump |
| `loading_end {snapshot}` | `LoadingEndMessage` | Stash snapshot index |
| `pedal_snapshot {id} {name}` | `PedalSnapshotMessage` | In-board snapshot change |

### Outbound messages

- `send_parameter(instance_id, symbol, value)` — set a plugin parameter
- `send_bpm(bpm)` — set tap tempo BPM

## Optimistic updates

MOD-UI is authoritative for bypass and parameter state, but pi-Stomp updates its own indicators optimistically so the UI stays responsive. The inbound echo carries the absolute current value and reconciles if it ever differs.

**Footswitch press flow:**

1. `footswitch._on_switch()` emits a `SwitchEvent`; `handler._handle_footswitch()` flips local `toggled`, updates the LED immediately, and sends the absolute MIDI CC
2. mod-host applies bypass and echoes `param_set …/:bypass` to all clients
3. The echo parses to `PluginBypassMessage`; `modhandler` calls `plugin.set_bypass()` and `lcd.refresh_plugin()` to reconcile cached state and redraw the LCD

Because the echo is absolute (not a delta), a wrong optimistic prediction is overwritten rather than compounded.

**Non-footswitch UI bypass** (e.g. tapping a plugin on the LCD):

1. WS `send_parameter` → mod-ui calls `host.bypass()`
2. `msg_callback_broadcast` skips the origin socket (us)
3. No echo arrives — pi-Stomp updates local state and LCD immediately

## Ping/pong

`ping` messages receive a `pong` reply. `data_ready` messages are echoed back.
