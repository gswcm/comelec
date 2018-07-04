import moment from 'moment';
export default function({ redirect }) {
	if (moment().format('M') >= 8) {
		redirect('/summary');
	}
}
