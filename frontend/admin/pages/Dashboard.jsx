import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';

const Dashboard = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		apiFetch('/posts?includeDrafts=true')
			.then((data) => setPosts(data))
			.catch((err) => console.error(err))
			.finally(() => setLoading(false));
	}, []);

	const handleTogglePublish = async (post) => {
		try {
			const updated = await apiFetch(`/posts/${post.id}`, {
				method: 'PUT',
				body: JSON.stringify({
					title: post.title,
					content: post.content,
					published: !post.published,
				}),
			});
			setPosts((prev) => prev.map((p) => (p.id === post.id ? updated : p)));
		} catch (err) {
			alert(err.message);
		}
	};

	const handleDelete = async (postId) => {
		if (!window.confirm('本当にこの記事を削除しますか？')) return;
		try {
			await apiFetch(`/posts/${postId}`, { method: 'DELETE' });
			setPosts((prev) => prev.filter((p) => p.id !== postId));
		} catch (err) {
			alert(err.message);
		}
	};

	if (loading) return <p>読み込み中...</p>;

	return (
		<div>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '1.5rem',
				}}
			>
				<h1>記事管理</h1>
				<Link
					to='/posts/new'
					style={{
						padding: '0.5rem 1rem',
						background: '#0066cc',
						color: '#fff',
						textDecoration: 'none',
						borderRadius: '4px',
					}}
				>
					＋ 新規記事作成
				</Link>
			</div>
			{posts.map((post) => (
				<div
					key={post.id}
					style={{
						border: '1px solid #ddd',
						padding: '1rem',
						marginBottom: '1rem',
						borderRadius: '6px',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<div>
						<span
							style={{
								padding: '2px 8px',
								fontSize: '0.8rem',
								borderRadius: '4px',
								marginRight: '0.5rem',
								background: post.published ? '#d4edda' : '#f8d7da',
								color: post.published ? '#155724' : '#721c24',
							}}
						>
							{post.published ? '公開中' : '下書き'}
						</span>
						<strong>{post.title}</strong>
					</div>
					<div style={{ display: 'flex', gap: '0.5rem' }}>
						<button onClick={() => handleTogglePublish(post)}>
							{post.published ? '非公開にする' : '公開する'}
						</button>
						<Link to={`/posts/${post.id}/edit`}>
							<button>編集・コメント管理</button>
						</Link>
						<button
							onClick={() => handleDelete(post.id)}
							style={{ color: 'red' }}
						>
							削除
						</button>
					</div>
				</div>
			))}
		</div>
	);
};
export default Dashboard;
