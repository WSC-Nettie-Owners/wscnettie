import client from '../../../apollo.js';
import { gql } from '@apollo/client/core';
import fund1 from './fundamental questions - T1.json';
import fund2 from './fundamental questions - T2.json';
import mod1 from './mod1-multiAnswer.json';
import mod1SA from './mod1-singleAnswer.json';
import mod2 from './mod2-singleAnswer.json';

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!DO NOT RUN THIS AT ALL, UNLESS HASURA DB NEEDS TO BE REPLACED!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// const questions = fund1.map((question) => {
// 	return {
// 		question: question.question,
// 		answers: question.answers,
// 		incorrectAnswers: question.incorrectAnswers
// 	};
// });

console.log(questions);

async function uploadQuestion(question) {
	const myres = client.mutate({
		mutation: gql`
			mutation MyMutation($question: String!) {
				insert_net_1_net_questions(objects: { question: $question }) {
					returning {
						questionid
					}
				}
			}
		`,
		Method: 'POST',
		variables: {
			question: question.question
		}
	});
	uploadIncorrectAnswers(
		question,
		(await myres).data.insert_net_1_net_questions.returning[0].questionid
	);
	uploadAnswers(question, (await myres).data.insert_net_1_net_questions.returning[0].questionid);
}

async function uploadAnswers(question, questionid) {
	question.answers.map((answer) => {
		console.log(answer, questionid);
		const myres = client.mutate({
			mutation: gql`
				mutation MyMutation($answer: String!, $questionid: uuid!) {
					insert_net_1_net_answers(objects: { answer: $answer, questionid: $questionid }) {
						affected_rows
					}
				}
			`,
			Method: 'POST',
			variables: {
				answer: answer,
				questionid: questionid
			}
		});
		console.log(myres);
	});
}

async function uploadIncorrectAnswers(question, questionid) {
	question.incorrectAnswers.map((incorrectanswer) => {
		console.log(incorrectanswer, questionid);
		const myres = client.mutate({
			mutation: gql`
				mutation MyMutation($incorrectanswer: String!, $questionid: uuid!) {
					insert_net_1_net_incorrect_answers(
						objects: { incorrectanswer: $incorrectanswer, questionid: $questionid }
					) {
						affected_rows
					}
				}
			`,
			Method: 'POST',
			variables: {
				incorrectanswer: incorrectanswer,
				questionid: questionid
			}
		});
		console.log(myres);
	});
}

questions.map((question) => {
	uploadQuestion(question);
});
