const { AuthService, UserService, PasswordResetService } = require('../services');

const AuthController = {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const { user, token } = await AuthService.login(email, password);
            
            res.status(200).json({ 
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    email_verified_at: user.emailVerifiedAt,
                    created_at:user.createdAt,
                    updated_at:user.updatedAt,
                },
                access_token: token,
                token_type: "bearer",
                expires_in: 3600
            });
        } catch (error) {
            res.status(401).json({ 
                error: "Não autorizado"
            });
        }
    },
    async forgotPassword(req, res) {
        debugger;
        try {
            const email = req.body.email;
            const user = await AuthService.forgotPassword(email);
        } catch (error) {
            res.status(404).json({
                error: "Email não encontrado"
            })
        }
    },
    async validatePasswordReset(req, res) {
        debugger;
        try {
            const token = req.body.token;
            const passwordReset = PasswordResetService.findByToken(token);
            if(!passwordReset){
                res.status(404).json({
                    error: "Token não encontrado"
                })
            }
            res.status(200).json({
                data: {email: passwordReset.email, token: token}
            })
        } catch (error) {
             res.status(404).json({
                error: "Token não encontrado"
            })
        }
    },
    async resetPassword(req, res){
        try{
            const {token, email, newPassword} = req.body;
            const passwordReset = PasswordResetService.findByToken(token);
            if(!passwordReset){
                res.status(404).json({
                    error: "Token não encontrado"
                })
            }
            const user = UserService.findByEmail(email);
            if(!user){
                res.status(404).json({
                    error: "Usuário não encontrado"
                })
            }
            user.password = newPassword;
            const newUser = await UserService.updateUser(user.id, user);
            res.status(200).json({ data: newUser});
        }catch{
            res.status(400).json({ message: error.message });
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