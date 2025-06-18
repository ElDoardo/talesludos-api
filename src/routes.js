const express = require('express');
const AreaController = require('./controllers/areaController');
const AuthController = require('./controllers/authController');
const ContactController = require('./controllers/contactController');
const GameController = require('./controllers/gameController');
const JourneyController = require('./controllers/journeyController');
const UserController = require('./controllers/userController');
const { verifyToken } = require('./middlewares/authMiddleware');
const upload = require('./config/multer');
const journeyController = require('./controllers/journeyController');

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
router.get('/game/edit/:id', verifyToken, GameController.edit);
router.put('/game/update/:id', verifyToken, GameController.update);

// Rotas de Journey
router.get('/journey/:id/:fileName', JourneyController.sendImage);
router.get('/journey/listall', JourneyController.listAll);
router.get('/journey/view/:id', JourneyController.view);
router.get('/journey/download/:user_id/:id', JourneyController.download);
router.get('/journey/index', verifyToken, JourneyController.index);
router.get('/journey/edit/:id', verifyToken, JourneyController.edit);
router.post('/journey/store', 
    verifyToken, 
    upload.single('imageData'), // 'imageData' deve ser o nome do campo no form
    JourneyController.store
);
router.post('/journey/update/:id', 
  verifyToken, 
  upload.single('imageData'),
  JourneyController.update
);
router.delete('/journey/destroy/:id', verifyToken, JourneyController.destroy);

module.exports = router;