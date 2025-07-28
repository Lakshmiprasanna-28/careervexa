// utils/rateLimiter.js
const notificationTimestamps = new Map(); // key = userId + type

export function canSendNotification(userId, type = "default", delay = 10000) {
  const key = `${userId}:${type}`;
  const now = Date.now();
  const lastSent = notificationTimestamps.get(key) || 0;

  if (now - lastSent < delay) {
    return false; // not allowed yet
  }

  notificationTimestamps.set(key, now);
  return true;
}
