const { Router } = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { prisma } = require('../lib/prisma');

const router = Router();

router.post('/signup', async (req, res) => {
	const { username, password } = req.body;
	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: { username, password: hashedPassword },
		});
		res
			.status(201)
			.json({ message: 'ユーザーを作成しました', userId: user.id });
	} catch (error) {
		res.status(400).json({ error: 'ユーザー登録に失敗しました' });
	}
});

router.post('/login', (req, res, next) => {
	passport.authenticate('local', { session: false }, (err, user, info) => {
		if (err || !user) {
			return res.status(401).json({
				error: info ? info.message : '認証に失敗しました',
			});
		}
		const token = jwt.sign(
			{ userId: user.id, username: user.username },
			process.env.JWT_SECRET,
			{ expiresIn: '24h' },
		);
		return res.json({ token, user: { id: user.id, username: user.username } });
	})(req, res, next);
});

module.exports = router;
