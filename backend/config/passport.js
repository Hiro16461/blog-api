const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const bcrypt = require('bcryptjs');
const { prisma } = require('../lib/prisma');

passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await prisma.user.findUnique({ where: { username } });
			if (!user) {
				return done(null, false, {
					message: 'ユーザー名またはパスワードが間違っています',
				});
			}
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return done(null, false, {
					message: 'ユーザー名またはパスワードが間違っています',
				});
			}
			return done(null, user);
		} catch (error) {
			return done(error);
		}
	}),
);

const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET,
};

passport.use(
    new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: {id: jwtPayload.userId}
            })
            if (!user) {
                return done(null, false)
            }
            return done(null, user)
        } catch (error) {
            return done(error, false)
        }
    })
)

module.exports = passport;