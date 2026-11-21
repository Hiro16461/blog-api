const { prisma } = require('../lib/prisma');

async function getAllPosts(req, res) {
	try {
		const posts = await prisma.post.findMany({
			orderBy: { createdAt: 'desc' },
			include: {
				author: { select: { username: true } },
				comments: { orderBy: { createdAt: 'desc' } },
			},
		});
		res.json(posts);
	} catch (error) {
		res.status(500).json({ error: '記事の取得に失敗しました' });
	}
}

async function getPostById(req, res) {
	const postId = req.params.postId;

	try {
		const post = await prisma.post.findUnique({
			where: { id: postId },
			include: {
				author: { select: { username: true } },
				comments: { orderBy: { createdAt: 'desc' } },
			},
		});
		if (!post) {
			return res.status(404).json({ error: '記事が見つかりません' });
		}
		res.json(post);
	} catch (error) {
		res.status(500).json({ error: '記事の取得に失敗しました' });
	}
}

async function createPost(req, res) {
	const { title, content, published, authorId } = req.body;
	try {
		const newPost = await prisma.post.create({
			data: {
				title,
				content,
				published: Boolean(published),
				authorId: String(authorId),
			},
		});
		res.status(201).json(newPost);
	} catch (error) {
		res.status(500).json({ error: '記事の作成に失敗しました' });
	}
}

async function updatedPost(req, res) {
	const postId = req.params.postId;
	const { title, content, published } = req.body;
	try {
		const updatedPost = await prisma.post.update({
			where: { id: postId },
			data: {
				...(title !== undefined && { title }),
				...(content !== undefined && { content }),
				...(published !== undefined && { published: Boolean(published) }),
			},
		});
		res.json(updatedPost);
	} catch (error) {
		res.status(500).json({ error: '記事の更新に失敗しました' });
	}
}

async function deletePost(req, res) {
	const postId = req.params.postId;
	try {
		await prisma.post.delete({
			where: { id: postId },
		});
		res.json({ message: '記事を削除しました' });
	} catch (error) {
		res.status(500).json({ error: '記事の削除に失敗しました' });
	}
}

module.exports = {
	getAllPosts,
	getPostById,
	createPost,
	updatedPost,
	deletePost,
};
