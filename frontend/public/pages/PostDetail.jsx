import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../api/client';

const PostDetail = () => {
	const { postId } = useParams();
	const [post, setPost] = useState(null);
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(true);

	const [authorName, setAuthorName] = useState('');
	const [content, setContent] = useState('');
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		Promise.all([
			apiFetch(`/posts/${postId}`),
			apiFetch(`/posts/${postId}/comments`),
		])
			.then(([postData, commentsData]) => {
				setPost(postData);
				setComments(commentsData);
			})
			.catch((err) => console.error(err))
			.finally(() => setLoading(false));
	}, [postId]);

	const handleCommentSubmit = async (e) => {
		e.preventDefault();
		if (!content.trim()) return;
		setSubmitting(true);
		try {
			const newComment = await apiFetch(`/posts/${postId}/comments`, {
				method: 'POST',
				body: JSON.stringify({ authorName, content }),
			});
			setComments((prev) => [...prev, newComment]);
			setAuthorName('');
			setContent('');
		} catch (err) {
			alert(`コメントの送信に失敗しました: ${err.message}`);
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) return <p>読み込み中...</p>;
	if (!post) return <p>記事が見つかりませんでした。</p>;

	return (
		<div>
			<Link to={'/'}>記事一覧に戻る</Link>
			<article style={{ marginTop: '1.5rem' }}>
				<h1>{post.title}</h1>
				<small style={{ color: '#666' }}>
					投稿日: {new Date(post.createdAt).toLocaleDateString('ja-JP')}
				</small>
				<div
					style={{
						whiteSpace: 'pre-wrap',
						marginTop: '1.5rem',
						lineHeight: '1.8',
					}}
				>
					{post.content}
				</div>
			</article>
			<hr style={{ margin: '3rem 0' }} />
			<section>
				<h3>コメント ({comments.length})</h3>
				{comments.length === 0 ? (
					<p>まだコメントはありません。</p>
				) : (
					<ul style={{ listStyle: 'none', padding: 0 }}>
						{comments.map((comment) => (
							<li
								key={comment.id}
								style={{
									background: '#f9f9f9',
									padding: '1rem',
									borderRadius: '6px',
									marginBottom: '1rem',
								}}
							>
								<strong>
									{comment.authorName || comment.user?.username || '匿名'}
								</strong>
								<small style={{ marginLeft: '0.5rem', color: '#666' }}>
									{new Date(comment.createdAt).toLocaleString('ja-JP')}
								</small>
								<p style={{ margin: '0.5rem 0 0' }}>{comment.content}</p>
							</li>
						))}
					</ul>
				)}
				<form
					style={{
						marginTop: '2rem',
						display: 'flex',
						flexDirection: 'column',
						gap: '0.75rem',
					}}
					onSubmit={handleCommentSubmit}
				>
					<h4>コメントを投稿する</h4>
					<input
						type='text'
						placeholder='お名前'
						value={authorName}
						onChange={(e) => setAuthorName(e.target.value)}
						required
						style={{ padding: '0.5rem' }}
					/>
					<textarea
						rows='4'
						placeholder='コメントを入力...'
						value={content}
						onChange={(e) => setContent(e.target.value)}
						required
						style={{ padding: '0.5rem' }}
					></textarea>
					<button
						type='submit'
						disabled={submitting}
						style={{
							padding: '0.6rem 1.2rem',
							cursor: 'pointer',
							alignSelf: 'flex-start',
						}}
					>{submitting ? "送信中...": "送信する"}</button>
				</form>
			</section>
		</div>
	);
};
export default PostDetail;
