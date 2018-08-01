import moment from 'moment';
export default function({ redirect }) {
	const month = moment().format('M');
	if (month >= 9 || month < 6) {
		redirect('/summary');
	}
}
