<script>
	export let question;
	export let answers;
</script>

<div class="flip-box-front">
	<div class="question">
		<h2>{question}</h2>
		{#each answers as answer}
			<h3>{!!answer.answer ? answer.answer : answer.incorrectanswer}</h3>
		{/each}
	</div>
</div>

<div class="flip-box-back">
	{#each answers as answer}
		{#if !!answer.answer}
			<h2>{answer.answer}</h2>
		{/if}
	{/each}
</div>

<style>
	/* Position the front and back side */
	.flip-box-front,
	.flip-box-back {
		position: absolute;
		width: 100%;
		height: 100%;
		-webkit-backface-visibility: hidden; /* Safari */
		backface-visibility: hidden;
		box-shadow: -1px 1px 3px black;
		background-color: var(--light);
		color: black;
	}

	/* Style the front side */
	.flip-box-front {
		display: flex;
		justify-content: center;
	}

	@keyframes revealTextSlowly {
		to {
			color: white;
		}
	}

	/* Style the back side */
	.flip-box-back {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1.3rem;
		transform: rotateY(180deg);
	}
</style>
