const PasswordReset = require('../entities/passwordResetEntity');

class PasswordResetRepository {

    async findByEmail(email) {
        return await PasswordReset.findOne({ where: { email } });
    }

    async findByToken(token) {
        return await PasswordReset.findOne({ where: { token } });
    }

    async findById(id) {
        return await PasswordReset.findByPk(id);
    }

    async create(passwordResetData) {
        return await PasswordReset.create(passwordResetData);
    }

    async delete(id) {
        const passwordReset = await PasswordReset.findByPk(id);
        if (!passwordReset) {
            throw new Error('Email não encontrado');
        }
        return await passwordReset.destroy();
    }
}

module.exports = new PasswordResetRepository();