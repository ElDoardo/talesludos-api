const express = require('express');
const AreaController = require('./controllers/areaController');
const AuthController = require('./controllers/authController');
const ContactController = require('./controllers/contactController');
const GameController = require('./controllers/gameController');
const JourneyController = require('./controllers/journeyController');
const UserController = require('./controllers/userController');
const { verifyToken } = require('./middlewares/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Rotas públicas
router.post('/auth/register', UserController.register);
router.post('/auth/login', AuthController.login);
//router.post('/auth/forgotpassword', AuthController.forgotPassword);
//router.post('/auth/resetpassword', AuthController.resetPassword);
router.get('/areas', AreaController.index);
router.post('/contact', ContactController.submit);

// Rotas protegidas
router.post('/auth/logout', verifyToken, AuthController.logout);

// Rotas de Game
router.post('/games', verifyToken, GameController.createGame);
router.get('/games/:id', verifyToken, GameController.getGameById);
router.put('/games/:id', verifyToken, GameController.updateGame);
//router.get('/game/edit/:id', verifyToken, GameController.editGame);
router.put('/game/update/:id', verifyToken, GameController.updateGame);

// Rotas de Journey
router.get('/journey/listall', JourneyController.listAll);
router.get('/journey/view/:id', JourneyController.view);
router.get('/journey/download/:user_id/:id', JourneyController.download);
router.get('/journey/index', verifyToken, JourneyController.index);
router.get('/journey/edit/:id', verifyToken, JourneyController.edit);
router.post('/journey/store', verifyToken, (req, res) => {
    JourneyController.store(req, res);
});
router.post('/journey/update/:id', verifyToken, upload.single('image'), JourneyController.update);
router.delete('/journey/destroy/:id', verifyToken, JourneyController.destroy);

module.exports = router;