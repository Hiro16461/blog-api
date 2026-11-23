import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import PostDetail from '../pages/PostDetail';

function App() {
	return (
		<BrowserRouter>
			<header style={{ borderBottom: '1px solid #ccc', padding: '1rem' }}>
				<Link
					to='/'
					style={{
						fontSize: '1.5rem',
						fontWeight: 'bold',
						textDecoration: 'none',
					}}
				>
					My Tech Blog
				</Link>
      </header>
      <main style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/posts/:postId' element={<PostDetail />} />
        </Routes>
      </main>
		</BrowserRouter>
	);
}

export default App;
