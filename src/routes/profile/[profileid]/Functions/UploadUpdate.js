import client from '../../../../apollo.js';
import { gql } from '@apollo/client';

import { notifications } from '../../../notifications.js';

async function updateQuestionsFromUpload(updateQuestions, netLvl) {
	try {
		console.log('updateQuestions: ', updateQuestions);

		const myres = client.mutate({
			Method: 'POST',
			mutation: gql`
				mutation update${netLvl}Questions($questions: [net_${netLvl}_net_questions_set_input!]!) {
					update_net_${netLvl}_net_questions(where: {questionid: {_in: [${updateQuestions.map(
				(question) => question.questionid
			)}]}}, _set: $questions) {
						returning {
							questionid
							question
						}
					}
				}
			`,
			variables: {
				questions: updateQuestions.map((question) => question.question)
			}
		});

		notifications.success('Questions updated!', 3000);

		console.log('myres: ', await myres);

		return (await myres).data[`update_net_${netLvl}_net_questions`].returning;
	} catch (err) {
		notifications.danger('Error updating questions, check logs!', 5000);
		console.log(err);
	}
}

async function updateAnswersFromUpload(updateAnswers, netLvl) {
	try {
		const myres = client.mutate({
			Method: 'POST',
			mutation: gql`
				mutation update${netLvl}Answers($answers: [net_${netLvl}_net_answers_set_input!]!) {
					update_net_${netLvl}_net_answers(where: {answerid: {_in: [${updateAnswers.map(
				(answer) => answer.answerid
			)}]}}, _set: $answers) {
						returning {
							question
							answer
						}
					}
				}
			`,
			variables: {
				answers: updateAnswers
			}
		});

		notifications.success('Answers updated!', 3000);

		return (await myres).data[`update_net_${netLvl}_net_answers`].returning;
	} catch (err) {
		notifications.danger('Error updating answers, check logs!', 5000);
		console.log(err);
	}
}

async function updateCorrectAnswersFromUpload(updateCorrectAnswers, netLvl) {
	try {
		const myres = client.mutate({
			Method: 'POST',
			mutation: gql`
				mutation update${netLvl}CorrectAnswers($correctAnswers: [net_${netLvl}_net_correct_answers_set_input!]!) {
					update_net_${netLvl}_net_correct_answers(where: {correctanswerid: {_in: [${updateCorrectAnswers.map(
				(correctAnswer) => correctAnswer.correctanswerid
			)}]}}, _set: $correctAnswers) {
						returning {
							question
							correctanswer
						}
					}
				}
			`,
			variables: {
				correctAnswers: updateCorrectAnswers
			}
		});

		notifications.success('Correct answers updated!', 3000);

		return (await myres).data[`update_net_${netLvl}_net_correct_answers`].returning;
	} catch (err) {
		notifications.danger('Error updating correct answers, check logs!', 5000);
		console.log(err);
	}
}

async function updateIncorrectAnswersFromUpload(updateIncorrectAnswers, netLvl) {
	try {
		const myres = client.mutate({
			Method: 'POST',
			mutation: gql`
				mutation update${netLvl}IncorrectAnswers($incorrectAnswers: [net_${netLvl}_net_incorrect_answers_set_input!]!) {
					update_net_${netLvl}_net_incorrect_answers(where: {incorrectanswerid: {_in: [${updateIncorrectAnswers.map(
				(incorrectAnswer) => incorrectAnswer.incorrectanswerid
			)}]}}, _set: $incorrectAnswers) {
						returning {
							question
							incorrectanswer
						}
					}
				}
			`,
			variables: {
				incorrectAnswers: updateIncorrectAnswers
			}
		});

		notifications.success('Incorrect answers updated!', 3000);

		return (await myres).data[`update_net_${netLvl}_net_incorrect_answers`].returning;
	} catch (err) {
		notifications.danger('Error updating incorrect answers, check logs!', 5000);
		console.log(err);
	}
}

export {
	updateQuestionsFromUpload,
	updateAnswersFromUpload,
	updateCorrectAnswersFromUpload,
	updateIncorrectAnswersFromUpload
};
