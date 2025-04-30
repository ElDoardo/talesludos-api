const User = require('../entities/userEntity');

class UserRepository {
    async findByEmail(email) {
        return await User.findOne({ where: { email } });
    }

    async create(userData) {
        return await User.create(userData);
    }
}

module.exports = new UserRepository();