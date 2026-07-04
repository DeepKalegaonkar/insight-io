"use client";

import { useEffect, useState } from "react";

// ─── Rosbridge v2 JSON protocol types ─────────────────────────────────────────
interface RosbridgeMsg {
  op: string;
  topic?: string;
  type?: string;
  msg?: unknown;
  id?: string;
}

type TopicCallback = (msg: unknown) => void;

// ─── Module-level singleton ────────────────────────────────────────────────────
// One WebSocket shared across every component that calls useRosbridge().
let _ws: WebSocket | null = null;
let _connected = false;
let _reconnectTimer: ReturnType<typeof setTimeout> | null = null;

// Components register here to be notified when connection state changes.
const _stateListeners = new Set<(c: boolean) => void>();

// topic → set of subscriber callbacks
const _subscribers = new Map<string, Set<TopicCallback>>();

// Advertised topics (so we only send "advertise" once per topic)
const _advertised = new Set<string>();

const WS_URL = "ws://localhost:9090";
const RECONNECT_MS = 3000;

function _notifyState(c: boolean) {
  _connected = c;
  _stateListeners.forEach((fn) => fn(c));
}

function _connect() {
  if (typeof window === "undefined") return; // SSR guard
  if (_ws && (_ws.readyState === WebSocket.OPEN || _ws.readyState === WebSocket.CONNECTING)) return;

  _ws = new WebSocket(WS_URL);

  _ws.onopen = () => {
    if (_reconnectTimer) { clearTimeout(_reconnectTimer); _reconnectTimer = null; }
    _notifyState(true);

    // Re-subscribe to any topics that were registered before connection
    _subscribers.forEach((_, topic) => {
      _ws?.send(JSON.stringify({ op: "subscribe", topic }));
    });
  };

  _ws.onclose = () => {
    _notifyState(false);
    _advertised.clear();
    // Auto-reconnect
    if (!_reconnectTimer) {
      _reconnectTimer = setTimeout(_connect, RECONNECT_MS);
    }
  };

  _ws.onerror = () => {
    _ws?.close();
  };

  _ws.onmessage = (evt: MessageEvent) => {
    try {
      const data: RosbridgeMsg = JSON.parse(evt.data as string);
      if (data.op === "publish" && data.topic) {
        _subscribers.get(data.topic)?.forEach((cb) => cb(data.msg));
      }
    } catch {
      // ignore malformed frames
    }
  };
}

function _send(msg: RosbridgeMsg) {
  if (_ws?.readyState === WebSocket.OPEN) {
    _ws.send(JSON.stringify(msg));
  }
}

// ─── Public API (used by the hook) ────────────────────────────────────────────

/**
 * Publish a message to a ROS2 topic via rosbridge.
 *
 * @param topic  Full topic name, e.g. "/mission/pause"
 * @param type   ROS2 message type, e.g. "std_msgs/Bool"
 * @param msg    The message payload object
 */
function publish(topic: string, type: string, msg: unknown) {
  if (!_advertised.has(topic)) {
    _send({ op: "advertise", topic, type });
    _advertised.add(topic);
  }
  _send({ op: "publish", topic, msg });
}

/**
 * Subscribe to a ROS2 topic.  The callback receives the parsed message object.
 *
 * @param topic  Full topic name
 * @param type   ROS2 message type
 * @param cb     Called whenever a message arrives
 */
function subscribe(topic: string, type: string, cb: TopicCallback) {
  if (!_subscribers.has(topic)) {
    _subscribers.set(topic, new Set());
    _send({ op: "subscribe", topic, type });
  }
  _subscribers.get(topic)!.add(cb);
}

/**
 * Unsubscribe a previously-registered callback.
 * Sends "unsubscribe" to rosbridge when the last listener is removed.
 */
function unsubscribe(topic: string, cb: TopicCallback) {
  const set = _subscribers.get(topic);
  if (!set) return;
  set.delete(cb);
  if (set.size === 0) {
    _subscribers.delete(topic);
    _send({ op: "unsubscribe", topic });
  }
}

// ─── React hook ───────────────────────────────────────────────────────────────

/**
 * useRosbridge — connects once to rosbridge at ws://localhost:9090.
 *
 * Returns:
 *   connected  — true when the WebSocket is open
 *   publish    — send a message to a ROS2 topic
 *   subscribe  — listen for messages on a ROS2 topic
 *   unsubscribe — remove a subscription
 *
 * Usage on the robot side:
 *   1. Install rosbridge_suite:
 *        sudo apt install ros-$ROS_DISTRO-rosbridge-suite
 *   2. Launch:
 *        ros2 launch rosbridge_server rosbridge_websocket_launch.xml
 *   3. The dashboard will connect automatically on port 9090.
 *
 * Pause/resume topic convention:
 *   Topic : /mission/pause
 *   Type  : std_msgs/Bool
 *   data=true  → pause navigation
 *   data=false → resume navigation
 *
 *   Robot-side subscriber example (Python):
 *     import rclpy, rclpy.node
 *     from std_msgs.msg import Bool
 *     class MissionManager(rclpy.node.Node):
 *         def __init__(self):
 *             super().__init__("mission_manager")
 *             self.create_subscription(Bool, "/mission/pause", self._on_pause, 10)
 *         def _on_pause(self, msg):
 *             if msg.data:
 *                 self.get_logger().info("Mission PAUSED")
 *                 # cancel nav2 goal / hold position
 *             else:
 *                 self.get_logger().info("Mission RESUMED")
 *                 # re-send navigation goal
 */
export function useRosbridge() {
  const [connected, setConnected] = useState(_connected);

  useEffect(() => {
    const listener = (c: boolean) => setConnected(c);
    _stateListeners.add(listener);

    // Start the singleton connection (no-op if already connecting/open)
    _connect();

    return () => {
      _stateListeners.delete(listener);
    };
  }, []);

  return { connected, publish, subscribe, unsubscribe };
}
