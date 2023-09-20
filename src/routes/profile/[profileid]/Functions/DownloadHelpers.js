import { gql } from '@apollo/client';
import client from '../../../../apollo.js';

import { notifications } from '../../../notifications.js';

/* eslint-disable no-extra-boolean-cast */

async function getQuestionsForDownload(netLvl, filter) {
	try {
		let wrapperClause = '',
			whereClause = [];

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

		!!whereClause ? (wrapperClause = `(${whereClause})`) : (wrapperClause = '');

		const myres = client.query({
			Method: 'POST',
			query: gql`
				query getNet${netLvl}QuestionsForDownload {
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

		return (await myres).data[`net_${netLvl}_net_questions`];
	} catch (err) {
		notifications.danger('Error getting questions, check logs!', 5000);
		console.log(err);
	}
}

function cleanUpQuestionsForDownload(rawQuestions) {
	let questions = [],
		correctanswers = {},
		incorrectAnswers = {};

	rawQuestions.forEach((question) => {
		question.net_correct_answers.map((answer, answerIterable) => {
			correctanswers[`correct answerid ${answerIterable}`] = answer.correctanswerid;
			correctanswers[`correct answer ${answerIterable}`] = answer.correctanswer;
		});

		question.net_incorrect_answers.map((incorrectanswer, incorrectAnswerIterable) => {
			incorrectAnswers[`incorrect answerid ${incorrectAnswerIterable}`] =
				incorrectanswer.incorrectanswerid;
			incorrectAnswers[`incorrect answer ${incorrectAnswerIterable}`] =
				incorrectanswer.incorrectanswer;
		});

		questions.push({
			questionid: question.questionid,
			question: question.question,
			...correctanswers,
			...incorrectAnswers
		});

		correctanswers = {};
		incorrectAnswers = {};
	});

	return questions;
}

export { getQuestionsForDownload, cleanUpQuestionsForDownload };
