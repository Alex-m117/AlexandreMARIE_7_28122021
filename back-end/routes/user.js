// Routes liées à l'utilisateur du site.
const express = require ('express');
const router = express.Router();

const email = require ('../middleware/email');
const password = require ('../middleware/password');

const auth = require ('../middleware/auth');
const multer = require ('../middleware/multer-config');
const userControl = require ('../controllers/user');

router.post ('/signup', email, password, userControl.signup);
router.post ('/login', userControl.login);
router.get ('/account/:id', auth,userControl.getAccount );
router.put ('/account/:id', auth, multer, userControl.updateAccount);
router.delete ('/account/:id', auth, userControl.deleteAccount);

module.exports = router;
