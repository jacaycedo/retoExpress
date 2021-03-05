const {Datatypes, Model, DataTypes} = require("sequelize");
const sequelize = require("../lib/sequelize");

class Mensaje extends Model{}

Mensaje.init(
    {
        Message : {
            type: DataTypes.STRING,
            allowNull: false,
        },
        author : {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ts:{
            type: DataTypes.NUMBER,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName:"Mensaje",
    }
);
Mensaje.sync();

module.exports = Mensaje;