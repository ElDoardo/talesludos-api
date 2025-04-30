const JourneyService = require('../services/journeyService');
const JourneyRepository = require('../repositories/journeyRepository');
const Journey = require("../entities/journeyEntity");
const Game = require("../entities/gameEntity");
const User = require("../entities/userEntity");
const Area = require("../entities/areaEntity");
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

class JourneyServiceImpl extends JourneyService {
    async getUserJourneys(userId, { page = 1, perPage = 3 }) {
        const offset = (page - 1) * perPage;
        
        const { count, rows } = await Journey.findAndCountAll({
            where: { user_id: userId },
            order: [['id', 'DESC']],
            limit: perPage,
            offset: offset,
            include: [
                { model: User, attributes: ['name'] },
                { model: Area, attributes: ['title'] }
            ]
        });

        return {
            data: rows,
            total: count,
            currentPage: page,
            perPage: perPage,
            lastPage: Math.ceil(count / perPage)
        };
    }

    async getPublishedJourneys({ page = 1, perPage = 3, areaId = null }) {
        const offset = (page - 1) * perPage;
        const where = { publish: true };
        
        if (areaId) {
            where.area_id = areaId;
        }

        const { count, rows } = await Journey.findAndCountAll({
            where: where,
            order: [['id', 'DESC']],
            limit: perPage,
            offset: offset,
            include: [
                { model: User, attributes: ['name'] },
                { model: Area, attributes: ['title'] }
            ]
        });

        return {
            data: rows,
            total: count,
            currentPage: page,
            perPage: perPage,
            lastPage: Math.ceil(count / perPage)
        };
    }

    async getJourneyById(id) {
        return await Journey.findByPk(id, {
            include: [
                { model: User, attributes: ['name'] },
                { model: Area, attributes: ['title'] }
            ]
        });
    }

    async getJourneyForEdit(id) {
        return await Journey.findByPk(id);
    }

    async prepareDownload(userId, journeyId) {
        const gamePath = path.join(__dirname, `../../storage/games/${userId}/${journeyId}/Game1`);
        const zipPath = path.join(__dirname, `../../storage/games/${userId}/${journeyId}.zip`);
        
        if (!fs.existsSync(gamePath)) {
            throw new Error('Arquivos do jogo não encontrados');
        }

        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        return new Promise((resolve, reject) => {
            output.on('close', () => resolve(zipPath));
            archive.on('error', (err) => reject(err));

            archive.pipe(output);
            archive.directory(gamePath, false);
            archive.finalize();
        });
    }
    
    async processBase64Image(base64Data, userId) {
        console.log("processBase64Image: "+base64Data);
        // Verifica se é uma string base64 válida
        const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
        if (!matches) {
            throw new Error('Formato de imagem inválido');
        }
    
        const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
        const filename = `${uuidv4()}.${extension}`;
        const folderPath = path.join('storage', 'games', userId.toString(), 'img');
        const fullPath = path.join(folderPath, filename);
        const relativePath = `/games/${userId}/img/${filename}`;
    
        // Cria o diretório se não existir
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
    
        // Escreve o arquivo
        await fs.promises.writeFile(
            fullPath,
            matches[2],
            'base64'
        );
    
        return relativePath;
    }
    
    async createJourney(journeyData) {
        const journey = await JourneyRepository.create(journeyData);
        
        // Cria um jogo vazio associado
        await GameRepository.create({
            journey_id: journey.id,
            marks: "{\"coords\":[],\"nextMark\":1}",
            links: "[]",
            scenes: "[]",
            challenges: "[]"
        });
    
        return journey;
    }

    async updateJourney(id, journeyData) {
        const journey = await Journey.findByPk(id);
        
        if (!journey) {
            throw new Error('Jornada não encontrada');
        }

        // Remove a imagem antiga se uma nova foi enviada
        if (journeyData.imagePath && journey.imagePath) {
            const oldImagePath = path.join(__dirname, `../../${journey.imagePath}`);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        return await journey.update(journeyData);
    }

    async deleteJourney(id) {
        const journey = await Journey.findByPk(id);
        
        if (!journey) {
            throw new Error('Jornada não encontrada');
        }

        // Remove a imagem associada
        if (journey.imagePath) {
            const imagePath = path.join(__dirname, `../../${journey.imagePath}`);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Remove os arquivos do jogo
        const gamePath = path.join(__dirname, `../../storage/games/${journey.user_id}/${journey.id}`);
        if (fs.existsSync(gamePath)) {
            fs.rmSync(gamePath, { recursive: true });
        }

        return await journey.destroy();
    }
}

module.exports = new JourneyServiceImpl();