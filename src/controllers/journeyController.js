const { JourneyService } = require('../services');
const { verifyToken } = require('../middlewares/authMiddleware');

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
        console.log(req);
        try {
            const userId = req.user.id;
            
            // if (!req.body.imageData) {
            //     return res.status(400).json({ 
            //         message: 'A escolha da IMAGEM é obrigatória' 
            //     });
            // }
    
            // Processa a imagem em base64
            // const imagePath = await JourneyService.processBase64Image(
            //     req.body.imageData, 
            //     userId
            // );
    
            const journeyData = {
                user_id: userId,
                title: req.journey.title,
                description: req.description,
                area_id: req.area_id,
                publish: req.publish || false,
                //imagePath: imagePath
            };
            console.log(journeyData);
            const journey = await JourneyService.createJourney(journeyData);
            
            res.status(201).json(journey);
        } catch (error) {
            // Remove o arquivo se foi criado
            if (error.imagePath) {
                fs.unlinkSync(path.join(__dirname, `../../${error.imagePath}`));
            }
            res.status(500).json({ 
                message: 'Erro na criação do Game',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            
            const journeyData = {
                ...req.body,
                user_id: userId,
                imagePath: req.file ? `/uploads/${req.file.filename}` : undefined
            };

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
}

module.exports = new JourneyController();