import client from '../../../../apollo.js';
import { gql } from '@apollo/client';

import { notifications } from '../../../notifications.js';

async function checkBeforeInsertQuestionsFromUpload(insertQuestions, netLvl) {
	try {
		const myres = client.query({
			Method: 'POST',
			query: gql`
				query check${netLvl}UploadQuestionsInsert($questions: [String!]!) {
					net_${netLvl}_net_questions(where: { question: { _in: $questions } }) {
						question
						questionid
					}
				}
			`,
			variables: {
				questions: insertQuestions.map((question) => question.question)
			}
		});

		const result = await myres;

		if (result.data[`net_${netLvl}_net_questions`].length > 0) {
			notifications.danger('Error inserting questions, check logs!', 5000);
			console.log(
				"Questions already exist, can't insert!",
				result.data[`net_${netLvl}_net_questions`]
			);
			return true;
		} else {
			return false;
		}
	} catch (err) {
		notifications.danger('Error checking insert of questions, check logs!', 5000);
		console.log(err);
	}
}

async function checkBeforeInsertAnswersFromUpload(insertAnswers, netLvl) {
	try {
		const myres = client.query({
			Method: 'POST',
			query: gql`
				query check${netLvl}UploadAnswersInsert($answers: [String!]!, $questionid: [uuid!]!) {
					net_${netLvl}_net_answers(where: {_and: [ {answer: { _in: $answers } }, {questionid: { _in: $questionid } }]}) {
						questionid
					}
				}
			`,
			variables: {
				answers: insertAnswers.map((answer) => answer.answer),
				questionid: insertAnswers.map((answer) => answer.questionid)
			}
		});

		const result = await myres;

		if (result.data[`net_${netLvl}_net_answers`].length > 0) {
			notifications.danger('Error inserting answers, check logs!', 5000);
			console.log("Answers already exist, can't insert!", result.data[`net_${netLvl}_net_answers`]);
			return true;
		} else {
			return false;
		}
	} catch (err) {
		notifications.danger('Error checking insert of answers, check logs!', 5000);
		console.log(err);
	}
}

async function checkBeforeInsertCorrectAnswersFromUpload(insertCorrectAnswers, netLvl) {
	try {
		const myres = client.query({
			Method: 'POST',
			query: gql`
				query check${netLvl}UploadCorrectAnswersInsert($correctanswers: [String!]!, $questionid: [uuid!]!) {
					net_${netLvl}_net_correct_answers(where: {_and: [ {correctanswer: { _in: $correctanswers } }, {questionid: { _in: $questionid } }]}) {
						questionid
					}
				}
			`,
			variables: {
				correctanswers: insertCorrectAnswers.map((correctanswer) => correctanswer.correctanswer),
				questionid: insertCorrectAnswers.map((correctanswer) => correctanswer.questionid)
			}
		});

		const result = await myres;

		if (result.data[`net_${netLvl}_net_correct_answers`].length > 0) {
			notifications.danger('Error inserting correct answers, check logs!', 5000);
			console.log(
				"Correct answers already exist, can't insert!",
				result.data[`net_${netLvl}_net_correct_answers`]
			);
			return true;
		} else {
			return false;
		}
	} catch (err) {
		notifications.danger('Error checking insert of correct answers, check logs!', 5000);
		console.log(err);
	}
}

async function checkBeforeInsertIncorrectAnswersFromUpload(insertIncorrectAnswers, netLvl) {
	try {
		const myres = client.query({
			Method: 'POST',
			query: gql`
				query check${netLvl}UploadIncorrectAnswersInsert($incorrectanswers: [String!]!, $questionid: [uuid!]!) {
					net_${netLvl}_net_incorrect_answers(where: {_and: [ {incorrectanswer: { _in: $incorrectanswers } }, {questionid: { _in: $questionid } }]}) {
						questionid
					}
				}
			`,
			variables: {
				incorrectanswers: insertIncorrectAnswers.map(
					(incorrectanswer) => incorrectanswer.incorrectanswer
				),
				questionid: insertIncorrectAnswers.map((incorrectanswer) => incorrectanswer.questionid)
			}
		});

		const result = await myres;

		if (result.data[`net_${netLvl}_net_incorrect_answers`].length > 0) {
			notifications.danger('Error inserting incorrect answers, check logs!', 5000);
			console.log(
				"Incorrect answers already exist, can't insert!",
				result.data[`net_${netLvl}_net_incorrect_answers`]
			);
			return true;
		} else {
			return false;
		}
	} catch (err) {
		notifications.danger('Error checking insert of incorrect answers, check logs!', 5000);
		console.log(err);
	}
}

export {
	checkBeforeInsertQuestionsFromUpload,
	checkBeforeInsertAnswersFromUpload,
	checkBeforeInsertCorrectAnswersFromUpload,
	checkBeforeInsertIncorrectAnswersFromUpload
};
