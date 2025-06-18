const GameService = require('../services/gameService');
const GameRepository = require('../repositories/gameRepository');
const JourneyRepository = require('../repositories/journeyRepository');
const fs = require('fs');
const path = require('path');
const { generateGameIndex, generateGameScript } = require('../utils/fileGenerator');

class GameServiceImpl extends GameService {
    async getGameForEdit(id) {
        const game = await GameRepository.findByJourneyId(id);
        if (!game) {
            throw new Error('Jogo não encontrado');
        }
        
        const journey = await JourneyRepository.findById(game.journey_id);
        if (!journey) {
            throw new Error('Jornada não encontrada');
        }
        
        return {
            game: {
                ...game,
                marks: game.marks || { coords: [], nextMark: 1 },
                links: game.links || [],
                scenes: game.scenes || [],
                challenges: game.challenges || []
            },
            image: journey.imagePath,
            title: journey.title
        };
    }

    async updateGame(id, gameData) {
        // Converte os campos para o formato correto
        const dataToUpdate = {
            marks: gameData.marks || { coords: [], nextMark: 1 },
            links: gameData.links || [],
            scenes: gameData.scenes || [],
            challenges: gameData.challenges || []
        };
        
        const updatedGame = await GameRepository.update(id, dataToUpdate);
        
        if (!updatedGame) {
            throw new Error('Falha ao atualizar o jogo');
        }
        
        return updatedGame;
    }

    async generateGameFiles(journeyId, userId) {
        const game = await GameRepository.findByJourneyId(journeyId);
        if (!game) {
            throw new Error('Jogo não encontrado');
        }
        
        const journey = await JourneyRepository.findById(journeyId);
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
            marks: JSON.stringify(game.marks),
            links: JSON.stringify(game.links),
            scenes: JSON.stringify(game.scenes),
            challenges: JSON.stringify(game.challenges)
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