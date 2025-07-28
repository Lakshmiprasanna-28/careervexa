// src/utils/formatNameFromEmail.js
export const formatNameFromEmail = (email) => {
  if (!email) return "User";
  const [username] = email.split("@");

  // Remove digits
  const cleaned = username.replace(/[0-9]/g, "");

  // Split on dot or capitalized words (like thotalakshmi -> thota lakshmi)
  const split = cleaned.includes(".")
    ? cleaned.split(".")
    : cleaned.match(/[a-zA-Z][a-z]+/g);

  if (!split) return "User";

  return split.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
};
