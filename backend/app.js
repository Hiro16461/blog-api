require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('./config/passport');
const postRouter = require('./routes/posts');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize())

app.get('/', (req, res) => {
	res.json({ message: 'Blog API is running!' });
});

app.use('/auth', authRouter)
app.use('/posts', postRouter);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
