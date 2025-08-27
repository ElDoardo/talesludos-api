const jwt = require('jsonwebtoken');
const { isBlacklisted } = require('../utils/tokenBlackList');

exports.verifyToken = (req, res, next) => {
     if (req.path === '/login' || req.path === '/register') {
        return next();
    }

    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            message: 'Token não fornecido ou formato inválido' 
        });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    if (isBlacklisted(token)) {
        return res.status(401).json({ message: 'Token inválido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ 
                message: 'Token inválido ou expirado',
                error: err.message
            });
        }
        
        req.user = {
            id: decoded.id,
            email: decoded.email
        };
        next();
    });
};

exports.optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return next();

  const token = authHeader.split(' ')[1];
  if (!token || isBlacklisted(token)) return next();

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (!err && decoded) {
      req.user = { id: decoded.id, email: decoded.email };
    }
    return next();
  });
};