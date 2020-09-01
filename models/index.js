const dbConfig = require('../config/db.config');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        accquire: dbConfig.pool.accquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.posts = require("./post.model")(sequelize, Sequelize);
db.users = require('./user.model')(sequelize, Sequelize);
db.profile = require('./profile.model')(sequelize, Sequelize);

module.exports = db;