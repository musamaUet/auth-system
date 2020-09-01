const db = require('../models');
const Post = db.posts;
const User = db.users;
const Profile = db.profile;
const Op = db.Sequelize.Op;
const util = require('../util/util');
const fs=require('fs');

/**
    Calling of middleware functions
 */
exports.sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        //req.session.loggedin=true;
        console.log(req.session.user, 'Muhammad', req.cookies.user_sid);
        res.status(201).json({ message: 'You are already logged in with id=>' + req.session.user })
    } else {
        next();
    }
};

exports.sessionForApi = (req, res, next) => {
    console.log('Muhammad', req.session.user, 'Muhammad', req.cookies.user_sid);
    if (req.session.user && req.cookies.user_sid) {
        next();
    } else {
        res.status(400).json({ message: 'You need to sign in/sign up first' });
    }
}

/**
    End of calling of middleware functions
 */
exports.create = (req, res) => {

    if (!req.body.title || !req.body.description) {
        res.status(400).send({ message: 'Content Cant be empty' });
        return;
    }
    req.session.postTitle=req.body.title;
    const post = {
        title: req.body.title,
        description: req.body.description,
        profile_img_id:req.session.profile_img_id,
        published: req.body.published ? req.body.published : false,
        post_username: req.session.Auth
    }

    Post.create(post).then(data => {
        res.status(200).send({ message: data + 'Data Saved successfully' })
    }).catch(err => {
        res.status(500).send(err.message || 'Error occured while creating tutorial')
        console.log(err);
    })
}

exports.findOne = (req, res) => {
    const id = req.params.id;
    Post.findByPk(id).then(data => {
        res.status(201).send(data)
    }).catch(err => {
        res.status(404).send('Error ' || err);
    });
}

exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

    let limit = 5;
    let page = req.body.page || 1;
    let offset = 0 + (page - 1) * limit;
    Post.findAndCountAll({
        offset: offset,
        limit: limit,
        where: condition
    }).then(data => {
        res.status(200).send(data);
    }).catch(err => {
        res.status(500).send({ message: 'Failed in retrieving data' || err })
    })
}

exports.delete = (req, res) => {
    const id = req.params.id;
    Post.destroy({ where: { id: id } }).then(num => {
        if (num == 1) {
            res.status(201).send({ message: 'deleted with id' + num })
        }
        else {
            res.status(400).send({ message: `Cannot delete Post with id=${id}. Maybe Post was not found!` });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Could not delete Post with id=" + id
        });
    });
}

exports.deleteAll = (req, res) => {
    Post.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Posts were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Posts."
            });
        });
};

exports.update = (req, res) => {

    const id = req.params.id;
    Post.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Post was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Post with id=${id}. Maybe Post was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Tutorial with id=" + id
            });
        });
}

exports.findUserPosts = (req, res) => {

    const id = req.params.id;
    const username = req.session.Auth;
    Post.findAll({ where: { post_username: username } }).then(data => {
        res.send(data)
    }).catch(err => {
        res.send({ message: 'failed to find' || err })
    })
}

// // Auth Controllers
// route for Home-Page
exports.getHome = (req, res) => {
    //res.redirect('/login');
    res.status(201).json({ message: 'Enter your login credentials' })
};

exports.getSignup = (req, res) => {
    // res.sendFile(__dirname + '/public/signup.html');
    res.status(200).json({ message: 'Enter signup credentials' })
};

exports.postSignup = async (req, res) => {

    var emailVal = await util.checkEmailValidation(req.body.email);
    var usernameVal = await util.checkUsernameValidation(req.body.username);
    var passVal = await util.checkPasswordValidation(req.body.password);
    var password = await util.hashPassword(req.body.password);

    if (emailVal) {
        if (usernameVal) {
            if (passVal) {
                User.create({
                    username: req.body.username,
                    email: req.body.email,
                    password: password
                }).then(user => {
                    console.log(user);
                    req.session.user = user.dataValues;
                    req.session.Auth = req.body.username;
                    res.status(201).json({ message: 'Congratulations you are sinedUp and logged in successfully' });
                })
            } else {
                res.status(505).json({ message: 'The password validation failed,' + util.passwordMessage });
            }
        } else {
            res.status(505).json({ message: 'This username is already registered, choose another' });
        }
    } else {
        res.status(505).json({ message: 'This email is already registered, choose another' });
    }
};

exports.getLogin = (req, res) => {
    //res.sendFile(__dirname + '/public/login.html');
    res.status(400).json({ message: 'enter login credentials' })
};
exports.postLogin = (req, res) => {
    var username = req.body.username,
        password = req.body.password;

    //Session Manipulation
    req.session.Auth = req.body.username;
    User.findOne({ where: { username: username } }).then(function (user) {
        if (!user) {
            //res.redirect('/login');
            res.status(400).json({ message: 'This user is not registered' })
            console.log(user);
        } else if (!util.validPass(password, user.password)) {
            res.status(400).json({ message: 'Osama! you are not logged in yet' })
            //res.redirect('/login');
        } else {
            req.session.user = user.dataValues;
            res.status(200).json({ message: 'Osama! you are now logged in' })
        }
    })
};

exports.getDashboard = (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        // res.sendFile(__dirname + '/public/dashboard.html');
        res.status(201).json({ message: 'Welcome to dashboard' })
    } else {
        //res.redirect('/login');
        res.status(201).json({ message: 'you need to login first' })
    }
};

// route for user logout
exports.getLogout = (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        //res.redirect('/');
        res.status(201).json({ message: 'Logged out successfully' })
    } else {
        res.redirect('/login');
    }
};

// route for Profile Uploadation
exports.uploadFiles = async (req, res) => {
    try{
        console.log('Call from upload files',req.file);
        if(req.file == undefined ){
            return res.status(500).send({message:'You must have to select a file'});
        }

        //console.log('req of id',req.params.id);
        const profileUsername = req.session.Auth;
        Profile.create({
            type:req.body.mimetype,
            name:req.file.originalname,
            post_username:profileUsername,
            data:fs.readFileSync(__dirname + "/../uploads/" + req.file.filename),
        }).then(image=>{
            fs.writeFileSync(__dirname + "/../uploads/" + image.name, image.data);
            req.session.profile_img_id = image.id;
            console.log('req of image id',image.id);

            return res.status(201).send({message:'Image file has been uploaded successfully'});
        });
    } catch(error){
        console.log(error);
        return res.send(`Error when trying upload images: ${error}`);
    }

}