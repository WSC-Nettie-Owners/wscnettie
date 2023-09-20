<script>
	import { onMount } from 'svelte';
	import { gql } from '@apollo/client/core';
	import client from '../../../apollo.js';
	import { page } from '$app/stores';
	import Flashcard from './Flashcard.svelte';

	const netLvl = $page.params.netLvl;

	let questions = [];

	async function getQuestionsCount() {
		try {
			if (netLvl == 1) {
				const myres = client.query({
					Method: 'POST',
					query: gql`
						query getNet1QuestionsCount {
							net_1_net_questions_aggregate {
								aggregate {
									count
								}
							}
						}
					`
				});

				return (await myres).data.net_1_net_questions_aggregate.aggregate.count;
			} else if (netLvl == 2) {
				const myres = client.query({
					Method: 'POST',
					query: gql`
						query getNet2QuestionsCount {
							net_2_net_questions_aggregate {
								aggregate {
									count
								}
							}
						}
					`
				});

				return (await myres).data.net_2_net_questions_aggregate.aggregate.count;
			} else if (netLvl == 3) {
				const myres = client.query({
					Method: 'POST',
					query: gql`
						query getNet3QuestionsCount {
							net_3_net_questions_aggregate {
								aggregate {
									count
								}
							}
						}
					`
				});

				return (await myres).data.net_3_net_questions_aggregate.aggregate.count;
			} else if (netLvl == 5) {
				const myres = client.query({
					Method: 'POST',
					query: gql`
						query getNet4QuestionsCount {
							net_4_net_questions_aggregate {
								aggregate {
									count
								}
							}
						}
					`
				});

				return (await myres).data.net_4_net_questions_aggregate.aggregate.count;
			}
		} catch (err) {
			console.log(err);
		}
	}

	async function getQuestions() {
		try {
			const numberOfRecordsInTable = await getQuestionsCount();
			const numberOfRecordsForFirstArg = 5;
			const skip = getRandomInt(numberOfRecordsInTable, numberOfRecordsForFirstArg);
			const limit = 5;

			if (netLvl == 1) {
				const myres = client.query({
					Method: 'POST',
					variables: {
						skip: skip,
						limit: limit
					},
					query: gql`
						query getNet1Questions($limit: Int!, $skip: Int!) {
							net_1_net_questions(limit: $limit, offset: $skip) {
								question
								questionid
								net_answers {
									answer
									answerid
								}
								net_incorrect_answers {
									incorrectanswer
									incorrectanswerid
								}
							}
						}
					`
				});

				return (await myres).data.net_1_net_questions;
			} else if (netLvl == 2) {
				const myres = client.query({
					Method: 'POST',
					variables: {
						skip: skip,
						limit: limit
					},
					query: gql`
						query getNet2Questions($limit: Int!, $skip: Int!) {
							net_2_net_questions(limit: $limit, offset: $skip) {
								question
								questionid
								net_answers {
									answer
									answerid
								}
								net_incorrect_answers {
									incorrectanswer
									incorrectanswerid
								}
							}
						}
					`
				});

				return (await myres).data.net_2_net_questions;
			} else if (netLvl == 3) {
				const myres = client.query({
					Method: 'POST',
					variables: {
						skip: skip,
						limit: limit
					},
					query: gql`
						query getNet3Questions($limit: Int!, $skip: Int!) {
							net_3_net_questions(limit: $limit, offset: $skip) {
								question
								questionid
								net_answers {
									answer
									answerid
								}
								net_incorrect_answers {
									incorrectanswer
									incorrectanswerid
								}
							}
						}
					`
				});

				return (await myres).data.net_3_net_questions;
			} else if (netLvl == 4) {
				const myres = client.query({
					Method: 'POST',
					variables: {
						skip: skip,
						limit: limit
					},
					query: gql`
						query getNet4Questions($limit: Int!, $skip: Int!) {
							net_4_net_questions(limit: $limit, offset: $skip) {
								question
								questionid
								net_answers {
									answer
									answerid
								}
								net_incorrect_answers {
									incorrectanswer
									incorrectanswerid
								}
							}
						}
					`
				});

				return (await myres).data.net_4_net_questions;
			}
		} catch (err) {
			console.log(err);
		}
	}

	onMount(async () => {
		const rawData = await getQuestions();

		questions = rawData.map((question) => {
			return {
				question: question.question,
				questionid: question.questionid,
				correctAnswers: question.net_answers,
				incorrectAnswers: question.net_incorrect_answers,
				answers: [...question.net_answers, ...question.net_incorrect_answers]
			};
		});

		shuffleArray(questions);

		questions.forEach((question) => {
			shuffleArray(question.answers);
		});
	});

	function getRandomInt(max, slice) {
		const n = Math.floor(Math.random() * Math.floor(max)) - slice;
		return n < 0 ? 0 : n;
	}

	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	let flashcardIndex = 0;

	let showCardBack = false;
	const toggleShowBack = () => (showCardBack = !showCardBack);

	let nextOrPrevBtnClicked = false;

	const prevCard = () => {
		showCardBack = false;
		nextOrPrevBtnClicked = true;
		if (flashcardIndex === 0) {
			flashcardIndex = questions.length - 1;
		} else {
			flashcardIndex -= 1;
		}
		nextOrPrevBtnClicked = false;
	};

	const nextCard = () => {
		showCardBack = false;
		nextOrPrevBtnClicked = true;
		if (flashcardIndex === questions.length - 1) {
			flashcardIndex = 0;
		} else {
			flashcardIndex += 1;
		}
		nextOrPrevBtnClicked = false;
	};
</script>

<div class="flashcard-container">
	<button
		on:click={prevCard}
		on:keydown={(event) => {
			if (event.key === 'Left') {
				prevCard();
			}
		}}>Prev</button
	>
	<div
		class="flashcard-card"
		class:flip-it={showCardBack}
		class:instant-flip={nextOrPrevBtnClicked}
		on:click={toggleShowBack}
		on:keydown={(event) => {
			if (event.key === 'Space') {
				toggleShowBack();
			}
		}}
	>
		{#if questions.length > 0}
			<Flashcard
				question={questions[flashcardIndex].question}
				answers={questions[flashcardIndex].answers}
			/>
		{/if}
	</div>
	<button
		on:click={nextCard}
		on:keydown={(event) => {
			if (event.key === 'Right') {
				nextCard();
			}
		}}>Next</button
	>
</div>

<style>
	.flashcard-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 80vh;
		width: 80vw;
		perspective: 1000px; /* Remove this if you don't want the 3D effect */
	}

	.flashcard-card {
		position: relative;
		width: 50%;
		height: 50%;
		text-align: center;
		transform-style: preserve-3d;
		transition: transform 0.4s;
	}

	.instant-flip {
		transition: transform 0s;
	}

	/* Do an horizontal flip on button click */
	.flip-it {
		transform: rotateY(180deg);
	}
</style>
