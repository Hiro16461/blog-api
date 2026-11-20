const { prisma } = require('../lib/prisma');

async function getAllPosts(req, res) {
	try {
		const posts = await prisma.post.findMany({
			orderBy: { createdAt: 'desc' },
		});
		res.json(posts);
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
        res.status(201).json(newPost)
	} catch (error) {
		res.status(500).json({ error: '記事の作成に失敗しました' });
	}
}

module.exports = { getAllPosts, createPost };
