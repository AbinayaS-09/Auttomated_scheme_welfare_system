// const jwt = require("jsonwebtoken");

// module.exports = function (role) {
//   return (req, res, next) => {
//     try {
//       const token = req.headers.authorization?.split(" ")[1];
//       if (!token) return res.status(401).json({ error: "No token" });

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = decoded;

//       if (role && decoded.role !== role)
//         return res.status(403).json({ error: "Access denied" });

//       next();
//     } catch (err) {
//       return res.status(401).json({ error: "Invalid token" });
//     }
//   };
// };
const jwt = require("jsonwebtoken");

module.exports = function (allowedRoles) {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ error: "No token provided" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      console.log('Authenticated user:', decoded);

      // If allowedRoles is specified, check if user has permission
      if (allowedRoles) {
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
        
        if (!roles.includes(decoded.role)) {
          return res.status(403).json({ error: "Access denied" });
        }
      }

      next();
    } catch (err) {
      console.error('Auth middleware error:', err);
      return res.status(401).json({ error: "Invalid token" });
    }
  };
};