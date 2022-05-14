const router = require('express').Router()
const multer = require('multer')
//multer storage

var storage = multer.diskStorage({
  destination: function (req, file, cb) { 
    cb(null, 'public/profiles') //letak folder disimpen
  },
  filename: function (req, file, cb) {
    cb(null, 'IMG-' + Date.now() + '.jpg') //Appending .jpg
  }
})

var poststorage = multer.diskStorage({
  destination: function (req, file, cb) { 
    cb(null, 'public/posts') //letak folder disimpen
  },
  filename: function (req, file, cb) {
    cb(null, 'POSTIMG-' + Date.now() + '.jpg') //Appending .jpg
  }
})

var upload = multer({ storage: storage, limits : 10000000});
var uploadpost = multer({storage: poststorage, limits : 10000000});

//import controllers
const { user,auth,post } = require('../controllers');

//define routes

router.get('/users',user.getUsers);
router.get('/users/:uid',user.getUsersByUid);
router.get('/users/username/:username',user.getUsersByUsername);
router.patch('/users/:uid', user.patchUser)
router.post('/users/uploadProfilePicture', upload.single('image'), user.uploadProfilePicture)
router.post('/auth/register',auth.registerUser);
router.post('/auth/login', auth.loginUser);
router.get('/auth/:code', auth.verifyUser);
router.post('/auth/sendVerification', auth.sendVerificationLink)
router.post('/auth/resetpassword', auth.sendResetPasswordPage)
router.patch('/auth/inputresetpassword', auth.resetPassword)

router.post('/post', uploadpost.single('postpicture'), post.postGaram);
router.get('/post', post.getGarams);
router.delete('/post/:id', post.deleteGaram);
module.exports = router