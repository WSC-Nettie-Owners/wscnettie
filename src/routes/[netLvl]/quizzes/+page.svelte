<script>
	import { onMount } from 'svelte';
	import { gql } from '@apollo/client/core';
	import client from '../../../apollo.js';
	import { page } from '$app/stores';

	const netLvl = $page.params.netLvl;

	let questions = [],
		answers = [],
		numCorrect = 0,
		percentCorrect = 0,
		checkedAnswers = [];

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
				answers: [...question.net_answers, ...question.net_incorrect_answers],
				correctAnswers: question.net_answers,
				incorrectAnswers: question.net_incorrect_answers
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

	function getAnswers() {
		const answerInputs = document.querySelectorAll('input[type="radio"]:checked');
		answerInputs.forEach((input) => {
			answers.push(input.value);
		});
	}

	function submitAnswers(e) {
		e.preventDefault();
		answers = [];
		numCorrect = 0;
		percentCorrect = 0;
		getAnswers();
		checkAnswers();
	}

	function checkAnswers() {
		checkedAnswers = questions.map((question, iterable) => {
			return question.answers.map((answer) => {
				if (answer.answerid == answers[iterable]) {
					numCorrect++;
					return true;
				} else {
					return false;
				}
			});
		});
		console.log(checkedAnswers, numCorrect);
		percentCorrect = (numCorrect / questions.length) * 100;
		console.log(parseInt(percentCorrect) + '%');
	}
</script>

<div class="questions-container">
	{#await questions}
		<h1>Loading...</h1>
	{:then questions}
		<form on:submit={submitAnswers}>
			{#if percentCorrect > 0}
				<h1>{parseInt(percentCorrect)}%</h1>
			{/if}

			{#each questions as question}
				<div class="question">
					<h3>{question.question}</h3>

					{#each question.answers as answer}
						<div class="answer">
							<input
								type="radio"
								name={question.questionid}
								id={!!answer.answerid ? answer.answerid : answer.incorrectanswerid}
								value={!!answer.answerid ? answer.answerid : answer.incorrectanswerid}
								required
							/>
							<label for={!!answer.answerid ? answer.answerid : answer.incorrectanswerid}
								>{!!answer.answer ? answer.answer : answer.incorrectanswer}</label
							>
						</div>
					{/each}
				</div>
			{/each}
			<button>Submit</button>
		</form>
	{/await}
</div>
