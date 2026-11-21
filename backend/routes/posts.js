const express = require('express');
const {
	getAllPosts,
	getPostById,
	createPost,
	updatedPost,
	deletePost,
} = require('../controllers/postController');
const commentRouter = require('./comments')
const router = express.Router();

router.get('/', getAllPosts);
router.get('/:postId', getPostById)
router.post('/', createPost);
router.put('/:postId', updatedPost)
router.delete('/:postId', deletePost)

router.use('/:postId/comments', commentRouter)

module.exports = router;
