const AuthService = require('../services/authService');
const UserService = require('./userServiceImpl');
const UserRepository = require('../repositories/userRepository');
const { sendResetPasswordEmail } = require("../utils/mailer");
const { generateToken } = require('../utils/jwt');
const { addToBlacklist } = require('../utils/tokenBlackList');

class AuthServiceImpl extends AuthService {
    async login(email, password) {
        const user = await UserService.validateUser(email, password);
        const token = generateToken(user);
        return { user, token };
    }

    async forgotPassword(email) {
        debugger;
        try{
            const user = await UserRepository.findByEmail(email);
            if (user){
                sendResetPasswordEmail(user);
            }
        } catch(error) {
            debugger;
            console.log(error);
        }
        debugger;
    }
    
    async logout(token) {
        if (!token) {
            throw new Error('Token não fornecido');
        }

        addToBlacklist(token);
    }
}

module.exports = new AuthServiceImpl();