const jwt = require('jsonwebtoken');
const { addToBlacklist } = require('../utils/tokenBlackList');
const { generateToken } = require('../utils/jwt');
const UserService = require('../services/userService');
const User = require('../entities/userEntity');

const JWT_SECRET = process.env.JWT_SECRET;

class AuthServiceImpl {
  async login(email, password) {
    const user = await UserService.validateUser(email, password);
    const token = generateToken(user);
    return { user, token };
  }

  async logout(token) {
    if (token) addToBlacklist(token);
    return true;
  }

  async refresh(oldToken) {
    try {
      const decoded = jwt.verify(oldToken, JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      if (!user) throw new Error('Não autorizado');
      const token = generateToken(user);
      return { user, token };
    } catch {
      throw new Error('Não autorizado');
    }
  }
}

module.exports = new AuthServiceImpl();