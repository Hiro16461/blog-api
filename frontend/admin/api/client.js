const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(endpoint, options = {}) {
	const token = localStorage.getItem('token');

	const headers = {
		'Content-Type': 'application/json',
		...options.headers,
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	const response = await fetch(`${API_URL}${endpoint}`, {
		...options,
		headers,
	});

	if (response.status === 401 && endpoint !== '/auth/login') {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		window.location.href = '/login';
		throw new Error('セッションが切れました。再ログインしてください。');
	}

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(
			errorData.error || `エラーが発生しました (${response.status})`,
		);
    }
    
    if (response.status === 204) return null;
    return response.json();
}
