import User from "../models/User.js";
import { getAdminWhitelist } from "../config/adminWhitelist.js";

export const syncUserRoles = async () => {
  const users = await User.find({});
  const whitelist = getAdminWhitelist();

  let updatedCount = 0;

  const updates = users.map(async (user) => {
    const isAdmin = whitelist.includes(user.email.toLowerCase());

    if (isAdmin && user.role !== "admin") {
      user.role = "admin";
      updatedCount++;
      return user.save();
    } else if (!isAdmin && user.role === "admin") {
      user.role = "seeker";
      updatedCount++;
      return user.save();
    }
  });

  await Promise.all(updates);
  console.log(`✅ Synced roles. ${updatedCount} user(s) updated based on adminWhitelist.`);
};
