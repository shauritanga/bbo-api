const jwt = require("jsonwebtoken");
const AuditTrail = require("../models/auditTrail");
// const roles = require("./roles"); // Import roles from the roles.js file

// const checkPermissions = (resource, action) => {
//   return (req, res, next) => {
//     const userRole = req.user.role; // Assuming you've set req.user in your authentication middleware

//     if (
//       !roles[userRole] ||
//       !roles[userRole][resource] ||
//       !roles[userRole][resource].includes(action)
//     ) {
//       return res.status(403).json({
//         message: "You do not have permission to perform this action.",
//       });
//     }

//     next();
//   };
// };

const authenticated = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: "Invalid token" });

    // Calculate token expiration time
    const now = Math.floor(Date.now() / 1000);
    const timeToExpiry = decoded.exp - now;

    if (timeToExpiry < 300) {
      const newToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      res.setHeader("Authorization", `Bearer ${newToken}`);
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

//Audit trail

const auditMiddleware = async (req, res, next) => {
  const userId = req.user ? req.user._id : null; // Assuming req.user contains authenticated user info
  const resource = req.originalUrl; // The resource being accessed (e.g., /orders)
  const action = req.method; // HTTP method (e.g., GET, POST, PUT, DELETE)

  // Capture details of the request (optional)
  const details = JSON.stringify({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  // Log the audit trail
  await AuditTrail.create({
    userId: userId || null, // Store userId if available, otherwise null for guest actions
    action,
    resource,
    details,
  });

  next(); // Proceed to the next middleware or route handler
};

module.exports = { authenticated, auditMiddleware };
