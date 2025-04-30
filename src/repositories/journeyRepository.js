const Journey = require('../entities/journeyEntity');
const User = require('../entities/userEntity');
const Area = require('../entities/areaEntity');

class JourneyRepository {
    async create(journeyData) {
        return await Journey.create({
            user_id: journeyData.user_id,
            title: journeyData.title,
            description: journeyData.description,
            imagePath: journeyData.imagePath,
            area_id: journeyData.area_id,
            publish: journeyData.publish
        });
    }

    async findById(id) {
        return await Journey.findByPk(id, {
            include: [
                { model: User, attributes: ['name', 'email'] },
                { model: Area, attributes: ['title'] }
            ]
        });
    }

    async update(id, journeyData) {
        const journey = await Journey.findByPk(id);
        if (!journey) {
            throw new Error('Jornada não encontrada');
        }
        return await journey.update(journeyData);
    }

    async delete(id) {
        const journey = await Journey.findByPk(id);
        if (!journey) {
            throw new Error('Jornada não encontrada');
        }
        return await journey.destroy();
    }

    async findAllByUser(userId) {
        return await Journey.findAll({
            where: { user_id: userId },
            include: [
                { model: User, attributes: ['name', 'email'] },
                { model: Area, attributes: ['title'] }
            ]
        });
    }

    async findAllPublished() {
        return await Journey.findAll({
            where: { publish: true },
            include: [
                { model: User, attributes: ['name', 'email'] },
                { model: Area, attributes: ['title'] }
            ]
        });
    }
}

module.exports = new JourneyRepository();