const { Router } = require('express');
const {
	getCommentsByPost,
	createComment,
	updateComment,
	deleteComment,
} = require('../controllers/commentController');

const router = Router({ mergeParams: true });

router.get('/', getCommentsByPost)
router.post('/', createComment);
router.put('/:commentId', updateComment);
router.delete('/:commentId', deleteComment);

module.exports = router;