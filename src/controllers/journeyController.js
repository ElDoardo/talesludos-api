const { JourneyService } = require('../services');
const { verifyToken } = require('../middlewares/authMiddleware');
const upload = require('../config/multer');
const fs = require('fs');
const path = require('path');

class JourneyController {
    async index(req, res) {
        try {
            const userId = req.user.id;
            const { page = 1, area } = req.query;
            
            const journeys = await JourneyService.getUserJourneys(userId, {
                page: parseInt(page),
                perPage: 3
            });

            res.status(200).json(journeys);
        } catch (error) {
            res.status(500).json({ 
                message: 'Erro ao carregar jornadas',
                error: error.message 
            });
        }
    }

    async listAll(req, res) {
        try {
            const { page = 1, area } = req.query;
            
            const journeys = await JourneyService.getPublishedJourneys({
                page: parseInt(page),
                perPage: 3,
                areaId: area
            });

            res.status(200).json(journeys);
        } catch (error) {
            res.status(500).json({ 
                message: 'Erro ao carregar jornadas públicas',
                error: error.message 
            });
        }
    }

    async view(req, res) {
        try {
            const { id } = req.params;
            const journey = await JourneyService.getJourneyById(id);
            
            if (!journey) {
                return res.status(404).json({ message: 'Jornada não encontrada' });
            }

            res.status(200).json(journey);
        } catch (error) {
            res.status(500).json({ 
                message: 'Erro ao carregar jornada',
                error: error.message 
            });
        }
    }

    async download(req, res) {
        try {
            const { user_id, id } = req.params;
            const filePath = await JourneyService.prepareDownload(user_id, id);
            
            res.download(filePath, `jornada-${id}.zip`, (err) => {
                if (err) {
                    console.error('Erro no download:', err);
                }
                // Remove o arquivo zip após o download
                fs.unlinkSync(filePath);
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Erro ao preparar download',
                error: error.message 
            });
        }
    }

    async store(req, res) {
        try {
            console.log('Corpo da requisição:', req.body); // Debug
            console.log('Arquivo recebido:', req.file);   // Debug
            
            if (!req.file) {
                console.log('Nenhum arquivo recebido');    // Debug
                return res.status(400).json({ 
                    message: 'A escolha da IMAGEM é obrigatória' 
                });
            }

            const journeyData = {
                user_id: req.user.id,
                title: req.body.title,
                description: req.body.description,
                area_id: req.body.area_id,
                publish: req.body.publish === '1',
                imagePath: `/games/${req.user.id}/img/${req.file.filename}`
            };

            console.log('Dados da jornada:', journeyData); // Debug
            const journey = await JourneyService.createJourney(journeyData);
            
            res.status(201).json(journey);
        } catch (error) {
            console.error('Erro detalhado:', error);       // Debug mais detalhado
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(500).json({ 
                message: 'Erro na criação do Game',
                error: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            
            const journeyData = {
                ...req.body,
                user_id: userId
            };

            // Se foi enviado um novo arquivo, atualiza o imagePath
            if (req.file) {
                journeyData.imagePath = path.join('games', userId.toString(), 'img', req.file.filename);
            }

            const journey = await JourneyService.updateJourney(id, journeyData);
            
            res.status(200).json(journey);
        } catch (error) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(400).json({ 
                message: 'Erro ao atualizar jornada',
                error: error.message,
                errors: error.errors 
            });
        }
    }

    async edit(req, res) {
        try {
            const { id } = req.params;
            const journey = await JourneyService.getJourneyForEdit(id);
            
            if (!journey) {
                return res.status(404).json({ message: 'Jornada não encontrada' });
            }

            res.status(200).json(journey);
        } catch (error) {
            res.status(500).json({ 
                message: 'Erro ao carregar jornada para edição',
                error: error.message 
            });
        }
    }

    async destroy(req, res) {
        try {
            const { id } = req.params;
            await JourneyService.deleteJourney(id);
            
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ 
                message: 'Erro ao excluir jornada',
                error: error.message 
            });
        }
    }

    async sendImage(req,res) {
        const id = req.params.id;
        const fileName = req.params.fileName;
        const filePath =  await JourneyService.sendImage(id, fileName);
        
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Erro ao enviar o arquivo:', err);
                res.status(404).send('Arquivo');
            }
        });
        
    }
}

module.exports = new JourneyController();