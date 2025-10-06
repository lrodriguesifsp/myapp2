const form = document.getElementById('loginForm');

form.addEventListener('submit', async (event) => {
	event.preventDefault();

	const formData = {
		username: document.getElementById('username').value,
		password: document.getElementById('password').value,
	};

	try {
		const response = await fetch('/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
			credentials: 'include',
		});

		const data = await response.json();

		if (response.ok) {
			alert('Login realizado com sucesso!');
			window.location.href = '/home';
		} else {
			alert(data.message || 'Erro ao fazer login');
		}
	} catch (error) {
		alert('Erro de conexão com o servidor');
	}
});
