'use strict';
module.exports = (sequelize, DataTypes) => {
  var Usuario = sequelize.define('Usuario', {
    nombre: DataTypes.STRING,
    contrasena: DataTypes.STRING,
    admin: DataTypes.BOOLEAN
  }, {});
  Usuario.associate = function(models) {
    // associations can be defined here
  };
  return Usuario;
};