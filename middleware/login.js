export default function({ store, error, redirect }) {
	if (store.state.authenticated) {
		redirect('/admin');
	}
}
