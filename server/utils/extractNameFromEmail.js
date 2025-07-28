// server/utils/extractNameFromEmail.js

export const extractNameFromEmail = (email) => {
  if (!email) return "User";
  const [username] = email.split("@");

  // Remove digits and symbols
  const cleaned = username.replace(/[^a-zA-Z]/g, " ");

  const words = cleaned
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

  return words.join(" ") || "User";
};
