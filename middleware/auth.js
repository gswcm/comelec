export default function({ store, error }) {
	if (!store.state.isLoggedIn) {
		error({
			message: "Access denied",
			statusCode: 403
		});
	}
}
