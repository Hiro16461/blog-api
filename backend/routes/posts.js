const express = require('express');
const passport = require('passport');
const {
	getAllPosts,
	getPostById,
	createPost,
	updatedPost,
	deletePost,
} = require('../controllers/postController');
const commentRouter = require('./comments')
const router = express.Router();

const requireAuth = passport.authenticate('jwt', {session:false})

router.get('/', getAllPosts);
router.get('/:postId', getPostById)
router.post('/', requireAuth,createPost);
router.put('/:postId',requireAuth, updatedPost)
router.delete('/:postId',requireAuth, deletePost)

router.use('/:postId/comments', commentRouter)

module.exports = router;
