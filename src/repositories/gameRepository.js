const Game = require('../entities/gameEntity');
const Journey = require('../entities/journeyEntity');

class GameRepository {
    async create(gameData) {
        return await Game.create(gameData);
    }

    async update(id, gameData) {
        const game = await Game.findOne({ 
            where: { journey_id: id },
        });
        if (!game) {
            throw new Error('Jogo não encontrado');
        }
        
        // Garante que os campos sejam stringificados
        const dataToUpdate = {
            marks: gameData.marks,
            links: gameData.links,
            scenes: gameData.scenes,
            challenges: gameData.challenges
        };
        console.log("----game update----");
        console.log(game);
        await game.update(dataToUpdate);
        return game; // Retorna o jogo atualizado
    }

    async findByJourneyId(journeyId) {
        const game = await Game.findOne({ 
            where: { journey_id: journeyId },
            include: [{
                model: Journey,
                as: 'Journey',
                attributes: ['title', 'description', 'imagePath', 'user_id']
            }]
        });
        
        if (game) {
            return {
                ...game.toJSON(),
                marks: game.marks,
                links: game.links,
                scenes: game.scenes,
                challenges: game.challenges
            };
        }
        return null;
    }
}

module.exports = new GameRepository();