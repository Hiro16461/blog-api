const bcrypt = require('bcryptjs');
const { prisma } = require('./lib/prisma');

async function main() {
	const hashedPassword = await bcrypt.hash('password123', 10);

	const user = await prisma.user.upsert({
		where: { username: 'Alice' },
		update: { password: hashedPassword },
		create: {
			username: 'Alice',
			email: 'alice@prisma.io',
			password: hashedPassword,
			posts: {
				create: [
					{
						title: 'Hello World',
						content: 'This is my first post!',
						published: true,
						comments: {
							create: {
								authorName: 'Alice',
								content: 'This is my first comment!',
							},
						},
					},
					{
						title: 'Draft Post (下書きテスト)',
						content: '管理画面での公開切り替え確認用の下書き記事です。',
						published: false,
					},
				],
			},
		},
		include: {
			posts: {
				include: {
					comments: true,
				},
			},
		},
	});

	console.log('Seeded user:', JSON.stringify(user, null, 2));
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
