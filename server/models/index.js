import Sequelize from 'sequelize';

const sequelize = new Sequelize('slackclone', 'postgres', 'postgres', {
  dialect: 'postgres',
  operatorsAliases: Sequelize.Op,
  define: {
    underscored: true, // converts all tables to snakeCase
  },
});

const models = {
  User: sequelize.import('./user'),
  Channel: sequelize.import('./channel'),
  Message: sequelize.import('./message'),
  Team: sequelize.import('./team'),
  Member: sequelize.import('./member'),
};

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;