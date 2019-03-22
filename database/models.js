const Sequelize = require('sequelize')
//For using datatypes -
const dataTypes = Sequelize.DataTypes;
//Require the configrtion file
const dbconfig = require('../databaseconfig').DB


//Creation of database -
const mgmtSystem = new Sequelize(dbconfig.database,
        dbconfig.user,
        dbconfig.password,
        {   host:dbconfig.host,
           dialect:dbconfig.dialect
        }
        )
//Tables - Using class object-
const Depart = mgmtSystem.define(
    'department',
    {
        dno:{
            type:dataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        dname:{
          type:dataTypes.STRING,
          allowNull:false
        },
        hod:{
            type:dataTypes.STRING
        },
        block:{
            type:dataTypes.STRING
        }
    }
)

const Labs = mgmtSystem.define(
    'labs',
    {
        labid:{
            type:dataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        block: dataTypes.STRING,
        technician:{
            type:dataTypes.STRING
        },
        floor: dataTypes.INTEGER,
        name:{
            type:dataTypes.STRING
        }
    }
)

Labs.belongsTo(Depart);
Depart.hasMany(Labs);

//sync the database
mgmtSystem.sync({force:true}).then(()=> console.log('Database Configured'))
    .catch((err)=> console.error(err))

exports.model = {
    Depart , Labs
}