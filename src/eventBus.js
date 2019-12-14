const subscribers = {};

export function dispatch(channel, payload) {
  console.log("dispatched", channel, payload);
  (subscribers[channel] || []).forEach(listener => listener(payload));
}

export function subscribe(channel, listener) {
  if (subscribers[channel] && subscribers[channel].includes(listener)) {
    return () => {};
  }
  subscribers[channel] = [...(subscribers[channel] || []), listener];
  // return unsubscribe fn
  return () => {
    subscribers[channel] = subscribers[channel].filter(fn => fn !== listener);
  };
}
