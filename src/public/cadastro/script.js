const form = document.getElementById('registerForm');

form.addEventListener('submit', async (event) => {
	event.preventDefault();

	const formData = {
		name: document.getElementById('name').value,
		username: document.getElementById('username').value,
		email: document.getElementById('email').value,
		password: document.getElementById('password').value,
	};

	try {
		const response = await fetch('/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		});

		const data = await response.json();

		if (response.ok) {
			alert('Cadastro realizado com sucesso!');
			window.location.href = '/login';
		} else {
			alert(data.message || 'Erro ao cadastrar');
		}
	} catch (error) {
		alert('Erro de conexão com o servidor');
	}
});
