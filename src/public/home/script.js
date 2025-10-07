document.addEventListener('DOMContentLoaded', () => {
	const postForm = document.getElementById('postForm');
	const content = document.getElementById('content');
	const postsContainer = document.getElementById('postsContainer');
	const paginationContainer = document.getElementById('pagination');

	const fetchPosts = async (page = 1) => {
		try {
			const response = await fetch(`/posts?page=${page}&limit=5`);
			const data = await response.json();

			// Limpa o container
			postsContainer.innerHTML = '';

			// Itera sobre cada post
			data.posts.forEach((post) => {
				// Cria o elemento principal do post
				const postElement = document.createElement('div');
				postElement.classList.add('post');

				// Cria elemento para username
				const usernameElement = document.createElement('p');
				const usernameStrong = document.createElement('strong');
				usernameStrong.textContent = `@${post.username}`;
				usernameElement.appendChild(usernameStrong);

				// Cria elemento para conteúdo
				const contentElement = document.createElement('p');
				contentElement.textContent = post.content;

				// Cria elemento para data
				const dateElement = document.createElement('small');
				dateElement.textContent = new Date(post.createdAt).toLocaleString();

				// Adiciona todos os elementos ao post
				postElement.appendChild(usernameElement);
				postElement.appendChild(contentElement);
				postElement.appendChild(dateElement);

				// Adiciona o post ao container
				postsContainer.appendChild(postElement);
			});

			renderPagination(data.totalPages, data.currentPage);
		} catch (error) {
			console.error('Error fetching posts:', error);
		}
	};

	const renderPagination = (totalPages, currentPage) => {
		paginationContainer.innerHTML = '';
		if (totalPages <= 1) return;

		for (let i = 1; i <= totalPages; i++) {
			const pageLink = document.createElement('a');
			pageLink.href = '#';
			pageLink.innerText = i;
			if (i === currentPage) {
				pageLink.style.fontWeight = 'bold';
			}
			pageLink.addEventListener('click', (e) => {
				e.preventDefault();
				fetchPosts(i);
			});
			paginationContainer.appendChild(pageLink);
		}
	};

	postForm.addEventListener('submit', async (e) => {
		e.preventDefault();

		try {
			const response = await fetch('/posts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ content: content.value }),
			});

			if (response.ok) {
				content.value = '';
				fetchPosts();
			} else {
				const data = await response.json();
				alert(data.message || 'Error creating post');
			}
		} catch (error) {
			console.error('Error creating post:', error);
		}
	});

	fetchPosts();
});
