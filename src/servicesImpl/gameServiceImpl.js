const GameService = require('../services/gameService');
const GameRepository = require('../repositories/gameRepository');
const JourneyRepository = require('../repositories/journeyRepository');
const fs = require('fs');
const path = require('path');
const { generateGameIndex, generateGameScript } = require('../utils/fileGenerator');

class GameServiceImpl extends GameService {
    async getGameForEdit(id) {
        const game = await GameRepository.findById(id);
        if (!game) {
            throw new Error('Jogo não encontrado');
        }
        
        const journey = await JourneyRepository.findById(game.journey_id);
        if (!journey) {
            throw new Error('Jornada não encontrada');
        }
        
        return {
            game,
            image: journey.imagePath,
            title: journey.title
        };
    }

    async updateGame(id, gameData) {
        const game = await GameRepository.findById(id);
        if (!game) {
            throw new Error('Jogo não encontrado');
        }
        
        // Converte campos para string JSON se necessário
        const dataToUpdate = {
            marks: typeof gameData.marks === 'string' ? gameData.marks : JSON.stringify(gameData.marks),
            links: typeof gameData.links === 'string' ? gameData.links : JSON.stringify(gameData.links),
            scenes: typeof gameData.scenes === 'string' ? gameData.scenes : JSON.stringify(gameData.scenes),
            challenges: typeof gameData.challenges === 'string' ? gameData.challenges : JSON.stringify(gameData.challenges)
        };
        
        return await GameRepository.update(id, dataToUpdate);
    }

    async generateGameFiles(journeyId, userId) {
        const game = await GameRepository.findById(journeyId);
        if (!game) {
            throw new Error('Jogo não encontrado');
        }
        
        const journey = await JourneyRepository.findById(game.journey_id);
        if (!journey) {
            throw new Error('Jornada não encontrada');
        }
        
        const basePath = path.join('storage', 'games', userId.toString(), journeyId.toString());
        const gamePath = path.join(basePath, 'Game1');
        
        // Cria estrutura de diretórios
        await this._ensureDirectoryExists(gamePath);
        await this._ensureDirectoryExists(path.join(gamePath, 'config'));
        await this._ensureDirectoryExists(path.join(gamePath, 'media'));
        
        // Copia arquivos base (precisa ter uma pasta Game1 com os arquivos base)
        await this._copyBaseGameFiles(gamePath);
        
        // Copia imagem de fundo
        const imageName = path.basename(journey.imagePath);
        await fs.promises.copyFile(
            path.join('storage', journey.imagePath),
            path.join(gamePath, 'media', imageName)
        );
        
        // Gera arquivos dinâmicos
        await generateGameIndex({
            folder: path.join(basePath, 'Game1/'),
            imageName
        });
        
        await generateGameScript({
            folder: path.join(basePath, 'Game1/'),
            title: journey.title,
            description: journey.description,
            marks: game.marks,
            links: game.links,
            scenes: game.scenes,
            challenges: game.challenges
        });
    }
    
    async _ensureDirectoryExists(dirPath) {
        try {
            await fs.promises.access(dirPath);
        } catch {
            await fs.promises.mkdir(dirPath, { recursive: true });
        }
    }
    
    async _copyBaseGameFiles(destinationPath) {
        const baseGamePath = path.join('storage', 'base', 'Game1');
        const files = await fs.promises.readdir(baseGamePath, { withFileTypes: true });
        
        for (const file of files) {
            const source = path.join(baseGamePath, file.name);
            const destination = path.join(destinationPath, file.name);
            
            if (file.isDirectory()) {
                await this._copyDirectory(source, destination);
            } else {
                await fs.promises.copyFile(source, destination);
            }
        }
    }
    
    async _copyDirectory(source, destination) {
        await this._ensureDirectoryExists(destination);
        const files = await fs.promises.readdir(source, { withFileTypes: true });
        
        for (const file of files) {
            const srcPath = path.join(source, file.name);
            const destPath = path.join(destination, file.name);
            
            if (file.isDirectory()) {
                await this._copyDirectory(srcPath, destPath);
            } else {
                await fs.promises.copyFile(srcPath, destPath);
            }
        }
    }
}

module.exports = new GameServiceImpl();