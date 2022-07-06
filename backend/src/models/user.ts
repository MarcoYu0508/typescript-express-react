'use strict';

import { Model, InferAttributes, InferCreationAttributes, CreationOptional, UUIDV4 } from 'sequelize';

module.exports = (sequelize: any, DataTypes: any) => {
  class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: string;
    declare name: string;
    declare account: string;
    declare password: string;

    // timestamps!
    // createdAt can be undefined during creation
    declare createdAt: CreationOptional<Date>;
    // updatedAt can be undefined during creation
    declare updatedAt: CreationOptional<Date>;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    declare static associations: {
      // define association here
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    account: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};