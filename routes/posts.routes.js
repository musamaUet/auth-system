
module.exports = app => {
    var router = require('express').Router();
    var authChecker = require('../server');
    var multer = require('multer');
    // var uploads = multer({ dest: 'uploads/' });
    var uploads=require('../middlewares/profile.middleware');
    const posts = require('../controllers/posts.controllers');

    // Auth Routes
    router.get('/', posts.sessionChecker, posts.getHome);
    router.get('/signup', posts.sessionChecker, posts.getSignup);
    router.post('/signup', posts.sessionChecker, posts.postSignup);
    router.get('/login', posts.sessionChecker, posts.getLogin);
    router.post('/login', posts.sessionChecker, posts.postLogin);
    router.get('/dashboard', posts.sessionChecker, posts.getDashboard);
    router.get('/logout', posts.getLogout);
    // End of Auth Routes

    // Post Routes
    router.get('/allPosts', posts.sessionForApi, posts.findAll);
    router.get('/find_user_posts', posts.sessionForApi, posts.findUserPosts);
    router.get('/:id', posts.sessionForApi, posts.findOne);
    router.post('/addPost', posts.sessionForApi, posts.create);
    router.delete('/', posts.sessionForApi, posts.delete);
    router.delete('/', posts.sessionForApi, posts.deleteAll);
    // Now start of profile routes
    router.post('/upload_profile', posts.sessionForApi, uploads.single('file'), posts.uploadFiles);

    //Api routes prepended
    app.use('/api/posts', router);
}