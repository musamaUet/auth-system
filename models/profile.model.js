module.exports = (sequelize, Sequelize) => {
    const Profile = sequelize.define('profile', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        data:{
            type:Sequelize.BLOB("long"),
        },
        name:{
            type:Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING,
        },
        post_username: {
            type: Sequelize.STRING,
            allowNull: false,
            refrences: {
                model: 'Users',
                key: 'username'
            }
        }
    });

    Profile.associate = (models) => {
        Profile.hasMany(models.User, {
            onDelete: 'cascade',
            foreignKey: 'post_username'
        });
        Profile.hasMany(models.Post, {
            onDelete: 'cascade',
            foreignKey: 'id'
        })
    }

    sequelize.sync().then(() => {
        console.log('Profile table has been re-created now if not exists')
    }).catch(error => {
        console.log('This error occured', error)
    });
    return Profile;
}