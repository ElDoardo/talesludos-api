const { GameService } = require('../services');

const GameController = {
    async createGame(req, res) {
        try {
            const gameData = req.body;
            const game = await GameService.createGame(gameData);
            res.status(201).json({ game, message: 'Jogo criado com sucesso!' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getGameById(req, res) {
        try {
            const { id } = req.params;
            const game = await GameService.getGameById(id);
            res.status(200).json({ game });
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    },

    async updateGame(req, res) {
        try {
            const { id } = req.params;
            const gameData = req.body;
            const game = await GameService.updateGame(id, gameData);
            res.status(200).json({ game, message: 'Jogo atualizado com sucesso!' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = GameController;