const express = require('express');
const passport = require('passport');
const {
	getAllPosts,
	getPostById,
	createPost,
	updatedPost,
	deletePost,
} = require('../controllers/postController');
const commentRouter = require('./comments');
const router = express.Router();

const requireAuth = passport.authenticate('jwt', { session: false });

function optionalAuth(req, res, next) {
	passport.authenticate('jwt', { session: false }, (err, user) => {
		if (!err && user) {
			req.user = user;
		}
		next();
	})(req, res, next);
}

router.get('/', optionalAuth, getAllPosts);
router.get('/:postId', optionalAuth, getPostById);
router.post('/', requireAuth, createPost);
router.put('/:postId', requireAuth, updatedPost);
router.delete('/:postId', requireAuth, deletePost);

router.use('/:postId/comments', commentRouter);

module.exports = router;
