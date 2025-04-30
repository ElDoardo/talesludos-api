const { AuthService } = require('../services');

const AuthController = {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const { user, token } = await AuthService.login(email, password);
            
            res.status(200).json({ 
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
                access_token: token,
                message: 'Login realizado com sucesso!'
            });
        } catch (error) {
            res.status(401).json({ 
                message: error.message,
                error: 'Credenciais inválidas'
            });
        }
    },

    async logout(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            await AuthService.logout(token);
            res.status(200).json({ message: 'Logout realizado com sucesso' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
};

module.exports = AuthController;