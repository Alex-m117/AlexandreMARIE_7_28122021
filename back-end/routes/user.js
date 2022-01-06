const express = require ('express');
const router = express.Router();

const email = require ('../middleware/email');
const password = require ('../middleware/password');

const auth = require ('../middleware/auth');
const multer = require ('../middleware/multer-config');
const userControl = require ('../controllers/user');

router.post ('/signup', email, password, userControl.signup);
//router.post ('/login', userControl.login);
//router.get ('/accounts', auth, userControl.getAllUsers);
//router.put ('/accounts/:id', auth, multer, userControl.updateAccount);
//router.get ('/accounts/:id', auth,userControl.getAccount );
//router.delete ('/accounts/:id', auth, userControl.deleteAccount);

module.exports = router;
