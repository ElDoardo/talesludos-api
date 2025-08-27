class AuthService {
  async login(email, password) {}
  async logout(token) {}
  async refresh(oldToken) {}
}

module.exports = AuthService;