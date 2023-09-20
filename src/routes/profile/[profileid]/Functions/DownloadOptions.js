import * as XLSX from 'xlsx';

import { getQuestionsForDownload, cleanUpQuestionsForDownload } from './DownloadHelpers';

import { notifications } from '../../../notifications.js';

async function downloadExcel(netLvl, filter) {
	try {
		const questions = await getQuestionsForDownload(netLvl, filter);

		const wb = XLSX.utils.book_new();

		console.log(questions);

		const ws = XLSX.utils.json_to_sheet(cleanUpQuestionsForDownload(questions));

		XLSX.utils.book_append_sheet(wb, ws, 'Questions');

		XLSX.writeFile(wb, `net_${netLvl}_questions.xlsx`);

		notifications.success('Check your downloads!', 3000);
	} catch (err) {
		notifications.danger('Error downloading questions, check logs!', 5000);
		console.log(err);
	}
}

async function downloadCSV(netLvl, filter) {
	try {
		const questions = await getQuestionsForDownload(netLvl, filter);

		const ws = XLSX.utils.json_to_sheet(cleanUpQuestionsForDownload(questions));

		const csv = XLSX.utils.sheet_to_csv(ws);

		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

		const url = URL.createObjectURL(blob);

		const link = document.createElement('a');

		link.setAttribute('href', url);

		link.setAttribute('download', `net_${netLvl}_questions.csv`);

		link.style.visibility = 'hidden';

		document.body.appendChild(link);

		link.click();

		document.body.removeChild(link);

		notifications.success('Check your downloads!', 3000);
	} catch (err) {
		notifications.danger('Error downloading questions, check logs!', 5000);
		console.log(err);
	}
}

async function downloadJSON(netLvl, filter) {
	try {
		const questions = await getQuestionsForDownload(netLvl, filter);

		const blob = new Blob([JSON.stringify(cleanUpQuestionsForDownload(questions))], {
			type: 'text/json;charset=utf-8;'
		});

		const url = URL.createObjectURL(blob);

		const link = document.createElement('a');

		link.setAttribute('href', url);

		link.setAttribute('download', `net_${netLvl}_questions.json`);

		link.style.visibility = 'hidden';

		document.body.appendChild(link);

		link.click();

		document.body.removeChild(link);

		notifications.success('Check your downloads!', 3000);
	} catch (err) {
		notifications.danger('Error downloading questions, check logs!', 5000);
		console.log(err);
	}
}

export { downloadExcel, downloadCSV, downloadJSON };
