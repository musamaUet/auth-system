module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define('uploadfile', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        title: {
            type: Sequelize.STRING
        },
        post_username: {
            type: Sequelize.STRING,
            allowNull: false,
            refrences: {
                model: 'Users',
                key: 'username'
            }
        },
        description: {
            type: Sequelize.STRING
        },
        published: {
            type: Sequelize.BOOLEAN
        }
    });

    Post.associate = (models) => {
        Post.hasMany(models.User, {
            onDelete: 'cascade',
            foreignKey: 'post_username'
        });
    }

    sequelize.sync().then(() => {
        console.log('Posts table has been re-created now if not exists')
    }).catch(error => {
        console.log('This error occured', error)
    });
    return Post;
}