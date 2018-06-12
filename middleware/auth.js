export default function({ store, error }) {
	if (!store.state.authenticated) {
		error({
			message: "Access denied",
			statusCode: 403
		});
	}
}
