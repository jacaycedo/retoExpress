const {Sequelize} = require("sequelize")

const sequelize = new Sequelize("database", "","",
{
    dialect : 'sqlite',
    storage: "./database/database.sqlite",
});

sequelize.authenticate().then(()=>{
    console.log("Entro DB");
})

module.exports = sequelize;