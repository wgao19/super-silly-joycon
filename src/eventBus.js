const subscribers = {};

export function dispatch(channel, payload) {
    ...[widgetId, type, payload].filter(Boolean)
  );
  (subscribers[channel] || []).forEach(listener => listener(payload_));
}

export function subscribe(
  channel,
  listener
) {
  if (subscribers[channel] && subscribers[channel].includes(listener)) {
    return () => {};
  }
  subscribers[channel] = [...(subscribers[channel] || []), listener];
  // return unsubscribe fn
  return () => {
    subscribers[channel] = subscribers[channel].filter(fn => fn !== listener);
  };
}
