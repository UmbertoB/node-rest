'use strict';
module.exports = (sequelize, DataTypes) => {

    const Contact = sequelize.define('Contact', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        phone: DataTypes.STRING,
        email: DataTypes.STRING
    },
        {
            underscored: true,
            freezeTableName: true,
            timestamps: false
        });


    return Contact;
};