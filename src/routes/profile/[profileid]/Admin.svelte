<script>
	import { onMount } from 'svelte';
	import { gql } from '@apollo/client/core';
	import client from '../../../apollo.js';

	import { downloadCSV, downloadExcel, downloadJSON } from './Functions/DownloadOptions.js';
	import { uploadCSV, uploadExcel, uploadJSON } from './Functions/UploadOptions.js';

	import { notifications } from '../../notifications.js';
	import Toast from '../../Toast.svelte';

	import Icon from 'svelte-icons-pack/Icon.svelte';
	import RiSystemArrowDropDownLine from 'svelte-icons-pack/ri/RiSystemArrowDropDownLine';
	import AiOutlineDelete from 'svelte-icons-pack/ai/AiOutlineDelete';
	import AiOutlinePlus from 'svelte-icons-pack/ai/AiOutlinePlus';

	let activeNetLvl = 1,
		activeFilter = {},
		activeSort = 'question',
		activeSortDir = 'asc',
		queryQuestions = [];

	// Call the query anytime one of these variables change
	$: activeNetLvl,
		activeFilter,
		activeSort,
		activeSortDir,
		getQuestions(activeNetLvl, activeFilter, activeSort, activeSortDir);

	async function getQuestions(netLvl, filter, sort, sortDir) {
		try {
			let wrapperClause = '',
				orderByClause = [],
				whereClause = [];

			if (sort == 'question') {
				if (sortDir == 'asc') {
					orderByClause.push('{ question: asc_nulls_last }');
				} else {
					orderByClause.push('{ question: desc_nulls_last }');
				}
			} else if (sort == 'correct') {
				if (sortDir == 'asc') {
					orderByClause.push('{ net_correct_answers_aggregate: { count: asc }}');
					orderByClause.push('{ net_incorrect_answers_aggregate: { count: asc }}');
				} else {
					orderByClause.push('{ net_correct_answers_aggregate: { count: desc }}');
					orderByClause.push('{ net_incorrect_answers_aggregate: { count: desc }}');
				}
			} else if (sort == 'incorrect') {
				if (sortDir == 'asc') {
					orderByClause.push('{ net_incorrect_answers_aggregate: { count: asc }}');
					orderByClause.push('{ net_correct_answers_aggregate: { count: asc }}');
				} else {
					orderByClause.push('{ net_incorrect_answers_aggregate: { count: desc }}');
					orderByClause.push('{ net_correct_answers_aggregate: { count: desc }}');
				}
			} else if (sort == 'images') {
				if (sortDir == 'asc') {
					orderByClause.push('{ net_images_aggregate: { count: asc }}');
				} else {
					orderByClause.push('{ net_images_aggregate: { count: desc }}');
				}
			}

			!!orderByClause
				? (orderByClause = `order_by: [${orderByClause.join(',')}]`)
				: (orderByClause = null);

			if (!!filter.question) {
				whereClause.push(`question: {_ilike: "%${filter.question}%"}`);
			}
			if (!!filter.correct) {
				whereClause.push(`net_answers_aggregate: {count: {predicate: {_eq: ${filter.correct}}}}`);
			}
			if (!!filter.incorrect) {
				whereClause.push(
					`net_incorrect_answers_aggregate: {count: {predicate: {_eq: ${filter.incorrect}}}}`
				);
			}
			if (!!filter.images) {
				whereClause.push(`net_images_aggregate: {count: {predicate: {_eq: ${filter.correct}}}}`);
			}

			!!whereClause ? (whereClause = `where: {${whereClause.join(',')}}`) : (whereClause = null);

			!!orderByClause && !!whereClause
				? (wrapperClause = `(${orderByClause}, ${whereClause})`)
				: !!orderByClause
				? (wrapperClause = `(${orderByClause})`)
				: !!whereClause
				? (wrapperClause = `(${whereClause})`)
				: (wrapperClause = '');

			const myres = client.query({
				Method: 'POST',
				query: gql`
						query getNet${netLvl}Questions {
							net_${netLvl}_net_questions${wrapperClause}
							{
								question
								questionid
								net_answers {
									answer
									answerid
								}
								net_correct_answers {
									correctanswer
									correctanswerid
								}
								net_incorrect_answers {
									incorrectanswer
									incorrectanswerid
								}
							}
						}
					`
			});

			queryQuestions = (await myres).data[`net_${netLvl}_net_questions`];
		} catch (err) {
			notifications.danger('Error getting questions, check logs!', 5000);
			console.log(err);
		}
	}

	async function addQuestion() {
		try {
			const myres = client.mutate({
				Method: 'POST',
				mutation: gql`
				mutation add${activeNetLvl}Question {
					insert_net_${activeNetLvl}_net_questions(objects: { question: "" }) {
						affected_rows
					}
				}
			`
			});

			myres
				.then(() => {
					notifications.success('Question added successfully', 3000);
					getQuestions(activeNetLvl, activeFilter, activeSort, activeSortDir);
				})
				.catch((err) => {
					notifications.danger('Error adding question, check logs!', 5000);
					console.log(err);
				});
		} catch (err) {
			notifications.danger('Error adding question, check logs!', 5000);
			console.log(err);
		}
	}

	async function deleteQuestion(question) {
		try {
			const deleteAnswers = `delete_net_${activeNetLvl}_net_answers(where: { questionid: { _eq: "${question.questionid}" } })`;
			const deleteIncorrectAnswers = `delete_net_${activeNetLvl}_net_incorrect_answers(where: { questionid: { _eq: "${question.questionid}" } })`;
			const deleteCorrectAnswers = `delete_net_${activeNetLvl}_net_correct_answers(where: { questionid: { _eq: "${question.questionid}" } })`;

			const myres = client.mutate({
				Method: 'POST',
				mutation: gql`
				mutation delete${activeNetLvl}Question($questionid: uuid!) {
					${question.net_answers.length > 0 ? deleteAnswers : ''}
					${question.net_incorrect_answers.length > 0 ? deleteIncorrectAnswers : ''}
					${question.net_correct_answers.length > 0 ? deleteCorrectAnswers : ''}
					delete_net_${activeNetLvl}_net_questions(where: { questionid: { _eq: $questionid } }) {
						affected_rows
					}
				}
			`,
				variables: {
					questionid: question.questionid
				}
			});

			myres
				.then(() => {
					notifications.success('Question deleted successfully', 3000);
					getQuestions(activeNetLvl, activeFilter, activeSort, activeSortDir);
				})
				.catch((err) => {
					notifications.danger('Error deleting question, check logs!', 5000);
					console.log(err);
				});
		} catch (err) {
			notifications.danger('Error deleting question, check logs!', 5000);
			console.log(err);
		}
	}

	async function saveQuestionChanges(input) {
		try {
			const myres = client.mutate({
				Method: 'POST',
				mutation: gql`
				mutation update${activeNetLvl}Question($questionid: uuid!, $question: String!) {
					update_net_${activeNetLvl}_net_questions(
						where: { questionid: { _eq: $questionid } }
						_set: { question: $question }
					) {
						affected_rows
					}
				}
			`,
				variables: {
					questionid: input.questionid,
					question: input.question
				}
			});

			myres
				.then(() => {
					notifications.success('Question updated successfully', 3000);
				})
				.catch((err) => {
					notifications.danger('Error updating question, check logs!', 5000);
					console.log(err);
				});
		} catch (err) {
			notifications.danger('Error updating question, check logs!', 5000);
			console.log(err);
		}
	}

	onMount(async () => {
		await getQuestions(activeNetLvl, activeFilter, activeSort, activeSortDir);
	});
</script>

<Toast />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="download-container">
	<div class="download-btn" on:click={() => downloadExcel(activeNetLvl, activeFilter)}>
		Download Excel
	</div>
	<div class="download-btn" on:click={() => downloadCSV(activeNetLvl, activeFilter)}>
		Download CSV
	</div>

	<div class="download-btn" on:click={() => downloadJSON(activeNetLvl, activeFilter)}>
		Download JSON
	</div>
</div>

<div class="upload-conatiner">
	<div class="upload-btn">
		Upload Excel
		<input
			type="file"
			id="file"
			accept=".xlsx, .xls"
			on:change={(e) => {
				uploadExcel(e.target.files[0]).then(() => {
					getQuestions(activeNetLvl, activeFilter, activeSort, activeSortDir);
				});
			}}
		/>
	</div>
	<div class="upload-btn">
		Upload CSV
		<input
			type="file"
			id="file"
			accept=".csv"
			on:change={(e) => {
				uploadCSV(e.target.value);
			}}
		/>
	</div>
	<div class="upload-btn">
		Upload JSON
		<input
			type="file"
			id="file"
			accept=".json"
			on:change={(e) => {
				uploadJSON(e.target.value);
			}}
		/>
	</div>
</div>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="lvl-dropdown">
	<div class="lvl-dropdown-btn">Select Net Lvl</div>
	<div class="lvl-dropdown-content">
		<div
			on:click={() => {
				activeNetLvl = 1;
			}}
			class="lvl-dropdown-item"
		>
			Net 1
		</div>
		<div
			on:click={() => {
				activeNetLvl = 2;
			}}
			class="lvl-dropdown-item"
		>
			Net 2
		</div>
		<div
			on:click={() => {
				activeNetLvl = 3;
			}}
			class="lvl-dropdown-item"
		>
			Net 3
		</div>
		<div
			on:click={() => {
				activeNetLvl = 4;
			}}
			class="lvl-dropdown-item"
		>
			Net 4
		</div>
	</div>
</div>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="filter-container">
	<div class="filter-selection">Select Filters</div>
	<div class="filter-item">
		Question Is Like
		<input
			type="text"
			class="filter-input"
			on:change={(value) => {
				activeFilter.question = value.target.value;
			}}
		/>
	</div>
	<div class="filter-it">
		Num Correct Is
		<input
			type="text"
			class="filter-input"
			on:change={(value) => {
				activeFilter.correct = value.target.value;
			}}
		/>
	</div>
	<div class="filter-item">
		Num Incorrect Is
		<input
			type="text"
			class="filter-input"
			on:change={(value) => {
				activeFilter.incorrect = value.target.value;
			}}
		/>
		<div class="filter-item">
			Num Images Is
			<input
				type="text"
				class="filter-input"
				on:change={(value) => {
					activeFilter.images = value.target.value;
				}}
			/>
		</div>
	</div>
</div>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="table-container">
	<div class="table">
		<div class="table-head">
			<div class="table-head-row">
				<div id="expand-header" class="table-head-item expand-column">Expand</div>
				<div id="question-header" class="table-head-item question-column">
					Question
					<div
						id="question-sort"
						class={'table-sort' + (activeSort == 'question' ? ' active-sort' : '')}
					>
						<div
							on:click={() => {
								activeSort = 'question';
								activeSortDir = 'asc';
							}}
							class={'sort-asc' +
								(activeSortDir == 'asc' && activeSort == 'question' ? ' active-sort-dir' : '')}
						>
							<Icon
								src={RiSystemArrowDropDownLine}
								color={activeSortDir == 'asc' && activeSort == 'question' ? 'red' : 'black'}
							/>
						</div>
						<div
							on:click={() => {
								activeSort = 'question';
								activeSortDir = 'desc';
							}}
							class={'sort-desc' +
								(activeSortDir == 'desc' && activeSort == 'question' ? ' active-sort-dir' : '')}
						>
							<Icon
								src={RiSystemArrowDropDownLine}
								color={activeSortDir == 'desc' && activeSort == 'question' ? 'red' : 'black'}
							/>
						</div>
					</div>
				</div>
				<div id="correct-header" class="table-head-item correct-column">
					Num Correct
					<div
						id="correct-sort"
						class={'table-sort' + (activeSort == 'correct' ? ' active-sort' : '')}
					>
						<div
							on:click={() => {
								activeSort = 'correct';
								activeSortDir = 'asc';
							}}
							class={'sort-asc' +
								(activeSortDir == 'asc' && activeSort == 'correct' ? ' active-sort-dir' : '')}
						>
							<Icon
								src={RiSystemArrowDropDownLine}
								color={activeSortDir == 'asc' && activeSort == 'correct' ? 'red' : 'black'}
							/>
						</div>
						<div
							on:click={() => {
								activeSort = 'correct';
								activeSortDir = 'desc';
							}}
							class={'sort-desc' +
								(activeSortDir == 'desc' && activeSort == 'correct' ? ' active-sort-dir' : '')}
						>
							<Icon
								src={RiSystemArrowDropDownLine}
								color={activeSortDir == 'desc' && activeSort == 'correct' ? 'red' : 'black'}
							/>
						</div>
					</div>
				</div>
				<div id="incorrect-header" class="table-head-item incorrect-column">
					Num Incorrect
					<div
						id="incorrect-sort"
						class={'table-sort' + (activeSort == 'incorrect' ? ' active-sort' : '')}
					>
						<div
							on:click={() => {
								activeSort = 'incorrect';
								activeSortDir = 'asc';
							}}
							class={'sort-asc' +
								(activeSortDir == 'asc' && activeSort == 'incorrect' ? ' active-sort-dir' : '')}
						>
							<Icon
								src={RiSystemArrowDropDownLine}
								color={activeSortDir == 'asc' && activeSort == 'incorrect' ? 'red' : 'black'}
							/>
						</div>
						<div
							on:click={() => {
								activeSort = 'incorrect';
								activeSortDir = 'desc';
							}}
							class={'sort-desc' +
								(activeSortDir == 'desc' && activeSort == 'incorrect' ? ' active-sort-dir' : '')}
						>
							<Icon
								src={RiSystemArrowDropDownLine}
								color={activeSortDir == 'desc' && activeSort == 'incorrect' ? 'red' : 'black'}
							/>
						</div>
					</div>
				</div>
				<div id="images-header" class="table-head-item images-column">
					Num Images
					<div
						id="images-sort"
						class={'table-sort' + (activeSort == 'images' ? ' active-sort' : '')}
					>
						<div
							on:click={() => {
								activeSort = 'images';
								activeSortDir = 'asc';
							}}
							class={'sort-asc' +
								(activeSortDir == 'asc' && activeSort == 'images' ? ' active-sort-dir' : '')}
						>
							<Icon
								src={RiSystemArrowDropDownLine}
								color={activeSortDir == 'asc' && activeSort == 'images' ? 'red' : 'black'}
							/>
						</div>
						<div
							on:click={() => {
								activeSort = 'images';
								activeSortDir = 'desc';
							}}
							class={'sort-desc' +
								(activeSortDir == 'desc' && activeSort == 'images' ? ' active-sort-dir' : '')}
						>
							<Icon
								src={RiSystemArrowDropDownLine}
								color={activeSortDir == 'desc' && activeSort == 'images' ? 'red' : 'black'}
							/>
						</div>
					</div>
				</div>
				<div id="delete-header" class="table-head-item delete-column">Delete</div>
			</div>
		</div>
		<div class="table-body">
			{#each queryQuestions as question}
				<div class="table-row">
					<div class="table-item expand-column" />
					<textarea
						class="table-item question-column"
						value={question.question}
						on:change={(e) => {
							saveQuestionChanges({ question: e.target.value, questionid: question.questionid });
						}}
					/>
					<div class="table-item correct-column">{question.net_correct_answers.length}</div>
					<div class="table-item incorrect-column">{question.net_incorrect_answers.length}</div>
					<div class="table-item images-column">10</div>
					<div class="table-item delete-column">
						<div class="delete-button" on:click={deleteQuestion(question)}>
							<Icon src={AiOutlineDelete} />
						</div>
					</div>
				</div>
			{/each}
			<div class="add-table-row" on:click={addQuestion()}>
				<Icon src={AiOutlinePlus} />
			</div>
		</div>
	</div>
</div>

<style>
	textarea {
		all: unset;
	}

	.download-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1rem;
	}

	.download-btn {
		background-color: #000;
		border: 1px solid #fff;
		border-radius: 10%;
		padding: 0.5rem;
		cursor: pointer;
	}

	.table-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		color: #000;
		padding: 4rem;
	}

	.table {
		display: flex;
		flex-direction: column;
		width: 100%;
		background-color: #fff;
		border: 2px solid #000;
	}

	.table-head {
		width: 100%;
		font-size: 1.5rem;
	}

	.table-head-row {
		display: flex;
		align-items: center;
		flex-direction: row;
		width: 100%;
	}

	.table-head-item {
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: space-evenly;
		border-left: 1px solid #000;
	}

	.table-sort {
		display: flex;
		flex-direction: column;
		justify-content: center;
		font-size: 2rem;
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.active-sort {
		background-color: #00000048;
		border-radius: 50%;
	}

	.sort-asc {
		transform: rotateX(180deg);
	}

	.sort-asc:hover {
		cursor: pointer;
	}

	.sort-desc:hover {
		cursor: pointer;
	}

	.table-body {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.table-row {
		display: flex;
		flex-direction: row;
		height: 7rem;
		border-top: 1px solid #000;
	}

	.table-item {
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: center;
		font-size: 1.5rem;
		border-left: 1px solid #000;
		padding: 0.5rem;
	}

	.expand-column {
		border-left: 0px;
		width: 10%;
	}

	.question-column {
		border-right: 0px;
		width: 45%;
	}

	.correct-column {
		border-right: 0px;
		width: 15%;
	}

	.incorrect-column {
		border-right: 0px;
		width: 15%;
	}

	.images-column {
		border-right: 0px;
		width: 15%;
	}

	.delete-column {
		border-right: 0px;
		width: 10%;
	}
	.add-table-row {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		border-top: 2px solid #000;
		font-size: 3rem;
		padding: 2rem;
	}
</style>
