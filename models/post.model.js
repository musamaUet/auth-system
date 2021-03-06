module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define('post', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        title: {
            type: Sequelize.STRING
        },
        profile_img_id:{
            type:Sequelize.INTEGER,
            allowNull:false,
            refrences:{
                model:'Profile',
                key:'id',
            }
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
        Post.belongsTo(models.Profile,{
            onDelete: 'cascade',
            foreignKey:'profile_img_id'
        })
    }

    sequelize.sync().then(() => {
        console.log('Posts table has been re-created now if not exists')
    }).catch(error => {
        console.log('This error occured', error)
    });
    return Post;
}