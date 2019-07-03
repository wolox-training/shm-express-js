'use strict';
module.exports = (sequelize, DataTypes) => {
  const Album = sequelize.define(
    'Album',
    {
      title: {
        allowNull: false,
        type: DataTypes.STRING
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'user_id'
      }
    },
    {
      underscored: true,
      tableName: 'albums'
    }
  );
  Album.associate = models => Album.belongsTo(models.User, { foreignKey: 'userId' });

  return Album;
};
