import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';

const HomePage = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		apiFetch('/posts')
			.then((data) => setPosts(data))
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, []);

	if (loading) return <p>記事を読み込み中...</p>;
	if (error) return <p style={{ color: 'red' }}>エラー: {error}</p>;

	return (
		<div>
			<h1>最新記事</h1>
			{posts.length === 0 ? (
				<p>まだ公開されている記事がありません。</p>
			) : (
				posts.map((post) => (
					<article
						key={post.id}
						style={{
							border: '1px solid #e0e0e0',
							borderRadius: '8px',
							padding: '1.5rem',
							marginBottom: '1.5rem',
						}}
					>
						<h2>
							<Link to={`/posts/${post.id}`}>{post.title}</Link>
						</h2>
						<small style={{ color: '#666' }}>
							投稿日: {new Date(post.createdAt).toLocaleDateString('ja-JP')}
						</small>
						<p>{post.content.slice(0, 150)}...</p>
						<Link to={`/posts/${post.id}`}>続きを読む →</Link>
					</article>
				))
			)}
		</div>
	);
};
export default HomePage;
