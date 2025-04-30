const AreaServiceImpl = require('../servicesImpl/areaServiceImpl');
const AuthServiceImpl = require('../servicesImpl/authServiceImpl');
const ContactServiceImpl= require('../servicesImpl/contactServiceImpl');
const GameServiceImpl = require('../servicesImpl/gameServiceImpl');
const JourneyServiceImpl = require('../servicesImpl/journeyServiceImpl');
const UserServiceImpl = require('../servicesImpl/userServiceImpl');

module.exports = {
    AreaService: AreaServiceImpl,
    AuthService: AuthServiceImpl,
    ContactService: ContactServiceImpl,
    GameService: GameServiceImpl,
    JourneyService: JourneyServiceImpl,
    UserService: UserServiceImpl,
};