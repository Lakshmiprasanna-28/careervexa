// === server/middleware/roleMiddleware.js ===

export const authorize = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    console.log("🔐 Authorize middleware → Role:", userRole);

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({
        message: "❌ Access Denied: Insufficient permissions.",
      });
    }

    next();
  };
};
