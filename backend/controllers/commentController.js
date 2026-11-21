const { prisma } = require('../lib/prisma');

async function getCommentsByPost(req, res) {
	const postId = req.params.postId;
	try {
		const comments = await prisma.comment.findMany({
			where: { postId },
			orderBy: { createdAt: 'desc' },
		});
		res.json(comments);
	} catch (error) {
		res.status(500).json({ error: 'コメントの取得に失敗しました' });
	}
}

async function createComment(req, res) {
	const postId = req.params.postId;
	const { content, authorName } = req.body;
	try {
		const newComment = await prisma.comment.create({
			data: {
				content,
				authorName: authorName || '匿名',
				postId,
			},
		});
		res.status(201).json(newComment);
	} catch (error) {
		res.status(500).json({ error: 'コメントの投稿に失敗しました' });
	}
}

async function updateComment(req, res) {
	const commentId = req.params.commentId;
	const { content } = req.body;
	try {
		const updatedComment = await prisma.comment.update({
			where: { id: commentId },
			data: { content },
		});
		res.json(updatedComment);
	} catch (error) {
		res.status(500).json({ error: 'コメントの更新に失敗しました' });
	}
}

async function deleteComment(req, res) {
	const commentId = req.params.commentId;
	try {
		await prisma.comment.delete({
			where: { id: commentId },
		});
		res.json({ message: 'コメントを削除しました' });
	} catch (error) {
		res.status(500).json({ error: 'コメントの削除に失敗しました' });
	}
}

module.exports = {
	getCommentsByPost,
	createComment,
	updateComment,
	deleteComment,
};
