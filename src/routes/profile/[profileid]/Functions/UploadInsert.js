import client from '../../../../apollo.js';
import { gql } from '@apollo/client';

import { notifications } from '../../../notifications.js';

async function insertQuestionsFromUpload(insertQuestions, netLvl) {
	try {
		const myres = client.mutate({
			Method: 'POST',
			mutation: gql`
				mutation insert${netLvl}Questions($questions: [net_${netLvl}_net_questions_insert_input!]!) {
					insert_net_${netLvl}_net_questions(objects: $questions, on_conflict: {constraint: net_questions_pkey}) {
						returning {
							questionid
							question
						}
					}
				}
			`,
			variables: {
				questions: insertQuestions
			}
		});

		notifications.success('Questions inserted!', 3000);

		return (await myres).data[`insert_net_${netLvl}_net_questions`].returning;
	} catch (err) {
		notifications.danger('Error inserting questions, check logs!', 5000);
		console.log(err);
	}
}

async function insertAnswersFromUpload(insertAnswers, netLvl) {
	try {
		const myres = client.mutate({
			Method: 'POST',
			mutation: gql`
				mutation insert${netLvl}Answers($answers: [net_${netLvl}_net_answers_insert_input!]!) {
					insert_net_${netLvl}_net_answers(objects: $answers, on_conflict: {constraint: net_answers_pkey}) {
						returning {
							questionid
							answer
						}
					}
				}
			`,
			variables: {
				answers: insertAnswers,
				questionid: insertAnswers
			}
		});

		notifications.success('Answers inserted!', 3000);

		return (await myres).data[`insert_net_${netLvl}_net_answers`].returning;
	} catch (err) {
		notifications.danger('Error inserting answers, check logs!', 5000);
		console.log(err);
	}
}

async function insertCorrectAnswersFromUpload(insertCorrectAnswers, netLvl) {
	try {
		const myres = client.mutate({
			Method: 'POST',
			mutation: gql`
				mutation insert${netLvl}CorrectAnswers($correctAnswers: [net_${netLvl}_net_correct_answers_insert_input!]!) {
					insert_net_${netLvl}_net_correct_answers(objects: $correctAnswers, on_conflict: {constraint: net_correct_answers_pkey}) {
						returning {
							questionid
							correctanswer
						}
					}
				}
			`,
			variables: {
				correctAnswers: insertCorrectAnswers,
				questionid: insertCorrectAnswers
			}
		});

		notifications.success('Correct answers inserted!', 3000);

		return (await myres).data[`insert_net_${netLvl}_net_correct_answers`].returning;
	} catch (err) {
		notifications.danger('Error inserting correct answers, check logs!', 5000);
		console.log(err);
	}
}

async function insertIncorrectAnswersFromUpload(insertIncorrectAnswers, netLvl) {
	try {
		const myres = client.mutate({
			Method: 'POST',
			mutation: gql`
				mutation insert${netLvl}IncorrectAnswers($incorrectAnswers: [net_${netLvl}_net_incorrect_answers_insert_input!]!) {
					insert_net_${netLvl}_net_incorrect_answers(objects: $incorrectAnswers, on_conflict: {constraint: net_incorrect_answers_pkey}) {
						returning {
							questionid
							incorrectanswer
						}
					}
				}
			`,
			variables: {
				incorrectAnswers: insertIncorrectAnswers,
				questionid: insertIncorrectAnswers
			}
		});

		notifications.success('Incorrect answers inserted!', 3000);

		return (await myres).data[`insert_net_${netLvl}_net_incorrect_answers`].returning;
	} catch (err) {
		notifications.danger('Error inserting incorrect answers, check logs!', 5000);
		console.log(err);
	}
}

export {
	insertQuestionsFromUpload,
	insertAnswersFromUpload,
	insertCorrectAnswersFromUpload,
	insertIncorrectAnswersFromUpload
};
