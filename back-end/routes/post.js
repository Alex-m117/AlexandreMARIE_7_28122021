const express = require ('express');
const router = express.Router();

const auth = require ('../middleware/auth');
const multer = require ('../middleware/multer-config');
const postControl = require ('../controllers/post');

router.post ('/add', auth, multer, postControl.createPost);
router.get ('/:id', auth, postControl.getOnePost);
router.get ('/', auth, postControl.getAllPosts);
router.put ('/:id', auth, multer, postControl.modifyPost);
router.delete ('/:id', auth, multer, postControl.deletePost);
router.post ('/:id/comments', auth, multer, postControl.createComment);
router.get ('/:id/comments', auth, postControl.getAllComments);
router.put ('/comments/:id', auth, postControl.modifyComment);
router.delete ('/comments/:id', auth, postControl.deleteComment);
router.post ('/:id/like', auth, postControl.likePost);


module.exports = router;