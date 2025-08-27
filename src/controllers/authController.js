const { AuthService } = require('../services/authService');

const AuthController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(401).json({ error: 'Não autorizado', message: 'Não autorizado' });
      }

      const { user, token } = await AuthService.login(email, password);
      if (!user || !token) {
        return res.status(401).json({ error: 'Não autorizado', message: 'Não autorizado' });
      }

      return AuthController.respondWithToken(res, user, token);
    } catch (err) {
      return res.status(401).json({ error: 'Não autorizado', message: 'Não autorizado' });
    }
  },

  async logout(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        await AuthService.logout(token);
      }
      return res.status(200).json({ message: 'Logado com sucesso' });
    } catch (err) {
      return res.status(200).json({ message: 'Logado com sucesso' });
    }
  },

  async refresh(req, res) {
    try {
      const oldToken = req.headers.authorization?.split(' ')[1];
      if (!oldToken) {
        return res.status(401).json({ error: 'Não autorizado', message: 'Não autorizado' });
      }

      const { user, token } = await AuthService.refresh(oldToken);
      return AuthController.respondWithToken(res, user, token);
    } catch (err) {
      return res.status(401).json({ error: 'Não autorizado', message: 'Não autorizado' });
    }
  },

  respondWithToken(res, user, token) {
    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        email_verified_at: user.emailVerifiedAt || null,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      },
      access_token: token,
      token_type: 'bearer',
      expires_in: 3600,
    });
  },
};

module.exports = AuthController;