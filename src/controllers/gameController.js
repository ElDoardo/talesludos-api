const { GameService } = require('../services');
const { verifyToken } = require('../middlewares/authMiddleware');

const GameController = {
    async edit(req, res) {
        try {
            const { id } = req.params;
            const gameData = await GameService.getGameForEdit(id);
            
            res.status(200).json({
                game: {
                    id: gameData.game.id,
                    journey_id: gameData.game.journey_id,
                    marks: gameData.game.marks,
                    links: gameData.game.links,
                    scenes: gameData.game.scenes,
                    challenges: gameData.game.challenges,
                    createdAt: gameData.game.createdAt,
                    updatedAt: gameData.game.updatedAt
                },
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
            
            // Garante que os campos estejam no formato correto
            const dataToUpdate = {
                marks: gameData.marks || { coords: [], nextMark: 1 },
                links: gameData.links || [],
                scenes: gameData.scenes || [],
                challenges: gameData.challenges || []
            };
            
            const updatedGame = await GameService.updateGame(id, dataToUpdate);
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