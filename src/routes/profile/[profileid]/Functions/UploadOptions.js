import * as XLSX from 'xlsx';

import {
	cleanUpQuestionsForUpload,
	checkAllCaller,
	uploadAndInsertCaller
} from './UploadHelpers.js';

import { notifications } from '../../../notifications.js';

async function uploadExcel(uploadFile) {
	try {
		const data = await uploadFile.arrayBuffer();

		const wb = XLSX.read(data, { type: 'array' });

		const ws = wb.Sheets[wb.SheetNames[0]];

		const questions = XLSX.utils.sheet_to_json(ws);

		let netLvl = uploadFile.name.split('_')[1];

		netLvl = 1;

		const {
			insertQuestions,
			updateQuestions,
			insertAnswers,
			updateAnswers,
			insertCorrectAnswers,
			updateCorrectAnswers,
			insertIncorrectAnswers,
			updateIncorrectAnswers
		} = cleanUpQuestionsForUpload(questions);

		console.log(
			'newQuestions: ',
			insertQuestions,
			'updateQuestions: ',
			updateQuestions,
			'newAnswers: ',
			insertAnswers,
			'updateAnswers: ',
			updateAnswers,
			'newCorrectAnswers: ',
			insertCorrectAnswers,
			'updateCorrectAnswers: ',
			updateCorrectAnswers,
			'newIncorrectAnswers: ',
			insertIncorrectAnswers,
			'updateIncorrectAnswers: ',
			updateIncorrectAnswers
		);

		const checkResult = await checkAllCaller(
			insertQuestions,
			insertAnswers,
			insertCorrectAnswers,
			insertIncorrectAnswers,
			netLvl
		);

		if (checkResult) {
			return;
		}

		await uploadAndInsertCaller(
			insertQuestions,
			updateQuestions,
			insertAnswers,
			updateAnswers,
			insertCorrectAnswers,
			updateCorrectAnswers,
			insertIncorrectAnswers,
			updateIncorrectAnswers,
			netLvl
		);

		notifications.success('Questions uploaded!', 3000);
	} catch (err) {
		notifications.danger('Error uploading questions, contact a dev!', 5000);
		console.log(err);
	}
}

async function uploadCSV(uploadFile) {
	console.log('uploadCSV: ', uploadFile);
}

async function uploadJSON(uploadFile) {
	console.log('uploadJSON: ', uploadFile);
}

export { uploadExcel, uploadCSV, uploadJSON };
