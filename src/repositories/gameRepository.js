const Game = require('../entities/gameEntity');
const Journey = require('../entities/journeyEntity');

class GameRepository {
    async create(gameData) {
        return await Game.create(gameData);
    }

    async findById(id) {
        const game = await Game.findByPk(id, {
            include: [{
                model: Journey,
                as: 'Journey',
                attributes: ['title', 'description', 'imagePath', 'user_id']
            }]
        });
        
        if (game) {
            return {
                ...game.toJSON(),
                marks: typeof game.marks === 'string' ? JSON.parse(game.marks) : game.marks,
                links: typeof game.links === 'string' ? JSON.parse(game.links) : game.links,
                scenes: typeof game.scenes === 'string' ? JSON.parse(game.scenes) : game.scenes,
                challenges: typeof game.challenges === 'string' ? JSON.parse(game.challenges) : game.challenges
            };
        }
        return null;
    }

    async update(id, gameData) {
        const game = await Game.findOne({ 
            where: { journey_id: id },
            include: [{
                model: Journey,
                as: 'Journey',
                attributes: ['title', 'description', 'imagePath', 'user_id']
            }]
        });
        if (!game) {
            throw new Error('Jogo não encontrado');
        }
        
        // Garante que os campos sejam stringificados
        const dataToUpdate = {
            marks: JSON.stringify(gameData.marks),
            links: JSON.stringify(gameData.links),
            scenes: JSON.stringify(gameData.scenes),
            challenges: JSON.stringify(gameData.challenges)
        };
        console.log(game);
        await game.update(dataToUpdate);
        return this.findById(id); // Retorna o jogo atualizado
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