// server/config/adminWhitelist.js

// ✅ Reads admin emails from .env every time (dynamic)
export const getAdminWhitelist = () => {
  return (process.env.ADMIN_WHITELIST || "")
    .split(",")
    .map(email => email.trim().toLowerCase())
    .filter(email => email.length > 0);
};
