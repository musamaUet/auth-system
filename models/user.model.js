module.exports = (sequelize, Sequelize) => {
    var User = sequelize.define('users', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        username: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        // user_postId: {
        //     type: Sequelize.INTEGER,
        //     allowNull: false,
        //     refrences: {
        //         model: 'Posts',
        //         key: 'id'
        //     }
        // },
        email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    User.associate = (models) => {
        // User.belongsTo(models.User,{
        //     foreignKey:{
        //         allowNull:false
        //     }
        // })

        // // //One to Many with Posts
        // // User.hasMany(models.Post, {
        // //     foreignKey: 'user_postId',
        // //     as: 'post'
        // // })
    }
    // create all the defined tables in the specified database.
    sequelize.sync()
        .then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
        .catch(error => console.log('This error occured', error));

    return User;
}
