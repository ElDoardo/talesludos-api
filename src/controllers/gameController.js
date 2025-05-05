const { GameService } = require('../services');
const { verifyToken } = require('../middlewares/authMiddleware');

const GameController = {
    async edit(req, res) {
        try {
            const { id } = req.params;
            const gameData = await GameService.getGameForEdit(id);
            
            res.status(200).json({
                game: gameData.game,
                image: gameData.image,
                title: gameData.title
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Erro ao carregar jogo',
                message: error.message 
            });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const gameData = req.body;
            
            const updatedGame = await GameService.updateGame(id, gameData);
            await GameService.generateGameFiles(id, userId);
            
            res.status(200).json(updatedGame);
        } catch (error) {
            res.status(500).json({ 
                error: 'Falha ao atualizar game',
                message: error.message 
            });
        }
    }
};

module.exports = GameController;