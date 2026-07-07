---
title: WebSocket Bridge
eleventyNavigation:
  parent: developers
  key: websocket-bridge
  title: WebSocket Bridge
  order: 4
---

# WebSocket Bridge

The WebSocket bridge connects pi-Stomp to MOD-UI for real-time state synchronization. It replaces the older `last.json` file-polling approach with live bidirectional messaging.

## Architecture

`AsyncWebSocketBridge` (`modalapi/websocket_bridge.py`) runs a background daemon thread that owns the WebSocket connection to `ws://localhost:80/websocket`. It uses exponential backoff for reconnection.

### Queues

- **Outbound**: `command_queue` (unbounded — never drops blend-mode messages). `send_parameter(instance_id, symbol, value)` and `send_bpm(bpm)` enqueue typed commands. Backpressure monitoring: if the TCP write buffer exceeds 8 KB, outbound sends return `False` until it drains.
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

1. `pressed()` flips local `toggled`, updates LED immediately, sends absolute MIDI CC
2. mod-host applies bypass and echoes `param_set` to all clients
3. `plugin.set_param_value()` reconciles cached state and redraws the LCD

Because the echo is absolute (not a delta), a wrong optimistic prediction is overwritten rather than compounded.

**Non-footswitch UI bypass** (e.g. tapping a plugin on the LCD):

1. WS `send_parameter` → mod-ui calls `host.bypass()`
2. `msg_callback_broadcast` skips the origin socket (us)
3. No echo arrives — pi-Stomp updates local state and LCD immediately

## Ping/pong

`ping` messages receive a `pong` reply. `data_ready` messages are echoed back.
