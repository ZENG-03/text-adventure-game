// Compatibility fallback for stale caches that still request /main.js.
if (window && window.location && !window.location.hash) {
  window.location.replace('/text-adventure-game/');
}
