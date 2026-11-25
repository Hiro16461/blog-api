import {
	BrowserRouter,
	Routes,
	Route,
	Link,
	useNavigate,
} from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard';
import PostEditor from '../pages/PostEditor';

function Header() {
	const navigate = useNavigate();
	const token = localStorage.getItem('token');
	const user = JSON.parse(localStorage.getItem('user')) || null;

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		navigate('/login');
	};

	return (
		<header
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				padding: '1rem 2rem',
				borderBottom: '1px solid #ccc',
			}}
		>
			<Link to='/' style={{ fontWeight: 'bold', textDecoration: 'none' }}>
				Blog Admin Dashboard
			</Link>
			{token && (
				<div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
					<span>
						ログイン中： <strong>{user?.username}</strong>
					</span>
					<button onClick={handleLogout}>ログアウト</button>
				</div>
			)}
		</header>
	);
}

function App() {
	return (
		<BrowserRouter>
			<Header />
			<main
				style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}
			>
				<Routes>
					<Route path='/login' element={<LoginPage />} />
					<Route
						path='/'
						element={
							<ProtectedRoute>
								<Dashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/posts/new'
						element={
							<ProtectedRoute>
								<PostEditor />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/posts/:postId/edit'
						element={
							<ProtectedRoute>
								<PostEditor />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</main>
		</BrowserRouter>
	);
}

export default App;
