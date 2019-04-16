const Sequelize = require('sequelize')
const dbconfig = require('../databaseconfig').DB

const databaseModel1 = require('./models')
const databaseModel2 = require('./models2')


//Datatypes -
const dataTypes = Sequelize.DataTypes

const mgmtSystem = new Sequelize(dbconfig.database,
    dbconfig.user,
    dbconfig.password,
    {   host:dbconfig.host,
        dialect:dbconfig.dialect
    }
)

//Issue database - which will keep the record of which Product is issued to Whom or which LAB-
const IssuedDepartment = mgmtSystem.define(
    'issue_dept',
    {
        id: {
            type: dataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        qty: dataTypes.INTEGER,


    })

const IssuedLab = mgmtSystem.define(
    'issue_lab',
    {
        id:{
            type:dataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        qty: dataTypes.INTEGER
    }
)


IssuedDepartment.belongsTo(databaseModel1.Depart)
databaseModel1.Depart.hasOne(IssuedDepartment);

IssuedLab.belongsTo(databaseModel1.Labs)
databaseModel1.Labs.hasOne(IssuedLab)

IssuedLab.belongsTo(databaseModel2.Product)
databaseModel2.Product.hasMany(IssuedLab)

IssuedDepartment.belongsTo(databaseModel2.Product)
databaseModel2.Product.hasMany(IssuedDepartment)


mgmtSystem.sync({
    alter:true
}).then(() => console.log('Issue Model'))
.catch((err)=>console.error(err))

exports = module.exports = {
    IssuedDepartment, IssuedLab
}