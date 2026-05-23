// middleware/authMiddleware.js

exports.protect = (req, res, next) => {
  const userRole = req.headers.role;
  if (!req.headers.role) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }
  req.user = { role: userRole };
  next();
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};