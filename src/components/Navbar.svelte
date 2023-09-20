<script>
	const netImg = './networking.svg';

	let activeLvl = 0;

	let activePage = '';

	function clearActives() {
		activeLvl = 0;
		activePage = '';
	}
</script>

<div class="navbar">
	<div class="top-nav">
		<a href="/" on:click={() => clearActives()} class="logo nav-item"
			><img src={netImg} alt="" class="net-img" /> Nettie</a
		>
		<nav>
			<ul>
				<li>
					<a
						href="/1"
						on:click={() => ((activeLvl = 1), (activePage = ''))}
						class={activeLvl === 1 ? 'net-lvl active' : 'net-lvl'}>I</a
					>
				</li>
				<li>
					<a
						href="/2"
						on:click={() => ((activeLvl = 2), (activePage = ''))}
						class={activeLvl === 2 ? 'net-lvl active' : 'net-lvl'}>II</a
					>
				</li>
				<li>
					<a
						href="/3"
						on:click={() => ((activeLvl = 3), (activePage = ''))}
						class={activeLvl === 3 ? 'net-lvl active' : 'net-lvl'}>III</a
					>
				</li>
				<li>
					<a
						href="/4"
						on:click={() => ((activeLvl = 4), (activePage = ''))}
						class={activeLvl === 4 ? 'net-lvl active' : 'net-lvl'}>IV</a
					>
				</li>
			</ul>
		</nav>
		<a href="/profile" on:click={() => clearActives()} class="profile nav-item">Profile</a>
	</div>
	<ul class={activeLvl === 0 ? 'hide' : 'current'}>
		<li>
			<a
				href="/{activeLvl}/flashcards"
				on:click={() => (activePage = 'flashcards')}
				class={activePage === 'flashcards' ? 'active' : ''}>Flashcards</a
			>
		</li>
		<li>
			<a
				href="/{activeLvl}/games"
				on:click={() => (activePage = 'games')}
				class={activePage === 'games' ? 'active' : ''}>Games</a
			>
		</li>
		<li>
			<a
				href="/{activeLvl}/quizzes"
				on:click={() => (activePage = 'quizzes')}
				class={activePage === 'quizzes' ? 'active' : ''}>Quizzes</a
			>
		</li>
	</ul>
</div>

<style>
	.navbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: column;
		background-color: var(--darkest-blue);
		opacity: 0.98;
		color: #fff;
		font-size: 1.5rem;
		font-weight: bold;
		padding: 0 1rem;
	}

	.top-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 1rem;
	}

	a,
	ul,
	li {
		color: #fff;
		text-decoration: none;
		list-style: none;
	}

	.navbar a:hover {
		color: var(--yellow);
		border-bottom: 2px solid var(--yellow);
	}

	.navbar nav ul {
		display: flex;
	}

	ul {
		padding: 0rem;
	}

	.net-img {
		width: 2rem;
		height: 2rem;
	}

	.net-lvl {
		font-size: 1.5rem;
		font-weight: bold;
		padding: 1rem;
	}

	.current {
		display: flex;
		gap: 1rem;
	}

	.hide {
		display: none;
	}

	.active {
		color: var(--yellow);
		border-bottom: 2px solid var(--yellow);
	}
</style>
