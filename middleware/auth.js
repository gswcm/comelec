export default function({ store, error, redirect }) {
	if (!store.state.authenticated) {
		redirect('/login');
		/*
		error({
			message: "Access denied",
			statusCode: 403
		});
		 */
	}
}
