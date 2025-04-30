const GameService = require('../services/gameService');
const GameRepository = require('../repositories/gameRepository');
const JourneyRepository = require('../repositories/journeyRepository');
const path = require('path');
const { generateGameIndex, generateGameScript } = require('../utils/fileGenerator');

class GameServiceImpl extends GameService {
    async createGame(gameData) {
        const existingGame = await GameRepository.findByJourneyId(gameData.journey_id);
        if (existingGame) {
            throw new Error('Esta jornada já possui um jogo associado.');
        }
        return await GameRepository.create(gameData);
    }

    async getGameById(id) {
        return await GameRepository.findById(id);
    }

    async updateGame(id, gameData) {
        const game = await GameRepository.update(id, gameData);
        
        const journey = await JourneyRepository.findById(game.journey_id);
        if (!journey) {
            throw new Error('Jornada não encontrada');
        }

        await this.generateGameFiles(game.journey_id, journey.user_id);
        
        return game;
    }

    async generateGameFiles(journeyId, userId) {
        const game = await GameRepository.findById(journeyId);
        const journey = game.Journey;
    
        const folder = `games/${userId}/${journeyId}/`;
    
        await generateGameIndex({
            folder,
            imageName: path.basename(journey.imagePath)
        });
    
        await generateGameScript({
            folder,
            title: journey.title,
            description: journey.description,
            marks: game.marks,
            links: game.links,
            scenes: game.scenes,
            challenges: game.challenges
        });
    }
}

module.exports = new GameServiceImpl();