import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../api/client';

const PostEditor = () => {
	const { postId } = useParams();
	const isEditMode = Boolean(postId);
	const navigate = useNavigate();

	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [published, setPublished] = useState(false);
	const [comments, setComments] = useState([]);

	useEffect(() => {
		if (!isEditMode) return;

		Promise.all([
			apiFetch(`/posts/${postId}`),
			apiFetch(`/posts/${postId}/comments`),
		])
			.then(([postData, commentData]) => {
				setTitle(postData.title);
				setContent(postData.content);
				setPublished(postData.published);
				setComments(commentData);
			})
			.catch((err) => alert(err.message));
	}, [postId, isEditMode]);

	const handleSave = async (e) => {
		e.preventDefault();
		try {
			if (isEditMode) {
				await apiFetch(`/posts/${postId}`, {
					method: 'PUT',
					body: JSON.stringify({ title, content, published }),
				});
			} else {
				await apiFetch('/posts', {
					method: 'POST',
					body: JSON.stringify({ title, content, published }),
				});
			}
			navigate('/');
		} catch (err) {
			alert(err.message);
		}
	};

	const handleDeleteComment = async (commentId) => {
		if (!window.confirm('このコメントを削除しますか？')) return;
		try {
			await apiFetch(`/posts/${postId}/comments/${commentId}`, {
				method: 'DELETE',
			});
			setComments((prev) => prev.filter((c) => c.id !== commentId));
		} catch (err) {
			alert(err.message);
		}
	};

	return (
		<div>
			<Link to='/'>← ダッシュボードに戻る</Link>
			<h1>{isEditMode ? '記事の編集' : '新規記事の作成'}</h1>
			<form
				onSubmit={handleSave}
				style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
			>
				<input
					type='text'
					placeholder='記事タイトル'
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
					style={{ padding: '0.5rem', fontSize: '1.1rem' }}
				/>
				<textarea
					rows='12'
					placeholder='本文を入力'
					value={content}
					onChange={(e) => setContent(e.target.value)}
					required
					style={{ padding: '0.5rem', lineHeight: '1.6' }}
				></textarea>
				<label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
					<input
						type='checkbox'
						checked={published}
						onChange={(e) => setPublished(e.target.checked)}
					/>
					すぐに公開する（チェックを外すと下書き保存）
				</label>
				<button
					type='submit'
					style={{ padding: '0.6rem 1.2rem', alignSelf: 'flex-start' }}
				>
					保存する
				</button>
			</form>

			{isEditMode && (
				<section
					style={{
						marginTop: '3rem',
						borderTop: '1px solid #ccc',
						paddingTop: '1.5rem',
					}}
				>
					<h3>この記事へのコメント管理 ({comments.length}件)</h3>
					{comments.length === 0 ? (
						<p>コメントはありません</p>
					) : (
						comments.map((comment) => (
							<div
								key={comment.id}
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									background: '#f9f9f9',
									padding: '0.75rem',
									marginBottom: '0.5rem',
									borderRadius: '4px',
								}}
							>
								<div>
									<strong>
										{comment.authorName || comment.user?.username || '匿名'}
									</strong>
									: {comment.content}
								</div>
								<button
									onClick={() => handleDeleteComment(comment.id)}
									style={{ color: 'red' }}
								>
									コメント削除
								</button>
							</div>
						))
					)}
				</section>
			)}
		</div>
	);
};
export default PostEditor;
