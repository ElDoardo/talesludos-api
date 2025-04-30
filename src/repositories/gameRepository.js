const Game = require('../entities/gameEntity');
const Journey = require('../entities/journeyEntity');

class GameRepository {
    async create(gameData) {
        return await Game.create(gameData);
    }

    async findById(id) {
        return await Game.findByPk(id, {
            include: [{ 
                model: Journey, 
                attributes: ['title', 'description', 'imagePath'] 
            }]
        });
    }

    async update(id, gameData) {
        const game = await Game.findByPk(id);
        if (!game) throw new Error('Jogo não encontrado');
        return await game.update(gameData);
    }
}

module.exports = new GameRepository();