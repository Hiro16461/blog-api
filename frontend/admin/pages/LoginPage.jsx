import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/client';

const LoginPage = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		try {
			const data = await apiFetch('/auth/login', {
				method: 'POST',
				body: JSON.stringify({ username, password }),
			});

			localStorage.setItem('token', data.token);
			localStorage.setItem('user', JSON.stringify(data.user));
			navigate('/');
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			style={{
				maxWidth: '400px',
				margin: '3rem auto',
				display: 'flex',
				flexDirection: 'column',
				gap: '1rem',
			}}
		>
			<h2>管理画面ログイン</h2>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<input
				type='text'
				placeholder='ユーザー名'
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				required
			/>
			<input
				type='password'
				placeholder='パスワード'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
      />
      <button type="submit">ログイン</button>
		</form>
	);
};
export default LoginPage;
