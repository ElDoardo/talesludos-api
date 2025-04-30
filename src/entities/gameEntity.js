const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Journey = require('./journeyEntity');

const Game = sequelize.define('Game', {
    journey_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Journey,
            key: 'id'
        },
        allowNull: false
    },
    marks: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    links: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    scenes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    challenges: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
});

Game.belongsTo(Journey, { foreignKey: 'journey_id' });

module.exports = Game;